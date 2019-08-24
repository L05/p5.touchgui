[Home](../README.md) | [Reference](REFERENCE.md)

# GuiJoystick
## Description
Joystick class. This is similar to `GuiSlider2d` except that the handle snaps back to the center point when input is released.

-----

## Variables
### val
[[Back to top]](#joystick)

##### Example
```javascript
joystick.val = {x: 0.5, y: 0.5};
```
```javascript
if (joystick.isChanged) {
    print(joystick.val.x);
    print(joystick.val.y);
}
```

##### Description
Value of the `GuiJoystick` returned as object `{x: valX, y: valY}`.

-----

### valX
[[Back to top]](#joystick)

##### Example
```javascript
joystick.valX = 0.5;
```
```javascript
if (joystick.isChanged) {
    print(joystick.valX);
}
```

##### Description
X value of the `GuiJoystick`.

-----

### valY
[[Back to top]](#joystick)

##### Example
```javascript
joystick.valY = 0.5;
```
```javascript
if (joystick.isChanged) {
    print(joystick.valY);
}
```

##### Description
Y value of the `GuiJoystick`.

-----

### minX
[[Back to top]](#joystick)

##### Example
```javascript
joystick.minX = -100;
```

##### Description
Lower x bound of the `GuiJoystick` range.

-----

### maxX
[[Back to top]](#joystick)

##### Example
```javascript
joystick.maxX = 100;
```

##### Description
Upper x bound of the `GuiJoystick` range.

-----

### minY
[[Back to top]](#joystick)

##### Example
```javascript
joystick.minY = -100;
```

##### Description
Lower y bound of the `GuiJoystick` range.

-----

### maxY
[[Back to top]](#joystick)

##### Example
```javascript
joystick.maxY = 100;
```

##### Description
Upper y bound of the `GuiJoystick` range.

-----

## Functions

-----
### setStyle()
[[Back to top]](#joystick)

##### Example
```javascript
joystick.setStyle("fillBg", color(255, 0, 0));
```
```javascript
joystick.setStyle({
    fillBg: color("#FF0000"),
    rounding: 10,
    handleRadius: 30
});
```

##### Description
Individual `GuiJoystick` objects can be styled using this method. There are two types of input it takes. Use an input string and value to set an individual property, and use an `Object` with key/value notation to set multiple properties at once.

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
[[Back to top]](#joystick)

The `GuiJoystick` style properties are:
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