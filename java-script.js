// === CLASE PRINCIPAL PARA EL HUMO NEÓN ===
class NeonSmoke {
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
        this.particles = [];
        this.mouse = { x: undefined, y: undefined, active: false };
        this.maxParticles = 300;

        this.init();
        this.animate();

        // Event listeners
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.active = true;
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches[0]) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
                this.mouse.active = true;
            }
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.active = false;
        });

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    init() {
        this.resizeCanvas();

        // Crear partículas de humo
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(new SmokeParticle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * 0.5 + 0.3,
                this.ctx
            ));
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar fondo oscuro
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Actualizar y dibujar partículas
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw();
        });
    }
}

// === CLASE PARTÍCULA DE HUMO ===
class SmokeParticle {
    constructor(x, y, radius, ctx) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.ctx = ctx;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.color = this.getRandomColor(); // Azul, Blanco, Violeta neón
        this.alpha = 0.6 + Math.random() * 0.3;
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.random() * 10;
        this.baseSpeed = 0.005 + Math.random() * 0.01;
        this.mouseInfluence = 0.02;
    }

    getRandomColor() {
        const colors = [
            '#00f0ff', // Azul neón
            '#ffffff', // Blanco neón
            '#b967ff', // Violeta neón
            '#cc99ff', // Lila brillante
            '#00ffaa'  // Verde azulado neón (opcional)
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        // Gradiente para el efecto de brillo
        const gradient = this.ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 3
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    update(mouse) {
        // Movimiento sinuoso base
        this.angle += this.baseSpeed;
        this.x = this.x + Math.cos(this.angle) * this.distance * 0.05;
        this.y = this.y + Math.sin(this.angle) * this.distance * 0.05;

        // Interacción con mouse
        if (mouse.active && mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 200) {
                const force = (200 - distance) / 200;
                this.vx += dx * this.mouseInfluence * force;
                this.vy += dy * this.mouseInfluence * force;
                this.alpha = Math.min(1, 0.8 + force * 0.2);
                this.radius = Math.min(3, 0.5 + force * 2.5);

                // Cambiar color si está cerca del mouse
                if (distance < 80) {
                    this.color = '#ffffff'; // Brilla más cerca del mouse
                }
            } else {
                this.alpha = 0.6 + Math.random() * 0.3;
                this.radius = 0.5 + Math.random() * 0.5;
            }
        }

        // Rebote suave en bordes
        if (this.x - this.radius < 0 || this.x + this.radius > window.innerWidth) {
            this.vx = -this.vx * 0.8;
        }
        if (this.y - this.radius < 0 || this.y + this.radius > window.innerHeight) {
            this.vy = -this.vy * 0.8;
        }

        // Aplicar velocidad
        this.x += this.vx;
        this.y += this.vy;

        // Fricción
        this.vx *= 0.95;
        this.vy *= 0.95;
    }
}

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', function() {
    new NeonSmoke();

    // Cursor personalizado con aura neón
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