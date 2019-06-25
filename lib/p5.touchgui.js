// Define constants for touch modes. 
// Note: not sure how to set this up so that it doesn't
//  interfere with other libraries' constants.
const DOWN  = 0;
const UP    = 1;
const HOLD  = 2;

// If p5 is not null, 
// prototype functions to make creating buttons easier...
if (p5 !== null) {
  p5.prototype.createMomentary = function() {
    let m = new MomentaryButton(...arguments);
    return m;
  }

  p5.prototype.createToggle = function() {
    let t = new ToggleButton(...arguments);
    return t;
  }
}

// TO DO: 
// - Create a way to add all UI elements to a list and style them
//   all at once
// - Have the ability to style elements individually
// - Inherit certain stylings and settings from the p5 sketch by
//   default but then customize from there if desired 
//   (i.e. textFont)

////////////////////////////////////////
//////////  UI PARENT CLASS ////////////
////////////////////////////////////////
// --
// Currently has a lot of internal variables that don't yet
// have getters and setters. Core functionality works 
// though. 

class UiObject {
  constructor() {
    // Construction
    if(arguments.length === 5 && 
       typeof arguments[0] === 'number' && 
       typeof arguments[1] === 'number' && 
       typeof arguments[2] === 'number' && 
       typeof arguments[3] === 'number' && 
       typeof arguments[4] === 'string') {
      //x, y, width, height, label  
      this.x             = arguments[0];
      this.y             = arguments[1];
      this.width         = arguments[2];
      this.height        = arguments[3];// || width;
      this.fillOff       = color('#EFEFF0');
      this.fillOn        = color('#C9F0FF');
      this.stroke        = color('#D5CAD6');
      this.strokeWeight  = 4;
      this.touched       = false;
      this.labelColor    = color('#6B5E62');
      this.textSize      = 24;
      this.round         = 0;
      this._state         = false;

      this.label         = arguments[4];// || "";
    } else if (arguments.length === 4 && 
               typeof arguments[0] === 'number' && 
               typeof arguments[1] === 'number' && 
               typeof arguments[2] === 'number' && 
               typeof arguments[3] === 'number') {
      //x, y, width, height
      this.x             = arguments[0];
      this.y             = arguments[1];
      this.width         = arguments[2];
      this.height        = arguments[3];// || width;
      this.fillOff       = color('#EFEFF0');
      this.fillOn        = color('#C9F0FF');
      this.stroke        = color('#D5CAD6');
      this.strokeWeight  = 4;
      this.touched       = false;
      this.labelColor    = color('#6B5E62');
      this.textSize      = 24;
      this.round         = 0;
      this._state         = false;
      
      this.label         = "";
    } else if (arguments.length === 3 && 
               typeof arguments[0] === 'number' && 
               typeof arguments[1] === 'number' && 
               typeof arguments[2] === 'number') {
      //x, y, width, height
      this.x             = arguments[0];
      this.y             = arguments[1];
      this.width         = arguments[2];
      this.height        = arguments[2];
      this.fillOff       = color('#EFEFF0');
      this.fillOn        = color('#C9F0FF');
      this.stroke        = color('#D5CAD6');
      this.strokeWeight  = 4;
      this.touched       = false;
      this.labelColor    = color('#6B5E62');
      this.textSize      = 24;
      this.round         = 0;
      this._state         = false;
      
      this.label         = "";
    } else {
      // Need to come up with a proper error message. How is this done?
      console.log("Improper UiObject object construction.");
    }
  }
  
  // Methods
  position(x, y) {
    this.x     = x;
    this.y     = y;
  }
  
  size(width, height) {
    this.width   = width;
    this.height  = height;
  }
  
  textSize(textSizeIn) {
    this.textSize = textSizeIn;
  }
  
