/**
 * Bank Details Accordion & Copy Functionality
 * Handles bank account details toggle and copy-to-clipboard feature
 */

(function() {
    'use strict';

    // ==================== CONFIGURATION ==================== -->
    const CONFIG = {
        enableAnimations: true,
        toastDuration: 2000
    };

    // ==================== STATE ==================== -->
    let bankItems = [];

    // ==================== DOM ELEMENTS ==================== -->

    /**
     * Initialize bank details elements
     */
    function initElements() {
        bankItems = document.querySelectorAll('.bank-item');

        if (bankItems.length === 0) return;

        // Add click handlers to each bank toggle
        bankItems.forEach(bankItem => {
            const toggle = bankItem.querySelector('.bank-toggle');
            if (toggle) {
                toggle.addEventListener('click', () => toggleBankDetails(bankItem));
            }

            // Add copy button handler
            const copyBtn = bankItem.querySelector('.copy-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => copyAccountNumber(bankItem, copyBtn));
            }
        });
    }

    // ==================== ACCORDION FUNCTIONS ==================== -->

    /**
     * Toggle bank details visibility
     * @param {HTMLElement} bankItem - Bank item element
     */
    function toggleBankDetails(bankItem) {
        const isActive = bankItem.classList.contains('active');

        // Close all other bank items (accordion behavior)
        if (!isActive) {
            document.querySelectorAll('.bank-item.active').forEach(item => {
                if (item !== bankItem) {
                    item.classList.remove('active');
                }
            });
        }

        // Toggle current bank item
        bankItem.classList.toggle('active');

        // Update arrow rotation
        const icon = bankItem.querySelector('.bank-toggle i:last-child');
        if (icon) {
            icon.style.transform = isActive ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    }

    // ==================== COPY TO CLIPBOARD ==================== -->

    /**
     * Copy account number to clipboard
     * @param {HTMLElement} bankItem - Bank item element
     * @param {HTMLElement} copyBtn - Copy button element
     */
    async function copyAccountNumber(bankItem, copyBtn) {
        // Get account number from data-copy attribute on the account-number span
        const accountNumberElement = bankItem.querySelector('.account-number');
        const accountNumber = accountNumberElement ? accountNumberElement.dataset.copy : null;

        if (!accountNumber) return;

        try {
            // Try modern Clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(accountNumber);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = accountNumber;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }

            // Show success feedback
            showCopySuccess(copyBtn);
            showToast(`Account number copied: ${accountNumber}`, 'success');

        } catch (error) {
            console.error('Failed to copy:', error);
            showToast('Failed to copy account number', 'error');
        }
    }

    /**
     * Show copy success animation on button
     * @param {HTMLElement} copyBtn - Copy button element
     */
    function showCopySuccess(copyBtn) {
        const originalIcon = copyBtn.innerHTML;

        // Change icon to checkmark
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';

        // Add success class for color change
        copyBtn.style.backgroundColor = '#8fbc8f';

        // Revert after animation
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    }

    // ==================== TOAST NOTIFICATION ==================== -->

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
            toast.style.cssText = `
                position: fixed;
                bottom: 24px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                padding: 16px 24px;
                background-color: #262626;
                color: #fff;
                border-radius: 8px;
                font-size: 14px;
                z-index: 600;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(toast);
        }

        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = `<i class="fas ${icon}" style="margin-right: 8px; color: ${type === 'success' ? '#8fbc8f' : '#d32f2f'};"></i> ${message}`;

        // Animate in
        toast.style.opacity = '1';
        toast.style.visibility = 'visible';
        toast.style.transform = 'translateX(-50%) translateY(0)';

        // Hide after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.visibility = 'hidden';
            toast.style.transform = 'translateX(-50%) translateY(100px)';
        }, CONFIG.toastDuration);
    }

    // ==================== INITIALIZATION ==================== -->

    /**
     * Initialize bank details module
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initElements);
        } else {
            initElements();
        }
    }

    // Run initialization
    init();
})();
