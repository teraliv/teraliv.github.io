
var socket = io.connect("http://76.28.150.193:8888");

var game;
var group;
var leader;
var tint = 0x2ae03b;
// var loadedData;
var game = new Phaser.Game(1200, 700, Phaser.CANVAS, 'playground', { preload: preload, create: create, update: update });

socket.on("load", function (data) {
    console.log('loaded data');
    console.log(data);
    loadState(data.data);
});

function preload() {
    game.load.image('map', './assets/map-bg.png');
	game.load.spritesheet('infantry', './assets/infantry.png', 76, 97);
    // uncomment to prevent context menu
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
}

function create() {
    game.add.tileSprite(0, 0, 1200, 700, 'map');
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

    saveKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    loadKey = game.input.keyboard.addKey(Phaser.Keyboard.L);
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

    if (saveKey.isDown) {
        var data = saveState();
        console.log('Saved data: ' + data);
        socket.emit("save", {studentname: "Alex Terikov", statename: "gamestate-001", data});
    }
    else if (loadKey.isDown) {
        socket.emit("load", { studentname: "Alex Terikov", statename: "gamestate-001"});
        // loadState();
    }
}

function createBaddie() {

    for (var i = 0; i < 10; i++) {
        // var player = game.add.sprite(x, y, 'infantry');
        var player = group.create(100 + Math.random() * 1200, 50 + Math.random() * 700, 'infantry');
        group.add(player);
        player.destination = {x: null, y: null};
        player.speed = getRandomInt(10, 50);
        // console.log(player.speed);

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

function saveState() {
    var state = {
        leader: {
            position: {x: leader.x, y: leader.y},
            destination: {x: leader.destination.x, y: leader.destination.y},
            speed: leader.speed
        },
        player1: {
            position: {x: group.getChildAt(0).x, y: group.getChildAt(0).y},
            destination: {x: group.getChildAt(0).destination.x, y: group.getChildAt(0).destination.y},
            speed: group.getChildAt(0).speed
        },
        player2: {
            position: {x: group.getChildAt(1).x, y: group.getChildAt(1).y},
            destination: {x: group.getChildAt(1).destination.x, y: group.getChildAt(1).destination.y},
            speed: group.getChildAt(1).speed
        },
        player3: {
            position: {x: group.getChildAt(2).x, y: group.getChildAt(2).y},
            destination: {x: group.getChildAt(2).destination.x, y: group.getChildAt(2).destination.y},
            speed: group.getChildAt(2).speed
        },
        player4: {
            position: {x: group.getChildAt(3).x, y: group.getChildAt(3).y},
            destination: {x: group.getChildAt(3).destination.x, y: group.getChildAt(3).destination.y},
            speed: group.getChildAt(3).speed
        },
        player5: {
            position: {x: group.getChildAt(4).x, y: group.getChildAt(4).y},
            destination: {x: group.getChildAt(4).destination.x, y: group.getChildAt(4).destination.y},
            speed: group.getChildAt(4).speed
        },
        player6: {
            position: {x: group.getChildAt(5).x, y: group.getChildAt(5).y},
            destination: {x: group.getChildAt(5).destination.x, y: group.getChildAt(5).destination.y},
            speed: group.getChildAt(5).speed
        },
        player7: {
            position: {x: group.getChildAt(6).x, y: group.getChildAt(6).y},
            destination: {x: group.getChildAt(6).destination.x, y: group.getChildAt(6).destination.y},
            speed: group.getChildAt(6).speed
        },
        player8: {
            position: {x: group.getChildAt(7).x, y: group.getChildAt(7).y},
            destination: {x: group.getChildAt(7).destination.x, y: group.getChildAt(7).destination.y},
            speed: group.getChildAt(7).speed
        },
        player9: {
            position: {x: group.getChildAt(8).x, y: group.getChildAt(8).y},
            destination: {x: group.getChildAt(8).destination.x, y: group.getChildAt(8).destination.y},
            speed: group.getChildAt(8).speed
        },
        player10: {
            position: {x: group.getChildAt(9).x, y: group.getChildAt(9).y},
            destination: {x: group.getChildAt(9).destination.x, y: group.getChildAt(9).destination.y},
            speed: group.getChildAt(9).speed
        }

    };

    return state;
}

function loadState(state) {

    // load the state of agents from Dr. Marriott's database
    // leader
    leader.position.x = state.leader.position.x;
    leader.position.y = state.leader.position.y;
    leader.destination.x = state.leader.destination.x;
    leader.destination.y = state.leader.destination.y;
    leader.speed = state.leader.speed;

    // player 1
    group.getChildAt(0).x = state.player1.position.x;
    group.getChildAt(0).y = state.player1.position.y;
    group.getChildAt(0).destination.x = state.player1.destination.x;
    group.getChildAt(0).destination.y = state.player1.destination.y;
    group.getChildAt(0).speed = state.player1.speed;

    // player 2
    group.getChildAt(1).x = state.player2.position.x;
    group.getChildAt(1).y = state.player2.position.y;
    group.getChildAt(1).destination.x = state.player2.destination.x;
    group.getChildAt(1).destination.y = state.player2.destination.y;
    group.getChildAt(1).speed = state.player2.speed;

    // player 2
    group.getChildAt(2).x = state.player3.position.x;
    group.getChildAt(2).y = state.player3.position.y;
    group.getChildAt(2).destination.x = state.player3.destination.x;
    group.getChildAt(2).destination.y = state.player3.destination.y;
    group.getChildAt(2).speed = state.player3.speed;

    // player 3
    group.getChildAt(3).x = state.player4.position.x;
    group.getChildAt(3).y = state.player4.position.y;
    group.getChildAt(3).destination.x = state.player4.destination.x;
    group.getChildAt(3).destination.y = state.player4.destination.y;
    group.getChildAt(3).speed = state.player4.speed;

    // player 4
    group.getChildAt(4).x = state.player5.position.x;
    group.getChildAt(4).y = state.player5.position.y;
    group.getChildAt(4).destination.x = state.player5.destination.x;
    group.getChildAt(4).destination.y = state.player5.destination.y;
    group.getChildAt(4).speed = state.player5.speed;

    // player 5
    group.getChildAt(5).x = state.player6.position.x;
    group.getChildAt(5).y = state.player6.position.y;
    group.getChildAt(5).destination.x = state.player6.destination.x;
    group.getChildAt(5).destination.y = state.player6.destination.y;
    group.getChildAt(5).speed = state.player6.speed;

    // player 6
    group.getChildAt(6).x = state.player7.position.x;
    group.getChildAt(6).y = state.player7.position.y;
    group.getChildAt(6).destination.x = state.player7.destination.x;
    group.getChildAt(6).destination.y = state.player7.destination.y;
    group.getChildAt(6).speed = state.player7.speed;

    // player 7
    group.getChildAt(7).x = state.player8.position.x;
    group.getChildAt(7).y = state.player8.position.y;
    group.getChildAt(7).destination.x = state.player8.destination.x;
    group.getChildAt(7).destination.y = state.player8.destination.y;
    group.getChildAt(7).speed = state.player8.speed;

    // player 8
    group.getChildAt(8).x = state.player9.position.x;
    group.getChildAt(8).y = state.player9.position.y;
    group.getChildAt(8).destination.x = state.player9.destination.x;
    group.getChildAt(8).destination.y = state.player9.destination.y;
    group.getChildAt(8).speed = state.player9.speed;

    // player 9
    group.getChildAt(9).x = state.player10.position.x;
    group.getChildAt(9).y = state.player10.position.y;
    group.getChildAt(9).destination.x = state.player10.destination.x;
    group.getChildAt(9).destination.y = state.player10.destination.y;
    group.getChildAt(9).speed = state.player10.speed;

}
