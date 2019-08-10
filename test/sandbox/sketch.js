// Create variables for accessing GUI objects
let b1, b2, b3, t1, cf1, cb1, cb2, s1, s2d1;

// Create a variable for the gui context that we can use to change style
let gui;

let dict;

// For framerate testing
let fps = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  gui = createGui();
  
  // simpleLayout(); // <- uncomment for simple layout
  mobileLayout(); // <- uncomment for mobile layout
  
  cb1.mode = "onRelease";
  
  // Set style to Blue!
  gui.style.Blue();
}

function draw() {
  background(220);
  updateGui();
  
  drawFps(2);
}


// Creates a simple layout
function simpleLayout() {
  b1 = createButton("Button 1", 50, 50);
  b2 = createButton("Button 2", 200, 50);
  t1 = createToggle("Toggle 1", 50, 100);
  cf1 = createCrossfader("Crossfader 1", 200, 100, 128, 32);
  s1 = createSlider("SliderH", 50, 150, 278, 32);
  s2 = createSliderV("SliderV", 50, 200, 32, 150, -100, 100);  // Last two args are min and max
  cb1 = createCheckbox("Checkbox", 100, 200);
  cb2 = createCheckbox("Checkbox 2", 100, 250);
  s2d1 = createSlider2d("Slider2d 1", 150, 200, 178, 150);
}

// Creates a layout based on the resolution of the screen
function mobileLayout() {
  let w = width;
  let h = height;
  
  b1 = createButton("Button 1", w*0.05, h*0.05, w*0.4375, h*0.125);
  b2 = createButton("Button 2", w*0.5125, h*0.05, w*0.4375, h*0.125);
  t1 = createToggle("Toggle 1", w*0.05, h*0.2, w*0.4375, h*0.125);
  cf1 = createCrossfader("Crossfader 1", w*0.5125, h*0.2, w*0.4375, h*0.125);
  s1 = createSlider("SliderH", w*0.05, h*0.35, w*0.9, h*0.125);
  s2 = createSliderV("SliderV", w*0.05, h*0.5, w*0.2, h*0.45, -100, 100);  // Last two args are min and max
  cb1 = createCheckbox("Checkbox 1", w*0.275, h*0.5, w*0.2125, h*0.2125);
  cb2 = createCheckbox("Checkbox 2", w*0.275, h*0.7375, w*0.2125, h*0.2125);
  s2d1 = createSlider2d("Slider2d 1", w*0.5125, h*0.5, w*0.4375, h*0.45);
}

// TESTING ONLY - Draws an FPS averaged over a duration in seconds
function drawFps(duration) {
  let avgFps = 0;
  
  fps.push(frameRate());
  if (fps.length > 60*duration) { fps.splice(0, 1); }
  
  for (let i = 0; i < fps.length; i++) {
    avgFps += fps[i];
  }
  avgFps = avgFps/fps.length;
  
  push();
    textSize(20);
    text(int(avgFps), 32, 32);
  pop();
}

/// Add these lines below sketch to prevent scrolling
function mousePressed(e) {
  return false;
}

document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});
