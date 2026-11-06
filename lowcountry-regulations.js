/* FishDex Lowcountry regulation references. Sources are SCDNR 2025 species
 snapshots, NOT a live legal determination. Recheck before each harvest. */
(()=>{'use strict';
const GENERAL='https://www.dnr.sc.gov/regs/fishing.html';
const data={
'Red Drum':{size:'15–23 in slot (total length)',bag:'2 per person/day; 6 per boat/day',notes:'State waters only; federal-water possession prohibited.',source:'https://www.dnr.sc.gov/fishing/pdf/RedDrumSpeciesSnapshot.pdf'},
'Spotted Seatrout':{size:'14 in minimum (total length)',bag:'10 per person/day',notes:'Check for any current emergency or seasonal closures.',source:'https://www.dnr.sc.gov/fishing/pdf/SpottedSeatroutSpeciesSnapshot.pdf'},
'Southern Flounder':{size:'16 in minimum (total length)',bag:'5 per person/day; 10 per boat/day',notes:'Flounder rules may cover multiple species; verify season and location.',source:'https://www.dnr.sc.gov/fishing/pdf/FlounderSnapshot.pdf'}
};
function show(){
 const name=document.getElementById('fg-title')?.textContent?.trim()||'';
 const panel=document.getElementById('fd-regulations');if(!panel)return;
 const rule=data[name];
 const species=document.getElementById('fd-regulations-species');if(species)species.textContent=name;
 const detail=document.getElementById('fd-regulations-detail');
 if(!detail)return;
 detail.replaceChildren();
 const p=document.createElement('p');
 p.style.cssText='line-height:1.6;margin:8px 0 12px;color:#e5f7fb';
 if(rule){
   const strong=document.createElement('strong');strong.textContent='SCDNR published reference (2025) — not live verification';
   detail.append(strong);
   p.textContent='Size: '+rule.size+' | Daily limit: '+rule.bag+'. '+rule.notes;
   detail.append(p);
   const a=document.createElement('a');a.href=rule.source;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Read SCDNR species snapshot ↗';a.style.color='#7cebdc';detail.append(a);
 }else{
   p.textContent='Species-specific limits have not yet been verified for this fish. Check current SCDNR rules before keeping any catch.';
   detail.append(p);
 }
}
function init(){
 const dialog=document.getElementById('fish-guide-dialog');
 if(!dialog)return;
 let panel=document.getElementById('fd-regulations');
 if(!panel){
 panel=document.createElement('section');panel.id='fd-regulations';
 panel.style.cssText='margin:18px 0;padding:17px;border:1px solid #368b9d;border-radius:15px;background:#092b3b';
 panel.innerHTML='<h3 style="margin:0 0 8px;color:#7cebdc">⚖️ Lowcountry fishing regulations</h3><p id="fd-regulations-species" style="font-weight:700"></p><div id="fd-regulations-detail"></div><p style="font-size:12px;line-height:1.5;color:#abcbd6">Illustrative published rules only. Location, season, waterbody, federal waters and emergency rules can change harvest legality. Never treat this panel as permission to keep a fish.</p><a href="'+GENERAL+'" target="_blank" rel="noopener noreferrer" style="color:#7cebdc">Check current official SCDNR regulations ↗</a>';
 const shell=dialog.querySelector('.fg-shell')||dialog;
 const actions=shell.querySelector('.fg-actions');if(actions)actions.before(panel);else shell.append(panel);
 }
 const title=document.getElementById('fg-title');
 if(title)new MutationObserver(show).observe(title,{childList:true,characterData:true,subtree:true});
 dialog.addEventListener('close',()=>{});
 show();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();