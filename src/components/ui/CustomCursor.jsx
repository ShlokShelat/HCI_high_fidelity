import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [label, setLabel] = useState('');

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const dotSpring = { damping: 40, stiffness: 500, mass: 0.3 };

  const dotX = useSpring(cursorX, dotSpring);
  const dotY = useSpring(cursorY, dotSpring);
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const el = e.target.closest('button, a, [data-cursor], input, [role="button"]');
      if (el) {
        setIsHovering(true);
        setLabel(el.dataset.cursor || '');
      } else {
        setIsHovering(false);
        setLabel('');
      }
    };

    const down = () => setIsClicking(true);
    const up = () => setIsClicking(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, []);

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed pointer-events-none"
        style={{
          left: ringX,
          top: ringY,
          zIndex: 99999,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isClicking ? 28 : isHovering ? 56 : 36,
          height: isClicking ? 28 : isHovering ? 56 : 36,
          borderColor: isHovering ? 'rgba(0, 255, 255, 0.9)' : 'rgba(0, 200, 255, 0.5)',
          backgroundColor: isHovering ? 'rgba(0, 200, 255, 0.08)' : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed pointer-events-none rounded-full border-2"
        style={{
          left: ringX,
          top: ringY,
          zIndex: 99999,
          translateX: '-50%',
          translateY: '-50%',
          borderColor: 'rgba(0, 200, 255, 0.5)',
          mixBlendMode: 'difference',
        }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          left: dotX,
          top: dotY,
          zIndex: 100000,
          translateX: '-50%',
          translateY: '-50%',
          width: isClicking ? 4 : 6,
          height: isClicking ? 4 : 6,
          background: '#00FFFF',
          boxShadow: '0 0 8px #00FFFF, 0 0 16px rgba(0,255,255,0.5)',
        }}
      />

      {/* Label */}
      <AnimatePresence>
        {label && (
          <motion.div
            className="fixed pointer-events-none"
            style={{
              left: ringX,
              top: ringY,
              zIndex: 99998,
              translateX: '20px',
              translateY: '-50%',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '9px',
              color: '#00FFFF',
              letterSpacing: '0.15em',
              whiteSpace: 'nowrap',
              textShadow: '0 0 10px rgba(0,255,255,0.8)',
            }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
