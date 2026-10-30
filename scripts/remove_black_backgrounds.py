"""Remove exterior black backgrounds from FishDex WebP images.
Uses edge-connected dark-region flood fill so dark markings inside the fish survive.
"""
from pathlib import Path
from collections import deque
from PIL import Image, ImageFilter
import numpy as np

folder = Path("images")
files = sorted(folder.glob("*.webp"))
assert len(files) == 99, f"Expected 99 fish WebPs, found {len(files)}"

for path in files:
    image = Image.open(path).convert("RGBA")
    rgb = np.asarray(image.convert("RGB"), dtype=np.uint8)
    h, w = rgb.shape[:2]
    # Near-black pixels only. The flood fill is restricted to areas connected
    # to the outside edge, protecting dark spots and stripes inside fish.
    near_black = np.max(rgb, axis=2) < 35
    visited = np.zeros((h, w), dtype=bool)
    q = deque()
    for x in range(w):
        if near_black[0, x]: q.append((0, x))
        if near_black[h-1, x]: q.append((h-1, x))
    for y in range(h):
        if near_black[y, 0]: q.append((y, 0))
        if near_black[y, w-1]: q.append((y, w-1))
    while q:
        y, x = q.popleft()
        if visited[y, x] or not near_black[y, x]: continue
        visited[y, x] = True
        if y: q.append((y-1, x))
        if y+1 < h: q.append((y+1, x))
        if x: q.append((y, x-1))
        if x+1 < w: q.append((y, x+1))
    alpha = np.full((h, w), 255, dtype=np.uint8)
    alpha[visited] = 0
    # Feather the silhouette boundary by a pixel for smooth antialiasing.
    mask = Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(0.45))
    image.putalpha(mask)
    bounds = mask.getbbox()
    if not bounds: raise RuntimeError(f"No fish found in {path}")
    left, top, right, bottom = bounds
    pad = 5
    image = image.crop((max(0,left-pad),max(0,top-pad),min(w,right+pad),min(h,bottom+pad)))
    image.save(path, "WEBP", quality=95, method=6)
    print(f"Processed {path.name}: {image.size}")

print(f"Done: {len(files)} transparent fish images")
