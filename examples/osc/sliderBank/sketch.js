let gui;
let s = [];

// Slider bank settings
let cols        = 8;
let marginX     = 0.05;
let marginY     = 0.05;
let defaultVal  = 0.5;

// Network Settings
let bridgeIp = '127.0.0.1:8081';
let ipIn = '127.0.0.1';
let ipOut = '127.0.0.1';

function setup() {
  createCanvas(windowWidth-5, windowHeight-5); 
  setupOsc(10000, 12000, bridgeIp, ipIn, ipOut);
  gui = createGui();
  gui.loadStyle('TerminalGreen');
  
  // Calculate slider sizes
  let sW = (width - width*marginX*2)/cols;
  let sH = height*(1 - marginY*2);
  
  // Create sliders based on parameters
  for (let i = 0; i < cols; i++) {
    s[i] = createSliderV("slider"+str(i), width*marginX + sW*i, height*marginY, sW*0.9, sH, 0, 100);
    s[i].val = defaultVal;
  }
}

function draw() {
  background(0);
  drawGui();
  
  // Cycle through sliders and send OSC messages
  for (let i = 0; i < s.length; i++) {
    if (s[i].isChanged) {
      sendOsc('/slider' + i, s[i].val);
    }
  }
}

function receiveOsc(address, value) {
  // console.log("received OSC: " + address + ", " + value);
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}