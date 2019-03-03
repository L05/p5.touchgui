////////////////////////////////////////
/////////// MOMENTARY BUTTON ///////////
////////////////////////////////////////

// Define constants for touch modes. 
// Note: not sure how to set this up so that it doesn't
//  interfere with other libraries' constants.
const DOWN  = 0;
const UP    = 1;
const HOLD  = 2;

// This is an attempt to create a parent Button class.
// Experiencing problems...

//class Button {
//  constructor(x_, y_, width_, height_, label_, callback_) {
//    this.x            = x_;
//    this.y            = y_;
//    this.width        = width_;
//    this.height       = height_;
//    this.round        = 0;
//    this.fillOff      = color(200, 200, 200, 255);
//    this.fillOn       = color(0, 255, 0, 255);
//    this.stroke       = color(0, 0, 0, 255);
//    this.strokeWeight = 4;
//    this.touched      = false;
//    this.labelColor   = color(0, 0, 0, 255);
//    this.textSize     = 24;
//    this.mode         = DOWN;
//    
//    this.label        = label_;
//    if (this.label === undefined) {
//      this.label = "";
//    }
//    
//    this.callback     = callback_;
//    if (this.callback === undefined) {
//      this.callback = function() {
//        print("No callback defined.");
//      }
//    }
//  }
//  
//  setDimensions(x_, y_, width_, height_) {
//    this.x      = x_;
//    this.y      = y_;
//    this.width  = width_;
//    this.height = height_;
//  }
//  
//  setMode(mode_) {
//    if (mode_ === DOWN) {
//      this.mode = DOWN;
//    } else if (mode_ === UP) {
//      this.mode = UP;
//    } else if (mode_ === HOLD) {
//      this.mode = HOLD;
//    } else {
//      console.log("INVALID MODE TYPE.");
//    }
//  }
//  
//  setRound(round_) {
//    this.round = round_;
//  }
//
//  setLabel(label_) {
//    this.label = label_;
//  }
//}
//
//class MomentaryButton extends Button {
//  constructor(x_, 
//              y_, 
//              width_, 
//              height_, 
//              label_,
//              callback_ ) {
//    super(x_, y_, width_, height_ label_, callback_);
//  }


////////////////////////////////////////
/////////// MOMENTARY BUTTON ///////////
////////////////////////////////////////
// --
// Currently has a lot of internal variables that don't yet
// have getters and setters. Core functionality works 
// though. Has three modes for triggering a callback 
// function: DOWN, UP, and HOLD.

class MomentaryButton {
  
  constructor(x_, y_, width_, height_, label_, callback_) {
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
    
    // If label_ or callback_ are undefined, constructor
    // will automatically assign them. This is my work
    // around for constructor overloading.
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
  }
  
  setDimensions(x_, y_, width_, height_) {
    this.x      = x_;
    this.y      = y_;
    this.width  = width_;
    this.height = height_;
  }
  
  // Sets the button's callback mode.
  setMode(mode_) {
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
  
  // Can be used to make a button have round corners.
  setRound(round_) {
    this.round = round_;
  }

  setLabel(label_) {
    this.label = label_;
  }

  // draw() calles update() at the start.
  // Uses push() and pop() to disassociate from the
  // user's current drawing style and transformations.
  // Not sure whether or not this is advised.
  draw() {
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
  update() {
    
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


// For future development.

////////////////////////////////////////
//////////// TOGGLE BUTTON /////////////
////////////////////////////////////////

//class ToggleButton {
//  constructor(pInst, x_, y_, width_, height_, label_) {
//    this.x						= x_;
//    this.y						= y_;
//    this.width				= width_;
//    this.height				= height_;
//    this.round				= 0;
//    this.fillOff			= color(200, 200, 200, 255);
//    this.fillOn				= color(0, 255, 0, 255);
//    this.stroke				= color(0, 0, 0, 255);
//    this.strokeWeight	= 4;
//    this.touched			= false;
//    this.label				= label_;
//    this.labelColor		= color(0, 0, 0, 255);
//    this.state				= false;
//    this.textSize			= 24;
//  }
//
//
//  setDimensions(x_, y_, width_, height_) {
//    this.x						= x_;
//    this.y						= y_;
//    this.width				= width_;
//    this.height				= height_;
//  }
//
//  display() {
//    push();
//      stroke(this.stroke);
//      strokeWeight(this.strokeWeight);
//
//      if (this.state) {
//        fill(this.fillOn);
//      } else {
//        fill(this.fillOff);
//      }
//
//      rectMode(CENTER);
//      rect(this.x, this.y, this.width, this.height,       this.round);
//
//      noStroke();
//      textAlign(CENTER,CENTER);
//      fill(this.labelColor);
//      textSize(this.textSize);
//      text(this.label, this.x, this.y);
//    pop();
//  }
//
//  checkTouched() {
//    this.touched = false;
//
//    for (let i = 0; i < touches.length; i++) {
//      if (touches[i].x > this.x-this.width/2 &&
//          touches[i].x < this.x+this.width/2 &&
//          touches[i].y > this.y-this.height/2 &&
//          touches[i].y < this.y+this.height/2) {
//        this.touched = true;
//
//        if (this.state == true) {
//          this.state = false;
//        } else {
//          this.state = true;
//        }
//      }
//    }
//
//    return this.touched;
//  }
//
//  getState() {
//    return this.state;
//  }
//
//  setState(state_) {
//    this.state = state_;
//  }
//
//  setRound(round_) {
//    this.round = round_;
//  }
//
//  setLabel(label_) {
//    this.label = label_;
//  }
//}