import { useRef, useEffect, type CSSProperties } from "react";

export default function StretchDeform3() {
  const ballRef = useRef<HTMLDivElement>(null);
  const anchorVisualRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const maxStretch = 1.3; // Stretch massimo (30% in più)
  const clipStart = 1.3; // Quando iniziare a tagliare il cerchio

  const updateVisualAnchor = () => {
    const ball = ballRef.current;
    const visual = anchorVisualRef.current;
    if (!ball || !visual) return { x: 0, y: 0 };

    const rect = ball.getBoundingClientRect();
    const x = rect.left + rect.width * 0.8;
    const y = rect.top + rect.height * 0.2;

    visual.style.left = `${x - 4}px`;
    visual.style.top = `${y - 4}px`;

    return { x, y };
  };

  const handleMove = (mouseX: number, mouseY: number) => {
    const ball = ballRef.current;
    if (!ball) return;

    const anchor = updateVisualAnchor();
    const dx = mouseX - anchor.x;
    const dy = mouseY - anchor.y;

    // Rotazione limitata
    let angleRad = Math.atan2(dy, dx) + Math.PI;
    let degrees = (angleRad * 180) / Math.PI;
    if (degrees > 180) degrees -= 360;
    const limitedDegrees = Math.max(-45, Math.min(45, degrees));
    const finalRad = (limitedDegrees * Math.PI) / 180;

    // Calcolo distanza e stretch limitato
    const distance = Math.sqrt(dx * dx + dy * dy);
    const stretch = 1 + Math.min(distance / 400, maxStretch - 1);
    const squash = 2 - stretch; // Mantiene quasi cerchio

    // Applica clip se oltre il limite
    if (stretch >= clipStart) {
      ball.style.overflow = "hidden";
      // Taglio netto sul lato destro
      const excess = stretch - clipStart;
      const clipPercent = (excess / stretch) * 50;
      ball.style.clipPath = `inset(0 ${clipPercent}% 0 0)`;
    } else {
      ball.style.clipPath = "none";
    }

    ball.style.transform = `rotate(${finalRad}rad) scaleX(${stretch}) scaleY(${squash})`;
  };

  const mouseMove = (e: MouseEvent) => {
    if (dragging.current) handleMove(e.clientX, e.clientY);
  };

  const mouseUp = () => {
    const ball = ballRef.current;
    if (!ball) return;

    dragging.current = false;
    ball.classList.remove("dragging");
    ball.style.transform = "rotate(0deg) scale(1)";
    ball.style.clipPath = "none";
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
    const ball = ballRef.current;
    if (!ball) return;

    dragging.current = true;
    ball.classList.add("dragging");
  };

  // Stili inline TypeScript
  const canvasStyle: CSSProperties = {
    margin: 0,
    height: "100vh",
    width: "100vw",
    maxWidth: "100%",
    background: "#0e0e0e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    touchAction: "none",
    position: "relative",
  };

  const ballStyle: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100px",
    height: "100px",
    backgroundColor: "#00d2ff",
    borderRadius: "50%",
    cursor: "grab",
    transformOrigin: "80% 20%",
    transition: "transform 0.6s cubic-bezier(0.25, 1.5, 0.5, 1)",
    boxShadow: "0 0 30px rgba(0, 210, 255, 0.3)",
    transform: "translate(-50%, -50%)",
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
      <div ref={ballRef} style={ballStyle} onMouseDown={mouseDown}></div>
    </div>
  );
}