// Create variables for accessing GUI objects
let b1, b2, b3, t1, cf1, cb1, cb2, s1, s2d1;

// Create a variable for the gui context that we can use to change style
let gui;

// For framerate testing
let fps = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  gui = createGui();
  
  // simpleLayout(); // <- uncomment for simple layout
  mobileLayout(); // <- uncomment for mobile layout  
  
  // Set style to TerminalGreen!
  gui.loadStyle("TerminalGreen");
  
  // You can set both an on and off label for both Buttons and Toggles. 
  // By default, they are initiated to the label specified when creating 
  // the button.
  t1.labelOn  = "Toggle 1 On";
  t1.labelOff = "Toggle 1 Off";
  
  // Change the behavior for Checkbox 1 to onRelease
  cb1.mode = "onRelease";
  
  // Set Crossfader 1 to not visible.
  cf1.visible = false;
  
  // Add callback function to Checkbox 2
  cb2.onPress = function() {
    print(cb2.label + " = " + cb2.val);
  }
}

function draw() {
  background(0);
  drawGui();
  
  // Check if GUI object have been .isPressed, .isChanged, .isHeld, or .isReleased
  // and act accordingly.
  if(b1.isPressed) { print(b1.label + " pressed."); }
  if(b2.isReleased) { print(b2.label + " released."); }
  if(s1.isChanged) { print(s1.label + " = " + s1.val); }
  if(s2.isChanged) { print(s2.label + " = " + s2.val); }
  if(cf1.isChanged) { print(cf1.label + " = " + cf1.val); }
  
  if(t1.isPressed) {
    print(t1.label + " = " + t1.val);
    cf1.visible = t1.val; // Set visibility of Crossfader 1
  }
  
  if(cb1.isReleased) {
    print(cb1.label + " = " + cb1.val); // prints "on release"
  }
  
  if(s2d1.isChanged) {
    print(s2d1.label + " = {" + s2d1.valX + ", " + s2d1.valY + "}");
  }
  
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

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}