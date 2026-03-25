# Server Setup Commands

## Step 1: SSH to Your College Server
```bash
ssh svce@100.78.37.57
```

## Step 2: Create Project Directory
```bash
# Create main directory for SVCE registration
mkdir -p /home/svce/svce-registration-docker
cd /home/svce/svce-registration-docker

# Check current directory
pwd
ls -la
```

## Step 3: Clone Repository (Option A - Recommended)
```bash
# Clone your repository directly
git clone https://github.com/Alexrusso3108/SVCE-REGISTRATION-FORM.git .

# Or if you want to clone into a subdirectory:
# git clone https://github.com/Alexrusso3108/SVCE-REGISTRATION-FORM.git svce-registration
# cd svce-registration
```

## Step 4: Alternative - Manual Upload (Option B)
If git clone doesn't work, you can upload files manually from your local machine:

```bash
# From your local machine (run this in a new terminal)
scp -r SVCE-REGISTRATION-FORM/* svce@100.78.37.57:/home/svce/svce-registration-docker/
```

## Step 5: Verify Files on Server
```bash
# Back on the server, check if all files are present
ls -la
ls -la backend/
ls -la *.yml
ls -la Dockerfile*
```

## Step 6: Check Docker Installation
```bash
# Check if Docker is installed
docker --version
docker-compose --version

# If not installed, install Docker:
# curl -fsSL https://get.docker.com -o get-docker.sh
# sudo sh get-docker.sh
# sudo usermod -aG docker $USER
# sudo systemctl start docker
# sudo systemctl enable docker

# Install Docker Compose if needed:
# sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
# sudo chmod +x /usr/local/bin/docker-compose
```

## Step 7: Prepare for Docker Deployment
```bash
# Make sure we use the Docker-optimized files
cp index-docker.html index.html
cp database-config-docker.js database-config.js

# Check if files are ready
ls -la index.html
ls -la database-config.js
ls -la docker-compose.yml
```

## Step 8: Create Database Table (IMPORTANT!)
```bash
# Connect to your existing database first
psql -h localhost -p 5434 -U postgres -d admission_dash
# Password: 123456
```

Then run this SQL (copy from DOCKER-DEPLOYMENT.md):
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

CREATE INDEX IF NOT EXISTS idx_token_number ON admission_enquiries(token_number);
CREATE INDEX IF NOT EXISTS idx_enquiry_date ON admission_enquiries(enquiry_date);

-- Verify table creation
\dt admission_enquiries
\d admission_enquiries
\q
```

## Step 9: Deploy with Docker
```bash
# Build and start containers
docker-compose up -d --build

# Check if containers are running
docker-compose ps

# View logs to check for any issues
docker-compose logs -f
```

## Step 10: Test Deployment
```bash
# Test API health
curl http://localhost:3001/api/health
curl http://100.78.37.57:3001/api/health

# Test frontend
curl http://localhost:8080
curl http://100.78.37.57:8080

# Check container status
docker ps
```

## Step 11: Open Firewall Ports (if needed)
```bash
# Allow access to the new ports
sudo ufw allow 8080  # Frontend
sudo ufw allow 3001  # Backend API

# Check firewall status
sudo ufw status
```

## Final Access URLs:
- **Frontend:** http://100.78.37.57:8080
- **API Health:** http://100.78.37.57:3001/api/health
- **Your existing Flask app:** http://100.78.37.57:5001 (unchanged)

## Troubleshooting Commands:
```bash
# If containers fail to start:
docker-compose logs backend
docker-compose logs frontend

# If database connection fails:
docker exec -it svce-registration-backend sh
wget -qO- http://localhost:3001/api/health

# Restart containers:
docker-compose restart

# Stop and remove containers:
docker-compose down

# Rebuild and restart:
docker-compose down && docker-compose up -d --build
```