//face tracking library used from here https://github.com/stc/face-tracking-p5js

let obstacles, n;
let player;
let lives;
let waitTime;

function setup() {
  loadCamera();
  loadTracker();
  loadCanvas(700, 500);

  n = 3;
  lives = 5;
  waitTime = 0;

  obstacles = [];
  player = new Player();

  for (let i = 0; i < n; i++) {
    append(
      obstacles,
      new Barrier(random(width / 2, width), random(50, (height * 3) / 4))
    );
  }
}

function draw() {
  // getPositions();
  getEmotions();
  // background(200, 80);

  clear();

  background(200);

  //at the start of the game, hint at what the player is supposed to do
  if (millis() < 10000) {
    text("SMILE!!!", width / 2, height / 2);
  }
  // noStroke();

  //log lives remaining
  heart(width * 0.9, 20, 30);
  // textAlign(CENTER);
  textSize(20);
  text(lives, width * 0.95, 40);

  //draw foreground
  drawGround();
  // drawBackdrop();

  //control y-axis position of player based on amount of smile
  if (emotions && predictedEmotions.length == 4) {
    player.updateY(
      map(predictedEmotions[3].value, -0.065, 1, (height * 3) / 4, 50)
    );
  }

  //draw and update player
  player.drawPlayer();
  player.update();
  // console.log("player: " + player.y);

  //draw all barriers
  for (let i = 0; i < n; i++) {
    obstacles[i].drawBarrier();
    obstacles[i].update();
    if (i == 0) {
      // console.log("obs: " + obstacles[i].y);
      // console.log("player: " + player.y);
    }
    if (
      waitTime == 0 &&
      dist(obstacles[i].x, obstacles[i].y, player.x, player.y) < 30
    ) {
      lives--;
      // processLostLife();
      waitTime = 10;
    }
  }

  //Send different messages based on life lost + how many
  if (waitTime < 0) {
    waitTime = 0;
  } else if (waitTime > 0) {
    textAlign(CENTER);
    if (lives > 0) text("UH OH", width / 2, height * 0.85);
    else if (lives == 0) text("No More Lives", width / 2, height * 0.85);
    else if (lives > -5)
      text("Eh Who Cares Keep Going", width / 2, height * 0.85);
    else if (lives > -10)
      text("Playing the Opposite Way?", width / 2, height * 0.85);
    else if (lives > -20) text("I'm Impressed", width / 2, height * 0.85);
    else if (lives <= -20) {
      text("You do You!", width / 2, height * 0.85);
    }
    waitTime--;
  }
  // console.log(waitTime);
}

// function processLostLife(){
//   text("UH OH", width/2, height/2);
// }

// function drawBackdrop(){
//   for (var i = 0; i < tree)
// }

//Game ground
function drawGround() {
  strokeWeight(3);
  line(0, (height * 3) / 4, width, (height * 3) / 4);
  line(0, (height * 3) / 4 + 3, width, (height * 3) / 4 + 3);
}

//Represents the player moving in 2D
class Player {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.rate = 1;
  }

  update() {
    this.x = (this.x + this.rate) % width;
    // this.y = mouseY;
  }

  updateY(newY) {
    this.y = newY;
  }

  getY() {
    return this.y;
  }

  drawPlayer() {
    fill(color("white"));
    rect(this.x, this.y, 30, 30);
  }
}

//Barriers floating by
class Barrier {
  constructor(x = width, y = height / 2) {
    this.x = x; //width; // - 10;
    this.y = y; //height / 2;
    this.rate = -5;
  }

  update() {
    this.x = this.x < 0 ? width : this.x + this.rate;
    if (this.x < 0) {
      this.rate = random(-5, -10);
    }
    if (frameCount % 10 == 0) {
      this.delta = random(20, -20);
    if (this.y + this.delta < 0 || this.y + this.delta > (height * 3) / 4) {
      this.y += -this.delta;
    }
    else{
      this.y += this.delta;
    }
    // this.y = mouseY;
  }}

  drawBarrier() {
    fill(color("red"));
    rect(this.x, this.y, 30, 30);
  }
}

//Heart shape for lives
//from https://editor.p5js.org/Mithru/sketches/Hk1N1mMQg
function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}
