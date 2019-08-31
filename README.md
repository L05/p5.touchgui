[Home]() | [Reference](docs/REFERENCE.md) | [Development Notes](docs/NOTES.md)

# p5.touchgui

*Note: This is a work in progress that is in early stages of development.*

* [Why p5.touchgui?]()
* [Getting Started](#getting-started)
    * [Quick Start](#quick-start)
    * [My First Button](#my-first-button)
* [Object Types](#object-types)
* [Examples](#examples)
* [Reference](docs/REFERENCE.md)
* [Development Notes](docs/NOTES.md)
* [Support](#support)

## Why p5.touchgui?

![Image of three different presets for p5.touchgui: Blue, Rose, and Seafoam](design/p5touchgui.png)

[*p5.js*](https://p5js.org) is a wonderfully accessible way for students and creative minds to both learn computer programming and create interactive art and experiences. 

*p5.touchgui* is intended to extend *p5.js* and make it easy to add buttons, sliders, and other GUI (graphical user interface) objects to your *p5.js* sketches, enabling you to focus on quickly iterating ideas with easily created GUI objects that work with both mouse and multi-touch input.

If you'd like to read more about the process, please check out my [Google Summer of Code report](docs/L05_gsoc_2019.md).

# Getting Started

## Quick Start
[[Back to top]](#p5touchgui)

There are two ways to quickly get started with p5.touchgui.

### Option 1 - p5.js editor

Open this [p5.js web editor sketch with p5.touchgui.js added](https://editor.p5js.org/L05/sketches/YjR7CxKg-).

### Option 2 - index.html

In an **index.html** file, copy and paste the following and open up that file in your web browser.
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Getting Started with p5.touchgui</title>
    <!-- p5 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/p5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.dom.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.sound.min.js"></script>
    <!-- p5.touchgui -->
    <script src="https://unpkg.com/p5.touchgui@0.5.2/lib/p5.touchgui.js"></script>
  </head>

  <body>
    <script>
      // Your code will go here
      let gui;
      let b;

      function setup(){
        createCanvas(400, 400);
                       
        gui = createGui();
        b = createButton("Button", 50, 50);
      }

      function draw(){
        background(200);
        drawGui();

        if(b.isPressed) {
          print(b.label + " is pressed.");
        }
      }
    </script>
  </body>
</html>
```
That's all!

## My First Button
[[Back to top]](#p5touchgui)

*(Follow along [here](https://editor.p5js.org/L05/sketches/YjR7CxKg-).)*

1. Declare a variable named `gui` and use `createGui()` to create a new GUI context. This is where each of your GUI objects is tracked and updated.
```javascript
let gui;

function setup() {
  createCanvas(400, 400);
  
  gui = createGui();
}
```

2. Declare a variable called `b` and use `createButton()` to add a new button.
```javascript
let gui;
let b;

function setup() {
  createCanvas(400, 400);
  
  gui = createGui();
  b = createButton("myButton", 50, 50);
}
```
3. Make sure to call `drawGui()` in your `draw()` loop. You can call it anywhere, but make sure to do so after you draw your `background()`. 

	If you run your sketch now, you should see your button drawn on the screen at an *x* position of 50 and a *y* position of 50.
```javascript
function draw() {
  background(220);
  drawGui();
}
```
4. `if()` your button is `.isPressed`, you can choose to perform actions. In this example, we will `print()` a message using the button's `.label`.
```javascript
function draw() {
  background(220);
  drawGui();

  if(b.isPressed) {
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
  drawGui();

  if(b.isPressed) {
    print(b.label + " is pressed.");
  }
}
```
Congratulations! You've created your first sketch using *p5.touchgui*. If you want to see what this looks like, [click here](https://editor.p5js.org/L05/sketches/YjR7CxKg-).

# Object Types
[[Back to top]](#p5touchgui)

![Blue preset](design/Blue.png)

* **[Button](docs/GuiButton.md)**
A button with a label that highlights when touched or clicked. When released it turns off.
<br>

* **[Toggle](docs/GuiToggle.md)**
A button with a label that highlights when touched or clicked. When touched or clicked again, it turns off.
<br>

* **[Checkbox](docs/GuiCheckbox.md)**
A button with an **X** that turns on when touched or clicked. When touched or clicked again, it turns off.
<br>

* **[Slider](docs/GuiSlider.md)**
A horizontally oriented slider that can be touched or clicked and dragged side to side to change its value.
<br>

* **[SliderV](docs/GuiSlider.md)**
A vertically oriented slider that can be touched or clicked and dragged up and down to change its value.
<br>

* **[Crossfader](docs/GuiCrossfader.md)**
A horizontally oriented crossfader that can be touched or clicked and dragged side to side to change its value. Visually similar to a slider except the indicator extends from the center.
<br>

* **[CrossfaderV](docs/GuiCrossfader.md)**
A vertically oriented crossfader that can be touched or clicked and dragged up and down to change its value. Visually similar to a slider except the indicator extends from the center.
<br>

* **[Slider2d](docs/GuiSlider2d.md)**
A two dimensional slider that returns an X/Y pair of values depending on touch or click location.
<br>

* **[Joystick](docs/GuiJoystick.md)**
A two dimensional slider that returns an X/Y pair of values relative to a resetting zero point at its center.
<br>

# Examples
[[Back to top]](#p5touchgui)

* **Beginner**
    * [Button](https://editor.p5js.org/L05/sketches/6ETiBjotm)
    * [Toggle](https://editor.p5js.org/L05/sketches/WUVbr_uqV)
    * [Checkbox](https://editor.p5js.org/L05/sketches/Kn1ecx6wv)
    * [Slider](https://editor.p5js.org/L05/sketches/urlZ9XCsZ)
    * [SliderV](https://editor.p5js.org/L05/sketches/-J54rzetm)
    * [Crossfader](https://editor.p5js.org/L05/sketches/MAUFHrJpg)
    * [CrossfaderV](https://editor.p5js.org/L05/sketches/uJ4pfZISu)
    * [Slider2d](https://editor.p5js.org/L05/sketches/xkA_bxh4_)
    * [Joystick](https://editor.p5js.org/L05/sketches/l-66JjVKt)
* **Intermediate**
    * [Callbacks](https://editor.p5js.org/L05/sketches/UZ7xM-RoS)
    * [Styling](https://editor.p5js.org/L05/sketches/u6aqtbD3d)
    * Drawing App
    * Notes Player
* **OSC (see below)**
    * Slider
    * SliderBank
    * ButtonBank
* **[Demo](https://editor.p5js.org/L05/sketches/LWfA8lGwe)**

## Using the OSC Examples
[[Back to top]](#p5touchgui)

In order to run the OSC examples you'll need to do the following:

1. [Download and install node.js](https://nodejs.org/en/download/)

2. Open a terminal or command prompt (on Windows you might need to open the command prompt as admin).

3. In the terminal, navigate to your *p5.touchgui* directory using `cd`.

4. In the terminal type to install dependencies needed by *p5.touchgui* to run the OSC examples:
`npm install`

5. Type the following in the terminal to install node.js `http-server`:
`npm install -g http-server`

6. Then start a local server by typing in the terminal:
`http-server -c-1`

7. Open a new terminal or command prompt (again, on Windows you might need to open the command prompt as admin).

8. Use `cd` to navigate to the `examples/osc` folder within your *p5.touchgui* directory.

9. Once there, type in the terminal:
`node bridge.js`

10. Then point your browser to `http://localhost:8080/index.html` and use the menu to select the OSC examples.


# Support

Please use *p5.touchgui* and let me know if you have any feedback!

* Do you **use it in a project**? What works and doesn't work?
* Do you **teach it in a class**? What works and doesn't work?

Any questions pertaining to this project may be communicated via Issues on the [p5.touchgui GitHub repository](https://github.com/L05/p5.touchgui). Simply create a new Issue and either assign or tag me in the conversation with [@L05](https://github.com/L05).
