import { useEffect, useRef, Children, cloneElement } from 'react';
import { gsap } from 'gsap';
import { useInView } from 'framer-motion';
import { motion } from 'framer-motion';

/**
 * Wraps children and animates them in staggered sequence on scroll.
 * Each direct child gets its own entrance with a delay offset.
 *
 * Usage:
 *   <ScrollReveal stagger={0.1} direction="up">
 *     <div>Item 1</div>
 *     <div>Item 2</div>
 *   </ScrollReveal>
 */
export function ScrollReveal({
  children,
  stagger = 0.08,
  delay = 0,
  duration = 0.8,
  direction = 'up', // 'up' | 'left' | 'right' | 'scale'
  className = '',
  style = {},
  once = true,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-8% 0px' });
  const animated = useRef(false);

  const fromMap = {
    up:    { y: 50, opacity: 0, scale: 1 },
    left:  { x: -50, opacity: 0, scale: 1 },
    right: { x: 50, opacity: 0, scale: 1 },
    scale: { y: 20, opacity: 0, scale: 0.93 },
  };

  const toMap = {
    up:    { y: 0, opacity: 1, scale: 1 },
    left:  { x: 0, opacity: 1, scale: 1 },
    right: { x: 0, opacity: 1, scale: 1 },
    scale: { y: 0, opacity: 1, scale: 1 },
  };

  useEffect(() => {
    if (!inView || animated.current) return;
    animated.current = true;
    const items = ref.current.children;
    gsap.fromTo(
      items,
      fromMap[direction] || fromMap.up,
      {
        ...(toMap[direction] || toMap.up),
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        clearProps: 'all',
      }
    );
  }, [inView]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

/**
 * Single element reveal with simple fade+slide.
 */
export function FadeReveal({
  children,
  delay = 0,
  direction = 'up',
  distance = 40,
  duration = 0.8,
  className = '',
  style = {},
}) {
  const initial = {
    up:    { opacity: 0, y: distance },
    down:  { opacity: 0, y: -distance },
    left:  { opacity: 0, x: -distance },
    right: { opacity: 0, x: distance },
    scale: { opacity: 0, scale: 0.92, y: 20 },
  }[direction] || { opacity: 0, y: distance };

  const animate = direction === 'scale'
    ? { opacity: 1, scale: 1, y: 0 }
    : { opacity: 1, y: 0, x: 0 };

  return (
    <motion.div
      className={className}
      style={style}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated number counter — counts up from 0 to value on scroll entry.
 */
export function CountUp({ value, suffix = '', prefix = '', className = '', style = {}, duration = 1.5, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const animated = useRef(false);

  useEffect(() => {
    if (!inView || animated.current) return;
    animated.current = true;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration,
      delay,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix;
        }
      },
    });
  }, [inView]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}0{suffix}
    </span>
  );
}
