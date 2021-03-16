// Create GUI context
let _gui;

/**
 * Prototype functions to make library
 * method calls more like p5.js.
 */
p5.prototype.createGui = function(_canvasElem) {
  _gui = new Gui(this, _canvasElem);
  return _gui;
};

p5.prototype.drawGui = function() {
  _gui.draw();
};

// Prototype functions for GUI elements
p5.prototype.createButton = function(label, x, y, w=128, h=32) {
  let obj = new GuiButton(this, label, x, y, w, h);
  _gui._add(obj);
  return obj;
};

p5.prototype.createToggle = function(label, x, y, w=128, h=32, defaultVal = false) {
  let obj = new GuiToggle(label, x, y, w, h, defaultVal);
  _gui._add(obj);
  return obj;
};

p5.prototype.createCheckbox = function(label, x, y, w=32, h=32, defaultVal = false) {
  let obj = new GuiCheckbox(label, x, y, w, h, defaultVal);
  _gui._add(obj);
  return obj;
};

p5.prototype.createSlider = function(label, x, y, w=256, h=32, min=0, max=1) {
  let obj = new GuiSlider(label, x, y, w, h, min, max);
  _gui._add(obj);
  return obj;
};

p5.prototype.createSliderV = function(label, x, y, w=32, h=256, min=0, max=1) {
  let obj = new GuiSliderV(label, x, y, w, h, min, max);
  _gui._add(obj);
  return obj;
};

p5.prototype.createCrossfader = function(label, x, y, w=256, h=32, min=(-1), max=1) {
  let obj = new GuiCrossfader(label, x, y, w, h, min, max);
  _gui._add(obj);
  return obj;
};

p5.prototype.createCrossfaderV = function(label, x, y, w=256, h=32, min=(-1), max=1) {
  let obj = new GuiCrossfaderV(label, x, y, w, h, min, max);
  _gui._add(obj);
  return obj;
};

p5.prototype.createSlider2d = function(label, x, y, w=256, h=256, minX=(-1), maxX=1, minY=(-1), maxY=1) {
  let obj = new GuiSlider2d(label, x, y, w, h, minX, maxX, minY, maxY);
  _gui._add(obj);
  return obj;
};

p5.prototype.createJoystick = function(label, x, y, w=256, h=256, minX=(-1), maxX=1, minY=(-1), maxY=1) {
  let obj = new GuiJoystick(label, x, y, w, h, minX, maxX, minY, maxY);
  _gui._add(obj);
  return obj;
};

