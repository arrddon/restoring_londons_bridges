'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import BridgeMap from '@/components/bridge-map';
import ARExperience from '@/components/ar-experience';
import BridgeGuide from '@/components/bridge-guide';
import PointQRCodes from '@/components/point-qr-codes';
import FieldQRGuide from '@/components/field-qr-guide';
import { bridges, type Spot } from '@/lib/bridge-config';
import { readCompletion, writeCompletion } from '@/lib/completion-storage';
import { readQRAccess, writeQRAccess } from '@/lib/qr-access-storage';

function useCompletion() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    function refresh() {
      try { setCompleted(bridges.flatMap(b => b.spots.filter(s => readCompletion(window.localStorage, b.id, s.id)).map(s => s.destination))); }
      catch { setStorageError(true); }
    }
    refresh(); window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);
  function complete(spot: Spot) {
    setCompleted(items => items.includes(spot.destination) ? items : [...items, spot.destination]);
    try { if (!writeCompletion(window.localStorage, spot.bridgeId, spot.id)) setStorageError(true); }
    catch { setStorageError(true); }
  }
  return { completed, complete, storageError };
}

function useQRAccess(scannedSpot?: Spot) {
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    const refresh = () => setUnlocked(bridges.flatMap(bridge => bridge.spots
      .filter(spot => readQRAccess(window.localStorage, bridge.id, spot.id)).map(spot => spot.destination)));
    refresh(); window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);
  useEffect(() => {
    if (!scannedSpot) return;
    setUnlocked(items => items.includes(scannedSpot.destination) ? items : [...items, scannedSpot.destination]);
    if (!writeQRAccess(window.localStorage, scannedSpot.bridgeId, scannedSpot.id)) setStorageError(true);
  }, [scannedSpot]);
  return { unlocked, storageError };
}

export default function BridgeApp({ path }: { path: string[] }) {
  const { completed, complete, storageError } = useCompletion();
  const configuredBridge = bridges.find(b => b.id === path[0]);
  const bridge = configuredBridge;
  const fieldGuideId = bridge && path.length === 2 ? /^Guide-([AH]0[1-5])$/i.exec(path[1])?.[1].toUpperCase() : undefined;
  const fieldGuideSpot = bridge?.spots.find(s => s.pinId === fieldGuideId);
  const spot = bridge?.spots.find(s => s.pinId === path[1] || s.id === path[1]);
  const scannedSpot = path.length === 2 && spot?.pinId === path[1] ? spot : undefined;
  const { unlocked, storageError: qrStorageError } = useQRAccess(scannedSpot);
  if (bridge && fieldGuideSpot) return <FieldQRGuide bridge={bridge} spot={fieldGuideSpot} />;
  if (bridge && path.length === 2 && path[1] === 'Guide') return <BridgeGuide bridge={bridge} />;
  if (bridge && path.length === 2 && path[1] === 'QRCodes') return <PointQRCodes bridge={bridge} />;
  const arRoute = path.length === 3 && path[2] === 'ar' && spot;
  const pointRoute = path.length === 2 && spot;
  const invalid = !bridge || path.length > 3 || (path.length > 1 && !pointRoute && !arRoute);
  return <main className="app-shell">
    {invalid ? <section className="not-found"><h1>Point not found.</h1><Link href={bridge ? `/${bridge.id}` : '/AlbertBridge'}>Return to map ↗</Link></section>
      : arRoute ? <ARExperience key={spot.destination} bridge={bridge} spot={spot} complete={complete} />
      : <BridgeMap key={`${bridge.id}:${pointRoute ? spot.pinId : 'map'}`} bridge={bridge} completed={completed} unlocked={unlocked} qrSpotId={pointRoute ? spot.id : undefined} />}
    {(storageError || qrStorageError) && <p className="notice" role="status">Progress cannot be saved in this browser.</p>}
  </main>;
}
