/* Open species-specific fishing advice for locked FishDex entries. */
(()=>{'use strict';const $=id=>document.getElementById(id);
function close(){const dlg=$('fish-guide-dialog');if(dlg?.open)dlg.close()}
function open(id){
 const guide=window.FishDexGuide?.find(x=>x.id===Number(id));
 const fish=typeof species!=='undefined'?species.find(x=>x.id===Number(id)):null;
 if(!guide||!fish)return;
 $('fg-number').textContent='SPECIES #'+String(id).padStart(3,'0');
 $('fg-title').textContent=fish.name;$('fg-subtitle').textContent='Locked species · Catching guide';
 for(const [id,key] of [['fg-where','where'],['fg-bait','bait'],['fg-method','method'],['fg-when','when'],['fg-tip','tip']])$(id).textContent=guide[key];
 const art=$('fg-art');art.replaceChildren();const img=new Image();img.alt=fish.name;
 if(typeof FishDexArt!=='undefined')FishDexArt.attach(fish,img);art.append(img);
 const dlg=$('fish-guide-dialog');if(!dlg.open)dlg.showModal();
}
function init(){
 $('fg-close').onclick=close;$('fg-done').onclick=close;
 $('fg-spot-map').onclick=()=>{close();document.querySelector('.site-nav [data-tab="hotspots"]')?.click()};
 const dlg=$('fish-guide-dialog');dlg.addEventListener('click',e=>{if(e.target===dlg)close()});
 window.FishDexOpenGuide=open;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
