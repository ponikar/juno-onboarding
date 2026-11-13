export type Act = 0 | 1 | 2 | 3;

export const FLOW = [
  { route: '/welcome', n: 1, act: 0, from: '01 splash' },
  { route: '/consent', n: 2, act: 0, from: '12 consent' },
  { route: '/try', n: 3, act: 0, from: '36 try-logging' },
  { route: '/heard', n: 4, act: 0, from: '35 tracking-demo' },
  { route: '/goals', n: 5, act: 1, from: '14 goals + 15 goal-recognition' },
  { route: '/conditions', n: 6, act: 1, from: '17 conditions (+ replaces 18)' },
  { route: '/symptoms', n: 7, act: 1, from: '20 symptoms' },
  { route: '/meds', n: 8, act: 1, from: '19 meds' },
  { route: '/appointment', n: 9, act: 1, from: '28 appointment' },
  { route: '/energy', n: 10, act: 1, from: '37 energy-slider' },
  { route: '/support', n: 11, act: 1, from: '45 support-circle + 46 reply-support' },
  { route: '/about', n: 12, act: 1, from: '21 name + 31 sex + 33 age' },
  { route: '/health', n: 13, act: 1, from: '42 wearables + 43 health-connect' },
  { route: '/building', n: 14, act: 2, from: '54 analyzing' },
  { route: '/snapshot', n: 15, act: 2, from: '55 journey-ready' },
  { route: '/report', n: 16, act: 2, from: '09 story-report + 29 reply-care-team' },
  { route: '/save', n: 17, act: 2, from: '01b auth' },
  { route: '/how', n: 18, act: 3, from: '56 honesty + 60 pw-trial' },
  { route: '/plans', n: 19, act: 3, from: '62 pw-price (+ 62b sponsor sheet)' },
  { route: '/notify', n: 20, act: 3, from: '61 bell + 63 bell-after-plans' },
  { route: '/done', n: 21, act: 3, from: '64 subscribe-success + 65 how-to-use-juno' },
  { route: '/chat', n: 21, act: 3, from: 'first-chat' },
] as const;

export type FlowRoute = (typeof FLOW)[number]['route'];

export function nextRoute(route: FlowRoute): FlowRoute {
  const i = FLOW.findIndex((s) => s.route === route);
  return FLOW[Math.min(i + 1, FLOW.length - 1)].route;
}

// Progress inside the four acts: [act, fraction of that act done].
export function progressFor(route: FlowRoute): { act: Act; fraction: number } {
  const step = FLOW.find((s) => s.route === route)!;
  const inAct = FLOW.filter((s) => s.act === step.act && s.route !== '/chat');
  const idx = inAct.findIndex((s) => s.route === route);
  return { act: step.act as Act, fraction: (idx + 1) / inAct.length };
}
