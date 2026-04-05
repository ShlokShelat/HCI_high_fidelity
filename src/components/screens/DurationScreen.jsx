import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ScrollReveal, FadeReveal, CountUp } from '../ui/ScrollReveal';
import { ClipWords } from '../ui/ClipReveal';
import MagneticButton from '../ui/MagneticButton';
import { FillButton } from '../ui/HoverCard';
import { useLenis } from '../../hooks/useLenis';

const PRESETS = [
  { label: '1 HOUR', hours: 1, days: 0, emoji: '⚡', energy: 5 },
  { label: '1 DAY', hours: 24, days: 1, emoji: '🌅', energy: 20 },
  { label: '1 WEEK', hours: 168, days: 7, emoji: '📅', energy: 80 },
  { label: '1 MONTH', hours: 720, days: 30, emoji: '🌙', energy: 200 },
  { label: '1 YEAR', hours: 8760, days: 365, emoji: '🌍', energy: 1200 },
];

export default function DurationScreen({ onNext, onBack, formData, setFormData }) {
  const scrollRef = useRef(null);
  useLenis(scrollRef);
  const [hours, setHours] = useState(formData.hours || 24);
  const [days, setDays] = useState(formData.days || 0);
  const [history, setHistory] = useState([]);

  const totalHours = days * 24 + hours;
  const energyCost = Math.round(totalHours * 0.5 + Math.pow(totalHours / 24, 1.5) * 2);
  const energyPercent = Math.min(100, (energyCost / 1500) * 100);

  const energyLevel = energyPercent < 30 ? 'LOW' : energyPercent < 60 ? 'MEDIUM' : energyPercent < 85 ? 'HIGH' : 'CRITICAL';
  const energyColor = energyPercent < 30 ? '#39FF14' : energyPercent < 60 ? '#FFD700' : energyPercent < 85 ? '#FF6600' : '#E63946';

  const saveSnapshot = () => {
    setHistory(prev => [...prev.slice(-4), { hours, days }]);
  };

  const handleUndo = () => {
    if (history.length === 0) {
      toast.info('Nothing to undo', { icon: '↩️' });
      return;
    }
    const last = history[history.length - 1];
    setHours(last.hours);
    setDays(last.days);
    setHistory(prev => prev.slice(0, -1));
    toast.success('↩️ Duration restored', { duration: 1500 });
  };

  const handlePreset = (preset) => {
    saveSnapshot();
    setHours(preset.hours % 24);
    setDays(preset.days);
    toast.success(`⚡ Preset: ${preset.label}`, { duration: 1500, style: { border: '1px solid rgba(0, 200, 255, 0.5)' } });
  };

  const handleNext = () => {
    if (totalHours === 0) {
      toast.warning('⏱️ Duration cannot be zero!', {
        description: 'Set at least 1 hour of stay time',
        style: { border: '1px solid rgba(255, 193, 7, 0.5)', background: 'rgba(0, 12, 40, 0.95)' },
      });
      return;
    }
    setFormData(prev => ({ ...prev, hours, days, totalHours, energyCost }));
    onNext();
  };

  // Light beam particles
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: (energyPercent / 100) * 100,
    delay: i * 0.2,
  }));

  return (
    <div ref={scrollRef} className="w-full h-full overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
    <div className="flex flex-col items-center w-full relative" style={{ padding: '20px 16px 60px' }}>

      <FadeReveal delay={0.1} direction="up">
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-3 mb-1">
            <motion.span className="text-3xl" animate={{ scale:[1,1.2,1] }} transition={{ duration:2, repeat:Infinity }}>💡</motion.span>
            <ClipWords text="SMALL LIGHT — DURATION" tag="h2" delay={0.15} stagger={0.06}
              style={{ fontFamily:'Orbitron,sans-serif', fontSize:'1.3rem', color:'#00C8FF', fontWeight:800 }} />
          </div>
          <p style={{ fontSize:12, color:'rgba(0,200,255,0.45)', fontFamily:'Space Grotesk,sans-serif' }}>
            Slide to calibrate temporal immersion duration
          </p>
        </div>
      </FadeReveal>

      <div className="w-full max-w-2xl flex flex-col gap-4">

        {/* Main duration panel */}
        <motion.div
          className="rounded-2xl p-6"
          style={{ background: 'rgba(0, 12, 40, 0.7)', border: '1px solid rgba(0, 200, 255, 0.2)' }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Duration display */}
          <div className="text-center mb-6">
            <div className="text-xs mb-2" style={{ fontFamily: 'Orbitron, sans-serif', color: 'rgba(0, 200, 255, 0.5)', letterSpacing: '0.2em' }}>
              STAY DURATION
            </div>
            <motion.div
              key={totalHours}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              className="text-4xl font-black"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                color: energyColor,
                textShadow: `0 0 20px ${energyColor}`,
              }}
            >
              {days > 0 && `${days}d `}{hours > 0 && `${hours}h`}
              {totalHours === 0 && '-- --'}
            </motion.div>
            <div className="text-xs mt-1" style={{ color: 'rgba(0, 200, 255, 0.4)', fontFamily: 'Space Grotesk, sans-serif' }}>
              = {totalHours} total hours
            </div>
          </div>

          {/* Days slider */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs" style={{ fontFamily: 'Orbitron, sans-serif', color: 'rgba(0, 200, 255, 0.6)', letterSpacing: '0.15em' }}>
                DAYS: {days}
              </label>
              <span className="text-xs" style={{ color: 'rgba(0, 200, 255, 0.4)' }}>0 — 365</span>
            </div>

            {/* Custom slider track with light beam */}
            <div className="relative">
              <div className="relative rounded-full overflow-hidden" style={{ height: '12px', background: 'rgba(0, 12, 40, 0.8)', border: '1px solid rgba(0, 200, 255, 0.2)' }}>
                {/* Fill bar */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 rounded-full"
                  style={{ width: `${(days / 365) * 100}%` }}
                  animate={{ width: `${(days / 365) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <div style={{
                    height: '100%',
                    background: `linear-gradient(90deg, #005A8E, ${energyColor})`,
                    boxShadow: `0 0 10px ${energyColor}60`,
                  }} />
                  {/* Light beam tip */}
                  <div style={{
                    position: 'absolute', right: '-1px', top: '-2px', bottom: '-2px', width: '4px',
                    background: energyColor,
                    boxShadow: `0 0 12px ${energyColor}, 0 0 24px ${energyColor}80`,
                    borderRadius: '2px',
                  }} />
                </motion.div>
              </div>
              <input
                type="range" min={0} max={365} value={days}
                onChange={e => { saveSnapshot(); setDays(Number(e.target.value)); }}
                className="absolute inset-0 opacity-0 cursor-pointer"
                style={{ height: '100%' }}
              />
            </div>
          </div>

          {/* Hours slider */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs" style={{ fontFamily: 'Orbitron, sans-serif', color: 'rgba(0, 200, 255, 0.6)', letterSpacing: '0.15em' }}>
                HOURS: {hours}
              </label>
              <span className="text-xs" style={{ color: 'rgba(0, 200, 255, 0.4)' }}>0 — 23</span>
            </div>
            <div className="relative">
              <div className="relative rounded-full overflow-hidden" style={{ height: '12px', background: 'rgba(0, 12, 40, 0.8)', border: '1px solid rgba(0, 200, 255, 0.2)' }}>
                <motion.div
                  className="absolute left-0 top-0 bottom-0 rounded-full"
                  animate={{ width: `${(hours / 23) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #005A8E, #00C8FF)',
                    boxShadow: '0 0 10px rgba(0, 200, 255, 0.4)',
                  }} />
                  <div style={{
                    position: 'absolute', right: '-1px', top: '-2px', bottom: '-2px', width: '4px',
                    background: '#00FFFF',
                    boxShadow: '0 0 12px #00FFFF, 0 0 24px rgba(0,255,255,0.6)',
                    borderRadius: '2px',
                  }} />
                </motion.div>
              </div>
              <input
                type="range" min={0} max={23} value={hours}
                onChange={e => { saveSnapshot(); setHours(Number(e.target.value)); }}
                className="absolute inset-0 opacity-0 cursor-pointer"
                style={{ height: '100%' }}
              />
            </div>
          </div>

          {/* Presets */}
          <div>
            <div className="text-xs mb-2" style={{ fontFamily: 'Orbitron, sans-serif', color: 'rgba(0, 200, 255, 0.5)', letterSpacing: '0.15em' }}>
              QUICK PRESETS
            </div>
            <div className="flex gap-2">
              {PRESETS.map(preset => (
                <motion.button
                  key={preset.label}
                  className="flex-1 py-2 px-1 rounded-lg text-center"
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '9px',
                    letterSpacing: '0.05em',
                    background: 'rgba(0, 144, 208, 0.08)',
                    border: '1px solid rgba(0, 200, 255, 0.2)',
                    color: 'rgba(0, 200, 255, 0.8)',
                    cursor: 'pointer',
                  }}
                  whileHover={{ background: 'rgba(0, 144, 208, 0.2)', borderColor: 'rgba(0, 200, 255, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePreset(preset)}
                >
                  <div style={{ fontSize: '14px' }}>{preset.emoji}</div>
                  <div>{preset.label}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Energy cost panel */}
        <motion.div
          className="rounded-xl p-4"
          style={{
            background: `rgba(${energyPercent > 85 ? '230,57,70' : '0,12,40'},0.${energyPercent > 85 ? '15' : '7'})`,
            border: `1px solid ${energyColor}40`,
            transition: 'all 0.5s',
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs" style={{ fontFamily: 'Orbitron, sans-serif', color: energyColor, letterSpacing: '0.15em' }}>
              ⚡ TEMPORAL ENERGY COST
            </div>
            <div className="text-sm font-bold" style={{ fontFamily: 'Orbitron, sans-serif', color: energyColor, textShadow: `0 0 10px ${energyColor}` }}>
              {energyCost} TU
            </div>
          </div>

          {/* Energy bar */}
          <div className="relative rounded-full overflow-hidden mb-2" style={{ height: '14px', background: 'rgba(0, 0, 0, 0.5)' }}>
            <motion.div
              className="absolute left-0 top-0 bottom-0 rounded-full"
              animate={{ width: `${energyPercent}%` }}
              transition={{ type: 'spring', stiffness: 100 }}
              style={{
                background: `linear-gradient(90deg, #005A8E, ${energyColor})`,
                boxShadow: `0 0 15px ${energyColor}80`,
              }}
            />
            {/* Segment markers */}
            {[30, 60, 85].map(pct => (
              <div key={pct} className="absolute top-0 bottom-0 w-px" style={{ left: `${pct}%`, background: 'rgba(0,0,0,0.5)' }} />
            ))}
          </div>

          <div className="flex justify-between text-xs" style={{ color: 'rgba(0, 200, 255, 0.4)', fontFamily: 'Orbitron, sans-serif' }}>
            <span style={{ color: '#39FF14' }}>LOW</span>
            <span style={{ color: '#FFD700' }}>MED</span>
            <span style={{ color: '#FF6600' }}>HIGH</span>
            <span style={{ color: '#E63946' }}>CRITICAL</span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: energyColor, boxShadow: `0 0 8px ${energyColor}` }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-xs" style={{ color: energyColor, fontFamily: 'Space Grotesk, sans-serif' }}>
              {energyLevel === 'CRITICAL' ? '⚠️ WARNING: Extremely long stay may cause temporal degradation!' :
               energyLevel === 'HIGH' ? '📊 High energy consumption — ensure backup power' :
               energyLevel === 'MEDIUM' ? '✅ Moderate energy usage — nominal conditions' :
               '💚 Minimal energy required — efficient jump'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <FadeReveal delay={0.4} direction="up">
        <div className="flex gap-3 mt-4 w-full max-w-2xl">
          <MagneticButton className="px-5 py-3 rounded-xl text-sm" data-cursor="BACK"
            style={{ fontFamily:'Orbitron,sans-serif', background:'rgba(0,12,40,0.7)', border:'1px solid rgba(0,200,255,0.3)', color:'rgba(0,200,255,0.7)', cursor:'none' }}
            onClick={onBack}>◀ BACK</MagneticButton>
          <FillButton className="px-4 py-3 rounded-xl text-sm" fillColor="rgba(255,215,0,0.15)"
            style={{ fontFamily:'Orbitron,sans-serif', fontSize:11, background:'rgba(255,215,0,0.06)', border:'1px solid rgba(255,215,0,0.35)', color:'#FFD700', cursor:'none' }}
            onClick={handleUndo}>↩️ UNDO</FillButton>
          <MagneticButton className="flex-1 py-3 rounded-xl font-bold relative overflow-hidden" data-cursor="NEXT"
            style={{ fontFamily:'Orbitron,sans-serif', fontSize:13, letterSpacing:'0.15em',
              background:'linear-gradient(135deg,rgba(0,90,142,0.85),rgba(0,144,208,0.85))',
              border:'1px solid rgba(0,200,255,0.6)', color:'#00FFFF',
              boxShadow:'0 0 30px rgba(0,200,255,0.25)', cursor:'none' }}
            onClick={handleNext}>
            <motion.div className="absolute inset-0 opacity-25"
              style={{ background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)' }}
              animate={{ x:['-100%','200%'] }} transition={{ duration:2.5, repeat:Infinity, ease:'linear' }} />
            SET RETURN COORDINATES ▶
          </MagneticButton>
        </div>
      </FadeReveal>
    </div>
    </div>
  );
}
