import { useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import type { Group } from "three";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

// Constants & Utils
import { clamp, lerp, easeOutCubic } from "../utils";
import * as C from "../constants"; // Import all constants as namespace C for cleanliness

// Models
import { Candle } from "../models/candle";
import HeartCake from "../models/HeartCake";
import Chudette from "../models/Chuddette";
import { PictureFrame } from "../models/pictureFrame";
import { Fireworks } from "./Fireworks";
import { BirthdayCard } from "./BirthdayCard";
import RomanticTable from "../models/RomanticTable";
import Butters from "../models/Butter";
import Zuki from "../models/Zuki";
import Eric from "../models/Eric";
import HelloKitty from "../models/HelloKitty";
import Kuromi from "../models/Kuromi";
import Chud from "../models/Chud";
import Peonies from "../models/Peonies";
import Tyson from "../models/Tyson";

type AnimatedSceneProps = {
  isPlaying: boolean;
  onBackgroundFadeChange?: (opacity: number) => void;
  onEnvironmentProgressChange?: (progress: number) => void;
  candleLit: boolean;
  onAnimationComplete?: () => void;
  cards: ReadonlyArray<C.BirthdayCardConfig>;
  activeCardId: string | null;
  onToggleCard: (id: string) => void;
  onCandlePress?: () => void;
  onButtersPress?: () => void;
  onTysonPress?: () => void;
  onZukiPress?: () => void;
  onEricPress?: () => void;
  fireworksActive: boolean;
};

// --- Helper Components ---
function ConfiguredOrbitControls() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    const offset = new Vector3(
      Math.sin(C.ORBIT_INITIAL_AZIMUTH) * C.ORBIT_INITIAL_RADIUS,
      C.ORBIT_INITIAL_HEIGHT,
      Math.cos(C.ORBIT_INITIAL_AZIMUTH) * C.ORBIT_INITIAL_RADIUS
    );
    const cameraPosition = C.ORBIT_TARGET.clone().add(offset);
    camera.position.copy(cameraPosition);
    camera.lookAt(C.ORBIT_TARGET);

    const controls = controlsRef.current;
    if (controls) {
      controls.target.copy(C.ORBIT_TARGET);
      controls.update();
    }
  }, [camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={C.ORBIT_MIN_DISTANCE}
      maxDistance={C.ORBIT_MAX_DISTANCE}
      minPolarAngle={C.ORBIT_MIN_POLAR}
      maxPolarAngle={C.ORBIT_MAX_POLAR}
    />
  );
}

function EnvironmentBackgroundController({ intensity }: { intensity: number }) {
  const scene = useThree((state) => state.scene);
  useEffect(() => {
    if ("backgroundIntensity" in scene) {
      (scene as any).backgroundIntensity = intensity;
    }
  }, [scene, intensity]);
  return null;
}

