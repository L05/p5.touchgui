// Create GUI context
let guiContext;

/**
 * Prototype functions to make library 
 * method calls more like p5.js.
 */
p5.prototype.createGui = function() {
  guiContext = new GuiContext();
  return guiContext;
}

p5.prototype.updateGui = function() {
  guiContext.update();
}

// Prototype functions for GUI elements
p5.prototype.createButton = function(label, x, y, w=128, h=32) {
  let obj = new GuiButton(label, x, y, w, h);
  guiContext.add(obj);
  return obj;
}

p5.prototype.createToggle = function(label, x, y, w=128, h=32, defaultVal = false) {
  let obj = new GuiToggle(label, x, y, w, h, defaultVal);
  guiContext.add(obj);
  return obj;
}

p5.prototype.createCheckbox = function(label, x, y, w=32, h=32, defaultVal = false) {
  let obj = new GuiCheckbox(label, x, y, w, h, defaultVal);
  guiContext.add(obj);
  return obj;
}

p5.prototype.createSlider = function(label, x, y, w=256, h=32, min=0, max=1) {
  let obj = new GuiSlider(label, x, y, w, h, min, max);
  guiContext.add(obj);
  return obj;
}

p5.prototype.createSliderV = function(label, x, y, w=32, h=256, min=0, max=1) {
  let obj = new GuiSliderV(label, x, y, w, h, min, max);
  guiContext.add(obj);
  return obj;
}

p5.prototype.createCrossfader = function(label, x, y, w=256, h=32, min=(-1), max=1) {
  let obj = new GuiCrossfader(label, x, y, w, h, min, max);
  guiContext.add(obj);
  return obj;
}

p5.prototype.createCrossfaderV = function(label, x, y, w=256, h=32, min=(-1), max=1) {
  let obj = new GuiCrossfaderV(label, x, y, w, h, min, max);
  guiContext.add(obj);
  return obj;
}

p5.prototype.createSlider2d = function(label, x, y, w=256, h=256, minX=(-1), maxX=1, minY=(-1), maxY=1) {
  let obj = new GuiSlider2d(label, x, y, w, h, minX, maxX, minY, maxY);
  guiContext.add(obj);
  return obj;
}

p5.prototype.createJoystick = function(label, x, y, w=256, h=256, minX=(-1), maxX=1, minY=(-1), maxY=1) {
  let obj = new GuiJoystick(label, x, y, w, h, minX, maxX, minY, maxY);
  guiContext.add(obj);
  return obj;
}

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

/*******************
 * GuiContext
 * - Creates a GUI context to track all GUI objects.
 */
class GuiContext {
  constructor() {
    this.objects    = [];
    
    this.touchInput = false; // true if the last input was a touch event
    
    this.style     = new GuiStyle();
    // this.style.Blue(); // Uncomment for classic color theme
  }
  
