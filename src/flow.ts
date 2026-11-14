// The 25-screen flow from docs/specs/narration-v2.md section 4. Screen 25 is two routes (Done, then the first chat).
export type Act = 0 | 1 | 2 | 3;
export type Segment = 'today' | 'health' | 'days' | 'you' | 'snapshot' | 'plan' | null;

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
  { route: '/support', n: 13, seg: 'days', act: 1, from: '45 support-circle + 46 reply-support' },
  { route: '/insight-days', n: 14, seg: 'days', act: 1, from: '15 goal-recognition' },
  { route: '/about', n: 15, seg: 'you', act: 1, from: '21 name + 31 sex + 33 age' },
  { route: '/health', n: 16, seg: 'you', act: 1, from: '42 wearables + 43 health-connect' },
  { route: '/promise', n: 17, seg: 'you', act: 1, from: '45 support-circle' },
  { route: '/building', n: 18, seg: 'snapshot', act: 2, from: '54 analyzing' },
  { route: '/snapshot', n: 19, seg: 'snapshot', act: 2, from: '55 journey-ready' },
  { route: '/report', n: 20, seg: 'snapshot', act: 2, from: '09 story-report + 29 reply-care-team + 60 pw-trial timeline' },
  { route: '/save', n: 21, seg: 'snapshot', act: 2, from: '01b auth' },
  { route: '/how', n: 22, seg: 'plan', act: 3, from: '56 honesty + 60 pw-trial' },
  { route: '/plans', n: 23, seg: 'plan', act: 3, from: '62 pw-price (+ 62b sponsor sheet)' },
  { route: '/notify', n: 24, seg: 'plan', act: 3, from: '61 bell + 63 bell-after-plans' },
  { route: '/done', n: 25, seg: null, act: 3, from: '64 subscribe-success + 65 how-to-use-juno' },
  { route: '/chat', n: 25, seg: null, act: 3, from: 'first-chat' },
] as const;

export type FlowRoute = (typeof FLOW)[number]['route'];

export function nextRoute(route: FlowRoute): FlowRoute {
  const i = FLOW.findIndex((s) => s.route === route);
  return FLOW[Math.min(i + 1, FLOW.length - 1)].route;
}

const DONE_SCREENS: Partial<Record<FlowRoute, true>> = { '/insight-health': true, '/insight-days': true };

// Flow bar (spec 7.1): shown on screens 4 to 24; fill = (n - 3) / 21; "done" label on 10 and 14 only.
export function flowBarFor(route: FlowRoute): { seg: Exclude<Segment, null>; fraction: number; done: boolean } | null {
  const step = FLOW.find((s) => s.route === route);
  if (!step || step.seg === null || step.n < 4 || step.n > 24) return null;
  return { seg: step.seg, fraction: (step.n - 3) / 21, done: !!DONE_SCREENS[route] };
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
  return prev === '/building' ? '/promise' : prev; // never land back on the auto-advancing screen
}
