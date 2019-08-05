// Create variable for your button
let b1;

function setup() {
  createCanvas(400, 400);
  createGui();
  
  // Create Button 1
  b1 = createButton("Button 1", 100, 50, 200, 50);
  
  // You can assign callback functions for onPress, onHold, onRelease, and onChange
  b1.onPress = function() {
    print(b1.label + " pressed.");
  }
  
  b1.onHold = function() {
    // Draw an ellipse when Button 1 is held.
    fill(255, 0, 0);
    ellipse(200, 300, 100);
  }
  
  b1.onRelease = function() {
    print(b1.label + " released.");
  }
  
  // Callbacks can also be assigned to existing, user-defined functions.
  b1.onChange = printHello;
}

function printHello() {
  print("Hello, I've changed!");
}

function draw() {
  background(220);
  updateGui();
}

/// Add these lines below to sketch to prevent scrolling (useful for mobile)
function mousePressed(e) {
  return false;
}

document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});
