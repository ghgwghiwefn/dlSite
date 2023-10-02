//player constructor
function Player(name, roster, budget, wins, losses, differential, division, teraCaps){
    this.name = name;
    this.roster = roster;
    this.budget = budget;
    this.wins = wins;
    this.losses = losses;
    this.differential = differential;
    this.division = division;
    this.teraCaps = teraCaps;
}

module.exports = Player;