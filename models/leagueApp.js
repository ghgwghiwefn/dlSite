const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leagueAppSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    leagueDiscord: {
        type: String,
        required: true
    },
    divisions: {
        type: Array,
        required: true
    },
    status: {
        type: "string",
        required: true
    }

})

const LeagueApp = mongoose.model('league-app', leagueAppSchema);
module.exports = LeagueApp;