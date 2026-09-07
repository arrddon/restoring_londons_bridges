'use client';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { mapLocations, mapStartingPoints } from '@/lib/map-locations';

const steps = [
  ['SCAN TO BEGIN', 'Scan the QR code to open the experience.'],
  ['FOLLOW THE MAP', 'Walk to one of the marked points around the bridge.'],
  ['OPEN THE EXPERIENCE', 'Scan the QR code at the location to begin.'],
  ['LOOK AROUND', 'Slowly move your phone and explore the space around you.'],
  ['DISCOVER & LISTEN', 'Point your camera towards the object as it appears, and listen to its story.'],
];

function GuideMap() {
  // Standard OSM raster images also remain visible in browser print output.
  const zoom = 17;
  const scale = 1.6;
  const tileSize = 256;
  const worldSize = tileSize * 2 ** zoom;
  const world = (p: { latitude: number; longitude: number }) => {
    const sin = Math.sin(p.latitude * Math.PI / 180);
    return {
      x: (p.longitude + 180) / 360 * worldSize,
      y: (.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * worldSize,
    };
  };
  const center = world({ latitude: 51.48235, longitude: -.16675 });
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
  const start = project(mapStartingPoints.AlbertBridge);
  const points = Array.from({ length: 5 }, (_, i) => project(mapLocations[`A0${i + 1}`]));
  return <svg className="guide-map" viewBox="0 0 560 792" role="img" aria-label="OpenStreetMap of Albert Bridge with five experience points and the starting point at the south entrance. North is up.">
    <g className="guide-map-tiles">{tiles}</g>
    {points.map((p, i) => <g key={i}>
      <circle cx={p.x} cy={p.y} r="18" fill="white" stroke="#111" strokeWidth="1.2" />
      <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="14" fontWeight="700">{String(i + 1).padStart(2, '0')}</text>
    </g>)}
    <circle cx={start.x} cy={start.y} r="6" fill="#111" stroke="white" strokeWidth="2" />
    <path d={`M${start.x - 8} ${start.y} h-24`} stroke="#111" strokeWidth="1.5" />
    <rect x={start.x - 110} y={start.y - 16} width="78" height="32" rx="2" fill="white" stroke="#111" />
    <text x={start.x - 71} y={start.y + 5} textAnchor="middle" fontSize="16" fontWeight="700">START</text>
  </svg>;
}
export default function BridgeGuide() {
  const [url, setUrl] = useState('');
  useEffect(() => { setUrl(`${window.location.origin}/AlbertBridge`); }, []);
  return <div className="guide-document">
    <article className="guide-sheet guide-front" aria-label="Guide 1: Experience instructions">
      <header><div className="guide-kicker">ALBERT BRIDGE, LONDON</div><h1>RESTORING<br />LONDON’S<br />BRIDGES</h1><p className="guide-intro">An AR journey through the hidden structures<br />and stories of Albert Bridge.</p></header>
      <section className="guide-instructions"><h2>HOW TO EXPLORE</h2><ol>{steps.map(([title, instruction], i) => <li key={title}><img src={`/guide/${i + 1}.png`} alt="" /><div><span className="guide-step-number">0{i + 1}</span><h3>{title}</h3><p>{instruction}</p></div></li>)}</ol></section>
      <footer className="guide-front-footer"><div><strong>BEGIN HERE</strong><p>Scan to open the map.</p><small>Turn over to explore the map →</small></div>{url && <QRCodeSVG value={url} size={96} marginSize={4} level="M" />}</footer>
    </article>
    <article className="guide-sheet guide-back" aria-label="Guide 2: Map and starting point">
      <header><h2>EXPLORE THE BRIDGE</h2><p>Albert Bridge, London</p></header>
      <GuideMap />
      <div className="guide-map-note"><p>At each point, look for the QR marker<br />to continue the experience.</p><small>© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</small></div>
    </article>
  </div>;
}
