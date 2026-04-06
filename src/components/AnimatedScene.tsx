import { useFrame, useThree } from "@react-three/fiber";
import { Cloud, OrbitControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import type { Group } from "three";
import { Color, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

// Constants & Utils
import { clamp, lerp, easeOutCubic } from "../utils";
import * as C from "../constants"; // Import all constants as namespace C for cleanliness

// Models
import { Candle } from "../models/candle";
import HeartCake from "../models/HeartCake";
import { PictureFrame } from "../models/pictureFrame";
import { Fireworks } from "./Fireworks";
import { BirthdayCard } from "./BirthdayCard";
import RomanticTable from "../models/RomanticTable";
import Peonies from "../models/Peonies";
import Tyson from "../models/Tyson";

import { Leva, useControls } from 'leva'
import Peter from "../models/Peter";
import Coco from "../models/Coco";
import Cloudy from "../models/Cloudy";

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
  onTysonPress?: () => void;
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
  fireworksActive,
  onTysonPress,
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
  const scene = useThree((state) => state.scene);

  const { cloudyPos, cloudyRot, cloudyScale } = useControls('Cloudy', {
    cloudyPos: { value: [-9.5, 0.6, -1.2], min: -20, max: 20, step: 0.01 },
    cloudyRot: { value: [0, 2.3, 0], min: -Math.PI, max: Math.PI, step: 0.01 },
    cloudyScale: { value: 8.1, min: 0, max: 20, step: 0.01 },
  });

  const { peterPos, peterRot, peterScale } = useControls('Peter', {
    peterPos: { value: [-9.5, 0.6, -1.2], min: -20, max: 20, step: 0.01 },
    peterRot: { value: [0, 2.3, 0], min: -Math.PI, max: Math.PI, step: 0.01 },
    peterScale: { value: 8.1, min: 0, max: 20, step: 0.01 },
  });

  const { cocoPos, cocoRot, cocoScale } = useControls('Coco', {
    cocoPos: { value: [-9.5, 0.6, -1.2], min: -20, max: 20, step: 0.01 },
    cocoRot: { value: [0, 2.3, 0], min: -Math.PI, max: Math.PI, step: 0.01 },
    cocoScale: { value: 8.1, min: 0, max: 20, step: 0.01 },
  });

  useEffect(() => {
    scene.background = new Color("#050505");
    onBackgroundFadeChange?.(backgroundOpacityRef.current);
    onEnvironmentProgressChange?.(environmentProgressRef.current);
    return () => {
      scene.background = null;
    };
  }, [scene, onBackgroundFadeChange, onEnvironmentProgressChange]);

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
      <Fireworks isActive={fireworksActive} origin={[0, 10, 0]} />
      <ConfiguredOrbitControls />

      <group ref={tableGroup}>
        <RomanticTable position={[-3.4, -14.8, 0.2]} scale={6.5} />
        <PictureFrame image="/mine.png" position={[0, 0.735, 3]} rotation={[0, 5.6, 0]} scale={0.75} />
        <PictureFrame image="/mine.png" position={[0, 0.735, -3]} rotation={[0, 4.0, 0]} scale={0.75} />
        <PictureFrame image="/mine.png" position={[-1.5, 0.735, 2.5]} rotation={[0, 5.4, 0]} scale={0.75} />
        <PictureFrame image="/mine.png" position={[-1.5, 0.735, -2.5]} rotation={[0, 4.2, 0]} scale={0.75} />
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
        {/* <HelloKitty position={[-3.2, 2.4, 4.8]} rotation={[0, 2.41, 0]} scale={2.4} /> */}
        <Peonies position={[-0.9, 0.7, 4.6]} rotation={[0, 5, 0]} scale={5.3} />
        <Peter position={peterPos} rotation={peterRot} scale={peterScale} />
        <Cloudy position={cloudyPos} rotation={cloudyRot} scale={cloudyScale} />
        <Coco position={cocoPos} rotation={cocoRot} scale={cocoScale} />
        <group onPointerDown={(e) => { e.stopPropagation(); onTysonPress?.(); }}>
           <Tyson position={[-9.5, 0.6, -1.2]} rotation={[0, 2.3, 0]} scale={8.1} />
        </group>
      </group>

      <group ref={cakeGroup}>
        <HeartCake position={[-0.3, 0.1, 0]} rotation={[0, 1.6, 0]} scale={1.4} />
      </group>

      <group ref={candleGroup} onPointerDown={(e) => { e.stopPropagation(); onCandlePress?.(); }}>
        <Candle isLit={candleLit} scale={0.25} position={[-0.5, 0.97, 0.04]} />
      </group>
    </>
  );
}