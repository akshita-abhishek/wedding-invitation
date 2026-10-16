'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '../app/invitation-book.css';

type Page = { id: string; title: string; content: ReactNode };
type Turn = { from: number; to: number; direction: 'forward' | 'backward' };

export default function InvitationBook({ pages }: { pages: Page[] }) {
 const [current, setCurrent] = useState(0);
 const [turn, setTurn] = useState<Turn | null>(null);
 const book = useRef<HTMLElement>(null);
 const currentRef = useRef(0);
 const turning = useRef(false);
 const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
 const pointer = useRef<{ id: number; x: number; y: number; horizontal: boolean } | null>(null);
 const suppressClickUntil = useRef(0);

 const focusPage = useCallback((index: number) => {
  const heading = book.current?.querySelector<HTMLElement>(`[data-book-page="${index}"] h1, [data-book-page="${index}"] h2`);
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
 }, []);

 const go = useCallback((index: number) => {
  if (turning.current || index < 0 || index >= pages.length || index === currentRef.current) return;
  const from = currentRef.current;
  turning.current = true;
  const finish = () => {
   currentRef.current = index;
   setCurrent(index);
   setTurn(null);
   turning.current = false;
   timer.current = null;
   window.history.pushState(null, '', `#${pages[index].id}`);
   requestAnimationFrame(() => focusPage(index));
  };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
  setTurn({ from, to: index, direction: index > from ? 'forward' : 'backward' });
  timer.current = setTimeout(finish, 720);
 }, [pages, focusPage]);

 useEffect(() => {
  const sync = () => {
   let hash = '';
   try { hash = decodeURIComponent(window.location.hash.slice(1)); } catch { /* Unknown links open the cover. */ }
   if (hash === 'celebrations') hash = 'haldi';
   const index = Math.max(0, pages.findIndex(page => page.id === hash));
   if (timer.current) clearTimeout(timer.current);
   timer.current = null;
   turning.current = false;
   currentRef.current = index;
   setTurn(null);
   setCurrent(index);
   if (!book.current?.closest('[data-invitation-locked="true"]')) requestAnimationFrame(() => focusPage(index));
  };
  sync();
  window.addEventListener('popstate', sync);
  window.addEventListener('hashchange', sync);
  return () => {
   window.removeEventListener('popstate', sync);
   window.removeEventListener('hashchange', sync);
   if (timer.current) clearTimeout(timer.current);
  };
 }, [pages, focusPage]);

 function startSwipe(event: PointerEvent<HTMLDivElement>) {
  if (turning.current || !event.isPrimary || event.button !== 0) return;
  pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, horizontal: false };
 }
 function moveSwipe(event: PointerEvent<HTMLDivElement>) {
  const start = pointer.current;
  if (!start || start.id !== event.pointerId) return;
  const dx = event.clientX - start.x, dy = event.clientY - start.y;
  if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.4) {
   start.horizontal = true;
   event.currentTarget.setPointerCapture(event.pointerId);
   event.preventDefault();
   event.stopPropagation();
  }
 }
 function endSwipe(event: PointerEvent<HTMLDivElement>) {
  const start = pointer.current;
  pointer.current = null;
  if (!start || start.id !== event.pointerId) return;
  const dx = event.clientX - start.x, dy = event.clientY - start.y;
  if (start.horizontal) suppressClickUntil.current = performance.now() + 350;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) go(currentRef.current + (dx < 0 ? 1 : -1));
 }

 const shown = turn?.to ?? current;
 return <main ref={book} className={`invitation-book book-theme-${pages[shown].id}`} aria-label="Wedding invitation" onKeyDown={event => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'ArrowRight') { event.preventDefault(); go(currentRef.current + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); go(currentRef.current - 1); }
 }}>
  <div className="book-reader">
   <div className={`book-stage ${turn ? `is-turning turn-${turn.direction}` : ''}`} aria-busy={!!turn}
    onPointerDown={startSwipe} onPointerMoveCapture={moveSwipe} onPointerUp={endSwipe} onPointerCancel={() => { pointer.current = null; }}
    onClickCapture={event => { if (performance.now() < suppressClickUntil.current) { event.preventDefault(); event.stopPropagation(); } }}>
    {pages.map((page, index) => {
     const visible = turn ? index === turn.from || index === turn.to : index === current;
     const moving = turn && index === (turn.direction === 'forward' ? turn.from : turn.to);
     return <div key={page.id} data-book-page={index} className={`book-page ${visible ? 'page-visible' : ''} ${moving ? 'page-turning' : ''}`}
      hidden={!visible} inert={index !== current || !!turn} aria-hidden={index !== current || !!turn}>
      <div className="book-page-content">{page.content}</div>
      <span className="book-fold-shadow" aria-hidden="true"/>
     </div>;
    })}
   </div>
   <nav className="book-navigation" aria-label="Invitation pages">
    <Button variant="ghost" size="icon" className="page-arrow" type="button" disabled={current === 0 || !!turn}
     aria-label={current > 0 ? `Previous page: ${pages[current - 1].title}` : 'Previous page'} onClick={() => go(current - 1)}><ArrowLeft aria-hidden="true"/></Button>
    <div className="book-pagination" role="status" aria-live="polite" aria-atomic="true">
     <span className="book-page-name">{pages[current].title}</span>
     <span className="book-page-number"><span className="sr-only">Page </span>{String(current + 1).padStart(2, '0')} <span aria-hidden="true">/</span><span className="sr-only"> of </span> {String(pages.length).padStart(2, '0')}</span>
    </div>
    <Button variant="ghost" size="icon" className="page-arrow" type="button" disabled={!!turn}
     aria-label={current === pages.length - 1 ? 'Back to the first page' : `Next page: ${pages[current + 1].title}`}
     onClick={() => go(current === pages.length - 1 ? 0 : current + 1)}>{current === pages.length - 1 ? <RotateCcw aria-hidden="true"/> : <ArrowRight aria-hidden="true"/>}</Button>
   </nav>
   <p className="book-gesture-hint"><span className="touch-gesture">Swipe to turn the page</span><span className="keyboard-gesture">Turn the page with the arrows</span></p>
  </div>
 </main>;
}
