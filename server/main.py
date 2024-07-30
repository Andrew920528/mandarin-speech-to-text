from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from typing import Optional
import os
import uvicorn
from transcribe import convert
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. Adjust as needed for security.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods. Adjust as needed.
    allow_headers=["*"],  # Allows all headers. Adjust as needed.
)
@app.get("/hello")
def hello():
    return {"message": "Hello World"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if file.filename.endswith('.wav'):
        speech_file = file.filename
        with open("speech/" + speech_file , "wb") as f:
            f.write(file.file.read())
        transcript_file = "".join(speech_file.split('.')[:-1]) + ".txt"
        out_path = convert(speech_file, transcript_file)
        return FileResponse(out_path, media_type='text/plain', filename="file.txt")
       
    else:
        raise HTTPException(status_code=400, detail="Error occurred when transcribing")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
# uvicorn main:app --reload
