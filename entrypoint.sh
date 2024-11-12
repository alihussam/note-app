#!/usr/bin/env bash

cp .env .env.temp

sed -i'' "s~{ACCESS_TOKEN_SECRET}~${ACCESS_TOKEN_SECRET}~g" .env.temp
sed -i'' "s~{REFRESH_TOKEN_SECRET}~${REFRESH_TOKEN_SECRET}~g" .env.temp

cp .env.temp .env
rm -rf .env.temp
unset ACCESS_TOKEN_SECRET
unset REFRESH_TOKEN_SECRET

npm start
