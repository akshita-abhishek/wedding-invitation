import { useCallback, useEffect, useRef } from 'react';
import { backgroundMusicUrl } from '@/lib/music-config';

export function useWeddingMusic() {
 const player = useRef<HTMLAudioElement>(null);
 const requested = useRef(false);

 const play = useCallback(() => {
  const audio = player.current;
  if (!audio || !audio.paused) return;
  if (audio.error) audio.load();
  // Keep playback inside a user gesture; a blocked attempt retries on the next tap.
  void audio.play().catch(() => {});
 }, []);

 function start() {
  requested.current = true;
  play();
 }

 useEffect(() => {
  const resume = () => { if (requested.current) play(); };
  document.addEventListener('pointerdown', resume, { passive: true });
  document.addEventListener('keydown', resume);
  return () => {
   document.removeEventListener('pointerdown', resume);
   document.removeEventListener('keydown', resume);
  };
 }, [play]);

 return {
  start,
  audio: backgroundMusicUrl ? <audio ref={player} src={backgroundMusicUrl} preload="auto" loop /> : null,
  control: null,
 };
}
