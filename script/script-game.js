 "use strict";

let canvas, canvasContext;

const game = {
  playButton: $("#start"),
  pauseButton: $("#pause"),
  stopButton: $("#stop"),
};
    
// Bricks
const BRICK_W = 200;
const BRICK_H = 45;
const BRICK_GAP = 7;
const BRICK_COLS = 7;
const BRICK_ROWS = 6;
var brickGrid = new Array(BRICK_COLS*BRICK_ROWS);
var brickCount = 0;
let score = 0;
let lives = 2;

// Ball
let ballX = 75;
let ballSpeedX = 8;
let ballY = 75;
let ballSpeedY = 8;

// Main Paddle
let paddleX = 5;
const PADDLE_THICKNESS = 55;
let PADDLE_WIDTH = 350;
const PADDLE_DIST_FROM_EDGE = 20;
  
// Move
let mouseX = 0;
let mouseY = 0;
let moveLeft = false;
let moveRight = false;

/***********************************
* Utility Functions
************************************/
let intervalId=null;
let framesPerSecond = 30;
const WIN_PAGE_URL = "index-win.html"
const LOSE_PAGE_URL = "index-gameover.html"

function redirectPage (url){
  window.location.href = url+"?difficulty="+getParameterFromUrl('difficulty');
}


const gameMusic = document.getElementById('my_audio-id');

gameMusic.play();

let audio = document.getElementById('my_audio-id');
audio.volume = 0.6; 


/**********
General GamePlay
***********/

window.onload = function(){
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  setup();
  // intervalId = setInterval(updateAll, 1000/framesPerSecond);
  brickReset();
  ballRest();
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  document.getElementById('main').addEventListener('mousemove', updateMousePos);
  updateAll();
}

function updateAll(){
  playArea();
  movement();
  updateScore();
  updateLives();
}

function handleKeyDown(event) {
  if (event.key === 'ArrowLeft' || event.key === 'Left') {
    moveLeft = true;
  } else if (event.key === 'ArrowRight' || event.key === 'Right') {
    moveRight = true;
  }
}

function handleKeyUp(event) {
  if (event.key === 'ArrowLeft' || event.key === 'Left') {
    moveLeft = false;
  } else if (event.key === 'ArrowRight' || event.key === 'Right') {
    moveRight = false;
  }
}

function ballRest(){
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

function brickReset() {
    brickCount = 0;
    for (var i = 0; i < BRICK_COLS * BRICK_ROWS; i++) {
      brickGrid[i] = true;
      brickCount++;
    }
  }

  

function ballMove(){
  // ballMovement
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  // ballY
  if(ballY > canvas.height){
    losefunc();

  } else if(ballY < 0 && ballSpeedY < 0.0){
    ballSpeedY = -ballSpeedY;
  }
  // ballx
  if(ballX > canvas.width && ballSpeedX > 0.0){
    ballSpeedX = -ballSpeedX;
  } else if(ballX < 0 && ballSpeedX < 0.0){
    ballSpeedX = -ballSpeedX;
  }
}

function isBrickAtColRow(col, row){
  if (col >= 0 && col < BRICK_COLS &&
      row >= 0 && row < BRICK_ROWS) {
    var brickIndexUnderCoord= rowColToArrayIndex(col, row);
    return brickGrid[brickIndexUnderCoord];
  } else{
    return false;
  }
}

function ballBrickColl(){
  var ballBrickCol = Math.floor(ballX / BRICK_W);
  var ballBrickRow = Math.floor(ballY / BRICK_H);
  var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);
  if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS){
    if (isBrickAtColRow(ballBrickCol, ballBrickRow)) {
      brickGrid[brickIndexUnderBall] = false;
      brickCount--;
      score += 10;

      if (brickCount == 0 )
          redirectPage(WIN_PAGE_URL);

      var prevBallX = ballX - ballSpeedX;
      var prevBallY = ballY - ballSpeedY;
      var prevBrickCol = Math.floor(prevBallX / BRICK_W);
      var prevBrickRow = Math.floor(prevBallY / BRICK_H);


      var bothTestFailed = true;

      if(prevBrickCol != ballBrickCol){
        if(isBrickAtColRow(prevBrickCol, ballBrickRow) == false){
          ballSpeedX = -ballSpeedX;
          bothTestFailed = false;
          playVoice('brickAudio-id');
        }
      }


      if(prevBrickRow != ballBrickRow){
        if (isBrickAtColRow(ballBrickCol, prevBrickRow) == false) {
          ballSpeedY = -ballSpeedY;
          bothTestFailed = false;
          playVoice('brickAudio-id');
        }
      }

      if(bothTestFailed){
        ballSpeedX = -ballSpeedX;
        ballSpeedY = -ballSpeedY;
        playVoice('brickAudio-id');
      }
      
      
    }
    
  }
  // colorText(ballBrickCol+","+ballBrickRow+": "+brickIndexUnderBall, mouseX, mouseY, 'white');
}


