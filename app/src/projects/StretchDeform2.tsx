import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export default function StretchDeform2() {
  const ballRef = useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });

  const angle = useMotionValue(0);
  const distance = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 20 };
  const rotationSpring = useSpring(angle, springConfig);
  const stretchSpring = useSpring(useTransform(distance, [0, 400], [1, 2.5]), springConfig);
  const squashSpring = useSpring(useTransform(distance, [0, 400], [1, 0.7]), springConfig);

  useEffect(() => {
    const update = () => {
      if (ballRef.current) {
        const rect = ballRef.current.getBoundingClientRect();
        // Calcolo ancora all'interno (80% X, 20% Y)
        setAnchor({
          x: rect.left + rect.width * 0.8,
          y: rect.top + rect.height * 0.2
        });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handlePan = (_: any, info: any) => {
    const dx = info.point.x - anchor.x;
    const dy = info.point.y - anchor.y;

    // Angolo con offset di 180° per la direzione
    let degrees = (Math.atan2(dy, dx) * 180) / Math.PI + 180;
    
    // Normalizzazione per il limite +-45
    if (degrees > 180) degrees -= 360;
    const limitedDegrees = Math.max(-45, Math.min(45, degrees));
    
    angle.set(limitedDegrees);

    const dist = Math.sqrt(dx * dx + dy * dy);
    distance.set(Math.min(dist, 400));
  };

  return (
    <div style={{ height: '80vh', background: '#111', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      <motion.div
        ref={ballRef}
        onPan={handlePan}
        onPanEnd={() => {
          distance.set(0);
          angle.set(0);
        }}
        style={{
          width: 120,
          height: 120,
          backgroundColor: '#00d2ff',
          borderRadius: '50%',
          cursor: 'grab',
          // ANCORA INTERNA
          transformOrigin: '80% 20%', 
          rotate: rotationSpring,
          scaleX: stretchSpring,
          scaleY: squashSpring,
          boxShadow: '0 0 40px rgba(0, 210, 255, 0.3)',
          touchAction: 'none'
        }}
      >
        {/* Pallino ancora interno (opzionale) */}
        <div style={{
          position: 'absolute',
          right: '20%',
          top: '20%',
          width: 6,
          height: 6,
          background: '#ff0055',
          borderRadius: '50%',
          transform: 'translate(50%, -50%)'
        }} />
      </motion.div>

      <p style={{ position: 'absolute', bottom: 20, color: '#444' }}>
        Ancora interna (80%, 20%) | Rotazione Max ±45°
      </p>
    </div>
  );
}