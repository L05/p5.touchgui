[Home](../README.md) | [Reference](REFERENCE.md)

# Global Functions

**p5.touchgui** has a collection of core library functions that enable you to create and draw your [GUI (Graphical User Interface)](https://en.wikipedia.org/wiki/Graphical_user_interface) as well as various buttons. These can each be called from within your [p5.js](https://p5js.org) sketch similary to [p5.js](https://p5js.org)'s built-in functions (e.g. `createCanvas()`).

* [createGui()](#creategui)
* [drawGui()](#drawgui)
* [createButton()](#createbutton)
* [createToggle()](#createtoggle)
* [createCheckbox()](#createcheckbox)
* [createSlider()](#createslider)
* [createSliderV()](#createsliderv)
* [createCrossfader()](#createcrossfader)
* [createCrossfaderV()](#createcrossfaderv)
* [createSlider2d()](#createslider2d)
* [createJoystick()](#createjoystick)

-----

### createGui()
[[Back to top]](#global-functions)
##### Example
```javascript
let gui;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
}

```
##### Description
Creates a new `Gui` object, which retains and computes all of the information regarding your GUI, including style, user input, and object states. This should be called from within your sketch's `setup()` function.

##### Syntax
```javascript
createGui()
```

##### Parameters
`None`

##### Returns
`Gui`

-----

### drawGui()
[[Back to top]](#global-functions)

##### Example
```javascript
draw() {
    background(200);
    drawGui();
}

```
##### Description
Draws all of the objects in your `Gui`. This should be called in your `draw()` loop.

##### Syntax
```javascript
drawGui()
```

##### Parameters
`None`

##### Returns
`None`

-----

### createButton()
[[Back to top]](#global-functions)
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

### createToggle()
[[Back to top]](#global-functions)
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

### createCheckbox()
[[Back to top]](#global-functions)
##### Example
```javascript
let gui;
let cb;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    cb = createCheckbox("Checkbox", 50, 50);
}

```
##### Description
Creates a new `GuiCheckbox` object. This is a checkbox which functions like a toggle button.

##### Syntax
```javascript
createCheckbox(label, x, y, [w], [h], [defaultVal])
```

##### Parameters
* `label`  String: label for the GuiCheckbox 
* `x`  Number: x-coordinate of the GuiCheckbox 
* `y`  Number: y-coordinate of the GuiCheckbox 
* `w`  Number: width of the GuiCheckbox (default is 32) 
* `h`  Number: height of the GuiCheckbox (default is 32) 
* `defaultVal`  Number: default value for your GuiCheckbox (default is `false`) 

##### Returns
`GuiCheckbox`

-----


### createSlider()
[[Back to top]](#global-functions)
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

### createSliderV()
[[Back to top]](#global-functions)
##### Example
```javascript
let gui;
let s;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    s = createSliderV("SliderV", 50, 50);
}

```
##### Description
Creates a new `GuiSliderV` object. This is a vertical slider.

##### Syntax
```javascript
createSliderV(label, x, y, [w], [h], [min], [max])
```

##### Parameters
* `label`  String: label for the GuiSliderV 
* `x`  Number: x-coordinate of the GuiSliderV 
* `y`  Number: y-coordinate of the GuiSliderV 
* `w`  Number: width of the GuiSliderV (default is 32) 
* `h`  Number: height of the GuiSliderV (default is 128) 
* `min`  Number: lower bound of the value's range (default value is 0) 
* `max`  Number: upper bound of the value's range (default value is 1) 

##### Returns
`GuiSliderV`

-----

### createCrossfader()
[[Back to top]](#global-functions)
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

### createCrossfaderV()
[[Back to top]](#global-functions)
##### Example
```javascript
let gui;
let cf;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    cf = createCrossfader("CrossfaderV", 50, 50);
}

```
##### Description
Creates a new `GuiCrossfaderV` object. This is a vertical slider with a center point.

##### Syntax
```javascript
createCrossfaderV(label, x, y, [w], [h], [min], [max])
```

##### Parameters
* `label`  String: label for the GuiCrossfaderV 
* `x`  Number: x-coordinate of the GuiCrossfaderV 
* `y`  Number: y-coordinate of the GuiCrossfaderV 
* `w`  Number: width of the GuiCrossfaderV (default is 32) 
* `h`  Number: height of the GuiCrossfaderV (default is 128) 
* `min`  Number: lower bound of the value's range (default value is -1) 
* `max`  Number: upper bound of the value's range (default value is 1) 

##### Returns
`GuiCrossfaderV`

-----

### createSlider2d()
[[Back to top]](#global-functions)
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

### createJoystick()
[[Back to top]](#global-functions)
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

