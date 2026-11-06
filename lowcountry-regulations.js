/* FishDex Lowcountry regulations: coverage for all 99 catalog species.
 * IMPORTANT: This is not a real-time legal database. Never interpret missing
 * limits as no limit, or historic snapshots as current regulations.
 */
(()=>{'use strict';
const LINKS={
 salt:'https://www.dnr.sc.gov/regs/saltwaterfish.html',
 fresh:'https://www.dnr.sc.gov/regs/freshwaterfish.html',
 general:'https://www.dnr.sc.gov/regs/fishing.html',
 federal:'https://www.fisheries.noaa.gov/rules-and-regulations'
};
const historic={
 'Red Drum':{size:'15–23 in slot (total length)',bag:'2/person/day; 6/boat/day',notes:'Historic reference; verify state-water and federal-water restrictions.',source:'https://www.dnr.sc.gov/fishing/pdf/RedDrumSpeciesSnapshot.pdf'},
 'Spotted Seatrout':{size:'14 in minimum (total length)',bag:'10/person/day',notes:'Historic reference; emergency closures may supersede published limits.',source:'https://www.dnr.sc.gov/fishing/pdf/SpottedSeatroutSpeciesSnapshot.pdf'},
 'Southern Flounder':{size:'16 in minimum (total length)',bag:'5/person/day; 10/boat/day',notes:'Historic reference; check combined flounder limits and seasons.',source:'https://www.dnr.sc.gov/fishing/pdf/FlounderSnapshot.pdf'}
};
const freshwater=new Set('Largemouth Bass|Bluegill|Redear Sunfish|Redbreast Sunfish|Warmouth|Green Sunfish|Pumpkinseed|Black Crappie|White Crappie|Channel Catfish|Blue Catfish|Flathead Catfish|Brown Bullhead|Yellow Bullhead|Bowfin|Longnose Gar|Florida Gar|Chain Pickerel|American Eel|White Perch|Striped Bass|American Shad|Hickory Shad|Common Carp|Grass Carp|Spotted Sucker|Golden Shiner|Creek Chubsucker|Blueback Herring|Gizzard Shad|Threadfin Shad|Flier|Spotted Sunfish|Redfin Pickerel|Eastern Mosquitofish|Hybrid Striped Bass|White Bass'.split('|'));
const offshore=new Set('Black Sea Bass|Vermilion Snapper|Red Snapper|Gag Grouper|Scamp|Mahi-mahi|Gray Triggerfish|Greater Amberjack|Blackfin Tuna|Wahoo|Yellowfin Tuna|Sailfish|Blue Marlin|King Mackerel|Cobia'.split('|'));
const protectedNames=new Set(['Atlantic Sturgeon','Shortnose Sturgeon','Great White Shark','Sandbar Shark']);
const catalog=()=>{
 if(typeof species!=='undefined'&&Array.isArray(species))return species;
 return Array.isArray(window.FishDexSpecies)?window.FishDexSpecies:[];
};
function create(tag,txt,style){const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;if(style)e.style.cssText=style;return e}
function link(url,label){const a=create('a',label,'color:#7cebdc;display:inline-block;margin:4px 12px 4px 0');a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a}
function show(){
 const panel=document.getElementById('fd-regulations');if(!panel)return;
 const name=document.getElementById('fg-title')?.textContent?.trim()||'';
 const fish=catalog().find(f=>f.name===name);
 const kind=freshwater.has(name)?'freshwater':offshore.has(name)?'offshore':'saltwater';
 const body=document.getElementById('fd-regulations-detail');if(!body)return;
 body.replaceChildren();
 const heading=create('strong',name+(fish?' · Species #'+String(fish.id).padStart(3,'0'):''));
 body.append(heading);
 const status=create('p','','margin:10px 0;line-height:1.6;color:#e5f7fb');
 const entry=(window.FISHDEX_REGULATIONS_2026||[]).find(x=>x.name===name);
 if(entry && entry.status==='published-2026-reference'){
  status.textContent='2026–2027 published reference: Length: '+entry.size+'; daily limit: '+entry.bag+'. '+entry.notes;
  body.append(status,link(entry.source,'2026–2027 regulation table ↗'));
 }else{
  status.textContent='Individual 2026–2027 limit review incomplete. Size and bag limit: NOT CONFIRMED. '+(entry?.notes||'');
  body.append(status);
  if(entry?.source)body.append(link(entry.source,'Review applicable regulations ↗'));
 }
 if(protectedNames.has(name))body.append(create('p','⚠ Protected or specially regulated species: check all applicable retention prohibitions before fishing or handling.','font-weight:700;color:#ffd58d;line-height:1.5'));
 if(kind==='offshore')body.append(create('p','Offshore species may be governed by federal rules, regional management, closures, permits, and aggregate bag limits.','color:#b7d5de;line-height:1.5'));
 if(kind==='freshwater')body.append(create('p','Freshwater rules can differ by waterbody, river system and special management area.','color:#b7d5de;line-height:1.5'));
 body.append(link(kind==='freshwater'?LINKS.fresh:LINKS.salt,'Official SCDNR '+(kind==='freshwater'?'freshwater':'saltwater')+' limits ↗'));
 if(kind==='offshore')body.append(link(LINKS.federal,'NOAA federal fishing rules ↗'));
 body.append(create('small','Always verify the current rule for the exact waterbody, date, fishing method and jurisdiction before keeping a fish.','display:block;color:#a6c7d0;margin-top:10px;line-height:1.5'));
}
function init(){
 const dialog=document.getElementById('fish-guide-dialog');if(!dialog)return;
 let panel=document.getElementById('fd-regulations');
 if(!panel){panel=create('section');panel.id='fd-regulations';panel.style.cssText='margin:18px 0;padding:17px;border:1px solid #368b9d;border-radius:15px;background:#092b3b';
 const title=create('h3','⚖️ Lowcountry fishing regulations','margin:0 0 8px;color:#7cebdc');
 const body=create('div');body.id='fd-regulations-detail';
 panel.append(title,body);
 const shell=dialog.querySelector('.fg-shell')||dialog;
 const actions=shell.querySelector('.fg-actions');if(actions)actions.before(panel);else shell.append(panel);
 }
 const title=document.getElementById('fg-title');
 if(title)new MutationObserver(show).observe(title,{childList:true,characterData:true,subtree:true});
 show();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();