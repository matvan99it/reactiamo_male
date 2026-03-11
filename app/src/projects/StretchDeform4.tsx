import { useRef, useEffect, type CSSProperties } from "react";

export default function StretchDeform4() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stretchRef = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);
  const anchorVisualRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // Parametri
  const maxStretch = 1.5; // Stretch massimo (50%)
  const anchorOffsetX = 0.6; // Ancora interna, 60% dalla sinistra
  const anchorOffsetY = 0.4; // 40% dall'alto

  const updateVisualAnchor = () => {
    const container = containerRef.current;
    const visual = anchorVisualRef.current;
    if (!container || !visual) return { x: 0, y: 0 };

    const rect = container.getBoundingClientRect();
    const x = rect.left + rect.width * anchorOffsetX;
    const y = rect.top + rect.height * anchorOffsetY;

    visual.style.left = `${x - 4}px`;
    visual.style.top = `${y - 4}px`;

    return { x, y };
  };

  const handleMove = (mouseX: number, mouseY: number) => {
    const stretch = stretchRef.current;
    if (!stretch) return;

    const anchor = updateVisualAnchor();
    const dx = mouseX - anchor.x;
    const dy = mouseY - anchor.y;

    // Rotazione limitata
    let angleRad = Math.atan2(dy, dx) + Math.PI;
    let degrees = (angleRad * 180) / Math.PI;
    if (degrees > 180) degrees -= 360;
    const limitedDegrees = Math.max(-45, Math.min(45, degrees));
    const finalRad = (limitedDegrees * Math.PI) / 180;

    // Stretch limitato
    const distance = Math.sqrt(dx * dx + dy * dy);
    const stretchVal = 1 + Math.min(distance / 400, maxStretch - 1);
    const squash = 2 - stretchVal; // Mantiene quasi cerchio

    stretch.style.transform = `rotate(${finalRad}rad) scaleX(${stretchVal}) scaleY(${squash})`;
  };

  const mouseMove = (e: MouseEvent) => {
    if (dragging.current) handleMove(e.clientX, e.clientY);
  };

  const mouseUp = () => {
    const stretch = stretchRef.current;
    if (!stretch) return;
    dragging.current = false;
    stretch.style.transform = "rotate(0deg) scale(1)";
  };

  useEffect(() => {
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);

    updateVisualAnchor();
    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, []);

  const mouseDown = () => {
    dragging.current = true;
  };

  // STILI
  const canvasStyle: CSSProperties = {
    margin: 0,
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0e0e0e",
    overflow: "hidden",
    position: "relative",
  };

  const containerStyle: CSSProperties = {
    position: "relative",
    width: "120px",
    height: "120px",
  };

  const stretchStyle: CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#00d2ff",
    borderRadius: "50%",
    transformOrigin: `${anchorOffsetX * 100}% ${anchorOffsetY * 100}%`,
    cursor: "grab",
    boxShadow: "0 0 30px rgba(0,210,255,0.3)",
    clipPath: "inset(0 50% 0 0)", // metà destra stretchabile
  };

  const staticStyle: CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#00d2ff",
    borderRadius: "50%",
    clipPath: "inset(0 0 0 50%)", // metà sinistra statica
  };

  const anchorStyle: CSSProperties = {
    position: "absolute",
    width: "8px",
    height: "8px",
    background: "#ff0055",
    borderRadius: "50%",
    zIndex: 100,
    pointerEvents: "none",
  };

  return (
    <div style={canvasStyle}>
      <div ref={anchorVisualRef} style={anchorStyle}></div>
      <div ref={containerRef} style={containerStyle} onMouseDown={mouseDown}>
        <div ref={staticRef} style={staticStyle}></div>
        <div ref={stretchRef} style={stretchStyle}></div>
      </div>
    </div>
  );
}