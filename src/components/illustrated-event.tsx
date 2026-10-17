'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { startAtmosphere } from './invitation-atmosphere';
import '../app/illustrated-event.css';
const details = {
 welcome: {title:'Welcome', heading:'Together, with our families', verse:'आपका स्वागत है।'},
 haldi: {title:'Haldi', heading:'A little sunshine, a lot of love', verse:'प्यार का रंग, हल्दी के संग।'},
 sangeet: {title:'Sangeet', heading:'An evening of music & togetherness', verse:'थोड़ी मस्ती, ढेर सारी यादें।'},
 wedding: {title:'Baraat & Reception', heading:'Together, with your blessings', verse:'सात फेरे, सात वचन, एक जीवन।'},
};
const schedule = {
 haldi: {date:'25 November 2026', time:'2:00 PM', dateTime:'2026-11-25T14:00:00', dressCode:'Shades of Sunshine', dressNote:'Sunny hues, floral accents, and breezy Indian wear.'},
 sangeet: {date:'25 November 2026', time:'7:00 PM', dateTime:'2026-11-25T19:00:00', dressCode:'Shimmer & Shadows', dressNote:'Bring out the bling! Dress to dazzle in deep, dark shades and sparkly outfits.'},
 wedding: {date:'26 November 2026', time:'1:00 PM', dateTime:'2026-11-26T13:00:00', dressCode:'Pastel Perfection', dressNote:'Soft pastels, festive Indian wear, and shoes made for dancing'},
};
export default function IllustratedEvent({theme,book=false}:{theme:keyof typeof details;book?:boolean}) {
 const root=useRef<HTMLElement>(null), burst=useRef<HTMLDivElement>(null),timer=useRef<ReturnType<typeof setTimeout> | null>(null);
 const [touched,setTouched]=useState(false);
 const event=details[theme];
 const eventSchedule=theme==='welcome'?null:schedule[theme];
 useEffect(()=>{if(!root.current)return;return startAtmosphere(root.current,theme)},[theme]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 function scatter(e:React.MouseEvent<HTMLButtonElement>){
  setTouched(true);const stage=e.currentTarget.getBoundingClientRect();
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const target=burst.current;if(!target)return;target.replaceChildren();if(timer.current)clearTimeout(timer.current);
  const x=e.detail?e.clientX-stage.left:stage.width/2,y=e.detail?e.clientY-stage.top:stage.height*.5;
  for(let i=0;i<24;i++){const petal=document.createElement('i');petal.style.cssText=`--x:${x}px;--y:${y}px;--dx:${Math.cos(i*Math.PI/12)*(50+(i%5)*22)}px;--dy:${Math.sin(i*Math.PI/12)*100+90}px;--spin:${120+i*27}deg`;target.appendChild(petal)}
  timer.current=setTimeout(()=>target.replaceChildren(),2400);
 }
 return <section ref={root} id={theme==='welcome'?'home':theme} className={`illustrated-event ${theme==='welcome'?'illustrated-haldi ':''}illustrated-${theme}`} aria-labelledby={`${theme}-title`}>
  <div className="preview-page">{theme!=='welcome'&&<p className="scene-heading">{event.heading}</p>}
   <div className="invitation-artboard">
    <img className="scene-art" src={`${import.meta.env.BASE_URL}images/${theme==='welcome'?'palace-welcome':`${theme}-faceless`}.jpg`} alt={theme==='welcome'?'A faceless illustration of Akshita and Abhishek walking hand in hand through an ivory palace courtyard':theme==='haldi'?'Akshita and Abhishek illustrated without facial details, celebrating Haldi among marigolds':theme==='sangeet'?'A faceless illustration of the couple dancing beneath crystal lights':'A faceless illustration of the couple beside the sacred fire beneath a floral mandap'} width="600" height="900" loading={theme==='welcome'||book?'eager':'lazy'} fetchPriority={theme==='welcome'?'high':book?'low':undefined}/>
    <div className="scene-shade" aria-hidden="true"/>
    <div className="glimmers" aria-hidden="true">{Array.from({length:17},(_,i)=><i key={i} style={{left:`${7+(i*31)%88}%`,top:`${5+(i*19)%87}%`,animationDelay:`-${i*.43}s`}}/>)}</div>
    <div className="falling-petals" aria-hidden="true">{Array.from({length:12},(_,i)=><i key={i} style={{left:`${5+(i*23)%88}%`,top:'-15px','--drift':`${(i%2?1:-1)*(25+i*5)}px`,animationDelay:`-${i*.81}s`,animationDuration:`${9+i%4}s`} as CSSProperties}/>)}</div>
    <div className="invitation-wording">{theme==='welcome'?<><p className="welcome-blessing" lang="hi">॥ शुभ विवाह ॥</p><h1 id="welcome-title"><span>Akshita</span><em>&</em><span>Abhishek</span></h1><p className="welcome-verse" lang="hi">एक नई शुरुआत, आपके आशीर्वाद के साथ।</p></>:<><h2 id={`${theme}-title`}>{event.title}</h2><div className="event-details">{eventSchedule&&<p><time dateTime={eventSchedule.dateTime}>{eventSchedule.date} · {eventSchedule.time}</time></p>}<span>Hari Niwas Palace</span></div></>}</div>
    <button className="scene-touch" type="button" aria-label={`Shower petals over the ${event.title} invitation`} onClick={scatter}/>
    <div ref={burst} className="petal-burst" aria-hidden="true"/><span className="touch-hint">{theme==='welcome'?'Together with our families, we invite you to celebrate.':'Touch for a little magic'}</span>
   </div>
   <div className={`scene-footer${eventSchedule?' event-attire':''}`}>
    {eventSchedule&&<div className="dress-code"><p><span>Dress code:</span> {eventSchedule.dressCode}</p>{eventSchedule.dressNote&&<p className="dress-note">{eventSchedule.dressNote}</p>}</div>}
    <span className={eventSchedule?'sr-only':'scene-response'} role="status" lang={touched?'hi':'en'}>{touched?event.verse:eventSchedule?'':'With love, from both our families'}</span>
   </div>
   {theme==='welcome'&&!book&&<a className="welcome-continue" href="#invitation">Our invitation <span aria-hidden="true">↓</span></a>}
  </div>
 </section>;
}
