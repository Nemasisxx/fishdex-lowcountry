# Fish artwork repair scope

The user visually identified these **49** entries as having clipped heads/tails or portions of adjacent fish:

003, 004, 005, 007, 010, 011, 012, 013, 014, 017, 018, 020, 021, 022, 023, 024, 025, 031, 032, 033, 035, 038, 041, 042, 044, 045, 051, 052, 054, 055, 057, 058, 061, 062, 072, 073, 074, 075, 077, 078, 079, 080, 081, 082, 083, 088, 089, 090, 094

All other **50** entries are accepted for now and must not be altered.

## Acceptance criteria

- Each flagged entry displays exactly one fish, with no neighboring fish, stray tails, duplicate heads, or labels.
- The entire fish is visible, including nose, tail, fins, and whiskers where applicable.
- Preserve approved original illustration style and colors.
- Compare each result with its source illustration before replacing it; cropping or adding transparent padding cannot restore anatomy already cut off in the source.
- Do not run broad destructive connected-component cleanup on unflagged fish.
- Mark each fish complete only after inspecting the actual rendered image, not merely an automated bounding-box check.

**Status:** awaiting individual image restoration and visual verification; do not mark this list fixed merely because an audit workflow succeeds.
