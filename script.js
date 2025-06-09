// Function to get the current token number WITHOUT incrementing it
async function getCurrentToken() {
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
        counter = parseInt(counter); // Ensure it's a number
    }
    
    // Format counter with leading zeros
    const formattedCounter = String(counter).padStart(2, '0');
    
    // Create token string
    const token = `${day}/${month}/${year}/${formattedCounter}`;
    
    // Check if this token exists in the database
    const { data: existingToken, error } = await supabase
        .from('admission_enquiries')
        .select('token_number')
        .eq('token_number', token)
        .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.error('Error checking token:', error);
        return token; // Return the token anyway if there's an error
    }
    
    // If token exists, increment counter and try again
    if (existingToken) {
        counter++;
        localStorage.setItem(dateKey, counter);
        return getCurrentToken(); // Recursively try next token
    }
    
    return token;
}

// Function to increment the token counter and return the NEW token
async function incrementToken() {
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
    
    // Create token string
    const newToken = `${day}/${month}/${year}/${formattedCounter}`;
    
    // Check if this token exists in the database
    const { data: existingToken, error } = await supabase
        .from('admission_enquiries')
        .select('token_number')
        .eq('token_number', newToken)
        .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.error('Error checking token:', error);
        return newToken; // Return the token anyway if there's an error
    }
    
    // If token exists, increment counter and try again
    if (existingToken) {
        return incrementToken(); // Recursively try next token
    }
    
    console.log(`Token incremented. New token is: ${newToken}`);
    return newToken;
}

// For backward compatibility with existing code
async function manageToken(increment = false) {
    if (increment) {
        return await incrementToken();
    } else {
        return await getCurrentToken();
    }
}

