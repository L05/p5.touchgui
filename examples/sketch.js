let mb, tb, state;

function setup() {
  createCanvas(400, 400);
  background(100, 0, 0);
  
  mb = new MomentaryButton(100, 200, 100, 100, "X", myCallback1);
  mb.setCallback(myCallback2);
  mb.setRound(10);
  
  // There are 3 modes for a momentary button
  mb.setMode(DOWN);
  //  mb.setMode(UP);
  //  mb.setMode(HOLD);
  
  tb = new ToggleButton(300, 200, 100, 100, "X", myCallback3, myCallback4);
  tb.setRound(10);
  
  // There are 2 modes for a toggle button
  tb.setMode(DOWN);
  //  tb.setMode(UP);
}

function draw() {
  // put drawing code here
  background(100, 0, 0, 32);
  
  mb.draw();
  tb.draw();
  
  if (state) {
    fill(255);
    textAlign(CENTER);
    text("BUTTON TOGGLED.", 300, 350);
  }
}

// Example callback functions
function myCallback1() {
  print("BUTTON PRESSED.");
}

function myCallback2() {
  fill(255);
  textAlign(CENTER);
  text("BUTTON PRESSED.", 100, 350);
}

function myCallback3() {
  state = true;
  print("BUTTON TOGGLED ON.");
}

function myCallback4() {
  state = false;
  print("BUTTON TOGGLED OFF.");
}