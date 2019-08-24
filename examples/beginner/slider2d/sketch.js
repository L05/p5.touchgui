let gui;

// Create a variable for your Slider2d
let s;

function setup() {
  createCanvas(400, 400);
  gui = createGui();
  
  // Create Slider2d.
  // The last four optional arguments define minimum and maximum values 
  // for the x and y axes; minX, maxX, minY, maxY
  // The default min and max values for all four are -1 and 1.
  s = createSlider2d("Slider2d", 10, 210, 175, 175, 250, 350, 150, 50);
}

function draw() {
  background(255, 235, 205);
  drawGui();
  
  if (s.isChanged) {
    // Print a message when Slider2d is changed
    // that displays its value.
    print(s.label + " = {" + s.valX + ", " + s.valY + "}");
  }
  
  // Draw our ellipse using the Slider2d output values
  fill( 95, 158, 160);
  ellipse(s.valX, s.valY, 100);
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}