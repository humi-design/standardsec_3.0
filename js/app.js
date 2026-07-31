/* ========================================================================
   APPLICATION ACCESSIBILITY MODULE
   Standard Securities & Investment Intermediates Ltd.
   WCAG 2.2 AA Compliance
   ======================================================================== */

(function() {
    'use strict';

    // =========================================================================
    // Chatbox Module
    // =========================================================================
    class Chatbox {
        constructor() {
            this.args = {
                openButton: document.querySelector('.chatbox__button'),
                chatBox: document.querySelector('.chatbox__support'),
                sendButton: document.querySelector('.send__button')
            }

            this.state = false;
            this.messages = [];
        }

        display() {
            const {openButton, chatBox, sendButton} = this.args;

            if (!openButton || !chatBox || !sendButton) return;

            // Make chatbox accessible
            this.setupAccessibility(chatBox);

            openButton.addEventListener('click', () => this.toggleState(chatBox));
            openButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleState(chatBox);
                }
            });

            sendButton.addEventListener('click', () => this.onSendButton(chatBox));

            const node = chatBox.querySelector('input');
            node.addEventListener("keyup", ({key}) => {
                if (key === "Enter") {
                    this.onSendButton(chatBox)
                }
            });
        }

        setupAccessibility(chatBox) {
            if (!chatBox) return;
            
            // Ensure proper role
            chatBox.setAttribute('role', 'dialog');
            chatBox.setAttribute('aria-label', 'Chat support');
            
            // Make toggle accessible
            const openButton = this.args.openButton;
            if (openButton && !openButton.getAttribute('aria-label')) {
                openButton.setAttribute('aria-label', 'Open chat support');
                openButton.setAttribute('aria-expanded', 'false');
            }
        }

        toggleState(chatbox) {
            this.state = !this.state;

            // show or hides the box
            if(this.state) {
                chatbox.classList.add('chatbox--active');
                if (this.args.openButton) {
                    this.args.openButton.setAttribute('aria-expanded', 'true');
                }
            } else {
                chatbox.classList.remove('chatbox--active');
                if (this.args.openButton) {
                    this.args.openButton.setAttribute('aria-expanded', 'false');
                }
            }
        }

        onSendButton(chatbox) {
            var textField = chatbox.querySelector('input');
            let text1 = textField.value
            if (text1 === "") {
                return;
            }

            let msg1 = { name: "User", message: text1 }
            this.messages.push(msg1);

            fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                body: JSON.stringify({ message: text1 }),
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json'
                },
              })
              .then(r => r.json())
              .then(r => {
                let msg2 = { name: "Sam", message: r.answer };
                this.messages.push(msg2);
                this.updateChatText(chatbox)
                textField.value = ''

            }).catch((error) => {
                console.error('Error:', error);
                this.updateChatText(chatbox)
                textField.value = ''
              });
        }

        updateChatText(chatbox) {
            var html = '';
            this.messages.slice().reverse().forEach(function(item, index) {
                if (item.name === "Sam")
                {
                    html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
                }
                else
                {
                    html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
                }
              });

            const chatmessage = chatbox.querySelector('.chatbox__messages');
            chatmessage.innerHTML = html;
        }
    }

    // =========================================================================
    // Slideshow/Carousel Accessibility Module
    // =========================================================================
    const SlideshowA11y = {
        slideshow: null,
        playPauseBtn: null,
        isPaused: false,
        autoplayInterval: null,

        init: function() {
            this.slideshow = document.querySelector('.in-slideshow, .uk-slideshow');
            this.playPauseBtn = document.querySelector('.slideshow-play-pause');
            
            if (!this.slideshow) return;

            this.setupControls();
            this.startAutoplay();
            this.setupKeyboardNavigation();
        },

        setupControls: function() {
            const self = this;
            
            if (this.playPauseBtn) {
                this.playPauseBtn.addEventListener('click', function() {
                    self.togglePlayPause();
                });

                this.playPauseBtn.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        self.togglePlayPause();
                    }
                });
            }
        },

        togglePlayPause: function() {
            this.isPaused = !this.isPaused;
            
            if (this.playPauseBtn) {
                if (this.isPaused) {
                    this.playPauseBtn.setAttribute('aria-label', 'Play slideshow');
                    this.playPauseBtn.innerHTML = '<span class="play-icon" aria-hidden="true">▶</span><span class="sr-only">Play</span>';
                    this.stopAutoplay();
                } else {
                    this.playPauseBtn.setAttribute('aria-label', 'Pause slideshow');
                    this.playPauseBtn.innerHTML = '<span class="pause-icon" aria-hidden="true">⏸</span><span class="sr-only">Pause</span>';
                    this.startAutoplay();
                }
            }
        },

        startAutoplay: function() {
            if (this.isPaused) return;
            // Autoplay is handled by UIkit's data-uk-slideshow
        },

        stopAutoplay: function() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
                this.autoplayInterval = null;
            }
        },

        setupKeyboardNavigation: function() {
            const self = this;
            const slideshow = this.slideshow;
            
            if (!slideshow) return;

            slideshow.addEventListener('keydown', function(e) {
                const dotnav = slideshow.querySelector('.uk-dotnav');
                if (!dotnav) return;

                const items = dotnav.querySelectorAll('li');
                const currentActive = dotnav.querySelector('li.uk-active');
                let currentIndex = Array.from(items).indexOf(currentActive);

                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    
                    if (e.key === 'ArrowLeft') {
                        currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                    } else {
                        currentIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                    }
                    
                    // Trigger slideshow navigation
                    const link = items[currentIndex].querySelector('a');
                    if (link) link.click();
                }
            });
        },

        announceSlide: function(slideNumber, totalSlides) {
            const announcer = document.getElementById('sr-announcer');
            if (announcer) {
                announcer.textContent = `Slide ${slideNumber} of ${totalSlides}`;
            }
        }
    };

    // =========================================================================
    // Homepage Form Validation
    // =========================================================================
    const HomeFormValidation = {
        form: null,

        init: function() {
            this.form = document.getElementById('open-account-form');
            if (!this.form) return;

            this.setupValidation();
        },

        setupValidation: function() {
            const self = this;

            this.form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                let firstInvalid = null;

                // Validate name
                const nameField = self.form.querySelector('#full-name');
                if (nameField && nameField.required && !nameField.value.trim()) {
                    isValid = false;
                    nameField.setAttribute('aria-invalid', 'true');
                    if (!firstInvalid) firstInvalid = nameField;
                }

                // Validate email
                const emailField = self.form.querySelector('#email');
                if (emailField && emailField.required) {
                    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
                    if (!emailRegex.test(emailField.value.trim())) {
                        isValid = false;
                        emailField.setAttribute('aria-invalid', 'true');
                        if (!firstInvalid) firstInvalid = emailField;
                    }
                }

                // Validate phone
                const phoneField = self.form.querySelector('#phone');
                if (phoneField && phoneField.required && !phoneField.value.trim()) {
                    isValid = false;
                    phoneField.setAttribute('aria-invalid', 'true');
                    if (!firstInvalid) firstInvalid = phoneField;
                }

                if (isValid) {
                    self.showSuccess();
                } else {
                    self.showError();
                    if (firstInvalid) {
                        firstInvalid.focus();
                    }
                }
            });

            // Clear errors on input
            const inputs = this.form.querySelectorAll('input');
            inputs.forEach(function(input) {
                input.addEventListener('input', function() {
                    this.removeAttribute('aria-invalid');
                });
            });
        },

        showError: function() {
            const status = document.getElementById('form-status');
            if (status) {
                status.textContent = 'Please fill in all required fields correctly.';
                status.className = 'sr-only';
            }
        },

        showSuccess: function() {
            const status = document.getElementById('form-status');
            if (status) {
                status.textContent = 'Thank you! We will contact you shortly.';
                status.className = 'sr-only';
            }
            // Could redirect or show success message here
        }
    };

    // =========================================================================
    // Initialize All Modules
    // =========================================================================
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize chatbox
        const chatbox = new Chatbox();
        chatbox.display();

        // Initialize slideshow accessibility
        SlideshowA11y.init();

        // Initialize home form validation
        HomeFormValidation.init();

        // Initialize mobile navigation accessibility
        if (typeof MobileNavA11y !== 'undefined') {
            MobileNavA11y.init();
        }

        console.log('Accessibility module initialized');
    });

})();