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
  const project = (p: { latitude: number; longitude: number }) => ({
    x: 265 + (p.longitude + .1669) * 95000,
    y: 85 + (51.48365 - p.latitude) * 215000,
  });
  const start = project(mapStartingPoints.AlbertBridge);
  const points = Array.from({ length: 5 }, (_, i) => project(mapLocations[`A0${i + 1}`]));
  return <svg className="guide-map" viewBox="0 0 560 650" role="img" aria-label="Schematic map of Albert Bridge. Start at the south entrance and walk north past points 05 to 01. North is up.">
    <rect width="560" height="650" fill="#fff" />
    <path d="M0 125 L560 60 V480 L0 555Z" fill="#eee" />
    <path d="M0 125 L560 60 M0 555 L560 480" fill="none" stroke="#aaa" strokeWidth="2" />
    <path d="M190 45 L340 610" stroke="white" strokeWidth="42" />
    <path d="M190 45 L340 610" stroke="#111" strokeWidth="1.5" />
    <text x="28" y="94" fontSize="13" letterSpacing="1">CHELSEA EMBANKMENT</text>
    <text x="28" y="365" fontSize="17" letterSpacing="2">RIVER THAMES</text>
    <text x="395" y="550" fontSize="13">BATTERSEA</text>
    <text x="395" y="568" fontSize="13">PARK</text>
    <text x="35" y="608" fontSize="13" letterSpacing="1">ANHALT ROAD</text>
    <text x="290" y="315" fontSize="13" transform="rotate(75 290 315)" letterSpacing="2">ALBERT BRIDGE</text>
    <path d={`M${start.x} ${start.y} ${[...points].reverse().map(p => `L${p.x} ${p.y}`).join(' ')}`} fill="none" stroke="#111" strokeWidth="3" strokeDasharray="5 6" />
    {points.map((p, i) => <g key={i}>
      <circle cx={p.x} cy={p.y} r="18" fill="white" stroke="#111" strokeWidth="2" />
      <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="14" fontWeight="700">{String(i + 1).padStart(2, '0')}</text>
      <path d={`M${p.x + 19} ${p.y} h48`} stroke="#111" />
      <text x={p.x + 76} y={p.y + 5} fontSize="14" fontWeight="600">POINT {String(i + 1).padStart(2, '0')}</text>
    </g>)}
    <circle cx={start.x} cy={start.y} r="9" fill="#111" />
    <path d={`M${start.x - 12} ${start.y} h-90`} stroke="#111" />
    <text x={start.x - 110} y={start.y + 5} textAnchor="end" fontSize="18" fontWeight="700">START</text>
    <g transform="translate(500 20)"><path d="M0 39 V10 M-5 18 L0 8 L5 18" fill="none" stroke="#111" strokeWidth="2" /><text y="0" textAnchor="middle" fontSize="13">N</text></g>
  </svg>;
}

export default function BridgeGuide() {
  const [url, setUrl] = useState('');
  useEffect(() => { setUrl(`${window.location.origin}/AlbertBridge`); }, []);
  return <div className="guide-document">
    <nav className="guide-toolbar" aria-label="Print guide"><a href="/AlbertBridge">← Back to map</a><span>A4 · 2 pages · Double-sided / long-edge binding</span><button onClick={() => window.print()} disabled={!url}>Print / Save PDF</button></nav>
    <article className="guide-sheet guide-front" aria-label="Guide 1: Experience instructions">
      <header><div className="guide-kicker">ALBERT BRIDGE, LONDON <span>01 / GUIDE</span></div><h1>RESTORING<br />LONDON’S<br />BRIDGES</h1><p className="guide-intro">An AR journey through the hidden structures<br />and stories of Albert Bridge.</p></header>
      <section className="guide-instructions"><h2>HOW TO EXPLORE</h2><ol>{steps.map(([title, instruction], i) => <li key={title}><img src={`/guide/${i + 1}.png`} alt="" /><div><span className="guide-step-number">0{i + 1}</span><h3>{title}</h3><p>{instruction}</p></div></li>)}</ol></section>
      <footer className="guide-front-footer"><div><strong>BEGIN HERE</strong><p>Scan to open the map.</p><small>Turn over to explore the map →</small></div>{url && <QRCodeSVG value={url} size={96} marginSize={4} level="M" />}</footer>
    </article>
    <article className="guide-sheet guide-back" aria-label="Guide 2: Map and starting point">
      <header><div className="guide-kicker">ALBERT BRIDGE, LONDON <span>02 / MAP</span></div><h2>EXPLORE<br />THE BRIDGE</h2><p className="guide-intro">Follow the map and visit the marked points<br />around Albert Bridge.</p></header>
      <GuideMap />
      <div className="guide-map-note"><p>At each point, look for the QR marker<br />to continue the experience.</p><small>Schematic map · Not to scale<br />Prototype locations</small></div>
      <footer className="guide-back-footer"><strong>RESTORING LONDON’S BRIDGES</strong><span>Albert Bridge, London</span></footer>
    </article>
  </div>;
}
