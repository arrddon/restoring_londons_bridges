'use client';
import Link from 'next/link';
import { bridges } from '@/lib/bridge-config';
import QRPoster from '@/components/qr-poster';

export default function PointQRCodes() {
  return <main className="point-qr-sheet">
    <header><h1>QR Codes</h1><Link href="/AlbertBridge">Return to map</Link></header>
    {bridges.map(bridge => <section key={bridge.id} aria-label={`${bridge.title} QR posters`}>
      <h2>{bridge.title}</h2>
      <div className="point-qr-grid">{bridge.spots.map(spot => <QRPoster key={spot.pinId} bridge={bridge} spot={spot} />)}</div>
    </section>)}
  </main>;
}
