type FieldGuideSpot = { pinId: string };

export function resolveFieldGuideSpot<T extends FieldGuideSpot>(segment: string | undefined, spots: readonly T[]) {
  const requestedPin = /^Guide-([AH]0[1-5])$/i.exec(segment ?? '')?.[1].toUpperCase();
  if (!requestedPin) return undefined;
  return spots.find(spot => spot.pinId === requestedPin);
}
