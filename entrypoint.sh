#!/usr/bin/env bash

cp .env .env.temp
sed -i'' "s~{JWT_SECRET}~${JWT_SECRET}~g" .env.temp
cp .env.temp .env
rm -rf .env.temp
unset JWT_SECRET

npm start
