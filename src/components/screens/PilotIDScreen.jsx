import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { gsap } from 'gsap';
import DoraemonMascot from '../ui/DoraemonMascot';
import MagneticButton from '../ui/MagneticButton';
import { ClipWords, ClipLines } from '../ui/ClipReveal';
import { FadeReveal, ScrollReveal } from '../ui/ScrollReveal';
import { FillButton } from '../ui/HoverCard';
import { useLenis } from '../../hooks/useLenis';

export default function PilotIDScreen({ onNext, formData, setFormData }) {
  const [cardInserted, setCardInserted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [mode, setMode] = useState('pilot');
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const scrollRef = useRef(null);
  const heroRef = useRef(null);

  useLenis(scrollRef);

  // Parallax on hero text based on scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onScroll = () => {
      if (heroRef.current) {
        const y = container.scrollTop;
        gsap.set(heroRef.current, { y: y * 0.3, opacity: 1 - y / 400 });
      }
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

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
        style: { border: '1px solid rgba(255,193,7,0.5)' },
      });
      return;
    }
    setErrors({});
    onNext();
  };

  return (
    <div
      ref={scrollRef}
      className="w-full h-full overflow-y-auto"
      style={{ scrollbarWidth: 'none' }}
    >
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>

      {/* ── HERO SECTION ── full-viewport, parallax on scroll */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center text-center"
        style={{ minHeight: '75vh', padding: '40px 24px 60px', position: 'relative' }}
      >
        {/* Background gradient shift */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 60%, rgba(0,144,208,0.12) 0%, transparent 65%)',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Mid parallax layer: floating rings */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[120, 220, 340].map((size, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: size, height: size,
                border: `1px solid rgba(0,200,255,${0.04 + i * 0.02})`,
                top: '50%', left: '50%',
                marginTop: -size / 2, marginLeft: -size / 2,
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.03, 1] }}
              transition={{ duration: 20 + i * 8, repeat: Infinity, ease: 'linear' }}
            />
          ))}
        </div>

        {/* Foreground: brand label */}
        <FadeReveal delay={0.1} direction="up">
          <div style={{
            fontFamily: 'Orbitron, sans-serif', fontSize: '10px',
            color: 'rgba(0,200,255,0.5)', letterSpacing: '0.4em',
            textTransform: 'uppercase', marginBottom: '16px',
          }}>
            DORAEMON CORP. ⊕ TEMPORAL DIVISION
          </div>
        </FadeReveal>

        {/* Hero title — clip word reveal */}
        <ClipWords
          text="TIME MACHINE"
          tag="h1"
          delay={0.2}
          stagger={0.08}
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '0.06em',
            background: 'linear-gradient(90deg, #00C8FF 0%, #00FFFF 40%, #ffffff 60%, #00C8FF 100%)',
            backgroundSize: '200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'hologram-shimmer 4s linear infinite',
            lineHeight: 1.1,
          }}
        />

        {/* Subtitle — line reveals */}
        <FadeReveal delay={0.55} direction="up">
          <p style={{
            marginTop: '12px',
            fontFamily: 'Orbitron, sans-serif', fontSize: '10px',
            color: 'rgba(0,200,255,0.4)', letterSpacing: '0.25em',
          }}>
            v22.02.2112 — PILOT AUTHENTICATION REQUIRED
          </p>
        </FadeReveal>

        {/* Doraemon mascot */}
        <FadeReveal delay={0.7} direction="scale">
          <DoraemonMascot size={110} mood={scanning ? 'thinking' : cardInserted ? 'happy' : 'thinking'} />
        </FadeReveal>

        {/* Speech bubble */}
        <FadeReveal delay={0.85}>
          <AnimatePresence mode="wait">
            <motion.div
              key={cardInserted ? 'auth' : 'welcome'}
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                marginTop: '8px',
                background: 'rgba(0,144,208,0.12)',
                border: '1px solid rgba(0,200,255,0.3)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '10px 16px',
                maxWidth: '280px',
              }}
            >
              <p style={{ fontSize: '12px', color: '#00C8FF', fontFamily: 'Space Grotesk, sans-serif' }}>
                {scanning ? '🔍 Scanning your pilot credentials...' :
                  cardInserted ? '✅ Welcome back, Time Pilot!' :
                    '🚀 Insert your Pilot Card or enter your details!'}
              </p>
            </motion.div>
          </AnimatePresence>
        </FadeReveal>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '8px', color: 'rgba(0,200,255,0.3)', letterSpacing: '0.2em' }}>
            SCROLL TO AUTHENTICATE
          </span>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(0,200,255,0.5), transparent)' }} />
        </motion.div>
      </section>

      {/* ── FORM SECTION ── scrolled into view */}
      <section style={{ padding: '20px 24px 60px', maxWidth: '740px', margin: '0 auto' }}>

        <ScrollReveal stagger={0.12} direction="up">
          {/* System status bar */}
          <div
            className="flex gap-4 items-center p-3 rounded-xl mb-6"
            style={{ background: 'rgba(0,12,40,0.6)', border: '1px solid rgba(0,200,255,0.12)' }}
          >
            {[
              { label: 'CORE SYS', ok: true }, { label: 'TEMPORAL NET', ok: true },
              { label: 'PARADOX SHIELD', ok: true }, { label: 'FLUX CAP.', ok: true },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center gap-2">
                <motion.div
                  className="rounded-full" style={{ width: 7, height: 7, background: '#39FF14' }}
                  animate={{ boxShadow: ['0 0 4px #39FF14', '0 0 10px #39FF14', '0 0 4px #39FF14'] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() }}
                />
                <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '8px', color: 'rgba(0,200,255,0.4)', letterSpacing: '0.1em' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Card slot + Mode toggle row */}
          <div className="flex gap-4 mb-6">
            {/* Card slot */}
            <motion.div
              className="flex flex-col items-center gap-2 cursor-pointer"
              style={{ width: 150, flexShrink: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCardInsert}
              data-cursor="INSERT CARD"
            >
              <div
                className="relative rounded-xl overflow-hidden w-full"
                style={{
                  height: '80px',
                  background: cardInserted ? 'rgba(57,255,20,0.08)' : 'rgba(0,12,40,0.8)',
                  border: `2px solid ${cardInserted ? 'rgba(57,255,20,0.6)' : 'rgba(0,200,255,0.3)'}`,
                  boxShadow: cardInserted ? '0 0 20px rgba(57,255,20,0.25)' : 'none',
                  transition: 'all 0.4s',
                }}
              >
                <div className="absolute top-2 left-0 right-0 text-center" style={{
                  fontSize: '7px', fontFamily: 'Orbitron, sans-serif', color: 'rgba(0,200,255,0.5)', letterSpacing: '0.15em',
                }}>
                  {cardInserted ? '● AUTHENTICATED' : '◌ PILOT CARD'}
                </div>
                <div className="absolute bottom-4 left-4 right-4 rounded" style={{
                  height: 7,
                  background: cardInserted ? 'rgba(57,255,20,0.4)' : 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(0,200,255,0.25)',
                }} />
                <AnimatePresence>
                  {cardInserted && (
                    <motion.div
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-sm"
                      style={{ width: 44, height: 7, background: 'linear-gradient(90deg, #FFD700, #FFA500)', borderRadius: 2 }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {scanning && (
                    <motion.div
                      className="absolute left-0 right-0"
                      style={{ height: 2, background: 'rgba(57,255,20,0.9)', boxShadow: '0 0 8px #39FF14' }}
                      initial={{ top: '0%' }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 0.7, repeat: Infinity }}
                    />
                  )}
                </AnimatePresence>
              </div>
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '8px', color: 'rgba(0,200,255,0.4)', letterSpacing: '0.1em' }}>
                CLICK TO {cardInserted ? 'EJECT' : 'INSERT'}
              </span>
            </motion.div>

            {/* Mode selector */}
            <div className="flex-1 flex flex-col gap-2">
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: 'rgba(0,200,255,0.5)', letterSpacing: '0.2em', marginBottom: 2 }}>
                ACCESS MODE
              </div>
              <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'rgba(0,18,51,0.6)' }}>
                {['pilot', 'guest'].map(m => (
                  <FillButton
                    key={m}
                    className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold"
                    fillColor="rgba(0,144,208,0.3)"
                    style={{
                      fontFamily: 'Orbitron, sans-serif', fontSize: '10px', letterSpacing: '0.1em',
                      color: mode === m ? '#00C8FF' : 'rgba(0,200,255,0.35)',
                      border: mode === m ? '1px solid rgba(0,200,255,0.5)' : '1px solid transparent',
                      background: mode === m ? 'rgba(0,144,208,0.2)' : 'transparent',
                      boxShadow: mode === m ? '0 0 12px rgba(0,200,255,0.2)' : 'none',
                      transition: 'color 0.3s, border-color 0.3s',
                    }}
                    onClick={() => {
                      setMode(m);
                      if (m === 'guest') {
                        setFormData(prev => ({ ...prev, name: 'GUEST TRAVELER', email: 'guest@temporal.net' }));
                        if (nameRef.current) nameRef.current.value = 'GUEST TRAVELER';
                        if (emailRef.current) emailRef.current.value = 'guest@temporal.net';
                      } else {
                        setFormData(prev => ({ ...prev, name: '', email: '' }));
                        if (nameRef.current) nameRef.current.value = '';
                        if (emailRef.current) emailRef.current.value = '';
                      }
                    }}
                  >
                    {m === 'pilot' ? '🎖️ PILOT' : '👤 GUEST'}
                  </FillButton>
                ))}
              </div>
            </div>
          </div>

          {/* Fields */}
          <div
            className="rounded-2xl p-6"
            style={{ background: 'rgba(0,12,40,0.65)', border: '1px solid rgba(0,200,255,0.15)', backdropFilter: 'blur(20px)' }}
          >
            <div className="space-y-5">
              <div>
                <label style={{ display: 'block', fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: 'rgba(0,200,255,0.6)', letterSpacing: '0.2em', marginBottom: 6 }}>
                  PILOT DESIGNATION
                </label>
                <div className="relative">
                  <input type="text" ref={nameRef} defaultValue={formData.name || ''}
                    placeholder="e.g. NOBITA NOBI"
                    style={{ paddingLeft: 40 }}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                    }}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ fontSize: 16 }}>👤</span>
                </div>
                <AnimatePresence>
                  {errors.name && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ fontSize: 11, color: '#E63946', marginTop: 4 }}>⚠ {errors.name}</motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: 'rgba(0,200,255,0.6)', letterSpacing: '0.2em', marginBottom: 6 }}>
                  QUANTUM COMM-LINK
                </label>
                <div className="relative">
                  <input type="email" ref={emailRef} defaultValue={formData.email || ''}
                    placeholder="pilot@temporal.net"
                    style={{ paddingLeft: 40 }}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, email: e.target.value }));
                      if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                    }}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ fontSize: 16 }}>📡</span>
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ fontSize: 11, color: '#E63946', marginTop: 4 }}>⚠ {errors.email}</motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Temporal waiver */}
            <motion.div
              className="mt-5 p-3 rounded-lg flex gap-3"
              style={{ background: 'rgba(0,144,208,0.07)', border: '1px solid rgba(0,200,255,0.12)' }}
              whileHover={{ borderColor: 'rgba(0,200,255,0.3)' }}
            >
              <span style={{ fontSize: 20 }}>ℹ️</span>
              <p style={{ fontSize: 11, color: 'rgba(0,200,255,0.55)', lineHeight: 1.6 }}>
                <strong style={{ color: 'rgba(0,200,255,0.9)' }}>TEMPORAL WAIVER:</strong> By proceeding you acknowledge that paradoxes, butterfly effects, and accidental dinosaur encounters are your own responsibility.
              </p>
            </motion.div>

            {/* CTA */}
            <MagneticButton
              className="w-full mt-5 py-4 rounded-xl font-bold relative overflow-hidden"
              data-cursor="ENGAGE"
              style={{
                fontFamily: 'Orbitron, sans-serif', fontSize: '14px', letterSpacing: '0.2em',
                background: 'linear-gradient(135deg,rgba(0,90,142,0.85),rgba(0,144,208,0.85))',
                border: '1px solid rgba(0,200,255,0.6)', color: '#00FFFF',
                boxShadow: '0 0 30px rgba(0,200,255,0.25)', cursor: 'none',
              }}
              strength={0.35}
              onClick={handleNext}
            >
              <motion.div
                className="absolute inset-0 opacity-25"
                style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              />
              ▶ INITIATE TIME JUMP
            </MagneticButton>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
