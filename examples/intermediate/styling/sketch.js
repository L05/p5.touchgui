// Create variables for accessing GUI objects
let s1, s2, s3, s4, t1, t2, t3, t4;

// Create a variable for the gui context that we can use to change style
let gui;
let myFont;

function preload() {
  // An example of loading a font from file into p5.touchgui
  myFont = loadFont('Roboto-Thin.ttf');
}

function setup() {
  createCanvas(425, 500);
  gui = createGui();
  
  // Create the objects
  s1 = createSliderV("Slider 1", 25, 25, 75, 350);
  s2 = createSliderV("Slider 2", 125, 25, 75, 350);
  s3 = createSliderV("Slider 3", 225, 25, 75, 350);
  s4 = createSliderV("Slider 4", 325, 25, 75, 350);
  
  t1 = createToggle("M", 25, 400, 75, 75);
  t2 = createToggle("M", 125, 400, 75, 75);
  t3 = createToggle("M", 225, 400, 75, 75);
  t4 = createToggle("M", 325, 400, 75, 75);
  
  //// PRESETS
    // You can load one of the preset styles for p5.touchGui.
    // Current options are:
    //  "Gray"
    //  "Blue"
    //  "TerminalGreen"
    gui.loadStyle("TerminalGreen");
  
  //// OBJECT STYLE SETTINGS
    // There are two ways to setStyle() for objects.
  
    // The first method is to override each parameter individually
    // by string
    t1.setStyle("fillBgOn", color("#D00000"));
    t1.setStyle("fillBgOnHover", color("#F00000"));
    t1.setStyle("fillBgOnActive", color("#FF0000"));
    t1.setStyle("fillBgOffActive", color("#FF0000"));

    // The second method is to override multiple parameters at once
    // with a JavaScript object
    t2.setStyle({
      fillBgOn: color("#D00000"), 
      fillBgOnHover: color("#F00000"), 
      fillBgOnActive: color("#FF0000"), 
      fillBgOffActive: color("#FF0000")
    });

    // If you have multiple objects of the same type you'd like to 
    // style similarly, you can create one JavaScript object and
    // pass it to each of the objects
    let toggleStyle = {
      fillBgOn: color("#D00000"), 
      fillBgOnHover: color("#F00000"), 
      fillBgOnActive: color("#FF0000"), 
      fillBgOffActive: color("#FF0000")
    };

    t3.setStyle(toggleStyle);
    t4.setStyle(toggleStyle);
  
  //// GLOBAL STYLE SETTINGS
    // You can also change global style settings by using the following
    // functions on your 'gui' variable:

    // Sets the text size, in this case to 40. 
    // Note: p5.touchgui will limit the text size internally for each
    // object so that it does not go beyond the width of the object.
    gui.setTextSize(40);
  
    // Sets the corner rounding, in this case to 0
    gui.setRounding(0);
  
    // Set the p5.touchgui font from a p5.font or to a websafe
    // font by using the corresponding string
    gui.setFont(myFont);
    // gui.setFont('Courier New');
  
    // Sets global stroke weight for all objects, in this case 0.5
    // for thick lines
    gui.setStrokeWeight(3);
  
    // Sets slider track width as a ratio, in this case to 0.
    // Note: when trackWidth == 0, track is rendered as a line.
    gui.setTrackWidth(0);
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