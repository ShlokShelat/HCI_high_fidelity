import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const ERAS = [
  { name: 'Big Bang', year: -13800000000, color: '#FF0000', danger: true, emoji: '💥', warning: 'DANGER: Pre-existence zone!' },
  { name: 'Dinosaur Age', year: -65000000, color: '#FF6600', danger: false, emoji: '🦕' },
  { name: 'Stone Age', year: -10000, color: '#FF9900', danger: false, emoji: '🪨' },
  { name: 'Ancient Egypt', year: -3000, color: '#FFD700', danger: false, emoji: '🏺' },
  { name: 'Medieval', year: 1200, color: '#90EE90', danger: false, emoji: '⚔️' },
  { name: 'Renaissance', year: 1500, color: '#00FF00', danger: false, emoji: '🎨' },
  { name: 'Industrial', year: 1800, color: '#00FFFF', danger: false, emoji: '⚙️' },
  { name: 'Modern', year: 2020, color: '#00C8FF', danger: false, emoji: '🌐' },
  { name: 'Near Future', year: 2112, color: '#0090D0', danger: false, emoji: '🚀' },
  { name: 'Far Future', year: 10000, color: '#9B59B6', danger: false, emoji: '🌌' },
  { name: 'Heat Death', year: 10000000000, color: '#FF0000', danger: true, emoji: '☠️', warning: 'DANGER: Universe extinction!' },
];

