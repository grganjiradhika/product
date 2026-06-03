# Windows Setup Guide for Azure CI/CD Pipeline

## Install Prerequisites on Windows

### 1. Docker Desktop
1. Download from: https://www.docker.com/products/docker-desktop
2. Run installer and follow prompts
3. Ensure **WSL 2** is enabled (Windows Subsystem for Linux)
4. Restart your computer
5. Verify installation:
   ```powershell
   docker --version
   docker run hello-world
   ```

### 2. Azure CLI
1. Download from: https://learn.microsoft.com/cli/azure/install-azure-cli-windows
2. Run installer
3. Restart PowerShell
4. Verify:
   ```powershell
   az --version
   ```

### 3. Git (if not installed)
1. Download from: https://git-scm.com/download/win
2. Run installer with default settings
3. Restart PowerShell
4. Verify:
   ```powershell
   git --version
   ```

### 4. Node.js (for local development)
1. Download from: https://nodejs.org/ (LTS version)
2. Run installer
3. Verify:
   ```powershell
   node --version
   npm --version
   ```

## Windows PowerShell Commands

### Step 1: Navigate to Project
```powershell
cd e:\product
```

### Step 2: Test Docker Build
```powershell
cd frontend
docker build -t product-frontend:latest .
docker run -p 3000:3000 product-frontend:latest
```

Then open browser: http://localhost:3000

Press `Ctrl+C` to stop.

### Step 3: Login to Azure
```powershell
az login
```
This opens a browser to authenticate.

### Step 4: Create Resource Group
```powershell
$resourceGroup = "rg-product-app"
$location = "eastus"
$registryName = "myproductregistry"  # CHANGE THIS - must be unique
$appServiceName = "product-app-dev"   # CHANGE THIS - must be unique

az group create --name $resourceGroup --location $location
```

### Step 5: Create Container Registry
```powershell
az acr create `
  --resource-group $resourceGroup `
  --name $registryName `
  --sku Basic `
  --location $location
```

### Step 6: Create App Service Plan
```powershell
az appservice plan create `
  --name "$($appServiceName)-plan" `
  --resource-group $resourceGroup `
  --sku B1 `
  --is-linux
```

### Step 7: Create Web App (for Containers)
```powershell
az webapp create `
  --resource-group $resourceGroup `
  --plan "$($appServiceName)-plan" `
  --name $appServiceName `
  --deployment-container-image-name "$($registryName).azurecr.io/product-frontend:latest"
```

### Step 8: Get Registry Credentials
```powershell
az acr credential show `
  --resource-group $resourceGroup `
  --name $registryName
```

Save the `username` and `password`.

### Step 9: Login to Azure Container Registry
```powershell
az acr login --name $registryName
```

### Step 10: Tag Docker Image
```powershell
$imageName = "product-frontend:latest"
$registryUrl = "$($registryName).azurecr.io/product-frontend:latest"

docker tag $imageName $registryUrl
```

### Step 11: Push to ACR
```powershell
docker push $registryUrl
```

### Step 12: Initialize Git Repository
```powershell
cd e:\product
git init
git add .
git config user.email "your-email@example.com"
git config user.name "Your Name"
git commit -m "Initial commit"
```

### Step 13: Create GitHub Repository
1. Go to https://github.com/new
2. Create repository: `product-app`
3. Copy the HTTPS URL
4. Add remote and push:
   ```powershell
   git remote add origin https://github.com/yourusername/product-app.git
   git branch -M main
   git push -u origin main
   ```

### Step 14: Create Azure DevOps Project
1. Go to https://dev.azure.com
2. Create new organization (if needed)
3. Create new project: `ProductApp`

### Step 15: Create Pipeline
1. In Azure DevOps, go to **Pipelines** → **Create Pipeline**
2. Select **GitHub**
3. Select your repository
4. Choose **Existing Azure Pipelines YAML file**
5. Select `azure-pipelines.yml`
6. Review and click **Save and queue**

### Step 16: Create Service Connection
In Azure DevOps:
1. Project Settings → Service connections
2. Click **New service connection**
3. Select **Azure Container Registry**
4. Fill in:
   - Azure subscription
   - Registry: `yourregistry.azurecr.io`
   - Username: (from step 8)
   - Password: (from step 8)
   - Service connection name: `acr-service-connection`
5. Click **Save**

### Step 17: Update Pipeline YAML
1. Edit `azure-pipelines.yml` in your code
2. Update variables:
   ```yaml
   variables:
     containerRegistry: 'myproductregistry.azurecr.io'
     dockerRegistryServiceConnection: 'acr-service-connection'
   ```
3. Commit and push:
   ```powershell
   git add azure-pipelines.yml
   git commit -m "Update pipeline configuration"
   git push
   ```

