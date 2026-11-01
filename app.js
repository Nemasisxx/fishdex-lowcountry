const $=s=>document.querySelector(s),key='fishdex-catches-v1',unlockKey='fishdex-unlocks-v1';
let catches=[];try{catches=JSON.parse(localStorage.getItem(key)||'[]')}catch{}
let unlocked={};try{unlocked=JSON.parse(localStorage.getItem(unlockKey)||'{}')}catch{}
const active=()=>$('#player').value;
let verifiedIds=new Set();
const discovered=()=>verifiedIds;
function render(){
 const found=discovered(),q=$('#search').value.toLowerCase(),f=$('#filter').value,sort=$('#sort').value;
 const rank={C:0,U:1,R:2,E:3,L:4,M:5};
 $('#stats').textContent=found.size+' / '+species.length+' discovered';$('#progress-fill').style.width=(found.size/species.length*100)+'%';$('.progress').setAttribute('aria-valuenow',found.size);
 $('#grid').replaceChildren(...species.filter(s=>(s.name.toLowerCase().includes(q)||(s.scientificName||'').toLowerCase().includes(q))&&(f==='all'||(f==='caught'?found.has(s.id):!found.has(s.id)))).sort((a,b)=>sort==='rarity-asc'?(rank[a.rarity]-rank[b.rarity]||a.id-b.id):sort==='rarity-desc'?(rank[b.rarity]-rank[a.rarity]||a.id-b.id):sort==='name'?a.name.localeCompare(b.name):a.id-b.id).map(s=>{
  const b=document.createElement('button'),isFound=found.has(s.id);
  b.className='card '+(isFound?'discovered':'undiscovered');b.dataset.speciesId=String(s.id);
  b.innerHTML='<div class="number"></div><div class="image-wrap"></div><strong></strong><span class="rarity"></span>';if(!isFound){const lock=document.createElement('span');lock.className='fish-lock';lock.textContent='🔒';lock.setAttribute('aria-hidden','true');b.append(lock)}
  b.querySelector('.number').textContent='#'+String(s.id).padStart(3,'0');
  b.querySelector('strong').textContent=s.name;
  const rarity=b.querySelector('.rarity');rarity.textContent=tiers[s.rarity];rarity.style.color=colors[s.rarity];
  const img=new Image();img.alt=s.name;img.loading='lazy';b.querySelector('.image-wrap').append(img);FishDexArt.attach(s,img);
  b.setAttribute('aria-label',s.name+(isFound?' verified':' locked. Submit a photo to unlock'));
  b.onclick=()=>discover(s,b);return b;
 }));
}
function discover(s){
 if(!discovered().has(s.id)){document.getElementById('fishdex-verify-status').textContent='🔒 '+s.name+' is locked. Submit a fish photo for verification to unlock it.';document.getElementById('fishdex-verify-panel').scrollIntoView({behavior:'smooth',block:'center'});return}
 const dlg=$('#award'),image=$('#award-image');image.replaceChildren();
 const art=new Image();art.alt=s.name;FishDexArt.attach(s,art);image.append(art);
 $('#award-kicker').textContent='VERIFIED COLLECTION ENTRY';$('#award-title').textContent=s.name;
 $('#award-number').textContent='#'+String(s.id).padStart(3,'0')+' · '+tiers[s.rarity];
 dlg.showModal();
}
function fishdexPreviewUnlock(){
 const locked=species.find(f=>!verifiedIds.has(f.id))||species[0];
 const search=$('#search'),filter=$('#filter');
 search.value='';filter.value='all';render();
 const target=document.querySelector('[data-species-id="'+locked.id+'"]');
 if(!target)return;
 target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
 setTimeout(()=>{
  if(!target.isConnected)return;
  target.classList.remove('undiscovered');target.classList.add('discovered','unlock-celebrate');
  const lock=target.querySelector('.fish-lock');if(lock)lock.remove();
  const img=target.querySelector('img');if(img)img.style.filter='none';
  const dlg=$('#award'),image=$('#award-image');image.replaceChildren();
  const art=new Image();art.alt=locked.name;FishDexArt.attach(locked,art);image.append(art);
  $('#award-kicker').textContent='✨ PREVIEW — SIMULATED UNLOCK';
  $('#award-title').textContent=locked.name;
  $('#award-number').textContent='#'+String(locked.id).padStart(3,'0')+' · '+tiers[locked.rarity]+' · No progress saved';
  if(!dlg.open)dlg.showModal();
  const reset=()=>{dlg.removeEventListener('close',reset);render()};
  dlg.addEventListener('close',reset,{once:true});
 },850);
}
document.getElementById('fishdex-preview-unlock').addEventListener('click',fishdexPreviewUnlock);
async function fishdexRefreshCatchLog(client,user){
 const summary=document.getElementById('fishdex-catch-summary'),list=document.getElementById('fishdex-catch-log'),recent=document.getElementById('fishdex-recent-list');
 if(!user){summary.textContent='Sign in to see your catch totals.';list.replaceChildren();return}
 const {data,error}=await client.from('verified_fish_catches').select('species_id,species_name,length_inches,verified_at').eq('user_id',user.id).order('verified_at',{ascending:false}).limit(5000);
 if(error){summary.textContent='Catch log unavailable: '+error.message+' (database migration may still need to run).';list.replaceChildren();return}
 const records=data||[],grouped=new Map();
 for(const item of records){
  const id=Number(item.species_id),entry=grouped.get(id)||{name:item.species_name,count:0,best:null};
  entry.count++;
  if(item.length_inches!==null&&item.length_inches!==undefined){const n=Number(item.length_inches);if(Number.isFinite(n))entry.best=Math.max(entry.best??0,n)}
  grouped.set(id,entry);
 }
 summary.textContent=records.length+' verified catches · '+grouped.size+' species logged'+(records.length===5000?' · Showing most recent 5,000':'');
 list.replaceChildren();
 if(!grouped.size){list.textContent='No verified catches logged yet.'}
 else for(const [id,item] of [...grouped].sort((a,b)=>b[1].count-a[1].count||a[1].name.localeCompare(b[1].name))){
  const row=document.createElement('div');row.className='recent-entry';
  const title=document.createElement('strong');title.textContent=item.name;
  const details=document.createElement('span');details.textContent=item.count+' caught · Best: '+(item.best===null?'Not measured':item.best+' in (reported)');
  row.append(title,details);list.append(row);
 }
 if(recent){recent.replaceChildren();if(!records.length)recent.textContent='No verified catches yet.';else for(const item of records.slice(0,5)){
  const row=document.createElement('div');row.className='recent-entry';
  const title=document.createElement('strong');title.textContent=item.species_name;
  const detail=document.createElement('span');detail.textContent=new Date(item.verified_at).toLocaleDateString()+(item.length_inches===null?'':' · '+item.length_inches+' in');
  row.append(title,detail);recent.append(row)
 }}
}
async function fishdexRefreshVerified(){
 const client=window.fishdexSupabase;if(!client)return;
 const {data:{user}}=await client.auth.getUser();if(!user){verifiedIds=new Set();const recent=document.getElementById('fishdex-recent-list');if(recent)recent.textContent='Sign in to view verified catches.';await fishdexRefreshCatchLog(client,null);render();return}
 const {data,error}=await client.from('verified_fish_unlocks').select('species_id,verified_at').eq('user_id',user.id).order('verified_at',{ascending:false});
 if(error){document.getElementById('fishdex-verify-status').textContent='Verified progress unavailable: '+error.message;return}
 verifiedIds=new Set((data||[]).map(x=>Number(x.species_id)));const recent=document.getElementById('fishdex-recent-list');if(recent){recent.replaceChildren();if(!data?.length)recent.textContent='No verified catches yet.';else for(const item of data.slice(0,5)){const fish=species.find(x=>x.id===Number(item.species_id));if(!fish)continue;const row=document.createElement('div');row.className='recent-entry';const name=document.createElement('strong');name.textContent=fish.name;const badge=document.createElement('span');badge.textContent='✓ Verified';badge.style.color='#7cf2ce';row.append(name,badge);recent.append(row)}}render();await fishdexRefreshCatchLog(client,user);
}
async function fishdexVerifyPhoto(redoMode=false){
 const redo=document.getElementById('fishdex-redo-button');
 const status=document.getElementById('fishdex-verify-status'),file=document.getElementById('fishdex-photo').files?.[0],button=document.getElementById('fishdex-verify-button');
 if(!file){status.textContent='Take a photo or select an image first.';return}
 if(!file.type.startsWith('image/')||file.size>8*1024*1024){status.textContent='Use a JPG, PNG, or WEBP image under 8 MB.';return}
 const client=window.fishdexSupabase;if(!client){status.textContent='Sign in service is not ready.';return}
 const {data:{session}}=await client.auth.getSession();
 if(!session){status.textContent='Please log in before verifying a fish.';return}
 button.disabled=true;redo.disabled=true;status.textContent='Analyzing photo securely…';
 try{
  const base64=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=reject;reader.readAsDataURL(file)});
  const lengthInput=document.getElementById('fishdex-length');const lengthText=lengthInput.value.trim();const lengthInches=lengthText===''?null:Number(lengthText);
  if(lengthText!==''&&(!Number.isFinite(lengthInches)||lengthInches<=0||lengthInches>300)){status.textContent='Enter a valid length in inches (0–300), or leave it blank.';return}
  const {data,error}=await client.functions.invoke('verify-fish',{body:{image:base64,mimeType:file.type,fishermanHint:document.getElementById('fishdex-fisherman-hint').value.trim(),lengthInches,redo:redoMode===true}});
  if(error){
   let details='';
   try{const response=error.context;if(response?.json){const payload=await response.json();details=payload?.reason||payload?.error||payload?.message||''}else if(response?.text){details=await response.text()}}catch{}
   throw Error(details||error.message||'Verification unavailable');
  }
  if(!data?.verified){status.textContent='Not unlocked: '+(data?.reason||'The photo could not be confidently matched to a FishDex species.');return}
  status.textContent='🏆 Verified '+data.speciesName+'! '+(data.alreadyUnlocked?'Another catch logged!':'New species unlocked!')+(data.catchCount?' Total: '+data.catchCount+'.':'')+(data.bestLengthInches?' Best: '+data.bestLengthInches+' in (reported).':'');
  await fishdexRefreshVerified();
  if(!data.alreadyUnlocked){document.getElementById('search').value='';document.getElementById('filter').value='all';render();const target=document.querySelector('[data-species-id="'+Number(data.speciesId)+'"]');if(target){target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});setTimeout(()=>{target.classList.add('unlock-celebrate');discover(species.find(s=>s.id===Number(data.speciesId)))},850)}}
 }catch(e){status.textContent='Verification failed: '+e.message}
 finally{button.disabled=false;redo.disabled=false}
}
document.getElementById('fishdex-verify-button').addEventListener('click',()=>fishdexVerifyPhoto(false));
document.getElementById('fishdex-redo-button').addEventListener('click',()=>fishdexVerifyPhoto(true));
window.addEventListener('fishdex-auth-change',fishdexRefreshVerified);
setTimeout(fishdexRefreshVerified,900);
$('#award-close').onclick=()=>$('#award').close();
$('#award').onclick=e=>{if(e.target.id==='award')e.target.close()};
['search','filter','player','sort'].forEach(id=>$('#'+id).addEventListener(id==='search'?'input':'change',render));
render();

