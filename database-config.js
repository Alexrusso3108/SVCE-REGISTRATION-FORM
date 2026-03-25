// Database configuration for college server
// Replace Supabase with direct database connection

// =================================================================
// IMPORTANT: Replace these values with your actual database credentials
// =================================================================

// College server database configuration (using your existing Docker setup)
const DB_CONFIG = {
    host: '100.78.37.57',     // Your Tailscale IP (external access)
    port: 5434,               // Your Docker-mapped PostgreSQL port
    database: 'admission_dash', // Your actual database name
    username: 'postgres',     // Your existing database username
    password: '123456',       // Your actual database password
    
    // Docker container details
    containerPort: 5432,      // Internal container port
    hostPort: 5434           // External host port
};

// API endpoint configuration (we'll use a different port to avoid conflict with your Flask app)
const API_CONFIG = {
    baseURL: `http://${DB_CONFIG.host}:3001/api`,  // Using port 3001 to avoid conflict with Flask on 5001
    endpoints: {
        admissions: '/admissions',
        health: '/health'
    }
};

// Database connection methods
class DatabaseConnection {
    constructor() {
        this.config = DB_CONFIG;
        this.apiConfig = API_CONFIG;
    }

    // Method to test database connection
    async testConnection() {
        try {
            const response = await fetch(`${this.apiConfig.baseURL}${this.apiConfig.endpoints.health}`);
            if (response.ok) {
                console.log('✅ Database connection successful');
                return true;
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            return false;
        }
    }

    // Method to submit admission enquiry
    async submitEnquiry(formData) {
        try {
            const response = await fetch(`${this.apiConfig.baseURL}${this.apiConfig.endpoints.admissions}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return { data: result, error: null };
        } catch (error) {
            console.error('Error submitting enquiry:', error);
            return { data: null, error: error.message };
        }
    }

    // Method to get existing enquiries (for token checking)
    async getEnquiries(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters);
            const response = await fetch(`${this.apiConfig.baseURL}${this.apiConfig.endpoints.admissions}?${queryParams}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return { data: result, error: null };
        } catch (error) {
            console.error('Error fetching enquiries:', error);
            return { data: null, error: error.message };
        }
    }
}

// Initialize database connection
const dbConnection = new DatabaseConnection();

// Export for use in other scripts
window.dbConnection = dbConnection;