[Home](../README.md) | [Reference](REFERENCE.md)

# GuiToggle
[Example](#example) | [Constructor](#constructor) | [Variables](#variables) | [Functions](#functions)

## Description
Toggle button class.

![Picture of a p5.touchgui GuiToggle](../design/GuiToggle.png)

-----

## [Example](https://editor.p5js.org/L05/sketches/WUVbr_uqV)
```javascript
let gui;

// Create a variable for your Checkbox
let cb1;

function setup() {
  createCanvas(400, 400);
  gui = createGui();
  
  // Create Checkbox
  cb1 = createCheckbox("Checkbox", 150, 50, 100, 100);
}

function draw() {
  background(220);
  drawGui();
  
  if (cb1.isPressed) {
    // Print a message when Checkbox is pressed
    // that displays its value.
    print(cb1.label + " is " + cb1.val);
  }
  
  if (cb1.val) {
    // Draw an ellipse when Checkbox is true.
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

### createToggle()
[[Back to top]](#description)

##### Example
```javascript
let gui;
let t;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    t = createToggle("Toggle", 50, 50);
}

```
##### Description
Creates a new `GuiToggle` object. This is a toggle button.

##### Syntax
```javascript
createToggle(label, x, y, [w], [h], [defaultVal])
```

##### Parameters
* `label`  String: label for the GuiToggle 
* `x`  Number: x-coordinate of the GuiToggle 
* `y`  Number: y-coordinate of the GuiToggle 
* `w`  Number: width of the GuiToggle (default is 128) 
* `h`  Number: height of the GuiToggle (default is 32) 
* `defaultVal`  Number: default value for your GuiToggle (default is `false`) 

##### Returns
`GuiToggle`

-----

## Variables

-----

### val
[[Back to top]](#guitoggle)

##### Example
```javascript
toggle.val = True;

print(toggle.val)
```

##### Description
Value of the `GuiToggle`.

-----

### label
[[Back to top]](#guitoggle)

```javascript
toggle.label = "Toggle";

print(toggle.label)
```

##### Description
Label of the `GuiToggle`. Setting the `label` will automatically set `labelOn` and `labelOff` (see below).

-----

### labelOn
[[Back to top]](#guitoggle)

```javascript
toggle.labelOn = "Toggle On";

print(toggle.labelOn)
```

##### Description
Label of the `GuiToggle` when pressed or "on".

-----


### labelOff
[[Back to top]](#guitoggle)

```javascript
toggle.labelOff = "Toggle Off";

print(toggle.labelOff)
```

##### Description
Label of the `GuiToggle` when unpressed or "off".

-----

## Functions

-----
### setStyle()
[[Back to top]](#guitoggle)

##### Example
```javascript
toggle.setStyle("fillBgOn", color(255, 0, 0));
```
```javascript
toggle.setStyle({
    fillBgOn: color("#FF0000"),
    rounding: 10,
    textSize: 40
});
```

##### Description
Individual `GuiToggle` objects can be styled using this method. There are two types of input it takes. Use an input string and value to set an individual property, and use an `Object` with key/value notation to set multiple properties at once.

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
[[Back to top]](#guitoggle)

The `GuiToggle` style properties are:
* `strokeWeight` Number: the weight (in pixels) of the stroke
* `rounding` Number: radius of corners
* `font` Object|String: a font loaded via [loadFont()](https://p5js.org/reference/#/p5/loadFont), or a String representing a web safe font (a font that is generally available across all systems)
* `textSize` Number: the size of the letters in units of pixels
* `fillBgOff` p5.Color: default background color when off
* `fillBgOffHover` p5.Color: hover background color when off
* `fillBgOffActive` p5.Color: active background color when off
* `fillBgOn` p5.Color: default background color when on
* `fillBgOnHover` p5.Color: hover background color when on
* `fillBgOnActive` p5.Color: active background color when on
* `fillLabelOff` p5.Color: default label color when off
* `fillLabelOffHover` p5.Color: hover label color when off
* `fillLabelOffActive` p5.Color: active label color when off
* `fillLabelOn` p5.Color: default label color when on
* `fillLabelOnHover` p5.Color: hover label color when on
* `fillLabelOnActive` p5.Color: active label color when on
* `strokeBgOff` p5.Color: default stroke color when off
* `strokeBgOffHover` p5.Color: hover stroke color when off
* `strokeBgOffActive` p5.Color: active stroke color when off
* `strokeBgOn` p5.Color: default stroke color when on
* `strokeBgOnHover` p5.Color: hover stroke color when on
* `strokeBgOnActive` p5.Color: active stroke color when on