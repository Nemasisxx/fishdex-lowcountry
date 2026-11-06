(()=>{'use strict';
function el(tag,text,css){const n=document.createElement(tag);n.textContent=text;n.style.cssText=css||'';return n}
let selectedWater='unknown';
function show(){
 const box=document.getElementById('fd-regulations-detail');if(!box)return;
 const name=document.getElementById('fg-title')?.textContent?.trim();
 const fish=(window.FISHDEX_REGULATIONS_2026||[]).find(x=>x.name===name);
 box.replaceChildren();
 const extra=window.FISHDEX_REGULATIONS_EXTRA?.[name];
 const known=!!extra||fish?.status==='published-2026-reference';
 const protectedFish=new Set(['Atlantic Sturgeon','Shortnose Sturgeon','Great White Shark','Sandbar Shark']);
 if(protectedFish.has(name)){
  const notice=el('div','','width:100%;padding:18px;border-radius:12px;background:#123d4e;border:1px solid #2d7181;text-align:center');
  notice.append(el('div','🛡️ Protected Species','font-size:22px;font-weight:800;color:#a8e7e3;margin-bottom:8px'),el('div','Catch & Release','font-size:25px;font-weight:900;color:#ffffff'));
  box.append(notice);
  return;
 }
 const locationNote=selectedWater==='unknown'?'⚠ Select fishing waters to check location-specific rules.':selectedWater==='federal'?'⚠ Federal limits and closures may differ. Verify before keeping fish.':selectedWater==='other-fresh'||selectedWater==='santee'||selectedWater==='coastal-river'?'⚠ River and lake rules may differ. Verify before keeping fish.':'⚠ Local restrictions may differ. Verify before keeping fish.';
 box.append(el('div',locationNote,'width:100%;font-size:13px;color:#ffd58d'));
 const fields=[['📏','Fish size',known?(extra?.size||fish.size):'Not confirmed'],['🐟','You can keep',known?(extra?.bag||fish.bag):'Not confirmed']];
 for(const [emoji,label,value] of fields){
  const card=el('div','','background:#123d4e;border:1px solid #2d7181;border-radius:12px;padding:14px;flex:1;min-width:145px');
  card.append(el('div',emoji+' '+label,'color:#a8e7e3;font-size:14px;font-weight:700;margin-bottom:8px'),el('div',value,'font-size:19px;font-weight:800;line-height:1.4;color:white'));
  box.append(card);
 }
 const seasonal={
  'Cobia':{months:[5],label:'Closed May 1–31 south of Jeremy Inlet',type:'area'},
  'Gag Grouper':{months:[8,9,10,11,12,1,2,3,4],label:'Federal waters: closed Aug 2–Apr 30',type:'federal',dayStart:2},
  'Scamp':{months:[1,2,3,4],label:'Federal waters: closed Jan 1–Apr 30',type:'federal'},
  'Greater Amberjack':{months:[4],label:'Federal waters: closed Apr 1–30',type:'federal'},
  'Striped Bass':{months:[6,7,8,9],label:'Many Lowcountry rivers: closed Jun 16–Sep 30',type:'area',dayStart:16}
 };
 const season=seasonal[name];
 const today=new Date();
 const month=today.getMonth()+1,day=today.getDate();
 let seasonText='Check Season',seasonColor='#ffd58d';
 if(season){
  let closed=season.months.includes(month);
  if(name==='Gag Grouper'&&month===8&&day<2)closed=false;
  if(name==='Striped Bass'&&month===6&&day<16)closed=false;
  const applies=season.type==='federal'?selectedWater==='federal':name==='Cobia'?selectedWater==='south-jeremy':name==='Striped Bass'?selectedWater==='coastal-river':false;
  if(selectedWater==='unknown'||!applies){
   seasonText=(selectedWater==='unknown'?'⚠ Choose fishing waters':'⚠ Check local rules')+' — '+season.label;
  }else{
   seasonText=(closed?'🔴 Harvest closed':'🟢 Outside listed closure')+' — '+season.label;
  }
  seasonColor=applies&&closed?'#ffc4a9':'#ffd58d';
 }else if(name==='Red Drum'||name==='Spotted Seatrout'||name==='Black Drum'||name==='Sheepshead'){
  seasonText='🟢 Open year-round (harvest season)';seasonColor='#b7f5d0';
 }
 const seasonCard=el('div','','width:100%;background:#123d4e;border:1px solid #2d7181;border-radius:12px;padding:14px');
 seasonCard.append(el('div','📅 Fishing season','color:#a8e7e3;font-size:14px;font-weight:700;margin-bottom:8px'),el('div',seasonText,'font-size:17px;font-weight:800;line-height:1.4;color:'+seasonColor));
 box.append(seasonCard);
 if(!known)box.append(el('div','⚠ Ask an adult to check the rules before keeping this fish.','width:100%;font-size:13px;color:#ffd58d'));
}
function init(){
 const dialog=document.getElementById('fish-guide-dialog');if(!dialog)return;
 let panel=document.getElementById('fd-regulations');
 if(!panel){panel=el('section','','margin:18px 0;padding:16px;border:1px solid #368b9d;border-radius:15px;background:#092b3b');panel.id='fd-regulations';const shell=dialog.querySelector('.fg-shell')||dialog;const actions=shell.querySelector('.fg-actions');if(actions)actions.before(panel);else shell.append(panel)}
 panel.replaceChildren();
 panel.append(el('h3','Can I keep this fish?','margin:0 0 12px;color:#7cebdc;font-size:20px'));
 const waterWrap=el('div','','margin-bottom:12px');
 waterWrap.append(el('label','📍 Where are you fishing?','display:block;color:#a8e7e3;font-size:14px;font-weight:700;margin-bottom:7px'));
 const waterSelect=el('select','','width:100%;padding:10px;border-radius:9px;background:#123d4e;color:#fff;border:1px solid #368b9d;font-size:15px');
 const options=[['unknown','Choose fishing waters'],['state-coastal','SC coastal state waters'],['south-jeremy','SC coastal waters south of Jeremy Inlet'],['federal','Federal offshore waters'],['coastal-river','Lowcountry coastal river'],['santee','Santee / Marion / Moultrie'],['other-fresh','Other freshwater lake or river']];
 for(const [value,label] of options){const opt=document.createElement('option');opt.value=value;opt.textContent=label;waterSelect.append(opt)}
 waterSelect.value=selectedWater;
 waterSelect.addEventListener('change',()=>{selectedWater=waterSelect.value;show()});
 waterWrap.append(waterSelect);panel.append(waterWrap);
 const body=el('div','','display:flex;flex-wrap:wrap;gap:10px');body.id='fd-regulations-detail';panel.append(body);
 const title=document.getElementById('fg-title');
 if(title)new MutationObserver(show).observe(title,{childList:true,characterData:true,subtree:true});
 show();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();