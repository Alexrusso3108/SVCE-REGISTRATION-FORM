// Function to get the current token number WITHOUT incrementing it
function getCurrentToken() {
    // Get current date components
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    
    // Create consistent date key for localStorage
    const dateKey = `token_${day}${month}${year}`;
    
    // Get or initialize counter
    let counter = localStorage.getItem(dateKey);
    if (!counter) {
        counter = 1;
        localStorage.setItem(dateKey, counter);
    } else {
        counter = parseInt(counter); // Ensure it's a number
    }
    
    // Format counter with leading zeros
    const formattedCounter = String(counter).padStart(2, '0');
    
    // Create token string
    return `${day}/${month}/${year}/${formattedCounter}`;
}

// Function to increment the token counter and return the NEW token
function incrementToken() {
    // Get current date components
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    
    // Create consistent date key for localStorage
    const dateKey = `token_${day}${month}${year}`;
    
    // Get or initialize counter
    let counter = localStorage.getItem(dateKey);
    if (!counter) {
        counter = 1;
    } else {
        counter = parseInt(counter) + 1; // Increment the counter
    }
    
    // Save the incremented counter
    localStorage.setItem(dateKey, counter);
    
    // Format counter with leading zeros
    const formattedCounter = String(counter).padStart(2, '0');
    
    // Create and return the NEW token string
    const newToken = `${day}/${month}/${year}/${formattedCounter}`;
    console.log(`Token incremented. New token is: ${newToken}`);
    return newToken;
}

// For backward compatibility with existing code
function manageToken(increment = false) {
    if (increment) {
        return incrementToken();
    } else {
        return getCurrentToken();
    }
}

// Function to display date and current token
function displayDateAndToken() {
    // Get today's date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    
    // Set the date display
    const dateDisplay = document.getElementById('enquiry-date');
    if (dateDisplay) {
        dateDisplay.textContent = formattedDate;
    }
    
    // Get and display current token (without incrementing)
    const tokenDisplay = document.getElementById('token-number');
    if (tokenDisplay) {
        const tokenText = manageToken(false);
        tokenDisplay.textContent = tokenText;
        console.log('Token displayed:', tokenText);
    }
}

// Function to handle the loader
function handleLoader() {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    
    // Show loader
    loader.classList.remove('loader-hidden');
    
    // Hide loader after delay and show content
    setTimeout(() => {
        // Start fade out
        loader.classList.add('loader-hidden');
        // Make main content visible as loader fades
        mainContent.classList.add('content-visible');
    }, 3000); // 3 seconds delay for a more impressive experience
}

