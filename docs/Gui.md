[Home](../README.md) | [Reference](REFERENCE.md)

# Gui
[Constructor](#constructor) | [Variables](#variables) | [Functions](#functions)

## Description

`Gui` is a class that functions as the context within which all [`GuiObject`](GuiObject.md) objects are created, stored, updated, and drawn. This is automatically created when you call the global function [`createGui()`](Global.md).

-----

## Constructor

-----

### createGui()
[[Back to top]](#description)

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

## Variables

-----


### objects[]
An array of `GuiObject` objects stored within the `Gui`.

-----

## Functions

-----
### get()
[[Back to top]](#gui)

##### Example
```javascript
let gui;
let b, bCopy;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    b = createButton("Button", 50, 50);

    if (gui.get("Button").length == 1) {
        bCopy = gui.get("Button");
    }
}
```

##### Description
Returns an array of `GuiObject` objects that match the label parameter.

##### Syntax
```javascript
get(label)
```

##### Parameters
`label` String: label name of the object(s) that will be returned

##### Returns
`GuiObject[]`

-----

### loadStyle()
[[Back to top]](#gui)

##### Example
```javascript
let gui;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    gui.loadStyle("TerminalGreen");
}
```

##### Description
Loads a `GuiStyle` preset style based on string input. Options are:
* `"Gray"`
* `"Rose"`
* `"Seafoam"`
* `"Blue"`
* `"TerminalGreen"`
* `"TerminalRed"`
* `"TerminalBlue"`
* `"TerminalYellow"`
* `"TerminalMagenta"`

##### Syntax
```javascript
loadStyle(preset)
```

##### Parameters
`preset` String: name of style preset

##### Returns
`None`

-----

### updateStyle()
[[Back to top]](#gui)

##### Example
```javascript
let gui;
let s;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    s = createSlider("BoxySlider", 50, 50);

    gui.style.slider.rounding = 0;
    gui.updateStyle();
}
```

##### Description
Copies all properties currently stored in `Gui.style` to its children `GuiObject` objects. This is useful if you've set specific parameters in `Gui.style` that you'd like to propogate to all `GuiObject` objects.

##### Syntax
```javascript
updateStyle()
```

##### Parameters
`None`

##### Returns
`None`

-----

### setStrokeWeight()
[[Back to top]](#gui)

##### Example
```javascript
let gui;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    gui.setStrokeWeight(10); // Draws thick lines.
}
```

##### Description
Sets the stroke weight for all `GuiObjects`.

##### Syntax
```javascript
setStrokeWeight(weight)
```

##### Parameters
`weight` Number: the weight (in pixels) of the stroke

##### Returns
`None`

-----

### setRounding()
[[Back to top]](#gui)

##### Example
```javascript
let gui;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    gui.setRounding(10); // Draws nice rounded corners.
}
```

##### Description
Sets the radius for all `GuiObject` corners. This creates a rounded corner effect.

##### Syntax
```javascript
setRounding(rounding)
```

##### Parameters
`rounding` Number: radius of corners

##### Returns
`None`

-----

### setFont()
[[Back to top]](#gui)

##### Example
```javascript
let gui;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    gui.setFont("Arial");
}
```

```javascript
let gui;
let font;

function preload() {
  font = loadFont('assets/Regular.otf');
}

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    gui.setFont(font);
}
```

##### Description
Sets the font that will be applied to all `GuiObject` objects.

##### Syntax
```javascript
setFont(font)
```

##### Parameters
`font` Object|String: a font loaded via [loadFont()](https://p5js.org/reference/#/p5/loadFont), or a String representing a web safe font (a font that is generally available across all systems)

##### Returns
`None`

-----

### setTextSize()
[[Back to top]](#gui)

##### Example
```javascript
let gui;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    gui.setTextSize(40);
}
```

##### Description
Sets the textSize that will be applied to the text in all `GuiObject` objects.

##### Syntax
```javascript
setTextSize(theSize)
```

##### Parameters
`theSize` Number: the size of the letters in units of pixels

##### Returns
`None`

-----
### setTrackWidth()
[[Back to top]](#gui)

##### Example
```javascript
let gui;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    gui.setTrackWidth(0.1);
}
```

##### Description
Sets the width of slider tracks as a ratio. For instance, `setTrackWidth(1)` sets it to full width, while `setTrackWidth(0.5)` sets it to half width. `setTrackWidth(0)` renders the track as a single line.

##### Syntax
```javascript
setTrackWidth(ratio)
```

##### Parameters
`ratio` Number: width of all slider tracks between 0 (line) and 1 (full)

##### Returns
`None`

-----

## Style

These are the preset styles for **p5.touchgui**:

* `"Gray"`

![Gray preset](../design/Gray.png)

* `"Rose"`

![Rose preset](../design/Rose.png)

* `"Seafoam"`

![Seafoam preset](../design/Seafoam.png)

* `"Blue"`

![Blue preset](../design/Blue.png)

* `"TerminalGreen"` (shown on `background(0)`)

![TerminalGreen preset](../design/TerminalGreen.png)

* `"TerminalRed"` (shown on `background(0)`)

![TerminalRed preset](../design/TerminalRed.png)

* `"TerminalBlue"` (shown on `background(0)`)

![TerminalBlue preset](../design/TerminalBlue.png)

* `"TerminalYellow"` (shown on `background(0)`)

![TerminalYellow preset](../design/TerminalYellow.png)

* `"TerminalMagenta"` (shown on `background(0)`)

![TerminalMagenta preset](../design/TerminalMagenta.png)
