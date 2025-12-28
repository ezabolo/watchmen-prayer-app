# Watchmen Prayer Movement - AWS Lightsail Deployment Guide

This comprehensive guide covers deploying your application to AWS Lightsail using either VPS or Container methods.

---

## Pre-deployment Checklist

### 1. Assets and Uploads
The application uses two types of assets:
- **Static Assets**: Logo, background images, etc. (stored in `attached_assets/`)
- **Dynamic Uploads**: User-uploaded content like training videos, event images (stored in `uploads/`)

### 2. Environment Variables Required
```bash
# Database
DATABASE_URL=your_postgresql_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key

# PayPal (for payments)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id

# SendGrid (for emails)
SENDGRID_API_KEY=SG.your_sendgrid_api_key

# OAuth (optional)
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

### 3. Build Process
```bash
# Build the application
npm run build

# Copy assets for production (run this after build)
bash copy-assets.sh

# Start production server
npm start
```

### 4. Static File Serving
The application serves:
- **Frontend assets**: From `dist/public/` (built by Vite)
- **User uploads**: From `uploads/` directory via `/uploads/*` route
- **Static images**: From `attached_assets/` via asset imports

### 5. Database Setup
```bash
# Push database schema
npm run db:push
```

## AWS Lightsail Deployment

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Application Deployment
```bash
# Clone repository
git clone your_repository_url
cd prayer-watchman

# Install dependencies
npm install

# Set environment variables
nano .env.production

# Build application
npm run build

# Copy assets
bash copy-assets.sh

# Start with PM2
pm2 start dist/index.js --name "prayer-watchman"
pm2 save
pm2 startup
```

### 3. Nginx Configuration (Optional)
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve uploads with proper caching
    location /uploads/ {
        proxy_pass http://localhost:5000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 4. SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## Docker Container Deployment (Alternative)

If you prefer container-based deployment, use this method for easier scaling and management.

### 1. Prerequisites
- Docker installed locally
- AWS CLI v2 installed
- Lightsail Control Plugin installed

```bash
# Install AWS CLI v2 (macOS)
brew install awscli

# Install Lightsail control plugin (macOS)
brew install aws/tap/lightsailctl

# Configure AWS CLI
aws configure
```

### 2. Create Lightsail Container Service

1. Go to Lightsail Console → **Containers** → **Create container service**
2. Choose configuration:
   - **Power:** Micro ($10/mo) or Small ($40/mo)
   - **Scale:** 1 (can increase later)
   - **Name:** `watchmen-prayer-app`

### 3. Build and Push Docker Image

```bash
# Build Docker image locally
docker build -t watchmen-prayer-app .

# Push to Lightsail Container Service
aws lightsail push-container-image \
  --service-name watchmen-prayer-app \
  --label latest \
  --image watchmen-prayer-app \
  --region us-east-1

# Note the image name returned (e.g., :watchmen-prayer-app.latest.1)
```

### 4. Create Deployment Configuration

Create `lightsail-deployment.json`:

```json
{
  "containers": {
    "app": {
      "image": ":watchmen-prayer-app.latest.1",
      "ports": {
        "5000": "HTTP"
      },
      "environment": {
        "NODE_ENV": "production",
        "DATABASE_URL": "postgresql://user:pass@host:5432/db",
        "SENDGRID_API_KEY": "your-key",
        "JWT_SECRET": "your-secret"
      }
    }
  },
  "publicEndpoint": {
    "containerName": "app",
    "containerPort": 5000,
    "healthCheck": {
      "path": "/",
      "intervalSeconds": 30
    }
  }
}
```

### 5. Deploy Container

```bash
aws lightsail create-container-service-deployment \
  --service-name watchmen-prayer-app \
  --cli-input-json file://lightsail-deployment.json \
  --region us-east-1
```

### 6. Access Your App

Your app will be available at:
`https://watchmen-prayer-app.[region].cs.amazonlightsail.com`

---

## Updating the Application

### VPS Update Process

```bash
cd /path/to/app

# Pull latest changes
git pull origin main

# Install new dependencies
npm ci

# Rebuild
npm run build

# Push database changes
npm run db:push

# Restart PM2
pm2 restart watchmen-prayer-app
```

### Container Update Process

```bash
# Rebuild and push new image
docker build -t watchmen-prayer-app .
aws lightsail push-container-image \
  --service-name watchmen-prayer-app \
  --label latest \
  --image watchmen-prayer-app

# Create new deployment with updated image version
aws lightsail create-container-service-deployment \
  --service-name watchmen-prayer-app \
  --cli-input-json file://lightsail-deployment.json
```

---

## Cost Estimation

| Deployment Type | Component | Monthly Cost |
|-----------------|-----------|-------------|
| **VPS** | Lightsail 1GB Instance | $5 |
| | Lightsail PostgreSQL DB | $15 |
| | Static IP | Free |
| | SSL (Let's Encrypt) | Free |
| | **Total** | **~$20** |
| **Container** | Lightsail Container (Micro) | $10 |
| | AWS RDS PostgreSQL | ~$15 |
| | **Total** | **~$25** |

---

## Troubleshooting

### Images Not Loading
1. Check if `uploads/` directory exists and has proper permissions
2. Verify environment variables are set
3. Ensure static file serving is configured correctly
4. Check browser console for 404 errors

### Database Connection Issues
1. Verify `DATABASE_URL` is correct
2. Check if database exists and is accessible
3. Run `npm run db:push` to ensure schema is up to date

### Payment Issues
1. Verify Stripe/PayPal credentials are correct
2. Check if webhooks are configured (for production)
3. Ensure proper SSL certificate for payment processing

## Security Considerations for OWASP 10 Testing

### 1. Input Validation
- All user inputs are validated using Zod schemas
- File uploads are restricted by type and size
- SQL injection prevented by using Drizzle ORM

### 2. Authentication & Authorization
- JWT-based authentication with secure tokens
- Role-based access control (Admin, User, Partner)
- Password hashing using bcryptjs

### 3. Secure Headers
- Content Security Policy (CSP) should be configured
- HTTPS redirect should be enforced
- Secure cookie settings for sessions

### 4. File Upload Security
- File type validation on upload
- File size limits (200MB max)
- Uploaded files served with proper MIME types

### 5. Database Security
- Parameterized queries via ORM
- Environment-based connection strings
- No direct SQL execution from user input