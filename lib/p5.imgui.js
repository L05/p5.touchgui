/**
 * Prototype functions to make library 
 * method calls more like p5.js.
 */

// Create GUI context
let imgui;

p5.prototype.createGui = function() {
  imgui = new ImGui();
}

// Start GUI
p5.prototype.startGui = function() {
  imgui.start();
}

// End GUI
p5.prototype.endGui = function() {
  imgui.end();
}

// Prototype functions for GUI elements
p5.prototype.button = function(label, x, y, w=128, h=32) {
  return imgui.button(label, x, y, w, h);
}

p5.prototype.checkbox = function(label, value, x, y, w=32, h=32) {
  return imgui.checkbox(label, value, x, y, w, h);
}

p5.prototype.slider = function(label, value, x, y, w=256, h=32, min=0, max=1) {
  return imgui.slider(label, value, x, y, w, h, min, max);
}

p5.prototype.sliderV = function(label, value, x, y, w=32, h=256, min=0, max=1) {
  return imgui.sliderV(label, value, x, y, w, h, min, max);
}


/**
 * Generates hash code from a string.
 * @see http://stackoverflow.com/q/7616461/940217
 * @return {number}
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
 * IMGUI
 * 
 * 
 */
class ImGui {
  constructor() {
    this.hotItem = 0;
    this.activeItem = 0;
    
    this.style = new ImGuiStyle();
//    this.style.StyleColorsClassic();
  }
  
  // Check whether current mouse position
  // is within a rectangle
  regionHit(x, y, w, h) {
    if (mouseX < x || 
        mouseY < y || 
        mouseX >= x + w || 
        mouseY >= y + h) {
      return false;
    }
    return true;
  }
  
  setHit(id) {
    this.hotItem = id;
    if (this.activeItem == 0 && mouseIsPressed) {
      this.activeItem = id;
    }
  }
  
  /// Simple checkbox IMGUI widget
  checkbox(label, value, x, y, w=32, h=32) {
    // Create hashed id from label
    let id = label.hashCode();
//    let id = new Error().stack;
    
    // Check whether the button should be 'hot' or 'active'
    if (this.regionHit(x, y, w, h)) {
      this.hotItem = id;
      if (this.activeItem == 0 && mouseIsPressed) {
        this.activeItem = id;
        value.val = !value.val;
      }
    }
    
    // Render button
    let x8  = x+w/6;
    let y8  = y+h/6;
    let w16 = w-w/3;
    let h16 = h-h/3;
    let xw  = x8+w16;
    let yh  = y8+h16;
    let strokeMult = map(((w > h) ? w : h), 32, 1000, 2, 20);
    
    push();
    rectMode(CORNER);
    stroke(this.style.col_checkOuterStroke);
    strokeWeight(this.style.checkStrokeWt);
    fill(this.style.col_checkOuterFill);
    rect(x, y, w, h, this.style.rounding);
    
    
    if (this.hotItem == id && !value.val) {
      // Button is 'hot' and 'false'
      fill(this.style.col_checkOuterFillHover);
      rect(x, y, w, h, this.style.rounding);
    }
    else if (this.hotItem == id && value.val) {
      // Button is 'hot' and 'true'
      push();
      stroke(this.style.col_checkInnerStrokeHover);
      strokeWeight(this.style.checkStrokeWt*strokeMult);
      line(x8, y8, xw, yh);
      line(xw, y8, x8, yh);
      pop();
      
      if (this.activeItem == id) {
        // Button is also 'active'
        fill(this.style.col_checkOuterFillActive);
        rect(x, y, w, h, this.style.rounding);
        
        push();
        stroke(this.style.col_checkInnerStrokeActive);
        strokeWeight(this.style.checkStrokeWt*strokeMult);
        line(x8, y8, xw, yh);
        line(xw, y8, x8, yh);
        pop();
      }   
    }
    else if (value.val) {
      // Button is 'true' but not 'hot'
      push();
      stroke(this.style.col_checkInnerStroke);
      strokeWeight(this.style.checkStrokeWt*strokeMult);
      line(x8, y8, xw, yh);
      line(xw, y8, x8, yh);
      pop();
    }
    
    pop();
    
    // If button is 'hot' and 'active', but mouse button
    // is not down, the user must have clicked the button.
    if (mouseIsPressed && 
        this.hotItem == id && 
        this.activeItem == id) {
      return true;
    }
    
    // Otherwise, no clicky.
    return false;
  }
  
