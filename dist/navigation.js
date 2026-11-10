(()=>{'use strict';
const base=new URL('./',document.currentScript.src);
const toggle=document.createElement('button');toggle.type='button';toggle.className='menu-toggle';toggle.setAttribute('aria-label','Navigation öffnen');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','workspaceNavigation');
const hamburger='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
const cross='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
toggle.innerHTML=hamburger;
const overlay=document.createElement('div');overlay.className='menu-backdrop';overlay.hidden=true;
const drawer=document.createElement('nav');drawer.id='workspaceNavigation';drawer.className='workspace-drawer';drawer.setAttribute('aria-label','Hauptnavigation');drawer.hidden=true;
const logo=document.createElement('a');logo.className='drawer-logo';logo.href=new URL('index.html',base);const img=document.createElement('img');img.src=new URL('nexus-logo.png',base);img.alt='neXus Procurement';logo.append(img);drawer.append(logo);
const label=document.createElement('p');label.className='drawer-label';label.textContent='WORKSPACE';drawer.append(label);
for(const [name,path] of [['Übersicht','index.html'],['Entwürfe','entwuerfe.html'],['Bewertungsrechner','tools/bewertung.html'],['Exitgespräch','tools/exit.html'],['Übergabe & Rückgabe','tools/protokoll.html'],['Zeugnisgenerator','tools/zeugnis.html'],['Onboarding & Offboarding','tools/checklisten.html']]){const a=document.createElement('a');a.className='drawer-link';a.textContent=name;a.href=new URL(path,base);if(new URL(a.href).pathname===location.pathname)a.setAttribute('aria-current','page');drawer.append(a);}
const foot=document.createElement('p');foot.className='drawer-footer';foot.textContent='neXus Procurement · HR Workspace';drawer.append(foot);document.body.append(overlay,drawer,toggle);
let saved=[];
function setOpen(open){toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Navigation schließen':'Navigation öffnen');toggle.innerHTML=open?cross:hamburger;drawer.hidden=!open;overlay.hidden=!open;document.body.classList.toggle('menu-open',open);
if(open){saved=[...document.body.children].filter(e=>e!==drawer&&e!==toggle&&e!==overlay&&e.tagName!=='SCRIPT').map(e=>[e,e.inert]);saved.forEach(([e])=>e.inert=true);drawer.querySelector('.drawer-link[aria-current]')?.focus();}
else{saved.forEach(([e,inert])=>e.inert=inert);saved=[];toggle.focus();}}
toggle.onclick=()=>setOpen(drawer.hidden);overlay.onclick=()=>setOpen(false);
drawer.addEventListener('click',e=>{if(e.target.closest('a'))setOpen(false);});
document.addEventListener('keydown',e=>{if(drawer.hidden)return;if(e.key==='Escape'){e.preventDefault();setOpen(false);}if(e.key==='Tab'){const controls=[toggle,...drawer.querySelectorAll('a')];const at=controls.indexOf(document.activeElement);e.preventDefault();controls[(at+(e.shiftKey?-1:1)+controls.length)%controls.length].focus();}});
})();