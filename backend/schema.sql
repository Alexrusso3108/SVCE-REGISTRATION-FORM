-- Database schema for SVCE Registration Form
-- Run this on your college server database

-- Create database (if it doesn't exist)
-- CREATE DATABASE svce_admissions;

-- Use the database
-- USE svce_admissions; -- For MySQL
-- \c svce_admissions; -- For PostgreSQL

-- Main admission enquiries table
CREATE TABLE IF NOT EXISTS admission_enquiries (
    id SERIAL PRIMARY KEY,  -- Use AUTO_INCREMENT for MySQL
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
    course_preferences JSON,  -- Use TEXT for MySQL < 5.7
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_token_number ON admission_enquiries(token_number);
CREATE INDEX idx_enquiry_date ON admission_enquiries(enquiry_date);
CREATE INDEX idx_student_email ON admission_enquiries(student_email);
CREATE INDEX idx_created_at ON admission_enquiries(created_at);

-- For PostgreSQL: Create trigger for updating timestamp
-- CREATE OR REPLACE FUNCTION update_modified_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = NOW();
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER update_admission_enquiries_timestamp
-- BEFORE UPDATE ON admission_enquiries
-- FOR EACH ROW
-- EXECUTE FUNCTION update_modified_column();

-- Sample data (optional - for testing)
-- INSERT INTO admission_enquiries (
--     token_number, enquiry_date, student_name, father_name, mother_name,
--     student_email, student_mobile, father_mobile, mother_mobile,
--     address, reference, education_qualification, education_board,
--     physics_marks, chemistry_marks, mathematics_marks,
--     total_percentage, pcm_percentage,
--     course_preferences
-- ) VALUES (
--     '25/03/2026/01', '2026-03-25', 'JOHN DOE', 'FATHER NAME', 'MOTHER NAME',
--     'john.doe@email.com', '9876543210', '9876543211', '9876543212',
--     '123 Main Street, City, State', 'Friend Reference', '12th', 'Karnataka',
--     85.5, 88.0, 92.0, 88.5, 88.5,
--     '[{"order": 1, "course": "BE Computer Science and Engineering"}]'
-- );