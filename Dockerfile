#!/bin/bash
FROM --platform=linux/amd64 node:lts-alpine

WORKDIR /app

COPY "package.json" .
COPY "package-lock.json" .

RUN npm install --production

COPY . .

# prod migration can be done only within production env,
# so it's ran in CMD command to avoid errors during local builds
CMD npm run db:migrate:prod; npm run prod