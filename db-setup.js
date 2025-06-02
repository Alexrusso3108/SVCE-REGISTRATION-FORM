// Database setup and testing script

document.addEventListener('DOMContentLoaded', async function() {
    const setupStatus = document.createElement('div');
    setupStatus.id = 'db-setup-status';
    setupStatus.style.padding = '15px';
    setupStatus.style.margin = '15px 0';
    setupStatus.style.backgroundColor = '#f8f9fa';
    setupStatus.style.border = '1px solid #e1e4e8';
    setupStatus.style.borderRadius = '4px';
    setupStatus.style.fontFamily = 'monospace';
    setupStatus.style.whiteSpace = 'pre-wrap';
    setupStatus.style.display = 'none'; // Hidden by default
    
    document.querySelector('.container').prepend(setupStatus);
    
    // Database setup happens automatically on page load
    // The setup button has been removed as requested by the user
    
    // Run the database check silently in the background
    // This ensures the database is properly set up without user interaction
    checkAndSetupDatabase();

    
    async function checkAndSetupDatabase() {
        try {
            log('🔄 Checking Supabase connection...');
            
            // Test connection
            const { data, error } = await supabase.from('admission_enquiries').select('count').limit(1);
            
            if (error && error.code === '42P01') { // Relation does not exist
                log('⚠️ Tables do not exist yet. Creating database structure...');
                await createDatabaseStructure();
            } else if (error) {
                throw error;
            } else {
                log('✅ Connection successful! Tables already exist.');
                checkExistingData();
            }
        } catch (error) {
            log(`❌ Error: ${error.message}`);
            if (error.message.includes('Failed to fetch')) {
                log('\n⚠️ Connection error: Check your Supabase URL and API key in supabase-config.js');
            }
        }
    }
    
    async function createDatabaseStructure() {
        try {
            // Create main table
            log('Creating admission_enquiries table...');
            const { error: createTableError } = await supabase.rpc('create_admission_enquiries_table');
            
            if (createTableError) {
                if (createTableError.message.includes('function "create_admission_enquiries_table" does not exist')) {
                    log('⚠️ Database setup requires SQL execution privileges.');
                    log('Please run these SQL commands in your Supabase SQL Editor:');
                    log('\n-- Main applicant information table');
                    log(`CREATE TABLE admission_enquiries (\n    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    token_number VARCHAR(20) NOT NULL UNIQUE,\n    enquiry_date DATE NOT NULL,\n    student_name VARCHAR(100) NOT NULL,\n    student_email VARCHAR(100) NOT NULL,\n    student_mobile VARCHAR(15) NOT NULL,\n    father_name VARCHAR(100) NOT NULL,\n    father_mobile VARCHAR(15) NOT NULL,\n    mother_name VARCHAR(100),\n    mother_mobile VARCHAR(15),\n    address TEXT NOT NULL,\n    reference VARCHAR(100),\n    \n    -- Board information\n    education_board VARCHAR(50),\n    \n    -- Academic details\n    physics_marks NUMERIC NOT NULL,\n    chemistry_marks NUMERIC NOT NULL,\n    mathematics_marks NUMERIC NOT NULL,\n    cs_marks NUMERIC,\n    bio_marks NUMERIC,\n    ece_marks NUMERIC,\n    pcm_percentage NUMERIC(5,2) NOT NULL,\n    total_percentage NUMERIC(5,2) NOT NULL,\n    \n    -- For Andhra Pradesh/Telangana students (11th grade marks)\n    physics_marks_11 NUMERIC,\n    chemistry_marks_11 NUMERIC,\n    mathematics_marks_11 NUMERIC,\n    \n    -- Entrance exam details\n    jee_rank INTEGER,\n    comedk_rank INTEGER,\n    cet_rank INTEGER,\n    \n    -- Course preferences stored as JSON\n    course_preferences JSONB,\n    \n    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);`);
                    
                    // Course preferences now stored as JSONB field in admission_enquiries table
                    
                    log('\n-- Create indexes');
                    log(`CREATE INDEX idx_token_number ON admission_enquiries(token_number);
CREATE INDEX idx_enquiry_date ON admission_enquiries(enquiry_date);
CREATE INDEX idx_course_preferences ON admission_enquiries USING gin(course_preferences);`);
                    
                    log('\n-- Add trigger for updating timestamp');
                    log(`CREATE OR REPLACE FUNCTION update_modified_column()\nRETURNS TRIGGER AS $$\nBEGIN\n    NEW.updated_at = NOW();\n    RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER update_admission_enquiries_timestamp\nBEFORE UPDATE ON admission_enquiries\nFOR EACH ROW\nEXECUTE FUNCTION update_modified_column();`);
                } else {
                    throw createTableError;
                }
            } else {
                log('✅ Tables created successfully!');
            }
        } catch (error) {
            log(`❌ Error creating tables: ${error.message}`);
        }
    }
    
    async function checkExistingData() {
        try {
            // Check existing records
            const { data: enquiryCount, error: countError } = await supabase
                .from('admission_enquiries')
                .select('id', { count: 'exact', head: true });
            
            if (countError) throw countError;
            
            const count = enquiryCount?.length || 0;
            log(`\nℹ️ Existing records in database: ${count}`);
            
        } catch (error) {
            log(`❌ Error checking data: ${error.message}`);
        }
    }
    
    function log(message) {
        setupStatus.innerHTML += message + '\n';
        console.log(message);
    }
});
