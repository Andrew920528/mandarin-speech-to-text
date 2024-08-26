import json
import sys
from fastapi import FastAPI, File, Response, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from typing import Generator, Optional
import os
import uvicorn
from transcribe import transcribe
from starlette.middleware.cors import CORSMiddleware
import argparse
from util import *
from StreamHandler import *
from typing import Dict, Any
import queue
import threading
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. Adjust as needed for security.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods. Adjust as needed.
    allow_headers=["*"],  # Allows all headers. Adjust as needed.
)

available_files = {}
@app.post("/retrieve")
async def get_transcript(payload: Dict[str, Any]):
    global available_files
    file_name = payload["file_name"]
    if file_name in available_files:
        curr_dir = os.path.dirname(os.path.abspath(__file__))
        transcript_file_name = file_name + ".txt" 
        transcript_file_path = os.path.join(curr_dir, 'transcript', transcript_file_name) # server/transcript/file.txt
        return FileResponse(transcript_file_path, media_type='text/plain', filename=transcript_file_name)
    return {"status": "error", "msg":"The file is not ready yet, please come back later."}

@app.post("/upload")
def upload_file(file: UploadFile = File(...)):
    global available_files
    supported_extensions = ['.mp3', '.mp4', '.mpeg', '.mpga', '.m4a', '.wav', '.webm']
    
    response_queue = queue.Queue()
    stream_handler = StreamHandler(response_queue)
    
    print("Request revieved")
    # creates folder for the files if not exists
    os.makedirs("speech/", exist_ok=True)
    os.makedirs("transcript/", exist_ok=True)

    file_name = generate_unique_id()
    in_file_extension = "."+ file.filename.split(".")[-1]

    if any(in_file_extension == ext for ext in supported_extensions):
        curr_dir = os.path.dirname(os.path.abspath(__file__))
        speech_file_path = os.path.join(curr_dir, 'speech', file_name + in_file_extension) # server/speech/file.wav
        
        transcript_file_name = file_name + ".txt" 
        transcript_file_path = os.path.join(curr_dir, 'transcript', transcript_file_name) # server/transcript/file.txt
        # saves speech file
        with open(speech_file_path , "wb") as f:
            f.write(file.file.read())
        
        stream_handler.add_to_stream(json.dumps({"status":"file_uploaded", "data": file_name}))
        
        
        print("File uploaded as " + file_name)
        
        def runTranscribe():
            transcript  = transcribe(speech_file_path, None)
            # transcript = "aaaa"
            stream_handler.add_to_stream(json.dumps({"status":"transcription_complete", "data": transcript}))
            # saves transcript
            with open(transcript_file_path, 'w') as f:
                f.write(transcript)
            available_files[file_name] = True
            stream_handler.end_stream()
        t = threading.Thread(target=runTranscribe)
        t.start()
        
        return StreamingResponse(stream_handler.yield_stream(),
                        media_type='application/json')
       
    else:
        raise HTTPException(status_code=400, detail="Error occurred when transcribing")

if __name__ == "__main__":
    HOST = "127.17.1.13"
    # HOST = "0.0.0.0"  # local host
    uvicorn.run(app, host=HOST, port=8000)
    
# uvicorn main:app --host 172.17.1.13 --port 8000