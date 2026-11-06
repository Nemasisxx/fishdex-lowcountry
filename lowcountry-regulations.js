/* FishDex Lowcountry fishing regulations panel.
   Only official links are shown until individual species, waterbody and
   effective-date rules have been verified. Never infer legality from this panel. */
(()=>{'use strict';
const SCDNR_SALT='https://www.dnr.sc.gov/regs/saltwaterfish.html';
const SCDNR_FRESH='https://www.dnr.sc.gov/regs/freshwaterfish.html';
function addPanel(){
 const dialog=document.getElementById('fish-guide-dialog');
 if(!dialog||document.getElementById('fd-regulations'))return;
 const shell=dialog.querySelector('.fg-shell')||dialog;
 const panel=document.createElement('section');
 panel.id='fd-regulations';
 panel.style.cssText='margin:18px 0;padding:17px;border:1px solid #368b9d;border-radius:15px;background:#092b3b';
 panel.innerHTML='<h3 style="margin:0 0 8px;color:#7cebdc">⚖️ Lowcountry fishing regulations</h3>'+
 '<p id="fd-regulations-species" style="margin:0 0 8px;font-weight:700"></p>'+
 '<p style="margin:0 0 12px;line-height:1.5;color:#c0dce5">Legal length, daily bag limit, seasons and exceptions vary by species and waterbody. Species-specific limits are pending verification; do not assume a fish is legal to keep.</p>'+
 '<div style="display:flex;flex-wrap:wrap;gap:10px">'+
 '<a href="'+SCDNR_SALT+'" target="_blank" rel="noopener noreferrer" style="color:#7cebdc">SCDNR saltwater regulations ↗</a>'+
 '<a href="'+SCDNR_FRESH+'" target="_blank" rel="noopener noreferrer" style="color:#7cebdc">SCDNR freshwater regulations ↗</a></div>'+
 '<small style="display:block;margin-top:12px;color:#a6c7d0">Official regulations take precedence. Check current rules for your exact fishing location before harvesting.</small>';
 const actions=shell.querySelector('.fg-actions');
 if(actions)actions.before(panel);else shell.append(panel);
 const title=document.getElementById('fg-title');
 const observer=new MutationObserver(()=>{document.getElementById('fd-regulations-species').textContent=title?.textContent||'Species regulations'});
 if(title){observer.observe(title,{childList:true,characterData:true,subtree:true});}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addPanel);else addPanel();
})();