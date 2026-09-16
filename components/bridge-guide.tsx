'use client';
import { QRCodeSVG } from 'qrcode.react';
import type { Bridge } from '@/lib/bridge-config';
import { mapLocations, mapStartingPoints } from '@/lib/map-locations';
import { publicPointUrl } from '@/lib/qr-route';

const partnerLogos = ['riverside', 'royal-college', 'royal-academy', 'london-breeze', 'hyperactive', 'crackd', 'ukri', 'thames-festival', 'west-london'];

const steps = [
  ['SCAN TO BEGIN', 'Scan the QR code to open the experience.'],
  ['FOLLOW THE MAP', 'Walk to one of the marked points around the bridge.'],
  ['OPEN THE EXPERIENCE', 'Scan the QR code at the location to begin.'],
  ['EXPLORE THE CONTENT', 'For 3D points, scan your surroundings. Images and videos open on your screen.'],
  ['DISCOVER & LISTEN', 'Explore the story and play the narration when available.'],
];

function GuideMap({ bridge }: { bridge: Bridge }) {
  // Fetch four times the source pixel density while preserving the original
  // geographic crop. Raster tiles remain visible in browser print output.
  const baseZoom = 17;
  const zoom = 19;
  const scale = 1.6 / 2 ** (zoom - baseZoom);
  const tileSize = 256;
  const worldSize = tileSize * 2 ** zoom;
  const world = (p: { latitude: number; longitude: number }) => {
    const sin = Math.sin(p.latitude * Math.PI / 180);
    return {
      x: (p.longitude + 180) / 360 * worldSize,
      y: (.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * worldSize,
    };
  };
  const coordinates = bridge.spots.map(point => mapLocations[point.pinId]);
  const center = world({
    latitude: coordinates.reduce((sum, point) => sum + point.latitude, 0) / coordinates.length,
    longitude: coordinates.reduce((sum, point) => sum + point.longitude, 0) / coordinates.length,
  });
  const left = center.x - 280 / scale;
  const top = center.y - 396 / scale;
  const project = (p: { latitude: number; longitude: number }) => {
    const position = world(p);
    return { x: (position.x - left) * scale, y: (position.y - top) * scale };
  };
  const tiles = [];
  for (let y = Math.floor(top / tileSize); y <= Math.floor((top + 792 / scale) / tileSize); y++) {
    for (let x = Math.floor(left / tileSize); x <= Math.floor((left + 560 / scale) / tileSize); x++) {
      tiles.push(<image key={`${x}-${y}`} href={`https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`}
        x={(x * tileSize - left) * scale} y={(y * tileSize - top) * scale}
        width={tileSize * scale} height={tileSize * scale} />);
    }
  }
  const startingCoordinate = mapStartingPoints[bridge.id];
  const start = startingCoordinate ? project(startingCoordinate) : undefined;
  const points = bridge.spots.map(point => ({ ...project(mapLocations[point.pinId]), pinId: point.pinId }));
  return <svg className="guide-map" viewBox="0 0 560 792" role="img" aria-label={`OpenStreetMap of ${bridge.title} with five experience points. North is up.`}>
    <g className="guide-map-tiles">{tiles}</g>
    {points.map((p, i) => {
      // Keep the QR cards clear of the bridge and tune the Hammersmith ends.
      const onLeft = i % 2 === 0 && p.pinId !== 'H01';
      const gap = p.pinId === 'H02' ? 100 : 48;
      const qrX = onLeft ? Math.max(8, p.x - gap - 108) : p.x + gap;
      const verticalShift = p.pinId === 'H04' ? 25 : p.pinId === 'H05' ? -25 : 0;
      const qrY = p.y - 54 + verticalShift;
      return <g key={p.pinId}>
        <circle cx={p.x} cy={p.y} r="18" fill="white" stroke="#111" strokeWidth="1.2" />
        <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="14" fontWeight="700">{p.pinId.slice(1)}</text>
        <rect x={qrX} y={qrY} width="108" height="108" fill="white" stroke="#111" strokeWidth="1" />
        <QRCodeSVG x={qrX + 2} y={qrY + 2} width="104" height="104" size={104} marginSize={2}
          value={publicPointUrl(bridge.spots[i].destination)} level="M" title={`${p.pinId} QR code`} />
      </g>;
    })}
    {start && <>
      <path d={`M${start.x + 20} ${start.y} h12`} stroke="#111" strokeWidth="1.5" />
      <rect x={start.x + 32} y={start.y - 16} width="78" height="32" rx="2" fill="white" stroke="#111" />
      <text x={start.x + 71} y={start.y + 5} textAnchor="middle" fontSize="16" fontWeight="700">START</text>
    </>}
  </svg>;
}
export default function BridgeGuide({ bridge }: { bridge: Bridge }) {
  return <div className="guide-document">
    <article className="guide-sheet guide-front" aria-label="Guide 1: Experience instructions">
      <header><div className="guide-kicker">{bridge.title.toUpperCase()}, LONDON</div><h1>restoringlondonsbridges.com</h1><p className="guide-intro">An interactive journey through the hidden structures<br />and stories of {bridge.title}.</p></header>
      <section className="guide-instructions"><h2>HOW TO EXPLORE</h2><ol>{steps.map(([title, instruction], i) => <li key={title}><img src={`/guide/${i + 1}.png`} alt="" /><div><span className="guide-step-number">0{i + 1}</span><h3>{title}</h3><p>{instruction}</p></div></li>)}</ol></section>
      <footer className="guide-front-footer" aria-label="Project partners">{partnerLogos.map(name => <img key={name} src={`/guide/logos/${name}.png`} alt={name.replaceAll('-', ' ')} />)}</footer>
    </article>
    <article className="guide-sheet guide-back" aria-label="Guide 2: Map and starting point">
      <header><h2>{bridge.title}</h2></header>
      <GuideMap bridge={bridge} />
      <div className="guide-map-note"><small>© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</small></div>
    </article>
  </div>;
}
