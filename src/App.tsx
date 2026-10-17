import Celebration from '@/components/illustrated-event';
import SealEntrance from '@/components/seal-entrance';
import InvitationBook from '@/components/invitation-book';
import ClosingInvitation from '@/components/closing-invitation';
import { useWeddingMusic } from '@/components/wedding-music';
import './app/seal-entrance.css';
import './app/palace-opening.css';

const familyInvitation = (
<section id="invitation" className="family-invitation" aria-labelledby="family-invitation-title">
  <div className="family-letter">
   <div className="family-letter-content">
    <p className="family-eyebrow">WITH LOVE & BLESSINGS</p>
    <h2 id="family-invitation-title">We joyfully invite you</h2>
    <p className="letter-opening">to celebrate the wedding of</p>
    <div className="letter-families">
     <div><h3>Akshita <span>Magotra</span></h3><p className="letter-relation">Daughter of</p><p>Renu Sharma<br/>& Sudesh Kumar Magotra</p></div>
     <em className="letter-weds">weds</em>
     <div><h3>Abhishek <span>Singh Saini</span></h3><p className="letter-relation">Son of</p><p>Anita Saini<br/>& Kamal Singh Saini</p></div>
    </div>
    <div className="letter-ornament" aria-hidden="true">— ✧ —</div>
    <p className="letter-verse" lang="hi">दो दिलों का मिलन, दो परिवारों का संगम।</p>
    <p className="letter-closing">Your presence will make our celebration complete.</p>
   </div>
  </div>
 </section>
);
const pages = [
 {id:'home', title:'Our beginning', content:<Celebration theme="welcome" book/>},
 {id:'invitation', title:'The invitation', content:familyInvitation},
 {id:'haldi', title:'Haldi', content:<Celebration theme="haldi" book/>},
 {id:'sangeet', title:'Sangeet', content:<Celebration theme="sangeet" book/>},
 {id:'wedding', title:'Baarat & Reception', content:<Celebration theme="wedding" book/>},
 {id:'closing', title:'Warm regards', content:<ClosingInvitation/>},
];

export default function Home(){
 const music = useWeddingMusic();
 // Local development stays silent while the published invitation keeps its music.
 return <>{!import.meta.env.DEV && music.audio}<SealEntrance paginated onOpen={music.start}><InvitationBook pages={pages} musicControl={music.control}/></SealEntrance></>;
}
