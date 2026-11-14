import { Fragment, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn } from 'react-native-reanimated';

import { fill, S } from '@/copy/strings';
import { REPLY_FADE_MS, STATE_MS } from '@/motion/tokens';
import { colors, radius, size, space, type, FONT_CAP, TITLE_CAP } from '@/theme/tokens';
import { avatar } from '@/ui/art';
import { Tick } from '@/ui/Chip';
import { SearchField } from '@/ui/Fields';
import { haptic } from '@/ui/haptics';
import { Icon } from '@/ui/Icon';
import { PressableScale } from '@/ui/PressableScale';
import { PrimaryButton } from '@/ui/PrimaryButton';
import { ScreenShell } from '@/ui/ScreenShell';
import { shortName, TOP_CONDITIONS, useConditionPick } from './useConditionPick';

const [ECHO_PRE] = S.conditions.echo.split('{list}');

// Variant C "Juno asks": the question is Juno's speech bubble, conditions are quick replies, picks are echoed back.
export function ConditionsC() {
  const { picked, seeking, query, setQuery, matches, custom, addCustom, toggle, remove, toggleSeeking, ctaLabel, canContinue, onContinue } =
    useConditionPick();
  const [searching, setSearching] = useState(false);
  const more = matches.filter((c) => !TOP_CONDITIONS.includes(c));

  return (
    <ScreenShell
      route="/conditions"
      footer={<PrimaryButton label={ctaLabel} disabled={!canContinue} onPress={onContinue} />}>
      <View style={styles.ask}>
        <Image source={avatar} style={styles.avatar} />
        <View style={styles.bubble}>
          <Text maxFontSizeMultiplier={TITLE_CAP} accessibilityRole="header" style={styles.q}>
            {S.conditions.q}
          </Text>
          <Text maxFontSizeMultiplier={FONT_CAP} style={styles.why}>{S.conditions.why}</Text>
        </View>
      </View>

      <View style={styles.wrap}>
        {TOP_CONDITIONS.map((c) => (
          <PickChip key={c} label={c} selected={picked.includes(c)} onPress={() => toggle(c)} />
        ))}
        <PressableScale
          accessibilityRole="button"
          accessibilityState={{ expanded: searching }}
          accessibilityLabel={S.conditions.somethingElse}
          onPress={() => {
            haptic.selection();
            setSearching((s) => !s);
            setQuery('');
          }}
          style={[styles.chip, searching ? styles.chipOn : styles.chipOff]}>
          <Icon name="magnifyingglass" size={15} color={colors.ink} />
          <Text maxFontSizeMultiplier={FONT_CAP} style={[type.chip, styles.label]}>{S.conditions.somethingElse}</Text>
        </PressableScale>
      </View>

      {searching && (
        <View style={styles.search}>
          <SearchField
            quiet
            autoFocus
            placeholder={S.conditions.search}
            accessibilityLabel={S.conditions.search}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={addCustom}
          />
          <View style={[styles.wrap, styles.matches]}>
            {custom && (
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel={fill(S.common.addCustom, { text: custom })}
                onPress={() => {
                  haptic.selection();
                  addCustom();
                }}
                style={[styles.chip, styles.chipOff]}>
                <Icon name="plus" size={15} color={colors.ink} />
                <Text maxFontSizeMultiplier={FONT_CAP} style={[type.chip, styles.label]}>{fill(S.common.addCustom, { text: custom })}</Text>
              </PressableScale>
            )}
            {more.map((c) => (
              <PickChip key={c} label={c} selected={picked.includes(c)} onPress={() => toggle(c)} />
            ))}
          </View>
        </View>
      )}

      <View style={styles.divider} />
      <PressableScale
        accessibilityRole="checkbox"
        accessibilityState={{ checked: seeking }}
        accessibilityLabel={S.conditions.seeking}
        onPress={() => {
          haptic.selection();
          toggleSeeking();
        }}
        style={[styles.seeking, transition, seeking && styles.chipOn] as object}>
        <Tick selected={seeking} ringless />
        <Text maxFontSizeMultiplier={FONT_CAP} style={[type.link, styles.label]}>{S.conditions.seeking}</Text>
      </PressableScale>

      {(picked.length > 0 || seeking) && (
        <Animated.View
          key={seeking ? 'seeking' : 'picked'}
          entering={FadeIn.duration(REPLY_FADE_MS).easing(Easing.out(Easing.quad))}
          accessibilityLiveRegion="polite"
          style={styles.echo}>
          {seeking ? (
            <Text maxFontSizeMultiplier={FONT_CAP} style={styles.echoText}>{S.conditions.echoSeeking}</Text>
          ) : (
            <View style={styles.echoRow}>
              <Text maxFontSizeMultiplier={FONT_CAP} style={styles.echoText}>{ECHO_PRE}</Text>
              {picked.map((c, i) => (
                <Fragment key={c}>
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityLabel={fill(S.conditions.remove, { name: shortName(c) })}
                    onPress={() => {
                      haptic.selection();
                      remove(c);
                    }}
                    hitSlop={{ top: 6, bottom: 6, left: 2, right: 2 }}
                    style={styles.token}>
                    <Text maxFontSizeMultiplier={FONT_CAP} style={styles.echoText}>{shortName(c)}</Text>
                    <Icon name="xmark" size={10} color="#FFFFFF" weight="bold" />
                  </PressableScale>
                </Fragment>
              ))}
            </View>
          )}
        </Animated.View>
      )}
    </ScreenShell>
  );
}

function PickChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <PressableScale
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      onPress={() => {
        haptic.selection();
        onPress();
      }}
      style={[styles.chip, selected ? styles.chipOn : styles.chipOff, transition] as object}>
      {selected && <Tick selected ringless />}
      <Text maxFontSizeMultiplier={FONT_CAP} style={[type.chip, styles.label]}>{label}</Text>
    </PressableScale>
  );
}

const transition = { transitionProperty: ['backgroundColor', 'borderColor'], transitionDuration: STATE_MS };

const styles = StyleSheet.create({
  ask: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 16, marginTop: 20, marginBottom: 20 },
  avatar: { width: 30, height: 30, borderRadius: 15 },
  bubble: {
    flexShrink: 1,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderBottomLeftRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  q: { fontSize: 22, lineHeight: 27, fontWeight: '700', color: colors.ink },
  why: { ...type.subtitle, color: colors.inkSoft, marginTop: 6 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, paddingHorizontal: space.gutter },
  chip: {
    maxWidth: '100%',
    minHeight: size.chip,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chipOff: { backgroundColor: colors.surface, borderColor: colors.hairline },
  chipOn: { backgroundColor: colors.orangeFill, borderColor: colors.orangeBorder },
  label: { flexShrink: 1 },
  search: { marginTop: 14 },
  matches: { marginTop: 12 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.hairline, marginHorizontal: space.gutter, marginTop: 18, marginBottom: 10 },
  seeking: {
    minHeight: 48,
    marginHorizontal: space.gutter,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  echo: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: colors.userBubble,
    borderRadius: 18,
    borderBottomRightRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  echoRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', rowGap: 6, columnGap: 4 },
  echoText: { fontSize: 16, lineHeight: 21, color: '#FFFFFF' },
  token: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
