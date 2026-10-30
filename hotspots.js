/* FishDex public fishing access map.
 * Coordinates from Charleston County Parks 2023 public boat landing/paddlecraft map
 * (https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/charlestoncountysc/Boat_Landings_Map_2023_PDF__13f46e13-dc63-4f3b-97d6-cd4c1552e5b0.pdf)
 * except pre-existing approximate points and specifically documented public fishing piers.
 * Species associations are HABITAT suggestions, never reported catches.
 */
(()=>{'use strict';
// Habitat-based possibilities, not catch records. Specific waterbody and structure
// profiles are assigned per access point below; launches describe nearby water, not the ramp.
const S={
 harborPier:['Sheepshead','Black Drum','Red Drum','Spotted Seatrout','Atlantic Croaker','Spot','Pinfish','Silver Perch','Southern Flounder','Bluefish','Spanish Mackerel','Atlantic Spadefish'],
 oceanPier:['Southern Kingfish','Northern Kingfish','Gulf Kingfish','Spot','Atlantic Croaker','Bluefish','Spanish Mackerel','Florida Pompano','Red Drum','Southern Flounder','Pinfish','Ladyfish'],
 tidalBridge:['Red Drum','Spotted Seatrout','Sheepshead','Black Drum','Southern Flounder','Atlantic Croaker','Spot','Pinfish','Silver Perch'],
 marshCreek:['Red Drum','Spotted Seatrout','Southern Flounder','Black Drum','Atlantic Croaker','Spot','Pinfish','Striped Mullet','Silver Perch'],
 marshPier:['Red Drum','Spotted Seatrout','Sheepshead','Black Drum','Pinfish','Atlantic Croaker','Spot','Southern Flounder'],
 riverbank:['Red Drum','Black Drum','Atlantic Croaker','Spot','Southern Flounder','Striped Mullet','Hardhead Catfish','Spotted Seatrout'],
 harborBank:['Red Drum','Black Drum','Sheepshead','Atlantic Croaker','Spot','Bluefish','Spanish Mackerel','Atlantic Spadefish','Pinfish'],
 oceanSurf:['Southern Kingfish','Northern Kingfish','Gulf Kingfish','Florida Pompano','Red Drum','Bluefish','Spanish Mackerel','Atlantic Croaker','Spot','Southern Flounder','Ladyfish'],
 inletSurf:['Red Drum','Southern Flounder','Bluefish','Spanish Mackerel','Florida Pompano','Southern Kingfish','Atlantic Croaker','Ladyfish','Crevalle Jack'],
 tidalRiver:['Red Drum','Spotted Seatrout','Black Drum','Southern Flounder','Atlantic Croaker','Spot','Striped Mullet','Hardhead Catfish'],
 backCreek:['Red Drum','Spotted Seatrout','Southern Flounder','Black Drum','Pinfish','Striped Mullet','Atlantic Croaker'],
 brackishUpper:['Red Drum','Black Drum','Atlantic Croaker','Striped Mullet','Hardhead Catfish','Southern Flounder','Largemouth Bass','Bluegill'],
 soundFlats:['Red Drum','Spotted Seatrout','Southern Flounder','Black Drum','Pinfish','Bluefish','Spanish Mackerel','Ladyfish'],
 deepChannel:['Red Drum','Black Drum','Sheepshead','Atlantic Croaker','Spot','Southern Flounder','Bluefish','Spanish Mackerel','Atlantic Spadefish'],
 barrierCreek:['Red Drum','Spotted Seatrout','Southern Flounder','Sheepshead','Black Drum','Pinfish','Ladyfish','Crevalle Jack'],
 freshwater:['Largemouth Bass','Bluegill','Redear Sunfish','Channel Catfish']
};
const profileByName={
 'Mount Pleasant Pier':'harborPier','Folly Beach Fishing Pier':'oceanPier',
 'Pitt Street Bridge':'tidalBridge','Shem Creek Park':'marshCreek',
 'Brittlebank Park':'riverbank','James Island County Park Fishing Dock':'marshPier',
 'Palmetto Islands County Park Fishing Pier':'marshPier','Northbridge Park':'brackishUpper',
 'Sunrise Park (Melton Peter Demetre Park)':'harborBank',
 'Folly Beach County Park':'inletSurf','Kiawah Beachwalker Park':'oceanSurf',
 'Roxbury Park Paddle Launch':'backCreek','Wide Awake Park Paddle Launch':'tidalRiver',
 'Flynn Drive Boat Ramp':'brackishUpper','Charleston Maritime Center Paddle Launch':'deepChannel',
 'Awendaw Canoe Launch':'backCreek','Still Landing':'backCreek','Elmwood Landing':'backCreek',
 'Penny Creek Boat Landing':'brackishUpper','Willtown Bluff Boat Landing':'brackishUpper',
 'Dawhoo Boat Landing':'tidalRiver','Steamboat Boat Landing':'barrierCreek',
 'Toogoodoo Boat Landing':'backCreek','Cherry Point Boat Landing':'barrierCreek',
 'John P. Limehouse Boat Landing':'tidalRiver','Pierpont Boat Landing':'brackishUpper',
 'W.O. Thomas Jr. Boat Landing':'brackishUpper','Riverland Terrace Boat Landing':'deepChannel',
 'Wappoo Cut Boat Landing':'deepChannel','Sol Legare Boat Landing':'tidalRiver',
 'Folly River Boat Landing':'barrierCreek',"Remley's Point Boat Landing":'deepChannel',
 'Shem Creek Boat Landing':'marshCreek','Gadsdenville Boat Landing':'soundFlats',
 'Paradise Boat Landing':'tidalRiver','Garris Landing':'soundFlats',
 'Buck Hall Landing':'soundFlats','Robert E. Ashley Landing':'barrierCreek'
};
const spots=[
 ['Mount Pleasant Pier',32.8023,-79.9055,'pier','Mount Pleasant','harbor','Dedicated fishing pier; fishing pass may be required.'],
 ['Folly Beach Fishing Pier',32.6546,-79.9407,'pier','Folly Beach','surf','Ocean fishing pier; check fees and hours.'],
 ['Pitt Street Bridge',32.774758,-79.863140,'shore','Mount Pleasant','estuary','Public fishing walkway and pier at Hog Island Channel.'],
 ['Shem Creek Park',32.7935,-79.8823,'shore','Mount Pleasant','creek','Boardwalk access; fishing permissions vary along the walkway.'],
 ['Brittlebank Park',32.787498,-79.959998,'shore','Charleston','estuary','Ashley River public waterfront park; check posted rules.'],
 ['James Island County Park Fishing Dock',32.729428,-79.994508,'pier','James Island','creek','Park fishing and crabbing dock; admission may apply.'],
 ['Palmetto Islands County Park Fishing Pier',32.864379,-79.825475,'pier','Mount Pleasant','creek','County park creek pier; check park admission and fishing hours.'],
 ['Northbridge Park',32.834806,-79.986372,'shore','West Ashley','estuary','Ashley River public waterfront access.'],
 ['Sunrise Park (Melton Peter Demetre Park)',32.752717,-79.915818,'shore','James Island','harbor','Public harborfront park; observe dock and shoreline restrictions.'],
 ['Folly Beach County Park',32.644697,-79.962493,'shore','Folly Beach','surf','Public beach access; surf fishing rules and beach-use restrictions apply.'],
 ['Kiawah Beachwalker Park',32.585817,-80.129773,'shore','Kiawah Island','surf','Public beach access; check access hours and surf fishing restrictions.'],
 ['Roxbury Park Paddle Launch',32.685878,-80.345826,'launch','Meggett','creek','Paddlecraft launch to Toogoodoo Creek; not a designated shore fishing pier.'],
 ['Wide Awake Park Paddle Launch',32.747846,-80.164039,'launch','Hollywood','estuary','Paddlecraft access to Wadmalaw River.'],
 ['Flynn Drive Boat Ramp',32.847642,-80.037098,'launch','North Charleston','estuary','Ashley River watercraft access; avoid obstructing ramps.'],
 ['Charleston Maritime Center Paddle Launch',32.789001,-79.925049,'launch','Charleston','harbor','Cooper River water access; confirm launch availability.'],
 ['Awendaw Canoe Launch',33.029455,-79.603660,'launch','Awendaw','creek','Awendaw Creek paddlecraft launch.'],
 ['Still Landing',33.177396,-79.496698,'launch','McClellanville','creek','Wambaw Creek paddlecraft access.'],
 ['Elmwood Landing',33.207300,-79.468699,'launch','McClellanville','creek','Wambaw Creek paddlecraft access.'],
 ['Penny Creek Boat Landing',32.734830,-80.410520,'launch','Adams Run','creek','Shallow paddle-first launch; larger boats not recommended.'],
 ['Willtown Bluff Boat Landing',32.678740,-80.416230,'launch','Adams Run','estuary','Edisto River paddle-first landing.'],
 ['Dawhoo Boat Landing',32.635820,-80.341010,'launch','Edisto Island','estuary','Public landing on Dawhoo River.'],
 ['Steamboat Boat Landing',32.602350,-80.293070,'launch','Edisto Island','creek','Steamboat Creek boat landing.'],
 ['Toogoodoo Boat Landing',32.688640,-80.296280,'launch','Meggett','creek','Toogoodoo Creek boat landing.'],
 ['Cherry Point Boat Landing',32.597950,-80.182820,'launch','Wadmalaw Island','creek','Bohicket Creek public boat landing.'],
 ['John P. Limehouse Boat Landing',32.784950,-80.106640,'launch','Johns Island','estuary','Stono River boat access.'],
 ['Pierpont Boat Landing',32.837910,-80.043090,'launch','West Ashley','creek','Church Creek paddle-first launch.'],
 ['W.O. Thomas Jr. Boat Landing',32.836210,-80.021310,'launch','North Charleston','estuary','Ashley River boat landing.'],
 ['Riverland Terrace Boat Landing',32.768280,-79.992480,'launch','James Island','creek','Wappoo Creek boat landing.'],
 ['Wappoo Cut Boat Landing',32.767480,-79.972890,'launch','West Ashley','estuary','Elliott Cut public boat landing; strong tidal currents possible.'],
 ['Sol Legare Boat Landing',32.668400,-79.997140,'launch','James Island','estuary','Stono River public boat landing.'],
 ['Folly River Boat Landing',32.660100,-79.943400,'launch','Folly Beach','creek','Folly River public boat landing.'],
 ["Remley's Point Boat Landing",32.813580,-79.907640,'launch','Mount Pleasant','harbor','Wando River and Charleston Harbor boat access.'],
 ['Shem Creek Boat Landing',32.793120,-79.876750,'launch','Mount Pleasant','creek','Busy public launch; keep ramps and docks clear.'],
 ['Gadsdenville Boat Landing',32.874680,-79.738980,'launch','East Cooper','creek','Copahee Sound shallow paddle-first landing.'],
 ['Paradise Boat Landing',32.913640,-79.737200,'launch','East Cooper','estuary','Wando River paddle-first landing.'],
 ['Garris Landing',32.939817,-79.657506,'launch','Awendaw','estuary','Intracoastal Waterway access; verify refuge and launch rules.'],
 ['Buck Hall Landing',33.038489,-79.560997,'launch','McClellanville','estuary','Intracoastal Waterway access.'],
 ['Robert E. Ashley Landing',33.080797,-79.459699,'launch','McClellanville','creek','Jeremy Creek watercraft access.'],
 ['Huntington Beach State Park',33.506,-79.063,'shore','Murrells Inlet / Georgetown County','surf','Approximate state-park oceanfront area; verify permitted fishing access.'],
 ['Pawleys Island Public Beach',33.428,-79.119,'shore','Pawleys Island','surf','Approximate public beach vicinity; verify parking and surf fishing rules.'],
 ['Georgetown Harbor Waterfront',33.366,-79.282,'shore','Georgetown','estuary','Approximate Sampit River waterfront area; check fishing permissions.'],
 ['South Island Ferry Landing Area',33.233,-79.214,'launch','Georgetown / Winyah Bay','estuary','Approximate geographic reference; verify public access.'],
 ['Hobcaw Barony / Winyah Bay Shore',33.332,-79.212,'shore','Georgetown','estuary','Geographic reference only; private or restricted access, do not assume fishing is allowed.'],
 ['Santee Coastal Reserve Vicinity',33.164,-79.337,'shore','South Santee','estuary','Area reference; check reserve access and closures.'],
 ['Cape Romain / Bulls Bay Vicinity',33.006,-79.534,'shore','Cape Romain','estuary','Area reference; wildlife refuge restrictions may apply.'],
 ['Edisto Beach State Park',32.505,-80.298,'shore','Edisto Beach','surf','Approximate public state-park beach vicinity; check rules.'],
 ['Hunting Island State Park',32.360,-80.455,'shore','Beaufort / Hunting Island','surf','Approximate oceanfront park vicinity; check access and fishing rules.'],
 ['Port Royal Sands Beach',32.375,-80.690,'shore','Port Royal','estuary','Approximate public waterfront vicinity; verify fishing areas.'],
 ['Henry C. Chambers Waterfront Park',32.430,-80.669,'shore','Beaufort','estuary','Public waterfront park; check posted fishing restrictions.'],
 ['Broad River Fishing Pier',32.409,-80.777,'pier','Beaufort / Broad River','estuary','Approximate pier vicinity; verify access and fishing rules.'],
 ['Coligny Beach Park',32.144,-80.750,'shore','Hilton Head Island','surf','Public beach access; follow seasonal fishing rules.'],
 ['Fish Haul Beach Park',32.242,-80.684,'shore','Hilton Head Island','estuary','Approximate public park vicinity; check tides and posted rules.'],
 ['Daufuskie Island Public Beach Vicinity',32.106,-80.855,'shore','Daufuskie Island','surf','Approximate island beach reference; verify public access.'],
 ['Lake Moultrie / Bonneau Beach Vicinity',33.320,-79.960,'shore','Berkeley County','freshwater','Approximate lake shoreline reference; verify public access.'],
 ['Lake Marion / Santee State Park',33.521,-80.499,'shore','Santee / Lake Marion','freshwater','Approximate state-park lake access vicinity; check rules.'],
].map(([name,lat,lng,type,area,habitat,note])=>({name,lat,lng,type,area,habitat,note,profile:profileByName[name]||(habitat==='freshwater'?'freshwater':habitat==='surf'?'oceanSurf':habitat==='creek'?'marshCreek':'tidalRiver'),species:S[profileByName[name]||(habitat==='freshwater'?'freshwater':habitat==='surf'?'oceanSurf':habitat==='creek'?'marshCreek':'tidalRiver')]}));
const TACKLE={
 'Red Drum':['Live or cut mullet, shrimp, paddle-tail soft plastics','Medium spinning tackle, 15–30 lb braid, fluorocarbon leader','Work marsh edges, oyster points and creek mouths on moving water.'],
 'Spotted Seatrout':['Paddle-tail swimbaits, suspending twitchbaits, live shrimp','Light/medium spinning setup with fluorocarbon leader','Target current seams and grass edges; retrieve steadily.'],
 'Southern Flounder':['Mud minnows, finger mullet, jig-head soft plastics','Medium spinning rod with a bottom-oriented jig','Slowly work sandy creek mouths and drop-offs.'],
 'Sheepshead':['Fiddler crabs, shrimp, small crustacean baits','Short strong leader, small sharp hook, light weight','Fish tight to legal pier pilings and oyster structure.'],
 'Black Drum':['Fresh shrimp, crab, cut bait','Medium bottom rig with enough weight for current','Probe muddy bottom and channel edges.'],
 'Spanish Mackerel':['Small shiny spoons, casting jigs, baitfish imitations','Fast-retrieve spinning tackle and appropriate leader','Look for surface-feeding fish in open water.'],
 'Bluefish':['Metal spoons, plugs, cut bait','Medium spinning tackle; consider bite-resistant leader','Fish active current and surf troughs.'],
 'Pinfish':['Small shrimp pieces, tiny hooks','Ultralight tackle with a small float','Try sheltered edges and structure.'],
 'Largemouth Bass':['Soft plastics, spinnerbaits, topwater plugs','Medium freshwater bass tackle','Work submerged cover and vegetation.'],
 'Bluegill':['Worms, small jigs','Ultralight rod and small hooks','Fish around vegetation and sheltered banks.']
};
const PERSONAL_KEY='fishdex-personal-hotspots-v1';
let personal=[];try{personal=JSON.parse(localStorage.getItem(PERSONAL_KEY)||'[]');if(!Array.isArray(personal))personal=[]}catch{personal=[]}
let personalMarkers=[],showPersonal=true,streetLayer,satelliteLayer;
function persistPersonal(){try{localStorage.setItem(PERSONAL_KEY,JSON.stringify(personal))}catch{alert('Could not save spots on this device. Check browser storage settings.')}}
function redrawPersonal(){
 personalMarkers.forEach(m=>m.remove());personalMarkers=[];
 if(!showPersonal||!map)return;
 personal.forEach((spot,i)=>{
  const marker=L.marker([spot.lat,spot.lng],{icon:L.divIcon({className:'',html:'<span style="display:block;background:#ffce61;color:#10222a;border:2px solid white;border-radius:50%;width:27px;height:27px;text-align:center;line-height:23px;font-weight:bold">★</span>',iconSize:[27,27]})}).addTo(map);
  const container=document.createElement('div');const h=document.createElement('strong');h.textContent=spot.name;
  const p=document.createElement('p');p.textContent=spot.note||'Private saved location';
  const catches=document.createElement('p');catches.textContent=spot.catchNotes?'Catch notes: '+spot.catchNotes:'No catch notes yet';
  const edit=document.createElement('button');edit.textContent='Edit notes';edit.onclick=()=>{const n=prompt('Private fishing notes:',spot.note||'');if(n===null)return;const c=prompt('Associated catches (species, date, etc.):',spot.catchNotes||'');if(c===null)return;spot.note=n.slice(0,2000);spot.catchNotes=c.slice(0,2000);persistPersonal();redrawPersonal()};
  const del=document.createElement('button');del.textContent='Delete spot';del.onclick=()=>{if(!confirm('Delete this private hotspot?'))return;personal.splice(i,1);persistPersonal();redrawPersonal()};
  container.append(h,p,catches,edit,document.createTextNode(' '),del);marker.bindPopup(container);personalMarkers.push(marker);
 });
}
let personalPinArmed=false,activeLocationMarker=null,activeLocationCircle=null;
function savePersonalAt(lat,lng){
 const name=prompt('Name your private fishing spot (saved on this device only):');if(!name||!name.trim())return;
 const note=prompt('Private notes (optional):')||'';
 personal.push({name:name.trim().slice(0,120),lat:+lat.toFixed(6),lng:+lng.toFixed(6),note:note.slice(0,2000),catchNotes:''});
 showPersonal=true;document.getElementById('hotspot-show-personal').textContent='Hide my spots';
 persistPersonal();redrawPersonal();personalMarkers[personalMarkers.length-1]?.openPopup();
 const status=document.getElementById('hotspot-personal-status');if(status)status.textContent='Saved your spot at the selected map pin on this device.';
}
function addPersonal(){
 personalPinArmed=!personalPinArmed;
 const button=document.getElementById('hotspot-add-personal'),status=document.getElementById('hotspot-personal-status');
 button.textContent=personalPinArmed?'Cancel spot pin':'📍 Pin a new spot';
 if(personalPinArmed&&typeof tidePinArmed!=='undefined'&&tidePinArmed){tidePinArmed=false;const tideButton=document.getElementById('hotspot-tide-pin');if(tideButton)tideButton.textContent='📍 Pin tide location'}
 map.getContainer().style.cursor=personalPinArmed?'crosshair':'';
 if(status)status.textContent=personalPinArmed?'Tap or click the exact spot on the map to save it.':'';
}
let locationWatchId=null;
function updateActiveLocation(position,follow){
 const {latitude,longitude,accuracy}=position.coords;
 if(activeLocationMarker)activeLocationMarker.remove();
 if(activeLocationCircle)activeLocationCircle.remove();
 activeLocationCircle=L.circle([latitude,longitude],{radius:accuracy,color:'#38bdf8',weight:1,fillOpacity:.10,interactive:false}).addTo(map);
 activeLocationMarker=L.circleMarker([latitude,longitude],{radius:8,color:'#fff',weight:2,fillColor:'#0284c7',fillOpacity:1}).addTo(map);
 activeLocationMarker.bindPopup('◎ Your approximate current location (accuracy ±'+Math.round(accuracy)+' m)');
 if(follow)map.setView([latitude,longitude],Math.max(map.getZoom(),14));
 const status=document.getElementById('hotspot-location-status');
 if(status)status.textContent=(locationWatchId!==null?'● Live tracking active':'Location found')+' · Accuracy ±'+Math.round(accuracy)+' m · Location is not saved or uploaded.';
}
function stopActiveTracking(){
 if(locationWatchId!==null&&navigator.geolocation)navigator.geolocation.clearWatch(locationWatchId);
 locationWatchId=null;
 const controls=document.getElementById('hotspot-tracking-controls');if(controls)controls.hidden=true;
 const status=document.getElementById('hotspot-location-status');if(status)status.textContent='Live tracking stopped. Your last location marker remains on the map.';
}
function setupPersonalLocation(){
 map.on('click',event=>{
  if(!personalPinArmed)return;
  personalPinArmed=false;document.getElementById('hotspot-add-personal').textContent='📍 Pin a new spot';map.getContainer().style.cursor='';
  savePersonalAt(event.latlng.lat,event.latlng.lng);
 });
 document.getElementById('hotspot-stop-tracking')?.addEventListener('click',stopActiveTracking);
 document.getElementById('hotspot-my-location')?.addEventListener('click',()=>{
  const status=document.getElementById('hotspot-location-status');
  if(!navigator.geolocation){status.textContent='Your browser does not support location access.';return}
  if(locationWatchId!==null){status.textContent='Live tracking is already active. Use Stop tracking to turn it off.';return}
  const choice=window.confirm('FishDex Location Tracking\\n\\nOK: Always track while this page is open. Your map position updates as you move.\\n\\nCancel: Choose a one-time location instead.');
  const errorMessage=error=>{status.textContent=error.code===1?'Location permission denied. Enable it in browser settings.':error.code===2?'Location unavailable. Check your device GPS.':'Location request timed out. Try again.';if(error.code===1)stopActiveTracking()};
  if(choice){
   status.textContent='Starting live tracking… Your browser may ask for location permission.';
   const controls=document.getElementById('hotspot-tracking-controls');if(controls)controls.hidden=false;
   locationWatchId=navigator.geolocation.watchPosition(position=>updateActiveLocation(position,document.getElementById('hotspot-follow-location')?.checked!==false),errorMessage,{enableHighAccuracy:true,timeout:20000,maximumAge:5000});
  }else{
   const once=window.confirm('Show your current location once?\\n\\nOK: Use location once.\\nCancel: Not now.');
   if(!once)return;
   status.textContent='Requesting one-time location…';
   navigator.geolocation.getCurrentPosition(position=>updateActiveLocation(position,true),errorMessage,{enableHighAccuracy:true,timeout:15000,maximumAge:30000});
  }
 });
 window.addEventListener('pagehide',stopActiveTracking);
}
function tackleFor(species){
 const el=document.getElementById('hotspot-tackle');el.replaceChildren();
 const strong=document.createElement('strong');strong.textContent='Suggested bait & tackle';el.append(strong);
 if(species==='all'){const p=document.createElement('p');p.textContent='Choose a target species above for fishing suggestions.';el.append(p);return}
 const data=TACKLE[species];if(!data){const p=document.createElement('p');p.textContent='No species-specific recommendation has been reviewed for '+species+' yet.';el.append(p);return}
 for(const [i,value] of data.entries()){const p=document.createElement('p');p.textContent=['Bait / lures: ','Tackle: ','Technique: '][i]+value;el.append(p)}
 const caveat=document.createElement('small');caveat.textContent='General fishing guidance, not a catch guarantee. Check current regulations.';el.append(caveat);
}
function drawTideGraph(container,predictions){
 const rows=predictions.map(p=>({time:new Date(p.t.replace(' ','T')),height:Number(p.v)})).filter(p=>Number.isFinite(p.height)&&!Number.isNaN(p.time.getTime()));
 if(rows.length<2)throw Error('Insufficient tide samples');
 const W=920,H=270,left=54,right=20,top=25,bottom=47;
 const lo=Math.min(...rows.map(p=>p.height)),hi=Math.max(...rows.map(p=>p.height)),pad=Math.max(.4,(hi-lo)*.12);
 const min=lo-pad,max=hi+pad;const first=rows[0].time.getTime(),last=rows[rows.length-1].time.getTime();
 const x=t=>left+(t-first)/(last-first)*(W-left-right),y=h=>top+(max-h)/(max-min)*(H-top-bottom);
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('role','img');
 svg.setAttribute('aria-label','NOAA Charleston Harbor predicted tide heights over the next two days in feet, with high and low tides');
 svg.style.cssText='display:block;width:100%;height:auto;max-height:340px;background:#0b2737;border-radius:12px';
 const make=(tag,attrs,txt)=>{const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(txt!==undefined)e.textContent=txt;svg.append(e);return e};
 for(let i=0;i<=4;i++){const value=min+(max-min)*i/4,yy=y(value);
  make('line',{x1:left,y1:yy,x2:W-right,y2:yy,stroke:'#356072','stroke-dasharray':'4 5'});
  make('text',{x:left-9,y:yy+4,'text-anchor':'end',fill:'#bcd9e5','font-size':13},value.toFixed(1));
 }
 const step=Math.max(1,Math.ceil(rows.length/9));
 for(let i=0;i<rows.length;i+=step){const xx=x(rows[i].time.getTime());make('text',{x:xx,y:H-18,'text-anchor':'middle',fill:'#bcd9e5','font-size':12},rows[i].time.toLocaleString('en-US',{hour:'numeric',hour12:true,month:'numeric',day:'numeric'}))}
 const pts=rows.map(p=>[x(p.time.getTime()),y(p.height)]);
 const line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(2)+' '+p[1].toFixed(2)).join(' ');
 make('path',{d:line+' L'+pts[pts.length-1][0]+' '+(H-bottom)+' L'+pts[0][0]+' '+(H-bottom)+' Z',fill:'#17b4d5','fill-opacity':'.18'});
 make('path',{d:line,fill:'none',stroke:'#42ddfa','stroke-width':3,'stroke-linejoin':'round','stroke-linecap':'round'});
 const nowLocal=new Date(new Date().toLocaleString('en-US',{timeZone:'America/New_York'})).getTime();
 if(nowLocal>=first&&nowLocal<=last){const xx=x(nowLocal);make('line',{x1:xx,y1:top,x2:xx,y2:H-bottom,stroke:'#ffd57d','stroke-width':2,'stroke-dasharray':'6 4'});make('text',{x:xx+5,y:top+13,fill:'#ffd57d','font-size':12},'Now')}
 for(let i=1;i<rows.length-1;i++){const prev=rows[i-1].height,cur=rows[i].height,next=rows[i+1].height;
  if(!((cur>=prev&&cur>next)||(cur<=prev&&cur<next)))continue;
  const xx=pts[i][0],yy=pts[i][1],high=cur>=prev;
  make('circle',{cx:xx,cy:yy,r:4.5,fill:high?'#ffd57d':'#b5f5ff',stroke:'#0b2737','stroke-width':2});
  make('text',{x:xx,y:yy+(high?-13:19),'text-anchor':'middle',fill:high?'#ffd57d':'#b5f5ff','font-size':12,'font-weight':600},(high?'H ':'L ')+cur.toFixed(1)+' ft');
 }
 const label=document.createElement('small');label.textContent='NOAA predicted water level (feet above MLLW) · Charleston Harbor station 8665530 · Times shown in Eastern Time';
 container.append(svg,label);
}
async function loadConditions(){
 const el=document.getElementById('hotspot-conditions');el.replaceChildren();
 const heading=document.createElement('h3');heading.textContent='Charleston tides & conditions';el.append(heading);
 const graph=document.createElement('div');graph.textContent='Loading NOAA tide graph…';el.append(graph);
 const weather=document.createElement('p');weather.textContent='Loading current weather…';el.append(weather);
 const now=new Date();const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const get=k=>parts.find(p=>p.type===k).value;
 const begin=get('year')+get('month')+get('day');
 const tomorrow=new Date(now.getTime()+2*86400000),endParts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(tomorrow);
 const end=k=>endParts.find(p=>p.type===k).value;
 const endDate=end('year')+end('month')+end('day');
 const tideUrl='https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date='+begin+'&end_date='+endDate+'&station=8665530&product=predictions&datum=MLLW&time_zone=lst_ldt&units=english&interval=6&format=json';
 try{
  const response=await fetch(tideUrl);if(!response.ok)throw Error('NOAA request failed');
  const data=await response.json();if(!data.predictions?.length)throw Error('No tide data');
  graph.replaceChildren();drawTideGraph(graph,data.predictions);
 }catch(err){graph.textContent='Tide graph unavailable right now. NOAA prediction data could not be loaded.';console.warn('FishDex tide graph:',err)}
 try{
  const response=await fetch('https://api.open-meteo.com/v1/forecast?latitude=32.78&longitude=-79.93&current=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York');
  if(!response.ok)throw Error('Weather request failed');const data=await response.json(),c=data.current;if(!c)throw Error('No weather data');
  weather.textContent='Current Charleston-area conditions (Open-Meteo): '+Math.round(c.temperature_2m)+'°F · Wind '+Math.round(c.wind_speed_10m)+' mph · Direction '+Math.round(c.wind_direction_10m)+'° · Rain '+c.precipitation+' mm';
 }catch{weather.textContent='Current weather is temporarily unavailable.'}
 const note=document.createElement('small');note.textContent='NOAA predictions are for Charleston Harbor, not real-time measurements or every fishing spot. Do not use this graph for boating or navigation decisions.';el.append(note);
}
let map,markers=[],initialized=false,resizeObserver=null;
function refreshMap(){if(!map)return;requestAnimationFrame(()=>{map.invalidateSize({pan:false});});}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// These circles are approximate access-area opportunity indicators, NOT verified fish locations.
let opportunityLayer=null,opportunityTide=null,opportunityWind=null,opportunityUpdated=0;
const shoreProfiles=new Set(['tidalBridge','marshCreek','marshPier','riverbank','harborBank','oceanSurf','inletSurf','soundFlats','barrierCreek','harborPier','oceanPier']);
function opportunityScore(spot){
 let score=35,reasons=[];
 const species=document.getElementById('hotspot-species').value;
 if(species!=='all'){if(!spot.species.includes(species))return null;score+=12;reasons.push('Habitat may suit '+species)}
 else reasons.push('General shoreline habitat');
 const hour=Number(new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'numeric',hourCycle:'h23'}).format(new Date()));
 if(hour<9||hour>=17){score+=10;reasons.push('Early or late-day timing')}else reasons.push('Midday conditions');
 if(opportunityTide!==null){if(opportunityTide>=.28){score+=20;reasons.push('Predicted moving tide')}else{score-=8;reasons.push('Predicted slower tide')}}
 else reasons.push('Tide data unavailable');
 if(opportunityWind!==null){if(opportunityWind<=12){score+=12;reasons.push('Lighter modeled wind')}else if(opportunityWind>=22){score-=15;reasons.push('Stronger modeled wind')}else reasons.push('Moderate wind')}
 else reasons.push('Wind data unavailable');
 if(spot.profile==='tidalBridge'||spot.profile==='marshPier'||spot.profile==='harborPier'){score+=6;reasons.push('Structure habitat')}
 return {score:Math.max(0,Math.min(100,score)),reasons};
}
// Use mapped waterway geometry rather than inventing shoreline polygons.
// OSM waterways are geographic references; they are NOT verified fishing structures.
let habitatWays=[],habitatKey='',habitatTimer=null,habitatLoading=false;
function nearestHabitatSpot(lat,lng,maxDistance=2.5){
 let nearest=null,distance=Infinity;
 for(const spot of spots){
  const d=Math.hypot((lat-spot.lat)*111,(lng-spot.lng)*94);
  if(d<distance){distance=d;nearest=spot}
 }
 return distance<=maxDistance?nearest:null;
}
function updateOpportunityZones(){
 if(!map||!opportunityLayer)return;
 opportunityLayer.clearLayers();
 const toggle=document.getElementById('hotspot-activity-toggle'),status=document.getElementById('hotspot-activity-status');
 const mode=document.getElementById('hotspot-layer-mode')?.value||'both';
 if((!toggle?.checked&&document.getElementById('hotspot-basemap')?.value!=='creek')||(mode==='access'||mode==='clear')&&document.getElementById('hotspot-basemap')?.value!=='creek'){status.textContent='Bite zones hidden. Choose Bite Zones only or Both in Filters to display them.';return}
 if(map.getZoom()<11){status.textContent='Zoom closer near Shem Creek, Wando River or Charleston Harbor to view mapped waterway habitat.';return}
 const bounds=map.getBounds(),species=document.getElementById('hotspot-species').value;
 let count=0;
 for(const way of habitatWays){
  const mid=way.center;
  if(!bounds.pad(.15).contains(mid))continue;
  const near=nearestHabitatSpot(mid[0],mid[1],way.kind==='coastline'?18:12);if(!near)continue;
  const result=opportunityScore(near);if(!result)continue;
  const score=Math.min(100,result.score+(way.kind==='stream'?7:0));
  const color=score>=70?'#ef4444':score>=48?'#ffd04c':'#22c55e';
  const zonesOnly=mode==='hotspots';
  const line=((way.kind==='coastline'||way.kind==='stream'||way.kind==='creek'||way.kind==='tidal_channel')?L.polyline(way.points,{color,weight:zonesOnly?9:7,opacity:.9,interactive:true}):L.polygon(way.points,{color,weight:zonesOnly?2:1,opacity:zonesOnly?.95:.75,fillColor:color,fillOpacity:zonesOnly?.76:.42,interactive:true})).addTo(opportunityLayer);
  const label=document.createElement('div'),head=document.createElement('strong'),why=document.createElement('p'),caution=document.createElement('small');
  head.textContent=(way.name||(way.kind==='coastline'?'Mapped shoreline':'Mapped creek or waterway'))+' · '+(score>=70?'Higher':score>=48?'Moderate':'Lower')+' modeled opportunity';
  why.textContent=(way.kind==='coastline'?'Mapped coastline boundary (OpenStreetMap). ':['stream','creek','tidal_channel'].includes(way.kind)?'Mapped stream/creek centerline (OpenStreetMap), NOT a depth contour. ':'Mapped water-area polygon (OpenStreetMap). ')+result.reasons.join(' · ')+'.';
  caution.textContent='Modeled fishing opportunity, not observed fish. Shoreline strokes follow mapped coast boundaries, not verified fishing access or safe water. Check tides, permissions and hazards.';
  label.append(head,why,caution);line.bindPopup(label);count++;
 }
 status.textContent=habitatLoading?'Loading shoreline and water geometry…':count?count+' shoreline/water zones highlighted in view. Tap a zone for details.':'No mapped shoreline or water zones available in this view. Try zooming or panning.';
}
async function loadHabitatWays(){
 if(!map||map.getZoom()<11||(!document.getElementById('hotspot-activity-toggle')?.checked&&document.getElementById('hotspot-basemap')?.value!=='creek'))return;
 const b=map.getBounds(),south=b.getSouth(),north=b.getNorth(),west=b.getWest(),east=b.getEast();
 // Limit very large queries to avoid overloading public Overpass services.
 if((north-south)*(east-west)>.20){habitatWays=[];habitatKey='';updateOpportunityZones();return}
 if(north<=south||east<=west)return;
 const key=[south,north,west,east].map(n=>n.toFixed(2)).join(',');
 if(key===habitatKey)return;
 habitatKey=key;habitatLoading=true;updateOpportunityZones();
 const query='[out:json][timeout:18];(way["natural"="water"]('+south+','+west+','+north+','+east+');way["waterway"="riverbank"]('+south+','+west+','+north+','+east+');way["natural"="coastline"]('+south+','+west+','+north+','+east+');way["waterway"~"stream|creek|tidal_channel"]('+south+','+west+','+north+','+east+'););out geom;';
 try{
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),14000);
  let response;
  try{response=await fetch('https://overpass.kumi.systems/api/interpreter',{method:'POST',body:'data='+encodeURIComponent(query),headers:{'Content-Type':'application/x-www-form-urlencoded'},signal:controller.signal})}finally{clearTimeout(timeout)}
  if(!response.ok)throw Error('Map data unavailable');
  const json=await response.json();
  // Only closed, explicitly mapped water polygons; never draw land-crossing centerlines.
  habitatWays=(json.elements||[]).filter(e=>{
   if(e.type!=='way'||!e.geometry||e.geometry.length<2)return false;
   if(e.tags?.natural==='coastline'||/^(stream|creek|tidal_channel)$/.test(e.tags?.waterway||''))return true;
   const first=e.geometry[0],last=e.geometry[e.geometry.length-1];
   return first.lat===last.lat&&first.lon===last.lon&&(e.tags?.natural==='water'||e.tags?.waterway==='riverbank');
  }).slice(0,250).map(e=>{
   const points=e.geometry.map(p=>[p.lat,p.lon]);
   const bounds=L.latLngBounds(points);
   return {name:e.tags?.name||'',kind:e.tags?.natural==='coastline'?'coastline':e.tags?.waterway||e.tags?.water||'',points,center:[bounds.getCenter().lat,bounds.getCenter().lng]};
  });
 }catch(e){habitatWays=[];habitatKey='';console.warn('FishDex habitat geometry:',e);const status=document.getElementById('hotspot-activity-status');if(status)status.textContent='Mapped waterways temporarily unavailable. No estimated zones displayed.'}
 habitatLoading=false;updateOpportunityZones();
}
function queueHabitatWays(){clearTimeout(habitatTimer);habitatTimer=setTimeout(loadHabitatWays,650)}
async function refreshOpportunityConditions(){
 try{
  const now=new Date(),parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now),p=k=>parts.find(v=>v.type===k).value;
  const day=p('year')+p('month')+p('day');
  const url='https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date='+day+'&station=8665530&product=predictions&datum=MLLW&time_zone=lst_ldt&units=english&interval=6&format=json';
  const res=await fetch(url);if(!res.ok)throw Error('NOAA unavailable');
  const data=await res.json(),rows=(data.predictions||[]).map(v=>({t:new Date(v.t.replace(' ','T')).getTime(),h:Number(v.v)}));
  const local=new Date(now.toLocaleString('en-US',{timeZone:'America/New_York'})).getTime();
  let nearest=1;for(let i=1;i<rows.length;i++)if(Math.abs(rows[i].t-local)<Math.abs(rows[nearest].t-local))nearest=i;
  if(rows.length>2){const a=rows[Math.max(0,nearest-5)],b=rows[Math.min(rows.length-1,nearest+5)];opportunityTide=Math.abs(b.h-a.h)}
 }catch{opportunityTide=null}
 try{
  const res=await fetch('https://api.open-meteo.com/v1/forecast?latitude=32.78&longitude=-79.93&current=wind_speed_10m&wind_speed_unit=mph&timezone=America%2FNew_York');
  const data=await res.json();opportunityWind=Number.isFinite(data.current?.wind_speed_10m)?data.current.wind_speed_10m:null;
 }catch{opportunityWind=null}
 opportunityUpdated=Date.now();updateOpportunityZones();
}
function draw(){
 const type=document.getElementById('hotspot-filter').value;
 const species=document.getElementById('hotspot-species').value;
 const shown=spots.filter(s=>(type==='all'||s.type===type)&&(species==='all'||s.species.includes(species)));
 tackleFor(species);
 updateOpportunityZones();
 markers.forEach(m=>m.remove());markers=[];
 const mode=document.getElementById('hotspot-layer-mode')?.value||'both';
 const showAccess=mode==='both'||mode==='access';
 const list=document.getElementById('hotspot-list');list.replaceChildren();
 for(const s of shown){
  const marker=L.marker([s.lat,s.lng],{zIndexOffset:1000,title:s.name});
  if(showAccess)marker.addTo(map);
  const route='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(s.name+', '+s.area+', South Carolina');
  marker.bindPopup('<strong>'+esc(s.name)+'</strong><p>'+esc(s.note)+'</p><p><small>Possible habitat: '+esc(s.species.join(', '))+'</small></p><a target="_blank" rel="noopener noreferrer" href="'+route+'">Directions</a>');
  markers.push(marker);
  const item=document.createElement('details');item.className='hotspot-accordion-item';
  const heading=document.createElement('summary');heading.textContent=s.name;
  const body=document.createElement('div');body.className='hotspot-accordion-body';
  const info=document.createElement('p');info.textContent=s.area+' · '+({pier:'Fishing pier',shore:'Shore access',launch:'Watercraft launch'}[s.type]);
  const note=document.createElement('p');note.textContent=s.note;
  const match=document.createElement('p');match.textContent=species==='all'?'Possible nearby species (habitat-based): '+s.species.join(', '):'Potential '+species+' habitat (not a verified catch)';
  const focus=document.createElement('button');focus.type='button';focus.textContent='Show on map';
  focus.onclick=()=>{map.setView([s.lat,s.lng],14);marker.openPopup();document.getElementById('hotspot-map').scrollIntoView({behavior:'smooth',block:'center'})};
  body.append(info,note,match,focus);item.append(heading,body);list.append(item);
  item.addEventListener('toggle',()=>{if(item.open){list.querySelectorAll('details.hotspot-accordion-item').forEach(other=>{if(other!==item)other.open=false})}});

 }
 document.getElementById('hotspot-count').textContent=shown.length+' of '+spots.length+' access points';
 if(!shown.length){const p=document.createElement('p');p.textContent='No matching access points in this initial dataset. This does not mean the species is absent from the Lowcountry.';list.append(p)}
 // Preserve the user's current map view and initial Charleston center.
}
function init(){
 if(initialized){setTimeout(refreshMap,60);setTimeout(refreshMap,350);return}
 if(!window.L){document.getElementById('hotspot-map').textContent='Map could not load. Check your connection and reload.';return}
 const speciesSelect=document.getElementById('hotspot-species');
 // Offer the entire FishDex collection, while only showing locations with supported habitat matches.
 if(typeof species!=='undefined'&&Array.isArray(species)){
  speciesSelect.replaceChildren(new Option('All species','all'));
  for(const fish of species){speciesSelect.add(new Option(fish.name,fish.name))}
 }
 initialized=true;map=L.map('hotspot-map',{scrollWheelZoom:true}).setView([32.77,-79.92],10);
 map.on('zoomend moveend',()=>{updateOpportunityZones();queueHabitatWays()});
 document.getElementById('hotspot-activity-toggle')?.addEventListener('change',()=>{updateOpportunityZones();queueHabitatWays()});
 streetLayer=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap contributors'});
 satelliteLayer=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:18,attribution:'Imagery © Esri and imagery providers'}).addTo(map);
 const nauticalLayer=L.tileLayer('https://gis.charttools.noaa.gov/arcgis/rest/services/MarineChart_Services/NOAACharts/MapServer/tile/{z}/{y}/{x}',{zoomOffset:-2,minZoom:2,maxNativeZoom:18,maxZoom:18,attribution:'NOAA Office of Coast Survey · Chart Display Service',crossOrigin:true});
 const terrainLayer=L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',{maxNativeZoom:17,maxZoom:18,attribution:'© OpenTopoMap contributors · © OpenStreetMap contributors'});
 const coastalDemLayer=L.tileLayer('https://tiles.arcgis.com/tiles/C8EMgrsFcRFL6LrL/arcgis/rest/services/CUDEM_hillshade/MapServer/tile/{z}/{y}/{x}',{maxNativeZoom:14,maxZoom:18,opacity:.85,attribution:'NOAA NCEI CUDEM coastal bathymetry/topography · surveyed/modelled relief'});
 const sonarLayer=L.tileLayer('https://tiles.arcgis.com/tiles/C8EMgrsFcRFL6LrL/arcgis/rest/services/bag_hillshades/MapServer/tile/{z}/{y}/{x}',{maxNativeZoom:14,maxZoom:18,opacity:.72,errorTileUrl:'',attribution:'NOAA NCEI/NOS surveyed sonar BAG relief (limited coverage)'});
 document.getElementById('hotspot-basemap').addEventListener('change',e=>{
  for(const layer of [streetLayer,satelliteLayer,nauticalLayer,terrainLayer,coastalDemLayer,sonarLayer])if(map.hasLayer(layer))map.removeLayer(layer);
  const selected=e.target.value;
  (selected==='satellite'?satelliteLayer:selected==='nautical'?nauticalLayer:selected==='terrain'?terrainLayer:streetLayer).addTo(map);
  if(selected==='coastal-dem')coastalDemLayer.addTo(map);
  if(selected==='sonar'){sonarLayer.addTo(map);const status=document.getElementById('hotspot-activity-status');if(status)status.textContent='Sonar data only exists where NOAA hydrographic surveys are published; unsurveyed ocean areas will show satellite imagery.';}
  const info=document.getElementById('hotspot-activity-status');
  if(info&&selected==='sonar')info.textContent='NOAA surveyed sonar relief: areas without survey coverage will not show detailed seabed terrain.';
 });
 setupTidePin();
 setupPersonalLocation();
 setupFishingIntelligence();
 document.getElementById('hotspot-add-personal').addEventListener('click',addPersonal);
 document.getElementById('hotspot-show-personal').addEventListener('click',e=>{showPersonal=!showPersonal;e.target.textContent=showPersonal?'Hide my spots':'Show my spots';redrawPersonal()});
 redrawPersonal();loadConditions();
 const layerMode=document.getElementById('hotspot-layer-mode'),quick=document.getElementById('hotspot-quick-mode');
 const syncLayers=()=>{
  const mode=layerMode.value;
  markers.forEach(marker=>{if(mode==='both'||mode==='access')marker.addTo(map);else marker.remove()});
  updateOpportunityZones();
  if(mode==='both'||mode==='hotspots')queueHabitatWays();
  quick.querySelector('span').textContent=mode==='hotspots'?'Show points':'Zones only';
  quick.setAttribute('aria-label',mode==='hotspots'?'Show fishing access points and Bite Zones':'Hide fishing access points and show Bite Zones only');
 };
 layerMode.addEventListener('change',syncLayers);
 quick.addEventListener('click',()=>{
  layerMode.value=layerMode.value==='hotspots'?'both':'hotspots';
  syncLayers();
  if(layerMode.value==='hotspots'&&map.getZoom()<11)map.setView([32.7935,-79.8823],12);
 });
 document.getElementById('hotspot-filter').addEventListener('change',draw);
 document.getElementById('hotspot-species').addEventListener('change',draw);
 draw();
 // Keep fishing access markers above the optional colored habitat overlay.
 opportunityLayer=L.layerGroup().addTo(map);
 updateOpportunityZones();queueHabitatWays();
 refreshOpportunityConditions().catch(e=>console.warn('Opportunity conditions:',e));
 setInterval(()=>{if(document.visibilityState==='visible')refreshOpportunityConditions().catch(()=>{})},30*60*1000);
 setTimeout(refreshMap,120);setTimeout(refreshMap,500);
 if('ResizeObserver' in window){resizeObserver=new ResizeObserver(()=>refreshMap());resizeObserver.observe(document.getElementById('hotspot-map'));}
 window.addEventListener('resize',refreshMap);
}
document.addEventListener('DOMContentLoaded',()=>{
 const tab=document.querySelector('[data-tab="hotspots"]');
 if(tab)tab.addEventListener('click',()=>{setTimeout(init,100);setTimeout(refreshMap,450)});
 window.addEventListener('hashchange',()=>{if(location.hash==='#hotspots'){setTimeout(init,100);setTimeout(refreshMap,400)}});
 if(location.hash==='#hotspots')setTimeout(init,250);
});
let tidePinMarker=null,tidePinArmed=false,tidePinRequest=0,tideStationsCache=null;
function tideDistance(a,b,c,d){const rad=Math.PI/180,x=(c-a)*rad,y=(d-b)*rad;return 6371*2*Math.asin(Math.sqrt(Math.sin(x/2)**2+Math.cos(a*rad)*Math.cos(c*rad)*Math.sin(y/2)**2))}
async function tideStationFor(lat,lng){
 if(!tideStationsCache){
  const response=await fetch('https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions&units=english');
  if(!response.ok)throw Error('NOAA station directory unavailable');
  const data=await response.json();
  tideStationsCache=(data.stations||[]).filter(v=>Number.isFinite(Number(v.lat))&&Number.isFinite(Number(v.lng))&&v.id);
  if(!tideStationsCache.length)throw Error('No NOAA tide stations returned');
 }
 return tideStationsCache.map(v=>({station:v,distance:tideDistance(lat,lng,Number(v.lat),Number(v.lng))})).sort((a,b)=>a.distance-b.distance).slice(0,12);
}
async function showPinnedTides(lat,lng){
 const output=document.getElementById('hotspot-tide-result');if(!output)return;
 const request=++tidePinRequest;
 output.replaceChildren();const status=document.createElement('p');status.textContent='Finding nearby NOAA tide stations…';output.append(status);
 try{
  const candidates=await tideStationFor(lat,lng);
  const now=new Date(),date=offset=>{const d=new Date(now.getTime()+offset*86400000);const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);const get=k=>parts.find(p=>p.type===k).value;return get('year')+get('month')+get('day')};
  let found=null,lastError=null;
  for(const candidate of candidates){
   if(request!==tidePinRequest)return;
   try{
    const station=candidate.station;
    const params=new URLSearchParams({begin_date:date(0),end_date:date(2),station:station.id,product:'predictions',datum:'MLLW',time_zone:'lst_ldt',units:'english',interval:'6',format:'json'});
    const response=await fetch('https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?'+params);
    if(!response.ok)throw Error('Station prediction unavailable');
    const data=await response.json();
    if(!data.predictions?.length)throw Error(data.error?.message||'No predictions');
    found={...candidate,predictions:data.predictions};break;
   }catch(e){lastError=e}
  }
  if(request!==tidePinRequest)return;
  if(!found)throw lastError||Error('No station predictions available');
  const station=found.station;output.replaceChildren();
  const title=document.createElement('strong');title.textContent='📍 Nearest available tide station: '+station.name+' ('+station.id+')';output.append(title);
  const detail=document.createElement('p');detail.textContent='Pinned: '+lat.toFixed(5)+', '+lng.toFixed(5)+' · Station approximately '+found.distance.toFixed(1)+' km away. Times are Eastern. Tide heights are for the NOAA station, not exact predictions at the pin.';output.append(detail);
  const graph=document.createElement('div');output.append(graph);
  drawTideGraph(graph,found.predictions);
  const graphLabel=graph.querySelector('small');if(graphLabel)graphLabel.textContent='NOAA predicted tide height (feet above MLLW) · '+station.name+' ('+station.id+') · Eastern Time';
  const chart=graph.querySelector('svg');if(chart)chart.setAttribute('aria-label','NOAA predicted tides at '+station.name+' for the next two days');
  const note=document.createElement('small');note.textContent='Approximation based on the nearest NOAA station with available predictions. Local tide timing and height may differ, especially in creeks and inlets. Not for navigation.';output.append(note);
 }catch(e){if(request===tidePinRequest){status.textContent='Could not retrieve NOAA tides for this point. Try another location.';console.warn('Pinned tide lookup:',e)}}
}
function setupTidePin(){
 const button=document.getElementById('hotspot-tide-pin');if(!button||!map)return;
 button.addEventListener('click',()=>{
  tidePinArmed=!tidePinArmed;
  if(tidePinArmed&&personalPinArmed){personalPinArmed=false;const spotButton=document.getElementById('hotspot-add-personal');if(spotButton)spotButton.textContent='📍 Pin a new spot'}
  button.textContent=tidePinArmed?'Cancel pin selection':'📍 Pin tide location';
  const output=document.getElementById('hotspot-tide-result');
  if(tidePinArmed&&output)output.textContent='Tap or click the location on the map to place your tide pin.';
  map.getContainer().style.cursor=tidePinArmed?'crosshair':'';
 });
 map.on('click',event=>{
  if(!tidePinArmed)return;
  tidePinArmed=false;button.textContent='📍 Pin tide location';map.getContainer().style.cursor='';
  const {lat,lng}=event.latlng;
  if(tidePinMarker)tidePinMarker.remove();
  tidePinMarker=L.marker([lat,lng],{title:'Pinned tide location'}).addTo(map);
  tidePinMarker.bindPopup('📍 Tide prediction location').openPopup();
  showPinnedTides(lat,lng);
 });
}

