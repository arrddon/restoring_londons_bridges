'use client';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import type { Bridge } from '@/lib/bridge-config';

export default function PointQRCodes({ bridge }: { bridge: Bridge }) {
  return <main className="point-qr-sheet">
    <header><h1>{bridge.title} QR Codes</h1><Link href={`/${bridge.id}`}>Return to map</Link></header>
    <section>{bridge.spots.map(spot => {
      return <article key={spot.pinId}>
        <QRCodeSVG value={spot.pinId} size={240} marginSize={4} level="H" title={`${spot.pinId} QR code`} />
        <h2>{spot.pinId}</h2><p>{spot.title}</p>
      </article>;
    })}</section>
  </main>;
}

