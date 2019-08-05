// Create variable for your button
let b1;

function setup() {
  createCanvas(400, 400);
  createGui();
  
  // Create Button 1
  b1 = createButton("Button 1", 100, 50, 200, 50);
}

function draw() {
  background(220);
  updateGui();
  
  if (b1.pressed) {
    // Print a message when Button 1 is pressed.
    print(b1.label + " pressed.");
  }
  
  if (b1.held) {
    // Draw an ellipse when Button 1 is held.
    fill(255, 0, 0);
    ellipse(200, 300, 100);
  }
}

/// Add these lines below to sketch to prevent scrolling (useful for mobile)
function mousePressed(e) {
  return false;
}

document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});
