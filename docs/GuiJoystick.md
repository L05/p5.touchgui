[Home](../README.md) | [Reference](REFERENCE.md)

# GuiJoystick
[Example](#example) | [Constructor](#constructor) | [Variables](#variables) | [Functions](#functions)

## Description
Joystick class. This is similar to `GuiSlider2d` except that the handle snaps back to the center point when input is released.

![Picture of a p5.touchgui GuiJoystick](../design/GuiJoystick.png)

-----

## [Example](https://editor.p5js.org/L05/sketches/l-66JjVKt)
```javascript
let gui;

// Create a variable for your slider
let j;

// Create variables for tracking position and velocity
let x, y, velX, velY;

function setup() {
  createCanvas(400, 400);
  gui = createGui();
  
  // Create Joystick.
  // The last four optional arguments define minimum and maximum values 
  // for the x and y axes; minX, maxX, minY, maxY
  // The default min and max values for all four are -1 and 1.
  j = createJoystick("Joystick", 10, 210, 175, 175, -1, 1, 1, -1);
  
  // Starting position and velocity
  x     = 300;
  y     = 100;
  velX  = 0;
  velY  = 0;
}

function draw() {
  background("#242038");
  drawGui();
  
  if (j.isChanged) {
    // Print a message when Slider 1 is changed
    // that displays its value.
    print(j.label + " = {" + j.valX + ", " + j.valY + "}");
  }
  
  // Use Joystick's output to change velocity
  velX += j.valX;
  velY += j.valY;  
  
  // Draw our ellipse
  fill("#7AA0FF");
  stroke("#FFFFFF")
  ellipse(x + velX, y + velY, 100);
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

### createJoystick()
[[Back to top]](#description)

##### Example
```javascript
let gui;
let j;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    j = createJoystick("Joystick", 50, 50);
}

```
##### Description
Creates a new `GuiJoystick` object. This is a 2 dimensional slider, and the handle snaps back to the center.

##### Syntax
```javascript
createJoystick(label, x, y, [w], [h], [minX], [maxX], [maxX], [maxY])
```

##### Parameters
* `label`  String: label for the GuiJoystick 
* `x`  Number: x-coordinate of the GuiJoystick 
* `y`  Number: y-coordinate of the GuiJoystick 
* `w`  Number: width of the GuiJoystick (default is 256) 
* `h`  Number: height of the GuiJoystick (default is 256) 
* `minX`  Number: lower bound of the value's x range (default value is -1) 
* `maxX`  Number: upper bound of the value's x range (default value is 1) 
* `minY`  Number: lower bound of the value's y range (default value is -1) 
* `maxY`  Number: upper bound of the value's y range (default value is 1) 

##### Returns
`GuiJoystick`

-----

## Variables
### val
[[Back to top]](#guijoystick)

##### Example
```javascript
joystick.val = {x: 0.5, y: 0.5};
```
```javascript
if (joystick.isChanged) {
    print(joystick.val.x);
    print(joystick.val.y);
}
```

##### Description
Value of the `GuiJoystick` returned as object `{x: valX, y: valY}`.

-----

### valX
[[Back to top]](#guijoystick)

##### Example
```javascript
joystick.valX = 0.5;
```
```javascript
if (joystick.isChanged) {
    print(joystick.valX);
}
```

##### Description
X value of the `GuiJoystick`.

-----

### valY
[[Back to top]](#guijoystick)

##### Example
```javascript
joystick.valY = 0.5;
```
```javascript
if (joystick.isChanged) {
    print(joystick.valY);
}
```

##### Description
Y value of the `GuiJoystick`.

-----

### minX
[[Back to top]](#guijoystick)

##### Example
```javascript
joystick.minX = -100;
```

##### Description
Lower x bound of the `GuiJoystick` range.

-----

### maxX
[[Back to top]](#guijoystick)

##### Example
```javascript
joystick.maxX = 100;
```

##### Description
Upper x bound of the `GuiJoystick` range.

-----

### minY
[[Back to top]](#guijoystick)

##### Example
```javascript
joystick.minY = -100;
```

##### Description
Lower y bound of the `GuiJoystick` range.

-----

### maxY
[[Back to top]](#guijoystick)

##### Example
```javascript
joystick.maxY = 100;
```

##### Description
Upper y bound of the `GuiJoystick` range.

-----

## Functions

-----
### setStyle()
[[Back to top]](#guijoystick)

##### Example
```javascript
joystick.setStyle("fillBg", color(255, 0, 0));
```
```javascript
joystick.setStyle({
    fillBg: color("#FF0000"),
    rounding: 10,
    handleRadius: 30
});
```

##### Description
Individual `GuiJoystick` objects can be styled using this method. There are two types of input it takes. Use an input string and value to set an individual property, and use an `Object` with key/value notation to set multiple properties at once.

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
[[Back to top]](#guijoystick)

The `GuiJoystick` style properties are:
* `strokeWeight` Number: the weight (in pixels) of the stroke
* `rounding` Number: radius of corners
* `handleRadius` Number: radius of handle in pixels
* `fillBg` p5.Color: default background fill color
* `fillBgHover` p5.Color: hover background fill color
* `fillBgActive` p5.Color: active background fill color
* `fillTrack` p5.Color: default track fill color
* `fillTrackHover` p5.Color: hover track fill color
* `fillTrackActive` p5.Color: active track fill color
* `fillHandle` p5.Color: default handle fill color
* `fillHandleHover` p5.Color: hover handle fill color
* `fillHandleActive` p5.Color: active handle fill color
* `strokeBg` p5.Color: default background stroke color
* `strokeBgHover` p5.Color: hover background stroke color
* `strokeBgActive` p5.Color: active background stroke color
* `strokeTrack` p5.Color: default track stroke color
* `strokeTrackHover` p5.Color: hover track stroke color
* `strokeTrackActive` p5.Color: active track stroke color
* `strokeHandle` p5.Color: default handle stroke color
* `strokeHandleHover` p5.Color: hover handle stroke color
* `strokeHandleActive` p5.Color: active handle stroke color