'use client';
import { QRCodeSVG } from 'qrcode.react';
import type { Spot } from '@/lib/bridge-config';
import { publicPointUrl } from '@/lib/qr-route';

export default function FieldQRGuide({ spot }: { spot: Spot }) {
  return <main className="field-qr-guide" aria-label={`${spot.pinId} field QR guide`}>
    <header>
      <h1>RESTORING<br />LONDON’S<br />BRIDGES</h1>
      <p>ALBERT BRIDGE · {spot.title.toUpperCase()}</p>
    </header>
    <QRCodeSVG value={publicPointUrl(spot.destination)} size={620} marginSize={4} level="H" title={`${spot.pinId} QR code`} />
  </main>;
}
