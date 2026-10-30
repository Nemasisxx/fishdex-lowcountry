"""Add safe transparent margins to existing fish images without changing their artwork."""
from pathlib import Path
from PIL import Image
import json
report=json.loads(Path("fish-image-audit.json").read_text())
flagged={x["file"] for x in report["results"] if x["issues"]}
done=[]
for path in sorted(Path("images").glob("*.webp")):
    if path.name not in flagged: continue
    with Image.open(path) as src:
        image=src.convert("RGBA")
        w,h=image.size
        # Preserve every existing pixel. Add enough canvas for the full
        # silhouette to breathe in cards and the award modal.
        pad=max(18,round(max(w,h)*0.075))
        canvas=Image.new("RGBA",(w+2*pad,h+2*pad),(0,0,0,0))
        canvas.alpha_composite(image,(pad,pad))
        canvas.save(path,"WEBP",lossless=True,method=6)
        done.append(path.name)
print(f"Added transparent margins to {len(done)} flagged images; source artwork preserved.")
