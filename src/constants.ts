import { Vector3 } from "three";

// --- Animation Timings ---
export const CAKE_START_Y = 10;
export const CAKE_END_Y = 0;
export const CAKE_DESCENT_DURATION = 3;

export const TABLE_START_Z = 30;
export const TABLE_END_Z = 0;
export const TABLE_SLIDE_DURATION = 0.7;
export const TABLE_SLIDE_START = CAKE_DESCENT_DURATION - TABLE_SLIDE_DURATION - 0.1;

export const CANDLE_START_Y = 5;
export const CANDLE_END_Y = 0;
export const CANDLE_DROP_DURATION = 1.1;
export const CANDLE_DROP_START =
  Math.max(CAKE_DESCENT_DURATION, TABLE_SLIDE_START + TABLE_SLIDE_DURATION) + 1.0;

export const TOTAL_ANIMATION_TIME = CANDLE_DROP_START + CANDLE_DROP_DURATION;

export const BACKGROUND_FADE_DURATION = 1;
export const BACKGROUND_FADE_OFFSET = 0;
export const BACKGROUND_FADE_END = Math.max(
  CANDLE_DROP_START - BACKGROUND_FADE_OFFSET,
  BACKGROUND_FADE_DURATION
);
export const BACKGROUND_FADE_START = Math.max(
  BACKGROUND_FADE_END - BACKGROUND_FADE_DURATION,
  0
);

// --- Orbit Controls ---
export const ORBIT_TARGET = new Vector3(0, 1, 0);
export const ORBIT_INITIAL_RADIUS = 3;
export const ORBIT_INITIAL_HEIGHT = 1;
export const ORBIT_INITIAL_AZIMUTH = Math.PI / 2;
export const ORBIT_MIN_DISTANCE = 2;
export const ORBIT_MAX_DISTANCE = 10;
export const ORBIT_MIN_POLAR = Math.PI * 0;
export const ORBIT_MAX_POLAR = Math.PI / 2;

// --- Text Content ---
export const TYPED_LINES = [
  "> Amanda",
  "...",
  "> today is your birthday!!!",
  "...",
  "> so i made you something special",
  "...",
  "˚ʚ♡ɞ˚ ˚ʚ♡ɞ˚ ˚ʚ♡ɞ˚ ˚ʚ♡ɞ˚",
];
export const TYPED_CHAR_DELAY = 100;
export const POST_TYPING_SCENE_DELAY = 1000;
export const CURSOR_BLINK_INTERVAL = 480;

// --- Cards Data ---
export type BirthdayCardConfig = {
  id: string;
  image: string;
  position: [number, number, number];
  rotation: [number, number, number];
};

export const BIRTHDAY_CARDS: ReadonlyArray<BirthdayCardConfig> = [
  {
    id: "confetti",
    image: "/mine.jpeg",
    position: [1, 0.081, -1.2],
    rotation: [-Math.PI / 2 , 0, 6],
  },
  {
    id: "angie",
    image: "/angie_card.jpeg",
    position: [2, 0.081, 0],
    rotation: [-Math.PI / 2 , 0, 1.6],
  },
  {
    id: "brother_sister",
    image: "/brother_sister.jpeg",
    position: [-0.7, 0.081, 1.9],
    rotation: [-Math.PI / 2 , 0, 8],
  },
  {
    id: "izzy",
    image: "/izzy.jpeg",
    position: [0.4, 0.081, 1.8],
    rotation: [-Math.PI / 2 , 0, 1],
  },
  {
    id: "niece",
    image: "/niece.jpeg",
    position: [2, 0.092, -1.4],
    rotation: [-Math.PI / 2 , 0, 2],
  },
  {
    id: "marriah",
    image: "/marriah.JPG",
    position: [0.9, 0.095, -2.19],
    rotation: [-Math.PI / 2 , 0, 2.5],
  },
  {
    id: "smile",
    image: "/mine2.jpg",
    position: [-6, 0.23, -1.1],
    rotation: [-Math.PI / 2 , 0, 6],
  },
];