const savedIds=player=>verifiedIds;
function showTab(name){
 document.querySelectorAll('.site-nav [data-tab]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===name)));
 document.querySelectorAll('.tab-panel').forEach(p=>p.hidden=p.id!=='tab-'+name);
 if(name==='achievements')renderAchievements();
 if(name==='leaderboards')renderLeaderboard();
 if(name==='fishtank')renderTank();
}
document.querySelectorAll('.site-nav [data-tab]').forEach(b=>b.addEventListener('click',()=>{showTab(b.dataset.tab);location.hash=b.dataset.tab}));
function renderAchievements(){
 const count=savedIds(active()).size;
 const badges=[['First Catch',1,'Discover your first fish'],['Getting Started',5,'Discover 5 fish'],['Weekend Angler',10,'Discover 10 fish'],['Dedicated Angler',25,'Discover 25 fish'],['Halfway There',50,'Discover 50 fish'],['FishDex Master',99,'Discover all 99 fish']];
 const grid=$('#achievement-grid');grid.replaceChildren(...badges.map(([name,goal,desc])=>{
  const card=document.createElement('div');card.className='feature-card';
  const title=document.createElement('h3');title.textContent=(count>=goal?'🏆 ':'🔒 ')+name;
  const p=document.createElement('p');p.textContent=desc;
  const progress=document.createElement('div');progress.className='count';progress.textContent=Math.min(count,goal)+' / '+goal;
  card.append(title,p,progress);return card;
 }));
}
function renderLeaderboard(){
 const board=$('#leaderboard-list');board.replaceChildren();
 const players=[...$('#player').options].map(o=>o.value).sort((a,b)=>savedIds(b).size-savedIds(a).size);
 players.forEach((name,i)=>{const row=document.createElement('div');row.className='leader-row';const label=document.createElement('strong');label.textContent=(i+1)+'. '+name;const count=document.createElement('span');count.textContent=savedIds(name).size+' / 99 caught';row.append(label,count);board.append(row)});
}
const tankStorageKey='fishdex-tank-top5-v1';
let tankSelections={};try{tankSelections=JSON.parse(localStorage.getItem(tankStorageKey)||'{}')}catch{}
function renderTank(){
 const player=active(),logged=savedIds(player),choices=$('#tank-picks'),status=$('#tank-pick-status');
 const selected=(tankSelections[player]||[]).filter(id=>species.some(f=>f.id===id)).slice(0,5);
 tankSelections[player]=selected;
 choices.replaceChildren();
 const available=species;
 if(!available.length){
  status.textContent='No catch logs yet. Only verified catches count toward collection progress.';
 }else{
  status.textContent=selected.length+' / 5 selected · All 99 fish are available for aquarium preview; only actual catches count toward achievements.';
  available.forEach(f=>{
   const button=document.createElement('button');button.className='tank-choice';
   const picked=selected.includes(f.id);button.textContent=(picked?'✓ ':'+ ')+f.name+(logged.has(f.id)?' · Caught':' · Preview');
   button.setAttribute('aria-pressed',String(picked));button.disabled=!picked&&selected.length>=5;
   button.onclick=()=>{
    const next=picked?selected.filter(id=>id!==f.id):[...selected,f.id].slice(0,5);
    tankSelections[player]=next;localStorage.setItem(tankStorageKey,JSON.stringify(tankSelections));renderTank();
   };
   choices.append(button);
  });
 }
 const fish=selected.map(id=>species.find(s=>s.id===id)).filter(Boolean);
 $('#tank-count').textContent='('+fish.length+'/5)';
 const tray=$('#tank-selected');tray.replaceChildren();
 fish.forEach(f=>{const card=document.createElement('div');card.className='tank-fish-card';const img=new Image();img.alt=f.name;FishDexArt.attach(f,img);const name=document.createElement('span');name.textContent=f.name;const remove=document.createElement('button');remove.textContent='×';remove.setAttribute('aria-label','Remove '+f.name);remove.onclick=()=>{tankSelections[player]=selected.filter(id=>id!==f.id);localStorage.setItem(tankStorageKey,JSON.stringify(tankSelections));renderTank()};card.append(img,name,remove);tray.append(card)});
 if(!fish.length){const p=document.createElement('p');p.textContent='Select your catches to populate the tank.';tray.append(p)}
 if(window.renderFishTank3D)window.renderFishTank3D(fish);
 else window.pendingFishTank=fish;
}

$('#player').addEventListener('change',()=>{const name=location.hash.slice(1);if(name==='achievements')renderAchievements();if(name==='leaderboards')renderLeaderboard();if(name==='fishtank')renderTank()});
const initialTab=location.hash.slice(1);if(['fishdex','achievements','leaderboards','hotspots'].includes(initialTab))showTab(initialTab);

$('#tank-change').onclick=()=>{$('#tank-picker').hidden=!$('#tank-picker').hidden;renderTank()};
$('#tank-settings-toggle').onclick=()=>{$('#tank-settings').hidden=!$('#tank-settings').hidden};
$('#tank-reset').onclick=()=>window.resetFishTankView?.();
$('#tank-bubbles').onchange=e=>window.setFishTankOptions?.({bubbles:e.target.checked});
$('#tank-plants').onchange=e=>window.setFishTankOptions?.({plants:e.target.checked});
