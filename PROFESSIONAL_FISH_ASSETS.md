# FishDex licensed 3D asset sourcing

Goal: replace temporary generated meshes with real, artist-made, textured, rigged fish models. Do not mislabel unrelated fish as Lowcountry species.

## Reviewed leads (2026-10-30)

- [Quaternius LowPoly Animated Fish](https://quaternius.itch.io/lowpoly-animated-fish): author publishes CC0 animated fish pack, FBX/OBJ/Blend. **Stylized, not species-specific**; suitable for testing rigged animation, not as final Red Drum/Seatrout/Sheepshead/Flounder/Snook.
- [OpenGameArt animated textured fish](https://opengameart.org/content/fish-animated): CC0, rigged, animated, diffuse texture. Species identity and visual quality require manual inspection.
- [Florida Museum Ichthyology models](https://sketchfab.com/FloridaMuseum/collections/ichthyology-69696f24596d46fe812e9b3695c25a1d): reference CT/skeleton geometry includes Spotted Sea Trout, Common Snook, and Gulf Stream Flounder. **Scientific scans are not automatically licensed for reuse or game-ready textured models**.
- [Sketchfab downloadable/license filters](https://www.sketchfab.com/blogs/community/refine-downloadable-model-searches-with-new-license-filters/): check exact license on each asset before redistribution.

## Acceptance criteria

1. Correct species anatomy, visible fins and attached tail; recognizable silhouette at aquarium scale.
2. Full-body mesh with appropriate texture maps and valid license permitting web distribution.
3. Rigged swimming animation (tail, body and fins), or documented rigging step.
4. Optimized GLB (target <= 3 MB per fish) with correct orientation and scale.
5. Screenshots from live aquarium reviewed before model is marked approved.
6. Do not publish CT-only skeletons, previews, or unlicensed files as finished fish.

## Status

The existing five GLBs in `models/` are **temporary geometric prototypes** and do not meet these criteria. No third-party professional model has been imported or approved yet.