function Dial({ value, onChange, min, max, label, unit, step = 1, size = 140 }) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(value);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartValue(value);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const delta = (startY - e.clientY) * ((max - min) / 200);
    const newVal = Math.round((startValue + delta) / step) * step;
    onChange(Math.max(min, Math.min(max, newVal)));
  }, [isDragging, startY, startValue, min, max, step, onChange]);

  const handleMouseUp = () => setIsDragging(false);

  const rotation = ((value - min) / (max - min)) * 270 - 135;
  const normalizedVal = (value - min) / (max - min);

  // Color based on value
  const getColor = () => {
    if (normalizedVal < 0.1 || normalizedVal > 0.9) return '#E63946';
    if (normalizedVal < 0.2 || normalizedVal > 0.8) return '#FF6600';
    return '#00C8FF';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-xs" style={{ fontFamily: 'Orbitron, sans-serif', color: 'rgba(0, 200, 255, 0.6)', letterSpacing: '0.15em' }}>
        {label}
      </div>
      <div
        className="relative cursor-grab select-none"
        style={{ width: size, height: size }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Outer ring */}
        <svg viewBox="0 0 140 140" width={size} height={size} className="absolute inset-0">
          {/* Background track */}
          <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(0, 18, 51, 0.8)" strokeWidth="10" />
          {/* Tick marks */}
          {Array.from({ length: 27 }).map((_, i) => {
            const angle = (i / 26) * 270 - 135;
            const rad = (angle * Math.PI) / 180;
            const isMajor = i % 3 === 0;
            return (
              <line
                key={i}
                x1={70 + Math.cos(rad) * 52} y1={70 + Math.sin(rad) * 52}
                x2={70 + Math.cos(rad) * (isMajor ? 45 : 49)} y2={70 + Math.sin(rad) * (isMajor ? 45 : 49)}
                stroke={`rgba(0, 200, 255, ${isMajor ? 0.6 : 0.25})`}
                strokeWidth={isMajor ? 1.5 : 0.8}
              />
            );
          })}
          {/* Progress arc */}
          <circle
            cx="70" cy="70" r="58"
            fill="none"
            stroke={getColor()}
            strokeWidth="6"
            strokeDasharray={`${normalizedVal * 2.75 * 58 * Math.PI / 2} ${3 * 58 * Math.PI}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(-225 70 70)"
            style={{ filter: `drop-shadow(0 0 6px ${getColor()})`, transition: 'stroke 0.3s' }}
          />
          {/* Center glow */}
          <circle cx="70" cy="70" r="42" fill="radial-gradient(circle, rgba(0,18,51,0.9), rgba(0,0,0,0.95))" />
        </svg>

        {/* Dial body */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full relative" style={{
            width: size * 0.6,
            height: size * 0.6,
            background: 'radial-gradient(circle at 35% 35%, rgba(0, 90, 142, 0.8), rgba(0, 12, 40, 0.95))',
            border: '2px solid rgba(0, 200, 255, 0.3)',
            boxShadow: `0 0 20px rgba(0, 200, 255, 0.2), inset 0 0 20px rgba(0, 0, 0, 0.5)`,
          }}>
            {/* Needle */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `rotate(${rotation}deg)` }}
              animate={{ transform: `rotate(${rotation}deg)` }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <div style={{
                position: 'absolute',
                top: '10%',
                width: '3px',
                height: '40%',
                background: `linear-gradient(to top, transparent, ${getColor()})`,
                borderRadius: '2px',
                boxShadow: `0 0 8px ${getColor()}`,
                transformOrigin: 'bottom center',
                left: '50%',
                marginLeft: '-1.5px',
              }} />
            </motion.div>

            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{
              width: '8px', height: '8px',
              background: getColor(),
              boxShadow: `0 0 10px ${getColor()}`,
              zIndex: 5,
            }} />
          </div>
        </div>

        {/* Value display below */}
        <div className="absolute -bottom-0 left-0 right-0 text-center">
          <span style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '11px',
            color: getColor(),
            textShadow: `0 0 8px ${getColor()}`,
          }}>
            {value} {unit}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TimeClothScreen({ onNext, onBack, formData, setFormData }) {
  const [day, setDay] = useState(formData.day || 15);
  const [month, setMonth] = useState(formData.month || 6);
  const [year, setYear] = useState(formData.year || 2112);
  const [accepted, setAccepted] = useState(formData.termsAccepted || false);
  const [eraHovered, setEraHovered] = useState(null);

  const currentEra = ERAS.reduce((prev, curr) => {
    return Math.abs(curr.year - year) < Math.abs(prev.year - year) ? curr : prev;
  });

  const isDangerZone = year < -1000000000 || year > 9000000000;
  const isFuture = year > 2026;
  const isPast = year < 2026;

  const handleReset = () => {
    setDay(5);
    setMonth(4);
    setYear(2026);
    setFormData(prev => ({ ...prev, day: 5, month: 4, year: 2026 }));
    toast.info('🔄 Reset to Today: April 5, 2026', { icon: '📅' });
  };

  const handleNext = () => {
    if (!accepted) {
      toast.warning('📜 Accept the Temporal Terms first!', {
        description: 'Time travel waivers must be signed',
        style: { border: '1px solid rgba(255, 193, 7, 0.5)', background: 'rgba(0, 12, 40, 0.95)' },
      });
      return;
    }
    if (isDangerZone) {
      toast.error('🚨 TEMPORAL PARADOX ZONE!', {
        description: 'Cannot navigate to extreme time boundaries',
        style: { border: '1px solid rgba(230, 57, 70, 0.5)', background: 'rgba(0, 12, 40, 0.95)' },
      });
      return;
    }
    setFormData(prev => ({ ...prev, day, month, year, termsAccepted: accepted }));
    onNext();
  };

  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  return (
    <div className="flex flex-col items-center w-full h-full relative" style={{ padding: '16px' }}>

      {/* Header */}
      <motion.div className="text-center mb-4" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="flex items-center justify-center gap-3 mb-1">
          <motion.span className="text-3xl" animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
            🕐
          </motion.span>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', color: '#00C8FF', fontWeight: 800 }}>
            TIME CLOTH DIALS
          </h2>
          <motion.span className="text-3xl" animate={{ rotate: [360, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}>
            ⏰
          </motion.span>
        </div>
        <p className="text-xs" style={{ color: 'rgba(0, 200, 255, 0.5)', fontFamily: 'Space Grotesk, sans-serif' }}>
          Drag the dials to navigate through time
        </p>
      </motion.div>

      <div className="w-full max-w-3xl flex gap-5">
        {/* Left: Era compass */}
        <motion.div
          className="flex flex-col gap-3"
          style={{ width: '160px', flexShrink: 0 }}
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="rounded-xl p-3" style={{ background: 'rgba(0, 12, 40, 0.7)', border: '1px solid rgba(0, 200, 255, 0.2)' }}>
            <div className="text-xs mb-2" style={{ fontFamily: 'Orbitron, sans-serif', color: 'rgba(0, 200, 255, 0.6)', letterSpacing: '0.1em' }}>
              🗺️ ERA COMPASS
            </div>
            <div className="space-y-1">
              {ERAS.map((era) => (
                <motion.div
                  key={era.name}
                  className="flex items-center gap-2 px-2 py-1 rounded"
                  style={{
                    background: currentEra.name === era.name ? `rgba(${era.danger ? '230,57,70' : '0,144,208'},0.2)` : 'transparent',
                    border: currentEra.name === era.name ? `1px solid ${era.color}40` : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  whileHover={{ background: 'rgba(0, 144, 208, 0.1)' }}
                  onClick={() => {
                    setYear(era.year > 0 ? Math.min(era.year, 9999) : Math.max(era.year, -9999));
                  }}
                >
                  <div className="rounded-full w-2 h-2 flex-shrink-0" style={{
                    background: era.color,
                    boxShadow: currentEra.name === era.name ? `0 0 6px ${era.color}` : 'none',
                  }} />
                  <span style={{ fontSize: '10px', color: currentEra.name === era.name ? era.color : 'rgba(255,255,255,0.5)' }}>
                    {era.emoji} {era.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Center: Dials */}
        <motion.div
          className="flex-1 flex flex-col items-center gap-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Main display */}
          <div className="rounded-2xl p-4 w-full" style={{
            background: isDangerZone ? 'rgba(230, 57, 70, 0.1)' : 'rgba(0, 12, 40, 0.8)',
            border: `1px solid ${isDangerZone ? 'rgba(230, 57, 70, 0.6)' : 'rgba(0, 200, 255, 0.3)'}`,
            boxShadow: isDangerZone ? '0 0 30px rgba(230, 57, 70, 0.3)' : '0 0 20px rgba(0, 200, 255, 0.1)',
            transition: 'all 0.5s',
          }}>
            {/* Date display */}
            <div className="text-center mb-4">
              <div className="text-xs mb-1" style={{ color: 'rgba(0, 200, 255, 0.5)', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.2em' }}>
                DESTINATION DATE
              </div>
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  key={`${day}-${month}-${year}`}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-black"
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    color: isDangerZone ? '#E63946' : '#00FFFF',
                    textShadow: `0 0 20px ${isDangerZone ? '#E63946' : '#00FFFF'}`,
                    letterSpacing: '0.05em',
                  }}
                >
                  {day < 10 ? `0${day}` : day} {MONTHS[month - 1]} {year < 0 ? `${Math.abs(year)} BCE` : year > 9999 ? `${(year / 1000000).toFixed(0)}M CE` : year}
                </motion.div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span style={{ fontSize: '16px' }}>{currentEra.emoji}</span>
                <span className="text-xs" style={{ color: currentEra.color, fontFamily: 'Orbitron, sans-serif' }}>
                  {currentEra.name} Era
                </span>
                {(isFuture || isPast) && (
                  <span className="text-xs" style={{ color: 'rgba(0, 200, 255, 0.5)' }}>
                    {isFuture ? `(+${year - 2026}y into future)` : `(${2026 - year}y in past)`}
                  </span>
                )}
              </div>
            </div>

            {/* Danger warning */}
            <AnimatePresence>
              {isDangerZone && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-2 rounded-lg text-center glitch-anim"
                  style={{ background: 'rgba(230, 57, 70, 0.2)', border: '1px solid rgba(230, 57, 70, 0.6)' }}
                >
                  <span className="text-xs font-bold" style={{ color: '#E63946', fontFamily: 'Orbitron, sans-serif' }}>
                    ⚠️ DANGER ZONE — TEMPORAL BOUNDARIES EXCEEDED
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Three dials */}
            <div className="flex justify-around items-center">
              <Dial value={day} onChange={setDay} min={1} max={31} label="DAY" unit="" size={120} />
              <Dial value={month} onChange={setMonth} min={1} max={12} label="MONTH" unit="" size={120} />
              <Dial value={year} onChange={setYear} min={-65000000} max={10000000} label="YEAR" unit="" step={1} size={120} />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex gap-3 w-full">
            <motion.button
              className="px-4 py-2 rounded-lg text-xs"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                background: 'rgba(0, 12, 40, 0.7)',
                border: '1px solid rgba(255, 193, 7, 0.4)',
                color: '#FFD700',
                cursor: 'pointer',
                letterSpacing: '0.1em',
                boxShadow: '0 0 10px rgba(255, 215, 0, 0.1)',
              }}
              whileHover={{ boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReset}
            >
              🔄 RESET TO TODAY
            </motion.button>

            {/* Terms checkbox */}
            <div className="flex-1 p-3 rounded-lg flex items-start gap-3" style={{
              background: 'rgba(0, 12, 40, 0.5)',
              border: `1px solid ${accepted ? 'rgba(57, 255, 20, 0.4)' : 'rgba(0, 200, 255, 0.2)'}`,
            }}>
              <input
                type="checkbox"
                id="terms"
                checked={accepted}
                onChange={e => {
                  setAccepted(e.target.checked);
                  if (e.target.checked) {
                    toast.success('📜 Temporal Agreement Signed!', { icon: '✅' });
                  }
                }}
              />
              <label htmlFor="terms" className="text-xs cursor-pointer" style={{ color: 'rgba(0, 200, 255, 0.7)', lineHeight: 1.5 }}>
                I accept the <span style={{ color: '#00C8FF', textDecoration: 'underline' }}>Temporal Non-Interference Agreement</span> and acknowledge risks of paradox, butterfly effects, and premature dinosaur encounters.
              </label>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.div className="flex gap-3 mt-4 w-full max-w-3xl" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
        <motion.button
          className="px-6 py-3 rounded-xl text-sm"
          style={{ fontFamily: 'Orbitron, sans-serif', background: 'rgba(0, 12, 40, 0.7)', border: '1px solid rgba(0, 200, 255, 0.3)', color: 'rgba(0, 200, 255, 0.7)', cursor: 'pointer', letterSpacing: '0.1em' }}
          whileHover={{ background: 'rgba(0, 12, 40, 0.9)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
        >◀ BACK</motion.button>
        <motion.button
          className="flex-1 py-3 rounded-xl font-bold relative overflow-hidden"
          style={{
            fontFamily: 'Orbitron, sans-serif', fontSize: '13px', letterSpacing: '0.2em',
            background: 'linear-gradient(135deg, rgba(0, 90, 142, 0.8), rgba(0, 144, 208, 0.8))',
            border: '1px solid rgba(0, 200, 255, 0.6)', color: '#00FFFF',
            boxShadow: '0 0 30px rgba(0, 200, 255, 0.3)', cursor: 'pointer',
          }}
          whileHover={{ boxShadow: '0 0 50px rgba(0, 200, 255, 0.6)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
        >
          <motion.div className="absolute inset-0 opacity-30"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          CALIBRATE DURATION ▶
        </motion.button>
      </motion.div>
    </div>
  );
}
