import { Easing } from 'react-native-reanimated';

export const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
export const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);
export const PRESS_SCALE = 0.97;
export const PRESS_MS = 120;
export const STATE_MS = 150;
export const ENTER_MS = 300;
export const ENTER_FROM_SCALE = 0.95;
export const STAGGER_MS = [0, 50, 90, 120];
export const SPRING_SETTLE = { duration: 400, dampingRatio: 1 };

export const REPLY_FADE_MS = 200;
export const REPLY_DELAY_MS = 200;
export const PROGRESS_MS = 250;

export function staggerAt(i: number) {
  const last = STAGGER_MS[STAGGER_MS.length - 1];
  return i < STAGGER_MS.length ? STAGGER_MS[i] : last + (i - STAGGER_MS.length + 1) * 25;
}
