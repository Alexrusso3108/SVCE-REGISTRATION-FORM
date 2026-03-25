# Deploy SVCE Registration Form to Your College Server

## Current Setup:
- **Server IP:** 100.78.37.57 (via Tailscale)
- **Database:** PostgreSQL running in Docker (port 5434)
- **Existing Flask App:** Running on port 5001
- **Available Ports:** 3001 (for our API), 8080 (for frontend)

## Deployment Steps:

### Step 1: Upload Frontend Files

```bash
# Create frontend directory on server
ssh svce@100.78.37.57 "mkdir -p /home/svce/svce-registration-frontend"

# Upload all frontend files (from your local machine)
scp SVCE-REGISTRATION-FORM/*.html svce@100.78.37.57:/home/svce/svce-registration-frontend/
scp SVCE-REGISTRATION-FORM/*.css svce@100.78.37.57:/home/svce/svce-registration-frontend/
scp SVCE-REGISTRATION-FORM/*.js svce@100.78.37.57:/home/svce/svce-registration-frontend/
scp SVCE-REGISTRATION-FORM/*.jpg svce@100.78.37.57:/home/svce/svce-registration-frontend/

# Or upload everything at once
scp -r SVCE-REGISTRATION-FORM/* svce@100.78.37.57:/home/svce/svce-registration-frontend/
```

### Step 2: Set Up Frontend Web Server

```bash
# SSH to your server
ssh svce@100.78.37.57

# Navigate to frontend directory
cd /home/svce/svce-registration-frontend

# Option A: Use Python HTTP Server
python3 -m http.server 8080

# Option B: Use Node.js HTTP Server
npm install -g http-server
http-server -p 8080

# Option C: Use Nginx (recommended for production)
sudo apt update
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/svce-registration
```

### Step 3: Nginx Configuration (Recommended)

Create `/etc/nginx/sites-available/svce-registration`:

```nginx
server {
    listen 8080;
    server_name 100.78.37.57;
    
    root /home/svce/svce-registration-frontend;
    index index.html index-custom-db.html;
    
    # Serve static files
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/svce-registration /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: Deploy Backend API

```bash
# Upload backend files
scp -r SVCE-REGISTRATION-FORM/backend/* svce@100.78.37.57:/home/svce/svce-registration-backend/

# SSH to server and set up backend
ssh svce@100.78.37.57
cd /home/svce/svce-registration-backend

# Install Node.js if not installed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5434
DB_NAME=admission_dash
DB_USER=postgres
DB_PASSWORD=123456
PORT=3001
EOF

# Start with PM2 for production
npm install -g pm2
pm2 start server.js --name "svce-registration-api"
pm2 startup
pm2 save
```

### Step 5: Create Database Table

```bash
# Connect to database and create table
psql -h localhost -p 5434 -U postgres -d admission_dash
# Password: 123456
```

Run the SQL from previous setup to create `admission_enquiries` table.

### Step 6: Update Frontend Configuration

On the server, update the database configuration to use localhost:

```bash
cd /home/svce/svce-registration-frontend

# Update database-config.js for server deployment
cat > database-config.js << 'EOF'
// Database configuration for server deployment
const DB_CONFIG = {
    host: 'localhost',        // Use localhost when running on same server
    port: 5434,
    database: 'admission_dash',
    username: 'postgres',
    password: '123456'
};

const API_CONFIG = {
    baseURL: 'http://100.78.37.57:3001/api',  // External API access
    endpoints: {
        admissions: '/admissions',
        health: '/health'
    }
};

// Rest of the configuration remains the same...
EOF
```

### Step 7: Access Your Deployed Application

**Frontend:** http://100.78.37.57:8080
**API:** http://100.78.37.57:3001/api
**Health Check:** http://100.78.37.57:3001/api/health

## Alternative: Simple Deployment

If you want a quick deployment without Nginx:

```bash
# SSH to server
ssh svce@100.78.37.57

# Create and navigate to frontend directory
mkdir -p /home/svce/svce-registration-frontend
cd /home/svce/svce-registration-frontend

# Start simple HTTP server
python3 -m http.server 8080 &

# The & runs it in background
```

## Port Summary:
- **5001:** Your existing Flask app
- **5434:** PostgreSQL database (Docker mapped)
- **3001:** SVCE Registration API
- **8080:** SVCE Registration Frontend

## Testing Deployment:

1. **Test API:** `curl http://100.78.37.57:3001/api/health`
2. **Test Frontend:** Open `http://100.78.37.57:8080` in browser
3. **Test Form:** Submit a registration and check database

## Security Considerations:

1. **Firewall:** Open required ports
   ```bash
   sudo ufw allow 8080
   sudo ufw allow 3001
   ```

2. **SSL/HTTPS:** Consider setting up SSL certificates for production

3. **Database Security:** The current setup uses basic authentication