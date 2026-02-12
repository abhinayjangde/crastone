from ..db.client import sync_mongo_client
from bson import ObjectId
from ironpdf import PdfDocument
from openai import OpenAI
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Union
import base64
import os
import glob
import json
from datetime import datetime

client = OpenAI(
    # base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("OPENAI_API_KEY")
)

# Pydantic models for structured JSON output
# Using ConfigDict with extra='forbid' to ensure additionalProperties: false in JSON schema
# Using Union[str, None] instead of Optional[str] to make field required but nullable
class Suggestion(BaseModel):
    model_config = ConfigDict(extra='forbid')
    
    category: str = Field(..., description="Category: 'formatting', 'content', 'skills', 'experience', 'education', 'design', or 'general'")
    priority: str = Field(..., description="Priority level: 'high', 'medium', or 'low'")
    issue: str = Field(..., description="What's wrong or could be improved")
    recommendation: str = Field(..., description="Specific actionable recommendation to fix the issue")
    example: Union[str, None] = Field(..., description="Example of how to implement the suggestion, or null if not applicable")

class ResumeScore(BaseModel):
    model_config = ConfigDict(extra='forbid')
    
    overall: int = Field(..., ge=0, le=100, description="Overall resume score out of 100")
    formatting: int = Field(..., ge=0, le=100, description="Formatting and design score")
    content: int = Field(..., ge=0, le=100, description="Content quality score")
    impact: int = Field(..., ge=0, le=100, description="Impact and achievements score")
    ats_friendly: int = Field(..., ge=0, le=100, description="ATS compatibility score")

class RoastSection(BaseModel):
    model_config = ConfigDict(extra='forbid')
    
    title: str = Field(..., description="Section title")
    roast: str = Field(..., description="The roast content for this section")
    severity: str = Field(..., description="How bad is it: 'mild', 'medium', 'spicy', or 'extra_crispy'")

class ResumeRoastOutput(BaseModel):
    model_config = ConfigDict(extra='forbid')
    
    headline: str = Field(..., description="A catchy, funny one-liner summary of the resume")
    opening_roast: str = Field(..., description="The opening punch - a hilarious first impression")
    roast_sections: List[RoastSection] = Field(..., description="Detailed roast broken into sections")
    hidden_gems: List[str] = Field(..., description="Things that are actually good about the resume")
    suggestions: List[Suggestion] = Field(..., description="Actionable suggestions for improvement")
    scores: ResumeScore = Field(..., description="Resume scores across different categories")
    final_verdict: str = Field(..., description="A closing funny but encouraging message")
    tldr: str = Field(..., description="Too Long; Didn't Read - quick summary in 2-3 sentences")


def get_openai_compatible_schema(model: type[BaseModel]) -> dict:
    """
    Generate a JSON schema compatible with OpenAI's strict mode.
    Removes 'description' from properties that use '$ref' since OpenAI doesn't allow it.
    """
    schema = model.model_json_schema()
    
    def clean_schema(obj):
        if isinstance(obj, dict):
            # If this object has $ref, remove description
            if '$ref' in obj and 'description' in obj:
                del obj['description']
            # Recursively clean nested objects
            for key, value in obj.items():
                clean_schema(value)
        elif isinstance(obj, list):
            for item in obj:
                clean_schema(item)
    
    clean_schema(schema)
    return schema


# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
    
def process_file(file_id: str, file_path: str):
    db = sync_mongo_client[os.getenv("DATABASE_NAME")]
    files_collection = db["files"]
    
    files_collection.update_one({"_id": ObjectId(file_id)}, {"$set": {"status": "processing"}})

    # PDF to Image 
    pdf = PdfDocument.FromFile(file_path)
    extracted_image_path = f"./extract/images/{file_id}"
    
    pdf.RasterizeToImageFiles(f"{extracted_image_path}/image-*.png",DPI=96)
    files_collection.update_one({"_id": ObjectId(file_id)}, {"$set": {"status": "converted to images"}})
    # Get all generated images
    image_files = sorted(glob.glob(f"{extracted_image_path}/*.png"))

    system_prompt = """You are a witty and brutally honest resume critic with years of experience in recruiting and talent acquisition. Your job is to roast resumes in an entertaining yet constructive way.

Your personality:
- Sharp, witty, and humorous but not mean-spirited
- Think of yourself as a friend who cares enough to tell the truth with a smile
- Use analogies, pop culture references, and clever wordplay
- Be specific about issues - vague feedback helps no one

For the roast sections, cover these areas as applicable:
- Design & Layout (visual appeal, readability, white space)
- Professional Summary (if exists - is it compelling or generic?)
- Experience Section (achievements vs duties, quantified results)
- Skills Section (relevant skills, buzzword overload, missing skills)
- Education (relevance, presentation)
- Red Flags (gaps, inconsistencies, questionable choices)

For severity levels:
- 'mild': Minor issue, easy fix
- 'medium': Noticeable problem that should be addressed
- 'spicy': Significant issue hurting their chances
- 'extra_crispy': Major problem that needs immediate attention

For suggestion priorities:
- 'high': Fix this immediately - it's hurting your chances
- 'medium': Important improvement that will strengthen your resume
- 'low': Nice to have, will polish your resume

Be honest with scores - don't inflate them to be nice. A mediocre resume should score around 40-60."""

    content = [{"type": "input_text", "text": system_prompt + "\n\nNow, roast the resume shown in the images below and provide your analysis in the required JSON format:"}]
    
    for img_path in image_files:
        base64_image = encode_image(img_path)
        content.append({
            "type": "input_image",
            "image_url": f"data:image/png;base64,{base64_image}",
        })

    # Update status before AI analysis
    files_collection.update_one({"_id": ObjectId(file_id)}, {"$set": {"status": "analyzing"}})

    response = client.responses.create(
        model=os.getenv("OPENAI_MODEL"),
        input=[{"role": "user", "content": content}],
        text={
            "format": {
                "type": "json_schema",
                "name": "resume_roast",
                "schema": get_openai_compatible_schema(ResumeRoastOutput),
                "strict": True
            }
        }
    )

    # Parse the structured JSON response
    roast_data = json.loads(response.output_text)
    
    # Prepare feedback for the user with structured data
    feedback = {
        "roast_result": roast_data,
        "metadata": {
            "pages_processed": len(image_files),
            "model_used": os.getenv("GROQ_MODEL_ID"),
            "processed_at": datetime.utcnow().isoformat(),
            "version": "2.0"
        },
        "user_message": "🔥 Your resume roast is ready! We've analyzed your resume and prepared some brutally honest (but helpful) feedback. Remember: even the harshest roast comes from a place of wanting you to succeed. Take the feedback, improve, and come back stronger! 💪"
    }

    # Mark as completed after processing
    files_collection.update_one({"_id": ObjectId(file_id)}, {"$set": {"status": "completed", "output": feedback}})

    # TODO: send notification to user about completion via email or other means
    