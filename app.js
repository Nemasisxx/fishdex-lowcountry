const $=s=>document.querySelector(s),key='fishdex-catches-v1',unlockKey='fishdex-unlocks-v1';
let catches=[];try{catches=JSON.parse(localStorage.getItem(key)||'[]')}catch{}
let unlocked={};try{unlocked=JSON.parse(localStorage.getItem(unlockKey)||'{}')}catch{}
const active=()=>$('#player').value;
const discovered=()=>new Set([...(unlocked[active()]||[]),...catches.filter(c=>c.player===active()).map(c=>c.id)]);
function render(){
 const found=discovered(),q=$('#search').value.toLowerCase(),f=$('#filter').value;
 $('#stats').textContent=found.size+'/'+species.length+' discovered · '+active();
 $('#grid').replaceChildren(...species.filter(s=>(s.name.toLowerCase().includes(q)||(s.scientificName||'').toLowerCase().includes(q))&&(f==='all'||(f==='caught'?found.has(s.id):!found.has(s.id)))).map(s=>{
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
  $('#stats').textContent=discovered().size+'/'+species.length+' discovered · '+active();
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
['search','filter','player'].forEach(id=>$('#'+id).addEventListener(id==='search'?'input':'change',render));
render();
