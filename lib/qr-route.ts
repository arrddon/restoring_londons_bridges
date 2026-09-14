export const publicOrigin = 'https://restoring-londons-bridges.vercel.app';

export function publicPointUrl(destination: string) {
  return publicOrigin + destination;
}

export function pointPathFromQR(value: string, origin: string) {
  const token = value.trim().toUpperCase();
  const compact = /^(A|H)0[1-5]$/.exec(token);
  if (compact) return `/${compact[1] === 'A' ? 'AlbertBridge' : 'HammersmithBridge'}/${token}`;
  try {
    const path = new URL(value, origin).pathname.replace(/\/$/, '');
    return /^\/(AlbertBridge\/A|HammersmithBridge\/H)0[1-5]$/.test(path) ? path : null;
  } catch {
    return null;
  }
}
