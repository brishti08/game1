

let character; 
let dogImage; 
let obstacleImage; 
let backgroundImage; 
let score; 
let gameState; 
let obstacles; 
let gameSound; 

function preload() {
  
  dogImage = loadImage('dog.png');
  obstacleImage = loadImage('obstacle.png');
  backgroundImage = loadImage('background.jpg');
  gameSound = loadSound('gameSound.mp3');
}

function setup() {
  createCanvas(800, 400);
  character = new Character();
  score = 0;
  gameState = 'start';
  obstacles = [];
}

function draw() {
  background(backgroundImage);

  if (gameState === 'start') {
  
    fill(255);
    textAlign(CENTER);
    textSize(32);
    text('Press ENTER to Start', width / 2, height / 2);
  } else if (gameState === 'play') {
 
    character.update();
    character.display();
    updateObstacles();
    displayScore();

    if (character.collided()) {
      gameState = 'end';
      gameSound.play();
    }

    
    score++;
  } else if (gameState === 'end') {

    fill(255);
    textAlign(CENTER);
    textSize(32);
    text('Game Over', width / 2, height / 2);
    textSize(24);
    text('Score: ' + score, width / 2, height / 2 + 40);
    textSize(16);
    text('Press ENTER to Restart', width / 2, height / 2 + 80);
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (gameState === 'start' || gameState === 'end') {
     

      resetGame();
      gameSound.stop();
    }
    if (gameState === 'start') {
      gameState = 'play';
    }
  }
}

function resetGame() {
  score = 0;
  character.reset();
  obstacles = [];
}

function updateObstacles() {

  if (frameCount % 60 === 0) {
    obstacles.push(new Obstacle());
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].display();

 
    if (obstacles[i].offscreen()) {
      obstacles.splice(i, 1);
    }
  }
}

function displayScore() {
  fill(255);
  textAlign(RIGHT);
  textSize(24);
  text('Score: ' + score, width - 20, 30);
}

class Character {
  constructor() {
    this.x = 64;
    this.y = height / 2;
    this.gravity = 0.6;
    this.lift = -15;
    this.velocity = 0;
  }

  update() {
 
    this.velocity += this.gravity;
    this.y += this.velocity;

    this.y = constrain(this.y, 0, height - 100);
  }

  display() {
    image(this.image, this.x, this.y);
  }

  collided() {

    for (let obstacle of obstacles) {
      if (collideRectRect(this.x, this.y,