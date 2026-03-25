// Database configuration for Docker deployment
// This version uses the Docker service names and internal networking

const DB_CONFIG = {
    host: '100.78.37.57',     // External database host (your existing DB)
    port: 5434,               // External database port
    database: 'admission_dash',
    username: 'postgres',
    password: '123456'
};

// API configuration for Docker deployment
const API_CONFIG = {
    // Use relative path since nginx will proxy /api/ requests to backend
    baseURL: '/api',
    endpoints: {
        admissions: '/admissions',
        health: '/health'
    }
};

// Database connection methods (same as before)
class DatabaseConnection {
    constructor() {
        this.config = DB_CONFIG;
        this.apiConfig = API_CONFIG;
    }

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