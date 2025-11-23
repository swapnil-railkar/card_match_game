import { useEffect } from "react";
import confetti from 'canvas-confetti';

export default function Overlay({
  title,
  children,
  buttonText,
  playerWin,
  ...props
}) {
  useEffect(() => {
    if (!playerWin) return; // run confetti only when user wins

    // Burst confetti
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.6 },
    });

    // Falling confetti for 5 seconds
    const duration = 5000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        spread: 70,
        origin: { x: Math.random(), y: 0 },
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, [playerWin]);

  return (
    <main className="overlay">
      <h1 className="app-theme text">{title}</h1>
      {children}
      <button className="text" {...props}>
        {buttonText}
      </button>
    </main>
  );
}