  /// Simple button IMGUI widget
  button(label, x, y, w=128, h=32) {
    // Create hashed id from stack
    let id = label.hashCode();
    
    // Check for 'hot' or 'active'
    if (this.regionHit(x, y, w, h)) {
      this.setHit(id);
    }
    
    // Render button
    push();
    stroke(this.style.col_buttonStroke);
    strokeWeight(this.style.buttonStrokeWt);
    rectMode(CORNER);
    
    if (this.hotItem == id) {
      if (this.activeItem == id) {
        // Button is both 'hot' and 'active'
        fill(this.style.col_buttonFillActive);
        rect(x, y, w, h, this.style.rounding);
      }
      else {
        // Button is merely 'hot'
        fill(this.style.col_buttonFillHover);
        rect(x, y, w, h, this.style.rounding);
      }
    }
    else {
      // Button is not hot, but it may be active
      fill(this.style.col_buttonFill);
      rect(x, y, w, h, this.style.rounding);      
    }
    
    // Label rendering.
    push();
      fill(this.style.col_buttonLabel);
      noStroke();
      textAlign(CENTER, CENTER);
      textFont(this.style.labelFont);
      let size = w/10;
      if (size > this.style.labelFontMaxSize) {
        size = this.style.labelFontMaxSize;
      }
      textSize(size);
      text(label, x + w/2, y + h/2);
    pop();
    
    pop();
    
    // If button is 'hot' and 'active', but mouse button
    // is not down, the user must have clicked the button.
    if (mouseIsPressed && 
        this.hotItem == id && 
        this.activeItem == id) {
      return true;
    }
    
    // Otherwise, no clicky.
    return false;
  }
  
  /// Simple slider IMGUI widget
  slider(label, value, x, y, w=256, h=32, min=0, max=1) {
    // Create hashed id from label
    let id = label.hashCode();
    
    // Calculate mouse cursor's relative x offset
    let xpos = map(value.val, min, max, 0, w-32);
    
    // Check for 'hot' or 'active'
    if (this.regionHit(x, y, w, h)) {
      this.setHit(id);
    }
    
    // Render the slider
    if (this.activeItem == id) { 
      this.drawSlider(xpos, x, y, w, h, 
                      this.style.col_sliderBgFillActive,
                      this.style.col_sliderIndctrFillActive,
                      this.style.col_sliderGrabFillActive,
                      this.style.col_sliderGrabStroke);
    }
    else if (this.hotItem == id) { 
      this.drawSlider(xpos, x, y, w, h, 
                      this.style.col_sliderBgFillHover,
                      this.style.col_sliderIndctrFillHover,
                      this.style.col_sliderGrabFillHover,
                      this.style.col_sliderGrabStroke);
    }
    else {
      this.drawSlider(xpos, x, y, w, h, 
                      this.style.col_sliderBgFill,
                      this.style.col_sliderIndctrFill,
                      this.style.col_sliderGrabFill,
                      this.style.col_sliderGrabStroke);
    }
    
    // Update widget value
    if (this.activeItem == id) {
      
      let mousePos = mouseX - x;
      let v = map(mousePos, 0, w, min, max, true);
      
      if (v != value.val) {
        value.val = v;
        return true;
      }
    }
    return false;
  }
  
  /// Simple vertical slider IMGUI widget
  sliderV(label, value, x, y, w=32, h=256, min=0, max=1) {
    // Create hashed id from label
    let id = label.hashCode();
    
    // Calculate mouse cursor's relative y offset
    let ypos = map(value.val, min, max, 0, h-32);
    
    // Check for 'hot' or 'active'
    if (this.regionHit(x, y, w, h)) {
      this.setHit(id);
    }
    
    // Render the slider
    if (this.activeItem == id) { 
      this.drawSliderV(ypos, x, y, w, h, 
                       this.style.col_sliderBgFillActive,
                       this.style.col_sliderIndctrFillActive,
                       this.style.col_sliderGrabFillActive,
                       this.style.col_sliderGrabStroke);
    }
    else if (this.hotItem == id) { 
      this.drawSliderV(ypos, x, y, w, h, 
                       this.style.col_sliderBgFillHover,
                       this.style.col_sliderIndctrFillHover,
                       this.style.col_sliderGrabFillHover,
                       this.style.col_sliderGrabStroke);
    }
    else {
      this.drawSliderV(ypos, x, y, w, h, 
                       this.style.col_sliderBgFill,
                       this.style.col_sliderIndctrFill,
                       this.style.col_sliderGrabFill,
                       this.style.col_sliderGrabStroke);
    }
    
    // Update widget value
    if (this.activeItem == id) {
      
      let mousePos = mouseY - y;
      let v = map(mousePos, 0, h, min, max, true);
      
      if (v != value.val) {
        value.val = v;
        return true;
      }
    }
    return false;
  }
  
  /// Draw function for slider
  drawSlider(xpos, x, y, w, h, bgFill, indctrFill, grabFill, grabStroke) {
    push();
      stroke(this.style.col_sliderStroke);
      strokeWeight(this.style.sliderStrokeWt);
      rectMode(CORNER);

      // Render bg
      fill(bgFill);
      rect(x, y, w, h, this.style.rounding);

      // Render indicator
      push();
        noStroke();
        fill(indctrFill);
  //      rect(x+0.2*h, y+0.2*h, xpos+0.*h, h-0.4*h, 
  //           this.style.rounding, 0, 0, this.style.rounding);
        rect(x+10, y+10, xpos+12, h-20, 
             this.style.rounding, 0, 0, this.style.rounding);
      pop();

      // Render grab
      push();
        stroke(grabStroke);
        fill(grabFill);
        rect(x+8+xpos, y+8, 16, h-16, this.style.rounding);
      pop();
    pop();
  }
  
