'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BridgeMap from '@/components/bridge-map';
import ARExperience from '@/components/ar-experience';
import BridgeGuide from '@/components/bridge-guide';
import { bridges, type Bridge, type Spot } from '@/lib/bridge-config';
import { readCompletion, writeCompletion } from '@/lib/completion-storage';

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

export default function BridgeApp({ path }: { path: string[] }) {
  const { completed, complete, storageError } = useCompletion();
  const configuredBridge = bridges.find(b => b.id === path[0]);
  const bridge = configuredBridge;
  const spot = bridge?.spots.find(s => s.id === path[1]);
  if (bridge?.id === 'AlbertBridge' && path.length === 2 && path[1] === 'Guide') return <BridgeGuide />;
  const invalid = !bridge || path.length > 2 || (path.length === 2 && !spot);
  return <main className="app-shell">
    {invalid ? <section className="not-found"><h1>Point not found.</h1><Link href={bridge ? `/${bridge.id}` : '/AlbertBridge'}>Return to map ↗</Link></section>
      : spot ? <ARExperience key={spot.destination} bridge={bridge} spot={spot} complete={complete} />
      : <BridgeMap key={bridge.id} bridge={bridge} completed={completed} />}
    {storageError && <p className="notice" role="status">Completion cannot be saved in this browser.</p>}
  </main>;
}



