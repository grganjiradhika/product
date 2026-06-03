#!/bin/bash

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=== Local Docker Testing ===${NC}\n"

REGISTRY_NAME=${1:-"product-frontend"}
REGISTRY_URL=${2:-"localhost"}

echo -e "${BLUE}Building Docker image...${NC}"
docker build -f frontend/Dockerfile -t ${REGISTRY_NAME}:latest .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Image built successfully${NC}\n"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

echo -e "${BLUE}Running container...${NC}"
docker run -d -p 3000:3000 --name ${REGISTRY_NAME} ${REGISTRY_NAME}:latest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Container started${NC}"
    sleep 3
    
    echo -e "\n${BLUE}Testing health endpoint...${NC}"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
    
    if [ "$HTTP_CODE" == "200" ]; then
        echo -e "${GREEN}✓ App is healthy (HTTP $HTTP_CODE)${NC}"
        echo -e "\n${BLUE}App running at: http://localhost:3000${NC}"
        echo -e "${BLUE}To stop: docker stop ${REGISTRY_NAME}${NC}"
        echo -e "${BLUE}To remove: docker rm ${REGISTRY_NAME}${NC}"
    else
        echo -e "${RED}✗ Health check failed (HTTP $HTTP_CODE)${NC}"
        docker logs ${REGISTRY_NAME}
    fi
else
    echo -e "${RED}✗ Failed to start container${NC}"
    exit 1
fi
