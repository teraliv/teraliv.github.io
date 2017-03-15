var game;
var group;
var leader;
var tint = 0x2ae03b;
var game = new Phaser.Game(1200, 700, Phaser.CANVAS, 'playground', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('map', './assets/map-bg.png');
	game.load.spritesheet('infantry', './assets/infantry.png', 76, 97);
    // uncomment to prevent context menu
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
}

function create() {
    // game.stage.backgroundColor = "#4488AA";
    game.add.tileSprite(0, 0, 1200, 700, 'map');

    // game.add.sprite(300, 300, 'infantry');
    // var canoe = game.add.sprite(0, 0, 'canoe');
    game.physics.startSystem(Phaser.Physics.ARCADE);


    group = game.add.group();
    group.enableBody = true;

    // create leader
    leader = game.add.sprite(300, 200, 'infantry');
    addAnimation(leader);
    leader.animations.play('STAND');
    leader.destination = {x: 400, y: 600};
    leader.tint = 0x214afa;
    leader.speed = 70;
    game.physics.arcade.enable(leader);

    createBaddie();
}

function update() {

    playAnimation(leader);
    getDestinationPoint();

    for (var i = 0; i < group.children.length; i++) {
        var player = group.children[i];
        player.destination.x = leader.centerX;
        player.destination.y = leader.centerY;

        playAnimation(player);
    }
}

function createBaddie() {

    for (var i = 0; i < 20; i++) {
        // var player = game.add.sprite(x, y, 'infantry');
        var player = group.create(100 + Math.random() * 1200, 50 + Math.random() * 700, 'infantry');
        group.add(player);
        player.destination = {x: null, y: null};
        player.speed = getRandomInt(10, 50);
        console.log(player.speed);

        addAnimation(player);
        player.animations.play('STAND');
    }

}

function addAnimation (player) {
    player.animations.add('E',  [38, 39, 40, 41, 42, 43], 10, true);
    player.animations.add('W',  [25, 24, 23, 22, 21, 20], 10, true);
    player.animations.add('N',  [8, 9, 10, 11, 12, 13],   10, true);
    player.animations.add('S',  [32, 33, 34, 35, 36, 37], 10, true);
    player.animations.add('NE', [50, 51, 52, 53, 54, 55], 10, true);
    player.animations.add('NW', [19, 18, 17, 16, 15, 14], 10, true);
    player.animations.add('SW', [26, 27, 28, 29, 30, 31], 10, true);
    player.animations.add('SE', [38, 39, 40, 41, 42, 43], 10, true);
    player.animations.add('STAND', [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85], 10, true);
}


function playAnimation(player) {

    player.angle = game.physics.arcade.moveToXY(player, player.destination.x - 38, player.destination.y - 48.5, player.speed);


    // Swith sprite animations
	if (player.angle >= -0.3 && player.angle <= 0.3) {
		player.animations.play('E');
	}
	else if (player.angle > 0.3 && player.angle <= 1.2) {
		player.animations.play('SE');
	}
	else if (player.angle > 1.2 && player.angle <= 1.9) {
		player.animations.play('S');
	}
	else if (player.angle > 1.9 && player.angle <= 2.7) {
		player.animations.play('SW');
	}
	else if (player.angle > 2.7 && player.angle <= Math.PI) {
		player.animations.play('W');
	}
	else if ( (player.angle >= (Math.PI * -1) ) && player.angle <= -2.8) {
		player.animations.play('W');
	}
	else if (player.angle > -2.8 && player.angle <= -1.9) {
		player.animations.play('NW');
	}
	else if (player.angle > -1.9 && player.angle <= -1.3) {
		player.animations.play('N');
	}
	else if (player.angle > -1.3 && player.angle < -0.3) {
		player.animations.play('NE');
	}



}


function getDestinationPoint() {
    var differenceX = Math.abs(leader.destination.x - leader.centerX);
	var differenceY = Math.abs(leader.destination.y - leader.centerY);

    // Once at destination, create a new destination point
	if ( (differenceX <= 2) && (differenceY <= 2) ) {
        leader.destination.x = getRandomInt(0, 1200);
        leader.destination.y = getRandomInt(0, 700);
	}
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
