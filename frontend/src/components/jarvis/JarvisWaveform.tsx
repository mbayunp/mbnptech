import React, { useEffect, useRef } from 'react';

interface JarvisWaveformProps {
  status: 'idle' | 'listening' | 'thinking' | 'speaking';
}

export const JarvisWaveform: React.FC<JarvisWaveformProps> = ({ status }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    // Handle high-DPI screens
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Render loop
    const draw = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      ctx.clearRect(0, 0, width, height);

      phase += 0.05; // Base speed

      // Wave configurations based on status
      let waveCount = 3;
      let amplitude = 12;
      let frequency = 0.03;
      let speedFactor = 1;
      let colors = ['rgba(6, 182, 212, 0.15)', 'rgba(37, 99, 235, 0.25)', 'rgba(139, 92, 246, 0.4)']; // Cyan, Blue, Violet

      if (status === 'idle') {
        waveCount = 2;
        amplitude = 6;
        frequency = 0.015;
        speedFactor = 0.5;
        colors = ['rgba(6, 182, 212, 0.1)', 'rgba(6, 182, 212, 0.2)'];
      } else if (status === 'listening') {
        waveCount = 4;
        amplitude = 18;
        frequency = 0.04;
        speedFactor = 1.8;
        // Cyan and Pink/Rose hues for listening state
        colors = [
          'rgba(244, 63, 94, 0.1)',
          'rgba(6, 182, 212, 0.25)',
          'rgba(244, 63, 94, 0.35)',
          'rgba(6, 182, 212, 0.5)'
        ];
      } else if (status === 'thinking') {
        waveCount = 3;
        amplitude = 8;
        frequency = 0.1; // Highly condensed waves
        speedFactor = 2.5; // High speed
        colors = ['rgba(139, 92, 246, 0.15)', 'rgba(99, 102, 241, 0.3)', 'rgba(139, 92, 246, 0.5)'];
      } else if (status === 'speaking') {
        waveCount = 4;
        amplitude = 28; // Large dynamic waves
        frequency = 0.025;
        speedFactor = 1.3;
        colors = [
          'rgba(6, 182, 212, 0.15)',
          'rgba(139, 92, 246, 0.25)',
          'rgba(6, 182, 212, 0.4)',
          'rgba(139, 92, 246, 0.6)'
        ];
      }

      ctx.save();
      // Enable glowing filters on highest layers
      ctx.shadowBlur = status === 'listening' ? 12 : status === 'speaking' ? 20 : 8;
      ctx.shadowColor = status === 'listening' ? '#F43F5E' : status === 'thinking' ? '#8B5CF6' : '#06B6D4';

      // Draw waves
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        
        // Offset phases to make waves separate
        const wavePhase = phase * speedFactor + w * (Math.PI / 2);
        ctx.strokeStyle = colors[w] || colors[0];
        // Line weight thicker for active states
        ctx.lineWidth = w === waveCount - 1 ? 2.5 : 1.2;

        for (let x = 0; x < width; x++) {
          // Centering vertical height
          const centerY = height / 2;
          
          // Sinusoidal math: y = sin(x * freq + phase) * amp
          // Add window envelope to clamp amplitude at edges (fades out at left/right boundaries)
          const envelope = Math.sin((x / width) * Math.PI);
          
          let y = centerY;
          if (status === 'thinking') {
            // Scanner pulse effect
            y += Math.sin(x * frequency + wavePhase) * amplitude * envelope;
            // Add a secondary rapid ripple
            y += Math.cos(x * 0.2 - wavePhase * 1.5) * 2 * envelope;
          } else {
            y += Math.sin(x * frequency + wavePhase) * amplitude * envelope;
            // Add harmonics
            y += Math.sin(x * (frequency * 2) - wavePhase * 0.8) * (amplitude * 0.3) * envelope;
          }

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      ctx.restore();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [status]);

  return (
    <div className="w-full h-36 flex items-center justify-center relative bg-slate-950/20 rounded-3xl border border-white/[0.02]">
      {/* Decorative scanning line */}
      {status === 'thinking' && (
        <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent animate-pulse" />
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-pointer"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default JarvisWaveform;
