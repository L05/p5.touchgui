let gui;
let s;

// Variables for testing OSC receive
let x, y;

// Local server IP and port
let ip = '127.0.0.1:8081';

function setup() {
  createCanvas(500, 500); 
  setupOsc(10000, 12000, ip);
  
  gui = createGui();
  gui.loadStyle("TerminalGreen");
  
  s = createSlider("Slider", 50, 50, 400, 64, 0, 100);
}

function draw() {
  background(0);
  drawGui();
  
  sendOsc('/sliderVal', s.val);
  
  // Show value on screen
  fill(0, 255, 0);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("/sliderVal = " + s.val.toFixed(2), 250, 400);
}

function receiveOsc(address, value) {
  console.log("received OSC: " + address + ", " + value);
	
  if (address == '/test/x') {
    x = value;
  } else if (address == '/test/y') {
    y = value;
  }
}
