let mb, tb, state;

function setup() {
  createCanvas(400, 400);
  background(100, 0, 0);
  
  mb = createMomentary(100, 100, 100, 50, "X", momentaryCallback);
  mb.setPosition(100, 200);
  mb.setSize(100, 100);
  mb.setRound(10);
  // There are 3 modes for a momentary button: DOWN, UP, HOLD
  mb.setMode(DOWN);
  
  tb = createToggle(300, 200, 100, 100, "X", toggleOn, toggleOff);
  // There are 2 modes for a toggle button: DOWN, UP
  tb.setMode(DOWN);
}

function draw() {
  background(100, 0, 0, 32);
  
  // Simply call a button's draw() function for it to 
  // update and display
  mb.draw();
  tb.draw();
  
  if (state) {
    fill(255);
    textAlign(CENTER);
    text("BUTTON TOGGLED.", 300, 350);
  }
}

// Example callback functions
function momentaryCallback() {
  fill(255);
  textAlign(CENTER);
  text("BUTTON PRESSED.", 100, 350);
}

function toggleOn() {
  state = true;
  print("BUTTON TOGGLED ON.");
}

function toggleOff() {
  state = false;
  print("BUTTON TOGGLED OFF.");
}