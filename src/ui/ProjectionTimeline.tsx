import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { TimelineNode } from '@/lib/projectionTimeline';
import { colors, FONT_CAP } from '@/theme/tokens';
import { Icon } from './Icon';
import { WeekDots } from './WeekDots';

const TOTAL_MS = 400;
const FIRST = 0.2; // share of the 400 ms for node 1; the rest is split between the lines

// Spec 7.3 (style of 60 pw-trial): plays once, when `play` first turns true.
export function ProjectionTimeline({ nodes, play }: { nodes: TimelineNode[]; play: boolean }) {
  const p = useSharedValue(0);
  useEffect(() => {
    if (play && p.get() === 0) p.set(withTiming(1, { duration: TOTAL_MS }));
  }, [play, p]);

  const seg = (1 - FIRST) / Math.max(1, nodes.length - 1);
  return (
    <View>
      {nodes.map((n, i) => (
        <Row key={n.title} node={n} index={i} last={i === nodes.length - 1} p={p} start={i === 0 ? 0 : FIRST + (i - 1) * seg} seg={i === 0 ? FIRST : seg} next={seg} />
      ))}
    </View>
  );
}

function Row({ node, index, last, p, start, seg, next }: { node: TimelineNode; index: number; last: boolean; p: SharedValue<number>; start: number; seg: number; next: number }) {
  const reduced = useReducedMotion();
  const first = index === 0;
  const lineFrom = start + seg;
  const appear = useAnimatedStyle(() => ({
    opacity: interpolate(p.value, [start + seg * 0.5, start + seg], [0, 1], Extrapolation.CLAMP),
  }));
  const line = useAnimatedStyle(() => {
    const t = interpolate(p.value, [lineFrom, lineFrom + next * 0.6], [0, 1], Extrapolation.CLAMP);
    return reduced ? { opacity: t } : { transform: [{ scaleY: t }] };
  });

  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <Animated.View style={[styles.node, first ? styles.nodeDone : styles.nodeNext, appear]}>
          {first ? <Icon name="checkmark" size={12} color="#FFFFFF" weight="bold" /> : null}
        </Animated.View>
        {!last && <Animated.View style={[styles.line, line]} />}
      </View>
      <Animated.View style={[styles.text, last && styles.textLast, appear]}>
        <Text maxFontSizeMultiplier={FONT_CAP} style={[styles.title, !first && styles.titleNext]}>{node.title}</Text>
        {node.sub ? <Text maxFontSizeMultiplier={FONT_CAP} style={styles.sub}>{node.sub}</Text> : null}
        {node.weekDots ? (
          <View style={styles.dots}>
            <WeekDots label={node.sub} />
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 14 },
  rail: { width: 28, alignItems: 'center' },
  node: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  nodeDone: { backgroundColor: colors.orangeTick },
  nodeNext: { borderWidth: 1.5, borderColor: colors.radio, backgroundColor: colors.surface },
  line: { width: 2, flex: 1, minHeight: 12, marginVertical: 4, backgroundColor: colors.hairline, transformOrigin: 'top' },
  text: { flex: 1, paddingTop: 3, paddingBottom: 18 },
  textLast: { paddingBottom: 0 },
  title: { fontSize: 17, lineHeight: 22, fontWeight: '700', color: colors.ink },
  titleNext: { fontWeight: '600', color: colors.inkSoft },
  sub: { fontSize: 14, lineHeight: 18, color: colors.muted, marginTop: 2 },
  dots: { marginTop: 8 },
});
