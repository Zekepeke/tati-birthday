import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useState } from "react";
import { AnimatedScene } from "./components/AnimatedScene";
import { TypingOverlay } from "./components/TypingOverlay";
import { useAudio, useSound } from "./hooks/useAudio";
import { BIRTHDAY_CARDS } from "./constants";
import "./App.css";

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [sceneStarted, setSceneStarted] = useState(false);
  const [backgroundOpacity, setBackgroundOpacity] = useState(1);
  const [hasAnimationCompleted, setHasAnimationCompleted] = useState(false);
  const [isCandleLit, setIsCandleLit] = useState(true);
  const [fireworksActive, setFireworksActive] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // Custom Hook for Music
  const { musicOn, toggleMusic, playMusic } = useAudio("/Piel_Canela.mp3");
  const playTyson = useSound("/tyson.mp3"); 
  const playButters = useSound("/butters_voice.mp3");
  const playZuki = useSound("/zuki_sound.mp3");
  const playEric = useSound("/eric.mp3");

  const startExperience = useCallback(() => {
    if (hasStarted) return;
    playMusic();
    setHasStarted(true);
  }, [hasStarted, playMusic]);

  const blowOutCandle = useCallback(() => {
    if (!hasAnimationCompleted || !isCandleLit) return;
    setIsCandleLit(false);
    setFireworksActive(true);
  }, [hasAnimationCompleted, isCandleLit]);

  // Handle Interactions (Keyboard & Touch)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.key !== " ") return;
      e.preventDefault();
      if (!hasStarted) startExperience();
      else blowOutCandle();
    };

    const handlePointerStart = (e: Event) => {
      if (hasStarted) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("button")) return;
      startExperience();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerStart);
    window.addEventListener("touchstart", handlePointerStart);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerStart);
      window.removeEventListener("touchstart", handlePointerStart);
    };
  }, [hasStarted, startExperience, blowOutCandle]);

  return (
    <div className="App">
      <TypingOverlay 
        hasStarted={hasStarted} 
        onTypingComplete={() => setSceneStarted(true)}
        backgroundOpacity={backgroundOpacity}
      />

      {hasAnimationCompleted && isCandleLit && (
        <div className="hint-overlay">Press space or tap the candle (or cards)</div>
      )}

      <Canvas
        gl={{ alpha: true }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => gl.setClearColor("#000000", 0)}
      >
        <Suspense fallback={null}>
          <AnimatedScene
            isPlaying={hasStarted && sceneStarted}
            candleLit={isCandleLit}
            fireworksActive={fireworksActive}
            onBackgroundFadeChange={setBackgroundOpacity}
            onAnimationComplete={() => setHasAnimationCompleted(true)}
            cards={BIRTHDAY_CARDS}
            activeCardId={activeCardId}
            onToggleCard={(id) => setActiveCardId((prev) => (prev === id ? null : id))}
            onCandlePress={blowOutCandle}
            onButtersPress={playButters}
            onTysonPress={playTyson}
            onZukiPress={playZuki}
            onEricPress={playEric}
          />
        </Suspense>
      </Canvas>

      {/* Music Control UI */}
      <div style={{
          position: "fixed", top: 16, right: 16, zIndex: 9999, display: "flex", 
          alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 999, 
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", color: "white", 
          fontFamily: "system-ui, -apple-system, sans-serif", userSelect: "none"
        }}>
        <span style={{ fontSize: 13, opacity: 0.9 }}>Music</span>
        <button
          onClick={toggleMusic}
          style={{
            width: 46, height: 28, borderRadius: 999, cursor: "pointer", border: "1px solid rgba(255,255,255,0.35)",
            background: musicOn ? "rgba(255, 105, 180, 0.85)" : "rgba(255,255,255,0.18)", position: "relative"
          }}
        >
          <span style={{
              position: "absolute", top: 3, left: musicOn ? 22 : 3, width: 22, height: 22, 
              borderRadius: "50%", background: "white", transition: "left 180ms ease"
            }} />
        </button>
      </div>
    </div>
  );
}