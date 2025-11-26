/**
 * PROXITY Landing Pages - Main JavaScript
 * Handles animations, navigation, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initStickyHeader();
    initMobileMenu();
    initActiveNavLink();
    initInteractiveBackground();
});

/**
 * Initialize scroll-triggered animations using IntersectionObserver
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    document.querySelectorAll('.fade-in-up, .stagger-children').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Initialize sticky header behavior
 */
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // Add/remove scrolled class
        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    if (!toggle || !mobileMenu) return;

    toggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when clicking on links
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    function openMobileMenu() {
        mobileMenu.classList.add('open');
        body.style.overflow = 'hidden';
        toggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        `;
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        body.style.overflow = '';
        toggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        `;
    }
}

/**
 * Initialize active navigation link based on current page
 */
function initActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Check if this link matches the current page
        if (href === currentPath || 
            (href === '/' && currentPath === '/index.html') ||
            (href === '/index.html' && currentPath === '/') ||
            currentPath.endsWith(href)) {
            link.classList.add('active');
        }
    });
}

/**
 * Smooth scroll to element (for anchor links)
 */
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Track click events for analytics (placeholder)
 * Can be connected to Yandex.Metrika or other analytics
 */
function trackEvent(category, action, label = '') {
    // Yandex.Metrika integration example:
    // if (typeof ym !== 'undefined') {
    //     ym(COUNTER_ID, 'reachGoal', action, { category, label });
    // }
    
    console.log('Event tracked:', { category, action, label });
}

// Add click tracking to CTA buttons
document.querySelectorAll('.button.primary, .button.white').forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent.trim();
        trackEvent('CTA', 'click', buttonText);
    });
});

/**
 * Initialize interactive background that responds to mouse movement
 */
function initInteractiveBackground() {
    const orbs = document.querySelectorAll('.gradient-orb');
    if (orbs.length === 0) return;

    // Mouse position with smooth interpolation
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = mouseX;
    let targetY = mouseY;

    // Configuration for each orb - different sensitivity creates depth/parallax
    const orbConfigs = [
        { sensitivity: 0.04 },  // Orb 1 - medium movement (foreground feel)
        { sensitivity: 0.06 }, // Orb 2 - more movement (closest feel)
        { sensitivity: 0.025 } // Orb 3 - subtle movement (background feel)
    ];

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    }, { passive: true });

    // Reset position when mouse leaves window
    document.addEventListener('mouseleave', () => {
        targetX = window.innerWidth / 2;
        targetY = window.innerHeight / 2;
    });

    // Animation loop for smooth interpolation
    function animate() {
        // Smooth interpolation (lerp) - lower value = smoother/slower
        mouseX += (targetX - mouseX) * 0.03;
        mouseY += (targetY - mouseY) * 0.03;

        // Calculate offset from center
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;

        // Apply CSS variables to each orb
        orbs.forEach((orb, index) => {
            const config = orbConfigs[index] || orbConfigs[0];
            
            // Calculate movement based on sensitivity
            const moveX = deltaX * config.sensitivity;
            const moveY = deltaY * config.sensitivity;
            
            // Set CSS custom properties for mouse offset
            orb.style.setProperty('--mouse-x', `${moveX}px`);
            orb.style.setProperty('--mouse-y', `${moveY}px`);
        });

        requestAnimationFrame(animate);
    }

    // Start animation loop
    animate();
}

