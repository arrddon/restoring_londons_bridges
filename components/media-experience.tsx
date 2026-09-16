'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Bridge, Spot } from '@/lib/bridge-config';

export default function MediaExperience({ bridge, spot, complete }: { bridge: Bridge; spot: Spot; complete: (spot: Spot) => void }) {
  const audio = useRef<HTMLAudioElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  return <section className="experience-screen media-experience" aria-label={`${bridge.title}, ${spot.title}`}>
    {spot.assetType === 'image' && spot.imagePath && <img className="media-asset" src={spot.imagePath} alt={spot.title} onLoad={() => complete(spot)} />}
    {spot.assetType === 'video' && spot.videoPath && <video ref={video} className="media-asset" src={spot.videoPath} controls playsInline preload="metadata" onEnded={() => complete(spot)} aria-label={spot.title} />}
    <header className="ar-heading"><Link href={`/${bridge.id}`} className="back-link"><ArrowLeft size={18} /> Map</Link><span className="micro">{spot.title}</span></header>
    {spot.audioPath && <div className="media-audio"><span>Listen to the story</span><audio ref={audio} src={spot.audioPath} controls preload="metadata" aria-label={`${spot.title} audio narration`} /></div>}
  </section>;
}
