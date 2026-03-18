// ========== STAR CANVAS BACKGROUND ==========
function setupStars() {
    const canvas = document.getElementById('starsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    const STAR_COUNT = window.innerWidth < 600 ? 60 : 120;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.8 + 0.3,
                opacity: Math.random() * 0.5 + 0.1,
                speed: Math.random() * 0.005 + 0.002,
                phase: Math.random() * Math.PI * 2,
            });
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const time = Date.now() * 0.001;
        
        stars.forEach(star => {
            const twinkle = Math.sin(time * star.speed * 100 + star.phase) * 0.3 + 0.7;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(240, 230, 255, ${star.opacity * twinkle})`;
            ctx.fill();
        });
        
        requestAnimationFrame(draw);
    }
    
    resize();
    createStars();
    draw();
    
    window.addEventListener('resize', () => {
        resize();
        createStars();
    });
}

// ========== FLOATING HEARTS ==========
function createFloatingHearts() {
    const container = document.getElementById('heartsContainer');
    if (!container) return;
    const hearts = ['💕', '💗', '💖', '✨', '🌸'];
    const isMobile = window.innerWidth < 600;
    
    function spawnHeart() {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 12 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
        heart.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 22000);
    }

    // Initial - fewer on mobile
    const initial = isMobile ? 4 : 6;
    for (let i = 0; i < initial; i++) {
        setTimeout(() => spawnHeart(), i * 800);
    }

    // Continuous - slower on mobile
    setInterval(spawnHeart, isMobile ? 4000 : 3000);
}

// ========== SCROLL REVEAL ==========
function setupScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Small stagger for siblings
                const parent = entry.target.parentElement;
                const siblings = parent ? parent.querySelectorAll('.reveal') : [];
                let index = 0;
                siblings.forEach((sib, i) => {
                    if (sib === entry.target) index = i;
                });
                
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 80);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

// ========== TYPEWRITER ==========
function setupTypewriter() {
    const title = document.getElementById('heroTitle');
    if (!title) return;
    
    const text = 'Sana Bir Şey Söylemem Lazım...';
    title.innerHTML = '';
    title.style.opacity = '1';
    title.style.transform = 'none';
    title.style.animation = 'none';
    
    // Create a text node and a cursor span separately
    const textNode = document.createTextNode('');
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.animation = 'blink 0.8s step-end infinite';
    cursor.style.marginLeft = '1px';
    cursor.style.fontWeight = '300';
    
    title.appendChild(textNode);
    title.appendChild(cursor);
    
    // Add blink keyframes
    const style = document.createElement('style');
    style.textContent = '@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }';
    document.head.appendChild(style);
    
    let i = 0;
    function type() {
        if (i < text.length) {
            textNode.textContent += text.charAt(i);
            i++;
            const delay = text.charAt(i - 1) === '.' ? 200 : (Math.random() * 40 + 50);
            setTimeout(type, delay);
        } else {
            setTimeout(() => cursor.remove(), 2000);
        }
    }

    setTimeout(type, 600);
}

// ========== SMOOTH SCROLL ==========
function setupStartButton() {
    const startBtn = document.getElementById('startBtn');
    const letterSection = document.getElementById('letterSection');
    if (!startBtn || !letterSection) return;

    startBtn.addEventListener('click', () => {
        letterSection.scrollIntoView({ behavior: 'smooth' });
    });
}

// ========== MODALS ==========
function setupModals() {
    const yesBtn = document.getElementById('yesBtn');
    const thinkBtn = document.getElementById('thinkBtn');
    const yesModal = document.getElementById('yesModal');
    const thinkModal = document.getElementById('thinkModal');
    const closeYesModal = document.getElementById('closeYesModal');
    const closeThinkModal = document.getElementById('closeThinkModal');

    if (!yesBtn || !thinkBtn) return;

    yesBtn.addEventListener('click', () => {
        yesModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        createConfetti();
        burstHearts();
        // Vibrate on mobile if supported
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    });

    thinkBtn.addEventListener('click', () => {
        thinkModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeYesModal.addEventListener('click', () => closeModal(yesModal));
    closeThinkModal.addEventListener('click', () => closeModal(thinkModal));

    [yesModal, thinkModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });
}

// ========== BURST HEARTS ON YES ==========
function burstHearts() {
    const container = document.getElementById('heartsContainer');
    if (!container) return;
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('span');
            heart.className = 'floating-heart';
            heart.textContent = ['❤️', '💕', '💖', '💗'][Math.floor(Math.random() * 4)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (Math.random() * 18 + 14) + 'px';
            heart.style.animationDuration = (Math.random() * 4 + 4) + 's';
            heart.style.animationDelay = '0s';
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 10000);
        }, i * 120);
    }
}

// ========== CONFETTI ==========
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    const colors = ['#ff6b9d', '#c084fc', '#a855f7', '#f59e0b', '#fb7185', '#ec4899'];

    for (let i = 0; i < 45; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = color;
            confetti.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
            confetti.style.animationDelay = Math.random() * 0.4 + 's';
            
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }

            container.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }, i * 40);
    }
}

// ========== PARALLAX ==========
function setupParallax() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    
    // Skip parallax on mobile for performance
    if (window.innerWidth < 600) return;
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroHeight = hero.offsetHeight;
                
                if (scrolled < heroHeight) {
                    const overlay = hero.querySelector('.hero-overlay');
                    const progress = scrolled / heroHeight;
                    const opacity = 0.3 + progress * 0.65;
                    overlay.style.background = `linear-gradient(
                        180deg,
                        rgba(7, 6, 11, ${Math.min(opacity, 0.95)}) 0%,
                        rgba(7, 6, 11, ${Math.min(opacity + 0.05, 0.98)}) 50%,
                        rgba(7, 6, 11, 0.99) 100%
                    )`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ========== PROGRESS BAR (top of page) ==========
function setupProgressBar() {
    const bar = document.createElement('div');
    bar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 2px;
        background: linear-gradient(90deg, #ff6b9d, #c084fc, #a855f7);
        z-index: 9999;
        transition: width 0.1s linear;
        width: 0%;
        border-radius: 0 1px 1px 0;
    `;
    document.body.appendChild(bar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        bar.style.width = progress + '%';
    });
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
    setupStars();
    createFloatingHearts();
    setupScrollReveal();
    setupTypewriter();
    setupStartButton();
    setupModals();
    setupParallax();
    setupProgressBar();
});