  // Add a new object to the GUI context
  add(newObj) {
    this.objects.forEach(function(obj) {
      if (newObj.label == obj.label) {
        console.error("All GUI objects must have a unique label. Duplicate label \'" + newObj.label + "\' found.");
        return false;
      }
    });
    
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
  
  // Update and draw the GUI (should be run each frame after background())
  update() {
    this.objects.forEach(function(obj) {
      obj.update();
      if (obj.visible) { 
        obj.draw(); 
      }
    });
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
    this.val        = 0;
    this.enabled    = true;     // enabled for input, false if for display only
    this.visible    = true;     // visibility flag for object; 
                                //  when not visible, input is overridden to false
    this.onPress    = null;
    this.onHold     = null;
    this.onRelease  = null; 
    this.onChange   = null;
    
    // Check if the guiContext has been created.
    if (guiContext == null) {
      console.error("No GuiContext has been created. Please call CreateGui() before creating any GuiObjects.");
    }
  }
  
  update() {
    // Initialize at top of each update
    this._pactive = this._active;
    this._active  = false;
    this._hover   = false;
    this._pselU   = this._selU;
    this._pselV   = this._selV;
    this._selU    = null;
    this._selV    = null;
    
    // Process input if object has *both* input and visible flags set to true
    if (this.enabled && this.visible) {

      // Process mouse and touch user input
      if (touches.length == 0 && mouseIsPressed) {
        guiContext.touchInput = false;

        // If mouse press
        if (this.checkHit(mouseX, mouseY)) {
          this._active  = true;
          this.setSelect(mouseX, mouseY);

          // Set triggered based on mode
          if (!this._pactive) {
            this.pressed  = true;
            this.held     = false;
            this.released = false;
          }
          else {
            this.pressed  = false;
            this.held     = true;
            this.released = false;
          }
        }
      }
      else if (touches.length > 0) {
        guiContext.touchInput = true;

        for (let i = 0; i < touches.length; i++) {
          // If touched
          if (this.checkHit(touches[i].x, touches[i].y)) {
            this._active  = true;
            this.setSelect(touches[i].x, touches[i].y);

            // If first pressed
            if (!this._pactive) {
              this.pressed  = true;
              this.held     = false;
              this.released = false;
            }
            else {
              // 
              this.pressed  = false;
              this.held     = true;
              this.released = false;
            }
          }
        }
      }
      else if (!mouseIsPressed && touches.length == 0) {
        // If no mouse press or touch and was active
        if (this._pactive) {
          this.pressed  = false;
          this.held     = false;
          this.released = true;
        }
        else {
          this.pressed  = false;
          this.held     = false;
          this.released = false;
        }

        // If last event was a mouse press, check for hover
        if (!guiContext.touchInput && this.checkHit(mouseX, mouseY)) {
          this._hover = true;
        }
      }
      
      // Set changed
      this.setChanged();
      
      // Set trigger
      this.setTrigger();
      
      // Process callbacks
      this.processCallbacks();
    }
  }
  
  setSelect(x, y) {
    // Set selU and selV to be normalized and relative to UI object location and size
    // Note: this might break if objects are drawn with CENTER mode in the future
    //    (instead of CORNERS mode)
    this._selU = constrain(x - this.x, 0, this.w)/this.w;
    this._selV = constrain(y - this.y, 0, this.h)/this.h;
  }
  
  setChanged() {
    // If the user selection has changed, updated 'changed' boolean
    if (this._type === "slider" && 
        (this._selU != this._pselU || 
        this._selV != this._pselV ||
        this._pactive != this._active)) {
      this.changed = true;
    }
    else if (this._pactive != this._active) {
      this.changed = true;
    }
    else {
      this.changed = false;
    }
//    print("this.changed = " + this.changed);
  }
  
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
  
  processCallbacks() {
    // If user has defined callback functions...
    if (this.pressed && 
        this.onPress != null) {
      if (typeof this.onPress === "function") {
        this.onPress();
      }
      else {
        console.error("Please assign a valid function for \'onPress\' callback.");
      }
    }
    else if (this.held && 
             this.onHold != null) {
      if (typeof this.onHold === "function") {
        this.onHold();
      }
      else {
        console.error("Please assign a valid function for \'onHold\' callback.");
      }
    }
    else if (this.released && 
             this.onRelease != null) {
      if (typeof this.onRelease === "function") {
        this.onRelease();
      }
      else {
        console.error("Please assign a valid function for \'onRelease\' callback.");
      }
    }
    
    if (this.changed && 
             this.onChange != null) {
      if (typeof this.onChange === "function") {
        this.onChange();
      }
      else {
        console.error("Please assign a valid function for \'onChange\' callback.");
      }
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
  
  update() {
    super.update();
    
    // Set val to active
    // Note: doesn't account for ability to override when input=false
    this.val = this._active;
  }
  
  draw() {
    // Render button
    push();
    
      stroke(guiContext.style.col_buttonStroke);
      strokeWeight(guiContext.style.buttonStrokeWt);
      rectMode(CORNER);

      if (this._active) {
        // Button is active
        fill(guiContext.style.col_buttonFillActive);
      }
      else if (this._hover) {
        // Button is hovered over by mouse
        fill(guiContext.style.col_buttonFillHover);
      }
      else {
        // Button is not interacted with
        fill(guiContext.style.col_buttonFill);
      }
    
      rect(this.x, this.y, this.w, this.h, guiContext.style.rounding);

      // Label rendering.
      push();
        fill(guiContext.style.col_buttonLabel);
        noStroke();
        textAlign(CENTER, CENTER);
        textFont(guiContext.style.labelFont);
        let size = this.w/10;
        if (size > guiContext.style.labelFontMaxSize) {
          size = guiContext.style.labelFontMaxSize;
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
    this._type  = "button";
  }
  
  update() {
    super.update();
    
    if (this._triggered) {
      this.val = !this.val;
    }
  }
  
  draw() {
    // Render button
    push();
    
      stroke(guiContext.style.col_buttonStroke);
      strokeWeight(guiContext.style.buttonStrokeWt);
      rectMode(CORNER);

      if (this._active && this.val) {
        fill(guiContext.style.col_toggleOnFillActive);
      }
      else if (this._active && !this.val) {
        fill(guiContext.style.col_toggleOffFillActive);
      }
      else if (this._hover && this.val) {
        fill(guiContext.style.col_toggleOnFillHover);
      }
      else if (this._hover && !this.val) {
        fill(guiContext.style.col_toggleOffFillHover);
      }
      else if (this.val) {
        fill(guiContext.style.col_toggleOnFill);
      }
      else {
        fill(guiContext.style.col_toggleOffFill);
      }
    
      rect(this.x, this.y, this.w, this.h, guiContext.style.rounding);

      // Label rendering.
      push();
        fill(guiContext.style.col_buttonLabel);
        noStroke();
        textAlign(CENTER, CENTER);
        textFont(guiContext.style.labelFont);
        let size = this.w/10;
        if (size > guiContext.style.labelFontMaxSize) {
          size = guiContext.style.labelFontMaxSize;
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
    this._type  = "button";
  }
  
  update() {
    super.update();
    
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
      stroke(guiContext.style.col_checkOuterStroke);
      strokeWeight(guiContext.style.checkStrokeWt);
      fill(guiContext.style.col_checkOuterFill);
      rect(this.x, this.y, this.w, this.h, guiContext.style.rounding);


      if (this._hover && !this.val) {
        // Button is false and being hovered over
        fill(guiContext.style.col_checkOuterFillHover);
        rect(this.x, this.y, this.w, this.h, guiContext.style.rounding);
      }
      else if (this._hover && this.val) {
        // Button is true and being hovered over
        push();
          stroke(guiContext.style.col_checkInnerStrokeHover);
          strokeWeight(guiContext.style.checkStrokeWt*strokeMult);
          line(x8, y8, xw, yh);
          line(xw, y8, x8, yh);
        pop();
      }
      else if (this._active) {
        // Button is active
        fill(guiContext.style.col_checkOuterFillActive);
        rect(this.x, this.y, this.w, this.h, guiContext.style.rounding);
        
        if (this.val) {
          // Button is true
          push();
            stroke(guiContext.style.col_checkInnerStrokeActive);
            strokeWeight(guiContext.style.checkStrokeWt*strokeMult);
            line(x8, y8, xw, yh);
            line(xw, y8, x8, yh);
          pop();
        }
      }
      else if (this.val) {
        // Button is true but not active or being hovered over
        push();
          stroke(guiContext.style.col_checkInnerStroke);
          strokeWeight(guiContext.style.checkStrokeWt*strokeMult);
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
  
  update() {
    super.update();
    
    if (this._active && this._selU != null) {
      this.val  = map(this._selU, 0, 1, this.min, this.max);
    }
  }
  
  draw() {
    if (this._active) {
      this.drawState(guiContext.style.col_sliderBgFillActive,
                     guiContext.style.col_sliderIndctrFillActive,
                     guiContext.style.col_sliderGrabFillActive,
                     guiContext.style.col_sliderGrabStroke);
    }
    else if (this._hover) {
      this.drawState(guiContext.style.col_sliderBgFillHover,
                     guiContext.style.col_sliderIndctrFillHover,
                     guiContext.style.col_sliderGrabFillHover,
                     guiContext.style.col_sliderGrabStroke);
    }
    else {
      this.drawState(guiContext.style.col_sliderBgFill,
                     guiContext.style.col_sliderIndctrFill,
                     guiContext.style.col_sliderGrabFill,
                     guiContext.style.col_sliderGrabStroke);
    }
  }
  
  drawState(bgFill, indctrFill, grabFill, grabStroke) {
    let xpos = map(this.val, this.min, this.max, 8, this.w-24);

    push();
      stroke(guiContext.style.col_sliderStroke);
      strokeWeight(guiContext.style.sliderStrokeWt);
      rectMode(CORNER);

      // Render bg
      fill(bgFill);
      rect(this.x, this.y, this.w, this.h, guiContext.style.rounding);

      // Render indicator
      push();
        noStroke();
        fill(indctrFill);
        rect(this.x+10, this.y+10, xpos, this.h-20, 
             guiContext.style.rounding, 0, 0, guiContext.style.rounding);
      pop();

      // Render grab
      push();
        stroke(grabStroke);
        fill(grabFill);
        rect(this.x+xpos, this.y+8, 16, this.h-16, guiContext.style.rounding);
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
  
  update() {
    super.update();
    
    if (this._active && this._selV != null) {
      this.val  = map(this._selV, 1, 0, this.min, this.max);
    }
  }
  
  draw() {
    if (this._active) {
      this.drawState(guiContext.style.col_sliderBgFillActive,
                     guiContext.style.col_sliderIndctrFillActive,
                     guiContext.style.col_sliderGrabFillActive,
                     guiContext.style.col_sliderGrabStroke);
    }
    else if (this._hover) {
      this.drawState(guiContext.style.col_sliderBgFillHover,
                     guiContext.style.col_sliderIndctrFillHover,
                     guiContext.style.col_sliderGrabFillHover,
                     guiContext.style.col_sliderGrabStroke);
    }
    else {
      this.drawState(guiContext.style.col_sliderBgFill,
                     guiContext.style.col_sliderIndctrFill,
                     guiContext.style.col_sliderGrabFill,
                     guiContext.style.col_sliderGrabStroke);
    }
  }
  
  drawState(bgFill, indctrFill, grabFill, grabStroke) {
    let ypos = map(this.val, this.min, this.max, this.h-24, 8);

    push();
      stroke(guiContext.style.col_sliderStroke);
      strokeWeight(guiContext.style.sliderStrokeWt);
      rectMode(CORNER);

      // Render bg
      fill(bgFill);
      rect(this.x, this.y, this.w, this.h, guiContext.style.rounding);

      // Render indicator
      push();
        noStroke();
        fill(indctrFill);
        rect(this.x+10, this.y+ypos+10, this.w-20, this.h-ypos-20, 
             0, 0, guiContext.style.rounding, guiContext.style.rounding);
      pop();

      // Render grab
      push();
        stroke(grabStroke);
        fill(grabFill);
        rect(this.x+8, this.y+ypos, this.w-16, 16, guiContext.style.rounding);
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
  
  update() {
    super.update();
    
    if (!this._active && this.snap) {
      this.val = (this.min + this.max)/2;
    }
  }
  
  drawState(bgFill, indctrFill, grabFill, grabStroke) {
    let xpos = map(this.val, this.min, this.max, 8, this.w-24);
    let halfXpos = (this.w-16)/2;

    push();
      stroke(guiContext.style.col_sliderStroke);
      strokeWeight(guiContext.style.sliderStrokeWt);
      rectMode(CORNER);

      // Render bg
      fill(bgFill);
      rect(this.x, this.y, this.w, this.h, guiContext.style.rounding);
 
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
        stroke(guiContext.style.col_crossfaderCenterStroke);
        strokeWeight(guiContext.style.sliderStrokeWt);
        line(this.x+this.w/2, this.y, this.x+this.w/2, this.y+this.h);
      pop();

      // Render grab
      push();
        stroke(grabStroke);
        fill(grabFill);
        rect(this.x+xpos, this.y+8, 16, this.h-16, guiContext.style.rounding);
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
  
  update() {
    super.update();
    
    if (!this._active && this.snap) {
      this.val = (this.min + this.max)/2;
    }
  }
  
  drawState(bgFill, indctrFill, grabFill, grabStroke) {
    let ypos = map(this.val, this.min, this.max, this.h-24, 8);
    let halfYpos = (this.h-16)/2;

    push();
      stroke(guiContext.style.col_sliderStroke);
      strokeWeight(guiContext.style.sliderStrokeWt);
      rectMode(CORNER);

      // Render bg
      fill(bgFill);
      rect(this.x, this.y, this.w, this.h, guiContext.style.rounding);

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
        stroke(guiContext.style.col_crossfaderCenterStroke);
        strokeWeight(guiContext.style.sliderStrokeWt);
        line(this.x, this.y+this.h/2, this.x+this.w, this.y+this.h/2);
      pop();

      // Render grab
      push();
        stroke(grabStroke);
        fill(grabFill);
        rect(this.x+8, this.y+ypos, this.w-16, 16, guiContext.style.rounding);
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
  
  update() {
    super.update();
    
    if (this._active && this._selU != null && this._selV != null) {
      this.valX  = map(this._selU, 0, 1, this.minX, this.maxX);
      this.valY  = map(this._selV, 1, 0, this.minY, this.maxY);
    }
  }
  
  draw() {
    if (this._active) {
      this.drawState(guiContext.style.col_sliderBgFillActive,
                     guiContext.style.col_sliderIndctrFillActive,
                     guiContext.style.col_sliderGrabFillActive,
                     guiContext.style.col_sliderGrabStroke);
    }
    else if (this._hover) {
      this.drawState(guiContext.style.col_sliderBgFillHover,
                     guiContext.style.col_sliderIndctrFillHover,
                     guiContext.style.col_sliderGrabFillHover,
                     guiContext.style.col_sliderGrabStroke);
    }
    else {
      this.drawState(guiContext.style.col_sliderBgFill,
                     guiContext.style.col_sliderIndctrFill,
                     guiContext.style.col_sliderGrabFill,
                     guiContext.style.col_sliderGrabStroke);
    }
  }
  
  drawState(bgFill, indctrFill, grabFill, grabStroke) {
    let xpos = map(this.valX, this.minX, this.maxX, 8, this.w-24);
    let ypos = map(this.valY, this.minY, this.maxY, this.h-24, 8);

    push();
      stroke(guiContext.style.col_sliderStroke);
      strokeWeight(guiContext.style.sliderStrokeWt);
      rectMode(CORNER);

      // Render bg
      fill(bgFill);
      rect(this.x, this.y, this.w, this.h, guiContext.style.rounding);

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
               guiContext.style.slider2dGrabRadius,
               guiContext.style.slider2dGrabRadius);
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
    // Defaults to Grayscale
    
    // Global pars
    this.rounding                       = 10;
    this.labelFont                      = 'Arial';
    this.labelFontMaxSize               = 30;
    this.strokeWt                       = 2;

    // Button pars
    this.buttonStrokeWt                 = this.strokeWt;
    this.col_buttonStroke               = color(0);
    this.col_buttonFill                 = color(160);
    this.col_buttonFillHover            = color(196);
    this.col_buttonFillActive           = color(220);
    this.col_buttonLabel                = color(0);
    
    // Toggle pars
    this.toggleStrokeWt                 = this.strokeWt;
    this.col_toggleStroke               = color(0);
    this.col_toggleOffFill              = color(160);
    this.col_toggleOffFillHover         = color(196);
    this.col_toggleOffFillActive        = color(220);
    this.col_toggleOnFill               = color(230);
    this.col_toggleOnFillHover          = color(245);
    this.col_toggleOnFillActive         = color(255);
    this.col_toggleLabel                = color(0);
    
    // Checkbox pars
    this.checkStrokeWt                  = this.strokeWt;
    this.col_checkOuterStroke           = color(0);
    this.col_checkOuterStrokeHover      = color(0);
    this.col_checkOuterStrokeActive     = color(0);
    this.col_checkOuterFill             = color(128);
    this.col_checkOuterFillHover        = color(144);
    this.col_checkOuterFillActive       = color(160);
    this.col_checkInnerFill             = color(200);
    this.col_checkInnerStroke           = color(200);
    this.col_checkInnerFillHover        = color(220);
    this.col_checkInnerStrokeHover      = color(220);
    this.col_checkInnerFillActive       = color(240);
    this.col_checkInnerStrokeActive     = color(240);
    
    // Slider pars
    this.sliderStrokeWt                 = this.strokeWt;
    this.col_sliderStroke               = color(0);
    this.col_sliderBgFill               = color(160);
    this.col_sliderBgFillHover          = color(175);
    this.col_sliderBgFillActive         = color(175);
    this.col_sliderBgStroke             = color(0);
    this.col_sliderBgStrokeHover        = color(0);
    this.col_sliderBgStrokeActive       = color(0);
    this.col_sliderIndctrFill           = color(128);
    this.col_sliderIndctrFillHover      = color(144);
    this.col_sliderIndctrFillActive     = color(144);
    this.col_sliderIndctrStroke         = color(128);
    this.col_sliderIndctrStrokeHover    = color(144);
    this.col_sliderIndctrStrokeActive   = color(144);
    this.col_sliderGrabFill             = color(64);
    this.col_sliderGrabFillHover        = color(96);
    this.col_sliderGrabFillActive       = color(240);
    this.col_sliderGrabStroke           = color(64);
    this.col_sliderGrabStrokeHover      = color(0);
    this.col_sliderGrabStrokeActive     = color(0);
    
    // Crossfader pars
    this.col_crossfaderCenterStroke     = this.col_sliderIndctrStroke;
    // this.col_crossfaderCenterStroke     = color(96);
    
    // Slider2d pars
    this.slider2dGrabRadius             = 16;
  }
  
  // Default
  Grayscale() {
    // Global pars
    this.rounding                       = 10;
    this.labelFont                      = 'Arial';
    this.labelFontMaxSize               = 30;
    this.strokeWt                       = 2;

    // Button pars
    this.buttonStrokeWt                 = this.strokeWt;
    this.col_buttonStroke               = color(0);
    this.col_buttonFill                 = color(160);
    this.col_buttonFillHover            = color(196);
    this.col_buttonFillActive           = color(220);
    this.col_buttonLabel                = color(0);
    
    // Toggle pars
    this.toggleStrokeWt                 = this.strokeWt;
    this.col_toggleStroke               = color(0);
    this.col_toggleOffFill              = color(160);
    this.col_toggleOffFillHover         = color(196);
    this.col_toggleOffFillActive        = color(220);
    this.col_toggleOnFill               = color(230);
    this.col_toggleOnFillHover          = color(245);
    this.col_toggleOnFillActive         = color(255);
    this.col_toggleLabel                = color(0);
    
    // Checkbox pars
    this.checkStrokeWt                  = this.strokeWt;
    this.col_checkOuterStroke           = color(0);
    this.col_checkOuterStrokeHover      = color(0);
    this.col_checkOuterStrokeActive     = color(0);
    this.col_checkOuterFill             = color(128);
    this.col_checkOuterFillHover        = color(144);
    this.col_checkOuterFillActive       = color(160);
    this.col_checkInnerFill             = color(200);
    this.col_checkInnerStroke           = color(200);
    this.col_checkInnerFillHover        = color(220);
    this.col_checkInnerStrokeHover      = color(220);
    this.col_checkInnerFillActive       = color(240);
    this.col_checkInnerStrokeActive     = color(240);
    
    // Slider pars
    this.sliderStrokeWt                 = this.strokeWt;
    this.col_sliderStroke               = color(0);
    this.col_sliderBgFill               = color(160);
    this.col_sliderBgFillHover          = color(175);
    this.col_sliderBgFillActive         = color(175);
    this.col_sliderBgStroke             = color(0);
    this.col_sliderBgStrokeHover        = color(0);
    this.col_sliderBgStrokeActive       = color(0);
    this.col_sliderIndctrFill           = color(128);
    this.col_sliderIndctrFillHover      = color(144);
    this.col_sliderIndctrFillActive     = color(144);
    this.col_sliderIndctrStroke         = color(128);
    this.col_sliderIndctrStrokeHover    = color(144);
    this.col_sliderIndctrStrokeActive   = color(144);
    this.col_sliderGrabFill             = color(64);
    this.col_sliderGrabFillHover        = color(96);
    this.col_sliderGrabFillActive       = color(240);
    this.col_sliderGrabStroke           = color(64);
    this.col_sliderGrabStrokeHover      = color(0);
    this.col_sliderGrabStrokeActive     = color(0);
  }
  
  // 
  Blue() {
    // Global pars
    this.rounding                       = 10;
    this.labelFont                      = 'Arial';
    this.labelFontMaxSize               = 30;
    this.strokeWt                       = 2;
    this.col_stroke                     = color('#102F3F');

    // Button pars
    this.buttonStrokeWt                 = this.strokeWt;
    this.col_buttonStroke               = this.col_stroke
    this.col_buttonFill                 = color('#7FBEE5');
    this.col_buttonFillHover            = color('#ABD5EF');
    this.col_buttonFillActive           = color('#E6F4FF');
    this.col_buttonLabel                = this.col_stroke
    
    // Toggle pars
    this.toggleStrokeWt                 = this.strokeWt;
    this.col_toggleStroke               = this.col_stroke
    this.col_toggleOffFill              = color('#69ABCC');
    this.col_toggleOffFillHover         = color('#88C4E2');
    this.col_toggleOffFillActive        = color('#F3FAFF');
    this.col_toggleOnFill               = color('#E6F4FF');
    this.col_toggleOnFillHover          = color('#F3FAFF');
    this.col_toggleOnFillActive         = color('#FAFAFA');
    this.col_toggleLabel                = this.col_stroke
    
    // Checkbox pars
    this.checkStrokeWt                  = this.strokeWt;
    this.col_checkOuterStroke           = this.col_stroke
    this.col_checkOuterStrokeHover      = this.col_stroke
    this.col_checkOuterStrokeActive     = this.col_stroke
    this.col_checkOuterFill             = color('#36637F');
    this.col_checkOuterFillHover        = color('#5093C4');
    this.col_checkOuterFillActive       = color('#7FBEE5');
    this.col_checkInnerFill             = color('#E6F4FF');
    this.col_checkInnerStroke           = color('#E6F4FF');
    this.col_checkInnerFillHover        = color('#F3FAFF');
    this.col_checkInnerStrokeHover      = color('#F3FAFF');
    this.col_checkInnerFillActive       = color('#FAFAFA');
    this.col_checkInnerStrokeActive     = color('#FAFAFA');
    
    // Slider pars
    this.sliderStrokeWt                 = this.strokeWt;
    this.col_sliderStroke               = this.col_stroke
    this.col_sliderBgFill               = color('#E6F4FF');
    this.col_sliderBgFillHover          = color('#E6F4FF');
    this.col_sliderBgFillActive         = color('#F3FAFF');
    this.col_sliderBgStroke             = this.col_stroke
    this.col_sliderBgStrokeHover        = this.col_stroke
    this.col_sliderBgStrokeActive       = this.col_stroke
    this.col_sliderIndctrFill           = color('#5093C4');
    this.col_sliderIndctrFillHover      = color('#66A6CC');
    this.col_sliderIndctrFillActive     = color('#77B4D8');
    this.col_sliderIndctrStroke         = color('#5093C4');
    this.col_sliderIndctrStrokeHover    = color('#66A6CC');
    this.col_sliderIndctrStrokeActive   = color('#77B4D8');
    this.col_sliderGrabFill             = color('#36637F');
    this.col_sliderGrabFillHover        = color('#7FBEE5');
    this.col_sliderGrabFillActive       = color('#FAFAFA');
    this.col_sliderGrabStroke           = this.col_stroke
    this.col_sliderGrabStrokeHover      = this.col_stroke
    this.col_sliderGrabStrokeActive     = this.col_stroke
  }
}