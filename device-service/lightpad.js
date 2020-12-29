// lightpad.js

var axios = require('axios');
var https = require('https');
var log4js = require('log4js');

const logger = log4js.getLogger("LightPad");

/**
 * Plum Lightpad
 */
class LightPad {

    constructor() {
      this.client = axios.create({
        baseURL: 'https://192.168.0.27:8443',
        httpsAgent: new https.Agent({  
            rejectUnauthorized: false
          }),
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Plum/2.3.0 (iPhone; iOS 9.2.1; Scale/2.00)',
            'X-Plum-House-Access-Token': 'a1ae75aeae092d5f1d7e9dcf8ea24389e8c41938185c880908c69dca9a06762e'
        }
      });

      this.getLightStatus(function(response) {
        logger.debug("Light Status:", response.data.level > 0 ? "ON" : "OFF");
      });
      
    }
  
    /**
     * Gets the current status and passes it to the supplied callback
     * @param callback 
     */
    getLightStatus(callback) {
      this.client.post('/v2/getLogicalLoadMetrics', {
        llid: "35dda4e8-01fe-4ab2-8f3c-892aa72015ba"
      }).then(function(response) {
        callback(response);
      });  
    }
    
    /**
     * Turn off light via lightpad API
     */
    turnOnLight() {
      this.client.post('/v2/setLogicalLoadLevel', {
        level: 255,
        llid: "35dda4e8-01fe-4ab2-8f3c-892aa72015ba"
      }).then(function(response) {
        logger.debug("Light On", response.status, response.statusText)
      });
    }
    
    /**
     * Turn off light via lightpad API
     */
    turnOffLight() {
      this.client.post('/v2/setLogicalLoadLevel', {
        level: 0,
        llid: "35dda4e8-01fe-4ab2-8f3c-892aa72015ba"
        }).then(function(response) {
          logger.debug("Light Off", response.status, response.statusText)
        });
    }
  }

  module.exports = LightPad;
  