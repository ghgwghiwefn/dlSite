//pokemon constructor
function Weeks(name, matchups){
    this.name = name;//week number
                            //[][]
    this.matchups = matchups;//[[typeof, player1, player2, whoWon, replay1, replay2, replay3]]
}

module.exports = Weeks;