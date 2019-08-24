let gui;

// Create a variable for your CrossfaderV
let c;

// Create variables for calculating easing 
// (for more, see here: https://p5js.org/examples/input-easing.html).
let y = 0;
let easing = 0.05;


function setup() {
  createCanvas(400, 400);
  gui = createGui();
  
  // Create Crossfader.V
  // The last two optional arguments define the min and max (minimum and maximum) values.
  // The default min and max values are -1 and 1, respectively.
  c = createCrossfaderV("CrossfaderV", 50, 50, 32, 300, 150, -150);
}

function draw() {
  background(72, 61, 139);
  drawGui();
  
  if (c.isChanged) {
    // Print a message when CrossfaderV is changed
    // that displays its value.
    print(c.label + " = " + c.val);
  }
  
  // Use CrossfaderV's value as input for a simple easing
  // function (for more, see here: https://p5js.org/examples/input-easing.html).
  let targetY = c.val;
  let dy = targetY - y;
  y += dy * easing;
  
  // Draw the ellipses.
  fill(216, 191, 216);
  ellipse(300, 200+c.val, 75);
  ellipse(175, 200+y, 25);
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}