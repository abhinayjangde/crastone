import os
import aiofiles

async def save_file_to_disk(file: bytes, path: str) -> bool:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    try:
        async with aiofiles.open(path, 'wb') as out_file:
            await out_file.write(file)
            return True  
    except Exception as e:
        print(f"Error saving file to disk: {e}")
        return False
        