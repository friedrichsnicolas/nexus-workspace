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
    const blocks = []; let line = '';
    const flush = () => { if(line.trim()) blocks.push({text:line.replace(/\s+/g,' ').trim()}); line = ''; };
    function walk(el) {
      if(el.nodeType===Node.TEXT_NODE){line += el.textContent;return;}
      if(el.nodeType!==Node.ELEMENT_NODE) return;
      if(el.matches('script,style,nav,button,input[type=file],.toolbar,.backupbar,.output-panel,.leavehint,#status,.chips,.optional-controls,.optional-heading,.workflowbar,.preflight-panel,.ws-filters,.nexus-masthead,.nexus-site-footer')) return;
      if(el.hidden || getComputedStyle(el).display==='none' || getComputedStyle(el).visibility==='hidden') return;
      if(el.matches('input,select,textarea')) {
        let value = el.tagName==='SELECT' ? el.selectedOptions[0]?.textContent : el.value;
        if(el.type==='checkbox'||el.type==='radio') value=el.checked?'[Ja]':'[Nein]';
        line += ' ' + (value || '—') + ' '; return;
      }
      if(el.tagName==='TR') {
        flush(); const values=[...el.children].map(cell=>{
          const clone=cell.cloneNode(true);
          [...clone.querySelectorAll('input,select,textarea')].forEach((copy,i)=>{
            const original=cell.querySelectorAll('input,select,textarea')[i];
            copy.replaceWith(document.createTextNode(original.tagName==='SELECT'?(original.selectedOptions[0]?.textContent||'-'):(original.value||'-')));
          });
          return clone.textContent.replace(/\s+/g,' ').trim();
        });blocks.push({text:values.join(' | ')});return;
      }
      if(el.tagName==='CANVAS') {flush();blocks.push({image:el.toDataURL('image/png'),ratio:el.width/el.height});return;}
      if(el.tagName==='IMG'||el.tagName==='SVG') return;
      if(el.tagName==='BR'){flush();return;}
      const block = /^(block|flex|grid|table|table-row|list-item)/.test(getComputedStyle(el).display);
      if(block) flush();
      const start=blocks.length;
      for(const child of el.childNodes) walk(child);
      if(block) flush();
      if(/^H[1-6]$/.test(el.tagName)) blocks.slice(start).forEach(b=>b.heading=true);
      if(el.tagName==='TD'||el.tagName==='TH') line+=' | ';
    }
    walk(document.querySelector('[data-output-root]') || document.body);flush();return blocks;
  }
  async function makePdf(blocks) {
    if(!window.jspdf?.jsPDF) throw Error('Die PDF-Komponente ist noch nicht geladen. Bitte die App online neu öffnen.');
    const doc = new window.jspdf.jsPDF({unit:'mm',format:'a4',compress:true,putOnlyUsedFonts:true});
    const response=await fetch(new URL('../fonts/certificate-fonts.json',location.href));if(!response.ok)throw Error('Schriftdatei konnte nicht geladen werden. Bitte die App online neu öffnen.');const fonts=await response.json();
    doc.addFileToVFS('NexusSans.ttf',fonts.regular);doc.addFont('NexusSans.ttf','NexusSans','normal');doc.addFileToVFS('NexusSans-Bold.ttf',fonts.bold);doc.addFont('NexusSans-Bold.ttf','NexusSans','bold');
    const img = new Image(); img.src = new URL('../nexus-logo.png',location.href).href;
    await img.decode();
    const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
    canvas.getContext('2d').drawImage(img,0,0);
    const logo=canvas.toDataURL('image/png');
    let y=18;
    const header=()=>{doc.addImage(logo,'PNG',15,10,44,44/img.naturalWidth*img.naturalHeight);y=18+44/img.naturalWidth*img.naturalHeight;};
    const page=()=>{doc.addPage();header();}; header();
    for(const block of blocks){
      if(block.image){const w=85,h=Math.min(45,w/block.ratio);if(y+h>278)page();doc.addImage(block.image,'PNG',15,y,w,h);y+=h+5;continue;}
      if(block.heading&&y>258)page();
      doc.setFont('NexusSans',block.heading?'bold':'normal');doc.setFontSize(block.heading?13:10);
      const text=block.text.replace(/[↗↙→←]/g,' ').replace(/—/g,'-');
      const lines=doc.splitTextToSize(text,180);const lineHeight=block.heading?6:4.8;
      for(const line of lines){if(y+lineHeight>278)page();doc.text(line,15,y);y+=lineHeight;}
      y+=block.heading?3:1.7;
    }
    const pages=doc.getNumberOfPages();
    for(let i=1;i<=pages;i++){doc.setPage(i);doc.setFont('NexusSans','normal');doc.setFontSize(8);doc.setTextColor(90);doc.text(`neXus Procurement | ${i} / ${pages}`,15,289);doc.setTextColor(0);}
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
