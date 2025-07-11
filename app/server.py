from fastapi import FastAPI, UploadFile
from uuid import uuid4
from .utils.file import save_to_disk
from .db.collections.file import files_collection, FileSchema


app = FastAPI()


@app.get("/")
def hello():
    return {"status": "healthy"}


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
    print("pushing into queue")

    # save to mongodb
    await files_collection.update_one({"_id": db_file.inserted_id},{
        "$set":{
            "status":"queued"
        }
    })

    return {"file_id": str(db_file.inserted_id)} 

