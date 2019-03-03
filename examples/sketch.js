let mb, tb, tbState;

function setup() {
  createCanvas(400, 400);
  background(100, 0, 0);
  
  // create momentary button
  mb = createMomentary(100, 100, 100, 50, "X", momentaryCallback);
  mb.position(100, 200);
  mb.size(100, 100);
  mb.round(10);
  mb.touchMode(DOWN); // options: DOWN, UP, HOLD
  
  // create toggle button
  tb = createToggle(300, 200, 100, 100, "X", toggleOn, toggleOff);
  tb.touchMode(DOWN); // options: DOWN, UP
  
  // styling for text popups
  fill(255);
  textAlign(CENTER);
}

function draw() {
  background(100, 0, 0, 32);
  
  mb.draw();
  tb.draw();
  
  if (tbState) {   
    text("BUTTON TOGGLED.", 300, 350);
  }
}

// callback functions
function momentaryCallback() {
  text("BUTTON PRESSED.", 100, 350);
}

function toggleOn() {
  tbState = true;
  print("BUTTON TOGGLED ON.");
}

function toggleOff() {
  tbState = false;
  print("BUTTON TOGGLED OFF.");
}