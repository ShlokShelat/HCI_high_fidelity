import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { Toaster } from 'sonner';
import { gsap } from 'gsap';

import StarField from './components/ui/StarField';
import CustomCursor from './components/ui/CustomCursor';
import LoadingScreen from './components/ui/LoadingScreen';
import MagneticButton from './components/ui/MagneticButton';
import PilotIDScreen from './components/screens/PilotIDScreen';
import AnywhereDoorScreen from './components/screens/AnywhereDoorScreen';
import TimeClothScreen from './components/screens/TimeClothScreen';
import DurationScreen from './components/screens/DurationScreen';
import ReturnProtocolScreen from './components/screens/ReturnProtocolScreen';
import SummaryScreen from './components/screens/SummaryScreen';

const STEPS = [
  { id: 0, label: 'PILOT ID',    icon: '👤', color: 'rgba(0,144,208,0.15)' },
  { id: 1, label: 'DESTINATION', icon: '🚪', color: 'rgba(0,200,100,0.12)' },
  { id: 2, label: 'TIME',        icon: '⏰', color: 'rgba(189,0,255,0.10)' },
  { id: 3, label: 'DURATION',    icon: '💡', color: 'rgba(255,165,0,0.10)' },
  { id: 4, label: 'RETURN',      icon: '🔐', color: 'rgba(230,57,70,0.10)'  },
  { id: 5, label: 'LAUNCH',      icon: '🚀', color: 'rgba(57,255,20,0.10)'  },
];

// Subtle grain texture
function Grain() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9997, opacity: 0.035, mixBlendMode: 'overlay' }}>
      <svg width="100%" height="100%">
        <filter id="grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </div>
  );
}

