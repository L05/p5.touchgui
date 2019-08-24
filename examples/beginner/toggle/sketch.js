let gui;

// Create a variable for your Toggle
let t;

function setup() {
  createCanvas(400, 400);
  gui = createGui();
  
  // Create Toggle
  t = createToggle("Toggle", 100, 50, 200, 50);
}

function draw() {
  background(220);
  drawGui();
  
  if (t.isPressed) {
    // Print a message when Toggle is pressed
    // that displays its value.
    print(t.label + " is " + t.val);
  }
  
  if (t.val) {
    // Draw an ellipse when Toggle is true.
    fill(255, 0, 0);
    ellipse(200, 300, 100);
  }
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}