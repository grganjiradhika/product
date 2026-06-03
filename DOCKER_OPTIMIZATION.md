# Docker Image Optimization Guide

## Current Multi-Stage Build Benefits

Your Dockerfile uses a 2-stage build:

### Stage 1: Builder
- Installs dependencies
- Builds the application
- Produces `dist` folder

### Stage 2: Production
- Only copies the built artifacts
- Uses `serve` to run the static files
- Smaller final image size

## Image Size Optimization

### Current Size (Estimated)
```
Builder stage: ~600 MB (node:18-alpine + dependencies)
Final image: ~400-450 MB (only dist folder + serve)
```

### Further Optimization

#### Option 1: Use Nginx (Recommended for Production)
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**nginx.conf:**
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location ~* \.(?:css|js|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Image size: ~50-70 MB** (much smaller!)

#### Option 2: Use Distroless (Minimal)
```dockerfile
FROM gcr.io/distroless/nodejs18-debian11
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
```

## Build Optimization

### 1. Use `.dockerignore`
Already configured in your project ✓

### 2. Layer Caching
```dockerfile
# Good - stable dependencies layer
COPY package*.json ./
RUN npm ci

# Changes frequently - separate layer
COPY . .
RUN npm run build
```

### 3. Use npm ci instead of npm install
Already configured ✓

## Performance Tips

1. **Build Caching**
   ```bash
   docker build --cache-from yourregistry.azurecr.io/product-frontend:latest .
   ```

2. **Parallel Multi-stage Builds**
   ```bash
   docker buildx build --platform linux/amd64,linux/arm64 -t yourimage:latest .
   ```

3. **Azure Container Registry Tasks**
   ```bash
   az acr task create --registry yourregistry \
     --name product-frontend \
     --file Dockerfile \
     --context https://github.com/yourrepo \
     --branch main \
     --platform linux
   ```

## Security Considerations

### Current Setup Issues
- Running as root
- No vulnerability scanning

### Improvements

#### 1. Run as Non-Root User (Nginx)
```dockerfile
FROM nginx:alpine
RUN addgroup -g 101 www-data && \
    adduser -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G www-data -g www-data www-data
USER www-data
```

#### 2. Enable Image Scanning
```bash
az acr config content-trust show --registry yourregistry
az acr config content-trust update --registry yourregistry --status Enabled
```

#### 3. Use Signed Images
```bash
az acr task create --registry yourregistry \
  --name sign-image \
  --file Dockerfile \
  --assign-identity [system]
```

## Monitoring & Insights

Add Application Insights to your React app:

**package.json:**
```json
{
  "dependencies": {
    "@microsoft/applicationinsights-web": "^2.8.0"
  }
}
```

**main.jsx:**
```javascript
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: 'YOUR-KEY'
  }
});
appInsights.loadAppInsights();
```

## Production Checklist

- [ ] Image size < 100MB
- [ ] Running as non-root user
- [ ] Health checks configured
- [ ] Environment variables externalized
- [ ] Content security policies set
- [ ] Image scanning enabled
- [ ] Logging configured
- [ ] Metrics and monitoring active
