let gui;

// Create variable for your button
let b;

function setup() {
  createCanvas(400, 400);
  gui = createGui();
  
  // Create Button 1
  b = createButton("Button 1", 100, 50, 200, 50);
}

function draw() {
  background(220);
  drawGui();
  
  if (b.pressed) {
    // Print a message when Button 1 is pressed.
    print(b.label + " pressed.");
  }
  
  if (b.held) {
    // Draw an ellipse when Button 1 is held.
    fill(255, 0, 0);
    ellipse(200, 300, 100);
  }
}
