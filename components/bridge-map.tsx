'use client';
import { useEffect, useRef, useState } from 'react';
import type { Map as MapInstance, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { X, ScanLine } from 'lucide-react';
import QRScanner from './qr-scanner';
import { Button } from './ui/button';
import type { Bridge } from '@/lib/bridge-config';
import { mapLocations } from '@/lib/map-locations';

const cartoLightStyle = {
  version: 8 as const,
  sources: {
    cartoLight: {
      type: 'raster' as const,
      tiles: ['https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png'],
      tileSize: 256,
      maxzoom: 20,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    { id: 'cartoLight', type: 'raster' as const, source: 'cartoLight' },
  ],
};

export default function BridgeMap({ bridge, completed }: { bridge: Bridge; completed: string[] }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapInstance | null>(null);
  const markers = useRef<{ id: string; destination: string; marker: Marker; button: HTMLButtonElement }[]>([]);
  const [selected, setSelected] = useState<string>();
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState('Loading map…');
  const [retry, setRetry] = useState(0);
  const [origin, setOrigin] = useState('');
  const router = useRouter();
  const spot = bridge.spots.find(point => point.id === selected);
  useEffect(() => {
    let cancelled = false;
    let observer: ResizeObserver | undefined;
    setOrigin(window.location.origin);
    setStatus('Loading map…');
    import('maplibre-gl').then(({ Map, Marker, NavigationControl, AttributionControl, LngLatBounds }) => {
      if (cancelled || !container.current) return;
      const bounds = new LngLatBounds();
      bridge.spots.forEach(point => {
        const p = mapLocations[point.pinId];
        bounds.extend([p.longitude, p.latitude]);
      });
      const instance = new Map({
        container: container.current,
        style: cartoLightStyle,
        center: bounds.getCenter(), zoom: 16, minZoom: 11, maxZoom: 20,
        attributionControl: false,
      });
      map.current = instance;
      instance.dragRotate.disable();
      instance.touchZoomRotate.disableRotation();
      instance.addControl(new NavigationControl({ showCompass: false }), 'top-right');
      instance.addControl(new AttributionControl({ compact: false }), 'bottom-right');
      const fit = () => {
        instance.fitBounds(bounds, { padding: { top: 120, bottom: 150, left: 70, right: 70 }, maxZoom: 17, duration: 0 });
        // Allow one zoom level of context beyond the initial bridge overview.
        instance.setMinZoom(Math.max(11, instance.getZoom() - 1));
      };
      instance.on('load', () => { if (!cancelled) { setStatus(''); fit(); } });
      instance.on('error', () => { if (!cancelled) setStatus('Some map details could not load. Check your connection and retry.'); });
      markers.current = bridge.spots.map(point => {
        const p = mapLocations[point.pinId];
        const wrapper = document.createElement('div');
        const button = document.createElement('button');
        button.className = 'map-pin';
        button.type = 'button';
        button.setAttribute('aria-label', point.title);
        const label = document.createElement('span');
        label.textContent = point.pinId;
        button.append(label);
        wrapper.append(button);
        button.addEventListener('click', () => {
          setSelected(point.id);
          instance.easeTo({ center: [p.longitude, p.latitude], zoom: Math.max(instance.getZoom(), 17), offset: [0, -100], duration: 600 });
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
    };
  }, [bridge, retry]);
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
    <Button className="scan-qr-button" onClick={() => setScanning(true)}><ScanLine size={24} /> SCAN QR</Button>
    {scanning && <QRScanner onClose={() => setScanning(false)} onScan={path => router.push(path)} />}
    {spot && <section className="point-overlay vector-point-overlay" aria-label={'Selected ' + spot.title}>
      <Button variant="ghost" className="close-point icon-button" aria-label="Close selected point" onClick={() => { markers.current.find(m => m.id === selected)?.button.focus(); setSelected(undefined); }}><X /></Button>
      <div className="point-copy"><h2>{spot.title}</h2><p>{spot.description}</p></div>
      <div className="qr-image">{origin && <QRCodeSVG value={origin + spot.destination} size={116} marginSize={4} level="M" />}</div>
      <div className="point-actions"><Link className="enter-link" href={spot.destination}>Enter AR</Link></div>
    </section>}
  </section>;
}
