'use client';

import { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

export default function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-navy-dark/80 cursor-pointer group" onClick={toggle}>
      <video
        ref={videoRef}
        src={src}
        className="w-full block"
        onEnded={() => setPlaying(false)}
      />
      {/* Custom play/pause overlay */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
        <div className="w-16 h-16 rounded-full bg-gold/90 flex items-center justify-center shadow-lg">
          {playing
            ? <Pause className="h-7 w-7 text-white" fill="white" />
            : <Play className="h-7 w-7 text-white ml-1" fill="white" />
          }
        </div>
      </div>
    </div>
  );
}
