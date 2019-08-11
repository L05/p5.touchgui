let gui;

// Create variable for your button
let b;

function setup() {
  createCanvas(400, 400);
  gui = createGui();
  
  // Create Button 1
  b = createButton("Button 1", 100, 50, 200, 50);
  
  // You can assign callback functions for onPress, onHold, onRelease, and onChange
  b.onPress = function() {
    print(b.label + " pressed.");
  }
  
  b.onHold = function() {
    // Draw an ellipse when Button 1 is held.
    fill(255, 0, 0);
    ellipse(200, 300, 100);
  }
  
  b.onRelease = function() {
    print(b.label + " released.");
  }
  
  // Callbacks can also be assigned to existing, user-defined functions.
  b.onChange = printHello;
}

function printHello() {
  print("Hello, I've changed!");
}

function draw() {
  background(220);
  drawGui();
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}