let x, y, z;

function setup() {
  createCanvas(windowWidth, windowHeight);
  createGui();
  
  // In order to pass by reference in JS, variables must 
  // an object. In this case, one-dimensional arrays.
  // Not ideal, but current alternative is: x = {val: 0.5};
  // Accessing would look like x.val.
  x = {val: 0.5};
  y = {val: 0.5};
  z = {val: true};
  
  print('w: ' + width + '\nh: ' + height);
}

function draw() {
  background(220);
  
  startGui();

//  drawStaticGui();
  drawDynamicGui();
    
  endGui();
}

function drawStaticGui() {
  if (button("Button 1", 50, 50)) {
    print("Button 1 pressed.");
  }
  
  if (button("Button 2", 50, 100)) {
    print("Button 2 pressed.");
  }
  
  if (button("Button 3", 200, 50)) {
    print("Button 3 pressed.");
  }
  
  if (button("Button 4", 200, 100)) {
    print("Button 4 pressed.");
  }
  
  if (slider("SliderH", x, 50, 150, 278)) {
    print("x: " + str(x[0]));
  }
  
  if (sliderV("SliderV", y, 50, 200, 32, 150)) {
    print("y: " + str(y[0]));
  }
  
  if (checkbox("Checkbox", z, 100, 200)) {
    print("z: " + str(z[0]));
  }
  
  if (button("Press me.", 150, 200, 178, 150)) {
    print("I've been pressed!");
  }
  
  text(int(frameRate()), 32, 32);
}

function drawDynamicGui() {
  if (button("Button 1", width*0.05, height*0.05, width*0.4375, height*0.125)) {
    print("Button 1 pressed.");
  }
  
  if (button("Button 2", width*0.5125, height*0.05, width*0.4375, height*0.125)) {
    print("Button 2 pressed.");
  }
  
  if (button("Button 3", width*0.05, height*0.2, width*0.4375, height*0.125)) {
    print("Button 3 pressed.");
  }
  
  if (button("Button 4", width*0.5125, height*0.2, width*0.4375, height*0.125)) {
    print("Button 4 pressed.");
  }
  
  if (slider("SliderH", x, width*0.05, height*0.35, width*0.9, height*0.125)) {
    print("x: " + str(x[0]));
  }
  
  if (sliderV("SliderV", y, width*0.05, height*0.5, width*0.2, height*0.45)) {
    print("y: " + str(y[0]));
  }
  
  if (checkbox("Checkbox", z, width*0.275, height*0.5, width*0.2125, height*0.2125)) {
    print("z: " + str(z[0]));
  }
  
  if (button("Press me.", width*0.5125, height*0.5, width*0.4375, height*0.45)) {
    print("I've been pressed!");
  }
  
  push();
  textSize(20);
  text(int(frameRate()), 32, 32);
  text(str(mouseIsPressed), 64, 32);
  pop();
}

/// Add these lines below to sketch to prevent scrolling
function mousePressed(e) {
  return false;
}

document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});
