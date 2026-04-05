import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import DoraemonMascot from '../ui/DoraemonMascot';
import HologramFrame from '../ui/HologramFrame';
import MagneticButton from '../ui/MagneticButton';
import { RevealWords, RevealFade } from '../ui/TextReveal';

export default function PilotIDScreen({ onNext, formData, setFormData }) {
  const [cardInserted, setCardInserted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [mode, setMode] = useState('pilot'); // 'pilot' | 'guest'
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);
  const emailRef = useRef(null);

  const handleCardInsert = () => {
    if (!cardInserted) {
      setCardInserted(true);
      setScanning(true);
      toast.loading('🔍 Scanning Pilot Card...', { id: 'scan', duration: 1800 });
      setTimeout(() => {
        setScanning(false);
        toast.success('✅ Pilot Card Authenticated!', { id: 'scan' });
        if (nameRef.current) nameRef.current.value = 'NOBITA NOBI';
        if (emailRef.current) emailRef.current.value = 'nobita@doraemon.future';
        setFormData(prev => ({ ...prev, name: 'NOBITA NOBI', email: 'nobita@doraemon.future' }));
      }, 1800);
    } else {
      setCardInserted(false);
      if (nameRef.current) nameRef.current.value = '';
      if (emailRef.current) emailRef.current.value = '';
      setFormData(prev => ({ ...prev, name: '', email: '' }));
      toast.info('Card ejected', { icon: '💳' });
    }
  };

  const handleNext = () => {
    const name = formData.name?.trim();
    const email = formData.email?.trim();
    const newErrors = {};
    if (!name) newErrors.name = 'Pilot name required';
    if (!email || !email.includes('@')) newErrors.email = 'Valid email required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.warning('⚠️ Missing Pilot Credentials!', {
        description: 'Please fill all fields to proceed',
        style: { border: '1px solid rgba(255, 193, 7, 0.5)', background: 'rgba(0, 12, 40, 0.95)' },
      });
      return;
    }
    setErrors({});
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative" style={{ padding: '20px' }}>

      {/* Header */}
      <div className="text-center mb-6">
        <RevealFade delay={0.1}>
          <div className="text-xs mb-1" style={{
            fontFamily: 'Orbitron, sans-serif',
            color: 'rgba(0, 200, 255, 0.6)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}>
            DORAEMON CORP. ⊕ TEMPORAL DIVISION
          </div>
        </RevealFade>
        <div style={{ overflow: 'hidden' }}>
          <motion.h1
            className="hologram-text"
            style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2.2rem', fontWeight: '900', letterSpacing: '0.05em', lineHeight: 1.1 }}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            TIME MACHINE
          </motion.h1>
        </div>
        <RevealFade delay={0.5}>
          <div className="text-xs mt-1" style={{ color: 'rgba(0, 200, 255, 0.5)', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.2em' }}>
            v22.02.2112 — PILOT AUTHENTICATION
          </div>
        </RevealFade>
      </div>

      <div className="w-full max-w-2xl flex gap-5 items-start">

        {/* Doraemon + Card slot panel */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '200px', flexShrink: 0 }}
        >
          <DoraemonMascot size={130} mood={scanning ? 'thinking' : cardInserted ? 'happy' : 'thinking'} />

          {/* Speech bubble */}
          <AnimatePresence mode="wait">
            <motion.div
              key={cardInserted ? 'auth' : 'welcome'}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative px-4 py-2 rounded-xl text-center"
              style={{
                background: 'rgba(0, 144, 208, 0.15)',
                border: '1px solid rgba(0, 200, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                maxWidth: '180px',
              }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                style={{ background: 'rgba(0, 144, 208, 0.15)', border: '1px solid rgba(0, 200, 255, 0.4)', borderBottom: 'none', borderRight: 'none' }} />
              <p className="text-xs" style={{ color: '#00C8FF', fontFamily: 'Space Grotesk, sans-serif' }}>
                {scanning ? '🔍 Scanning your pilot credentials...' :
                  cardInserted ? '✅ Welcome back, Time Pilot!' :
                    "🚀 Insert your Pilot Card or enter your details!"}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Card slot */}
          <motion.div
            className="relative cursor-pointer rounded-xl overflow-hidden"
            style={{
              width: '160px',
              height: '60px',
              background: cardInserted ? 'rgba(57, 255, 20, 0.1)' : 'rgba(0, 12, 40, 0.8)',
              border: `2px solid ${cardInserted ? 'rgba(57, 255, 20, 0.7)' : 'rgba(0, 200, 255, 0.4)'}`,
              boxShadow: cardInserted ? '0 0 20px rgba(57, 255, 20, 0.3)' : '0 0 10px rgba(0, 200, 255, 0.1)',
              transition: 'all 0.3s',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCardInsert}
          >
            {/* Card slot label */}
            <div className="absolute top-1 left-0 right-0 text-center" style={{
              fontSize: '8px',
              fontFamily: 'Orbitron, sans-serif',
              color: 'rgba(0, 200, 255, 0.5)',
              letterSpacing: '0.2em',
            }}>
              {cardInserted ? '● CARD INSERTED' : '◌ INSERT PILOT CARD'}
            </div>

            {/* Slot opening */}
            <div className="absolute bottom-3 left-4 right-4 rounded"
              style={{
                height: '8px',
                background: cardInserted ? 'rgba(57, 255, 20, 0.3)' : 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(0, 200, 255, 0.3)',
              }}
            />

            {/* Card peek */}
            <AnimatePresence>
              {cardInserted && (
                <motion.div
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-sm"
                  style={{ width: '50px', height: '8px', background: 'linear-gradient(90deg, #FFD700, #FFA500)', borderRadius: '2px' }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                />
              )}
            </AnimatePresence>

            {/* Scan beam */}
            <AnimatePresence>
              {scanning && (
                <motion.div
                  className="absolute left-0 right-0 h-0.5"
                  style={{ background: 'rgba(57, 255, 20, 0.8)', boxShadow: '0 0 8px rgba(57, 255, 20, 0.9)' }}
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* System status */}
          <div className="flex gap-2 items-center">
            {[
              { label: 'SYS', ok: true },
              { label: 'NET', ok: true },
              { label: 'TIME', ok: true },
            ].map(({ label, ok }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <div className="rounded-full" style={{
                  width: '8px', height: '8px',
                  background: ok ? '#39FF14' : '#E63946',
                  boxShadow: ok ? '0 0 6px rgba(57, 255, 20, 0.8)' : '0 0 6px rgba(230, 57, 70, 0.8)',
                }} />
                <span style={{ fontSize: '7px', color: 'rgba(0, 200, 255, 0.5)', fontFamily: 'Orbitron, sans-serif' }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main form panel */}
        <motion.div
          className="flex-1"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <HologramFrame title="Pilot Credentials">
            <div className="rounded-2xl p-6" style={{
              background: 'rgba(0, 12, 40, 0.7)',
              border: '1px solid rgba(0, 200, 255, 0.2)',
              backdropFilter: 'blur(20px)',
            }}>

              {/* Mode toggle */}
              <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: 'rgba(0, 18, 51, 0.6)' }}>
                {['pilot', 'guest'].map(m => (
                  <motion.button
                    key={m}
                    className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold capitalize transition-all"
                    style={{
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      background: mode === m ? 'rgba(0, 144, 208, 0.4)' : 'transparent',
                      color: mode === m ? '#00C8FF' : 'rgba(0, 200, 255, 0.4)',
                      border: mode === m ? '1px solid rgba(0, 200, 255, 0.6)' : '1px solid transparent',
                      boxShadow: mode === m ? '0 0 15px rgba(0, 200, 255, 0.3)' : 'none',
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setMode(m);
                      if (m === 'guest') {
                        setFormData(prev => ({ ...prev, name: 'GUEST TRAVELER', email: 'guest@temporal.net' }));
                        if (nameRef.current) nameRef.current.value = 'GUEST TRAVELER';
                        if (emailRef.current) emailRef.current.value = 'guest@temporal.net';
                        toast.info('Guest mode — limited features active', { icon: '👤' });
                      } else {
                        setFormData(prev => ({ ...prev, name: '', email: '' }));
                        if (nameRef.current) nameRef.current.value = '';
                        if (emailRef.current) emailRef.current.value = '';
                      }
                    }}
                  >
                    {m === 'pilot' ? '🎖️ PILOT MODE' : '👤 GUEST MODE'}
                  </motion.button>
                ))}
              </div>

              {/* Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs mb-1.5" style={{
                    fontFamily: 'Orbitron, sans-serif',
                    color: 'rgba(0, 200, 255, 0.7)',
                    letterSpacing: '0.15em',
                  }}>
                    PILOT DESIGNATION
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      ref={nameRef}
                      defaultValue={formData.name || ''}
                      placeholder="e.g. NOBITA NOBI"
                      onChange={e => {
                        setFormData(prev => ({ ...prev, name: e.target.value }));
                        if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                      }}
                      style={{ paddingLeft: '40px' }}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ fontSize: '16px' }}>👤</span>
                  </div>
                  {errors.name && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                      className="text-xs mt-1" style={{ color: '#E63946' }}>
                      ⚠ {errors.name}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-xs mb-1.5" style={{
                    fontFamily: 'Orbitron, sans-serif',
                    color: 'rgba(0, 200, 255, 0.7)',
                    letterSpacing: '0.15em',
                  }}>
                    QUANTUM COMM-LINK (EMAIL)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      ref={emailRef}
                      defaultValue={formData.email || ''}
                      placeholder="pilot@temporal.net"
                      onChange={e => {
                        setFormData(prev => ({ ...prev, email: e.target.value }));
                        if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                      }}
                      style={{ paddingLeft: '40px' }}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ fontSize: '16px' }}>📡</span>
                  </div>
                  {errors.email && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                      className="text-xs mt-1" style={{ color: '#E63946' }}>
                      ⚠ {errors.email}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Info strip */}
              <div className="mt-5 p-3 rounded-lg flex items-center gap-3" style={{
                background: 'rgba(0, 144, 208, 0.08)',
                border: '1px solid rgba(0, 200, 255, 0.15)',
              }}>
                <span style={{ fontSize: '20px' }}>ℹ️</span>
                <p className="text-xs" style={{ color: 'rgba(0, 200, 255, 0.6)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'rgba(0, 200, 255, 0.9)' }}>TEMPORAL WAIVER:</strong> By proceeding, you acknowledge that paradoxes, butterfly effects, and accidental dinosaur encounters are your own responsibility.
                </p>
              </div>

              {/* Proceed button */}
              <MagneticButton
                className="w-full mt-5 py-4 rounded-xl font-bold relative overflow-hidden"
                data-cursor="ENGAGE"
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '14px',
                  letterSpacing: '0.2em',
                  background: 'linear-gradient(135deg, rgba(0,90,142,0.8), rgba(0,144,208,0.8))',
                  border: '1px solid rgba(0,200,255,0.6)',
                  color: '#00FFFF',
                  boxShadow: '0 0 30px rgba(0,200,255,0.3)',
                  cursor: 'none',
                }}
                onClick={handleNext}
              >
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                ▶ INITIATE TIME JUMP
              </MagneticButton>
            </div>
          </HologramFrame>
        </motion.div>
      </div>

      {/* Energy rings at bottom */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="h-px w-20" style={{ background: 'linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.4))' }} />
        <span className="text-xs" style={{ color: 'rgba(0, 200, 255, 0.4)', fontFamily: 'Orbitron, sans-serif', fontSize: '9px', letterSpacing: '0.2em' }}>
          TEMPORAL SAFETY PROTOCOL ACTIVE
        </span>
        <div className="h-px w-20" style={{ background: 'linear-gradient(90deg, rgba(0, 200, 255, 0.4), transparent)' }} />
      </motion.div>
    </div>
  );
}
