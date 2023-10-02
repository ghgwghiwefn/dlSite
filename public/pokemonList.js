const Pokemon = require('./pokemon');

let allPokemonNames = [
    "Venusaur", "Charizard", "Blastoise", "Butterfree", "Beedrill", "Pidgeot", "Raticate", "Fearow", "Arbok", "Raichu",
    "Sandslash", "Nidoqueen", "Nidoking", "Clefable", "Ninetales", "Wigglytuff", "Golbat", "Vileplume", "Parasect", "Venomoth",
    "Dugtrio", "Persian", "Golduck", "Primeape", "Arcanine", "Poliwrath", "Alakazam", "Machamp", "Victreebel", "Tentacruel",
    "Golem", "Rapidash", "Slowbro", "Magneton", "Farfetch'd", "Dodrio", "Dewgong", "Muk", "Cloyster", "Gengar",
    "Hypno", "Kingler", "Electrode", "Exeggutor", "Marowak", "Hitmonlee", "Hitmonchan", "Lickitung", "Weezing", "Seaking",
    "Kangaskhan", "Seadra", "Seaking", "Mr. Mime", "Scyther", "Electabuzz", "Magmar", "Pinsir", "Tauros", "Gyarados",
    "Lapras", "Ditto", "Vaporeon", "Jolteon", "Flareon", "Omastar", "Kabutops", "Aerodactyl", "Snorlax", "Articuno",
    "Zapdos", "Moltres", "Dragonite", "Mew", "Meganium", "Typhlosion", "Feraligatr", "Crobat", "Lanturn",
    "Steelix", "Granbull", "Scizor", "Ursaring", "Magcargo", "Kingdra", "Donphan", "Stantler", "Smeargle", "Tyranitar",
    "Celebi", "Sceptile", "Blaziken", "Swampert", "Exploud", "Hariyama", "Delcatty", "Sableye",
    "Mawile", "Aggron", "Medicham", "Manectric", "Sharpedo", "Camerupt", "Flygon", "Altaria", "Claydol", "Cradily",
    "Armaldo", "Milotic", "Castform", "Banette", "Dusclops", "Walrein", "Huntail", "Gorebyss", "Salamence", "Metagross",
    "Regirock", "Registeel", "Regice", "Latias", "Latios", "Kyogre", "Groudon", "Rayquaza", "Jirachi", "Deoxys",
    "Empoleon", "Infernape", "Torterra", "Staraptor", "Luxray", "Roserade", "Rampardos", "Bastiodon", "Wormadam", "Mothim",
    "Armaldo", "Bibarel", "Kricketune", "Rampardos", "Bastiodon", "Wormadam", "Mothim", "Chatot", "Spiritomb", "Garchomp",
    "Lucario", "Hippowdon", "Drapion", "Toxicroak", "Carnivine", "Lumineon", "Abomasnow", "Weavile", "Magnezone", "Lickilicky",
    "Rhyperior", "Tangrowth", "Electivire", "Magmortar", "Togekiss", "Yanmega", "Leafeon", "Glaceon", "Gliscor", "Mamoswine",
    "Porygon Z", "Gallade", "Probopass", "Dusknoir", "Froslass", "Rotom", "Uxie", "Mesprit", "Azelf", "Dialga",
    "Palkia", "Heatran", "Regigigas", "Giratina", "Cresselia", "Phione", "Manaphy", "Darkrai", "Shaymin", "Arceus",
    "Serperior", "Emboar", "Samurott", "Excadrill", "Conkeldurr", "Seismitoad", "Thundurus", "Landorus", "Tornadus", "Kyurem",
    "Genesect", "Greninja", "Delphox", "Chesnaught", "Talonflame", "Vivillon", "Pangoro", "Aurorus", "Heliolisk", "Tyrantrum",
    "Goodra", "Aegislash", "Malamar", "Barbaracle", "Dragalge", "Clawitzer", "Heliolisk", "Talonflame", "Vivillon", "Pangoro",
    "Aurorus", "Heliolisk", "Tyrantrum", "Goodra", "Aegislash", "Malamar", "Barbaracle", "Dragalge", "Clawitzer", "Hawlucha",
    "Dedenne", "Carbink", "Aromatisse", "Slurpuff", "Gourgeist", "Avalugg", "Noivern", "Xerneas", "Yveltal", "Zygarde",
    "Diancie", "Volcanion", "Decidueye", "Incineroar", "Primarina", "Vikavolt", "Crabominable", "Oricorio", "Lycanroc", "Toxapex",
    "Mudsdale", "Salazzle", "Tsareena", "Comfey", "Oranguru", "Passimian", "Lurantis", "Golisopod", "Palossand", "Silvally",
    "Turtonator", "Togedemaru", "Mimikyu", "Bruxish", "Drampa", "Dhelmise", "Komala", "Turtonator", "Togedemaru", "Mimikyu",
    "Bruxish", "Drampa", "Dhelmise", "Komala", "Turtonator", "Togedemaru", "Mimikyu", "Bruxish", "Drampa", "Dhelmise",
    "Turtonator", "Togedemaru", "Mimikyu", "Bruxish", "Drampa", "Dhelmise", "Turtonator", "Togedemaru", "Mimikyu", "Bruxish",
    "Drampa", "Dhelmise", "Jangmo o", "Hakamo o", "Kommo o", "Tapu Koko", "Tapu Lele", "Tapu Bulu", "Tapu Fini", "Cosmoem",
    "Solgaleo", "Lunala", "Necrozma", "Zacian", "Zamazenta", "Eternatus", "Annihilape", "Arboliva", "Armarouge", "Baxcalibur", 
    "Bellibolt", "Bombirdier", "Brambleghast", "Brute Bonnet", "Ceruledge", "Cetitan", "Chi Yu", "Chien Pao", "Clodsire", "Cyclizar", 
    "Dachsbun", "Dipplin", "Dondozo", "Dudunsparce", "Espathra", "Farigiraf", "Fezandipiti", "Flamigo", "Flutter Mane", "Garganacl", 
    "Gholdengo", "Glimmora", "Grafaiai", "Great Tusk", "Houndstone", "Iron Bundle", "Iron Hands", "Iron Jugulis", "Iron Leaves", "Iron Moth", 
    "Iron Thorns", "Iron Treads", "Iron Valiant", "Kilowattrel", "Kingambit", "Klawf", "Koraidon", "Lokix", "Mabosstiff", "Maushold", "Meowscarada", 
    "Miraidon", "Munkidori", "Naclstack", "Ogerpon", "Oinkologne", "Okidogi", "Orthworm", "Palafin", "Pawmot", "Quaquaval", "Quaxwell", "Rabsca", 
    "Revavroom", "Roaring Moon", "Sandy Shocks", "Scovillain", "Scream Tail", "Sinistcha", "Skeledirge", "Slither Wing", "Spidops", "Squawkabilly", 
    "Tatsugiri", "Tauros Paldea Aqua", "Paldean Tauros Blaze", "Tauros Paldea Blaze", "Tauros Paldea", "Paldean Tauros", "Tauros Paldea Combat", "Ting Lu", "Tinkaton", "Tinkatuff", "Toedscruel", 
    "Ursaluna Bloodmoon", "Veluza", "Walking Wake", "Wo Chien", "Wugtrio", "Mega Venusaur", "Mega Charizard X", "Mega Charizard Y", "Mega Blastoise", "Mega Beedrill", "Mega Pidgeot", "Mega Alakazam", "Mega Slowbro", "Mega Gengar", "Mega Kangaskhan", "Mega Pinsir", "Mega Gyarados", "Mega Aerodactyl", "Mega Mewtwo X", "Mega Mewtwo Y", "Mega Ampharos", "Mega Steelix", "Mega Scizor", "Mega Heracross", "Mega Houndoom", "Mega Tyranitar", "Mega Sceptile", "Mega Blaziken", "Mega Swampert", "Mega Gardevoir", "Mega Sableye", "Mega Mawile", "Mega Aggron", "Mega Medicham", "Mega Manectric", "Mega Sharpedo", "Mega Camerupt", "Mega Altaria", "Mega Banette", "Mega Absol", "Mega Glalie", "Mega Salamence", "Mega Metagross", "Mega Latias", "Mega Latios", "Mega Rayquaza", "Mega Lopunny", "Mega Garchomp", "Mega Lucario", "Mega Abomasnow", "Mega Gallade", "Mega Audino", "Mega Diancie","Alolan Rattata", "Alolan Raticate", "Alolan Raichu", "Alolan Sandshrew", "Alolan Sandslash", "Alolan Vulpix", "Alolan Ninetales", "Alolan Diglett", "Alolan Dugtrio", "Alolan Meowth", "Alolan Persian", "Alolan Geodude", "Alolan Graveler", "Alolan Golem", "Alolan Grimer", "Alolan Muk", "Alolan Exeggutor", "Alolan Marowak", "Alolan Drowzee", "Alolan Hypno", "Alolan Cubone", "Alolan Marowak", "Rattata Alola", "Raticate Alola", "Raichu Alola", "Sandshrew Alola", "Sandslash Alola", "Vulpix Alola", "Ninetales Alola", "Diglett Alola", "Dugtrio Alola", "Meowth Alola", "Persian Alola", "Geodude Alola", "Graveler Alola", "Golem Alola", "Grimer Alola", "Muk Alola", "Exeggutor Alola", "Marowak Alola", "Drowzee Alola", "Hypno Alola", "Cubone Alola", "Marowak Alola", "Galarian Slowpoke", "Galarian Slowbro", "Galarian Farfetch'd", "Galarian Sirfetch'd", "Galarian Zigzagoon", "Galarian Linoone", "Galarian Obstagoon", "Galarian Weezing", "Galarian Mr. Mime", "Galarian Articuno", "Galarian Zapdos", "Galarian Moltres", "Galarian Slowking", "Slowpoke Galar", "Slowbro Galar", "Farfetch'd Galar", "Sirfetch'd Galar", "Zigzagoon Galar", "Linoone Galar", "Obstagoon Galar", "Weezing Galar", "Mr. Mime Galar", "Articuno Galar", "Zapdos Galar", "Moltres Galar", "Slowking Galar"
];

let pokemonList = [];

for (let i = 0; i < allPokemonNames.length; i++) {
    pokemonList.push(new Pokemon(allPokemonNames[i], 1, []));
}

module.exports = pokemonList;