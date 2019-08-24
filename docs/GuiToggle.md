[Home](../README.md) | [Reference](REFERENCE.md)

# GuiToggle
## Description
Toggle button class.

-----

## Variables

-----

### [val]()
##### Example
```javascript
toggle.val = True;

print(toggle.val)
```

##### Description
Value of the `GuiToggle`.

-----

### [label]()
```javascript
toggle.label = "Toggle";

print(toggle.label)
```

##### Description
Label of the `GuiToggle`. Setting the `label` will automatically set `labelOn` and `labelOff` (see below).

-----

### [labelOn]()
```javascript
toggle.labelOn = "Toggle On";

print(toggle.labelOn)
```

##### Description
Label of the `GuiToggle` when pressed or "on".

-----


### [labelOff]()
```javascript
toggle.labelOff = "Toggle Off";

print(toggle.labelOff)
```

##### Description
Label of the `GuiToggle` when unpressed or "off".

-----

## Functions

-----

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