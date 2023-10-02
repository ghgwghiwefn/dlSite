const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/users');
const DraftLeague = require('./models/draftLeagues');
const LeagueApp = require('./models/leagueApp');
const Pokemon = require('./pokemon');
const Division = require('./divisions')
const Player = require('./player');
const Weeks = require('./week');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const saltRounds = 10;

//express app
const app = express();

//set ejs up
app.set('view engine', 'ejs');
app.set('views', 'website');

//middleware
app.use(express.static('public'));
app.use(express.urlencoded({extrended: true}));
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(cookieParser());

app.use(session({
    key: "userId",
    secret: "thisisasecretkeyfordereksdraftleaguewebsiteyesitis",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60*60*24*7*1000,
    },
}))

//connecting to database
const DBlogin = 'mongodb+srv://derek:greubjkfrfd10@cluster0.bzbtemx.mongodb.net/user-data?retryWrites=true&w=majority';
mongoose.connect(DBlogin, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));


//get requests
//web page requests
app.get('/', (req, res) => {
    if (req.session.user) {
        if (req.session.user[0].level === "admin") {
            res.render('index', {perms: "admin"});
        } else if (req.session.user[0].level === "moderator") {
            res.render('index', {perms: "mod"});
        } else {
            res.render('index', {perms: "none"});
        }
    } else {
        res.render('index', {perms: "none"});
    }
})

app.get('/index.ejs', (req, res) => {
    if (req.session.user) {
        /* get ip code
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => console.log(data.ip));
        */
        if (req.session.user[0].level === "admin") {
            res.render('index', {perms: "admin"});
        } else if (req.session.user[0].level === "moderator") {
            res.render('index', {perms: "mod"});
        } else {
            res.render('index', {perms: "none"});
        }
    } else {
        res.render('index', {perms: "none"});
    }
})

app.get('/drafts.ejs', (req, res) => {
    DraftLeague.find({started:{$all: [false]}})
        .then(result => {
            res.render('drafts', {drafts: result});
        })
        .catch(err => {
            console.log(err);
        })
})

app.get('/login.ejs', (req, res) => {
    res.render('login', {failed: '', failed2: ''});
})

app.get('/registered.ejs', (req, res) => {
    res.render('registered');
})

app.get('/newLeague.ejs', (req, res) => {
    res.render('newLeague');
})

