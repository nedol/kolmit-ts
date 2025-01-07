#!/usr/bin/env bash

# Установка системных зависимостей
apt-get update
apt-get install -y \
    gconf-service libasound2 libatk1.0-0 libcups2 libdbus-1-3 \
    libgdk-pixbuf2.0-0 libnspr4 libnss3 libpango-1.0-0 libxss1 \
    fonts-liberation libappindicator1 libappindicator3-1 libgbm-dev

# Установка зависимостей Node.js
npm install