const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';

let width, height, particles;
const particleCount = 150; // Más cantidad para que se vea lleno
const colors = ['#ff007f', '#ffcc00', '#b967ff']; // Tus colores neón

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            v: Math.random() * 2 + 0.5, // Velocidad
            a: Math.random() * Math.PI * 2, // Ángulo
            va: (Math.random() - 0.5) * 0.05, // Variación de ángulo
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}

function draw() {
    // Esto crea el efecto de "rastro" o humo.
    // No borra el canvas del todo, deja una sombra muy transparente
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        p.a += p.va;
        p.x += Math.cos(p.a) * p.v;
        p.y += Math.sin(p.a) * p.v;

        // Si se sale de la pantalla, vuelve a entrar
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;

        // Dibujamos pequeños círculos que dejan estela
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(draw);
}

window.addEventListener('resize', init);
init();
draw();