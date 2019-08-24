[Home](../README.md) | [Reference](REFERENCE.md)

# GuiChecbox
## Description
Checkbox class.

-----
## Variables

-----

### val
[[Back to top]](#guicheckbox)
[[Back to top]](#guicheckbox)

##### Example
```javascript
checkbox.val = True;

print(checkbox.val)
```

##### Description
Value of the `GuiCheckbox`.

-----

## Functions

-----

### setStyle()
[[Back to top]](#guicheckbox)

##### Example
```javascript
checkbox.setStyle("fillBg", color(255, 0, 0));
```
```javascript
checkbox.setStyle({
    fillBg: color("#FF0000"),
    rounding: 10,
    textSize: 40
});
```

##### Description
Individual `GuiCheckbox` objects can be styled using this method. There are two types of input it takes. Use an input string and value to set an individual property, and use an `Object` with key/value notation to set multiple properties at once.

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
[[Back to top]](#guicheckbox)

The `GuiCheckbox` style properties are:
* `strokeWeight` Number: the weight (in pixels) of the stroke
* `rounding` Number: radius of corners
* `textSize` Number: the size of the letters in units of pixels
* `fillBg` p5.Color: default background color
* `fillBgHover` p5.Color: hover background color
* `fillBgActive` p5.Color: active background color
* `fillCheck` p5.Color: default check color
* `fillCheckHover` p5.Color: hover check color
* `fillCheckActive` p5.Color: active check color
* `strokeBg` p5.Color: default stroke color