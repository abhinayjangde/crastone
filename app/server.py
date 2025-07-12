from fastapi import FastAPI, UploadFile, Path
from bson import ObjectId
from .utils.file import save_to_disk
from .db.collections.files import files_collection, FileSchema
from .queue.q import q
from .queue.workers import process_file

app = FastAPI()


@app.get("/")
def hello():
    return {"status": "healthy"}

@app.get("/{id}")
async def get_file_by_id(id: str = Path(..., description="Id of the file")):
    db_file = await files_collection.find_one({"_id": ObjectId(id)})

    return {
        "_id": str(db_file["_id"]),
        "name": db_file["name"],
        "status": db_file["status"],
        "result": db_file["result"] if "result" in db_file else None
    }

@app.post("/upload")
async def upload_file(file: UploadFile):

    db_file = await files_collection.insert_one(document=FileSchema(
        name=file.filename,
        status="saving"
    ))
    
    # save file to local file system
    file_path = f"/mnt/upload/{str(db_file.inserted_id)}/{file.filename}"
    
    await save_to_disk(file=await file.read(),path=file_path)
    
    # queue kr diya
    q.enqueue(process_file, str(db_file.inserted_id), file_path)

    # save to mongodb
    await files_collection.update_one({"_id": db_file.inserted_id},{
        "$set":{
            "status":"queued"
        }
    })

    return {"file_id": str(db_file.inserted_id)} 

