import sys
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from typing import Optional
import os
import uvicorn
from transcribe import transcribe
from starlette.middleware.cors import CORSMiddleware
import argparse

def cli(speech_file_path: str, transcript_file_name, verbose:bool):
    supportedType = ["wav"]
    speech_file_extension = speech_file_path.split(".")[-1]
    if speech_file_extension not in supportedType:
        print(f"Unsupported file type. Valid files are {supportedType}.")
        return
    
    os.makedirs("transcript/", exist_ok=True)
    
    if transcript_file_name is None:
        transcript_file_name = os.path.basename(speech_file_path).split('.')[0]
        transcript_file_path = os.path.dirname(speech_file_path)
    transcript_file_path = os.path.join(transcript_file_path, 'transcript')
    os.makedirs(transcript_file_path, exist_ok=True)
    transcript_file_path = os.path.join(transcript_file_path, transcript_file_name + ".txt" )
   
    print("Transcription started")
    # saves speech file
    transcript  = transcribe(speech_file_path, verbose)
    
    # saves transcript
    with open(transcript_file_path, 'w') as f:
        f.write(transcript)
    print("Transcription Completed")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Description of your program.")
    parser.add_argument("input_file", type=str, help="Path to the input file")
    parser.add_argument('-o', '--out', help="Name of the outputted file. Defaults to be the same as input file name")   
    parser.add_argument('-v', '--verbose', action='store_true', help="If true, prints out all messages. Else, prints out minimal messages and a progress bar.") 

    args = parser.parse_args()
    cli(args.input_file, args.out, args.verbose)
