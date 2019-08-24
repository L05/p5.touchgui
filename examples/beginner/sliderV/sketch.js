let gui;

// Create a variable for your SliderV
let s;

function setup() {
  createCanvas(400, 400);
  gui = createGui();
  
  // Create SliderV.
  // The last two optional arguments define the min and max (minimum and maximum) values.
  // The default min and max values are 0 and 1, respectively.
  s = createSliderV("SliderV", 50, 50, 32, 300, 25, 250);
}

function draw() {
  background(220);
  drawGui();
  
  if (s.isChanged) {
    // Print a message when SliderV is changed
    // that displays its value.
    print(s.label + " = " + s.val);
  }
  
  // Use SliderV's value to determine where the ellipse is drawn.
  fill(0, 0, 255);
  ellipse(250, 200, s.val);
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}