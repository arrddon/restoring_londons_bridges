// Surveyed Albert Bridge coordinates. Keep these as the single source of truth for
// both the interactive map and the printed guide.
export const mapLocations: Record<string, { latitude: number; longitude: number }> = {
  A01: { latitude: 51.481308, longitude: -0.166309 },
  A02: { latitude: 51.481832, longitude: -0.166397 },
  A03: { latitude: 51.482253, longitude: -0.166610 },
  A04: { latitude: 51.482714, longitude: -0.166838 },
  A05: { latitude: 51.483198, longitude: -0.167068 },
  H01: { latitude: 51.487487, longitude: -0.231072 },
  H02: { latitude: 51.487866, longitude: -0.230675 },
  H03: { latitude: 51.48836926026987, longitude: -0.2301895488537357 },
  H04: { latitude: 51.48885865352584, longitude: -0.22964610998178459 },
  H05: { latitude: 51.489214, longitude: -0.229270 },
};

// A01 (Stop Marching Sign) is also the Albert Bridge starting point.
export const mapStartingPoints: Record<string, { latitude: number; longitude: number }> = {
  AlbertBridge: mapLocations.A01,
};
