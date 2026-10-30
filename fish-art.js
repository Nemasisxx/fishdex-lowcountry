/* FishDex image pipeline: species-specific Wikimedia Commons photographs where available,
   with a distinct local SVG illustration fallback for every entry. No broken thumbnails. */
const FishDexArt=(()=>{
 const cacheKey='fishdex-photo-cache-v2';
 let cache={};try{cache=JSON.parse(localStorage.getItem(cacheKey)||'{}')||{}}catch{}
 const save=()=>{try{localStorage.setItem(cacheKey,JSON.stringify(cache))}catch{}};
 const hash=s=>[...s].reduce((a,c)=>(Math.imul(a,31)+c.charCodeAt(0))>>>0,2166136261);
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
 function fallback(s){
  const h=hash(s.name),shark=/shark|hammerhead/i.test(s.name),ray=/stingray/i.test(s.name),eel=/eel/i.test(s.name),flat=/flounder/i.test(s.name),gar=/gar|pickerel|barracuda|wahoo/i.test(s.name);
  const hue=h%360,accent=(h>>>9)%70+110;
  let body=ray?'<path d="M110 82 Q185 7 260 82 Q188 130 110 82Z" fill="url(#fish)" stroke="#d9f8ff" stroke-width="2"/><path d="M185 106 Q197 153 192 174" stroke="#9dd7df" stroke-width="4" fill="none"/>':eel?'<path d="M56 99 Q125 38 206 94 T325 95" stroke="url(#fish)" stroke-width="23" fill="none" stroke-linecap="round"/><path d="M56 99 Q125 38 206 94 T325 95" stroke="#ffffff" stroke-opacity=".22" stroke-width="3" fill="none"/>':flat?'<ellipse cx="181" cy="93" rx="112" ry="39" fill="url(#fish)" stroke="#d9f8ff" stroke-width="2"/><path d="M72 91 L37 61 L38 125Z" fill="#3c8190"/>':shark?'<path d="M52 94 L19 64 L27 96 L19 125 L53 104 Q127 69 184 77 L222 42 L226 80 Q282 79 323 97 Q274 116 210 108 L189 131 L179 107 Q111 117 52 94Z" fill="url(#fish)" stroke="#d9f8ff" stroke-width="2"/>':`<path d="M66 94 L25 62 L31 94 L25 126 L66 98 Q158 ${gar?65:39} 249 78 Q295 81 321 96 Q289 115 245 115 Q153 ${gar?129:150} 66 94Z" fill="url(#fish)" stroke="#d9f8ff" stroke-width="2"/><path d="M145 78 L171 47 L205 78" fill="#70bac8" opacity=".85"/><path d="M146 112 L174 134 L210 112" fill="#70bac8" opacity=".75"/>`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200" viewBox="0 0 360 200"><defs><linearGradient id="sea" x2="0" y2="1"><stop stop-color="#12364a"/><stop offset="1" stop-color="#06121c"/></linearGradient><linearGradient id="fish" x2="0" y2="1"><stop stop-color="hsl(${hue},${accent/3}%,64%)"/><stop offset="1" stop-color="hsl(${hue},43%,22%)"/></linearGradient></defs><rect width="360" height="200" fill="url(#sea)"/><path d="M0 145 Q80 126 170 149 T360 145 M0 168 Q80 149 170 172 T360 168" stroke="#2e8195" opacity=".25" fill="none"/>${body}<circle cx="${ray?198:gar?283:281}" cy="${ray?80:91}" r="4" fill="#08171e"/><circle cx="${ray?199:gar?284:282}" cy="${ray?79:90}" r="1.4" fill="#fff"/><text x="12" y="184" fill="#b5e7ee" font-family="sans-serif" font-size="12">#${String(s.id).padStart(3,'0')} · ${esc(s.name)}</text><text x="348" y="16" text-anchor="end" fill="#83aeb9" font-family="sans-serif" font-size="9">ILLUSTRATION</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
 }
 async function commons(s){
  const term=s.scientificName&&!s.scientificName.includes('×')?s.scientificName:s.name.replace(/ \(.*\)/,'');
  const url='https://commons.wikimedia.org/w/api.php?'+new URLSearchParams({action:'query',generator:'search',gsrsearch:'filetype:bitmap '+term,gsrnamespace:'6',gsrlimit:'8',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'480',format:'json',origin:'*'});
  const ctrl=new AbortController(),timeout=setTimeout(()=>ctrl.abort(),8500);
  try{
   const response=await fetch(url,{signal:ctrl.signal});if(!response.ok)throw Error('HTTP '+response.status);
   const data=await response.json();
   const pages=Object.values(data.query?.pages||{}).filter(p=>p.imageinfo?.[0]?.thumburl);
   const normalized=term.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
   const matches=pages.filter(p=>p.title.toLowerCase().replace(/[^a-z0-9]+/g,' ').includes(normalized));
   const selected=matches[0];if(!selected)return null;
   const info=selected.imageinfo[0],meta=info.extmetadata||{};
   return {url:info.thumburl,source:info.descriptionurl||info.url,license:meta.LicenseShortName?.value||'See Wikimedia Commons',author:meta.Artist?.value?.replace(/<[^>]+>/g,'').slice(0,120)||'Wikimedia Commons'};
  }finally{clearTimeout(timeout)}
 }
 let queue=[],running=0;
 function pump(){while(running<4&&queue.length){const job=queue.shift();running++;(async()=>{try{let found=cache[job.s.id];if(found===undefined){found=await commons(job.s);cache[job.s.id]=found||null;save()}if(found?.url)job.apply(found)}catch{}finally{running--;pump()}})()}}
 function attach(s,img){img.src=fallback(s);img.dataset.imageType='illustration';queue.push({s,apply:found=>{if(!img.isConnected)return;const photo=new Image();photo.referrerPolicy='no-referrer';photo.onload=()=>{if(!img.isConnected)return;img.src=found.url;img.dataset.imageType='photograph';img.title='Wikimedia Commons photograph · '+found.license+' · '+found.author+' · '+found.source};photo.src=found.url}});pump()}
 return {attach,fallback};
})();