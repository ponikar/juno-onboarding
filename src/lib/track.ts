// Analytics stub: logs only. Wire to a real provider later.
// JS start of this session, for secondsSinceOpen.
export const SESSION_STARTED_AT = Date.now();

export function track(event: string, props: Record<string, unknown> = {}) {
  console.log(`[track] ${event}`, props);
}
