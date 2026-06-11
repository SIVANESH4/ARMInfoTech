import React, { useEffect, useRef } from 'react';

export default function LandingPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Eased mouse target mechanics
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    
    // Spring physics configuration for spine tracking
    const numPoints = 22; 
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      points.push({ x: width / 2, y: height / 2, vx: 0, vy: 0 });
    }

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Dampened easing tracking variables
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      points[0].x = mouse.x;
      points[0].y = mouse.y;

      // Update structural ribbon tension values loop
      for (let i = 1; i < numPoints; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const targetX = p1.x - dx * 0.25; 
        const targetY = p1.y - dy * 0.25;

        p2.vx += (targetX - p2.x) * 0.08;
        p2.vy += (targetY - p2.y) * 0.08;
        p2.vx *= 0.72;
        p2.vy *= 0.72;

        p2.x += p2.vx;
        p2.y += p2.vy;
      }

      if (numPoints > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < numPoints - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 140;

        // Dynamic fluid asset lighting matrix anchors
        const gradient = ctx.createRadialGradient(points[3].x, points[3].y, 10, points[3].x, points[3].y, 400);
        gradient.addColorStop(0, 'rgba(249, 115, 22, 0.25)');  
        gradient.addColorStop(0.4, 'rgba(236, 72, 153, 0.15)'); 
        gradient.addColorStop(0.8, 'rgba(37, 99, 235, 0.05)');  
        gradient.addColorStop(1, 'transparent');

        ctx.strokeStyle = gradient;
        ctx.shadowBlur = 40;
        ctx.shadowColor = 'rgba(249, 115, 22, 0.3)';
        ctx.stroke();

        // High gloss inner spec specular pass mapping
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < numPoints - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineWidth = 30;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.shadowBlur = 0;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full pointer-events-none mix-blend-screen" 
      />
    </div>
  );
}