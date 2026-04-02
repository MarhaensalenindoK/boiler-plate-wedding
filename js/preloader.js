/**
 * Preloader
 * Shows a loading screen while the page is being loaded
 */

(function() {
    'use strict';

    // ==================== CONFIGURATION ==================== -->
    const CONFIG = {
        minDuration: 2000, // Minimum display time in ms
        fadeOutDuration: 800 // Fade out animation duration in ms
    };

    // ==================== STATE ==================== -->
    let preloader = null;
    let startTime = null;

    // ==================== DOM ELEMENTS ==================== -->

    /**
     * Initialize preloader DOM elements
     */
    function initElements() {
        preloader = document.querySelector('.preloader');

        if (!preloader) return;

        // Add body class to prevent scrolling
        document.body.classList.add('preloader-active');
    }

    // ==================== PRELOADER FUNCTIONS ==================== -->

    /**
     * Hide the preloader with animation
     */
    function hidePreloader() {
        console.log('[Preloader] hidePreloader() called. preloader element:', preloader);
        if (!preloader) return;

        console.log('[Preloader] Adding hidden class');
        // Fade out animation
        preloader.classList.add('hidden');

        // Wait for fade out to complete, then remove body class
        setTimeout(() => {
            console.log('[Preloader] Removing preloader-active class from body');
            document.body.classList.remove('preloader-active');
        }, CONFIG.fadeOutDuration);
    }

    /**
     * Check if we should show the preloader
     * @returns {boolean} Whether to show preloader
     */
    function shouldShowPreloader() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // If reduced motion is preferred, skip preloader
        if (prefersReducedMotion) return false;

        // Always show if preloader element exists
        return !!preloader;
    }

    // ==================== INITIALIZATION ==================== -->

    /**
     * Initialize the preloader module
     */
    function init() {
        console.log('[Preloader] init() started.');
        startTime = performance.now();

        // Initialize elements FIRST
        initElements();

        // Check if we should show preloader
        if (!shouldShowPreloader()) {
            console.log('[Preloader] shouldShowPreloader is false, hiding immediately.');
            hidePreloader();
            return;
        }

        if (!preloader) {
            console.log('[Preloader] .preloader element NOT found in DOM.');
            return;
        }
        
        console.log('[Preloader] Elements initialized, preloader is active.');

        // Wait for page to fully load
        window.addEventListener('load', () => {
            const elapsedTime = performance.now() - startTime;
            const remainingTime = Math.max(0, CONFIG.minDuration - elapsedTime);
            console.log(`[Preloader] window load event fired. elapsedTime: ${elapsedTime}ms. Waiting ${remainingTime}ms to hide.`);

            // Hide preloader after minimum duration
            setTimeout(hidePreloader, remainingTime);
        });

        // Fallback: Force hide preloader after 5 seconds if window.load is blocked by anything (like Maps API)
        setTimeout(() => {
            console.log('[Preloader] 5-second fallback triggered.');
            if (document.body.classList.contains('preloader-active')) {
                console.log('[Preloader] Forcing hidePreloader() from fallback.');
                hidePreloader();
            }
        }, 5000);
    }

    // Run initialization immediately (before DOMContentLoaded for faster response)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
