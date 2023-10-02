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
    "Porygon-Z", "Gallade", "Probopass", "Dusknoir", "Froslass", "Rotom", "Uxie", "Mesprit", "Azelf", "Dialga",
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
    "Drampa", "Dhelmise", "Jangmo-o", "Hakamo-o", "Kommo-o", "Tapu Koko", "Tapu Lele", "Tapu Bulu", "Tapu Fini", "Cosmoem",
    "Solgaleo", "Lunala", "Necrozma", "Zacian", "Zamazenta", "Eternatus", "Annihilape", "Arboliva", "Armarouge", "Baxcalibur", 
    "Bellibolt", "Bombirdier", "Brambleghast", "Brute Bonnet", "Ceruledge", "Cetitan", "Chi-Yu", "Chien-Pao", "Clodsire", "Cyclizar", 
    "Dachsbun", "Dipplin", "Dondozo", "Dudunsparce", "Espathra", "Farigiraf", "Fezandipiti", "Flamigo", "Flutter Mane", "Garganacl", 
    "Gholdengo", "Glimmora", "Grafaiai", "Great Tusk", "Houndstone", "Iron Bundle", "Iron Hands", "Iron Jugulis", "Iron Leaves", "Iron Moth", 
    "Iron Thorns", "Iron Treads", "Iron Valiant", "Kilowattrel", "Kingambit", "Klawf", "Koraidon", "Lokix", "Mabosstiff", "Maushold", "Meowscarada", 
    "Miraidon", "Munkidori", "Naclstack", "Ogerpon", "Oinkologne", "Okidogi", "Orthworm", "Palafin", "Pawmot", "Quaquaval", "Quaxwell", "Rabsca", 
    "Revavroom", "Roaring Moon", "Sandy Shocks", "Scovillain", "Scream Tail", "Sinistcha", "Skeledirge", "Slither Wing", "Spidops", "Squawkabilly", 
    "Tatsugiri", "Tauros-Paldea-Aqua", "Tauros-Paldea-Blaze", "Tauros-Paldea-Combat", "Ting-Lu", "Tinkaton", "Tinkatuff", "Toedscruel", 
    "Ursaluna-Bloodmoon", "Veluza", "Walking Wake", "Wo-Chien", "Wugtrio"
];

let pokemonList = [];

for (let i = 0; i < allPokemonNames.length; i++) {
    pokemonList.push(new Pokemon(allPokemonNames[i], 1, []));
}

module.exports = pokemonList;