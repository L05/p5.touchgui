# TODO:

## GuiContext
* Add 'page' property so that objects can be grouped and toggled by page
* Write *loadStyleJSON()*
* ~~Implement "locked" object input.~~
* ~~Add methods for copying global style parameter changes to individual objects~~

## GuiObject
* Add an individual input lock toggle. May require further checking at the GuiContext scope.
* Add 'page' property so that objects can be grouped and toggled by page
* Review *setStyle()* for any additional error handling that may be needed 
* ~~Replace triggered with pressed, held, released, changed (for slider)~~
* ~~Ability to update style~~
* ~~Ability to change label~~
* ~~Label for toggle~~

## GuiButton
* Set text size

## All Sliders
* Note: includes GuiSlider, GuiSliderV, GuiCrossfader, GuiCrossfaderV, GuiSlider2d, GuiJoystick
* Fix hard coding of buffers (e.g. this.w-24)
* Fix so that touch corresponds with handle
* Add integer step mode
* (stretch) add segmenting/resolution functionality

## GuiSlider2d (and GuiJoystick)
* come up with better variable names for valX and valY

## GuiRadio
* write this object class

## GuiStyle
* ~~See if it's possible to simplify number of parameters~~
* Develop color palettes
    * ~~Gray~~ (get better contrast)
    * ~~Blue~~
    * Dark
* ~~Save style as JSON file preset.~~
* Load style as JSON file preset. Note: Needs further processing for p5.Color objects.

# QUESTIONS:
* Should I make helper style prototype functions for things such as setting visibility? (i.e. *SetVisible(b1, true);*)
* Should there be some kind of layout tool?
* How much input parameter handling should I do?
* Should GUI objects have values shown, especially for sliders?
* Should sliders have dead zones at the end?
    * Let users process output
* Should buttons have on and off labels?
* *What's the balance between simplicity and feature availability/flexibility?*

# FUTURE IDEAS
* Pages/Tabs
* GuiColorpicker
* Labels on sliders
* Pad bank

# EXAMPLES
* ~~One for each object~~
* Interaction modes
* ~~Callback example~~
* Sample layouts
* Set starting value for sliders
* Set styles for each type of object
    * Colors
    * Stroke Width
    * Stroke
    * Fill
    * Rounding
* Get examples from other people!