### Step 18: Configure App Service Environment Variables
In Azure Portal:
1. Go to App Service: `product-app-dev`
2. Settings → Configuration
3. Click **New application setting**, add:
   ```
   VITE_API_BASE_URL = https://your-api.com/api
   VITE_GOOGLE_CLIENT_ID = your-google-oauth-id
   VITE_STRIPE_PUBLIC_KEY = your-stripe-key
   ```
4. Click **Save**

### Step 19: Test Continuous Deployment
1. Make a change to your code:
   ```powershell
   # Edit a file, e.g., frontend/src/App.jsx
   ```
2. Commit and push:
   ```powershell
   git add .
   git commit -m "Test CI/CD deployment"
   git push
   ```
3. Watch the pipeline trigger in Azure DevOps
4. Check app deployment in App Service

## Troubleshooting on Windows

### Docker Issues
```powershell
# Restart Docker
Get-Process docker* | Stop-Process
Start-Process "C:\Program Files\Docker\Docker\Docker.exe"

# Check logs
docker logs <container-id>

# See running containers
docker ps -a
```

### Azure CLI Issues
```powershell
# Verify authentication
az account show

# List resources
az resource list --output table

# Get app service logs
az webapp log tail --resource-group $resourceGroup --name $appServiceName
```

### Git Issues
```powershell
# Check status
git status

# View remote
git remote -v

# Undo last commit (before push)
git reset --soft HEAD~1
```

## VS Code Integration

### Recommended Extensions
1. **Docker** - ms-azuretools.vscode-docker
2. **Azure Tools** - ms-vscode.azure-tools
3. **Azure App Service** - ms-azuretools.vscode-azureappservice
4. **Azure Pipelines** - ms-azure-devops.azure-pipelines

### Install Extensions
```powershell
code --install-extension ms-azuretools.vscode-docker
code --install-extension ms-vscode.azure-tools
code --install-extension ms-azuretools.vscode-azureappservice
code --install-extension ms-azure-devops.azure-pipelines
```

## Useful PowerShell Shortcuts

Create a `profile.ps1` file in `$PROFILE` location:

```powershell
# Aliases for Azure
Set-Alias -Name azg -Value 'az group'
Set-Alias -Name azc -Value 'az container'
Set-Alias -Name aza -Value 'az webapp'

# Function to setup environment
function Setup-Azure {
    $registryName = "myproductregistry"
    $resourceGroup = "rg-product-app"
    $appServiceName = "product-app-dev"
    
    Set-Item -Path Env:REGISTRY_NAME -Value $registryName
    Set-Item -Path Env:RESOURCE_GROUP -Value $resourceGroup
    Set-Item -Path Env:APP_SERVICE_NAME -Value $appServiceName
    
    Write-Host "Azure environment variables set"
}

# Function to push Docker image
function Push-DockerImage {
    param(
        [string]$ImageName = "product-frontend:latest",
        [string]$RegistryUrl = "$env:REGISTRY_NAME.azurecr.io/product-frontend:latest"
    )
    
    docker tag $ImageName $RegistryUrl
    docker push $RegistryUrl
}
```

## Storage for Credentials

### Secure Storage
**DO NOT** store credentials in code or scripts!

Options:
1. **Azure Key Vault** - Recommended
2. **Azure DevOps Secrets** - For pipeline variables
3. **Environment Variables** - Local development only
4. **Git Credentials Manager** - For GitHub

### Example: Use Azure Key Vault
```powershell
# Store secret
az keyvault secret set --vault-name "mykeyvault" --name "docker-password" --value "your-password"

# Retrieve secret
az keyvault secret show --vault-name "mykeyvault" --name "docker-password"
```

## Performance Tips

### Speed Up Docker Builds
1. Exclude unnecessary files in `.dockerignore` ✓
2. Order Dockerfile layers by change frequency
3. Use BuildKit:
   ```powershell
   $env:DOCKER_BUILDKIT=1
   docker build -t product-frontend:latest .
   ```

### Optimize Azure Resources
- Use B1 App Service Plan for dev/testing (cheapest)
- Use Standard tier for production
- Enable autoscale for production
- Set up alerts for cost control

## Next Steps

1. ✅ Install prerequisites
2. ✅ Create Azure resources
3. ✅ Push Docker image to ACR
4. ✅ Setup Azure DevOps pipeline
5. ✅ Configure App Service
6. ✅ Test continuous deployment
7. Monitor and iterate

## Costs

**Estimated Monthly Cost:**
- App Service B1: ~$10-15
- Container Registry (Basic): ~$5
- Data storage: ~$1
- **Total: ~$16-21/month** for dev/test

## Support Resources

- Docker: https://docs.docker.com/
- Azure CLI: https://learn.microsoft.com/cli/azure/
- Azure DevOps: https://learn.microsoft.com/en-us/azure/devops/
- Troubleshooting: https://learn.microsoft.com/en-us/azure/app-service/troubleshoot-deployment-local-git
