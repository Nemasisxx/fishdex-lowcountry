// Deploy with: supabase functions deploy verify-fish
// Set OPENAI_API_KEY using Supabase Edge Function secrets. Never commit that key.
// JWT authentication, RLS-backed unlocks and duplicate image checks are enforced server-side.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const catalog=[{"id":1,"name":"Red Drum"},{"id":2,"name":"Spotted Seatrout"},{"id":3,"name":"Pinfish"},{"id":4,"name":"Atlantic Croaker"},{"id":5,"name":"Spot"},{"id":6,"name":"Black Drum"},{"id":7,"name":"Sheepshead"},{"id":8,"name":"Southern Flounder"},{"id":9,"name":"Summer Flounder"},{"id":10,"name":"Weakfish"},{"id":11,"name":"Silver Perch"},{"id":12,"name":"Southern Kingfish"},{"id":13,"name":"Northern Kingfish"},{"id":14,"name":"Gulf Kingfish"},{"id":15,"name":"Bluefish"},{"id":16,"name":"Spanish Mackerel"},{"id":17,"name":"King Mackerel"},{"id":18,"name":"Cobia"},{"id":19,"name":"Tarpon"},{"id":20,"name":"Ladyfish"},{"id":21,"name":"Crevalle Jack"},{"id":22,"name":"Florida Pompano"},{"id":23,"name":"Permit"},{"id":24,"name":"Black Sea Bass"},{"id":25,"name":"Gray Snapper"},{"id":26,"name":"Vermilion Snapper"},{"id":27,"name":"Red Snapper"},{"id":28,"name":"Gag Grouper"},{"id":29,"name":"Scamp"},{"id":30,"name":"Mahi-mahi"},{"id":31,"name":"Little Tunny"},{"id":32,"name":"Atlantic Bonito"},{"id":33,"name":"Atlantic Spadefish"},{"id":34,"name":"Tripletail"},{"id":35,"name":"Toadfish"},{"id":36,"name":"Oyster Toadfish"},{"id":37,"name":"Striped Mullet"},{"id":38,"name":"Hardhead Catfish"},{"id":39,"name":"Gafftopsail Catfish"},{"id":40,"name":"Bonnethead Shark"},{"id":41,"name":"Atlantic Sharpnose Shark"},{"id":42,"name":"Blacktip Shark"},{"id":43,"name":"Stingray (Atlantic)"},{"id":44,"name":"Largemouth Bass"},{"id":45,"name":"Bluegill"},{"id":46,"name":"Redear Sunfish"},{"id":47,"name":"Redbreast Sunfish"},{"id":48,"name":"Warmouth"},{"id":49,"name":"Green Sunfish"},{"id":50,"name":"Pumpkinseed"},{"id":51,"name":"Black Crappie"},{"id":52,"name":"White Crappie"},{"id":53,"name":"Channel Catfish"},{"id":54,"name":"Blue Catfish"},{"id":55,"name":"Flathead Catfish"},{"id":56,"name":"Brown Bullhead"},{"id":57,"name":"Yellow Bullhead"},{"id":58,"name":"Bowfin"},{"id":59,"name":"Longnose Gar"},{"id":60,"name":"Florida Gar"},{"id":61,"name":"Chain Pickerel"},{"id":62,"name":"American Eel"},{"id":63,"name":"White Perch"},{"id":64,"name":"Striped Bass"},{"id":65,"name":"American Shad"},{"id":66,"name":"Hickory Shad"},{"id":67,"name":"Common Carp"},{"id":68,"name":"Grass Carp"},{"id":69,"name":"Spotted Sucker"},{"id":70,"name":"Golden Shiner"},{"id":71,"name":"Creek Chubsucker"},{"id":72,"name":"Spinner Shark"},{"id":73,"name":"Sandbar Shark"},{"id":74,"name":"Bull Shark"},{"id":75,"name":"Tiger Shark"},{"id":76,"name":"Great Hammerhead"},{"id":77,"name":"Great White Shark"},{"id":78,"name":"Pigfish"},{"id":79,"name":"Northern Puffer"},{"id":80,"name":"Gray Triggerfish"},{"id":81,"name":"Greater Amberjack"},{"id":82,"name":"White Grunt"},{"id":83,"name":"Great Barracuda"},{"id":84,"name":"Blackfin Tuna"},{"id":85,"name":"Wahoo"},{"id":86,"name":"Yellowfin Tuna"},{"id":87,"name":"Sailfish"},{"id":88,"name":"Blue Marlin"},{"id":89,"name":"Atlantic Sturgeon"},{"id":90,"name":"Shortnose Sturgeon"},{"id":91,"name":"Blueback Herring"},{"id":92,"name":"Gizzard Shad"},{"id":93,"name":"Threadfin Shad"},{"id":94,"name":"Flier"},{"id":95,"name":"Spotted Sunfish"},{"id":96,"name":"Redfin Pickerel"},{"id":97,"name":"Eastern Mosquitofish"},{"id":98,"name":"Hybrid Striped Bass"},{"id":99,"name":"White Bass"}];
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info'}});
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info'}});
 if(req.method!=='POST')return json({reason:'Method not allowed'},405);
 const token=req.headers.get('Authorization')?.replace(/^Bearer\s+/i,'');
 if(!token)return json({reason:'Sign in required'},401);
 const url=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,aiKey=Deno.env.get('OPENAI_API_KEY');
 if(!aiKey)return json({reason:'Verification service not configured'},503);
 const auth=createClient(url,anon,{global:{headers:{Authorization:'Bearer '+token}}});
 const {data:{user},error:authError}=await auth.auth.getUser(token);
 if(authError||!user)return json({reason:'Invalid login'},401);
 let body;try{body=await req.json()}catch{return json({reason:'Invalid request'},400)}
 const mime=body?.mimeType;
 if(!['image/jpeg','image/png','image/webp'].includes(mime)||typeof body.image!=='string'||body.image.length>11_000_000||body.image.length<100)return json({reason:'Invalid photo (maximum 8 MB)'},400);
 let bytes;try{bytes=Uint8Array.from(atob(body.image),c=>c.charCodeAt(0))}catch{return json({reason:'Invalid image encoding'},400)}
 if(bytes.length>8*1024*1024)return json({reason:'Photo too large'},400);
 const signature=mime==='image/png'&&bytes[0]===137&&bytes[1]===80||mime==='image/jpeg'&&bytes[0]===255&&bytes[1]===216||mime==='image/webp'&&String.fromCharCode(...bytes.slice(0,4))==='RIFF';
 if(!signature)return json({reason:'Image format mismatch'},400);
 const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(x=>x.toString(16).padStart(2,'0')).join('');
 const admin=createClient(url,service);
 const {data:duplicate}=await admin.from('verified_fish_catches').select('user_id').eq('photo_sha256',digest).limit(1);
 if(duplicate?.length&&!body?.redo)return json({verified:false,reason:'This photo has already been used for a verified unlock. Capture a new photo.'});
 const hint=typeof body.fishermanHint==='string'?body.fishermanHint.trim().slice(0,100):'';
 const prompt='Identify the single fish in this real photograph. Only return a catalog species if strongly supported by visible anatomy and markings. Reject screenshots, drawings, AI-generated pictures, blurry or unclear photos, multiple ambiguous fish, or images without a fish. Return JSON with speciesId (integer from list, or null), confidence (0 to 1), and reason (brief observable identification evidence). Identify fish even when photographed vertically or at an angle. Spotted Seatrout has dark spots across upper body, dorsal fin, and tail; Red Drum usually has one or more spots near its tail base. Do not reject a clear photo just because the fish is lying on a dock. The fisherman's suggested species is unverified context, not evidence. Consider it as a candidate only when visible features support it; never increase confidence merely because the fisherman suggested it. Never infer ownership or whether fish was caught by submitter. FishDex catalog: '+catalog.map(x=>x.id+':'+x.name).join('; ');
 let result;
 try{
  const response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+aiKey,'Content-Type':'application/json'},body:JSON.stringify({model:'gpt-4o',temperature:0,response_format:{type:'json_object'},messages:[{role:'system',content:prompt},{role:'user',content:[{type:'text',text:'Identify the fish in this photo. Be conservative. '+(hint?'The angler thinks it might be: '+JSON.stringify(hint)+'. Independently verify from the image; reject this suggestion if the markings or anatomy disagree.':'No angler identification provided.')},{type:'image_url',image_url:{url:'data:'+mime+';base64,'+body.image,detail:'high'}}]}],max_tokens:200})});
  if(!response.ok)throw Error('Vision API '+response.status);
  result=JSON.parse((await response.json()).choices?.[0]?.message?.content||'{}');
 }catch(e){console.error('Vision failure',e);return json({reason:'AI identification unavailable'},502)}
 const match=catalog.find(x=>x.id===Number(result.speciesId));
 if(!match||!Number.isFinite(Number(result.confidence))||Number(result.confidence)<0.8)return json({verified:false,reason:'Identification uncertain: '+String(result.reason||'Try a clear side-on photo with the whole fish visible.').slice(0,240)});
 if(body?.redo)return json({verified:false,reviewOnly:true,speciesId:match.id,speciesName:match.name,reason:'Recheck suggests '+match.name+'. This preview does not change saved unlocks.'});
 const length=body.lengthInches===null||body.lengthInches===undefined||body.lengthInches===''?null:Number(body.lengthInches);
 if(length!==null&&(!Number.isFinite(length)||length<=0||length>300||Math.round(length*100)!==length*100))return json({reason:'Length must be between 0 and 300 inches (up to two decimals).'},400);
 const {data:existing,error:existingError}=await admin.from('verified_fish_unlocks').select('species_id').eq('user_id',user.id).eq('species_id',match.id).maybeSingle();
 if(existingError)return json({reason:'Unable to check collection'},500);
 const {error:logError}=await admin.from('verified_fish_catches').insert({user_id:user.id,species_id:match.id,species_name:match.name,photo_sha256:digest,length_inches:length});
 if(logError){console.error('Catch log failed',logError);return json({reason:'Could not save verified catch. Check that the catch-log migration is applied.'},500)}
 if(!existing){
  const {error:unlockError}=await admin.from('verified_fish_unlocks').insert({user_id:user.id,species_id:match.id,species_name:match.name,photo_sha256:digest});
  if(unlockError){console.error('Unlock insert failed',unlockError);return json({reason:'Catch logged, but collection unlock failed. Please contact support.'},500)}
 }
 const {data:history}=await admin.from('verified_fish_catches').select('length_inches').eq('user_id',user.id).eq('species_id',match.id);
 const count=history?.length||1;
 const best=history?.reduce((v,c)=>Math.max(v,Number(c.length_inches)||0),0)||null;
 return json({verified:true,alreadyUnlocked:!!existing,speciesId:match.id,speciesName:match.name,catchCount:count,bestLengthInches:best});
});
