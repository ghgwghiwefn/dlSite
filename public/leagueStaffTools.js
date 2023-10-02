
//pokemon constructor
function Pokemon(name, cost, isDrafted){
    this.name = name;
    this.cost = cost;
    this.isDrafted = isDrafted;
}

let makePlayer = false;
let makeMod = false;
let staffPokemonToggle = false;
//let divisionsToggle = false;
//let matchupsToggle = false;
function showStaffInfo(x) {
    if (x === 'makePlayer') {
        if (!makePlayer) {
            document.getElementById('registrationsInfoStaff').style.display = "block";
            document.getElementById('makePlayer').innerHTML = "Hide Registrations";
        } else {
            document.getElementById('registrationsInfoStaff').style.display = "none";
            document.getElementById('makePlayer').innerHTML = "Make Player";
        }
        makePlayer = !makePlayer;
    }
    if (x === 'makeMod') {
        if (!makeMod) {
            document.getElementById('modInfoStaff').style.display = "block";
            document.getElementById('makeModButton').innerHTML = "Hide Make Mod";
        } else {
            document.getElementById('modInfoStaff').style.display = "none";
            document.getElementById('makeModButton').innerHTML = "Make Mod";
        }
        makeMod = !makeMod;
    }
    if (x === 'editPokemon') {
        if (!staffPokemonToggle) {
            document.getElementById('pokemonInfoStaff').style.display = "block";
            document.getElementById('editPokemon').innerHTML = "Hide Pokemon";
        } else {
            document.getElementById('pokemonInfoStaff').style.display = "none";
            document.getElementById('editPokemon').innerHTML = "Edit Pokemon";
        }
        staffPokemonToggle= !staffPokemonToggle;
    }
    if (x === 'divisions') {
        if (!divisionsToggle) {
            document.getElementById('divisionsInfo').style.display = "block";
            document.getElementById('divisionsButton').innerHTML = "Hide Divisions";
        } else {
            document.getElementById('divisionsInfo').style.display = "none";
            document.getElementById('divisionsButton').innerHTML = "Show Divisions";
        }
        divisionsToggle = !divisionsToggle;
    }
    if (x === 'matchups') {
        if (!divisionsToggle) {
            document.getElementById('matchupsInfo').style.display = "block";
            document.getElementById('matchupsButton').innerHTML = "Hide Matchups";
        } else {
            document.getElementById('matchupsInfo').style.display = "none";
            document.getElementById('matchupsButton').innerHTML = "Show Matchups";
        }
        divisionsToggle = !divisionsToggle;
    }
}

//player tools for staff
let makePlayers = [];
function addPlayer(playerName) {
    let isIn = false;
    for (let i = 0; i < makePlayers.length; i++) {
        if (makePlayers[i] === playerName) {
            makePlayers.splice(i, 1);
            isIn = true;
        }
    }
    if (!isIn) {
        makePlayers.push(playerName);
    }
    let text = "";
    for (let i = 0; i < makePlayers.length; i++) {
        if (i === 0) {
            text += makePlayers[i];
        } else {
            text += ", " + makePlayers[i]
        }
    }
    console.log(text);
    document.getElementById('playersToAdd').innerHTML = text;
}
async function updatePlayers() {
    console.log(makePlayers);
    const league = {
        "id": document.getElementById('leagueID').innerHTML
    }
    const players = {
        "players": makePlayers
    }

    const data = [league, players];
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/updatePlayers', options);
    document.getElementById('playersToAdd').innerHTML = "Updated, refresh to see changes";
}
//pokemon staff tools
//retrieve league pokemon
let pokemon_list = [];
function addMonsToList(data) {
    for (let i = 0; i < data.length; i++) {
        pokemon_list.push(data[i]);
    }
}
async function getPokemon() {
    const league = {
        "id": document.getElementById('leagueID').innerHTML
    }
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(league)
    };
    response = await fetch('/getPokemon', options);
    let data = await response.json();
    let finished = await addMonsToList(data);
}
getPokemon();
//end retrieve league pokemon
let editType = 'add'
function editPokemon(type) {
    if (type === 'add') {
        editType = 'add';
        document.getElementById('cost').style.display = "block";
        document.getElementById('mode').innerHTML = "Add";

        document.getElementById('pokemonCost').value = "";
    } else {
        editType = 'delete';
        document.getElementById('cost').style.display = "none";
        document.getElementById('mode').innerHTML = "Delete";

        document.getElementById('pokemonCost').value = "";
    } 
    console.log(editType);
}

let pokemonToAdd = [];
let pokemonToDelete = [];
function updatePokemonLocal() {
    let pokemon_name = document.getElementById('pokemonName').value;
    let pokemon_cost = Number(document.getElementById('pokemonCost').value);
    let num_divisions = Number(document.getElementById('leagueDivs').innerHTML);
    if (pokemon_name != '') {
        if (editType != 'delete') {
            if (typeof pokemon_cost === "number") {
                let divs = [];
                for (let i = 0; i < num_divisions; i++) {
                    divs.push(false);
                }
                if (editType === 'add') {
                    pokemonToAdd.push(new Pokemon(pokemon_name, pokemon_cost, divs));
                } 
            } 
        } else {
            console.log(pokemon_name);
            pokemonToDelete.push(pokemon_name);
        }
        let text = "Add: ";
        for (let i = 0; i < pokemonToAdd.length; i++) {
            text += pokemonToAdd[i].name + " " + pokemonToAdd[i].cost + ", "
        }
        text += "<br>Delete: "
        for (let i = 0; i < pokemonToDelete.length; i++) {
            text += pokemonToDelete[i] + ", ";
        }
        document.getElementById('pokemonCost').value = "";
        document.getElementById('pokemonName').value = "";
        document.getElementById('pokemonToEdit').innerHTML = text;
        
    } else {
        alert('please add the name of a pokemon');
    }
}

async function updatePokemon() {
    const league = {
        "id": document.getElementById('leagueID').innerHTML
    }
    const data = [league, pokemonToAdd, pokemonToDelete];
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/updatePokemon', options);
    document.getElementById('pokemonToEdit').innerHTML = "Updated, refresh to see changes";
}
//make draft mod
async function makeDraftMod() {
    const league = {
        "id": document.getElementById('leagueID').innerHTML
    }
    const userToMod = document.getElementById('makeUserMod').value;
    const data = [league, userToMod];
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/makeLeagueMod', options);
    document.getElementById('makeUserMod').value = "";
    document.getElementById('modMade').innerHTML = "Updated, refresh to see changes";
}
//set ready for signups
async function readyForSignups() {
    const league = {
        "id": document.getElementById('leagueID').innerHTML
    }
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(league)
    };
    const response = await fetch('/readyForSignups', options);
    document.getElementById('readyForSignupsButton').style.display = "none";
}

//set private/public
async function setPrivateToggle() {
    const league = {
        "id": document.getElementById('leagueID').innerHTML
    }
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(league)
    };
    const response = await fetch('/privateToggle', options);
    if (document.getElementById('private').innerHTML === "Make League Public") {
        document.getElementById('private').innerHTML = "Make League Private";
    } else {
        document.getElementById('private').innerHTML = "Make League Public";
    }
}