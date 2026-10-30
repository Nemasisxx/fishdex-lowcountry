"""Remove small isolated fragments outside the main fish silhouette.
Conservative: only erase components completely beyond the main component's
horizontal bounds, leaving detached features within the fish untouched.
"""
from pathlib import Path
from PIL import Image
import cv2,numpy as np,json
results=[]
for path in sorted(Path('images').glob('*.webp')):
    arr=np.array(Image.open(path).convert('RGBA'))
    alpha=arr[:,:,3]
    mask=(alpha>25).astype('uint8')
    count,labels,stats,_=cv2.connectedComponentsWithStats(mask,8)
    removed=[]
    if count>1:
        main=1+int(np.argmax(stats[1:,cv2.CC_STAT_AREA]))
        mx,my,mw,mh,ma=map(int,stats[main])
        for i in range(1,count):
            if i==main:continue
            x,y,w,h,area=map(int,stats[i])
            # Remove only small islands completely to the left or right of the
            # dominant fish component. Protect detached fin detail elsewhere.
            outside=(x>=mx+mw+3 or x+w<=mx-3)
            small=area<max(100,ma*.012)
            if outside and small:
                arr[labels==i,3]=0
                removed.append(dict(x=x,y=y,width=w,height=h,area=area))
    if removed:
        Image.fromarray(arr,'RGBA').save(path,'WEBP',lossless=True,method=6)
    results.append(dict(file=path.name,removed=removed))
report={'checked':len(results),'modified':sum(bool(x['removed']) for x in results),'results':results}
Path('fish-fragment-audit.json').write_text(json.dumps(report,indent=2))
print('Checked',report['checked'],'modified',report['modified'])
for x in results:
    if x['removed']:print(x['file'],x['removed'])
