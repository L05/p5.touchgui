[Home](../README.md)

# Development Notes

## CODE

### GuiContext
* Add 'page' or 'group' property so that objects can be grouped and toggled
* ~~Write *loadStyleJSON()*~~ Note: see below
* ~~Implement "locked" object input.~~
* ~~Add methods for copying global style parameter changes to individual objects~~

### GuiObject
* Add an individual input lock toggle. May require further checking at the GuiContext scope.
* Add 'page' or 'group' property so that objects can be grouped and toggled
* ~~Review *setStyle()* for any additional error handling that may be needed~~
* ~~Replace triggered with pressed, held, released, changed (for slider)~~
* ~~Ability to update style~~
* ~~Ability to change label~~
* ~~Label for toggle~~

### GuiButton
* Set text size

### All Sliders
* Note: includes GuiSlider, GuiSliderV, GuiCrossfader, GuiCrossfaderV, GuiSlider2d, GuiJoystick
* Fix hard coding of buffers (e.g. this.w-24)
* Fix so that touch corresponds with handle
* ~~(stretch) Add integer step mode~~ Note: omitted Joystick
* ~~(stretch) add segmenting/resolution functionality~~ Note: better to do on user side for now

### GuiSlider2d (and GuiJoystick)
* ~~Come up with better variable names for valX and valY~~
    * ~~Can now also access with .val.x and .val.y~~

### GuiRadio
* Write this object class

### GuiStyle
* ~~See if it's possible to simplify number of parameters~~
* Develop color palettes
    * ~~Gray~~ ~~(get better contrast)~~
    * ~~Blue~~
    * ~~Rose~~
    * ~~Seafoam~~
    * ~~TerminalGreen~~
    * ~~TerminalRed~~
    * ~~TerminalBlue~~
    * ~~TerminalYellow~~
* Need to rethink JSON use since it effectively would need to save layout as well.
* Study material-ui implementation of colors and try to implement something similar (i.e. primary and accent color)

## DOCUMENTATION

### REFERENCE
* Prototype methods
* Context methods
* All objects and associated methods
* Style parameters for each object

### EXAMPLES
* ~~One for each object~~
* Interaction modes
* ~~Callback example~~
* ~~OSC~~
* Sample layouts
* Set starting value for sliders
* ~~Set styles for each type of object~~
    * ~~Colors~~
    * ~~Stroke Width~~
    * ~~Stroke~~
    * ~~Fill~~
    * ~~Rounding~~
* Get examples from other people!

## QUESTIONS:
* ~~Should I make helper style prototype functions for things such as setting visibility? (i.e. *SetVisible(b1, true);*)~~
    * ~~Better for now to leave it under control of objects as member variables and methods~~
* Should there be some kind of layout tool?
* How much input parameter handling should I do?
* Should GUI objects have values shown, especially for sliders?
* ~~Should sliders have dead zones at the end?~~
    * ~~Let users process output~~
    * ~~"Solved" by having input lock~~
* ~~Should buttons have on and off labels?~~
    * ~~They do now!~~
* *What's the balance between simplicity and feature availability/flexibility?*
* **How can p5.touchgui be made accessible to screen readers?**
    * ARIA
    * Adapted for DOM element use? Would require a massive overhaul (and change functionality/feature set).
    * Inclusion of shadow DOM elements specifically intended for screen readers?
    * There are underlying accessibility issues with p5.js being JS canvas-based that may need to be addressed in parallel.    

## FUTURE IDEAS
* Pages/Groups/Tabs
* GuiColorpicker
* GuiTextfield
* Labels on sliders
* Pad bank


