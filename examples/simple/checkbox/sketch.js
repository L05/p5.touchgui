let gui;

// Create a variable for your Checkbox
let cb1;

function setup() {
  createCanvas(400, 400);
  gui = createGui();
  
  // Create Checkbox
  cb1 = createCheckbox("Checkbox", 150, 50, 100, 100);
}

function draw() {
  background(220);
  drawGui();
  
  if (cb1.pressed) {
    // Print a message when Checkbox is pressed
    // that displays its value.
    print(cb1.label + " is " + cb1.val);
  }
  
  if (cb1.val) {
    // Draw an ellipse when Checkbox is true.
    fill(255, 0, 0);
    ellipse(200, 300, 100);
  }
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}