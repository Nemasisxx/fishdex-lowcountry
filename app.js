const $=s=>document.querySelector(s),key='fishdex-catches-v1',unlockKey='fishdex-unlocks-v1';
let catches=[];try{catches=JSON.parse(localStorage.getItem(key)||'[]')}catch{}
let unlocked={};try{unlocked=JSON.parse(localStorage.getItem(unlockKey)||'{}')}catch{}
// Temporary visual review mode: all artwork appears discovered without changing saved catches.
const REVIEW_ALL_VISIBLE=true;
const active=()=>$('#player').value;
const discovered=()=>REVIEW_ALL_VISIBLE?new Set(species.map(s=>s.id)):new Set([...(unlocked[active()]||[]),...catches.filter(c=>c.player===active()).map(c=>c.id)]);
function render(){
 const found=discovered(),q=$('#search').value.toLowerCase(),f=$('#filter').value,sort=$('#sort').value;
 const rank={C:0,U:1,R:2,E:3,L:4,M:5};
 $('#stats').textContent=found.size+' / '+species.length+' discovered';$('#progress-fill').style.width=(found.size/species.length*100)+'%';$('.progress').setAttribute('aria-valuenow',found.size);
 $('#grid').replaceChildren(...species.filter(s=>(s.name.toLowerCase().includes(q)||(s.scientificName||'').toLowerCase().includes(q))&&(f==='all'||(f==='caught'?found.has(s.id):!found.has(s.id)))).sort((a,b)=>sort==='rarity-asc'?(rank[a.rarity]-rank[b.rarity]||a.id-b.id):sort==='rarity-desc'?(rank[b.rarity]-rank[a.rarity]||a.id-b.id):sort==='name'?a.name.localeCompare(b.name):a.id-b.id).map(s=>{
  const b=document.createElement('button'),isFound=found.has(s.id);
  b.className='card '+(isFound?'discovered':'undiscovered');
  b.innerHTML='<div class="number"></div><div class="image-wrap"></div><strong></strong><span class="rarity"></span>';
  b.querySelector('.number').textContent='#'+String(s.id).padStart(3,'0');
  b.querySelector('strong').textContent=s.name;
  const rarity=b.querySelector('.rarity');rarity.textContent=tiers[s.rarity];rarity.style.color=colors[s.rarity];
  const img=new Image();img.alt=s.name;img.loading='lazy';b.querySelector('.image-wrap').append(img);FishDexArt.attach(s,img);
  b.setAttribute('aria-label',s.name+(isFound?' discovered':' undiscovered. Click to discover'));
  b.onclick=()=>discover(s,b);return b;
 }));
}
function discover(s,card){
 const wasFound=discovered().has(s.id);
 if(!wasFound){
  const ids=new Set(unlocked[active()]||[]);ids.add(s.id);unlocked[active()]=[...ids];
  localStorage.setItem(unlockKey,JSON.stringify(unlocked));
  card.classList.remove('undiscovered');card.classList.add('discovered','unlock-flash');
  $('#stats').textContent=discovered().size+' / '+species.length+' discovered';$('#progress-fill').style.width=(discovered().size/species.length*100)+'%';$('.progress').setAttribute('aria-valuenow',discovered().size);
 }
 const dlg=$('#award'),image=$('#award-image');image.replaceChildren();
 const art=new Image();art.alt=s.name;FishDexArt.attach(s,art);image.append(art);
 $('#award-kicker').textContent=wasFound?'COLLECTION ENTRY':'NEW DISCOVERY!';
 $('#award-title').textContent=s.name;
 $('#award-number').textContent='#'+String(s.id).padStart(3,'0')+' · '+tiers[s.rarity];
 dlg.classList.remove('play');void dlg.offsetWidth;dlg.classList.add('play');dlg.showModal();
 if(!wasFound)dlg.addEventListener('close',render,{once:true});
}
$('#award-close').onclick=()=>$('#award').close();
$('#award').onclick=e=>{if(e.target.id==='award')e.target.close()};
['search','filter','player','sort'].forEach(id=>$('#'+id).addEventListener(id==='search'?'input':'change',render));
render();

const savedIds=player=>new Set([...(unlocked[player]||[]),...catches.filter(c=>c.player===player).map(c=>c.id)]);
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
 const selected=(tankSelections[player]||[]).filter(id=>logged.has(id)).slice(0,5);
 tankSelections[player]=selected;
 choices.replaceChildren();
 const available=species.filter(s=>logged.has(s.id));
 if(!available.length){
  status.textContent='No catch logs yet. Your temporary all-unlocked preview does not count as a logged catch.';
 }else{
  status.textContent=selected.length+' / 5 selected · Click a fish to add or remove it.';
  available.forEach(f=>{
   const button=document.createElement('button');button.className='tank-choice';
   const picked=selected.includes(f.id);button.textContent=(picked?'✓ ':'+ ')+f.name;
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
const initialTab=location.hash.slice(1);if(['fishdex','achievements','leaderboards','hotspots','fishtank'].includes(initialTab))showTab(initialTab);

$('#tank-change').onclick=()=>{$('#tank-picker').hidden=!$('#tank-picker').hidden;renderTank()};
$('#tank-settings-toggle').onclick=()=>{$('#tank-settings').hidden=!$('#tank-settings').hidden};
$('#tank-reset').onclick=()=>window.resetFishTankView?.();
$('#tank-bubbles').onchange=e=>window.setFishTankOptions?.({bubbles:e.target.checked});
$('#tank-plants').onchange=e=>window.setFishTankOptions?.({plants:e.target.checked});
