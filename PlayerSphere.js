class PlayerSphere {
    constructor(canvasId, size = 80) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas with id "${canvasId}" not found`);
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.size = size;
        this.canvas.width = size * 2.5;
        this.canvas.height = size * 2.5;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = size * 0.375; // 75% of half size
        
        this.animationFrame = null;
        this.shouldAnimate = false;
        
        // Preload wing image
        this.wingImage = new Image();
        this.wingImage.src = 'media/darkwing.png';
        this.wingImageLoaded = false;
        this.wingImage.onload = () => {
            this.wingImageLoaded = true;
            if (this.shouldAnimate) {
                this.draw(this.cosmetics);
            }
        };
    }
    
    /**
     * Draw the sphere with given cosmetics
     * @param {Object} cosmetics - { color, hat, face, effect }
     */
    draw(cosmetics = {}) {
        const { color = 'default', hat = 'none', face = 'none', effect = 'none' } = cosmetics;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw effects first (behind sphere) - including wings
        if (effect === 'blackhole' || effect === 'wings') {
            this.drawEffect(effect);
        }
        
        // Draw main sphere with gradient
        this.drawSphere(color);
        
        // Draw face
        this.drawFace(face);
        
        // Draw hat (on top of sphere)
        this.drawHat(hat);
        
        // Draw glitch effect (in front)
        if (effect === 'glitch') {
            this.drawEffect(effect);
        }
    }
    
    drawSphere(color) {
        const gradient = this.ctx.createRadialGradient(
            this.centerX - this.radius * 0.33,
            this.centerY - this.radius * 0.33,
            this.radius * 0.16,
            this.centerX,
            this.centerY,
            this.radius
        );
        
        switch(color) {
            case 'sunset':
                gradient.addColorStop(0, '#ff6b6b');
                gradient.addColorStop(1, '#ff9a3c');
                break;
            case 'ocean':
                gradient.addColorStop(0, '#4cc9f0');
                gradient.addColorStop(1, '#0077b6');
                break;
            case 'galaxy':
                gradient.addColorStop(0, '#c77dff');
                gradient.addColorStop(1, '#3c096c');
                break;
            default:
                gradient.addColorStop(0, '#888');
                gradient.addColorStop(1, '#333');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawFace(face) {
        const eyeSize = this.radius * 0.1;
        const eyeY = this.centerY - this.radius * 0.26;
        const eyeOffsetX = this.radius * 0.33;
        const mouthRadius = this.radius * 0.5;
        
        if (face === 'happy') {
            // Eyes
            this.ctx.fillStyle = '#000';
            this.ctx.beginPath();
            this.ctx.arc(this.centerX - eyeOffsetX, eyeY, eyeSize, 0, Math.PI * 2);
            this.ctx.arc(this.centerX + eyeOffsetX, eyeY, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Smile
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, mouthRadius, 0, Math.PI);
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = this.radius * 0.066;
            this.ctx.stroke();
            
        } else if (face === 'evil') {
            // Eyes
            this.ctx.fillStyle = '#f00';
            this.ctx.beginPath();
            this.ctx.arc(this.centerX - eyeOffsetX, eyeY, eyeSize, 0, Math.PI * 2);
            this.ctx.arc(this.centerX + eyeOffsetX, eyeY, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Frown
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY + this.radius * 0.33, mouthRadius, Math.PI, 0);
            this.ctx.strokeStyle = '#f00';
            this.ctx.lineWidth = this.radius * 0.066;
            this.ctx.stroke();
            
        } else if (face === 'cool') {
            // Sunglasses
            this.ctx.fillStyle = '#000';
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = this.radius * 0.04;
            
            // Left lens
            this.ctx.beginPath();
            this.ctx.arc(this.centerX - eyeOffsetX, eyeY, eyeSize * 1.5, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            
            // Right lens
            this.ctx.beginPath();
            this.ctx.arc(this.centerX + eyeOffsetX, eyeY, eyeSize * 1.5, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            
            // Bridge
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = this.radius * 0.06;
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX - eyeOffsetX + eyeSize * 1.5, eyeY);
            this.ctx.lineTo(this.centerX + eyeOffsetX - eyeSize * 1.5, eyeY);
            this.ctx.stroke();
            
            // Smirk
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = this.radius * 0.05;
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX - this.radius * 0.3, this.centerY + this.radius * 0.2);
            this.ctx.quadraticCurveTo(
                this.centerX, this.centerY + this.radius * 0.35,
                this.centerX + this.radius * 0.2, this.centerY + this.radius * 0.25
            );
            this.ctx.stroke();
        }
    }
    
    drawHat(hat) {
        const scale = this.radius / 30;
        
        if (hat === 'crown') {
            this.ctx.fillStyle = '#ffd700';
            this.ctx.beginPath();
            
            const points = [
                [this.centerX - this.radius * 0.66, this.centerY - this.radius * 0.83],
                [this.centerX - this.radius * 0.5, this.centerY - this.radius * 1.06],
                [this.centerX - this.radius * 0.25, this.centerY - this.radius * 0.93],
                [this.centerX - this.radius * 0.033, this.centerY - this.radius * 1.13],
                [this.centerX, this.centerY - this.radius * 0.93],
                [this.centerX + this.radius * 0.17, this.centerY - this.radius * 1.06],
                [this.centerX + this.radius * 0.33, this.centerY - this.radius * 0.93],
                [this.centerX + this.radius * 0.5, this.centerY - this.radius * 1.06],
                [this.centerX + this.radius * 0.66, this.centerY - this.radius * 0.83]
            ];
            
            this.ctx.moveTo(points[0][0], points[0][1]);
            points.forEach(p => this.ctx.lineTo(p[0], p[1]));
            this.ctx.closePath();
            this.ctx.fill();
            
            // Add jewels
            this.ctx.fillStyle = '#ff0000';
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY - this.radius * 0.96, this.radius * 0.1, 0, Math.PI * 2);
            this.ctx.fill();
            
        } else if (hat === 'tophat') {
            // Top hat with white outline to stand out
            this.ctx.fillStyle = '#000';
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = this.radius * 0.06;
            
            // Top part
            this.ctx.fillRect(
                this.centerX - this.radius * 0.5,
                this.centerY - this.radius * 1.16,
                this.radius,
                this.radius * 0.26
            );
            this.ctx.strokeRect(
                this.centerX - this.radius * 0.5,
                this.centerY - this.radius * 1.16,
                this.radius,
                this.radius * 0.26
            );
            
            // Brim
            this.ctx.fillRect(
                this.centerX - this.radius * 0.66,
                this.centerY - this.radius * 0.9,
                this.radius * 1.33,
                this.radius * 0.16
            );
            this.ctx.strokeRect(
                this.centerX - this.radius * 0.66,
                this.centerY - this.radius * 0.9,
                this.radius * 1.33,
                this.radius * 0.16
            );
            
        } else if (hat === 'wizard') {
            // Wizard hat with stars
            this.ctx.fillStyle = '#6b46c1';
            this.ctx.strokeStyle = '#a855f7';
            this.ctx.lineWidth = this.radius * 0.05;
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY - this.radius * 1.16);
            this.ctx.lineTo(this.centerX - this.radius * 0.5, this.centerY - this.radius * 0.83);
            this.ctx.lineTo(this.centerX + this.radius * 0.5, this.centerY - this.radius * 0.83);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
            
            // Add moon/star
            this.ctx.fillStyle = '#ffd700';
            this.ctx.font = `${this.radius * 0.4}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText('★', this.centerX, this.centerY - this.radius * 0.93);
            
        } else if (hat === 'halo') {
            // Halo ON TOP of sphere (behind in 3D space)
            const haloY = this.centerY - this.radius * 1.3; // Higher up
            const haloRadiusOuter = this.radius * 0.5;
            const haloRadiusInner = this.radius * 0.35;
            
            // Outer glow
            const gradient = this.ctx.createRadialGradient(
                this.centerX, haloY,
                haloRadiusInner,
                this.centerX, haloY,
                haloRadiusOuter
            );
            gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, haloY, haloRadiusOuter, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Inner bright ring
            this.ctx.strokeStyle = '#ffd700';
            this.ctx.lineWidth = this.radius * 0.12;
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, haloY, haloRadiusInner, 0, Math.PI * 2);
            this.ctx.stroke();
            
        } else if (hat === 'santa') {
            // Santa hat - higher position
            this.ctx.fillStyle = '#dc143c';
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY - this.radius * 1.5); // Higher tip
            this.ctx.lineTo(this.centerX - this.radius * 0.5, this.centerY - this.radius * 0.9); // Higher base
            this.ctx.lineTo(this.centerX + this.radius * 0.4, this.centerY - this.radius * 0.9);
            this.ctx.closePath();
            this.ctx.fill();
            
            // White trim
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(this.centerX - this.radius * 0.5, this.centerY - this.radius * 0.95, this.radius * 0.9, this.radius * 0.15);
            
            // Pom pom
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY - this.radius * 1.5, this.radius * 0.15, 0, Math.PI * 2);
            this.ctx.fill();
            
        } else if (hat === 'party') {
            // Party hat - higher position
            const gradient = this.ctx.createLinearGradient(
                this.centerX - this.radius * 0.4,
                this.centerY - this.radius * 1.6, // Higher
                this.centerX + this.radius * 0.4,
                this.centerY - this.radius * 0.9
            );
            gradient.addColorStop(0, '#ff0080');
            gradient.addColorStop(0.5, '#00ff80');
            gradient.addColorStop(1, '#0080ff');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY - this.radius * 1.6); // Higher tip
            this.ctx.lineTo(this.centerX - this.radius * 0.45, this.centerY - this.radius * 0.9); // Higher base
            this.ctx.lineTo(this.centerX + this.radius * 0.45, this.centerY - this.radius * 0.9);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Pom pom
            this.ctx.fillStyle = '#ffff00';
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY - this.radius * 1.6, this.radius * 0.12, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawEffect(effect) {
        if (effect === 'blackhole') {
            const time = Date.now() / 1000;
            const orbitRadius = this.radius * 1.8; // Increased from 1.5
            const holeRadius = this.radius * 0.3; // Slightly bigger
            
            for (let i = 0; i < 3; i++) {
                const angle = time + (i * Math.PI * 2 / 3);
                const x = this.centerX + Math.cos(angle) * orbitRadius;
                const y = this.centerY + Math.sin(angle) * orbitRadius;
                
                const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, holeRadius);
                gradient.addColorStop(0, '#000');
                gradient.addColorStop(0.6, '#1a0033');
                gradient.addColorStop(1, 'transparent');
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(x, y, holeRadius, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
        } else if (effect === 'wings') {
            // Use image if loaded, otherwise fallback
            if (this.wingImageLoaded) {
            const wingWidth = this.radius * 2.4;
            const wingHeight = this.radius * 3.0;
            const time = Date.now() / 1000;
            const flapOffset = Math.sin(time * 3) * 0.15;
            
            // LEFT wing — image already points LEFT
            this.ctx.save();
            this.ctx.translate(this.centerX - this.radius * 0.7, this.centerY);
            this.ctx.rotate(-flapOffset);
            this.ctx.drawImage(
                this.wingImage,
                -wingWidth,          // anchor at the body
                -wingHeight / 2,
                wingWidth,
                wingHeight
            );
            this.ctx.restore();
            
            // RIGHT wing — flip the LEFT-pointing image
            this.ctx.save();
            this.ctx.translate(this.centerX + this.radius * 0.7, this.centerY);
            this.ctx.rotate(flapOffset);
            this.ctx.scale(-1, 1); // horizontal flip
            this.ctx.drawImage(
                this.wingImage,
                -wingWidth,          // still draw from -width after flip
                -wingHeight / 2,
                wingWidth,
                wingHeight
            );
            this.ctx.restore();

            } 
          
        } else if (effect === 'glitch') {
            const time = Date.now();
            
            // Random glitch effect every 100ms
            if (time % 200 < 50) {
                const glitchOffsetX = (Math.random() - 0.5) * this.radius * 0.4;
                const glitchOffsetY = (Math.random() - 0.5) * this.radius * 0.4;
                
                // Red channel
                this.ctx.globalCompositeOperation = 'screen';
                this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                this.ctx.fillRect(
                    glitchOffsetX,
                    glitchOffsetY,
                    this.canvas.width,
                    this.canvas.height
                );
                
                // Blue channel
                this.ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
                this.ctx.fillRect(
                    -glitchOffsetX,
                    -glitchOffsetY,
                    this.canvas.width,
                    this.canvas.height
                );
                
                this.ctx.globalCompositeOperation = 'source-over';
                
                // Scanlines
                for (let i = 0; i < this.canvas.height; i += 4) {
                    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
                    this.ctx.fillRect(0, i, this.canvas.width, 2);
                }
            }
        }
    }
    
    drawWing(x, y, direction, flapOffset) {
        const wingWidth = this.radius * 1.2;
        const wingHeight = this.radius * 1.5;
        
        // Save context
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(direction * flapOffset);
        
        // Wing shadow/fill
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.moveTo(0, -wingHeight * 0.3);
        this.ctx.bezierCurveTo(
            direction * wingWidth * 0.5, -wingHeight * 0.5,
            direction * wingWidth, -wingHeight * 0.3,
            direction * wingWidth * 0.8, 0
        );
        this.ctx.bezierCurveTo(
            direction * wingWidth, wingHeight * 0.3,
            direction * wingWidth * 0.5, wingHeight * 0.5,
            0, wingHeight * 0.3
        );
        this.ctx.closePath();
        this.ctx.fill();
        
        // Wing outline
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = this.radius * 0.08;
        this.ctx.stroke();
        
        // Inner wing details
        this.ctx.strokeStyle = '#888';
        this.ctx.lineWidth = this.radius * 0.04;
        for (let i = 1; i <= 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, -wingHeight * 0.3 * (i / 3));
            this.ctx.bezierCurveTo(
                direction * wingWidth * 0.3 * i / 3, -wingHeight * 0.4 * (i / 3),
                direction * wingWidth * 0.6 * i / 3, -wingHeight * 0.2 * (i / 3),
                direction * wingWidth * 0.7 * i / 3, 0
            );
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    /**
     * Start animation loop (for effects like black hole)
     * @param {Object} cosmetics - Cosmetics to render
     */
    startAnimation(cosmetics) {
        this.shouldAnimate = true;
        this.cosmetics = cosmetics;
        
        const animate = () => {
            if (!this.shouldAnimate) return;
            
            this.draw(this.cosmetics);
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Stop animation loop
     */
    stopAnimation() {
        this.shouldAnimate = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    /**
     * Update cosmetics and redraw
     * @param {Object} cosmetics - New cosmetics to apply
     */
    updateCosmetics(cosmetics) {
        this.cosmetics = cosmetics;
        this.draw(cosmetics);
    }
    
    /**
     * Cleanup resources
     */
    destroy() {
        this.stopAnimation();
        if (this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlayerSphere;
}
