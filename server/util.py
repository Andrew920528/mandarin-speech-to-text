import random
import string
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


def generate_unique_id():
    # Get the current time in seconds since the epoch, and convert to microseconds
    current_time = int(time.time() * 1e6)
    
    # Generate a random number (between 0 and 9999) and pad it to 4 digits
    random_number = random.randint(0, 9999)
    
    # Convert to a string
    random_part = f"{random_number:04}"
    
    # Combine time and random number
    unique_id = f"{current_time}{random_part}"
    
    # Convert the ID to a shorter string by using base 36 encoding
    unique_id_base36 = base36encode(int(unique_id))
    
    return unique_id_base36

def base36encode(number):
    # Base 36 encoding to shorten the ID
    alphabet = string.digits + string.ascii_lowercase
    base36 = ''
    while number:
        number, i = divmod(number, 36)
        base36 = alphabet[i] + base36
    return base36 or alphabet[0]
