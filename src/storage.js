// Browser-local catalogue. Originals remain in the source location; store only a derived thumbnail and metadata.
// A browser's IndexedDB can be evicted by the OS: do not present this as an archival backup.
const DB_NAME = 'photo-atelier-local-v1';
const DB_VERSION = 1;
function openDB() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) { reject(new Error('IndexedDB niedostępny')); return; }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('assets')) db.createObjectStore('assets', { keyPath:'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function transaction(mode, execute) {
  const db=await openDB();
  try {
    return await new Promise((resolve,reject)=>{
      const t=db.transaction('assets',mode);
      const req=execute(t.objectStore('assets'));
      let result;
      req.onsuccess=()=>{result=req.result;};
      req.onerror=()=>reject(req.error);
      t.onerror=()=>reject(t.error);
      t.onabort=()=>reject(t.error);
      t.oncomplete=()=>resolve(result);
    });
  } finally { db.close(); }
}
export function listAssets(){return transaction('readonly',s=>s.getAll());}
export function upsertAsset(asset){return transaction('readwrite',s=>s.put(asset));}
export function deleteAsset(id){return transaction('readwrite',s=>s.delete(id));}
export async function makePreview(file) {
  if (!/^image\/(jpeg|png|webp|gif|avif)$/i.test(file.type)) return null;
  let image;
  try {
    image = await createImageBitmap(file);
    const scale=Math.min(1,1400/Math.max(image.width,image.height));
    const canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(image.width*scale));
    canvas.height=Math.max(1,Math.round(image.height*scale));
    canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.8));
    return blob;
  } catch { return null; }
  finally { if (image && typeof image.close==='function') image.close(); }
}
export function kindOf(file) {
  const n=file.name.toLowerCase();
  if (/\.(nef|nrw|dng|cr3|arw|raf)$/i.test(n)) return 'RAW';
  if (/\.(xmp|np3)$/i.test(n)) return 'Preset';
  if (file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|heic|heif|tif|tiff)$/i.test(n)) return 'Zdjęcie';
  return 'Materiał';
}
export async function importFiles(files) {
  const all=await listAssets();const added=[];const skipped=[];
  for (const file of Array.from(files).slice(0,30)) {
    const duplicate=all.some(a=>a.name===file.name&&a.size===file.size&&a.modified===file.lastModified);
    if (duplicate) { skipped.push(file.name);continue; }
    const preview=await makePreview(file);
    const item={ id:crypto.randomUUID ? crypto.randomUUID() : String(Date.now()+Math.random()), name:file.name, size:file.size, modified:file.lastModified||0, type:file.type||'application/octet-stream', kind:kindOf(file), imported:new Date().toISOString(), source:'Wybrano przez systemowy selektor', originalStored:false, originalSync:false, preview };
    await upsertAsset(item);added.push(item);all.push(item);
  }
  return {added,skipped};
}
export function readableSize(size) {
  if (size<1024) return size+' B';
  if (size<1048576) return (size/1024).toFixed(0)+' KB';
  if (size<1073741824) return (size/1048576).toFixed(1)+' MB';
  return (size/1073741824).toFixed(2)+' GB';
}
export async function catalogueBackup() {
  const items=await listAssets();
  return { format:'photo-atelier-catalogue-v1', exported:new Date().toISOString(), note:'Kopia metadanych, bez oryginałów i podglądów. Nie zastępuje backupu fotografii.', assets:items.map(({preview,...rest})=>rest) };
}
export async function restoreCatalogue(data) {
  if (!data||data.format!=='photo-atelier-catalogue-v1'||!Array.isArray(data.assets)) throw new Error('Nieznany format katalogu');
  const existing=new Map((await listAssets()).map(a=>[a.id,a]));
  for (const a of data.assets.slice(0,10000)) {
    if (typeof a.id!=='string'||typeof a.name!=='string'||typeof a.size!=='number') continue;
    const prior=existing.get(a.id);
    await upsertAsset({id:a.id,name:a.name.slice(0,500),size:a.size,modified:Number(a.modified)||0,kind:String(a.kind||'Materiał'),type:String(a.type||''),source:String(a.source||'Katalog importowany'),imported:String(a.imported||''),originalStored:false,originalSync:false,preview:prior?.preview??null});
  }
  return data.assets.length;
}