class Fighter {
    constructor(id, maxPower = 10, counterFactor = 1.0) {
        this.elem = $(`#${id}`);
        this.name = $(`#${id} h3.name`).text();
        this.hp = $(`#${id} h3.health`);
        this.power = this.attackPower(maxPower);
        this.counter = this.counterAttackPower(counterFactor);
    }

    attackPower(max = 10, base = 3) {
        return Math.floor(Math.random()*(max-base)) + base;
    }

    counterAttackPower(factor = 1.0) {
        return Math.floor(this.power * factor);
    }

    outOfHealth() {
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

function run(game) {
    $(".charBox").on("click", game, game.setup);
    $("#attack").on("click", game, game.fight);
    $("#restart").hide();
    $("#restart").on("click", game, game.restart);
}

class Game {
    constructor() {
        this.player = null;
        this.enemy = null;
        this.attacker = null;
        this.defender = null;
        this.attackCounter = 0;
        this.isOver = false;
        this.charBoxes = [];
    }

    setup(event) {
        var sectionName = $(this).parent().attr("id");
        console.log($(this).attr("id") + " is clicked");
        console.log("parent: " + $(this).parent().attr("id"));

        if(sectionName === "row"){
            event.data.player = $(this).attr("id");
            console.log("You have selected "+$(this).attr("id"));
            $(this).addClass("charBox-player");
            $(this).appendTo("#player");
            $("#row > .charBox").addClass("charBox-enemy");
            $("#row > .charBox").appendTo("#enemySection");
        }
        else if(sectionName === "enemySection"){
            if(!event.data.enemy){
                event.data.enemy = $(this).attr("id");
                console.log("You have selected " + $(this).attr("id") + " as your opponent");
                $(this).addClass("charBox-defender");
                $(this).appendTo("#defendSection");
            }
        }
    }

    fight(event) {
        var thisFight = event.data;

        if(thisFight.player && !thisFight.attacker) {
            thisFight.attacker = new Fighter(thisFight.player, 10, 1.0);
        }
        if(thisFight.enemy && !thisFight.defender){
            thisFight.defender = new Fighter(thisFight.enemy, 10, 1.0);
        }
        if(!thisFight.attacker || !thisFight.defender || thisFight.isOver) {
            if(!thisFight.attacker){
                $("#msg1").text("Please select your character");
            }
            else if(!thisFight.isOver && !thisFight.defender){
                $("#msg1").text("Please select your opponent");
            }
            return;
        }

        thisFight.attackCounter++;
        var damage = thisFight.attack();
        thisFight.displayMessage(damage);

        if(thisFight.defender.outOfHealth()) {
            thisFight.charBoxes.push(thisFight.defender.elem.detach());
            thisFight.defender = null;
            thisFight.enemy = null;
        }
    }

    attack() {
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

    displayMessage(damage) {
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

    restart(event){
        var thisGame = event.data;
        ['player', 'enemy', 'attacker', 'defender'].forEach(function(e) {
            thisGame[e] = null;
        });
        thisGame.attackCounter = 0;
        thisGame.isOver = false;
        thisGame.clearMsg();
        $("#restart").hide();
        thisGame.resetCharData();
    }

    resetCharData() {
        for(var i=0; i<this.charBoxes.length; i++){
            this.charBoxes[i].appendTo($("#row"));
        }
        $(".charBox").appendTo("#row");
        $(".charBox").removeClass("charBox-player charBox-enemy charBox-defender");
        $(".charBox").addClass("charBox");
        $(".health").each(function(){
            this.innerText = Math.floor(Math.random()*70) + 100;
        });
    }
}