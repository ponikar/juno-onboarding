// Analytics stub: logs only. Wire to a real provider later.
export function track(event: string, props: Record<string, unknown> = {}) {
  console.log(`[track] ${event}`, props);
}
