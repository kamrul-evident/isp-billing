# Network Setup Guide for ISP Billing System

## Overview
This guide explains how to configure the ISP Billing System to work properly on your local network, allowing other machines to access the application.

## Current Configuration Issues Fixed

### 1. Django Settings
- ✅ Added `192.168.68.108` to `ALLOWED_HOSTS`
- ✅ Added `http://192.168.68.108` and `http://192.168.68.108:80` to `CSRF_TRUSTED_ORIGINS`
- ✅ Added local network IP to `CORS_ALLOWED_ORIGINS`

### 2. Docker Compose
- ✅ Made environment variables configurable
- ✅ Updated frontend API URL to use relative URLs (better approach)
- ✅ Added proper fallback values for network configuration

### 3. Nginx Configuration
- ✅ Replaced wildcard CORS headers with specific origin mapping
- ✅ Added proper CORS origin handling for local network
- ✅ Fixed CORS credentials support

### 4. Frontend Configuration
- ✅ Updated API client to use relative URLs for automatic IP detection
- ✅ Made API URL configurable via environment variables
- ✅ **Key Improvement**: Relative URLs work from both localhost and network IPs

## Why Relative URLs Are Better

### The Problem with Hardcoded IPs
Previously, the frontend was hardcoded to use `http://192.168.68.108/api/v1`. This caused issues because:
- ✅ Works when accessing from `192.168.68.108`
- ❌ Fails when accessing from `localhost` (browser blocks mixed origins)
- ❌ Fails when your IP changes
- ❌ Requires manual configuration for each environment

### The Solution: Relative URLs
Now the frontend uses `/api/v1` which:
- ✅ Works from `localhost` → `http://localhost/api/v1`
- ✅ Works from `192.168.68.108` → `http://192.168.68.108/api/v1`
- ✅ Works from any IP address automatically
- ✅ No configuration changes needed when IP changes
- ✅ Follows web standards and best practices

### How It Works
1. **Nginx** handles all routing internally
2. **Frontend** makes API calls to relative URLs (e.g., `/api/v1/users`)
3. **Browser** automatically resolves these to the current domain
4. **No IP address conflicts** between localhost and network access

## Setup Instructions

### Step 1: Create Environment File
Copy the example environment file and update it with your configuration:

```bash
cp dotenv.local.example.txt .env
```

### Step 2: Update Environment Variables
Edit the `.env` file and ensure these values are set correctly:

```bash
# Your local machine IP address
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0,192.168.68.108
DJANGO_CSRF_TRUSTED_ORIGINS=http://localhost,http://127.0.0.1,http://localhost:3000,http://127.0.0.1:3000,http://localhost:80,http://127.0.0.1:80,http://192.168.68.108,http://192.168.68.108:80

# CORS Settings - Include your local network IP
CORS_ALLOWED_ORIGINS=http://localhost,http://127.0.0.1,http://localhost:3000,http://127.0.0.1:3000,http://localhost:80,http://127.0.0.1:80,http://192.168.68.108,http://192.168.68.108:80

# Frontend Settings - Use relative URLs (recommended)
NEXT_PUBLIC_API_URL=/api/v1
```

**Important**: 
- Replace `192.168.68.108` with your actual local machine IP address
- Keep `NEXT_PUBLIC_API_URL=/api/v1` for automatic IP detection

### Step 3: Rebuild and Restart Containers
```bash
# Stop existing containers
docker-compose down

# Rebuild containers with new configuration
docker-compose up --build -d

# Check container status
docker-compose ps
```

### Step 4: Verify Configuration
1. **From your machine**: Access `http://localhost` or `http://192.168.68.108`
2. **From other machines on the network**: Access `http://192.168.68.108`

### Step 5: Test API Endpoints
Test the API from other machines:
```bash
curl -X GET http://192.168.68.108/api/v1/users/
```

## Network Configuration Details

### Allowed Hosts
The system now accepts requests from:
- `localhost`
- `127.0.0.1`
- `0.0.0.0` (all interfaces)
- `192.168.68.108` (your local network IP)

### CORS Configuration
CORS is now properly configured for:
- Local development (`localhost`, `127.0.0.1`)
- Local network access (`192.168.68.108`)
- Both HTTP and HTTPS (if configured)
- Proper credentials handling

### CSRF Protection
CSRF tokens are now trusted for:
- Local development URLs
- Local network URLs
- API endpoints (exempted where appropriate)

## Troubleshooting

### Issue: "DisallowedHost" Error
**Solution**: Ensure your IP is in `DJANGO_ALLOWED_HOSTS` and restart Django.

### Issue: CORS Errors in Browser
**Solution**: Check that your IP is in `CORS_ALLOWED_ORIGINS` and restart containers.

### Issue: CSRF Token Errors
**Solution**: Verify your URL is in `CSRF_TRUSTED_ORIGINS` and restart Django.

### Issue: Frontend Can't Connect to API
**Solution**: Check `NEXT_PUBLIC_API_URL` in your `.env` file and restart the frontend container.

## Security Notes

1. **Development Only**: These settings are suitable for development and local network use
2. **Production**: For production deployment, restrict `ALLOWED_HOSTS` to your domain
3. **CORS**: In production, limit CORS origins to your frontend domain
4. **CSRF**: Ensure proper CSRF protection for production forms

## Network Access URLs

- **Frontend**: `http://192.168.68.108`
- **Backend API**: `http://192.168.68.108/api/v1`
- **Admin Interface**: `http://192.168.68.108/admin`
- **Static Files**: `http://192.168.68.108/static/`

## Next Steps

1. Test the application from other machines on your network
2. Update the IP address in `.env` if your machine's IP changes
3. Consider setting up a static IP address for your development machine
4. For production, configure proper domain names and SSL certificates