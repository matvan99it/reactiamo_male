import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export default function ElasticShape() {
  // Posizione del trascinamento
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Calcoliamo lo "stretch" (scala) basandoci sulla distanza dal punto di origine
  // Se trascini di 200px, l'oggetto si allunga del 50% (1.5)
  const scaleX = useTransform(dragX, [-200, 0, 200], [1.5, 1, 1.5]);
  const scaleY = useTransform(dragY, [-200, 0, 200], [1.5, 1, 1.5]);

  // Configuriamo il rimbalzo (molla)
  const springConfig = { damping: 10, stiffness: 100 };
  const springX = useSpring(dragX, springConfig);
  const springY = useSpring(dragY, springConfig);

  return (
    <div style={{ height: '80vh', position: 'relative', overflow: 'hidden', background: '#1a1a1a' }}>
      <h3 style={{ color: 'white', padding: '20px' }}>Trascina il cerchio e rilascia!</h3>

      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Torna sempre al centro
        dragElastic={0.6} // Resistenza al trascinamento
        onDrag={(e, info) => {
          dragX.set(info.offset.x);
          dragY.set(info.offset.y);
        }}
        onDragEnd={() => {
          dragX.set(0);
          dragY.set(0);
        }}
        whileHover={{ scale: 1.1, rotate: 5 }} // Movimento leggero al passaggio mouse
        style={{
          width: 100,
          height: 100,
          backgroundColor: '#646cff',
          borderRadius: '50%', // Diventa un cerchio
          position: 'absolute',
          top: '50px',
          right: '50px',
          cursor: 'grab',
          // ANCORAGGIO: definisce da dove parte la deformazione
          transformOrigin: 'top right', 
          x: springX,
          y: springY,
          scaleX,
          scaleY,
        }}
      />
    </div>
  );
}