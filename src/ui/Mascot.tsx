import { useEffect } from 'react';
import { ImageSourcePropType, StyleProp, ImageStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { mascotPeekSky } from './art';

const BREATH_MS = 1600; // half of the 3.2 s loop

// The mascot, breathing gently (scale 1 to 1.015). Still under reduced motion. `nod` plays one small nod when it changes.
export function Mascot({ source = mascotPeekSky, style, nod = 0 }: { source?: ImageSourcePropType; style?: StyleProp<ImageStyle>; nod?: number }) {
  const reduced = useReducedMotion();
  const breath = useSharedValue(0);
  const tilt = useSharedValue(0);

  useEffect(() => {
    if (reduced) return;
    breath.value = withRepeat(withTiming(1, { duration: BREATH_MS, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [reduced, breath]);

  useEffect(() => {
    if (!nod || reduced) return;
    tilt.value = withSequence(withTiming(1, { duration: 140 }), withTiming(-0.5, { duration: 140 }), withTiming(0, { duration: 160 }));
  }, [nod, reduced, tilt]);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + 0.015 * breath.value }, { rotate: `${tilt.value * 4}deg` }, { translateY: tilt.value * 3 }],
  }));

  return <Animated.Image source={source} style={[style, anim]} resizeMode="contain" accessibilityIgnoresInvertColors accessible={false} />;
}
