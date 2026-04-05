import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('counting'); // 'counting' | 'reveal' | 'done'

  useEffect(() => {
    let start = null;
    const duration = 2200;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(step);
      } else {
        setTimeout(() => setPhase('reveal'), 200);
        setTimeout(() => {
          setPhase('done');
          onComplete?.();
        }, 1400);
      }
    };
    requestAnimationFrame(step);
  }, []);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{
            zIndex: 99998,
            background: '#000814',
            cursor: 'none',
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Curtain wipe out */}
          <AnimatePresence>
            {phase === 'reveal' && (
              <motion.div
                className="absolute inset-0"
                style={{ background: '#000814', zIndex: 2, transformOrigin: 'top' }}
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              />
            )}
          </AnimatePresence>

          {/* Center content */}
          <div className="relative flex flex-col items-center gap-8" style={{ zIndex: 3 }}>
            {/* Doraemon logo ring */}
            <div className="relative">
              <motion.div
                className="rounded-full"
                style={{
                  width: 100, height: 100,
                  border: '1px solid rgba(0,200,255,0.2)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute inset-2 rounded-full"
                  style={{ border: '1px solid rgba(0,200,255,0.15)' }}
                />
                {/* Orbiting dot */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: 8, height: 8,
                    background: '#00FFFF',
                    boxShadow: '0 0 12px #00FFFF',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{
                    x: [46, 0, -46, 0, 46],
                    y: [0, 46, 0, -46, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  style={{ fontSize: '36px' }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⏱️
                </motion.span>
              </div>
            </div>

            {/* Brand */}
            <div className="text-center">
              <motion.div
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.4em',
                  color: 'rgba(0,200,255,0.4)',
                  marginBottom: '8px',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                DORAEMON CORP.
              </motion.div>
              <motion.div
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '22px',
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  background: 'linear-gradient(90deg, #00C8FF, #00FFFF, #00C8FF)',
                  backgroundSize: '200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'hologram-shimmer 3s linear infinite',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                TIME MACHINE
              </motion.div>
            </div>

            {/* Progress bar */}
            <div className="flex flex-col items-center gap-3" style={{ width: 280 }}>
              <div className="w-full rounded-full overflow-hidden" style={{
                height: 2, background: 'rgba(0,200,255,0.1)',
              }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #0090D0, #00FFFF)',
                    boxShadow: '0 0 10px rgba(0,255,255,0.8)',
                    width: `${progress}%`,
                  }}
                  transition={{ ease: 'linear' }}
                />
              </div>
              <div className="flex justify-between w-full">
                <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: 'rgba(0,200,255,0.4)', letterSpacing: '0.2em' }}>
                  INITIALIZING TEMPORAL CORE
                </span>
                <motion.span
                  style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: '#00C8FF', letterSpacing: '0.1em' }}
                  key={progress}
                >
                  {progress}%
                </motion.span>
              </div>
            </div>

            {/* Status messages */}
            <motion.div
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: 'rgba(0,200,255,0.35)', letterSpacing: '0.05em' }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {progress < 30 ? '◎ Calibrating flux capacitors...' :
               progress < 60 ? '◎ Loading temporal maps...' :
               progress < 85 ? '◎ Synchronizing timeline arrays...' :
               '◎ Engaging Doraemon protocols...'}
            </motion.div>
          </div>

          {/* Corner decorations */}
          {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos}`}
              style={{
                width: 40, height: 40,
                borderTop: i < 2 ? '1px solid rgba(0,200,255,0.3)' : 'none',
                borderBottom: i >= 2 ? '1px solid rgba(0,200,255,0.3)' : 'none',
                borderLeft: i % 2 === 0 ? '1px solid rgba(0,200,255,0.3)' : 'none',
                borderRight: i % 2 === 1 ? '1px solid rgba(0,200,255,0.3)' : 'none',
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
