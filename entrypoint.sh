#!/usr/bin/env sh

if [ "$NODE_ENV" = "production" ]; then
    npm run start
else
    npm run dev
fi

if [ "$NODE_ENV" = "development" ]; then
