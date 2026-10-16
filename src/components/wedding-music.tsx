import { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { backgroundMusicUrl } from '@/lib/music-config';

export function useWeddingMusic() {
 const player = useRef<HTMLAudioElement>(null);
 const [playing, setPlaying] = useState(false);
 const [unavailable, setUnavailable] = useState(false);

 function start() {
  const audio = player.current;
  if (!audio) return;
  setUnavailable(false);
  if (audio.error) audio.load();
  // This call stays inside the seal/button gesture so mobile browsers allow it.
  void audio.play().catch(error => {
   setPlaying(false);
   if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') setUnavailable(true);
  });
 }

 return {
  start,
  audio: backgroundMusicUrl ? <audio ref={player} src={backgroundMusicUrl} preload="none" loop
   onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}
   onError={() => { setPlaying(false); setUnavailable(true); }} /> : null,
  control: backgroundMusicUrl ? <button className="music-toggle" type="button" aria-label={playing?'Mute background music':'Play background music'}
   aria-pressed={playing} title={unavailable?'Music could not load. Tap to retry.':playing?'Mute background music':'Play background music'}
   onClick={() => { if (playing) player.current?.pause(); else start(); }}>
   {playing?<Volume2 aria-hidden="true"/>:<VolumeX aria-hidden="true"/>}
   <span>{unavailable?'Retry music':playing?'Music on':'Music off'}</span>
  </button> : null,
 };
}
