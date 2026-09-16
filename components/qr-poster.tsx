'use client';
import { QRCodeSVG } from 'qrcode.react';
import type { Bridge, Spot } from '@/lib/bridge-config';
import { publicPointUrl } from '@/lib/qr-route';

export default function QRPoster({ bridge, spot }: { bridge: Bridge; spot: Spot }) {
  const pointName = spot.title.replace(/^\d+\.\s*/, '');
  return <article className="field-qr-guide" aria-label={`${bridge.title} ${spot.pinId} QR poster`}>
    <header>
      <h1>restoringlondonsbridges.com</h1>
      <p>{spot.pinId} · {pointName}</p>
    </header>
    <div className="field-qr-guide-code">
      <QRCodeSVG value={publicPointUrl(spot.destination)} size={620} marginSize={4} level="H" title={`${spot.pinId} QR code`} />
    </div>
    <p className="field-qr-guide-caption">Scan to enter experience</p>
    <img className="field-qr-guide-watermark" src="/guide/thames-festival-trust-watermark.png" alt="Thames Festival Trust" />
  </article>;
}
