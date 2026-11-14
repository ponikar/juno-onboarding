// The flow from docs/specs/onboarding-v3.md section 10. The last screen is two routes (Done, then the first chat).
export type Act = 0 | 1 | 2 | 3;
export type Segment = 'today' | 'health' | 'days' | 'you' | 'routine' | 'snapshot' | 'plan' | null;
export const SEGMENTS = ['today', 'health', 'days', 'you', 'routine', 'snapshot', 'plan'] as const;

export const FLOW = [
  { route: '/welcome', n: 1, seg: null, act: 0, from: '01 splash' },
  { route: '/story', n: 2, seg: null, act: 0, from: '09 story-report' },
  { route: '/consent', n: 3, seg: null, act: 0, from: '12 consent' },
  { route: '/try', n: 4, seg: 'today', act: 0, from: '36 try-logging' },
  { route: '/heard', n: 5, seg: 'today', act: 0, from: '35 tracking-demo' },
  { route: '/goals', n: 6, seg: 'health', act: 1, from: '14 goals + 15 goal-recognition' },
  { route: '/conditions', n: 7, seg: 'health', act: 1, from: '17 conditions (+ replaces 18)' },
  { route: '/symptoms', n: 8, seg: 'health', act: 1, from: '20 symptoms' },
  { route: '/meds', n: 9, seg: 'health', act: 1, from: '19 meds' },
  { route: '/insight-health', n: 10, seg: 'health', act: 1, from: '15 goal-recognition' },
  { route: '/appointment', n: 11, seg: 'days', act: 1, from: '28 appointment' },
  { route: '/energy', n: 12, seg: 'days', act: 1, from: '37 energy-slider' },
  { route: '/pacing', n: 13, seg: 'days', act: 1, from: 'Juno app: pace your week' },
  { route: '/support', n: 14, seg: 'days', act: 1, from: '45 support-circle + 46 reply-support' },
  { route: '/community', n: 15, seg: 'days', act: 1, from: 'Juno app: group chats' },
  { route: '/insight-days', n: 16, seg: 'days', act: 1, from: '15 goal-recognition' },
  { route: '/about', n: 17, seg: 'you', act: 1, from: '21 name + 31 sex + 33 age' },
  { route: '/health', n: 18, seg: 'you', act: 1, from: '42 wearables + 43 health-connect' },
  { route: '/source', n: 19, seg: 'you', act: 1, from: 'Juno app: where did you find Juno' },
  { route: '/promise', n: 20, seg: 'routine', act: 1, from: '45 support-circle' },
  { route: '/demo', n: 21, seg: 'routine', act: 1, from: 'first-chat + 61 bell' },
  { route: '/building', n: 22, seg: 'snapshot', act: 2, from: '54 analyzing' },
  { route: '/snapshot', n: 23, seg: 'snapshot', act: 2, from: '55 journey-ready' },
  { route: '/report', n: 24, seg: 'snapshot', act: 2, from: '09 story-report + 29 reply-care-team + 60 pw-trial timeline' },
  { route: '/save', n: 25, seg: 'snapshot', act: 2, from: '01b auth' },
  { route: '/how', n: 26, seg: 'plan', act: 3, from: '56 honesty + 60 pw-trial' },
  { route: '/plans', n: 27, seg: 'plan', act: 3, from: '62 pw-price (+ 62b sponsor sheet)' },
  { route: '/done', n: 28, seg: null, act: 3, from: '64 subscribe-success + 65 how-to-use-juno' },
  { route: '/checkin', n: 29, seg: null, act: 3, from: '61 bell (commitment + reminder)' },
  { route: '/chat', n: 29, seg: null, act: 3, from: 'first-chat' },
] as const;

export type FlowRoute = (typeof FLOW)[number]['route'];

export function nextRoute(route: FlowRoute): FlowRoute {
  const i = FLOW.findIndex((s) => s.route === route);
  return FLOW[Math.min(i + 1, FLOW.length - 1)].route;
}

const DONE_SCREENS: Partial<Record<FlowRoute, true>> = { '/insight-health': true, '/insight-days': true };

// Flow bar: screens 4 to 27 (plans); fill = (n - 3) / 24; part = 1-based segment index of 7; "done" label on 10 and 14.
export function flowBarFor(
  route: FlowRoute,
): { seg: Exclude<Segment, null>; part: number; fraction: number; done: boolean } | null {
  const step = FLOW.find((s) => s.route === route);
  if (!step || step.seg === null || step.n < 4 || step.n > 27) return null;
  return { seg: step.seg, part: SEGMENTS.indexOf(step.seg) + 1, fraction: (step.n - 3) / 24, done: !!DONE_SCREENS[route] };
}

// Legacy four-act progress, kept until every screen uses the flow bar.
export function progressFor(route: FlowRoute): { act: Act; fraction: number } {
  const step = FLOW.find((s) => s.route === route)!;
  const inAct = FLOW.filter((s) => s.act === step.act && s.route !== '/chat');
  const idx = inAct.findIndex((s) => s.route === route);
  return { act: step.act as Act, fraction: (idx + 1) / inAct.length };
}

export function prevRoute(path: string): FlowRoute {
  const i = FLOW.findIndex((s) => s.route === path);
  const prev = FLOW[Math.max(i - 1, 0)].route;
  return prev === '/building' ? '/demo' : prev; // never land back on the auto-advancing screen
}
