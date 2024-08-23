
import whisper
import subprocess
import os
import time
import sys
from util import *


def get_ffmpeg_path():
    # If running as a PyInstaller bundle
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, 'ffmpeg', 'ffmpeg.exe')
    # If running as a script
    else:
        return os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ffmpeg', 'ffmpeg.exe')
def set_ffmpeg_path():
    ffmpeg_path = get_ffmpeg_path()
    ffmpeg_dir = os.path.dirname(ffmpeg_path)
    os.environ["PATH"] = ffmpeg_dir + os.pathsep + os.environ.get("PATH", "")


def transcribe(speech_file_path, verbose,):
    set_ffmpeg_path()
    curr_dir = os.path.dirname(os.path.abspath(__file__))
    start_time = time.time()
    logTime(start_time, "Transcription process started.")
    speech_path = os.path.join(curr_dir,'speech',speech_file_path)
    # Replace these with your actual filename and model details
    model_name = "medium"  # Or "tiny", "small", "medium", "large"
    language = "Chinese"  # Replace with the desired language code

    # Load the model
    model = whisper.load_model(model_name)
    logTime(start_time, "model loaded")
    
    # Transcribe the audio file
    result = model.transcribe(speech_path, language=language, verbose=verbose)
    logTime(start_time, "speech transcribed")
    transcript = handle_result(result)
    return transcript
    
   

def handle_result(result):
    segments = result["segments"]
    output = ""
    def format_seconds(seconds):
        minutes = int(seconds // 60)
        remaining_seconds = int(seconds % 60)

        # Format minutes and seconds to ensure two digits
        formatted_minutes = str(minutes).zfill(2)
        formatted_seconds = str(remaining_seconds).zfill(2)

        # Combine the formatted minutes and seconds
        return f"{formatted_minutes}:{formatted_seconds}"

    # Print the formatted segments
    for segment in segments:
        start = format_seconds(segment["start"])
        end = format_seconds(segment["end"])
        text = segment["text"]
        output += f"[{start} --> {end}] {text}\n"
    return output
