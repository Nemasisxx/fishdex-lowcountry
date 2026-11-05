/* FishDex verified-catch journal: only the Edge Function can create verified catches. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
let current=null,method=null;
function close(){const dlg=$('catch-log-dialog');if(dlg?.open)dlg.close();current=null}
function init(){
 const dlg=$('catch-log-dialog'),form=$('cl-form');if(!dlg||!form)return;
 $('cl-close').onclick=close;$('cl-skip').onclick=close;
 dlg.addEventListener('click',e=>{if(e.target===dlg)close()});
 dlg.addEventListener('close',()=>{current=null});
 document.querySelectorAll('.cl-method').forEach(b=>b.addEventListener('click',()=>{
  method=method===b.dataset.method?null:b.dataset.method;
  document.querySelectorAll('.cl-method').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.method===method)));
 }));
 window.addEventListener('fishdex-catch-verified',event=>{
  const data=event.detail;if(!data?.catchId||!Number.isInteger(Number(data.speciesId)))return;
  current={catchId:data.catchId,speciesId:Number(data.speciesId)};
  method=null;form.reset();$('cl-status').textContent='';
  document.querySelectorAll('.cl-method').forEach(x=>x.setAttribute('aria-pressed','false'));
  const fish=window.species?.find?.(x=>x.id===current.speciesId);
  $('catch-log-title').textContent=data.speciesName||fish?.name||'Verified Fish';
  $('cl-type').firstChild.textContent=data.speciesName||fish?.name||'Verified Fish';
  $('cl-species-number').textContent='#'+String(current.speciesId).padStart(3,'0')+' · '+(data.alreadyUnlocked?'Another verified catch':'New species unlocked');
  $('cl-art').replaceChildren();
  if(fish&&window.FishDexArt){const img=new Image();img.alt=fish.name;FishDexArt.attach(fish,img);$('cl-art').append(img)}
  if(data.lengthInches)$('cl-length').value=data.lengthInches;
  if(!dlg.open)dlg.showModal();
 });
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(!current)return;
  const lengthText=$('cl-length').value.trim(),weightText=$('cl-weight').value.trim();
  const length=lengthText?Number(lengthText):null,weight=weightText?Number(weightText):null;
  if(length!==null&&(!Number.isFinite(length)||length<=0||length>300)){return $('cl-status').textContent='Length must be 0–300 inches.'}
  if(weight!==null&&(!Number.isFinite(weight)||weight<=0||weight>2000)){return $('cl-status').textContent='Weight must be 0–2000 lbs.'}
  const client=window.fishdexSupabase;if(!client)return $('cl-status').textContent='Sign in to save catch details.';
  const button=$('cl-save');button.disabled=true;$('cl-status').textContent='Saving your fishing journal…';
  try{
   const {data,error}=await client.rpc('save_verified_catch_details',{
    p_catch_id:current.catchId,p_length_inches:length,p_weight_lbs:weight,
    p_location:$('cl-location').value.trim()||null,p_method:method
   });
   if(error)throw error;if(data!==true)throw Error('This catch could not be found under your account.');
   $('fishdex-verify-status').textContent='✓ Catch verified and journal details saved!';
   close();window.dispatchEvent(new Event('fishdex-catch-details-saved'));
  }catch(err){$('cl-status').textContent=err.message||'Could not save details. Try again.'}
  finally{button.disabled=false}
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
