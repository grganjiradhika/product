# Docker & Azure CI/CD Pipeline Setup Guide

## Prerequisites
- Azure Account (free tier available at https://azure.microsoft.com/free/)
- GitHub/Azure DevOps Repository
- Docker Desktop (for local testing)
- Azure CLI installed

## Step-by-Step Setup

### **Step 1: Prepare Your Repository**

1. **Initialize Git (if not already done)**
   ```bash
   cd e:\product
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create `.gitignore` in root (if missing)**
   ```bash
   node_modules/
   dist/
   .env.local
   .DS_Store
   *.log
   ```

### **Step 2: Create Azure Resources**

#### 2.1 Create a Resource Group
```bash
az group create --name rg-product-app --location eastus
```

#### 2.2 Create Azure Container Registry (ACR)
```bash
az acr create --resource-group rg-product-app \
  --name yourregistryname \
  --sku Basic \
  --location eastus
```
Replace `yourregistryname` with a unique name (lowercase, no hyphens).

#### 2.3 Create App Service Plan
```bash
az appservice plan create \
  --name product-app-plan \
  --resource-group rg-product-app \
  --sku B1 \
  --is-linux
```

#### 2.4 Create Web App (for Containers)
```bash
az webapp create \
  --resource-group rg-product-app \
  --plan product-app-plan \
  --name your-app-service-name \
  --deployment-container-image-name yourregistryname.azurecr.io/product-frontend:latest
```

### **Step 3: Get Registry Credentials**

```bash
az acr credential show --resource-group rg-product-app --name yourregistryname
```

Note down:
- `username`
- `password`

### **Step 4: Local Docker Testing**

1. **Build the Docker image locally**
   ```bash
   cd frontend
   docker build -t product-frontend:latest .
   ```

2. **Run and test locally**
   ```bash
   docker run -p 3000:3000 product-frontend:latest
   ```
   
   Access at: http://localhost:3000

3. **Stop the container**
   ```bash
   docker ps
   docker stop <container-id>
   ```

### **Step 5: Push to Azure Container Registry**

1. **Login to your ACR**
   ```bash
   az acr login --name yourregistryname
   ```

2. **Tag your image**
   ```bash
   docker tag product-frontend:latest yourregistryname.azurecr.io/product-frontend:latest
   ```

3. **Push to ACR**
   ```bash
   docker push yourregistryname.azurecr.io/product-frontend:latest
   ```

### **Step 6: Configure Azure Pipelines**

#### 6.1 Push code to repository
- Create a GitHub/Azure DevOps repository
- Push your project:
  ```bash
  git remote add origin https://github.com/yourusername/your-repo.git
  git branch -M main
  git push -u origin main
  ```

#### 6.2 Create Pipeline in Azure DevOps

1. Go to https://dev.azure.com/
2. Create a new project
3. Go to **Pipelines** → **Create Pipeline**
4. Select your repository (GitHub or Azure Repos)
5. Choose "Existing Azure Pipelines YAML file"
6. Select `/azure-pipelines.yml`
7. Review and **Save and queue**

#### 6.3 Update variables in `azure-pipelines.yml`

Edit the file with your actual values:
```yaml
variables:
  dockerRegistryServiceConnection: 'your-acr-service-connection'
  containerRegistry: 'yourregistryname.azurecr.io'  # Replace with your ACR name
```

### **Step 7: Configure Azure DevOps Service Connection**

1. In Azure DevOps, go to **Project Settings** → **Service connections**
2. Click **New service connection**
3. Select **Azure Container Registry**
4. Fill in your ACR details:
   - Registry: `yourregistryname.azurecr.io`
   - Username: (from credential show)
   - Password: (from credential show)
5. Name it: `your-registry-connection`

### **Step 8: Deploy to App Service**

1. In App Service, go to **Deployment Center**
2. Select **Azure Pipelines**
3. Configure to deploy from your pipeline
4. Or manually deploy:
   ```bash
   az webapp config container set \
     --name your-app-service-name \
     --resource-group rg-product-app \
     --docker-custom-image-name yourregistryname.azurecr.io/product-frontend:latest \
     --docker-registry-server-url https://yourregistryname.azurecr.io \
     --docker-registry-server-user <username> \
     --docker-registry-server-password <password>
   ```

### **Step 9: Configure Environment Variables**

1. Go to **App Service** → **Configuration**
2. Add Application Settings:
   - `VITE_API_BASE_URL`: Your API endpoint
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth ID
   - `VITE_STRIPE_PUBLIC_KEY`: Your Stripe key

### **Step 10: Test Your Deployment**

1. Visit your app: `https://your-app-service-name.azurewebsites.net`
2. Check logs in Azure DevOps Pipeline
3. Monitor in App Service → **Log stream**

## Verification Checklist

- [ ] Docker image builds locally
- [ ] Container runs on port 3000
- [ ] Image pushed to ACR
- [ ] Azure Pipeline triggers on code push
- [ ] Pipeline builds and tests successfully
- [ ] Image deployed to App Service
- [ ] App accessible at live URL
- [ ] Environment variables configured
- [ ] HTTPS working

## Troubleshooting

### Pipeline Fails to Build
- Check Node.js version in Dockerfile matches your project
- Verify npm cache: `npm ci` instead of `npm install`
- Check build logs in Azure DevOps

### App Won't Start
- Check App Service logs: **Monitoring** → **Log stream**
- Verify environment variables are set
- Check container is running: `docker ps`

### Cannot Push to ACR
- Verify ACR credentials: `az acr credential show`
- Check Docker is logged in: `docker login yourregistryname.azurecr.io`

## Next Steps: Interview Practice Topics

1. **Explain your pipeline** - CI/CD stages, benefits
2. **Docker knowledge** - Multi-stage builds, image optimization
3. **Azure services** - ACR, App Service, how they integrate
4. **Scaling** - How to scale the application
5. **Monitoring** - Application Insights integration
6. **Security** - Secret management, access control

## Additional Resources

- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Azure Pipelines YAML](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema)
- [Azure App Service Documentation](https://learn.microsoft.com/en-us/azure/app-service/)
- [Azure Container Registry](https://learn.microsoft.com/en-us/azure/container-registry/)
