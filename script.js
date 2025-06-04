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
    
    // Optional 12th standard marks logic
    const optionalCsInput = document.getElementById('cs');
    const optionalBioInput = document.getElementById('bio');
    const optionalEceInput = document.getElementById('ece');

    if (optionalCsInput && optionalBioInput && optionalEceInput) { // Ensure all elements are found before proceeding
        function updateOptionalMarksLogic() {
            const csHasValue = optionalCsInput.value.trim() !== '';
            const bioHasValue = optionalBioInput.value.trim() !== '';
            const eceHasValue = optionalEceInput.value.trim() !== '';

            // Default: all enabled
            optionalCsInput.disabled = false;
            optionalBioInput.disabled = false;
            optionalEceInput.disabled = false;

            if (csHasValue) {
                optionalBioInput.disabled = true;
                optionalEceInput.disabled = true;
            } else if (bioHasValue) {
                optionalCsInput.disabled = true;
                optionalEceInput.disabled = true;
            } else if (eceHasValue) {
                optionalCsInput.disabled = true;
                optionalBioInput.disabled = true;
            }
        }

        [optionalCsInput, optionalBioInput, optionalEceInput].forEach(input => {
            input.addEventListener('input', updateOptionalMarksLogic);
        });

        // Initial check in case of pre-filled values (e.g. browser autocomplete or page refresh)
        updateOptionalMarksLogic();
    }

    // Board selection and conditional display of 11th grade marks
    const educationBoardSelect = document.getElementById('educationBoard');
    const marks11thSection = document.getElementById('marks11thSection');
    
    const physics11Input = document.getElementById('physics11');
    const mathematics11aInput = document.getElementById('mathematics11a');
    const mathematics11bInput = document.getElementById('mathematics11b');
    const chemistry11Input = document.getElementById('chemistry11');

    const mathematics12StandardGroup = document.getElementById('mathematics12_standard_group');
    const mathematics12StandardInput = document.getElementById('mathematics');
    const mathematics12aGroup = document.getElementById('mathematics12a_group');
    const mathematics12aInput = document.getElementById('mathematics12a');
    const mathematics12bGroup = document.getElementById('mathematics12b_group');
    const mathematics12bInput = document.getElementById('mathematics12b');

    // Practical Marks Inputs (AP/Telangana specific)
    const physics11PracticalInput = document.getElementById('physics11Practical');
    const chemistry11PracticalInput = document.getElementById('chemistry11Practical');
    const physics12PracticalInput = document.getElementById('physics12Practical');
    const physics12PracticalGroup = document.getElementById('physics12Practical_group');
    const chemistry12PracticalInput = document.getElementById('chemistry12Practical');
    const chemistry12PracticalGroup = document.getElementById('chemistry12Practical_group');

    // Marks calculation for PCM and Total percentage
    const physicsInput = document.getElementById('physics');
    // const mathsInput = document.getElementById('mathematics'); // This seems to be an old/unused ID for the main maths field, mathematics12StandardInput is used
    const chemistryInput = document.getElementById('chemistry');
    const csInput = document.getElementById('cs'); // Optional CS
    const bioInput = document.getElementById('bio'); // Optional Bio
    const eceInput = document.getElementById('ece'); // Optional ECE
    const pcmPercentageInput = document.getElementById('pcmPercentage');
    const totalPercentageInput = document.getElementById('totalPercentage');

    function updateMarksFieldsBasedOnBoard() {
        // educationBoardSelect and marks11thSection are defined above and in scope
        if (!educationBoardSelect || !marks11thSection || !physics11Input || !mathematics11aInput || !mathematics11bInput || !chemistry11Input ||
            !mathematics12StandardGroup || !mathematics12StandardInput || !mathematics12aGroup || !mathematics12aInput ||
            !mathematics12bGroup || !mathematics12bInput ||
            !physics11PracticalInput || !chemistry11PracticalInput || !physics12PracticalInput || !physics12PracticalGroup || !chemistry12PracticalInput || !chemistry12PracticalGroup) {
            // console.warn('One or more critical elements for board-specific marks logic are missing from the DOM. Check HTML IDs.');
            return;
        }
        const selectedBoard = educationBoardSelect.value;

        if (selectedBoard === 'AP/Telangana') {
            marks11thSection.style.display = 'block';
            physics11Input.required = true;
            mathematics11aInput.required = true;
            mathematics11bInput.required = true;
            chemistry11Input.required = true;

            mathematics12StandardGroup.style.display = 'none';
            mathematics12StandardInput.required = false;
            mathematics12aGroup.style.display = 'block'; 
            mathematics12aInput.required = true;
            mathematics12bGroup.style.display = 'block'; 
            mathematics12bInput.required = true;

            // Show and require 11th practicals
            physics11PracticalInput.required = true;
            chemistry11PracticalInput.required = true;

            // Show and require 12th practicals
            physics12PracticalGroup.style.display = 'block';
            physics12PracticalInput.required = true;
            chemistry12PracticalGroup.style.display = 'block';
            chemistry12PracticalInput.required = true;
        } else {
            marks11thSection.style.display = 'none';
            physics11Input.required = false;
            mathematics11aInput.required = false;
            mathematics11bInput.required = false;
            chemistry11Input.required = false;

            mathematics12StandardGroup.style.display = 'block'; 
            mathematics12StandardInput.required = true;
            mathematics12aGroup.style.display = 'none';
            mathematics12aInput.required = false;
            mathematics12bGroup.style.display = 'none';
            mathematics12bInput.required = false;
            mathematics12bInput.value = ''; // Clear value

            // Hide and un-require 11th practicals
            physics11PracticalInput.required = false;
            physics11PracticalInput.value = '';
            chemistry11PracticalInput.required = false;
            chemistry11PracticalInput.value = '';

            // Hide and un-require 12th practicals
            physics12PracticalGroup.style.display = 'none';
            physics12PracticalInput.required = false;
            physics12PracticalInput.value = '';
            chemistry12PracticalGroup.style.display = 'none';
            chemistry12PracticalInput.required = false;
            chemistry12PracticalInput.value = '';
        }
    }

    if (educationBoardSelect) {
        educationBoardSelect.addEventListener('change', function() {
            updateMarksFieldsBasedOnBoard();
            // Recalculate percentages if values are present and fields change
            calculatePercentages(); 
        });
        // Initial call to set up fields based on current selection or default
        updateMarksFieldsBasedOnBoard();
        // Also calculate percentages on initial load if needed
        calculatePercentages(); 
    }
    
    // Add event listeners to all relevant subject inputs for auto-calculation
    [physicsInput, mathematics12StandardInput, mathematics12aInput, mathematics12bInput, chemistryInput, 
     csInput, bioInput, eceInput, 
     physics11Input, mathematics11aInput, mathematics11bInput, chemistry11Input,
     physics11PracticalInput, chemistry11PracticalInput, physics12PracticalInput, chemistry12PracticalInput].forEach(input => {
        if (input) {
            input.addEventListener('input', calculatePercentages);
        }
    });
    
    function calculatePercentages() {
        const educationBoard = educationBoardSelect ? educationBoardSelect.value : '';

        // Helper to get parseFloat or 0, and check if field has a value
        const getMark = (inputElement) => {
            if (!inputElement || inputElement.value.trim() === '') return { value: 0, entered: false };
            return { value: parseFloat(inputElement.value) || 0, entered: true };
        };

        // Get 12th Standard Marks
        const physics12Theory = getMark(physicsInput);
        const chemistry12Theory = getMark(chemistryInput);
        const mathematics12A = getMark(mathematics12aInput);
        const mathematics12B = getMark(mathematics12bInput);
        const mathematics12Std = getMark(mathematics12StandardInput);
        const physics12Practical = getMark(physics12PracticalInput);
        const chemistry12Practical = getMark(chemistry12PracticalInput);

        // Get 11th Standard Marks (AP/Telangana specific)
        const physics11Theory = getMark(physics11Input);
        const chemistry11Theory = getMark(chemistry11Input);
        const mathematics11A = getMark(mathematics11aInput);
        const mathematics11B = getMark(mathematics11bInput);
        const physics11Practical = getMark(physics11PracticalInput);
        const chemistry11Practical = getMark(chemistry11PracticalInput);

        // Optional Subjects (12th)
        const cs12 = getMark(csInput);
        const bio12 = getMark(bioInput);
        const ece12 = getMark(eceInput);

        let pcmPercentageStr = '';
        let totalPercentageStr = '';

        if (educationBoard === 'AP/Telangana') {
            const apT11PcmFieldsEntered = physics11Theory.entered && chemistry11Theory.entered && 
                                          mathematics11A.entered && mathematics11B.entered && 
                                          physics11Practical.entered && chemistry11Practical.entered;
            
            const apT12PcmFieldsEntered = physics12Theory.entered && chemistry12Theory.entered && 
                                          mathematics12A.entered && mathematics12B.entered && 
                                          physics12Practical.entered && chemistry12Practical.entered;

            if (apT11PcmFieldsEntered && apT12PcmFieldsEntered) {
                // 11th Calculations
                const physics11Obtained = physics11Theory.value + physics11Practical.value;
                const chemistry11Obtained = chemistry11Theory.value + chemistry11Practical.value;
                const maths11Obtained = mathematics11A.value + mathematics11B.value;
                const pcm11ObtainedTotal = physics11Obtained + chemistry11Obtained + maths11Obtained;
                const pcm11MaxTotal = 90 + 90 + 150; // Phy(60Th+30Pr) + Chem(60Th+30Pr) + Maths(75+75)
                const pcm11Perc = (pcm11MaxTotal > 0) ? (pcm11ObtainedTotal / pcm11MaxTotal) * 100 : 0;

                // 12th Calculations
                const physics12Obtained = physics12Theory.value + physics12Practical.value;
                const chemistry12Obtained = chemistry12Theory.value + chemistry12Practical.value;
                const maths12Obtained = mathematics12A.value + mathematics12B.value;
                const pcm12ObtainedTotal = physics12Obtained + chemistry12Obtained + maths12Obtained;
                const pcm12MaxTotal = 90 + 90 + 150; // Phy(60Th+30Pr) + Chem(60Th+30Pr) + Maths(75+75) 
                const pcm12Perc = (pcm12MaxTotal > 0) ? (pcm12ObtainedTotal / pcm12MaxTotal) * 100 : 0;

                pcmPercentageStr = ((pcm11Perc + pcm12Perc) / 2).toFixed(2);

                // Total Percentage for AP/Telangana (PCM + Optionals for 12th)
                let total11Obtained = pcm11ObtainedTotal;
                let total11Max = pcm11MaxTotal;
                // Assuming no optionals, English, Language in 11th for this calculation

                let total12Obtained = pcm12ObtainedTotal;
                let total12Max = pcm12MaxTotal;

                if (cs12.entered) { total12Obtained += cs12.value; total12Max += 100; }
                else if (bio12.entered) { total12Obtained += bio12.value; total12Max += 100; }
                else if (ece12.entered) { total12Obtained += ece12.value; total12Max += 100; }

                const total11Perc = (total11Max > 0) ? (total11Obtained / total11Max) * 100 : 0;
                const total12Perc = (total12Max > 0) ? (total12Obtained / total12Max) * 100 : 0;
                totalPercentageStr = ((total11Perc + total12Perc) / 2).toFixed(2);
            }
        } else { // For other boards (Non AP/Telangana)
            const pcmNonApFieldsEntered = physics12Theory.entered && chemistry12Theory.entered && mathematics12Std.entered;
            
            if (pcmNonApFieldsEntered) {
                const pcm12Obtained = physics12Theory.value + chemistry12Theory.value + mathematics12Std.value;
                const pcm12Max = 300; // 100 each for Phy, Chem, Maths
                pcmPercentageStr = ((pcm12Obtained / pcm12Max) * 100).toFixed(2);

                let total12Obtained = pcm12Obtained;
                let total12Max = pcm12Max;

                if (cs12.entered) { total12Obtained += cs12.value; total12Max += 100; }
                else if (bio12.entered) { total12Obtained += bio12.value; total12Max += 100; }
                else if (ece12.entered) { total12Obtained += ece12.value; total12Max += 100; }
                
                totalPercentageStr = (total12Max > 0) ? ((total12Obtained / total12Max) * 100).toFixed(2) : '';
            }
        }

        pcmPercentageInput.value = pcmPercentageStr;
        totalPercentageInput.value = totalPercentageStr;
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
                console.log('Token captured for this submission (finalTokenNumber):', finalTokenNumber);

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
                
                const currentBoard = educationBoardSelect.value;

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
                    
                    education_board: currentBoard,
                    
                    // Academic marks - 12th grade (using direct input elements)
                    physics_marks: physicsInput.value ? parseFloat(physicsInput.value) : null,
                    chemistry_marks: chemistryInput.value ? parseFloat(chemistryInput.value) : null,
                    // Conditional 12th Math
                    mathematics_marks: (currentBoard !== 'AP/Telangana' && mathematics12StandardInput.value) ? parseFloat(mathematics12StandardInput.value) : null,
                    mathematics_marks_12a: (currentBoard === 'AP/Telangana' && mathematics12aInput.value) ? parseFloat(mathematics12aInput.value) : null,
                    mathematics_marks_12b: (currentBoard === 'AP/Telangana' && mathematics12bInput.value) ? parseFloat(mathematics12bInput.value) : null,

                    cs_marks: csInput.value ? parseFloat(csInput.value) : null,
                    bio_marks: bioInput.value ? parseFloat(bioInput.value) : null,
                    ece_marks: eceInput.value ? parseFloat(eceInput.value) : null,
                    
                    pcm_percentage: pcmPercentageInput.value ? parseFloat(pcmPercentageInput.value) : null,
                    total_percentage: totalPercentageInput.value ? parseFloat(totalPercentageInput.value) : null,
                    
                    // Academic marks - 11th grade (for AP/Telangana students, using direct input elements)
                    physics_marks_11: (currentBoard === 'AP/Telangana' && physics11Input.value) ? parseFloat(physics11Input.value) : null,
                    chemistry_marks_11: (currentBoard === 'AP/Telangana' && chemistry11Input.value) ? parseFloat(chemistry11Input.value) : null,
                    mathematics_marks_11a: (currentBoard === 'AP/Telangana' && mathematics11aInput.value) ? parseFloat(mathematics11aInput.value) : null,
                    mathematics_marks_11b: (currentBoard === 'AP/Telangana' && mathematics11bInput.value) ? parseFloat(mathematics11bInput.value) : null,
                    // Practical Marks - 11th grade (AP/Telangana)
                    physics_marks_11_practical: (currentBoard === 'AP/Telangana' && physics11PracticalInput.value) ? parseFloat(physics11PracticalInput.value) : null,
                    chemistry_marks_11_practical: (currentBoard === 'AP/Telangana' && chemistry11PracticalInput.value) ? parseFloat(chemistry11PracticalInput.value) : null,
                    // Practical Marks - 12th grade (AP/Telangana)
                    physics_marks_12_practical: (currentBoard === 'AP/Telangana' && physics12PracticalInput.value) ? parseFloat(physics12PracticalInput.value) : null,
                    chemistry_marks_12_practical: (currentBoard === 'AP/Telangana' && chemistry12PracticalInput.value) ? parseFloat(chemistry12PracticalInput.value) : null,
                                        
                    // Entrance exam details (from formDataObj as before)
                    jee_rank: formDataObj.jeeRank ? parseInt(formDataObj.jeeRank) : null,
                    comedk_rank: formDataObj.comedk ? parseInt(formDataObj.comedk) : null,
                    cet_rank: formDataObj.cetRank ? parseInt(formDataObj.cetRank) : null,
                    
                    // Course preferences as JSON
                    course_preferences: coursePreferencesDict
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

                    enquiryForm.reset();

                    incrementToken();
                    const newTokenForDisplay = getCurrentToken();
                    document.getElementById('token-number').textContent = newTokenForDisplay;
                    console.log('Form submitted with token:', finalTokenNumber);
                    console.log('Next token displayed for new enquiry:', newTokenForDisplay);

                    // showAlert('Form submitted successfully!', 'success'); // Temporarily commented out for debugging reload
                    console.log('Attempting to start comprehensive reset and reload...');

                    // --- Comprehensive Reset Logic Start ---
                    const courseCheckboxes = document.querySelectorAll('.course-checkbox');
                    courseCheckboxes.forEach(checkbox => {
                        checkbox.checked = false;
                    });
                    const preferenceIndicators = document.querySelectorAll('.preference-indicator');
                    preferenceIndicators.forEach(indicator => {
                        indicator.textContent = '';
                        indicator.classList.remove('active');
                    });
                    
                    // Reset global course preference tracking variables
                    // Ensure these are declared in a scope accessible here (e.g., globally or within DOMContentLoaded)
                    if (typeof preferenceCount !== 'undefined') preferenceCount = 0;
                    if (typeof selectedCoursesOrder !== 'undefined') selectedCoursesOrder = []; // Assuming selectedCoursesOrder is an array
                    
                    // Clear the visual display of selected/sorted courses if applicable
                    const selectedCoursesDisplay = document.getElementById('selected-courses-display'); // Assuming this ID exists for a display area
                    if (selectedCoursesDisplay) {
                        selectedCoursesDisplay.innerHTML = '';
                    }
                    // Also, if sortableCourses is the element for this, ensure it's cleared
                    // Make sure sortableCourses is defined in the accessible scope (e.g., at the top of DOMContentLoaded)
                    if (typeof sortableCourses !== 'undefined' && sortableCourses) {
                         sortableCourses.innerHTML = '';
                    }

                    updateMarksFieldsBasedOnBoard();
                    updateOptionalMarksLogic();
                    calculatePercentages();

                    const allInputs = enquiryForm.querySelectorAll('input, select, textarea');
                    allInputs.forEach(input => {
                        if (typeof clearFieldError === 'function') { // Check if clearFieldError is defined
                            clearFieldError(input);
                        }
                    });
                    
                    // Set focus to the first field for convenience
                    const firstInput = enquiryForm.querySelector('input[type="text"], input[type="email"], input[type="tel"]');
                    if (firstInput) {
                        firstInput.focus();
                    }
                    // --- Comprehensive Reset Logic End ---

                    // Reload the page
                    console.log('Attempting to reload page...');
                    window.location.reload();

                }, 3000); // Timeout duration

            } catch (error) { // Outer catch for any error during the submission process
                console.error('Error submitting form:', error);
                // General error alert, specific database error is handled by inner catch if it was re-thrown
                if (error.message && !error.message.includes("Unknown error occurred during database operation")) {
                     alert(`There was an error processing your form. Please try again.\n\nDetails: ${error.message}`);
                }
                // The finally block will re-enable the button if it wasn't a success
            } finally {
                // Re-enable submit button if it wasn't successful
                // (to prevent it from staying disabled on error if success message wasn't shown)
                const submitBtn = document.querySelector('button[type="submit"]'); // Re-declare to ensure it's the same button instance
                if (submitBtn.innerHTML !== 'Form Submitted Successfully!') {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Submit Enquiry';
                    submitBtn.classList.remove('success'); // Ensure success class is removed on error
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
    
    // Helper function to display field error
    function displayFieldError(inputElement, message) {
        if (!inputElement) return;
        inputElement.classList.add('error');
        let errorMsg = inputElement.parentElement.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.style.color = 'red';
            errorMsg.style.fontSize = '12px';
            errorMsg.style.display = 'block';
            // Insert after the input or its wrapper for better layout if needed
            if (inputElement.nextSibling) {
                inputElement.parentElement.insertBefore(errorMsg, inputElement.nextSibling);
            } else {
                inputElement.parentElement.appendChild(errorMsg);
            }
        }
        errorMsg.textContent = message;
    }

    // Helper function to clear field error
    function clearFieldError(inputElement) {
        if (!inputElement) return;
        inputElement.classList.remove('error');
        const errorMsg = inputElement.parentElement.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }

    // Helper function to validate numeric fields (required, numeric, range)
    function validateNumericField(inputElement, fieldName, isFieldRequired, min = 0, max = 100) {
        if (!inputElement) return true; // If element doesn't exist, skip validation for it
        clearFieldError(inputElement);
        const value = inputElement.value.trim();

        if (isFieldRequired && !value) {
            displayFieldError(inputElement, `${fieldName} is required.`);
            return false;
        }

        if (value) { // Only validate for number and range if there's a value
            if (isNaN(value) || !/^-?\d*\.?\d+$/.test(value)) { // check for valid number format
                displayFieldError(inputElement, `${fieldName} must be a valid number.`);
                return false;
            }
            const numValue = parseFloat(value);
            if (numValue < min || numValue > max) {
                displayFieldError(inputElement, `${fieldName} must be between ${min} and ${max}.`);
                return false;
            }
        }
        return true;
    }

    // Form validation
    function validateForm() {
        let isValid = true;
        updateMarksFieldsBasedOnBoard(); // Ensure 'required' attributes are current

        const educationBoard = educationBoardSelect ? educationBoardSelect.value : '';

        // --- Generic validation for fields marked as 'required' ---
        const requiredInputs = enquiryForm.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            clearFieldError(input); // Clear previous generic error
            if (!input.value.trim()) {
                isValid = false;
                displayFieldError(input, 'This field is required.');
            } else {
                clearFieldError(input); // Clear if previously had error and now filled
            }
        });

        // --- Specific Marks Validations ---
        // 12th Standard Core Subjects
        let phy12Max = 100;
        let chem12Max = 100;
        if (educationBoard === 'AP/Telangana') {
            phy12Max = 60;
            chem12Max = 60;
        }
        isValid = validateNumericField(physicsInput, '12th Physics (Theory)', true, 0, phy12Max) && isValid;
        isValid = validateNumericField(chemistryInput, '12th Chemistry (Theory)', true, 0, chem12Max) && isValid;

        if (educationBoard === 'AP/Telangana') {
            isValid = validateNumericField(mathematics12aInput, '12th Maths (A)', true) && isValid;
            isValid = validateNumericField(mathematics12bInput, '12th Maths (B)', true) && isValid;
            clearFieldError(mathematics12StandardInput); // Not required for AP/T
        } else {
            isValid = validateNumericField(mathematics12StandardInput, '12th Mathematics', true) && isValid;
            clearFieldError(mathematics12aInput); // Not required for other boards
            clearFieldError(mathematics12bInput); // Not required for other boards
        }

        // 11th Standard Subjects (only for AP/Telangana)
        if (educationBoard === 'AP/Telangana') {
            isValid = validateNumericField(physics11Input, '11th Physics (Theory)', true, 0, 60) && isValid;
            isValid = validateNumericField(mathematics11aInput, '11th Maths (A)', true) && isValid;
            isValid = validateNumericField(mathematics11bInput, '11th Maths (B)', true) && isValid;
            isValid = validateNumericField(chemistry11Input, '11th Chemistry (Theory)', true, 0, 60) && isValid;
            isValid = validateNumericField(physics11PracticalInput, '11th Physics (Practical)', true, 0, 30) && isValid;
            isValid = validateNumericField(chemistry11PracticalInput, '11th Chemistry (Practical)', true, 0, 30) && isValid;
            // 12th Practical Marks (only for AP/Telangana)
            isValid = validateNumericField(physics12PracticalInput, '12th Physics (Practical)', true, 0, 30) && isValid;
            isValid = validateNumericField(chemistry12PracticalInput, '12th Chemistry (Practical)', true, 0, 30) && isValid;
        } else {
            clearFieldError(physics11Input);
            clearFieldError(mathematics11aInput);
            clearFieldError(mathematics11bInput);
            clearFieldError(chemistry11Input);
            clearFieldError(physics11PracticalInput);
            clearFieldError(chemistry11PracticalInput);
            clearFieldError(physics12PracticalInput);
            clearFieldError(chemistry12PracticalInput);
        }

        // Optional 12th Subjects (validate if filled)
        isValid = validateNumericField(csInput, 'Computer Science', false) && isValid; // false because it's optional
        isValid = validateNumericField(bioInput, 'Biology', false) && isValid;
        isValid = validateNumericField(eceInput, 'Electronics', false) && isValid;

        // --- Course Preferences ---
        const courseCheckboxes = document.querySelectorAll('.course-checkbox:checked');
        const courseSection = document.getElementById('coursePreferencesSection') || document.querySelector('.course-preference'); // Use ID if available
        const courseErrorContainer = courseSection.querySelector('.error-message-courses') || document.createElement('span');
        if (!courseErrorContainer.classList.contains('error-message-courses')) {
             courseErrorContainer.className = 'error-message error-message-courses'; // Add a specific class for course errors
             courseErrorContainer.style.color = 'red';
             courseErrorContainer.style.fontSize = '12px';
             courseErrorContainer.style.display = 'block';
             courseSection.appendChild(courseErrorContainer);
        }

        if (courseCheckboxes.length === 0) {
            isValid = false;
            courseErrorContainer.textContent = 'At least one course preference is required.';
        } else {
            courseErrorContainer.textContent = ''; // Clear message
        }
        
        return isValid;
    }
    
    // Nothing here - we've replaced all token-related functions with manageToken() 
});
