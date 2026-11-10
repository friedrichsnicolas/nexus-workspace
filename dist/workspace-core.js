(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else root.NexusStore=factory(root.localStorage);})(typeof window==='undefined'?globalThis:window,function(storage){
'use strict';const KEY='nexus-workspace-drafts-v1',types=['zeugnis','bewertung','exit','protokoll'];
const clone=x=>JSON.parse(JSON.stringify(x));const id=()=>globalThis.crypto?.randomUUID?.()||'d-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
function valid(d){return d&&typeof d.id==='string'&&[...types,'checklisten'].includes(d.type)&&typeof d.title==='string'&&d.data&&typeof d.data==='object'&&!Array.isArray(d.data)&&typeof d.updatedAt==='string';}
function read(){const raw=storage.getItem(KEY);if(!raw)return [];let parsed;try{parsed=JSON.parse(raw);}catch{throw Error('Der lokale Entwurfsspeicher ist beschädigt. Bitte vorhandene Sicherungen verwenden.');}if(parsed.version!==1||!Array.isArray(parsed.items)||!parsed.items.every(valid))throw Error('Der lokale Entwurfsspeicher hat ein unbekanntes Format.');return parsed.items;}
function write(items){try{storage.setItem(KEY,JSON.stringify({version:1,items}));}catch{throw Error('Speichern nicht möglich. Der Gerätespeicher ist voll oder nicht verfügbar. Bitte eine JSON-Sicherung herunterladen.');}}
function get(key){return clone(read().find(x=>x.id===key&&!x.deletedAt)||null);}
function save(draft){const items=read(),at=items.findIndex(x=>x.id===draft.id),old=items[at];const now=new Date().toISOString();const d={id:old?.id||id(),type:draft.type,title:draft.title,data:clone(draft.data),createdAt:old?.createdAt||now,updatedAt:now};delete d.deletedAt;if(!valid(d))throw Error('Der Entwurf ist unvollständig.');if(at>=0)items[at]=d;else items.push(d);write(items);return clone(d);}
function copy(key){const d=get(key);if(!d)throw Error('Entwurf nicht gefunden.');delete d.id;d.title+=' – Kopie';delete d.status;delete d.reviewer;delete d.reviewedAt;return save(d);}
function trash(key){const items=read(),d=items.find(x=>x.id===key);if(!d)throw Error('Entwurf nicht gefunden.');d.deletedAt=new Date().toISOString();write(items);}
function restore(key){const items=read(),d=items.find(x=>x.id===key);if(!d)throw Error('Entwurf nicht gefunden.');delete d.deletedAt;d.updatedAt=new Date().toISOString();write(items);}
function backup(){return {format:'nexus-workspace-backup',version:1,exportedAt:new Date().toISOString(),items:clone(read())};}
function importBackup(b){if(b?.format!=='nexus-workspace-backup'||b.version!==1||!Array.isArray(b.items)||!b.items.every(valid))throw Error('Bitte eine gültige Workspace-Sicherung auswählen.');const items=read();for(const original of b.items){const d=clone(original);if(items.some(x=>x.id===d.id)){d.id=id();d.title+=' – Import';}items.push(d);}write(items);return b.items.length;}
return {types,read:()=>clone(read()),get,save,copy,trash,restore,backup,importBackup,key:KEY};
});