// Execute when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loader
    handleLoader();
    
    // Set today's date in the form
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); 
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    document.getElementById('enquiry-date').textContent = `${day}-${month}-${year}`;
    
    // Get current token AND increment it for next time
    const tokenText = getCurrentToken();
    document.getElementById('token-number').textContent = tokenText;
    console.log('Token set to:', tokenText);
    
    // Now increment the token for the next page load
    // This ensures the token changes on refresh but doesn't affect the current display
    incrementToken();
    console.log('Token incremented for next page load');

    // Initialize print button functionality
    const printButton = document.getElementById('print-button');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }

    // DOM elements
    const enquiryForm = document.getElementById('enquiryForm');
    const resetBtn = document.getElementById('resetBtn');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.querySelector('.close');
    const tokenNumberSpan = document.getElementById('tokenNumber');
    const printFormBtn = document.getElementById('printFormBtn');
    const sortableCourses = document.getElementById('sortable-courses');
    const enquiryDateInput = document.getElementById('enquiry-date');
    
    // Set the default date to today
    if (enquiryDateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        enquiryDateInput.value = `${year}-${month}-${day}`;
    }
    
    // Initialize checkbox-based course preference selection
    const courseSelection = document.getElementById('course-selection');
    if (courseSelection) {
        initCoursePreferences();
    }
    
    // Checkbox-based course preference functionality
    function initCoursePreferences() {
        const courseOptions = document.querySelectorAll('.course-checkbox');
        const preferenceIndicators = document.querySelectorAll('.preference-indicator');
        let preferenceCount = 0;
        const selectedPreferences = [];
        
        // Add event listeners for checkboxes
        courseOptions.forEach((checkbox, index) => {
            const indicator = preferenceIndicators[index];
            
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    // Add to preferences
                    preferenceCount++;
                    selectedPreferences.push(index);
                    indicator.textContent = preferenceCount;
                    indicator.classList.add('active');
                } else {
                    // Remove from preferences
                    const position = selectedPreferences.indexOf(index);
                    if (position > -1) {
                        selectedPreferences.splice(position, 1);
                        indicator.textContent = '';
                        indicator.classList.remove('active');
                        
                        // Update all subsequent preference numbers
                        updatePreferenceNumbers();
                    }
                }
            });
        });
        
        // Function to update preference numbers after unchecking a box
        function updatePreferenceNumbers() {
            preferenceCount = 0;
            
            // Reset all indicators
            preferenceIndicators.forEach(indicator => {
                indicator.textContent = '';
                indicator.classList.remove('active');
            });
            
            // Re-number the selected checkboxes in order
            selectedPreferences.forEach((optionIndex, prefIndex) => {
                const checkbox = courseOptions[optionIndex];
                const indicator = preferenceIndicators[optionIndex];
                
                if (checkbox.checked) {
                    preferenceCount++;
                    indicator.textContent = preferenceCount;
                    indicator.classList.add('active');
                }
            });
        }
    }
    
    // Board selection and conditional display of 11th grade marks
    const educationBoardSelect = document.getElementById('educationBoard');
    const marks11thSection = document.getElementById('marks11thSection');
    
    if (educationBoardSelect) {
        educationBoardSelect.addEventListener('change', function() {
            // Show 11th grade marks section only for AP/Telangana students
            if (this.value === 'AP/Telangana') {
                marks11thSection.style.display = 'block';
                // Make 11th grade marks required
                document.getElementById('physics11').required = true;
                document.getElementById('mathematics11').required = true;
                document.getElementById('chemistry11').required = true;
            } else {
                marks11thSection.style.display = 'none';
                // Make 11th grade marks not required
                document.getElementById('physics11').required = false;
                document.getElementById('mathematics11').required = false;
                document.getElementById('chemistry11').required = false;
            }
            // Recalculate percentages if values are present
            calculatePercentages();
        });
    }
    
    // Marks calculation for PCM and Total percentage
    const physicsInput = document.getElementById('physics');
    const mathsInput = document.getElementById('mathematics');
    const chemistryInput = document.getElementById('chemistry');
    const csInput = document.getElementById('cs');
    const bioInput = document.getElementById('bio');
    const eceInput = document.getElementById('ece');
    const pcmPercentageInput = document.getElementById('pcmPercentage');
    const totalPercentageInput = document.getElementById('totalPercentage');
    
    // 11th grade inputs for AP/Telangana students
    const physics11Input = document.getElementById('physics11');
    const maths11Input = document.getElementById('mathematics11');
    const chemistry11Input = document.getElementById('chemistry11');
    
    // Add event listeners to all subject inputs for auto-calculation
    [physicsInput, mathsInput, chemistryInput, csInput, bioInput, eceInput, 
     physics11Input, maths11Input, chemistry11Input].forEach(input => {
        if (input) {
            input.addEventListener('input', calculatePercentages);
        }
    });
    
    function calculatePercentages() {
        // Check if required 12th grade subjects are filled
        if (physicsInput.value && mathsInput.value && chemistryInput.value) {
            const physics12 = parseFloat(physicsInput.value) || 0;
            const maths12 = parseFloat(mathsInput.value) || 0;
            const chemistry12 = parseFloat(chemistryInput.value) || 0;
            
            // Get the selected education board
            const educationBoard = educationBoardSelect ? educationBoardSelect.value : '';
            
            // PCM percentage calculation based on education board
            let pcmPercentage;
            
            if (educationBoard === 'AP/Telangana' && 
                physics11Input.value && maths11Input.value && chemistry11Input.value) {
                // For AP/Telangana, calculate average from both 11th and 12th grades
                const physics11 = parseFloat(physics11Input.value) || 0;
                const maths11 = parseFloat(maths11Input.value) || 0;
                const chemistry11 = parseFloat(chemistry11Input.value) || 0;
                
                // Average of 11th and 12th for each subject
                const physicsAvg = (physics11 + physics12) / 2;
                const mathsAvg = (maths11 + maths12) / 2;
                const chemistryAvg = (chemistry11 + chemistry12) / 2;
                
                // Calculate PCM percentage based on averages
                pcmPercentage = ((physicsAvg + mathsAvg + chemistryAvg) / 3).toFixed(2);
            } else {
                // For other boards, just use 12th grade marks
                pcmPercentage = ((physics12 + maths12 + chemistry12) / 3).toFixed(2);
            }
            
            // Set the PCM percentage
            pcmPercentageInput.value = pcmPercentage;
            
            // Calculate total percentage including optional subjects
            let totalMarks = physics12 + maths12 + chemistry12;
            let subjectCount = 3;
            
            // Add optional subjects if values are entered
            if (csInput && csInput.value) {
                totalMarks += parseFloat(csInput.value) || 0;
                subjectCount++;
            }
            
            if (bioInput && bioInput.value) {
                totalMarks += parseFloat(bioInput.value) || 0;
                subjectCount++;
            }
            
            if (eceInput && eceInput.value) {
                totalMarks += parseFloat(eceInput.value) || 0;
                subjectCount++;
            }
            
            // Calculate and set total percentage
            const totalPercentage = (totalMarks / subjectCount).toFixed(2);
            totalPercentageInput.value = totalPercentage;
        }
    }
    
    // Form submission
    enquiryForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                // Disable submit button to prevent multiple submissions
                const submitBtn = document.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Submitting...';

                // Get the current token (the one displayed on the form)
                // This is the token we'll store in the database
                const finalTokenNumber = getCurrentToken();

                // The token number is already displayed correctly - we'll update 
                // after successful submission to show next available token

                const enquiryDate = document.getElementById('enquiry-date').textContent;
                const parsedDate = parseDate(enquiryDate);
                
                // Collect form data
                const formData = new FormData(enquiryForm);
                const formDataObj = {};
                
                formData.forEach((value, key) => {
                    formDataObj[key] = value;
                });
                
                // Get course preferences as a dictionary (course: order)
                const coursePreferencesDict = {};
                const courseOptions = document.querySelectorAll('.course-checkbox:checked');
                
                // Create a dictionary of selected courses with their preference order
                for (let i = 0; i < courseOptions.length; i++) {
                    const checkbox = courseOptions[i];
                    const courseLabel = checkbox.closest('.course-option').querySelector('label').textContent.trim();
                    const prefIndicator = checkbox.closest('.course-option').querySelector('.preference-indicator');
                    const prefOrder = parseInt(prefIndicator.textContent);
                    
                    // Add to dictionary with course as key and order as value
                    coursePreferencesDict[courseLabel] = prefOrder;
                }
                
                // Prepare form data for submission
                const enquiryData = {
                    token_number: finalTokenNumber,
                    enquiry_date: parsedDate,
                    student_name: formDataObj.studentName,
                    student_email: formDataObj.studentEmail,
                    student_mobile: formDataObj.studentMobile,
                    father_name: formDataObj.fatherName,
                    father_mobile: formDataObj.fatherMobile,
                    mother_name: formDataObj.motherName || null,
                    mother_mobile: formDataObj.motherMobile || null,
                    address: formDataObj.address,
                    reference: formDataObj.reference || null,
                    
                    // Education Board
                    education_board: document.getElementById('educationBoard').value,
                    
                    // Academic marks - 12th grade
                    physics_marks: parseFloat(formDataObj.physics),
                    chemistry_marks: parseFloat(formDataObj.chemistry),
                    mathematics_marks: parseFloat(formDataObj.mathematics),
                    cs_marks: formDataObj.cs ? parseFloat(formDataObj.cs) : null,
                    bio_marks: formDataObj.bio ? parseFloat(formDataObj.bio) : null,
                    ece_marks: formDataObj.ece ? parseFloat(formDataObj.ece) : null,
                    pcm_percentage: parseFloat(formDataObj.pcmPercentage),
                    total_percentage: parseFloat(formDataObj.totalPercentage),
                    
                    // Academic marks - 11th grade (for AP/Telangana students)
                    physics_marks_11: document.getElementById('physics11') && document.getElementById('physics11').value ? 
                        parseFloat(document.getElementById('physics11').value) : null,
                    chemistry_marks_11: document.getElementById('chemistry11') && document.getElementById('chemistry11').value ? 
                        parseFloat(document.getElementById('chemistry11').value) : null,
                    mathematics_marks_11: document.getElementById('mathematics11') && document.getElementById('mathematics11').value ? 
                        parseFloat(document.getElementById('mathematics11').value) : null,
                    
                    // Entrance exam details
                    jee_rank: formDataObj.jeeRank ? parseInt(formDataObj.jeeRank) : null,
                    comedk_rank: formDataObj.comedk ? parseInt(formDataObj.comedk) : null,
                    cet_rank: formDataObj.cetRank ? parseInt(formDataObj.cetRank) : null,
                    
                    // Course preferences as JSON
                    course_preferences: coursePreferencesDict  // Send as a JavaScript object - Supabase will convert to JSONB
                };
                
                console.log('Submitting main form data:', enquiryData);
                
                try {
                    // Save to Supabase - Step 1: Insert main enquiry data
                    const { data: enquiry, error: enquiryError } = await supabase
                        .from('admission_enquiries')
                        .insert(enquiryData)
                        .select();
                        
                    console.log('Main form response:', { data: enquiry, error: enquiryError });
                    
                    if (enquiryError) {
                        console.error('Error details:', enquiryError);
                        alert(`Error inserting data: ${enquiryError.message || 'Unknown error'}
Code: ${enquiryError.code || 'No code'}
Details: ${JSON.stringify(enquiryError.details) || 'No details'}`);
                        throw enquiryError;
                    }
                } catch (err) {
                    console.error('Caught error:', err);
                    alert(`Error: ${err.message || 'Unknown error occurred'}. Please make sure you have added the course_preferences column to your database table.`);
                    throw err;
                }
                
                // Course preferences are now stored directly in the admission_enquiries table
                // No need for a separate course_preferences table insertion
                
                // Show success message
                submitBtn.innerHTML = 'Form Submitted Successfully!';
                submitBtn.classList.add('success');
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Submit Enquiry';
                    submitBtn.classList.remove('success');
                    
                    // Reset form
                    enquiryForm.reset();
                    
                    // After successful form submission, get the current token (which was already incremented on page load)
                    // and display it
                    const currentToken = getCurrentToken();
                    document.getElementById('token-number').textContent = currentToken;
                    console.log('Form submitted with token:', finalTokenNumber);
                    console.log('Current token displayed:', currentToken);
                    
                    // Show success alert
                    showAlert('Form submitted successfully!', 'success');
                    
                    // Reset UI elements
                    const courseCheckboxes = document.querySelectorAll('.course-checkbox');
                    courseCheckboxes.forEach(checkbox => {
                        checkbox.checked = false;
                    });
                    
                    // Reset preference indicators
                    const preferenceIndicators = document.querySelectorAll('.preference-indicator');
                    preferenceIndicators.forEach(indicator => {
                        indicator.textContent = '';
                        indicator.classList.remove('active');
                    });
                    
                    // Clear selected courses display
                    if (sortableCourses) {
                        sortableCourses.innerHTML = '';
                    }
                    
                    const selectedCoursesDisplay = document.getElementById('selected-courses-display');
                    if (selectedCoursesDisplay) {
                        selectedCoursesDisplay.innerHTML = '';
                    }
                    
                    // Reset percentages
                    if (pcmPercentageInput) pcmPercentageInput.value = '';
                    if (totalPercentageInput) totalPercentageInput.value = '';
                    
                    // Set focus to first field for new entry
                    const firstInput = enquiryForm.querySelector('input[type="text"]');
                    if (firstInput) firstInput.focus();
                }, 1500);
                
            } catch (error) {
                console.error('Error submitting form:', error);
                alert(`There was an error submitting your form. Please try again.\n\nError details: ${error.message}`);
            } finally {
                // If there was an error, re-enable the submit button
                const submitBtn = document.querySelector('button[type="submit"]');
                if (submitBtn.innerHTML !== 'Form Submitted Successfully!') {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Submit Enquiry';
                }
            }
        }
    });
    
    // Helper function to parse date string (DD-MM-YYYY) to ISO format for database
    function parseDate(dateString) {
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;  // YYYY-MM-DD format for database
    }
    
    // Form reset
    resetBtn.addEventListener('click', function() {
        // Reset the form fields
        enquiryForm.reset();
        
        // Clear course preference indicators
        const preferenceIndicators = document.querySelectorAll('.preference-indicator');
        preferenceIndicators.forEach(indicator => {
            indicator.textContent = '';
            indicator.classList.remove('active');
        });
        
        // Reset the preference counter and selected preferences array
        if (typeof initCoursePreferences === 'function') {
            // Re-initialize course preferences
            initCoursePreferences();
        }
    });
    
    // Close modal
    closeModalBtn.addEventListener('click', function() {
        successModal.style.display = 'none';
    });
    
    // Print form
    printFormBtn.addEventListener('click', function() {
        window.print();
    });
    
    // Click outside modal to close
    window.addEventListener('click', function(event) {
        if (event.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Basic validation for required fields
        const requiredInputs = enquiryForm.querySelectorAll('[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                
                // Add error message
                let errorMsg = input.parentElement.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('span');
                    errorMsg.className = 'error-message';
                    errorMsg.style.color = 'red';
                    errorMsg.style.fontSize = '12px';
                    errorMsg.style.display = 'block';
                    input.parentElement.appendChild(errorMsg);
                }
                errorMsg.textContent = 'This field is required';
            } else {
                input.classList.remove('error');
                const errorMsg = input.parentElement.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
        
        // Check if at least one course preference checkbox is selected
        const courseCheckboxes = document.querySelectorAll('.course-checkbox:checked');
        if (courseCheckboxes.length === 0) {
            isValid = false;
            const courseSection = document.querySelector('.course-preference');
            
            let errorMsg = courseSection.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                errorMsg.style.color = 'red';
                errorMsg.style.fontSize = '12px';
                errorMsg.style.display = 'block';
                courseSection.appendChild(errorMsg);
            }
            errorMsg.textContent = 'Course preferences are required';
        } else {
            const courseSection = document.querySelector('.course-preference');
            const errorMsg = courseSection.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
        
        return isValid;
    }
    
    // Nothing here - we've replaced all token-related functions with manageToken() 
});
