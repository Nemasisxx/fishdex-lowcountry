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
 ['Robert E. Ashley Landing',33.080797,-79.459699,'launch','McClellanville','creek','Jeremy Creek watercraft access.']
].map(([name,lat,lng,type,area,habitat,note])=>({name,lat,lng,type,area,habitat,note,profile:profileByName[name]||'tidalRiver',species:S[profileByName[name]||'tidalRiver']}));
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
function addPersonal(){
 const center=map.getCenter();const name=prompt('Name your private fishing spot (saved on this device only):');if(!name||!name.trim())return;
 const note=prompt('Private notes (optional):')||'';
 personal.push({name:name.trim().slice(0,120),lat:+center.lat.toFixed(6),lng:+center.lng.toFixed(6),note:note.slice(0,2000),catchNotes:''});
 persistPersonal();redrawPersonal();personalMarkers[personalMarkers.length-1]?.openPopup();
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
function refreshMap(){if(!map)return;requestAnimationFrame(()=>{map.invalidateSize({pan:false});if(markers.length>1)map.fitBounds(L.featureGroup(markers).getBounds().pad(.10),{animate:false,maxZoom:12});});}
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
function nearestHabitatSpot(lat,lng){
 let nearest=null,distance=Infinity;
 for(const spot of spots){
  const d=Math.hypot((lat-spot.lat)*111,(lng-spot.lng)*94);
  if(d<distance){distance=d;nearest=spot}
 }
 return distance<=2.5?nearest:null;
}
function updateOpportunityZones(){
 if(!map||!opportunityLayer)return;
 opportunityLayer.clearLayers();
 const toggle=document.getElementById('hotspot-activity-toggle'),status=document.getElementById('hotspot-activity-status');
 const mode=document.getElementById('hotspot-layer-mode')?.value||'both';
 if(!toggle?.checked||mode==='access'||mode==='clear'){status.textContent='Bite zones hidden. Choose Bite Zones only or Both in Filters to display them.';return}
 if(map.getZoom()<(mode==='hotspots'?11:13)){status.textContent='Zoom closer near Shem Creek, Wando River or Charleston Harbor to view mapped waterway habitat.';return}
 const bounds=map.getBounds(),species=document.getElementById('hotspot-species').value;
 let count=0;
 for(const way of habitatWays){
  const mid=way.center;
  if(!bounds.pad(.15).contains(mid))continue;
  const near=nearestHabitatSpot(mid[0],mid[1]);if(!near)continue;
  const result=opportunityScore(near);if(!result)continue;
  const score=Math.min(100,result.score+(way.kind==='stream'?7:0));
  const color=score>=70?'#ef4444':score>=48?'#ffd04c':'#22c55e';
  const zonesOnly=mode==='hotspots';
  const line=L.polygon(way.points,{color,weight:zonesOnly?2:1,opacity:zonesOnly?.95:.75,fillColor:color,fillOpacity:zonesOnly?.76:.42,interactive:true}).addTo(opportunityLayer);
  const label=document.createElement('div'),head=document.createElement('strong'),why=document.createElement('p'),caution=document.createElement('small');
  head.textContent=(way.name||'Mapped tidal waterway')+' · '+(score>=70?'Higher':score>=48?'Moderate':'Lower')+' modeled opportunity';
  why.textContent='Mapped water-area polygon (OpenStreetMap). '+result.reasons.join(' · ')+'.';
  caution.textContent='Highlight follows mapped water-area boundaries, not verified depth, reef, fish activity or navigable water. Map geometry can be incomplete. Check tides, permissions and hazards.';
  label.append(head,why,caution);line.bindPopup(label);count++;
 }
 status.textContent=habitatLoading?'Loading mapped water areas…':count?count+' mapped water areas highlighted in view. Tap an area for its basis.':'No verified mapped water-area polygons available here. No land-based fallback is shown.';
}
async function loadHabitatWays(){
 if(!map||map.getZoom()<((document.getElementById('hotspot-layer-mode')?.value==='hotspots')?11:13)||!document.getElementById('hotspot-activity-toggle')?.checked)return;
 const center=map.getCenter();
 // Initial study region: Charleston Harbor, Wando River and Shem Creek.
 if(center.lat<32.73||center.lat>32.94||center.lng< -80.02||center.lng> -79.73){habitatWays=[];habitatKey='';updateOpportunityZones();return}
 const b=map.getBounds(),south=Math.max(32.73,b.getSouth()),north=Math.min(32.94,b.getNorth()),west=Math.max(-80.02,b.getWest()),east=Math.min(-79.73,b.getEast());
 if(north<=south||east<=west)return;
 const key=[south,north,west,east].map(n=>n.toFixed(2)).join(',');
 if(key===habitatKey)return;
 habitatKey=key;habitatLoading=true;updateOpportunityZones();
 const query='[out:json][timeout:18];(way["natural"="water"]('+south+','+west+','+north+','+east+');way["waterway"="riverbank"]('+south+','+west+','+north+','+east+'););out geom;';
 try{
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),14000);
  let response;
  try{response=await fetch('https://overpass.kumi.systems/api/interpreter',{method:'POST',body:'data='+encodeURIComponent(query),headers:{'Content-Type':'application/x-www-form-urlencoded'},signal:controller.signal})}finally{clearTimeout(timeout)}
  if(!response.ok)throw Error('Map data unavailable');
  const json=await response.json();
  // Only closed, explicitly mapped water polygons; never draw land-crossing centerlines.
  habitatWays=(json.elements||[]).filter(e=>{
   if(e.type!=='way'||!e.geometry||e.geometry.length<4)return false;
   const first=e.geometry[0],last=e.geometry[e.geometry.length-1];
   return first.lat===last.lat&&first.lon===last.lon&&(e.tags?.natural==='water'||e.tags?.waterway==='riverbank');
  }).slice(0,150).map(e=>{
   const points=e.geometry.map(p=>[p.lat,p.lon]);
   const bounds=L.latLngBounds(points);
   return {name:e.tags?.name||'',kind:e.tags?.waterway||e.tags?.water||'',points,center:[bounds.getCenter().lat,bounds.getCenter().lng]};
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
 if(markers.length>1&&showAccess)map.fitBounds(L.featureGroup(markers).getBounds().pad(.10),{animate:false,maxZoom:12});
 else if(markers.length&&showAccess)map.setView(markers[0].getLatLng(),13);
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
 initialized=true;map=L.map('hotspot-map',{scrollWheelZoom:false}).setView([32.77,-79.92],10);
 map.on('zoomend moveend',()=>{updateOpportunityZones();queueHabitatWays()});
 document.getElementById('hotspot-activity-toggle')?.addEventListener('change',()=>{updateOpportunityZones();queueHabitatWays()});
 streetLayer=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap contributors'}).addTo(map);
 satelliteLayer=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:18,attribution:'Imagery © Esri and imagery providers'});
 document.getElementById('hotspot-basemap').addEventListener('change',e=>{if(e.target.value==='satellite'){map.removeLayer(streetLayer);satelliteLayer.addTo(map)}else{map.removeLayer(satelliteLayer);streetLayer.addTo(map)}});
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
})();