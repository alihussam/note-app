#!/usr/bin/env bash

docker context create respond-context 2&>/dev/null

docker buildx create --use --name respond-builder respond-context
docker buildx inspect --bootstrap

if [[ ! -f .env.local ]] || [[ ! -f .env ]]; then
    echo "Using env file present file"
else
    echo "No .env.local file found"
    exit 2
fi

. .env.local

BASE_IMG=$(sed s/v//g .nvmrc)

docker buildx build --load \
    --no-cache \
    --build-arg BASE_IMG=${BASE_IMG}-slim \
    --build-arg PORT=${PORT} \
    --build-arg ROUTE_PREFIX=${ROUTE_PREFIX} \
    --tag respond .