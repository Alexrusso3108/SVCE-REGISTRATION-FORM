# Quick Setup with Your Database Credentials

## Your Database Configuration:
- **Host:** `100.78.37.57` (via Tailscale)
- **Port:** `5434` (Docker mapped port)
- **Database:** `admission_dash`
- **Username:** `postgres`
- **Password:** `123456`

## Step 1: Test Database Connection

First, let's verify we can connect to your database:

```bash
cd SVCE-REGISTRATION-FORM
npm install
npm run test-db
```

## Step 2: Create Registration Table

Connect to your database and create the table:

```bash
# SSH to your college server
ssh svce@100.78.37.57

# Connect to your admission_dash database
psql -h localhost -p 5434 -U postgres -d admission_dash
# When prompted, enter password: 123456
```

Then run this SQL:

```sql
-- Create the admission enquiries table
CREATE TABLE IF NOT EXISTS admission_enquiries (
    id SERIAL PRIMARY KEY,
    token_number VARCHAR(20) NOT NULL UNIQUE,
    enquiry_date DATE NOT NULL,
    
    -- Personal Information
    student_name VARCHAR(100) NOT NULL,
    father_name VARCHAR(100) NOT NULL,
    mother_name VARCHAR(100),
    
    -- Contact Information
    student_email VARCHAR(100) NOT NULL,
    student_mobile VARCHAR(15) NOT NULL,
    father_mobile VARCHAR(15) NOT NULL,
    mother_mobile VARCHAR(15),
    address TEXT NOT NULL,
    reference VARCHAR(100),
    
    -- Educational Information
    education_qualification VARCHAR(50),
    education_board VARCHAR(50),
    
    -- Academic Marks (12th standard)
    physics_marks DECIMAL(5,2),
    chemistry_marks DECIMAL(5,2),
    mathematics_marks DECIMAL(5,2) NOT NULL,
    cs_marks DECIMAL(5,2),
    bio_marks DECIMAL(5,2),
    ece_marks DECIMAL(5,2),
    
    -- Percentages
    total_percentage DECIMAL(5,2) NOT NULL,
    pcm_percentage DECIMAL(5,2) NOT NULL,
    
    -- Entrance Exam Ranks
    jee_rank INTEGER,
    comedk_rank INTEGER,
    cet_rank INTEGER,
    
    -- Diploma Information
    diploma_percentage DECIMAL(5,2),
    dcet_rank INTEGER,
    
    -- Course Preferences (JSON)
    course_preferences JSONB,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_token_number ON admission_enquiries(token_number);
CREATE INDEX IF NOT EXISTS idx_enquiry_date ON admission_enquiries(enquiry_date);
CREATE INDEX IF NOT EXISTS idx_student_email ON admission_enquiries(student_email);

-- Verify table creation
\dt admission_enquiries
\d admission_enquiries

-- Exit psql
\q
```

## Step 3: Set Up Backend API

```bash
# Create backend directory on your server
mkdir -p /home/svce/svce-registration-backend

# Upload backend files (from your local machine)
scp -r SVCE-REGISTRATION-FORM/backend/* svce@100.78.37.57:/home/svce/svce-registration-backend/

# SSH to server
ssh svce@100.78.37.57
cd /home/svce/svce-registration-backend

# Install dependencies
npm install

# Create environment file with your credentials
cat > .env << EOF
DB_TYPE=postgresql
DB_HOST=100.78.37.57
DB_PORT=5434
DB_NAME=admission_dash
DB_USER=postgres
DB_PASSWORD=123456
PORT=3001
EOF

# Test the server
npm start
```

## Step 4: Test API Endpoints

```bash
# Test health endpoint
curl http://100.78.37.57:3001/api/health

# Should return: {"status":"OK","message":"Database connection successful"}
```

## Step 5: Set Up Production (Optional)

```bash
# Install PM2 for production
npm install -g pm2

# Start with PM2
pm2 start server.js --name "svce-registration-api"
pm2 startup
pm2 save

# Check status
pm2 status
```

## Step 6: Test Frontend

1. **Start your local web server:**
   ```bash
   cd SVCE-REGISTRATION-FORM
   python -m http.server 8000
   ```

2. **Open browser:** `http://localhost:8000`

3. **Check console:** Look for database connection status

4. **Test form submission:** Fill and submit the form

## Step 7: Verify Data Storage

```bash
# Connect to database
psql -h 100.78.37.57 -p 5434 -U postgres -d admission_dash

# Check submitted data
SELECT * FROM admission_enquiries ORDER BY created_at DESC LIMIT 5;
```

## Troubleshooting

### If connection fails:
```bash
# Check if Docker containers are running
docker ps

# Check if port 5434 is accessible
telnet 100.78.37.57 5434

# Check API logs
pm2 logs svce-registration-api
```

### If table creation fails:
- Make sure you're connected to the correct database (`admission_dash`)
- Check if you have CREATE permissions
- Verify the database exists: `\l` in psql

## Security Note

Your database password (`123456`) is visible in the configuration. For production, consider:
1. Using environment variables
2. Creating a dedicated user with limited permissions
3. Using a stronger password

## Next Steps

Once everything is working:
1. Test with multiple form submissions
2. Set up regular database backups
3. Monitor API performance
4. Consider adding an admin interface to view submissions