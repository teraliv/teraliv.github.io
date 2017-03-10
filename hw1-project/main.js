var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

// 1:42:14  Lecture 4
function MushroomDude(game, spritesheet) {
    this.animation = new Animation(spritesheet, 189, 230, 5, 0.10, 14, true, true);
    this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
}

// 1:42:50  Lecture 4
MushroomDude.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

MushroomDude.prototype.update = function () {
    if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
        this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
}

// Man
function Man(game) {
    var spritesWalk = AM.getAsset("./img/man-walk.png");
    var spritesJump = AM.getAsset("./img/man-jump.png");
    this.walkAnimation = new Animation(spritesWalk, 512, 384, 7, 0.05, 31, true, 0.5);
    this.jumpAnimation = new Animation(spritesJump, 512, 384, 7, 0.05, 28, true, 0.5);
    this.x = -200;
    this.speed = 150;
    this.ctx = game.ctx;
    this.jumping = false;
    Entity.call(this, game, 0, 478);
}

Man.prototype = new Entity();
Man.prototype.constructor = Man;

Man.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 470) {
        this.jumping = true;
        this.speed = 350;
    }

    if (this.x > 800) {
        console.log('in here');
        this.jumping = false;
        this.speed = 150;
    }

    if (this.x > 1100) this.x = -200;

    Entity.prototype.update.call(this);
}

Man.prototype.draw = function () {
    if (this.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else {
        this.walkAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

// inheritance
function Cheetah(game, spritesheet) {
    this.animation = new Animation(spritesheet, 512, 256, 2, 0.05, 8, true, 0.5);
    this.speed = 350;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 250);
}

Cheetah.prototype = new Entity();
Cheetah.prototype.constructor = Cheetah;

Cheetah.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
}

Cheetah.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}



AM.queueDownload("./img/RobotUnicorn.png");
AM.queueDownload("./img/guy.jpg");
AM.queueDownload("./img/mushroomdude.png");
AM.queueDownload("./img/runningcat.png");
AM.queueDownload("./img/man-walk.png");
AM.queueDownload("./img/man-jump.png");
AM.queueDownload("./img/bg.jpg");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");  // canvas context

    var gameEngine = new GameEngine();

    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/bg.jpg")));
    // gameEngine.addEntity(cheetah);
    gameEngine.addEntity(new Man(gameEngine));

    console.log("All Done!");
});
