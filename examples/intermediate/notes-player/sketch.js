let osc, fft;
let scaleArray = [60, 62, 64, 65, 67, 69, 71, 72];
let note = 0;
let gui;
let volume = 0.5;
let freqV = 0;
let myVolumeSlider;
let myFreqSlider;

function setup() {
  createCanvas(710, 200);
  osc = new p5.SinOsc();

  osc.start();
  osc.amp(volume);

  fft = new p5.FFT();
  noStroke();
  
  gui = createGui();
  createControls();
}

function createControls() {
  myVolumeSlider = createSlider('VolumeSlider', 540, 10, 160, 30);
  myFreqSlider = createCrossfader('FreqSlider', 540, 50, 160, 30);
}

function draw() {
  background(20);
  drawGui();
  
  if (myVolumeSlider.isChanged) {
    // Print a message when myVolumeSlider is changed
    print(myVolumeSlider.label + " = " + myVolumeSlider.val);
    volume = myVolumeSlider.val;
    osc.amp(volume);
  }
  
  if (myFreqSlider.isChanged) {
    // Print a message when myFreqSlider is changed
    print(myFreqSlider.label + " = " + myFreqSlider.val);
    freqV = myFreqSlider.val;
    note = 0;
  }

  if (frameCount % 60 === 0 || frameCount === 1) {
    let midiValue = scaleArray[note] + 7 * freqV;
    let freqValue = midiToFreq(midiValue);
    osc.freq(freqValue);
    osc.start();
    note = (note + 1) % scaleArray.length;
  }

  // plot FFT.analyze() frequency analysis on the canvas
  let spectrum = fft.analyze();
  for (let i = 0; i < spectrum.length / 20; i++) {
    fill(spectrum[i], spectrum[i] / 10, 0, 100);
    let x = map(i, 0, spectrum.length / 20, 0, width);
    let h = map(spectrum[i], 0, 255, 0, height);
    rect(x, height, spectrum.length / 20, -h);
  }
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}