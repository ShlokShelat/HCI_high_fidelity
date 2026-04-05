import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

/**
 * Attaches Lenis smooth-scroll to a specific DOM element.
 * Pass `containerRef` pointing to the scrollable wrapper.
 * Returns the lenis instance so callers can call lenis.scrollTo() etc.
 */
export function useLenis(containerRef, options = {}) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;

    const lenis = new Lenis({
      wrapper: el,
      content: el,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      infinite: false,
      ...options,
    });

    lenisRef.current = lenis;

    let raf;
    function animate(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [containerRef]);

  return lenisRef;
}
