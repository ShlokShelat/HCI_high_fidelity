import { motion } from 'framer-motion';

export default function HologramFrame({ children, className = '', title, subtitle }) {
  return (
    <div className={`relative ${className}`}>
      {/* Corner decorations */}
      {[
        'top-0 left-0 border-t-2 border-l-2',
        'top-0 right-0 border-t-2 border-r-2',
        'bottom-0 left-0 border-b-2 border-l-2',
        'bottom-0 right-0 border-b-2 border-r-2',
      ].map((pos, i) => (
        <motion.div
          key={i}
          className={`absolute ${pos} w-6 h-6 border-cyan-400`}
          style={{ borderColor: 'rgba(0, 200, 255, 0.8)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
        />
      ))}

      {/* Scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.8), transparent)',
          zIndex: 10,
        }}
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Title bar */}
      {title && (
        <div className="absolute -top-4 left-4 right-4 flex items-center gap-3" style={{ zIndex: 20 }}>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.6))' }} />
          <span className="text-xs px-3 py-1 rounded"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              color: '#00C8FF',
              background: 'rgba(0, 12, 40, 0.9)',
              border: '1px solid rgba(0, 200, 255, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
            {title}
          </span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(0, 200, 255, 0.6), transparent)' }} />
        </div>
      )}

      {children}
    </div>
  );
}
