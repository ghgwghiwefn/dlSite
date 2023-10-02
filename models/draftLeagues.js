const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const draftLeagueSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    leagueDiscord: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    moderators: {
        type: Array,
        required: true
    },
    registrations: {
        type: Array,
        required: true
    },
    players: {
        type: Array,
        required: true
    },
    totalBudget: {
        type: Number,
        required: true
    },
    divisions: {
        type: Array,
        required: true
    },
    weeks: {
        type: Array,
        required: true
    },
    pokemon: {
        type: Array,
        required: true
    },
    started: {
        type: Boolean,
        required: true
    },
    draft: {
        type: Boolean,
        required: true
    },
    monsLimit: {
        type: Array, //[minumum # of mons, maximum # of mons]
        required: true
    },
    readyForSignups: {
        type: Boolean,
        required: true
    },
    private: {
        type: Boolean,
        required: true
    },
    finished: {
        type: Boolean,
        required: true
    },
    teraCost: {
        type: Number,
        required: true
    },
    teraLimit: {
        type: Number,
        required: true
    },
    currentWeek: {
        type: Number,
        required: true
    }
})

const DraftLeague = mongoose.model('draft-leagues', draftLeagueSchema);
module.exports = DraftLeague;