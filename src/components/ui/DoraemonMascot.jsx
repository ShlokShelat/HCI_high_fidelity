import { motion } from 'framer-motion';

export default function DoraemonMascot({ size = 120, mood = 'happy', className = '' }) {
  const moods = {
    happy: { eyes: '😊', mouth: 'M 35 75 Q 60 90 85 75', cheekColor: '#FF9999', bellColor: '#FF4444' },
    warning: { eyes: '😯', mouth: 'M 40 78 Q 60 85 80 78', cheekColor: '#FF9999', bellColor: '#FFA500' },
    error: { eyes: '😱', mouth: 'M 35 80 Q 60 65 85 80', cheekColor: '#FF6666', bellColor: '#FF0000' },
    thinking: { eyes: '🤔', mouth: 'M 40 75 Q 60 80 80 75', cheekColor: '#FF9999', bellColor: '#0090D0' },
  };

  const m = moods[mood] || moods.happy;

  return (
    <motion.div
      className={`relative select-none ${className}`}
      style={{ width: size, height: size }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 120 120" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        {/* Doraemon glow */}
        <defs>
          <radialGradient id="bodyGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#00C8FF" />
            <stop offset="100%" stopColor="#0070A0" />
          </radialGradient>
          <radialGradient id="faceGrad" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F0F0F0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="bodyGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Body shadow */}
        <ellipse cx="60" cy="112" rx="32" ry="6" fill="rgba(0,0,0,0.3)" />

        {/* Body */}
        <circle cx="60" cy="70" r="40" fill="url(#bodyGrad)" filter="url(#bodyGlow)" />

        {/* White belly */}
        <ellipse cx="60" cy="80" rx="24" ry="22" fill="white" opacity="0.95" />

        {/* Belly button pocket */}
        <ellipse cx="60" cy="82" rx="18" ry="14" fill="none" stroke="#0090D0" strokeWidth="1.5" opacity="0.6" />
        <ellipse cx="60" cy="76" rx="10" ry="3" fill="none" stroke="#0090D0" strokeWidth="1" opacity="0.4" />

        {/* Head */}
        <circle cx="60" cy="42" r="32" fill="url(#bodyGrad)" filter="url(#bodyGlow)" />

        {/* Face white area */}
        <circle cx="60" cy="46" r="24" fill="url(#faceGrad)" />

        {/* Eyes */}
        <circle cx="49" cy="38" r="8" fill="white" />
        <circle cx="71" cy="38" r="8" fill="white" />
        <circle cx="51" cy="38" r="5" fill="#1a1a2e" />
        <circle cx="73" cy="38" r="5" fill="#1a1a2e" />
        {/* Eye shine */}
        <circle cx="53" cy="36" r="2" fill="white" />
        <circle cx="75" cy="36" r="2" fill="white" />

        {/* Nose */}
        <circle cx="60" cy="48" r="5" fill="#E63946" filter="url(#glow)" />
        <circle cx="59" cy="47" r="1.5" fill="rgba(255,255,255,0.5)" />

        {/* Mouth */}
        <path d="M 40 56 Q 60 70 80 56" fill="none" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />

        {/* Whiskers */}
        <line x1="20" y1="50" x2="43" y2="54" stroke="#1a1a2e" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <line x1="20" y1="56" x2="43" y2="57" stroke="#1a1a2e" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <line x1="20" y1="62" x2="43" y2="60" stroke="#1a1a2e" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <line x1="100" y1="50" x2="77" y2="54" stroke="#1a1a2e" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <line x1="100" y1="56" x2="77" y2="57" stroke="#1a1a2e" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <line x1="100" y1="62" x2="77" y2="60" stroke="#1a1a2e" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

        {/* Cheeks */}
        <circle cx="38" cy="54" r="7" fill={m.cheekColor} opacity="0.5" />
        <circle cx="82" cy="54" r="7" fill={m.cheekColor} opacity="0.5" />

        {/* Bell/collar */}
        <path d="M 35 70 Q 60 65 85 70" fill="none" stroke="#FF4444" strokeWidth="6" strokeLinecap="round" />
        <circle cx="60" cy="70" r="5" fill={m.bellColor} stroke="#CC2222" strokeWidth="1" />
        <circle cx="59" cy="69" r="1.5" fill="rgba(255,255,255,0.6)" />

        {/* Arms */}
        <ellipse cx="25" cy="80" rx="10" ry="7" fill="#00A0D8" transform="rotate(-20, 25, 80)" />
        <ellipse cx="95" cy="80" rx="10" ry="7" fill="#00A0D8" transform="rotate(20, 95, 80)" />

        {/* Legs */}
        <ellipse cx="48" cy="108" rx="14" ry="8" fill="#00A0D8" />
        <ellipse cx="72" cy="108" rx="14" ry="8" fill="#00A0D8" />
        <ellipse cx="48" cy="111" rx="16" ry="6" fill="white" />
        <ellipse cx="72" cy="111" rx="16" ry="6" fill="white" />

        {/* Tail */}
        <path d="M 95 75 Q 115 65 112 52 Q 109 42 118 38" fill="none" stroke="#FF4444" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}