function playVoice (elementToPlay){
  let brickAudio = document.getElementById(elementToPlay);
  brickAudio.volume = 0.5; // Set the volume to 50%
  brickAudio.loop = false; // Disable audio looping
  brickAudio.currentTime = 0;
  brickAudio.play();
}

function paddleMove() {
    // Paddle movement with keyboard controls
    if (moveLeft && paddleX > 0) {
      paddleX -= 50; // Adjust the paddle movement speed as needed
    } else if (moveRight && paddleX + (PADDLE_WIDTH/1.3) < canvas.width) {
      paddleX += 50; // Adjust the paddle movement speed as needed
    }
  
    // Collision detection with the ball
    var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
    var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
    var paddleLeftEdgeX = paddleX;
    var paddleRightEdgeX = paddleX + PADDLE_WIDTH;
  
    if (
      ballY > paddleTopEdgeY && // top of paddle
      ballY < paddleBottomEdgeY && // bottom of paddle
      ballX > paddleLeftEdgeX && // left half of paddle
      ballX < paddleRightEdgeX // right half of paddle
    ) {
        ballSpeedY = -ballSpeedY;
    
        var paddleCenterX = paddleX + PADDLE_WIDTH / 2;
        var ballDistFromCenterX = ballX - paddleCenterX;
        ballSpeedX = ballDistFromCenterX * 0.15;
  
        if (brickCount == 0) {
          redirectPage(WIN_PAGE_URL);
        }
        playVoice('paddleBall-id');
    }
  }
  
   

function movement(){
  ballMove();
  ballBrickColl();
  paddleMove();
}

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;

  paddleX = mouseX + 10
}

/**********
GamePlay Draw functions
***********/
function playArea(){
  // gameCanvas
  colorRect(0,0,canvas.width, canvas.height, 'black');
  // ball
  colorCircle();
  // paddle
  colorRect(paddleX, canvas.height-PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'white');

  drawbricks();
  
}

function colorRect(leftX, topY, width, height, color){
  canvasContext.fillStyle = color;
  canvasContext.fillRect(leftX, topY, width, height);
}

function colorText(showWords, textX,textY, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(showWords, textX, textY);
}

function rowColToArrayIndex(col, row){
  return col + BRICK_COLS * row;
}

function drawbricks() {
    var colors = ['#FF0000', '#FF4D00', '#FFE500', '#ADFF00', '#00FFF0', '#00C2FF']; // Define an array of colors for each row
  
    for (var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
      for (var eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
        var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
        if (brickGrid[arrayIndex]) {
          var colorIndex = eachRow % colors.length; // Get the color index based on the row number
          var color = colors[colorIndex]; // Select the color from the array
  
          colorRect(
            BRICK_W * eachCol,
            BRICK_H * eachRow,
            BRICK_W - BRICK_GAP,
            BRICK_H - BRICK_GAP,
            color
          );
        }
      }
    }
  }



function colorCircle(){
  canvasContext.fillStyle = 'white';
  canvasContext.beginPath();
  canvasContext.arc(ballX, ballY, 25, 0, Math.PI*2, true);
  canvasContext.fill();
}



function setup() {

  setDeficalty(); // This function decide what is game deficalty

  game.playButton.on("click", function() {
      playGame();
  });

  game.pauseButton.on("click", function() {
      pauseGame();
  });

  game.stopButton.on("click", function(){
      stopGame();
  })
}

 function playGame() {
  if (!intervalId)
    intervalId = setInterval(updateAll, 1000/framesPerSecond);
};

function pauseGame() {
  clearInterval(intervalId);
  intervalId = null;
};

function stopGame() {
  pauseGame();
  brickReset();
  ballRest();
  updateAll();
};


function getParameterFromUrl(parameterName){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(parameterName)
}

function setDeficalty(){
  if( getParameterFromUrl('difficulty') == 'h'){
    PADDLE_WIDTH = 200;
    framesPerSecond = 60;
  }
}

function updateScore (){
  document.getElementById("score").innerHTML = score;
}

function losefunc (){
  if ( lives > 0){
    playVoice('lose-lives-id');
    lives--;
    ballRest();
    updateAll();
    pauseGame();
  } else {
    redirectPage (LOSE_PAGE_URL);
  }
}

function updateLives (){
  document.getElementById("lives").innerHTML = lives + 1;
}