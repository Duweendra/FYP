from pynput import keyboard
import requests

rfid_data = ""

def on_press(key):
    global rfid_data
    try:
        # Capture character keys
        rfid_data += key.char
    except AttributeError:
        # Handle special keys if needed
        if key == keyboard.Key.enter:
            process_rfid_data(rfid_data)
            rfid_data = ""

def process_rfid_data(data):
    # Process and send the RFID data to the API
    data = data.strip()
    if data:
        json_data = {"id": data}
        try:
            response = requests.post("http://localhost:8000/api/rfid", json=json_data)
            if response.status_code == 200:
                print(f"RFID data sent successfully: {json_data}")
            else:
                print(f"Failed to send RFID data. Status code: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")

# Start listening to key presses
with keyboard.Listener(on_press=on_press) as listener:
    listener.join()
