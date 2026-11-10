/* Local PDF output. No form data is sent to a server. */
(() => {
  'use strict';
  const panel = document.createElement('section');
  panel.className = 'output-panel'; panel.hidden = true;
  panel.innerHTML = `<div class="output-card" role="dialog" aria-modal="true" aria-labelledby="outputTitle"><h2 id="outputTitle">Drucken / PDF</h2><p role="status" id="outputStatus">PDF wird erstellt …</p><div class="output-actions"><a id="pdfOpen" target="_blank" rel="noopener">PDF öffnen / drucken</a><a id="pdfSave" download>PDF speichern</a><button id="pdfShare" type="button">PDF teilen</button><button id="outputClose" type="button">Schließen</button></div><p>iPhone / iPad: „PDF teilen“ wählen und im Systemmenü „Drucken“ oder „In Dateien sichern“. Alternativ das PDF öffnen und dort das Teilen-Menü verwenden.</p><p id="outputError" class="output-error" role="alert"></p></div>`;
  document.body.append(panel);
  const byId = id => document.getElementById(id);
  let url, file, trigger;
  function close() { panel.hidden = true; trigger?.focus(); }
  byId('outputClose').onclick = close;
  panel.addEventListener('click', e => { if(e.target === panel) close(); });
  document.addEventListener('keydown', e => {
    if(panel.hidden) return;
    if(e.key === 'Escape') close();
    if(e.key === 'Tab') {
      const controls = [...panel.querySelectorAll('a[href],button:not(:disabled)')].filter(el=>!el.hidden);
      const first = controls[0], last = controls[controls.length-1];
      if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  function collect() {
    const root=document.getElementById('certificatePreview');
    const paras=[...root.children].filter(el=>el.tagName==='P').map(el=>el.textContent);
    const issue=paras.pop()||'';
    return {title:root.querySelector('h1').textContent,person:root.querySelector('address').textContent.split('\n')[0],
      addressee:root.querySelector('address').textContent,paragraphs:paras,issue,
      signature:[...root.querySelectorAll('.signature p')].map(el=>el.textContent).filter(s=>!/^_+$/.test(s.trim()))};
  }
  async function makePdf(data) {
    if(!window.jspdf?.jsPDF||!window.createNexusCertificate)throw Error('Die PDF-Komponente ist noch nicht geladen. Bitte die App online neu öffnen.');
    const response=await fetch(new URL('../fonts/certificate-fonts.json',location.href));if(!response.ok)throw Error('Die Schriftdatei konnte nicht geladen werden. Bitte die App online neu öffnen.');
    const fonts=await response.json();
    const img=new Image();img.src=new URL('../nexus-logo.png',location.href).href;await img.decode();
    const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;canvas.getContext('2d').drawImage(img,0,0);
    const doc=window.createNexusCertificate(window.jspdf.jsPDF,data,fonts,{data:canvas.toDataURL('image/png'),width:img.naturalWidth,height:img.naturalHeight});
    return doc.output('blob');
  }
  async function openOutput(button) {
    trigger=button;const blocks=collect();panel.hidden=false;byId('outputError').textContent='';byId('outputStatus').textContent='PDF wird erstellt …';
    byId('pdfOpen').hidden=true;byId('pdfSave').hidden=true;byId('pdfShare').hidden=true;byId('outputClose').focus();
    try {
      const blob=await makePdf(blocks);if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(blob);
      const name='neXus_'+location.pathname.split('/').pop().replace('.html','')+'_'+new Date().toISOString().slice(0,10)+'.pdf';
      file=new File([blob],name,{type:'application/pdf'});
      byId('pdfOpen').href=url;byId('pdfSave').href=url;byId('pdfSave').download=name;
      byId('pdfOpen').hidden=false;byId('pdfSave').hidden=false;
      byId('pdfShare').hidden=!(navigator.canShare?.({files:[file]}));
      byId('outputStatus').textContent='PDF mit den aktuellen Angaben erstellt. Bitte vor Verwendung prüfen.';
      byId('pdfOpen').focus();
    } catch(err){byId('outputStatus').textContent='PDF konnte nicht erstellt werden.';byId('outputError').textContent=err.message;}
  }
  byId('pdfShare').onclick=async()=>{try{await navigator.share({files:[file],title:'neXus Dokument'});}catch(err){if(err.name!=='AbortError')byId('outputError').textContent='Teilen nicht möglich. Bitte „PDF speichern“ oder „PDF öffnen / drucken“ verwenden.';}};
  document.addEventListener('click',e=>{
    const button=e.target.closest('button');
    if(!button || button.closest('.output-panel'))return;
    if(button.id==='print'||/Drucken|als PDF speichern/.test(button.textContent)){
      e.preventDefault();e.stopImmediatePropagation();if(window.NexusPreflight)window.NexusPreflight.run(()=>openOutput(button));else openOutput(button);
    }
  },true);
})();
