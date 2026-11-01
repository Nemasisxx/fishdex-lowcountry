/* FishDex Multiplayer — authenticated, server-backed social and competitive play. */
(()=>{'use strict';
const $=id=>document.getElementById(id), el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n};
let client,user,rooms=[],profiles=new Map();
function notice(text){$('mp-status').textContent=text}
function error(e){notice(e?.message||String(e))}
async function session(){client=window.fishdexSupabase;if(!client)return false;const {data}=await client.auth.getUser();user=data?.user||null;return !!user}
async function load(){
 if(!await session()){notice('Sign in to use multiplayer.');$('mp-dashboard').hidden=true;return}
 $('mp-dashboard').hidden=false;notice('Loading multiplayer…');
 try{await Promise.all([loadProfile(),loadFriends(),loadRooms(),loadBoard()]);notice('Multiplayer ready. All rankings use verified catches.')}
 catch(e){error(e)}
}
async function loadProfile(){
 const {data,error}=await client.from('angler_profiles').select('*').eq('user_id',user.id).maybeSingle();if(error)throw error;
 $('mp-username').value=data?.username||'';
 $('mp-display').value=data?.display_name||user.user_metadata?.fishdex_display_name||'';
 $('mp-avatar').value=data?.avatar_emoji||'🎣';
 $('mp-profile-label').textContent=data?'Playing as @'+data.username:'Choose a unique username to appear on leaderboards and make friends.';
}
async function loadBoard(){
 const {data,error}=await client.rpc('fishdex_leaderboard');if(error)throw error;
 const body=$('mp-board');body.replaceChildren();
 const rows=[...(data||[])].sort((a,b)=>Number(b[$('mp-rank-by').value]||0)-Number(a[$('mp-rank-by').value]||0));
 rows.forEach((p,i)=>{const row=el('div');row.className='mp-line';
 const name=el('strong',(i+1)+'. '+p.avatar_emoji+' '+p.display_name+' (@'+p.username+')');
 const stats=el('span',p.species_count+' species · '+p.catch_count+' catches · best '+(p.best_inches??'—')+' in');
 row.append(name,stats);body.append(row)});
 if(!rows.length)body.textContent='No public player profiles yet.';
}
async function loadFriends(){
 const [{data:people,error:pe},{data:requests,error:re}]=await Promise.all([
 client.from('angler_profiles').select('user_id,username,display_name,avatar_emoji').limit(500),
 client.from('angler_friend_requests').select('*').or('sender_id.eq.'+user.id+',receiver_id.eq.'+user.id).limit(200)]);
 if(pe||re)throw pe||re;profiles=new Map((people||[]).map(p=>[p.user_id,p]));
 const pending=$('mp-requests'),friends=$('mp-friends');pending.replaceChildren();friends.replaceChildren();
 for(const r of requests||[]){
  const other=r.sender_id===user.id?r.receiver_id:r.sender_id,p=profiles.get(other);
  const row=el('div');row.className='mp-line';row.append(el('span',(p?.avatar_emoji||'🎣')+' '+(p?.display_name||'Angler')+' · '+r.status));
  if(r.status==='pending'&&r.receiver_id===user.id){
   for(const [label,status] of [['Accept','accepted'],['Decline','declined']]){
    const b=el('button',label);b.onclick=async()=>{const {error}=await client.from('angler_friend_requests').update({status}).eq('id',r.id).eq('receiver_id',user.id);if(error)errorMessage(error);else await loadFriends()};row.append(b)
   }
  }
  (r.status==='accepted'?friends:pending).append(row);
 }
 if(!friends.children.length)friends.textContent='No friends added yet.';
 if(!pending.children.length)pending.textContent='No pending requests.';
}
function errorMessage(e){error(e)}
async function loadRooms(){
 const {data,error}=await client.from('fishing_rooms').select('id,name,invite_code,owner_id,created_at').order('created_at',{ascending:false});if(error)throw error;
 rooms=data||[];const list=$('mp-rooms');list.replaceChildren();
 for(const room of rooms){
  const card=el('div');card.className='mp-room';
  card.append(el('strong',room.name),el('small',' Invite code: '+room.invite_code));
  const choose=el('button','View room & challenges');choose.onclick=()=>openRoom(room);card.append(choose);list.append(card)
 }
 if(!rooms.length)list.textContent='No rooms yet. Create one or join with a code.';
}
async function openRoom(room){
 $('mp-room-detail').hidden=false;$('mp-room-title').textContent=room.name+' · Invite code '+room.invite_code;
 $('mp-active-room').value=room.id;
 const [{data:members,error:me},{data:challenges,error:ce}]=await Promise.all([
 client.from('fishing_room_members').select('user_id').eq('room_id',room.id),
 client.from('fishing_challenges').select('*').eq('room_id',room.id).order('created_at',{ascending:false})]);
 if(me||ce)return error(me||ce);
 const people=$('mp-room-members');people.replaceChildren();
 for(const m of members||[]){const p=profiles.get(m.user_id);people.append(el('span',(p?.avatar_emoji||'🎣')+' '+(p?.display_name||'Angler')+' · '))}
 const list=$('mp-challenges');list.replaceChildren();
 for(const ch of challenges||[]){
  const card=el('div');card.className='mp-room';card.append(el('strong',ch.title),el('small',ch.metric+' · ends '+new Date(ch.ends_at).toLocaleString()));
  const b=el('button','Show standings');b.onclick=async()=>{
   const {data,error}=await client.rpc('fishing_challenge_scores',{p_challenge:ch.id});if(error)return errorMessage(error);
   card.querySelector('.mp-scores')?.remove();const scores=el('div');scores.className='mp-scores';
   (data||[]).forEach((p,i)=>scores.append(el('div',(i+1)+'. @'+p.username+' — '+p.score)));
   card.append(scores)
  };card.append(b);list.append(card)
 }
 if(!challenges?.length)list.textContent='No challenges yet. Start one below.';
}
function bind(){
 $('mp-profile-form').onsubmit=async e=>{e.preventDefault();if(!await session())return notice('Sign in first');
  const username=$('mp-username').value.trim().toLowerCase(),display_name=$('mp-display').value.trim(),avatar_emoji=$('mp-avatar').value;
  if(!/^[a-z0-9_]{3,24}$/.test(username))return notice('Username: 3–24 lowercase letters, numbers or underscores.');
  const {error}=await client.from('angler_profiles').upsert({user_id:user.id,username,display_name,avatar_emoji},{onConflict:'user_id'});
  if(error)return errorMessage(error);notice('Profile saved.');await Promise.all([loadProfile(),loadBoard(),loadFriends()])
 };
 $('mp-friend-form').onsubmit=async e=>{e.preventDefault();if(!await session())return notice('Sign in first');
  const username=$('mp-friend-name').value.trim().toLowerCase();
  const {data:p,error:pe}=await client.from('angler_profiles').select('user_id').eq('username',username).maybeSingle();
  if(pe||!p)return notice('Username not found.');if(p.user_id===user.id)return notice('You cannot friend yourself.');
  const {error}=await client.from('angler_friend_requests').insert({sender_id:user.id,receiver_id:p.user_id});
  if(error)return errorMessage(error);$('mp-friend-name').value='';notice('Friend request sent.');await loadFriends()
 };
 $('mp-create-room').onsubmit=async e=>{e.preventDefault();if(!await session())return notice('Sign in first');
  const {data,error}=await client.from('fishing_rooms').insert({name:$('mp-new-room').value.trim(),owner_id:user.id}).select('id').single();
  if(error)return errorMessage(error);
  const {error:joinError}=await client.from('fishing_room_members').insert({room_id:data.id,user_id:user.id});
  if(joinError)return errorMessage(joinError);$('mp-new-room').value='';await loadRooms();notice('Room created. Share its invite code.')
 };
 $('mp-join-room').onsubmit=async e=>{e.preventDefault();if(!await session())return notice('Sign in first');
  const {error}=await client.rpc('join_fishing_room',{p_code:$('mp-room-code').value.trim()});
  if(error)return errorMessage(error);$('mp-room-code').value='';await loadRooms();notice('Joined room!')
 };
 $('mp-create-challenge').onsubmit=async e=>{e.preventDefault();if(!await session())return notice('Sign in first');
  const room_id=$('mp-active-room').value;if(!room_id)return notice('Select a room first.');
  const hours=Number($('mp-challenge-hours').value);if(!Number.isFinite(hours)||hours<1||hours>2160)return notice('Choose 1–2160 hours.');
  const {error}=await client.from('fishing_challenges').insert({room_id,created_by:user.id,title:$('mp-challenge-title').value.trim(),metric:$('mp-challenge-metric').value,ends_at:new Date(Date.now()+hours*3600000).toISOString()});
  if(error)return errorMessage(error);$('mp-challenge-title').value='';await openRoom(rooms.find(r=>r.id===room_id));notice('Challenge started!')
 };
 $('mp-rank-by').onchange=loadBoard;$('mp-refresh').onclick=load;
 document.querySelector('.site-nav [data-tab="multiplayer"]')?.addEventListener('click',load);
 window.addEventListener('fishdex-auth-change',()=>{if(!document.getElementById('tab-multiplayer').hidden)load()});
 if(location.hash==='#multiplayer')setTimeout(load,700);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
