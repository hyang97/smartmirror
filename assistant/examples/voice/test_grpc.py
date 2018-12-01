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

# pseudocode
# switch to new view

# def show_calendar():
#
# def show_commands():
#
# def show_weather():
#
# def show_home():

def process(user_transcript, audio, assistant_transcript):
    if user_transcript:
        print('you said "', user_transcript, '"')
        if user_transcript == "show me my calendar":
            show_calendar()
        elif user_transcript == "show me my commands":
            show_commands()
        elif user_transcript == "show me the weather":
            show_weather()
        elif user_transcript == "show me the home page":
            show_home()
    if assistant_transcript:
        print('google assistant says"', user_transcript, '"')
    if audio:
        aiy.audio.play_audio(audio)


def main():
    button = aiy.voicehat.get_button() # activation (hotword)
    assistant = aiy.assistant.get_assistant() # assistant
    print('your google assistant (grpc) is ready.')

    while True:
        print('press the button and speak')
        button.wait_for_press()
        print('listening...')
        user_transcript, audio, assistant_transcript = assistant.recognize()
        process(user_transcript, audio, assistant_transcript)


if __name__ == '__main__':
    main()
