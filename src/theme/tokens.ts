// Values sampled from the 3x Figma renders in docs/reference (the file has no variables).
// Sizes were measured in points (pixels / 3). Anything estimated is marked "estimated".

export const colors = {
  bg: '#F8F6F7',
  surface: '#FFFFFF',
  ink: '#261910',
  inkSoft: '#5E534D', // estimated from body text on 56-honesty
  muted: '#8A8584', // estimated from placeholder text
  hairline: '#DCDDE1',
  radio: '#BCBCBC',
  orange: '#FC7B44',
  orangeTick: '#FF824A',
  orangeBorder: '#FFC4A6',
  orangeFill: '#FFF3EB',
  track: '#E5E1E0',
  button: '#111111',
  buttonText: '#FFFFFF',
  buttonDisabled: '#E6E4E5',
  buttonDisabledText: '#9C9A9B',
  navy: '#1E2A50', // welcome "Get started" button
  skyTop: '#3685D4',
  skyText: '#FFFFFF',
  skyGlass: 'rgba(255,255,255,0.28)', // back/close button on sky screens, estimated
  userBubble: '#0A7AFF', // 35-tracking-demo user bubble
  replyBubble: '#F1EFF0', // estimated
  success: '#27AE60', // estimated
  link: '#261910',
} as const;

// Sky gradient on 14-goals, sampled at the left edge (y in pt).
export const skyStops = [
  { y: 0, color: '#3685D4' },
  { y: 270, color: '#3684D4' },
  { y: 420, color: '#74AAE8' },
  { y: 570, color: '#A9C6F0' },
  { y: 720, color: '#E0E8F5' },
  { y: 765, color: '#F9F7F8' },
  { y: 874, color: '#F8F6F7' },
] as const;

// Juno's screens read as SF Pro (iOS system font). No custom font file was found in Figma.
export const font = {
  regular: { fontWeight: '400' as const },
  medium: { fontWeight: '500' as const },
  semibold: { fontWeight: '600' as const },
  bold: { fontWeight: '700' as const },
};

export const type = {
  titleSky: { fontSize: 28, lineHeight: 34, ...font.bold, color: colors.skyText },
  title: { fontSize: 26, lineHeight: 31, ...font.bold, color: colors.ink },
  subtitle: { fontSize: 15, lineHeight: 20, ...font.regular },
  body: { fontSize: 17, lineHeight: 22, ...font.regular, color: colors.ink },
  label: { fontSize: 18, lineHeight: 23, ...font.medium, color: colors.ink },
  chip: { fontSize: 16, lineHeight: 21, ...font.regular, color: colors.ink },
  button: { fontSize: 18, lineHeight: 22, ...font.semibold },
  small: { fontSize: 13, lineHeight: 17, ...font.regular },
  link: { fontSize: 16, lineHeight: 21, ...font.semibold, color: colors.ink },
} as const;

export const space = {
  gutter: 14, // chip rows and fields
  cardGutter: 16, // option cards
  buttonGutter: 29,
  buttonBottom: 34,
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
} as const;

export const size = {
  button: 53,
  field: 52,
  chip: 43,
  card: 63,
  nav: 38, // back/close circle, hitSlop brings it to 44+
  navTop: 72, // centre of nav row = 91pt from the top of the screen incl. status bar
  tick: 20,
  cardTick: 24,
} as const;

export const radius = {
  pill: 999,
  card: 30,
  sheet: 28,
  panel: 20,
} as const;

export const shadow = {
  nav: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  card: {
    shadowColor: '#1B3A66',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  titleSky: {
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 2 },
  },
} as const;

// Font scaling stays on. Caps keep the largest accessibility sizes from overlapping fixed art:
// body text grows up to 1.6x, big display titles up to 1.25x.
export const FONT_CAP = 1.6;
export const TITLE_CAP = 1.25;
