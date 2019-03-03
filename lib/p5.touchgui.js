////////////////////////////////////////
/////////// MOMENTARY BUTTON ///////////
////////////////////////////////////////

// Define constants for touch modes. 
// Note: not sure how to set this up so that it doesn't
//  interfere with other libraries' constants.
const DOWN  = 0;
const UP    = 1;
const HOLD  = 2;


////////////////////////////////////////
/////////  BUTTON PARENT CLASS /////////
////////////////////////////////////////
// --
// Currently has a lot of internal variables that don't yet
// have getters and setters. Core functionality works 
// though. Has three modes for triggering a callback 
// function: DOWN, UP, and HOLD. Implementation of this is
// up to children.

function Button (x_, y_, width_, height_, label_, callback_) {
  
  // Construction
  this.x            = x_;
  this.y            = y_;
  this.width        = width_;
  this.height       = height_;
  this.round        = 0;
  this.fillOff      = color(200, 200, 200, 255);
  this.fillOn       = color(0, 255, 0, 255);
  this.stroke       = color(0, 0, 0, 255);
  this.strokeWeight = 4;
  this.touched      = false;
  this.labelColor   = color(0, 0, 0, 255);
  this.textSize     = 24;
  this.mode         = DOWN;

  this.label        = label_;
  if (this.label === undefined) {
    this.label = "";
  }

  this.callback     = callback_;
  if (this.callback === undefined) {
    this.callback = function() {
      print("No callback defined.");
    }
  }
  
  // Methods
  this.setPosition = function(x_, y_) {
    this.x      = x_;
    this.y      = y_;
  }
  
  this.setSize = function(width_, height_) {
    this.width  = width_;
    this.height = height_;
  }
  
  this.setMode = function(mode_) {
    if (mode_ === DOWN) {
      this.mode = DOWN;
    } else if (mode_ === UP) {
      this.mode = UP;
    } else if (mode_ === HOLD) {
      this.mode = HOLD;
    } else {
      console.log("INVALID MODE TYPE.");
    }
  }
  
  this.setRound = function(round_) {
    this.round = round_;
  }

  this.setLabel = function(label_) {
    this.label = label_;
  }
  
  this.setCallback = function(callback_) {
    this.callback = callback_;
  }
}


////////////////////////////////////////
/////////// MOMENTARY BUTTON ///////////
////////////////////////////////////////
// --
// Currently has a lot of internal variables that don't yet
// have getters and setters. Core functionality works 
// though. Has three modes for triggering a callback 
// function: DOWN, UP, and HOLD.


function MomentaryButton (x_, y_, width_, height_, label_, callback_) {
  
  // Construction
  Button.call(this, x_, y_, width_, height_, label_, callback_);

  // draw() calles update() at the start.
  // Uses push() and pop() to disassociate from the
  // user's current drawing style and transformations.
  // Not sure whether or not this is advised.
  this.draw = function() {
    this.update();
    
    push();
      stroke(this.stroke);
      strokeWeight(this.strokeWeight);

      if (this.touched) {
      	fill(this.fillOn);
      } else {
      	fill(this.fillOff);
      }

      rectMode(CENTER);
      rect(this.x, this.y, this.width, this.height,       this.round);

      noStroke();
      textAlign(CENTER,CENTER);
      fill(this.labelColor);
      textSize(this.textSize);
      text(this.label, this.x, this.y);
    pop();
  }

  // update() checks to see if mouse press or touches are
  // being detected on the button. There is currently no
  // mouse hover behaviour, though this is being considered.
  this.update = function() {
    
    if(touches.length == 0 && mouseIsPressed) {
      if (mouseX > this.x-this.width/2 && 
          mouseX < this.x+this.width/2 &&
          mouseY > this.y-this.height/2 &&
          mouseY < this.y+this.height/2) {
        
        if (this.mode == DOWN && !this.touched) {
          this.callback();
        } else if (this.mode == HOLD) {
          this.callback();
        }
        
        this.touched = true;
      }
    } else if (touches.length > 0) {
      for (let i = 0; i < touches.length; i++) {
        if (touches[i].x > this.x-this.width/2 && 
            touches[i].x < this.x+this.width/2 &&
            touches[i].y > this.y-this.height/2 &&
            touches[i].y < this.y+this.height/2) {
          
          if (this.mode == DOWN && !this.touched) {
            this.callback();
          } else if (this.mode == HOLD) {
            this.callback();
          } 
          
          this.touched = true;
        }
      }
    } else if (this.touched && this.mode == UP) {
      this.callback();
      this.touched    = false;
    } else {
      this.touched    = false;
    }
    
    return this.touched;
  }
}


////////////////////////////////////////
//////////// TOGGLE BUTTON /////////////
////////////////////////////////////////

function ToggleButton (x_, y_, width_, height_, label_, callbackOn_, callbackOff_){
  
  // Construction
  Button.call(this, x_, y_, width_, height_, label_, callbackOn_);
  this.state = false;
  
  this.callbackOff = callbackOff_;
  if (this.callbackOff === undefined) {
    this.callbackOff = function() {
      print("No callback defined.");
    }
  }

  // draw() calles update() at the start.
  // Uses push() and pop() to disassociate from the
  // user's current drawing style and transformations.
  // Not sure whether or not this is advised.
  this.draw = function() {
    this.update();
    
    push();
      stroke(this.stroke);
      strokeWeight(this.strokeWeight);

      if (this.state) {
        fill(this.fillOn);
      } else {
        fill(this.fillOff);
      }

      rectMode(CENTER);
      rect(this.x, this.y, this.width, this.height,       this.round);

      noStroke();
      textAlign(CENTER,CENTER);
      fill(this.labelColor);
      textSize(this.textSize);
      text(this.label, this.x, this.y);
    pop();
  }

  // update() checks to see if mouse press or touches are
  // being detected on the button. There is currently no
  // mouse hover behaviour, though this is being considered.
  this.update = function() {

    if(touches.length == 0 && mouseIsPressed) {
      if (mouseX > this.x-this.width/2 && 
          mouseX < this.x+this.width/2 &&
          mouseY > this.y-this.height/2 &&
          mouseY < this.y+this.height/2) {
        
        if (this.mode == DOWN && !this.touched) {
          this.toggleState();
        }
        
        this.touched = true;
      }
    } else if (touches.length > 0) {
      for (let i = 0; i < touches.length; i++) {
        if (touches[i].x > this.x-this.width/2 && 
            touches[i].x < this.x+this.width/2 &&
            touches[i].y > this.y-this.height/2 &&
            touches[i].y < this.y+this.height/2) {
          
          if (this.mode == DOWN && !this.touched) {
            this.toggleState();
          }
          
          this.touched = true;
        }
      }
    } else if (this.touched && this.mode == UP) {
      this.toggleState();
      this.touched    = false;
    } 
    else {
      this.touched    = false;
    }

    return this.touched;
  }
  
  // Toggles current state. Not yet sure how I feel about the dual
  // callback approach for a ToggleButton.
  this.toggleState = function() {
    if (this.state) {
      this.state = false;
      this.callbackOff();
    } else {
      this.state = true;
      this.callback();
    }
  }

  // Get/Set state
  this.getState = function() {
    return this.state;
  }

  this.setState = function(state_) {
    this.state = state_;
  }
}