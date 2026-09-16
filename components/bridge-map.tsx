'use client';
import { useEffect, useRef, useState } from 'react';
import type { Map as MapInstance, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ScanLine } from 'lucide-react';
import QRScanner from './qr-scanner';
import { Button } from './ui/button';
import type { Bridge } from '@/lib/bridge-config';
import { mapLocations, mapStartingPoints } from '@/lib/map-locations';

const streetMapStyle = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [{ id: 'osm-streets', type: 'raster' as const, source: 'osm' }],
};

export default function BridgeMap({ bridge, completed, unlocked, qrSpotId }: { bridge: Bridge; completed: string[]; unlocked: string[]; qrSpotId?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapInstance | null>(null);
  const resetView = useRef<() => void>(() => undefined);
  const markers = useRef<{ id: string; destination: string; marker: Marker; button: HTMLButtonElement }[]>([]);
  const [selected, setSelected] = useState<string | undefined>(qrSpotId);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState('Loading map…');
  const [retry, setRetry] = useState(0);
  const router = useRouter();
  const spot = bridge.spots.find(point => point.id === selected);
  useEffect(() => {
    let cancelled = false;
    let observer: ResizeObserver | undefined;
    setStatus('Loading map…');
    import('maplibre-gl').then(({ Map, Marker, NavigationControl, AttributionControl, LngLatBounds }) => {
      if (cancelled || !container.current) return;
      const bounds = new LngLatBounds();
      bridge.spots.forEach(point => {
        const p = mapLocations[point.pinId];
        bounds.extend([p.longitude, p.latitude]);
      });
      const startingPoint = mapStartingPoints[bridge.id];
      if (startingPoint) bounds.extend([startingPoint.longitude, startingPoint.latitude]);
      const instance = new Map({
        container: container.current,
        style: streetMapStyle,
        center: bounds.getCenter(), zoom: 16, minZoom: 11, maxZoom: 20,
        attributionControl: false,
      });
      map.current = instance;
      instance.dragRotate.disable();
      instance.touchZoomRotate.disableRotation();
      instance.addControl(new NavigationControl({ showCompass: false }), 'top-right');
      instance.addControl(new AttributionControl({ compact: false }), 'bottom-right');
      const overviewOptions = () => {
        const mobile = container.current && container.current.clientWidth <= 640;
        return {
          padding: mobile
            ? { top: 72, bottom: 110, left: 24, right: 24 }
            : { top: 120, bottom: 150, left: 70, right: 70 },
          maxZoom: 17,
        };
      };
      const fit = () => {
        instance.fitBounds(bounds, { ...overviewOptions(), duration: 0 });
        // Keep the full bridge overview as the furthest zoom-out level.
        instance.setMinZoom(instance.getZoom());
      };
      resetView.current = () => {
        setSelected(undefined);
        instance.fitBounds(bounds, { ...overviewOptions(), duration: 650 });
      };
      instance.on('click', resetView.current);
      instance.on('load', () => {
        if (cancelled) return;
        setStatus(''); fit();
        const qrSpot = qrSpotId ? bridge.spots.find(point => point.id === qrSpotId) : undefined;
        const qrLocation = qrSpot ? mapLocations[qrSpot.pinId] : undefined;
        if (qrLocation) instance.jumpTo({ center: [qrLocation.longitude, qrLocation.latitude], zoom: 18 });
      });
      instance.on('error', () => { if (!cancelled) setStatus('Some map details could not load. Check your connection and retry.'); });
      markers.current = bridge.spots.map(point => {
        const p = mapLocations[point.pinId];
        const wrapper = document.createElement('div');
        const button = document.createElement('button');
        button.className = 'map-pin';
        button.type = 'button';
        button.setAttribute('aria-label', point.title);
        const label = document.createElement('span');
        label.setAttribute('aria-hidden', 'true');
        button.append(label);
        if (point.pinId === 'A01') {
          wrapper.className = 'map-start-pin';
          const startLabel = document.createElement('span');
          startLabel.className = 'map-starting-point';
          startLabel.textContent = 'STARTING POINT';
          wrapper.append(startLabel);
        }
        wrapper.append(button);
        button.addEventListener('click', event => {
          event.stopPropagation();
          setSelected(point.id);
          instance.easeTo({ center: [p.longitude, p.latitude], zoom: 18, offset: [0, -100], duration: 600 });
        });
        const marker = new Marker({ element: wrapper }).setLngLat([p.longitude, p.latitude]).addTo(instance);
        return { id: point.id, destination: point.destination, marker, button };
      });
      observer = new ResizeObserver(() => instance.resize());
      observer.observe(container.current);
    }).catch(() => { if (!cancelled) setStatus('Map could not load. Please retry.'); });
    return () => {
      cancelled = true;
      observer?.disconnect();
      markers.current.forEach(({ marker }) => marker.remove());
      markers.current = [];
      map.current?.remove();
      map.current = null;
      resetView.current = () => undefined;
    };
  }, [bridge, retry, qrSpotId]);
  useEffect(() => {
    markers.current.forEach(({ id, destination, button }) => {
      button.classList.toggle('selected', id === selected);
      button.classList.toggle('completed', completed.includes(destination));
      button.setAttribute('aria-pressed', String(id === selected));
    });
  }, [selected, completed, status]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelected(undefined); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  return <section className="map-screen vector-map-screen" aria-label={bridge.title + ' map'}>
    <div ref={container} className="map-surface" />
    <header className="map-heading"><h1>{bridge.title}</h1></header>
    {status && <div className="notice" role="status">{status}{status !== 'Loading map…' && <button onClick={() => setRetry(n => n + 1)}>Retry</button>}</div>}
    <Button className={`scan-qr-button${spot ? ' is-hidden' : ''}`} aria-hidden={Boolean(spot)} tabIndex={spot ? -1 : 0} onClick={() => setScanning(true)}><ScanLine size={24} /> SCAN QR</Button>
    {scanning && <QRScanner onClose={() => setScanning(false)} onScan={path => router.push(path)} />}
    {spot && <section className="point-overlay vector-point-overlay" aria-label={'Selected ' + spot.title}>
      <Button variant="ghost" className="close-point icon-button" aria-label="Close selected point" onClick={() => { markers.current.find(m => m.id === selected)?.button.focus(); resetView.current(); }}><X /></Button>
      <div className="point-copy"><h2>{spot.title}</h2></div>
      <div className="point-actions">{qrSpotId === spot.id || unlocked.includes(spot.destination)
        ? <Link className="enter-link" href={`${spot.destination}/ar`}>{spot.assetType === '3d' ? 'ENTER AR' : 'VIEW CONTENT'}</Link>
        : <Button className="scan-required-button" onClick={() => setScanning(true)}><ScanLine size={20} /> SCAN QR TO {spot.assetType === '3d' ? 'ENTER AR' : 'VIEW CONTENT'}</Button>}
      </div>
    </section>}
  </section>;
}
