// Throttle function to limit the rate of execution
const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};

// Three.js setup
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('spaceCanvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    // Create a star field with dynamic effects
    const starsGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });

    const starsCount = 15000;
    const positions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
        positions[i * 3] = Math.random() * 2000 - 1000;
        positions[i * 3 + 1] = Math.random() * 2000 - 1000;
        positions[i * 3 + 2] = Math.random() * 2000 - 1000;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(starsGeometry, starMaterial);
    scene.add(stars);

    // Create a glowing nebula effect
    const nebulaGeometry = new THREE.SphereGeometry(5, 32, 32);
    const nebulaMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.3,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);

    // Add a rotating ring around the nebula
    const ringGeometry = new THREE.RingGeometry(6, 7, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        opacity: 0.5,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // Animate the scene
    const animate = () => {
        requestAnimationFrame(animate);
        stars.rotation.x += 0.001;
        stars.rotation.y += 0.001;
        nebula.rotation.y += 0.0005;
        ring.rotation.z += 0.001; // Rotate the ring

        renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
});

// Enhanced Parallax Effect
const initParallax = () => {
    const layers = document.querySelectorAll('.parallax-layer');

    const updateParallax = () => {
        const scrolled = window.scrollY;
        
        layers.forEach(layer => {
            const speed = parseFloat(layer.getAttribute('data-speed'));
            layer.style.transform = `translateY(${scrolled * speed}px)`;
        });
    };

    // Use requestAnimationFrame for smoother scrolling
    const onScroll = () => {
        requestAnimationFrame(updateParallax);
    };

    window.addEventListener('scroll', onScroll);
};

// Smooth scrolling to section with custom offset
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = 80; // Adjust this value based on your header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Lazy loading images
const lazyLoadImages = () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const lazyLoad = () => {
        lazyImages.forEach(img => {
            if (img.getBoundingClientRect().top < window.innerHeight && img.getBoundingClientRect().bottom > 0) {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
            }
        });
        if (lazyImages.length === 0) {
            document.removeEventListener('scroll', lazyLoad);
            window.removeEventListener('resize', lazyLoad);
        }
    };
    window.addEventListener('scroll', lazyLoad);
    window.addEventListener('resize', lazyLoad);
    lazyLoad(); // Initial load
};

// Initialize functions when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initParallax();
    lazyLoadImages();
    console.log('Page fully loaded and ready');
});

// Optional: Dynamic content loading example
const loadMoreContent = () => {
    const contentContainer = document.querySelector('.dynamic-content');
    if (contentContainer) {
        const scrollPosition = window.innerHeight + window.scrollY;
        const triggerPoint = contentContainer.offsetTop + contentContainer.offsetHeight;

        if (scrollPosition > triggerPoint) {
            console.log('Load more content or trigger action here');
        }
    }
};

// Throttled scroll event listener for dynamic content loading
window.addEventListener('scroll', throttle(loadMoreContent, 200));
