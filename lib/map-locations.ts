// Surveyed bridge coordinates, numbered 01 to 05 from south to north. Keep these
// as the single source of truth for the interactive maps and printed guides.
export const mapLocations: Record<string, { latitude: number; longitude: number }> = {
  A01: { latitude: 51.481308, longitude: -0.166309 },
  A02: { latitude: 51.481832, longitude: -0.166397 },
  A03: { latitude: 51.482253, longitude: -0.166610 },
  A04: { latitude: 51.482714, longitude: -0.166838 },
  A05: { latitude: 51.483198, longitude: -0.167068 },
  H01: { latitude: 51.487487, longitude: -0.231072 },
  H02: { latitude: 51.487866, longitude: -0.230675 },
  H03: { latitude: 51.488470, longitude: -0.230068 },
  H04: { latitude: 51.488915, longitude: -0.229597 },
  H05: { latitude: 51.489214, longitude: -0.229270 },
};

// A01 (Stop Marching Sign) is also the Albert Bridge starting point.
export const mapStartingPoints: Record<string, { latitude: number; longitude: number }> = {
  AlbertBridge: mapLocations.A01,
};
