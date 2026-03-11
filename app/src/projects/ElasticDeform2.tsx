import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export default function ElasticDeform2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });

  const angle = useMotionValue(0);
  const distance = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 20 };
  const rotationSpring = useSpring(angle, springConfig);
  const stretchSpring = useSpring(useTransform(distance, [0, 400], [1, 2.5]), springConfig);
  const squashSpring = useSpring(useTransform(distance, [0, 400], [1, 0.6]), springConfig);

  // Calcoliamo la posizione dell'ancora visiva
  useEffect(() => {
    const update = () => {
      const el = document.getElementById('anchor-point');
      if (el) {
        const rect = el.getBoundingClientRect();
        setAnchor({ x: rect.left, y: rect.top });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handlePan = (_: any, info: any) => {
    // Distanza tra mouse e il punto fisso (pallino rosso)
    const dx = info.point.x - anchor.x;
    const dy = info.point.y - anchor.y;

    // CALCOLO ANGOLO + INVERSIONE (180°)
    // Aggiungiamo 180 gradi perché l'origine 'right top' scala verso sinistra
    const degrees = Math.atan2(dy, dx) * (180 / Math.PI) + 180;
    angle.set(degrees);

    const dist = Math.sqrt(dx * dx + dy * dy);
    distance.set(Math.min(dist, 400));
  };

  return (
    <div ref={containerRef} style={{ 
      height: '80vh', background: '#111', position: 'relative', overflow: 'hidden' 
    }}>
      
      {/* 1. L'ANCORA FISSA (Top-Right rispetto al cerchio) */}
      <div 
        id="anchor-point"
        style={{
          position: 'absolute',
          top: '150px',
          right: '150px',
          width: '12px',
          height: '12px',
          background: '#ff0055',
          borderRadius: '50%',
          zIndex: 100,
          transform: 'translate(50%, -50%)' // Centra perfettamente sull'angolo
        }}
      />

      {/* 2. IL CERCHIO */}
      <motion.div
        onPan={handlePan}
        onPanEnd={() => distance.set(0)}
        style={{
          position: 'absolute',
          top: '150px',
          right: '150px',
          width: '100px',
          height: '100px',
          backgroundColor: '#00d2ff',
          borderRadius: '50%',
          // L'ANCORAGGIO CHE VOLEVI
          transformOrigin: 'right top', 
          rotate: rotationSpring,
          scaleX: stretchSpring,
          scaleY: squashSpring,
          cursor: 'grab',
          boxShadow: '0 0 30px rgba(0, 210, 255, 0.3)',
          touchAction: 'none'
        }}
      />

      <div style={{ position: 'absolute', bottom: 20, width: '100%', textAlign: 'center', color: '#666' }}>
        <p>Ora si allunga seguendo il mouse dall'ancora in alto a destra!</p>
      </div>
    </div>
  );
}