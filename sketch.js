let mb;

function setup() {
  createCanvas(400, 400);
  background(100, 0, 0);
  
  mb = new MomentaryButton(200, 200, 50, 50, "X", myCallback);
  mb.setRound(10);
  
  mb.setMode(DOWN);
//  mb.setMode(UP);
//  mb.setMode(HOLD);
}

function draw() {
  // put drawing code here
  background(100, 0, 0, 32);
  
  mb.draw();
}

function myCallback() {
  fill(255);
  textAlign(CENTER);
  text("BUTTON PRESSED.", 200, 300);
  print("BUTTON PRESSED.");
}