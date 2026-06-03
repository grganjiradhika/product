# Quick Start Checklist - CI/CD Pipeline

## Phase 1: Local Testing (Today - ~30 mins)
- [ ] Review `Dockerfile` in `frontend/`
- [ ] Test Docker build:
  ```bash
  cd frontend
  docker build -t product-frontend:latest .
  ```
- [ ] Run locally:
  ```bash
  docker run -p 3000:3000 product-frontend:latest
  ```
- [ ] Access at http://localhost:3000
- [ ] Stop container: `docker stop <container-id>`

## Phase 2: Azure Setup (Tomorrow - ~45 mins)
- [ ] Create Azure Account (free tier)
- [ ] Install Azure CLI
- [ ] Run setup script (Windows PowerShell):
  ```powershell
  # Convert bash script to PowerShell or run manually:
  az group create --name rg-product-app --location eastus
  az acr create --resource-group rg-product-app --name yourregistryname --sku Basic
  az appservice plan create --name product-app-plan --resource-group rg-product-app --sku B1 --is-linux
  az webapp create --resource-group rg-product-app --plan product-app-plan --name your-app-name --deployment-container-image-name yourregistryname.azurecr.io/product-frontend:latest
  ```
- [ ] Get ACR credentials:
  ```bash
  az acr credential show --resource-group rg-product-app --name yourregistryname
  ```
- [ ] Save credentials securely

## Phase 3: Push to Repository (~15 mins)
- [ ] Create GitHub repository
- [ ] Initialize git in project:
  ```bash
  cd e:\product
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/yourusername/your-repo.git
  git branch -M main
  git push -u origin main
  ```
- [ ] Verify code is on GitHub

## Phase 4: Azure Pipelines Setup (~30 mins)
- [ ] Create Azure DevOps project
- [ ] Go to **Pipelines** → **New Pipeline**
- [ ] Select repository (GitHub)
- [ ] Choose "Existing Azure Pipelines YAML file"
- [ ] Select `azure-pipelines.yml`
- [ ] **Edit** the pipeline and update variables:
  ```yaml
  variables:
    containerRegistry: 'yourregistryname.azurecr.io'  # Update this
    imageRepository: 'product-frontend'
  ```
- [ ] Create **Service Connection** for ACR:
  - Project Settings → Service connections
  - New → Azure Container Registry
  - Add your ACR credentials
  - Name: `acr-connection`
- [ ] Update pipeline variable `dockerRegistryServiceConnection: 'acr-connection'`
- [ ] Save and queue the pipeline

## Phase 5: App Service Deployment (~15 mins)
- [ ] Go to App Service in Azure Portal
- [ ] Navigate to **Deployment Center**
- [ ] Select **Azure Pipelines**
- [ ] Configure image and registry settings
- [ ] Verify deployment triggers automatically on code push

## Phase 6: Environment Configuration (~10 mins)
- [ ] Go to App Service → **Configuration**
- [ ] Add Application Settings:
  ```
  VITE_API_BASE_URL = https://your-api.com/api
  VITE_GOOGLE_CLIENT_ID = your-google-id
  VITE_STRIPE_PUBLIC_KEY = your-stripe-key
  ```
- [ ] Save settings (triggers restart)

## Phase 7: Test & Verify (~10 mins)
- [ ] Access app at: `https://your-app-name.azurewebsites.net`
- [ ] Check pipeline ran successfully
- [ ] Check App Service logs:
  - **Monitoring** → **Log stream**
- [ ] Verify app loads without errors
- [ ] Test a feature (e.g., API call, Google login)

## Phase 8: Continuous Deployment (~5 mins)
- [ ] Make a code change locally
- [ ] Push to main branch:
  ```bash
  git add .
  git commit -m "Test change"
  git push
  ```
- [ ] Watch pipeline trigger automatically
- [ ] After pipeline completes, app should be updated automatically
- [ ] Refresh live site to verify change

## Interview Talking Points

### 1. Architecture & Design
- "I implemented a containerized CI/CD pipeline using Docker and Azure"
- "Multi-stage Docker build for optimized image size"
- "Automated deployment triggered on code commits"

### 2. Technologies Used
- **Docker**: Containerization, multi-stage builds
- **Azure Container Registry**: Image storage and management
- **Azure App Service**: Hosting and auto-scaling
- **Azure Pipelines**: CI/CD orchestration
- **GitHub/Azure Repos**: Version control

### 3. Pipeline Stages
1. **Build**: Install dependencies, lint, build with Vite
2. **Docker**: Create container image and push to registry
3. **Deploy**: Deploy to App Service automatically

### 4. Key Decisions
- "Why multi-stage builds?" → Smaller production images, better security
- "Why App Service?" → Simple deployment, built-in scaling, monitoring
- "Why ACR?" → Private image storage, tight Azure integration

### 5. Challenges Overcome
- Environment variable management
- Docker health checks
- Pipeline credential security
- Staging vs Production environments

### 6. What You'd Improve
- Add multiple environments (dev, staging, prod)
- Implement Docker image scanning for vulnerabilities
- Add monitoring with Application Insights
- Set up auto-scaling policies
- Add approval gates before production
- Implement blue-green deployments

## Commands Reference

### Docker
```bash
docker build -t name:tag .
docker run -p 3000:3000 name:tag
docker ps
docker logs <container-id>
docker stop <container-id>
docker rm <container-id>
```

### Git
```bash
git status
git add .
git commit -m "message"
git push
git pull
```

### Azure CLI
```bash
az group create --name rg --location eastus
az acr list --output table
az webapp list --output table
az acr credential show --registry name
```

### Azure DevOps
- Create Pipeline
- Create Service Connection
- View Pipeline Logs
- Manage Secrets in Library

## Resources
- [Azure Free Account](https://azure.microsoft.com/free/)
- [Docker Documentation](https://docs.docker.com/)
- [Azure DevOps Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/)
- [Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/)

## Time Estimate
Total setup time: **2-3 hours** (depending on Azure account setup)
After initial setup: **5 minutes** per deployment (fully automated)

## Support
If pipeline fails:
1. Check Azure DevOps Logs
2. Check App Service Log Stream
3. Review Docker build output
4. Verify environment variables
5. Check image in ACR
