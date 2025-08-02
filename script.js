// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

// Function to apply/remove dark theme
function applyDarkTheme(enable) {
    if (enable) {
        document.body.classList.add('dark-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else {
        document.body.classList.remove('dark-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
}

// Initial theme setup on load
document.addEventListener('DOMContentLoaded', () => {
    // Check local storage for user preference first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        applyDarkTheme(true);
    } else if (savedTheme === 'light') {
        applyDarkTheme(false);
    } else {
        // If no preference, check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyDarkTheme(true);
        } else {
            // Default to dark mode if no system preference or preference is light
            applyDarkTheme(true); // Default to dark mode as requested
        }
    }

    // Event listener for theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-theme');
            applyDarkTheme(!isDark);
            localStorage.setItem('theme', !isDark ? 'dark' : 'light'); // Save preference
        });
    }

    // Back button and logo link logic (existing)
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', goBack);
    }

    const logoLink = document.querySelector('.logo');
    if (logoLink) {
        logoLink.href = 'index.html';
    }

    const currentPath = window.location.pathname;
    const isHomePage = currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/Portfolio/'); // Added /Portfolio/ for GitHub Pages root

    if (backButton) {
        backButton.style.display = isHomePage ? 'none' : 'block';
    }
});


// Mobile Menu Toggle (existing)
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}

// Scroll Animation (existing)
const fadeInOnScroll = () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
    });
};

window.addEventListener('scroll', fadeInOnScroll);
window.addEventListener('load', fadeInOnScroll);

// 3D Card Effect (updated to include new image cards)
const cards = document.querySelectorAll('.skill-card, .project-card, .hobby-card, .about-image, .image-card-wrapper');

cards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        // Apply 3D transform only if it's not a flip card, or if it's the wrapper (not the inner element)
        // The flip effect is handled purely by CSS on .image-card-inner
        if (!card.classList.contains('image-card-wrapper')) {
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        } else {
            // For flip cards, apply a subtle tilt to the wrapper
            card.style.transform = `perspective(1000px) rotateX(${rotateX * 0.2}deg) rotateY(${rotateY * 0.2}deg)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        card.style.transition = 'transform 0.5s ease';
    });
});

// Custom Modal for alerts (replaces alert()) (existing)
function showModal(message) {
    let modal = document.getElementById('custom-alert-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'custom-alert-modal';
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <p id="modal-message"></p>
                <button id="modal-ok-button" class="submit-btn" style="margin-top: 20px;">OK</button>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.querySelector('#modal-ok-button').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    }
    document.getElementById('modal-message').textContent = message;
    modal.style.display = 'flex';
}

// Form Submission (Updated to use fetch API) (existing)
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        const serverUrl = 'http://localhost:3000/send-email';

        try {
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, subject, message })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                showModal(result.message);
                contactForm.reset();
            } else {
                const errorMessage = result.message || 'An unexpected error occurred.';
                showModal(`Error: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showModal('There was a problem connecting to the server. Please ensure the backend is running and try again later.');
        }
    });
}

// Function to navigate back to the previous page (existing)
function goBack() {
    window.history.back();
}


// Three.js setup for Home page background (existing)
if (document.getElementById('hero-canvas')) {
    let scene, camera, renderer, particles;

    function initThreeJS() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const particleCount = 2000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const color1 = new THREE.Color(0x6c63ff);
        const color2 = new THREE.Color(0x4db5ff);
        const color3 = new THREE.Color(0xff6b6b);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() * 2 - 1) * 500;
            positions[i * 3 + 1] = (Math.random() * 2 - 1) * 500;
            positions[i * 3 + 2] = (Math.random() * 2 - 1) * 500;

            const mixedColor = new THREE.Color();
            const r = Math.random();
            if (r < 0.33) {
                mixedColor.copy(color1);
            } else if (r < 0.66) {
                mixedColor.copy(color2);
            } else {
                mixedColor.copy(color3);
            }

            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        camera.position.z = 200;

        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animateThreeJS() {
        requestAnimationFrame(animateThreeJS);

        if (particles) {
            particles.rotation.x += 0.0005;
            particles.rotation.y += 0.0008;
        }

        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }

    const threeJsScript = document.createElement('script');
    threeJsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    threeJsScript.onload = () => {
        initThreeJS();
        animateThreeJS();
    };
    document.head.appendChild(threeJsScript);
}
