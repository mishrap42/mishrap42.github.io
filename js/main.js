/**
 * Academic Personal Website - JavaScript
 * Handles navigation, scroll effects, and interactivity
 */

(function() {
    'use strict';

    // DOM Elements
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // --------------------------------------------------------------------------
    // Mobile Navigation Toggle
    // --------------------------------------------------------------------------
    function toggleMobileNav() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileNav() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event Listeners for mobile nav
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
    }

    // Close mobile nav when clicking a link
    navLinks.forEach(function(link) {
        link.addEventListener('click', closeMobileNav);
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeMobileNav();
            }
        }
    });

    // --------------------------------------------------------------------------
    // Navbar Scroll Effect
    // --------------------------------------------------------------------------
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;

        // Add shadow when scrolled
        if (scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateNavbar();
            });
            ticking = true;
        }
    });

    // --------------------------------------------------------------------------
    // Active Navigation Link on Scroll
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveNav() {
        const scrollY = window.scrollY;
        const navHeight = navbar ? navbar.offsetHeight : 60;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                });

                // Add active class to current section link
                const activeLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                highlightActiveNav();
            });
        }
    });

    // --------------------------------------------------------------------------
    // Smooth Scroll for Safari (fallback)
    // --------------------------------------------------------------------------
    // Modern browsers support CSS scroll-behavior, but this provides fallback
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();

                    const navHeight = navbar ? navbar.offsetHeight : 60;
                    const targetPosition = targetElement.offsetTop - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without triggering scroll
                    history.pushState(null, null, href);
                }
            }
        });
    });

    // --------------------------------------------------------------------------
    // Initialize
    // --------------------------------------------------------------------------
    function init() {
        // Set initial navbar state
        updateNavbar();

        // Set initial active nav link
        highlightActiveNav();

        // Handle initial hash in URL
        if (window.location.hash) {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                setTimeout(function() {
                    const navHeight = navbar ? navbar.offsetHeight : 60;
                    const targetPosition = targetElement.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
