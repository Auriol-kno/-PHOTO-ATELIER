// Cache app shell only. Never cache private uploads, origin files or cloud responses.
const CACHE = 'photo-atelier-shell-v03';
const APP_SHELL = ['/', '/index.html','/src/app.js','/src/catalog.js','/src/storage.js','/src/styles.css','/manifest.webmanifest','/icons/photo-atelier.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;
  if(!APP_SHELL.includes(url.pathname))return;
  event.respondWith(fetch(req).then(res=>{
    if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}
    return res;
  }).catch(()=>caches.match(req)));
});