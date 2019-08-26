[Home](../README.md) | [Reference](REFERENCE.md)

# GuiObject
[Variables](#variables) | [Functions](#functions)

## Description

`GuiObject` is the parent class for all **p5.touchgui** objects. All `GuiObject` objects have the variables and functions described below.

-----

## Variables

-----

### val
[[Back to top]](#guiobject)

##### Example
```javascript
s = createSlider("Slider", 50, 50);

// Set the value.
s.val = 0.25;

// Reference the value.
print(s.val);
```

##### Description
Value of the `GuiObject`.

-----

### label
[[Back to top]](#guiobject)

##### Example
```javascript
b = createButton("Button", 50, 50);

// Set the label.
b.label = "New Label";

// Reference the label.
print(b.label);
```

##### Description
Label of the `GuiObject`.

-----

### x
[[Back to top]](#guiobject)

##### Example
```javascript
b = createButton("Button", 50, 50);

// Set the x-coordinate.
b.x = 100;

// Reference the x-coordinate.
print(b.x);
```

##### Description
x-coordinate of the `GuiObject`.

-----

### y
[[Back to top]](#guiobject)

##### Example
```javascript
b = createButton("Button", 50, 50);

// Set the y-coordinate.
b.y = 100;

// Reference the y-coordinate.
print(b.y);
```

##### Description
y-coordinate of the `GuiObject`.

-----

### w
[[Back to top]](#guiobject)

##### Example
```javascript
b = createButton("Button", 50, 50);

// Set the width.
b.w = 128;

// Reference the width.
print(b.w);
```

##### Description
Width of the `GuiObject`.

-----

### h
[[Back to top]](#guiobject)

##### Example
```javascript
b = createButton("Button", 50, 50);

// Set the height.
b.h = 32;

// Reference the height.
print(b.h);
```

##### Description
Height of the `GuiObject`.

-----

### mode
[[Back to top]](#guiobject)

##### Example
```javascript
b = createButton("Button", 50, 50);

// Set the interaction mode.
b.mode = "onRelease";
```

##### Description
Interaction mode of the `GuiObject`. Can be set to `"onPress"` or `"onRelease"`. This determines whether the `GuiObject` updates its value(s) when it is pressed vs. when it is released. The default setting is `"onPress"`.

-----

### isPressed
[[Back to top]](#guiobject)

##### Example
```javascript
if (button.isPressed) {
    print(button.label + " was pressed!");
}
```

##### Description
This is a `Boolean` that is `True` when the `GuiObject` is first pressed and `False` otherwise.

-----

### isHeld
[[Back to top]](#guiobject)

##### Example
```javascript
if (button.isHeld) {
    print(button.label + " was held!");
}
```

##### Description
This is a `Boolean` that is `True` when the `GuiObject` is held and `False` otherwise.

-----

### isReleased
[[Back to top]](#guiobject)

##### Example
```javascript
if (button.isReleased) {
    print(button.label + " was released!");
}
```

##### Description
This is a `Boolean` that is `True` when the `GuiObject` is released and `False` otherwise.

-----

### isChanged
[[Back to top]](#guiobject)

##### Example
```javascript
if (button.isChanged) {
    print(button.label + " was changed!");
}
```

##### Description
This is a `Boolean` that is `True` when the `GuiObject` is changed and `False` otherwise.

-----

### onPress
[[Back to top]](#guiobject)

##### Example
```javascript
button.onPress = function() {
    print(button.label + " was pressed!");
}
```
```javascript
let gui, button;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    button = createButton("Button", 50, 50);

    button.onPress = onButtonPress;
}

function onButtonPress() {
    print("Pressed!")
}
```

##### Description
A user-defined callback function for `onPress` events can be added to a `GuiObject` object. This is then called when a `GuiObject` is pressed.

-----

### onHold
[[Back to top]](#guiobject)

##### Example
```javascript
button.onHold = function() {
    print(button.label + " was held!");
}
```
```javascript
let gui, button;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    button = createButton("Button", 50, 50);

    button.onHold = onButtonHold;
}

function onButtonHold() {
    print("Held!")
}
```

##### Description
A user-defined callback function for `onHold` events can be added to a `GuiObject` object. This is then called when a `GuiObject` is held.

-----

### onRelease
[[Back to top]](#guiobject)

##### Example
```javascript
button.onRelease = function() {
    print(button.label + " was released!");
}
```
```javascript
let gui, button;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    button = createButton("Button", 50, 50);

    button.onRelease = onButtonRelease;
}

function onButtonRelease() {
    print("Released!")
}
```

##### Description
A user-defined callback function for `onRelease` events can be added to a `GuiObject` object. This is then called when a `GuiObject` is released.

-----

### onChange
[[Back to top]](#guiobject)

##### Example
```javascript
button.onChange = function() {
    print(button.label + " was changed!");
}
```
```javascript
let gui, button;

function setup() {
    createCanvas(400, 400);
    gui = createGui();
    button = createButton("Button", 50, 50);

    button.onChange = onButtonChange;
}

function onButtonRelease() {
    print("Changed!")
}
```

##### Description
A user-defined callback function for `onChange` events can be added to a `GuiObject` object. This is then called when a `GuiObject` is changed.

-----

### enabled
[[Back to top]](#guiobject)

##### Example
```javascript
button.enabled = False;
```

##### Description
A `Boolean` value that determines whether the `GuiObject` is enabled to receive input. When `True`, the `GuiObject` will receive input from mouse and touch; when `False`, the `GuiObject` will receive no input, but the value can be set. This may be useful for visualization purposes.

-----

### visible
[[Back to top]](#guiobject)

##### Example
```javascript
button.visible = False;
```

##### Description
A `Boolean` value that determines whether the `GuiObject` is visible (i.e. drawn to the canvas). When `True`, the `GuiObject` will be drawn; when `False`, the `GuiObject` will not be drawn.

-----

## Functions

-----

### setStyle()
[[Back to top]](#guiobject)

##### Example
```javascript
button.setStyle("rounding", 10);
```
```javascript
button.setStyle({
    rounding: 10,
    textSize: 40
});
```

##### Description
Individual `GuiObject` objects can be styled using this method. There are two types of input it takes. Use an input string and value to set an individual property, and use an `Object` with key/value notation to set multiple properties at once.

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

### draw()
[[Back to top]](#guiobject)

##### Example
```javascript
button.draw()
```

##### Description
This can be used to draw the individual `GuiObject`. This is not recommended, as it does not also update the `GuiObject`. Please instead use global function `drawGui()` to draw all objects.

##### Syntax
```javascript
draw()
```

##### Parameters
`None`

##### Returns
`None`