app.get('/myLeagues.ejs', (req, res) => {
    let usersLeagues = [];
    let usersApplications = [];
    let leaguesStaffIn = [];
    let leaguesIn = [];
    let leaguesRegistered = [];
    let noLeagues = false;
    if (req.session.user) {
        const username = req.session.user[0].username;
        DraftLeague.find()
            .then(result => {
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].owner === username) {//if owner
                            usersLeagues.push(result[i]);
                        } else {
                            for (let j = 0; j < result[i].moderators.length; j++) {//check if mod
                                if (result[i].moderators[j] === username) {
                                    leaguesStaffIn.push(result[i]);
                                    break;
                                }
                            }
                            for (let j = 0; j < result[i].divisions.length; j++) {//check if player
                                for (let k = 0; k < result[i].divisions[j].draftOrder.length; k++) {
                                    if (result[i].divisions[j].draftOrder[k] === username) {
                                        leaguesIn.push(result[i]);
                                        break;
                                    }
                                }
                            }
                            for (let j = 0; j < result[i].registrations.length; j++) {//check if registered
                                if (result[i].registrations[j] === username) {
                                    leaguesRegistered.push(result[i]);
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    noLeagues = true;
                }
                LeagueApp.find()
                    .then(result => {
                        if (result.length > 0) {
                            for (let i = 0; i < result.length; i++) {
                                if (result[i].owner === username) {
                                    usersApplications.push(result[i]);
                                }
                            }
                            res.render('myLeagues', {ownedLeagues: usersLeagues, leagueApps: usersApplications, inLeagues: leaguesIn, regLeagues: leaguesRegistered, leaguesMod: leaguesStaffIn});
                        } else {
                            res.render('myLeagues', {ownedLeagues: usersLeagues, leagueApps: usersApplications, inLeagues: leaguesIn, regLeagues: leaguesRegistered, leaguesMod: leaguesStaffIn});
                        }

                    })
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.redirect('login.ejs');
    }
})

app.get('/leagueRequests.ejs', (req, res) => {
    if (req.session.user) {
        if (req.session.user[0].level === "admin" || req.session.user[0].level === "moderator") {
            LeagueApp.find()
                .then(result => {
                    res.render('leagueRequests.ejs', {apps: result});
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            res.redirect('index.ejs');
        }
    } else {
        res.redirect('index.ejs');
    }
})

app.get('/drafts/:id', (req, res) => {
    const id = req.params;
    DraftLeague.findById(id.id)
        .then(result => {
            if (req.session.user) {
                if (req.session.user[0].username === result.owner) {
                    res.render('league', {draftDetails: result, perms: "admin", loggedIn: true});
                } else {
                    let isMod = false;
                    for (let i = 0; i < result.moderators.length; i++) {
                        if (req.session.user[0].username === result.moderators[i]) {
                            isMod = true;
                            res.render('league', {draftDetails: result, perms: "mod", loggedIn: true});
                            break;
                        }
                    }
                    if (!isMod) {
                        res.render('league', {draftDetails: result, perms: "none", loggedIn: true});
                    }
                }
            } else {
                res.render('league', {draftDetails: result, perms: "none", loggedIn: false});
            }
        })
        .catch(err => {
            console.log(err);
        })
})

//is user logged in
app.get("/is-logged-in", (req, res) => {
    if (req.session.user) {
        //res.send({loggedIn: true, user: req.session.user })
        const data = {
            "loggedIn": true,
            "username": req.session.user[0].username,
            "discord": req.session.user[0].discord,
            "level": req.session.user[0].level
        }
        res.send(JSON.stringify(data));
    } else {
        //res.sendStatus({loggedIn: false});
        const data = {
            "loggedIn": false
        }
        res.send(JSON.stringify(data));
    }
})

//post requests
//signup post request
app.post('/add-user', (req, res) => {
    username = req.body.username.toLowerCase();
    password = req.body.password;
    discord = req.body.discord.toLowerCase();
    timeZone = req.body.timeZone;
    //check if username exists
    User.find({username: {$all: [username]}})
        .then(result => {
            if (result.length === 0) {//if user doesnt exist
                //check if discord exists
                User.find({discord: {$all: [discord]}})
                    .then(response => {
                        if (response.length === 0) {//discord name isnt taken
                            //hash the password and add register the user
                            console.log(response);
                            bcrypt.hash(password, saltRounds, (err, hash) => {
                                if (err) {
                                    console.log(err);
                                    res.redirect('login.ejs');
                                } else {
                                    const user = new User();
                                    user.username = username.toLowerCase();
                                    user.password = hash;
                                    user.discord = discord.toLowerCase();
                                    user.timeZone = timeZone;
                                    user.level = "user";
                                    user.save()
                                        .then((result) => {
                                            res.redirect('registered.ejs');
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                                }
                            })
                        } else {//discord name is taken
                            res.render('login', {failed: '', failed2: 'Discord is taken'});
                        }
                    })
                    .catch(error => {//error on discord name search
                        console.log(error);
                        res.redirect('login.ejs');
                    })
            } else {//username is taken
                res.render('login', {failed: '', failed2: 'Username is taken'});
            }
        })
        .catch(err => {//error on username search
            console.log(err)
        })
})

//login post request
app.post('/login-user', (req, res) => {
    username = req.body.username.toLowerCase();
    password = req.body.password;
    User.find({username: {$all: [username]}})
        .then(result => {
            bcrypt.compare(password, result[0].password, (error, response) => {
                if (response) {
                    //console.log("Successful login");
                    req.session.user = result;
                    res.redirect('index.ejs');
                } else {
                    //console.log("Incorrect Password");
                    res.render('login', {failed: 'Incorrect Password', failed2: ''});
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.redirect('login.ejs');
        })
})

//new league post request
app.post('/new-league-request', (req, res) => {
    let leagueName = req.body.name;
    let owner = req.body.owner;
    let divisions = req.body.divisions;
    let discord = req.body.discord;
    //check if draft league exists
    if (owner != "guest") {
        DraftLeague.find({name: {$all: [leagueName]}})
            .then(response => {
                if (response.length === 0) {//if league doesnt exist
                    console.log(response);
                    User.find({username: {$all: [owner]}})
                        .then(result => {
                            if (result[0].level === "admin" || result[0].level === "moderator") {
                                //if the user is staff, make the league
                                const dl = new DraftLeague();
                                dl.name = leagueName;
                                dl.owner = owner;
                                dl.leagueDiscord = discord;
                                dl.moderators = [];
                                dl.registrations = [];
                                dl.players = [];
                                dl.divisions = [];
                                dl.weeks = [];
                                dl.totalBudget = 0;
                                for (let div = 0; div < divisions.length; div++) {
                                    dl.divisions.push(new Division(divisions[div], [], ""));
                                    dl.weeks.push(new Weeks(divisions[div], []))
                                }
                                pokemonObj = new Pokemon("Venusaur", 1, [])
                                for (let div = 0; div < dl.divisions.length; div++) {
                                    pokemonObj.isDrafted.push(false);
                                }
                                dl.pokemon = [pokemonObj];
                                dl.started = false;
                                dl.draft = false;
                                dl.monsLimit = [8,12];
                                dl.readyForSignups = false;
                                dl.private = false;
                                dl.finished = false;
                                dl.teraCost = 0;
                                dl.teraLimit = 0;
                                dl.currentWeek = 0;
                                dl.save()
                                    .then((result) => {
                                        res.redirect('drafts.ejs');
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            } else {
                                //user isn't staff, submit a league request
                                const la = new LeagueApp();
                                la.name = leagueName;
                                la.owner = owner;
                                la.leagueDiscord = discord;
                                la.divisions = divisions;
                                la.status = "pending";
                                la.save()
                                    .then((result) => {
                                        res.redirect('drafts.ejs');
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.redirect('drafts.ejs');
                        })

                } else {//discord name is taken
                    console.log("League name is taken");
                    res.redirect("drafts.ejs");      
                }
            })
            .catch(err => {//error on league search
                console.log(err)
            })
    } else {
        res.redirect('drafts.ejs');
    }
})

//makeMod post request
app.post('/makeMod', (req, res) => {
    if (req.session.user[0].level === "admin") {
        User.find({username:{$all: [req.body.makeMod]}})
            .then(result => {
                User.updateOne({username: req.body.makeMod}, {$set: {level: "moderator"}})
                    .then(result => {
                        res.redirect("index.ejs");
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            .catch(err => {
                console.log(err);
            })
    }
})

//register for league
//makeMod post request
app.post('/registerForLeague', (req, res) => {
    DraftLeague.findById(req.body.id)
        .then(result=> {
            let isRegged = false
            for (let i = 0; i < result.registrations.length; i++) {
                if (result.registrations[i] === req.session.user[0].username) {
                    isRegged = true;
                }
            }
            if (!isRegged) {
                DraftLeague.updateOne({_id: req.body.id}, {"$push": { "registrations": req.session.user[0].username }})
                    .then(result => {
                        res.send('success');
                    })
                    .catch(err => {
                        console.log(err);
                    })
            } else {
                res.send('success');
            }
        })
        .catch(err => {
            console.log(err);
        })
    /*
    DraftLeague.findById(req.body.id)
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        })
    */
})

//leagueStatus post request
app.post('/leagueStatus', (req, res) => {
    LeagueApp.find()
        .then(response => {
            const whichApp = response[req.body.app]
            if (req.body.dec === "accept") {
                const dl = new DraftLeague();
                    dl.name = whichApp.name;
                    dl.owner = whichApp.owner;
                    dl.leagueDiscord = whichApp.leagueDiscord;
                    dl.moderators = [];
                    dl.registrations = [];
                    dl.players = [];
                    dl.divisions = [];
                    dl.weeks = [];
                    dl.totalBudget = 0;
                    let divisions = whichApp.divisions;
                    for (let div = 0; div < divisions.length; div++) {
                        dl.divisions.push(new Division(divisions[div], [], [], ""));
                        dl.weeks.push(new Weeks(divisions[div], []))
                    }
                    pokemonObj = new Pokemon("Venusaur", 1, [])
                    for (let div = 0; div < divisions.length; div++) {
                        pokemonObj.isDrafted.push(false);
                    }
                    dl.pokemon = [pokemonObj];
                    dl.started = false;
                    dl.draft = false;
                    dl.monsLimit = [8,12];
                    dl.readyForSignups = false;
                    dl.private = false;
                    dl.finished = false;
                    dl.teraCost = 0;
                    dl.teraLimit = 0;
                    dl.currentWeek = 0;
                    dl.save()
                        .then((result) => {
                            //res.redirect('drafts.ejs');
                        })
                        .catch((err) => {
                            console.log(err);
                        });
            }
            LeagueApp.updateOne({name: whichApp.name}, {$set: {status: req.body.dec}})
                .then(result => {
                    res.redirect('leagueRequests.ejs');
                })
                .catch(err => {
                    console.log(err);
                })
            /* Delete code
            LeagueApp.deleteOne({name: whichApp.name})
                .then(result => {
                    console.log(result);
                    res.redirect('leagueRequests.ejs');
                })
                .catch(err => {
                    console.log(err);
                })
            */
        })
        .catch(err => {
            console.log(err);
        })
})

//updatePlayers post request
app.post('/updatePlayers', (req, res) => {
    let id = req.body[0].id;
    if (req.body[1].players.length > 0) {
        DraftLeague.findById(id)
            .then(response => {
                let authorizedUsers = [response.owner];
                let allow = false;
                for (let i = 0; i < response.moderators.length; i++) {
                    authorizedUsers.push(response.moderators[i])
                }
                for (let i = 0; i < authorizedUsers.length; i++) {
                    if (req.session.user[0].username === authorizedUsers[i]) {
                        allow = true;
                    }
                }
                if (allow) {
                    for (let i = 0; i < req.body[1].players.length; i++) {
                        let div = req.body[1].players[i][0];
                        let player = req.body[1].players[i][1];
                        let divName = response.divisions[div].name;
                        if (response.divisions[div].draftOrder.length > 0) {
                            let isIn = false;
                            for (let j = 0; j < response.divisions[div].draftOrder.length; j++) {
                                let playerInDatabase = response.divisions[div].draftOrder[j];
                                if (playerInDatabase === player) {
                                    isIn = true;
                                }
                            }
                            if (!isIn) {
                                //new Player(player, [], response.totalBudget, [], [], 0)
                                DraftLeague.updateOne({ _id: id, "divisions.name": divName },{ "$push": { "divisions.$.draftOrder": player } })
                                    .then(result => {
                                        
                                        DraftLeague.updateOne({_id: id}, {"$pull": { "registrations": player}})
                                            .then(boop => {
                                                
                                            })
                                            .catch(err => {
                                                console.log(err);
                                            })
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                                
                                DraftLeague.updateOne({_id: id}, {"$push": { "players": new Player(player, [], response.totalBudget, [], [], 0, divName, [])}})
                                    .then(boop => {
                                        
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            }
                        } else {
                            DraftLeague.updateOne({ _id: id, "divisions.name": divName },{ "$push": { "divisions.$.draftOrder": player } })
                                .then(result => {
                                    DraftLeague.updateOne({_id: id}, {"$pull": { "registrations": player}})
                                        .then(boop => {
                                            
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        })
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                            DraftLeague.updateOne({_id: id}, {"$push": { "players": new Player(player, [], response.totalBudget, [], [], 0, divName, [])}})
                                .then(boop => {
                                    
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        }
                        
                    }
                }
            })
        res.send('success');
    }
    else {
        res.send('success');
    }
})

//add sub
app.post('/addSub', (req, res) => {
    let id = req.body[0].id;
    let playerToAdd = req.body[2];
    let playerToReplace = req.body[1];
    DraftLeague.findById(id)
        .then(response => {
            let authorizedUsers = [response.owner];
            let allow = false;
            for (let i = 0; i < response.moderators.length; i++) {
                authorizedUsers.push(response.moderators[i])
            }
            for (let i = 0; i < authorizedUsers.length; i++) {
                if (req.session.user[0].username === authorizedUsers[i]) {
                    allow = true;
                }
            }
            if (allow) {
                let playerObject;
                let divName;
                let draftOrder;
                let matchups;
                for (let i = 0; i < response.players.length; i++) {
                    if (response.players[i].name === playerToReplace) {
                        playerObject = response.players[i];
                        playerObject.name = playerToAdd;
                        divName = playerObject.division;
                        break;
                    }
                }
                for (let i = 0; i < response.divisions.length; i++) {
                    if (response.divisions[i].name === divName) {
                        draftOrder = [...response.divisions[i].draftOrder];
                        break;
                    }
                }
                for (let i = 0; i < draftOrder.length; i++) {
                    if (draftOrder[i] === playerToReplace) {
                        draftOrder[i] = playerToAdd;
                        break;
                    }
                }
                for (let i = 0; i < response.weeks.length; i++) {
                    if (response.weeks[i].name === divName) {
                        matchups = [...response.weeks[i].matchups];
                        break;
                    }
                }
                for (let i = 0; i < matchups.length; i++) {
                    for (let j = 0; j < matchups[i].length; j++) {
                        if (matchups[i][j][1] === playerToReplace) {
                            matchups[i][j][1] = playerToAdd;
                        } else if (matchups[i][j][2] === playerToReplace) {
                            matchups[i][j][2] = playerToAdd;
                        }
                    }
                }
                DraftLeague.updateOne({_id: id}, {"$pull": { "players": {name: playerToReplace}}})
                    .then(boop => {
                        DraftLeague.updateOne({_id: id}, {"$push": { "players": playerObject }})
                            .then(beep => {
                                DraftLeague.updateOne({ _id: id, "divisions.name": divName },{ "$set": { "divisions.$.draftOrder": draftOrder } })
                                    .then(result => {
                                        DraftLeague.updateOne({ _id: id, "weeks.name": divName },{ "$set": { "weeks.$.matchups": matchups } })
                                            .then(result => {
                                                DraftLeague.updateOne({ _id: id },{ "$pull": { "registrations": playerToAdd } })
                                                    .then(result => {
                                                        res.send('success');
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                    })
                                            })
                                            .catch(err => {
                                                console.log(err);
                                            })
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            })
                            .catch(err => {
                                console.log(err);
                            })    
                    })
                    .catch(err => {
                        console.log(err);
                    })             
            }
        })
})

//getPokemon post request
app.post('/getPokemon', (req, res) => {
    DraftLeague.find({_id:{$all: [req.body.id]}})
        .then(result => {
            res.send(result[0].pokemon);
        })
        .catch(err => {
            console.log(err);
        })
})

//update pokemon post request
app.post('/updatePokemon', (req, res) => {
    const id = req.body[0].id;
    const add = req.body[1];
    const del = req.body[2];
    DraftLeague.find({_id: {$all: [id]}})
        .then(response => {
            let authorizedUsers = [response[0].owner];
                let allow = false;
                for (let i = 0; i < response[0].moderators.length; i++) {
                    authorizedUsers.push(response[0].moderators[i])
                }
                for (let i = 0; i < authorizedUsers.length; i++) {
                    if (req.session.user[0].username === authorizedUsers[i]) {
                        allow = true;
                    }
                }
                if (allow) {
                    //delete pokemon
                    for (let i = 0; i < del.length; i++) {
                        DraftLeague.updateOne({_id: id}, {"$pull": { "pokemon": {name: del[i]}}})
                            .then(result => {
                                
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    }
                    //add pokemon
                    for (let i = 0; i < add.length; i++) {
                        DraftLeague.updateOne({_id: id}, {"$push": { "pokemon": add[i] }})
                            .then(result => {

                            })
                            .catch(err => {
                                console.log(err);
                            })
                    }
                    res.send('success');
                }
        })
        .catch(err => {
            console.log(err);
        })
})

//make league mod post request
app.post('/makeLeagueMod', (req, res) => {
    const id = req.body[0].id
    const user = req.body[1]
    DraftLeague.find({_id: {$all: [id]}})
        .then(response => {
            let authorizedUsers = [response[0].owner];
            let allow = false;
            for (let i = 0; i < response[0].moderators.length; i++) {
                authorizedUsers.push(response[0].moderators[i])
            }
            for (let i = 0; i < authorizedUsers.length; i++) {
                if (req.session.user[0].username === authorizedUsers[i]) {
                    allow = true;
                }
            }
            if (allow) {
                DraftLeague.updateOne({_id: id}, {"$push": { "moderators": user }})
                    .then(result => {
                        res.send('success');
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        })
})

//ready for signups post request
app.post('/readyForSignups', (req, res) => {
    const id = req.body.id;
    DraftLeague.find({_id: {$all: [id]}})
        .then(response => {
            if (req.session.user[0].username === response[0].owner) {
                DraftLeague.updateOne({_id: id}, {"$set": { "readyForSignups": true }})
                    .then(result => {
                        res.send('success');
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        })
})

//set private toggle
app.post('/privateToggle', (req, res) => {
    const id = req.body.id;
    DraftLeague.find({_id: {$all: [id]}})
        .then(response => {
            if (req.session.user[0].username === response[0].owner) {
                if (response[0].private) {
                    DraftLeague.updateOne({_id: id}, {"$set": { "private": false }})
                        .then(result => {
                            res.send('success');
                        })
                        .catch(err => {
                            console.log(err);
                        })
                } else {
                    DraftLeague.updateOne({_id: id}, {"$set": { "private": true }})
                        .then(result => {
                            res.send('success');
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
            }
        })
})

//set budget
app.post('/finalizeBudget', (req, res) => {
    const id = req.body[0].id;
    const budget = req.body[1];
    DraftLeague.find({_id: {$all: [id]}})
        .then(response => {
            if (req.session.user[0].username === response[0].owner) {
                DraftLeague.updateOne({_id: id}, {"$set": { "totalBudget": budget }})
                    .then(result => {
                        res.send('success');
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        })
})

//set league start
app.post('/StartDraft', (req, res) => {
    const id = req.body.id;
    DraftLeague.find({_id: {$all: [id]}})
        .then(response => {
            if (req.session.user[0].username === response[0].owner) {
                if (!response[0].draft) {
                    DraftLeague.updateOne({_id: id}, {"$set": { "draft": true }})
                        .then(result => {
                            res.send('success');
                        })
                        .catch(err => {
                            console.log(err);
                        })
                } 
            }
        })
})

//set league start
app.post('/editMonsLimit', (req, res) => {
    const id = req.body[0].id;
    const lowerLimit = req.body[1];
    const upperLimit = req.body[2];
    DraftLeague.find({_id: {$all: [id]}})
        .then(response => {
            if (req.session.user[0].username === response[0].owner) {
                DraftLeague.updateOne({_id: id}, {"$set": { "monsLimit": [lowerLimit, upperLimit] }})
                    .then(result => {

                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        })
    res.send('success')
})

//edit tera info
app.post('/editTeraInfo', (req, res) => {
    const id = req.body[0].id;
    const teraCost = req.body[1];
    const teraLimit = req.body[2];
    DraftLeague.find({_id: {$all: [id]}})
        .then(response => {
            let authorizedUsers = [response[0].owner];
            let allow = false;
            for (let i = 0; i < response[0].moderators.length; i++) {
                authorizedUsers.push(response[0].moderators[i])
            }
            for (let i = 0; i < authorizedUsers.length; i++) {
                if (req.session.user[0].username === authorizedUsers[i]) {
                    allow = true;
                }
            }
            if (allow) {
                DraftLeague.updateOne({_id: id}, {"$set": { "teraCost": teraCost }})
                    .then(result => {
                        
                    })
                    .catch(err => {
                        console.log(err);
                    })
                DraftLeague.updateOne({_id: id}, {"$set": { "teraLimit": teraLimit }})
                    .then(result => {
                        
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        })
    res.send('success');
})

//addWeek
app.post('/addWeek', (req, res) => {
    const id = req.body[0].id;
    const typeWeek = req.body[1];
    DraftLeague.find({_id: {$all: [id]}})
        .then(response => {
            let authorizedUsers = [response[0].owner];
            let allow = false;
            for (let i = 0; i < response[0].moderators.length; i++) {
                authorizedUsers.push(response[0].moderators[i])
            }
            for (let i = 0; i < authorizedUsers.length; i++) {
                if (req.session.user[0].username === authorizedUsers[i]) {
                    allow = true;
                }
            }
            if (allow) {
                let week = [typeWeek, "", "", 0, ""];
                if (typeWeek === "playoff") {
                    week = [[typeWeek, "", "", 0, ""]]
                }
                // Update each weeks matchups array
                for (let i = 0; i < response[0].divisions.length; i++) {  
                    let divName = response[0].divisions[i].name;          
                    DraftLeague.updateOne({ _id: id, "weeks.name": divName },{ "$push": { "weeks.$.matchups": week } })
                        .then(results => {
                            console.log(results)
                        })
                        .catch(err => {
                            console.error(err);
                            res.status(500).send('Internal Server Error');
                        });
                }
            } 
        })
        .catch(err => {
            console.error(err);
        });
        
    res.send('success');
});

//randomize Draft Order
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

app.post('/randomizeDraft', (req, res) => {
    const id = req.body.id
    DraftLeague.find({_id: {$all: [id]}})
        .then(response => {
            let authorizedUsers = [response[0].owner];
            let allow = false;
            for (let i = 0; i < response[0].moderators.length; i++) {
                authorizedUsers.push(response[0].moderators[i])
            }
            for (let i = 0; i < authorizedUsers.length; i++) {
                if (req.session.user[0].username === authorizedUsers[i]) {
                    allow = true;
                }
            }
            if (allow) {
                for (let i = 0; i < response[0].divisions.length; i++) {
                    let newDraftOrder = shuffle(response[0].divisions[i].draftOrder);
                    let divName = response[0].divisions[i].name;
                    DraftLeague.updateOne({ _id: id, "divisions.name": divName },{ "$set": { "divisions.$.draftOrder": newDraftOrder } })
                        .then(result => {
                            
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    DraftLeague.updateOne({ _id: id, "divisions.name": divName },{ "$set": { "divisions.$.currentDrafter": newDraftOrder[0] } })
                        .then(result => {
                            
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
            }
        })
    res.send('success');
})

function generateUniqueMatchups(elements, weeks) {
    let n = elements.length;
    if (n % 2 === 1) {
        elements.push(n);  // Add virtual element
    }
    let all_matchups = []

    for (let round = 1; round < n; round++) {
        let week = [];
        if (round > weeks) {
            break;
        } else {
            for (let i = 0; i < n / 2; i++) {
                week.push(["regular", elements[i], elements[n - i - 1], 0, "", "", ""]);
            }
            elements.splice(1, 0, elements.pop());  // Rotate the elements
        }
        all_matchups.push(week);
    }
    return all_matchups;
}

app.post('/setMatchups', (req, res) => {
    const id = req.body.id
    DraftLeague.find({_id: {$all: [id]}})
        .then(response => {
            if (req.session.user[0].username === response[0].owner) {
                for (let i = 0; i < response[0].divisions.length; i++) {
                    let numWeeks;
                    let matchups = response[0].weeks[0].matchups;
                    for (let i = 0; i < matchups.length; i++) {
                        if (matchups[i][0] === "regular") {
                            numWeeks++
                        } else {
                            break;
                        }
                    }
                    let players = response[0].divisions[i].draftOrder;
                    players = shuffle(players);
                    let overallMatchups = generateUniqueMatchups(players, numWeeks);
                    let divName = response[0].divisions[i].name;
                    
                    DraftLeague.updateOne({ _id: id, "weeks.name": divName },{ "$set": { "weeks.$.matchups": overallMatchups } })
                        .then(result => {
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
            }
        })
    res.send('success');
})

//get MAtchups Info
app.post('/getMatchupInfo', (req, res) => {
    let id = req.body.id;
    DraftLeague.findById(id)
        .then(response => {
            let authorizedUsers = [response.owner];
            let allow = false;
            for (let i = 0; i < response.moderators.length; i++) {
                authorizedUsers.push(response.moderators[i])
            }
            for (let i = 0; i < authorizedUsers.length; i++) {
                if (req.session.user[0].username === authorizedUsers[i]) {
                    allow = true;
                }
            }
            if (allow) {
                let matchupsInfo = []
                for (let i = 0; i < response.weeks.length; i++) {
                    matchupsInfo.push(response.weeks[i].matchups);
                }
                let data = {
                    matchups: matchupsInfo
                }
                res.send(JSON.stringify(data));
            }
        })
        .catch(err => {
            console.log(err);
        })
})

//update MAtchups Info
app.post('/updateMatchups', (req, res) => {
    let id = req.body[0].id;
    let matchups = req.body[1];
    DraftLeague.findById(id)
        .then(response => {
            let authorizedUsers = [response.owner];
            let allow = false;
            for (let i = 0; i < response.moderators.length; i++) {
                authorizedUsers.push(response.moderators[i])
            }
            for (let i = 0; i < authorizedUsers.length; i++) {
                if (req.session.user[0].username === authorizedUsers[i]) {
                    allow = true;
                }
            }
            if (allow) {
                for (let i = 0; i < response.divisions.length; i++) {
                    DraftLeague.updateOne({_id: id, "weeks.name": response.divisions[i].name}, {"$set": { "weeks.$.matchups": matchups[i] }})
                        .then(result => {

                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
            }
        })
        .catch(err => {
            console.log(err);
        })
    res.send('success');
})

app.post('/getDraftInfo', (req, res) => {
    let id = req.body.id;
    DraftLeague.findById(id)
        .then(response => {
            res.send(JSON.stringify(response))
        })
        .catch(err => {
            console.log(err);
        })
})

function reverseArray(arr) {
    return arr.reverse();
}

app.post('/draftMon', (req, res) => {
    let id = req.body[0].id;
    let mon = req.body[1];
    let isTera = req.body[2];
    DraftLeague.findById(id)
        .then(response => {
            for (let i = 0; i < response.divisions.length; i++) {
                if (response.divisions[i].currentDrafter === req.session.user[0].username) {
                    let divName = response.divisions[i].name;
                    //progress the draft order
                    let nextDrafter;
                    let reverseDraft = false;
                    let newDraftOrder;
                    let canDraft = true;

                    for (let j = 0; j < response.divisions[i].draftOrder.length; j++) {
                        if (response.divisions[i].draftOrder[j] === req.session.user[0].username) {
                            nextDrafter = response.divisions[i].draftOrder[j + 1];
                            if (j === response.divisions[i].draftOrder.length-1) {
                                newDraftOrder = reverseArray(response.divisions[i].draftOrder)
                                reverseDraft = true;
                                nextDrafter = newDraftOrder[0];
                            }
                            //make sure player can draft
                            for (let j = 0; j < response.players.length; j++) {
                                if (response.players[j].name === nextDrafter) {
                                    if (response.players[j].budget > 0 && response.players[j].roster.length < response.monsLimit[1]) {
                                        canDraft = true;
                                    } else {
                                        canDraft = false;
                                        console.log(`user ${nextDrafter} cant draft`);
                                    }
                                }
                            }
                            let currentDrafterNum = 0;
                            for (let j = 0; j < response.divisions[i].draftOrder.length; j++) {
                                if (response.divisions[i].draftOrder[j] === nextDrafter) {
                                    currentDrafterNum = j;
                                    break;
                                }
                            }
                            let loops = 0;
                            while (!canDraft) {
                                nextDrafter = response.divisions[i].draftOrder[currentDrafterNum];
                                if (currentDrafterNum === response.divisions[i].draftOrder.length-1) {
                                    newDraftOrder = reverseArray(response.divisions[i].draftOrder)
                                    reverseDraft = true;
                                    nextDrafter = newDraftOrder[0];
                                    currentDrafterNum = 0;
                                } 
                                for (let j = 0; j < response.players.length; j++) {
                                    if (response.players[j].name === nextDrafter) {
                                        if (response.players[j].budget > 0 && response.players[j].roster.length < response.monsLimit[1]) {
                                            canDraft = true;
                                        } 
                                    }
                                }
                                if (!canDraft) {
                                    currentDrafterNum++;
                                }
                                loops++;
                                if (loops > response.divisions[i].draftOrder.length*2) {
                                    DraftLeague.updateOne({_id: id, "divisions.name": divName }, {"$set": { "divisions.$.currentDrafter": "This draft is over" }})
                                        .then(boop => {
                
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        })
                                    break;
                                }
                            }
                        }
                    }
                    let skip = false;
                    if (mon === -1) {
                        canDraft = false;
                        skip = true;
                        //update new drafter/draft order//worked
                        DraftLeague.updateOne({_id: id, "divisions.name": divName }, {"$set": { "divisions.$.currentDrafter": nextDrafter }})
                            .then(boop => {
                                if (reverseDraft) {
                                    DraftLeague.updateOne({_id: id, "divisions.name": divName }, {"$set": { "divisions.$.draftOrder": newDraftOrder }})
                                        .then(boop => {
                                        
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        })
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    }


                    if (canDraft) {
                        //update new drafter/draft order//worked
                        DraftLeague.updateOne({_id: id, "divisions.name": divName }, {"$set": { "divisions.$.currentDrafter": nextDrafter }})
                            .then(boop => {
                                if (reverseDraft) {
                                    DraftLeague.updateOne({_id: id, "divisions.name": divName }, {"$set": { "divisions.$.draftOrder": newDraftOrder }})
                                        .then(boop => {
                                        
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        })
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            })
                        //update player roster//worked
                        DraftLeague.updateOne({_id: id, "players.name": req.session.user[0].username }, {"$push": { "players.$.roster": response.pokemon[mon].name }})
                            .then(boop => {
                                let isDraftedList = [];
                                for (let j = 0; j < response.pokemon[mon].isDrafted.length; j++) {
                                    if (i === j) {
                                        isDraftedList.push(true);
                                    } else {
                                        isDraftedList.push(response.pokemon[mon].isDrafted[j])
                                    }
                                }
                                DraftLeague.updateOne({_id: id, "pokemon.name": response.pokemon[mon].name }, {"$set": { "pokemon.$.isDrafted": isDraftedList }})
                                    .then(boop => {
                                        
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            })
                            .catch(err => {
                                console.log(err);
                            })
                        //get and then update budget
                        let budget;
                        for (let player = 0; player < response.players.length; player++) {
                            if (response.players[player].name === req.session.user[0].username) {
                                budget = response.players[player].budget;
                            }
                        }
                        let newBudget = budget - response.pokemon[mon].cost
                        if (isTera) {
                            newBudget -= 3;
                        }
                        DraftLeague.updateOne({_id: id, "players.name": req.session.user[0].username }, {"$set": { "players.$.budget": newBudget }})
                            .then(boop => {
                                
                            })
                            .catch(err => {
                                console.log(err);
                            })
                        if (isTera && response.pokemon[mon].cost <= response.teraLimit) {
                            DraftLeague.updateOne({_id: id, "players.name": req.session.user[0].username }, {"$push": { "players.$.teraCaps": response.pokemon[mon].name }})
                                .then(boop => {

                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        }
                    } 
                } 
            }
        })
        .catch(err => {
            console.log(err);
        })

    res.send('success');
})

//force skip drafter
app.post('/forceSkip', (req, res) => {
    let id = req.body[0].id;
    DraftLeague.findById(id)
        .then(response => {
            let authorizedUsers = [response.owner];
            let allow = false;
            for (let i = 0; i < response.moderators.length; i++) {
                authorizedUsers.push(response.moderators[i])
            }
            for (let i = 0; i < authorizedUsers.length; i++) {
                if (req.session.user[0].username === authorizedUsers[i]) {
                    allow = true;
                }
            }
            if (allow) {
                let divName = req.body[1];
                let actDivName = response.divisions[divName].name;
                //progress the draft order
                let currentDrafter = response.divisions[divName].currentDrafter;
                let nextDrafter;
                let reverseDraft = false;
                let newDraftOrder;
                let canDraft = true;

                for (let j = 0; j < response.divisions[divName].draftOrder.length; j++) {
                    if (response.divisions[divName].draftOrder[j] === currentDrafter) {
                        nextDrafter = response.divisions[divName].draftOrder[j + 1];
                        if (j === response.divisions[divName].draftOrder.length-1) {
                            newDraftOrder = reverseArray(response.divisions[divName].draftOrder)
                            reverseDraft = true;
                            nextDrafter = newDraftOrder[0];
                            if (nextDrafter === currentDrafter) {
                                nextDrafter = newDraftOrder[1];
                            }
                        }
                        //make sure player can draft
                        for (let j = 0; j < response.players.length; j++) {
                            if (response.players[j].name === nextDrafter) {
                                if (response.players[j].budget > 0 && response.players[j].roster.length < response.monsLimit[1]) {
                                    canDraft = true;
                                } else {
                                    canDraft = false;
                                    console.log(`user ${nextDrafter} cant draft`);
                                }
                            }
                        }
                        let currentDrafterNum = 0;
                        for (let j = 0; j < response.divisions[divName].draftOrder.length; j++) {
                            if (response.divisions[divName].draftOrder[j] === nextDrafter) {
                                currentDrafterNum = j;
                                break;
                            }
                        }
                        let loops = 0;
                        while (!canDraft) {
                            nextDrafter = response.divisions[divName].draftOrder[currentDrafterNum];
                            if (currentDrafterNum === response.divisions[divName].draftOrder.length-1) {
                                newDraftOrder = reverseArray(response.divisions[divName].draftOrder)
                                reverseDraft = true;
                                nextDrafter = newDraftOrder[0];
                                currentDrafterNum = 0;
                            } 
                            for (let j = 0; j < response.players.length; j++) {
                                if (response.players[j].name === nextDrafter) {
                                    if (response.players[j].budget > 0 && response.players[j].roster.length < response.monsLimit[1]) {
                                        canDraft = true;
                                    } 
                                }
                            }
                            if (!canDraft) {
                                currentDrafterNum++;
                            }
                            loops++;
                            if (loops > response.divisions[i].draftOrder.length*2) {
                                DraftLeague.updateOne({_id: id, "divisions.name": divName }, {"$set": { "divisions.$.currentDrafter": "This draft is over" }})
                                    .then(boop => {
            
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                                break;
                            }
                        }
                    }
                }
                if (canDraft) {
                    //update new drafter/draft order//worked
                    DraftLeague.updateOne({_id: id, "divisions.name": actDivName }, {"$set": { "divisions.$.currentDrafter": nextDrafter }})
                        .then(boop => {
                            if (reverseDraft) {
                                DraftLeague.updateOne({_id: id, "divisions.name": actDivName }, {"$set": { "divisions.$.draftOrder": newDraftOrder }})
                                    .then(beep => {

                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
            }
        })
        .catch(err => {
            console.log(err);
        })
    res.send('success');
})

//set league start
app.post('/startLeague', (req, res) => {
    const id = req.body.id;
    DraftLeague.find({_id: {$all: [id]}})
        .then(response => {
            if (req.session.user[0].username === response[0].owner) {
                if (response[0].draft) {
                    DraftLeague.updateOne({_id: id}, {"$set": { "started": true }})
                        .then(result => {
                            DraftLeague.updateOne({_id: id}, {"$set": { "draft": false }})
                                .then(result => {
                                    res.send('success');
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        })
                        .catch(err => {
                            console.log(err);
                        })

                } 
            }
        })
})

//404 page
app.use((req, res) => {
    res.status(404).render('404');
})