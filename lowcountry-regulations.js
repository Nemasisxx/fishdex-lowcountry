(()=>{'use strict';
function el(tag,text,css){const n=document.createElement(tag);n.textContent=text;n.style.cssText=css||'';return n}
let selectedWater='unknown',manualWater=false;
const hubWaters={
 'Georgetown / Winyah Bay':'state-coastal',
 'Pawleys Island / Murrells Inlet':'state-coastal',
 'Charleston Harbor':'state-coastal',
 'Wando / Cooper Rivers':'coastal-river',
 'Edisto / ACE Basin':'state-coastal',
 'Beaufort / Port Royal':'state-coastal',
 'Hilton Head / Daufuskie':'state-coastal',
 'Lake Marion / Lake Moultrie':'santee',
 'Other Lowcountry waters':'unknown'
};
function applyHomeWaters(home){
 if(manualWater)return;
 selectedWater=hubWaters[home]||'unknown';
 const select=document.getElementById('fd-water-select');
 if(select)select.value=selectedWater;
 show();
}
function inches(value){
 if(typeof value!=='string')return value;
 return value
  .replace(/(\d+(?:\.\d+)?(?:\s*[–-]\s*\d+(?:\.\d+)?)?)\s*(?:inches|inch|in\.?)\b/gi,(_,n)=>n.replace(/\s+/g,'')+'"');
}
function plainSize(value){
 if(typeof value!=='string')return value;
 let result=inches(value);
 result=result.replace(/(\d+(?:\.\d+)?[–-]\d+(?:\.\d+)?)"\s*TL\s*slot\b/gi,'Must be between $1 long (nose to tail tip)');
 result=result.replace(/(\d+(?:\.\d+)?)"\s*TL\s*minimum\b/gi,'Must be at least $1 long (nose to tail tip)');
 result=result.replace(/(\d+(?:\.\d+)?)"\s*TL\s*maximum\b/gi,'Must be no longer than $1 (nose to tail tip)');
 result=result.replace(/\bTL\b/g,'total length (nose to tail tip)').replace(/\bFL\b/g,'fork length (nose to middle of tail fork)');
 result=result.replace(/\bminimum\b/gi,'at least').replace(/\bmaximum\b/gi,'at most');
 return result;
}
function show(){
 const box=document.getElementById('fd-regulations-detail');if(!box)return;
 const name=document.getElementById('fg-title')?.textContent?.trim();
 const fish=(window.FISHDEX_REGULATIONS_2026||[]).find(x=>x.name===name);
 box.replaceChildren();
 const extra=window.FISHDEX_REGULATIONS_EXTRA?.[name];
 const known=!!fish?.size&&!!fish?.bag||!!extra;
 const protectedFish=new Set(['Atlantic Sturgeon','Shortnose Sturgeon','Great White Shark','Sandbar Shark','Grass Carp','Hardhead Catfish','Gafftopsail Catfish']);
 if(protectedFish.has(name)){
  const notice=el('div','','width:100%;padding:18px;border-radius:12px;background:#123d4e;border:1px solid #2d7181;text-align:center');
  notice.append(el('div','🛡️ Protected Species','font-size:22px;font-weight:800;color:#a8e7e3;margin-bottom:8px'),el('div','Catch & Release','font-size:25px;font-weight:900;color:#ffffff'));
  box.append(notice);
  const link=el('a','View regulation source ↗','color:#a8e7e3;text-decoration:underline');link.href=fish?.source||'https://www.eregulations.com/southcarolina/fishing';link.target='_blank';link.rel='noopener noreferrer';box.append(link);
  return;
 }
 const locationNote=selectedWater==='unknown'?'⚠ Select fishing waters to check location-specific rules.':selectedWater==='federal'?'⚠ Federal limits and closures may differ. Verify before keeping fish.':selectedWater==='other-fresh'||selectedWater==='santee'||selectedWater==='coastal-river'?'⚠ River and lake rules may differ. Verify before keeping fish.':'⚠ Local restrictions may differ. Verify before keeping fish.';
 box.append(el('div',locationNote,'width:100%;font-size:13px;color:#ffd58d'));
 const exactRules={
  'santee-lakes':{
   'Largemouth Bass':['At least 14" long (nose to tail tip)','5 per person per day, combined black bass'],
   'Blue Catfish':['Only 2 longer than 32" per person per day','25 per person per day'],
   'Striped Bass':['Varies between Lake Marion, Lake Moultrie and the Santee River','Exact lake or river needed before showing a daily limit'],
   'Hybrid Striped Bass':['Varies between Lake Marion, Lake Moultrie and the Santee River','Exact lake or river needed before showing a daily limit']
  },
  'pee-dee-upper':{'Blue Catfish':['Only 2 longer than 32" per person per day','25 per person per day']},
  'santee-upper':{'Blue Catfish':['Only 2 longer than 32" per person per day','25 per person per day']},
  'congaree-wateree':{'Blue Catfish':['Only 2 longer than 32" per person per day','150 per person per day']},
  'coastal-listed':{
   'Striped Bass':['At least 26" long (nose to tail tip)','3 per person per day October 1–June 15; harvest closed June 16–September 30'],
   'Hybrid Striped Bass':['At least 26" long (nose to tail tip)','3 per person per day October 1–June 15; harvest closed June 16–September 30']
  },
  'savannah-lower':{
   'Striped Bass':['At least 27" long (nose to tail tip)','2 per person per day, year-round'],
   'Hybrid Striped Bass':['At least 27" long (nose to tail tip)','2 per person per day'],
   'White Bass':['At least 27" long (nose to tail tip)','2 per person per day']
  },
  'santee-system':{
   'Striped Bass':['October 1–June 15: 23–25" or one longer than 26"','3 per person per day; closed June 16–September 30'],
   'Hybrid Striped Bass':['Check Santee system special size rules','3 per person per day; closed June 16–September 30']
  }
 };
 const override=exactRules[selectedWater]?.[name];
 const needsExact=(selectedWater==='santee'||selectedWater==='coastal-river')&&['Striped Bass','Hybrid Striped Bass','White Bass','Blue Catfish'].includes(name);
 const fields=[['📏','Fish size',needsExact?'Choose an exact waterbody':override?.[0]||(known?(fish?.size||extra?.size):'Not confirmed')],['🐟','You can keep',needsExact?'Choose an exact waterbody':override?.[1]||(known?(fish?.bag||extra?.bag):'Not confirmed')]];

 for(const [emoji,label,value] of fields){
  const card=el('div','','background:#123d4e;border:1px solid #2d7181;border-radius:12px;padding:14px;flex:1;min-width:145px');
  card.append(el('div',emoji+' '+label,'color:#a8e7e3;font-size:14px;font-weight:700;margin-bottom:8px'),el('div',label==='Fish size'?plainSize(value):inches(value),'font-size:19px;font-weight:800;line-height:1.4;color:white'));
  box.append(card);
 }
 const seasonal={
  'Cobia':{months:[5],label:'Closed May 1–31 south of Jeremy Inlet',type:'area'},
  'Gag Grouper':{months:[8,9,10,11,12,1,2,3,4],label:'Federal waters: closed Aug 2–Apr 30',type:'federal',dayStart:2},
  'Scamp':{months:[1,2,3,4],label:'Federal waters: closed Jan 1–Apr 30',type:'federal'},
  'Greater Amberjack':{months:[4],label:'Federal waters: closed Apr 1–30',type:'federal'},
  'Striped Bass':{months:[6,7,8,9],label:'Many Lowcountry rivers: closed Jun 16–Sep 30',type:'area',dayStart:16}
 };
 const season=seasonal[name];
 const today=new Date();
 const month=today.getMonth()+1,day=today.getDate();
 let seasonText='Check Season',seasonColor='#ffd58d';
 if(season){
  let closed=season.months.includes(month);
  if(name==='Gag Grouper'&&month===8&&day<2)closed=false;
  if(name==='Striped Bass'&&month===6&&day<16)closed=false;
  const applies=season.type==='federal'?selectedWater==='federal':name==='Cobia'?selectedWater==='south-jeremy':name==='Striped Bass'?selectedWater==='coastal-river':false;
  if(selectedWater==='unknown'||!applies){
   seasonText=(selectedWater==='unknown'?'⚠ Choose fishing waters':'⚠ Check local rules')+' — '+season.label;
  }else{
   seasonText=(closed?'🔴 Harvest closed':'🟢 Outside listed closure')+' — '+season.label;
  }
  seasonColor=applies&&closed?'#ffc4a9':'#ffd58d';
 }else if(name==='Red Drum'||name==='Spotted Seatrout'||name==='Black Drum'||name==='Sheepshead'){
  seasonText='🟢 Open year-round (harvest season)';seasonColor='#b7f5d0';
 }
 const seasonDetails={
  'Cobia':['Southern Cobia Management Zone (south of Jeremy Inlet): harvest closed May 1–31 in state waters.','Other state and federal waters may have different rules. Check current SCDNR limits before harvesting.'],
  'Gag Grouper':['Federal waters: listed harvest closure Aug 2, 2026–Apr 30, 2027.','State waters and later seasons may differ. Federal seasons can change by notice.'],
  'Scamp':['Federal waters: listed seasonal closure Jan 1–Apr 30.','Other snapper-grouper restrictions and emergency closures may apply.'],
  'Greater Amberjack':['Federal waters: listed closure Apr 1–30.','Additional seasonal or emergency closures may apply.'],
  'Striped Bass':['Many Lowcountry coastal rivers: listed harvest closure Jun 16–Sep 30.','Exact dates, exceptions and legal harvest sizes depend on the specific river or lake.']
 };
 function openSeasonDetails(){
  document.getElementById('fd-season-popup')?.remove();
  const overlay=el('dialog','','border:0;padding:0;background:transparent;color:white;max-width:calc(100vw - 28px);max-height:90vh;overflow:visible');
  overlay.id='fd-season-popup';overlay.setAttribute('aria-label','Fishing season details');
  const modal=el('section','','width:min(100%,460px);max-height:85vh;overflow:auto;background:#092b3b;border:1px solid #4aa4b6;border-radius:16px;padding:22px;color:white;box-shadow:0 16px 45px #0008');
  modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Fishing season details');
  const close=el('button','✕','','');close.type='button';close.setAttribute('aria-label','Close season details');close.style.cssText='float:right;background:#123d4e;border:1px solid #4aa4b6;border-radius:8px;padding:7px 11px;color:white;cursor:pointer';
  const dismiss=()=>overlay.close();
  close.addEventListener('click',dismiss);
  overlay.addEventListener('click',e=>{if(e.target===overlay)dismiss()});
  overlay.addEventListener('close',()=>overlay.remove(),{once:true});
  modal.append(close,el('h3','📅 '+name+' — Fishing season','color:#7cebdc;font-size:21px;margin:0 0 16px'));
  modal.append(el('p','Selected waters: '+(document.getElementById('fd-water-select')?.selectedOptions[0]?.textContent||'Not selected'),'color:#a8e7e3;font-size:14px'));
  modal.append(el('p',seasonText,'font-weight:800;font-size:17px;line-height:1.5'));
  const specific=seasonDetails[name];
  const protectedNames=['Atlantic Sturgeon','Shortnose Sturgeon','Great White Shark','Sandbar Shark'];
  const noSeasonConfirmed=['Red Drum','Spotted Seatrout','Black Drum','Sheepshead','Southern Flounder','Summer Flounder','Weakfish','Atlantic Croaker','Spot','Southern Kingfish','Northern Kingfish','Gulf Kingfish','Bluefish','Spanish Mackerel','King Mackerel','Tarpon','Florida Pompano','Tripletail'];
  const federalGroup=['Black Sea Bass','Gray Snapper','Vermilion Snapper','Red Snapper','Gag Grouper','Scamp','Gray Triggerfish','Greater Amberjack','White Grunt','Atlantic Spadefish'];
  const freshwaterGroup=['Largemouth Bass','Bluegill','Redear Sunfish','Redbreast Sunfish','Warmouth','Green Sunfish','Pumpkinseed','Black Crappie','White Crappie','Channel Catfish','Blue Catfish','Flathead Catfish','Brown Bullhead','Yellow Bullhead','Bowfin','Longnose Gar','Florida Gar','Chain Pickerel','American Eel','White Perch','Striped Bass','American Shad','Hickory Shad','Common Carp','Grass Carp','Spotted Sucker','Golden Shiner','Creek Chubsucker','Blueback Herring','Gizzard Shad','Threadfin Shad','Flier','Spotted Sunfish','Redfin Pickerel','Eastern Mosquitofish','Hybrid Striped Bass','White Bass'];
  let details=specific?[...specific]:[];
  if(protectedNames.includes(name)||name==='Grass Carp')details=['Harvest is not permitted in the applicable protected waters. Release immediately.','This is not a seasonal harvest opportunity.'];
  else if(fish?.status==='state-table-no-specific-limit-listed')details=fish?.water==='freshwater'?['South Carolina’s freshwater nongame regulations do not list an individual size limit or daily catch limit for this species.','Gear, bait collection, local waters and other rules still apply. No specific statewide harvest season was found in the reviewed tables.']:['South Carolina’s reviewed coastal state-water finfish table does not list a species-specific size limit, daily catch limit, or closed season for this fish.','This is not a guarantee of unrestricted harvest. General rules, fishing methods, protected areas, and federal-water restrictions may apply.'];
  else if(name==='Red Drum')details=['No general state-water harvest season closure listed.','Federal waters: possession prohibited. Gig harvest prohibited Dec 1–Feb 28.'];
  else if(name==='Spotted Seatrout')details=['No general state-water harvest season closure listed.','Gig harvest prohibited Dec 1–Feb 28.'];
  else if(name==='Red Snapper')details=['Federal harvest is restricted to specially announced openings or permits; do not assume an open season.','State-water and federal rules differ. Confirm the current announcement before keeping a fish.'];
  else if(name==='American Shad'||name==='Hickory Shad'||name==='Blueback Herring')details=['Seasonal river and gear restrictions apply to this species.','Check the specific river and current SCDNR shad/herring season before harvest.'];
  else if(name==='Striped Bass'||name==='Hybrid Striped Bass'||name==='White Bass')details=['Harvest dates and closures depend on the exact river or reservoir.','Some coastal rivers close to striped bass harvest during summer; check your specific waters.'];
  else if(name==='Cobia')details=['State waters south of Jeremy Inlet: harvest closed May 1–31.','Elsewhere, different cobia seasons and vessel limits may apply.'];
  else if(name==='Yellowfin Tuna'||name==='Sailfish'||name==='Blue Marlin')details=['Federal highly migratory species rules apply.','Check NOAA permits, reporting rules and current seasonal notices before landing this species.'];
  else if(federalGroup.includes(name))details=['Snapper-grouper seasons and closures can differ between state and federal waters.','Check the current species-specific opening and any federal emergency closure before harvest.'];
  else if(freshwaterGroup.includes(name))details=['No specific statewide seasonal closure is recorded for this fish in the FishDex reference.','Some rivers and lakes have special dates, methods or harvest rules; the selected broad area does not identify an exact waterbody.'];
  else if(noSeasonConfirmed.includes(name))details=['No general species-specific state-water harvest closure is listed in the FishDex reference.','Gear restrictions, federal-water rules or temporary closures may still apply.'];
  else details=['The FishDex reference does not list a species-specific seasonal closure for this fish.','This does not establish that harvest is open all year. Check applicable state or federal rules for your fishing waters.'];
  if(fish?.notes&&!fish.notes.startsWith('Species-specific current recreational retention limits not established'))details.push('Other listed rule: '+fish.notes);
  if(name==='Largemouth Bass'&&selectedWater==='santee-lakes')details.unshift('Lake Marion and Lake Moultrie: minimum length is 14" and the combined black bass daily limit is 5.');
  if(name==='Blue Catfish')details=['Lake Marion, Lake Moultrie, upper Santee River and upper Pee Dee River (NC border to Highway 301): 25 per person per day. Other state waters: 150 per person per day.','Only two fish longer than 32" may be kept in designated waters, including Marion, Moultrie, upper Santee, upper Pee Dee, Congaree and Wateree rivers.'];
  if(override)details.unshift('Selected waterbody: '+override[0]+'. Daily limit: '+override[1]+'.');
  if(name==='Red Snapper'&&selectedWater==='federal')details=['The published 2026–27 table prohibits possession in federal waters.','An official NOAA announcement may authorize a limited opening; verify before harvesting.'];
  for(const detail of details)modal.append(el('p',detail,'line-height:1.6;color:#e0eef3;margin:12px 0'));
  modal.append(el('p','Season dates may change. Check current SCDNR or federal regulations before harvesting.','font-size:13px;color:#ffd58d;margin-top:16px'));
  const sourceLink=el('a','Open regulation source ↗','display:inline-block;margin-top:12px;color:#7cebdc;text-decoration:underline;font-weight:700');
  sourceLink.href=fish?.source||'https://www.eregulations.com/southcarolina/fishing';sourceLink.target='_blank';sourceLink.rel='noopener noreferrer';modal.append(sourceLink);
  if(selectedWater==='federal'){
   const federalLink=el('a','Check current NOAA federal fishery notices ↗','display:block;margin-top:10px;color:#7cebdc;text-decoration:underline');
   federalLink.href='https://www.fisheries.noaa.gov/southeast/rules-and-regulations';federalLink.target='_blank';federalLink.rel='noopener noreferrer';modal.append(federalLink);
   modal.append(el('p','FishDex does not receive live federal closure updates. Confirm the current federal opening before keeping fish.','font-size:13px;color:#ffd58d'));
  }
  modal.append(el('p',fish?.lastReviewed?'Reference reviewed: '+fish.lastReviewed:'Reference review: still pending for this species','font-size:12px;color:#b4d2dd'));
  overlay.append(modal);document.body.append(overlay);overlay.showModal();close.focus();
 }
 if(name==='Striped Bass'||name==='Hybrid Striped Bass'){
  const coastal=selectedWater==='coastal-listed'||selectedWater==='santee-system';
  const santee=selectedWater==='santee';
  if(coastal){
   const closed=(month>6&&month<10)||(month===6&&day>=16);
   seasonText=closed?'🔴 Harvest closed June 16–September 30':'🟢 Harvest season October 1–June 15';
   seasonColor=closed?'#ffc4a9':'#b7f5d0';
  }else if(selectedWater==='savannah-lower'){seasonText='🟢 No seasonal harvest closure listed for lower Savannah River';seasonColor='#b7f5d0';}
  else seasonText='⚠ Striped bass rules vary by river and reservoir; choose an exact waterbody';
 }
 if(name==='Red Snapper'&&selectedWater==='federal'){
  seasonText='🔴 Federal possession prohibited under published rules; check NOAA for announced openings';seasonColor='#ffc4a9';
 }
 if(name==='Largemouth Bass'&&selectedWater==='santee'){
  seasonText='🟢 No general freshwater game-fish closed season; special lake-area closures may apply';seasonColor='#b7f5d0';
 }
 const seasonCard=el('div','','width:100%;background:#123d4e;border:1px solid #2d7181;border-radius:12px;padding:14px');
 seasonCard.append(el('div','📅 Fishing season','color:#a8e7e3;font-size:14px;font-weight:700;margin-bottom:8px'),el('div',seasonText,'font-size:17px;font-weight:800;line-height:1.4;color:'+seasonColor));
 seasonCard.setAttribute('role','button');seasonCard.tabIndex=0;seasonCard.setAttribute('aria-label','Show exact fishing season details for '+name);seasonCard.style.cursor='pointer';
 seasonCard.append(el('div','Tap or click for season details ›','font-size:12px;color:#a8e7e3;margin-top:8px'));
 seasonCard.addEventListener('click',openSeasonDetails);
 seasonCard.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openSeasonDetails()}});
 box.append(seasonCard);
 const sourceLink=el('a','View official regulation table ↗','color:#7cebdc;font-size:13px;text-decoration:underline');sourceLink.href=fish?.source||'https://www.eregulations.com/southcarolina/fishing';sourceLink.target='_blank';sourceLink.rel='noopener noreferrer';box.append(sourceLink);
 box.append(el('div',fish?.lastReviewed?'Reference checked: '+fish.lastReviewed:'Reference not individually audited yet','font-size:12px;color:#b4d2dd'));
 if(!known)box.append(el('div','⚠ Limits not confirmed. Check current regulations before keeping this fish.','width:100%;font-size:13px;color:#ffd58d'));
}
function init(){
 const dialog=document.getElementById('fish-guide-dialog');if(!dialog)return;
 let panel=document.getElementById('fd-regulations');
 if(!panel){panel=el('section','','margin:18px 0;padding:16px;border:1px solid #368b9d;border-radius:15px;background:#092b3b');panel.id='fd-regulations';const shell=dialog.querySelector('.fg-shell')||dialog;const actions=shell.querySelector('.fg-actions');if(actions)actions.before(panel);else shell.append(panel)}
 panel.replaceChildren();
 panel.append(el('h3','Can I keep this fish?','margin:0 0 12px;color:#7cebdc;font-size:20px'));
 const waterWrap=el('div','','margin-bottom:12px');
 waterWrap.append(el('label','📍 Where are you fishing?','display:block;color:#a8e7e3;font-size:14px;font-weight:700;margin-bottom:7px'));
 const waterSelect=el('select','','width:100%;padding:10px;border-radius:9px;background:#123d4e;color:#fff;border:1px solid #368b9d;font-size:15px');
 const options=[['unknown','Choose fishing waters'],['state-coastal','SC coastal state waters'],['south-jeremy','SC coastal waters south of Jeremy Inlet'],['federal','Federal offshore waters'],['coastal-river','Lowcountry coastal river'],['santee','Santee / Marion / Moultrie'],['other-fresh','Other freshwater lake or river'],['santee-lakes','Lake Marion or Lake Moultrie'],['santee-system','Santee River system (not the lakes)'],['santee-upper','Upper Santee River'],['coastal-listed','Listed Lowcountry coastal rivers'],['savannah-lower','Lower Savannah River'],['pee-dee-upper','Pee Dee River: NC line to Highway 301'],['congaree-wateree','Congaree or Wateree River']];
 for(const [value,label] of options){const opt=document.createElement('option');opt.value=value;opt.textContent=label;waterSelect.append(opt)}
 waterSelect.id='fd-water-select';waterSelect.value=selectedWater;
 waterSelect.addEventListener('change',()=>{manualWater=true;selectedWater=waterSelect.value;show()});
 waterWrap.append(waterSelect);panel.append(waterWrap);
 const body=el('div','','display:flex;flex-wrap:wrap;gap:10px');body.id='fd-regulations-detail';panel.append(body);
 const title=document.getElementById('fg-title');
 if(title)new MutationObserver(show).observe(title,{childList:true,characterData:true,subtree:true});
 window.addEventListener('fishdex:home-waters-changed',event=>applyHomeWaters(event.detail?.homeWaters));
 const client=window.fishdexSupabase;
 if(client)client.auth.getUser().then(({data})=>applyHomeWaters(data?.user?.user_metadata?.fishdex_home_waters)).catch(()=>{});
 show();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();