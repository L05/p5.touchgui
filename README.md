
# p5.touchgui

*Note: This is a work in progress that is in early stages of development.*

## Why p5.touchgui?

[*p5.js*](https://p5js.org) is a wonderfully accessible way for students and creative minds to both learn computer programming and create interactive art and experiences. 

*p5.touchgui* is intended to extend *p5.js* and make it easy to add buttons, sliders, and other GUI (graphical user interface) objects to your *p5.js* sketches, enabling you to focus on quickly iterating ideas with easily created GUI objects that work with both mouse and multi-touch input. 


## Getting Started

*(Follow along [here](https://editor.p5js.org/L05/sketches/YjR7CxKg-).)*

1. Declare a variable named `gui` and use `createGui()` to create a new GUI context. This is where each of your GUI objects is tracked and updated.
```javascript
let gui;

function setup() {
  createCanvas(400, 400);
  
  gui = createGUI();
}
```

2. Declare a variable called `b` and use `createButton()` to add a new button.
```javascript
let gui;
let b;

function setup() {
  createCanvas(400, 400);
  
  gui = createGUI();
  b = createButton("myButton", 50, 50);
}
```
3. Make sure to call `updateGui()` in your `draw()` loop. You can call it anywhere, but make sure to do so after you draw your `background()`. 

	If you run your sketch now, you should see your button drawn on the screen at an *x* position of 50 and a *y* position of 50.
```javascript
function draw() {
  background(220);
  updateGui();
}
```
4. `if()` your button is `.pressed`, you can choose to perform actions. In this example, we will `print()` a message using the button's `.label`.
```javascript
function draw() {
  background(220);
  updateGui();

  if(b.pressed) {
    print(b.label + " is pressed.");
  }
}
```
5. All together your [p5.js](https://p5js.org) sketch should look like:
```javascript
let gui;
let b;

function setup() {
  createCanvas(400, 400);
  
  gui = createGui();
  b = createButton("Button", 50, 50);
}

function draw() {
  background(220);
  updateGui();

  if(b.pressed) {
    print(b.label + " is pressed.");
  }
}
```
Congratulations! You've created your first sketch using *p5.touchgui*. If you want to see what this looks like, [click here](https://editor.p5js.org/L05/sketches/YjR7CxKg-).

## Examples

* [Button](https://editor.p5js.org/L05/sketches/6ETiBjotm)
* [Toggle](https://editor.p5js.org/L05/sketches/WUVbr_uqV)
* [Checkbox](https://editor.p5js.org/L05/sketches/Kn1ecx6wv)
* [Slider](https://editor.p5js.org/L05/sketches/urlZ9XCsZ)
* [Callbacks](https://editor.p5js.org/L05/sketches/UZ7xM-RoS)
* [Demo](https://editor.p5js.org/L05/sketches/LWfA8lGwe)

## GUI Object Types

### Button
A button with a label that highlights when touched or clicked. When released it turns off.  

### Toggle
A button with a label that highlights when touched or clicked. When touched or clicked again, it turns off.

### Checkbox
A button with an **X** that turns on when touched or clicked. When touched or clicked again, it turns off.  

### Slider
A horizontally oriented slider that can be touched or clicked and dragged side to side to change its value. 

### SliderV
A vertically oriented slider that can be touched or clicked and dragged up and down to change its value.

### Crossfader
A horizontally oriented crossfader that can be touched or clicked and dragged side to side to change its value. Visually similar to a slider except the indicator extends from the center.

### CrossfaderV
A vertically oriented crossfader that can be touched or clicked and dragged up and down to change its value. Visually similar to a slider except the indicator extends from the center.

### Slider2d
A two dimensional slider that returns an X/Y pair of values depending on touch or click location.

### Joystick
A two dimensional slider that returns an X/Y pair of values relative to a resetting zero point at its center.

____

[![Space Dander Example Video](https://i.vimeocdn.com/video/706438411.webp?mw=1100&mh=619&q=70)](https://vimeo.com/274410221)
*Space Dander Example Video*
