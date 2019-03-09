let mb, tb, tbState;
let palette;

function setup() {  
  createCanvas(windowWidth, windowHeight);
  palette = [color('#C9F0FF'), 
             color('#FCFCFC'), 
             color('#EFEFF0'), 
             color('#D5CAD6'), 
             color('#6B5E62')]
  
  background(palette[1]);

  // create momentary button
  mb = createMomentary(width*0.25, 
                       height*0.5, 
                       width*0.25, 
                       width*0.1, 
                       "Momentary", 
                       momentaryCallback);
  mb.textSize   = width*0.025;
  mb.round      = 20;
  mb.fillOff    = palette[2];
  mb.fillOn     = palette[0];
  mb.stroke     = palette[3];
  mb.labelColor = palette[4];
  mb.touchMode  = HOLD; // options: DOWN, UP, HOLD
  
  // create toggle button
  tb = createToggle(width*0.75, 
                    height*0.5, 
                    width*0.25, 
                    width*0.1, 
                    "Toggle", 
                    toggleOn, 
                    toggleOff);
  tb.textSize   = width*0.025;
  tb.round      = 20;
  tb.fillOff    = palette[2];
  tb.fillOn     = palette[0];
  tb.stroke     = palette[3];
  tb.labelColor = palette[4];
  tb.touchMode = DOWN; // options: DOWN, UP
//  
  // styling for text popups
  fill(0);
  textAlign(CENTER);
  textSize(width*0.025);
}

function draw() {
  background(252, 42);
  drawFrameRate(40, 40);
  
  mb.draw();
  tb.draw();
  
  if (tbState) {   
    fill(0);
    text("BUTTON TOGGLED.", width*0.75, height*0.75);
  }
}

// callback functions
function momentaryCallback() {
  fill(0);
  text("BUTTON PRESSED.", width*0.25, height*0.75);
}

function toggleOn() {
  tbState = true;
}

function toggleOff() {
  tbState = false;
}

// add these lines below to sketch to prevent scrolling
function mousePressed(e) {
  return false;
}

// to help with monitoring framerate during development
function drawFrameRate(x, y) {
  push();
    fill('black');
    rectMode(CENTER);
    rect(x, y, 40, 40, 10);
  
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(20);
    text(int(frameRate()), x, y)
  pop();
}

document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});