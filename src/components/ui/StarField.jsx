import { useMemo, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Mouse parallax star layer
function ParallaxStars({ count, speed, size, color }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 30 * speed, damping: 30 });
  const y = useSpring(mouseY, { stiffness: 30 * speed, damping: 30 });

  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: size + Math.random() * size,
      delay: Math.random() * 6,
      dur: Math.random() * 4 + 2,
    })), []
  );

  useEffect(() => {
    const handleMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set((e.clientX - cx) * speed * 0.02);
      mouseY.set((e.clientY - cy) * speed * 0.02);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [speed]);

  return (
    <motion.div className="absolute inset-0" style={{ x, y }}>
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            background: color,
            boxShadow: star.size > 2.5 ? `0 0 ${star.size * 2}px ${color}` : 'none',
            animation: `twinkle-star ${star.dur}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </motion.div>
  );
}

export default function StarField() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <style>{`
        @keyframes twinkle-star {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>

      {/* 3 parallax layers — move at different speeds to give depth */}
      <ParallaxStars count={80}  speed={0.5} size={0.8} color="rgba(255,255,255,0.8)" />
      <ParallaxStars count={40}  speed={1.2} size={1.5} color="rgba(0,200,255,0.9)" />
      <ParallaxStars count={15}  speed={2.0} size={2.5} color="rgba(0,255,255,1)" />

      {/* Nebula blobs */}
      <motion.div className="absolute" style={{
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,144,208,0.05) 0%, transparent 65%)',
        top: '-200px', right: '-150px',
        filter: 'blur(60px)',
      }}
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="absolute" style={{
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(189,0,255,0.04) 0%, transparent 65%)',
        bottom: '-100px', left: '-100px',
        filter: 'blur(50px)',
      }}
        animate={{ scale: [1, 1.15, 1], x: [0, -15, 0], y: [0, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
