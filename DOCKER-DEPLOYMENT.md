# Docker-Based Deployment for SVCE Registration Form

## Overview
This setup uses Docker containers to deploy both the frontend and backend, connecting to your existing PostgreSQL database.

## Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Your College Server                       │
│                     (100.78.37.57)                         │
├─────────────────────────────────────────────────────────────┤
│  Existing Setup:                                            │
│  ├── PostgreSQL (Docker) ──────────── Port 5434            │
│  └── Flask App ────────────────────── Port 5001            │
│                                                             │
│  New SVCE Registration:                                     │
│  ├── Frontend (Nginx) ─────────────── Port 8080            │
│  ├── Backend API (Node.js) ───────── Port 3001            │
│  └── Docker Network ──────────────── svce-network          │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites
- Docker and Docker Compose installed on your server
- Your existing PostgreSQL database running
- SSH access to your server

## Deployment Steps

### Step 1: Upload Files to Server

```bash
# Create project directory on server
ssh svce@100.78.37.57 "mkdir -p /home/svce/svce-registration-docker"

# Upload all files to server
scp -r SVCE-REGISTRATION-FORM/* svce@100.78.37.57:/home/svce/svce-registration-docker/
```

### Step 2: Prepare for Docker Deployment

```bash
# SSH to your server
ssh svce@100.78.37.57
cd /home/svce/svce-registration-docker

# Make sure we use the Docker-optimized files
cp index-docker.html index.html
cp database-config-docker.js database-config.js

# Verify Docker is installed
docker --version
docker-compose --version
```

### Step 3: Create Database Table

Before starting the containers, create the required table:

```bash
# Connect to your existing database
psql -h localhost -p 5434 -U postgres -d admission_dash
# Password: 123456
```

Run this SQL:
```sql
CREATE TABLE IF NOT EXISTS admission_enquiries (
    id SERIAL PRIMARY KEY,
    token_number VARCHAR(20) NOT NULL UNIQUE,
    enquiry_date DATE NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    father_name VARCHAR(100) NOT NULL,
    mother_name VARCHAR(100),
    student_email VARCHAR(100) NOT NULL,
    student_mobile VARCHAR(15) NOT NULL,
    father_mobile VARCHAR(15) NOT NULL,
    mother_mobile VARCHAR(15),
    address TEXT NOT NULL,
    reference VARCHAR(100),
    education_qualification VARCHAR(50),
    education_board VARCHAR(50),
    physics_marks DECIMAL(5,2),
    chemistry_marks DECIMAL(5,2),
    mathematics_marks DECIMAL(5,2) NOT NULL,
    cs_marks DECIMAL(5,2),
    bio_marks DECIMAL(5,2),
    ece_marks DECIMAL(5,2),
    total_percentage DECIMAL(5,2) NOT NULL,
    pcm_percentage DECIMAL(5,2) NOT NULL,
    jee_rank INTEGER,
    comedk_rank INTEGER,
    cet_rank INTEGER,
    diploma_percentage DECIMAL(5,2),
    dcet_rank INTEGER,
    course_preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_token_number ON admission_enquiries(token_number);
CREATE INDEX IF NOT EXISTS idx_enquiry_date ON admission_enquiries(enquiry_date);

\q
```

### Step 4: Build and Start Containers

```bash
# Build and start all services
docker-compose up -d --build

# Check if containers are running
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 5: Verify Deployment

1. **Check API Health:**
   ```bash
   curl http://100.78.37.57:3001/api/health
   # Should return: {"status":"OK","message":"Database connection successful"}
   ```

2. **Check Frontend:**
   ```bash
   curl http://100.78.37.57:8080
   # Should return HTML content
   ```

3. **Open in Browser:**
   - Frontend: `http://100.78.37.57:8080`
   - API: `http://100.78.37.57:3001/api/health`

### Step 6: Test Complete Flow

1. Open `http://100.78.37.57:8080` in your browser
2. Fill out the registration form
3. Submit the form
4. Verify data in database:
   ```bash
   psql -h localhost -p 5434 -U postgres -d admission_dash
   SELECT * FROM admission_enquiries ORDER BY created_at DESC LIMIT 5;
   ```

## Docker Commands Reference

### Basic Operations
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f [service_name]

# Check status
docker-compose ps
```

### Maintenance
```bash
# Update and rebuild
docker-compose down
docker-compose up -d --build

# View container logs
docker logs svce-registration-frontend
docker logs svce-registration-backend

# Execute commands in containers
docker exec -it svce-registration-backend sh
docker exec -it svce-registration-frontend sh
```

### Troubleshooting
```bash
# Check container health
docker-compose ps
docker inspect svce-registration-backend
docker inspect svce-registration-frontend

# Check network connectivity
docker network ls
docker network inspect svce-registration-docker_svce-network

# Test database connection from backend container
docker exec -it svce-registration-backend sh
wget -qO- http://localhost:3001/api/health
```

## Port Configuration

| Service | Internal Port | External Port | Purpose |
|---------|---------------|---------------|---------|
| Frontend (Nginx) | 8080 | 8080 | Web interface |
| Backend (Node.js) | 3001 | 3001 | API server |
| PostgreSQL | 5432 | 5434 | Database (existing) |
| Flask App | 5000 | 5001 | Your existing app |

## Environment Variables

The backend container uses these environment variables:
- `DB_HOST=100.78.37.57` (your existing database)
- `DB_PORT=5434` (your existing database port)
- `DB_NAME=admission_dash`
- `DB_USER=postgres`
- `DB_PASSWORD=123456`
- `PORT=3001`

## Security Considerations

1. **Firewall Configuration:**
   ```bash
   sudo ufw allow 8080  # Frontend
   sudo ufw allow 3001  # Backend API
   ```

2. **Database Security:**
   - Consider changing default password
   - Create dedicated database user
   - Use environment files for sensitive data

3. **Container Security:**
   - Containers run as non-root users
   - Only necessary ports are exposed
   - Regular security updates

## Backup and Monitoring

### Database Backup
```bash
# Create backup
docker exec -t your-postgres-container pg_dump -U postgres admission_dash > backup.sql

# Restore backup
docker exec -i your-postgres-container psql -U postgres admission_dash < backup.sql
```

### Monitoring
```bash
# Monitor resource usage
docker stats

# Check container health
docker-compose ps
```

## Production Considerations

1. **SSL/HTTPS:** Set up reverse proxy with SSL certificates
2. **Load Balancing:** Use multiple container instances if needed
3. **Logging:** Configure centralized logging
4. **Monitoring:** Set up health checks and alerts
5. **Backups:** Automated database backups

## Updating the Application

```bash
# Pull latest changes
git pull  # if using git

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Or update specific service
docker-compose up -d --build svce-registration-frontend
```

## Integration with Existing Setup

This Docker deployment:
- ✅ Uses your existing PostgreSQL database
- ✅ Doesn't interfere with your Flask app (different ports)
- ✅ Connects to your existing Docker network if needed
- ✅ Maintains all existing functionality
- ✅ Provides isolated, scalable deployment