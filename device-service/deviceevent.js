var SunCalc = require('suncalc');
var log4js = require('log4js');

// TODO: These should be static class variables
// that can be set by the caller.
const RANCHO_LATITUDE = 34.1097467;
const RANCHO_LONGITUDE = -117.65441;

const logger = log4js.getLogger("DeviceEvent");

/**
 * An event scheduled for a certain time of day
 */
class DeviceEvent {
  /**
   * 
   * @param {*} label 
   * @param {*} command 
   * @param {*} hour 
   * @param {*} minute 
   * @param {*} solarEvent 
   */
  constructor(label, command, hour, minute, solarEvent) {
    this.label = label;
    this.command = command;
    this.hour = hour;
    this.minute = minute;
    this.solarEvent = solarEvent;
    this.lastHour = -1;
    this.lastMinute = -1;
  }

  /**
   * Evaluates the event for the current time, and returns true if the event
   * has ocurred since the last time update() was called.
   * 
   * @param {*} times 
   */
  update() {
    var now = new Date();
    var times = SunCalc.getTimes(now, RANCHO_LATITUDE, RANCHO_LONGITUDE);
    var hourNow = now.getHours();
    var minuteNow = now.getMinutes();
    var eventOccurred = false;

    // If sunrise/sunset, refresh based on the current date
    if (this.solarEvent == "sunrise") {
      this.hour = times.sunrise.getHours();
      this.minute = times.sunrise.getMinutes();
    }
    else if (this.solarEvent == "sunset") {
      this.hour = times.sunset.getHours();
      this.minute = times.sunset.getMinutes();
    }

    if (hourNow != this.lastHour || minuteNow != this.lastMinute) {
      // time has changed since the last update.
      logger.debug(this.status())
      if (hourNow == this.hour && minuteNow == this.minute) {
        eventOccurred = true;
      }
      this.lastHour = hourNow;
      this.lastMinute = minuteNow;
    }

    return eventOccurred;
  }

  /**
   * Returns the number of seconds between now and the next event time
   */
  eventOffsetSeconds() {
    var eventTime = new Date();
    eventTime.setHours(this.hour, this.minute);
    var eventOffset = eventTime - new Date();
    if (eventOffset < 0) {
      eventOffset = (24 * 60 * 60 * 1000) + eventOffset;
    }
    return eventOffset / 1000;
  }

  /**
   * Returns a string with the event title and time offset from now
   */
  status() {
    var offsetSeconds = this.eventOffsetSeconds();
    var offsetMinutes = Math.trunc(offsetSeconds / 60);
    var offsetHours = Math.trunc(offsetMinutes / 60);
    offsetMinutes = offsetMinutes % 60;
    //var timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
    return `${this.label} ${this.command} in ${offsetHours} hr, ${offsetMinutes} min`;
  }

}

module.exports = DeviceEvent;