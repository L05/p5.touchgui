# TODO:

## GuiObject
- Add an input lock mode. Need to track touch IDs in order to do this, which is not simple and straightforward. Object should know which touch initiated contact. This may need to be done at the context level, not yet sure without further investigation.
- ~~Replace triggered with pressed, held, released, changed (for slider)~~
- ~~Ability to update style~~
- ~~Ability to change label~~
- ~~Label for toggle~~

## All Sliders
- Note: includes GuiSlider, GuiSliderV, GuiCrossfader, GuiCrossfaderV, GuiSlider2d, GuiJoystick
- fix hard coding of buffers (e.g. this.w-24)
- fix so that touch corresponds with handle
- (stretch) add segmenting/resolution functionality

## GuiSlider2d (and GuiJoystick)
- come up with better variable names for valX and valY

## GuiRadio
- write this object class

## GuiStyle
- ~~See if it's possible to simplify number of parameters~~
- Develop color palettes
    - Grayscale (get better contrast)
    - Classic (based on p5.js)
    - Dark
- ~~Save style as JSON file preset.~~
- Load style as JSON file preset.

# QUESTIONS:
- Should I make helper style prototype functions for things such as setting visibility? (i.e. *SetVisible(b1, true);*)
- Should there be some kind of layout tool?
- How much input parameter handling should I do?
- Should GUI objects have values shown, especially for sliders?
- Should sliders have dead zones at the end?
    - Let users process output
- Should buttons have on and off labels?
- **What's the b  alance between simplicity and feature availability/flexibility?**

# FUTURE OBJECT IDEAS
- Pages/Tabs

# EXAMPLES
- One for each object
- Interaction mode example
- ~~Callback example~~
- Some sample layouts
- Get examples from other people
