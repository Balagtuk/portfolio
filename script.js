document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const setTheme = (isDark) => {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (moonIcon) moonIcon.classList.add('hidden');
            if (sunIcon) sunIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (sunIcon) sunIcon.classList.add('hidden');
            if (moonIcon) moonIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'light');
        }
    };

    // Initialize theme
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        setTheme(true);
    } else {
        setTheme(false);
    }

    // Toggle theme
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.hasAttribute('data-theme');
            setTheme(!isDark);
        });
    }

    // --- Glowing Ambient Cursor Aura ---
    const cursorGlow = document.getElementById('cursor-glow');
    
    if (cursorGlow) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let glowX = mouseX;
        let glowY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth Lerp loop for glowing light aura
        const animateCursor = () => {
            glowX += (mouseX - glowX) * 0.12;
            glowY += (mouseY - glowY) * 0.12;
            cursorGlow.style.left = `${glowX}px`;
            cursorGlow.style.top = `${glowY}px`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Expand glowing aura on hover over interactive elements
        const interactiveSelectors = 'a, button, input, textarea, .project-card, .timeline-content, .tech-logo-card, .skill-category, .contact-card';
        const interactiveElements = document.querySelectorAll(interactiveSelectors);

        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // --- Contact Form Submission Handler ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
            const accessKey = accessKeyInput ? accessKeyInput.value.trim() : '';
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (submitBtn) {
                submitBtn.style.opacity = '0.7';
                submitBtn.disabled = true;
            }

            if (formStatus) {
                formStatus.className = 'form-status';
                formStatus.textContent = 'Sending message...';
            }

            // Check if user has replaced placeholder with a valid Web3Forms access key
            if (accessKey && accessKey !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
                try {
                    const formData = new FormData(contactForm);
                    const response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();

                    if (data.success) {
                        if (formStatus) {
                            formStatus.className = 'form-status success';
                            formStatus.textContent = '✓ Thank you! Your message has been sent directly to my email.';
                        }
                        contactForm.reset();
                    } else {
                        if (formStatus) {
                            formStatus.className = 'form-status error';
                            formStatus.textContent = data.message || 'Failed to send message. Opening email client...';
                        }
                        triggerMailto(name, email, subject, message);
                    }
                } catch (err) {
                    if (formStatus) {
                        formStatus.className = 'form-status error';
                        formStatus.textContent = 'Opening your email app to send...';
                    }
                    triggerMailto(name, email, subject, message);
                } finally {
                    if (submitBtn) {
                        submitBtn.style.opacity = '1';
                        submitBtn.disabled = false;
                    }
                }
            } else {
                // Direct fallback: Open user's email client pre-filled with delacruzxander0413@gmail.com
                triggerMailto(name, email, subject, message);
                if (formStatus) {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = '✓ Opening your email client to send to delacruzxander0413@gmail.com...';
                }
                setTimeout(() => {
                    contactForm.reset();
                    if (submitBtn) {
                        submitBtn.style.opacity = '1';
                        submitBtn.disabled = false;
                    }
                }, 1000);
            }
        });
    }

    function triggerMailto(name, email, subject, message) {
        const mailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        const mailtoLink = `mailto:delacruzxander0413@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
        window.location.href = mailtoLink;
    }

    // --- Copy to Clipboard Handler for Connect Items ---
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const badge = btn.querySelector('.copy-badge');
                    const copyIcon = btn.querySelector('.copy-icon');
                    const checkIcon = btn.querySelector('.check-icon');

                    if (badge) badge.textContent = 'Copied!';
                    if (copyIcon) copyIcon.classList.add('hidden');
                    if (checkIcon) checkIcon.classList.remove('hidden');

                    setTimeout(() => {
                        if (badge) badge.textContent = 'Click to copy';
                        if (copyIcon) copyIcon.classList.remove('hidden');
                        if (checkIcon) checkIcon.classList.add('hidden');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            }
        });
    });

    // --- Timeline See More Toggle Handler ---
    const seeMoreBtns = document.querySelectorAll('.see-more-btn');
    seeMoreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cardContent = btn.closest('.timeline-content');
            const extraBullets = cardContent ? cardContent.querySelectorAll('.extra-bullet') : [];
            const isExpanded = btn.classList.contains('expanded');
            const spanText = btn.querySelector('span');

            if (isExpanded) {
                btn.classList.remove('expanded');
                if (spanText) spanText.textContent = 'See More';
                extraBullets.forEach(el => el.classList.add('collapsed'));
            } else {
                btn.classList.add('expanded');
                if (spanText) spanText.textContent = 'See Less';
                extraBullets.forEach(el => el.classList.remove('collapsed'));
            }
        });
    });

    // --- Reveal elements on scroll ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) translateX(0)';
                // Remove inline transform & transition properties after entrance animation so CSS hover transitions work 100% smoothly
                setTimeout(() => {
                    entry.target.style.removeProperty('transform');
                    entry.target.style.removeProperty('transition');
                }, 700);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.timeline-item, .project-card, .skill-category, .contact-card, .about-me-card');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        
        if (el.classList.contains('timeline-item')) {
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease-out ${index * 0.15}s, transform 0.6s ease-out ${index * 0.15}s`;
        } else if (el.classList.contains('project-card')) {
            el.style.transform = 'translateY(40px)';
            el.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        } else if (el.classList.contains('skill-category')) {
            el.style.transform = 'translateX(-30px)';
            el.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        } else {
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        }
        
        observer.observe(el);
    });
});

// ===================== LIGHTBOX =====================
(function () {
    const lightbox     = document.getElementById('lightbox');
    const lightboxImg  = document.getElementById('lightbox-img');
    const closeBtn     = document.getElementById('lightbox-close');
    const prevBtn      = document.getElementById('lightbox-prev');
    const nextBtn      = document.getElementById('lightbox-next');

    if (!lightbox || !lightboxImg) return;

    const items = Array.from(document.querySelectorAll('.masonry-item img'));
    let current = 0;

    function openLightbox(index) {
        current = index;
        lightboxImg.src = items[current].src;
        lightboxImg.alt = items[current].alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { lightboxImg.src = ''; }, 300);
    }

    function showPrev() {
        current = (current - 1 + items.length) % items.length;
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.92) translateX(40px)';
        setTimeout(() => {
            lightboxImg.src = items[current].src;
            lightboxImg.alt = items[current].alt;
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1) translateX(0)';
        }, 200);
    }

    function showNext() {
        current = (current + 1) % items.length;
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.92) translateX(-40px)';
        setTimeout(() => {
            lightboxImg.src = items[current].src;
            lightboxImg.alt = items[current].alt;
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1) translateX(0)';
        }, 200);
    }

    // Smooth transition default
    lightboxImg.style.transition = 'opacity 0.2s ease, transform 0.25s cubic-bezier(0.4,0,0.2,1)';

    items.forEach((img, i) => {
        img.parentElement.addEventListener('click', () => openLightbox(i));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    // Click backdrop to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')       closeLightbox();
        if (e.key === 'ArrowLeft')    showPrev();
        if (e.key === 'ArrowRight')   showNext();
    });
})();
