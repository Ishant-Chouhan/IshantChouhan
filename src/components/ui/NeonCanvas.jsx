import { useEffect, useRef } from 'react';
import { useScroll } from 'framer-motion';
import './NeonCanvas.css';

const NeonCanvas = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const { scrollY } = useScroll();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let w = window.innerWidth;
        let h = window.innerHeight;
        const isMobile = w < 768;

        // Configuration for "Living" Feel
        const config = {
            neuronCount: isMobile ? 30 : 45, // Fewer, cleaner on mobile
            starCount: isMobile ? 80 : 150,
            connectionDistance: isMobile ? 140 : 180,
            pulseSpeed: isMobile ? 5 : 4.5,
            maxPulses: 50,
            mouseRepulsion: 200,
            energyDecay: 0.96,
            refractoryPeriod: 30,
            springStrength: isMobile ? 0.008 : 0.005,
        };

        const mouse = { x: undefined, y: undefined };

        // State
        let neurons = [];
        let pulses = [];
        let stars = [];

        // --- Classes ---

        class Star {
            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 1.5 + 0.5;
                this.baseAlpha = Math.random() * 0.6 + 0.1;
                this.alpha = this.baseAlpha;
                this.twinkleSpeed = Math.random() * 0.03 + 0.005;
                this.offset = Math.random() * 100;
            }

            update() {
                this.offset += this.twinkleSpeed;
                this.alpha = this.baseAlpha + Math.sin(this.offset) * 0.15;
                if (this.alpha < 0) this.alpha = 0;
                if (this.alpha > 0.8) this.alpha = 0.8;
            }

            draw(scrollOp) {
                // Parallax Effect: Shift stars based on scroll position - slower than content
                let y = (this.y - scrollOp * 0.1) % h;
                if (y < 0) y += h;

                ctx.beginPath();
                ctx.arc(this.x, y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctx.fill();
            }
        }

        class Neuron {
            constructor(x, y) {
                this.x = x || Math.random() * w;
                this.y = y || Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                // Bigger neurons on mobile for impact
                this.baseSize = isMobile ? Math.random() * 2.5 + 2 : Math.random() * 2 + 1.5;
                this.energy = 0; // 0 to 1, represents excitation
                this.refractory = 0; // Cooldown frames
            }

            update(neighbors) {
                // 1. Basic Movement + Random Drift
                this.x += this.vx;
                this.y += this.vy;

                // Add subtle random drift to keep it alive without interaction
                this.vx += (Math.random() - 0.5) * 0.02;
                this.vy += (Math.random() - 0.5) * 0.02;

                // 2. Spring Physics (Cohesion)
                // Gently pull towards neighbors to simulate structural integrity
                neighbors.forEach(n => {
                    const dx = n.x - this.x;
                    const dy = n.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < config.connectionDistance) {
                        // Hooke's Law - very weak
                        const force = (dist - config.connectionDistance * 0.5) * config.springStrength;
                        const angle = Math.atan2(dy, dx);
                        this.vx += Math.cos(angle) * force * 0.05;
                        this.vy += Math.sin(angle) * force * 0.05;
                    }
                });

                // 3. Wall Bouncing (Soft)
                if (this.x < 0) { this.x = 0; this.vx *= -1; }
                if (this.x > w) { this.x = w; this.vx *= -1; }
                if (this.y < 0) { this.y = 0; this.vy *= -1; }
                if (this.y > h) { this.y = h; this.vy *= -1; }

                // 4. Mouse Interaction (Repulsion + Excitation)
                if (mouse.x !== undefined) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < config.mouseRepulsion) {
                        const force = (config.mouseRepulsion - dist) / config.mouseRepulsion;
                        const angle = Math.atan2(dy, dx);

                        // Push away physically
                        this.vx -= Math.cos(angle) * force * 0.5;
                        this.vy -= Math.sin(angle) * force * 0.5;

                        // Add Energy (Excitation)
                        this.energy = Math.min(this.energy + 0.05, 1);
                    }
                }

                // 5. Energy & Firing Logic
                this.energy *= config.energyDecay;
                if (this.refractory > 0) this.refractory--;

                // If highly energized and ready, FIRE!
                if (this.energy > 0.8 && this.refractory <= 0) {
                    this.fire(neighbors);
                    this.refractory = config.refractoryPeriod;
                    this.energy = 0.5; // Drop energy after firing
                }

                // Dampen velocity to prevent explosion
                this.vx *= 0.99;
                this.vy *= 0.99;
            }

            fire(neighbors) {
                // Send pulses to connected neighbors
                let firedCount = 0;
                neighbors.forEach(n => {
                    // Only fire to close neighbors
                    const dx = n.x - this.x;
                    const dy = n.y - this.y;
                    if (dx * dx + dy * dy < config.connectionDistance * config.connectionDistance) {
                        if (firedCount < 3 && pulses.length < config.maxPulses) { // Limit outgoing per fire
                            pulses.push(new Pulse(this, n));
                            firedCount++;
                        }
                    }
                });
            }

            draw() {
                // Visual representation of energy
                const currentSize = this.baseSize + (this.energy * 4); // Grow when excited
                const alpha = 0.3 + (this.energy * 0.7); // Brighter when excited

                ctx.beginPath();
                ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 243, 255, ${alpha})`;

                // Add glow if energized
                if (this.energy > 0.2) {
                    ctx.shadowBlur = this.energy * 15;
                    ctx.shadowColor = 'rgba(0, 243, 255, 0.8)';
                }

                ctx.fill();
                ctx.shadowBlur = 0; // Reset
            }
        }

        class Pulse {
            constructor(start, end) {
                this.start = start;
                this.end = end;
                this.progress = 0;
                this.dead = false;
                const dist = Math.hypot(end.x - start.x, end.y - start.y);
                this.speed = config.pulseSpeed / (dist || 1); // Avoid div by zero
            }

            update() {
                this.progress += this.speed;
                if (this.progress >= 1) {
                    this.dead = true;
                    // Transfer energy on impact!
                    this.end.energy = Math.min(this.end.energy + 0.4, 1);
                }
            }

            draw() {
                const x = this.start.x + (this.end.x - this.start.x) * this.progress;
                const y = this.start.y + (this.end.y - this.start.y) * this.progress;

                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#fff';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        // --- Logic ---

        const init = () => {
            canvas.width = w; // Use closure variable
            canvas.height = h;
            neurons = [];
            stars = [];
            for (let i = 0; i < config.neuronCount; i++) {
                neurons.push(new Neuron());
            }
            for (let i = 0; i < config.starCount; i++) {
                stars.push(new Star());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, w, h);

            const scrollOp = scrollY.get();

            // 0. Draw Background Stars
            stars.forEach(star => {
                star.update();
                star.draw(scrollOp);
            });

            // 1. Interactions & Connections
            // We need a loop to find neighbors for each neuron efficiently (O(N^2) is fine for N=45)
            // Interaction: Draw lines and calculate forces
            for (let i = 0; i < neurons.length; i++) {
                const neighbors = [];
                for (let j = 0; j < neurons.length; j++) {
                    if (i === j) continue;
                    const n1 = neurons[i];
                    const n2 = neurons[j];

                    const dx = n1.x - n2.x;
                    const dy = n1.y - n2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < config.connectionDistance * config.connectionDistance) {
                        neighbors.push(n2);

                        // Draw Connection (only do it once per pair to save draw calls)
                        if (i < j) {
                            const dist = Math.sqrt(distSq);
                            const alpha = 1 - (dist / config.connectionDistance);
                            // Line brightness based on combined energy of neurons
                            const energyFactor = (n1.energy + n2.energy);

                            ctx.strokeStyle = `rgba(0, 243, 255, ${alpha * (0.15 + energyFactor * 0.3)})`;
                            ctx.lineWidth = 1 + energyFactor; // Thicker when active
                            ctx.beginPath();
                            ctx.moveTo(n1.x, n1.y);
                            ctx.lineTo(n2.x, n2.y);
                            ctx.stroke();
                        }
                    }
                }

                // Update Neuron (Physic + Energy)
                neurons[i].update(neighbors);
            }

            // 2. Draw Neurons
            neurons.forEach(n => n.draw());

            // 3. Update & Draw Pulses
            for (let i = pulses.length - 1; i >= 0; i--) {
                const p = pulses[i];
                p.update();
                p.draw();
                if (p.dead) pulses.splice(i, 1);
            }

            // Random Spontaneous Firing (Keep the brain alive)
            if (Math.random() < 0.03) {
                const randomNeuron = neurons[Math.floor(Math.random() * neurons.length)];
                randomNeuron.energy = 1; // Spark it!
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;
            // Neurons preserved.
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        const handleMouseLeave = () => { mouse.x = undefined; mouse.y = undefined; };

        // Start
        init();
        animate();

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="neon-canvas-container"
        >
            <canvas ref={canvasRef} />
        </div>
    );
};

export default NeonCanvas;
