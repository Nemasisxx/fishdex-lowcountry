/* Public fishing-access discovery map. Coordinates are approximate access markers, not fishing/catch data. */
(()=>{'use strict';
const spots=[
 {name:'Mount Pleasant Memorial Waterfront Park Pier',lat:32.8023,lng:-79.9055,type:'pier',area:'Mount Pleasant',note:'Public pier by the Ravenel Bridge; check current fishing rules and access.'},
 {name:'Folly Beach Fishing Pier',lat:32.6546,lng:-79.9407,type:'pier',area:'Folly Beach',note:'Oceanfront fishing pier; verify fees, hours and any closures.'},
 {name:'Pitt Street Bridge',lat:32.7737,lng:-79.8686,type:'shore',area:'Old Village, Mount Pleasant',note:'Public waterfront walkway; fish only in areas where fishing is permitted.'},
 {name:'Shem Creek Park',lat:32.7935,lng:-79.8823,type:'shore',area:'Mount Pleasant',note:'Public boardwalk and creek access; respect posted restrictions and private docks.'},
 {name:'Brittlebank Park',lat:32.7866,lng:-79.9630,type:'shore',area:'Downtown Charleston',note:'Ashley River waterfront park; confirm where fishing is permitted.'}
];
let map,markers=[],initialized=false;
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function draw(){
 const type=document.getElementById('hotspot-filter').value;
 const shown=spots.filter(s=>type==='all'||s.type===type);
 markers.forEach(m=>m.remove());markers=[];
 const list=document.getElementById('hotspot-list');list.replaceChildren();
 for(const s of shown){
  const marker=L.marker([s.lat,s.lng]).addTo(map);
  const route='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(s.name+', '+s.area+', South Carolina');
  marker.bindPopup('<strong>'+escape(s.name)+'</strong><p>'+escape(s.note)+'</p><a target="_blank" rel="noopener noreferrer" href="'+route+'">Find access / directions</a>');
  markers.push(marker);
  const card=document.createElement('div');card.className='feature-card';
  const heading=document.createElement('h3');heading.textContent=s.name;
  const info=document.createElement('p');info.textContent=s.area+' · '+(s.type==='pier'?'Pier':'Shore / bank');
  const note=document.createElement('p');note.textContent=s.note;
  const focus=document.createElement('button');focus.type='button';focus.textContent='Show on map';focus.onclick=()=>{map.setView([s.lat,s.lng],14);marker.openPopup();document.getElementById('hotspot-map').scrollIntoView({behavior:'smooth',block:'center'})};
  card.append(heading,info,note,focus);list.append(card);
 }
 document.getElementById('hotspot-count').textContent=shown.length+' access points';
 if(markers.length>1)map.fitBounds(L.featureGroup(markers).getBounds().pad(.18));
 else if(markers.length)map.setView(markers[0].getLatLng(),13);
}
function init(){
 if(initialized)return; if(!window.L){document.getElementById('hotspot-map').textContent='Map tiles could not load. Please check your connection and reload.';return}
 initialized=true;
 map=L.map('hotspot-map',{scrollWheelZoom:false}).setView([32.77,-79.92],11);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap contributors'}).addTo(map);
 document.getElementById('hotspot-filter').addEventListener('change',draw);
 draw();setTimeout(()=>map.invalidateSize(),120);
}
document.addEventListener('DOMContentLoaded',()=>{
 const tab=document.querySelector('[data-tab="hotspots"]');
 if(tab)tab.addEventListener('click',()=>setTimeout(init,100));
 if(location.hash==='#hotspots')setTimeout(init,250);
});
})();