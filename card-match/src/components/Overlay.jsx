import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export default function Overlay({
  title,
  children,
  buttonText,
  playerWin,
  ...props
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!playerWin) return;

    const myCanvas = canvasRef.current;

    // Get a confetti instance that draws ONLY inside this canvas
    const myConfetti = confetti.create(myCanvas, {
      resize: true, // automatically resize the canvas
      useWorker: true, // better performance
    });

    // Burst confetti
    myConfetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.6 },
    });

    // Falling confetti for 5 seconds
    const duration = 5000;
    const end = Date.now() + duration;

    (function frame() {
      myConfetti({
        particleCount: 5,
        spread: 70,
        origin: { x: Math.random(), y: 0 },
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, [playerWin]);

  return (
    <div className="overlay-backdrop">
      <main className="overlay">
        <canvas
          ref={canvasRef}
          className="overlay-confetti"
        />
        <h1 className="app-theme text">{title}</h1>
        {children}
        <button className="text" {...props}>
          {buttonText}
        </button>
      </main>
    </div>
  );
}
