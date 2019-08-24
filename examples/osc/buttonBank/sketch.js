let gui;
let b;

// Slider bank settings
let rows        = 4;
let cols        = 4;
let marginX     = 0.05;
let marginY     = 0.05;

// Network Settings
let bridgeIp = '127.0.0.1:8081';
let ipIn = '127.0.0.1';
let ipOut = '127.0.0.1';

function setup() {
  createCanvas(windowWidth-5, windowHeight-5); 
  setupOsc(10000, 12000, bridgeIp, ipIn, ipOut);
  gui = createGui();
  gui.loadStyle('TerminalGreen');
  
  // Create button array
  b = createArray(rows, cols);
  
  // Calculate button sizes
  let bW = (width - width*marginX*2)/rows;
  let bH = (height - height*marginY*2)/cols;
  
  // Create sliders based on parameters
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      b[j][i] = createButton(str(i*cols+j), width*marginX + bW*j, height*marginY + bH*i, bW*0.9, bH*0.9);
    }
    
  }
}

function draw() {
  background(0);
  drawGui();
  
  // Cycle through sliders and send OSC messages
  for (let i = 0; i < b.length; i++) {
    for (let j = 0; j < b[i].length; j++) {
      if (b[i][j].isChanged) {
        sendOsc('/button' + i, b[i][j].val);
      }
    }
  }
}

function receiveOsc(address, value) {
  // console.log("received OSC: " + address + ", " + value);
}

// From => https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}