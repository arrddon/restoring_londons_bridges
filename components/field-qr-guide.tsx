import type { Bridge, Spot } from '@/lib/bridge-config';
import QRPoster from '@/components/qr-poster';

export default function FieldQRGuide({ bridge, spot }: { bridge: Bridge; spot: Spot }) {
  return <main className="field-qr-page"><QRPoster bridge={bridge} spot={spot} /></main>;
}