// Function to display date and current token
async function displayDateAndToken() {
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
        const tokenText = await manageToken(false);
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
    
    displayDateAndToken();

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
    const optionalKannadaInput = document.getElementById('kannada_marks_12');
    const optionalEnglishInput = document.getElementById('english_marks_12');
    const optionalOtherUnnamedInput = document.getElementById('other_unnamed_marks_12');
    const optionalEceInput = document.getElementById('ece');

    // Diploma/12th toggle logic
    const educationalQualificationSelect = document.getElementById('educationalQualification');
    const diplomaFields = document.getElementById('diplomaFields');
    // Use the already declared educationBoardSelect above
    // All marks and rank fields to disable for Diploma
    const marksAndRankFieldSelectors = [
        '#educationBoard',
        '#physics', '#physics12Practical', '#chemistry', '#chemistry12Practical',
        '#mathematics', '#mathematics12a', '#mathematics12b',
        '#cs', '#bio', '#ece',
        '#kannada_marks_12', '#english_marks_12', '#other_subject_name_12', '#other_subject_marks_12', '#other_unnamed_marks_12',
        '#totalPercentage', '#pcmPercentage',
        '#jeeRank', '#cetRank', '#comedkRank', '#kcetRank', '#neetRank',
        '#physics11', '#chemistry11', '#mathematics11a', '#mathematics11b'
    ];
    function handleEducationalQualificationChange() {
        if (!educationalQualificationSelect) return;
        const value = educationalQualificationSelect.value;
        if (value === 'Diploma') {
            if (diplomaFields) diplomaFields.style.display = '';
            marksAndRankFieldSelectors.forEach(sel => {
                const el = document.querySelector(sel);
                if (el) {
                    el.disabled = true;
                    if (el.closest('.form-group')) el.closest('.form-group').style.opacity = 0.5;
                }
            });
        } else {
            if (diplomaFields) diplomaFields.style.display = 'none';
            marksAndRankFieldSelectors.forEach(sel => {
                const el = document.querySelector(sel);
                if (el) {
                    el.disabled = false;
                    if (el.closest('.form-group')) el.closest('.form-group').style.opacity = 1;
                }
            });
        }
    }
    if (educationalQualificationSelect) {
        educationalQualificationSelect.addEventListener('change', handleEducationalQualificationChange);
        // Run on load in case of autofill
        setTimeout(handleEducationalQualificationChange, 0);
    }

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

    // Event listeners for CS, Bio, ECE - they still directly call calculatePercentages
    [optionalCsInput, optionalBioInput, optionalEceInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                if (typeof calculatePercentages === 'function') calculatePercentages();
            });
        }
    });

    // Event listeners for Kannada, English, Other Subject - they call the new handler
    [optionalKannadaInput, optionalEnglishInput, optionalOtherUnnamedInput].forEach(input => {
        if (input) {
            input.addEventListener('input', (event) => {
                if (typeof handleExclusiveOptionalSubjectChange === 'function') handleExclusiveOptionalSubjectChange(event.target.id);
            });
        }
    });

    // Board selection and conditional display of 11th grade marks
    const educationBoardSelect = document.getElementById('educationBoard');
    const marks11thSection = document.getElementById('marks11thSection');
    
    const physics11Input = document.getElementById('physics11');
    const mathematics11aInput = document.getElementById('mathematics11a');
    const mathematics11bInput = document.getElementById('mathematics11b');
    // Optional 11th standard fields
    const english11Input = document.getElementById('english_marks_11');
    const language11Input = document.getElementById('language_marks_11');
    const chemistry11Input = document.getElementById('chemistry11');

    const mathematics12StandardGroup = document.getElementById('mathematics12_standard_group');
    const mathematics12StandardInput = document.getElementById('mathematics');
    const mathematics12aGroup = document.getElementById('mathematics12a_group');
    const mathematics12aInput = document.getElementById('mathematics12a');
    const mathematics12bGroup = document.getElementById('mathematics12b_group');
    const mathematics12bInput = document.getElementById('mathematics12b');

    // Practical Marks Inputs (AP/Telangana specific)
    const physics12PracticalInput = document.getElementById('physics12Practical');
    const chemistry12PracticalInput = document.getElementById('chemistry12Practical');
    const physics12PracticalGroup = document.getElementById('physics12Practical_group');
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

    // Function to set maximum marks for all subjects based on board
    function setMaxMarksForSubjects() {
        const board = educationBoardSelect ? educationBoardSelect.value : '';
        
        // Define max marks for different boards
        const maxMarks = {
            'AP/Telangana': {
                physics: 60,
                chemistry: 60,
                physics11: 60,
                chemistry11: 60,
                physicsPractical: 30,
                chemistryPractical: 30,
                mathematics11a: 75,
                mathematics11b: 75,
                mathematics12a: 75,
                mathematics12b: 75,
                english11: 100,
                language11: 100,
                cs: 100,
                bio: 100,
                ece: 100,
                kannada: 100,
                english12: 100,
                other: 100
            },
            'CBSE': {
                physics: 100,
                chemistry: 100,
                physics11: 100,
                chemistry11: 100,
                mathematics: 100,
                cs: 100,
                bio: 100,
                ece: 100,
                kannada: 100,
                english12: 100,
                other: 100
            },
            'Karnataka': {
                physics: 100,
                chemistry: 100,
                physics11: 100,
                chemistry11: 100,
                mathematics: 100,
                cs: 100,
                bio: 100,
                ece: 100,
                kannada: 100,
                english12: 100,
                other: 100
            },
            'Other': {
                physics: 100,
                chemistry: 100,
                physics11: 100,
                chemistry11: 100,
                mathematics: 100,
                cs: 100,
                bio: 100,
                ece: 100,
                kannada: 100,
                english12: 100,
                other: 100
            }
        };

        // Get the current board's max marks
        const currentMaxMarks = maxMarks[board] || maxMarks['Other'];

        // Update max marks for all subjects
        const subjectFields = {
            physics: physicsInput, // 12th
            chemistry: chemistryInput, // 12th
            physics11: physics11Input, // 11th
            chemistry11: chemistry11Input, // 11th
            physicsPractical: physics12PracticalInput,
            chemistryPractical: chemistry12PracticalInput,
            mathematics11a: mathematics11aInput,
            mathematics11b: mathematics11bInput,
            mathematics12a: mathematics12aInput,
            mathematics12b: mathematics12bInput,
            mathematics: mathematics12StandardInput,
            english11: english11Input,
            language11: language11Input,
            cs: csInput,
            bio: bioInput,
            ece: eceInput,
            kannada: document.getElementById('kannada_marks_12'),
            english12: document.getElementById('english_marks_12'),
            other: document.getElementById('other_unnamed_marks_12')
        };

        // Update max marks and placeholders for each field
        Object.entries(subjectFields).forEach(([subject, input]) => {
            if (input) {
                const maxMark = currentMaxMarks[subject];
                if (maxMark) {
                    input.max = maxMark;
                    input.placeholder = `Max marks: ${maxMark}`;
                }
            }
        });
    }

    // Update the updateMarksFieldsBasedOnBoard function to call setMaxMarksForSubjects
    function updateMarksFieldsBasedOnBoard() {
        // Show/hide CS, BIO, ECE for 12th based on board
        const cbseKarnatakaOptionals12 = document.getElementById('cbseKarnatakaOptionals12');
        if (educationBoardSelect && cbseKarnatakaOptionals12) {
            const board = educationBoardSelect.value;
            if (board === 'CBSE' || board === 'Karnataka') {
                cbseKarnatakaOptionals12.style.display = '';
            } else {
                cbseKarnatakaOptionals12.style.display = 'none';
                // Optionally clear values if hiding
                document.getElementById('cs').value = '';
                document.getElementById('bio').value = '';
                document.getElementById('ece').value = '';
            }
        }
        // educationBoardSelect and marks11thSection are defined above and in scope
        if (!educationBoardSelect || !marks11thSection || !physics11Input || !mathematics11aInput || !mathematics11bInput || !chemistry11Input ||
            !mathematics12StandardGroup || !mathematics12StandardInput || !mathematics12aGroup || !mathematics12aInput ||
            !mathematics12bGroup || !mathematics12bInput ||
            !physics12PracticalInput || !physics12PracticalGroup || !chemistry12PracticalInput || !chemistry12PracticalGroup) {
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

            // No 11th practicals to show or require

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

            // No 11th practicals to hide or clear

            // Hide and un-require 12th practicals
            physics12PracticalGroup.style.display = 'none';
            physics12PracticalInput.required = false;
            physics12PracticalInput.value = '';
            chemistry12PracticalGroup.style.display = 'none';
            chemistry12PracticalInput.required = false;
            chemistry12PracticalInput.value = '';
        }

        // Set max marks for all subjects
        setMaxMarksForSubjects();
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
     physics12PracticalInput, chemistry12PracticalInput].forEach(input => {
        if (input) {
            input.addEventListener('input', calculatePercentages);
        }
    });
    
    // Function to handle mutually exclusive optional subjects (Kannada, English, Other)
