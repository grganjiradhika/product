#!/bin/bash

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Azure CI/CD Pipeline Setup Script ===${NC}\n"

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI not found. Install from: https://learn.microsoft.com/cli/azure/install-azure-cli${NC}"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker not found. Install from: https://www.docker.com/products/docker-desktop${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites met${NC}\n"

# Read user input
read -p "Enter Azure subscription ID (or press Enter to skip): " SUBSCRIPTION_ID
read -p "Enter resource group name (default: rg-product-app): " RESOURCE_GROUP
RESOURCE_GROUP=${RESOURCE_GROUP:-rg-product-app}

read -p "Enter registry name (must be unique, lowercase): " REGISTRY_NAME
read -p "Enter app service name (must be unique): " APP_SERVICE_NAME
read -p "Enter location (default: eastus): " LOCATION
LOCATION=${LOCATION:-eastus}

echo -e "\n${BLUE}Creating Azure resources...${NC}\n"

# Set subscription if provided
if [ ! -z "$SUBSCRIPTION_ID" ]; then
    az account set --subscription "$SUBSCRIPTION_ID"
fi

# Create resource group
echo "Creating resource group: $RESOURCE_GROUP"
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

# Create ACR
echo "Creating Azure Container Registry: $REGISTRY_NAME"
az acr create --resource-group "$RESOURCE_GROUP" \
  --name "$REGISTRY_NAME" \
  --sku Basic \
  --location "$LOCATION"

# Create App Service Plan
echo "Creating App Service Plan"
az appservice plan create \
  --name "${APP_SERVICE_NAME}-plan" \
  --resource-group "$RESOURCE_GROUP" \
  --sku B1 \
  --is-linux

# Create Web App
echo "Creating Web App for Containers"
az webapp create \
  --resource-group "$RESOURCE_GROUP" \
  --plan "${APP_SERVICE_NAME}-plan" \
  --name "$APP_SERVICE_NAME" \
  --deployment-container-image-name "${REGISTRY_NAME}.azurecr.io/product-frontend:latest"

# Get credentials
echo -e "\n${BLUE}Retrieving credentials...${NC}"
CREDENTIALS=$(az acr credential show --resource-group "$RESOURCE_GROUP" --name "$REGISTRY_NAME")
REGISTRY_USERNAME=$(echo $CREDENTIALS | grep -o '"username":"[^"]*' | cut -d'"' -f4)
REGISTRY_PASSWORD=$(echo $CREDENTIALS | grep -o '"passwords":\[[^]]*' -o | grep -o '"password":"[^"]*' | head -1 | cut -d'"' -f4)

# Save configuration
CONFIG_FILE="azure-config.env"
cat > "$CONFIG_FILE" << EOF
# Azure Configuration
SUBSCRIPTION_ID=$SUBSCRIPTION_ID
RESOURCE_GROUP=$RESOURCE_GROUP
REGISTRY_NAME=$REGISTRY_NAME
REGISTRY_URL=${REGISTRY_NAME}.azurecr.io
APP_SERVICE_NAME=$APP_SERVICE_NAME
LOCATION=$LOCATION
REGISTRY_USERNAME=$REGISTRY_USERNAME
REGISTRY_PASSWORD=$REGISTRY_PASSWORD
EOF

echo -e "\n${GREEN}✓ Setup complete!${NC}"
echo -e "\n${BLUE}Configuration saved to: $CONFIG_FILE${NC}"
echo -e "${BLUE}Registry URL: ${REGISTRY_NAME}.azurecr.io${NC}"
echo -e "${BLUE}App Service URL: https://${APP_SERVICE_NAME}.azurewebsites.net${NC}"
echo -e "\n${BLUE}Next steps:${NC}"
echo "1. Update azure-pipelines.yml with your configuration"
echo "2. Push your code to GitHub/Azure Repos"
echo "3. Create pipeline in Azure DevOps"
echo "4. Configure service connections in Azure DevOps"
