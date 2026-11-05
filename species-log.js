/* Personal species catch history. Reads only authenticated user's verified records. */
(()=>{'use strict';const $=id=>document.getElementById(id);
function close(){if($('species-log-dialog')?.open)$('species-log-dialog').close()}
function fishById(id){return typeof species!=='undefined'?species.find(f=>Number(f.id)===Number(id)):null}
function value(v,suffix=''){return v===null||v===undefined||v===''?'Not recorded':String(v)+suffix}
async function showLog(id){
 const fish=fishById(id),dlg=$('species-log-dialog');if(!fish||!dlg)return;
 const award=$('award');if(award?.open)award.close();
 $('sl-title').textContent=fish.name;$('sl-number').textContent='SPECIES #'+String(id).padStart(3,'0');
 $('sl-summary').textContent='Loading your verified catches…';
 const art=$('sl-art');art.replaceChildren();if(typeof FishDexArt!=='undefined'){const img=new Image();img.alt=fish.name;FishDexArt.attach(fish,img);art.append(img)}
 const list=$('sl-records');list.replaceChildren();dlg.showModal();
 const client=window.fishdexSupabase;if(!client){list.textContent='Sign in to view your catches.';return}
 try{
  const {data:auth,error:authError}=await client.auth.getUser();if(authError)throw authError;
  const user=auth?.user;if(!user){list.textContent='Sign in to view your catches.';return}
  const {data,error}=await client.from('verified_fish_catches')
   .select('id,species_id,species_name,verified_at,length_inches,weight_lbs,catch_location,catch_method')
   .eq('user_id',user.id).eq('species_id',Number(id)).order('verified_at',{ascending:false}).limit(500);
  if(error)throw error;if(!dlg.open||Number(window.FishDexSelectedSpeciesId)!==Number(id))return;
  const records=data||[],lengths=records.map(x=>Number(x.length_inches)).filter(n=>Number.isFinite(n)&&n>0);
  const best=lengths.length?Math.max(...lengths):null;
  $('sl-summary').textContent=records.length+' verified '+(records.length===1?'catch':'catches')+' · Personal best: '+(best===null?'Not measured':best+' in')+(records.length===500?' · Showing latest 500':'');
  if(!records.length){list.textContent='No individual catch records found yet. Earlier species unlocks may not have individual logs.';return}
  records.forEach((catchItem,index)=>{
   const card=document.createElement('article');card.className='sl-record';
   const head=document.createElement('div');head.className='sl-record-head';
   const title=document.createElement('strong');title.textContent='Catch #'+(records.length-index);
   const tag=document.createElement('span');tag.textContent=catchItem.length_inches!==null&&Number(catchItem.length_inches)===best?'★ Personal best':'✓ AI verified';
   head.append(title,tag);card.append(head);
   const time=document.createElement('p');time.className='sl-location';const dt=new Date(catchItem.verified_at);time.textContent='Verified '+(Number.isNaN(dt.getTime())?'Date unavailable':dt.toLocaleString());card.append(time);
   const stats=document.createElement('div');stats.className='sl-stats';
   for(const [label,text] of [['LENGTH',value(catchItem.length_inches,' in')],['WEIGHT',value(catchItem.weight_lbs,' lbs')]]){
    const tile=document.createElement('div');tile.className='sl-stat';const a=document.createElement('span');a.textContent=label;const b=document.createElement('strong');b.textContent=text;tile.append(a,b);stats.append(tile)
   }
   card.append(stats);
   const place=document.createElement('p');place.className='sl-location';place.textContent='⌖ Location: '+value(catchItem.catch_location);card.append(place);
   const method=document.createElement('p');method.className='sl-location';method.textContent='Fishing method: '+value(catchItem.catch_method);card.append(method);
   list.append(card)
  });
 }catch(e){if(dlg.open){list.textContent='Could not load catch history: '+(e?.message||String(e));$('sl-summary').textContent='Catch history unavailable'}}
}
function init(){
 $('award-guide')?.addEventListener('click',()=>{const id=window.FishDexSelectedSpeciesId;if(!id)return;$('award').close();window.FishDexOpenGuide?.(id)});
 $('award-log')?.addEventListener('click',()=>{const id=window.FishDexSelectedSpeciesId;if(id)showLog(id)});
 $('sl-close')?.addEventListener('click',close);$('sl-done')?.addEventListener('click',close);
 $('species-log-dialog')?.addEventListener('click',e=>{if(e.target===$('species-log-dialog'))close()});
 window.FishDexShowSpeciesLog=showLog;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
