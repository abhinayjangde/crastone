import os
import base64
from openai import OpenAI
from ..db.collections.files import files_collection
from bson import ObjectId
from pdf2image import convert_from_path
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# function to decode image to base64


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


async def process_file(id: str, file_path: str):
    await files_collection.update_one({"_id": ObjectId(id)}, {
        "$set": {
            "status": "processing"
        }
    })

    # convert pdf to image

    pages = convert_from_path(file_path)
    images = []
    for i, image in enumerate(pages):
        image_save_path = f"/mnt/upload/images/{id}/image-{i}.jpg"
        os.makedirs(os.path.dirname(image_save_path), exist_ok=True)
        image.save(image_save_path, "JPEG")
        images.append(image_save_path)

    await files_collection.update_one({"_id": ObjectId(id)}, {
        "$set": {
            "status": "converting to images success"
        }
    })

    # openai call with image

    base64_images =[encode_image(img) for img in images]
    result = client.responses.create(
        model="gpt-4.1",
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": "Based on resume below, Roast this resume"},
                    {
                        "type": "input_image",
                        "image_url": f"data:image/jpeg;base64,{base64_images[0]}",
                    },
                ],
            }
        ],
    )

    await files_collection.update_one({"_id": ObjectId(id)}, {
        "$set": {
            "status":"processed",
            "result": result.output_text
        }
    })
    
