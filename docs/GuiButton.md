[Home](../README.md) | [Reference](REFERENCE.md)

# GuiButton
## Description
Momentary button class.

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