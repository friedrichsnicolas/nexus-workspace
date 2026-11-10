/* A4 business-letter renderer, shared by browser export and layout checks. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else root.createNexusCertificate=factory;})(typeof window==='undefined'?globalThis:window,function(jsPDF,data,fonts,logo){
 'use strict';
 const doc=new jsPDF({unit:'mm',format:'a4',compress:true,putOnlyUsedFonts:true});
 doc.addFileToVFS('NexusSans.ttf',fonts.regular);doc.addFont('NexusSans.ttf','NexusSans','normal');
 doc.addFileToVFS('NexusSans-Bold.ttf',fonts.bold);doc.addFont('NexusSans-Bold.ttf','NexusSans','bold');
 doc.setProperties({title:data.title,subject:'neXus Procurement GmbH',author:'neXus Procurement GmbH',creator:'neXus Workspace'});
 const left=25,right=190,width=right-left,bottom=261,lineHeight=5.25,gap=4;
 let y=0,pageNumber=1;
 const clean=s=>String(s||'').replace(/\u00a0/g,' ').replace(/[\u2011\u2013\u2014]/g,'-');
 function font(size=11,bold=false,color=32){doc.setFont('NexusSans',bold?'bold':'normal');doc.setFontSize(size);doc.setTextColor(color);}
 function rule(at){doc.setDrawColor(34,83,120);doc.setLineWidth(.35);doc.line(left,at,right,at);}
 function addLogo(x,at,w){doc.addImage(logo.data,'PNG',x,at,w,w*logo.height/logo.width);}
 function header(first){
  if(first){
   addLogo(132,15,58);font(10.5,true);doc.text('neXus Procurement GmbH',left,22);
   font(9,false,90);doc.text('Am Heineshof 29',left,28);doc.text('41066 Mönchengladbach',left,33);doc.text('www.nexus-procurement.com',left,38);
   rule(44);font(7.5,false,100);doc.text('neXus Procurement GmbH · Am Heineshof 29 · 41066 Mönchengladbach',left,50);
   font(11);const address=clean(data.addressee).split('\n').filter(Boolean);address.forEach((line,i)=>doc.text(line,left,59+i*5));
   font(15,true);doc.text(clean(data.title),left,101);y=114;
  }else{
   font(9,true);doc.text(clean(data.title),left,24);font(8.5,false,95);doc.text(clean(data.person),left,30);addLogo(145,16,45);rule(37);y=49;
  }
 }
 function next(){doc.addPage();pageNumber++;header(false);}
 function linesFor(text){font();return doc.splitTextToSize(clean(text).replace(/\s+/g,' ').trim(),width);}
 function drawLine(line,isLast){
  font();const words=String(line).trim().split(/\s+/);
  if(!isLast&&words.length>1){const natural=words.reduce((sum,w)=>sum+doc.getTextWidth(w),0);const spacing=(width-natural)/(words.length-1);let x=left;words.forEach(w=>{doc.text(w,x,y);x+=doc.getTextWidth(w)+spacing;});}
  else doc.text(String(line),left,y);
  y+=lineHeight;
 }
 function paragraph(text){
  const lines=linesFor(text);if(!lines.length)return;
  let offset=0;
  while(offset<lines.length){
   let available=Math.floor((bottom-y)/lineHeight)+1,remaining=lines.length-offset;
   if(available<Math.min(2,remaining)){next();continue;}
   let count=Math.min(available,remaining);
   if(remaining>count&&remaining-count===1)count--;
   if(count<1){next();continue;}
   for(let i=0;i<count;i++)drawLine(lines[offset+i],offset+i===lines.length-1);
   offset+=count;if(offset<lines.length)next();
  }
  y+=gap;
 }
 header(true);
 const paragraphs=data.paragraphs.flatMap(s=>String(s).split(/\n\s*\n/)).filter(s=>s.trim());
 for(let i=0;i<paragraphs.length;i++){
  if(i===Math.max(0,paragraphs.length-3)){
   const tail=paragraphs.slice(i).reduce((sum,p)=>sum+linesFor(p).length*lineHeight+gap,0);
   const reserve=tail+8+22+data.signature.length*5;
   if(y+reserve>bottom&&reserve<210)next();
  }
  if(i===paragraphs.length-1){const finalLines=linesFor(paragraphs[i]).length;const signLines=data.signature.flatMap(s=>doc.splitTextToSize(clean(s),width)).length;const needed=finalLines*lineHeight+gap+8+22+signLines*5;
   if(y+needed>bottom&&needed<210)next();}
  paragraph(paragraphs[i]);
 }
 const signatureLines=data.signature.flatMap(s=>{font();return doc.splitTextToSize(clean(s),width);});
 if(y+10+22+signatureLines.length*5>bottom)next();
 y+=4;font();doc.text(clean(data.issue),left,y);y+=25;
 signatureLines.forEach((s,i)=>{font(11,i===0);doc.text(s,left,y);y+=5;});
 const total=doc.getNumberOfPages();
 for(let p=1;p<=total;p++){
  doc.setPage(p);doc.setDrawColor(196,207,215);doc.setLineWidth(.2);doc.line(left,274,right,274);
  font(7.5,false,100);doc.text('neXus Procurement GmbH',left,280);doc.text('Am Heineshof 29 · 41066 Mönchengladbach',left,284);
  doc.text('Sitz: Mönchengladbach · AG Mönchengladbach: HRB 22810',left,288);
  doc.text('www.nexus-procurement.com',right,280,{align:'right'});doc.text('Seite '+p+' von '+total,right,288,{align:'right'});
 }
 return doc;
});
