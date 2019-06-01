// we have four choices in the fighters div. each choice has hp, attack, counter set vars.
// when a player chooses their fighter, the remaining choices move into the enemies available div.
// the player then chooses an enemy. their fighter and the enemy fighter move into the fight box div.

// game has five vars: hp, attack, counter, wins, losses
// health is constant. counter is constant. attack +6 on each button press. wins++ loss++ based on game result.

// once fighter and enemy are in fight box, attack button pops up
//  attack button: takes attack var and subtracts it from enemy hp, 
//                 takes counter var and subtracts from player hp.

// if enemy hp reaches zero, player chooses new enemy. game function runs again.
// this happens until no enemies are left. at that point, player wins. wins counter increases. game resets.
// if player hp reaches zero, player loses. loss counter increases. game resets.

// we will need game function, reset function, div mover function? (so at least two)
// first let's get the character divs on the page and see if we can't move them around

var char = {
    name: "Fighter 1",
    hp: 1000,
    attack: 60,
    counter: 120
};

var charTwo = {
    name: "Fighter 2",
    hp: 1000,
    attack: 80,
    counter: 110
};

var charThree = {
    name: "Fighter 3",
    hp: 800,
    attack: 90,
    counter: 120
};

var charFour = {
    name: "Fighter 4",
    hp: 1200,
    attack: 90,
    counter: 150
};

var enemies = $("#enemiesAvailable");
var fight = $("#fightBox");
var oppo = $("#defenderArea");

function restartGame(){
    location.reload();
}

$(document).ready(function(){
    var guy1 = $("#firstGuy");
    guy1.text(char.name);
    guy1.append("<br><img src='assets/images/ben_kenobi.png' style='width:70%;height:70%;'></img><br>")
    guy1.append(char.hp);

    var guy2 = $("#secondGuy");
    guy2.text(charTwo.name);
    guy2.append("<br><img src='assets/images/windu.jpg' style='width:70%;height:70%;'></img><br>")
    guy2.append(charTwo.hp);

    var guy3 = $("#thirdGuy");
    guy3.text(charThree.name);
    guy3.append("<br><img src='assets/images/yoda.jpg' style='width:70%;height:70%;'></img><br>")
    guy3.append(charThree.hp);

    var guy4 = $("#fourthGuy");
    guy4.text(charFour.name);
    guy4.append("<br><img src='assets/images/vader.jpg' style='width:70%;height:70%;'></img><br>")
    guy4.append(charFour.hp);

    guy1.click(function(){
        enemies.append(guy2);
        enemies.append(guy3);
        enemies.append(guy4);
    });
    
    if(enemies !== -1){
        guy2.click(function(){
            oppo.append(guy2);
        });
        guy3.click(function(){
            oppo.append(guy3);
        });
        guy4.click(function(){
            oppo.append(guy4);
        });
    }

});