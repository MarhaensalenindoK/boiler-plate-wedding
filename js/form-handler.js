/**
 * Form Handler
 * Handles RSVP form submission with validation and AJAX support
 */

(function() {
    'use strict';

    // ==================== CONFIGURATION ==================== -->
    const CONFIG = {
        endpoint: '/api/rsvp', // API endpoint for form submission
        method: 'POST',
        enableValidation: true,
        showSuccessAnimation: true,
        storageKey: 'wedding_rsvps'
    };

    // ==================== STATE ==================== -->
    let rsvpForm = null;
    let rsvpContent = null;
    let rsvpListWrapper = null;
    let rsvpListScroll = null;
    let rsvpCount = null;
    let isSubmitting = false;

    // ==================== DOM ELEMENTS ==================== -->

    /**
     * Initialize form-related DOM elements
     */
    function initElements() {
        rsvpForm = document.getElementById('rsvpForm');
        rsvpContent = document.getElementById('rsvpContent');
        rsvpListWrapper = document.getElementById('rsvpListWrapper');
        rsvpListScroll = document.getElementById('rsvpListScroll');
        rsvpCount = document.getElementById('rsvpCount');

        if (!rsvpForm) return;

        // Listen for form submit instead of button click
        rsvpForm.addEventListener('submit', handleFormSubmit);

        // Form validation on input
        const inputs = rsvpForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });

        // Initial list render
        renderRSVPList();
    }

    // ==================== VALIDATION ==================== -->

    const validationRules = {
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        guests: {
            required: true,
            min: 1,
            max: 10,
            message: 'Please enter number of guests (1-10)'
        },
        attendance: {
            required: true,
            message: 'Please select your attendance status'
        },
        message: {
            maxLength: 500,
            message: 'Message should be less than 500 characters'
        }
    };

    function validateField(input) {
        if (!CONFIG.enableValidation) return true;

        const name = input.name || input.id;
        const value = input.value.trim();
        const rules = validationRules[name];

        if (!rules) return true;

        if (rules.required && value === '') {
            showFieldError(input, rules.message);
            return false;
        }

        if (value === '' && !rules.required) return true;

        if (rules.pattern && !rules.pattern.test(value)) {
            showFieldError(input, rules.message);
            return false;
        }

        if (input.type === 'number') {
            const numValue = parseInt(value, 10);
            if (!isNaN(numValue)) {
                if (rules.min && numValue < rules.min) {
                    showFieldError(input, `Minimum is ${rules.min}`);
                    return false;
                }
                if (rules.max && numValue > rules.max) {
                    showFieldError(input, `Maximum is ${rules.max}`);
                    return false;
                }
            }
        }

        clearFieldError(input);
        return true;
    }

    function validateForm() {
        if (!CONFIG.enableValidation) return true;
        const inputs = rsvpForm.querySelectorAll('input, select, textarea');
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) isValid = false;
        });
        return isValid;
    }

    function showFieldError(input, message) {
        clearFieldError(input);
        input.classList.add('error');
        let errorMsg = input.parentElement.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = 'font-size: 0.75rem; color: #a73b21; margin-top: 4px; display: block; font-family: Manrope, sans-serif;';
            input.parentElement.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }

    function clearFieldError(input) {
        input.classList.remove('error');
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        console.log('Form submission intercepted'); // Debug
        if (isSubmitting) return;
        if (!validateForm()) return;
        submitForm();
    }

    async function submitForm() {
        isSubmitting = true;
        const submitBtn = rsvpForm.querySelector('.rsvp-submit-btn-editorial');

        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }

        try {
            const formData = new FormData(rsvpForm);
            const data = Object.fromEntries(formData.entries());
            data.timestamp = new Date().toISOString();
            data.id = Date.now();

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Save to LocalStorage
            saveRSVP(data);

            // Update List UI
            renderRSVPList();

            // Show success message
            showSuccessMessage();

        } catch (error) {
            console.error('Form submission error:', error);
            showToast('Failed to submit form.', 'error');
        } finally {
            isSubmitting = false;
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        }
    }

    // ==================== RSVP LIST LOGIC ==================== -->

    function saveRSVP(data) {
        const existing = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '[]');
        existing.unshift(data); // Add to top
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(existing));
    }

    function renderRSVPList() {
        if (!rsvpListWrapper || !rsvpListScroll) return;

        const rsvps = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '[]');
        
        // Always show the section as per user request
        rsvpListWrapper.style.display = 'flex';
        rsvpContent.classList.add('has-list');
        
        if (rsvps.length === 0) {
            rsvpCount.textContent = '0 Response';
            rsvpListScroll.innerHTML = `
                <div class="empty-list-message" style="text-align: center; padding: 40px; color: #5e605b; font-family: 'Noto Serif', serif; font-style: italic;">
                    <p>Jadilah yang pertama mengirim pesan.</p>
                </div>
            `;
            return;
        }

        rsvpCount.textContent = `${rsvps.length} Response${rsvps.length > 1 ? 's' : ''}`;

        // Clear and populate list
        rsvpListScroll.innerHTML = '';
        rsvps.forEach(rsvp => {
            const isAttending = rsvp.attendance === 'yes';
            const card = document.createElement('article');
            card.className = `rsvp-card-editorial ${isAttending ? 'attending' : ''}`;
            
            card.innerHTML = `
                <header>
                    <div class="email-info">
                        <span class="material-symbols-outlined">mail</span>
                        <span class="email-text">${rsvp.email}</span>
                    </div>
                    <span class="status-pill-editorial ${!isAttending ? 'declined' : ''}">
                        ${isAttending ? `Joyfully Accepting (${rsvp.guests})` : 'Regretfully Declines'}
                    </span>
                </header>
                ${rsvp.message ? `<p class="wish-message-editorial">"${rsvp.message}"</p>` : ''}
            `;
            rsvpListScroll.appendChild(card);
        });
    }

    // ==================== SUCCESS MESSAGE ==================== -->

    function showSuccessMessage() {
        rsvpForm.style.opacity = '0';
        setTimeout(() => {
            rsvpForm.style.display = 'none';
            const successDiv = document.getElementById('rsvpSuccess');
            if (successDiv) successDiv.classList.add('show');
        }, 300);
    }

    function showToast(message, type = 'success') {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // ==================== INITIALIZATION ==================== -->

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initElements);
        } else {
            initElements();
        }
    }

    init();
})();
