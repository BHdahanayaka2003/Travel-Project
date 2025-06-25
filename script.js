document.addEventListener("DOMContentLoaded", function() {

    // --- Mobile Navigation ---
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.querySelectorAll('.nav-link');

    // Show menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Hide menu when a link is clicked
    function closeMenu() {
        navMenu.classList.remove('active');
    }
    navClose.forEach(n => n.addEventListener('click', closeMenu));


    // --- Sticky Header on Scroll ---
    const header = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.parentElement.classList.add('sticky');
        } else {
            header.parentElement.classList.remove('sticky');
        }
    });


    // --- Scroll Reveal Animation using Intersection Observer ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Optional: stop observing once revealed
            }
        });
    }, {
        root: null, // observes intersections relative to the viewport
        threshold: 0.1, // trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // start animation a bit sooner
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

});