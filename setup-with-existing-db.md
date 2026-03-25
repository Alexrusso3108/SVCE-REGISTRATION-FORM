# SVCE Registration Form - Connect to Existing Docker Database

## Your Current Setup
- PostgreSQL 15 running in Docker container
- Database accessible at: `100.78.37.57:5434`
- Flask app running on port: `5001`
- Database name: `postgres`
- Username: `postgres`
- Password: `postgres` (update if different)

## Quick Setup Steps

### Step 1: Create the Registration Table in Your Existing Database

Connect to your existing PostgreSQL database and create the registration table:

```bash
# SSH to your college server
ssh svce@100.78.37.57

# Connect to your PostgreSQL database
psql -h localhost -p 5434 -U postgres -d postgres
```

Then run this SQL to create the registration table:

```sql
-- Create the admission enquiries table in your existing database
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
    
    -- Diploma Information (for diploma students)
    diploma_percentage DECIMAL(5,2),
    dcet_rank INTEGER,
    
    -- Course Preferences (stored as JSON)
    course_preferences JSONB,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_token_number ON admission_enquiries(token_number);
CREATE INDEX IF NOT EXISTS idx_enquiry_date ON admission_enquiries(enquiry_date);
CREATE INDEX IF NOT EXISTS idx_student_email ON admission_enquiries(student_email);
CREATE INDEX IF NOT EXISTS idx_created_at ON admission_enquiries(created_at);

-- Create trigger for updating timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admission_enquiries_timestamp
BEFORE UPDATE ON admission_enquiries
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Verify table creation
\dt admission_enquiries
\d admission_enquiries
```

### Step 2: Set Up the Backend API

```bash
# On your college server, create the backend directory
mkdir -p /home/svce/svce-registration-backend
cd /home/svce/svce-registration-backend

# Copy the backend files (you'll need to upload these)
# For now, create the basic structure:
```

Upload the backend files to your server:

```bash
# From your local machine, upload the backend folder
scp -r SVCE-REGISTRATION-FORM/backend/* svce@100.78.37.57:/home/svce/svce-registration-backend/
```

Then on your server:

```bash
cd /home/svce/svce-registration-backend

# Install Node.js if not already installed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit the environment file with correct values
nano .env
```

Make sure your `.env` file contains:
```env
DB_TYPE=postgresql
DB_HOST=100.78.37.57
DB_PORT=5434
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3001
```

### Step 3: Start the Backend API

```bash
# Test the connection first
npm start

# If successful, set up PM2 for production
npm install -g pm2
pm2 start server.js --name "svce-registration-api"
pm2 startup
pm2 save
```

### Step 4: Test the Setup

1. **Test API Health:**
   ```bash
   curl http://100.78.37.57:3001/api/health
   ```

2. **Test Database Connection:**
   ```bash
   # Should return: {"status":"OK","message":"Database connection successful"}
   ```

3. **Test from Frontend:**
   - Open your registration form
   - Check browser console for connection status
   - Try submitting a test form

### Step 5: Update Frontend Configuration

The configuration files are already updated to use:
- Database: `100.78.37.57:5434`
- API: `http://100.78.37.57:3001/api`

### Step 6: Verify Data Storage

After submitting a form, check if data is stored:

```sql
-- Connect to database
psql -h localhost -p 5434 -U postgres -d postgres

-- Check if data was inserted
SELECT * FROM admission_enquiries ORDER BY created_at DESC LIMIT 5;

-- Check table structure
\d admission_enquiries
```

## Troubleshooting

### Common Issues:

1. **Port Conflicts:**
   - Your Flask app uses port 5001
   - Our API uses port 3001
   - PostgreSQL uses port 5434 (external)

2. **Database Connection:**
   ```bash
   # Test direct connection
   psql -h 100.78.37.57 -p 5434 -U postgres -d postgres
   ```

3. **Firewall Issues:**
   ```bash
   # Check if port 3001 is accessible
   sudo ufw allow 3001
   ```

4. **Docker Network:**
   - Make sure your Docker containers are running
   - Check with: `docker ps`

### Logs:
```bash
# Check API logs
pm2 logs svce-registration-api

# Check Docker logs
docker logs <container_name>
```

## Security Notes

Since you're using the default PostgreSQL credentials, consider:
1. Changing the default password
2. Creating a dedicated user for the registration app
3. Limiting permissions for the registration user

```sql
-- Create dedicated user (optional)
CREATE USER svce_registration WITH PASSWORD 'secure_password';
GRANT SELECT, INSERT, UPDATE ON admission_enquiries TO svce_registration;
GRANT USAGE, SELECT ON SEQUENCE admission_enquiries_id_seq TO svce_registration;
```

## Next Steps

1. Test the complete flow
2. Set up regular backups of the `admission_enquiries` table
3. Consider adding an admin interface to view submissions
4. Monitor the API performance and logs