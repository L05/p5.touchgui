// Create GUI context
let _gui;

/**
 * Prototype functions to make library 
 * method calls more like p5.js.
 */
p5.prototype.createGui = function() {
  _gui = new GuiContext();
  return _gui;
};

p5.prototype.updateGui = function() {
  _gui.update();
};

// Prototype functions for GUI elements
p5.prototype.createButton = function(label, x, y, w=128, h=32) {
  let obj = new GuiButton(label, x, y, w, h);
  _gui.add(obj);
  return obj;
};

p5.prototype.createToggle = function(label, x, y, w=128, h=32, defaultVal = false) {
  let obj = new GuiToggle(label, x, y, w, h, defaultVal);
  _gui.add(obj);
  return obj;
};

p5.prototype.createCheckbox = function(label, x, y, w=32, h=32, defaultVal = false) {
  let obj = new GuiCheckbox(label, x, y, w, h, defaultVal);
  _gui.add(obj);
  return obj;
};

p5.prototype.createSlider = function(label, x, y, w=256, h=32, min=0, max=1) {
  let obj = new GuiSlider(label, x, y, w, h, min, max);
  _gui.add(obj);
  return obj;
};

p5.prototype.createSliderV = function(label, x, y, w=32, h=256, min=0, max=1) {
  let obj = new GuiSliderV(label, x, y, w, h, min, max);
  _gui.add(obj);
  return obj;
};

p5.prototype.createCrossfader = function(label, x, y, w=256, h=32, min=(-1), max=1) {
  let obj = new GuiCrossfader(label, x, y, w, h, min, max);
  _gui.add(obj);
  return obj;
};

p5.prototype.createCrossfaderV = function(label, x, y, w=256, h=32, min=(-1), max=1) {
  let obj = new GuiCrossfaderV(label, x, y, w, h, min, max);
  _gui.add(obj);
  return obj;
};

p5.prototype.createSlider2d = function(label, x, y, w=256, h=256, minX=(-1), maxX=1, minY=(-1), maxY=1) {
  let obj = new GuiSlider2d(label, x, y, w, h, minX, maxX, minY, maxY);
  _gui.add(obj);
  return obj;
};

p5.prototype.createJoystick = function(label, x, y, w=256, h=256, minX=(-1), maxX=1, minY=(-1), maxY=1) {
  let obj = new GuiJoystick(label, x, y, w, h, minX, maxX, minY, maxY);
  _gui.add(obj);
  return obj;
};

p5.prototype._guiPostDraw = function() {
  if (_gui != null) {
    _gui.postDraw();
  }
};

p5.prototype.registerMethod('post', p5.prototype._guiPostDraw);

/**
 * Generates hash code from a string.
 * @see http://stackoverflow.com/q/7616461/940217
 * @return {number}
 * Note: this is not being used in this version of the library. Will remove once I'm
 *  sure it's going to stay that way.
 */
