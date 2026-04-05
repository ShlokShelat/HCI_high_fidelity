import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { toast } from 'sonner';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const customIcon = L.divIcon({
  html: `<div style="
    width: 32px; height: 32px;
    background: radial-gradient(circle, #00FFFF 0%, #0090D0 60%, transparent 100%);
    border: 2px solid #00FFFF;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 0 15px rgba(0, 200, 255, 0.9), 0 0 30px rgba(0, 200, 255, 0.5);
    position: relative;
  ">
    <div style="
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
      font-size: 12px;
    ">📍</div>
  </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const FAVORITES = [
  { name: "Nobita's Room", lat: 35.6762, lng: 139.6503, emoji: '🏠', era: 'Present' },
  { name: 'Ancient Egypt', lat: 29.9792, lng: 31.1342, emoji: '🏺', era: '-3000 BCE' },
  { name: 'Jurassic Park', lat: -8.4095, lng: 115.1889, emoji: '🦕', era: '-65M BCE' },
  { name: 'Future Tokyo', lat: 35.6762, lng: 139.6503, emoji: '🚀', era: '+2112 CE' },
  { name: 'Medieval Europe', lat: 48.8566, lng: 2.3522, emoji: '⚔️', era: '1200 CE' },
  { name: 'Moon Base', lat: 0, lng: 0, emoji: '🌙', era: '+2112 CE' },
];

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function AnywhereDoorScreen({ onNext, onBack, formData, setFormData }) {
  const [selected, setSelected] = useState(
    formData.lat ? { lat: formData.lat, lng: formData.lng, name: formData.location } : null
  );
  const [searchInput, setSearchInput] = useState('');
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const mapRef = useRef(null);

  useEffect(() => {
    // Portal open animation on mount
    setTimeout(() => setIsPortalOpen(true), 300);
  }, []);

  const handleLocationSelect = (lat, lng, name = null) => {
    const locationName = name || `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
    setSelected({ lat, lng, name: locationName });
    setFormData(prev => ({ ...prev, lat, lng, location: locationName }));
    toast.success(`📍 Destination locked: ${locationName}`, {
      style: { border: '1px solid rgba(0, 200, 255, 0.5)', background: 'rgba(0, 12, 40, 0.95)' },
    });
    setMapCenter([lat, lng]);
  };

  const handleFavorite = (fav) => {
    handleLocationSelect(fav.lat, fav.lng, fav.name);
    if (mapRef.current) {
      mapRef.current.flyTo([fav.lat, fav.lng], 6, { duration: 1.5 });
    }
  };

  const handleNext = () => {
    if (!selected) {
      toast.warning('🚪 Anywhere Door requires a destination!', {
        description: 'Click on the map or choose from Favorites',
        style: { border: '1px solid rgba(255, 193, 7, 0.5)', background: 'rgba(0, 12, 40, 0.95)' },
      });
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col w-full h-full relative" style={{ padding: '16px' }}>

      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-3"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="flex items-center gap-3">
            <motion.div
              className="text-3xl"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >🚪</motion.div>
            <div>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', color: '#00C8FF', fontWeight: 800, lineHeight: 1 }}>
                ANYWHERE DOOR
              </h2>
              <p className="text-xs" style={{ color: 'rgba(0, 200, 255, 0.5)', fontFamily: 'Space Grotesk, sans-serif' }}>
                Select your temporal destination coordinates
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-3 py-2 rounded-lg text-xs"
              style={{
                background: 'rgba(57, 255, 20, 0.1)',
                border: '1px solid rgba(57, 255, 20, 0.5)',
                color: '#39FF14',
                fontFamily: 'Orbitron, sans-serif',
                maxWidth: '200px',
              }}
            >
              📍 {selected.name}
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Sidebar */}
        <motion.div
          className="flex flex-col gap-3"
          style={{ width: '200px', flexShrink: 0 }}
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Search */}
          <div className="rounded-xl p-3" style={{ background: 'rgba(0, 12, 40, 0.7)', border: '1px solid rgba(0, 200, 255, 0.2)' }}>
            <div className="text-xs mb-2" style={{ fontFamily: 'Orbitron, sans-serif', color: 'rgba(0, 200, 255, 0.6)', letterSpacing: '0.15em' }}>
              🔍 SEARCH
            </div>
            <input
              type="text"
              placeholder="Search location..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              style={{ fontSize: '12px', padding: '6px 10px' }}
            />
          </div>

          {/* Favorites */}
          <div className="rounded-xl p-3 flex-1 overflow-y-auto" style={{ background: 'rgba(0, 12, 40, 0.7)', border: '1px solid rgba(0, 200, 255, 0.2)' }}>
            <div className="text-xs mb-3" style={{ fontFamily: 'Orbitron, sans-serif', color: 'rgba(0, 200, 255, 0.6)', letterSpacing: '0.15em' }}>
              ⭐ FAVORITES
            </div>
            <div className="space-y-2">
              {FAVORITES.filter(f =>
                f.name.toLowerCase().includes(searchInput.toLowerCase())
              ).map((fav, i) => (
                <motion.button
                  key={fav.name}
                  className="w-full text-left rounded-lg p-2 transition-all"
                  style={{
                    background: selected?.name === fav.name ? 'rgba(0, 144, 208, 0.3)' : 'rgba(0, 144, 208, 0.05)',
                    border: `1px solid ${selected?.name === fav.name ? 'rgba(0, 200, 255, 0.6)' : 'rgba(0, 200, 255, 0.15)'}`,
                    cursor: 'pointer',
                    boxShadow: selected?.name === fav.name ? '0 0 10px rgba(0, 200, 255, 0.2)' : 'none',
                  }}
                  whileHover={{ scale: 1.02, background: 'rgba(0, 144, 208, 0.15)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFavorite(fav)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '16px' }}>{fav.emoji}</span>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: '#00C8FF', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {fav.name}
                      </div>
                      <div style={{ fontSize: '9px', color: 'rgba(0, 200, 255, 0.4)', fontFamily: 'Orbitron, sans-serif' }}>
                        {fav.era}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Coordinate display */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="rounded-xl p-3"
                style={{ background: 'rgba(0, 12, 40, 0.7)', border: '1px solid rgba(57, 255, 20, 0.3)' }}
              >
                <div className="text-xs mb-2" style={{ fontFamily: 'Orbitron, sans-serif', color: '#39FF14', letterSpacing: '0.15em' }}>
                  📡 COORDINATES
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'rgba(0, 200, 255, 0.5)' }}>LAT:</span>
                    <span style={{ color: '#00C8FF', fontFamily: 'Orbitron, sans-serif', fontSize: '10px' }}>
                      {selected.lat.toFixed(4)}°
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'rgba(0, 200, 255, 0.5)' }}>LNG:</span>
                    <span style={{ color: '#00C8FF', fontFamily: 'Orbitron, sans-serif', fontSize: '10px' }}>
                      {selected.lng.toFixed(4)}°
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Map area */}
        <motion.div
          className="flex-1 relative rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(0, 200, 255, 0.3)', minHeight: '300px' }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Portal door overlay */}
          <AnimatePresence>
            {!isPortalOpen && (
              <motion.div
                className="absolute inset-0 z-50 flex items-center justify-center"
                style={{ background: 'rgba(0, 0, 0, 0.95)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="rounded-2xl flex flex-col items-center justify-center"
                  style={{
                    width: '160px', height: '280px',
                    background: 'linear-gradient(180deg, #00FFFF 0%, #0090D0 100%)',
                    boxShadow: '0 0 60px rgba(0, 200, 255, 0.8)',
                    border: '4px solid rgba(0, 200, 255, 0.9)',
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <span style={{ fontSize: '48px' }}>🚪</span>
                  <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: 'white', textAlign: 'center' }}>
                    OPENING PORTAL...
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map instructions overlay */}
          <div className="absolute top-3 left-3 right-3 z-10 flex justify-between items-start pointer-events-none">
            <div className="px-3 py-1.5 rounded-lg text-xs" style={{
              background: 'rgba(0, 12, 40, 0.85)',
              border: '1px solid rgba(0, 200, 255, 0.3)',
              color: 'rgba(0, 200, 255, 0.7)',
              backdropFilter: 'blur(10px)',
            }}>
              🖱️ Click anywhere to set destination
            </div>
            {selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1.5 rounded-lg text-xs"
                style={{
                  background: 'rgba(57, 255, 20, 0.15)',
                  border: '1px solid rgba(57, 255, 20, 0.5)',
                  color: '#39FF14',
                  backdropFilter: 'blur(10px)',
                }}
              >
                ✅ LOCKED
              </motion.div>
            )}
          </div>

          <MapContainer
            center={mapCenter}
            zoom={3}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            <MapClickHandler onLocationSelect={handleLocationSelect} />
            {selected && (
              <Marker position={[selected.lat, selected.lng]} icon={customIcon}>
                <Popup>
                  <div style={{ fontFamily: 'Space Grotesk', color: '#00C8FF', background: 'transparent' }}>
                    <strong>📍 {selected.name}</strong><br/>
                    <small>{selected.lat.toFixed(4)}°N, {selected.lng.toFixed(4)}°E</small>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Holographic overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(transparent 95%, rgba(0, 200, 255, 0.05) 100%)',
            backgroundSize: '100% 3px',
          }} />

          {/* Corner frame */}
          {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-5 h-5 pointer-events-none`} style={{
              borderTop: i < 2 ? '2px solid rgba(0, 200, 255, 0.6)' : 'none',
              borderBottom: i >= 2 ? '2px solid rgba(0, 200, 255, 0.6)' : 'none',
              borderLeft: i % 2 === 0 ? '2px solid rgba(0, 200, 255, 0.6)' : 'none',
              borderRight: i % 2 === 1 ? '2px solid rgba(0, 200, 255, 0.6)' : 'none',
            }} />
          ))}
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.div
        className="flex gap-3 mt-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className="px-6 py-3 rounded-xl text-sm"
          style={{
            fontFamily: 'Orbitron, sans-serif',
            background: 'rgba(0, 12, 40, 0.7)',
            border: '1px solid rgba(0, 200, 255, 0.3)',
            color: 'rgba(0, 200, 255, 0.7)',
            cursor: 'pointer',
            letterSpacing: '0.1em',
          }}
          whileHover={{ background: 'rgba(0, 12, 40, 0.9)', borderColor: 'rgba(0, 200, 255, 0.6)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
        >
          ◀ BACK
        </motion.button>
        <motion.button
          className="flex-1 py-3 rounded-xl font-bold relative overflow-hidden"
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '14px',
            letterSpacing: '0.2em',
            background: selected
              ? 'linear-gradient(135deg, rgba(0, 90, 142, 0.8), rgba(0, 144, 208, 0.8))'
              : 'rgba(0, 12, 40, 0.6)',
            border: `1px solid ${selected ? 'rgba(0, 200, 255, 0.6)' : 'rgba(0, 200, 255, 0.2)'}`,
            color: selected ? '#00FFFF' : 'rgba(0, 200, 255, 0.3)',
            boxShadow: selected ? '0 0 30px rgba(0, 200, 255, 0.3)' : 'none',
            cursor: 'pointer',
          }}
          whileHover={selected ? { boxShadow: '0 0 50px rgba(0, 200, 255, 0.6)' } : {}}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
        >
          {selected && (
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}
          SET TEMPORAL COORDINATES ▶
        </motion.button>
      </motion.div>
    </div>
  );
}