// Ambient background that slowly shifts color per active step
function AmbientBg({ step }) {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      animate={{ background: `radial-gradient(ellipse at 30% 25%, ${STEPS[step].color} 0%, transparent 65%)` }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

// Floating, drifting orbs for depth
function Orbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {[
        { s: 700, x: '-25%', y: '-20%', c: 'rgba(0,144,208,0.04)', d: 22 },
        { s: 500, x: '65%',  y: '55%',  c: 'rgba(189,0,255,0.03)',  d: 28 },
        { s: 400, x: '35%',  y: '-5%',  c: 'rgba(0,255,200,0.03)',  d: 17 },
      ].map((o, i) => (
        <motion.div
          key={i} className="absolute rounded-full"
          style={{ width: o.s, height: o.s, left: o.x, top: o.y, filter: 'blur(70px)',
            background: `radial-gradient(circle, ${o.c} 0%, transparent 70%)` }}
          animate={{ x: [0, 25, -15, 0], y: [0, -18, 25, 0] }}
          transition={{ duration: o.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// Horizontal progress line at top (cinematic style)
function TopProgressLine({ step, total }) {
  return (
    <motion.div
      className="fixed top-0 left-0 h-0.5 z-50"
      style={{ background: 'linear-gradient(90deg, #0090D0, #00FFFF)', boxShadow: '0 0 8px rgba(0,200,255,0.8)' }}
      animate={{ width: `${((step + 1) / total) * 100}%` }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '',
    lat: null, lng: null, location: '',
    day: 15, month: 6, year: 2112, termsAccepted: false,
    hours: 24, days: 0, totalHours: 24, energyCost: 0,
    returnLocation: "Nobita's Desk Drawer",
  });

  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => { document.body.style.cursor = ''; };
  }, []);

  const go = (to) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
  };
  const goNext = () => go(Math.min(step + 1, STEPS.length - 1));
  const goBack = () => go(Math.max(step - 1, 0));
  const reset = () => {
    go(0);
    setFormData({
      name: '', email: '',
      lat: null, lng: null, location: '',
      day: 15, month: 6, year: 2112, termsAccepted: false,
      hours: 24, days: 0, totalHours: 24, energyCost: 0,
      returnLocation: "Nobita's Desk Drawer",
    });
  };

  const screens = [
    <PilotIDScreen     key="p" onNext={goNext}              formData={formData} setFormData={setFormData} />,
    <AnywhereDoorScreen key="a" onNext={goNext} onBack={goBack} formData={formData} setFormData={setFormData} />,
    <TimeClothScreen    key="t" onNext={goNext} onBack={goBack} formData={formData} setFormData={setFormData} />,
    <DurationScreen     key="d" onNext={goNext} onBack={goBack} formData={formData} setFormData={setFormData} />,
    <ReturnProtocolScreen key="r" onNext={goNext} onBack={goBack} formData={formData} setFormData={setFormData} />,
    <SummaryScreen      key="s" formData={formData} onReset={reset} />,
  ];

  return (
    <>
      <LoadingScreen onComplete={() => setLoaded(true)} />
      <CustomCursor />
      <Grain />

      <motion.div
        className="fixed inset-0"
        style={{ background: 'radial-gradient(ellipse at 30% 20%, #001a3d 0%, #000814 55%, #000 100%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Layered background */}
        <StarField />
        <Orbs />
        <AmbientBg step={step} />

        {/* Perspective grid */}
        <div className="fixed inset-0 pointer-events-none" style={{
          zIndex: 2,
          backgroundImage: `linear-gradient(rgba(0,144,208,0.022) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,144,208,0.022) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />

        {/* Top progress bar */}
        <TopProgressLine step={step} total={STEPS.length} />

        <div className="fixed inset-0 flex flex-col" style={{ zIndex: 10 }}>

          {/* ── NAVBAR ── */}
          <motion.header
            className="flex items-center justify-between px-6 py-3 flex-shrink-0"
            style={{
              background: 'rgba(0,8,30,0.65)',
              borderBottom: '1px solid rgba(0,200,255,0.09)',
              backdropFilter: 'blur(28px)',
            }}
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: loaded ? 0 : -80, opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22,1,0.36,1] }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3">
              <motion.div
                className="rounded-full flex items-center justify-center"
                style={{ width: 36, height: 36,
                  background: 'radial-gradient(circle,rgba(0,144,208,0.5),rgba(0,12,40,0.95))',
                  border: '1px solid rgba(0,200,255,0.35)',
                  boxShadow: '0 0 18px rgba(0,200,255,0.2)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <span style={{ fontSize: 17 }}>⏱️</span>
              </motion.div>
              <div>
                <div style={{ fontFamily:'Orbitron,sans-serif', fontSize:12, fontWeight:800, color:'#00C8FF', letterSpacing:'0.1em' }}>
                  DORAEMON CORP.
                </div>
                <div style={{ fontFamily:'Orbitron,sans-serif', fontSize:7, color:'rgba(0,200,255,0.3)', letterSpacing:'0.22em' }}>
                  TEMPORAL NAVIGATION SYSTEM
                </div>
              </div>
            </div>

            {/* Step breadcrumbs */}
            <div className="flex items-center gap-1">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <motion.div
                    data-cursor={i < step ? 'GO BACK' : ''}
                    className="flex items-center justify-center rounded-full"
                    title={s.label}
                    style={{
                      width: 30, height: 30, fontSize: 13,
                      background: i < step  ? 'rgba(57,255,20,0.14)'   : i === step ? 'rgba(0,144,208,0.22)' : 'rgba(0,18,51,0.5)',
                      border: `1px solid ${i < step ? 'rgba(57,255,20,0.55)' : i === step ? 'rgba(0,200,255,0.65)' : 'rgba(0,200,255,0.12)'}`,
                      transition: 'all 0.45s',
                      cursor: 'none',
                    }}
                    animate={i === step ? { boxShadow:['0 0 8px rgba(0,200,255,0.3)','0 0 18px rgba(0,200,255,0.7)','0 0 8px rgba(0,200,255,0.3)'] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    whileHover={i < step ? { scale:1.15, boxShadow:'0 0 12px rgba(57,255,20,0.6)' } : {}}
                    whileTap={i < step ? { scale:0.9 } : {}}
                    onClick={() => { if (i < step) go(i); }}
                  >
                    {i < step ? <span style={{ fontSize:11, color:'#39FF14' }}>✓</span> : s.icon}
                  </motion.div>
                  {i < STEPS.length - 1 && (
                    <motion.div style={{ width:14, height:1, margin:'0 2px' }}
                      animate={{ background: i < step ? 'rgba(57,255,20,0.45)' : 'rgba(0,200,255,0.1)' }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Status */}
            <motion.div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background:'rgba(57,255,20,0.06)', border:'1px solid rgba(57,255,20,0.18)' }}
              animate={{ borderColor:['rgba(57,255,20,0.18)','rgba(57,255,20,0.55)','rgba(57,255,20,0.18)'] }}
              transition={{ duration:2.5, repeat:Infinity }}
            >
              <motion.div className="rounded-full" style={{ width:6, height:6, background:'#39FF14' }}
                animate={{ boxShadow:['0 0 4px #39FF14','0 0 12px #39FF14','0 0 4px #39FF14'] }}
                transition={{ duration:1.5, repeat:Infinity }}
              />
              <span style={{ fontFamily:'Orbitron,sans-serif', fontSize:8, color:'#39FF14', letterSpacing:'0.1em' }}>ONLINE</span>
            </motion.div>
          </motion.header>

          {/* ── SCREEN ── */}
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={{
                  initial: (d) => ({ opacity:0, x: d>0?120:-120, filter:'blur(12px)', scale:0.96 }),
                  animate:      ({ opacity:1, x:0,             filter:'blur(0px)',  scale:1    }),
                  exit:   (d) => ({ opacity:0, x: d>0?-120:120, filter:'blur(12px)', scale:0.96 }),
                }}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
                className="absolute inset-0"
              >
                {screens[step]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── FOOTER ── */}
          <motion.footer
            className="flex items-center justify-between px-6 py-2 flex-shrink-0"
            style={{
              background:'rgba(0,8,30,0.45)',
              borderTop:'1px solid rgba(0,200,255,0.07)',
              backdropFilter:'blur(20px)',
            }}
            initial={{ y:60, opacity:0 }}
            animate={{ y: loaded?0:60, opacity: loaded?1:0 }}
            transition={{ duration:0.7, delay:0.2 }}
          >
            <span style={{ fontFamily:'Orbitron,sans-serif', fontSize:8, color:'rgba(0,200,255,0.18)', letterSpacing:'0.2em' }}>
              © 2112 DORAEMON CORP.
            </span>

            {/* Animated pill dots */}
            <div className="flex gap-1.5 items-center">
              {STEPS.map((_, i) => (
                <motion.div key={i} className="rounded-full"
                  animate={{
                    width:  i === step ? 28 : 8,
                    height: 8,
                    background: i < step ? '#39FF14' : i === step ? '#00C8FF' : 'rgba(0,200,255,0.12)',
                    boxShadow: i === step ? '0 0 10px rgba(0,200,255,0.8)' : 'none',
                  }}
                  transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}
                />
              ))}
            </div>

            <span style={{ fontFamily:'Orbitron,sans-serif', fontSize:8, color:'rgba(0,200,255,0.22)', letterSpacing:'0.15em' }}>
              {STEPS[step].icon} {STEPS[step].label}
            </span>
          </motion.footer>
        </div>
      </motion.div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background:'rgba(0,8,30,0.95)', border:'1px solid rgba(0,200,255,0.22)',
            color:'#F0F8FF', fontFamily:'Space Grotesk,sans-serif',
            backdropFilter:'blur(20px)', borderRadius:12, cursor:'none',
          },
        }}
        richColors gap={8}
      />
    </>
  );
}
