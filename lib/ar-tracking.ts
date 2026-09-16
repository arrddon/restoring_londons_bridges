// Use elapsed time rather than frame counts: Android frame rates vary widely.
export function createTrackingGate() {
  let normalSince: number | undefined;
  let lastUpdate: number | undefined;
  return {
    update(normal: boolean, now: number, placed: boolean) {
      if (!normal || (lastUpdate !== undefined && now - lastUpdate > 500)) normalSince = undefined;
      lastUpdate = now;
      if (!normal) return { ready: false, duration: 0 };
      normalSince ??= now;
      const duration = now - normalSince;
      return { ready: duration >= (placed ? 300 : 700), duration };
    },
  };
}
