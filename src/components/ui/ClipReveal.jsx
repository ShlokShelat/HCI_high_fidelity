import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useInView } from 'framer-motion';

/**
 * Mask-reveal: text slides up from below an overflow:hidden clip.
 * Each word / line is individually wrapped and animated.
 * This is the exact pattern used on high-end agency sites.
 */
export function ClipWords({
  text,
  tag: Tag = 'h2',
  className = '',
  style = {},
  delay = 0,
  stagger = 0.06,
  duration = 0.9,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  const animated = useRef(false);

  useEffect(() => {
    if (!inView || animated.current) return;
    animated.current = true;
    const spans = ref.current.querySelectorAll('.clip-word-inner');
    gsap.fromTo(
      spans,
      { y: '105%', opacity: 0, rotateX: -30 },
      {
        y: '0%',
        opacity: 1,
        rotateX: 0,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
      }
    );
  }, [inView]);

  const words = text.split(' ');

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ ...style, perspective: '600px' }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.3em', verticalAlign: 'bottom' }}
        >
          <span
            className="clip-word-inner"
            style={{ display: 'inline-block', transform: 'translateY(105%)' }}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * Clip-path reveal for a whole block element.
 * Grows from bottom to reveal content like a curtain lifting.
 */
export function ClipBlock({
  children,
  className = '',
  style = {},
  delay = 0,
  duration = 1.0,
  direction = 'up', // 'up' | 'left' | 'right'
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  const animated = useRef(false);

  const clipMap = {
    up: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
    left: ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'],
    right: ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'],
  };

  useEffect(() => {
    if (!inView || animated.current) return;
    animated.current = true;
    const [from, to] = clipMap[direction] || clipMap.up;
    gsap.fromTo(
      ref.current,
      { clipPath: from, opacity: 0.3 },
      { clipPath: to, opacity: 1, duration, delay, ease: 'power3.inOut' }
    );
  }, [inView]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, clipPath: 'inset(100% 0% 0% 0%)' }}
    >
      {children}
    </div>
  );
}

/**
 * Line-by-line reveal: each child line animates in sequence.
 */
export function ClipLines({ lines, className = '', lineStyle = {}, delay = 0, stagger = 0.12 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  const animated = useRef(false);

  useEffect(() => {
    if (!inView || animated.current) return;
    animated.current = true;
    const els = ref.current.querySelectorAll('.clip-line-inner');
    gsap.fromTo(
      els,
      { y: '110%' },
      { y: '0%', duration: 0.85, delay, stagger, ease: 'power3.out' }
    );
  }, [inView]);

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <div key={i} style={{ overflow: 'hidden', ...lineStyle }}>
          <div className="clip-line-inner" style={{ transform: 'translateY(110%)' }}>
            {line}
          </div>
        </div>
      ))}
    </div>
  );
}
