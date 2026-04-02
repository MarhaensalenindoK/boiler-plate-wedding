/**
 * Gift Section Handler
 * Handles bank account toggle and copy-to-clipboard functionality
 */

(function() {
    'use strict';

    // ==================== DOM ELEMENTS ==================== -->
    let bankItems = null;
    let copyButtons = null;

    // ==================== UTILITIES ==================== -->

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Whether copy was successful
     */
    async function copyToClipboard(text) {
        if (!text) return false;

        try {
            // Modern Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            }
        } catch (err) {
            console.warn('Clipboard API failed, falling back to textarea method');
        }

        // Fallback for older browsers
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.cssText = 'position: absolute; left: -9999px;';
            document.body.appendChild(textarea);

            textarea.select();
            document.execCommand('copy');
            textarea.remove();
            return true;
        } catch (err) {
            console.error('Copy to clipboard failed:', err);
            return false;
        }
    }

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type ('success' or 'error')
     */
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

        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    // ==================== BANK ACCOUNT TOGGLE ==================== -->

    /**
     * Initialize bank account toggle functionality
     */
    function initBankToggle() {
        bankItems = document.querySelectorAll('.bank-item');

        if (!bankItems.length) return;

        bankItems.forEach(bankItem => {
            const toggle = bankItem.querySelector('.bank-toggle');
            if (!toggle) return;

            toggle.addEventListener('click', () => {
                const isActive = bankItem.classList.contains('active');

                // Close all other bank items
                bankItems.forEach(item => item.classList.remove('active'));

                // Toggle current bank item
                if (!isActive) {
                    bankItem.classList.add('active');
                }
            });
        });
    }

    // ==================== COPY TO CLIPBOARD ==================== -->

    /**
     * Initialize copy to clipboard functionality
     */
    function initCopyToClipboard() {
        copyButtons = document.querySelectorAll('.copy-btn');

        if (!copyButtons.length) return;

        copyButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const bankItem = button.closest('.bank-item');
                if (!bankItem) return;

                // Get account number or QRIS text to copy
                const accountNumber = bankItem.querySelector('.account-number');
                const qrisText = bankItem.querySelector('.qris-instruction');
                const textToCopy = accountNumber?.textContent || qrisText?.textContent || '';

                if (!textToCopy) return;

                // Copy to clipboard
                const success = await copyToClipboard(textToCopy.trim());

                if (success) {
                    // Visual feedback on button
                    const originalIcon = button.innerHTML;
                    button.innerHTML = '<i class="fas fa-check"></i>';
                    button.style.backgroundColor = 'var(--accent-sage)';

                    setTimeout(() => {
                        button.innerHTML = originalIcon;
                        button.style.backgroundColor = '';
                    }, 1500);

                    // Show toast notification
                    showToast('Copied to clipboard!');
                } else {
                    showToast('Failed to copy. Please try manually.', 'error');
                }
            });
        });
    }

    // ==================== QRIS IMAGE PRELOADING ==================== -->

    /**
     * Preload QRIS images for faster display
     */
    function preloadQrisImages() {
        const qrisImages = document.querySelectorAll('.qris-image');

        qrisImages.forEach(img => {
            if (img.dataset.src) {
                const tempImg = new Image();
                tempImg.src = img.dataset.src;
                tempImg.onload = () => {
                    img.src = img.dataset.src;
                };
            }
        });
    }

    // ==================== ANIMATION ON SCROLL ==================== -->

    /**
     * Add scroll animations to gift section elements
     */
    function initGiftAnimations() {
        const giftSection = document.querySelector('.gift-section');
        if (!giftSection) return;

        // Animate gift cards on scroll
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe gift cards and thank you message
        const elementsToAnimate = giftSection.querySelectorAll('.gift-card, .gift-thank-you');
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Add fade-in class for animation
        const style = document.createElement('style');
        style.textContent = `
            .gift-card.fade-in,
            .gift-thank-you.fade-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        giftSection.appendChild(style);
    }

    // ==================== INITIALIZATION ==================== -->

    /**
     * Initialize gift section handler module
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeGiftSection);
        } else {
            initializeGiftSection();
        }
    }

    /**
     * Main initialization function
     */
    function initializeGiftSection() {
        initBankToggle();
        initCopyToClipboard();
        preloadQrisImages();
        initGiftAnimations();
    }

    // Run initialization
    init();
})();
