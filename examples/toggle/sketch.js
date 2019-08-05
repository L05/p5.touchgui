// Create a variable for your toggle
let t1;

function setup() {
  createCanvas(400, 400);
  createGui();
  
  // Create Toggle 1
  t1 = createToggle("Toggle 1", 100, 50, 200, 50);
}

function draw() {
  background(220);
  updateGui();
  
  if (t1.pressed) {
    // Print a message when Toggle 1 is pressed
    // that displays its value.
    print(t1.label + " is " + t1.val);
  }
  
  if (t1.val) {
    // Draw an ellipse when Toggle 1 is true.
    fill(255, 0, 0);
    ellipse(200, 300, 100);
  }
}

/// Add these lines below to sketch to prevent scrolling (useful for mobile)
function mousePressed(e) {
  return false;
}

document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});
