[Home](../README.md) | [Reference](REFERENCE.md)

# GuiSlider / GuiSliderV
[Example](#example) | [Constructor](#constructor) | [Variables](#variables) | [Functions](#functions)

## Description
Slider class.

*Note: vertical slider class is virtually the same, just with a different orientation.*

![Picture of a p5.touchgui GuiSlider](../design/GuiSlider.png)

-----

## [Example](https://editor.p5js.org/L05/sketches/urlZ9XCsZ)
```javascript
let gui;

// Create a variable for your Slider
let s;

function setup() {
  createCanvas(400, 400);
  gui = createGui();
  
  // Create Slider.
  // The last two optional arguments define the min and max (minimum and maximum) values.
  // The default min and max values are 0 and 1, respectively.
  s = createSlider("Slider", 50, 50, 300, 32, 100, 300);
}

function draw() {
  background(220);
  drawGui();
  
  if (s.isChanged) {
    // Print a message when Slider is changed
    // that displays its value.
    print(s.label + " = " + s.val);
  }
  
  // Use Slider's value to determine where the ellipse is drawn.
  fill(255, 0, 0);
  ellipse(s.val, 300, 100);
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


### createSlider()
[[Back to top]](#description)

##### Example
```javascript
let gui;
let s;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    s = createSlider("Slider", 50, 50);
}

```
##### Description
Creates a new `GuiSlider` object. This is a horizontal slider. 

*Note: For a vertical slider, instead use `createSliderV()`.*

##### Syntax
```javascript
createSlider(label, x, y, [w], [h], [min], [max])
```

##### Parameters
* `label`  String: label for the GuiSlider 
* `x`  Number: x-coordinate of the GuiSlider 
* `y`  Number: y-coordinate of the GuiSlider 
* `w`  Number: width of the GuiSlider (default is 128) 
* `h`  Number: height of the GuiSlider (default is 32) 
* `min`  Number: lower bound of the value's range (default value is 0) 
* `max`  Number: upper bound of the value's range (default value is 1) 

##### Returns
`GuiSlider`

-----

## Variables

-----

### val
[[Back to top]](#description)

##### Example
```javascript
slider.val = 0.5;
```
```javascript
if (slider.isChanged) {
    print(slider.val);
}
```

##### Description
Value of the `GuiSlider`.

-----

### min
[[Back to top]](#description)

##### Example
```javascript
slider.min = -100;
```

##### Description
Lower bound of the `GuiSlider` range.

-----

### max
[[Back to top]](#description)

##### Example
```javascript
slider.max = 100;
```

##### Description
Upper bound of the `GuiSlider` range.

-----

### isInteger
[[Back to top]](#description)

##### Example
```javascript
slider.isInteger = True;
```

##### Description
Sets the mode of the `GuiSlider` so that all values are integers.

-----

## Functions

-----

### [setStyle()]()
[[Back to top]](#description)

##### Example
```javascript
slider.setStyle("fillBg", color(255, 0, 0));
```
```javascript
slider.setStyle({
    fillBg: color("#FF0000"),
    rounding: 10,
    trackWidth: 0.1
});
```

##### Description
Individual `GuiSlider` objects can be styled using this method. There are two types of input it takes. Use an input string and value to set an individual property, and use an `Object` with key/value notation to set multiple properties at once.

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

The `GuiSlider` style properties are:
* `strokeWeight` Number: the weight (in pixels) of the stroke
* `rounding` Number: radius of corners
* `trackWidth` Number: width of all slider tracks between 0 (line) and 1 (full)
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