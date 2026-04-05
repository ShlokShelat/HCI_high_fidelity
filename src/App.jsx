import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';

import StarField from './components/ui/StarField';
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

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '',
    lat: null, lng: null, location: '',
    day: 15, month: 6, year: 2112, termsAccepted: false,
    hours: 24, days: 0, totalHours: 24, energyCost: 0,
    returnLocation: "Nobita's Desk Drawer",
  });

  const goNext = () => {
    setDirection(1);
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const reset = () => {
    setDirection(-1);
    setCurrentStep(0);
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
    <div className="fixed inset-0 overflow-hidden" style={{ background: 'radial-gradient(ellipse at top, #001233 0%, #000814 60%, #000000 100%)' }}>
      <StarField count={150} />

      {/* Grid lines */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 144, 208, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 144, 208, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        zIndex: 1,
      }} />

      {/* Main container */}
      <div className="fixed inset-0 flex flex-col" style={{ zIndex: 10 }}>

        {/* Top navigation bar */}
        <motion.div
          className="flex items-center justify-between px-6 py-3 flex-shrink-0"
          style={{
            background: 'rgba(0, 8, 30, 0.85)',
            borderBottom: '1px solid rgba(0, 200, 255, 0.15)',
            backdropFilter: 'blur(20px)',
          }}
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <div className="rounded-full flex items-center justify-center" style={{
                width: '36px', height: '36px',
                background: 'radial-gradient(circle, rgba(0, 144, 208, 0.5), rgba(0, 12, 40, 0.8))',
                border: '1px solid rgba(0, 200, 255, 0.5)',
                boxShadow: '0 0 15px rgba(0, 200, 255, 0.3)',
              }}>
                <span style={{ fontSize: '18px' }}>⏱️</span>
              </div>
            </motion.div>
            <div>
              <div style={{
                fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 800,
                color: '#00C8FF', textShadow: '0 0 10px rgba(0, 200, 255, 0.5)', letterSpacing: '0.1em',
              }}>DORAEMON CORP.</div>
              <div style={{
                fontFamily: 'Orbitron, sans-serif', fontSize: '8px',
                color: 'rgba(0, 200, 255, 0.4)', letterSpacing: '0.2em',
              }}>TEMPORAL NAVIGATION SYSTEM</div>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-1">
            {STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  className="flex flex-col items-center gap-0.5 cursor-pointer"
                  style={{ opacity: i > currentStep + 1 ? 0.4 : 1 }}
                  whileHover={i < currentStep ? { scale: 1.1 } : {}}
                  onClick={() => { if (i < currentStep) { setDirection(-1); setCurrentStep(i); } }}
                >
                  <div className="flex items-center justify-center rounded-full" style={{
                    width: '30px', height: '30px',
                    background: i < currentStep ? 'rgba(57, 255, 20, 0.2)' : i === currentStep ? 'rgba(0, 144, 208, 0.3)' : 'rgba(0, 18, 51, 0.6)',
                    border: `1px solid ${i < currentStep ? 'rgba(57, 255, 20, 0.7)' : i === currentStep ? 'rgba(0, 200, 255, 0.8)' : 'rgba(0, 200, 255, 0.2)'}`,
                    boxShadow: i === currentStep ? '0 0 12px rgba(0, 200, 255, 0.6)' : i < currentStep ? '0 0 8px rgba(57, 255, 20, 0.5)' : 'none',
                    transition: 'all 0.4s', fontSize: '13px',
                  }}>
                    {i < currentStep ? <span style={{ fontSize: '11px', color: '#39FF14' }}>✓</span> : <span>{step.icon}</span>}
                  </div>
                </motion.div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    width: '16px', height: '1px', margin: '0 2px',
                    background: i < currentStep ? 'rgba(57, 255, 20, 0.5)' : 'rgba(0, 200, 255, 0.15)',
                    transition: 'all 0.4s',
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-3">
            <motion.div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(57, 255, 20, 0.08)', border: '1px solid rgba(57, 255, 20, 0.3)' }}
              animate={{ borderColor: ['rgba(57,255,20,0.3)', 'rgba(57,255,20,0.7)', 'rgba(57,255,20,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="rounded-full" style={{ width: '6px', height: '6px', background: '#39FF14', boxShadow: '0 0 6px #39FF14' }} />
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '8px', color: '#39FF14', letterSpacing: '0.1em' }}>ONLINE</span>
            </motion.div>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: 'rgba(0, 200, 255, 0.3)' }}>
              {currentStep + 1}/{STEPS.length}
            </span>
          </div>
        </motion.div>

        {/* Screen content */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={{
                initial: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80, filter: 'blur(6px)', scale: 0.98 }),
                animate: { opacity: 1, x: 0, filter: 'blur(0px)', scale: 1 },
                exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80, filter: 'blur(6px)', scale: 0.98 }),
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 overflow-y-auto"
            >
              {screens[currentStep]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="flex items-center justify-center gap-4 px-6 py-2 flex-shrink-0"
          style={{
            background: 'rgba(0, 8, 30, 0.6)',
            borderTop: '1px solid rgba(0, 200, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
          initial={{ y: 40 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span style={{ fontSize: '14px' }}>{STEPS[currentStep].icon}</span>
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#00C8FF', letterSpacing: '0.2em' }}>
            {STEPS[currentStep].label}
          </span>
          <div style={{ width: '1px', height: '16px', background: 'rgba(0, 200, 255, 0.2)' }} />
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className="step-dot"
                style={{
                  background: i < currentStep ? '#39FF14' : i === currentStep ? '#00C8FF' : undefined,
                  boxShadow: i === currentStep ? '0 0 8px rgba(0,200,255,0.8)' : i < currentStep ? '0 0 6px rgba(57,255,20,0.5)' : undefined,
                  border: i < currentStep ? '1px solid #39FF14' : i === currentStep ? '1px solid #00C8FF' : undefined,
                }}
              />
            ))}
          </div>
          <div style={{ width: '1px', height: '16px', background: 'rgba(0, 200, 255, 0.2)' }} />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '8px', color: 'rgba(0, 200, 255, 0.25)', letterSpacing: '0.15em' }}>
            DORAEMON CORP © 2112
          </span>
        </motion.div>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(0, 8, 30, 0.95)',
            border: '1px solid rgba(0, 200, 255, 0.3)',
            color: '#F0F8FF',
            fontFamily: 'Space Grotesk, sans-serif',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
          },
        }}
        richColors
        expand={false}
        gap={8}
      />
    </div>
  );
}