  /// Draw function for vertical slider
  drawSliderV(ypos, x, y, w, h, bgFill, indctrFill, grabFill, grabStroke) {
    push();
      stroke(this.style.col_sliderStroke);
      strokeWeight(this.style.sliderStrokeWt);
      rectMode(CORNER);

      // Render bg
      fill(bgFill);
      rect(x, y, w, h, this.style.rounding);

      // Render indicator
      push();
        noStroke();
        fill(indctrFill);
  //      rect(x+0.2*w, y+ypos+0.1*w, w-0.4*w, h-ypos-0.3*w, 
  //           0, 0, this.style.rounding, this.style.rounding);
        rect(x+10, y+ypos+12, w-20, h-ypos-20, 
             0, 0, this.style.rounding, this.style.rounding);
      pop();

      // Render grab
      push();
        stroke(grabStroke);
        fill(grabFill);
        rect(x+8, y+8+ypos, w-16, 16, this.style.rounding);
      pop();
    pop();
  }  
  
  /// Prepare for start IMGUI code
  start() {
    this.hotItem = 0;
  }
  
  /// Finish at end IMGUI code
  end() {
    if (!mouseIsPressed) {
      this.activeItem = 0;
    }
    else {
      if (this.activeItem == 0) {
        this.activeItem = -1;
      }
    }
  }
}


/*******************
 * IMGUI STYLE
 * 
 * 
 */

class ImGuiStyle {
  constructor() {
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
  
  StyleColorsGrayscale() {
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
    this.col_sliderGrabStrokeHover      = color(96);
    this.col_sliderGrabStrokeActive     = color(0); 
  }
  
  StyleColorsClassic() {
    this.rounding                       = 10;
    this.labelFont                      = 'Arial';
    this.labelFontMaxSize               = 30;
    this.strokeWt                       = 5;

    // Button pars
    this.buttonStrokeWt                 = this.strokeWt;
    this.col_buttonStroke               = color('#D5CAD6');
    this.col_buttonFill                 = color('#EFEFF0');
    this.col_buttonFillHover            = color('#F7F7F7');
    this.col_buttonFillActive           = color('#C9F0FF');
    this.col_buttonLabel                = color('#6B5E62');
    
    // Checkbox pars
    this.checkStrokeWt                  = this.strokeWt;
    this.col_checkOuterStroke           = color('#D5CAD6');
    this.col_checkOuterStrokeHover      = color('#D5CAD6');
    this.col_checkOuterStrokeActive     = color('#D5CAD6');
    this.col_checkOuterFill             = color('#EFEFF0');
    this.col_checkOuterFillHover        = color('#F7F7F7');
    this.col_checkOuterFillActive       = color('#C9F0FF');
    this.col_checkInnerFill             = color('#6B5E62');
    this.col_checkInnerStroke           = color('#6B5E62');
    this.col_checkInnerFillHover        = color('#7A6B70');
    this.col_checkInnerStrokeHover      = color('#7A6B70');
    this.col_checkInnerFillActive       = color('#7A6B70');
    this.col_checkInnerStrokeActive     = color('#7A6B70');
    
    // Slider pars
    this.sliderStrokeWt                 = this.strokeWt;
    this.col_sliderStroke               = color('#D5CAD6');
    this.col_sliderBgFill               = color('#EFEFF0');
    this.col_sliderBgFillHover          = color('#F7F7F7');
    this.col_sliderBgFillActive         = color('#F7F7F7');
    this.col_sliderBgStroke             = color(0);
    this.col_sliderBgStrokeHover        = color(0);
    this.col_sliderBgStrokeActive       = color(0);
    this.col_sliderIndctrFill           = color('#D5CAD6');
    this.col_sliderIndctrFillHover      = color('#D5CAD6');
    this.col_sliderIndctrFillActive     = color('#D5CAD6');
    this.col_sliderIndctrStroke         = color(128);
    this.col_sliderIndctrStrokeHover    = color(144);
    this.col_sliderIndctrStrokeActive   = color(144);
    this.col_sliderGrabFill             = color('#6B5E62');
    this.col_sliderGrabFillHover        = color('#7A6B70');
    this.col_sliderGrabFillActive       = color('#C9F0FF');
    this.col_sliderGrabStroke           = color('#6B5E62');
    this.col_sliderGrabStrokeHover      = color('#7A6B70');
    this.col_sliderGrabStrokeActive     = color('#7A6B70'); 
  }
}