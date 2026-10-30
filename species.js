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

// Gameplay rarity reflects typical Lowcountry encounter difficulty, not conservation status.
// Factors: access, frequency, specialized technique, and typical maximum size.
// This is a provisional gameplay balance, not a scientific catch-rate estimate.
const challengeRarities={"Pinfish":"C","Atlantic Croaker":"C","Spot":"C","Silver Perch":"C","Southern Kingfish":"C","Bluefish":"C","Toadfish":"C","Oyster Toadfish":"C","Striped Mullet":"C","Hardhead Catfish":"C","Gafftopsail Catfish":"C","Largemouth Bass":"C","Bluegill":"C","Redear Sunfish":"C","Redbreast Sunfish":"C","Warmouth":"C","Green Sunfish":"C","Pumpkinseed":"C","Black Crappie":"C","White Crappie":"C","Channel Catfish":"C","Brown Bullhead":"C","Yellow Bullhead":"C","Common Carp":"C","Golden Shiner":"C","Gizzard Shad":"C","Threadfin Shad":"C","Eastern Mosquitofish":"C","Red Drum":"U","Spotted Seatrout":"U","Black Drum":"U","Sheepshead":"U","Southern Flounder":"U","Weakfish":"U","Northern Kingfish":"U","Gulf Kingfish":"U","Spanish Mackerel":"U","Ladyfish":"U","Crevalle Jack":"U","Black Sea Bass":"U","Gray Snapper":"U","Vermilion Snapper":"U","Atlantic Spadefish":"U","Tripletail":"U","Bonnethead Shark":"U","Atlantic Sharpnose Shark":"U","Stingray (Atlantic)":"U","Blue Catfish":"U","Flathead Catfish":"U","Bowfin":"U","Longnose Gar":"U","Chain Pickerel":"U","American Eel":"U","White Perch":"U","Striped Bass":"U","American Shad":"U","Hickory Shad":"U","Grass Carp":"U","Spotted Sucker":"U","Creek Chubsucker":"U","Pigfish":"U","Northern Puffer":"U","White Grunt":"U","Flier":"U","Spotted Sunfish":"U","Redfin Pickerel":"U","White Bass":"U","Summer Flounder":"R","King Mackerel":"R","Florida Pompano":"R","Gag Grouper":"R","Scamp":"R","Little Tunny":"R","Atlantic Bonito":"R","Blacktip Shark":"R","Florida Gar":"R","Red Snapper":"R","Gray Triggerfish":"R","Great Barracuda":"R","Blueback Herring":"R","Hybrid Striped Bass":"R","Cobia":"E","Mahi-mahi":"E","Permit":"E","Spinner Shark":"E","Sandbar Shark":"E","Bull Shark":"E","Greater Amberjack":"E","Blackfin Tuna":"E","Wahoo":"E","Yellowfin Tuna":"E","Atlantic Sturgeon":"E","Tarpon":"L","Tiger Shark":"L","Great Hammerhead":"L","Sailfish":"L","Blue Marlin":"L","Shortnose Sturgeon":"L","Great White Shark":"M"};
const rarityReasons={"C":"Frequently encountered or relatively accessible with ordinary local tackle.","U":"Some location, timing, technique, or tackle challenge.","R":"Specialized tactics, seasonal timing, or less accessible habitat.","E":"Demanding technique, large size, or significant boat/offshore access.","L":"Exceptional size, demanding conditions, or substantial offshore effort.","M":"Extraordinary encounter; not a normal targeted recreational catch."};
const protectedSpecies=new Set(['Atlantic Sturgeon','Shortnose Sturgeon','Great White Shark']);
for(const fish of species){fish.rarity=challengeRarities[fish.name]||'U';fish.rarityReason=rarityReasons[fish.rarity];fish.protectedNotice=protectedSpecies.has(fish.name)?'Protected or highly regulated: do not target or handle; follow current SCDNR/NOAA rules. Observation only.':null;}
