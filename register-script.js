document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let currentStep = 1;
    const form = document.getElementById('registrationForm');
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const totalSteps = steps.length;

    // --- Navigation Functions ---
    const showStep = (stepNumber) => {
        steps.forEach(step => step.classList.remove('active'));
        document.getElementById(`step-${stepNumber}`).classList.add('active');

        stepIndicators.forEach(indicator => {
            indicator.classList.remove('active');
            if (parseInt(indicator.dataset.step) <= stepNumber) {
                indicator.classList.add('active');
            }
        });
        currentStep = stepNumber;
    };

    const handleNextStep = () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                if(currentStep === totalSteps - 1) populateSummary();
                showStep(currentStep + 1);
            }
        }
    };
    
    const handlePrevStep = () => {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    };

    // --- Validation ---
    const validateStep = (stepNumber) => {
        let isValid = true;
        const currentStepInputs = document.querySelectorAll(`#step-${stepNumber} [required]`);
        
        currentStepInputs.forEach(input => {
            input.classList.remove('invalid');
            if (input.type === 'checkbox' && !input.checked && input.name === 'terms') {
                isValid = false;
                alert('You must agree to the Terms & Conditions.');
                input.parentElement.style.animation = 'shake 0.5s';
                setTimeout(() => input.parentElement.style.animation = '', 500);
            } else if (input.type === 'radio') {
                const radioGroup = document.querySelectorAll(`input[name="${input.name}"]`);
                if (![...radioGroup].some(r => r.checked)) {
                    isValid = false;
                }
            } else if (input.type === 'checkbox' && input.name === 'destination') {
                // Handled as a group
            } else if (!input.value.trim()) {
                isValid = false;
                input.classList.add('invalid');
            }
        });
        
        // Special validation for destination checkboxes in step 2
        if (stepNumber === 2) {
            const destinations = document.querySelectorAll('input[name="destination"]:checked');
            if (destinations.length === 0) {
                isValid = false;
                alert("Please select at least one destination.");
            }
        }
        
        if (!isValid && stepNumber !== 2) alert("Please fill out all required fields.");
        return isValid;
    };

    // --- Summary Population ---
    const populateSummary = () => {
        const summaryContainer = document.getElementById('summary-details');
        const formData = new FormData(form);
        const destinations = [...formData.getAll('destination')].join(', ');

        summaryContainer.innerHTML = `
            <div class="summary-item"><span class="summary-label">Full Name:</span><span class="summary-value">${formData.get('name')}</span></div>
            <div class="summary-item"><span class="summary-label">Email:</span><span class="summary-value">${formData.get('email')}</span></div>
            <div class="summary-item"><span class="summary-label">Phone:</span><span class="summary-value">${formData.get('phone')}</span></div>
            <div class="summary-item"><span class="summary-label">Departure:</span><span class="summary-value">${formData.get('departure')}</span></div>
            <div class="summary-item"><span class="summary-label">Return:</span><span class="summary-value">${formData.get('return')}</span></div>
            <div class="summary-item"><span class="summary-label">Destinations:</span><span class="summary-value">${destinations}</span></div>
            <div class="summary-item"><span class="summary-label">Package:</span><span class="summary-value">${formData.get('package')}</span></div>
        `;
    };

    // --- Modal Handling ---
    const modal = document.getElementById('terms-modal');
    document.getElementById('open-modal-link').addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'flex';
    });
    document.getElementById('close-modal-btn').addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
    
    // --- Event Listeners ---
    document.querySelectorAll('.next-step').forEach(button => button.addEventListener('click', handleNextStep));
    document.querySelectorAll('.prev-step').forEach(button => button.addEventListener('click', handlePrevStep));
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            document.getElementById('registrationForm').style.display = 'none';
            document.getElementById('step-indicator-container').style.display = 'none';
            document.getElementById('success-message').style.display = 'block';
        }
    });

    // --- Interactive Card Selection ---
    document.querySelectorAll('.destination-card, .package-card').forEach(card => {
        card.addEventListener('click', () => {
            const input = card.querySelector('input');
            if(input.type === 'radio') {
                // Deselect all other radio cards in the same group
                document.querySelectorAll(`input[name="${input.name}"]`).forEach(radio => {
                    radio.parentElement.classList.remove('selected');
                });
            }
            if (input.checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    });
});