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

p5.prototype.drawGui = function() {
  _gui.draw();
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
 *
 *  TODO: add 'page' property so that objects can be grouped and toggled by page
 */
class GuiContext {
  constructor() {
    this.objects        = [];
    
    this.touchInput     = false; // true if the last input was a touch event
    this.activeIds      = {};
    this._ptouches      = {};
    this._hoverObj      = null;
    
    this.style          = new GuiStyle();
    this.updateStyle();
    
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
    this.objects.forEach((obj) => {
      if (newObj.label == obj.label) {
        console.error("p5.touchgui: All GUI objects must have a unique label. Duplicate label \'" + newObj.label + "\' found.");
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
    this.objects.forEach((obj) => {
      if (obj.label == label) {
        fetchedObj = obj;
      }
    });
    
    if (fetchedObj == null) {
      console.error("p5.touchgui: No GUI object with label \'" + label + "\' has been found.");
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
  draw() {
    this.objects.forEach((obj) => {
      if (obj.visible) { 
        obj.draw(); 
      }
    });
  }
  
  // Automatically gets run after the draw loop, storing each object's previous state
  // for reference in the next frame
  postDraw() {
    this.objects.forEach((obj) => {
      obj.postDraw();
    });
  }
  
  //// STYLE
  
  // Loads a built-in preset style by string name
  loadStyle(presetName) {
    if (presetName === "Default" || presetName === "Gray") {
      this.style.Gray();
    }
    else if (presetName === "Blue") {
      this.style.Blue();
    }
    else if (presetName === "TerminalGreen") {
      this.style.TerminalGreen();
    }
    else {
      console.warn("\'" + presetName + "\' preset does not exist. Defaulting to \'Gray\'.")
      this.style.Gray();
      return;
    }
    
    this.updateStyle();
    
    console.log("\'" + presetName + "\' preset loaded.")
  }
  
  // Update all objects' style parameters with global style
  updateStyle() {
    this.objects.forEach((obj) => {
      switch (obj._type) {
        case "button":
          obj.style = Object.create(this.style.button);
          break;
        case "toggle":
          obj.style = Object.create(this.style.toggle);
          break;
        case "checkbox":
          obj.style = Object.create(this.style.checkbox);
          break;
        case "slider":
          obj.style = Object.create(this.style.slider);
          break;
        case "crossfader":
          obj.style = Object.create(this.style.slider);
          obj.style.strokeCenter = Object.create(this.style.crossfader.strokeCenter);
          obj.style.strokeCenterHover = Object.create(this.style.crossfader.strokeCenterHover);
          obj.style.strokeCenterActive = Object.create(this.style.crossfader.strokeCenterActive);
          break;
        case "slider2d":
          obj.style = Object.create(this.style.slider);
          print(obj.style);
          obj.style.handleRadius = this.style.slider2d.handleRadius;
          break;
        case "joystick":
          obj.style = Object.create(this.style.slider);
          obj.style.handleRadius = this.style.slider2d.handleRadius;
          break;
        default:
          console.error(obj.label + " has an invalid type. Please submit a bug report.");
      }
    });
  }
  
  // TODO: These load and save style as JSON functions need a lot more 
  //  consideration before implementation. There are questions such as:
  //    - Does this save and load layout as well as style?
  //    - What is the best way to deep copy elements?
  
  // Load style from a JSON file.
  loadStyleJSON(filename) {
     console.warn("loadStyleJSON(): This function is not yet implemented.");
    
//    if (typeof filename === "string") {
//      loadJSON(filename, (style)=> {
//        let target = {};
//        
//        // Cycle through all top level style properties
//        Object.keys(style).forEach((i) => {
//          if (typeof style[i] !== "object") {
//            // If the property is not an object, copy it to target
//            target[i] = style[i];
//          }
//          else {
//            // If the property is an object, create an empty object on the target...
//            target[i] = {};
//
//            // Loop through all child items...
//            Object.keys(style[i]).forEach((j) => {
//              if (typeof style[i][j] === "string" && style[i] != "font") {
//                // Copy any non-font string objects as p5.Color objects
//                target[i][j] = color(style[i][j]);
//              }
//              else {
//                // Copy any other properties directly
//                target[i][j] = style[i][j];
//              }
//            });
//          }
//        });
//        
//        this.style = Object.create(target);
//        this.updateStyle();
//      });
//    }
//    else {
//      console.error("loadStyleJSON(): Please input a string as a filename.");
//    }
  }
  
  // Saves current style as a JSON file.
  saveStyleJSON(filename) {
    console.warn("saveStyleJSON(): This function is not yet implemented.");
    
//    if (typeof filename === "string") {
//      // If the filename is a string, create target object to which we'll transfer the style properties
//      let target = {};
//      
//      // Cycle through all top level style properties
//      Object.keys(this.style).forEach((i) => {
//        if (typeof this.style[i] !== "object") {
//          // If the property is not an object, copy it to target
//          target[i] = this.style[i];
//        }
//        else {
//          // If the property is an object, create an empty object on the target...
//          target[i] = {};
//          
//          // Loop through all child items...
//          Object.keys(this.style[i]).forEach((j) => {
//            if (typeof this.style[i][j] === "object") {
//              // Copy any objects as strings (bc they are p5.Color objects)
//              target[i][j] = this.style[i][j].toString();
//            }
//            else {
//              // Copy any other properties directly
//              target[i][j] = this.style[i][j];
//            }
//          });
//        }
//      });
//      
//      // Save the resultant target object as a JSON file
//      saveJSON(target, filename, false);
//    }
//    else {
//      console.error("saveStyleJSON(): Please input a string as a filename.");
//    }
  }
  
  //// GLOBAL STYLE SETTINGS
  // These functions set specific style properties for all objects
  setStrokeWeight(strokeWeight) {
    if (typeof strokeWeight === "number") {
      this.objects.forEach((obj) => {
        obj.setStyle("strokeWeight", strokeWeight);
      });
    }
    else {
      console.error("setStrokeWeight(): please enter a number.");
    }
  }
  
  setRounding(rounding) {
    if (typeof rounding === "number") {
      this.objects.forEach((obj) => {
        obj.setStyle("rounding", rounding);
      });
    }
    else {
      console.error("setRounding(): please enter a number.");
    }
  }
  
  setFont(font) {
    if (typeof font === "string") {
      this.objects.forEach((obj) => {
        obj.setStyle("font", font);
      });
    }
    else {
      console.error("setFont(): please enter a string.");
    }
  }
  
  setTextSize(textSize) {
    if (typeof textSize === "number") {
      this.objects.forEach((obj) => {
        obj.setStyle("textSize", textSize);
      });
    }
    else {
      console.error("setTextSize(): please enter a number.");
    }
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
    // Prevent browser handling of touch event as mouse event
    if (e.cancelable) { e.preventDefault(); }
    
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
    // Prevent browser handling of touch event as mouse event
    if (e.cancelable) { e.preventDefault(); }
    
    // Process as touch end for now
    this.onTouchEnd(e);
  }
  
  ////
  
  // Process input press 'p' on a specified object
  onPress(obj, p) {
    obj.setStates(true, false, false);
    obj.setSelect(p.x, p.y);
    obj.setTrigger();
    obj.setActive(true);

    if (obj.onPress != null) {
      if (typeof obj.onPress === "function") {
        obj.onPress();
      }
      else {
        console.error("guiObject.onPress(): Please assign a valid function for " + obj.label + " \'onPress\' callback.");
      }
    }
  }
  
  // Process input move 'p' on a specified object
  onMove(obj, p) {
    obj.setStates(false, true, false);
    obj.setSelect(p.x, p.y);
    obj.setTrigger();
    obj.setActive(true);
  }
  
  // Process input release on a specified object
  onRelease(obj) {
    obj.setStates(false, false, true);
    obj.setTrigger();
    obj.setActive(false);

    if (obj.onRelease != null) {
      if (typeof obj.onRelease === "function") {
        obj.onRelease();
      }
      else {
        console.error("guiObject.onRelease(): Please assign a valid function for " + obj.label + " \'onRelease\' callback.");
      }
    }
  }
  
  checkHit(x, y) {
    let result = {
      hit: false,
      index: null,
      obj: null
    };
    
    this.objects.forEach((obj) => {
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
 *  TODO: add an individual input lock toggle. May require further checking at the
 *        gui context scope.
 *  TODO: add 'page' property so that objects can be grouped and toggled by page
 */
class GuiObject {
  constructor(label, x, y, w, h) {
    // Internal variables not meant to be exposed to users
    this._active    = false;
    this._pactive   = false;
    this._hover     = false;
    this._selU      = null;     // selection U and V within object
    this._selV      = null;
    this._triggered = false;    // An internal variable, but affected by behavior mode
    this._index     = null;     // Index representing object location when added to context stack
    
    this._ppressed  = false;
    this._pheld     = false;
    this._preleased = false;
    this._pchanged  = false;
    this._pselU     = null;
    this._pselV     = null;
    
    this._family    = "button"; // Default settings, defined in child class constructor
    this._type      = "button";
    
    // Public variables meant for user access
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
    this.onPress    = null;
    this.onHold     = null;
    this.onRelease  = null;
    this.onChange   = null;
    
    this.val        = 0;
    this.lock       = true;
    this.enabled    = true;     // enabled for input, false if for display only
    this.visible    = true;     // visibility flag for object; 
                                //  when not visible, input is overridden to false    
    this.style      = null;     // Stores object style settings
    
    // this.solver     = null;     // Optional solver for changing object behavior (i.e. easing)
    
    // TODO: Implement object-level locking. Right now everything is locked
    //   by default.
    // this.lock       = true;
    
    // Check if the _gui has been created.
    if (_gui == null) {
      console.error("p5.touchgui: No GuiContext has been created. Please call CreateGui() before creating any GuiObjects.");
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
    if (this._family == "slider" && (this._selU != this._pselU || this._selV != this._pselV)) {
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
  // previous frame. This gets further defined in children classes by calling
  // super.setActive().
  setActive(active) {
    this._active = active;
    
    if (this._active != this._pactive) {
      this.changed = true;
    }
  }
  
  // Stores the object's state for reference in a future frame and
  // calls onHold or onChange if defined.
  postDraw() {
    // Determine whether or not a press on the object is being held
    if (this.pressed) {
      this.held = true;
    } 
    else if (this.released) {
      this.held = false;
    }
    
    // These callbacks need to be implemented here because they need 
    // to be triggered each frame, if triggered at all
    if (this.held) {
      if (this.onHold != null) {
        if (typeof this.onHold === "function") {
          this.onHold();
        }
        else {
          console.error("guiObject.onHold(): Please assign a valid function for " + this.label + " \'onHold\' callback.");
        }
      }
    }
    
    if (this.changed) {
      if (this.onChange != null) {
        if (typeof this.onChange === "function") {
          this.onChange();
        }
        else {
          console.error("guiObject.onChange(): Please assign a valid function for " + this.label + " \'onChange\' callback.");
        }
      }
    }

    // Store all necessary values from this frame for future reference
    this._ppressed   = this.pressed;
    this._pheld      = this.held;
    this._preleased  = this.released;
    this._pchanged   = this.changed;
    this._pactive    = this._active;
    this._pselU      = this._selU;
    this._pselV      = this._selV;

    // Reset these variables
    this.pressed   = false;
    this.released  = false;
    this.changed   = false;
  }
  
  //// STYLE
  
  /* 
   * Method for setting style of individual GUI object. Use cases look like :
   *      b1.setStyle("fillBg", color(128));
   *      b1.setStyle({
   *        fillBg: color(128),
   *        strokeBg: color(0)
   *      });
   *
   * TODO: review for any additional error handling that may be needed
   */
  
  setStyle(...args) {
    if (args.length === 2 && typeof args[0] === "string") {
      // If there are two input arguments and the first is a string (aka property name)
      if (this.style[args[0]] !== null) {
        // Set the style property if it exists
        this.style[args[0]] = args[1];
      }
      else {
        console.error("GuiObject.setStyle(): Object property \'" + args[0] + "\' does not exist.");
      }
    }
    else if (args.length === 1 && typeof args[0] === "object") {
      // If there is one input argument and it is an object
      let settings = args[0];
      let settingNames = Object.keys(settings);
      
      for (let i = 0; i < settingNames.length; i++) {
        // Loop through the inputted style properties
        let key = settingNames[i];
        
        if (this.style[key] != null) {
          // If it matches one of this object's properties in name and type, set it
          if (typeof this.style[key] === typeof settings[key]) {
            this.style[key] = settings[key];
          }
          else {
            console.error("GuiObject.setStyle(): wrong data type for \'" + settingNames[i] + "\' in object type \'" + this._type + "\'.");
          }
        }
        else {
          console.error("GuiObject.setStyle(): Object property \'" + settingNames[i] + "\' does not exist in type \'" + this._type + "\'.");
        }
      }
    }
    else {
      console.error("GuiObject.setStyle(): please provide a valid input.");
    }
  }
}


/**
 * GuiButton
 * - Momentary button with a label.
 */
class GuiButton extends GuiObject {
  constructor(label, x, y, w=128, h=32) {
    super(label, x, y, w, h);
    
    this.labelOn  = label;
    this.labelOff = label;
    
    this._family  = "button";
    this._type    = "button";
    this._plabel  = label;    // Internal handling for updating labelOn/labelOff
    
    this.style    = {..._gui.style.button};
  }
  
  setActive(active) {
    super.setActive(active);
    
    // Set val to active
    // Note: doesn't account for ability to override when input=false
    this.val = this._active;
  }
  
  draw() {
    // Render button
    push();
    
      strokeWeight(this.style.strokeWeight);
      rectMode(CORNER);

      if (this._active) {
        stroke(this.style.strokeBgActive);
        fill(this.style.fillBgActive);
      }
      else if (this._hover) {
        stroke(this.style.strokeBgHover);
        fill(this.style.fillBgHover);
      }
      else {
        stroke(this.style.strokeBg);
        fill(this.style.fillBg);
      }
    
      rect(this.x, this.y, this.w, this.h, this.style.rounding);

      // Label rendering.
      push();
        if (this._active) { fill(this.style.fillLabelActive); }
        else if (this._hover) { fill(this.style.fillLabelHover); }
        else { fill(this.style.fillLabel); }
        
        noStroke();
        textAlign(CENTER, CENTER);
        textFont(this.style.font);
        let size = this.w*0.9;
        if (size > this.style.textSize) {
          size = this.style.textSize;
        }
        textSize(size);
        
        if (this.val) {
          text(this.labelOn, this.x + this.w/2, this.y + this.h/2);
        }
        else {
          text(this.labelOff, this.x + this.w/2, this.y + this.h/2);
        }
      pop();

    pop();
  }
  
  postDraw() {
    super.postDraw();
    
    // Internal handling for updating labelOn/labelOff
    if (this._plabel != this.label) {
      this.labelOn  = this.label;
      this.labelOff = this.label;
      this._plabel  = this.label;
    }
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
    
    this.labelOn  = label;
    this.labelOff = label;
    
    this._family  = "toggle";
    this._type    = "toggle";
    this._plabel  = label;    // Internal handling for updating labelOn/labelOff
    
    this.style    = {..._gui.style.toggle};
  }

  setActive(active) {
    super.setActive(active);
    
    if (this._triggered) {
      this.val = !this.val;
    }
  }
  
  draw() {
    // Render button based on state
    if (this._active && this._hover && this.val) {
      // Active Off
      this.drawState(this.style.strokeBgOffActive,
                     this.style.fillBgOffActive,
                     this.style.fillLabelOffActive);
    }
    else if (this._active && this._hover && !this.val) {
      // Active On
      this.drawState(this.style.strokeBgOnActive,
                     this.style.fillBgOnActive,
                     this.style.fillLabelOnActive);
    }
    else if (this._hover && this.val) {
      // Hover On
      this.drawState(this.style.strokeBgOnHover,
                     this.style.fillBgOnHover,
                     this.style.fillLabelOnHover);
    }
    else if (this._hover && !this.val) {
      // Hover Off
      this.drawState(this.style.strokeBgOffHover,
                     this.style.fillBgOffHover,
                     this.style.fillLabelOffHover);
    }
    else if (this.val) {
      // Inactive On
      this.drawState(this.style.strokeBgOn,
                     this.style.fillBgOn,
                     this.style.fillLabelOn);
    }
    else {
      // Inactive Off
      this.drawState(this.style.strokeBgOff,
                     this.style.fillBgOff,
                     this.style.fillLabelOff); 
    }
  }
  
  drawState(strokeBg, fillBg, fillLabel) {
    push();
    
      strokeWeight(this.style.strokeWeight);
      rectMode(CORNER);

      stroke(strokeBg);
      fill(fillBg);
      rect(this.x, this.y, this.w, this.h, this.style.rounding);

      // Label fill
      fill(fillLabel);

      // Label rendering.
      push();
        noStroke();
        textAlign(CENTER, CENTER);
        textFont(this.style.font);
        let size = this.w*0.9;
        if (size > this.style.textSize) {
          size = this.style.textSize;
        }
        textSize(size);
        
        if (this.val) {
          text(this.labelOn, this.x + this.w/2, this.y + this.h/2);
        }
        else {
          text(this.labelOff, this.x + this.w/2, this.y + this.h/2);
        }
        
      pop();
    
    pop();
  }
  
  postDraw() {
    super.postDraw();
    
    // Internal handling for updating labelOn/labelOff
    if (this._plabel != this.label) {
      this.labelOn  = this.label;
      this.labelOff = this.label;
      this._plabel  = this.label;
    }
  }
}

/**
 * GuiCheckbox
 * - Checkbox. Similar to a toggle but with a big X instead of a label.
 *
 * TODO: Fix bug where not getting to active draw state
 */
class GuiCheckbox extends GuiObject {
  constructor(label, x, y, w=32, h=32, defaultVal = false) {
    super(label, x, y, w, h);
    
    this.val    = defaultVal;
    
    this._family  = "checkbox";
    this._type    = "checkbox";
    
    this.style    = {..._gui.style.checkbox};
  }
  
  setActive(active) {
    super.setActive(active);
    
    if (this._triggered) {
      this.val = !this.val;
      print("triggered");
    }
  }
  
  draw() {
    // Render checkbox
    // Note: I don't really like how this is done lol; it's sloppy and can be better
    if (this._active && this._hover && this.val) {
      // Active Off
      this.drawState(this.style.strokeBgOffActive,
                     this.style.fillBgOffActive,
                     this.style.fillLabelOffActive);
    }
    else if (this._active && this._hover && !this.val) {
      // Active On
      this.drawState(this.style.strokeBgOnActive,
                     this.style.fillBgOnActive,
                     this.style.fillLabelOnActive);
    }
    else if (this._hover && this.val) {
      // Hover On
      this.drawState(this.style.strokeBgOnHover,
                     this.style.fillBgOnHover,
                     this.style.fillLabelOnHover);
    }
    else if (this._hover && !this.val) {
      // Hover Off
      this.drawState(this.style.strokeBgOffHover,
                     this.style.fillBgOffHover,
                     this.style.fillLabelOffHover);
    }
    else if (this.val) {
      // Inactive On
      this.drawState(this.style.strokeBgOn,
                     this.style.fillBgOn,
                     this.style.fillLabelOn);
    }
    else {
      // Inactive Off
      this.drawState(this.style.strokeBgOff,
                     this.style.fillBgOff,
                     this.style.fillLabelOff); 
    }
    
    push();
      rectMode(CORNER);
      stroke(this.style.strokeBg);
      strokeWeight(this.style.strokeWeight);
      fill(this.style.fillBg);
      rect(this.x, this.y, this.w, this.h, this.style.rounding);

      print(this._active + "\t" + this._hover + "\t" + this.val);
      if (this._hover) {
        // Button is false and being hovered over
        fill(this.style.fillBgHover);
        rect(this.x, this.y, this.w, this.h, this.style.rounding);
        
        if (this.val) {
          this.drawCheck(this.style.fillCheckHover);
        }
      }
      else if (this._active) {
        // Button is active
        fill(this.style.fillBgActive);
        rect(this.x, this.y, this.w, this.h, this.style.rounding);
        
        if (this.val) {
          // Button is true
          this.drawCheck(this.style.fillCheckActive);
        }
      }
      else if (this.val) {
        // Button is true but not active or being hovered over
        this.drawCheck(this.style.fillCheck);
      }
    
    pop();
  }
  
  drawCheck(fillCheck) {
    let x8  = this.x+this.w/6;
    let y8  = this.y+this.h/6;
    let w16 = this.w-this.w/3;
    let h16 = this.h-this.h/3;
    let xw  = x8+w16;
    let yh  = y8+h16;
    let strokeMult = map(((this.w > this.h) ? this.w : this.h), 32, 1000, 2, 20);
    
    push();
      stroke(fillCheck);
      strokeWeight(this.style.strokeWeight*strokeMult);
      line(x8, y8, xw, yh);
      line(xw, y8, x8, yh);
    pop();
  }
}

/**
 * GuiSlider
 * - Horizontal slider.
 *
 *  TODO: fix hard coding of buffers (e.g. this.w-24)
 *  TODO: fix so that touch corresponds with handle
 *  TODO: add integer step mode
 */
class GuiSlider extends GuiObject {
  constructor(label, x, y, w=256, h=32, min=0, max=1) {
    super(label, x, y, w, h);
    
    this.min    = min;
    this.max    = max;
    this.val    = min + (max - min)/2;
    
    this._family  = "slider";
    this._type    = "slider";
    
    this.style    = {..._gui.style.slider};
  } 

  setActive(active) {
    super.setActive(active);
    
    if (this._active && this._selU != null) {
      this.val  = map(this._selU, 0, 1, this.min, this.max);
    }
  }
  
  draw() {
    if (this._active) {
      this.drawState(this.style.fillBgActive,
                     this.style.fillTrackActive,
                     this.style.fillHandleActive,
                     this.style.strokeBgActive,
                     this.style.strokeTrackActive,
                     this.style.strokeHandleActive);
    }
    else if (this._hover) {
      this.drawState(this.style.fillBgHover,
                     this.style.fillTrackHover,
                     this.style.fillHandleHover,
                     this.style.strokeBgHover,
                     this.style.strokeTrackHover,
                     this.style.strokeHandleHover);
    }
    else {
      this.drawState(this.style.fillBg,
                     this.style.fillTrack,
                     this.style.fillHandle,
                     this.style.strokeBg,
                     this.style.strokeTrack,
                     this.style.strokeHandle);
    }
  }
  
  drawState(fillBg, fillTrack, fillHandle, strokeBg, strokeTrack, strokeHandle) {
    let xpos = map(this.val, this.min, this.max, 8, this.w-24);
    
    let trackMarginX = 10;
    let trackMarginY = 10;

    push();
      strokeWeight(this.style.strokeWeight);
      rectMode(CORNER);

      // Render bg
      stroke(strokeBg);
      fill(fillBg);
      rect(this.x, this.y, this.w, this.h, this.style.rounding);

      // Render track
      push();
        stroke(strokeTrack);
        fill(fillTrack);
        rect(this.x+10, this.y+10, 
             xpos, this.h-20, 
             this.style.rounding, 0, 0, this.style.rounding);
      pop();

      // Render handle
      push();
        stroke(strokeHandle);
        fill(fillHandle);
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
    
    this._family  = "slider";
    this._type    = "slider";
    
    this.style    = {..._gui.style.slider};
  }
  
  setActive(active) {
    super.setActive(active);
    
    if (this._active && this._selV != null) {
      this.val  = map(this._selV, 1, 0, this.min, this.max);
    }
  }
  
  draw() {
    if (this._active) {
      this.drawState(this.style.fillBgActive,
                     this.style.fillTrackActive,
                     this.style.fillHandleActive,
                     this.style.strokeBgActive,
                     this.style.strokeTrackActive,
                     this.style.strokeHandleActive);
    }
    else if (this._hover) {
      this.drawState(this.style.fillBgHover,
                     this.style.fillTrackHover,
                     this.style.fillHandleHover,
                     this.style.strokeBgHover,
                     this.style.strokeTrackHover,
                     this.style.strokeHandleHover);
    }
    else {
      this.drawState(this.style.fillBg,
                     this.style.fillTrack,
                     this.style.fillHandle,
                     this.style.strokeBg,
                     this.style.strokeTrack,
                     this.style.strokeHandle);
    }
  }
  
  drawState(fillBg, fillTrack, fillHandle, strokeBg, strokeTrack, strokeHandle) {
    let ypos = map(this.val, this.min, this.max, this.h-24, 8);
    
    let trackMarginX = 10;
    let trackMarginY = 10;
    
    push();
      strokeWeight(this.style.strokeWeight);
      rectMode(CORNER);

      // Render bg
      stroke(strokeBg);
      fill(fillBg);
      rect(this.x, this.y, this.w, this.h, this.style.rounding);

      // Render track
      push();
        stroke(strokeTrack);
        fill(fillTrack);
        rect(this.x+10, this.y+ypos+10, 
             this.w-20, this.h-ypos-20, 
             0, 0, this.style.rounding, this.style.rounding);
      pop();

      // Render handle
      push();
        stroke(strokeHandle);
        fill(fillHandle);
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
    
    this._family  = "slider";
    this._type    = "crossfader";
    
    this.style = Object.create(_gui.style.slider);
    this.style.strokeCenter = Object.create(_gui.style.crossfader.strokeCenter);
    this.style.strokeCenterHover = Object.create(_gui.style.crossfader.strokeCenterHover);
    this.style.strokeCenterActive = Object.create(_gui.style.crossfader.strokeCenterActive);
  }
  
  setActive(active) {
    super.setActive(active);
    
    if (!this._active && this.snap) {
      this.val = (this.min + this.max)/2;
    }
  }
  
  drawState(fillBg, fillTrack, fillHandle, strokeBg, strokeTrack, strokeHandle) {
    let xpos = map(this.val, this.min, this.max, 8, this.w-24);
    let halfXpos = (this.w-16)/2;

    push();
      strokeWeight(this.style.strokeWeight);
      rectMode(CORNER);

      // Render bg
      stroke(strokeBg);
      fill(fillBg);
      rect(this.x, this.y, this.w, this.h, this.style.rounding);
 
      // Render track from center
      push();
        stroke(strokeTrack);
        fill(fillTrack);
        if (xpos >= halfXpos) {
          rect(this.x+halfXpos+8, this.y+10, xpos-halfXpos, this.h-20);
        }
        else {
          rect(this.x+xpos, this.y+10, halfXpos-xpos+8, this.h-20);
        }
    
        // Draw center line
        stroke(this.style.strokeCenter);
        strokeWeight(this.style.strokeWeight);
        line(this.x+this.w/2, this.y, this.x+this.w/2, this.y+this.h);
      pop();

      // Render handle
      push();
        stroke(strokeHandle);
        fill(fillHandle);
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
    
    this._family  = "slider";
    this._type    = "crossfader";
    
    this.style = Object.create(_gui.style.slider);
    this.style.strokeCenter = Object.create(_gui.style.crossfader.strokeCenter);
    this.style.strokeCenterHover = Object.create(_gui.style.crossfader.strokeCenterHover);
    this.style.strokeCenterActive = Object.create(_gui.style.crossfader.strokeCenterActive);
  }
  
  setActive(active) {
    super.setActive(active);
    
    if (!this._active && this.snap) {
      this.val = (this.min + this.max)/2;
    }
  }
  
  drawState(fillBg, fillTrack, fillHandle, strokeBg, strokeTrack, strokeHandle) {
    let ypos = map(this.val, this.min, this.max, this.h-24, 8);
    let halfYpos = (this.h-16)/2;

    push();
      strokeWeight(this.style.strokeWeight);
      rectMode(CORNER);

      // Render bg
      stroke(strokeBg);
      fill(fillBg);
      rect(this.x, this.y, this.w, this.h, this.style.rounding);

      // Render track from center
      push();
        stroke(strokeTrack);
        fill(fillTrack);
        if (ypos >= halfYpos) {
          rect(this.x+10, this.y+halfYpos+8, this.w-20, ypos-halfYpos);
        }
        else {
          rect(this.x+10, this.y+ypos, this.w-20, halfYpos-ypos+8);
        }
    
        // Draw center line
        stroke(this.style.strokeCenter);
        strokeWeight(this.style.strokeWeight);
        line(this.x, this.y+this.h/2, this.x+this.w, this.y+this.h/2);
      pop();

      // Render handle
      push();
        stroke(strokeHandle);
        fill(fillHandle);
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
    this.val    = {x:0, y:0};
    this.valX   = minX + (maxX - minX)/2;
    this.valY   = minY + (maxY - minY)/2;
    
    this._family  = "slider";
    this._type    = "slider2d";
    
    this.style = Object.create(_gui.style.slider);
    this.style.handleRadius = _gui.style.slider2d.handleRadius;
  }
  
  setActive(active) {
    super.setActive(active);
    
    if (this._active && this._selU != null && this._selV != null) {
      this.valX = map(this._selU, 0, 1, this.minX, this.maxX);
      this.valY = map(this._selV, 1, 0, this.minY, this.maxY);
      this.val  = {x: this.valX, y:this.valY};
    }
  }
  
  draw() {
    if (this._active) {
      this.drawState(this.style.fillBgActive,
                     this.style.fillTrackActive,
                     this.style.fillHandleActive,
                     this.style.strokeBgActive,
                     this.style.strokeTrackActive,
                     this.style.strokeHandleActive);
    }
    else if (this._hover) {
      this.drawState(this.style.fillBgHover,
                     this.style.fillTrackHover,
                     this.style.fillHandleHover,
                     this.style.strokeBgHover,
                     this.style.strokeTrackHover,
                     this.style.strokeHandleHover);
    }
    else {
      this.drawState(this.style.fillBg,
                     this.style.fillTrack,
                     this.style.fillHandle,
                     this.style.strokeBg,
                     this.style.strokeTrack,
                     this.style.strokeHandle);
    }
  }
  
  drawState(fillBg, fillTrack, fillHandle, strokeBg, strokeTrack, strokeHandle) {
    let xpos = map(this.valX, this.minX, this.maxX, 8, this.w-24);
    let ypos = map(this.valY, this.minY, this.maxY, this.h-24, 8);

    push();
      strokeWeight(this.style.strokeWeight);
      rectMode(CORNER);

      // Render bg
      stroke(strokeBg);
      fill(fillBg);
      rect(this.x, this.y, this.w, this.h, this.style.rounding);

      // Render crosshair (track)
      push();
        stroke(fillTrack);
        line(this.x, this.y+ypos+8, this.x+this.w, this.y+ypos+8);
        line(this.x+xpos+8, this.y, this.x+xpos+8, this.y+this.h);
      pop();

      // Render handle
      push();
        stroke(strokeHandle);
        fill(fillHandle);
    
        ellipse(this.x+xpos+8, 
                this.y+ypos+8,
                this.style.handleRadius,
                this.style.handleRadius);
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
    
    this._family  = "slider";
    this._type    = "joystick";
    
    this.style = Object.create(_gui.style.slider);
    this.style.handleRadius = _gui.style.joystick.handleRadius;
  }
  
  setActive(active) {
    super.setActive(active);
    
    if (!this._active && this.snap) {
      this.valX = (this.minX + this.maxX)/2;
      this.valY = (this.minY + this.maxY)/2;
      this.val  = {x: this.valX, y:this.valY};
    }
  }
  
  drawState(fillBg, fillTrack, fillHandle, strokeBg, strokeTrack, strokeHandle) {
    let xpos = map(this.valX, this.minX, this.maxX, 8, this.w-24);
    let ypos = map(this.valY, this.minY, this.maxY, this.h-24, 8);

    push();
      strokeWeight(this.style.strokeWeight);
      rectMode(CORNER);

      // Render bg
      stroke(strokeBg);
      fill(fillBg);
      rect(this.x, this.y, this.w, this.h, this.style.rounding);

      // Render circle (track)
      push();
        stroke(fillTrack);
        let r = this.w*this.style.trackRatio;
        if (this.w > this.h) {
          r = this.h*this.style.trackRatio;
        }
    
        ellipse(this.x+this.w/2, this.y+this.h/2, r)
      pop();

      // Render handle
      push();
        stroke(strokeHandle);
        fill(fillHandle);
    
        ellipse(this.x+xpos+8, 
                this.y+ypos+8,
                this.style.handleRadius,
                this.style.handleRadius);
      pop();
    pop();
  }
}

/**
 * GuiRadio
 * - A user-defined number of toggles, of which only one can be turned on at a time.
 */
class GuiRadio extends GuiObject {
  // TODO: write this. Maybe this can be done by adding a 'group' property
}





/*******************
 * GuiStyle
 * - A style class that contains various presets for colors, rounding, etc.
 *
 *  TODO: Create more color palettes.
 */
class GuiStyle { 
  constructor() {
    this.name             = "DefaultGray";
    
    // Global pars
    this.strokeWeight     = 2;
    this.rounding         = 10;
    this.font             = 'Arial';
    this.textSize         = 20;

    this.button = {
      strokeWeight:       2,
      rounding:           10,
      font:               'Arial',
      textSize:           20, 
      fillBg:             color(160),
      fillBgHover:        color(196),
      fillBgActive:       color(220),
      fillLabel:          color(0),
      fillLabelHover:     color(0),
      fillLabelActive:    color(0),
      strokeBg:           color(0), 
      strokeBgHover:      color(0), 
      strokeBgActive:     color(0)
    };
    
    this.toggle = {
      strokeWeight:       2, 
      rounding:           10,
      font:               'Arial',
      textSize:           20, 
      fillBgOff:          color(160),
      fillBgOffHover:     color(196),
      fillBgOffActive:    color(220),
      fillBgOn:           color(230),
      fillBgOnHover:      color(245), 
      fillBgOnActive:     color(255),
      fillLabelOff:       color(0), 
      fillLabelOffHover:  color(0), 
      fillLabelOffActive: color(0), 
      fillLabelOn:        color(0), 
      fillLabelOnHover:   color(0), 
      fillLabelOnActive:  color(0), 
      strokeBgOff:        color(0), 
      strokeBgOffHover:   color(0), 
      strokeBgOffActive:  color(0), 
      strokeBgOn:         color(0), 
      strokeBgOnHover:    color(0), 
      strokeBgOnActive:   color(0)
    }
    
    this.checkbox = {
      strokeWeight:       2, 
      rounding:           10,
      fillBg:             color(128),
      fillBgHover:        color(144),
      fillBgActive:       color(160),
      fillCheck:          color(200), 
      fillCheckHover:     color(220), 
      fillCheckActive:    color(240), 
      strokeBg:           color(0)
    }
    
    this.slider = {
      strokeWeight:       2, 
      rounding:           10,
      fillBg:             color(160),
      fillBgHover:        color(175),
      fillBgActive:       color(175),
      fillTrack:          color(128), 
      fillTrackHover:     color(144), 
      fillTrackActive:    color(144), 
      fillHandle:         color(64), 
      fillHandleHover:    color(96), 
      fillHandleActive:   color(240), 
      strokeBg:           color(0), 
      strokeBgHover:      color(0), 
      strokeBgActive:     color(0), 
      strokeTrack:        color(128), 
      strokeTrackHover:   color(144), 
      strokeTrackActive:  color(144),
      strokeHandle:       color(64), 
      strokeHandleHover:  color(0), 
      strokeHandleActive: color(0) 
    }
    
    this.crossfader = {
      strokeCenter:       color(128), 
      strokeCenterHover:  color(128), 
      strokeCenterActive: color(128)
    }
    
    this.slider2d = {
      handleRadius:       16
    }
    
    this.joystick = {
      handleRadius:       16
    }
  }
  
  // Default
  Gray() {
    this.name             = "DefaultGray";
    
    // Global pars
    this.strokeWeight     = 2;
    this.rounding         = 10;
    this.font             = 'Arial';
    this.textSize         = 20;

    this.button = {
      strokeWeight:       2,
      rounding:           10,
      font:               'Arial',
      textSize:           20, 
      fillBg:             color(160),
      fillBgHover:        color(196),
      fillBgActive:       color(220),
      fillLabel:          color(0),
      fillLabelHover:     color(0),
      fillLabelActive:    color(0),
      strokeBg:           color(0), 
      strokeBgHover:      color(0), 
      strokeBgActive:     color(0)
    };
    
    this.toggle = {
      strokeWeight:       2, 
      rounding:           10,
      font:               'Arial',
      textSize:           20, 
      fillBgOff:          color(160),
      fillBgOffHover:     color(196),
      fillBgOffActive:    color(220),
      fillBgOn:           color(230),
      fillBgOnHover:      color(245), 
      fillBgOnActive:     color(255),
      fillLabelOff:       color(0), 
      fillLabelOffHover:  color(0), 
      fillLabelOffActive: color(0), 
      fillLabelOn:        color(0), 
      fillLabelOnHover:   color(0), 
      fillLabelOnActive:  color(0), 
      strokeBgOff:        color(0), 
      strokeBgOffHover:   color(0), 
      strokeBgOffActive:  color(0), 
      strokeBgOn:         color(0), 
      strokeBgOnHover:    color(0), 
      strokeBgOnActive:   color(0)
    }
    
    this.checkbox = {
      strokeWeight:       2, 
      rounding:           10,
      fillBg:             color(128),
      fillBgHover:        color(144),
      fillBgActive:       color(160),
      fillCheck:          color(200), 
      fillCheckHover:     color(220), 
      fillCheckActive:    color(240), 
      strokeBg:           color(0)
    }
    
    this.slider = {
      strokeWeight:       2, 
      rounding:           10,
      fillBg:             color(160),
      fillBgHover:        color(175),
      fillBgActive:       color(175),
      fillTrack:          color(128), 
      fillTrackHover:     color(144), 
      fillTrackActive:    color(144), 
      fillHandle:         color(64), 
      fillHandleHover:    color(96), 
      fillHandleActive:   color(240), 
      strokeBg:           color(0), 
      strokeBgHover:      color(0), 
      strokeBgActive:     color(0), 
      strokeTrack:        color(128), 
      strokeTrackHover:   color(144), 
      strokeTrackActive:  color(144),
      strokeHandle:       color(64), 
      strokeHandleHover:  color(0), 
      strokeHandleActive: color(0) 
    }
    
    this.crossfader = {
      strokeCenter:       color(128), 
      strokeCenterHover:  color(128), 
      strokeCenterActive: color(128)
    }
    
    this.slider2d = {
      handleRadius:       16
    }
    
    this.joystick = {
      handleRadius:       16
    }
  }
  
  // 
  Blue() {
    this.name             = "Blue";
    
    // Global pars
    this.strokeWeight     = 2;
    this.rounding         = 10;
    this.font             = 'Arial';
    this.textSize         = 20;

    this.button = {
      strokeWeight:       2,
      rounding:           10,
      font:               'Arial',
      textSize:           20, 
      fillBg:             color('#7FBEE5'),
      fillBgHover:        color('#ABD5EF'),
      fillBgActive:       color('#E6F4FF'),
      fillLabel:          color('#102F3F'),
      fillLabelHover:     color('#102F3F'),
      fillLabelActive:    color('#102F3F'),
      strokeBg:           color('#102F3F'), 
      strokeBgHover:      color('#102F3F'), 
      strokeBgActive:     color('#102F3F')
    };
    
    this.toggle = {
      strokeWeight:       2, 
      rounding:           10,
      font:               'Arial',
      textSize:           20, 
      fillBgOff:          color('#69ABCC'),
      fillBgOffHover:     color('#88C4E2'),
      fillBgOffActive:    color('#F3FAFF'),
      fillBgOn:           color('#E6F4FF'),
      fillBgOnHover:      color('#F3FAFF'), 
      fillBgOnActive:     color('#FAFAFA'),
      fillLabelOff:       color('#102F3F'), 
      fillLabelOffHover:  color('#102F3F'), 
      fillLabelOffActive: color('#102F3F'), 
      fillLabelOn:        color('#102F3F'), 
      fillLabelOnHover:   color('#102F3F'), 
      fillLabelOnActive:  color('#102F3F'), 
      strokeBgOff:        color('#102F3F'), 
      strokeBgOffHover:   color('#102F3F'), 
      strokeBgOffActive:  color('#102F3F'), 
      strokeBgOn:         color('#102F3F'), 
      strokeBgOnHover:    color('#102F3F'), 
      strokeBgOnActive:   color('#102F3F')
    }
    
    this.checkbox = {
      strokeWeight:       2, 
      rounding:           10,
      fillBg:             color('#36637F'),
      fillBgHover:        color('#5093C4'),
      fillBgActive:       color('#7FBEE5'),
      fillCheck:          color('#E6F4FF'), 
      fillCheckHover:     color('#F3FAFF'), 
      fillCheckActive:    color('#FAFAFA'), 
      strokeBg:           color('#102F3F')
    }
    
    this.slider = {
      strokeWeight:       2, 
      rounding:           10,
      fillBg:             color('#E6F4FF'),
      fillBgHover:        color('#E6F4FF'),
      fillBgActive:       color('#F3FAFF'),
      fillTrack:          color('#5093C4'), 
      fillTrackHover:     color('#66A6CC'), 
      fillTrackActive:    color('#77B4D8'), 
      fillHandle:         color('#36637F'), 
      fillHandleHover:    color('#7FBEE5'), 
      fillHandleActive:   color('#FAFAFA'), 
      strokeBg:           color('#102F3F'), 
      strokeBgHover:      color('#102F3F'), 
      strokeBgActive:     color('#102F3F'), 
      strokeTrack:        color('#5093C4'), 
      strokeTrackHover:   color('#66A6CC'), 
      strokeTrackActive:  color('#77B4D8'),
      strokeHandle:       color('#102F3F'), 
      strokeHandleHover:  color('#102F3F'), 
      strokeHandleActive: color('#102F3F') 
    }
    
    this.crossfader = {
      strokeCenter:       color('#5093C4'), 
      strokeCenterHover:  color('#66A6CC'), 
      strokeCenterActive: color('#77B4D8')
    }
    
    this.slider2d = {
      handleRadius:       16
    }
    
    this.joystick = {
      handleRadius:       16
    }
  }
  
  // 
  TerminalGreen() {
    this.name             = "TerminalGreen";
    
    // Global pars
    this.strokeWeight     = 2;
    this.rounding         = 10;
    this.font             = 'Arial';
    this.textSize         = 20;

    this.button = {
      strokeWeight:       2,
      rounding:           10,
      font:               'Arial',
      textSize:           20, 
      fillBg:             color('#000000'),
      fillBgHover:        color('#003000'),
      fillBgActive:       color('#00F200'),
      fillLabel:          color('#00FF00'),
      fillLabelHover:     color('#00FF00'),
      fillLabelActive:    color('#000000'),
      strokeBg:           color('#00FF00'), 
      strokeBgHover:      color('#00FF00'), 
      strokeBgActive:     color('#007F00')
    };
    
    this.toggle = {
      strokeWeight:       2, 
      rounding:           10,
      font:               'Arial',
      textSize:           20, 
      fillBgOff:          color('#000000'),
      fillBgOffHover:     color('#003000'),
      fillBgOffActive:    color('#00F200'),
      fillBgOn:           color('#00D800'),
      fillBgOnHover:      color('#00F200'), 
      fillBgOnActive:     color('#00FF00'),
      fillLabelOff:       color('#00FF00'), 
      fillLabelOffHover:  color('#00FF00'), 
      fillLabelOffActive: color('#000000'), 
      fillLabelOn:        color('#000000'), 
      fillLabelOnHover:   color('#000000'), 
      fillLabelOnActive:  color('#000000'), 
      strokeBgOff:        color('#00FF00'), 
      strokeBgOffHover:   color('#00FF00'), 
      strokeBgOffActive:  color('#007F00'), 
      strokeBgOn:         color('#007F00'), 
      strokeBgOnHover:    color('#007F00'), 
      strokeBgOnActive:   color('#007F00')
    }
    
    this.checkbox = {
      strokeWeight:       2, 
      rounding:           10,
      fillBg:             color('#000000'),
      fillBgHover:        color('#003000'),
      fillBgActive:       color('#007F00'),
      fillCheck:          color('#00D800'), 
      fillCheckHover:     color('#00F200'), 
      fillCheckActive:    color('#00FF00'), 
      strokeBg:           color('#00FF00')
    }
    
    this.slider = {
      strokeWeight:       2, 
      rounding:           10,
      fillBg:             color('#000000'),
      fillBgHover:        color('#003000'),
      fillBgActive:       color('#005000'),
      fillTrack:          color('#007F00'), 
      fillTrackHover:     color('#008F00'), 
      fillTrackActive:    color('#00AC00'), 
      fillHandle:         color('#000000'), 
      fillHandleHover:    color('#006000'), 
      fillHandleActive:   color('#00FF00'), 
      strokeBg:           color('#00FF00'), 
      strokeBgHover:      color('#00FF00'), 
      strokeBgActive:     color('#00FF00'), 
      strokeTrack:        color('#007F00'), 
      strokeTrackHover:   color('#008F00'), 
      strokeTrackActive:  color('#00AC00'),
      strokeHandle:       color('#00FF00'), 
      strokeHandleHover:  color('#00FF00'), 
      strokeHandleActive: color('#00FF00') 
    }
    
    this.crossfader = {
      strokeCenter:       color('#007F00'), 
      strokeCenterHover:  color('#007F00'), 
      strokeCenterActive: color('#007F00')
    }
    
    this.slider2d = {
      handleRadius:       16
    }
    
    this.joystick = {
      handleRadius:       16
    }
  }
}