// Wait for page to load before running any code
document.addEventListener('DOMContentLoaded', function() {

    // ---- 1. NAVBAR - make it smaller when user scrolls down ----
    var navbar = document.getElementById('mainNav');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 60) {
                navbar.style.padding = '8px 0';
                navbar.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
            } else {
                navbar.style.padding = '14px 0';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // ---- 2. STATS COUNTER - count up numbers ----
    var counters = document.querySelectorAll('.stat-num[data-target]');

    function animateCounter(element) {
        var target = parseInt(element.getAttribute('data-target'));
        var duration = 1800;
        var step = target / (duration / 16);
        var current = 0;

        var timer = setInterval(function() {
            current = current + step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    // Only start counter when stats section is visible on screen
    var statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        var statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    counters.forEach(function(counter) {
                        animateCounter(counter);
                    });
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.4 });
        statsObserver.observe(statsSection);
    }

    // ---- 3. QUOTE MODAL FORM VALIDATION ----
    var submitBtn = document.getElementById('submitQuote');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            var nameInput = document.getElementById('quoteName');
            var phoneInput = document.getElementById('quotePhone');
            var emailInput = document.getElementById('quoteEmail');
            var isValid = true;

            // Remove old error/success styles
            nameInput.classList.remove('is-invalid', 'is-valid');
            phoneInput.classList.remove('is-invalid', 'is-valid');
            emailInput.classList.remove('is-invalid', 'is-valid');

            // Check name
            if (nameInput.value.trim().length < 2) {
                nameInput.classList.add('is-invalid');
                isValid = false;
            } else {
                nameInput.classList.add('is-valid');
            }

            // Check phone number
            var phonePattern = /^[0-9+\s\-]{7,15}$/;
            if (!phonePattern.test(phoneInput.value.trim())) {
                phoneInput.classList.add('is-invalid');
                isValid = false;
            } else {
                phoneInput.classList.add('is-valid');
            }

            // Check email
            var emailPattern = /\S+@\S+\.\S+/;
            if (!emailPattern.test(emailInput.value.trim())) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else {
                emailInput.classList.add('is-valid');
            }

            // If all fields are correct
            if (isValid) {
                // Close the modal
                var modal = bootstrap.Modal.getInstance(document.getElementById('quoteModal'));
                modal.hide();

                // Show success toast message
                var toastElement = document.getElementById('successToast');
                if (toastElement) {
                    var toast = new bootstrap.Toast(toastElement, { delay: 4000 });
                    toast.show();
                }

                // Clear the form fields
                nameInput.value = '';
                phoneInput.value = '';
                emailInput.value = '';
                nameInput.classList.remove('is-valid');
                phoneInput.classList.remove('is-valid');
                emailInput.classList.remove('is-valid');

                var detailsInput = document.getElementById('quoteDetails');
                var mediaInput = document.getElementById('quoteMedia');
                if (detailsInput) detailsInput.value = '';
                if (mediaInput) mediaInput.value = '';
            }
        });
    }

    // ---- 4. CONTACT FORM VALIDATION ----
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            var isValid = true;
            var requiredFields = contactForm.querySelectorAll('[required]');

            requiredFields.forEach(function(field) {
                field.classList.remove('is-invalid', 'is-valid');

                if (field.value.trim() === '') {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else if (field.type === 'email' && !/\S+@\S+\.\S+/.test(field.value)) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.add('is-valid');
                }
            });

            if (isValid) {
                var successMessage = document.getElementById('formSuccess');
                if (successMessage) {
                    successMessage.style.display = 'block';
                    contactForm.reset();
                    requiredFields.forEach(function(field) {
                        field.classList.remove('is-valid');
                    });
                    setTimeout(function() {
                        successMessage.style.display = 'none';
                    }, 5000);
                }
            }
        });
    }

    // ---- 5. GALLERY FILTER BUTTONS ----
    var filterButtons = document.querySelectorAll('[data-filter]');
    var galleryBoxes = document.querySelectorAll('[data-category]');

    if (filterButtons.length > 0) {
        filterButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                // Remove active from all buttons
                filterButtons.forEach(function(b) {
                    b.classList.remove('active');
                });
                // Add active to clicked button
                btn.classList.add('active');

                var filter = btn.getAttribute('data-filter');

                galleryBoxes.forEach(function(item) {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                        item.style.pointerEvents = 'auto';
                    } else {
                        item.style.opacity = '0.15';
                        item.style.transform = 'scale(0.93)';
                        item.style.pointerEvents = 'none';
                    }
                    item.style.transition = 'all 0.3s ease';
                });
            });
        });
    }

    // ---- 6. SMOOTH SCROLL when clicking anchor links ----
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            var targetId = link.getAttribute('href');
            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                event.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---- 7. CLOSE mobile navbar when a link is clicked ----
    var navMenu = document.getElementById('navMenu');
    if (navMenu) {
        var navLinks = navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle)');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                var bsCollapse = bootstrap.Collapse.getInstance(navMenu);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            });
        });
    }

    // ---- 8. INPUT FOCUS effects - label color changes ----
    var inputs = document.querySelectorAll('.form-control, .form-select');
    inputs.forEach(function(input) {
        // Change label color on mouseover
        var label = input.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
            input.addEventListener('mouseover', function() {
                label.style.color = '#E8340A';
            });
            input.addEventListener('mouseout', function() {
                label.style.color = '';
            });
        }
    });

});
