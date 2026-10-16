/** @param {HTMLElement} root @param {string} theme */
export function startAtmosphere(root, theme) {
 const stage=root.querySelector('.invitation-artboard');
 const art=root.querySelector('.scene-art');
 const canvas=document.createElement('canvas');
 canvas.setAttribute('aria-hidden','true');
 canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;transform:scale(1.035);transition:transform 1.4s ease-out';
 art.after(canvas);
 const ctx=canvas.getContext('2d');if(!ctx)return ()=>canvas.remove();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let width=0,height=0,t=0,previous=0,visible=false,frame=0;
 const resize=new ResizeObserver(()=>{const r=stage.getBoundingClientRect();width=r.width;height=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=width*d;canvas.height=height*d;ctx.setTransform(d,0,0,d,0,0)});resize.observe(stage);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting});observer.observe(stage);
 const transforms=new MutationObserver(()=>{canvas.style.transform=art.style.transform||'scale(1.035)'});transforms.observe(art,{attributes:true,attributeFilter:['style']});
 function bird(x,y,size,phase){const wing=Math.sin(phase)*size*.65;ctx.strokeStyle='rgba(77,77,57,.46)';ctx.lineWidth=Math.max(.85,size*.13);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x-size,y+wing);ctx.quadraticCurveTo(x-size*.35,y-size*.35,x,y);ctx.quadraticCurveTo(x+size*.35,y-size*.35,x+size,y+wing);ctx.stroke()}
 function flame(x,y,w,h,phase,color){const sway=Math.sin(phase)*w*.24;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x-w*.45,y);ctx.bezierCurveTo(x-w,y-h*.3,x+sway-w*.2,y-h*.75,x+sway,y-h);ctx.bezierCurveTo(x+sway+w*.15,y-h*.55,x+w*.7,y-h*.3,x+w*.45,y);ctx.closePath();ctx.fill()}
 function draw(now){if(!root.isConnected){resize.disconnect();observer.disconnect();return}const dt=previous?Math.min(now-previous,50):0;previous=now;if(!reduced.matches&&visible)t+=dt/1000;
 if(visible&&width){ctx.clearRect(0,0,width,height);
 if(theme!=='sangeet')for(let i=0;i<5;i++){const p=(t/(22+i*1.1)+i*.055)%1;const x=(-.14+p*1.28)*width;const y=((theme==='welcome'?.44:.365)+Math.sin(p*6+i*.45)*.016+i*.007)*height;bird(x,y,width*(.007+i*.0006),t*5+i)}
 if(theme==='wedding'){
 const x=width*.503,y=height*.895;
 const glow=ctx.createRadialGradient(x,y-height*.018,0,x,y-height*.018,width*.10);glow.addColorStop(0,'rgba(255,164,32,'+(.23+Math.sin(t*4)*.035)+')');glow.addColorStop(1,'rgba(255,157,20,0)');ctx.fillStyle=glow;ctx.fillRect(x-width*.13,y-height*.13,width*.26,height*.22);
 for(let i=0;i<5;i++){let h=height*(.038+.012*Math.sin(t*(4+i*.3)+i));flame(x+(i-2)*width*.012,y,width*.024,h,t*5+i,'rgba(244,121,22,.65)');flame(x+(i-2)*width*.011,y,width*.016,h*.78,t*6+i,'rgba(255,218,91,.88)');flame(x+(i-2)*width*.01,y,width*.008,h*.43,t*7+i,'rgba(255,246,190,.9)')}
 for(let i=0;i<6;i++){const p=(t*.33+i/6)%1;ctx.fillStyle='rgba(242,159,39,'+((1-p)*.65)+')';ctx.beginPath();ctx.arc(x+Math.sin(i*3+p*4)*width*.025,y-p*height*.1,Math.max(.6,width*.0018),0,Math.PI*2);ctx.fill()}
 }
 }frame=requestAnimationFrame(draw)}frame=requestAnimationFrame(draw);
 function move(event){if(event.pointerType==='touch'||reduced.matches)return;const r=stage.getBoundingClientRect();art.style.transform=`scale(1.055) translate(${(event.clientX-r.left-r.width/2)*-.015}px,${(event.clientY-r.top-r.height/2)*-.008}px)`}
 function leave(){art.style.transform='scale(1.035)'}
 stage.addEventListener('pointermove',move);stage.addEventListener('pointerleave',leave);
 return ()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();transforms.disconnect();stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerleave',leave);canvas.remove()};
}
