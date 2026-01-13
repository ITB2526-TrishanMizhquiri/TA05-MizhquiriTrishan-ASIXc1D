// Partículas de fondo cyberpunk con interacción de mouse mejorada
class Particles {
    constructor() {
        // Crear canvas si no existe
        if (!document.getElementById('particles-canvas')) {
            const canvas = document.createElement('canvas');
            canvas.id = 'particles-canvas';
            canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                pointer-events: none;
            `;
            document.body.insertBefore(canvas, document.body.firstChild);
        }
       
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 100;
        this.mouse = {
            x: undefined,
            y: undefined,
            radius: 200,
            active: false
        };
       
        this.init();
        this.animate();
       
        // Event listeners para interacción con el mouse
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
            this.mouse.active = true;
        });
       
        window.addEventListener('touchmove', (e) => {
            if (e.touches[0]) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
                this.mouse.active = true;
            }
        });
       
        // Reiniciar cuando el mouse sale de la ventana
        window.addEventListener('mouseleave', () => {
            this.mouse.active = false;
        });
       
        window.addEventListener('resize', () => this.resizeCanvas());
    }
   
    init() {
        this.resizeCanvas();
       
        // Crear partículas
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(new Particle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * 2.5 + 0.5,
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
       
        // Dibujar líneas entre partículas cercanas
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
               
                if (distance < 150) {
                    // Intensificar la línea cuando el mouse está cerca
                    let opacity = 0.1 - distance/1500;
                    if (this.mouse.active) {
                        const mouseDistanceToParticle = Math.sqrt(
                            Math.pow(this.mouse.x - this.particles[i].x, 2) +
                            Math.pow(this.mouse.y - this.particles[i].y, 2)
                        );
                        if (mouseDistanceToParticle < 200) {
                            opacity *= 2;
                        }
                    }
                   
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5 + (0.5 * (1 - distance/150));
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
       
        // Actualizar y dibujar partículas con interacción mejorada
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw();
        });
    }
}

class Particle {
    constructor(x, y, radius, ctx) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.ctx = ctx;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.color = Math.random() < 0.5 ? '#00f0ff' : '#b967ff';
        this.originalX = x;
        this.originalY = y;
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.random() * 40;
        this.baseSpeed = 0.01 + Math.random() * 0.02;
        this.mouseInfluence = 0.05;
    }
   
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
       
        // Glow effect en las partículas
        const gradient = this.ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 2
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
       
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }
   
    update(mouse) {
        // Movimiento sinuoso base
        this.angle += this.baseSpeed;
        this.x = this.originalX + Math.cos(this.angle) * this.distance;
        this.y = this.originalY + Math.sin(this.angle) * this.distance;
       
        // Interacción mejorada con el mouse - las partículas te siguen
        if (mouse.active && mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
           
            if (distance < mouse.radius) {
                // Calcular fuerza de atracción basada en la distancia
                const force = (mouse.radius - distance) / mouse.radius;
               
                // Las partículas se mueven hacia el mouse con más fuerza
                this.vx += dx * this.mouseInfluence * force;
                this.vy += dy * this.mouseInfluence * force;
               
                // Cambiar tamaño y brillo cuando están cerca del mouse
                this.radius = Math.min(3, 0.5 + force * 2.5);
               
                // Cambiar color basado en proximidad al mouse
                if (distance < 100) {
                    this.color = `hsl(${180 + (1 - force) * 60}, 100%, 70%)`;
                }
            } else {
                // Volver al tamaño normal cuando están lejos
                this.radius = 0.5 + Math.random() * 2;
            }
        }
       
        // Rebote suave en los bordes
        if (this.x - this.radius < 0 || this.x + this.radius > window.innerWidth) {
            this.vx = -this.vx * 0.8;
        }
        if (this.y - this.radius < 0 || this.y + this.radius > window.innerHeight) {
            this.vy = -this.vy * 0.8;
        }
       
        // Aplicar velocidad con fricción
        this.x += this.vx;
        this.y += this.vy;
       
        // Fricción para movimiento suave
        this.vx *= 0.92;
        this.vy *= 0.92;
       
        // Restablecer posición original gradualmente
        this.originalX += (this.x - this.originalX) * 0.01;
        this.originalY += (this.y - this.originalY) * 0.01;
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    new Particles();
   
    // Efecto adicional: brillo en el cursor
    const cursorFollower = document.createElement('div');
    cursorFollower.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0,240,255,0.6) 0%, transparent 70%);
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
        opacity: 0.7;
        transition: transform 0.1s ease;
    `;
    cursorFollower.id = 'cursor-follower';
    document.body.appendChild(cursorFollower);
   
    // Seguir el mouse con el brillo
    document.addEventListener('mousemove', (e) => {
        const follower = document.getElementById('cursor-follower');
        if (follower) {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }
    });
});

// Efecto de brillo en los elementos al pasar el mouse
document.addEventListener('DOMContentLoaded', function() {
    // Aplicar efecto glow a elementos importantes
    const glowElements = document.querySelectorAll('a, .btn, .nav-links a, .section-title, .project-card');
   
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