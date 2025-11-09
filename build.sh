#!/bin/bash
set -e 

DOCKER_USERNAME="sinhnguyen417"
DOCKER_REPO="schedule_web"
DOCKER_TAG="latest"

echo "🐳 Building Docker image..."
docker build -t $DOCKER_USERNAME/$DOCKER_REPO:$DOCKER_TAG .

echo "🔐 Logging in to Docker Hub..."
docker login -u "$DOCKER_USERNAME"

echo "📤 Pushing image to Docker Hub..."
docker push $DOCKER_USERNAME/$DOCKER_REPO:$DOCKER_TAG

echo "✅ Done! Image pushed to https://hub.docker.com/r/$DOCKER_USERNAME/$DOCKER_REPO"