function handleExclusiveOptionalSubjectChange(changedInputId) {
    const kannadaMarksInput = document.getElementById('kannada_marks_12');
    const englishMarksInput = document.getElementById('english_marks_12');
    const otherUnnamedMarksInput = document.getElementById('other_unnamed_marks_12');

    const inputs = {
        kannada: kannadaMarksInput,
        english: englishMarksInput,
        otherUnnamed: otherUnnamedMarksInput
    };

    const allInputs = [inputs.kannada, inputs.english, inputs.otherUnnamed];

    // Get current values
    const values = allInputs.map(input => input && typeof input.value === 'string' && input.value.trim() !== '');
    const filledCount = values.filter(Boolean).length;

    // If two are filled, disable the remaining one
    if (filledCount === 2) {
        allInputs.forEach((input, idx) => {
            if (!values[idx]) {
                input.disabled = true;
                input.value = '';
            } else {
                input.disabled = false;
            }
        });
    } else {
        // If fewer than two are filled, enable all
        allInputs.forEach(input => {
            input.disabled = false;
        });
    }
    if (typeof calculatePercentages === 'function') calculatePercentages(); // Recalculate after any change
}


function calculatePercentages() {
    const educationBoard = educationBoardSelect ? educationBoardSelect.value : '';

    // Helper to get parseFloat or 0, and check if field has a value
    const getMark = (inputElement) => {
        if (!inputElement || inputElement.value.trim() === '') return { value: 0, entered: false };
        const val = parseFloat(inputElement.value);
        if (isNaN(val) || val < 0) return { value: 0, entered: true };
        return { value: val, entered: true };
    };

    let total12Obtained = 0;
    let total12Max = 0;
    let pcmPercentageStr = '';
    let totalPercentageStr = '';

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

    // Optional Subjects for PCM best-of calculation (12th)
    const cs12 = getMark(csInput);
    const bio12 = getMark(bioInput);
    const ece12 = getMark(eceInput);

    // Optional 11th standard subjects
    const english11 = getMark(english11Input);
    const language11 = getMark(language11Input);
    // Other optionals for total percentage
    const kannada12 = getMark(document.getElementById('kannada_marks_12'));
    const english12 = getMark(document.getElementById('english_marks_12'));
    const otherUnnamed12 = getMark(document.getElementById('other_unnamed_marks_12'));
    const kannadaInputElement = document.getElementById('kannada_marks_12');
    const englishInputElement = document.getElementById('english_marks_12');
    const otherUnnamedMarksInputElement = document.getElementById('other_unnamed_marks_12');

    // --- PCM and Total Percentage Calculation (AP/Telangana logic) ---
    if (educationBoard === 'AP/Telangana') {
        // PCM: Physics (theory+practical, 11th+12th), Chemistry (theory+practical, 11th+12th), Maths A+B (11th+12th)
        let pcmObtained = 0;
        let pcmMax = 600;
        // Physics
        let phyTotal = 0;
        if (physics11Theory.entered) phyTotal += physics11Theory.value;
        if (physics12Theory.entered) phyTotal += physics12Theory.value;
        if (physics12Practical.entered) phyTotal += physics12Practical.value;
        // Max for physics: 60 (11th) + 60 (12th theory) + 30 (12th practical) = 150
        let phyMax = 0;
        if (physics11Theory.entered) phyMax += 60;
        if (physics12Theory.entered) phyMax += 60;
        if (physics12Practical.entered) phyMax += 30;
        // Chemistry
        let chemTotal = 0;
        if (chemistry11Theory.entered) chemTotal += chemistry11Theory.value;
        if (chemistry12Theory.entered) chemTotal += chemistry12Theory.value;
        if (chemistry12Practical.entered) chemTotal += chemistry12Practical.value;
        // Max for chemistry: 60 (11th) + 60 (12th theory) + 30 (12th practical) = 150
        let chemMax = 0;
        if (chemistry11Theory.entered) chemMax += 60;
        if (chemistry12Theory.entered) chemMax += 60;
        if (chemistry12Practical.entered) chemMax += 30;
        // Maths
        let mathTotal = 0;
        if (mathematics11A.entered) mathTotal += mathematics11A.value;
        if (mathematics11B.entered) mathTotal += mathematics11B.value;
        if (mathematics12A.entered) mathTotal += mathematics12A.value;
        if (mathematics12B.entered) mathTotal += mathematics12B.value;
        // Max for maths: 75 (11th A) + 75 (11th B) + 75 (12th A) + 75 (12th B) = 300
        let mathMax = 0;
        if (mathematics11A.entered) mathMax += 75;
        if (mathematics11B.entered) mathMax += 75;
        if (mathematics12A.entered) mathMax += 75;
        if (mathematics12B.entered) mathMax += 75;
        // PCM obtained and max
        pcmObtained = phyTotal + chemTotal + mathTotal;
        // For percentage, always use 600 as denominator (per your rule)
        pcmPercentageStr = ((pcmObtained / 600) * 100).toFixed(2);

        // --- Total Percentage Calculation (AP/Telangana logic) ---
        // Total out of 1000: all 11th and 12th marks (physics, chemistry, maths, language, english, optionals, etc.)
        let totalObtained = 0;
        let totalMax = 0;
        // 11th
        if (physics11Theory.entered) { totalObtained += physics11Theory.value; totalMax += 60; }
        if (chemistry11Theory.entered) { totalObtained += chemistry11Theory.value; totalMax += 60; }
        if (mathematics11A.entered) { totalObtained += mathematics11A.value; totalMax += 75; }
        if (mathematics11B.entered) { totalObtained += mathematics11B.value; totalMax += 75; }
        if (english11.entered) { totalObtained += english11.value; totalMax += 100; }
        if (language11.entered) { totalObtained += language11.value; totalMax += 100; }
        // 12th
        if (physics12Theory.entered) { totalObtained += physics12Theory.value; totalMax += 60; }
        if (physics12Practical.entered) { totalObtained += physics12Practical.value; totalMax += 30; }
        if (chemistry12Theory.entered) { totalObtained += chemistry12Theory.value; totalMax += 60; }
        if (chemistry12Practical.entered) { totalObtained += chemistry12Practical.value; totalMax += 30; }
        if (mathematics12A.entered) { totalObtained += mathematics12A.value; totalMax += 75; }
        if (mathematics12B.entered) { totalObtained += mathematics12B.value; totalMax += 75; }
        // Optionals (12th)
        if (cs12.entered) { totalObtained += cs12.value; totalMax += 100; }
        if (bio12.entered) { totalObtained += bio12.value; totalMax += 100; }
        if (ece12.entered) { totalObtained += ece12.value; totalMax += 100; }
        if (kannada12.entered && kannadaInputElement && !kannadaInputElement.disabled) { totalObtained += kannada12.value; totalMax += 100; }
        if (english12.entered && englishInputElement && !englishInputElement.disabled) { totalObtained += english12.value; totalMax += 100; }
        if (otherUnnamed12.entered && otherUnnamedMarksInputElement && !otherUnnamedMarksInputElement.disabled) { totalObtained += otherUnnamed12.value; totalMax += 100; }
        // For percentage, always use 1000 as denominator (per your rule)
        totalPercentageStr = ((totalObtained / 1000) * 100).toFixed(2);

        pcmPercentageInput.value = pcmPercentageStr;
        totalPercentageInput.value = totalPercentageStr;
        return;
    }

    // --- CBSE/Karnataka Logic: All subjects max marks is 100 ---
    if (educationBoard === 'CBSE' || educationBoard === 'Karnataka') {
        // PCM calculation
        let pcmMarks = 0;
        let pcmMax = 0;
        // Physics
        if (physicsInput && physicsInput.value.trim() !== '') {
            pcmMarks += parseFloat(physicsInput.value);
            pcmMax += 100;
        }
        // Chemistry
        if (chemistryInput && chemistryInput.value.trim() !== '') {
            pcmMarks += parseFloat(chemistryInput.value);
            pcmMax += 100;
        }
        // Mathematics
        if (mathematics12StandardInput && mathematics12StandardInput.value.trim() !== '') {
            pcmMarks += parseFloat(mathematics12StandardInput.value);
            pcmMax += 100;
        }
        // Best of CS/BIO/ECE
        let optionalBest = 0;
        if (csInput && csInput.value.trim() !== '') optionalBest = Math.max(optionalBest, parseFloat(csInput.value));
        if (bioInput && bioInput.value.trim() !== '') optionalBest = Math.max(optionalBest, parseFloat(bioInput.value));
        if (eceInput && eceInput.value.trim() !== '') optionalBest = Math.max(optionalBest, parseFloat(eceInput.value));
        if (optionalBest > 0) {
            pcmMarks += optionalBest;
            pcmMax += 100;
        }
        if (pcmMax > 0) {
            pcmPercentageStr = ((pcmMarks / pcmMax) * 100).toFixed(2);
        } else {
            pcmPercentageStr = '';
        }

        // Total percentage: sum all entered marks, divide by (number of entered subjects * 100)
        let totalMarks = 0;
        let totalSubjects = 0;
        // List all relevant inputs for total calculation
        const totalInputs = [physicsInput, chemistryInput, mathematics12StandardInput, csInput, bioInput, eceInput,
            document.getElementById('kannada_marks_12'),
            document.getElementById('english_marks_12'),
            document.getElementById('other_unnamed_marks_12')
        ];
        totalInputs.forEach(input => {
            if (input && input.value.trim() !== '') {
                totalMarks += parseFloat(input.value);
                totalSubjects += 1;
            }
        });
        if (totalSubjects > 0) {
            totalPercentageStr = ((totalMarks / (totalSubjects * 100)) * 100).toFixed(2);
        } else {
            totalPercentageStr = '';
        }
        pcmPercentageInput.value = pcmPercentageStr;
        totalPercentageInput.value = totalPercentageStr;
        return;
    }
    // ... existing logic for other boards ...
}

    const formUtils = {
        displayFieldError: function(inputElement, message) {
            if (!inputElement) return;
            inputElement.classList.add('error');
            let errorMsg = inputElement.parentElement.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                errorMsg.style.color = 'red';
                errorMsg.style.fontSize = '12px';
                errorMsg.style.display = 'block';
                if (inputElement.nextSibling) {
                    inputElement.parentElement.insertBefore(errorMsg, inputElement.nextSibling);
                } else {
                    inputElement.parentElement.appendChild(errorMsg);
                }
            }
            errorMsg.textContent = message;
        },

        clearFieldError: function(inputElement) {
            if (!inputElement) return;
            inputElement.classList.remove('error');
            const errorMsg = inputElement.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        },

        validateNumericField: function(inputElement, fieldName, isFieldRequired, min = 0, max = 100) {
            if (!inputElement) return true;
            this.clearFieldError(inputElement);
            const value = inputElement.value.trim();

            if (isFieldRequired && !value) {
                this.displayFieldError(inputElement, `${fieldName} is required.`);
                return false;
            }

            if (value) {
                if (isNaN(value) || !/^-?\d*\.?\d+$/.test(value)) {
                    this.displayFieldError(inputElement, `${fieldName} must be a valid number.`);
                    return false;
                }
                const numValue = parseFloat(value);
                if (numValue < min || numValue > max) {
                    this.displayFieldError(inputElement, `${fieldName} must be between ${min} and ${max}.`);
                    return false;
                }
            }
            return true;
        },

        validateIndianPhoneNumber: function(inputElement, fieldName) {
            this.clearFieldError(inputElement);
            const value = inputElement.value.trim();
            const indianPhoneRegex = /^(?:\+91|0)?[6789]\d{9}$/;

            if (value && !indianPhoneRegex.test(value)) {
                this.displayFieldError(inputElement, `Invalid ${fieldName}. Must be 10 digits (e.g., 9xxxxxxxxx) or optionally start with +91 or 0.`);
                return false;
            }
            return true;
        },

        sendConfirmationEmail: function(studentEmail, studentName, tokenNumber) {
            if (typeof emailjs === 'undefined' || !emailjs.send) {
                console.error('emailjs is not defined or not loaded.');
                alert('Confirmation email service is not available. Please contact the office if you do not receive an email.');
                return;
            }
            emailjs.send("service_m81m0jq", "template_4d2nobg", {
                to_email: studentEmail,
                name: studentName,
                token_number: tokenNumber
            })
            .then(function(response) {
                console.log('SUCCESS! Confirmation email sent:', response.status, response.text);
            }, function(error) {
                console.error('FAILED to send confirmation email...', error);
                alert('Registration saved, but failed to send confirmation email. Please contact the office if you do not receive an email.');
            });
        },

        validateForm: function() {
            let isValid = true;
            updateMarksFieldsBasedOnBoard();

            const educationBoard = educationBoardSelect ? educationBoardSelect.value : '';
            const educationalQualification = educationalQualificationSelect ? educationalQualificationSelect.value : '';

            // If Diploma, skip required validation for 12th/11th marks and board fields
            if (educationalQualification === 'Diploma') {
                // List of all 12th/11th marks and board selectors (update as needed)
                const skipSelectors = [
                    '#educationBoard', '#physics', '#chemistry', '#mathematics',
                    '#mathematics12a', '#mathematics12b', '#physics11', '#mathematics11a', '#mathematics11b', '#chemistry11',
                    '#physics12Practical', '#chemistry12Practical',
                    '#pcmPercentage', '#totalPercentage'
                ];
                skipSelectors.forEach(sel => {
                    const el = document.querySelector(sel);
                    if (el) {
                        formUtils.clearFieldError(el);
                    }
                });
                // Only validate diploma fields
                const diplomaPercentageInput = document.getElementById('diplomaPercentage');
                const dcetRankInput = document.getElementById('dcetRank');
                if (!diplomaPercentageInput.value.trim()) {
                    isValid = false;
                    formUtils.displayFieldError(diplomaPercentageInput, 'Diploma Percentage is required.');
                } else {
                    formUtils.clearFieldError(diplomaPercentageInput);
                }
                if (!dcetRankInput.value.trim()) {
                    isValid = false;
                    formUtils.displayFieldError(dcetRankInput, 'DCET Rank is required.');
                } else {
                    formUtils.clearFieldError(dcetRankInput);
                }
                // Skip rest of validation
                return isValid;
            }

            // --- Generic validation for fields marked as 'required' ---
            const requiredInputs = enquiryForm.querySelectorAll('[required]');
            requiredInputs.forEach(input => {
                formUtils.clearFieldError(input); // Clear previous generic error
                if (!input.value.trim()) {
                    isValid = false;
                    formUtils.displayFieldError(input, 'This field is required.');
                } else {
                    formUtils.clearFieldError(input); // Clear if previously had error and now filled
                }
            });

            // --- Phone Number Validations ---
            const studentMobileInput = document.getElementById('studentMobile');
            const fatherMobileInput = document.getElementById('fatherMobile');
            const motherMobileInput = document.getElementById('motherMobile');

            // Phone numbers are fully optional, only validate format if filled
            const hasStudentMobile = studentMobileInput && studentMobileInput.value.trim();
            const hasFatherMobile = fatherMobileInput && fatherMobileInput.value.trim();
            const hasMotherMobile = motherMobileInput && motherMobileInput.value.trim();

            // Require at least one phone number
            formUtils.clearFieldError(studentMobileInput);
            formUtils.clearFieldError(fatherMobileInput);
            formUtils.clearFieldError(motherMobileInput);
            if (!hasStudentMobile && !hasFatherMobile && !hasMotherMobile) {
                isValid = false;
                formUtils.displayFieldError(studentMobileInput, 'At least one phone number is required.');
                formUtils.displayFieldError(fatherMobileInput, 'At least one phone number is required.');
                formUtils.displayFieldError(motherMobileInput, 'At least one phone number is required.');
            } else {
                if (hasStudentMobile) {
                    isValid = formUtils.validateIndianPhoneNumber(studentMobileInput, 'Student Mobile Number') && isValid;
                }
                if (hasFatherMobile) {
                    isValid = formUtils.validateIndianPhoneNumber(fatherMobileInput, 'Father Mobile Number') && isValid;
                }
                if (hasMotherMobile) {
                    isValid = formUtils.validateIndianPhoneNumber(motherMobileInput, 'Mother Mobile Number') && isValid;
                }
            }

            // --- Specific Marks Validations ---
            // Get max marks based on board
            const maxMarks = {
                'AP/Telangana': {
                    physics: 60,
                    chemistry: 60,
                    physicsPractical: 30,
                    chemistryPractical: 30,
                    mathematics11a: 75,
                    mathematics11b: 75,
                    mathematics12a: 75,
                    mathematics12b: 75,
                    english11: 100,
                    language11: 100,
                    cs: 100,
                    bio: 100,
                    ece: 100,
                    kannada: 100,
                    english12: 100,
                    other: 100
                },
                'CBSE': {
                    physics: 100,
                    chemistry: 100,
                    mathematics: 100,
                    cs: 100,
                    bio: 100,
                    ece: 100,
                    kannada: 100,
                    english12: 100,
                    other: 100
                },
                'Karnataka': {
                    physics: 100,
                    chemistry: 100,
                    mathematics: 100,
                    cs: 100,
                    bio: 100,
                    ece: 100,
                    kannada: 100,
                    english12: 100,
                    other: 100
                },
                'Other': {
                    physics: 100,
                    chemistry: 100,
                    mathematics: 100,
                    cs: 100,
                    bio: 100,
                    ece: 100,
                    kannada: 100,
                    english12: 100,
                    other: 100
                }
            };

            const currentMaxMarks = maxMarks[educationBoard] || maxMarks['Other'];

            // Validate 12th Standard Core Subjects
            isValid = formUtils.validateNumericField(physicsInput, '12th Physics (Theory)', true, 0, currentMaxMarks.physics) && isValid;
            isValid = formUtils.validateNumericField(chemistryInput, '12th Chemistry (Theory)', false, 0, currentMaxMarks.chemistry) && isValid;

            if (educationBoard === 'AP/Telangana') {
                isValid = formUtils.validateNumericField(mathematics12aInput, '12th Maths (A)', true, 0, currentMaxMarks.mathematics12a) && isValid;
                isValid = formUtils.validateNumericField(mathematics12bInput, '12th Maths (B)', true, 0, currentMaxMarks.mathematics12b) && isValid;
                isValid = formUtils.validateNumericField(physics12PracticalInput, '12th Physics (Practical)', true, 0, currentMaxMarks.physicsPractical) && isValid;
                isValid = formUtils.validateNumericField(chemistry12PracticalInput, '12th Chemistry (Practical)', true, 0, currentMaxMarks.chemistryPractical) && isValid;
                formUtils.clearFieldError(mathematics12StandardInput); // Not required for AP/T
            } else {
                isValid = formUtils.validateNumericField(mathematics12StandardInput, '12th Mathematics', true, 0, currentMaxMarks.mathematics) && isValid;
                formUtils.clearFieldError(mathematics12aInput); // Not required for other boards
                formUtils.clearFieldError(mathematics12bInput); // Not required for other boards
                formUtils.clearFieldError(physics12PracticalInput);
                formUtils.clearFieldError(chemistry12PracticalInput);
            }

            // 11th Standard Subjects (only for AP/Telangana)
            if (educationBoard === 'AP/Telangana') {
                isValid = formUtils.validateNumericField(physics11Input, '11th Physics (Theory)', true, 0, currentMaxMarks.physics) && isValid;
                isValid = formUtils.validateNumericField(chemistry11Input, '11th Chemistry (Theory)', true, 0, currentMaxMarks.chemistry) && isValid;
                isValid = formUtils.validateNumericField(mathematics11aInput, '11th Maths (A)', true, 0, currentMaxMarks.mathematics11a) && isValid;
                isValid = formUtils.validateNumericField(mathematics11bInput, '11th Maths (B)', true, 0, currentMaxMarks.mathematics11b) && isValid;
                isValid = formUtils.validateNumericField(english11Input, '11th English', false, 0, currentMaxMarks.english11) && isValid;
                isValid = formUtils.validateNumericField(language11Input, '11th Language', false, 0, currentMaxMarks.language11) && isValid;
            } else {
                formUtils.clearFieldError(physics11Input);
                formUtils.clearFieldError(mathematics11aInput);
                formUtils.clearFieldError(mathematics11bInput);
                formUtils.clearFieldError(chemistry11Input);
                formUtils.clearFieldError(english11Input);
                formUtils.clearFieldError(language11Input);
            }

            // Optional 12th Subjects (validate if filled)
            isValid = formUtils.validateNumericField(csInput, 'Computer Science Marks', false, 0, currentMaxMarks.cs) && isValid;
            isValid = formUtils.validateNumericField(bioInput, 'Biology Marks', false, 0, currentMaxMarks.bio) && isValid;
            isValid = formUtils.validateNumericField(eceInput, 'ECE Marks', false, 0, currentMaxMarks.ece) && isValid;

            // Get the new optional subject input elements for validation
            const kannadaMarks12Input = document.getElementById('kannada_marks_12');
            const englishMarks12Input = document.getElementById('english_marks_12');
            const otherUnnamedMarks12Input = document.getElementById('other_unnamed_marks_12');

            isValid = formUtils.validateNumericField(kannadaMarks12Input, 'Kannada Marks', false, 0, currentMaxMarks.kannada) && isValid;
            isValid = formUtils.validateNumericField(englishMarks12Input, 'English Marks', false, 0, currentMaxMarks.english12) && isValid;
            isValid = formUtils.validateNumericField(otherUnnamedMarks12Input, 'Other Unnamed Marks', false, 0, currentMaxMarks.other) && isValid;

            // --- Course Preferences Validation ---
            const courseCheckboxes = document.querySelectorAll('.course-checkbox:checked');
            const courseSection = document.getElementById('coursePreferencesSection') || document.querySelector('.course-preference');
            let courseErrorContainer;

            if (courseSection) {
                courseErrorContainer = courseSection.querySelector('.error-message-courses');
                if (!courseErrorContainer) {
                    courseErrorContainer = document.createElement('span');
                    courseErrorContainer.className = 'error-message error-message-courses';
                    const courseLabel = courseSection.querySelector('label'); // Find the main label for course preferences
                    if (courseLabel && courseLabel.parentNode === courseSection) {
                        // Insert error message after the label
                        courseLabel.parentNode.insertBefore(courseErrorContainer, courseLabel.nextSibling);
                    } else {
                        // Fallback: append to the section if label structure is different
                        courseSection.appendChild(courseErrorContainer);
                    }
                }
                // Ensure styles are applied
                courseErrorContainer.style.color = 'red';
                courseErrorContainer.style.fontSize = '12px';
                courseErrorContainer.style.display = 'none'; // Default to hidden

                if (courseCheckboxes.length === 0) {
                    isValid = false;
                    courseErrorContainer.textContent = 'At least one course preference is required.';
                    courseErrorContainer.style.display = 'block'; // Show error
                } else {
                    courseErrorContainer.textContent = '';
                    courseErrorContainer.style.display = 'none'; // Hide if valid
                }
            } else {
                console.warn('Course preference section not found in the DOM. Cannot validate preferences.');
                // Optionally, set isValid = false if course preferences are strictly mandatory
                // isValid = false;
            }

            return isValid;
        }
    };

    // Initialize event listeners
    function initializeEventListeners() {
        // Form submission
        if (enquiryForm) {
            enquiryForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                if (formUtils.validateForm()) {
                    try {
                        // Disable submit button to prevent multiple submissions
                        const submitBtn = document.querySelector('button[type="submit"]');
                        submitBtn.disabled = true;
                        submitBtn.innerHTML = 'Submitting...';

                        // Get the current token (the one displayed on the form)
                        // This is the token we'll store in the database
                        const finalTokenNumber = await getCurrentToken();
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
                            kannada_marks_12: document.getElementById('kannada_marks_12').value ? parseFloat(document.getElementById('kannada_marks_12').value) : null,
                            english_marks_12: document.getElementById('english_marks_12').value ? parseFloat(document.getElementById('english_marks_12').value) : null,
                            other_unnamed_marks_12: document.getElementById('other_unnamed_marks_12').value ? parseFloat(document.getElementById('other_unnamed_marks_12').value) : null,
                            
                            pcm_percentage: pcmPercentageInput.value ? parseFloat(pcmPercentageInput.value) : null,
                            total_percentage: totalPercentageInput.value ? parseFloat(totalPercentageInput.value) : null,
                            
                            // Academic marks - 11th grade (for AP/Telangana students, using direct input elements)
                            physics_marks_11: (currentBoard === 'AP/Telangana' && physics11Input.value) ? parseFloat(physics11Input.value) : null,
                            chemistry_marks_11: (currentBoard === 'AP/Telangana' && chemistry11Input.value) ? parseFloat(chemistry11Input.value) : null,
                            mathematics_marks_11a: (currentBoard === 'AP/Telangana' && mathematics11aInput.value) ? parseFloat(mathematics11aInput.value) : null,
                            mathematics_marks_11b: (currentBoard === 'AP/Telangana' && mathematics11bInput.value) ? parseFloat(mathematics11bInput.value) : null,
                            english_marks_11: (currentBoard === 'AP/Telangana' && english11Input.value) ? parseFloat(english11Input.value) : null,
                            language_marks_11: (currentBoard === 'AP/Telangana' && language11Input.value) ? parseFloat(language11Input.value) : null,
                            // Practical Marks - 12th grade (AP/Telangana)
                            physics_marks_12_practical: (currentBoard === 'AP/Telangana' && physics12PracticalInput.value) ? parseFloat(physics12PracticalInput.value) : null,
                            chemistry_marks_12_practical: (currentBoard === 'AP/Telangana' && chemistry12PracticalInput.value) ? parseFloat(chemistry12PracticalInput.value) : null,
                                                
                            // Entrance exam details (from formDataObj as before)
                            jee_rank: formDataObj.jeeRank ? String(formDataObj.jeeRank) : null,
                            comedk_rank: formDataObj.comedk ? String(formDataObj.comedk) : null,
                            cet_rank: formDataObj.cetRank ? String(formDataObj.cetRank) : null,
                            
                            // Course preferences as JSON
                            course_preferences: coursePreferencesDict,

                            // Diploma-specific fields
                            educational_qualification: formDataObj.educationalQualification || null,
                            diploma_percentage: formDataObj.diplomaPercentage ? parseFloat(formDataObj.diplomaPercentage) : null,
                            dcet_rank: formDataObj.dcetRank ? String(formDataObj.dcetRank) : null
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
                                alert(`Error inserting data: ${enquiryError.message || 'Unknown error'}\nCode: ${enquiryError.code || 'No code'}\nDetails: ${JSON.stringify(enquiryError.details) || 'No details'}`);
                                throw enquiryError;
                            }

                            // Send confirmation email to student
                            if (formDataObj.studentEmail && finalTokenNumber) {
                                formUtils.sendConfirmationEmail(formDataObj.studentEmail, formDataObj.studentName, finalTokenNumber);
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
                        
                        setTimeout(async () => {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = 'Submit Enquiry';
                            submitBtn.classList.remove('success');

                            enquiryForm.reset();

                            await incrementToken();
                            const newTokenForDisplay = await getCurrentToken();
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
                                if (typeof formUtils.clearFieldError === 'function') { // Check if clearFieldError is defined
                                    formUtils.clearFieldError(input);
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
                        if (error.message && !error.message.includes("Unknown error occurred during database operation")) {
                            alert(`There was an error processing your form. Please try again.\n\nDetails: ${error.message}`);
                        }
                    } finally {
                        const submitBtn = document.querySelector('button[type="submit"]');
                        if (submitBtn.innerHTML !== 'Form Submitted Successfully!') {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = 'Submit Enquiry';
                        }
                    }
                }
            });
        }

        // Close modal
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                successModal.style.display = 'none';
            });
        }

        // Print form
        if (printFormBtn) {
            printFormBtn.addEventListener('click', function() {
                window.print();
            });
        }

        // Click outside modal to close
        window.addEventListener('click', function(event) {
            if (event.target === successModal) {
                successModal.style.display = 'none';
            }
        });
    }

    // Initialize all event listeners
    initializeEventListeners();
});

// Add this utility function before the form submission handler
function parseDate(dateString) {
    // If the date is already in YYYY-MM-DD or DD-MM-YYYY, return as is
    // Otherwise, try to parse and format as YYYY-MM-DD
    if (!dateString) return '';
    // Try to detect DD-MM-YYYY and convert to YYYY-MM-DD
    const ddmmyyyy = /^\d{2}-\d{2}-\d{4}$/;
    if (ddmmyyyy.test(dateString)) {
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
    }
    // Try to detect YYYY-MM-DD
    const yyyymmdd = /^\d{4}-\d{2}-\d{2}$/;
    if (yyyymmdd.test(dateString)) {
        return dateString;
    }
    // Otherwise, try to parse as Date
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    // Fallback: return original string
    return dateString;
}
