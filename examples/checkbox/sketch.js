let gui;

// Create a variable for your checkbox
let cb1;

function setup() {
  createCanvas(400, 400);
  gui = createGui();
  
  // Create Checkbox 1
  cb1 = createCheckbox("Checkbox 1", 150, 50, 100, 100);
}

function draw() {
  background(220);
  updateGui();
  
  if (cb1.pressed) {
    // Print a message when Checkbox 1 is pressed
    // that displays its value.
    print(cb1.label + " is " + cb1.val);
  }
  
  if (cb1.val) {
    // Draw an ellipse when Checkbox 1 is true.
    fill(255, 0, 0);
    ellipse(200, 300, 100);
  }
}
