/* FishDex public fishing access map.
 * Coordinates from Charleston County Parks 2023 public boat landing/paddlecraft map
 * (https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/charlestoncountysc/Boat_Landings_Map_2023_PDF__13f46e13-dc63-4f3b-97d6-cd4c1552e5b0.pdf)
 * except pre-existing approximate points and specifically documented public fishing piers.
 * Species associations are HABITAT suggestions, never reported catches.
 */
(()=>{'use strict';
const S={
 estuary:['Red Drum','Spotted Seatrout','Southern Flounder','Sheepshead','Black Drum','Pinfish'],
 creek:['Red Drum','Spotted Seatrout','Southern Flounder','Black Drum','Pinfish'],
 structure:['Red Drum','Spotted Seatrout','Southern Flounder','Sheepshead','Black Drum','Pinfish'],
 surf:['Red Drum','Southern Flounder','Bluefish','Spanish Mackerel','Pinfish'],
 harbor:['Red Drum','Spotted Seatrout','Southern Flounder','Sheepshead','Black Drum','Bluefish','Spanish Mackerel','Pinfish'],
 freshwater:['Largemouth Bass','Bluegill']
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
].map(([name,lat,lng,type,area,habitat,note])=>({name,lat,lng,type,area,habitat,note,species:S[habitat]}));
let map,markers=[],initialized=false;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function draw(){
 const type=document.getElementById('hotspot-filter').value;
 const species=document.getElementById('hotspot-species').value;
 const shown=spots.filter(s=>(type==='all'||s.type===type)&&(species==='all'||s.species.includes(species)));
 markers.forEach(m=>m.remove());markers=[];
 const list=document.getElementById('hotspot-list');list.replaceChildren();
 for(const s of shown){
  const marker=L.marker([s.lat,s.lng]).addTo(map);
  const route='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(s.name+', '+s.area+', South Carolina');
  marker.bindPopup('<strong>'+esc(s.name)+'</strong><p>'+esc(s.note)+'</p><p><small>Possible habitat: '+esc(s.species.join(', '))+'</small></p><a target="_blank" rel="noopener noreferrer" href="'+route+'">Directions</a>');
  markers.push(marker);
  const card=document.createElement('div');card.className='feature-card';
  const heading=document.createElement('h3');heading.textContent=s.name;
  const info=document.createElement('p');info.textContent=s.area+' · '+({pier:'Fishing pier',shore:'Shore access',launch:'Watercraft launch'}[s.type]);
  const note=document.createElement('p');note.textContent=s.note;
  const match=document.createElement('p');match.textContent=species==='all'?'Possible habitat species: '+s.species.join(', '):'Possible '+species+' habitat (not a catch report)';
  const focus=document.createElement('button');focus.type='button';focus.textContent='Show on map';focus.onclick=()=>{map.setView([s.lat,s.lng],14);marker.openPopup();document.getElementById('hotspot-map').scrollIntoView({behavior:'smooth',block:'center'})};
  card.append(heading,info,note,match,focus);list.append(card);
 }
 document.getElementById('hotspot-count').textContent=shown.length+' of '+spots.length+' access points';
 if(!shown.length){const p=document.createElement('p');p.textContent='No matching access points in this initial dataset. This does not mean the species is absent from the Lowcountry.';list.append(p)}
 if(markers.length>1)map.fitBounds(L.featureGroup(markers).getBounds().pad(.12));
 else if(markers.length)map.setView(markers[0].getLatLng(),13);
}
function init(){
 if(initialized){setTimeout(()=>map.invalidateSize(),50);return}
 if(!window.L){document.getElementById('hotspot-map').textContent='Map could not load. Check your connection and reload.';return}
 const speciesSelect=document.getElementById('hotspot-species');
 // Offer the entire FishDex collection, while only showing locations with supported habitat matches.
 if(typeof species!=='undefined'&&Array.isArray(species)){
  speciesSelect.replaceChildren(new Option('All species','all'));
  for(const fish of species){speciesSelect.add(new Option(fish.name,fish.name))}
 }
 initialized=true;map=L.map('hotspot-map',{scrollWheelZoom:false}).setView([32.77,-79.92],10);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap contributors'}).addTo(map);
 document.getElementById('hotspot-filter').addEventListener('change',draw);
 document.getElementById('hotspot-species').addEventListener('change',draw);
 draw();setTimeout(()=>map.invalidateSize(),150);
}
document.addEventListener('DOMContentLoaded',()=>{
 const tab=document.querySelector('[data-tab="hotspots"]');
 if(tab)tab.addEventListener('click',()=>setTimeout(init,100));
 if(location.hash==='#hotspots')setTimeout(init,250);
});
})();