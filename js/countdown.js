/**
 * Wedding Countdown Timer
 * Displays days, hours, minutes, and seconds until the wedding date
 */

(function() {
    'use strict';

    // ==================== CONFIGURATION ==================== -->
    const WEDDING_DATE = new Date('December 31, 2024 14:00:00').getTime();

    // ==================== DOM ELEMENTS ==================== -->
    const countdownTimer = document.getElementById('countdownTimer');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    // ==================== UTILITIES ==================== -->

    /**
     * Format a number with leading zero if less than 10
     * @param {number} num - The number to format
     * @returns {string} Formatted number string
     */
    function formatNumber(num) {
        return num.toString().padStart(2, '0');
    }

    /**
     * Update the countdown display with new values
     * @param {number} days - Number of days remaining
     * @param {number} hours - Number of hours remaining
     * @param {number} minutes - Number of minutes remaining
     * @param {number} seconds - Number of seconds remaining
     */
    function updateCountdownDisplay(days, hours, minutes, seconds) {
        if (daysElement) daysElement.textContent = formatNumber(days);
        if (hoursElement) hoursElement.textContent = formatNumber(hours);
        if (minutesElement) minutesElement.textContent = formatNumber(minutes);
        if (secondsElement) secondsElement.textContent = formatNumber(seconds);
    }

    /**
     * Show wedding has arrived message
     */
    function showWeddingArrived() {
        if (countdownTimer) {
            countdownTimer.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-number">${formatNumber(0)}</span>
                    <span class="countdown-label-text">Days</span>
                </div>
            `;
        }
    }

    // ==================== MAIN FUNCTION ==================== -->

    /**
     * Update the countdown timer
     */
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = WEDDING_DATE - now;

        // If wedding has passed
        if (distance < 0) {
            showWeddingArrived();
            return;
        }

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update display
        updateCountdownDisplay(days, hours, minutes, seconds);
    }

    // ==================== INITIALIZATION ==================== -->

    /**
     * Initialize the countdown timer
     */
    function init() {
        if (!countdownTimer) return;

        // Initial update
        updateCountdown();

        // Update every second
        setInterval(updateCountdown, 1000);
    }

    // Run initialization
    init();
})();
