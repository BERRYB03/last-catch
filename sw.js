// Last Catch Cup offline cache: keeps the scoreboard page + supabase-js available with no signal.
// Works from any folder (e.g. https://berryb03.github.io/last-catch/) because every path is relative to this file.
const CACHE='lcc-live-v2';
const LIB='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
const PAGES=['./','./index.html','./score_tracker_live.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all([...PAGES,LIB].map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>null)))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.hostname.endsWith('supabase.co'))return; // live data always goes to the network
  if(u.hostname==='cdn.jsdelivr.net'||u.hostname==='unpkg.com'){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res})));return}
  if(u.origin===self.location.origin){ // network first, cache fallback
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./').then(x=>x||caches.match('./index.html')).then(x=>x||caches.match('./score_tracker_live.html')))))}
});
