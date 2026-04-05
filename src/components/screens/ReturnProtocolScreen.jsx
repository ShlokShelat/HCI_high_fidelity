import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer } from 'vaul';
import { toast } from 'sonner';

const RETURN_PRESETS = [
  { name: "Nobita's Desk Drawer", emoji: '🗃️', secure: true, description: 'Classic secure return point' },
  { name: "Doraemon's Pocket", emoji: '🔵', secure: true, description: 'Ultra-secure 22nd century storage' },
  { name: 'Time Patrol HQ', emoji: '🏢', secure: true, description: 'Official temporal authority base' },
  { name: 'Launch Point', emoji: '📍', secure: false, description: 'Return to original departure location' },
  { name: 'Custom Location', emoji: '✏️', secure: false, description: 'Specify your own return coordinates' },
];

function CoverSwitch({ isOpen, onToggle }) {
  return (
    <div className="relative" style={{ width: '100px', height: '160px' }}>
      {/* Base unit */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-2xl" style={{
        width: '80px', height: '130px',
        background: 'linear-gradient(180deg, rgba(0, 12, 40, 0.9), rgba(0, 30, 80, 0.9))',
        border: '2px solid rgba(0, 200, 255, 0.3)',
        boxShadow: '0 0 20px rgba(0, 200, 255, 0.1)',
      }}>
        {/* Button */}
        <motion.button
          className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            width: '50px', height: '50px',
            background: isOpen
              ? 'radial-gradient(circle, #E63946, #8B0000)'
              : 'radial-gradient(circle, #555, #333)',
            border: `3px solid ${isOpen ? '#E63946' : '#888'}`,
            boxShadow: isOpen
              ? '0 0 20px rgba(230, 57, 70, 0.9), 0 0 40px rgba(230, 57, 70, 0.5)'
              : 'inset 0 2px 4px rgba(0,0,0,0.5)',
            outline: 'none',
          }}
          animate={isOpen ? {
            boxShadow: [
              '0 0 20px rgba(230, 57, 70, 0.9)',
              '0 0 40px rgba(230, 57, 70, 1)',
              '0 0 20px rgba(230, 57, 70, 0.9)',
            ]
          } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          onClick={onToggle}
          whileTap={{ scale: 0.9 }}
        >
          <span style={{ fontSize: '22px' }}>{isOpen ? '🔓' : '🔒'}</span>
        </motion.button>

        {/* LED indicators */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 items-center">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="rounded-full" style={{ width: '8px', height: '8px' }}
              animate={isOpen ? {
                background: ['#E63946', '#FF0000', '#E63946'],
                boxShadow: ['0 0 6px #E63946', '0 0 12px #FF0000', '0 0 6px #E63946'],
              } : {
                background: '#39FF14',
                boxShadow: '0 0 6px #39FF14',
              }}
              transition={{ duration: 1, delay: i * 0.2, repeat: isOpen ? Infinity : 0 }}
            />
          ))}
        </div>
      </div>

      {/* Hinged safety cover */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-xl overflow-hidden cursor-pointer"
        style={{
          width: '84px', height: '90px',
          background: 'linear-gradient(180deg, rgba(255, 50, 50, 0.3), rgba(180, 0, 0, 0.5))',
          border: '2px solid rgba(230, 57, 70, 0.6)',
          transformOrigin: 'top center',
          boxShadow: isOpen ? '0 5px 20px rgba(0,0,0,0.5)' : '0 0 10px rgba(230, 57, 70, 0.2)',
        }}
        animate={isOpen ? { rotateX: -120, y: -20 } : { rotateX: 0, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        onClick={onToggle}
      >
        <div className="h-full flex flex-col items-center justify-center gap-1">
          <div style={{ fontSize: '10px', fontFamily: 'Orbitron, sans-serif', color: 'rgba(255, 100, 100, 0.8)', letterSpacing: '0.1em', textAlign: 'center' }}>
            ⚠️ SAFETY<br/>LOCK
          </div>
          <div style={{ fontSize: '8px', color: 'rgba(255, 100, 100, 0.6)', fontFamily: 'Orbitron, sans-serif', textAlign: 'center' }}>
            LIFT TO ARM
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ReturnProtocolScreen({ onNext, onBack, formData, setFormData }) {
  const [coverOpen, setCoverOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(formData.returnLocation || "Nobita's Desk Drawer");
  const [customLocation, setCustomLocation] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [paradoxDrawerOpen, setParadoxDrawerOpen] = useState(false);
  const [showLaunchSequence, setShowLaunchSequence] = useState(false);

  const handleToggleCover = () => {
    if (!coverOpen) {
      toast.warning('🔐 Safety Cover Lifted! Arm caution.', {
        description: 'Emergency abort now accessible',
        style: { border: '1px solid rgba(230, 57, 70, 0.5)' },
      });
    } else {
      toast.info('🔒 Safety Cover Secured', { duration: 1500 });
    }
    setCoverOpen(!coverOpen);
  };

  const handleEmergencyAbort = () => {
    if (!coverOpen) {
      toast.error('🔒 Lift safety cover first!', { duration: 2000 });
      return;
    }
    setParadoxDrawerOpen(true);
  };

  const handleLaunch = () => {
    const returnLoc = selectedReturn === 'Custom Location' ? customLocation : selectedReturn;
    if (!returnLoc) {
      toast.warning('📍 Set return location first!', {
        style: { border: '1px solid rgba(255, 193, 7, 0.5)' }
      });
      return;
    }
    setFormData(prev => ({ ...prev, returnLocation: returnLoc }));
    setIsLaunching(true);
    setShowLaunchSequence(true);

    // Launch sequence
    const steps = [
      { msg: '🔍 Verifying temporal coordinates...', delay: 0 },
      { msg: '⚡ Charging flux capacitors...', delay: 1000 },
      { msg: '🌀 Opening temporal rift...', delay: 2000 },
      { msg: '🚀 INITIATING TIME JUMP!', delay: 3000 },
    ];

    steps.forEach(({ msg, delay }) => {
      setTimeout(() => toast.loading(msg, { id: 'launch', style: { border: '1px solid rgba(0, 200, 255, 0.5)' } }), delay);
    });

    setTimeout(() => {
      toast.success('✅ TIME TRAVEL INITIATED!', {
        id: 'launch',
        description: `Returning to: ${returnLoc}`,
        duration: 4000,
        style: { border: '1px solid rgba(57, 255, 20, 0.6)' },
      });
      setShowLaunchSequence(false);
      setIsLaunching(false);
      onNext();
    }, 4200);
  };

  return (
    <div className="flex flex-col items-center w-full h-full relative" style={{ padding: '16px' }}>

      <motion.div className="text-center mb-4" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="flex items-center justify-center gap-3 mb-1">
          <span className="text-3xl">🔐</span>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', color: '#00C8FF', fontWeight: 800 }}>
            RETURN PROTOCOL
          </h2>
          <span className="text-3xl">🏠</span>
        </div>
        <p className="text-xs" style={{ color: 'rgba(0, 200, 255, 0.5)' }}>
          Set your safe return anchor before time jump
        </p>
      </motion.div>

      <div className="w-full max-w-2xl flex gap-5">
        {/* Safety switch column */}
        <motion.div
          className="flex flex-col items-center gap-4"
          style={{ width: '140px', flexShrink: 0 }}
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <CoverSwitch isOpen={coverOpen} onToggle={handleToggleCover} />

          {/* Emergency abort */}
          <motion.button
            className="w-full py-3 px-2 rounded-xl text-center"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '9px',
              letterSpacing: '0.1em',
              background: coverOpen ? 'rgba(230, 57, 70, 0.2)' : 'rgba(0, 12, 40, 0.5)',
              border: coverOpen ? '2px solid rgba(230, 57, 70, 0.8)' : '1px solid rgba(100, 100, 100, 0.3)',
              color: coverOpen ? '#E63946' : 'rgba(100, 100, 100, 0.5)',
              cursor: 'pointer',
              boxShadow: coverOpen ? '0 0 20px rgba(230, 57, 70, 0.4)' : 'none',
              transition: 'all 0.3s',
            }}
            whileTap={{ scale: coverOpen ? 0.95 : 1 }}
            onClick={handleEmergencyAbort}
            animate={coverOpen ? { borderColor: ['rgba(230,57,70,0.8)', 'rgba(230,57,70,1)', 'rgba(230,57,70,0.8)'] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🚨 EMERGENCY<br/>ABORT
          </motion.button>

          <div className="text-center">
            <div className="text-xs" style={{ color: 'rgba(0, 200, 255, 0.4)', fontFamily: 'Orbitron, sans-serif', fontSize: '8px' }}>
              {coverOpen ? '⚠️ ARMED' : '✅ SECURED'}
            </div>
          </div>
        </motion.div>

        {/* Return location panel */}
        <motion.div
          className="flex-1 flex flex-col gap-3"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="rounded-2xl p-5" style={{ background: 'rgba(0, 12, 40, 0.7)', border: '1px solid rgba(0, 200, 255, 0.2)' }}>
            <div className="text-xs mb-3" style={{ fontFamily: 'Orbitron, sans-serif', color: 'rgba(0, 200, 255, 0.6)', letterSpacing: '0.15em' }}>
              🏠 SELECT RETURN POINT
            </div>

            <div className="space-y-2">
              {RETURN_PRESETS.map((preset, i) => (
                <motion.button
                  key={preset.name}
                  className="w-full text-left px-4 py-3 rounded-xl transition-all"
                  style={{
                    background: selectedReturn === preset.name
                      ? 'rgba(0, 144, 208, 0.25)'
                      : 'rgba(0, 144, 208, 0.05)',
                    border: `1px solid ${selectedReturn === preset.name
                      ? 'rgba(0, 200, 255, 0.6)'
                      : 'rgba(0, 200, 255, 0.15)'}`,
                    color: selectedReturn === preset.name ? '#00C8FF' : 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    boxShadow: selectedReturn === preset.name ? '0 0 15px rgba(0, 200, 255, 0.2)' : 'none',
                  }}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  whileHover={{ background: 'rgba(0, 144, 208, 0.15)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedReturn(preset.name);
                    setFormData(prev => ({ ...prev, returnLocation: preset.name }));
                    if (preset.name !== 'Custom Location') {
                      toast.success(`🏠 Return point: ${preset.name}`, { duration: 1500 });
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '20px' }}>{preset.emoji}</span>
                    <div>
                      <div className="text-sm font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {preset.name}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(0, 200, 255, 0.4)', fontFamily: 'Orbitron, sans-serif' }}>
                        {preset.secure ? '🔒 SECURE' : '📍 STANDARD'} — {preset.description}
                      </div>
                    </div>
                    {selectedReturn === preset.name && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto rounded-full flex items-center justify-center"
                        style={{ width: '20px', height: '20px', background: '#39FF14', boxShadow: '0 0 8px #39FF14' }}
                      >
                        <span style={{ fontSize: '10px', color: 'black' }}>✓</span>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Custom location input */}
            <AnimatePresence>
              {selectedReturn === 'Custom Location' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 overflow-hidden"
                >
                  <input
                    type="text"
                    placeholder="Enter custom return coordinates..."
                    value={customLocation}
                    onChange={e => setCustomLocation(e.target.value)}
                    style={{ fontSize: '13px' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status display */}
          <div className="rounded-xl p-3 flex items-center gap-3" style={{
            background: 'rgba(0, 12, 40, 0.5)',
            border: '1px solid rgba(57, 255, 20, 0.3)',
          }}>
            <motion.div
              className="rounded-full"
              style={{ width: '10px', height: '10px', background: '#39FF14', flexShrink: 0 }}
              animate={{ opacity: [1, 0.3, 1], boxShadow: ['0 0 6px #39FF14', '0 0 12px #39FF14', '0 0 6px #39FF14'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="text-xs" style={{ color: '#39FF14', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.1em' }}>
              LOCKED: RETURN TO {(selectedReturn === 'Custom Location' ? customLocation : selectedReturn)?.toUpperCase() || '---'}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Launch button */}
      <motion.div className="w-full max-w-2xl mt-4 flex gap-3" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
        <motion.button
          className="px-6 py-3 rounded-xl text-sm"
          style={{ fontFamily: 'Orbitron, sans-serif', background: 'rgba(0, 12, 40, 0.7)', border: '1px solid rgba(0, 200, 255, 0.3)', color: 'rgba(0, 200, 255, 0.7)', cursor: 'pointer' }}
          whileHover={{ background: 'rgba(0, 12, 40, 0.9)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
        >◀ BACK</motion.button>

        <motion.button
          className="flex-1 py-4 rounded-xl font-black relative overflow-hidden"
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '16px',
            letterSpacing: '0.2em',
            background: isLaunching
              ? 'linear-gradient(135deg, rgba(57, 255, 20, 0.3), rgba(0, 200, 100, 0.3))'
              : 'linear-gradient(135deg, rgba(0, 90, 142, 0.9), rgba(0, 144, 208, 0.9))',
            border: isLaunching ? '1px solid rgba(57, 255, 20, 0.8)' : '1px solid rgba(0, 200, 255, 0.8)',
            color: isLaunching ? '#39FF14' : '#00FFFF',
            boxShadow: isLaunching ? '0 0 50px rgba(57, 255, 20, 0.6)' : '0 0 40px rgba(0, 200, 255, 0.4)',
            cursor: 'pointer',
          }}
          whileHover={!isLaunching ? {
            boxShadow: '0 0 80px rgba(0, 200, 255, 0.8)',
            background: 'linear-gradient(135deg, rgba(0, 110, 172, 0.9), rgba(0, 164, 228, 0.9))',
          } : {}}
          whileTap={{ scale: 0.98 }}
          onClick={handleLaunch}
          disabled={isLaunching}
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 opacity-40"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          {isLaunching ? '🌀 INITIATING JUMP...' : '🚀 ENGAGE TIME JUMP'}
        </motion.button>
      </motion.div>

      {/* Emergency Abort Drawer (Vaul) */}
      <Drawer.Root open={paradoxDrawerOpen} onOpenChange={setParadoxDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay style={{ background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(4px)' }} />
          <Drawer.Content
            style={{
              background: 'rgba(0, 8, 24, 0.98)',
              border: '1px solid rgba(230, 57, 70, 0.3)',
              borderBottom: 'none',
              borderRadius: '24px 24px 0 0',
              padding: '24px',
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            <Drawer.Handle style={{ background: 'rgba(230, 57, 70, 0.4)', margin: '0 auto 16px' }} />
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                style={{ fontSize: '60px', marginBottom: '16px' }}
              >🚨</motion.div>
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: '#E63946', fontSize: '1.4rem', fontWeight: 900, textShadow: '0 0 20px #E63946', marginBottom: '8px' }}>
                EMERGENCY ABORT SEQUENCE
              </h3>
              <p style={{ color: 'rgba(0, 200, 255, 0.7)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                This will <strong style={{ color: '#E63946' }}>immediately cancel</strong> the time jump and reset all temporal parameters. All pre-jump configurations will be lost.
              </p>
              <div className="flex gap-3">
                <motion.button
                  className="flex-1 py-3 rounded-xl"
                  style={{
                    fontFamily: 'Orbitron, sans-serif', fontSize: '12px',
                    background: 'rgba(0, 12, 40, 0.7)', border: '1px solid rgba(0, 200, 255, 0.3)',
                    color: 'rgba(0, 200, 255, 0.7)', cursor: 'pointer',
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setParadoxDrawerOpen(false)}
                >
                  ← STAND DOWN
                </motion.button>
                <motion.button
                  className="flex-1 py-3 rounded-xl font-bold"
                  style={{
                    fontFamily: 'Orbitron, sans-serif', fontSize: '12px', letterSpacing: '0.1em',
                    background: 'rgba(230, 57, 70, 0.3)', border: '1px solid rgba(230, 57, 70, 0.8)',
                    color: '#E63946', cursor: 'pointer', boxShadow: '0 0 20px rgba(230, 57, 70, 0.3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setParadoxDrawerOpen(false);
                    toast.error('🚨 TEMPORAL JUMP ABORTED', {
                      description: 'All parameters reset. Mission scrubbed.',
                      duration: 4000,
                    });
                    setTimeout(() => onBack(), 1500);
                  }}
                >
                  🚨 CONFIRM ABORT
                </motion.button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* Launch sequence overlay */}
      <AnimatePresence>
        {showLaunchSequence && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(10px)' }}
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ fontSize: '80px', marginBottom: '24px' }}
              >🌀</motion.div>
              <div style={{ fontFamily: 'Orbitron, sans-serif', color: '#00C8FF', fontSize: '1.5rem', fontWeight: 900, textShadow: '0 0 30px #00C8FF' }}>
                TIME JUMP INITIATING
              </div>
              <div className="flex gap-2 justify-center mt-4">
                {[0, 1, 2, 3, 4].map(i => (
                  <motion.div
                    key={i}
                    className="rounded-full"
                    style={{ width: '10px', height: '10px', background: '#00C8FF' }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
