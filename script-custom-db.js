// Modified script.js for custom database connection
// This replaces the Supabase functionality with direct database calls

// Token management functions (modified for custom database)
async function getCurrentToken() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    
    const dateKey = `token_${day}${month}${year}`;
    
    let counter = localStorage.getItem(dateKey);
    if (!counter) {
        counter = 1;
    } else {
        counter = parseInt(counter);
    }
    
    const formattedCounter = String(counter).padStart(2, '0');
    const token = `${day}/${month}/${year}/${formattedCounter}`;
    
    // Check if token exists in database
    const { data: existingTokens, error } = await dbConnection.getEnquiries({ token_number: token });
    
    if (error) {
        console.error('Error checking token:', error);
        return token;
    }
    
    if (existingTokens && existingTokens.length > 0) {
        counter++;
        localStorage.setItem(dateKey, counter);
        return getCurrentToken();
    }
    
    return token;
}

async function incrementToken() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    
    const dateKey = `token_${day}${month}${year}`;
    
    let counter = localStorage.getItem(dateKey);
    if (!counter) {
        counter = 1;
    } else {
        counter = parseInt(counter) + 1;
    }
    
    localStorage.setItem(dateKey, counter);
    
    const formattedCounter = String(counter).padStart(2, '0');
    const newToken = `${day}/${month}/${year}/${formattedCounter}`;
    
    const { data: existingTokens, error } = await dbConnection.getEnquiries({ token_number: newToken });
    
    if (error) {
        console.error('Error checking token:', error);
        return newToken;
    }
    
    if (existingTokens && existingTokens.length > 0) {
        return incrementToken();
    }
    
    console.log(`Token incremented. New token is: ${newToken}`);
    return newToken;
}

// Form submission handler (modified for custom database)
document.addEventListener('DOMContentLoaded', function() {
    // Test database connection on page load
    dbConnection.testConnection().then(connected => {
        if (connected) {
            console.log('Database connection established');
        } else {
            console.warn('Database connection failed - check configuration');
        }
    });

    // Set current date and token
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB');
    document.getElementById('enquiry-date').textContent = formattedDate;
    
    getCurrentToken().then(token => {
        document.getElementById('token-number').textContent = token;
    });

    // Form submission
    const form = document.getElementById('enquiryForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        try {
            // Get new token for submission
            const newToken = await incrementToken();
            
            // Collect form data
            const formData = {
                token_number: newToken,
                enquiry_date: new Date().toISOString().split('T')[0],
                student_name: document.getElementById('studentName').value,
                father_name: document.getElementById('fatherName').value,
                mother_name: document.getElementById('motherName').value,
                student_email: document.getElementById('studentEmail').value,
                student_mobile: document.getElementById('studentMobile').value,
                father_mobile: document.getElementById('fatherMobile').value,
                mother_mobile: document.getElementById('motherMobile').value,
                address: document.getElementById('address').value,
                reference: document.getElementById('reference').value,
                education_qualification: document.getElementById('educationalQualification').value,
                education_board: document.getElementById('educationBoard').value,
                
                // Academic marks
                physics_marks: parseFloat(document.getElementById('physics').value) || 0,
                chemistry_marks: parseFloat(document.getElementById('chemistry').value) || 0,
                mathematics_marks: parseFloat(document.getElementById('mathematics').value) || 0,
                cs_marks: parseFloat(document.getElementById('cs').value) || null,
                bio_marks: parseFloat(document.getElementById('bio').value) || null,
                ece_marks: parseFloat(document.getElementById('ece').value) || null,
                
                // Percentages
                total_percentage: parseFloat(document.getElementById('totalPercentage').value),
                pcm_percentage: parseFloat(document.getElementById('pcmPercentage').value),
                
                // Entrance exam ranks
                jee_rank: document.getElementById('jeeRank').value || null,
                comedk_rank: document.getElementById('comedk').value || null,
                cet_rank: document.getElementById('cetRank').value || null,
                
                // Course preferences
                course_preferences: getCoursePreferences(),
                
                // Diploma fields (if applicable)
                diploma_percentage: parseFloat(document.getElementById('diplomaPercentage').value) || null,
                dcet_rank: document.getElementById('dcetRank').value || null
            };

            // Submit to database
            const { data, error } = await dbConnection.submitEnquiry(formData);
            
            if (error) {
                throw new Error(error);
            }

            // Show success modal
            document.getElementById('tokenNumber').textContent = newToken;
            document.getElementById('successModal').style.display = 'block';
            
            // Update token display
            document.getElementById('token-number').textContent = newToken;

        } catch (error) {
            console.error('Submission error:', error);
            alert('Error submitting form: ' + error.message);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Helper function to get course preferences
    function getCoursePreferences() {
        const preferences = [];
        const checkboxes = document.querySelectorAll('.course-checkbox:checked');
        checkboxes.forEach((checkbox, index) => {
            preferences.push({
                order: index + 1,
                course: checkbox.value
            });
        });
        return preferences;
    }

    // Modal and other UI handlers (keep existing functionality)
    const modal = document.getElementById('successModal');
    const closeBtn = document.querySelector('.close');
    const printBtn = document.getElementById('printFormBtn');
    const resetBtn = document.getElementById('resetBtn');

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    printBtn.onclick = function() {
        window.print();
    };

    resetBtn.onclick = function() {
        if (confirm('Are you sure you want to reset the form?')) {
            form.reset();
            getCurrentToken().then(token => {
                document.getElementById('token-number').textContent = token;
            });
        }
    };
});

// Keep all other existing functions from the original script.js
// (Course preference handling, form validation, etc.)