p5.prototype._guiPostDraw = function() {
  if (_gui != null) {
    _gui._postDraw();
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
 * Gui
 * - Creates a GUI context to track all GUI objects.
 *
 *  TODO: add 'page' property so that objects can be grouped and toggled by page
 */
class Gui {
  constructor(pInst, _canvasElem) {
    this.sketch = pInst;
    this.canvas = _canvasElem.canvas || canvas;
    this.objects        = [];

    this.touchInput     = false; // true if the last input was a touch event
    this._activeIds      = {};
    this._ptouches      = {};
    this._hoverObj      = null;

    this._style          = new GuiStyle(this.sketch);
    this.updateStyle();

    // Define touchGui eventHandlers for mouse and touch so as not to interfere
    // with p5.js eventHandlers

    this._onMouseDown    = this._onMouseDown.bind(this);
    this._onMouseMove    = this._onMouseMove.bind(this);
    this._onMouseLeave   = this._onMouseLeave.bind(this);
    this._onMouseUp      = this._onMouseUp.bind(this);
    this._onTouchStart   = this._onTouchStart.bind(this);
    this._onTouchMove    = this._onTouchMove.bind(this);
    this._onTouchEnd     = this._onTouchEnd.bind(this);
    this._onTouchCancel  = this._onTouchCancel.bind(this);

    document.addEventListener("mousedown", this._onMouseDown, false);
    document.addEventListener("mousemove", this._onMouseMove, false);
    document.addEventListener("mouseleave", this._onMouseLeave, false);
    document.addEventListener("mouseup", this._onMouseUp, false);
    document.addEventListener("touchstart", this._onTouchStart, false);
    document.addEventListener("touchmove", this._onTouchMove, false);
    document.addEventListener("touchend", this._onTouchEnd, false);
    document.addEventListener("touchcancel", this._onTouchCancel, false);
  }

  // Add a new object to the GUI context
  _add(newObj) {
    newObj._index = this.objects.length;
    this.objects.push(newObj);

    return true;
  }

  // Gets array of objects from the GUI context that match the label
  get(label) {
    let fetched = [];
    this.objects.forEach((obj) => {
      if (obj.label == label) {
        fetched.push(obj);
      }
    });

    if (fetched.length == 0) {
      console.error("p5.touchgui: No GUI object with label \'" + label + "\' has been found.");
    }

    return fetched;
  }

  // Get position relative to canvas
  _getCanvasPos(x, y) {
    let rect = this.canvas.getBoundingClientRect();
    let sx = this.canvas.scrollWidth / this.width || 1;
    let sy = this.canvas.scrollHeight / this.height || 1;
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
  _postDraw() {
    this.objects.forEach((obj) => {
      obj._postDraw();
    });
  }

  //// STYLE

  // Loads a built-in preset style by string name
  loadStyle(presetName) {
    switch (presetName) {
      case "Default":
        this._style.Gray();
        break;
      case "Gray":
        this._style.Gray();
        break;
      case "Rose":
        this._style.Rose();
        break;
      case "Seafoam":
        this._style.Seafoam();
        break;
      case "Blue":
        this._style.Blue();
        break;
      case "TerminalGreen":
        this._style.TerminalGreen();
        break;
      case "TerminalRed":
        this._style.TerminalRed();
        break;
      case "TerminalBlue":
        this._style.TerminalBlue();
        break;
      case "TerminalYellow":
        this._style.TerminalYellow();
        break;
      case "TerminalMagenta":
        this._style.TerminalMagenta();
        break;
      default:
        console.warn("\'" + presetName + "\' preset does not exist. Defaulting to \'Gray\'.")
        this._style.Gray();
    }

    this.updateStyle();

    console.log("\'" + presetName + "\' preset loaded.")
  }

  // Update all objects' style parameters with global style
  updateStyle() {
    this.objects.forEach((obj) => {
      switch (obj._type) {
        case "button":
          obj._style = Object.create(this._style.button);
          break;
        case "toggle":
          obj._style = Object.create(this._style.toggle);
          break;
        case "checkbox":
          obj._style = Object.create(this._style.checkbox);
          break;
        case "slider":
          obj._style = Object.create(this._style.slider);
          break;
        case "crossfader":
          obj._style = Object.create(this._style.slider);
          obj._style.strokeCenter = Object.create(this._style.crossfader.strokeCenter);
          obj._style.strokeCenterHover = Object.create(this._style.crossfader.strokeCenterHover);
          obj._style.strokeCenterActive = Object.create(this._style.crossfader.strokeCenterActive);
          break;
        case "slider2d":
          obj._style = Object.create(this._style.slider);
          obj._style.handleRadius = this._style.slider2d.handleRadius;
          break;
        case "joystick":
          obj._style = Object.create(this._style.slider);
          obj._style.handleRadius = this._style.slider2d.handleRadius;
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
  /*loadStyleJSON(filename) {
     console.warn("loadStyleJSON(): This function is not yet implemented.");

    if (typeof filename === "string") {
      loadJSON(filename, (style)=> {
        let target = {};

        // Cycle through all top level style properties
        Object.keys(style).forEach((i) => {
          if (typeof style[i] !== "object") {
            // If the property is not an object, copy it to target
            target[i] = style[i];
          }
          else {
            // If the property is an object, create an empty object on the target...
            target[i] = {};

            // Loop through all child items...
            Object.keys(style[i]).forEach((j) => {
              if (typeof style[i][j] === "string" && style[i] != "font") {
                // Copy any non-font string objects as p5.Color objects
                target[i][j] = color(style[i][j]);
              }
              else {
                // Copy any other properties directly
                target[i][j] = style[i][j];
              }
            });
          }
        });

        this._style = Object.create(target);
        this.updateStyle();
      });
    }
    else {
      console.error("loadStyleJSON(): Please input a string as a filename.");
    }
  }

  // Saves current style as a JSON file.
  saveStyleJSON(filename) {
    console.warn("saveStyleJSON(): This function is not yet implemented.");

    if (typeof filename === "string") {
      // If the filename is a string, create target object to which we'll transfer the style properties
      let target = {};

      // Cycle through all top level style properties
      Object.keys(this._style).forEach((i) => {
        if (typeof this._style[i] !== "object") {
          // If the property is not an object, copy it to target
          target[i] = this._style[i];
        }
        else {
          // If the property is an object, create an empty object on the target...
          target[i] = {};

          // Loop through all child items...
          Object.keys(this._style[i]).forEach((j) => {
            if (typeof this._style[i][j] === "object") {
              // Copy any objects as strings (bc they are p5.Color objects)
              target[i][j] = this._style[i][j].toString();
            }
            else {
              // Copy any other properties directly
              target[i][j] = this._style[i][j];
            }
          });
        }
      });

      // Save the resultant target object as a JSON file
      saveJSON(target, filename, false);
    }
    else {
      console.error("saveStyleJSON(): Please input a string as a filename.");
    }
  }*/

  //// GLOBAL STYLE SETTINGS
  // These functions set specific style properties for all objects
  setStrokeWeight(strokeWeight) {
    if (typeof strokeWeight === "number") {
      this._style.strokeWeight          = strokeWeight;
      this._style.button.strokeWeight   = strokeWeight;
      this._style.toggle.strokeWeight   = strokeWeight;
      this._style.checkbox.strokeWeight = strokeWeight;
      this._style.slider.strokeWeight   = strokeWeight;

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
      this._style.rounding          = rounding;
      this._style.button.rounding   = rounding;
      this._style.toggle.rounding   = rounding;
      this._style.checkbox.rounding = rounding;
      this._style.slider.rounding   = rounding;

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
      this._style.font          = font;
      this._style.button.font   = font;
      this._style.toggle.font   = font;

      this.objects.forEach((obj) => {
        obj.setStyle("font", font);
      });
    }
    else if (typeof font === "object") {
      this.objects.forEach((obj) => {
        obj.setStyle("font", font);
      });
    }
    else {
      console.error("setFont(): please enter a string or p5.Font object.");
    }
  }

  setTextSize(textSize) {
    if (typeof textSize === "number") {
      this._style.textSize          = textSize;
      this._style.button.textSize   = textSize;
      this._style.toggle.textSize   = textSize;

      this.objects.forEach((obj) => {
        obj.setStyle("textSize", textSize);
      });
    }
    else {
      console.error("setTextSize(): please enter a number.");
    }
  }

  setTrackWidth(trackWidth) {
    if (typeof trackWidth === "number") {
      this._style.slider.trackWidth   = trackWidth;

      this.objects.forEach((obj) => {
        if (obj._family === "slider") {
          obj.setStyle("trackWidth", constrain(trackWidth, 0, 1));
        }
      });
    }
  }

  //// EVENT HANDLING

  // MOUSE
  _onMouseDown(e) {
    // Get a hit result for the click and the current mouse position
    let result  = this._checkHit(this.sketch.mouseX, this.sketch.mouseY);
    let m       = this._getCanvasPos(e.clientX, e.clientY);

    // If there's a successful hit and the object is visible and enabled,
    // process the mouse press
    if (result.hit) {
      if (result.obj.visible && result.obj.enabled) {
        let obj = result.obj;
        this._onPress(obj, m);
        this._activeIds[-1] = obj._index;
      }
    }
  }

  _onMouseMove(e) {
    let m = this._getCanvasPos(e.clientX, e.clientY);

    // If any mouse buttons are pressed
    if (e.buttons >= 1) {
      // And if the mouse isn't currently locked on an object,
      // process the mouse input
      if (this._activeIds[-1] != null) {
        let obj = this.objects[this._activeIds[-1]];
        this._onMove(obj, m);
      }
    }
    else {
      // If not, check for mouse hovering over an object
      let result  = this._checkHit(this.sketch.mouseX, this.sketch.mouseY);

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
  _onMouseLeave(e) {
    if (this._hoverObj != null) {
      this._hoverObj._hover  = false;
      this._hoverObj         = null;
    }
  }

  _onMouseUp(e) {
    // If the mouse was locked to an object, process the release
    if (this._activeIds[-1] != null) {
      let obj = this.objects[this._activeIds[-1]];
      this._onRelease(obj);
    }

    // Set the mouse active ID to null (no objects locked)
    this._activeIds[-1] = null;
  }

  // MULTI-TOUCH

  _onTouchStart(e) {
    // If any touch events are registered, shut off any hovered objects
    if (this._hoverObj != null) {
      this._hoverObj._hover  = false;
      this._hoverObj         = null;
    }

    // Loop through all active touchpoints
    for (let i = 0; i < e.touches.length; i++) {
      let t       = this._getCanvasPos(e.touches[i].clientX, e.touches[i].clientY);
      let id      = e.touches[i].identifier;
      let result  = this._checkHit(t.x, t.y);

      // If there's a hit
      if (result.hit) {
        // And the object is visible and enabled and the touch is not
        // already locked on an object, process the input
        if (result.obj.visible && result.obj.enabled && this._activeIds[id] == null) {
          let obj = result.obj;
          this._onPress(obj, t);
          this._activeIds[id] = obj._index;
        }
      }
    }

    // Store current touches for future reference
    this._ptouches = e.touches;
  }

  _onTouchMove(e) {
    // If any touch events are registered, shut off any hovered objects
    if (this._hoverObj != null) {
      this._hoverObj._hover  = false;
      this._hoverObj         = null;
    }

    // Loop through all active touch
    for (let i = 0; i < e.touches.length; i++) {
      let t   = this._getCanvasPos(e.touches[i].clientX, e.touches[i].clientY);
      let id  = e.touches[i].identifier;

      // If the touch is already locked on an object, process the input
      if (this._activeIds[id] != null) {
        let obj = this.objects[this._activeIds[id]];
        this._onMove(obj, t);
      }
    }

    // Store current touches for future reference
    this._ptouches = e.touches;
  }

  _onTouchEnd(e) {
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
    if (this._activeIds[id] != null) {
      let obj = this.objects[this._activeIds[id]];
      this._onRelease(obj);
    }

    // Set the touch active ID to null (no objects locked)
    this._activeIds[id] = null;

    // Store current touches for future reference
    this._ptouches = e.touches;
  }

  // In case there are 'touchcancel' events, issue a warning
  _onTouchCancel(e) {
    // Prevent browser handling of touch event as mouse event
    if (e.cancelable) { e.preventDefault(); }

    // Process as touch end for now
    this._onTouchEnd(e);
  }

  ////

  // Process input press 'p' on a specified object
  _onPress(obj, p) {
    obj._setStates(true, false, false);
    obj._setSelect(p.x, p.y);
    obj._setTrigger();
    obj._setActive(true);

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
  _onMove(obj, p) {
    obj._setStates(false, true, false);
    obj._setSelect(p.x, p.y);
    obj._setTrigger();
    obj._setActive(true);
  }

  // Process input release on a specified object
  _onRelease(obj) {
    obj._setStates(false, false, true);
    obj._setTrigger();
    obj._setActive(false);

    if (obj.onRelease != null) {
      if (typeof obj.onRelease === "function") {
        obj.onRelease();
      }
      else {
        console.error("guiObject.onRelease(): Please assign a valid function for " + obj.label + " \'onRelease\' callback.");
      }
    }
  }

  _checkHit(x, y) {
    let result = {
      hit: false,
      index: null,
      obj: null
    };

    this.objects.forEach((obj) => {
      if (obj._checkHit(x, y)) {
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
  constructor(pInst, label, x, y, w, h) {
    this.sketch = pInst
    // Internal variables not meant to be exposed to users
    this._active    = false;
    this._pactive   = false;
    this._hover     = false;
    this._selU      = null;     // selection U and V within object
    this._selV      = null;
    this._triggered = false;    // An internal variable, but affected by behavior mode
    this._index     = null;     // Index representing object location when added to context stack

    this._pisPressed  = false;
    this._pisHeld     = false;
    this._pisReleased = false;
    this._pisChanged  = false;
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
    this.isInteger  = false;      // Used to have sliders lock to ints
    this.mode       = "onPress";  // User can define behavior mode:
                                  // "onPress", "onHold", "onRelease"

    this.isPressed    = false;
    this.isHeld       = false;
    this.isReleased   = false;
    this.isChanged    = false;
    this.onPress    = null;
    this.onHold     = null;
    this.onRelease  = null;
    this.onChange   = null;

    this.val        = 0;
    // this.lock       = true;
    this.enabled    = true;     // enabled for input, false if for display only
    this.visible    = true;     // visibility flag for object;
                                //  when not visible, input is overridden to false
    this._style      = null;     // Stores object style settings

    // TODO: Implement object-level locking. Right now everything is locked
    //   by default.
    // this.lock       = true;

    // Check if the _gui has been created.
    if (_gui == null) {
      console.error("p5.touchgui: No Gui has been created. Please call CreateGui() before creating any GuiObjects.");
    }
  }

  // Basic function for checking hits on a rectangle
  _checkHit(x, y) {
    if (x < this.x ||
        y < this.y ||
        x >= this.x + this.w ||
        y >= this.y + this.h) {
      return false;
    }
    return true;
  }

  // Sets the object's 'isPressed', 'isHeld', 'isReleased', and 'isChanged' states
  _setStates(newPressed, newHeld, newReleased) {
    this.isPressed  = newPressed;
    this.isHeld     = newHeld;
    this.isReleased = newReleased;

    if (!(this._pisPressed && !this._pisHeld) &&
        (this._pisPressed != this.isPressed ||
         this._pisHeld != this.isHeld ||
         this._pisReleased != this.isReleased)) {
      this.isChanged = true;
    }
  }

  // Sets the input selection U and V, normalized and relative to UI object location and size
  // Note: this might break if objects are drawn with CENTER mode in the future
  //    (instead of CORNERS mode)
  _setSelect(x, y) {
    this._selU = this.sketch.constrain(x - this.x, 0, this.w)/this.w;
    this._selV = this.sketch.constrain(y - this.y, 0, this.h)/this.h;

    // If the object is a 'slider' type, set 'isChanged' state if any input location change
    if (this._family == "slider" && (this._selU != this._pselU || this._selV != this._pselV)) {
      this.isChanged = true;
    }
  }


  // Set the object trigger, used internally for interaction behavior mode
  _setTrigger() {
    // Handle improper trigger mode input from user
    if (this.mode !== "onPress" &&
        this.mode !== "onHold" &&
        this.mode !== "onRelease") {
      console.warn("Interaction mode for " + this.label + " must be set to \"onPress\", \"onHold\", or \"onRelease\". Defaulting to \"onPress\".");
        this.mode = "onPress";
    }

    // Set triggered based on mode
    if (this.mode === "onPress" && this.isPressed) {
      this._triggered = true;
    }
    else if (this.mode === "onHold" && this.isHeld) {
      this._triggered = true;
    }
    else if (this.mode === "onRelease" && this.isReleased) {
      this._triggered = true;
    }
    else {
      this._triggered = false;
    }
  }

  // Set the object's 'active' state as well as 'isChanged' state if different than
  // previous frame. This gets further defined in children classes by calling
  // super._setActive().
  _setActive(active) {
    this._active = active;

    if (this._active != this._pactive) {
      this.isChanged = true;
    }
  }

  // Stores the object's state for reference in a future frame and
  // calls onHold or onChange if defined.
  _postDraw() {
    // Determine whether or not a press on the object is being isHeld
    if (this.isPressed) {
      this.isHeld = true;
    }
    else if (this.isReleased) {
      this.isHeld = false;
    }

    // These callbacks need to be implemented here because they need
    // to be triggered each frame, if triggered at all
    if (this.isHeld) {
      if (this.onHold != null) {
        if (typeof this.onHold === "function") {
          this.onHold();
        }
        else {
          console.error("guiObject.onHold(): Please assign a valid function for " + this.label + " \'onHold\' callback.");
        }
      }
    }

    if (this.isChanged) {
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
    this._pisPressed   = this.isPressed;
    this._pisHeld      = this.isHeld;
    this._pisReleased  = this.isReleased;
    this._pisChanged   = this.isChanged;
    this._pactive    = this._active;
    this._pselU      = this._selU;
    this._pselV      = this._selV;

    // Reset these variables
    this.isPressed   = false;
    this.isReleased  = false;
    this.isChanged   = false;
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
      if (this._style[args[0]] !== null) {
        // Set the style property if it exists
        this._style[args[0]] = args[1];
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

        if (this._style[key] != null) {
          // If it matches one of this object's properties in name and type, set it
          if (typeof this._style[key] === typeof settings[key]) {
            this._style[key] = settings[key];
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
  constructor(pInst, label, x, y, w=128, h=32) {
    super(pInst, label, x, y, w, h);

    this.labelOn  = label;
    this.labelOff = label;

    this._family  = "button";
    this._type    = "button";
    this._plabel  = label;    // Internal handling for updating labelOn/labelOff

    this._style    = {..._gui._style.button};
  }

  _setActive(active) {
    super._setActive(active);

    // Set val to active
    // Note: doesn't account for ability to override when input=false
    this.val = this._active;
  }

  draw() {
    // Render button
    this.sketch.push();

      this.sketch.strokeWeight(this._style.strokeWeight);
      this.sketch.rectMode(this.sketch.CORNER);

      if (this._active) {
        this.sketch.stroke(this._style.strokeBgActive);
        this.sketch.fill(this._style.fillBgActive);
      }
      else if (this._hover) {
        this.sketch.stroke(this._style.strokeBgHover);
        this.sketch.fill(this._style.fillBgHover);
      }
      else {
        this.sketch.stroke(this._style.strokeBg);
        this.sketch.fill(this._style.fillBg);
      }

      this.sketch.rect(this.x, this.y, this.w, this.h, this._style.rounding);

      // Label rendering.
      this.sketch.push();
        if (this._active) { this.sketch.fill(this._style.fillLabelActive); }
        else if (this._hover) { this.sketch.fill(this._style.fillLabelHover); }
        else { this.sketch.fill(this._style.fillLabel); }

        this.sketch.noStroke();
        this.sketch.textAlign(this.sketch.CENTER, this.sketch.CENTER);
        this.sketch.textFont(this._style.font);
        let size = this.w*0.9;
        if (size > this._style.textSize) {
          size = this._style.textSize;
        }
        this.sketch.textSize(size);

        if (this.val) {
          this.sketch.text(this.labelOn, this.x + this.w/2, this.y + this.h/2);
        }
        else {
          this.sketch.text(this.labelOff, this.x + this.w/2, this.y + this.h/2);
        }
      this.sketch.pop();

    this.sketch.pop();
  }

  _postDraw() {
    super._postDraw();

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
  constructor(pInst, label, x, y, w=128, h=32, defaultVal = false) {
    super(pInst, label, x, y, w, h);

    this.val      = defaultVal;

    this.labelOn  = label;
    this.labelOff = label;

    this._family  = "toggle";
    this._type    = "toggle";
    this._plabel  = label;    // Internal handling for updating labelOn/labelOff

    this._style    = {..._gui._style.toggle};
  }

  _setActive(active) {
    super._setActive(active);

    if (this._triggered) {
      this.val = !this.val;
    }
  }

  draw() {
    // Render button based on state
    if (this._active && this._hover && this.val) {
      // Active Off
      this._drawState(this._style.strokeBgOffActive,
                     this._style.fillBgOffActive,
                     this._style.fillLabelOffActive);
    }
    else if (this._active && this._hover && !this.val) {
      // Active On
      this._drawState(this._style.strokeBgOnActive,
                     this._style.fillBgOnActive,
                     this._style.fillLabelOnActive);
    }
    else if (this._hover && this.val) {
      // Hover On
      this._drawState(this._style.strokeBgOnHover,
                     this._style.fillBgOnHover,
                     this._style.fillLabelOnHover);
    }
    else if (this._hover && !this.val) {
      // Hover Off
      this._drawState(this._style.strokeBgOffHover,
                     this._style.fillBgOffHover,
                     this._style.fillLabelOffHover);
    }
    else if (this.val) {
      // Inactive On
      this._drawState(this._style.strokeBgOn,
                     this._style.fillBgOn,
                     this._style.fillLabelOn);
    }
    else {
      // Inactive Off
      this._drawState(this._style.strokeBgOff,
                     this._style.fillBgOff,
                     this._style.fillLabelOff);
    }
  }

  _drawState(strokeBg, fillBg, fillLabel) {
    this.sketch.push();

      this.sketch.strokeWeight(this._style.strokeWeight);
      this.sketch.rectMode(this.sketch.CORNER);

      this.sketch.stroke(strokeBg);
      this.sketch.fill(fillBg);
      this.sketch.rect(this.x, this.y, this.w, this.h, this._style.rounding);

      // Label fill
      this.sketch.fill(fillLabel);

      // Label rendering.
      this.sketch.push();
        this.sketch.noStroke();
        this.sketch.textAlign(this.sketch.CENTER, this.sketch.CENTER);
        this.sketch.textFont(this._style.font);
        let size = this.w*0.9;
        if (size > this._style.textSize) {
          size = this._style.textSize;
        }
        this.sketch.textSize(size);

        if (this.val) {
          this.sketch.text(this.labelOn, this.x + this.w/2, this.y + this.h/2);
        }
        else {
          this.sketch.text(this.labelOff, this.x + this.w/2, this.y + this.h/2);
        }

      this.sketch.pop();

    this.sketch.pop();
  }

  _postDraw() {
    super._postDraw();

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
 */
class GuiCheckbox extends GuiObject {
  constructor(pInst, label, x, y, w=32, h=32, defaultVal = false) {
    super(pInst, label, x, y, w, h);

    this.val    = defaultVal;

    this._family  = "checkbox";
    this._type    = "checkbox";

    this._style    = {..._gui._style.checkbox};
  }

  _setActive(active) {
    super._setActive(active);

    if (this._triggered) {
      this.val = !this.val;
    }
  }

  draw() {
    // Render checkbox
    if (this._active && this._hover && this.val) {
      // Active On
      this._drawState(this._style.fillBgActive);
      this._drawCheck(this._style.fillCheckActive);
    }
    else if (this._active && this._hover && !this.val) {
      // Active Off
      this._drawState(this._style.fillBgActive);
    }
    else if (this._hover && this.val) {
      // Hover On
      this._drawState(this._style.fillBgHover);
      this._drawCheck(this._style.fillCheckHover);
    }
    else if (this._hover && !this.val) {
      // Hover Off
      this._drawState(this._style.fillBgHover);
    }
    else if (this.val) {
      // Inactive On
      this._drawState(this._style.fillBg);
      this._drawCheck(this._style.fillCheck);
    }
    else {
      // Inactive Off
      this._drawState(this._style.fillBg);
    }
  }

  _drawState(fillBg) {
    this.sketch.push();
      // Draw background shape
      this.sketch.rectMode(this.sketch.CORNER);
      this.sketch.stroke(this._style.strokeBg);
      this.sketch.strokeWeight(this._style.strokeWeight);
      this.sketch.fill(fillBg);
      this.sketch.rect(this.x, this.y, this.w, this.h, this._style.rounding);
    this.sketch.pop();
  }

  _drawCheck(fillCheck) {
    // Note: I don't really like how this is done lol; it's sloppy and can be better
    let x8  = this.x+this.w/6;
    let y8  = this.y+this.h/6;
    let w16 = this.w-this.w/3;
    let h16 = this.h-this.h/3;
    let xw  = x8+w16;
    let yh  = y8+h16;
    let strokeMult = this.sketch.map(((this.w > this.h) ? this.w : this.h), 32, 1000, 2, 20);

    this.sketch.push();
      this.sketch.stroke(fillCheck);
      this.sketch.strokeWeight(this._style.strokeWeight*strokeMult);
      this.sketch.line(x8, y8, xw, yh);
      this.sketch.line(xw, y8, x8, yh);
    this.sketch.pop();
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
  constructor(pInst, label, x, y, w=256, h=32, min=0, max=1) {
    super(pInst, label, x, y, w, h);

    this.min    = min;
    this.max    = max;
    this.val    = min + (max - min)/2;

    this._family  = "slider";
    this._type    = "slider";

    this._style    = {..._gui._style.slider};
  }

  _setActive(active) {
    super._setActive(active);

    if (this._active && this._selU != null) {
      this.val  = this.sketch.map(this._selU, 0, 1, this.min, this.max);
      this.val  = this.isInteger ? this.sketch.int(this.val) : this.val;
    }
  }

  draw() {
    if (this._active) {
      this._drawState(this._style.fillBgActive,
                     this._style.fillTrackActive,
                     this._style.fillHandleActive,
                     this._style.strokeBgActive,
                     this._style.strokeTrackActive,
                     this._style.strokeHandleActive);
    }
    else if (this._hover) {
      this._drawState(this._style.fillBgHover,
                     this._style.fillTrackHover,
                     this._style.fillHandleHover,
                     this._style.strokeBgHover,
                     this._style.strokeTrackHover,
                     this._style.strokeHandleHover);
    }
    else {
      this._drawState(this._style.fillBg,
                     this._style.fillTrack,
                     this._style.fillHandle,
                     this._style.strokeBg,
                     this._style.strokeTrack,
                     this._style.strokeHandle);
    }
  }

  _drawState(fillBg, fillTrack, fillHandle, strokeBg, strokeTrack, strokeHandle) {
    let xpos = this.sketch.map(this.val, this.min, this.max, 8, this.w-24);

    this.sketch.push();
      this.sketch.strokeWeight(this._style.strokeWeight);
      this.sketch.rectMode(this.sketch.CORNER);

      // Render bg
      this.sketch.stroke(strokeBg);
      this.sketch.fill(fillBg);
      this.sketch.rect(this.x, this.y, this.w, this.h, this._style.rounding);

      // Render track
      this._style.trackWidth = this.sketch.constrain(this._style.trackWidth, 0, 1);
      let h = this.h-20;

      this.sketch.push();
        this.sketch.stroke(strokeTrack);
        this.sketch.fill(fillTrack);

        if (this._style.trackWidth > 0) {
          this.sketch.rect(this.x+10,
               this.y+10 + h*(1-this._style.trackWidth)*0.5,
               xpos,
               h*this._style.trackWidth,
               this._style.rounding, 0, 0, this._style.rounding);
        }
        else {
          this.sketch.line(this.x+10,
               this.y+10 + h*(1-this._style.trackWidth)*0.5,
               this.x+10+xpos,
               this.y+10 + h*(1-this._style.trackWidth)*0.5);
        }
      this.sketch.pop();

      // Render handle
      this.sketch.push();
        this.sketch.stroke(strokeHandle);
        this.sketch.fill(fillHandle);
        rthis.sketch.ect(this.x+xpos, this.y+8, 16, this.h-16, this._style.rounding);
      this.sketch.pop();
    this.sketch.pop();
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
  constructor(pInst, label, x, y, w=32, h=256, min=0, max=1) {
    super(pInst, label, x, y, w, h);

    this.min    = min;
    this.max    = max;
    this.val    = min + (max - min)/2;

    this._family  = "slider";
    this._type    = "slider";

    this._style    = {..._gui._style.slider};
  }

  _setActive(active) {
    super._setActive(active);

    if (this._active && this._selV != null) {
      this.val  = this.sketch.map(this._selV, 1, 0, this.min, this.max);
      this.val  = this.isInteger ? this.sketch.int(this.val) : this.val;
    }
  }

  draw() {
    if (this._active) {
      this._drawState(this._style.fillBgActive,
                     this._style.fillTrackActive,
                     this._style.fillHandleActive,
                     this._style.strokeBgActive,
                     this._style.strokeTrackActive,
                     this._style.strokeHandleActive);
    }
    else if (this._hover) {
      this._drawState(this._style.fillBgHover,
                     this._style.fillTrackHover,
                     this._style.fillHandleHover,
                     this._style.strokeBgHover,
                     this._style.strokeTrackHover,
                     this._style.strokeHandleHover);
    }
    else {
      this._drawState(this._style.fillBg,
                     this._style.fillTrack,
                     this._style.fillHandle,
                     this._style.strokeBg,
                     this._style.strokeTrack,
                     this._style.strokeHandle);
    }
  }

  _drawState(fillBg, fillTrack, fillHandle, strokeBg, strokeTrack, strokeHandle) {
    let ypos = this.sketch.map(this.val, this.min, this.max, this.h-24, 8);

    this.sketch.push();
      this.sketch.strokeWeight(this._style.strokeWeight);
      this.sketch.rectMode(this.sketch.CORNER);

      // Render bg
      this.sketch.stroke(strokeBg);
      this.sketch.fill(fillBg);
      this.sketch.rect(this.x, this.y, this.w, this.h, this._style.rounding);

      // Render track
      this._style.trackWidth = this.sketch.constrain(this._style.trackWidth, 0, 1);
      let w = this.w-20;

      this.sketch.push();
        this.sketch.stroke(strokeTrack);
        this.sketch.fill(fillTrack);

        if (this._style.trackWidth > 0) {
            this.sketch.rect(this.x+10 + w*(1-this._style.trackWidth)*0.5,
                 this.y+ypos+10,
                 w*this._style.trackWidth,
                 this.h-ypos-20,
                 0, 0, this._style.rounding, this._style.rounding);
        }
        else {
            this.sketch.line(this.x+10 + w*0.5, this.y+ypos+10,
                 this.x+10 + w*0.5, this.y+this.h-10);
        }
      this.sketch.pop();

      // Render handle
      this.sketch.push();
        this.sketch.stroke(strokeHandle);
        this.sketch.fill(fillHandle);
        this.sketch.rect(this.x+8, this.y+ypos, this.w-16, 16, this._style.rounding);
      this.sketch.pop();
    this.sketch.pop();
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
  constructor(pInst, label, x, y, w=256, h=32, min=(-1), max=1) {
    super(pInst, label, x, y, w, h, min, max);

    this.snap   = false; // If true, snaps value back to 0 when not active

    this._family  = "slider";
    this._type    = "crossfader";

    this._style = Object.create(_gui._style.slider);
    this._style.strokeCenter = Object.create(_gui._style.crossfader.strokeCenter);
    this._style.strokeCenterHover = Object.create(_gui._style.crossfader.strokeCenterHover);
    this._style.strokeCenterActive = Object.create(_gui._style.crossfader.strokeCenterActive);
  }

  _setActive(active) {
    super._setActive(active);

    if (!this._active && this.snap) {
      this.val = (this.min + this.max)/2;
    }
  }

  _drawState(fillBg, fillTrack, fillHandle, strokeBg, strokeTrack, strokeHandle) {
    let xpos = this.sketch.map(this.val, this.min, this.max, 8, this.w-24);
    let halfXpos = (this.w-16)/2;

    this.sketch.push();
      this.sketch.strokeWeight(this._style.strokeWeight);
      this.sketch.rectMode(this.sketch.CORNER);

      // Render bg
      this.sketch.stroke(strokeBg);
      this.sketch.fill(fillBg);
      this.sketch.rect(this.x, this.y, this.w, this.h, this._style.rounding);

      // Render track from center
      this._style.trackWidth = this.sketch.constrain(this._style.trackWidth, 0, 1);
      let h = this.h-20;

      this.sketch.push();
        this.sketch.stroke(strokeTrack);
        this.sketch.fill(fillTrack);

        if (xpos >= halfXpos) {
          if (this._style.trackWidth > 0) {
            this.sketch.rect(this.x+halfXpos+8,
                 this.y+10 + h*(1-this._style.trackWidth)*0.5,
                 xpos-halfXpos,
                 h*this._style.trackWidth);
          }
          else {
            this.sketch.line(this.x+halfXpos+8,
                 this.y+10 + h*(1-this._style.trackWidth)*0.5,
                 this.x+8+xpos,
                 this.y+10 + h*(1-this._style.trackWidth)*0.5);
          }

        }
        else {
          if (this._style.trackWidth > 0) {
            this.sketch.rect(this.x+xpos,
                 this.y+10 + h*(1-this._style.trackWidth)*0.5,
                 halfXpos-xpos+8,
                 h*this._style.trackWidth);
          }
          else {
            this.sketch.line(this.x+xpos,
                 this.y+10 + h*(1-this._style.trackWidth)*0.5,
                 this.x+halfXpos+8,
                 this.y+10 + h*(1-this._style.trackWidth)*0.5);
          }
        }

        // Draw center line
        this.sketch.stroke(this._style.strokeCenter);
        this.sketch.strokeWeight(this._style.strokeWeight);
        this.sketch.line(this.x+this.w/2, this.y, this.x+this.w/2, this.y+this.h);
      this.sketch.pop();

      // Render handle
      this.sketch.push();
        this.sketch.stroke(strokeHandle);
        this.sketch.fill(fillHandle);
        this.sketch.rect(this.x+xpos, this.y+8, 16, this.h-16, this._style.rounding);
      this.sketch.pop();
    this.sketch.pop();
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
  constructor(pInst, label, x, y, w=256, h=32, min=(-1), max=1) {
    super(pInst, label, x, y, w, h, min, max);

    this.snap = false; // If true, snaps value back to 0 when not active

    this._family  = "slider";
    this._type    = "crossfader";

    this._style = Object.create(_gui._style.slider);
    this._style.strokeCenter = Object.create(_gui._style.crossfader.strokeCenter);
    this._style.strokeCenterHover = Object.create(_gui._style.crossfader.strokeCenterHover);
    this._style.strokeCenterActive = Object.create(_gui._style.crossfader.strokeCenterActive);
  }

  _setActive(active) {
    super._setActive(active);

    if (!this._active && this.snap) {
      this.val = (this.min + this.max)/2;
    }
  }

  _drawState(fillBg, fillTrack, fillHandle, strokeBg, strokeTrack, strokeHandle) {
    let ypos = this.sketch.map(this.val, this.min, this.max, this.h-24, 8);
    let halfYpos = (this.h-16)/2;

    this.sketch.push();
      this.sketch.strokeWeight(this._style.strokeWeight);
      this.sketch.rectMode(CORNER);

      // Render bg
      this.sketch.stroke(strokeBg);
      this.sketch.fill(fillBg);
      this.sketch.rect(this.x, this.y, this.w, this.h, this._style.rounding);

      // Render track from center
      this._style.trackWidth = this.sketch.constrain(this._style.trackWidth, 0, 1);
      let w = this.w-20;

      this.sketch.push();
        this.sketch.stroke(strokeTrack);
        this.sketch.fill(fillTrack);

        if (ypos >= halfYpos) {
          if (this._style.trackWidth > 0) {
            this.sketch.rect(this.x+10 + w*(1-this._style.trackWidth)*0.5,
                 this.y+halfYpos+8,
                 w*this._style.trackWidth,
                 ypos-halfYpos);
          }
          else {
            this.sketch.line(this.x+10 + w*(1-this._style.trackWidth)*0.5,
                 this.y+halfYpos+8,
                 this.x+10 + w*(1-this._style.trackWidth)*0.5,
                 this.y+8+ypos);
          }
        }
        else {
          if (this._style.trackWidth > 0) {
            this.sketch.rect(this.x+10 + w*(1-this._style.trackWidth)*0.5,
                 this.y+ypos,
                 w*this._style.trackWidth,
                 halfYpos-ypos+8);
          }
          else {
            this.sketch.line(this.x+10 + w*(1-this._style.trackWidth)*0.5,
                 this.y+ypos,
                 this.x+10 + w*(1-this._style.trackWidth)*0.5,
                 this.y+halfYpos+8);
          }
        }

        // Draw center line
        this.sketch.stroke(this._style.strokeCenter);
        this.sketch.strokeWeight(this._style.strokeWeight);
        this.sketch.line(this.x, this.y+this.h/2, this.x+this.w, this.y+this.h/2);
      this.sketch.pop();

      // Render handle
      this.sketch.push();
        this.sketch.stroke(strokeHandle);
        this.sketch.fill(fillHandle);
        this.sketch.rect(this.x+8, this.y+ypos, this.w-16, 16, this._style.rounding);
      this.sketch.pop();
    this.sketch.pop();
  }
}

/**
 * Gui2dSlider
 * - Two dimensional slider that returns an X/Y pair of values
 *
 *  TODO: fix hard coding of buffers (e.g. this.w-24)
 *  TODO: fix so that touch corresponds with handle
 */
class GuiSlider2d extends GuiObject {
  constructor(pInst, label, x, y, w=256, h=256, minX=(-1), maxX=1, minY=(-1), maxY=1) {
    super(pInst, label, x, y, w, h);

    this.minX   = minX;
    this.maxX   = maxX;
    this.minY   = minY;
    this.maxY   = maxY;
    this.val    = {x:0, y:0};
    this.valX   = minX + (maxX - minX)/2;
    this.valY   = minY + (maxY - minY)/2;

    this._family  = "slider";
    this._type    = "slider2d";

    this._style = Object.create(_gui._style.slider);
    this._style.handleRadius = _gui._style.slider2d.handleRadius;
  }

  _setActive(active) {
    super._setActive(active);

    if (this._active && this._selU != null && this._selV != null) {
      this.valX = this.sketch.map(this._selU, 0, 1, this.minX, this.maxX);
      this.valY = this.sketch.map(this._selV, 1, 0, this.minY, this.maxY);

      if (this.isInteger && this._type == "slider2d") {
        this.valX = this.sketch.int(this.valX);
        this.valY = this.sketch.int(this.valY);
      }

      this.val  = {x: this.valX, y:this.valY};
    }
  }

  draw() {
    if (this._active) {
      this._drawState(this._style.fillBgActive,
                     this._style.fillTrackActive,
                     this._style.fillHandleActive,
                     this._style.strokeBgActive,
                     this._style.strokeTrackActive,
                     this._style.strokeHandleActive);
    }
    else if (this._hover) {
      this._drawState(this._style.fillBgHover,
                     this._style.fillTrackHover,
                     this._style.fillHandleHover,
                     this._style.strokeBgHover,
                     this._style.strokeTrackHover,
                     this._style.strokeHandleHover);
    }
    else {
      this._drawState(this._style.fillBg,
                     this._style.fillTrack,
                     this._style.fillHandle,
                     this._style.strokeBg,
                     this._style.strokeTrack,
                     this._style.strokeHandle);
    }
  }

  _drawState(fillBg, fillTrack, fillHandle, strokeBg, strokeTrack, strokeHandle) {
    let xpos = this.sketch.map(this.valX, this.minX, this.maxX, 8, this.w-24);
    let ypos = this.sketch.map(this.valY, this.minY, this.maxY, this.h-24, 8);

    this.sketch.push();
      this.sketch.strokeWeight(this._style.strokeWeight);
      this.sketch.rectMode(this.sketch.CORNER);

      // Render bg
      this.sketch.stroke(strokeBg);
      this.sketch.fill(fillBg);
      this.sketch.rect(this.x, this.y, this.w, this.h, this._style.rounding);

      // Render crosshair (track)
      this.sketch.push();
        this.sketch.stroke(fillTrack);
        this.sketch.line(this.x, this.y+ypos+8, this.x+this.w, this.y+ypos+8);
        this.sketch.line(this.x+xpos+8, this.y, this.x+xpos+8, this.y+this.h);
      this.sketch.pop();

      // Render handle
      this.sketch.push();
        this.sketch.stroke(strokeHandle);
        this.sketch.fill(fillHandle);

        this.sketch.ellipse(this.x+xpos+8,
                this.y+ypos+8,
                this._style.handleRadius,
                this._style.handleRadius);
      this.sketch.pop();
    this.sketch.pop();
  }
}

/**
 * GuiJoystick
 * - Two dimensional slider that returns an X/Y pair of values
 *   relative to a resetting zero point at its center.
 */
class GuiJoystick extends GuiSlider2d {
  constructor(pInst, label, x, y, w=256, h=256, minX=(-1), maxX=1, minY=(-1), maxY=1) {
    super(pInst, label, x, y, w, h, minX, maxX, minY, maxY);

    this.snap = true; // If true, snaps value back to 0 when not active

    this._family  = "slider";
    this._type    = "joystick";

    this._style = Object.create(_gui._style.slider);
    this._style.handleRadius = _gui._style.joystick.handleRadius;
  }

  _setActive(active) {
    super._setActive(active);

    if (!this._active && this.snap) {
      this.valX = (this.minX + this.maxX)/2;
      this.valY = (this.minY + this.maxY)/2;
      this.val  = {x: this.valX, y:this.valY};
    }
  }

  _drawState(fillBg, fillTrack, fillHandle, strokeBg, strokeTrack, strokeHandle) {
    let xpos = this.sketch.map(this.valX, this.minX, this.maxX, 8, this.w-24);
    let ypos = this.sketch.map(this.valY, this.minY, this.maxY, this.h-24, 8);

    this.sketch.push();
      this.sketch.strokeWeight(this._style.strokeWeight);
      this.sketch.rectMode(this.sketch.CORNER);

      // Render bg
      this.sketch.stroke(strokeBg);
      this.sketch.fill(fillBg);
      this.sketch.rect(this.x, this.y, this.w, this.h, this._style.rounding);

      // Render circle (track)
      this.sketch.push();
        this.sketch.stroke(fillTrack);
        let r = this.w*this._style.trackRatio;
        if (this.w > this.h) {
          r = this.h*this._style.trackRatio;
        }

        this.sketch.ellipse(this.x+this.w/2, this.y+this.h/2, r)
      this.sketch.pop();

      // Render handle
      this.sketch.push();
        this.sketch.stroke(strokeHandle);
        this.sketch.fill(fillHandle);

        this.sketch.ellipse(this.x+xpos+8,
                this.y+ypos+8,
                this._style.handleRadius,
                this._style.handleRadius);
      this.sketch.pop();
    this.sketch.pop();
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
 *  TODO: Study material-ui implementation of colors and try
 *        to implement something similar (i.e. primary and accent color)
 */
class GuiStyle {
  constructor(pInst) {
    this.sketch = pInst
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
      fillBg:             this.sketch.color(130),
      fillBgHover:        this.sketch.color(196),
      fillBgActive:       this.sketch.color(220),
      fillLabel:          this.sketch.color(0),
      fillLabelHover:     this.sketch.color(0),
      fillLabelActive:    this.sketch.color(0),
      strokeBg:           this.sketch.color(0),
      strokeBgHover:      this.sketch.color(0),
      strokeBgActive:     this.sketch.color(0)
    };

    this.toggle = {
      strokeWeight:       2,
      rounding:           10,
      font:               'Arial',
      textSize:           20,
      fillBgOff:          this.sketch.color(130),
      fillBgOffHover:     this.sketch.color(196),
      fillBgOffActive:    this.sketch.color(220),
      fillBgOn:           this.sketch.color(230),
      fillBgOnHover:      this.sketch.color(245),
      fillBgOnActive:     this.sketch.color(255),
      fillLabelOff:       this.sketch.color(0),
      fillLabelOffHover:  this.sketch.color(0),
      fillLabelOffActive: this.sketch.color(0),
      fillLabelOn:        this.sketch.color(0),
      fillLabelOnHover:   this.sketch.color(0),
      fillLabelOnActive:  this.sketch.color(0),
      strokeBgOff:        this.sketch.color(0),
      strokeBgOffHover:   this.sketch.color(0),
      strokeBgOffActive:  this.sketch.color(0),
      strokeBgOn:         this.sketch.color(0),
      strokeBgOnHover:    this.sketch.color(0),
      strokeBgOnActive:   this.sketch.color(0)
    }

    this.checkbox = {
      strokeWeight:       2,
      rounding:           10,
      fillBg:             this.sketch.color(100),
      fillBgHover:        this.sketch.color(144),
      fillBgActive:       this.sketch.color(160),
      fillCheck:          this.sketch.color(200),
      fillCheckHover:     this.sketch.color(220),
      fillCheckActive:    this.sketch.color(240),
      strokeBg:           this.sketch.color(0)
    }

    this.slider = {
      strokeWeight:       2,
      rounding:           10,
      trackWidth:         1,
      fillBg:             this.sketch.color(130),
      fillBgHover:        this.sketch.color(175),
      fillBgActive:       this.sketch.color(175),
      fillTrack:          this.sketch.color(100),
      fillTrackHover:     this.sketch.color(144),
      fillTrackActive:    this.sketch.color(144),
      fillHandle:         this.sketch.color(64),
      fillHandleHover:    this.sketch.color(96),
      fillHandleActive:   this.sketch.color(240),
      strokeBg:           this.sketch.color(0),
      strokeBgHover:      this.sketch.color(0),
      strokeBgActive:     this.sketch.color(0),
      strokeTrack:        this.sketch.color(100),
      strokeTrackHover:   this.sketch.color(144),
      strokeTrackActive:  this.sketch.color(144),
      strokeHandle:       this.sketch.color(64),
      strokeHandleHover:  this.sketch.color(0),
      strokeHandleActive: this.sketch.color(0)
    }

    this.crossfader = {
      strokeCenter:       this.sketch.color(100),
      strokeCenterHover:  this.sketch.color(100),
      strokeCenterActive: this.sketch.color(100)
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
      fillBg:             this.sketch.color(130),
      fillBgHover:        this.sketch.color(196),
      fillBgActive:       this.sketch.color(220),
      fillLabel:          this.sketch.color(0),
      fillLabelHover:     this.sketch.color(0),
      fillLabelActive:    this.sketch.color(0),
      strokeBg:           this.sketch.color(0),
      strokeBgHover:      this.sketch.color(0),
      strokeBgActive:     this.sketch.color(0)
    };

    this.toggle = {
      strokeWeight:       2,
      rounding:           10,
      font:               'Arial',
      textSize:           20,
      fillBgOff:          this.sketch.color(130),
      fillBgOffHover:     this.sketch.color(196),
      fillBgOffActive:    this.sketch.color(220),
      fillBgOn:           this.sketch.color(230),
      fillBgOnHover:      this.sketch.color(245),
      fillBgOnActive:     this.sketch.color(255),
      fillLabelOff:       this.sketch.color(0),
      fillLabelOffHover:  this.sketch.color(0),
      fillLabelOffActive: this.sketch.color(0),
      fillLabelOn:        this.sketch.color(0),
      fillLabelOnHover:   this.sketch.color(0),
      fillLabelOnActive:  this.sketch.color(0),
      strokeBgOff:        this.sketch.color(0),
      strokeBgOffHover:   this.sketch.color(0),
      strokeBgOffActive:  this.sketch.color(0),
      strokeBgOn:         this.sketch.color(0),
      strokeBgOnHover:    this.sketch.color(0),
      strokeBgOnActive:   this.sketch.color(0)
    }

    this.checkbox = {
      strokeWeight:       2,
      rounding:           10,
      fillBg:             this.sketch.color(100),
      fillBgHover:        this.sketch.color(144),
      fillBgActive:       this.sketch.color(160),
      fillCheck:          this.sketch.color(200),
      fillCheckHover:     this.sketch.color(220),
      fillCheckActive:    this.sketch.color(240),
      strokeBg:           this.sketch.color(0)
    }

    this.slider = {
      strokeWeight:       2,
      rounding:           10,
      trackWidth:         1,
      fillBg:             this.sketch.color(130),
      fillBgHover:        this.sketch.color(175),
      fillBgActive:       this.sketch.color(175),
      fillTrack:          this.sketch.color(100),
      fillTrackHover:     this.sketch.color(144),
      fillTrackActive:    this.sketch.color(144),
      fillHandle:         this.sketch.color(64),
      fillHandleHover:    this.sketch.color(96),
      fillHandleActive:   this.sketch.color(240),
      strokeBg:           this.sketch.color(0),
      strokeBgHover:      this.sketch.color(0),
      strokeBgActive:     this.sketch.color(0),
      strokeTrack:        this.sketch.color(100),
      strokeTrackHover:   this.sketch.color(144),
      strokeTrackActive:  this.sketch.color(144),
      strokeHandle:       this.sketch.color(64),
      strokeHandleHover:  this.sketch.color(0),
      strokeHandleActive: this.sketch.color(0)
    }

    this.crossfader = {
      strokeCenter:       this.sketch.color(100),
      strokeCenterHover:  this.sketch.color(100),
      strokeCenterActive: this.sketch.color(100)
    }

    this.slider2d = {
      handleRadius:       16
    }

    this.joystick = {
      handleRadius:       16
    }
  }

  //
  Rose() {
    this.name             = "Rose";

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
      fillBg:             this.sketch.color('#E57FBE'),
      fillBgHover:        this.sketch.color('#EFABD5'),
      fillBgActive:       this.sketch.color('#FFE6F4'),
      fillLabel:          this.sketch.color('#3F102F'),
      fillLabelHover:     this.sketch.color('#3F102F'),
      fillLabelActive:    this.sketch.color('#3F102F'),
      strokeBg:           this.sketch.color('#3F102F'),
      strokeBgHover:      this.sketch.color('#3F102F'),
      strokeBgActive:     this.sketch.color('#3F102F')
    };

    this.toggle = {
      strokeWeight:       2,
      rounding:           10,
      font:               'Arial',
      textSize:           20,
      fillBgOff:          this.sketch.color('#CC69AB'),
      fillBgOffHover:     this.sketch.color('#E288C4'),
      fillBgOffActive:    this.sketch.color('#FFF3FA'),
      fillBgOn:           this.sketch.color('#FFE6F4'),
      fillBgOnHover:      this.sketch.color('#FFF3FA'),
      fillBgOnActive:     this.sketch.color('#FAFAFA'),
      fillLabelOff:       this.sketch.color('#3F102F'),
      fillLabelOffHover:  this.sketch.color('#3F102F'),
      fillLabelOffActive: this.sketch.color('#3F102F'),
      fillLabelOn:        this.sketch.color('#3F102F'),
      fillLabelOnHover:   this.sketch.color('#3F102F'),
      fillLabelOnActive:  this.sketch.color('#3F102F'),
      strokeBgOff:        this.sketch.color('#3F102F'),
      strokeBgOffHover:   this.sketch.color('#3F102F'),
      strokeBgOffActive:  this.sketch.color('#3F102F'),
      strokeBgOn:         this.sketch.color('#3F102F'),
      strokeBgOnHover:    this.sketch.color('#3F102F'),
      strokeBgOnActive:   this.sketch.color('#3F102F')
    }

    this.checkbox = {
      strokeWeight:       2,
      rounding:           10,
      fillBg:             this.sketch.color('#7F3663'),
      fillBgHover:        this.sketch.color('#C45093'),
      fillBgActive:       this.sketch.color('#E57FBE'),
      fillCheck:          this.sketch.color('#FFE6F4'),
      fillCheckHover:     this.sketch.color('#FFF3FA'),
      fillCheckActive:    this.sketch.color('#FAFAFA'),
      strokeBg:           this.sketch.color('#3F102F')
    }

    this.slider = {
      strokeWeight:       2,
      rounding:           10,
      trackWidth:         1,
      fillBg:             this.sketch.color('#FFE6F4'),
      fillBgHover:        this.sketch.color('#FFE6F4'),
      fillBgActive:       this.sketch.color('#FFF3FA'),
      fillTrack:          this.sketch.color('#C45093'),
      fillTrackHover:     this.sketch.color('#CC66A6'),
      fillTrackActive:    this.sketch.color('#D877B4'),
      fillHandle:         this.sketch.color('#7F3663'),
      fillHandleHover:    this.sketch.color('#E57FBE'),
      fillHandleActive:   this.sketch.color('#FAFAFA'),
      strokeBg:           this.sketch.color('#3F102F'),
      strokeBgHover:      this.sketch.color('#3F102F'),
      strokeBgActive:     this.sketch.color('#3F102F'),
      strokeTrack:        this.sketch.color('#C45093'),
      strokeTrackHover:   this.sketch.color('#CC66A6'),
      strokeTrackActive:  this.sketch.color('#D877B4'),
      strokeHandle:       this.sketch.color('#3F102F'),
      strokeHandleHover:  this.sketch.color('#3F102F'),
      strokeHandleActive: this.sketch.color('#3F102F')
    }

    this.crossfader = {
      strokeCenter:       this.sketch.color('#C45093'),
      strokeCenterHover:  this.sketch.color('#CC66A6'),
      strokeCenterActive: this.sketch.color('#D877B4')
    }

    this.slider2d = {
      handleRadius:       16
    }

    this.joystick = {
      handleRadius:       16
    }
  }

  //
  Seafoam() {
    this.name             = "Seafoam";

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
      fillBg:             this.sketch.color('#7FE5BE'),
      fillBgHover:        this.sketch.color('#ABEFD5'),
      fillBgActive:       this.sketch.color('#E6FFF4'),
      fillLabel:          this.sketch.color('#103F2F'),
      fillLabelHover:     this.sketch.color('#103F2F'),
      fillLabelActive:    this.sketch.color('#103F2F'),
      strokeBg:           this.sketch.color('#103F2F'),
      strokeBgHover:      this.sketch.color('#103F2F'),
      strokeBgActive:     this.sketch.color('#103F2F')
    };

    this.toggle = {
      strokeWeight:       2,
      rounding:           10,
      font:               'Arial',
      textSize:           20,
      fillBgOff:          this.sketch.color('#69CCAB'),
      fillBgOffHover:     this.sketch.color('#88E2C4'),
      fillBgOffActive:    this.sketch.color('#F3FFFA'),
      fillBgOn:           this.sketch.color('#E6FFF4'),
      fillBgOnHover:      this.sketch.color('#F3FFFA'),
      fillBgOnActive:     this.sketch.color('#FAFAFA'),
      fillLabelOff:       this.sketch.color('#103F2F'),
      fillLabelOffHover:  this.sketch.color('#103F2F'),
      fillLabelOffActive: this.sketch.color('#103F2F'),
      fillLabelOn:        this.sketch.color('#103F2F'),
      fillLabelOnHover:   this.sketch.color('#103F2F'),
      fillLabelOnActive:  this.sketch.color('#103F2F'),
      strokeBgOff:        this.sketch.color('#103F2F'),
      strokeBgOffHover:   this.sketch.color('#103F2F'),
      strokeBgOffActive:  this.sketch.color('#103F2F'),
      strokeBgOn:         this.sketch.color('#103F2F'),
      strokeBgOnHover:    this.sketch.color('#103F2F'),
      strokeBgOnActive:   this.sketch.color('#103F2F')
    }

    this.checkbox = {
      strokeWeight:       2,
      rounding:           10,
      fillBg:             this.sketch.color('#367F63'),
      fillBgHover:        this.sketch.color('#50C493'),
      fillBgActive:       this.sketch.color('#7FE5BE'),
      fillCheck:          this.sketch.color('#E6FFF4'),
      fillCheckHover:     this.sketch.color('#F3FFFA'),
      fillCheckActive:    this.sketch.color('#FAFAFA'),
      strokeBg:           this.sketch.color('#103F2F')
    }

    this.slider = {
      strokeWeight:       2,
      rounding:           10,
      trackWidth:         1,
      fillBg:             this.sketch.color('#E6FFF4'),
      fillBgHover:        this.sketch.color('#E6FFF4'),
      fillBgActive:       this.sketch.color('#F3FFFA'),
      fillTrack:          this.sketch.color('#50C493'),
      fillTrackHover:     this.sketch.color('#66CCA6'),
      fillTrackActive:    this.sketch.color('#77D8B4'),
      fillHandle:         this.sketch.color('#367F63'),
      fillHandleHover:    this.sketch.color('#7FE5BE'),
      fillHandleActive:   this.sketch.color('#FAFAFA'),
      strokeBg:           this.sketch.color('#103F2F'),
      strokeBgHover:      this.sketch.color('#103F2F'),
      strokeBgActive:     this.sketch.color('#103F2F'),
      strokeTrack:        this.sketch.color('#50C493'),
      strokeTrackHover:   this.sketch.color('#66CCA6'),
      strokeTrackActive:  this.sketch.color('#77D8B4'),
      strokeHandle:       this.sketch.color('#103F2F'),
      strokeHandleHover:  this.sketch.color('#103F2F'),
      strokeHandleActive: this.sketch.color('#103F2F')
    }

    this.crossfader = {
      strokeCenter:       this.sketch.color('#50C493'),
      strokeCenterHover:  this.sketch.color('#66CCA6'),
      strokeCenterActive: this.sketch.color('#77D8B4')
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
      fillBg:             this.sketch.color('#7FBEE5'),
      fillBgHover:        this.sketch.color('#ABD5EF'),
      fillBgActive:       this.sketch.color('#E6F4FF'),
      fillLabel:          this.sketch.color('#102F3F'),
      fillLabelHover:     this.sketch.color('#102F3F'),
      fillLabelActive:    this.sketch.color('#102F3F'),
      strokeBg:           this.sketch.color('#102F3F'),
      strokeBgHover:      this.sketch.color('#102F3F'),
      strokeBgActive:     this.sketch.color('#102F3F')
    };

    this.toggle = {
      strokeWeight:       2,
      rounding:           10,
      font:               'Arial',
      textSize:           20,
      fillBgOff:          this.sketch.color('#69ABCC'),
      fillBgOffHover:     this.sketch.color('#88C4E2'),
      fillBgOffActive:    this.sketch.color('#F3FAFF'),
      fillBgOn:           this.sketch.color('#E6F4FF'),
      fillBgOnHover:      this.sketch.color('#F3FAFF'),
      fillBgOnActive:     this.sketch.color('#FAFAFA'),
      fillLabelOff:       this.sketch.color('#102F3F'),
      fillLabelOffHover:  this.sketch.color('#102F3F'),
      fillLabelOffActive: this.sketch.color('#102F3F'),
      fillLabelOn:        this.sketch.color('#102F3F'),
      fillLabelOnHover:   this.sketch.color('#102F3F'),
      fillLabelOnActive:  this.sketch.color('#102F3F'),
      strokeBgOff:        this.sketch.color('#102F3F'),
      strokeBgOffHover:   this.sketch.color('#102F3F'),
      strokeBgOffActive:  this.sketch.color('#102F3F'),
      strokeBgOn:         this.sketch.color('#102F3F'),
      strokeBgOnHover:    this.sketch.color('#102F3F'),
      strokeBgOnActive:   this.sketch.color('#102F3F')
    }

    this.checkbox = {
      strokeWeight:       2,
      rounding:           10,
      fillBg:             this.sketch.color('#36637F'),
      fillBgHover:        this.sketch.color('#5093C4'),
      fillBgActive:       this.sketch.color('#7FBEE5'),
      fillCheck:          this.sketch.color('#E6F4FF'),
      fillCheckHover:     this.sketch.color('#F3FAFF'),
      fillCheckActive:    this.sketch.color('#FAFAFA'),
      strokeBg:           this.sketch.color('#102F3F')
    }

    this.slider = {
      strokeWeight:       2,
      rounding:           10,
      trackWidth:         1,
      fillBg:             this.sketch.color('#E6F4FF'),
      fillBgHover:        this.sketch.color('#E6F4FF'),
      fillBgActive:       this.sketch.color('#F3FAFF'),
      fillTrack:          this.sketch.color('#5093C4'),
      fillTrackHover:     this.sketch.color('#66A6CC'),
      fillTrackActive:    this.sketch.color('#77B4D8'),
      fillHandle:         this.sketch.color('#36637F'),
      fillHandleHover:    this.sketch.color('#7FBEE5'),
      fillHandleActive:   this.sketch.color('#FAFAFA'),
      strokeBg:           this.sketch.color('#102F3F'),
      strokeBgHover:      this.sketch.color('#102F3F'),
      strokeBgActive:     this.sketch.color('#102F3F'),
      strokeTrack:        this.sketch.color('#5093C4'),
      strokeTrackHover:   this.sketch.color('#66A6CC'),
      strokeTrackActive:  this.sketch.color('#77B4D8'),
      strokeHandle:       this.sketch.color('#102F3F'),
      strokeHandleHover:  this.sketch.color('#102F3F'),
      strokeHandleActive: this.sketch.color('#102F3F')
    }

    this.crossfader = {
      strokeCenter:       this.sketch.color('#5093C4'),
      strokeCenterHover:  this.sketch.color('#66A6CC'),
      strokeCenterActive: this.sketch.color('#77B4D8')
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
      fillBg:             this.sketch.color('#000000'),
      fillBgHover:        this.sketch.color('#003000'),
      fillBgActive:       this.sketch.color('#00F200'),
      fillLabel:          this.sketch.color('#00FF00'),
      fillLabelHover:     this.sketch.color('#00FF00'),
      fillLabelActive:    this.sketch.color('#000000'),
      strokeBg:           this.sketch.color('#00FF00'),
      strokeBgHover:      this.sketch.color('#00FF00'),
      strokeBgActive:     this.sketch.color('#007F00')
    };

    this.toggle = {
      strokeWeight:       2,
      rounding:           10,
      font:               'Arial',
      textSize:           20,
      fillBgOff:          this.sketch.color('#000000'),
      fillBgOffHover:     this.sketch.color('#003000'),
      fillBgOffActive:    this.sketch.color('#00F200'),
      fillBgOn:           this.sketch.color('#00D800'),
      fillBgOnHover:      this.sketch.color('#00F200'),
      fillBgOnActive:     this.sketch.color('#00FF00'),
      fillLabelOff:       this.sketch.color('#00FF00'),
      fillLabelOffHover:  this.sketch.color('#00FF00'),
      fillLabelOffActive: this.sketch.color('#000000'),
      fillLabelOn:        this.sketch.color('#000000'),
      fillLabelOnHover:   this.sketch.color('#000000'),
      fillLabelOnActive:  this.sketch.color('#000000'),
      strokeBgOff:        this.sketch.color('#00FF00'),
      strokeBgOffHover:   this.sketch.color('#00FF00'),
      strokeBgOffActive:  this.sketch.color('#007F00'),
      strokeBgOn:         this.sketch.color('#007F00'),
      strokeBgOnHover:    this.sketch.color('#007F00'),
      strokeBgOnActive:   this.sketch.color('#007F00')
    }

    this.checkbox = {
      strokeWeight:       2,
      rounding:           10,
      fillBg:             this.sketch.color('#000000'),
      fillBgHover:        this.sketch.color('#003000'),
      fillBgActive:       this.sketch.color('#007F00'),
      fillCheck:          this.sketch.color('#00D800'),
      fillCheckHover:     this.sketch.color('#00F200'),
      fillCheckActive:    this.sketch.color('#00FF00'),
      strokeBg:           this.sketch.color('#00FF00')
    }

    this.slider = {
      strokeWeight:       2,
      rounding:           10,
      trackWidth:         1,
      fillBg:             this.sketch.color('#000000'),
      fillBgHover:        this.sketch.color('#003000'),
      fillBgActive:       this.sketch.color('#005000'),
      fillTrack:          this.sketch.color('#007F00'),
      fillTrackHover:     this.sketch.color('#008F00'),
      fillTrackActive:    this.sketch.color('#00AC00'),
      fillHandle:         this.sketch.color('#000000'),
      fillHandleHover:    this.sketch.color('#006000'),
      fillHandleActive:   this.sketch.color('#00FF00'),
      strokeBg:           this.sketch.color('#00FF00'),
      strokeBgHover:      this.sketch.color('#00FF00'),
      strokeBgActive:     this.sketch.color('#00FF00'),
      strokeTrack:        this.sketch.color('#007F00'),
      strokeTrackHover:   this.sketch.color('#008F00'),
      strokeTrackActive:  this.sketch.color('#00AC00'),
      strokeHandle:       this.sketch.color('#00FF00'),
      strokeHandleHover:  this.sketch.color('#00FF00'),
      strokeHandleActive: this.sketch.color('#00FF00')
    }

    this.crossfader = {
      strokeCenter:       this.sketch.color('#007F00'),
      strokeCenterHover:  this.sketch.color('#007F00'),
      strokeCenterActive: this.sketch.color('#007F00')
    }

    this.slider2d = {
      handleRadius:       16
    }

    this.joystick = {
      handleRadius:       16
    }
  }

  //
  TerminalRed() {
    this.name             = "TerminalRed";

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
      fillBg:             this.sketch.color('#000000'),
      fillBgHover:        this.sketch.color('#300000'),
      fillBgActive:       this.sketch.color('#F20000'),
      fillLabel:          this.sketch.color('#FF0000'),
      fillLabelHover:     this.sketch.color('#FF0000'),
      fillLabelActive:    this.sketch.color('#000000'),
      strokeBg:           this.sketch.color('#FF0000'),
      strokeBgHover:      this.sketch.color('#FF0000'),
      strokeBgActive:     this.sketch.color('#7F0000')
    };

    this.toggle = {
      strokeWeight:       2,
      rounding:           10,
      font:               'Arial',
      textSize:           20,
      fillBgOff:          this.sketch.color('#000000'),
      fillBgOffHover:     this.sketch.color('#300000'),
      fillBgOffActive:    this.sketch.color('#F20000'),
      fillBgOn:           this.sketch.color('#D80000'),
      fillBgOnHover:      this.sketch.color('#F20000'),
      fillBgOnActive:     this.sketch.color('#FF0000'),
      fillLabelOff:       this.sketch.color('#FF0000'),
      fillLabelOffHover:  this.sketch.color('#FF0000'),
      fillLabelOffActive: this.sketch.color('#000000'),
      fillLabelOn:        this.sketch.color('#000000'),
      fillLabelOnHover:   this.sketch.color('#000000'),
      fillLabelOnActive:  this.sketch.color('#000000'),
      strokeBgOff:        this.sketch.color('#FF0000'),
      strokeBgOffHover:   this.sketch.color('#FF0000'),
      strokeBgOffActive:  this.sketch.color('#7F0000'),
      strokeBgOn:         this.sketch.color('#7F0000'),
      strokeBgOnHover:    this.sketch.color('#7F0000'),
      strokeBgOnActive:   this.sketch.color('#7F0000')
    }

    this.checkbox = {
      strokeWeight:       2,
      rounding:           10,
      fillBg:             this.sketch.color('#000000'),
      fillBgHover:        this.sketch.color('#300000'),
      fillBgActive:       this.sketch.color('#7F0000'),
      fillCheck:          this.sketch.color('#D80000'),
      fillCheckHover:     this.sketch.color('#F20000'),
      fillCheckActive:    this.sketch.color('#FF0000'),
      strokeBg:           this.sketch.color('#FF0000')
    }

    this.slider = {
      strokeWeight:       2,
      rounding:           10,
      trackWidth:         1,
      fillBg:             this.sketch.color('#000000'),
      fillBgHover:        this.sketch.color('#300000'),
      fillBgActive:       this.sketch.color('#500000'),
      fillTrack:          this.sketch.color('#7F0000'),
      fillTrackHover:     this.sketch.color('#8F0000'),
      fillTrackActive:    this.sketch.color('#AC0000'),
      fillHandle:         this.sketch.color('#000000'),
      fillHandleHover:    this.sketch.color('#600000'),
      fillHandleActive:   this.sketch.color('#FF0000'),
      strokeBg:           this.sketch.color('#FF0000'),
      strokeBgHover:      this.sketch.color('#FF0000'),
      strokeBgActive:     this.sketch.color('#FF0000'),
      strokeTrack:        this.sketch.color('#7F0000'),
      strokeTrackHover:   this.sketch.color('#8F0000'),
      strokeTrackActive:  this.sketch.color('#AC0000'),
      strokeHandle:       this.sketch.color('#FF0000'),
      strokeHandleHover:  this.sketch.color('#FF0000'),
      strokeHandleActive: this.sketch.color('#FF0000')
    }

    this.crossfader = {
      strokeCenter:       this.sketch.color('#7F0000'),
      strokeCenterHover:  this.sketch.color('#7F0000'),
      strokeCenterActive: this.sketch.color('#7F0000')
    }

    this.slider2d = {
      handleRadius:       16
    }

    this.joystick = {
      handleRadius:       16
    }
  }

  //
  TerminalBlue() {
    this.name             = "TerminalBlue";

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
      fillBg:             this.sketch.color('#000000'),
      fillBgHover:        this.sketch.color('#000030'),
      fillBgActive:       this.sketch.color('#4040F2'),
      fillLabel:          this.sketch.color('#4040FF'),
      fillLabelHover:     this.sketch.color('#4040FF'),
      fillLabelActive:    this.sketch.color('#000000'),
      strokeBg:           this.sketch.color('#4040FF'),
      strokeBgHover:      this.sketch.color('#4040FF'),
      strokeBgActive:     this.sketch.color('#40407F')
    };

    this.toggle = {
      strokeWeight:       2,
      rounding:           10,
      font:               'Arial',
      textSize:           20,
      fillBgOff:          this.sketch.color('#000000'),
      fillBgOffHover:     this.sketch.color('#000030'),
      fillBgOffActive:    this.sketch.color('#4040F2'),
      fillBgOn:           this.sketch.color('#4040D8'),
      fillBgOnHover:      this.sketch.color('#4040F2'),
      fillBgOnActive:     this.sketch.color('#4040FF'),
      fillLabelOff:       this.sketch.color('#4040FF'),
      fillLabelOffHover:  this.sketch.color('#4040FF'),
      fillLabelOffActive: this.sketch.color('#000000'),
      fillLabelOn:        this.sketch.color('#000000'),
      fillLabelOnHover:   this.sketch.color('#000000'),
      fillLabelOnActive:  this.sketch.color('#000000'),
      strokeBgOff:        this.sketch.color('#4040FF'),
      strokeBgOffHover:   this.sketch.color('#4040FF'),
      strokeBgOffActive:  this.sketch.color('#40407F'),
      strokeBgOn:         this.sketch.color('#40407F'),
      strokeBgOnHover:    this.sketch.color('#40407F'),
      strokeBgOnActive:   this.sketch.color('#40407F')
    }

    this.checkbox = {
      strokeWeight:       2,
      rounding:           10,
      fillBg:             this.sketch.color('#000000'),
      fillBgHover:        this.sketch.color('#000030'),
      fillBgActive:       this.sketch.color('#40407F'),
      fillCheck:          this.sketch.color('#4040D8'),
      fillCheckHover:     this.sketch.color('#4040F2'),
      fillCheckActive:    this.sketch.color('#4040FF'),
      strokeBg:           this.sketch.color('#4040FF')
    }

    this.slider = {
      strokeWeight:       2,
      rounding:           10,
      trackWidth:         1,
      fillBg:             this.sketch.color('#000000'),
      fillBgHover:        this.sketch.color('#000030'),
      fillBgActive:       this.sketch.color('#000050'),
      fillTrack:          this.sketch.color('#20207F'),
      fillTrackHover:     this.sketch.color('#20208F'),
      fillTrackActive:    this.sketch.color('#2020AC'),
      fillHandle:         this.sketch.color('#000000'),
      fillHandleHover:    this.sketch.color('#000060'),
      fillHandleActive:   this.sketch.color('#4040FF'),
      strokeBg:           this.sketch.color('#4040FF'),
      strokeBgHover:      this.sketch.color('#4040FF'),
      strokeBgActive:     this.sketch.color('#4040FF'),
      strokeTrack:        this.sketch.color('#20207F'),
      strokeTrackHover:   this.sketch.color('#20208F'),
      strokeTrackActive:  this.sketch.color('#2020AC'),
      strokeHandle:       this.sketch.color('#4040FF'),
      strokeHandleHover:  this.sketch.color('#4040FF'),
      strokeHandleActive: this.sketch.color('#4040FF')
    }

    this.crossfader = {
      strokeCenter:       this.sketch.color('#40407F'),
      strokeCenterHover:  this.sketch.color('#40407F'),
      strokeCenterActive: this.sketch.color('#40407F')
    }

    this.slider2d = {
      handleRadius:       16
    }

    this.joystick = {
      handleRadius:       16
    }
  }

  //
  TerminalYellow() {
    this.name             = "TerminalYellow";

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
      fillBg:             this.sketch.color('#000000'),
      fillBgHover:        this.sketch.color('#303000'),
      fillBgActive:       this.sketch.color('#F2F200'),
      fillLabel:          this.sketch.color('#FFFF00'),
      fillLabelHover:     this.sketch.color('#FFFF00'),
      fillLabelActive:    this.sketch.color('#000000'),
      strokeBg:           this.sketch.color('#FFFF00'),
      strokeBgHover:      this.sketch.color('#FFFF00'),
      strokeBgActive:     this.sketch.color('#7F7F00')
    };

    this.toggle = {
      strokeWeight:       2,
      rounding:           10,
      font:               'Arial',
      textSize:           20,
      fillBgOff:          this.sketch.color('#000000'),
      fillBgOffHover:     this.sketch.color('#303000'),
      fillBgOffActive:    this.sketch.color('#F2F200'),
      fillBgOn:           this.sketch.color('#D8D800'),
      fillBgOnHover:      this.sketch.color('#F2F200'),
      fillBgOnActive:     this.sketch.color('#FFFF00'),
      fillLabelOff:       this.sketch.color('#FFFF00'),
      fillLabelOffHover:  this.sketch.color('#FFFF00'),
      fillLabelOffActive: this.sketch.color('#000000'),
      fillLabelOn:        this.sketch.color('#000000'),
      fillLabelOnHover:   this.sketch.color('#000000'),
      fillLabelOnActive:  this.sketch.color('#000000'),
      strokeBgOff:        this.sketch.color('#FFFF00'),
      strokeBgOffHover:   this.sketch.color('#FFFF00'),
      strokeBgOffActive:  this.sketch.color('#7F7F00'),
      strokeBgOn:         this.sketch.color('#7F7F00'),
      strokeBgOnHover:    this.sketch.color('#7F7F00'),
      strokeBgOnActive:   this.sketch.color('#7F7F00')
    }

    this.checkbox = {
      strokeWeight:       2,
      rounding:           10,
      fillBg:             this.sketch.color('#000000'),
      fillBgHover:        this.sketch.color('#303000'),
      fillBgActive:       this.sketch.color('#7F7F00'),
      fillCheck:          this.sketch.color('#D8D800'),
      fillCheckHover:     this.sketch.color('#F2F200'),
      fillCheckActive:    this.sketch.color('#FFFF00'),
      strokeBg:           this.sketch.color('#FFFF00')
    }

    this.slider = {
      strokeWeight:       2,
      rounding:           10,
      trackWidth:         1,
      fillBg:             this.sketch.color('#000000'),
      fillBgHover:        this.sketch.color('#303000'),
      fillBgActive:       this.sketch.color('#505000'),
      fillTrack:          this.sketch.color('#7F7F00'),
      fillTrackHover:     this.sketch.color('#8F8F00'),
      fillTrackActive:    this.sketch.color('#ACAC00'),
      fillHandle:         this.sketch.color('#000000'),
      fillHandleHover:    this.sketch.color('#606000'),
      fillHandleActive:   this.sketch.color('#FFFF00'),
      strokeBg:           this.sketch.color('#FFFF00'),
      strokeBgHover:      this.sketch.color('#FFFF00'),
      strokeBgActive:     this.sketch.color('#FFFF00'),
      strokeTrack:        this.sketch.color('#7F7F00'),
      strokeTrackHover:   this.sketch.color('#8F8F00'),
      strokeTrackActive:  this.sketch.color('#ACAC00'),
      strokeHandle:       this.sketch.color('#FFFF00'),
      strokeHandleHover:  this.sketch.color('#FFFF00'),
      strokeHandleActive: this.sketch.color('#FFFF00')
    }

    this.crossfader = {
      strokeCenter:       this.sketch.color('#7F7F00'),
      strokeCenterHover:  this.sketch.color('#7F7F00'),
      strokeCenterActive: this.sketch.color('#7F7F00')
    }

    this.slider2d = {
      handleRadius:       16
    }

    this.joystick = {
      handleRadius:       16
    }
  }

  //
  TerminalMagenta() {
    this.name             = "TerminalMagenta";

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
      fillBg:             this.sketch.color('#000000'),
      fillBgHover:        this.sketch.color('#300030'),
      fillBgActive:       this.sketch.color('#F200F2'),
      fillLabel:          this.sketch.color('#FF00FF'),
      fillLabelHover:     this.sketch.color('#FF00FF'),
      fillLabelActive:    this.sketch.color('#000000'),
      strokeBg:           this.sketch.color('#FF00FF'),
      strokeBgHover:      this.sketch.color('#FF00FF'),
      strokeBgActive:     this.sketch.color('#7F007F')
    };

    this.toggle = {
      strokeWeight:       2,
      rounding:           10,
      font:               'Arial',
      textSize:           20,
      fillBgOff:          this.sketch.color('#000000'),
      fillBgOffHover:     this.sketch.color('#300030'),
      fillBgOffActive:    this.sketch.color('#F200F2'),
      fillBgOn:           this.sketch.color('#D800D8'),
      fillBgOnHover:      this.sketch.color('#F200F2'),
      fillBgOnActive:     this.sketch.color('#FF00FF'),
      fillLabelOff:       this.sketch.color('#FF00FF'),
      fillLabelOffHover:  this.sketch.color('#FF00FF'),
      fillLabelOffActive: this.sketch.color('#000000'),
      fillLabelOn:        this.sketch.color('#000000'),
      fillLabelOnHover:   this.sketch.color('#000000'),
      fillLabelOnActive:  this.sketch.color('#000000'),
      strokeBgOff:        this.sketch.color('#FF00FF'),
      strokeBgOffHover:   this.sketch.color('#FF00FF'),
      strokeBgOffActive:  this.sketch.color('#7F007F'),
      strokeBgOn:         this.sketch.color('#7F007F'),
      strokeBgOnHover:    this.sketch.color('#7F007F'),
      strokeBgOnActive:   this.sketch.color('#7F007F')
    }

    this.checkbox = {
      strokeWeight:       2,
      rounding:           10,
      fillBg:             this.sketch.color('#000000'),
      fillBgHover:        this.sketch.color('#300030'),
      fillBgActive:       this.sketch.color('#7F007F'),
      fillCheck:          this.sketch.color('#D800D8'),
      fillCheckHover:     this.sketch.color('#F200F2'),
      fillCheckActive:    this.sketch.color('#FF00FF'),
      strokeBg:           this.sketch.color('#FF00FF')
    }

    this.slider = {
      strokeWeight:       2,
      rounding:           10,
      trackWidth:         1,
      fillBg:             this.sketch.color('#000000'),
      fillBgHover:        this.sketch.color('#300030'),
      fillBgActive:       this.sketch.color('#500050'),
      fillTrack:          this.sketch.color('#7F007F'),
      fillTrackHover:     this.sketch.color('#8F008F'),
      fillTrackActive:    this.sketch.color('#AC00AC'),
      fillHandle:         this.sketch.color('#000000'),
      fillHandleHover:    this.sketch.color('#600060'),
      fillHandleActive:   this.sketch.color('#FF00FF'),
      strokeBg:           this.sketch.color('#FF00FF'),
      strokeBgHover:      this.sketch.color('#FF00FF'),
      strokeBgActive:     this.sketch.color('#FF00FF'),
      strokeTrack:        this.sketch.color('#7F007F'),
      strokeTrackHover:   this.sketch.color('#8F008F'),
      strokeTrackActive:  this.sketch.color('#AC00AC'),
      strokeHandle:       this.sketch.color('#FF00FF'),
      strokeHandleHover:  this.sketch.color('#FF00FF'),
      strokeHandleActive: this.sketch.color('#FF00FF')
    }

    this.crossfader = {
      strokeCenter:       this.sketch.color('#7F007F'),
      strokeCenterHover:  this.sketch.color('#7F007F'),
      strokeCenterActive: this.sketch.color('#7F007F')
    }

    this.slider2d = {
      handleRadius:       16
    }

    this.joystick = {
      handleRadius:       16
    }
  }
}
