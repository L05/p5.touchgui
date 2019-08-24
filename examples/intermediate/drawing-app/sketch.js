const myCanvasPos = {
  x: 20,
  y: 20,
  width: 300,
  height: 300
};
let gui;
let myStrokeWeight = 16;
let myRed = 127.5, myGreen = 127.5, myBlue = 127.5;

// Create variable for clear button
let myClearButton;
// Create variable for stroke weight slider
let myWeightSlider;
// Create variableS for stroke color r,g,b,a
let myColorSliderR, myColorSliderG, myColorSliderB;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(225);
  ellipseMode(CENTER);

  gui = createGui();
  // Set style to Blue!
  gui.loadStyle("Blue");

  // Create buttons, sliders...
  createControls();
}

function createControls() {
  strokeWeight(1);
  // Create drawing canvas
  rect(myCanvasPos.x, myCanvasPos.y, myCanvasPos.width, myCanvasPos.height);

  // Optional: a way to set the text size
  gui.setTextSize(12);
  // Optional: A way to change the stroke weight
  gui.setStrokeWeight(1);
  // Optional: A way to set object corners
  gui.setRounding(0);

  // Create Clear Button
  myClearButton = createButton("Clear", 330, 20, 195, 30);

  text('Stroke Weight:', 330, 65);
  // Create stroke weight slider
  myWeightSlider = createSlider("WeightSlider", 330, 70, 160, 30, 1, 30);

  text('Red:', 330, 115);
  text('Green:', 385, 115);
  text('Blue:', 440, 115);
  myColorSliderR = createSliderV("ColoSliderR", 330, 120, 30, 200, 0, 255);
  myColorSliderG = createSliderV("ColoSliderG", 385, 120, 30, 200, 0, 255);
  myColorSliderB = createSliderV("ColoSliderB", 440, 120, 30, 200, 0, 255);
  
  // Show an ellipse with myStrokeWeight and myColor on the canvas
  updateEllipse();
}


function draw() {
  drawGui();
  if (myClearButton.isPressed) {
    // Print a message when Clear Button is pressed.
    print(myClearButton.label + " pressed.");
    fill(255);
    stroke(0);
    strokeWeight(1);
    // Create drawing canvas again
    rect(myCanvasPos.x, myCanvasPos.y, myCanvasPos.width, myCanvasPos.height);
  }
  if (myWeightSlider.isChanged) {
    // Print a message when myWeightSlider Slider is changed
    print(myWeightSlider.label + " = " + myWeightSlider.val);
    // Set myStrokeWeight to the slides' value
    myStrokeWeight = myWeightSlider.val;
    // Update the myStrokeWeight value on the canvas
    updateEllipse();
  }
  if (myColorSliderR.isChanged) {
    print(myColorSliderR.label + " = " + myColorSliderR.val);
    myRed = myColorSliderR.val;
    updateEllipse();
  }
  if (myColorSliderG.isChanged) {
    print(myColorSliderG.label + " = " + myColorSliderG.val);
    myGreen = myColorSliderG.val;
    updateEllipse();
  }
  if (myColorSliderB.isChanged) {
    print(myColorSliderB.label + " = " + myColorSliderB.val);
    myBlue = myColorSliderB.val;
    updateEllipse();
  }
  // If mouse is pressed inside of the drawing canvas, draw lines
  if (mouseIsPressed) {
    if (ifMouseInCanvas(pmouseX, pmouseY, mouseX, mouseY)) {
      stroke(myRed, myGreen, myBlue);
      strokeWeight(myStrokeWeight);
      line(pmouseX, pmouseY, mouseX, mouseY);
    }
  }
}

function updateEllipse() {
  noStroke();
  fill(225);
  ellipse(512, 85, 30, 30);
  fill(myRed, myGreen, myBlue);
  ellipse(512, 85, myStrokeWeight, myStrokeWeight);
}

function ifMouseInCanvas(pmouseX, pmouseY, mouseX, mouseY) {
  if (mouseX > myCanvasPos.x + myStrokeWeight / 2 && mouseX < myCanvasPos.x + myCanvasPos.width - myStrokeWeight / 2 &&
      mouseY > myCanvasPos.y + myStrokeWeight / 2 && mouseY < myCanvasPos.y + myCanvasPos.height - myStrokeWeight / 2 && 
      pmouseX > myCanvasPos.x + myStrokeWeight / 2 && pmouseX < myCanvasPos.x + myCanvasPos.width - myStrokeWeight / 2 &&
      pmouseY > myCanvasPos.y + myStrokeWeight / 2 && pmouseY < myCanvasPos.y + myCanvasPos.height - myStrokeWeight / 2) {
    return true;
  } else return false;
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}