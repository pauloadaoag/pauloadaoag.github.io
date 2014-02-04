var game = new Phaser.Game(500, 600, Phaser.CANVAS, 'gameContainer');
Game = {};



var pipes;
var player;
var cursors;
var platforms;
var scoreText;
var hiScoreText;
var hiScore = 0;
var score = 0;
var nextX = -800;
var pylons = 0;
Game.Play = function(game) { };
Game.Play.prototype = {

  preload: function()  {
    game.load.image('sky', 'img/sky.png');
    game.load.image('pipe', 'img/pipe.png');
    game.load.image('ground', 'img/ground.png');
    game.load.spritesheet('dude', 'img/dude.png', 32, 42);
  },
  update: function(){
    
    var dead = function(){
      game.state.start('Dead');
    }
    game.physics.overlap(player, pipes, dead, null, this);
    game.physics.overlap(player, platforms, dead, null, this);

    pipes.x+= (-3);
    if (pipes.x < nextX){
      nextX = nextX - 300;
      score++;
      scoreText.content = "Score: " + score;
      if (score > hiScore){
        hiScore = score;
        hiScoreText.content = "High Score: " + hiScore;
      }
      pylons++;
      var mid = 150 + rand(300);
      var pipe = pipes.create(300*(pylons+1),mid-100-500, 'pipe');
      var pipe2 = pipes.create(300*(pylons+1),mid+100, 'pipe');
      pipe2.body.immovable = pipe.body.immovable = true;

    
    }

    if (cursors.up.isDown)
    {
      //if (player.body.velocity.y >= 0) player.body.velocity.y = -300;
       player.body.velocity.y = -200;
    }  
  },
  create: function(){
    
    game.add.sprite(0, 0, 'sky');
    score = 0;
    nextX = -800;
    pylons = 0;
    platforms = game.add.group();
    ground = platforms.create(0, game.world.height - 15, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    

    player = game.add.sprite(150,300, 'dude');
    player.body.gravity.y = 12;
    player.body.velocity.x = 0;
    player.body.collideWorldBounds = true;
    player.animations.add('up', [0, 1, 2, 3], 10, true);
    player.animations.add('down', [5, 6, 7, 8], 10, true);

    game.camera.y = 300;
    game.camera.x = 150;
    pipes = game.add.group();
    for (var i = 2; i < 5; i++){
      var mid = 150 + rand(300);
      var pipe = pipes.create(300*(i+1),mid-100-500, 'pipe');
      var pipe2 = pipes.create(300*(i+1),mid+100, 'pipe');
      pipe.body.immovable = true;
      pipe2.body.immovable =  true;
      pylons = i;
    }
    scoreText = game.add.text(16, 16, 'Score: 0', { font: '20px arial', fill: '#000' });
    hiScoreText = game.add.text(16, 46, 'Score: 0', { font: '20px arial', fill: '#000' });
    hiScoreText.content = "High Score: " + hiScore;
    cursors = game.input.keyboard.createCursorKeys();
  }

}


function rand(set){
  return Math.floor(Math.random()*set);
}

Game.Dead = function (game) { };

Game.Dead.prototype = {

  create: function () {
    game.add.text(Math.floor(500/2)+0.5, 50, 'oh no, you died', { font: '20px Arial', fill: '#fff' })
      .anchor.setTo(0.5, 0.5);
    game.add.text(Math.floor(500/2)+0.5, 250, 'Press up arrow to start', { font: '20px Arial', fill: '#fff' })
      .anchor.setTo(0.5, 0.5);
    this.cursor = this.game.input.keyboard.createCursorKeys();

  },

  update: function() {
    if (this.cursor.up.isDown)
      game.state.start('Play');
  }

};

Game.Init = function (game) { };

Game.Init.prototype = {

  create: function () {
    
    game.add.text(Math.floor(500/2)+0.5, 250, 'Press up arrow to start', { font: '20px Arial', fill: '#fff' })
      .anchor.setTo(0.5, 0.5);
    this.cursor = this.game.input.keyboard.createCursorKeys();

  },

  update: function() {
    if (this.cursor.up.isDown)
      game.state.start('Play');
  }

};


game.state.add('Init' , Game.Init);
game.state.add('Dead' , Game.Dead);
game.state.add('Play' , Game.Play);

//game.state.add('Start', Game.Start);

game.state.start('Init')