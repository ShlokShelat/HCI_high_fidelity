import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

// Split text into words or characters and animate each one up
export function RevealWords({ text, className = '', style = {}, delay = 0, stagger = 0.05, once = true }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-10% 0px' });
  const words = text.split(' ');

  return (
    <span ref={ref} className={className} style={{ ...style, display: 'inline-block', overflow: 'hidden' }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.25em' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', opacity: 0, rotateX: -40 }}
            animate={isInView ? { y: '0%', opacity: 1, rotateX: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// Character-by-character reveal
export function RevealChars({ text, className = '', style = {}, delay = 0, stagger = 0.03 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });
  const chars = text.split('');

  return (
    <span ref={ref} className={className} style={{ ...style, display: 'inline-block' }}>
      {chars.map((char, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden' }}>
          <motion.span
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// Fade-slide in from below
export function RevealFade({ children, className = '', style = {}, delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });

  const initial = {
    up: { y: 40, opacity: 0 },
    down: { y: -40, opacity: 0 },
    left: { x: -40, opacity: 0 },
    right: { x: 40, opacity: 0 },
  }[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={initial}
      animate={isInView ? { y: 0, x: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
