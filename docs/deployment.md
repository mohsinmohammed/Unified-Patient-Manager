# Deployment Guide

## Overview

This guide covers deploying the Unified Patient Manager application to production environments. The application can be deployed using Docker containers or as a standalone Node.js application.

---

## Prerequisites

Before deployment, ensure you have:

- **Node.js** 18 or higher
- **PostgreSQL** 16 or higher
- **Docker & Docker Compose** (for containerized deployment)
- **Domain name** with DNS configured
- **SSL certificate** for HTTPS
- **SMTP email service** account
- **Stripe account** (for payment processing)

---

## Environment Configuration

### Required Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@hostname:5432/database_name"

# Authentication
JWT_SECRET="<generate-secure-random-string-min-32-chars>"
JWT_EXPIRATION="24h"

# Encryption (exactly 32 characters)
ENCRYPTION_KEY="<generate-32-character-key>"

# Application
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
PORT=3001

# Email Service (SMTP)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASS="<your-sendgrid-api-key>"
SMTP_FROM="noreply@your-domain.com"

# Payment Processing
STRIPE_SECRET_KEY="sk_live_<your-stripe-secret-key>"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_<your-stripe-publishable-key>"

# Optional: Monitoring
SENTRY_DSN="https://your-sentry-dsn"
LOG_LEVEL="info"
```

### Generating Secure Keys

```bash
# Generate JWT_SECRET (32+ characters)
openssl rand -base64 32

# Generate ENCRYPTION_KEY (exactly 32 characters)
openssl rand -hex 16

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Deployment Methods

## Option 1: Docker Deployment (Recommended)

### Step 1: Create Dockerfile

The application includes a `Dockerfile`. Review and customize if needed:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3001

ENV PORT 3001

CMD ["node", "server.js"]
```

### Step 2: Create docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: patient_manager_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: ${DB_NAME:-unified_patient_manager}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: patient_manager_app
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://${DB_USER:-postgres}:${DB_PASSWORD:-postgres}@db:5432/${DB_NAME:-unified_patient_manager}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRATION: ${JWT_EXPIRATION:-24h}
      ENCRYPTION_KEY: ${ENCRYPTION_KEY}
      NODE_ENV: production
      NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL}
      PORT: 3001
      SMTP_HOST: ${SMTP_HOST}
      SMTP_PORT: ${SMTP_PORT}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASS: ${SMTP_PASS}
      SMTP_FROM: ${SMTP_FROM}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
    ports:
      - "3001:3001"
    volumes:
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: patient_manager_nginx
    restart: unless-stopped
    depends_on:
      - app
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
    driver: local

networks:
  default:
    name: patient_manager_network
```

### Step 3: Create nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3001;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name your-domain.com www.your-domain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security Headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com; frame-src https://js.stripe.com;" always;

        # Gzip Compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

        # Rate limiting for auth endpoints
        location ~ ^/api/auth/.*/login {
            limit_req zone=auth_limit burst=10 nodelay;
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Rate limiting for API endpoints
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Static files caching
        location /_next/static/ {
            proxy_pass http://app;
            proxy_cache_valid 200 60m;
            expires 365d;
            add_header Cache-Control "public, immutable";
        }

        # All other requests
        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Health check endpoint
        location /health {
            access_log off;
            proxy_pass http://app/api/health;
        }
    }
}
```

### Step 4: Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f app

# Check service status
docker-compose ps

# Run database migrations
docker-compose exec app npx prisma migrate deploy

# Seed database (if needed)
docker-compose exec app npx prisma db seed

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

---

## Option 2: Manual Deployment (VPS/Dedicated Server)

### Step 1: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL 16
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install -y postgresql-16

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Step 2: Setup Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE unified_patient_manager;
CREATE USER patient_manager_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE unified_patient_manager TO patient_manager_user;
\q
```

### Step 3: Deploy Application

```bash
# Clone repository
cd /var/www
git clone <your-repo-url> unified-patient-manager
cd unified-patient-manager

# Install dependencies
npm ci --production

# Create .env file
sudo nano .env
# (Paste environment variables)

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Build application
npm run build

# Start with PM2
pm2 start npm --name "patient-manager" -- start
pm2 save
pm2 startup
```

### Step 4: Configure Nginx

```bash
# Create nginx configuration
sudo nano /etc/nginx/sites-available/patient-manager

# (Paste nginx.conf content from above)

# Enable site
sudo ln -s /etc/nginx/sites-available/patient-manager /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Step 5: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is setup automatically
sudo certbot renew --dry-run
```

---

## Database Management

### Backups

