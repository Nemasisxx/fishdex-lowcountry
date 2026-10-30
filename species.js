const names=`Red Drum|Spotted Seatrout|Pinfish|Atlantic Croaker|Spot|Black Drum|Sheepshead|Southern Flounder|Summer Flounder|Weakfish|Silver Perch|Southern Kingfish|Northern Kingfish|Gulf Kingfish|Bluefish|Spanish Mackerel|King Mackerel|Cobia|Tarpon|Ladyfish|Crevalle Jack|Florida Pompano|Permit|Black Sea Bass|Gray Snapper|Vermilion Snapper|Red Snapper|Gag Grouper|Scamp|Mahi-mahi|Little Tunny|Atlantic Bonito|Atlantic Spadefish|Tripletail|Toadfish|Oyster Toadfish|Striped Mullet|Hardhead Catfish|Gafftopsail Catfish|Bonnethead Shark|Atlantic Sharpnose Shark|Blacktip Shark|Stingray (Atlantic)|Largemouth Bass|Bluegill|Redear Sunfish|Redbreast Sunfish|Warmouth|Green Sunfish|Pumpkinseed|Black Crappie|White Crappie|Channel Catfish|Blue Catfish|Flathead Catfish|Brown Bullhead|Yellow Bullhead|Bowfin|Longnose Gar|Florida Gar|Chain Pickerel|American Eel|White Perch|Striped Bass|American Shad|Hickory Shad|Common Carp|Grass Carp|Spotted Sucker|Golden Shiner|Creek Chubsucker|Spinner Shark|Sandbar Shark|Bull Shark|Tiger Shark|Great Hammerhead|Great White Shark`.split('|');
const rarityCodes=`C C C C C U U U R R C C U U C U E E L U U R M U R R L L L E U L U E U U R C U U U R U C C U C U U R U R C U R U U U R R U R U L L R U M L R M R E E L L M`.split(' ');
const colors={C:'#a7b3be',U:'#39d98a',R:'#48a8ff',E:'#f05ab8',L:'#a679ff',M:'#ffbc45'};
const tiers={C:'COMMON',U:'UNCOMMON',R:'RARE',E:'EPIC',L:'LEGENDARY',M:'MYTHIC'};
const species=names.map((name,i)=>({id:i+1,name,rarity:rarityCodes[i]||'C',image:`images/${String(i+1).padStart(2,'0')}.jpg`}));

// Expansion entries #078–#099 are provisional until Lowcountry locality is reviewed.
const expansionSpecies=[
  {
    "id": 78,
    "name": "Pigfish",
    "scientificName": "Orthopristis chrysoptera",
    "habitat": "inshore",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 79,
    "name": "Northern Puffer",
    "scientificName": "Sphoeroides maculatus",
    "habitat": "inshore",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 80,
    "name": "Gray Triggerfish",
    "scientificName": "Balistes capriscus",
    "habitat": "offshore",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 81,
    "name": "Greater Amberjack",
    "scientificName": "Seriola dumerili",
    "habitat": "offshore",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 82,
    "name": "White Grunt",
    "scientificName": "Haemulon plumierii",
    "habitat": "offshore",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 83,
    "name": "Great Barracuda",
    "scientificName": "Sphyraena barracuda",
    "habitat": "offshore",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 84,
    "name": "Blackfin Tuna",
    "scientificName": "Thunnus atlanticus",
    "habitat": "offshore",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 85,
    "name": "Wahoo",
    "scientificName": "Acanthocybium solandri",
    "habitat": "offshore",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 86,
    "name": "Yellowfin Tuna",
    "scientificName": "Thunnus albacares",
    "habitat": "offshore",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 87,
    "name": "Sailfish",
    "scientificName": "Istiophorus platypterus",
    "habitat": "offshore",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 88,
    "name": "Blue Marlin",
    "scientificName": "Makaira nigricans",
    "habitat": "offshore",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 89,
    "name": "Atlantic Sturgeon",
    "scientificName": "Acipenser oxyrinchus oxyrinchus",
    "habitat": "diadromous",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 90,
    "name": "Shortnose Sturgeon",
    "scientificName": "Acipenser brevirostrum",
    "habitat": "diadromous",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 91,
    "name": "Blueback Herring",
    "scientificName": "Alosa aestivalis",
    "habitat": "diadromous",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 92,
    "name": "Gizzard Shad",
    "scientificName": "Dorosoma cepedianum",
    "habitat": "freshwater",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 93,
    "name": "Threadfin Shad",
    "scientificName": "Dorosoma petenense",
    "habitat": "freshwater",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 94,
    "name": "Flier",
    "scientificName": "Centrarchus macropterus",
    "habitat": "freshwater",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 95,
    "name": "Spotted Sunfish",
    "scientificName": "Lepomis punctatus",
    "habitat": "freshwater",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 96,
    "name": "Redfin Pickerel",
    "scientificName": "Esox americanus americanus",
    "habitat": "freshwater",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 97,
    "name": "Eastern Mosquitofish",
    "scientificName": "Gambusia holbrooki",
    "habitat": "freshwater",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 98,
    "name": "Hybrid Striped Bass",
    "scientificName": "Morone saxatilis × Morone chrysops",
    "habitat": "freshwater",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  },
  {
    "id": 99,
    "name": "White Bass",
    "scientificName": "Morone chrysops",
    "habitat": "freshwater",
    "verification": "statewide documented; local verification pending",
    "rarity": "U",
    "image": null
  }
];
species.push(...expansionSpecies);
