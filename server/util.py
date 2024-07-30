import time
from datetime import datetime, timedelta

def logTime(start_time, description):
    latency = time.time() - start_time
    now_formatted = datetime.fromtimestamp(time.time()).strftime('%H:%M:%S')
    latency_formatted = format_seconds(latency)
    print(f"Time = {now_formatted}, time passed = {latency_formatted} | {description}")

    
def format_seconds(seconds):
    minutes = int(seconds // 60)
    remaining_seconds = int(seconds % 60)

    # Format minutes and seconds to ensure two digits
    formatted_minutes = str(minutes).zfill(2)
    formatted_seconds = str(remaining_seconds).zfill(2)

    # Combine the formatted minutes and seconds
    return f"{formatted_minutes}:{formatted_seconds}"