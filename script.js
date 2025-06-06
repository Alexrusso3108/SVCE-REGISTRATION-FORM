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
    
    displayDateAndToken(); // Sets date and displays current token without incrementing

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
        '#physics11', '#physics11Practical', '#chemistry11', '#chemistry11Practical', '#mathematics11a', '#mathematics11b'
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
            // Ensure marks are not negative and not above a reasonable maximum (e.g., 100 or board specific max)
            // For simplicity, we'll cap at 100 here, but for AP/Telangana theory is 60.
            // This basic check helps prevent extreme values from skewing calculations.
            // More precise max mark validation should be in validateNumericField.
            if (isNaN(val) || val < 0) return { value: 0, entered: true }; // Treat invalid/negative as 0 but acknowledge entry
            return { value: val, entered: true };
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

        // Optional Subjects for PCM best-of calculation (12th)
        const cs12 = getMark(csInput);
        const bio12 = getMark(bioInput);
        const ece12 = getMark(eceInput);
        // Other optionals for total percentage
        const kannada12 = getMark(document.getElementById('kannada_marks_12'));
        const english12 = getMark(document.getElementById('english_marks_12'));
        const otherUnnamed12 = getMark(document.getElementById('other_unnamed_marks_12')); // Corrected definition

        let pcmPercentageStr = '';
        let totalPercentageStr = '';

        // --- PCM Percentage Calculation (New Logic) ---
        let pcmPhyMarks = 0;
        let pcmMathMarks = 0;
        let pcmPhyMax = 0;
        let pcmMathMax = 0;

        if (educationBoard === 'AP/Telangana') {
            if (physics12Theory.entered) pcmPhyMarks += physics12Theory.value;
            if (physics12Practical.entered) pcmPhyMarks += physics12Practical.value;
            pcmPhyMax = (physics12Theory.entered || physics12Practical.entered) ? 90 : 0; // 60 Theory + 30 Practical

            if (mathematics12A.entered) pcmMathMarks += mathematics12A.value;
            if (mathematics12B.entered) pcmMathMarks += mathematics12B.value;
            pcmMathMax = (mathematics12A.entered || mathematics12B.entered) ? 150 : 0; // 75A + 75B
        } else {
            if (physics12Theory.entered) pcmPhyMarks += physics12Theory.value;
            pcmPhyMax = physics12Theory.entered ? 100 : 0;

            if (mathematics12Std.entered) pcmMathMarks += mathematics12Std.value;
            pcmMathMax = mathematics12Std.entered ? 100 : 0;
        }

        const optionalSubjectsForPCM = [];
        if (chemistry12Theory.entered) optionalSubjectsForPCM.push(chemistry12Theory.value); // Assuming Chem max 100 for non-AP/T, 60 for AP/T theory
        if (bio12.entered) optionalSubjectsForPCM.push(bio12.value); // Max 100
        if (cs12.entered) optionalSubjectsForPCM.push(cs12.value);   // Max 100
        if (ece12.entered) optionalSubjectsForPCM.push(ece12.value); // Max 100
        
        let bestOptionalMarks = 0;
        let bestOptionalMax = 0;
        if (optionalSubjectsForPCM.length > 0) {
            bestOptionalMarks = Math.max(...optionalSubjectsForPCM);
            // Determine max for the best optional. AP/T Chem is 60 (theory) + 30 (practical if applicable, not included here for simplicity in best-of)
            // For simplicity, if Chemistry is chosen and it's AP/T, its contribution to PCM max is 60 (theory part for this calc).
            // This part can be refined if practicals of the 'best of' subject also need to be dynamically included.
            bestOptionalMax = (educationBoard === 'AP/Telangana' && bestOptionalMarks === chemistry12Theory.value && chemistry12Theory.entered) ? 60 : 100;
            // If chemistry is the best and it's AP/T, its practicals also need to be considered if they are part of the 'best subject' score.
            // For now, we assume the 'value' in getMark for chemistry12Theory is just theory for AP/T.
            // If chemistry practicals are to be combined for 'best of chem', then chemistry12Theory.value should represent theory+practical for AP/T.
            // Let's assume chemistry12Theory.value is just theory for AP/T (max 60) for this specific 'best of' selection.
            // The main AP/T PCM calculation below handles combined practicals for *all* core subjects if they are *all* entered.
        }

        if (physics12Theory.entered && (mathematics12Std.entered || (mathematics12A.entered && mathematics12B.entered)) && bestOptionalMax > 0) {
            const pcmObtained = pcmPhyMarks + pcmMathMarks + bestOptionalMarks;
            const pcmMax = pcmPhyMax + pcmMathMax + bestOptionalMax;
            if (pcmMax > 0) {
                pcmPercentageStr = ((pcmObtained / pcmMax) * 100).toFixed(2);
            }
        }

        // --- Total Percentage Calculation (Adapting existing logic) ---
        if (educationBoard === 'AP/Telangana') {
            // 11th PCM (original logic for total percentage part)
            const apT11PcmFieldsEntered = physics11Theory.entered && chemistry11Theory.entered && 
                                          mathematics11A.entered && mathematics11B.entered && 
                                          physics11Practical.entered && chemistry11Practical.entered;
            let pcm11ObtainedTotal = 0;
            let pcm11MaxTotal = 0;
            let total11Perc = 0;
            if (apT11PcmFieldsEntered) {
                const physics11Obtained = physics11Theory.value + physics11Practical.value;
                const chemistry11Obtained = chemistry11Theory.value + chemistry11Practical.value;
                const maths11Obtained = mathematics11A.value + mathematics11B.value;
                pcm11ObtainedTotal = physics11Obtained + chemistry11Obtained + maths11Obtained;
                pcm11MaxTotal = 90 + 90 + 150; // Phy(60Th+30Pr) + Chem(60Th+30Pr) + Maths(75+75)
                if (pcm11MaxTotal > 0) total11Perc = (pcm11ObtainedTotal / pcm11MaxTotal) * 100;
            }

            // 12th Total (using new PCM approach + other optionals)
            let physics12Total = 0;
            if (physics12Theory.entered) physics12Total += physics12Theory.value;
            if (physics12Practical.entered) physics12Total += physics12Practical.value;
            
            let chemistry12Total = 0; // This is the actual chemistry marks, not the 'best of'
            if (chemistry12Theory.entered) chemistry12Total += chemistry12Theory.value;
            if (chemistry12Practical.entered) chemistry12Total += chemistry12Practical.value;

            let maths12Total = 0;
            if (mathematics12A.entered) maths12Total += mathematics12A.value;
            if (mathematics12B.entered) maths12Total += mathematics12B.value;

            let total12Obtained = 0;
            let total12Max = 0;

            if (physics12Theory.entered || physics12Practical.entered) { total12Obtained += physics12Total; total12Max += 90; }
            if (mathematics12A.entered || mathematics12B.entered) { total12Obtained += maths12Total; total12Max += 150; }
            if (chemistry12Theory.entered || chemistry12Practical.entered) { total12Obtained += chemistry12Total; total12Max += 90; }
            
            // Add other optionals for total percentage
            if (cs12.entered) { total12Obtained += cs12.value; total12Max += 100; };
            if (bio12.entered) { total12Obtained += bio12.value; total12Max += 100; };
            if (ece12.entered) { total12Obtained += ece12.value; total12Max += 100; };
            const kannadaInputElement = document.getElementById('kannada_marks_12');
            const englishInputElement = document.getElementById('english_marks_12');
            const otherUnnamedMarksInputElement = document.getElementById('other_unnamed_marks_12');

            if (kannada12.value > 0 && kannadaInputElement && !kannadaInputElement.disabled) {
                total12Obtained += kannada12.value;
                total12Max += 100;
            } else if (english12.value > 0 && englishInputElement && !englishInputElement.disabled) {
                total12Obtained += english12.value;
                total12Max += 100;
            } else if (otherUnnamed12.value > 0 && otherUnnamedMarksInputElement && !otherUnnamedMarksInputElement.disabled) {
                total12Obtained += otherUnnamed12.value;
                total12Max += 100;
            }

            let total12Perc = 0;
            if (total12Max > 0) total12Perc = (total12Obtained / total12Max) * 100;

            if (apT11PcmFieldsEntered && total12Max > 0) { // Ensure both years have data for averaging
                totalPercentageStr = ((total11Perc + total12Perc) / 2).toFixed(2);
            } else if (total12Max > 0) { // Only 12th data available
                 totalPercentageStr = total12Perc.toFixed(2);
            } else { 
                totalPercentageStr = '';
            }

        } else { // For other boards (Non AP/Telangana)
            let pcmObtainedForTotal = 0;
            let pcmMaxForTotal = 0;

            if (physics12Theory.entered) { pcmObtainedForTotal += physics12Theory.value; pcmMaxForTotal += 100; }
            if (mathematics12Std.entered) { pcmObtainedForTotal += mathematics12Std.value; pcmMaxForTotal += 100; }
            if (chemistry12Theory.entered) { pcmObtainedForTotal += chemistry12Theory.value; pcmMaxForTotal += 100; }
            // Note: For total percentage, we include actual chemistry, not the 'best of'.
            // The PCM percentage field will show the 'best of' logic.

            let total12Obtained = pcmObtainedForTotal;
            let total12Max = pcmMaxForTotal;

            // Add other optionals
            if (cs12.entered) { total12Obtained += cs12.value; total12Max += 100; };
            if (bio12.entered) { total12Obtained += bio12.value; total12Max += 100; };
            const kannadaInputElement = document.getElementById('kannada_marks_12');
            const englishInputElement = document.getElementById('english_marks_12');
            const otherUnnamedMarksInputElement = document.getElementById('other_unnamed_marks_12');

            if (kannada12.entered && kannadaInputElement && !kannadaInputElement.disabled) {
                total12Obtained += kannada12.value;
                total12Max += 100;
            } else if (english12.entered && englishInputElement && !englishInputElement.disabled) {
                total12Obtained += english12.value;
                total12Max += 100;
            } else if (otherUnnamed12.entered && otherUnnamedMarksInputElement && !otherUnnamedMarksInputElement.disabled) {
                total12Obtained += otherUnnamed12.value;
                total12Max += 100;
            }
            
            if (total12Max > 0) {
                totalPercentageStr = ((total12Obtained / total12Max) * 100).toFixed(2);
            } else {
                totalPercentageStr = '';
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
                    // Practical Marks - 11th grade (AP/Telangana)
                    physics_marks_11_practical: (currentBoard === 'AP/Telangana' && physics11PracticalInput.value) ? parseFloat(physics11PracticalInput.value) : null,
                    chemistry_marks_11_practical: (currentBoard === 'AP/Telangana' && chemistry11PracticalInput.value) ? parseFloat(chemistry11PracticalInput.value) : null,
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
                        sendConfirmationEmail(formDataObj.studentEmail, formDataObj.studentName, finalTokenNumber);
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

    // Helper function to validate Indian phone numbers
function validateIndianPhoneNumber(inputElement, fieldName) {
    clearFieldError(inputElement);
    const value = inputElement.value.trim();
    const indianPhoneRegex = /^(?:\+91|0)?[6789]\d{9}$/;

    // Only validate format if there's a value. Required check is handled by generic validator.
    if (value && !indianPhoneRegex.test(value)) {
        displayFieldError(inputElement, `Invalid ${fieldName}. Must be 10 digits (e.g., 9xxxxxxxxx) or optionally start with +91 or 0.`);
        return false;
    }
    return true;
}

// Send a confirmation email to the student after successful registration
function sendConfirmationEmail(studentEmail, studentName, tokenNumber) {
    emailjs.send("service_m81m0jq", "template_4d2nobg", {
        to_email: studentEmail,   // matches {{to_email}} in your template
        name: studentName,        // matches {{name}} in your template
        token_number: tokenNumber // if you add {{token_number}} to your template
    })
    .then(function(response) {
        console.log('SUCCESS! Confirmation email sent:', response.status, response.text);
    }, function(error) {
        console.error('FAILED to send confirmation email...', error);
        alert('Registration saved, but failed to send confirmation email. Please contact the office if you do not receive an email.');
    });
}

// Form validation
function validateForm() {
        let isValid = true;
        updateMarksFieldsBasedOnBoard(); // Ensure 'required' attributes are current

        const educationBoard = educationBoardSelect ? educationBoardSelect.value : '';
        const educationalQualification = educationalQualificationSelect ? educationalQualificationSelect.value : '';

        // If Diploma, skip required validation for 12th/11th marks and board fields
        if (educationalQualification === 'Diploma') {
            // List of all 12th/11th marks and board selectors (update as needed)
            const skipSelectors = [
                '#educationBoard', '#physics', '#chemistry', '#mathematics',
                '#mathematics12a', '#mathematics12b', '#physics11', '#mathematics11a', '#mathematics11b', '#chemistry11',
                '#physics11Practical', '#chemistry11Practical', '#physics12Practical', '#chemistry12Practical',
                '#pcmPercentage', '#totalPercentage'
            ];
            skipSelectors.forEach(sel => {
                const el = document.querySelector(sel);
                if (el) {
                    clearFieldError(el);
                }
            });
            // Only validate diploma fields
            const diplomaPercentageInput = document.getElementById('diplomaPercentage');
            const dcetRankInput = document.getElementById('dcetRank');
            if (!diplomaPercentageInput.value.trim()) {
                isValid = false;
                displayFieldError(diplomaPercentageInput, 'Diploma Percentage is required.');
            } else {
                clearFieldError(diplomaPercentageInput);
            }
            if (!dcetRankInput.value.trim()) {
                isValid = false;
                displayFieldError(dcetRankInput, 'DCET Rank is required.');
            } else {
                clearFieldError(dcetRankInput);
            }
            // Skip rest of validation
            return isValid;
        }

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

        // --- Phone Number Validations ---
        const studentMobileInput = document.getElementById('studentMobile');
        const fatherMobileInput = document.getElementById('fatherMobile');
        const motherMobileInput = document.getElementById('motherMobile');

        // Phone numbers are fully optional, only validate format if filled
        const hasStudentMobile = studentMobileInput && studentMobileInput.value.trim();
        const hasFatherMobile = fatherMobileInput && fatherMobileInput.value.trim();
        const hasMotherMobile = motherMobileInput && motherMobileInput.value.trim();

        // Require at least one phone number
        clearFieldError(studentMobileInput);
        clearFieldError(fatherMobileInput);
        clearFieldError(motherMobileInput);
        if (!hasStudentMobile && !hasFatherMobile && !hasMotherMobile) {
            isValid = false;
            displayFieldError(studentMobileInput, 'At least one phone number is required.');
            displayFieldError(fatherMobileInput, 'At least one phone number is required.');
            displayFieldError(motherMobileInput, 'At least one phone number is required.');
        } else {
            if (hasStudentMobile) {
                isValid = validateIndianPhoneNumber(studentMobileInput, 'Student Mobile Number') && isValid;
            }
            if (hasFatherMobile) {
                isValid = validateIndianPhoneNumber(fatherMobileInput, 'Father Mobile Number') && isValid;
            }
            if (hasMotherMobile) {
                isValid = validateIndianPhoneNumber(motherMobileInput, 'Mother Mobile Number') && isValid;
            }
        }

        // --- Specific Marks Validations ---
        // 12th Standard Core Subjects
        let phy12Max = 100;
        let chem12Max = 100;
        if (educationBoard === 'AP/Telangana') {
            phy12Max = 60;
            chem12Max = 60;
        }
        isValid = validateNumericField(physicsInput, '12th Physics (Theory)', true, 0, phy12Max) && isValid;
        isValid = validateNumericField(chemistryInput, '12th Chemistry (Theory)', false, 0, chem12Max) && isValid;

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
        isValid = validateNumericField(csInput, 'Computer Science Marks', false) && isValid;
        isValid = validateNumericField(bioInput, 'Biology Marks', false) && isValid; // Added missing bioInput validation here
        isValid = validateNumericField(eceInput, 'ECE Marks', false) && isValid;

        // Get the new optional subject input elements for validation
        const kannadaMarks12Input = document.getElementById('kannada_marks_12');
        const englishMarks12Input = document.getElementById('english_marks_12');
        const otherUnnamedMarks12Input = document.getElementById('other_unnamed_marks_12');

        isValid = validateNumericField(kannadaMarks12Input, 'Kannada Marks', false) && isValid;
        isValid = validateNumericField(englishMarks12Input, 'English Marks', false) && isValid;
        isValid = validateNumericField(otherUnnamedMarks12Input, 'Other Unnamed Marks', false) && isValid;

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
        }emailjs.send("service_m81m0jq", "template_cuhvuht", {
            to_email: studentEmail,
            token_number: tokenNumber
        })

        return isValid;
    }
});

