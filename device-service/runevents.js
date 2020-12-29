const DeviceEvent = require("./deviceevent")
const LightPad = require('./lightpad');
const log4js = require('log4js');
const express = require('express');

log4js.configure({
  appenders: {
    everything: { 
      type: 'file', 
      filename: 'runevents.log', 
      maxLogSize: 10485760, 
      backups: 3, 
      compress: false,
      layout: {
        type: 'pattern',
        pattern: '%d [%p] %c %m'
      }
    },
    console: { 
      type: 'console' 
    } 
  },
  categories: {
    default: { 
      appenders: [ 'everything', 'console' ], 
      level: 'debug'
    }
  }
});

// main()
const logger = log4js.getLogger("main");
logger.info("Starting");

const TICK_INTERVAL = 10000;
const LIGHT_ON = "LIGHT_ON";
const LIGHT_OFF = "LIGHT_OFF";

var lightPad = new LightPad();
setInterval(intervalFunc, TICK_INTERVAL);


// -----------------------------------------------------------------------
// Web Service
// -----------------------------------------------------------------------

const server = express();
const port = 3000

server.get('/', (req, res) => {
  res.send('This is the device service')
});

server.post('/api/light-on/', (req, res) => {
  logger.info("Light ON command received");
  lightPad.turnOnLight();
  res.send('Light turned on');
});

server.post('/api/light-off/', (req, res) => {
  logger.info("Light OFF command received");
  lightPad.turnOffLight();
  res.send('Light turned off');
});

server.listen(port, () => {
  logger.info(`Device web service listening at http://localhost:${port}`)
})

// -----------------------------------------------------------------------





// Schedule of all events
var deviceEvents = [
  new DeviceEvent("Morning On", LIGHT_ON, 5, 0),
  new DeviceEvent("Morning Off", LIGHT_OFF, 0, 0, "sunrise"),
  new DeviceEvent("Evening On", LIGHT_ON, 0, 0, "sunset"),
  new DeviceEvent("Night Off", LIGHT_OFF, 0, 0),

  //new DeviceEvent("Test Off", LIGHT_OFF, 23, 29),
  //new DeviceEvent("Test On", LIGHT_ON, 23, 30),
];

// Timer tick function
function intervalFunc() {
  // Update all events, firing each one when its time arrives.
  deviceEvents.forEach(function(event) {
    if (event.update()) {
      doEvent(event);
    }
  });
}

// Invoke an event. Here is where we turn on/off the light, etc.
function doEvent(event) {
  logger.info(`>>>> Executing: ${event.label}; set to ${event.command}`);
  switch (event.command) {
    case LIGHT_ON:
      lightPad.turnOnLight();
      break;
    case LIGHT_OFF:
      lightPad.turnOffLight();
      break;
    default:
      console.log(`Unknown command '${event.command}'`);
  }
}


