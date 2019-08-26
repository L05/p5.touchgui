[Home](../README.md) | [Reference](REFERENCE.md)

# GuiCrossfader / GuiCrossfaderV
[Example](#example) | [Constructor](#constructor) | [Variables](#variables) | [Functions](#functions)

## Description
Crossfader class. 

*Note: vertical crossfader class is virtually the same, just with a different orientation.*

![Picture of a p5.touchgui GuiCrossfader](../design/GuiCrossfader.png)

-----

## [Example](https://editor.p5js.org/L05/sketches/MAUFHrJpg)
```javascript
let gui;

// Create a variable for your Crossfader
let c;

function setup() {
  createCanvas(400, 400);
  gui = createGui();
  
  // Create Crossfader.
  // The last two optional arguments define the min and max (minimum and maximum) values.
  // The default min and max values are -1 and 1, respectively.
  c = createCrossfader("Crossfader", 50, 50, 300, 32, 25, 100);
}

function draw() {
  background(72, 61, 139);
  drawGui();
  
  if (c.isChanged) {
    // Print a message when Crossfader is changed
    // that displays its value.
    print(c.label + " = " + c.val);
  }
  
  // Use Crossfader's value to determine where the ellipse is drawn.
  fill(216, 191, 216);
  ellipse(100, 300, 125-c.val);
  ellipse(300, 300, c.val);
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

### createCrossfader()
[[Back to top]](#description)

##### Example
```javascript
let gui;
let cf;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    cf = createCrossfader("Crossfader", 50, 50);
}

```
##### Description
Creates a new `GuiCrossfader` object. This is a horizontal slider with a center point.

*Note: For a vertical crossfader, instead use `createCrossfaderV()`.*

##### Syntax
```javascript
createCrossfader(label, x, y, [w], [h], [min], [max])
```

##### Parameters
* `label`  String: label for the GuiCrossfader 
* `x`  Number: x-coordinate of the GuiCrossfader 
* `y`  Number: y-coordinate of the GuiCrossfader 
* `w`  Number: width of the GuiCrossfader (default is 128) 
* `h`  Number: height of the GuiCrossfader (default is 32) 
* `min`  Number: lower bound of the value's range (default value is -1) 
* `max`  Number: upper bound of the value's range (default value is 1) 

##### Returns
`GuiCrossfader`

-----

## Variables

-----

### val
[[Back to top]](#description)

##### Example
```javascript
crossfader.val = 0.5;
```
```javascript
if (crossfader.isChanged) {
    print(crossfader.val);
}
```

##### Description
Value of the `GuiCrossfader`.

-----

### min
[[Back to top]](#description)

##### Example
```javascript
crossfader.min = -100;
```

##### Description
Lower bound of the `GuiCrossfader` range.

-----

### max
[[Back to top]](#description)

##### Example
```javascript
crossfader.max = 100;
```

##### Description
Upper bound of the `GuiCrossfader` range.

-----

### isInteger
[[Back to top]](#description)

##### Example
```javascript
crossfader.isInteger = True;
```

##### Description
Sets the mode of the `GuiCrossfader` so that all values are integers.

-----

## Functions

-----

### [setStyle()]()
[[Back to top]](#description)

##### Example
```javascript
crossfader.setStyle("fillBg", color(255, 0, 0));
```
```javascript
crossfader.setStyle({
    fillBg: color("#FF0000"),
    rounding: 10,
    trackWidth: 0.1
});
```

##### Description
Individual `GuiCrossfader` objects can be styled using this method. There are two types of input it takes. Use an input string and value to set an individual property, and use an `Object` with key/value notation to set multiple properties at once.

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
[[Back to top]](#description)

The `GuiCrossfader` style properties are:
* `strokeWeight` Number: the weight (in pixels) of the stroke
* `rounding` Number: radius of corners
* `trackWidth` Number: width of all crossfader tracks between 0 (line) and 1 (full)
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
* `strokeCenter` p5.Color: default center line stroke color
* `strokeCenterHover` p5.Color: hover center line stroke color
* `strokeCenterActive` p5.Color: active center line stroke color