import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

export default function ElasticDeform() {
  // Valori di movimento
  const angle = useMotionValue(0);
  const distance = useMotionValue(0);

  // Configurazione molle (springs)
  const springConfig = { stiffness: 300, damping: 20 };
  const rotationSpring = useSpring(angle, springConfig);
  const stretchSpring = useSpring(useTransform(distance, [0, 300], [1, 1.6]), springConfig);
  const squashSpring = useSpring(useTransform(distance, [0, 300], [1, 0.7]), springConfig);

  const handlePan = (_: any, info: any) => {
    const { x, y } = info.offset;
    
    // Calcoliamo l'angolo solo se il mouse si è mosso un minimo (evita glitch allo 0)
    if (Math.abs(x) > 1 || Math.abs(y) > 1) {
      const degrees = Math.atan2(y, x) * (180 / Math.PI);
      angle.set(degrees);
    }

    // Calcoliamo la distanza
    const dist = Math.sqrt(x * x + y * y);
    distance.set(Math.min(dist, 350));
  };

  const handlePanEnd = () => {
    distance.set(0);
    // Non resettiamo l'angolo, così rimane orientato verso l'ultimo punto
  };

  return (
    <div style={{ 
      height: '80vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      background: '#111',
      touchAction: 'none' // Evita scroll su mobile mentre trascini
    }}>
      
      {/* 1. CONTENITORE DI ROTAZIONE: Ruota tutto il sistema verso il mouse */}
      <motion.div
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        style={{
          width: 100,
          height: 100,
          rotate: rotationSpring,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'grab',
          position: 'relative'
        }}
      >
        
        {/* 2. ELEMENTO DI STRETCH: Si allunga solo in orizzontale rispetto al padre ruotato */}
        <motion.div
          style={{
            width: 100,
            height: 100,
            backgroundColor: '#00d2ff',
            borderRadius: '50%',
            scaleX: stretchSpring, // Si allunga
            scaleY: squashSpring,  // Si assottiglia
            boxShadow: '0 0 40px rgba(0, 210, 255, 0.4)',
            pointerEvents: 'none'  // Lasciamo che sia il padre a gestire il drag
          }}
        />

        {/* Puntino centrale per riferimento visivo */}
        <div style={{
          position: 'absolute',
          width: 6,
          height: 6,
          background: 'white',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

      </motion.div>

      <p style={{ position: 'absolute', bottom: 50, color: '#666' }}>
        Clicca il cerchio e trascina in ogni direzione
      </p>
    </div>
  );
}