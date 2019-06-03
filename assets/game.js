class Fighter { //fighter class tracks data for player and enemy characters
    constructor(id, maxPower = 10, counterFactor = 1.0) { //creates object for fighter class
        this.elem = $(`#${id}`);
        this.name = $(`#${id} h3.name`).text();
        this.hp = $(`#${id} h3.health`);
        this.power = this.attackPower(maxPower);
        this.counter = this.counterAttackPower(counterFactor);
    }

    attackPower(max = 10, base = 3) {//sets attack power
        return Math.floor(Math.random()*(max-base)) + base;
    }

    counterAttackPower(factor = 1.0) {//sets counter attack
        return Math.floor(this.power * factor);
    }

    outOfHealth() {//ensures the lowest possible hp amount is 0
        if(this.healthPoints < 0) {
            this.healthPoints = 0;
        }
        return (this.healthPoints === 0);
    }

    set healthPoints(point){
        this.hp.text(point);
    }
    
    get healthPoints() {
        return parseInt(this.hp.text());
    }
}

function run(game) { //this function ensures our mouse clicks pass on to different functions within the game class
    $(".charBox").on("click", game, game.setup);
    $("#attack").on("click", game, game.fight);
    $("#restart").hide();
    $("#restart").on("click", game, game.restart);
}

class Game { //game class contains class object vars, functions to pass div elems around page and battle logic
    constructor() {//class object vars
        this.player = null;
        this.enemy = null;
        this.attacker = null;
        this.defender = null;
        this.attackCounter = 0;
        this.isOver = false;
        this.charBoxes = [];
    }

    setup(event) { //this function places characters based on player choice
        var sectionName = $(this).parent().attr("id"); //checks parent id for this
        console.log($(this).attr("id") + " is clicked"); //runs location of this in console log
        console.log("parent: " + $(this).parent().attr("id")); //runs parent location for this in console log

        if(sectionName === "row"){ //chooses player char based on mouse click
            event.data.player = $(this).attr("id"); //sets event data for player
            console.log("You have selected "+$(this).attr("id"));
            $(this).addClass("charBox-player");
            $(this).appendTo("#player");
            $("#row > .charBox").addClass("charBox-enemy"); //carrot chooses specific child class within parent row div
            $("#row > .charBox").appendTo("#enemySection");
        }
        else if(sectionName === "enemySection"){ //sets opponent char based on mouse click
            if(!event.data.enemy){ //sets event data for opponent char if there is not one already
                event.data.enemy = $(this).attr("id");
                console.log("You have selected " + $(this).attr("id") + " as your opponent");
                $(this).addClass("charBox-defender");
                $(this).appendTo("#defendSection");
            }
        }
    }

    fight(event) { //
        var thisFight = event.data;

        if(thisFight.player && !thisFight.attacker) {//creates new fighter obj for player based on fighter class
            thisFight.attacker = new Fighter(thisFight.player, 10, 1.0);
        }
        if(thisFight.enemy && !thisFight.defender){//creates new fighter obj for opponent based on fighter class
            thisFight.defender = new Fighter(thisFight.enemy, 10, 1.0);
        }
        if(!thisFight.attacker || !thisFight.defender || thisFight.isOver) {//creates messages if fight is missing a player/opponent or is over
            if(!thisFight.attacker){
                $("#msg1").text("Please select your character");
            }
            else if(!thisFight.isOver && !thisFight.defender){
                $("#msg1").text("Please select your opponent");
            }
            return;
        }

        thisFight.attackCounter++;//increases attack on button click
        var damage = thisFight.attack();
        thisFight.displayMessage(damage);//displays damage based on attack function

        if(thisFight.defender.outOfHealth()) {//this clears section if opponent health reaches 0
            thisFight.charBoxes.push(thisFight.defender.elem.detach());
            thisFight.defender = null;
            thisFight.enemy = null;
        }
    }

    attack() {//this function contains battle logic, makes tracking fight data easier
        var damage = this.attacker.power * this.attackCounter;
        this.defender.healthPoints -= damage;

        if(!this.defender.outOfHealth()){
            this.attacker.healthPoints -= this.defender.counter;
            if(this.attacker.outOfHealth()){
                this.isOver = true;
            }
        }
        return damage;
    }

    displayMessage(damage) { //displays game messages for during fight and for win/loss
        this.clearMsg();
        if(this.defender.outOfHealth()) {
            if (this.remainingEnemies() === 0){
                $("#msg1").text("You win!");
                $("#restart").show();
                this.isOver = true;
            }
            else{
                $("#msg1").text(`You have defeated ${this.defender.name}. You may choose another opponent.`)
            }
        }
        else if (this.attacker.outOfHealth()){
            $("#msg1").text("You have been defeated. Game over...");
            $("#restart").show();
            this.isOver = true;
        }
        else {
            $("#msg1").text(`You attacked ${this.defender.name} for ${damage} damage.`);
            $("#msg2").text(`${this.defender.name} attacked you back for ${this.defender.counter} damage.`);
        }
    }

    clearMsg(){
        $("#msg1").text("");
        $("#msg2").text("");
    }

    remainingEnemies(){
        return $("#enemySection > .charBox").length;
    }

    restart(event){//avoids using location.reload() to restart game
        var thisGame = event.data;
        ['player', 'enemy', 'attacker', 'defender'].forEach(function(e) {
            thisGame[e] = null;//clears event data from selected chars
        });
        thisGame.attackCounter = 0; //155-159 resets obj vars & hides restart button
        thisGame.isOver = false;
        thisGame.clearMsg();
        $("#restart").hide();
        thisGame.resetCharData();
    }

    resetCharData() {//places chars back in original position/removes classes/randomizes health for new games
        for(var i=0; i<this.charBoxes.length; i++){
            this.charBoxes[i].appendTo($("#row"));
        }//places anything in charBoxes array (defined in game class) back into row
        $(".charBox").appendTo("#row");
        $(".charBox").removeClass("charBox-player charBox-enemy charBox-defender");
        $(".charBox").addClass("charBox");
        $(".health").each(function(){//randomizes char hp following restart
            this.innerText = Math.floor(Math.random()*70) + 100;
        });
    }
}