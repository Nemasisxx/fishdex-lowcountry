"""Second-pass conservative cleanup. Never delete the largest silhouette or any
connected anatomy; report ambiguous pieces for manual review."""
from pathlib import Path
from PIL import Image
import numpy as np, cv2, json
results=[]
for path in sorted(Path("images").glob("*.webp")):
 im=Image.open(path).convert("RGBA"); arr=np.array(im); alpha=arr[:,:,3]
 mask=(alpha>25).astype(np.uint8)
 n,labels,stats,_=cv2.connectedComponentsWithStats(mask,8)
 removed=[];review=[]
 if n>1:
  main=1+int(np.argmax(stats[1:,cv2.CC_STAT_AREA]))
  mx,my,mw,mh,ma=map(int,stats[main])
  for i in range(1,n):
   if i==main:continue
   x,y,w,h,area=map(int,stats[i])
   # Only small detached islands away from the main silhouette. Any
   # substantial island, fin-sized shape, or close detail is retained.
   gap_x=max(mx-(x+w),x-(mx+mw),0)
   gap_y=max(my-(y+h),y-(my+mh),0)
   separated=max(gap_x,gap_y)>=max(5,int(min(arr.shape[:2])*.025))
   tiny=area<=max(18,int(ma*.003))
   outside=(x+w<mx or x>mx+mw or y+h<my or y>my+mh)
   if separated and tiny and outside:
    arr[labels==i,3]=0
    removed.append(dict(x=x,y=y,w=w,h=h,area=area))
   elif area>=25:
    review.append(dict(x=x,y=y,w=w,h=h,area=area))
 if removed:Image.fromarray(arr,"RGBA").save(path,"WEBP",lossless=True,method=6)
 results.append(dict(file=path.name,removed=removed,needs_visual_review=review))
report=dict(checked=len(results),modified=sum(bool(x["removed"]) for x in results),review_files=sum(bool(x["needs_visual_review"]) for x in results),results=results)
Path("fish-second-pass-audit.json").write_text(json.dumps(report,indent=2))
print("Checked",report["checked"],"modified",report["modified"],"manual review",report["review_files"])
