export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);