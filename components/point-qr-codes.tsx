'use client';
import Link from 'next/link';
import { bridges, type Bridge } from '@/lib/bridge-config';
import QRPoster from '@/components/qr-poster';

export default function PointQRCodes({ bridge }: { bridge?: Bridge }) {
  const shownBridges = bridge ? [bridge] : bridges;
  return <main className="point-qr-sheet">
    <header><h1>{bridge ? `${bridge.title} QR Codes` : 'QR Codes'}</h1><Link href={`/${bridge?.id ?? 'AlbertBridge'}`}>Return to map</Link></header>
    {shownBridges.map(item => <section key={item.id} aria-label={`${item.title} QR posters`}>
      <h2>{item.title}</h2>
      <div className="point-qr-grid">{item.spots.map(spot => <QRPoster key={spot.pinId} bridge={item} spot={spot} />)}</div>
    </section>)}
  </main>;
}
