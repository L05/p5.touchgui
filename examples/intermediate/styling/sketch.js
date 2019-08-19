// Create variables for accessing GUI objects
let s1, s2, s3, s4, t1, t2, t3, t4;

// Create a variable for the gui context that we can use to change style
let gui;

function setup() {
  createCanvas(425, 500);
  gui = createGui();
  
  // Set style to Blue!
  gui.loadStyle("TerminalGreen");
  
  s1 = createSliderV("Slider 1", 25, 25, 75, 350);
  s2 = createSliderV("Slider 2", 125, 25, 75, 350);
  s3 = createSliderV("Slider 3", 225, 25, 75, 350);
  s4 = createSliderV("Slider 4", 325, 25, 75, 350);
  
  t1 = createToggle("M", 25, 400, 75, 75);
  t2 = createToggle("M", 125, 400, 75, 75);
  t3 = createToggle("M", 225, 400, 75, 75);
  t4 = createToggle("M", 325, 400, 75, 75);
  
  
}

function draw() {
  background(0);
  drawGui();
  
  
}


/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}