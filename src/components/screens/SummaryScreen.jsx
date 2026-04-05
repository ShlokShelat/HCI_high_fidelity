import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import DoraemonMascot from '../ui/DoraemonMascot';
import { ScrollReveal, FadeReveal } from '../ui/ScrollReveal';
import { ClipWords } from '../ui/ClipReveal';
import MagneticButton from '../ui/MagneticButton';
import HoverCard, { FillButton } from '../ui/HoverCard';
import { useLenis } from '../../hooks/useLenis';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export default function SummaryScreen({ formData, onReset }) {
  const [celebrating, setCelebrating] = useState(false);
  const scrollRef = useRef(null);
  useLenis(scrollRef);

  const handleConfirm = () => {
    setCelebrating(true);
    toast.success('🎉 TIME TRAVEL COMPLETE!', {
      description: `Welcome to ${formData.location || 'your destination'}!`,
      duration: 5000,
      style: { border: '1px solid rgba(57, 255, 20, 0.6)', background: 'rgba(0, 12, 40, 0.95)' },
    });
    setTimeout(() => {
      toast.info('📜 Mission log saved to Temporal Archive', { duration: 3000 });
    }, 2000);
  };

  const details = [
    { label: 'PILOT', value: formData.name || '—', emoji: '👤' },
    { label: 'COMM-LINK', value: formData.email || '—', emoji: '📡' },
    { label: 'DESTINATION', value: formData.location || '—', emoji: '📍' },
    {
      label: 'TARGET DATE',
      value: formData.year ? `${formData.day} ${MONTHS[(formData.month || 1) - 1]} ${formData.year < 0 ? `${Math.abs(formData.year)} BCE` : formData.year}` : '—',
      emoji: '📅'
    },
    {
      label: 'STAY DURATION',
      value: formData.totalHours ? `${formData.days}d ${formData.hours}h (${formData.totalHours}h total)` : '—',
      emoji: '⏱️'
    },
    { label: 'ENERGY COST', value: formData.energyCost ? `${formData.energyCost} TU` : '—', emoji: '⚡' },
    { label: 'RETURN POINT', value: formData.returnLocation || '—', emoji: '🏠' },
  ];

  return (
    <div ref={scrollRef} className="flex flex-col items-center w-full h-full overflow-y-auto" style={{ padding: '20px', scrollbarWidth: 'none' }}>

      {/* Celebration particles */}
      {celebrating && Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed rounded-full pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            background: ['#00FFFF', '#FFD700', '#39FF14', '#FF6B9D'][Math.floor(Math.random() * 4)],
            zIndex: 100,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [`${(Math.random() - 0.5) * 100}px`],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [1, 0],
          }}
          transition={{ duration: Math.random() * 2 + 1, delay: Math.random() * 1.5 }}
        />
      ))}

      <FadeReveal delay={0.1} direction="scale">
        <div className="text-center mb-6">
          <motion.div
            animate={celebrating ? { scale:[1,1.2,1], rotate:[0,-10,10,0] } : {}}
            transition={{ duration:0.5 }}
          >
            <DoraemonMascot size={100} mood="happy" />
          </motion.div>
          <ClipWords
            text={celebrating ? '🎉 JUMP SUCCESSFUL!' : 'MISSION BRIEFING'}
            tag="h1"
            delay={0.2}
            stagger={0.07}
            className="hologram-text mt-3"
            style={{ fontFamily:'Orbitron,sans-serif', fontSize:'1.8rem', fontWeight:900 }}
          />
          <p style={{ color:'rgba(0,200,255,0.5)', fontFamily:'Space Grotesk,sans-serif', fontSize:14, marginTop:4 }}>
            {celebrating ? 'All systems nominal. Safe travels, Pilot!' : 'Review your temporal journey parameters'}
          </p>
        </div>
      </FadeReveal>

      {/* Details grid */}
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl overflow-hidden" style={{
          border: '1px solid rgba(0, 200, 255, 0.2)',
          background: 'rgba(0, 12, 40, 0.7)',
          backdropFilter: 'blur(20px)',
        }}>
          {details.map((item, i) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-4 px-6 py-4"
              style={{
                borderBottom: i < details.length - 1 ? '1px solid rgba(0, 200, 255, 0.1)' : 'none',
              }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.07 }}
            >
              <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.emoji}</span>
              <div className="flex-1 flex items-center justify-between">
                <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: 'rgba(0, 200, 255, 0.5)', letterSpacing: '0.15em' }}>
                  {item.label}
                </span>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: '#F0F8FF', textAlign: 'right', maxWidth: '280px' }}>
                  {item.value}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Warning about paradox */}
        <motion.div
          className="mt-4 p-4 rounded-xl flex gap-3"
          style={{ background: 'rgba(255, 215, 0, 0.08)', border: '1px solid rgba(255, 215, 0, 0.2)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span style={{ fontSize: '24px', flexShrink: 0 }}>⚠️</span>
          <div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#FFD700', letterSpacing: '0.15em', marginBottom: '4px' }}>
              TEMPORAL SAFETY REMINDER
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255, 215, 0, 0.7)', lineHeight: 1.6 }}>
              Do NOT interact with your past self. Do NOT prevent historical events.
              Do NOT bring future technology to the past. Doraemon Corp is not liable for paradoxes,
              alternate timelines, or accidental dinosaur encounters.
            </p>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-5">
          <motion.button
            className="flex-1 py-3 rounded-xl"
            style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: '12px', letterSpacing: '0.1em',
              background: 'rgba(0, 12, 40, 0.7)', border: '1px solid rgba(0, 200, 255, 0.3)',
              color: 'rgba(0, 200, 255, 0.7)', cursor: 'pointer',
            }}
            whileHover={{ background: 'rgba(0, 12, 40, 0.9)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onReset}
          >
            🔄 NEW MISSION
          </motion.button>
          <motion.button
            className="flex-1 py-3 rounded-xl font-bold relative overflow-hidden"
            style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: '14px', letterSpacing: '0.15em',
              background: celebrating
                ? 'linear-gradient(135deg, rgba(57,255,20,0.3), rgba(0,200,100,0.3))'
                : 'linear-gradient(135deg, rgba(0,90,142,0.9), rgba(0,144,208,0.9))',
              border: celebrating ? '1px solid rgba(57,255,20,0.8)' : '1px solid rgba(0,200,255,0.8)',
              color: celebrating ? '#39FF14' : '#00FFFF',
              boxShadow: celebrating ? '0 0 40px rgba(57,255,20,0.5)' : '0 0 30px rgba(0,200,255,0.3)',
              cursor: 'pointer',
            }}
            whileHover={!celebrating ? { boxShadow: '0 0 60px rgba(0,200,255,0.6)' } : {}}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
          >
            {!celebrating && (
              <motion.div className="absolute inset-0 opacity-30"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            )}
            {celebrating ? '✅ MISSION LOGGED' : '🚀 CONFIRM & LAUNCH'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