**Automated Daily Backups**:

```bash
#!/bin/bash
# /usr/local/bin/backup-db.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="unified_patient_manager"

pg_dump -U patient_manager_user -h localhost $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

# Copy to S3 (optional)
# aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://your-bucket/backups/
```

**Setup Cron Job**:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-db.sh
```

### Restore from Backup

```bash
# Stop application
docker-compose stop app
# or
pm2 stop patient-manager

# Restore database
gunzip -c /backups/backup_20251129_020000.sql.gz | psql -U patient_manager_user -h localhost unified_patient_manager

# Start application
docker-compose start app
# or
pm2 start patient-manager
```

---

## Monitoring & Logging

### Application Logs

**Docker Deployment**:
```bash
# View real-time logs
docker-compose logs -f app

# View last 100 lines
docker-compose logs --tail=100 app

# Save logs to file
docker-compose logs app > logs/app-$(date +%Y%m%d).log
```

**PM2 Deployment**:
```bash
# View logs
pm2 logs patient-manager

# View error logs only
pm2 logs patient-manager --err

# Clear logs
pm2 flush
```

### Health Checks

Create health check endpoint:

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 503 });
  }
}
```

**Setup Uptime Monitoring**:

Use services like:
- UptimeRobot (https://uptimerobot.com)
- Pingdom (https://www.pingdom.com)
- StatusCake (https://www.statuscake.com)

Monitor endpoint: `https://your-domain.com/api/health`

---

## Scaling Considerations

### Horizontal Scaling

**Load Balancer Setup** (nginx):

```nginx
upstream app_cluster {
    least_conn;
    server app1:3001;
    server app2:3001;
    server app3:3001;
}

server {
    listen 443 ssl http2;
    
    location / {
        proxy_pass http://app_cluster;
    }
}
```

**Considerations**:
- Use external PostgreSQL service (AWS RDS, Azure Database)
- Share session state via Redis
- Centralized logging (ELK Stack, CloudWatch)

### Database Connection Pooling

Update `DATABASE_URL`:

```env
DATABASE_URL="postgresql://user:password@host:5432/db?connection_limit=20&pool_timeout=10"
```

### CDN for Static Assets

Configure CDN (Cloudflare, AWS CloudFront) for:
- `/_next/static/*` - Next.js static files
- `/public/*` - Public assets

---

## Security Hardening

### Firewall Configuration

```bash
# Allow SSH, HTTP, HTTPS only
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Fail2Ban for Brute Force Protection

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Create custom rule for application
sudo nano /etc/fail2ban/jail.local
```

```ini
[patient-manager]
enabled = true
port = 80,443
filter = patient-manager
logpath = /var/log/nginx/access.log
maxretry = 5
bantime = 3600
```

### Regular Updates

```bash
# Setup automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check logs
docker-compose logs app
# or
pm2 logs patient-manager

# Check environment variables
docker-compose exec app env
# or
pm2 env 0

# Verify database connection
docker-compose exec app npx prisma db pull
```

### Database Connection Errors

```bash
# Test PostgreSQL connection
psql -U patient_manager_user -h localhost -d unified_patient_manager

# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection limit
SELECT count(*) FROM pg_stat_activity;
```

### High Memory Usage

```bash
# Check memory usage
docker stats
# or
pm2 monit

# Restart application
docker-compose restart app
# or
pm2 restart patient-manager
```

### SSL Certificate Issues

```bash
# Test certificate
sudo certbot certificates

# Renew manually
sudo certbot renew

# Check nginx configuration
sudo nginx -t
```

---

## Rollback Procedures

### Application Rollback

```bash
# Docker
docker-compose down
git checkout <previous-commit>
docker-compose up -d --build

# PM2
git checkout <previous-commit>
npm ci
npm run build
pm2 restart patient-manager
```

### Database Rollback

```bash
# Restore from backup (see Database Management section)

# Or rollback migrations
npx prisma migrate resolve --rolled-back <migration-name>
```

---

## Checklist for Production Launch

- [ ] SSL certificate installed and auto-renewal configured
- [ ] Environment variables set with production values
- [ ] Database backups configured and tested
- [ ] Monitoring and alerting setup
- [ ] Firewall rules configured
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] CORS configured for production domain
- [ ] Logs rotation configured
- [ ] Health check endpoint tested
- [ ] Error tracking setup (Sentry/Rollbar)
- [ ] DNS records configured
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] HIPAA compliance verified
- [ ] Documentation updated

---

**Last Updated**: November 29, 2025  
**Version**: 1.0.0  
**Maintained By**: Development Team
