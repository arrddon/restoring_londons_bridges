type TitledSpot = { pinId: string; id: string; title: string; assetType?: '3d' | 'image' | 'video' };
type TitledBridge = { id: string; title: string; spots: TitledSpot[] };

export function pageTitle(path: string[], bridges: TitledBridge[]) {
  if (path.length === 1 && path[0] === 'QRCodes') return "QR Codes — Restoring London's Bridges";
  const bridge = bridges.find(item => item.id === path[0]);
  if (!bridge) return "Restoring London's Bridges";
  if (path[1] === 'Guide') return `${bridge.title} — Audience Guide`;
  if (path[1] === 'QRCodes') return `${bridge.title} — QR Codes`;
  const guidePin = /^Guide-([AH]0[1-5])$/i.exec(path[1] ?? '')?.[1].toUpperCase();
  const guideSpot = guidePin ? bridge.spots.find(item => item.pinId === guidePin) : undefined;
  const spot = guideSpot ?? bridge.spots.find(item => item.pinId === path[1] || item.id === path[1]);
  if (!spot) return bridge.title;
  if (guideSpot) return `${spot.title} — Print QR Guide`;
  return path[2] === 'ar' ? `${spot.title}${spot.assetType === '3d' ? ' AR' : ' Content'} — ${bridge.title}` : `${spot.title} — ${bridge.title}`;
}
