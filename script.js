// =========================================================
// 1. PRELOADER
// =========================================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 2000); // 2 segundos de pantalla de carga simulada
});

// =========================================================
// 2. MOBILE MENU
// =========================================================
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// =========================================================
// 3. AUDIO SYSTEM (WEB AUDIO API)
// =========================================================
// Genera sonidos retro sin necesidad de archivos MP3
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playTone(freq, type, duration) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type; // 'square', 'sawtooth', 'triangle', 'sine'
    oscillator.frequency.value = freq;

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    // Animación de volumen para que no haga un 'click' seco
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);

    oscillator.stop(audioCtx.currentTime + duration);
}

// Asignar sonido a botones interactivos
document.querySelectorAll('button, .btn-primary, .btn-secondary, a').forEach(element => {
    element.addEventListener('mouseenter', () => playTone(880, 'square', 0.05)); // Hover beep
    element.addEventListener('click', () => playTone(1200, 'square', 0.1)); // Click beep
});

// =========================================================
// 4. ANIMACIONES AL HACER SCROLL (Intersection Observer)
// =========================================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Si es un número para estadísticas, iniciar contador
            if (entry.target.classList.contains('stat-number') && !entry.target.dataset.counted) {
                animateCounter(entry.target);
                entry.target.dataset.counted = true;
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Función de contador para las estadísticas
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 segundos
    const stepTime = Math.abs(Math.floor(duration / target)) || 10; // Evita infinity

    let current = 0;
    const increment = target / (duration / stepTime);

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.innerText = target;
            clearInterval(timer);
        } else {
            element.innerText = Math.ceil(current);
        }
    }, stepTime);
}

// =========================================================
// 5. FILTRO DE JUEGOS
// =========================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const gameCards = document.querySelectorAll('.game-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover activo
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        gameCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-genre') === filter) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 50);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 400);
            }
        });
    });
});

// =========================================================
// 6. SIMULACIÓN DE MÁQUINA ARCADE
// =========================================================
const startBtn = document.getElementById('start-game-btn');
const arcadeDisplay = document.getElementById('arcade-display');

startBtn.addEventListener('click', () => {
    // Secuencia de sonido de inicio de arcade
    playTone(440, 'sawtooth', 0.2);
    setTimeout(() => playTone(660, 'sawtooth', 0.2), 200);
    setTimeout(() => playTone(880, 'sawtooth', 0.4), 400);
    setTimeout(() => playTone(1760, 'square', 0.6), 800);

    // Cambio de pantalla
    arcadeDisplay.innerHTML = '<h3 class="blink text-pink">PLAYER 1 READY</h3>';

    setTimeout(() => {
        arcadeDisplay.innerHTML = '<h3 class="glitch text-cyan" data-text="GAME START!">GAME START!</h3>';

        // Reset después de 5 segundos
        setTimeout(() => {
            arcadeDisplay.innerHTML = '<h3 class="blink text-yellow">INSERT COIN</h3>';
        }, 5000);

    }, 2000);
});

// =========================================================
// 7. FORMULARIO NEWSLETTER
// =========================================================
const form = document.getElementById('join-form');
const formMessage = document.getElementById('form-message');

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita recargar la página

    // Sonido de éxito
    playTone(880, 'sine', 0.1);
    setTimeout(() => playTone(1320, 'sine', 0.3), 150);

    const email = form.querySelector('input').value;

    // Ocultar input y mostrar mensaje
    form.style.display = 'none';
    formMessage.classList.remove('hidden');
    formMessage.innerHTML = `<span class="blink">>>></span> WELCOME TO THE ARCADE, ${email.split('@')[0]}!`;
});