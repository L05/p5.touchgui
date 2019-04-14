# p5.touchgui

Note: This is a **work in progress** that is in **very early** stages of development.

[Demo](https://editor.p5js.org/L05/present/Q-mBZLfpQ)

[*p5.js*](https://p5js.org) is a wonderfully accessible way for students and creative minds to both learn computer programming and create interactive art and experiences. As I helped teach network media and interactivity as a TA in UCLA’s Design Media Arts department, I noticed a recurring pattern. Students would dive into the p5.js editor, create exciting interactive sketches and animations, and then hit a wall when they wanted to start adding UI elements to their work. Many were absolute beginners to coding of any kind, and the jump from connecting basic shapes and variables to adding HTML elements or designing their own JavaScript buttons became a major hurdle. As accessible as p5.js is, there is currently no user-friendly way to add UI elements entirely within the sketch itself.

*p5.touchgui* is intended to close the gap, providing an easy-to-use GUI library that enables beginners and advanced users alike to quickly iterate on ideas with buttons, sliders, toggles, and joysticks that work with both mouse and multi-touch input. 

____

Planned UI elements:
* *Momentary Button*
   A button that turns on when touched or clicked. When released it turns off.  

* *Toggle Button:*
   A button that turns on when touched or clicked. When touched or clicked again, it turns off.  

* *Toggle Switch:*
   A switch that turns on when a touch or click is dragged in one direction. It turns off when a touch or clicked is dragged in the other direction.  

* *Radio Button Set:*
   A user-defined number of toggle buttons, of which only one can be turned on at a time.  

* *Horizontal Slider:*
   A horizontally oriented slider that can be touched or clicked and dragged side to side to change its value.  

* *Vertical Slider:*
   A vertically oriented slider that can be touched or clicked and dragged up and down to change its value.  

* *Cross Fader:*
   A Horizontal Slider with a resetting zero point at its center.  

* *2D Slider:*
   A two dimensional slider that returns an X/Y pair of values depending on a touch or click location. Can accept multiple touches.  

* *Joystick:*
   A two dimensional slider that returns an X/Y pair of values relative to a resetting zero point at its center (early example below).  

____

[![Space Dander Example Video](https://i.vimeocdn.com/video/706438411.webp?mw=1100&mh=619&q=70)](https://vimeo.com/274410221)
*Space Dander Example Video*
