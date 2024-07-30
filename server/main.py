from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from typing import Optional
import os
import uvicorn
from transcribe import transcribe
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
    # creates folder for the files if not exists
    os.makedirs("speech/", exist_ok=True)
    os.makedirs("transcript/", exist_ok=True)
    if file.filename.endswith('.wav'):
        curr_dir = os.path.dirname(os.path.abspath(__file__))
        speech_file_path = os.path.join(curr_dir, 'speech', file.filename) # server/speech/file.wav
        
        transcript_file_path = "".join(file.filename.split('.')[:-1]) + ".txt" 
        transcript_file_path = os.path.join(curr_dir, 'transcript', transcript_file_path) # server/transcript/file.txt
        # saves speech file
        with open(speech_file_path , "wb") as f:
            f.write(file.file.read())

        transcript  = transcribe(speech_file_path)
        
        # saves transcript
        with open(transcript_file_path, 'w') as f:
            f.write(transcript)
        return FileResponse(transcript_file_path, media_type='text/plain', filename="file.txt")
       
    else:
        raise HTTPException(status_code=400, detail="Error occurred when transcribing")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
# uvicorn main:app --reload
