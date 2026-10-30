/* Angler Hub: Supabase auth metadata for profile; local stats remain local. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
function init(){
 const form=$('hub-profile-form');if(!form)return;
 let currentUser=null;
 const name=$('hub-display-name'),waters=$('hub-home-waters'),style=$('hub-fishing-style'),save=$('hub-save-profile'),msg=$('hub-profile-message');
 function refreshStats(){
  const player=document.getElementById('player')?.value||'Player 1';
  const parse=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch{return fallback}};
  const catches=parse('fishdex-catches-v1',[]),unlocked=parse('fishdex-unlocks-v1',{}),tank=parse('fishdex-tank-top5-v1',{});
  const ids=new Set([...(unlocked[player]||[]),...catches.filter(c=>c.player===player).map(c=>c.id)]);
  $('hub-caught').textContent=ids.size;
  $('hub-badges').textContent=[1,5,10,25,50,99].filter(n=>ids.size>=n).length;
  $('hub-tank').textContent=(tank[player]||[]).length;
  $('hub-local-note').textContent='Showing '+player+' on this browser. These catches are not yet cloud-synced.';
 }
 function showUser(user){
  currentUser=user||null;
  const metadata=user?.user_metadata||{};
  name.value=metadata.fishdex_display_name||'';
  waters.value=metadata.fishdex_home_waters||'';
  style.value=metadata.fishdex_fishing_style||'';
  save.disabled=!user;
  name.disabled=!user;waters.disabled=!user;style.disabled=!user;
  $('hub-account-status').textContent=user?'Account: '+user.email+' · Profile stored with Supabase Auth.':'You are browsing as a guest. Log in to save your profile.';
  $('hub-greeting').textContent='Welcome, '+(metadata.fishdex_display_name||'angler')+'!';
  msg.textContent='';
  refreshStats();
 }
 function attach(){
  const client=window.fishdexSupabase;
  if(!client){setTimeout(attach,200);return}
  client.auth.getUser().then(({data})=>showUser(data?.user)).catch(()=>showUser(null));
  client.auth.onAuthStateChange((_event,session)=>showUser(session?.user));
 }
 attach();
 form.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!currentUser){msg.textContent='Please log in first.';return}
  const displayName=name.value.trim();
  if(displayName.length<2){msg.textContent='Display name must be at least 2 characters.';return}
  save.disabled=true;msg.textContent='Saving profile…';
  try{
   const {data,error}=await window.fishdexSupabase.auth.updateUser({data:{
    fishdex_display_name:displayName,
    fishdex_home_waters:waters.value,
    fishdex_fishing_style:style.value
   }});
   if(error)throw error;
   showUser(data.user);msg.textContent='Profile saved to your account.';
  }catch(err){msg.textContent=err.message||'Could not save profile.'}
  finally{save.disabled=false}
 });
 document.querySelectorAll('[data-hub-go]').forEach(button=>button.addEventListener('click',()=>{
  const tab=button.dataset.hubGo;
  const target=document.querySelector('.site-nav [data-tab="'+tab+'"]');
  if(target)target.click();
  else {document.querySelectorAll('.site-nav [data-tab]').forEach(b=>b.setAttribute('aria-selected','false'));document.querySelectorAll('.tab-panel').forEach(p=>p.hidden=p.id!=='tab-'+tab);location.hash=tab;}
 }));
 document.querySelector('.site-nav [data-tab="hub"]')?.addEventListener('click',refreshStats);
 document.getElementById('player')?.addEventListener('change',refreshStats);
 if(location.hash==='#hub')document.querySelector('.site-nav [data-tab="hub"]')?.click();
 refreshStats();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
