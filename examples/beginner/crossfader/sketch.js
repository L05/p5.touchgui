let gui;

// Create a variable for your Crossfader
let c;

function setup() {
  createCanvas(400, 400);
  gui = createGui();
  
  // Create Crossfader.
  // The last two optional arguments define the min and max (minimum and maximum) values.
  // The default min and max values are -1 and 1, respectively.
  c = createCrossfader("Crossfader", 50, 50, 300, 32, 25, 100);
}

function draw() {
  background(72, 61, 139);
  drawGui();
  
  if (c.isChanged) {
    // Print a message when Crossfader is changed
    // that displays its value.
    print(c.label + " = " + c.val);
  }
  
  // Use Crossfader's value to determine where the ellipse is drawn.
  fill(216, 191, 216);
  ellipse(100, 300, 125-c.val);
  ellipse(300, 300, c.val);
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}