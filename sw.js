// GitHub Pages relative-path-safe application shell cache; no user files cached.
const CACHE = 'photo-atelier-shell-v03';
const PATHS=['./','./index.html','./src/app.js','./src/storage.js','./src/styles.css','./manifest.webmanifest','./icons/photo-atelier.svg'];
const URLS=PATHS.map(p=>new URL(p,self.registration.scope).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(URLS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('photo-atelier-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||!URLS.includes(req.url))return;
 event.respondWith(fetch(req).then(res=>{
  if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}
  return res;
 }).catch(()=>caches.match(req)));
});
