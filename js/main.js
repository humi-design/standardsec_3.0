/* ========================================================================
   STANDARD SECURITIES - UNIFIED JAVASCRIPT
   Premium Enterprise Design System
   WCAG 2.2 AA Compliant
   ======================================================================== */

/**
 * Main JavaScript Module
 * Initializes all modules and functionality
 */
(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize all modules
        initNavigation();
        initAccessibility();
        initForms();
        initScrollAnimations();
        initMobileNav();
    });

    /**
     * Navigation Module
     */
    function initNavigation() {
        // Desktop navigation dropdowns
        const dropdownTriggers = document.querySelectorAll('[data-uk-navbar-dropdown-trigger]');
        
        dropdownTriggers.forEach(function(trigger) {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = this.nextElementSibling;
                if (dropdown) {
                    const isOpen = dropdown.classList.contains('is-active');
                    closeAllDropdowns();
                    if (!isOpen) {
                        dropdown.classList.add('is-active');
                        this.setAttribute('aria-expanded', 'true');
                    }
                }
            });
        });

        // Close dropdowns on click outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.uk-navbar-dropdown')) {
                closeAllDropdowns();
            }
        });

        // Close on escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAllDropdowns();
            }
        });

        function closeAllDropdowns() {
            document.querySelectorAll('.uk-navbar-dropdown.is-active').forEach(function(d) {
                d.classList.remove('is-active');
            });
            dropdownTriggers.forEach(function(t) {
                t.setAttribute('aria-expanded', 'false');
            });
        }
    }

    /**
     * Accessibility Module
     */
    function initAccessibility() {
        // Accessibility widget toggle
        const accessibilityToggle = document.getElementById('accessibilityToggle');
        const accessibilityPanel = document.getElementById('accessibilityPanel');

        if (accessibilityToggle && accessibilityPanel) {
            accessibilityToggle.addEventListener('click', function() {
                const isOpen = !accessibilityPanel.classList.contains('is-hidden');
                if (isOpen) {
                    accessibilityPanel.classList.add('is-hidden');
                    accessibilityPanel.setAttribute('aria-hidden', 'true');
                    accessibilityToggle.setAttribute('aria-expanded', 'false');
                } else {
                    accessibilityPanel.classList.remove('is-hidden');
                    accessibilityPanel.setAttribute('aria-hidden', 'false');
                    accessibilityToggle.setAttribute('aria-expanded', 'true');
                }
            });

            // Close on escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && !accessibilityPanel.classList.contains('is-hidden')) {
                    accessibilityPanel.classList.add('is-hidden');
                    accessibilityPanel.setAttribute('aria-hidden', 'true');
                    accessibilityToggle.setAttribute('aria-expanded', 'false');
                    accessibilityToggle.focus();
                }
            });

            // Close on click outside
            document.addEventListener('click', function(e) {
                if (!accessibilityPanel.contains(e.target) && !accessibilityToggle.contains(e.target)) {
                    accessibilityPanel.classList.add('is-hidden');
                    accessibilityPanel.setAttribute('aria-hidden', 'true');
                    accessibilityToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Font size controls
        window.changeFontSize = function(delta) {
            const html = document.documentElement;
            const current = parseFloat(window.getComputedStyle(html).fontSize) || 16;
            const newSize = Math.max(12, Math.min(24, current + (delta * 2)));
            html.style.fontSize = newSize + 'px';
            localStorage.setItem('fontSize', newSize);
        };

        // Dark mode toggle
        window.toggleDarkMode = function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
        };

        // Read content aloud
        window.readContent = function() {
            const content = document.querySelector('main') || document.body;
            const text = content.innerText;
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'en-IN';
                utterance.rate = 1;
                utterance.pitch = 1;
                window.speechSynthesis.speak(utterance);
            }
        };

        // Load saved preferences
        loadAccessibilityPreferences();

        // ===== ADDITIONAL WCAG 2.2 AA ACCESSIBILITY =====

        // Carousel/Slideshow Pause Control
        initCarouselAccessibility();

        // Form Validation Improvements
        initFormAccessibility();

        // Mobile Navigation ARIA
        initMobileNavARIA();

        // Screen Reader Announcements
        initAnnouncer();
    }

    function initCarouselAccessibility() {
        if (typeof UIkit !== 'undefined') {
            var slideshows = document.querySelectorAll('[data-uk-slideshow]');
            slideshows.forEach(function(slideshow) {
                var nav = slideshow.querySelector('.uk-slideshow-nav');
                if (!nav) return;
                
                var pauseBtn = nav.querySelector('[aria-label*="Pause"], [aria-label*="Play"]');
                if (!pauseBtn) {
                    pauseBtn = document.createElement('button');
                    pauseBtn.setAttribute('aria-label', 'Pause slideshow');
                    pauseBtn.textContent = 'Pause';
                    nav.appendChild(pauseBtn);
                }
                
                var isPaused = false;
                pauseBtn.addEventListener('click', function() {
                    isPaused = !isPaused;
                    var ukSlideshow = UIkit.slideshow(slideshow);
                    if (isPaused) {
                        ukSlideshow.pause();
                        this.setAttribute('aria-label', 'Play slideshow');
                        this.textContent = 'Play';
                    } else {
                        ukSlideshow.start();
                        this.setAttribute('aria-label', 'Pause slideshow');
                        this.textContent = 'Pause';
                    }
                });
            });
        }
    }

    function initFormAccessibility() {
        var forms = document.querySelectorAll('form');
        forms.forEach(function(form) {
            var inputs = form.querySelectorAll('input, textarea, select');
            
            // Add aria-required to required fields
            inputs.forEach(function(input) {
                if (input.hasAttribute('required') && !input.hasAttribute('aria-required')) {
                    input.setAttribute('aria-required', 'true');
                }
            });
            
            // Form submission validation
            form.addEventListener('submit', function(e) {
                var invalidInputs = form.querySelectorAll(':invalid');
                var firstInvalid = null;
                
                invalidInputs.forEach(function(input) {
                    input.setAttribute('aria-invalid', 'true');
                    if (!firstInvalid) firstInvalid = input;
                    
                    var errorId = input.id + '-error';
                    var errorMsg = document.getElementById(errorId);
                    if (!errorMsg) {
                        errorMsg = document.createElement('div');
                        errorMsg.id = errorId;
                        errorMsg.className = 'form-error';
                        errorMsg.setAttribute('role', 'alert');
                        errorMsg.setAttribute('aria-live', 'polite');
                        input.parentNode.insertBefore(errorMsg, input.nextSibling);
                    }
                    errorMsg.textContent = input.validationMessage || 'This field is required';
                });
                
                // Clear valid fields
                form.querySelectorAll('input:valid, textarea:valid').forEach(function(input) {
                    input.setAttribute('aria-invalid', 'false');
                    var errorId = input.id + '-error';
                    var errorMsg = document.getElementById(errorId);
                    if (errorMsg) errorMsg.remove();
                });
                
                if (firstInvalid) {
                    e.preventDefault();
                    firstInvalid.focus();
                    announceToScreenReader('Form has errors. Please correct the highlighted fields.');
                }
            });
            
            // Real-time validation
            inputs.forEach(function(input) {
                input.addEventListener('blur', function() {
                    if (this.checkValidity()) {
                        this.setAttribute('aria-invalid', 'false');
                    } else if (this.value) {
                        this.setAttribute('aria-invalid', 'true');
                    }
                });
            });
        });
    }

    function initMobileNavARIA() {
        var navToggles = document.querySelectorAll('[class*="hamburger"], [class*="uk-navbar-toggle"], button[class*="toggle"], a[href*="menu"]');
        navToggles.forEach(function(toggle) {
            if (!toggle.getAttribute('aria-expanded')) {
                toggle.setAttribute('aria-expanded', 'false');
            }
            if (!toggle.getAttribute('aria-label')) {
                toggle.setAttribute('aria-label', 'Toggle navigation menu');
            }
        });
        
        // Escape closes menus
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('[aria-expanded="true"]').forEach(function(menu) {
                    menu.setAttribute('aria-expanded', 'false');
                });
            }
        });
    }

    function announceToScreenReader(message) {
        var announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.textContent = message;
        document.body.appendChild(announcer);
        setTimeout(function() { announcer.remove(); }, 1000);
    }

    function initAnnouncer() {
        window.announceToScreenReader = announceToScreenReader;
    }

    function loadAccessibilityPreferences() {
        // Font size
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            document.documentElement.style.fontSize = savedFontSize + 'px';
        }

        // Dark mode
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            document.body.classList.add('dark-mode');
        }
    }

    /**
     * Forms Module
     */
    function initForms() {
        // Form validation
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(function(form) {
            form.addEventListener('submit', function(e) {
                if (!validateForm(form)) {
                    e.preventDefault();
                }
            });
        });

        // Real-time validation
        const inputs = document.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                validateInput(this);
            });

            input.addEventListener('input', function() {
                clearError(this);
            });
        });

        function validateForm(form) {
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(function(input) {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            return isValid;
        }

        function validateInput(input) {
            clearError(input);
            
            if (input.hasAttribute('required') && !input.value.trim()) {
                showError(input, 'This field is required');
                return false;
            }

            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    showError(input, 'Please enter a valid email address');
                    return false;
                }
            }

            if (input.type === 'tel' && input.value) {
                const phoneRegex = /^[\d\s\-+()]{10,}$/;
                if (!phoneRegex.test(input.value)) {
                    showError(input, 'Please enter a valid phone number');
                    return false;
                }
            }

            return true;
        }

        function showError(input, message) {
            input.classList.add('error');
            input.setAttribute('aria-invalid', 'true');
            
            let errorEl = input.parentElement.querySelector('.form-error');
            if (!errorEl) {
                errorEl = document.createElement('span');
                errorEl.className = 'form-error';
                errorEl.setAttribute('role', 'alert');
                input.parentElement.appendChild(errorEl);
            }
            errorEl.textContent = message;
            input.setAttribute('aria-describedby', errorEl.id || 'error-' + input.id);
        }

        function clearError(input) {
            input.classList.remove('error');
            input.removeAttribute('aria-invalid');
            input.removeAttribute('aria-describedby');
            
            const errorEl = input.parentElement.querySelector('.form-error');
            if (errorEl) {
                errorEl.remove();
            }
        }
    }

    /**
     * Scroll Animations Module
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.scroll-animate, [data-animate]');
        
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(function(el) {
            observer.observe(el);
        });

        // Stagger animation for children
        const staggerContainers = document.querySelectorAll('.stagger-children');
        staggerContainers.forEach(function(container) {
            observer.observe(container);
        });
    }

    /**
     * Mobile Navigation Module
     */
    function initMobileNav() {
        const toggle = document.getElementById('mobileNavToggle');
        const panel = document.getElementById('mobileNavPanel');
        const overlay = document.getElementById('mobileNavOverlay');
        const closeBtn = document.getElementById('mobileNavClose');

        if (!toggle || !panel) return;

        let lastFocusedElement = null;
        let isOpen = false;

        function openNav() {
            isOpen = true;
            lastFocusedElement = document.activeElement;
            panel.classList.add('is-active');
            if (overlay) overlay.classList.add('is-active');
            panel.setAttribute('aria-hidden', 'false');
            toggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            if (closeBtn) closeBtn.focus();
        }

        function closeNav() {
            isOpen = false;
            panel.classList.remove('is-active');
            if (overlay) overlay.classList.remove('is-active');
            panel.setAttribute('aria-hidden', 'true');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            if (lastFocusedElement) lastFocusedElement.focus();
            
            // Close all dropdowns
            document.querySelectorAll('.mobile-nav-dropdown-trigger').forEach(function(trigger) {
                trigger.setAttribute('aria-expanded', 'false');
                const dropdown = trigger.nextElementSibling;
                if (dropdown) dropdown.classList.remove('is-active');
            });
        }

        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            if (isOpen) closeNav();
            else openNav();
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                closeNav();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', function() {
                closeNav();
            });
        }

        // Dropdown toggles
        document.querySelectorAll('.mobile-nav-dropdown-trigger').forEach(function(trigger) {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
                const dropdown = this.nextElementSibling;
                if (dropdown) dropdown.classList.toggle('is-active');
            });
        });

        // Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                closeNav();
            }
        });

        // Focus trap
        panel.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;
            const focusable = panel.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });
    }

})();
