#!/bin/bash

export NODE_ENV=test

# create database
IMAGE_NAME="ml-image-processor-server-test-image"
CONTAINER_NAME="ml-image-processor-server-test-container"
PORT=5433

docker build -t $IMAGE_NAME integration-test-env
docker run -d -p $PORT:5433 --name $CONTAINER_NAME $IMAGE_NAME

# wait for PG to be ready
echo "Waiting for test database to be ready..."
until docker exec $CONTAINER_NAME pg_isready -p $PORT -U test; do
  sleep 2
done
echo "Test database is ready"

# migrate tables to database
npx sequelize-cli db:migrate