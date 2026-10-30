from pathlib import Path
from PIL import Image
import json
files=sorted(Path("images").glob("*.webp"))
results=[]
for path in files:
    with Image.open(path) as im:
        rgba=im.convert("RGBA")
        w,h=rgba.size
        alpha=rgba.getchannel("A")
        bounds=alpha.point(lambda v:255 if v>20 else 0).getbbox()
        extrema=alpha.getextrema()
        if bounds:
            l,t,r,b=bounds
            margin=[l,t,w-r,h-b]
            edge=sum(1 for m in margin if m<2)
            fill=(r-l)*(b-t)/(w*h)
        else:
            margin=[0,0,0,0];edge=4;fill=0
        transparent=sum(1 for v in alpha.getdata() if v<20)/(w*h)
        issues=[]
        if extrema[0]==255:issues.append("No transparency")
        if edge:issues.append("Visible pixels touch image boundary")
        if fill<0.18:issues.append("Very small visible silhouette")
        if fill>0.96:issues.append("Image nearly fills canvas")
        if transparent<0.03:issues.append("Very little transparent area")
        results.append(dict(file=path.name,width=w,height=h,visible_bounds=bounds,margin=margin,transparent_fraction=round(transparent,3),issues=issues))
report=dict(total=len(files),flagged=sum(bool(r["issues"]) for r in results),results=results)
Path("fish-image-audit.json").write_text(json.dumps(report,indent=2))
print("Total",len(files),"Flagged",report["flagged"])
for r in results:
    if r["issues"]:print(r["file"],r["issues"])
