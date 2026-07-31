/* ========================================================================
   ACCESSIBILITY MODULE
   Premium Enterprise Design System
   WCAG 2.2 AA Compliant
   ======================================================================== */

/**
 * Accessibility Module
 * Handles accessibility features and preferences
 */
(function() {
    'use strict';

    const Accessibility = {
        widget: null,
        panel: null,
        toggle: null,
        isOpen: false,
        
        init: function() {
            this.toggle = document.getElementById('accessibilityToggle');
            this.panel = document.getElementById('accessibilityPanel');
            
            if (!this.toggle || !this.panel) return;
            
            this.bindEvents();
            this.loadPreferences();
        },
        
        bindEvents: function() {
            const self = this;
            
            // Toggle button
            this.toggle.addEventListener('click', function(e) {
                e.preventDefault();
                self.togglePanel();
            });
            
            // Keyboard
            this.toggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    self.togglePanel();
                }
            });
            
            // Close on escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && self.isOpen) {
                    self.closePanel();
                }
            });
            
            // Close on click outside
            document.addEventListener('click', function(e) {
                if (!self.panel.contains(e.target) && !self.toggle.contains(e.target)) {
                    self.closePanel();
                }
            });
        },
        
        togglePanel: function() {
            if (this.isOpen) {
                this.closePanel();
            } else {
                this.openPanel();
            }
        },
        
        openPanel: function() {
            this.isOpen = true;
            this.panel.classList.remove('is-hidden');
            this.panel.setAttribute('aria-hidden', 'false');
            this.toggle.setAttribute('aria-expanded', 'true');
            
            // Focus first button in panel
            const firstBtn = this.panel.querySelector('button, a');
            if (firstBtn) firstBtn.focus();
        },
        
        closePanel: function() {
            this.isOpen = false;
            this.panel.classList.add('is-hidden');
            this.panel.setAttribute('aria-hidden', 'true');
            this.toggle.setAttribute('aria-expanded', 'false');
            this.toggle.focus();
        },
        
        loadPreferences: function() {
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
    };

    /**
     * Font Size Control
     */
    window.changeFontSize = function(delta) {
        const html = document.documentElement;
        const current = parseFloat(window.getComputedStyle(html).fontSize) || 16;
        const newSize = Math.max(12, Math.min(24, current + (delta * 2)));
        html.style.fontSize = newSize + 'px';
        localStorage.setItem('fontSize', newSize);
        
        // Announce change
        AccessibilityModule.announce('Font size changed to ' + newSize + ' pixels');
    };

    /**
     * Reset Font Size
     */
    window.resetFontSize = function() {
        document.documentElement.style.fontSize = '16px';
        localStorage.setItem('fontSize', '16');
        AccessibilityModule.announce('Font size reset to default');
    };

    /**
     * Dark Mode Toggle
     */
    window.toggleDarkMode = function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        
        const message = isDark ? 'Dark mode enabled' : 'Dark mode disabled';
        AccessibilityModule.announce(message);
    };

    /**
     * High Contrast Toggle
     */
    window.toggleHighContrast = function() {
        document.body.classList.toggle('high-contrast');
        const isHighContrast = document.body.classList.contains('high-contrast');
        localStorage.setItem('highContrast', isHighContrast);
        
        const message = isHighContrast ? 'High contrast mode enabled' : 'High contrast mode disabled';
        AccessibilityModule.announce(message);
    };

    /**
     * Underline Links Toggle
     */
    window.toggleLinkUnderline = function() {
        document.body.classList.toggle('links-underlined');
        const isUnderlined = document.body.classList.contains('links-underlined');
        localStorage.setItem('linkUnderline', isUnderlined);
        
        const message = isUnderlined ? 'Links are now underlined' : 'Link underlines removed';
        AccessibilityModule.announce(message);
    };

    /**
     * Read Content Aloud
     */
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
            AccessibilityModule.announce('Reading page content');
        }
    };

    /**
     * Stop Reading
     */
    window.stopReading = function() {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            AccessibilityModule.announce('Reading stopped');
        }
    };

    /**
     * Accessibility Module (Internal)
     */
    const AccessibilityModule = {
        announce: function(message) {
            const announcer = document.createElement('div');
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.className = 'sr-only';
            announcer.textContent = message;
            document.body.appendChild(announcer);
            setTimeout(function() {
                announcer.remove();
            }, 1000);
        }
    };

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        Accessibility.init();
    });

})();
