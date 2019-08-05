let gui;

// Create a variable for your slider
let s;

function setup() {
  createCanvas(400, 400);
  gui = createGui();
  
  // Create Slider 1.
  // The last two optional arguments define the min and max (minimum and maximum) values.
  // The default min and max values are 0 and 1, respectively.
  s = createSlider("Slider 1", 50, 50, 300, 32, 100, 300);
}

function draw() {
  background(220);
  updateGui();
  
  if (s.changed) {
    // Print a message when Slider 1 is changed
    // that displays its value.
    print(s.label + " = " + s.val);
  }
  
  // Use Slider 1's value to determine where the ellipse is drawn.
  fill(255, 0, 0);
  ellipse(s.val, 300, 100);
}
