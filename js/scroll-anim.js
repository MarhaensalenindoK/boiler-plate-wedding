/**
 * Scroll Animations
 * Intersection Observer-based scroll-triggered animations
 */

(function() {
    'use strict';

    // ==================== CONFIGURATION ==================== -->
    const CONFIG = {
        rootMargin: '-50px 0px -10% 0px', // When element is 50px from top and not near bottom
        threshold: 0.1, // Trigger when 10% of element is visible
        animationDelay: 0, // Base delay in ms
        staggerDelay: 100 // Delay between sibling elements in ms
    };

    // ==================== STATE ==================== -->
    let observer = null;
    let observedElements = new Map();

    // ==================== UTILITIES ==================== -->

    /**
     * Get the stagger delay for an element based on its position among siblings
     * @param {Element} element - The element to calculate delay for
     * @returns {number} Stagger delay in milliseconds
     */
    function getStaggerDelay(element) {
        const parent = element.parentElement;
        if (!parent) return 0;

        // Get all elements with animation classes from the same parent
        const siblingElements = Array.from(parent.children).filter(child =>
            child.classList.contains('fade-up') ||
            child.classList.contains('fade-down') ||
            child.classList.contains('fade-left') ||
            child.classList.contains('fade-right') ||
            child.classList.contains('zoom-in')
        );

        const index = siblingElements.indexOf(element);
        return index * CONFIG.staggerDelay;
    }

    // ==================== ANIMATION FUNCTIONS ==================== -->

    /**
     * Add animation class to element with stagger delay
     * @param {Element} element - Element to animate
     */
    function animateIn(element) {
        const staggerDelay = getStaggerDelay(element);
        const totalDelay = CONFIG.animationDelay + staggerDelay;

        setTimeout(() => {
            element.classList.add('active');
        }, totalDelay);

        // Remove from observer after animation
        if (observer && observedElements.has(element)) {
            observer.unobserve(element);
            observedElements.delete(element);
        }
    }

    /**
     * Reset animation class on element
     * @param {Element} element - Element to reset
     */
    function animateOut(element) {
        element.classList.remove('active');
    }

    // ==================== OBSERVER CONFIGURATION ==================== -->

    /**
     * Create and configure the Intersection Observer
     */
    function createObserver() {
        const options = {
            root: null, // viewport
            rootMargin: CONFIG.rootMargin,
            threshold: CONFIG.threshold
        };

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateIn(entry.target);
                } else {
                    // Optionally animate out when scrolling away
                    // animateOut(entry.target);
                }
            });
        }, options);

        return observer;
    }

    // ==================== ELEMENT DISCOVERY ==================== -->

    /**
     * Find all elements with animation classes
     * @returns {Element[]} Array of animated elements
     */
    function findAnimatedElements() {
        const selectors = [
            '.fade-up',
            '.fade-down',
            '.fade-left',
            '.fade-right',
            '.zoom-in',
            '.zoom-out',
            '.rotate-in',
            '.slide-up',
            '.slide-down'
        ];

        const elements = [];
        selectors.forEach(selector => {
            const found = document.querySelectorAll(selector);
            elements.push(...found);
        });

        // Remove duplicates and sort by position
        return [...new Set(elements)].sort((a, b) => {
            return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
        });
    }

    /**
     * Observe all animated elements
     */
    function observeElements() {
        const elements = findAnimatedElements();

        // Remove 'active' class from any previously animated elements
        elements.forEach(el => el.classList.remove('active'));

        elements.forEach(element => {
            if (observer && !observedElements.has(element)) {
                observer.observe(element);
                observedElements.set(element, true);
            }
        });
    }

    // ==================== SECTION ANIMATIONS ==================== -->

    /**
     * Add specific animations to different sections
     */
    function addSectionAnimations() {
        // Story Section
        const storySection = document.querySelector('.story-section');
        if (storySection) {
            storySection.querySelector('.section-header')?.classList.add('fade-up');
            storySection.querySelector('.story-image-wrapper')?.classList.add('fade-right');
            storySection.querySelector('.story-text-wrapper')?.classList.add('fade-left');
        }

        // Events Section
        const eventsGrid = document.querySelector('.events-grid');
        if (eventsGrid) {
            Array.from(eventsGrid.children).forEach((child, index) => {
                child.classList.add('fade-up', `stagger-delay-${index + 1}`);
            });
        }

        // Timeline Section
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.classList.add('fade-right', `stagger-delay-${(index % 4) + 1}`);
        });

        // Gallery Section - handled by masonry
        const gallerySection = document.querySelector('.gallery-section');
        if (gallerySection) {
            gallerySection.querySelector('.section-header')?.classList.add('fade-up');
        }

        // RSVP Section
        const rsvpSection = document.querySelector('.rsvp-section');
        if (rsvpSection) {
            rsvpSection.querySelector('.section-header')?.classList.add('fade-up');
            rsvpSection.querySelector('.rsvp-form-wrapper')?.classList.add('zoom-in');
        }

        // Gift Section
        const giftCards = document.querySelectorAll('.gift-card');
        giftCards.forEach((card, index) => {
            card.classList.add('fade-up', `stagger-delay-${index + 1}`);
        });

        // Timeline Milestones
        const milestones = document.querySelectorAll('.milestone');
        milestones.forEach((milestone, index) => {
            milestone.classList.add('fade-left', `stagger-delay-${(index % 3) + 1}`);
        });
    }

    // ==================== SCROLL PROGRESS INDICATOR ==================== -->

    /**
     * Update scroll progress indicator
     */
    function updateScrollProgress() {
        const scrollProgress = document.querySelector('.scroll-progress');
        if (!scrollProgress) return;

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        scrollProgress.style.transform = `translateX(${scrollPercent}%)`;
        scrollProgress.style.width = '0'; // Will be set by transition
    }

    // ==================== ACTIVE SECTION HIGHLIGHT ==================== -->

    /**
     * Update active section highlight indicator
     */
    function updateActiveSectionHighlight() {
        const sectionHighlight = document.querySelector('.section-highlight');
        if (!sectionHighlight) return;

        const sections = document.querySelectorAll('section[id]');
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY + (windowHeight / 3);

        let activeSectionHeight = 0;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + window.scrollY;
            const sectionHeight = rect.height;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSectionHeight = (scrollPosition - sectionTop) / windowHeight * 100;
            }
        });

        sectionHighlight.style.transform = `scaleY(${activeSectionHeight / 100})`;
    }

    // ==================== NAVBAR SCROLL EFFECT ==================== -->

    /**
     * Update navbar style based on scroll position
     */
    function updateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const scrollPosition = window.scrollY;
        const threshold = 100;

        if (scrollPosition > threshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ==================== BACK TO TOP BUTTON ==================== -->

    /**
     * Show/hide back to top button based on scroll position
     */
    function updateBackToTop() {
        const backToTop = document.querySelector('.back-to-top');
        if (!backToTop) return;

        const scrollPosition = window.scrollY;
        const threshold = 500;

        if (scrollPosition > threshold) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    // ==================== ACTIVE NAV LINK ==================== -->

    /**
     * Update active navigation link based on current section
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

    // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ==================== -->

    /**
     * Setup smooth scrolling for anchor links
     */
    function setupSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();

                    const headerOffset = 80; // Account for fixed navbar
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const navToggle = document.querySelector('.nav-toggle');
                    if (navToggle && navToggle.classList.contains('active')) {
                        navToggle.classList.remove('active');
                        setTimeout(() => {
                            navToggle.classList.remove('show-menu');
                        }, 300);
                    }
                }
            });
        });
    }

    // ==================== SCROLL EVENT LISTENER ==================== -->

    /**
     * Handle scroll events with debouncing
     */
    let scrollTimeout;
    function handleScroll() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateNavbar();
            updateBackToTop();
            updateActiveNavLink();
            updateScrollProgress();
            updateActiveSectionHighlight();
        }, 10); // 10ms debounce
    }

    // ==================== INITIALIZATION ==================== -->

    /**
     * Initialize scroll animations module
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeScrollAnimations);
        } else {
            initializeScrollAnimations();
        }
    }

    /**
     * Main initialization function
     */
    function initializeScrollAnimations() {
        // Create observer
        createObserver();

        // Add section-specific animations
        addSectionAnimations();

        // Observe elements
        observeElements();

        // Setup smooth scroll
        setupSmoothScroll();

        // Scroll event listener
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Initial updates
        updateNavbar();
        updateBackToTop();
        updateActiveNavLink();
    }

    // Run initialization
    init();
})();
