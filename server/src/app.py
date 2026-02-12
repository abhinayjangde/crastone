from fastapi import FastAPI, UploadFile, Path
from fastapi.middleware.cors import CORSMiddleware
from db.collections.files import files_collection, FileSchema
from utils.file import save_file_to_disk
# from workers.workers import process_file
from workers.q import q
from bson import ObjectId

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "working!"}

@app.post("/upload")
async def upload_file(file: UploadFile):

    # save file to disk
    content = await file.read()

    result = await files_collection.insert_one(
        document=FileSchema(
            filename=file.filename,
            status="uploading"
        ).model_dump()
    )
    await save_file_to_disk(file=content, path=f"./uploads/{str(result.inserted_id)}/{file.filename}")
    await files_collection.update_one({"_id": result.inserted_id}, {"$set": {"status": "saved"}})

    # queue file for processing
    q.enqueue('src.workers.workers.process_file', str(result.inserted_id), file_path=f"./uploads/{str(result.inserted_id)}/{file.filename}")
    await files_collection.update_one({"_id": result.inserted_id}, {"$set": {"status": "queued"}})

    return {"file_id": str(result.inserted_id)}

@app.get("/status/{file_id}")
async def get_file_status(file_id: str = Path(..., description="The ID of the file to retrieve")):
    file = await files_collection.find_one({"_id": ObjectId(file_id)})
    if not file:
        return {"error": "File not found"}
    return {
        "_id": str(file["_id"]),
        "filename": file["filename"],
        "status": file["status"],
        "output": file.get("output", None)
    }

@app.get("/result/{file_id}")
async def get_file_results(file_id: str = Path(..., description="The ID of the file to retrieve")):
    file = await files_collection.find_one({"_id": ObjectId(file_id)})
    if not file:
        return {"error": "File not found"}
    if file["status"] != "completed":
        return {"error": "File processing not completed yet"}
    return {
        "_id": str(file["_id"]),
        "filename": file["filename"],
        "output": file.get("output", None)
    }