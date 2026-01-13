// === CLASE PRINCIPAL PARA EL HUMO NEÓN FLUIDO ===
class FluidNeonSmoke {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'neon-smoke-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        `;
        document.body.insertBefore(this.canvas, document.body.firstChild);

        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.time = 0;

        this.init();
        this.animate();
    }

    init() {
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.time += 0.01;

        // Limpiar lienzo
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Dibujar humo neón
        this.drawFluidSmoke();
    }

    drawFluidSmoke() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        // Crear gradiente radial para cada "nube"
        for (let i = 0; i < 8; i++) {
            const x = w * 0.5 + Math.cos(this.time + i * 0.5) * w * 0.3;
            const y = h * 0.5 + Math.sin(this.time + i * 0.7) * h * 0.2;
            const size = w * 0.4 + Math.sin(this.time * 0.3 + i) * w * 0.1;

            // Elegir color neón aleatorio
            const colors = ['#00f0ff', '#ffffff', '#b967ff', '#cc99ff'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            // Gradiente radial para el humo
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.5, 'transparent');
            gradient.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Efecto de brillo en el centro
            const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 0.3);
            glowGradient.addColorStop(0, color);
            glowGradient.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = glowGradient;
            ctx.fill();
        }

        // Añadir partículas pequeñas dispersas (opcional)
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const r = Math.random() * 0.5 + 0.3;
            const color = Math.random() < 0.5 ? '#00f0ff' : '#b967ff';

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }
    }
}

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', function() {
    new FluidNeonSmoke();

    // Cursor personalizado
    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursorFollower);

    document.addEventListener('mousemove', (e) => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    });

    // Efecto de brillo en elementos interactivos
    const glowElements = document.querySelectorAll('a, .btn, .nav-links a, .section-title, .project-card, .skill-card, .tool-item');

    glowElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 10px #00f0ff, 0 0 20px #00f0ff';
            this.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.5)';
        });

        element.addEventListener('mouseleave', function() {
            this.style.textShadow = '';
            this.style.boxShadow = '';
        });
    });
});