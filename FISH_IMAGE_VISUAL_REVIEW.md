# FishDex visual crop review — 2026-10-30

## Status
The automated audit checked all 99 processed WebPs and flagged 59 for potential crop problems. Automated flags do not prove that anatomy is missing.

A contact-sheet inspection of 89 available approved-source WebPs found that some fish were already cropped against the original black image boundary. Removing the black background does not recover any anatomy that was absent from those source images.

## Visually evident source-boundary concerns
- American Eel — body extends beyond the left edge.
- Atlantic Spadefish — fins/body extend against image edges.
- Blacktip Shark — nose and/or tail near the image boundary.
- Gray Triggerfish — fish extends past the left edge.
- Great White Shark — fish extends against the right boundary.
- Pigfish — tail extends against the left boundary.
- Stingray (Atlantic) — wings/tail extend against the source canvas.
- Spotted Sunfish — another fish-like fragment appears at the right edge.
- Northern Puffer — tail reaches the right boundary.
- Green Sunfish — fish reaches the right boundary.

## Next correction method
1. Inspect the **published** transparent version of each flagged fish at full resolution, not only the original.
2. For fish that are complete but touching the canvas, add transparent margins without rescaling the fish.
3. For fish with genuinely missing anatomy in the source, replace only those individual images with complete species-accurate artwork after review. Padding cannot restore missing parts.
4. Rerun the pixel-level audit and visually verify each replacement.

## Limitations
The contact sheet was built from 89 approved-source images available locally, not from the live published WebPs. This is a preliminary visual review; it does not certify the remaining images or all 59 flagged images as correct.
