// Provisional coordinates. Replace latitude/longitude for each pin after surveying.
export const mapLocations: Record<string, { latitude: number; longitude: number }> = {
  A01: { latitude: 51.48345, longitude: -0.16724 },
  A02: { latitude: 51.48305, longitude: -0.16706 },
  A03: { latitude: 51.48265, longitude: -0.16688 },
  A04: { latitude: 51.48225, longitude: -0.16670 },
  A05: { latitude: 51.48185, longitude: -0.16652 },
  H01: { latitude: 51.48910, longitude: -0.22955 },
  H02: { latitude: 51.48865, longitude: -0.22980 },
  H03: { latitude: 51.48820, longitude: -0.23005 },
  H04: { latitude: 51.48775, longitude: -0.23030 },
  H05: { latitude: 51.48730, longitude: -0.23055 },
};

// Approximate south entrance, positioned from the supplied map reference.
export const mapStartingPoints: Record<string, { latitude: number; longitude: number }> = {
  AlbertBridge: { latitude: 51.48125, longitude: -0.16625 },
};
