let socket = null;
let isConnected = false;

function sendOsc(address, value) {
  if (isConnected) {
    if (typeof value === 'boolean') {
      value = int(value);
    } else if (typeof value === 'object') {
      console.error('Cannot send JavaScript objects via OSC.');
    }
    socket.emit('message', [address].concat(value));
  }
}

function setupOsc(oscPortIn, oscPortOut, bridgeIp, serverIp='127.0.0.1', clientIp='127.0.0.1') {
  try {
    socket = io.connect(bridgeIp, { port: 8085, rememberTransport: false });
    socket.on('connect', function() {
      socket.emit('config', {	
        server: { port: oscPortIn,  host: serverIp },
        client: { port: oscPortOut, host: clientIp }
      });
      isConnected = true;
    });
    socket.on('message', function(msg) {
      if (msg[0] == '#bundle') {
        for (var i=2; i<msg.length; i++) {
          receiveOsc(msg[i][0], msg[i].splice(1));
        }
      } else {
        receiveOsc(msg[0], msg.splice(1));
      }
    });
  }
  catch(error) {
    console.error("Please open Terminal or Windows Command Prompt and run `node bridge.js` in the folder containing the file `bridge.js`.");
  }
}
