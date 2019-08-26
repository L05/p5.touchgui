[Home](../README.md) | [Reference](REFERENCE.md)

# GuiSlider2d
[Example](#example) | [Constructor](#constructor) | [Variables](#variables) | [Functions](#functions)

## Description
Two-dimensional slider (trackpad) class.

![Picture of a p5.touchgui GuiSlider2d](../design/GuiSlider2d.png)

-----

## [Example](https://editor.p5js.org/L05/sketches/xkA_bxh4_)
```javascript
let gui;

// Create a variable for your Slider2d
let s;

function setup() {
  createCanvas(400, 400);
  gui = createGui();
  
  // Create Slider2d.
  // The last four optional arguments define minimum and maximum values 
  // for the x and y axes; minX, maxX, minY, maxY
  // The default min and max values for all four are -1 and 1.
  s = createSlider2d("Slider2d", 10, 210, 175, 175, 250, 350, 150, 50);
}

function draw() {
  background(255, 235, 205);
  drawGui();
  
  if (s.isChanged) {
    // Print a message when Slider2d is changed
    // that displays its value.
    print(s.label + " = {" + s.valX + ", " + s.valY + "}");
  }
  
  // Draw our ellipse using the Slider2d output values
  fill( 95, 158, 160);
  ellipse(s.valX, s.valY, 100);
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

### createSlider2d()
[[Back to top]](#description)

##### Example
```javascript
let gui;
let s2d;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    s2d = createSlider2d("Slider2d", 50, 50);
}

```
##### Description
Creates a new `GuiSlider2d` object. This is a 2 dimensional slider.

##### Syntax
```javascript
createSlider2d(label, x, y, [w], [h], [minX], [maxX], [maxX], [maxY])
```

##### Parameters
* `label`  String: label for the GuiSlider2d 
* `x`  Number: x-coordinate of the GuiSlider2d 
* `y`  Number: y-coordinate of the GuiSlider2d 
* `w`  Number: width of the GuiSlider2d (default is 256) 
* `h`  Number: height of the GuiSlider2d (default is 256) 
* `minX`  Number: lower bound of the value's x range (default value is -1) 
* `maxX`  Number: upper bound of the value's x range (default value is 1) 
* `minY`  Number: lower bound of the value's y range (default value is -1) 
* `maxY`  Number: upper bound of the value's y range (default value is 1) 

##### Returns
`GuiSlider2d`

-----

## Variables

-----

### val
[[Back to top]](#guislider2d)

##### Example
```javascript
slider2d.val = {x: 0.5, y: 0.5};
```
```javascript
if (slider2d.isChanged) {
    print(slider2d.val.x);
    print(slider2d.val.y);
}
```

##### Description
Value of the `GuiSlider2d` returned as object `{x: valX, y: valY}`.

-----

### valX
[[Back to top]](#guislider2d)

##### Example
```javascript
slider2d.valX = 0.5;
```
```javascript
if (slider2d.isChanged) {
    print(slider2d.valX);
}
```

##### Description
X value of the `GuiSlider2d`.

-----

### valY
[[Back to top]](#guislider2d)

##### Example
```javascript
slider2d.valY = 0.5;
```
```javascript
if (slider2d.isChanged) {
    print(slider2d.valY);
}
```

##### Description
Y value of the `GuiSlider2d`.

-----

### minX
[[Back to top]](#guislider2d)

##### Example
```javascript
slider2d.minX = -100;
```

##### Description
Lower x bound of the `GuiSlider2d` range.

-----

### maxX
[[Back to top]](#guislider2d)

##### Example
```javascript
slider2d.maxX = 100;
```

##### Description
Upper x bound of the `GuiSlider2d` range.

-----

### minY
[[Back to top]](#guislider2d)

##### Example
```javascript
slider2d.minY = -100;
```

##### Description
Lower y bound of the `GuiSlider2d` range.

-----

### maxY
[[Back to top]](#guislider2d)

##### Example
```javascript
slider2d.maxY = 100;
```

##### Description
Upper y bound of the `GuiSlider2d` range.

-----

### isInteger
[[Back to top]](#description)

##### Example
```javascript
slider2d.isInteger = True;
```

##### Description
Sets the mode of the `GuiSlider2d` so that all values are integers.

-----

## Functions

-----
### setStyle()
[[Back to top]](#guislider2d)

##### Example
```javascript
slider2d.setStyle("fillBg", color(255, 0, 0));
```
```javascript
slider2d.setStyle({
    fillBg: color("#FF0000"),
    rounding: 10,
    handleRadius: 30
});
```

##### Description
Individual `GuiSlider2d` objects can be styled using this method. There are two types of input it takes. Use an input string and value to set an individual property, and use an `Object` with key/value notation to set multiple properties at once.

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
[[Back to top]](#guislider2d)

The `GuiSlider2d` style properties are:
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