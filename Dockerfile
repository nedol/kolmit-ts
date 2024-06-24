# Используем образ OpenTTS
FROM synesthesiam/opentts:latest

# Устанавливаем рабочую директорию
WORKDIR /app

# Команда для запуска OpenTTS
CMD ["python3", "-m", "opentts"]
