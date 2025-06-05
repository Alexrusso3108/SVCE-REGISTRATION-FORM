document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('constellation-canvas');
    if (!canvas) {
        console.error('Constellation canvas not found');
        return;
    }
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = []; // Reset particles on resize
        initParticles();
    });

    let particles = [];
    const particleCount = 100;
    const maxDistance = 120; // Max distance to draw a line

    // Particle colors - bright and vibrant
    const particleColors = ['#87CEFA', '#ADD8E6', '#E0FFFF', '#AFEEEE']; // Light Sky Blue, Light Blue, Light Cyan, Pale Turquoise
    const lineColor = 'rgba(135, 206, 250, 0.3)'; // Light Sky Blue lines with opacity

    class Particle {
        constructor(x, y) {
            this.x = x || Math.random() * width;
            this.y = y || Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5; // Slower speed
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1.5; // Slightly larger stars
            this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
    }

    function initParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    // Opacity based on distance - closer lines are more opaque
                    const opacity = 1 - (distance / maxDistance);
                    ctx.strokeStyle = `rgba(135, 206, 250, ${opacity * 0.7})`; // More opaque lines
                    ctx.lineWidth = 1.2; // Thicker lines
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
});
