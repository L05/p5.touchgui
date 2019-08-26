[Home](../README.md) | [Reference](REFERENCE.md)

# GuiButton
[Example](#example) | [Constructor](#constructor) | [Variables](#variables) | [Functions](#functions)

## Description
Momentary button class.

![Picture of a p5.touchgui GuiButton](../design/GuiButton.png)

-----

## [Example](https://editor.p5js.org/L05/sketches/6ETiBjotm)
```javascript
let gui;

// Create variable for your Button
let b;

function setup() {
  createCanvas(400, 400);
  gui = createGui();
  
  // Create Button
  b = createButton("Button", 100, 50, 200, 50);
}

function draw() {
  background(220);
  drawGui();
  
  if (b.isPressed) {
    // Print a message when Button is pressed.
    print(b.label + " pressed.");
  }
  
  if (b.isHeld) {
    // Draw an ellipse when Button is held.
    fill(255, 0, 0);
    ellipse(200, 300, 100);
  }
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}
```

-----

## Constructor

-----

### createButton()
[[Back to top]](#description)

##### Example
```javascript
let gui;
let b;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    b = createButton("Button", 50, 50);
}

```
##### Description
Creates a new `GuiButton` object. This is a momentary button.

##### Syntax
```javascript
createButton(label, x, y, [w], [h])
```

##### Parameters
* `label`  String: label for the GuiButton 
* `x`  Number: x-coordinate of the GuiButton 
* `y`  Number: y-coordinate of the GuiButton 
* `w`  Number: width of the GuiButton (default is 128) 
* `h`  Number: height of the GuiButton (default is 32) 

##### Returns
`GuiButton`

-----

## Variables

-----

### val
[[Back to top]](#guibutton)

##### Example
```javascript
button.val = True;

print(button.val)
```

##### Description
Value of the `GuiButton`.

-----

### label
[[Back to top]](#guibutton)

```javascript
button.label = "Button";

print(button.label)
```

##### Description
Label of the `GuiButton`. Setting the `label` will automatically set `labelOn` and `labelOff` (see below).

-----

### labelOn
[[Back to top]](#guibutton)

```javascript
button.labelOn = "Button On";

print(button.labelOn)
```

##### Description
Label of the `GuiButton` when pressed or "on".

-----


### labelOff
[[Back to top]](#guibutton)

```javascript
button.labelOff = "Button Off";

print(button.labelOff)
```

##### Description
Label of the `GuiButton` when unpressed or "off".

-----

## Functions

-----

### setStyle()
[[Back to top]](#guibutton)

##### Example
```javascript
button.setStyle("fillBg", color(255, 0, 0));
```
```javascript
button.setStyle({
    fillBg: color("#FF0000"),
    rounding: 10,
    textSize: 40
});
```

##### Description
Individual `GuiButton` objects can be styled using this method. There are two types of input it takes. Use an input string and value to set an individual property, and use an `Object` with key/value notation to set multiple properties at once.

##### Syntax
```javascript
setStyle(property, value)
setStyle(Object)
```

##### Parameters
`property` String: name of property to be set
`value` Number|String|Object: value of property to be set
`Object` Object: multiple propertys and values to be set

##### Returns
`None`

-----

## Style
[[Back to top]](#guibutton)

The `GuiButton` style properties are:
* `strokeWeight` Number: the weight (in pixels) of the stroke
* `rounding` Number: radius of corners
* `font` Object|String: a font loaded via [loadFont()](https://p5js.org/reference/#/p5/loadFont), or a String representing a web safe font (a font that is generally available across all systems)
* `textSize` Number: the size of the letters in units of pixels
* `fillBg` p5.Color: default background color
* `fillBgHover` p5.Color: hover background color
* `fillBgActive` p5.Color: active background color
* `fillLabel` p5.Color: default label color 
* `fillLabelHover` p5.Color: hover label color 
* `fillLabelActive` p5.Color: active label color 
* `strokeBg` p5.Color: default stroke color
* `strokeBgHover` p5.Color: hover stroke color
* `strokeBgActive` p5.Color: active stroke color