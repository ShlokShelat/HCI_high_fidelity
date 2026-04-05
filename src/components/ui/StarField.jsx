import { useMemo } from 'react';

export default function StarField({ count = 120 }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 2,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: star.size > 2 ? 'rgba(0, 200, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
            boxShadow: star.size > 2 ? `0 0 ${star.size * 3}px rgba(0, 200, 255, 0.8)` : 'none',
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Nebula clouds */}
      <div className="absolute" style={{
        width: '600px', height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 144, 208, 0.04) 0%, transparent 70%)',
        top: '-200px', right: '-100px',
        filter: 'blur(40px)',
      }} />
      <div className="absolute" style={{
        width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(189, 0, 255, 0.03) 0%, transparent 70%)',
        bottom: '-100px', left: '-100px',
        filter: 'blur(40px)',
      }} />
    </div>
  );
}
