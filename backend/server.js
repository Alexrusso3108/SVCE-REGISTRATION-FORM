const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database configuration - Choose your database type
const DB_TYPE = process.env.DB_TYPE || 'postgresql'; // 'postgresql' or 'mysql'

let db;

// Initialize database connection based on type
if (DB_TYPE === 'postgresql') {
    const { Pool } = require('pg');
    db = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'svce_admissions',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
    });
} else if (DB_TYPE === 'mysql') {
    const mysql = require('mysql2/promise');
    db = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        database: process.env.DB_NAME || 'svce_admissions',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
    });
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        if (DB_TYPE === 'postgresql') {
            await db.query('SELECT 1');
        } else if (DB_TYPE === 'mysql') {
            await db.execute('SELECT 1');
        }
        res.json({ status: 'OK', message: 'Database connection successful' });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ status: 'ERROR', message: 'Database connection failed' });
    }
});

// Get admissions (with optional filters)
app.get('/api/admissions', async (req, res) => {
    try {
        const { token_number, date, limit = 100 } = req.query;
        
        let query = 'SELECT * FROM admission_enquiries';
        let params = [];
        let whereConditions = [];

        if (token_number) {
            whereConditions.push(`token_number = $${params.length + 1}`);
            params.push(token_number);
        }

        if (date) {
            whereConditions.push(`enquiry_date = $${params.length + 1}`);
            params.push(date);
        }

        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
        }

        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));

        let result;
        if (DB_TYPE === 'postgresql') {
            result = await db.query(query, params);
        } else if (DB_TYPE === 'mysql') {
            // Convert PostgreSQL syntax to MySQL
            const mysqlQuery = query.replace(/\$(\d+)/g, '?');
            result = await db.execute(mysqlQuery, params);
        }

        const rows = DB_TYPE === 'postgresql' ? result.rows : result[0];
        res.json(rows);
    } catch (error) {
        console.error('Error fetching admissions:', error);
        res.status(500).json({ error: 'Failed to fetch admissions' });
    }
});

// Create new admission enquiry
app.post('/api/admissions', async (req, res) => {
    try {
        const {
            token_number,
            enquiry_date,
            student_name,
            father_name,
            mother_name,
            student_email,
            student_mobile,
            father_mobile,
            mother_mobile,
            address,
            reference,
            education_qualification,
            education_board,
            physics_marks,
            chemistry_marks,
            mathematics_marks,
            cs_marks,
            bio_marks,
            ece_marks,
            total_percentage,
            pcm_percentage,
            jee_rank,
            comedk_rank,
            cet_rank,
            course_preferences,
            diploma_percentage,
            dcet_rank
        } = req.body;

        const insertQuery = `
            INSERT INTO admission_enquiries (
                token_number, enquiry_date, student_name, father_name, mother_name,
                student_email, student_mobile, father_mobile, mother_mobile,
                address, reference, education_qualification, education_board,
                physics_marks, chemistry_marks, mathematics_marks,
                cs_marks, bio_marks, ece_marks, total_percentage, pcm_percentage,
                jee_rank, comedk_rank, cet_rank, course_preferences,
                diploma_percentage, dcet_rank
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                $21, $22, $23, $24, $25, $26, $27
            ) RETURNING *
        `;

        // Helper function to safely parse integers
        const parseIntOrNull = (value) => {
            if (!value || value === '' || value === null || value === undefined) return null;
            const parsed = parseInt(value);
            return isNaN(parsed) ? null : parsed;
        };

        const values = [
            token_number, 
            enquiry_date, 
            student_name, 
            father_name, 
            mother_name,
            student_email, 
            student_mobile, 
            father_mobile, 
            mother_mobile,
            address, 
            reference, 
            education_qualification, 
            education_board,
            physics_marks, 
            chemistry_marks, 
            mathematics_marks,
            cs_marks, 
            bio_marks, 
            ece_marks, 
            total_percentage, 
            pcm_percentage,
            parseIntOrNull(jee_rank), 
            parseIntOrNull(comedk_rank), 
            parseIntOrNull(cet_rank), 
            JSON.stringify(course_preferences),
            diploma_percentage, 
            parseIntOrNull(dcet_rank)
        ];

        let result;
        if (DB_TYPE === 'postgresql') {
            result = await db.query(insertQuery, values);
        } else if (DB_TYPE === 'mysql') {
            const mysqlQuery = insertQuery.replace(/\$(\d+)/g, '?').replace('RETURNING *', '');
            result = await db.execute(mysqlQuery, values);
        }

        const insertedRow = DB_TYPE === 'postgresql' ? result.rows[0] : { id: result[0].insertId, ...req.body };
        res.status(201).json(insertedRow);
    } catch (error) {
        console.error('Error creating admission:', error);
        res.status(500).json({ error: 'Failed to create admission enquiry' });
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📊 Database type: ${DB_TYPE}`);
    console.log(`🔗 API endpoints:`);
    console.log(`   GET  /api/health - Health check`);
    console.log(`   GET  /api/admissions - Get admissions`);
    console.log(`   POST /api/admissions - Create admission`);
});

module.exports = app;