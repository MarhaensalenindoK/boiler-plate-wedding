/**
 * Navigation
 * Mobile menu toggle and navigation functionality
 */

(function() {
    'use strict';

    // ==================== CONFIGURATION ==================== -->
    const CONFIG = {
        mobileBreakpoint: 768,
        animationDuration: 300
    };

    // ==================== STATE ==================== -->
    let navbar = null;
    let navToggle = null;
    let navMenu = null;
    let isMobileMenuOpen = false;

    // ==================== DOM ELEMENTS ==================== -->

    /**
     * Initialize navigation elements
     */
    function initElements() {
        navbar = document.querySelector('.navbar');
        navToggle = document.querySelector('.nav-toggle');
        navMenu = document.querySelector('.nav-menu');

        if (!navbar || !navToggle || !navMenu) return;

        // Add click handler to toggle button
        navToggle.addEventListener('click', toggleMobileMenu);

        // Close menu when clicking outside
        document.addEventListener('click', handleOutsideClick);

        // Handle window resize
        window.addEventListener('resize', handleResize);

        // Add click handlers to nav links for smooth scroll (separate module)
        setupNavLinkClickHandlers();
    }

    // ==================== MOBILE MENU FUNCTIONS ==================== -->

    /**
     * Toggle mobile menu visibility
     */
    function toggleMobileMenu() {
        if (!navToggle || !navMenu) return;

        isMobileMenuOpen = !isMobileMenuOpen;

        if (isMobileMenuOpen) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }

        // Update hamburger animation
        navToggle.classList.toggle('active', isMobileMenuOpen);
    }

    /**
     * Open mobile menu
     */
    function openMobileMenu() {
        if (!navToggle || !navMenu) return;

        // Add active class to toggle for hamburger animation
        navToggle.classList.add('active');

        // Show menu with animation
        navMenu.classList.add('show-menu');

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Trigger reflow for animation
        requestAnimationFrame(() => {
            navMenu.classList.add('active');
        });
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        if (!navToggle || !navMenu) return;

        // Remove active class from toggle
        navToggle.classList.remove('active');

        // Hide menu with animation
        navMenu.classList.remove('active');

        // Wait for animation before removing show-menu class
        setTimeout(() => {
            navMenu.classList.remove('show-menu');
        }, CONFIG.animationDuration);

        // Restore body scroll
        document.body.style.overflow = '';
    }

    // ==================== EVENT HANDLERS ==================== -->

    /**
     * Handle click outside mobile menu to close it
     * @param {Event} e - Click event
     */
    function handleOutsideClick(e) {
        if (!isMobileMenuOpen || !navToggle || !navMenu) return;

        // Check if click is outside navbar and nav toggle
        const isClickInsideNavbar = navbar.contains(e.target);
        const isClickOnToggle = navToggle.contains(e.target);

        if (!isClickInsideNavbar || (isClickInsideNavbar && !isClickOnToggle)) {
            closeMobileMenu();
        }
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        const isMobile = window.innerWidth < CONFIG.mobileBreakpoint;

        if (!isMobile && isMobileMenuOpen) {
            closeMobileMenu();
            isMobileMenuOpen = false;
        }
    }

    // ==================== NAV LINK FUNCTIONS ==================== -->

    /**
     * Setup click handlers for navigation links
     */
    function setupNavLinkClickHandlers() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Handle anchor links (#section-name)
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        // Close mobile menu first
                        if (isMobileMenuOpen) {
                            closeMobileMenu();
                            isMobileMenuOpen = false;
                        }

                        // Smooth scroll to section
                        const headerOffset = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.scrollY - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // ==================== SCROLL EFFECTS ==================== -->

    /**
     * Update navbar style on scroll (called by scroll-anim.js)
     */
    function updateNavbarOnScroll() {
        if (!navbar) return;

        const scrollPosition = window.scrollY;
        const threshold = 100;

        if (scrollPosition > threshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ==================== ACTIVE SECTION HIGHLIGHTING ==================== -->

    /**
     * Update active nav link based on current section (called by scroll-anim.js)
     */
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        if (sections.length === 0 || navLinks.length === 0) return;

        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY + (windowHeight / 2);

        let activeSectionId = '';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + window.scrollY;
            const sectionBottom = sectionTop + rect.height;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSectionId = section.id;
            }
        });

        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${activeSectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ==================== EXPOSE FUNCTIONS FOR OTHER MODULES ==================== -->

    /**
     * Export functions for use by other modules
     */
    window.WeddingNav = {
        updateNavbarOnScroll,
        updateActiveNavLink,
        closeMobileMenu,
        toggleMobileMenu
    };

    // ==================== INITIALIZATION ==================== -->

    /**
     * Initialize navigation module
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
