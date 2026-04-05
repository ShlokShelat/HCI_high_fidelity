import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';

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
  { id: 0, label: 'PILOT ID', icon: '👤' },
  { id: 1, label: 'DESTINATION', icon: '🚪' },
  { id: 2, label: 'TIME', icon: '⏰' },
  { id: 3, label: 'DURATION', icon: '💡' },
  { id: 4, label: 'RETURN', icon: '🔐' },
  { id: 5, label: 'LAUNCH', icon: '🚀' },
];

// Noise texture overlay for premium feel
function NoiseOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9997, opacity: 0.03 }}>
      <svg width="100%" height="100%">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}

// Ambient orbs that slowly drift
function AmbientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {[
        { size: 600, x: '-20%', y: '-20%', color: 'rgba(0,144,208,0.04)', dur: 20 },
        { size: 400, x: '70%', y: '60%', color: 'rgba(189,0,255,0.03)', dur: 25 },
        { size: 500, x: '40%', y: '-10%', color: 'rgba(0,200,255,0.03)', dur: 18 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size, height: orb.size,
            left: orb.x, top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
          }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// Screen transition wipe overlay
function TransitionWipe({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 9000, background: 'rgba(0,200,255,0.05)', backdropFilter: 'blur(2px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '',
    lat: null, lng: null, location: '',
    day: 15, month: 6, year: 2112, termsAccepted: false,
    hours: 24, days: 0, totalHours: 24, energyCost: 0,
    returnLocation: "Nobita's Desk Drawer",
  });

  // Hide native cursor
  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => { document.body.style.cursor = ''; };
  }, []);

  const navigate = (toStep) => {
    if (transitioning) return;
    setTransitioning(true);
    setDirection(toStep > currentStep ? 1 : -1);
    setTimeout(() => {
      setCurrentStep(toStep);
      setTransitioning(false);
    }, 50);
  };

  const goNext = () => navigate(Math.min(currentStep + 1, STEPS.length - 1));
  const goBack = () => navigate(Math.max(currentStep - 1, 0));
  const reset = () => {
    navigate(0);
    setFormData({
      name: '', email: '',
      lat: null, lng: null, location: '',
      day: 15, month: 6, year: 2112, termsAccepted: false,
      hours: 24, days: 0, totalHours: 24, energyCost: 0,
      returnLocation: "Nobita's Desk Drawer",
    });
  };

  const screens = [
    <PilotIDScreen key="pilot" onNext={goNext} formData={formData} setFormData={setFormData} />,
    <AnywhereDoorScreen key="door" onNext={goNext} onBack={goBack} formData={formData} setFormData={setFormData} />,
    <TimeClothScreen key="time" onNext={goNext} onBack={goBack} formData={formData} setFormData={setFormData} />,
    <DurationScreen key="duration" onNext={goNext} onBack={goBack} formData={formData} setFormData={setFormData} />,
    <ReturnProtocolScreen key="return" onNext={goNext} onBack={goBack} formData={formData} setFormData={setFormData} />,
    <SummaryScreen key="summary" formData={formData} onReset={reset} />,
  ];

  return (
    <>
      {/* Loading screen */}
      <LoadingScreen onComplete={() => setLoaded(true)} />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Noise texture */}
      <NoiseOverlay />

      {/* Main app */}
      <motion.div
        className="fixed inset-0 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 30% 20%, #001a3d 0%, #000814 50%, #000000 100%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <StarField count={160} />
        <AmbientOrbs />

        {/* Grid */}
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(rgba(0,144,208,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,144,208,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          zIndex: 1,
        }} />

        <TransitionWipe active={transitioning} />

        <div className="fixed inset-0 flex flex-col" style={{ zIndex: 10 }}>

          {/* ── TOP NAV ── */}
          <motion.header
            className="flex items-center justify-between px-6 py-3 flex-shrink-0"
            style={{
              background: 'rgba(0,8,30,0.7)',
              borderBottom: '1px solid rgba(0,200,255,0.1)',
              backdropFilter: 'blur(24px)',
            }}
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: loaded ? 0 : -80, opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: 38, height: 38,
                  background: 'radial-gradient(circle, rgba(0,144,208,0.5), rgba(0,12,40,0.9))',
                  border: '1px solid rgba(0,200,255,0.4)',
                  boxShadow: '0 0 20px rgba(0,200,255,0.2)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <span style={{ fontSize: '18px' }}>⏱️</span>
              </motion.div>
              <div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 800, color: '#00C8FF', letterSpacing: '0.1em' }}>
                  DORAEMON CORP.
                </div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '7px', color: 'rgba(0,200,255,0.35)', letterSpacing: '0.25em' }}>
                  TEMPORAL NAVIGATION SYSTEM
                </div>
              </div>
            </motion.div>

            {/* Step breadcrumbs */}
            <div className="flex items-center gap-1">
              {STEPS.map((step, i) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    data-cursor={i < currentStep ? 'GO BACK' : ''}
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 30, height: 30, fontSize: '13px',
                      background: i < currentStep ? 'rgba(57,255,20,0.15)' : i === currentStep ? 'rgba(0,144,208,0.25)' : 'rgba(0,18,51,0.5)',
                      border: `1px solid ${i < currentStep ? 'rgba(57,255,20,0.6)' : i === currentStep ? 'rgba(0,200,255,0.7)' : 'rgba(0,200,255,0.15)'}`,
                      boxShadow: i === currentStep ? '0 0 14px rgba(0,200,255,0.5)' : 'none',
                      cursor: i < currentStep ? 'none' : 'none',
                      transition: 'all 0.4s',
                    }}
                    whileHover={i < currentStep ? { scale: 1.15 } : {}}
                    whileTap={i < currentStep ? { scale: 0.9 } : {}}
                    onClick={() => { if (i < currentStep) { setDirection(-1); setCurrentStep(i); } }}
                    animate={i === currentStep ? {
                      boxShadow: ['0 0 10px rgba(0,200,255,0.4)', '0 0 20px rgba(0,200,255,0.8)', '0 0 10px rgba(0,200,255,0.4)'],
                    } : {}}
                    transition={i === currentStep ? { duration: 2, repeat: Infinity } : { duration: 0.4 }}
                  >
                    {i < currentStep
                      ? <span style={{ fontSize: '11px', color: '#39FF14' }}>✓</span>
                      : step.icon}
                  </motion.div>
                  {i < STEPS.length - 1 && (
                    <motion.div
                      style={{ width: 16, height: 1, margin: '0 2px' }}
                      animate={{ background: i < currentStep ? 'rgba(57,255,20,0.5)' : 'rgba(0,200,255,0.12)' }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Status pill */}
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.2)' }}
              animate={{ borderColor: ['rgba(57,255,20,0.2)', 'rgba(57,255,20,0.6)', 'rgba(57,255,20,0.2)'] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <motion.div
                className="rounded-full"
                style={{ width: 6, height: 6, background: '#39FF14' }}
                animate={{ boxShadow: ['0 0 4px #39FF14', '0 0 10px #39FF14', '0 0 4px #39FF14'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '8px', color: '#39FF14', letterSpacing: '0.1em' }}>
                ONLINE
              </span>
            </motion.div>
          </motion.header>

          {/* ── SCREEN CONTENT ── */}
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={{
                  initial: (dir) => ({
                    opacity: 0,
                    x: dir > 0 ? 100 : -100,
                    filter: 'blur(10px)',
                    scale: 0.97,
                  }),
                  animate: {
                    opacity: 1,
                    x: 0,
                    filter: 'blur(0px)',
                    scale: 1,
                  },
                  exit: (dir) => ({
                    opacity: 0,
                    x: dir > 0 ? -100 : 100,
                    filter: 'blur(10px)',
                    scale: 0.97,
                  }),
                }}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 overflow-y-auto"
              >
                {screens[currentStep]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── BOTTOM BAR ── */}
          <motion.footer
            className="flex items-center justify-between px-6 py-2 flex-shrink-0"
            style={{
              background: 'rgba(0,8,30,0.5)',
              borderTop: '1px solid rgba(0,200,255,0.07)',
              backdropFilter: 'blur(16px)',
            }}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: loaded ? 0 : 60, opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '8px', color: 'rgba(0,200,255,0.2)', letterSpacing: '0.2em' }}>
              © 2112 DORAEMON CORP. ALL TIMELINES RESERVED
            </span>

            {/* Progress dots */}
            <div className="flex gap-2 items-center">
              {STEPS.map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{ cursor: 'none' }}
                  animate={{
                    width: i === currentStep ? 24 : 8,
                    height: 8,
                    background: i < currentStep ? '#39FF14' : i === currentStep ? '#00C8FF' : 'rgba(0,200,255,0.15)',
                    boxShadow: i === currentStep ? '0 0 10px rgba(0,200,255,0.8)' : 'none',
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </div>

            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '8px', color: 'rgba(0,200,255,0.25)', letterSpacing: '0.15em' }}>
              {STEPS[currentStep].icon} {STEPS[currentStep].label}
            </span>
          </motion.footer>
        </div>
      </motion.div>

      {/* Toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(0,8,30,0.95)',
            border: '1px solid rgba(0,200,255,0.25)',
            color: '#F0F8FF',
            fontFamily: 'Space Grotesk, sans-serif',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            cursor: 'none',
          },
        }}
        richColors
        gap={8}
      />
    </>
  );
}
