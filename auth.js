/* FishDex authentication. Publishable key is public; never place secret keys here. */
(()=>{'use strict';
const URL='https://creyqlmyvmaqsurbccgf.supabase.co';
const KEY='sb_publishable_YPem0wv871sV_rW46rP1tA_IAvt_bqj';
function init(){
 const $=id=>document.getElementById(id);
 const dialog=$('fishdex-auth-dialog'),form=$('fishdex-auth-form'),msg=$('fishdex-auth-message');
 const open=$('fishdex-auth-open'),logout=$('fishdex-auth-logout'),name=$('fishdex-account-name');
 if(!dialog||!form)return;
 if(!window.supabase?.createClient){msg.textContent='Login service could not load. Refresh or check your connection.';return}
 const client=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 window.fishdexSupabase=client;
 function showUser(session){
  const user=session?.user;
  name.textContent=user?'Signed in: '+(user.email||'Angler'):'Browsing as guest';
  open.hidden=!!user;logout.hidden=!user;
  if(user&&dialog.open)dialog.close();
  window.dispatchEvent(new Event('fishdex-auth-change'));
 }
 client.auth.getSession().then(({data,error})=>{if(error)msg.textContent=error.message;showUser(data?.session)}).catch(()=>{msg.textContent='Unable to check login status.'});
 client.auth.onAuthStateChange((_event,session)=>showUser(session));
 open.addEventListener('click',()=>{msg.textContent='';dialog.showModal()});
 $('fishdex-auth-close').addEventListener('click',()=>dialog.close());
 async function run(action){
  const email=$('fishdex-auth-email').value.trim(),password=$('fishdex-auth-password').value;
  if(!email||!$('fishdex-auth-email').checkValidity()){msg.textContent='Enter a valid email address.';return}
  if(action!=='reset'&&password.length<6){msg.textContent='Password must be at least 6 characters.';return}
  msg.textContent='Please wait…';
  try{
   let result;
   if(action==='signup')result=await client.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname}});
   else if(action==='reset')result=await client.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
   else result=await client.auth.signInWithPassword({email,password});
   if(result.error)throw result.error;
   msg.textContent=action==='signup'?'Account request submitted. Check your email for a confirmation link if required.':action==='reset'?'Check your email for a password reset link.':'Signed in successfully.';
  }catch(e){msg.textContent=e.message||'Authentication failed. Please try again.'}
 }
 form.addEventListener('submit',e=>{e.preventDefault();run('signin')});
 $('fishdex-auth-signup').addEventListener('click',()=>run('signup'));
 $('fishdex-auth-reset').addEventListener('click',()=>run('reset'));
 logout.addEventListener('click',async()=>{const {error}=await client.auth.signOut();if(error){dialog.showModal();msg.textContent=error.message}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
