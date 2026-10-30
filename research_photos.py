#!/usr/bin/env python3
"""Research real Wikimedia Commons photos for FishDex. Does NOT auto-select or publish."""
import html, json, re, time, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
source = (ROOT / "species.js").read_text(encoding="utf-8")
match = re.search(r"const names=`([^`]+)`", source)
if not match:
    raise SystemExit("Could not parse the permanent species roster")
names = match.group(1).split("|")
if len(names) != 77:
    raise SystemExit(f"Expected 77 species, found {len(names)}")

API = "https://commons.wikimedia.org/w/api.php"
HEADERS = {"User-Agent": "FishDexLowcountryPhotoResearch/1.0 (educational open-license image review)"}
ALLOWED = ("cc0", "public domain", "cc by ", "cc by-sa ")
def clean(s):
    return html.unescape(re.sub(r"<[^>]*>", "", s or "")).strip()

def candidates(name):
    query = {
        "action": "query", "format": "json", "generator": "search",
        "gsrsearch": f'intitle:"{name}" filetype:bitmap',
        "gsrnamespace": "6", "gsrlimit": "8", "prop": "imageinfo",
        "iiprop": "url|extmetadata", "iiurlwidth": "600",
    }
    url = API + "?" + urllib.parse.urlencode(query)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=35) as response:
        data = json.load(response)
    result = []
    for page in data.get("query", {}).get("pages", {}).values():
        info = (page.get("imageinfo") or [{}])[0]
        meta = info.get("extmetadata", {})
        value = lambda k: clean(meta.get(k, {}).get("value", ""))
        license_name = value("LicenseShortName")
        if not any(license_name.lower().startswith(x) for x in ALLOWED):
            continue
        if not info.get("thumburl") or not info.get("descriptionurl"):
            continue
        result.append({
            "file_title": page["title"],
            "preview": info["thumburl"],
            "file_page": info["descriptionurl"],
            "original": info.get("url", ""),
            "license": license_name,
            "license_url": value("LicenseUrl"),
            "author": value("Artist"),
            "credit": value("Credit"),
            "description": value("ImageDescription")[:400],
            "status": "NEEDS MANUAL SPECIES AND LICENSE REVIEW",
        })
    return result

output = []
for i, name in enumerate(names, 1):
    print(f"{i:02d}/77 {name}", flush=True)
    try:
        matches = candidates(name)
        error = None
    except Exception as exc:
        matches, error = [], str(exc)
    output.append({"id": i, "species": name, "candidates": matches, "error": error})
    time.sleep(1.0)
    # Save partial progress even if the network is interrupted.
    (ROOT / "photo-candidates.json").write_text(json.dumps(output, indent=2, ensure_ascii=False), encoding="utf-8")
print("Research report: photo-candidates.json")
print("IMPORTANT: candidates are NOT verified identifications or approved image assets.")