String.prototype.hashCode = function(){
    if (Array.prototype.reduce){
        return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
    } 
    var hash = 0;
    if (this.length === 0) return hash;
    for (var i = 0; i < this.length; i++) {
        var character  = this.charCodeAt(i);
        hash  = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function _findByKey(obj, value) {
    return Object.keys(obj)[Object.values(obj).indexOf(value)];
}

/*******************
 * GuiContext
 * - Creates a GUI context to track all GUI objects.
 */
class GuiContext {
  constructor() {
    this.objects        = [];
    
    this.touchInput     = false; // true if the last input was a touch event
    this.activeIds      = {};
    this._ptouches      = {};
    this._hoverObj      = null;
    
    this.style          = new GuiStyle();
    // this.style.Blue(); // Uncomment for blue color theme
    
    // Define touchGui eventHandlers for mouse and touch so as not to interfere
    // with p5.js eventHandlers
    
    this.onMouseDown    = this.onMouseDown.bind(this);
    this.onMouseMove    = this.onMouseMove.bind(this);
    this.onMouseLeave   = this.onMouseLeave.bind(this);
    this.onMouseUp      = this.onMouseUp.bind(this);
    this.onTouchStart   = this.onTouchStart.bind(this);
    this.onTouchMove    = this.onTouchMove.bind(this);
    this.onTouchEnd     = this.onTouchEnd.bind(this);
    this.onTouchCancel  = this.onTouchCancel.bind(this);
    
    document.addEventListener("mousedown", this.onMouseDown, false);
    document.addEventListener("mousemove", this.onMouseMove, false);
    document.addEventListener("mouseleave", this.onMouseLeave, false);
    document.addEventListener("mouseup", this.onMouseUp, false);
    document.addEventListener("touchstart", this.onTouchStart, false);
    document.addEventListener("touchmove", this.onTouchMove, false);
    document.addEventListener("touchend", this.onTouchEnd, false);
    document.addEventListener("touchcancel", this.onTouchCancel, false);
  }
  
  // Add a new object to the GUI context
  add(newObj) {
    this.objects.forEach(function(obj) {
      if (newObj.label == obj.label) {
        console.error("All GUI objects must have a unique label. Duplicate label \'" + newObj.label + "\' found.");
        return false;
      }
    });
    
    // Store object's index within itself
    newObj._index = this.objects.length;
    this.objects.push(newObj);
    
    return true;
  }
  
  // Get an object from the GUI context by label
  get(label) {
    let fetchedObj = null;
    this.objects.forEach(function(obj) {
      if (obj.label == label) {
        fetchedObj = obj;
      }
    });
    
    if (fetchedObj == null) {
      console.error("No GUI object with label \'" + label + "\' has been found.");
    }
    
    return fetchedObj;
  }
  
  // Get position relative to canvas
  getCanvasPos(x, y) {
    let rect = canvas.getBoundingClientRect();
    let sx = canvas.scrollWidth / this.width || 1;
    let sy = canvas.scrollHeight / this.height || 1;
    let p = {x: 0, y: 0};
    
    p.x = (x - rect.left) / sx;
    p.y = (y - rect.top) / sy;
    
    return p;
  }
  
  // Update and draw the GUI (should be run each frame after background())
  update() {
    this.objects.forEach(function(obj) {
      if (obj.visible) { 
        obj.draw(); 
      }
    });
  }
  
  // Automatically gets run after the draw loop, storing each object's previous state
  // for reference in the next frame
  postDraw() {
    this.objects.forEach(function(obj) {
      obj.postDraw();
    });
  }
  
  //// EVENT HANDLING
  
  // MOUSE
  onMouseDown(e) {
    // Get a hit result for the click and the current mouse position
    let result  = this.checkHit(mouseX, mouseY);
    let m       = this.getCanvasPos(e.clientX, e.clientY);
    
    // If there's a successful hit and the object is visible and enabled,
    // process the mouse press
    if (result.hit) {
      if (result.obj.visible && result.obj.enabled) {
        let obj = result.obj;
        this.onPress(obj, m);
        this.activeIds[-1] = obj._index;
      }
    }
  }
  
  onMouseMove(e) {
    let m = this.getCanvasPos(e.clientX, e.clientY);
    
    // If any mouse buttons are pressed
    if (e.buttons >= 1) {
      // And if the mouse isn't currently locked on an object,
      // process the mouse input
      if (this.activeIds[-1] != null) {
        let obj = this.objects[this.activeIds[-1]];
        this.onMove(obj, m);
      }
    }
    else {
      
      // If not, check for mouse hovering over an object
      let result  = this.checkHit(mouseX, mouseY);
      
      if (this._hoverObj != null) {
        this._hoverObj._hover  = false;
        this._hoverObj         = null;
      }
      
      if (result.hit) {
        if (result.obj.visible && result.obj.enabled) {
          result.obj._hover = true;
          this._hoverObj    = result.obj;
        }
      }
    }
  }
  
  // In case the mouse leaves the screen, make sure to
  // deactivate any hovers
  onMouseLeave(e) {
    if (this._hoverObj != null) {
      this._hoverObj._hover  = false;
      this._hoverObj         = null;
    }
  }
  
  onMouseUp(e) {
    // If the mouse was locked to an object, process the release
    if (this.activeIds[-1] != null) {
      let obj = this.objects[this.activeIds[-1]];
      this.onRelease(obj);
    }
    
    // Set the mouse active ID to null (no objects locked)
    this.activeIds[-1] = null;
  }
  
  // MULTI-TOUCH
  
  onTouchStart(e) {
    // If any touch events are registered, shut off any hovered objects
    if (this._hoverObj != null) {
      this._hoverObj._hover  = false;
      this._hoverObj         = null;
    }
    
    // Loop through all active touchpoints
    for (let i = 0; i < e.touches.length; i++) {
      let t       = this.getCanvasPos(e.touches[i].clientX, e.touches[i].clientY);
      let id      = e.touches[i].identifier;
      let result  = this.checkHit(t.x, t.y);
      
      // If there's a hit
      if (result.hit) {
        // And the object is visible and enabled and the touch is not
        // already locked on an object, process the input
        if (result.obj.visible && result.obj.enabled && this.activeIds[id] == null) {
          let obj = result.obj;
          this.onPress(obj, t);
          this.activeIds[id] = obj._index;
        }
      }
    }

    // Store current touches for future reference
    this._ptouches = e.touches;
  }

  onTouchMove(e) {
    // If any touch events are registered, shut off any hovered objects
    if (this._hoverObj != null) {
      this._hoverObj._hover  = false;
      this._hoverObj         = null;
    }
    
    // Loop through all active touch
    for (let i = 0; i < e.touches.length; i++) {
      let t   = this.getCanvasPos(e.touches[i].clientX, e.touches[i].clientY);
      let id  = e.touches[i].identifier;
      
      // If the touch is already locked on an object, process the input
      if (this.activeIds[id] != null) {
        let obj = this.objects[this.activeIds[id]];
        this.onMove(obj, t);
      }
    }

    // Store current touches for future reference
    this._ptouches = e.touches;
  }
  
  onTouchEnd(e) {    
    // Get removed touch id
    let id = null; 
    for (let i = 0; i < this._ptouches.length; i++) {
      let found = false;
      
      for (let j = 0; j < e.touches.length; j++) {
        if (e.touches[j].identifier == this._ptouches[i].identifier) {
          found = true;
        }
      }
      
      if (!found) { id = this._ptouches[i].identifier; }
    }
    
    // If the touch was locked on an object, release the object
    if (this.activeIds[id] != null) {
      let obj = this.objects[this.activeIds[id]];     
      this.onRelease(obj);
    }
    
    // Set the touch active ID to null (no objects locked)
    this.activeIds[id] = null;
    
    // Store current touches for future reference
    this._ptouches = e.touches;
  }
  
  // In case there are 'touchcancel' events, issue a warning
  onTouchCancel(e) {
    console.warn("\'touchcancel\' event detected.")
  }
  
  // Process input press on a specified object
  onPress(obj, p) {
    obj.setStates(true, false, false);
    obj.setSelect(p.x, p.y);
    obj.setTrigger();
    obj.set(true);

    if (obj.onPress != null) {
      if (typeof obj.onPress === "function") {
        obj.onPress();
      }
      else {
        console.error("Please assign a valid function for " + obj.label + " \'onPress\' callback.");
      }
    }
  }
  
  // Process input move on a specified object
  onMove(obj, p) {
    obj.setStates(false, true, false);
    obj.setSelect(p.x, p.y);
    obj.setTrigger();
    obj.set(true);

    
  }
  
  // Process input release on a specified object
  onRelease(obj) {
    obj.setStates(false, false, true);
    obj.setTrigger();
    obj.set(false);

    if (obj.onRelease != null) {
      if (typeof obj.onRelease === "function") {
        obj.onRelease();
      }
      else {
        console.error("Please assign a valid function for " + obj.label + " \'onRelease\' callback.");
      }
    }
  }
  
  checkHit(x, y) {
    let result = {
      hit: false,
      index: null,
      obj: null
    };
    
    this.objects.forEach(function(obj) {
      if (obj.checkHit(x, y)) {
        result.hit    = true;
        result.index  = obj._index;
        result.obj    = obj;
      }
    });
    
    return result;
  }
}

/*******************
 * GuiObject
 * - This is the base class for all GuiObjects. It contains common variables
 *   and its update() method handles mouse and touch inputs on a per object
 *   basis depending on its defined interaction mode.
 *
 *  TODO: add an input lock mode. Need to track touch IDs in order to do this, which
 *    is not simple and straightforward. Object should know which touch initiated contact. This
 *    may need to be done at the context level, not yet sure without further investigation.
 */
class GuiObject {
  constructor(label, x, y, w, h) {
    this._active    = false;
    this._pactive   = false;
    this._hover     = false;
    this._selU      = null;     // selection U and V within object
    this._selV      = null;
    this._pselU     = null;
    this._pselV     = null;
    this._type      = null;
    this._triggered = false;    // An internal variable, but affected by behavior mode
    this._index     = null;     // Index representing object location when added to context stack
    
    this.label      = label;
    this.x          = x;
    this.y          = y;
    this.w          = w;
    this.h          = h;
    this.mode       = "onPress";  // User can define behavior mode: "onPress", "onHold", "onRelease"
    
    this.pressed    = false;
    this.held       = false;
    this.released   = false;
    this.changed    = false;
    this._ppressed  = false;
    this._pheld     = false;
    this._preleased = false;
    this._pchanged  = false;
    
    this.val        = 0;
//    this.lock       = true;
    this.enabled    = true;     // enabled for input, false if for display only
    this.visible    = true;     // visibility flag for object; 
                                //  when not visible, input is overridden to false
    this.onPress    = null;
    this.onHold     = null;
    this.onRelease  = null;
    this.onChange   = null;
    
    this.style      = _gui.style;
    
    // Check if the _gui has been created.
    if (_gui == null) {
      console.error("No GuiContext has been created. Please call CreateGui() before creating any GuiObjects.");
    }
  }
  
  // Basic function for checking hits on a rectangle
  checkHit(x, y) {
    if (x < this.x || 
        y < this.y || 
        x >= this.x + this.w || 
        y >= this.y + this.h) {
      return false;
    }
    return true;
  }
  
  // Sets the object's 'pressed', 'held', 'released', and 'changed' states
  setStates(newPressed, newHeld, newReleased) {
    this.pressed  = newPressed;
    this.held     = newHeld;
    this.released = newReleased;
    
    if (!(this._ppressed && !this._pheld) && 
        (this._ppressed != this.pressed || 
         this._pheld != this.held || 
         this._preleased != this.released)) {
      this.changed = true;
    }
  }
  
  // Sets the input selection U and V, normalized and relative to UI object location and size
  // Note: this might break if objects are drawn with CENTER mode in the future
  //    (instead of CORNERS mode)
  setSelect(x, y) {
    this._selU = constrain(x - this.x, 0, this.w)/this.w;
    this._selV = constrain(y - this.y, 0, this.h)/this.h;
    
    // If the object is a 'slider' type, set 'changed' state if any input location change
    if (this._type == "slider" && (this._selU != this._pselU || this._selV != this._pselV)) {
      this.changed = true;
    }
  }
  
  
  // Set the object trigger, used internally for interaction behavior mode
  setTrigger() {
    // Handle improper trigger mode input from user
    if (this.mode !== "onPress" &&
        this.mode !== "onHold" &&
        this.mode !== "onRelease") {
      console.warn("Interaction mode for " + this.label + " must be set to \"onPress\", \"onHold\", or \"onRelease\". Defaulting to \"onPress\".");
        this.mode = "onPress";
    }
    
    // Set triggered based on mode
    if (this.mode === "onPress" && this.pressed) {
      this._triggered = true;
    }
    else if (this.mode === "onHold" && this.held) {
      this._triggered = true;
    }
    else if (this.mode === "onRelease" && this.released) {
      this._triggered = true;
    }
    else {
      this._triggered = false;
    }
  }
  
  // Set the object's 'active' state as well as 'changed' state if different than
  // previous frame
  set(active) {
    this._active = active;
    
    if (this._active != this._pactive) {
      this.changed = true;
    }
  }
  
  // Stores the object's state for reference in a future frame and
  // calls onHold or onChange if defined.
  postDraw() {
    if (this.pressed) {
      this.held = true;
    } 
    else if (this.released) {
      this.held = false;
    }
    
    if (this.held) {
      if (this.onHold != null) {
        if (typeof this.onHold === "function") {
          this.onHold();
        }
        else {
          console.error("Please assign a valid function for " + this.label + " \'onHold\' callback.");
        }
      }
    }
    
    if (this.changed) {
      if (this.onChange != null) {
        if (typeof this.onChange === "function") {
          this.onChange();
        }
        else {
          console.error("Please assign a valid function for " + this.label + " \'onChange\' callback.");
        }
      }
    }

    this._ppressed   = this.pressed;
    this._pheld      = this.held;
    this._preleased  = this.released;
    this._pchanged   = this.changed;
    this._pactive    = this._active;
    this._pselU      = this._selU;
    this._pselV      = this._selV;

    this.pressed   = false;
    this.released  = false;
    this.changed   = false;
  }
}


/**
 * GuiButton
 * - Momentary button with a label.
 */
class GuiButton extends GuiObject {
  constructor(label, x, y, w=128, h=32) {
    super(label, x, y, w, h);
    
    this._type = "button";
  }
  
  set(active) {
    super.set(active);
    
    // Set val to active
    // Note: doesn't account for ability to override when input=false
    this.val = this._active;
  }
  
  draw() {
    // Render button
    push();
    
      stroke(this.style.col_bStroke);
      strokeWeight(this.style.bStrokeWt);
      rectMode(CORNER);

      if (this._active) {
        // Button is active
        fill(this.style.col_bFillActive);
      }
      else if (this._hover) {
        // Button is hovered over by mouse
        fill(this.style.col_bFillHover);
      }
      else {
        // Button is not interacted with
        fill(this.style.col_bFill);
      }
    
      rect(this.x, this.y, this.w, this.h, this.style.rounding);

      // Label rendering.
      push();
        fill(this.style.col_bLabel);
        noStroke();
        textAlign(CENTER, CENTER);
        textFont(this.style.labelFont);
        let size = this.w/10;
        if (size > this.style.labelFontMaxSize) {
          size = this.style.labelFontMaxSize;
        }
        textSize(size);
        text(this.label, this.x + this.w/2, this.y + this.h/2);
      pop();

    pop();
  }
}

/**
 * GuiToggle
 * - Toggle button with a label.
 */
class GuiToggle extends GuiObject { 
  constructor(label, x, y, w=128, h=32, defaultVal = false) {
    super(label, x, y, w, h);
    
    this.val    = defaultVal;
    this._type  = "toggle";
  }

  set(active) {
    super.set(active);
    
    if (this._triggered) {
      this.val = !this.val;
    }
  }
  
  draw() {
    // Render button
    push();
    
      stroke(this.style.col_bStroke);
      strokeWeight(this.style.bStrokeWt);
      rectMode(CORNER);

      if (this._active && this.val) {
        fill(this.style.col_tOnFillActive);
      }
      else if (this._active && !this.val) {
        fill(this.style.col_tOffFillActive);
      }
      else if (this._hover && this.val) {
        fill(this.style.col_tOnFillHover);
      }
      else if (this._hover && !this.val) {
        fill(this.style.col_tOffFillHover);
      }
      else if (this.val) {
        fill(this.style.col_tOnFill);
      }
      else {
        fill(this.style.col_tOffFill);
      }
    
      rect(this.x, this.y, this.w, this.h, this.style.rounding);

      // Label rendering.
      push();
        fill(this.style.col_bLabel);
        noStroke();
        textAlign(CENTER, CENTER);
        textFont(this.style.labelFont);
        let size = this.w/10;
        if (size > this.style.labelFontMaxSize) {
          size = this.style.labelFontMaxSize;
        }
        textSize(size);
        text(this.label, this.x + this.w/2, this.y + this.h/2);
      pop();

    pop();
  }
}

/**
 * GuiCheckbox
 * - Checkbox. Similar to a toggle but with a big X instead of a label.
 */
class GuiCheckbox extends GuiObject {
  constructor(label, x, y, w=32, h=32, defaultVal = false) {
    super(label, x, y, w, h);
    
    this.val    = defaultVal;
    this._type  = "toggle";
  }
  
  set(active) {
    super.set(active);
    
    if (this._triggered) {
      this.val = !this.val;
    }
  }
  
  draw() {
    // Render button
    // Note: I don't really like how this is done; it's sloppy lol
    let x8  = this.x+this.w/6;
    let y8  = this.y+this.h/6;
    let w16 = this.w-this.w/3;
    let h16 = this.h-this.h/3;
    let xw  = x8+w16;
    let yh  = y8+h16;
    let strokeMult = map(((this.w > this.h) ? this.w : this.h), 32, 1000, 2, 20);
    
    push();
      rectMode(CORNER);
      stroke(this.style.col_cbOuterStroke);
      strokeWeight(this.style.cbStrokeWt);
      fill(this.style.col_cbOuterFill);
      rect(this.x, this.y, this.w, this.h, this.style.rounding);


      if (this._hover && !this.val) {
        // Button is false and being hovered over
        fill(this.style.col_cbOuterFillHover);
        rect(this.x, this.y, this.w, this.h, this.style.rounding);
      }
      else if (this._hover && this.val) {
        // Button is true and being hovered over
        push();
          stroke(this.style.col_cbInnerStrokeHover);
          strokeWeight(this.style.cbStrokeWt*strokeMult);
          line(x8, y8, xw, yh);
          line(xw, y8, x8, yh);
        pop();
      }
      else if (this._active) {
        // Button is active
        fill(this.style.col_cbOuterFillActive);
        rect(this.x, this.y, this.w, this.h, this.style.rounding);
        
        if (this.val) {
          // Button is true
          push();
            stroke(this.style.col_cbInnerStrokeActive);
            strokeWeight(this.style.cbStrokeWt*strokeMult);
            line(x8, y8, xw, yh);
            line(xw, y8, x8, yh);
          pop();
        }
      }
      else if (this.val) {
        // Button is true but not active or being hovered over
        push();
          stroke(this.style.col_cbInnerStroke);
          strokeWeight(this.style.cbStrokeWt*strokeMult);
          line(x8, y8, xw, yh);
          line(xw, y8, x8, yh);
        pop();
      }
    
    pop();
  }
}

/**
 * GuiSlider
 * - Horizontal slider.
 *
 *  TODO: fix hard coding of buffers (e.g. this.w-24)
 *  TODO: fix so that touch corresponds with handle
 */
class GuiSlider extends GuiObject {
  constructor(label, x, y, w=256, h=32, min=0, max=1) {
    super(label, x, y, w, h);
    
    this.min    = min;
    this.max    = max;
    this.val    = min + (max - min)/2;
    this._type  = "slider";
  } 

  set(active) {
    super.set(active);
    
    if (this._active && this._selU != null) {
      this.val  = map(this._selU, 0, 1, this.min, this.max);
    }
  }
  
  draw() {
    if (this._active) {
      this.drawState(this.style.col_sBgFillActive,
                     this.style.col_sIndctrFillActive,
                     this.style.col_sGrabFillActive,
                     this.style.col_sGrabStroke);
    }
    else if (this._hover) {
      this.drawState(this.style.col_sBgFillHover,
                     this.style.col_sIndctrFillHover,
                     this.style.col_sGrabFillHover,
                     this.style.col_sGrabStroke);
    }
    else {
      this.drawState(this.style.col_sBgFill,
                     this.style.col_sIndctrFill,
                     this.style.col_sGrabFill,
                     this.style.col_sGrabStroke);
    }
  }
  
  drawState(bgFill, indctrFill, grabFill, grabStroke) {
    let xpos = map(this.val, this.min, this.max, 8, this.w-24);

    push();
      stroke(this.style.col_sStroke);
      strokeWeight(this.style.sStrokeWt);
      rectMode(CORNER);

      // Render bg
      fill(bgFill);
      rect(this.x, this.y, this.w, this.h, this.style.rounding);

      // Render indicator
      push();
        noStroke();
        fill(indctrFill);
        rect(this.x+10, this.y+10, xpos, this.h-20, 
             this.style.rounding, 0, 0, this.style.rounding);
      pop();

      // Render grab
      push();
        stroke(grabStroke);
        fill(grabFill);
        rect(this.x+xpos, this.y+8, 16, this.h-16, this.style.rounding);
      pop();
    pop();
  }
}

/**
 * GuiSliderV
 * - Vertical slider.
 *   Note: this may be modifiable to extend GuiSlider, but for simplicity it is
 *         presently extending GuiObject.
 *
 *  TODO: fix hard coding of buffers (e.g. this.h-24)
 *  TODO: fix so that touch corresponds with handle
 */
class GuiSliderV extends GuiObject {
  constructor(label, x, y, w=32, h=256, min=0, max=1) {
    super(label, x, y, w, h);
    
    this.min    = min;
    this.max    = max;
    this.val    = min + (max - min)/2;
    this._type  = "slider";
  }
  
  set(active) {
    super.set(active);
    
    if (this._active && this._selV != null) {
      this.val  = map(this._selV, 1, 0, this.min, this.max);
    }
  }
  
  draw() {
    if (this._active) {
      this.drawState(this.style.col_sBgFillActive,
                     this.style.col_sIndctrFillActive,
                     this.style.col_sGrabFillActive,
                     this.style.col_sGrabStroke);
    }
    else if (this._hover) {
      this.drawState(this.style.col_sBgFillHover,
                     this.style.col_sIndctrFillHover,
                     this.style.col_sGrabFillHover,
                     this.style.col_sGrabStroke);
    }
    else {
      this.drawState(this.style.col_sBgFill,
                     this.style.col_sIndctrFill,
                     this.style.col_sGrabFill,
                     this.style.col_sGrabStroke);
    }
  }
  
  drawState(bgFill, indctrFill, grabFill, grabStroke) {
    let ypos = map(this.val, this.min, this.max, this.h-24, 8);

    push();
      stroke(this.style.col_sStroke);
      strokeWeight(this.style.sStrokeWt);
      rectMode(CORNER);

      // Render bg
      fill(bgFill);
      rect(this.x, this.y, this.w, this.h, this.style.rounding);

      // Render indicator
      push();
        noStroke();
        fill(indctrFill);
        rect(this.x+10, this.y+ypos+10, this.w-20, this.h-ypos-20, 
             0, 0, this.style.rounding, this.style.rounding);
      pop();

      // Render grab
      push();
        stroke(grabStroke);
        fill(grabFill);
        rect(this.x+8, this.y+ypos, this.w-16, 16, this.style.rounding);
      pop();
    pop();
  }
}

/**
 * GuiCrossfader
 * - Horizontal cross fader. Indicator drawn from center.
 *
 *  TODO: fix so that touch corresponds with handle
 *  TODO: fix hard coding of buffers (e.g. this.w-24)
 */
class GuiCrossfader extends GuiSlider {
  constructor(label, x, y, w=256, h=32, min=(-1), max=1) {
    super(label, x, y, w, h, min, max);
    
    this.snap   = false; // If true, snaps value back to 0 when not active
  }
  
  set(active) {
    super.set(active);
    
    if (!this._active && this.snap) {
      this.val = (this.min + this.max)/2;
    }
  }
  
  drawState(bgFill, indctrFill, grabFill, grabStroke) {
    let xpos = map(this.val, this.min, this.max, 8, this.w-24);
    let halfXpos = (this.w-16)/2;

    push();
      stroke(this.style.col_sStroke);
      strokeWeight(this.style.sStrokeWt);
      rectMode(CORNER);

      // Render bg
      fill(bgFill);
      rect(this.x, this.y, this.w, this.h, this.style.rounding);
 
      // Render indicator from center
      push();
        noStroke();
        fill(indctrFill);
        if (xpos >= halfXpos) {
          rect(this.x+halfXpos+8, this.y+10, xpos-halfXpos, this.h-20);
        }
        else {
          rect(this.x+xpos, this.y+10, halfXpos-xpos+8, this.h-20);
        }
    
        // Draw center line
        stroke(this.style.col_cfCenterStroke);
        strokeWeight(this.style.sStrokeWt);
        line(this.x+this.w/2, this.y, this.x+this.w/2, this.y+this.h);
      pop();

      // Render grab
      push();
        stroke(grabStroke);
        fill(grabFill);
        rect(this.x+xpos, this.y+8, 16, this.h-16, this.style.rounding);
      pop();
    pop();
  }
}

/**
 * GuiCrossfaderV
 * - Vertical cross fader. Indicator drawn from center.
 *
 *  TODO: fix so that touch corresponds with handle
 *  TODO: fix hard coding of buffers (e.g. this.h-24)
 */
class GuiCrossfaderV extends GuiSliderV {
  constructor(label, x, y, w=256, h=32, min=(-1), max=1) {
    super(label, x, y, w, h, min, max);
    
    this.snap = false; // If true, snaps value back to 0 when not active
  }
  
  set(active) {
    super.set(active);
    
    if (!this._active && this.snap) {
      this.val = (this.min + this.max)/2;
    }
  }
  
  drawState(bgFill, indctrFill, grabFill, grabStroke) {
    let ypos = map(this.val, this.min, this.max, this.h-24, 8);
    let halfYpos = (this.h-16)/2;

    push();
      stroke(this.style.col_sStroke);
      strokeWeight(this.style.sStrokeWt);
      rectMode(CORNER);

      // Render bg
      fill(bgFill);
      rect(this.x, this.y, this.w, this.h, this.style.rounding);

      // Render indicator from center
      push();
        noStroke();
        fill(indctrFill);
        if (ypos >= halfYpos) {
          rect(this.x+10, this.y+halfYpos+8, this.w-20, ypos-halfYpos);
        }
        else {
          rect(this.x+10, this.y+ypos, this.w-20, halfYpos-ypos+8);
        }
    
        // Draw center line
        stroke(this.style.col_cfCenterStroke);
        strokeWeight(this.style.sStrokeWt);
        line(this.x, this.y+this.h/2, this.x+this.w, this.y+this.h/2);
      pop();

      // Render grab
      push();
        stroke(grabStroke);
        fill(grabFill);
        rect(this.x+8, this.y+ypos, this.w-16, 16, this.style.rounding);
      pop();
    pop();
  }
}

/**
 * Gui2dSlider
 * - Two dimensional slider that returns an X/Y pair of values
 *
 *  TODO: fix hard coding of buffers (e.g. this.w-24)
 *  TODO: come up with better variable names for valX and valY
 *  TODO: fix so that touch corresponds with handle
 */
class GuiSlider2d extends GuiObject {
  constructor(label, x, y, w=256, h=256, minX=(-1), maxX=1, minY=(-1), maxY=1) {
    super(label, x, y, w, h);
    
    this.minX   = minX;
    this.maxX   = maxX;
    this.minY   = minY;
    this.maxY   = maxY;
    this.val    = false;  // will track touch status
    this.valX   = minX + (maxX - minX)/2;
    this.valY   = minY + (maxY - minY)/2;
    this._type  = "slider";
  }
  
  set(active) {
    super.set(active);
    
    if (this._active && this._selU != null && this._selV != null) {
      this.valX  = map(this._selU, 0, 1, this.minX, this.maxX);
      this.valY  = map(this._selV, 1, 0, this.minY, this.maxY);
    }
  }
  
  draw() {
    if (this._active) {
      this.drawState(this.style.col_sBgFillActive,
                     this.style.col_sIndctrFillActive,
                     this.style.col_sGrabFillActive,
                     this.style.col_sGrabStroke);
    }
    else if (this._hover) {
      this.drawState(this.style.col_sBgFillHover,
                     this.style.col_sIndctrFillHover,
                     this.style.col_sGrabFillHover,
                     this.style.col_sGrabStroke);
    }
    else {
      this.drawState(this.style.col_sBgFill,
                     this.style.col_sIndctrFill,
                     this.style.col_sGrabFill,
                     this.style.col_sGrabStroke);
    }
  }
  
  drawState(bgFill, indctrFill, grabFill, grabStroke) {
    let xpos = map(this.valX, this.minX, this.maxX, 8, this.w-24);
    let ypos = map(this.valY, this.minY, this.maxY, this.h-24, 8);

    push();
      stroke(this.style.col_sStroke);
      strokeWeight(this.style.sStrokeWt);
      rectMode(CORNER);

      // Render bg
      fill(bgFill);
      rect(this.x, this.y, this.w, this.h, this.style.rounding);

      // Render crosshair
      push();
        stroke(indctrFill);
        line(this.x, this.y+ypos+8, this.x+this.w, this.y+ypos+8);
        line(this.x+xpos+8, this.y, this.x+xpos+8, this.y+this.h);
      pop();

      // Render grab
      push();
        stroke(grabStroke);
        fill(grabFill);
    
        circle(this.x+xpos+8, 
               this.y+ypos+8,
               this.style.s2dGrabRadius,
               this.style.s2dGrabRadius);
      pop();
    pop();
  }
}

/**
 * GuiJoystick
 * - Two dimensional slider that returns an X/Y pair of values 
 *   relative to a resetting zero point at its center.
 */
class GuiJoystick extends GuiSlider2d {
  constructor(label, x, y, w=256, h=256, minX=(-1), maxX=1, minY=(-1), maxY=1) {
    super(label, x, y, w, h, minX, maxX, minY, maxY);
    
    this.snap = true; // If true, snaps value back to 0 when not active
  }
  
  update() {
    super.update();
    
    if (!this._active && this.snap) {
      this.valX = (this.minX + this.maxX)/2;
      this.valY = (this.minY + this.maxY)/2;
    }
  }
}

/**
 * GuiRadio
 * - A user-defined number of toggles, of which only one can be turned on at a time.
 */
class GuiRadio extends GuiObject {
  // TODO: write this
}



/*******************
 * GuiStyle
 * - A style class that contains various presets for colors, rounding, etc.
 *
 *  TODO: Create more color palettes.
 *  Note: Classic is pretty ugly atm lol.
 */
class GuiStyle { 
  constructor() {
    this.name                      = "DefaultGray";
    
    // Global pars
    this.rounding                  = 10;
    this.labelFont                 = 'Arial';
    this.labelFontMaxSize          = 30;
    this.strokeWt                  = 2;

    // Button pars
    this.bStrokeWt                 = this.strokeWt;
    this.col_bStroke               = color(0);
    this.col_bFill                 = color(160);
    this.col_bFillHover            = color(196);
    this.col_bFillActive           = color(220);
    this.col_bLabel                = color(0);
    
    // Toggle pars
    this.tStrokeWt                 = this.strokeWt;
    this.col_tStroke               = color(0);
    this.col_tOffFill              = color(160);
    this.col_tOffFillHover         = color(196);
    this.col_tOffFillActive        = color(220);
    this.col_tOnFill               = color(230);
    this.col_tOnFillHover          = color(245);
    this.col_tOnFillActive         = color(255);
    this.col_tLabel                = color(0);
    
    // Checkbox pars
    this.cbStrokeWt                = this.strokeWt;
    this.col_cbOuterStroke         = color(0);
    this.col_cbOuterStrokeHover    = color(0);
    this.col_cbOuterStrokeActive   = color(0);
    this.col_cbOuterFill           = color(128);
    this.col_cbOuterFillHover      = color(144);
    this.col_cbOuterFillActive     = color(160);
    this.col_cbInnerFill           = color(200);
    this.col_cbInnerStroke         = color(200);
    this.col_cbInnerFillHover      = color(220);
    this.col_cbInnerStrokeHover    = color(220);
    this.col_cbInnerFillActive     = color(240);
    this.col_cbInnerStrokeActive   = color(240);
    
    // Slider pars
    this.sStrokeWt                 = this.strokeWt;
    this.col_sStroke               = color(0);
    this.col_sBgFill               = color(160);
    this.col_sBgFillHover          = color(175);
    this.col_sBgFillActive         = color(175);
    this.col_sBgStroke             = color(0);
    this.col_sBgStrokeHover        = color(0);
    this.col_sBgStrokeActive       = color(0);
    this.col_sIndctrFill           = color(128);
    this.col_sIndctrFillHover      = color(144);
    this.col_sIndctrFillActive     = color(144);
    this.col_sIndctrStroke         = color(128);
    this.col_sIndctrStrokeHover    = color(144);
    this.col_sIndctrStrokeActive   = color(144);
    this.col_sGrabFill             = color(64);
    this.col_sGrabFillHover        = color(96);
    this.col_sGrabFillActive       = color(240);
    this.col_sGrabStroke           = color(64);
    this.col_sGrabStrokeHover      = color(0);
    this.col_sGrabStrokeActive     = color(0);
    
    // Crossfader pars
    this.col_cfCenterStroke        = this.col_sIndctrStroke;
    // this.col_cfCenterStroke        = color(96);
    
    // Slider2d pars
    this.s2dGrabRadius             = 16;
  }
  
  // Default
  Gray() {
    this.name                      = "DefaultGray";
    
    // Global pars
    this.rounding                  = 10;
    this.labelFont                 = 'Arial';
    this.labelFontMaxSize          = 30;
    this.strokeWt                  = 2;

    // Button pars
    this.bStrokeWt                 = this.strokeWt;
    this.col_bStroke               = color(0);
    this.col_bFill                 = color(160);
    this.col_bFillHover            = color(196);
    this.col_bFillActive           = color(220);
    this.col_bLabel                = color(0);
    
    // Toggle pars
    this.tStrokeWt                 = this.strokeWt;
    this.col_tStroke               = color(0);
    this.col_tOffFill              = color(160);
    this.col_tOffFillHover         = color(196);
    this.col_tOffFillActive        = color(220);
    this.col_tOnFill               = color(230);
    this.col_tOnFillHover          = color(245);
    this.col_tOnFillActive         = color(255);
    this.col_tLabel                = color(0);
    
    // Checkbox pars
    this.cbStrokeWt                = this.strokeWt;
    this.col_cbOuterStroke         = color(0);
    this.col_cbOuterStrokeHover    = color(0);
    this.col_cbOuterStrokeActive   = color(0);
    this.col_cbOuterFill           = color(128);
    this.col_cbOuterFillHover      = color(144);
    this.col_cbOuterFillActive     = color(160);
    this.col_cbInnerFill           = color(200);
    this.col_cbInnerStroke         = color(200);
    this.col_cbInnerFillHover      = color(220);
    this.col_cbInnerStrokeHover    = color(220);
    this.col_cbInnerFillActive     = color(240);
    this.col_cbInnerStrokeActive   = color(240);
    
    // Slider pars
    this.sStrokeWt                 = this.strokeWt;
    this.col_sStroke               = color(0);
    this.col_sBgFill               = color(160);
    this.col_sBgFillHover          = color(175);
    this.col_sBgFillActive         = color(175);
    this.col_sBgStroke             = color(0);
    this.col_sBgStrokeHover        = color(0);
    this.col_sBgStrokeActive       = color(0);
    this.col_sIndctrFill           = color(128);
    this.col_sIndctrFillHover      = color(144);
    this.col_sIndctrFillActive     = color(144);
    this.col_sIndctrStroke         = color(128);
    this.col_sIndctrStrokeHover    = color(144);
    this.col_sIndctrStrokeActive   = color(144);
    this.col_sGrabFill             = color(64);
    this.col_sGrabFillHover        = color(96);
    this.col_sGrabFillActive       = color(240);
    this.col_sGrabStroke           = color(64);
    this.col_sGrabStrokeHover      = color(0);
    this.col_sGrabStrokeActive     = color(0);

    // Crossfader pars
    this.col_cfCenterStroke        = this.col_sIndctrStroke;
    // this.col_cfCenterStroke        = color(96);
    
    // Slider2d pars
    this.s2dGrabRadius             = 16;
  }
  
  // 
  Blue() {
    this.name                      = "Blue";
    
    // Global pars
    this.rounding                  = 10;
    this.labelFont                 = 'Arial';
    this.labelFontMaxSize          = 30;
    this.strokeWt                  = 2;
    this.col_stroke                = color('#102F3F');

    // Button pars
    this.bStrokeWt                 = this.strokeWt;
    this.col_bStroke               = this.col_stroke
    this.col_bFill                 = color('#7FBEE5');
    this.col_bFillHover            = color('#ABD5EF');
    this.col_bFillActive           = color('#E6F4FF');
    this.col_bLabel                = this.col_stroke
    
    // Toggle pars
    this.tStrokeWt                 = this.strokeWt;
    this.col_tStroke               = this.col_stroke
    this.col_tOffFill              = color('#69ABCC');
    this.col_tOffFillHover         = color('#88C4E2');
    this.col_tOffFillActive        = color('#F3FAFF');
    this.col_tOnFill               = color('#E6F4FF');
    this.col_tOnFillHover          = color('#F3FAFF');
    this.col_tOnFillActive         = color('#FAFAFA');
    this.col_tLabel                = this.col_stroke
    
    // Checkbox pars
    this.cbStrokeWt                = this.strokeWt;
    this.col_cbOuterStroke         = this.col_stroke
    this.col_cbOuterStrokeHover    = this.col_stroke
    this.col_cbOuterStrokeActive   = this.col_stroke
    this.col_cbOuterFill           = color('#36637F');
    this.col_cbOuterFillHover      = color('#5093C4');
    this.col_cbOuterFillActive     = color('#7FBEE5');
    this.col_cbInnerFill           = color('#E6F4FF');
    this.col_cbInnerStroke         = color('#E6F4FF');
    this.col_cbInnerFillHover      = color('#F3FAFF');
    this.col_cbInnerStrokeHover    = color('#F3FAFF');
    this.col_cbInnerFillActive     = color('#FAFAFA');
    this.col_cbInnerStrokeActive   = color('#FAFAFA');
    
    // Slider pars
    this.sStrokeWt                 = this.strokeWt;
    this.col_sStroke               = this.col_stroke
    this.col_sBgFill               = color('#E6F4FF');
    this.col_sBgFillHover          = color('#E6F4FF');
    this.col_sBgFillActive         = color('#F3FAFF');
    this.col_sBgStroke             = this.col_stroke
    this.col_sBgStrokeHover        = this.col_stroke
    this.col_sBgStrokeActive       = this.col_stroke
    this.col_sIndctrFill           = color('#5093C4');
    this.col_sIndctrFillHover      = color('#66A6CC');
    this.col_sIndctrFillActive     = color('#77B4D8');
    this.col_sIndctrStroke         = color('#5093C4');
    this.col_sIndctrStrokeHover    = color('#66A6CC');
    this.col_sIndctrStrokeActive   = color('#77B4D8');
    this.col_sGrabFill             = color('#36637F');
    this.col_sGrabFillHover        = color('#7FBEE5');
    this.col_sGrabFillActive       = color('#FAFAFA');
    this.col_sGrabStroke           = this.col_stroke
    this.col_sGrabStrokeHover      = this.col_stroke
    this.col_sGrabStrokeActive     = this.col_stroke
    
    // Crossfader pars
    this.col_cfCenterStroke        = this.col_sIndctrStroke;
    // this.col_cfCenterStroke        = color(96);
    
    // Slider2d pars
    this.s2dGrabRadius             = 28;
  }
}