/**
 * Gallery Masonry Layout
 * Creates a Pinterest-style masonry grid with responsive columns
 */

(function() {
    'use strict';

    // ==================== CONFIGURATION ==================== -->
    const CONFIG = {
        minColumnWidth: 200,
        maxColumns: 4,
        gap: 16,
        breakpoints: {
            mobile: 2,
            tablet: 3,
            desktop: 4
        }
    };

    // ==================== STATE ==================== -->
    let masonryContainer = null;
    let currentBreakpoint = 'mobile';
    let items = [];

    // ==================== UTILITIES ==================== -->

    /**
     * Get the number of columns based on screen width
     * @param {number} containerWidth - Width of the container
     * @returns {number} Number of columns
     */
    function getColumnCount(containerWidth) {
        if (containerWidth >= 1024) return CONFIG.breakpoints.desktop;
        if (containerWidth >= 768) return CONFIG.breakpoints.tablet;
        return CONFIG.breakpoints.mobile;
    }

    /**
     * Calculate masonry layout using column-based approach
     * @param {Array} imageItems - Array of image items with width and height
     * @param {number} columns - Number of columns
     * @returns {Object} Layout information
     */
    function calculateMasonryLayout(imageItems, columns) {
        const containerWidth = masonryContainer.clientWidth;
        const gap = CONFIG.gap;
        const availableWidth = containerWidth - (gap * (columns - 1));
        const baseColumnWidth = Math.floor(availableWidth / columns);

        // Track column heights
        const columnHeights = new Array(columns).fill(0);

        // Calculate layout for each item
        const layout = imageItems.map((item, index) => {
            // Determine item's span based on data-size attribute
            let colSpan = 1;
            let rowSpan = 1;

            if (item.dataset.size) {
                const [cols, rows] = item.dataset.size.split('x').map(Number);
                colSpan = Math.min(cols || 1, columns);
                rowSpan = rows || 1;
            }

            // Find the shortest column(s) for placement
            let bestCol = 0;
            let minHeight = Infinity;

            for (let col = 0; col <= columns - colSpan; col++) {
                const currentHeight = columnHeights[col];
                if (currentHeight < minHeight) {
                    minHeight = currentHeight;
                    bestCol = col;
                }
            }

            // Calculate item dimensions
            const itemWidth = baseColumnWidth * colSpan + gap * (colSpan - 1);
            const aspectRatio = item.naturalWidth / item.naturalHeight;
            let itemHeight = itemWidth / aspectRatio;

            // Apply row span scaling
            if (rowSpan > 1) {
                itemHeight *= rowSpan;
            }

            // Update column heights
            for (let col = bestCol; col < bestCol + colSpan; col++) {
                columnHeights[col] += itemHeight + gap;
            }

            return {
                element: item,
                left: bestCol * (baseColumnWidth + gap),
                top: minHeight,
                width: itemWidth,
                height: itemHeight,
                colSpan,
                rowSpan
            };
        });

        return layout;
    }

    // ==================== MAIN FUNCTIONS ==================== -->

    /**
     * Initialize the masonry layout
     */
    function initMasonry() {
        masonryContainer = document.getElementById('galleryMasonry');
        if (!masonryContainer) return;

        // Get all gallery items
        items = Array.from(masonryContainer.querySelectorAll('.gallery-item img'));

        if (items.length === 0) return;

        // Wait for images to load
        Promise.all(items.map(loadImage)).then(() => {
            applyMasonryLayout();
        });
    }

    /**
     * Load an image and return a promise
     * @param {HTMLImageElement} img - Image element
     * @returns {Promise<HTMLImageElement>} Resolved image element
     */
    function loadImage(img) {
        if (img.complete) {
            return Promise.resolve(img);
        }
        return new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    }

    /**
     * Apply masonry layout to gallery items
     */
    function applyMasonryLayout() {
        if (!masonryContainer || items.length === 0) return;

        // Determine number of columns
        const containerWidth = masonryContainer.clientWidth;
        const columns = getColumnCount(containerWidth);

        // Calculate layout
        const layout = calculateMasonryLayout(items, columns);

        // Apply styles to each item
        layout.forEach(itemInfo => {
            const wrapper = itemInfo.element.parentElement;
            if (wrapper) {
                wrapper.style.position = 'absolute';
                wrapper.style.left = `${itemInfo.left}px`;
                wrapper.style.top = `${itemInfo.top}px`;
                wrapper.style.width = `${itemInfo.width}px`;
                wrapper.style.transform = 'translate3d(0, 0, 0)';
            }
        });

        // Set container height
        const maxTop = Math.max(...layout.map(item => item.top + item.height));
        masonryContainer.style.height = `${maxTop + CONFIG.gap}px`;
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        if (!masonryContainer) return;

        const containerWidth = masonryContainer.clientWidth;
        const newBreakpoint = getColumnCount(containerWidth);

        // Only recalculate if breakpoint changed
        if (newBreakpoint !== currentBreakpoint) {
            currentBreakpoint = newBreakpoint;
            applyMasonryLayout();
        }
    }

    // ==================== OBSERVER FOR LAZY LOADING ==================== -->

    /**
     * Observe images for lazy loading
     */
    function observeImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '100px'
            });

            // Observe all gallery images
            items.forEach(img => imageObserver.observe(img));
        }
    }

    // ==================== INITIALIZATION ==================== -->

    /**
     * Initialize the gallery module
     */
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initMasonry();
                observeImages();
            });
        } else {
            initMasonry();
            observeImages();
        }

        // Handle resize with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 150);
        });
    }

    // Run initialization
    init();
})();
