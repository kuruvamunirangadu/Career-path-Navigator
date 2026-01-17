#!/bin/bash
# Quick deployment script for Career App to Azure

set -e

echo "🚀 Career App - Azure Deployment Script"
echo "========================================"

# Configuration
RESOURCE_GROUP="career-app-rg"
REGISTRY_NAME="careerappregistry"
LOCATION="eastus"
BACKEND_NAME="career-backend"
FRONTEND_NAME="career-frontend"
REGISTRY_URL="$REGISTRY_NAME.azurecr.io"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
  echo -e "${BLUE}▶${NC} $1"
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# Step 1: Check prerequisites
print_step "Checking prerequisites..."
command -v az >/dev/null 2>&1 || { print_warning "Azure CLI not installed. Install from: https://docs.microsoft.com/cli/azure/install-azure-cli"; exit 1; }
command -v docker >/dev/null 2>&1 || { print_warning "Docker not installed. Install from: https://www.docker.com/products/docker-desktop"; exit 1; }
print_success "Prerequisites check passed"

# Step 2: Login to Azure
print_step "Logging in to Azure..."
az login --use-device-code
print_success "Azure login successful"

# Step 3: Create resource group
print_step "Creating resource group: $RESOURCE_GROUP..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" > /dev/null 2>&1 || true
print_success "Resource group ready"

# Step 4: Create Container Registry
print_step "Creating Azure Container Registry: $REGISTRY_NAME..."
az acr create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$REGISTRY_NAME" \
  --sku Basic \
  > /dev/null 2>&1 || print_warning "Registry may already exist"
print_success "Container Registry ready"

# Step 5: Login to ACR
print_step "Logging in to Azure Container Registry..."
az acr login --name "$REGISTRY_NAME"
print_success "ACR login successful"

# Step 6: Build backend Docker image
print_step "Building backend Docker image..."
docker build -t "$REGISTRY_URL/$BACKEND_NAME:latest" -f backend/Dockerfile .
print_success "Backend image built"

# Step 7: Build frontend Docker image
print_step "Building frontend Docker image..."
docker build -t "$REGISTRY_URL/$FRONTEND_NAME:latest" -f frontend/Dockerfile .
print_success "Frontend image built"

# Step 8: Push images to ACR
print_step "Pushing backend image to ACR..."
docker push "$REGISTRY_URL/$BACKEND_NAME:latest"
print_success "Backend image pushed"

print_step "Pushing frontend image to ACR..."
docker push "$REGISTRY_URL/$FRONTEND_NAME:latest"
print_success "Frontend image pushed"

# Step 9: Create Container App environment
print_step "Creating Container Apps environment..."
az containerapp env create \
  --name "$BACKEND_NAME-env" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  > /dev/null 2>&1 || print_warning "Environment may already exist"
print_success "Environment ready"

# Step 10: Deploy backend
print_step "Deploying backend container app..."
az containerapp create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$BACKEND_NAME" \
  --image "$REGISTRY_URL/$BACKEND_NAME:latest" \
  --environment "$BACKEND_NAME-env" \
  --ingress 'external' \
  --target-port 8000 \
  --registry-server "$REGISTRY_URL" \
  --registry-username $(az acr credential show -n "$REGISTRY_NAME" --query "username" -o tsv) \
  --registry-password $(az acr credential show -n "$REGISTRY_NAME" --query "passwords[0].value" -o tsv) \
  --cpu 0.5 \
  --memory 1.0Gi \
  2>/dev/null || print_warning "Backend deployment may already exist or has updates"
print_success "Backend deployed"

# Step 11: Deploy frontend
print_step "Deploying frontend container app..."
az containerapp create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$FRONTEND_NAME" \
  --image "$REGISTRY_URL/$FRONTEND_NAME:latest" \
  --environment "$BACKEND_NAME-env" \
  --ingress 'external' \
  --target-port 3000 \
  --registry-server "$REGISTRY_URL" \
  --registry-username $(az acr credential show -n "$REGISTRY_NAME" --query "username" -o tsv) \
  --registry-password $(az acr credential show -n "$REGISTRY_NAME" --query "passwords[0].value" -o tsv) \
  --cpu 0.5 \
  --memory 1.0Gi \
  2>/dev/null || print_warning "Frontend deployment may already exist or has updates"
print_success "Frontend deployed"

# Step 12: Get URLs
print_step "Retrieving application URLs..."
BACKEND_URL=$(az containerapp show -g "$RESOURCE_GROUP" -n "$BACKEND_NAME" --query "properties.configuration.ingress.fqdn" -o tsv)
FRONTEND_URL=$(az containerapp show -g "$RESOURCE_GROUP" -n "$FRONTEND_NAME" --query "properties.configuration.ingress.fqdn" -o tsv)

echo ""
echo "=========================================="
print_success "Deployment Complete! 🎉"
echo "=========================================="
echo ""
echo -e "${GREEN}Backend URL:${NC}  https://$BACKEND_URL"
echo -e "${GREEN}Frontend URL:${NC} https://$FRONTEND_URL"
echo ""
print_warning "Update frontend environment variable REACT_APP_API_URL with backend URL"
echo ""
echo "Next steps:"
echo "1. Test: curl https://$BACKEND_URL/streams?class=10"
echo "2. Open: https://$FRONTEND_URL in browser"
echo "3. Monitor: az containerapp logs show -g $RESOURCE_GROUP -n $BACKEND_NAME"
echo ""
