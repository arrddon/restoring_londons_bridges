// Surveyed Albert Bridge coordinates. Keep these as the single source of truth for
// both the interactive map and the printed guide.
export const mapLocations: Record<string, { latitude: number; longitude: number }> = {
  A01: { latitude: 51.483198, longitude: -0.167068 },
  A02: { latitude: 51.482253, longitude: -0.166610 },
  A03: { latitude: 51.481832, longitude: -0.166397 },
  A04: { latitude: 51.481308, longitude: -0.166309 },
  A05: { latitude: 51.482714, longitude: -0.166838 },
  H01: { latitude: 51.48910, longitude: -0.22955 },
  H02: { latitude: 51.48865, longitude: -0.22980 },
  H03: { latitude: 51.48820, longitude: -0.23005 },
  H04: { latitude: 51.48775, longitude: -0.23030 },
  H05: { latitude: 51.48730, longitude: -0.23055 },
};

// A04 (Stop Marching Sign) is also the Albert Bridge starting point.
export const mapStartingPoints: Record<string, { latitude: number; longitude: number }> = {
  AlbertBridge: mapLocations.A04,
};