  // Internal function for checking if a point is within 
  // a rect
  overRect(x, y) {
    return(x > this.x - this.width/2 && 
           x < this.x + this.width/2 &&
           y > this.y - this.height/2 &&
           y < this.y + this.height/2);
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

class ButtonRect extends UiObject {
  constructor() {
    
    // Check for variations in constructor parameter
    if(arguments.length === 7 && 
       typeof arguments[0] === 'number' && 
       typeof arguments[1] === 'number' && 
       typeof arguments[2] === 'number' && 
       typeof arguments[3] === 'number' && 
       typeof arguments[4] === 'string' && 
       typeof arguments[5] === 'function' && 
       typeof arguments[6] === 'function') {
      //x, y, width, height, label, callbackOn, callbackOff
      super(arguments[0], 
            arguments[1], 
            arguments[2], 
            arguments[3], 
            arguments[4]);
      this.touchMode    = DOWN;
      this._callbackOn  = arguments[5];
      this._callbackOff = arguments[6];
      
    } else if(arguments.length === 6 && 
       typeof arguments[0] === 'number' && 
       typeof arguments[1] === 'number' && 
       typeof arguments[2] === 'number' && 
       typeof arguments[3] === 'number' && 
       typeof arguments[4] === 'string' && 
       typeof arguments[5] === 'function') {
      //x, y, width, height, label, callback
      super(arguments[0], 
            arguments[1], 
            arguments[2], 
            arguments[3], 
            arguments[4]);
      this.touchMode    = DOWN;
      this._callbackOn  = arguments[5];
      this._callbackOff = function() {
        console.log("No callback defined.");
      };
      
    } else if(arguments.length === 6 && 
       typeof arguments[0] === 'number' && 
       typeof arguments[1] === 'number' && 
       typeof arguments[2] === 'number' && 
       typeof arguments[3] === 'string' && 
       typeof arguments[4] === 'function' && 
       typeof arguments[5] === 'function') {
      //x, y, width, label, callbackOn, callbackOff
      super(arguments[0], 
            arguments[1], 
            arguments[2], 
            arguments[2], 
            arguments[3]);
      this.touchMode    = DOWN;
      this._callbackOn  = arguments[4];
      this._callbackOff = arguments[5];
      
    } else if(arguments.length === 5 && 
              typeof arguments[0] === 'number' && 
              typeof arguments[1] === 'number' && 
              typeof arguments[2] === 'number' && 
              typeof arguments[3] === 'number' && 
              typeof arguments[4] === 'string') {
      //x, y, width, height, label
      super(arguments[0], 
            arguments[1], 
            arguments[2], 
            arguments[3], 
            arguments[4]);
      this.touchMode = DOWN;
      this._callbackOn = function() {
        console.log("No callback defined.");
      };
      this._callbackOff = function() {
        console.log("No callback defined.");
      };
      
    } else if(arguments.length === 5 && 
              typeof arguments[0] === 'number' && 
              typeof arguments[1] === 'number' && 
              typeof arguments[2] === 'number' && 
              typeof arguments[3] === 'string' && 
              typeof arguments[4] === 'function') {
      //x, y, width, labell, callback
      super(arguments[0], 
            arguments[1], 
            arguments[2], 
            arguments[2], 
            arguments[3]);
      this.touchMode = DOWN;
      this._callbackOn = arguments[4];
      this._callbackOff = function() {
        console.log("No callback defined.");
      };
      
    } else if(arguments.length === 4 && 
              typeof arguments[0] === 'number' && 
              typeof arguments[1] === 'number' && 
              typeof arguments[2] === 'number' && 
              typeof arguments[3] === 'number') {
      //x, y, width, height
      super(arguments[0], 
            arguments[1], 
            arguments[2], 
            arguments[3], 
            "");
      this.touchMode = DOWN;
      this._callbackOn = function() {
        console.log("No callback defined.");
      };
      this._callbackOff = function() {
        console.log("No callback defined.");
      };
      
    } else if(arguments.length === 4 && 
              typeof arguments[0] === 'number' && 
              typeof arguments[1] === 'number' && 
              typeof arguments[2] === 'number' && 
              typeof arguments[3] === 'string') {
      //x, y, width, label
      super(arguments[0], 
            arguments[1], 
            arguments[2], 
            arguments[2], 
            arguments[3]);
      this.touchMode = DOWN;
      this._callbackOn = function() {
        console.log("No callback defined.");
      };
      this._callbackOff = function() {
        console.log("No callback defined.");
      };
      
    } else if(arguments.length === 3 && 
              typeof arguments[0] === 'number' && 
              typeof arguments[1] === 'number' && 
              typeof arguments[2] === 'number') {
      //x, y, width
      super(arguments[0], 
            arguments[1], 
            arguments[2], 
            arguments[2], 
            "");
      this.touchMode = DOWN;
      this._callbackOn = function() {
        console.log("No callback defined.");
      };
      this._callbackOff = function() {
        console.log("No callback defined.");
      };
      
    } else {
      // Need to come up with a proper error message. How is this done?
      console.log("Improper Button object construction.");
    }
    
  }
  
  // Methods
  // draw() calles update() at the start.
  // Uses push() and pop() to disassociate from the
  // user's current drawing style and transformations.
  // Not sure whether or not this is advised.
  draw() {
    this.update();
    
    push();
      stroke(this.stroke);
      strokeWeight(this.strokeWeight);
    
      if (this._state) {
      	fill(this.fillOn);
      } else {
      	fill(this.fillOff);
      }

      rectMode(CENTER);
      rect(this.x, this.y, this.width, this.height, this.round);

      noStroke();
      textAlign(CENTER, CENTER);
      fill(this.labelColor);
      textSize(this.textSize);
      text(this.label, this.x, this.y);
    pop();
  }
  
  touchMode(modeIn) {
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
  
  // Useful for MomentaryButton, which only has one callback
  callback(callbackIn) {
    if(typeof callbackIn === 'function') {
      this._callbackOn = callbackIn;
    } else {
      this._callbackOn = function() {
        console.log("No callback defined.");
      };
    }
  }
  
  // Useful for ToggleButton, which has callbackOn and callbackOff
  callbackOn(callbackIn) {
    this._callbackOn(callbackIn);
  }
  
  callbackOff(callbackIn) {
    if(typeof callbackIn === 'function') {
      this._callbackOff = callbackIn;
    } else {
      this._callbackOff = function() {
        console.log("No callback defined.");
      };
    }
  }
  
  state() {
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


class MomentaryButton extends ButtonRect {
  constructor() {
  
    //x, y, width, height, label, callback
    super(...arguments);

    this.touchMode = HOLD; // Commonly expected behavior for a momentary
  }

  // update() checks to see if mouse press or touches are
  // being detected on the button. There is currently no
  // mouse hover behaviour, though this is being considered.
  update() {
    
    if(touches.length == 0 && mouseIsPressed) {
      if (this.overRect(mouseX, mouseY)) {
        
        if (this.touchMode == DOWN && !this._state) {
          this._callbackOn();
        } else if (this.touchMode == HOLD) {
          this._callbackOn();
        }
        
        this._state = true;
      }
    } else if (touches.length > 0) {
      for (let i = 0; i < touches.length; i++) {
        if (this.overRect(touches[i].x, touches[i].y)) {
          
          if (this.touchMode == DOWN && !this._state) {
            this._callbackOn();
          } else if (this.touchMode == HOLD) {
            this._callbackOn();
          } 
          
          this._state = true;
        }
      }
    } else if (this._state && this.touchMode == UP) {
      this._callbackOn();
      this._state    = false;
    } else {
      this._state    = false;
    }
    
    return this._state;
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

class ToggleButton extends ButtonRect {
  constructor(){

    //x, y, width, height, label, callbackOn, callbackOff
    super(...arguments);
    
    // internal helper variable for preventing state toggling
    // on held touches
    this._touched = false;
  }

  // update() checks to see if mouse press or touches are
  // being detected on the button. There is currently no
  // mouse hover behaviour, though this is being considered.
  update() {

    if(touches.length == 0 && mouseIsPressed) {
      if (this.overRect(mouseX, mouseY)) {
        
        if (this.touchMode == DOWN && !this._touched) {
          this.toggleState();
        }
        
        this._touched = true;
      }
    } else if (touches.length > 0) {
      for (let i = 0; i < touches.length; i++) {
        if (this.overRect(touches[i].x, touches[i].y)) {
          
          if (this.touchMode == DOWN && !this._touched) {
            this.toggleState();
          }
          
          this._touched = true;
        }
      }
    } else if (this._touched && this.touchMode == UP) {
      this.toggleState();
      this._touched    = false;
    } 
    else {
      this._touched    = false;
    }

    return this._touched;
  }

  // Toggles current state. Not yet sure how I feel about the dual
  // callback approach for a ToggleButton.
  toggleState() {
    if (this._state) {
      this._state = false;
      this._callbackOff();
    } else {
      this._state = true;
      this._callbackOn();
    }
  }

  // Get/Set state, not sure if these are useful or not
  state() {
    if(arguments.length === 0) {
      return this._state;
    } else if(arguments.length === 1 && typeof arguments[0] == 'boolean') {
      this._state = arguments[0];
    }
  }
}