// --- Main Component ---
export function AnimatedScene({
  isPlaying,
  onBackgroundFadeChange,
  onEnvironmentProgressChange,
  candleLit,
  onAnimationComplete,
  cards,
  activeCardId,
  onToggleCard,
  onCandlePress,
  onButtersPress,
  fireworksActive,
  onTysonPress,
  onZukiPress,
  onEricPress
}: AnimatedSceneProps) {
  const cakeGroup = useRef<Group>(null);
  const tableGroup = useRef<Group>(null);
  const candleGroup = useRef<Group>(null);
  const animationStartRef = useRef<number | null>(null);
  const hasPrimedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const completionNotifiedRef = useRef(false);
  const backgroundOpacityRef = useRef(1);
  const environmentProgressRef = useRef(0);

  useEffect(() => {
    onBackgroundFadeChange?.(backgroundOpacityRef.current);
    onEnvironmentProgressChange?.(environmentProgressRef.current);
  }, [onBackgroundFadeChange, onEnvironmentProgressChange]);

  const emitBackgroundOpacity = (value: number) => {
    const clamped = clamp(value, 0, 1);
    if (Math.abs(clamped - backgroundOpacityRef.current) > 0.005) {
      backgroundOpacityRef.current = clamped;
      onBackgroundFadeChange?.(clamped);
    }
  };

  const emitEnvironmentProgress = (value: number) => {
    const clamped = clamp(value, 0, 1);
    if (Math.abs(clamped - environmentProgressRef.current) > 0.005) {
      environmentProgressRef.current = clamped;
      onEnvironmentProgressChange?.(clamped);
    }
  };

  useFrame(({ clock }) => {
    const cake = cakeGroup.current;
    const table = tableGroup.current;
    const candle = candleGroup.current;

    if (!cake || !table || !candle) return;

    if (!hasPrimedRef.current) {
      cake.position.set(0, C.CAKE_START_Y, 0);
      table.position.set(0, 0, C.TABLE_START_Z);
      candle.position.set(0, C.CANDLE_START_Y, 0);
      candle.visible = false;
      hasPrimedRef.current = true;
    }

    if (!isPlaying) {
      emitBackgroundOpacity(1);
      emitEnvironmentProgress(0);
      animationStartRef.current = null;
      hasCompletedRef.current = false;
      completionNotifiedRef.current = false;
      return;
    }

    if (hasCompletedRef.current) {
      emitBackgroundOpacity(0);
      emitEnvironmentProgress(1);
      if (!completionNotifiedRef.current) {
        completionNotifiedRef.current = true;
        onAnimationComplete?.();
      }
      return;
    }

    if (animationStartRef.current === null) {
      animationStartRef.current = clock.elapsedTime;
    }

    const elapsed = clock.elapsedTime - animationStartRef.current;
    const clampedElapsed = clamp(elapsed, 0, C.TOTAL_ANIMATION_TIME);

    // Cake
    const cakeProgress = clamp(clampedElapsed / C.CAKE_DESCENT_DURATION, 0, 1);
    const cakeEase = easeOutCubic(cakeProgress);
    cake.position.y = lerp(C.CAKE_START_Y, C.CAKE_END_Y, cakeEase);
    cake.rotation.y = cakeEase * Math.PI * 2;

    // Table
    let tableZ = C.TABLE_START_Z;
    if (clampedElapsed >= C.TABLE_SLIDE_START) {
      const tableProgress = clamp((clampedElapsed - C.TABLE_SLIDE_START) / C.TABLE_SLIDE_DURATION, 0, 1);
      tableZ = lerp(C.TABLE_START_Z, C.TABLE_END_Z, easeOutCubic(tableProgress));
    }
    table.position.z = tableZ;

    // Candle
    if (clampedElapsed >= C.CANDLE_DROP_START) {
      if (!candle.visible) candle.visible = true;
      const candleProgress = clamp((clampedElapsed - C.CANDLE_DROP_START) / C.CANDLE_DROP_DURATION, 0, 1);
      candle.position.y = lerp(C.CANDLE_START_Y, C.CANDLE_END_Y, easeOutCubic(candleProgress));
    } else {
      candle.visible = false;
    }

    // Background
    if (clampedElapsed >= C.BACKGROUND_FADE_START) {
      const fadeProgress = clamp((clampedElapsed - C.BACKGROUND_FADE_START) / C.BACKGROUND_FADE_DURATION, 0, 1);
      const op = 1 - easeOutCubic(fadeProgress);
      emitBackgroundOpacity(op);
      emitEnvironmentProgress(1 - op);
    }

    if (clampedElapsed >= C.TOTAL_ANIMATION_TIME) {
      cake.position.set(0, C.CAKE_END_Y, 0);
      table.position.set(0, 0, C.TABLE_END_Z);
      candle.position.set(0, C.CANDLE_END_Y, 0);
      candle.visible = true;
      hasCompletedRef.current = true;
    }
  });


  return (
    <>
      <ambientLight intensity={(1 - environmentProgressRef.current) * 0.8} />
      <directionalLight intensity={1.4} position={[20, 10, 2]} color={[1, 0.9, 0.95]} />
      <Environment
        files={["/black.jpg"]}
        backgroundRotation={[0, 3.3, 0]}
        environmentRotation={[0, 3.3, 0]}
        background
        environmentIntensity={0.1 * environmentProgressRef.current}
        backgroundIntensity={0.7 * environmentProgressRef.current}
      />
      <EnvironmentBackgroundController intensity={1 * environmentProgressRef.current} />
      <Fireworks isActive={fireworksActive} origin={[0, 10, 0]} />
      <ConfiguredOrbitControls />

      <group ref={tableGroup}>
        <RomanticTable position={[-3.4, -14.8, 0.2]} scale={6.5} />
        <Chudette position={[1.6, -1.4, 1.8]} rotation={[0, -3.4, 0]} scale={10} />
        <Chud position={[-0.8, -0.0099, -2.3]} rotation={[0, 1.28, 0]} scale={1.9} />
        <PictureFrame image="/frame2.jpg" position={[0, 0.735, 3]} rotation={[0, 5.6, 0]} scale={0.75} />
        <PictureFrame image="/frame3.jpg" position={[0, 0.735, -3]} rotation={[0, 4.0, 0]} scale={0.75} />
        <PictureFrame image="/frame4.jpg" position={[-1.5, 0.735, 2.5]} rotation={[0, 5.4, 0]} scale={0.75} />
        <PictureFrame image="/frame1.jpg" position={[-1.5, 0.735, -2.5]} rotation={[0, 4.2, 0]} scale={0.75} />
        {cards.map((card) => (
          <BirthdayCard
            key={card.id}
            id={card.id}
            image={card.image}
            tablePosition={card.position}
            tableRotation={card.rotation}
            isActive={activeCardId === card.id}
            onToggle={onToggleCard}
          />
        ))}
        <group onPointerDown={(e) => { e.stopPropagation(); onEricPress?.(); }}>
          <Eric position={[-4.2, 1.9, -2.9]} rotation={[0, -5.2, 0]} scale={2} />
        </group>
        <HelloKitty position={[-3.2, 2.4, 4.8]} rotation={[0, 2.41, 0]} scale={2.4} />
        <Kuromi position={[-6.5, 2.4, 2.4]} rotation={[0, 2, 0]} scale={2.6} />
        <group onPointerDown={(e) => { e.stopPropagation(); onZukiPress?.(); }}>
          <Zuki position={[-2.8, 1.4, 2.5]} rotation={[0, -4.2, 0]} scale={1.9} />
        </group>
        <Peonies position={[-0.9, 0.7, 4.6]} rotation={[0, 5, 0]} scale={5.3} />
        <group onPointerDown={(e) => { e.stopPropagation(); onTysonPress?.(); }}>
           <Tyson position={[-9.5, 0.6, -1.2]} rotation={[0, 2.3, 0]} scale={8.1} />
        </group>
        <group onPointerDown={(e) => { e.stopPropagation(); onButtersPress?.(); }}>
          <Butters position={[-1.8, 2, -4.5]} rotation={[0, -5.5, 0]} scale={2} />
        </group>
      </group>

      <group ref={cakeGroup}>
        <HeartCake position={[-0.3, 0.6, 0]} rotation={[0, 0.7, 0]} scale={1.4} />
      </group>

      <group ref={candleGroup} onPointerDown={(e) => { e.stopPropagation(); onCandlePress?.(); }}>
        <Candle isLit={candleLit} scale={0.25} position={[-0.3, 1.37, 0]} />
      </group>
    </>
  );
}