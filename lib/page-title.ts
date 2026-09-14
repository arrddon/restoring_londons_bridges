type TitledSpot = { pinId: string; id: string; title: string };
type TitledBridge = { id: string; title: string; spots: TitledSpot[] };

export function pageTitle(path: string[], bridges: TitledBridge[]) {
  const bridge = bridges.find(item => item.id === path[0]);
  if (!bridge) return "Restoring London's Bridges";
  if (path[1] === 'Guide') return `${bridge.title} — Audience Guide`;
  if (path[1] === 'QRCodes') return `${bridge.title} — QR Codes`;
  const guidePin = /^Guide-([AH]0[1-5])$/i.exec(path[1] ?? '')?.[1].toUpperCase();
  const spot = bridge.spots.find(item => item.pinId === guidePin || item.pinId === path[1] || item.id === path[1]);
  if (!spot) return bridge.title;
  if (guidePin) return `${spot.title} — Print QR Guide`;
  return path[2] === 'ar' ? `${spot.title} AR — ${bridge.title}` : `${spot.title} — ${bridge.title}`;
}
