// Create a variable for your slider
let s1;

function setup() {
  createCanvas(400, 400);
  createGui();
  
  // Create Slider 1.
  // The last two optional arguments define the min and max (minimum and maximum) values.
  // The default min and max values are 0 and 1, respectively.
  s1 = createSlider("Slider 1", 50, 50, 300, 32, 100, 300);
}

function draw() {
  background(220);
  updateGui();
  
  if (s1.changed) {
    // Print a message when Slider 1 is changed
    // that displays its value.
    print(s1.label + " = " + s1.val);
  }
  
  // Use Slider 1's value to determine where the ellipse is drawn.
  fill(255, 0, 0);
  ellipse(s1.val, 300, 100);
}

/// Add these lines below to sketch to prevent scrolling (useful for mobile)
function mousePressed(e) {
  return false;
}

document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});
