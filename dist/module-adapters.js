(()=>{'use strict';document.addEventListener('DOMContentLoaded',()=>{
 const type=location.pathname.split('/').pop().replace('.html','');if(window.NexusModule)return;
 const $=id=>document.getElementById(id),required=(ids)=>ids.filter(id=>!$(id)?.value.trim()).map(id=>({level:'error',text:({'candidate':'Bewerbende Person','role':'Position','interviewer':'Gesprächsführung','date':'Datum','person':'Name','fromName':'Übergebende Person','toName':'Empfangende Person'}[id]||id)+' fehlt.'}));
 if(type==='exit')window.NexusModule={type,title:'Exitgespräch',getData:()=>window.data(),setData:d=>window.apply(d),check:()=>required(['person','date','interviewer'])};
 if(type==='bewertung'){
  const fields=()=>[...document.querySelectorAll('#candidate,#role,#interviewer,#date,#notes,#criteria input,#criteria select,#optionalCriteria input,#optionalCriteria select,#optionalControls input')];
  window.NexusModule={type,title:'Bewertungsbogen',getData:()=>({version:1,values:fields().map(e=>({value:e.value,checked:!!e.checked}))}),setData:d=>{const list=fields();if(!Array.isArray(d.values)||d.values.length!==list.length||d.values.some(x=>typeof x.value!=='string'||typeof x.checked!=='boolean'))throw Error('Bewertungsentwurf hat ein unbekanntes Format.');d.values.forEach((v,i)=>{list[i].value=v.value;list[i].checked=v.checked;});document.querySelectorAll('#optionalControls input').forEach(e=>e.dispatchEvent(new Event('change',{bubbles:true})));window.update();},check:()=>{const issues=required(['candidate','role','interviewer','date']);if($('weightStatus').classList.contains('warning'))issues.push({level:'error',text:$('weightStatus').textContent});if($('score').textContent==='–')issues.push({level:'error',text:'Bewertungen und Zusatzkriterien vollständig ausfüllen.'});return issues;}};
 }
 if(window.NexusModule)window.NexusModule.titleFromData=()=>['person','candidate','firstName'].map(id=>$(id)?.value.trim()).filter(Boolean).join(' ');
});})();
