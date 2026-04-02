/**
 * Lightbox Modal
 * Image viewer with navigation, keyboard controls, and touch support
 */

(function() {
    'use strict';

    // ==================== CONFIGURATION ==================== -->
    const CONFIG = {
        animationDuration: 300,
        closeOnBackdropClick: true,
        enableKeyboardNavigation: true,
        enableTouchSwipe: true
    };

    // ==================== STATE ==================== -->
    let lightbox = null;
    let lightboxImage = null;
    let galleryImages = [];
    let currentIndex = 0;
    let isAnimating = false;

    // Touch swipe tracking
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    // ==================== DOM ELEMENTS ==================== -->

    /**
     * Initialize lightbox DOM elements
     */
    function initElements() {
        lightbox = document.getElementById('lightbox');
        lightboxImage = document.getElementById('lightboxImage');

        if (!lightbox || !lightboxImage) return;

        // Navigation buttons
        const closeBtn = document.getElementById('lightboxClose');
        const prevBtn = document.getElementById('lightboxPrev');
        const nextBtn = document.getElementById('lightboxNext');

        // Event listeners
        if (closeBtn) closeBtn.addEventListener('click', close);
        if (prevBtn) prevBtn.addEventListener('click', previous);
        if (nextBtn) nextBtn.addEventListener('click', next);

        // Backdrop click to close
        if (CONFIG.closeOnBackdropClick) {
            lightbox.addEventListener('click', handleBackdropClick);
        }

        // Keyboard navigation
        if (CONFIG.enableKeyboardNavigation) {
            document.addEventListener('keydown', handleKeyboard);
        }

        // Touch swipe
        if (CONFIG.enableTouchSwipe) {
            setupTouchSwipe();
        }
    }

    // ==================== GALLERY INITIALIZATION ==================== -->

    /**
     * Initialize gallery click handlers
     */
    function initGallery() {
        const gallery = document.getElementById('galleryMasonry');
        if (!gallery) return;

        galleryImages = Array.from(gallery.querySelectorAll('.gallery-item img'));

        // Add click handlers to each gallery item
        galleryImages.forEach((img, index) => {
            const wrapper = img.parentElement;
            if (wrapper) {
                wrapper.addEventListener('click', () => open(index));
            }
        });
    }

    // ==================== LIGHTBOX FUNCTIONS ==================== -->

    /**
     * Open the lightbox with a specific image
     * @param {number} index - Index of the image to display
     */
    function open(index) {
        if (isAnimating || galleryImages.length === 0) return;

        currentIndex = index;
        const src = galleryImages[currentIndex].src;

        // Set image source and alt text
        lightboxImage.src = src;
        lightboxImage.alt = `Gallery Image ${currentIndex + 1}`;

        // Show lightbox
        lightbox.classList.add('active');

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Update navigation visibility
        updateNavigationVisibility();
    }

    /**
     * Close the lightbox
     */
    function close() {
        if (isAnimating || !lightbox.classList.contains('active')) return;

        isAnimating = true;

        // Hide lightbox with animation
        lightbox.classList.remove('active');

        // Wait for animation to complete
        setTimeout(() => {
            // Clear image source to prevent memory issues
            lightboxImage.src = '';

            // Restore body scroll
            document.body.style.overflow = '';

            isAnimating = false;
        }, CONFIG.animationDuration);
    }

    /**
     * Show previous image
     */
    function previous() {
        if (galleryImages.length <= 1) return;

        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        updateImage();
        updateNavigationVisibility();
    }

    /**
     * Show next image
     */
    function next() {
        if (galleryImages.length <= 1) return;

        currentIndex = (currentIndex + 1) % galleryImages.length;
        updateImage();
        updateNavigationVisibility();
    }

    /**
     * Update the displayed image
     */
    function updateImage() {
        const src = galleryImages[currentIndex].src;

        // Fade out effect
        lightboxImage.style.opacity = '0';

        setTimeout(() => {
            lightboxImage.src = src;
            lightboxImage.alt = `Gallery Image ${currentIndex + 1}`;

            // Fade in effect
            lightboxImage.style.opacity = '1';
        }, 150);
    }

    /**
     * Update visibility of navigation buttons
     */
    function updateNavigationVisibility() {
        const prevBtn = document.getElementById('lightboxPrev');
        const nextBtn = document.getElementById('lightboxNext');

        if (prevBtn && nextBtn) {
            // Show/hide based on image count
            if (galleryImages.length > 1) {
                prevBtn.style.visibility = 'visible';
                nextBtn.style.visibility = 'visible';
            } else {
                prevBtn.style.visibility = 'hidden';
                nextBtn.style.visibility = 'hidden';
            }
        }
    }

    // ==================== EVENT HANDLERS ==================== -->

    /**
     * Handle click on backdrop (behind image)
     * @param {Event} e - Click event
     */
    function handleBackdropClick(e) {
        if (e.target === lightbox || e.target === document.getElementById('lightbox-content')) {
            close();
        }
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - Keyboard event
     */
    function handleKeyboard(e) {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                close();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                previous();
                break;
            case 'ArrowRight':
                e.preventDefault();
                next();
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                // Click on image (could trigger zoom or other actions)
                break;
        }
    }

    /**
     * Setup touch swipe gestures
     */
    function setupTouchSwipe() {
        lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
        lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    /**
     * Handle touch start
     * @param {TouchEvent} e - Touch event
     */
    function handleTouchStart(e) {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }

    /**
     * Handle touch end
     * @param {TouchEvent} e - Touch event
     */
    function handleTouchEnd(e) {
        const touch = e.changedTouches[0];
        touchEndX = touch.clientX;
        touchEndY = touch.clientY;

        handleSwipe();
    }

    /**
     * Handle swipe gesture
     */
    function handleSwipe() {
        const threshold = 50; // Minimum swipe distance
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Check if it's a horizontal swipe (not vertical scroll)
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > threshold) {
                if (deltaX > 0) {
                    // Swiped right - show previous image
                    previous();
                } else {
                    // Swiped left - show next image
                    next();
                }
            }
        }
    }

    // ==================== INITIALIZATION ==================== -->

    /**
     * Initialize the lightbox modal module
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initElements();
                initGallery();
            });
        } else {
            initElements();
            initGallery();
        }
    }

    // Run initialization
    init();
})();
