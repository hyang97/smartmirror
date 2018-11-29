#!/usr/bin/env python3

import threading
import logging
import subprocess
import sys
import requests
import time

import aiy.assistant.auth_helpers
import aiy.assistant.device_helpers
import aiy.assistant.grpc
import aiy.audio
import aiy.voicehat
from google.assistant.library import Assistant
from google.assistant.library.event import EventType

threads = []

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s:%(name)s:%(message)s"
)

def power_off_pi():
    aiy.audio.say('Good bye!')
    subprocess.call('sudo shutdown now', shell=True)

def reboot_pi():
    aiy.audio.say('See you in a bit!')
    subprocess.call('sudo reboot', shell=True)

def say_ip():
    ip_address = subprocess.check_output("hostname -I | cut -d' ' -f1", shell=True)
    aiy.audio.say('My IP address is %s' % ip_address.decode('utf-8'))

def show_weather():
    #aiy.audio.say('Th weather today')
    r = requests.get('http://127.0.0.1:8080/remote?action=SHOW&module=module_2_currentweather')
    r = requests.get('http://127.0.0.1:8080/remote?action=SHOW&module=module_3_weatherforecast')
    task = threading.Thread(target=run_hide)
    threads.append(task)
    task.start()

def run_hide():
    time.sleep(5)
    r = requests.get('http://127.0.0.1:8080/remote?action=HIDE&module=module_2_currentweather')
    r = requests.get('http://127.0.0.1:8080/remote?action=HIDE&module=module_3_weatherforecast')

def process_event(assistant, event):
    status_ui = aiy.voicehat.get_status_ui()
    if event.type == EventType.ON_START_FINISHED:
        status_ui.status('ready')
        if sys.stdout.isatty():
            print('Say "OK, Google" then speak, or press Ctrl+C to quit...')

    elif event.type == EventType.ON_CONVERSATION_TURN_STARTED:
        status_ui.status('listening')

    elif event.type == EventType.ON_RECOGNIZING_SPEECH_FINISHED and event.args:
        print('You said:', event.args['text'])
        text = event.args['text'].lower()
        if text == 'power off':
            assistant.stop_conversation()
            print("power off!!!")
            #power_off_pi()
        elif text == 'reboot':
            assistant.stop_conversation()
            print("reboot!!!")
            #reboot_pi()
        elif text == 'ip address':
            assistant.stop_conversation()
            print("ip address!!!")
            #say_ip()
        elif text == 'show me the weather':
            assistant.stop_conversation()
            print("show weather!!!")
            #show_weather()

    elif event.type == EventType.ON_END_OF_UTTERANCE:
        status_ui.status('thinking')

    elif event.type == EventType.ON_CONVERSATION_TURN_FINISHED:
        status_ui.status('ready')

    elif event.type == EventType.ON_ASSISTANT_ERROR and event.args and event.args['is_fatal']:
        sys.exit(1)

def main():
    # r = requests.get('http://127.0.0.1:8080/remote?action=HIDE&module=module_0_clock')
    # r = requests.get('http://127.0.0.1:8080/remote?action=HIDE&module=module_1_MMM-Remote-Control')
    # r = requests.get('http://127.0.0.1:8080/remote?action=HIDE&module=module_2_currentweather')
    # r = requests.get('http://127.0.0.1:8080/remote?action=HIDE&module=module_3_weatherforecast')

    credentials = aiy.assistant.auth_helpers.get_assistant_credentials()
    model_id, device_id = aiy.assistant.device_helpers.get_ids_for_service(credentials)
    with Assistant(credentials, device_id) as assistant:
        for event in assistant.start():
            process_event(assistant, event)

if __name__ == '__main__':
    main()
