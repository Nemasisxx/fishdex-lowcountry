(()=>{'use strict';
function el(tag,text,css){const n=document.createElement(tag);n.textContent=text;n.style.cssText=css||'';return n}
function show(){
 const box=document.getElementById('fd-regulations-detail');if(!box)return;
 const name=document.getElementById('fg-title')?.textContent?.trim();
 const fish=(window.FISHDEX_REGULATIONS_2026||[]).find(x=>x.name===name);
 box.replaceChildren();
 const known=fish?.status==='published-2026-reference';
 const fields=[['📏','Fish size',known?fish.size:'Not confirmed'],['🐟','You can keep',known?fish.bag:'Not confirmed']];
 for(const [emoji,label,value] of fields){
  const card=el('div','','background:#123d4e;border:1px solid #2d7181;border-radius:12px;padding:14px;flex:1;min-width:145px');
  card.append(el('div',emoji+' '+label,'color:#a8e7e3;font-size:14px;font-weight:700;margin-bottom:8px'),el('div',value,'font-size:19px;font-weight:800;line-height:1.4;color:white'));
  box.append(card);
 }
 if(!known)box.append(el('div','⚠ Ask an adult to check the rules before keeping this fish.','width:100%;font-size:13px;color:#ffd58d'));
}
function init(){
 const dialog=document.getElementById('fish-guide-dialog');if(!dialog)return;
 let panel=document.getElementById('fd-regulations');
 if(!panel){panel=el('section','','margin:18px 0;padding:16px;border:1px solid #368b9d;border-radius:15px;background:#092b3b');panel.id='fd-regulations';const shell=dialog.querySelector('.fg-shell')||dialog;const actions=shell.querySelector('.fg-actions');if(actions)actions.before(panel);else shell.append(panel)}
 panel.replaceChildren();
 panel.append(el('h3','Can I keep this fish?','margin:0 0 12px;color:#7cebdc;font-size:20px'));
 const body=el('div','','display:flex;flex-wrap:wrap;gap:10px');body.id='fd-regulations-detail';panel.append(body);
 const title=document.getElementById('fg-title');
 if(title)new MutationObserver(show).observe(title,{childList:true,characterData:true,subtree:true});
 show();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();