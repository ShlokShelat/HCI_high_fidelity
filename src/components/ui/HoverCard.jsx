import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Premium hover card:
 * - Tilt based on mouse position (3D perspective)
 * - Glow follows cursor inside the card
 * - Slight scale + shadow elevation
 * - Clip-path shine sweep on hover
 */
export default function HoverCard({
  children,
  className = '',
  style = {},
  glowColor = 'rgba(0, 200, 255, 0.15)',
  tiltStrength = 8,
}) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: '50%', y: '50%' });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / rect.height) * -tiltStrength;
    const ry = ((e.clientX - cx) / rect.width) * tiltStrength;
    setTilt({ x: rx, y: ry });

    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPos({ x: `${px}%`, y: `${py}%` });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        position: 'relative',
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
        cursor: 'none',
      }}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: hovered ? 1.02 : 1,
        boxShadow: hovered
          ? '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,200,255,0.15)'
          : '0 4px 20px rgba(0,0,0,0.2)',
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow spotlight that follows cursor */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          borderRadius: 'inherit',
          inset: 0,
          background: `radial-gradient(300px circle at ${glowPos.x} ${glowPos.y}, ${glowColor}, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s',
          zIndex: 1,
        }}
      />

      {/* Shine sweep on hover enter */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.04) 50%, transparent 65%)',
          zIndex: 2,
        }}
        animate={hovered ? { x: ['−100%', '200%'] } : { x: '-100%' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        {children}
      </div>
    </motion.div>
  );
}

/**
 * Button with background fill animation on hover (agency-style).
 */
export function FillButton({
  children,
  className = '',
  style = {},
  onClick,
  fillColor = 'rgba(0,200,255,0.2)',
  'data-cursor': dataCursor,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      style={{ ...style, cursor: 'none' }}
      data-cursor={dataCursor}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
    >
      {/* Fill wipe from left */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: fillColor, transformOrigin: 'left center' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Shine shimmer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </motion.button>
  );
}
