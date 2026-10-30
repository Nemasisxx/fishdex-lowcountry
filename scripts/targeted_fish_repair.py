"""Only edit the 49 user-flagged images. Remove clearly separate collage remnants.
Never mistake transparent padding for reconstruction of cropped anatomy."""
from pathlib import Path
from PIL import Image
import numpy as np, cv2, json
TARGETS={
  "3": "Pinfish",
  "4": "Atlantic_Croaker",
  "5": "Spot",
  "7": "Sheepshead",
  "10": "Weakfish",
  "11": "Silver_Perch",
  "12": "Southern_Kingfish",
  "13": "Northern_Kingfish",
  "14": "Gulf_Kingfish",
  "17": "King_Mackerel",
  "18": "Cobia",
  "20": "Ladyfish",
  "21": "Crevalle_Jack",
  "22": "Florida_Pompano",
  "23": "Permit",
  "24": "Black_Sea_Bass",
  "25": "Gray_Snapper",
  "31": "Little_Tunny",
  "32": "Atlantic_Bonito",
  "33": "Atlantic_Spadefish",
  "35": "Toadfish",
  "38": "Hardhead_Catfish",
  "41": "Atlantic_Sharpnose_Shark",
  "42": "Blacktip_Shark",
  "44": "Largemouth_Bass",
  "45": "Bluegill",
  "51": "Black_Crappie",
  "52": "White_Crappie",
  "54": "Blue_Catfish",
  "55": "Flathead_Catfish",
  "57": "Yellow_Bullhead",
  "58": "Bowfin",
  "61": "Chain_Pickerel",
  "62": "American_Eel",
  "72": "Spinner_Shark",
  "73": "Sandbar_Shark",
  "74": "Bull_Shark",
  "75": "Tiger_Shark",
  "77": "Great_White_Shark",
  "78": "Pigfish",
  "79": "Northern_Puffer",
  "80": "Gray_Triggerfish",
  "81": "Greater_Amberjack",
  "82": "White_Grunt",
  "83": "Great_Barracuda",
  "88": "Blue_Marlin",
  "89": "Atlantic_Sturgeon",
  "90": "Shortnose_Sturgeon",
  "94": "Flier"
}
report=[]
for number,name in TARGETS.items():
 p=Path("images")/(name+".webp")
 if not p.exists():
  report.append(dict(number=number,file=str(p),error="missing"));continue
 arr=np.array(Image.open(p).convert("RGBA"));mask=(arr[:,:,3]>30).astype("uint8")
 count,labels,stats,_=cv2.connectedComponentsWithStats(mask,8)
 if count<=1:
  report.append(dict(number=number,file=p.name,removed=0,review="connected or cropped artwork requires source restoration"));continue
 main=1+int(np.argmax(stats[1:,cv2.CC_STAT_AREA]));mx,my,mw,mh,ma=map(int,stats[main]);removed=[]
 for i in range(1,count):
  if i==main:continue
  x,y,w,h,area=map(int,stats[i])
  # Remove distinct side scraps, never detached elements inside the fish footprint.
  far=(x+w<mx-3 or x>mx+mw+3)
  if far and area<ma*.08:
   arr[labels==i,3]=0;removed.append(dict(x=x,y=y,w=w,h=h,area=area))
 if removed:Image.fromarray(arr,"RGBA").save(p,"WEBP",lossless=True,method=6)
 report.append(dict(number=number,file=p.name,removed=len(removed),fragments=removed,review="inspect for touching neighboring fish and missing anatomy"))
Path("targeted-fish-repair-report.json").write_text(json.dumps(report,indent=2))
print("Flagged:",len(TARGETS),"files edited:",sum(bool(r.get("removed")) for r in report))
