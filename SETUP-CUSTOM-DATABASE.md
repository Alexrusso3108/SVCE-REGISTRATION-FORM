# SVCE Registration Form - Custom Database Setup

This guide will help you connect the SVCE registration form to your college server database instead of Supabase.

## Prerequisites

- Your college server running at `100.78.37.57` (accessible via Tailscale)
- Database server (PostgreSQL/MySQL) running on your college server
- Node.js installed on your college server
- Database credentials

## Step 1: Database Setup

### 1.1 Connect to Your College Server
```bash
ssh svce@100.78.37.57
```

### 1.2 Create Database and Tables
1. Connect to your database server (PostgreSQL or MySQL)
2. Run the SQL commands from `backend/schema.sql`

**For PostgreSQL:**
```bash
psql -U your_username -d postgres
CREATE DATABASE svce_admissions;
\c svce_admissions
\i /path/to/schema.sql
```

**For MySQL:**
```bash
mysql -u your_username -p
CREATE DATABASE svce_admissions;
USE svce_admissions;
source /path/to/schema.sql;
```

## Step 2: Backend API Setup

### 2.1 Upload Backend Files
Upload the `backend/` folder to your college server:
```bash
scp -r backend/ svce@100.78.37.57:/home/svce/svce-registration-backend/
```

### 2.2 Install Dependencies
On your college server:
```bash
cd /home/svce/svce-registration-backend/
npm install
```

### 2.3 Configure Environment
```bash
cp .env.example .env
nano .env
```

Edit the `.env` file with your actual database credentials:
```env
DB_TYPE=postgresql  # or mysql
DB_HOST=localhost   # or your database server IP
DB_PORT=5432        # 5432 for PostgreSQL, 3306 for MySQL
DB_NAME=svce_admissions
DB_USER=your_actual_username
DB_PASSWORD=your_actual_password
PORT=3000
```

### 2.4 Start the Backend Server
```bash
npm start
# or for development with auto-restart:
npm run dev
```

The API will be available at `http://100.78.37.57:3000`

## Step 3: Frontend Configuration

### 3.1 Update Database Configuration
Edit `database-config.js` and update the configuration:

```javascript
const DB_CONFIG = {
    host: '100.78.37.57',
    port: 5432,  // or 3306 for MySQL
    database: 'svce_admissions',
    username: 'your_actual_username',
    password: 'your_actual_password'
};

const API_CONFIG = {
    baseURL: 'http://100.78.37.57:3000/api',
    endpoints: {
        admissions: '/admissions',
        health: '/health'
    }
};
```

### 3.2 Use the Custom Database Version
Instead of `index.html`, use `index-custom-db.html`:
```bash
# Rename files to switch to custom database
mv index.html index-supabase.html
mv index-custom-db.html index.html
mv script.js script-supabase.js
mv script-custom-db.js script.js
```

## Step 4: Testing

### 4.1 Test Database Connection
1. Open your browser and go to `http://localhost:8000` (or your local server)
2. Check the browser console for database connection status
3. Test the health endpoint: `http://100.78.37.57:3000/api/health`

### 4.2 Test Form Submission
1. Fill out the registration form
2. Submit the form
3. Check if data is saved in your database:

**PostgreSQL:**
```sql
SELECT * FROM admission_enquiries ORDER BY created_at DESC LIMIT 5;
```

**MySQL:**
```sql
SELECT * FROM admission_enquiries ORDER BY created_at DESC LIMIT 5;
```

## Step 5: Production Deployment

### 5.1 Process Manager (PM2)
Install PM2 for production deployment:
```bash
npm install -g pm2
cd /home/svce/svce-registration-backend/
pm2 start server.js --name "svce-registration-api"
pm2 startup
pm2 save
```

### 5.2 Nginx Configuration (Optional)
If you want to use Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name 100.78.37.57;

    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /path/to/your/frontend;
        index index.html;
        try_files $uri $uri/ =404;
    }
}
```

## Troubleshooting

### Common Issues:

1. **Connection Refused**
   - Check if the backend server is running
   - Verify the port is not blocked by firewall
   - Ensure Tailscale is connected

2. **Database Connection Error**
   - Verify database credentials in `.env`
   - Check if database server is running
   - Ensure database and tables exist

3. **CORS Issues**
   - The backend includes CORS middleware
   - If issues persist, check browser console for specific errors

4. **Token Generation Issues**
   - Check localStorage in browser
   - Verify database table structure matches schema

### Logs and Debugging:
```bash
# Check backend logs
pm2 logs svce-registration-api

# Check database logs (PostgreSQL)
sudo tail -f /var/log/postgresql/postgresql-*.log

# Check database logs (MySQL)
sudo tail -f /var/log/mysql/error.log
```

## Security Considerations

1. **Database Security**
   - Use strong passwords
   - Limit database user permissions
   - Consider using SSL connections

2. **API Security**
   - Implement rate limiting
   - Add input validation
   - Consider adding authentication for admin endpoints

3. **Network Security**
   - Keep Tailscale network secure
   - Consider using HTTPS in production
   - Regularly update dependencies

## Next Steps

After successful setup:
1. Test thoroughly with sample data
2. Set up regular database backups
3. Monitor server performance
4. Consider adding admin dashboard for viewing submissions
5. Implement email notifications (if needed)

## Support

If you encounter issues:
1. Check the logs first
2. Verify all configuration files
3. Test each component individually (database → API → frontend)
4. Ensure all services are running and accessible