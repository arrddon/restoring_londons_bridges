export type SurfacePoint = { x: number; y: number; z: number };

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

// Feature-point hits can jump on Android while ARCore is warming up. Reject
// vertical outliers, then use component medians so one noisy frame cannot move
// the initial world anchor away from the detected surface.
export function stableSurfaceAnchor(samples: SurfacePoint[], minimumSamples = 3, verticalTolerance = .16, horizontalTolerance = .3) {
  if (samples.length < minimumSamples) return null;
  const groundY = median(samples.map(sample => sample.y));
  const centerX = median(samples.map(sample => sample.x));
  const centerZ = median(samples.map(sample => sample.z));
  const stable = samples.filter(sample => Math.abs(sample.y - groundY) <= verticalTolerance
    && Math.hypot(sample.x - centerX, sample.z - centerZ) <= horizontalTolerance);
  if (stable.length < minimumSamples) return null;
  return {
    x: median(stable.map(sample => sample.x)),
    y: median(stable.map(sample => sample.y)),
    z: median(stable.map(sample => sample.z)),
  };
}

