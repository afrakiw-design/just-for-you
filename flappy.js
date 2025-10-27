const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const msgEl = document.getElementById('msg');

let frames = 0;
let pipes = [];
let gameRunning = false;
let score = 0;

const bird = {
    x: window.innerWidth * 0.2,
    y: window.innerHeight / 2,
    r: 20,
    vy: 0,
    gravity: 0.4,     // Seimbangkan gravitasi
    jumpPower: -7.5,  // Seimbangkan kekuatan lompatan
    draw() {
        ctx.fillStyle = '#ffdd57';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fill();
        // Paruh burung
        ctx.fillStyle = '#e07a00';
        ctx.beginPath();
        ctx.moveTo(this.x+this.r, this.y);
        ctx.lineTo(this.x+this.r+12, this.y-8);
        ctx.lineTo(this.x+this.r+12, this.y+8);
        ctx.fill();
    },
    update() {
        this.vy += this.gravity;
        this.y += this.vy;
    },
    reset() {
        this.y = window.innerHeight / 2;
        this.vy = 0;
    },
    flap() {
        this.vy = this.jumpPower;
    }
};

function spawnPipe() {
    const gap = window.innerHeight * 0.35;    // Gap vertikal yang lebih besar
    const minTop = 60;
    const maxTop = window.innerHeight - gap - 120;
    const top = minTop + Math.random()*(maxTop - minTop);
    const w = 80;
    pipes.push({
        x: window.innerWidth + 10,
        top: top,
        bottom: top + gap,
        w: w,
        passed: false
    });
}

function update() {
    frames++;
    if(!gameRunning) return;
    bird.update();

    // Spawn pipes setiap 180 frames (jarak lebih lebar)
    if(frames % 180 === 0) spawnPipe();

    for(let i=pipes.length-1; i>=0; i--) {
        const p = pipes[i];
        p.x -= 2;    // Kecepatan pipe yang lebih seimbang
        
        if(!p.passed && p.x + p.w < bird.x) {
            p.passed = true;
            score++;
            updateScore();
        }
        if(collisionPipe(p)) {
            gameOver();
        }
        if(p.x + p.w < -10) pipes.splice(i,1);
    }

    // Collision dengan tanah dan langit
    if(bird.y + bird.r > window.innerHeight - 20) {
        gameOver();
    }
    if(bird.y - bird.r < 0) {
        bird.y = bird.r;
        bird.vy = 0;
    }
}

function collisionPipe(p) {
    const inX = bird.x + bird.r > p.x && bird.x - bird.r < p.x + p.w;
    const inTopY = bird.y - bird.r < p.top;
    const inBottomY = bird.y + bird.r > p.bottom;
    return (inX && (inTopY || inBottomY));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    const g = ctx.createLinearGradient(0,0,0,canvas.height);
    g.addColorStop(0,'#70c5ce');
    g.addColorStop(1,'#8ad7e6');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Pipes
    pipes.forEach(p => {
        ctx.fillStyle = '#2f9e44';
        ctx.fillRect(p.x, 0, p.w, p.top);
        ctx.fillRect(p.x, p.bottom, p.w, canvas.height - p.bottom - 20);
        // Pipe caps
        ctx.fillStyle = '#1f7d33';
        ctx.fillRect(p.x-6, Math.max(0, p.top-10), p.w+12, 10);
        ctx.fillRect(p.x-6, p.bottom+0, p.w+12, 10);
    });

    // Ground
    ctx.fillStyle = '#c98a3d';
    ctx.fillRect(0, canvas.height-20, canvas.width, 20);

    // Bird
    bird.draw();

    // Game Over overlay
    if(!gameRunning) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width/2, canvas.height/2 - 20);
        ctx.font = '24px Arial';
        ctx.fillText('Tekan R untuk mulai ulang', canvas.width/2, canvas.height/2 + 30);
    }
}

function resetGame() {
    pipes = [];
    frames = 0;
    score = 0;
    bird.reset();
    gameRunning = true;
    msgEl.textContent = 'Klik / Spasi untuk terbang — Tekan R untuk mulai ulang';
    updateScore();
}

function updateScore() {
    scoreEl.textContent = 'Skor: ' + score;
}

function gameOver() {
    gameRunning = false;
    msgEl.textContent = 'Game Over - Tekan R untuk ulang';
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bird.x = window.innerWidth * 0.2;
}

// Event Listeners
window.addEventListener('resize', resizeCanvas);
window.addEventListener('keydown', e => {
    if(e.code === 'Space') {
        if(!gameRunning) { resetGame(); return; }
        bird.flap();
    }
    if(e.key.toLowerCase() === 'r') {
        resetGame();
    }
});

window.addEventListener('mousedown', e => {
    if(!gameRunning){ resetGame(); return; }
    bird.flap();
});

window.addEventListener('touchstart', e => {
    e.preventDefault();
    if(!gameRunning){ resetGame(); return; }
    bird.flap();
}, {passive: false});

// Initialize game
resizeCanvas();
resetGame();
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}
loop();