import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function ElasticStretch() {
  // Valori per tracciare la distanza del cursore
  const distanceX = useMotionValue(0);
  const distanceY = useMotionValue(0);

  // Configuriamo una molla per rendere il ritorno fluido e "rimbalzante"
  const springConfig = { damping: 15, stiffness: 150 };
  const scaleX = useSpring(useTransform(distanceX, [0, -300], [1, 1.5]), springConfig);
  const scaleY = useSpring(useTransform(distanceY, [0, 300], [1, 1.5]), springConfig);

  return (
    <div style={{ 
      height: '80vh', 
      position: 'relative', 
      background: '#1a1a1a', 
      overflow: 'hidden',
      cursor: 'crosshair' 
    }}>
      <h3 style={{ color: 'white', padding: '20px' }}>
        Clicca e trascina verso sinistra/basso per stretchare (Max 50%)
      </h3>

      <motion.div
        // Evento mentre trascini (ma non muoviamo l'oggetto)
        onPan={(e, info) => {
          // info.offset contiene la distanza percorsa dal mouse dal punto del click
          // Limitiamo il valore tra 0 e -300 (per lo stretch verso sinistra)
          distanceX.set(Math.max(-300, Math.min(0, info.offset.x)));
          distanceY.set(Math.max(0, Math.min(300, info.offset.y)));
        }}
        onPanEnd={() => {
          // Quando rilasci, torna a 0 (dimensione originale)
          distanceX.set(0);
          distanceY.set(0);
        }}
        whileHover={{ scale: 1.05 }} // Leggero movimento al passaggio
        style={{
          width: 150,
          height: 150,
          backgroundColor: '#ff0055',
          borderRadius: '50%',
          position: 'absolute',
          top: '50px',
          right: '50px',
          // ANCORAGGIO FISSO
          transformOrigin: 'top right',
          scaleX,
          scaleY,
          cursor: 'pointer',
        }}
      />
    </div>
  );
}