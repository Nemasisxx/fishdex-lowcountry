"""Detect and safely remove standalone labels from FishDex image assets.
Only erase OCR-identified small alpha components outside the main fish silhouette.
Potential text overlapping the fish is reported for manual review, not altered.
"""
from pathlib import Path
import json, re
import numpy as np
import cv2
import pytesseract
from PIL import Image
from pytesseract import Output

results=[]
for path in sorted(Path("images").glob("*.webp")):
    image=Image.open(path).convert("RGBA")
    a=np.array(image)
    h,w=a.shape[:2]
    mask=(a[:,:,3]>35).astype(np.uint8)
    count, labels, stats, centers=cv2.connectedComponentsWithStats(mask,8)
    if count<2:
        results.append(dict(file=path.name,removed=[],needs_review=[]));continue
    sizes=stats[:,cv2.CC_STAT_AREA]
    main=1+int(np.argmax(sizes[1:]))
    main_size=int(sizes[main])
    # OCR against light and dark backgrounds for different lettering colors.
    candidates=[]
    for bg in (255,0):
        rgb=a[:,:,:3].astype(np.float32)
        alpha=a[:,:,3:4].astype(np.float32)/255.
        composite=(rgb*alpha+bg*(1-alpha)).astype(np.uint8)
        for mode in (6,11):
            data=pytesseract.image_to_data(composite,config=f'--psm {mode}',output_type=Output.DICT)
            for i,word in enumerate(data['text']):
                word=word.strip()
                if len(word)<1:continue
                try: confidence=float(data['conf'][i])
                except:continue
                if confidence<45:continue
                x,y,bw,bh=[int(data[k][i]) for k in ('left','top','width','height')]
                if bw<3 or bh<5:continue
                candidates.append((x,y,bw,bh,word,round(confidence)))
    removed=[];review=[];seen=set();changed=False
    for x,y,bw,bh,word,confidence in candidates:
        key=(round(x/8),round(y/8),word.lower())
        if key in seen:continue
        seen.add(key)
        # Ignore short low-information false positives.
        if len(word)==1 and not word.isdigit():continue
        x0=max(0,x-3);y0=max(0,y-3);x1=min(w,x+bw+3);y1=min(h,y+bh+3)
        region=labels[y0:y1,x0:x1]
        ids,counts=np.unique(region[region>0],return_counts=True)
        if not len(ids):continue
        main_hits=int(counts[ids==main][0]) if np.any(ids==main) else 0
        # Never erase the fish or any detected lettering connected to it.
        if main_hits:
            review.append(dict(text=word,confidence=confidence,reason="overlaps main fish silhouette"))
            continue
        # Only erase small isolated components mostly inside OCR box.
        safe=[]
        for component,hits in zip(ids,counts):
            component=int(component)
            if component==main:continue
            size=int(sizes[component])
            if size>main_size*.035 or hits/size<.75:continue
            safe.append(component)
        if not safe:
            review.append(dict(text=word,confidence=confidence,reason="not safely isolated"))
            continue
        for component in safe:
            a[labels==component,3]=0
        removed.append(dict(text=word,confidence=confidence))
        changed=True
    if changed:
        Image.fromarray(a,"RGBA").save(path,"WEBP",lossless=True,method=6)
    results.append(dict(file=path.name,removed=removed,needs_review=review))
report=dict(total=len(results),files_modified=sum(bool(r['removed']) for r in results),
            files_needing_review=sum(bool(r['needs_review']) for r in results),results=results)
Path("fish-label-audit.json").write_text(json.dumps(report,indent=2))
print("Checked",report["total"],"modified",report["files_modified"],"need review",report["files_needing_review"])
for r in results:
    if r["removed"] or r["needs_review"]:
        print(r["file"],"removed:",[v["text"] for v in r["removed"]],"review:",[v["text"] for v in r["needs_review"]])
