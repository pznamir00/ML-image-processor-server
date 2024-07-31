# delete database

echo "Deleting test database..."

IMAGE_NAME="ml-image-processor-server-test-image"
CONTAINER_NAME="ml-image-processor-server-test-container"

docker stop $CONTAINER_NAME
docker rm $CONTAINER_NAME
docker rmi $IMAGE_NAME