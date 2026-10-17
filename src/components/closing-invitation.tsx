import type { CSSProperties } from 'react';
import { Flower2 } from 'lucide-react';
import './closing-invitation.css';

export default function ClosingInvitation() {
 return <section id="closing" className="closing-invitation" aria-labelledby="closing-title"
  style={{ '--closing-botanical': `url("${import.meta.env.BASE_URL}images/palace-welcome.jpg")` } as CSSProperties}>
  <div className="closing-flowers closing-flowers-top" aria-hidden="true"/>
  <div className="closing-flowers closing-flowers-bottom" aria-hidden="true"/>
  <div className="closing-content">
   <div className="closing-ornament" aria-hidden="true"><span/><Flower2/><span/></div>
   <h2 id="closing-title">We can’t wait<br/>to celebrate<br/><em>with you</em></h2>
   <p className="closing-message">Your presence, love, and blessings<br/>will make our celebration complete.</p>
   <div className="closing-divider" aria-hidden="true">✧</div>
   <p className="closing-signoff">Warm regards,</p>
   <p className="closing-families">Magotra <em>&amp;</em> Saini<span>families</span></p>
  </div>
 </section>;
}
