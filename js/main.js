/**
 * Main JavaScript Entry Point
 * Initializes all modules and handles global functionality
 */

(function() {
    'use strict';

    // ==================== DOM CONTENT LOADED ==================== -->

    /**
     * Initialize everything when DOM is ready
     */
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Wedding website loaded successfully! 💕');

        // Initialize mobile menu toggle
        initMobileMenu();

        // Initialize back to top button
        initBackToTop();

        // Add parallax effect for hero background (if supported)
        initParallax();

        // Generate floating hearts animation (Deactivated)
        initFloatingHearts();

        // Log any console errors in production
        if (window.location.hostname !== 'localhost') {
            window.onerror = function(msg, url, lineNo, columnNo, error) {
                console.error('Error:', msg, 'at', url + ':' + lineNo);
            };
        }
    });

    // ==================== MOBILE MENU ==================== -->

    /**
     * Initialize mobile navigation menu toggle
     */
    function initMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', function() {
            // Toggle hamburger animation
            this.classList.toggle('active');

            // Animate menu slide in/out
            if (this.classList.contains('active')) {
                navMenu.style.opacity = '1';
                navMenu.style.pointerEvents = 'auto';
                navMenu.style.transform = 'translateY(0)';

                // Add staggered animation to menu items
                const links = navMenu.querySelectorAll('.nav-link');
                links.forEach((link, index) => {
                    link.style.animation = `fadeInUp 0.3s ease forwards ${index * 0.1}s`;
                    link.style.opacity = '0';
                    link.style.transform = 'translateY(20px)';
                });
            } else {
                navMenu.style.opacity = '0';
                navMenu.style.pointerEvents = 'none';
                navMenu.style.transform = 'translateY(-20px)';

                // Reset menu items animation
                const links = navMenu.querySelectorAll('.nav-link');
                links.forEach(link => {
                    link.style.animation = '';
                    link.style.opacity = '';
                    link.style.transform = '';
                });
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.style.opacity = '0';
                navMenu.style.pointerEvents = 'none';
                navMenu.style.transform = 'translateY(-20px)';
            }
        });

        // Close menu when resizing to desktop
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                if (window.innerWidth >= 768 && navToggle.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navMenu.style.opacity = '';
                    navMenu.style.pointerEvents = '';
                    navMenu.style.transform = '';
                }
            }, 100);
        });
    }

    // ==================== BACK TO TOP BUTTON ==================== -->

    /**
     * Initialize back to top button functionality
     */
    function initBackToTop() {
        const backToTop = document.querySelector('.back-to-top');
        if (!backToTop) return;

        // Show/hide based on scroll position (handled by scroll-anim.js)
        // This just adds the click handler

        backToTop.addEventListener('click', function(e) {
            e.preventDefault();

            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navToggle = document.querySelector('.nav-toggle');
            if (navToggle && navToggle.classList.contains('active')) {
                navToggle.click();
            }
        });
    }

    // ==================== PARALLAX EFFECT ==================== -->

    /**
     * Initialize parallax scrolling effect for hero background
     */
    function initParallax() {
        // Check if parallax is supported
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const heroBackground = document.querySelector('.hero-background');
        if (!heroBackground) return;

        let ticking = false;

        function updateParallax() {
            const scrollPosition = window.pageYOffset;
            const parallaxSpeed = 0.5; // Parallax speed (lower = slower)

            // Only apply parallax when hero is in view
            if (scrollPosition < window.innerHeight * 1.5) {
                heroBackground.style.transform = `translateY(${scrollPosition * parallaxSpeed}px)`;
            }

            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }

        // Update on scroll
        window.addEventListener('scroll', requestTick, { passive: true });

        // Initial position
        updateParallax();
    }

    // ==================== FLOATING HEARTS ANIMATION ==================== -->

    /**
     * Create floating heart particles animation
     */
    function initFloatingHearts() {
        // Check if animation is supported
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        // Heart symbols to use
        const hearts = ['❤', '💕', '💖', '💗', '💓', '💝'];

        /**
         * Create a single heart particle
         */
        function createHeart() {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

            // Random horizontal position
            heart.style.left = Math.random() * 100 + 'vw';

            // Random size
            const size = Math.random() * 20 + 10 + 'px';
            heart.style.fontSize = size;

            // Random animation duration
            const duration = Math.random() * 4 + 6 + 's';
            heart.style.animationDuration = duration;

            // Random delay
            heart.style.animationDelay = Math.random() * 2 + 's';

            document.body.appendChild(heart);

            // Remove heart after animation completes
            setTimeout(function() {
                heart.remove();
            }, parseFloat(duration) * 1000 + 2000);
        }

        // Create hearts periodically (Further reduced frequency for an even subtler effect)
        setInterval(createHeart, 1200);

        // Create initial batch of hearts
        for (let i = 0; i < 3; i++) {
            setTimeout(createHeart, i * 400);
        }
    }

    // ==================== KEYFRAME ANIMATIONS FOR MENU ==================== -->

    /**
     * Add keyframe animations dynamically for menu items
     */
    function addMenuAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add menu animations
    addMenuAnimations();

    // ==================== PERFORMANCE MONITORING ==================== -->

    /**
     * Log performance metrics (development only)
     */
    if (window.location.hostname === 'localhost') {
        // Wait for page to fully load
        window.addEventListener('load', function() {
            const perf = window.performance;
            const timing = perf.timing;
            const duration = timing.loadEventEnd - timing.navigationStart;

            console.log('===== Performance Metrics =====');
            console.log(`Page Load Time: ${duration}ms`);
            console.log(`DOM Content Loaded: ${timing.domContentLoadedEventEnd - timing.navigationStart}ms`);
            console.log(`First Paint: ${timing.firstPaint - timing.navigationStart}ms`);
            console.log('=============================');
        });
    }

    // ==================== SERVICE WORKER REGISTRATION (Optional) ==================== -->

    /**
     * Register service worker for PWA functionality (optional)
     * Uncomment to enable offline support and caching
     */
    /*
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
    */

    // ==================== CLIPBOARD FUNCTIONALITY ==================== -->

    /**
     * Copy text to clipboard and show feedback
     * @param {string} text - Text to copy
     * @param {HTMLElement} btn - Button element that was clicked
     */
    window.copyToClipboard = function(text, btn) {
        if (!navigator.clipboard) {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showCopyFeedback(btn);
            } catch (err) {
                console.error('Fallback copy failed', err);
            }
            document.body.removeChild(textArea);
            return;
        }

        navigator.clipboard.writeText(text).then(function() {
            showCopyFeedback(btn);
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    };

    /**
     * Show visual feedback after copying
     * @param {HTMLElement} btn - Button element
     */
    function showCopyFeedback(btn) {
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-outlined">done</span><span>COPIED!</span>';
        btn.classList.add('copied');
        
        // Custom toast notification (optional follow-up)
        if (typeof showToast === 'function') {
            showToast('Account number copied to clipboard!');
        }

        setTimeout(function() {
            btn.innerHTML = originalContent;
            btn.classList.remove('copied');
        }, 2000);
    }

    /**
     * Simple Toast Notification (reusing if exists or creating local)
     */
    function showToast(message) {
        let toast = document.querySelector('.toast-editorial');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-editorial';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

})();
