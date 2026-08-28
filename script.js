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
// 6. TERMINAL INTERACTIVA
// =========================================================
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const startBtn = document.getElementById('start-game-btn');
const abortBtn = document.getElementById('abort-btn');

const SERVERS = [
    { name: '[OFICIAL] Co-op Campaign', map: 'c1a0_bm', players: '2/8' },
    { name: '24/7 Crossfire Only', map: 'crossfire', players: '15/32' },
    { name: 'Tower Defense RPG', map: 'winter_maul', players: '8/8' },
    { name: 'Custom Antenna Test Server', map: 'de_dust2', players: '4/16' }
];

const STATS = [
    { label: 'Valores Hex Modificados', value: '999+' },
    { label: 'Jugadores en Red', value: '32' },
    { label: 'Ping Promedio (ms)', value: '15' }
];

function terminalPrint(text, className = 'text-hl-green') {
    const p = document.createElement('p');
    p.className = `arcade-font ${className}`;
    p.innerHTML = text;
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function terminalClear() {
    terminalOutput.innerHTML = '';
}

function terminalExecute(raw) {
    const cmd = (raw || '').trim().toLowerCase();
    const [base, ...args] = cmd.split(/\s+/);
    const arg = args.join(' ');

    terminalPrint(`<span class="text-metal">&gt; ${raw.trim()}</span>`, 'text-metal');

    switch (base) {
        case '':
            break;
        case 'help':
        case '?':
            terminalPrint('Comandos disponibles:');
            terminalPrint('  help - lista de comandos', 'text-metal');
            terminalPrint('  ls - lista los servidores', 'text-metal');
            terminalPrint('  connect &lt;server&gt; - conectar (p.ej. connect 1)', 'text-metal');
            terminalPrint('  ping &lt;host&gt; - hacer ping', 'text-metal');
            terminalPrint('  stats - estadísticas del lobby', 'text-metal');
            terminalPrint('  scan - escanear señales LAN', 'text-metal');
            terminalPrint('  version - versión del sistema', 'text-metal');
            terminalPrint('  run - lanzar partida', 'text-metal');
            terminalPrint('  clear - limpiar pantalla', 'text-metal');
            break;
        case 'ls':
            terminalPrint('HOOTING SERVERS...');
            SERVERS.forEach((s, i) => {
                terminalPrint(`  [${i + 1}] ${s.name}  (${s.map})  ${s.players}`, 'text-metal');
            });
            break;
        case 'connect': {
            const index = parseInt(arg, 10) - 1;
            const server = SERVERS[index];
            if (server) {
                playTone(880, 'square', 0.1);
                setTimeout(() => playTone(1320, 'square', 0.2), 150);
                terminalPrint(`Connecting to ${server.name}...`);
                setTimeout(() => terminalPrint('[CONNECTED] waiting for players...', 'text-wc-blue'), 400);
            } else {
                terminalPrint('error: server not found. use "ls" to list servers.', 'text-alert');
            }
            break;
        }
        case 'ping':
            terminalPrint(`Pinging ${arg || 'localhost'}...`);
            setTimeout(() => terminalPrint(`Reply from ${arg || 'localhost'}: time=12ms TTL=64`, 'text-metal'), 400);
            break;
        case 'stats':
            terminalPrint('LOBBY STATS:');
            STATS.forEach(s => {
                terminalPrint(`  ${s.label}: ${s.value}`, 'text-metal');
            });
            break;
        case 'scan':
            terminalPrint('Scanning frequency bands...');
            setTimeout(() => terminalPrint('[OK] 4 signals found. run "ls" to list.', 'text-wc-blue'), 400);
            break;
        case 'version':
            terminalPrint('RETRO LAN v2.4.1 - build 2000.01.01');
            break;
        case 'run':
            startBtn.click();
            break;
        case 'clear':
        case 'cls':
            terminalClear();
            break;
        default:
            terminalPrint(`command not found: ${base}. type "help" for commands.`, 'text-alert');
    }
}

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        terminalExecute(terminalInput.value);
        terminalInput.value = '';
    }
});

// Ejecutar al pulsar EXECUTE ./RUN y ABORT
startBtn.addEventListener('click', () => {
    // Secuencia de sonido de inicio de arcade
    playTone(440, 'sawtooth', 0.2);
    setTimeout(() => playTone(660, 'sawtooth', 0.2), 200);
    setTimeout(() => playTone(880, 'sawtooth', 0.4), 400);
    setTimeout(() => playTone(1760, 'square', 0.6), 800);

    terminalClear();
    terminalPrint('PLAYER 1 READY');
    setTimeout(() => {
        terminalPrint('GAME START!', 'text-wc-blue');
    }, 800);
});

abortBtn.addEventListener('click', () => {
    playTone(200, 'sawtooth', 0.15);
    terminalClear();
    terminalPrint('ABORTED.');
    terminalPrint('Insert coin to continue...', 'text-alert');
});

// Enfocar la terminal al hacer clic en la pantalla
document.getElementById('arcade-screen').addEventListener('click', () => {
    terminalInput.focus();
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

// =========================================================
// 8. BÚSQUEDA EN VIVO DE SERVIDORES
// =========================================================
const serverSearch = document.getElementById('server-search');
const serverRows = document.querySelectorAll('#server-search + .retro-table tbody tr');

serverSearch.addEventListener('input', () => {
    const query = serverSearch.value.trim().toLowerCase();

    serverRows.forEach(row => {
        const match = row.textContent.trim().toLowerCase().includes(query);
        row.classList.toggle('hidden-row', !match);
    });
});