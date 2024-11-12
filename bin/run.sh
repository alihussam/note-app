#!/usr/bin/env bash

if [[ ! -f .env.local ]] || [[ ! -f .env ]]; then
    echo "Using env file present file"
else
    echo "No .env.local file found"
    exit 2
fi

. .env.local

docker run \
    -p $PORT:$PORT \
    -v ./database.sqlite3:/usr/src/app/database.sqlite3 \
    -e JWT_SECRET=$JWT_SECRET \
    -d \
    --name respond-app \
    respond:latest
