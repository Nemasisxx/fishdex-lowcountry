from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np, cv2, json, math
files=sorted(Path("images").glob("*.webp"))
results=[]; thumbs=[]
for p in files:
 im=Image.open(p).convert("RGBA"); a=np.asarray(im)[:,:,3]; mask=(a>20).astype("uint8")
 n,labels,stats,_=cv2.connectedComponentsWithStats(mask,8)
 parts=sorted([{"x":int(s[0]),"y":int(s[1]),"w":int(s[2]),"h":int(s[3]),"area":int(s[4])} for s in stats[1:]],key=lambda z:-z["area"])
 ys,xs=np.where(mask>0)
 if not len(xs): continue
 w,h=im.size; bounds=[int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max())]
 edge=min(bounds[0],bounds[1],w-1-bounds[2],h-1-bounds[3])
 main=parts[0]["area"] if parts else 0
 suspicious=[c for c in parts[1:] if c["area"]>max(15,main*.0015)]
 flags=[]
 if edge<max(12,int(min(w,h)*.06)):flags.append("low-margin / possible crop")
 if suspicious:flags.append("detached visible fragments")
 if len(parts)>1 and sum(c["area"] for c in parts[1:])>main*.03:flags.append("significant detached artwork")
 results.append({"file":p.name,"size":[w,h],"bounds":bounds,"minimum_margin_px":edge,"flags":flags,"detached_components":suspicious[:15]})
 tile=Image.new("RGB",(320,238),"#142735"); canvas=Image.new("RGBA",(296,193),"#142735")
 im.thumbnail((292,187),Image.Resampling.LANCZOS);canvas.alpha_composite(im,((296-im.width)//2,(193-im.height)//2))
 tile.paste(canvas.convert("RGB"),(12,10));d=ImageDraw.Draw(tile)
 d.text((12,207),p.stem.replace("_"," ")[:35],fill="#ffffff")
 if flags:d.text((12,222),"; ".join(flags)[:48],fill="#ffb86c")
 thumbs.append(tile)
cols=5;rows=math.ceil(len(thumbs)/cols);sheet=Image.new("RGB",(cols*320,rows*238),"#091a24")
for i,t in enumerate(thumbs):sheet.paste(t,((i%cols)*320,(i//cols)*238))
sheet.save("fish-visual-review.jpg",quality=90)
report={"checked":len(results),"flagged":sum(bool(r["flags"]) for r in results),"results":results}
Path("fish-visual-review.json").write_text(json.dumps(report,indent=2))
print("Audited",len(results),"flagged",report["flagged"],"review contact sheet: fish-visual-review.jpg")