let fishdexOysterLayer=null,fishdexOysterTimer=null,fishdexOysterKey='',fishdexWeatherTimer=null;
const fishdexCatchKey='fishdex_private_catches_v1';
function fishdexStatus(message){const el=document.getElementById('fishdex-field-status');if(el)el.textContent=message}
function fishdexSavedCatches(){try{const v=JSON.parse(localStorage.getItem(fishdexCatchKey)||'[]');return Array.isArray(v)?v:[]}catch{return []}}
function fishdexRenderCatches(){
 const el=document.getElementById('fishdex-catch-history');if(!el)return;
 el.replaceChildren();const catches=fishdexSavedCatches();
 const title=document.createElement('strong');title.textContent='Private catch log ('+catches.length+')';el.append(title);
 for(const c of catches.slice(-5).reverse()){
  const row=document.createElement('div');row.style.margin='6px 0';
  row.textContent=c.species+' · '+c.date+' · '+c.lat.toFixed(4)+', '+c.lng.toFixed(4)+(c.bait?' · '+c.bait:'');
  const del=document.createElement('button');del.type='button';del.textContent='Delete';del.style.marginLeft='8px';
  del.addEventListener('click',()=>{localStorage.setItem(fishdexCatchKey,JSON.stringify(fishdexSavedCatches().filter(x=>x.id!==c.id)));fishdexRenderCatches()});
  row.append(del);el.append(row);
 }
}
function fishdexLogCatch(latlng){
 const species=prompt('Catch species (Cancel to stop):');if(!species||!species.trim())return;
 const length=prompt('Fish length in inches (optional):')||'';
 const bait=prompt('Bait or lure (optional):')||'';
 const notes=prompt('Catch notes (optional):')||'';
 const catches=fishdexSavedCatches();
 catches.push({id:Date.now()+Math.random(),date:new Date().toLocaleString(),species:species.trim().slice(0,90),length:length.slice(0,30),bait:bait.slice(0,100),notes:notes.slice(0,1000),lat:+latlng.lat.toFixed(6),lng:+latlng.lng.toFixed(6)});
 try{localStorage.setItem(fishdexCatchKey,JSON.stringify(catches));fishdexStatus('Catch saved privately on this device.');fishdexRenderCatches()}catch{fishdexStatus('Could not save catch; device storage may be full.')}
}
async function fishdexLookupDepth(latlng){
 fishdexStatus('Searching NOAA electronic chart depth soundings…');
 const bounds=map.getBounds();
 const params=new URLSearchParams({f:'json',geometry:JSON.stringify({x:latlng.lng,y:latlng.lat,spatialReference:{wkid:4326}}),geometryType:'esriGeometryPoint',sr:'4326',layers:'all',tolerance:'15',mapExtent:[bounds.getWest(),bounds.getSouth(),bounds.getEast(),bounds.getNorth()].join(','),imageDisplay:map.getSize().x+','+map.getSize().y+',96',returnGeometry:'false'});
 let available=false;
 for(const band of ['enc_harbor','enc_approach','enc_coastal']){
  try{
   const url='https://encdirect.noaa.gov/arcgis/rest/services/encdirect/'+band+'/MapServer/identify?'+params;
   const response=await fetch(url,{signal:AbortSignal.timeout(9000)});
   if(!response.ok)continue;
   const data=await response.json();if(data.error)continue;available=true;
   const hits=(data.results||[]).filter(v=>/sounding|depth.contour|depth.area/i.test(v.layerName||''));
   const match=hits.find(v=>Object.entries(v.attributes||{}).some(([k,value])=>/VALSOU|DRVAL|DEPTH|SOUND/i.test(k)&&value!==null&&value!==''))||hits[0];
   if(!match)continue;
   const values=Object.entries(match.attributes||{}).filter(([k,v])=>/VALSOU|DRVAL|DEPTH|SOUND/i.test(k)&&v!==null&&v!=='').slice(0,3).map(([k,v])=>k+': '+v).join(' · ');
   fishdexStatus('NOAA ENC '+match.layerName+(values?' · '+values:' · No numeric depth in feature')+'. Depth values may be in meters relative to chart datum; not a live water depth or navigation aid.');
   return;
  }catch(e){console.warn('FishDex depth '+band,e)}
 }
 fishdexStatus(available?'No charted sounding within the selected point tolerance. Try tapping a nearby channel or turning on NOAA nautical charts.':'NOAA depth service could not be reached. Try again later or view NOAA nautical charts; no depth was guessed.');
}
async function fishdexLoadOysters(){
 if(!document.getElementById('fishdex-oysters-enabled')?.checked)return;
 if(!fishdexOysterLayer)fishdexOysterLayer=L.layerGroup().addTo(map);
 if(map.getZoom()<11){fishdexStatus('Zoom to level 11 or closer to load mapped oyster reefs.');return}
 const b=map.getBounds();if((b.getNorth()-b.getSouth())*(b.getEast()-b.getWest())>.15)return;
 const key=[b.getSouth(),b.getWest(),b.getNorth(),b.getEast()].map(v=>v.toFixed(2)).join(',');
 if(key===fishdexOysterKey)return;fishdexOysterKey=key;
 const box=[b.getSouth(),b.getWest(),b.getNorth(),b.getEast()].join(',');
 const query='[out:json][timeout:15];(way["reef"="oyster"]('+box+');way["natural"="reef"]('+box+');way["seamark:type"="oyster_bed"]('+box+'););out geom;';
 try{
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),11000);
  let response;try{response=await fetch('https://overpass.kumi.systems/api/interpreter',{method:'POST',body:new URLSearchParams({data:query}),signal:controller.signal})}finally{clearTimeout(timer)}
  if(!response||!response.ok)throw Error('Map source unavailable');
  const data=await response.json();fishdexOysterLayer.clearLayers();
  let count=0;
  for(const w of (data.elements||[]).slice(0,150)){
   if(!w.geometry||w.geometry.length<2)continue;
   const pts=w.geometry.map(p=>[p.lat,p.lon]);
   const closed=pts.length>2&&pts[0][0]===pts[pts.length-1][0]&&pts[0][1]===pts[pts.length-1][1];
   const layer=closed?L.polygon(pts,{color:'#ffb74d',weight:2,fillOpacity:.20}):L.polyline(pts,{color:'#ffb74d',weight:3});
   layer.bindPopup('Mapped reef / possible oyster habitat (OpenStreetMap). Not field verified.');layer.addTo(fishdexOysterLayer);count++;
  }
  fishdexStatus(count+' mapped reef features found in view. Orange features are community mapped, not verified oyster beds.');
 }catch(e){fishdexOysterKey='';fishdexStatus('Community reef data could not load. SCDNR maintains an official South Carolina intertidal oyster reef map: https://shellfish-applications-scdnr.hub.arcgis.com/ .')}
}
async function fishdexLoadWeather(){
 if(!document.getElementById('fishdex-weather-enabled')?.checked)return;
 const c=map.getCenter(),el=document.getElementById('fishdex-weather-info');if(!el)return;
 el.hidden=false;el.textContent='Loading current wind and weather…';
 try{
  const params=new URLSearchParams({latitude:c.lat.toFixed(4),longitude:c.lng.toFixed(4),current:'temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation,weather_code',wind_speed_unit:'mph',temperature_unit:'fahrenheit',timezone:'auto'});
  const response=await fetch('https://api.open-meteo.com/v1/forecast?'+params,{signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw Error('Weather service unavailable');
  const data=await response.json(),w=data.current;if(!w)throw Error('Missing conditions');
  el.textContent='Near map center · '+w.temperature_2m+'°F · Wind '+w.wind_speed_10m+' mph from '+w.wind_direction_10m+'° · Gusts '+w.wind_gusts_10m+' mph · Rain '+w.precipitation+' mm. Forecast/model data; check marine advisories before boating.';
 }catch(e){el.textContent='Wind and weather currently unavailable.'}
}
function setupFishingIntelligence(){
 const get=id=>document.getElementById(id);
 const depth=get('fishdex-depth-enabled'),catchToggle=get('fishdex-catch-enabled'),oysters=get('fishdex-oysters-enabled'),weather=get('fishdex-weather-enabled');
 if(!depth||!catchToggle||!oysters||!weather)return;
 fishdexRenderCatches();
 depth.addEventListener('change',()=>{if(depth.checked){catchToggle.checked=false;fishdexStatus('Tap water on the map to query NOAA chart features.')}})
 catchToggle.addEventListener('change',()=>{if(catchToggle.checked){depth.checked=false;fishdexStatus('Tap a map location to record a private catch.')}})
 map.on('click',e=>{
  if(personalPinArmed||tidePinArmed)return;
  if(catchToggle.checked)fishdexLogCatch(e.latlng);
  else if(depth.checked)fishdexLookupDepth(e.latlng);
 });
 oysters.addEventListener('change',()=>{if(!oysters.checked){fishdexOysterLayer?.clearLayers();fishdexOysterKey=''}else fishdexLoadOysters()});
 weather.addEventListener('change',()=>{get('fishdex-weather-info').hidden=!weather.checked;if(weather.checked)fishdexLoadWeather()});
 map.on('moveend',()=>{clearTimeout(fishdexOysterTimer);fishdexOysterTimer=setTimeout(fishdexLoadOysters,650);clearTimeout(fishdexWeatherTimer);fishdexWeatherTimer=setTimeout(fishdexLoadWeather,900)});
}
})();
