[Home](../README.md) | [Reference](REFERENCE.md)

# GuiSlider2d
## Description
Two-dimensional slider (trackpad) class.

-----

## Variables
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