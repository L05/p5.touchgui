# Getting Started with OSC Examples

In order to run the OSC examples you'll need to do the following:

1. [Download and install node.js](https://nodejs.org/en/download/)

2. Open a terminal or command prompt (on Windows you might need to open the command prompt as admin).

3. In the terminal, navigate to your *p5.touchgui* directory using `cd`.

4. In the terminal type to install dependencies needed by *p5.touchgui* to run the OSC examples:<br>
`npm install`

5. Type the following in the terminal to install node.js `http-server`:<br>
`npm install -g http-server`

6. Then start a local server by typing in the terminal:<br>
`http-server -c-1`

7. Open a new terminal or command prompt (again, on Windows you might need to open the command prompt as admin).

8. Use `cd` to navigate to the `examples/osc` folder within your *p5.touchgui* directory.

9. Once there, type in the terminal:<br>
`node bridge.js`

10. Then point your browser to `http://localhost:8080/index.html` and use the menu to select the OSC examples.
