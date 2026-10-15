// Last Catch trip app: offline cache. Bump CACHE on every deploy so phones drop the old copy.
// Works from any folder (e.g. https://berryb03.github.io/last-catch/) because every path is relative to this file.
const CACHE='lcc-v3-2026-10-16a';
const LIBS=['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js'];
const CORE=['./','./index.html'];
const ASSETS=[
  './assets/jay.jpg',
  './assets/map-fishing.jpg',
  './assets/map-sidequests.jpg',
  './assets/most-wanted.jpg',
  './assets/rogues-gallery.jpg'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(async c=>{
  await c.addAll(CORE.map(u=>new Request(u,{cache:'reload'}))); // core page must be cached or the install fails
  await Promise.all([...ASSETS,...LIBS].map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>null)));
}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
function put(req,res){if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return res}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.hostname.endsWith('supabase.co'))return; // live data always goes to the network
  if(u.hostname==='cdn.jsdelivr.net'||u.hostname==='unpkg.com'){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>put(r,res))));return}
  if(u.origin!==self.location.origin)return;
  const isPage=r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('.html');
  if(isPage){ // network first (fresh app after a redeploy), cached copy if offline or the network takes > 4 s
    e.respondWith(new Promise(resolve=>{let done=false;
      const fallback=()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./',{ignoreSearch:true})).then(m=>m||caches.match('./index.html'));
      const t=setTimeout(()=>fallback().then(m=>{if(m&&!done){done=true;resolve(m)}}),4000);
      fetch(r,{cache:'no-cache'}).then(res=>{put(r,res);if(!done){done=true;clearTimeout(t);resolve(res)}})
        .catch(()=>fallback().then(m=>{if(!done){done=true;clearTimeout(t);resolve(m||new Response('Offline',{status:503,headers:{'Content-Type':'text/plain'}}))}}));
    }));return}
  // assets: cache first (they are versioned with CACHE), then network
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>put(r,res))));
});
