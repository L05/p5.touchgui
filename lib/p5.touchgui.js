// Define constants for touch modes. 
// Note: not sure how to set this up so that it doesn't
//  interfere with other libraries' constants.
const DOWN  = 0;
const UP    = 1;
const HOLD  = 2;

// Prototype functions to make creating buttons easier
p5.prototype.createMomentary = function(x, y, width, height, label, callback) {
  let m = new MomentaryButton(x, y, width, height, label, callback);
  return m;
}

p5.prototype.createToggle = function(x, y, width, height, label, callbackOn, callbackOff) {
  let t = new ToggleButton(x, y, width, height, label, callbackOn, callbackOff);
  return t;
}

// Question for Lauren-- In terms of style, should I be
// adhering to this:
// https://developer.mozilla.org/en-US/docs/MDN/Contribute/Guidelines/Code_guidelines/JavaScript#Defining_functions

////////////////////////////////////////
//////////  UI PARENT CLASS ////////////
////////////////////////////////////////
// --
// Currently has a lot of internal variables that don't yet
// have getters and setters. Core functionality works 
// though. 

function uiObject (x, y, width, height, label) {
  // Construction
  this._x             = x;
  this._y             = y;
  this._width         = width;
  this._height        = height;
  this._fillOff       = color(200, 200, 200, 255);
  this._fillOn        = color(0, 255, 0, 255);
  this._stroke        = color(0, 0, 0, 255);
  this._strokeWeight  = 4;
  this._touched       = false;
  this._labelColor    = color(0, 0, 0, 255);
  this._textSize      = 24;
  this._round         = 0;
  this._state         = false;
  
  this._label         = label || "";
  
  // Methods
  this.position = function(x, y) {
    this._x     = x;
    this._y     = y;
  }
  
  this.size = function(width, height) {
    this._width   = width;
    this._height  = height;
  }
  
  // Internal function for checking if within a rect
  this.overRect = function(x, y) {
    return(x > this._x - this._width/2 && 
           x < this._x + this._width/2 &&
           y > this._y - this._height/2 &&
           y < this._y + this._height/2);
  }
}


////////////////////////////////////////
////////////  BUTTON CLASS /////////////
////////////////////////////////////////
// --
// Child of objectUI class and parent of MomentaryButton 
// and ToggleButton.
// 
// Has three modes for triggering a callback 
// function: DOWN, UP, and HOLD. Implementation of this is
// up to children.

function ButtonRect (x, y, width, height, label, callback) {
  
  // Construction
  uiObject.call(this, x, y, width, height, label);
  this._touchMode = DOWN;
  
  this._callback = callback || function() {
      console.log("No callback defined.");
    };
  
  // Methods
  // draw() calles update() at the start.
  // Uses push() and pop() to disassociate from the
  // user's current drawing style and transformations.
  // Not sure whether or not this is advised.
  this.draw = function() {
    this.update();
    
    push();
      stroke(this._stroke);
      strokeWeight(this._strokeWeight);

      if (this._state) {
      	fill(this._fillOn);
      } else {
      	fill(this._fillOff);
      }

      rectMode(CENTER);
      rect(this._x, this._y, this._width, this._height,       this._round);

      noStroke();
      textAlign(CENTER, CENTER);
      fill(this._labelColor);
      textSize(this._textSize);
      text(this._label, this._x, this._y);
    pop();
  }
  
  this.touchMode = function(modeIn) {
    if (modeIn === DOWN) {
      this._touchMode = DOWN;
    } else if (modeIn === UP) {
      this._touchMode = UP;
    } else if (modeIn === HOLD) {
      this._touchMode = HOLD;
    } else {
      console.log("INVALID MODE TYPE.");
    }
  }
  
  this.round = function(roundIn) {
    this._round = roundIn;
  }

  this.label = function(labelIn) {
    this._label = labelIn;
  }
  
  this.callback = function(callbackIn) {
    this._callback = callbackIn;
  }
  
  this.state = function() {
    return this._state;
  }
}

////////////////////////////////////////
/////////// MOMENTARY BUTTON ///////////
////////////////////////////////////////
// --
// Child class of ButtonRect class. Currently no circle alt.
// 
// Has three modes for triggering a callback 
// function: DOWN, UP, and HOLD.


function MomentaryButton (x, y, width, height, label, callback) {
  
  // Construction
  ButtonRect.call(this, x, y, width, height, label, callback);

  // update() checks to see if mouse press or touches are
  // being detected on the button. There is currently no
  // mouse hover behaviour, though this is being considered.
  this.update = function() {
    
    if(touches.length == 0 && mouseIsPressed) {
      if (this.overRect(mouseX, mouseY)) {
        
        if (this._touchMode == DOWN && !this._touched) {
          this._callback();
        } else if (this._touchMode == HOLD) {
          this._callback();
        }
        
        this._touched = true;
      }
    } else if (touches.length > 0) {
      for (let i = 0; i < touches.length; i++) {
        if (this.overRect(touches[i]._x, touches[i]._y)) {
          
          if (this._touchMode == DOWN && !this._touched) {
            this._callback();
          } else if (this._touchMode == HOLD) {
            this._callback();
          } 
          
          this._touched = true;
        }
      }
    } else if (this._touched && this._touchMode == UP) {
      this._callback();
      this._touched    = false;
    } else {
      this._touched    = false;
    }
    
    this._state = this._touched;
    return this._touched;
  }
}


////////////////////////////////////////
//////////// TOGGLE BUTTON /////////////
////////////////////////////////////////
// --
// Child class of ButtonRect class. Currently no circle alt.
// 
// Has two modes for triggering a callback 
// function: DOWN and UP.

function ToggleButton (x, y, width, height, label, callbackOn, callbackOff){
  
  // Construction
  ButtonRect.call(this, x, y, width, height, label, callbackOn);
  
  this._callbackOff = callbackOff || function() {
    console.log("No callback defined.");
  };

  // update() checks to see if mouse press or touches are
  // being detected on the button. There is currently no
  // mouse hover behaviour, though this is being considered.
  this.update = function() {

    if(touches.length == 0 && mouseIsPressed) {
      if (this.overRect(mouseX, mouseY)) {
        
        if (this._touchMode == DOWN && !this._touched) {
          this.toggleState();
        }
        
        this._touched = true;
      }
    } else if (touches.length > 0) {
      for (let i = 0; i < touches.length; i++) {
        if (this.overRect(touches[i]._x, touches[i]._y)) {
          
          if (this._touchMode == DOWN && !this._touched) {
            this.toggleState();
          }
          
          this._touched = true;
        }
      }
    } else if (this._touched && this._touchMode == UP) {
      this.toggleState();
      this._touched    = false;
    } 
    else {
      this._touched    = false;
    }

    return this._touched;
  }
  
  this.setCallbackOff = function(callbackOff) {
    this._callbackOff = callbackOff_;
    
    if (this._callbackOff === undefined) {
      this._callbackOff = function() {
        print("No callbackOff defined.");
      }
    }
  }
  
  // Toggles current state. Not yet sure how I feel about the dual
  // callback approach for a ToggleButton.
  this.toggleState = function() {
    if (this._state) {
      this._state = false;
      this._callbackOff();
    } else {
      this._state = true;
      this._callback();
    }
  }

  // Get/Set state, not sure if these are useful or not
  this.getState = function() {
    return this._state;
  }

  this.setState = function(state) {
    this._state = state;
  }
}