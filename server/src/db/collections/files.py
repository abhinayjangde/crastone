from typing import Optional, List
from ..db import db
from pydantic import BaseModel, Field
from pymongo.asynchronous.collection import AsyncCollection
from datetime import datetime

# Nested schemas for structured roast output
class SuggestionSchema(BaseModel):
    category: str = Field(..., description="Category: 'formatting', 'content', 'skills', 'experience', 'education', 'design', or 'general'")
    priority: str = Field(..., description="Priority level: 'high', 'medium', or 'low'")
    issue: str = Field(..., description="What's wrong or could be improved")
    recommendation: str = Field(..., description="Specific actionable recommendation")
    example: Optional[str] = Field(None, description="Example of how to implement the suggestion")

class ResumeScoreSchema(BaseModel):
    overall: int = Field(..., ge=0, le=100, description="Overall resume score out of 100")
    formatting: int = Field(..., ge=0, le=100, description="Formatting and design score")
    content: int = Field(..., ge=0, le=100, description="Content quality score")
    impact: int = Field(..., ge=0, le=100, description="Impact and achievements score")
    ats_friendly: int = Field(..., ge=0, le=100, description="ATS compatibility score")

class RoastSectionSchema(BaseModel):
    title: str = Field(..., description="Section title")
    roast: str = Field(..., description="The roast content for this section")
    severity: str = Field(..., description="Severity: 'mild', 'medium', 'spicy', or 'extra_crispy'")

class RoastResultSchema(BaseModel):
    headline: str = Field(..., description="Catchy one-liner summary")
    opening_roast: str = Field(..., description="Opening punch - hilarious first impression")
    roast_sections: List[RoastSectionSchema] = Field(..., description="Detailed roast sections")
    hidden_gems: List[str] = Field(..., description="Good things about the resume")
    suggestions: List[SuggestionSchema] = Field(..., description="Actionable suggestions")
    scores: ResumeScoreSchema = Field(..., description="Resume scores")
    final_verdict: str = Field(..., description="Closing funny but encouraging message")
    tldr: str = Field(..., description="Quick summary in 2-3 sentences")

class MetadataSchema(BaseModel):
    pages_processed: int = Field(..., description="Number of pages processed")
    model_used: str = Field(..., description="AI model used for processing")
    processed_at: str = Field(..., description="ISO timestamp of processing")
    version: str = Field(..., description="Version of the roast system")

class OutputSchema(BaseModel):
    roast_result: RoastResultSchema = Field(..., description="The structured roast result")
    metadata: MetadataSchema = Field(..., description="Processing metadata")
    user_message: str = Field(..., description="Friendly message to the user")

class FileSchema(BaseModel):
    filename: str = Field(..., description="Name of the file")
    status: str = Field(..., description="Status: 'pending', 'processing', 'converted to images', 'analyzing', 'completed', or 'failed'")
    output: Optional[OutputSchema] = Field(None, description="Structured roast output after processing")
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow, description="File upload timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")

files_collection: AsyncCollection = db["files"]