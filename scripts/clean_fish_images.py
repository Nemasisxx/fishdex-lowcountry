from PIL import Image
from pathlib import Path
import numpy as np
import cv2

NAMES = """Atlantic_Croaker Spot Black_Drum Summer_Flounder Weakfish Silver_Perch Southern_Kingfish Northern_Kingfish Gulf_Kingfish Bluefish King_Mackerel Cobia Ladyfish Crevalle_Jack Florida_Pompano Permit""".split()

for name in NAMES:
    path = Path("images") / (name + ".webp")
    im = Image.open(path).convert("RGBA")
    a = np.asarray(im.getchannel("A"))
    count, labels, stats, _ = cv2.connectedComponentsWithStats((a >= 45).astype("uint8"), 8)
    if count > 1:
        main = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        x, y, w, h, area = map(int, stats[main])
        keep = a > 0
        for k in range(1, count):
            if k == main:
                continue
            bx, by, bw, bh, sz = map(int, stats[k])
            if sz < max(20, area * .008) and (bx + bw < x - 4 or bx > x + w + 4 or by + bh < y - 4 or by > y + h + 4):
                keep[labels == k] = False
        alpha = a.copy()
        alpha[~keep] = 0
        im.putalpha(Image.fromarray(alpha))
    bbox = im.getchannel("A").getbbox()
    if bbox:
        fish = im.crop(bbox)
        fish.thumbnail((580, 360), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (640, 420), (0, 0, 0, 0))
        canvas.alpha_composite(fish, ((640 - fish.width) // 2, (420 - fish.height) // 2))
        canvas.save(path, "WEBP", lossless=True)
    print("Cleaned", path)
