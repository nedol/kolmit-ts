# -*- coding: utf-8 -*-

import whisper
import sys
import json

import logging
logging.basicConfig(level=logging.DEBUG)

# Загружаем более мощную модель
model = whisper.load_model("small")# large-v3 medium

# Получить путь к аудиофайлу
audio_file = sys.argv[1]
language = sys.argv[2] if len(sys.argv) > 2 else "en"

# Выполнить транскрипцию с улучшенными параметрами
result = model.transcribe(
    audio_file, 
    language=language, 
    temperature=[0.0], 
    word_timestamps=True, 
    beam_size=5, 
    fp16=False
)

# Вывести результат в формате JSON
output = {
    "text": result["text"],
    "segments": result["segments"]  # Список сегментов с временными метками
}

print(json.dumps(output, ensure_ascii=False, indent=2))

