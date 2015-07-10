(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var sphero = require("sphero");
var orb = sphero("COM4");

//coordinate functions
function coordinate(x, y) {
    this.x = x;
    this.y = y;
}

function add_coord(x, y, arr){
  arr.push(new coordinate(x, y));
}

var coordinates = [];
add_coord(1, 2, coordinates);
add_coord(3, 4, coordinates);

//console.log(coordinates[0].x);

//calculating distance functions
function distance(x1, y1, x2, y2){
  var s = Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
  //console.log("s: ", s);
  return s;
}

function roll_distance(x1, y1, x2, y2, speed){
  var d = distance(x1, y1, x2, y2);
  //console.log(d, x1, y1, x2, y2, speed);
  var time = d/speed;
  console.log(time);

  console.log("distance: ", d);
  var direction_rad = Math.atan2(y2-y1, x2-x1);
  var direction = direction_rad * 180 / Math.PI;

  /*setInterval(function() {
      orb.roll(speed, direction);
    }, time);*/

  //console.log(d);
  orb.roll(speed, direction);
  
}

var i=0;

orb.connect(function() {

  
  var curr_x, curr_y;

  orb.streamOdometer();

  orb.on("odometer", function(data) {
    //console.log("::STREAMING ODOMETER::");
    //console.log("  data:", data);

    //console.log("(x,y): ", data.xOdometer.value[0], ",", data.yOdometer.value[0]);

    curr_x = data.xOdometer.value[0];
    curr_y = data.yOdometer.value[0];

    for (i = i; i < coordinates.length; i++){
      curr_x = data.xOdometer.value[0];
      curr_y = data.yOdometer.value[0];

      //roll_distance(curr_x, curr_y, curr_x + coordinates[i].x, curr_y + coordinates[i].y, 180);
      roll_distance(curr_x, curr_y, coordinates[i].x, coordinates[i].y, 180);

      console.log(curr_x, curr_y, coordinates[i].x, coordinates[i].y);
      console.log("i: ", i, "(x,y): ", data.xOdometer.value[0], ",", data.yOdometer.value[0]);
    }

    console.log("(x,y): ", data.xOdometer.value[0], ",", data.yOdometer.value[0]);
  });

});

},{"sphero":2}],2:[function(require,module,exports){
"use strict";

var Sphero = require("./lib/sphero");

module.exports = function sphero(address, options) {
  return new Sphero(address, options);
};

},{"./lib/sphero":14}],3:[function(require,module,exports){
"use strict";

var debug = require("debug")("adaptor:serialport");

var util = require("util"),
    EventEmitter = require("events").EventEmitter;

var SerialPort,
    isChrome = typeof chrome !== "undefined";

// thanks to https://github.com/jgautier/firmata/blob/master/lib/firmata.js
try {
  if (isChrome) {
    debug("Loading browser-serialport");
    SerialPort = require("browser-serialport").SerialPort;
  } else {
    debug("Loading serialport");
    SerialPort = require("serialport").SerialPort;
  }
} catch (error) {
  debug("Error while attempting to load SerialPort", error);
  SerialPort = null;
}

if (SerialPort == null) {
  var err = [
    "It looks like serialport didn't compile properly.",
    "This is a common problem, and it's fix is documented here:",
    "https://github.com/voodootikigod/node-serialport#to-install"
  ].join(" ");

  console.error(err);
  throw new Error("Missing serialport dependency");
}

/**
 * An adaptor to communicate with a serial port
 *
 * @constructor
 * @param {String} conn the serialport string to connect to
 */
var Adaptor = module.exports = function Adaptor(conn) {
  debug("Creating new instance with conn " + conn);

  this.conn = conn;
  this.serialport = null;
  this.debug = require("debug")("adaptor:serialport:" + conn);
};

util.inherits(Adaptor, EventEmitter);

/**
 * Opens a connection to the serial port.
 * Triggers the provided callback when ready.
 *
 * @param {Function} callback (err)
 * @return {void}
 */
Adaptor.prototype.open = function open(callback) {
  var self = this,
      serialport = this.serialport = new SerialPort(this.conn, {});

  self.debug("opening serial port");

  function emit(name) {
    return self.emit.bind(self, name);
  }

  serialport.on("open", function(error) {
    if (error) {
      self.debug("error opening serial port: " + error);
      callback(error);
      return;
    }

    self.debug("opened serial port");
    self.emit("open");

    serialport.on("error", emit("error"));
    serialport.on("close", emit("close"));
    serialport.on("data", emit("data"));

    callback();
  });
};

/**
 * Writes data to the serialport.
 * Triggers the provided callback when done.
 *
 * @param {Any} data info to be written to the serialport. turned into a buffer.
 * @param {Function} [callback] triggered when write is complete
 * @return {void}
 */
Adaptor.prototype.write = function write(data, callback) {
  this.debug("writing data to serialport - " + data);
  this.serialport.write(data, callback);
};

/**
 * Adds a listener to the serialport's "data" event.
 * The provided callback will be triggered whenever the serialport reads data
 *
 * @param {Function} callback function to be invoked when data is read
 * @return {void}
 */
Adaptor.prototype.onRead = function read(callback) {
  this.debug("adding data event handler");
  this.on("data", callback);
};

},{"browser-serialport":16,"debug":17,"events":67,"serialport":59,"util":92}],4:[function(require,module,exports){
/* eslint key-spacing: 0 */
"use strict";

module.exports = {
  aliceblue            : 0xf0f8ff,
  antiquewhite         : 0xfaebd7,
  aqua                 : 0x00ffff,
  aquamarine           : 0x7fffd4,
  azure                : 0xf0ffff,
  beige                : 0xf5f5dc,
  bisque               : 0xffe4c4,
  black                : 0x000000,
  blanchedalmond       : 0xffebcd,
  blue                 : 0x0000ff,
  blueviolet           : 0x8a2be2,
  brown                : 0xa52a2a,
  burlywood            : 0xdeb887,
  cadetblue            : 0x5f9ea0,
  chartreuse           : 0x7fff00,
  chocolate            : 0xd2691e,
  coral                : 0xff7f50,
  cornflowerblue       : 0x6495ed,
  cornsilk             : 0xfff8dc,
  crimson              : 0xdc143c,
  cyan                 : 0x00ffff,
  darkblue             : 0x00008b,
  darkcyan             : 0x008b8b,
  darkgoldenrod        : 0xb8860b,
  darkgray             : 0xa9a9a9,
  darkgreen            : 0x006400,
  darkkhaki            : 0xbdb76b,
  darkmagenta          : 0x8b008b,
  darkolivegreen       : 0x556b2f,
  darkorange           : 0xff8c00,
  darkorchid           : 0x9932cc,
  darkred              : 0x8b0000,
  darksalmon           : 0xe9967a,
  darkseagreen         : 0x8fbc8f,
  darkslateblue        : 0x483d8b,
  darkslategray        : 0x2f4f4f,
  darkturquoise        : 0x00ced1,
  darkviolet           : 0x9400d3,
  deeppink             : 0xff1493,
  deepskyblue          : 0x00bfff,
  dimgray              : 0x696969,
  dodgerblue           : 0x1e90ff,
  firebrick            : 0xb22222,
  floralwhite          : 0xfffaf0,
  forestgreen          : 0x228b22,
  fuchsia              : 0xff00ff,
  gainsboro            : 0xdcdcdc,
  ghostwhite           : 0xf8f8ff,
  gold                 : 0xffd700,
  goldenrod            : 0xdaa520,
  gray                 : 0x808080,
  green                : 0x008000,
  greenyellow          : 0xadff2f,
  honeydew             : 0xf0fff0,
  hotpink              : 0xff69b4,
  indianred            : 0xcd5c5c,
  indigo               : 0x4b0082,
  ivory                : 0xfffff0,
  khaki                : 0xf0e68c,
  lavender             : 0xe6e6fa,
  lavenderblush        : 0xfff0f5,
  lawngreen            : 0x7cfc00,
  lemonchiffon         : 0xfffacd,
  lightblue            : 0xadd8e6,
  lightcoral           : 0xf08080,
  lightcyan            : 0xe0ffff,
  lightgoldenrodyellow : 0xfafad2,
  lightgreen           : 0x90ee90,
  lightgrey            : 0xd3d3d3,
  lightpink            : 0xffb6c1,
  lightsalmon          : 0xffa07a,
  lightseagreen        : 0x20b2aa,
  lightskyblue         : 0x87cefa,
  lightslategray       : 0x778899,
  lightsteelblue       : 0xb0c4de,
  lightyellow          : 0xffffe0,
  lime                 : 0x00ff00,
  limegreen            : 0x32cd32,
  linen                : 0xfaf0e6,
  magenta              : 0xff00ff,
  maroon               : 0x800000,
  mediumaquamarine     : 0x66cdaa,
  mediumblue           : 0x0000cd,
  mediumorchid         : 0xba55d3,
  mediumpurple         : 0x9370db,
  mediumseagreen       : 0x3cb371,
  mediumslateblue      : 0x7b68ee,
  mediumspringgreen    : 0x00fa9a,
  mediumturquoise      : 0x48d1cc,
  mediumvioletred      : 0xc71585,
  midnightblue         : 0x191970,
  mintcream            : 0xf5fffa,
  mistyrose            : 0xffe4e1,
  moccasin             : 0xffe4b5,
  navajowhite          : 0xffdead,
  navy                 : 0x000080,
  oldlace              : 0xfdf5e6,
  olive                : 0x808000,
  olivedrab            : 0x6b8e23,
  orange               : 0xffa500,
  orangered            : 0xff4500,
  orchid               : 0xda70d6,
  palegoldenrod        : 0xeee8aa,
  palegreen            : 0x98fb98,
  paleturquoise        : 0xafeeee,
  palevioletred        : 0xdb7093,
  papayawhip           : 0xffefd5,
  peachpuff            : 0xffdab9,
  peru                 : 0xcd853f,
  pink                 : 0xffc0cb,
  plum                 : 0xdda0dd,
  powderblue           : 0xb0e0e6,
  purple               : 0x800080,
  rebeccapurple        : 0x663399,
  red                  : 0xff0000,
  rosybrown            : 0xbc8f8f,
  royalblue            : 0x4169e1,
  saddlebrown          : 0x8b4513,
  salmon               : 0xfa8072,
  sandybrown           : 0xf4a460,
  seagreen             : 0x2e8b57,
  seashell             : 0xfff5ee,
  sienna               : 0xa0522d,
  silver               : 0xc0c0c0,
  skyblue              : 0x87ceeb,
  slateblue            : 0x6a5acd,
  slategray            : 0x708090,
  snow                 : 0xfffafa,
  springgreen          : 0x00ff7f,
  steelblue            : 0x4682b4,
  tan                  : 0xd2b48c,
  teal                 : 0x008080,
  thistle              : 0xd8bfd8,
  tomato               : 0xff6347,
  turquoise            : 0x40e0d0,
  violet               : 0xee82ee,
  wheat                : 0xf5deb3,
  white                : 0xffffff,
  whitesmoke           : 0xf5f5f5,
  yellow               : 0xffff00,
  yellowgreen          : 0x9acd32
};

},{}],5:[function(require,module,exports){
/* eslint key-spacing: 0 */
"use strict";

module.exports = {
  ping             : 0x01,
  version          : 0x02,
  controlUARTTx    : 0x03,
  setDeviceName    : 0x10,
  getBtInfo        : 0x11,
  setAutoReconnect : 0x12,
  getAutoReconnect : 0x13,
  getPwrState      : 0x20,
  setPwrNotify     : 0x21,
  sleep            : 0x22,
  getPowerTrips    : 0x23,
  setPowerTrips    : 0x24,
  setInactiveTimer : 0x25,
  goToBl           : 0x30,
  runL1Diags       : 0x40,
  runL2Diags       : 0x41,
  clearCounters    : 0x42,
  assignTime       : 0x50,
  pollTimes        : 0x51
};

},{}],6:[function(require,module,exports){
/* eslint key-spacing: 0 */
"use strict";

module.exports = {
  setHeading            : 0x01,
  setStabilization      : 0x02,
  setRotationRate       : 0x03,
  setCreationDate       : 0x04,
  getBallRegWebsite     : 0x05,
  reEnableDemo          : 0x06,
  getChassisId          : 0x07,
  setChassisId          : 0x08,
  selfLevel             : 0x09,
  setVdl                : 0x0A,
  setDataStreaming      : 0x11,
  setCollisionDetection : 0x12,
  locator               : 0x13,
  setAccelerometer      : 0x14,
  readLocator           : 0x15,
  setRGBLed             : 0x20,
  setBackLed            : 0x21,
  getRGBLed             : 0x22,
  roll                  : 0x30,
  boost                 : 0x31,
  move                  : 0x32,
  setRawMotors          : 0x33,
  setMotionTimeout      : 0x34,
  setOptionsFlag        : 0x35,
  getOptionsFlag        : 0x36,
  setTempOptFlags       : 0x37,
  getTempOptFlags       : 0x38,
  getConfigBlock        : 0x40,
  setSSBParams          : 0x41,
  setDeviceMode         : 0x42,
  setConfigBlock        : 0x43,
  getDeviceMode         : 0x44,
  getSSB                : 0x46,
  setSSB                : 0x47,
  ssbRefill             : 0x48,
  ssbBuy                : 0x49,
  ssbUseConsumeable     : 0x4A,
  ssbGrantCores         : 0x4B,
  ssbAddXp              : 0x4C,
  ssbLevelUpAttr        : 0x4D,
  getPwSeed             : 0x4E,
  ssbEnableAsync        : 0x4F,
  runMacro              : 0x50,
  saveTempMacro         : 0x51,
  saveMacro             : 0x52,
  initMacroExecutive    : 0x54,
  abortMacro            : 0x55,
  macroStatus           : 0x56,
  setMacroParam         : 0x57,
  appendTempMacroChunk  : 0x58,
  eraseOBStorage        : 0x60,
  appendOBFragment      : 0x61,
  execOBProgram         : 0x62,
  abortOBProgram        : 0x63,
  answerInput           : 0x64,
  commitToFlash         : 0x65,
  commitToFlashAlias    : 0x70
};

},{}],7:[function(require,module,exports){
"use strict";

var utils = require("../utils"),
    commands = require("../commands/core");

module.exports = function core(device) {
  // Core Virtual Device Address = 0x00
  var command = device.command.bind(device, 0x00);

  /**
   * The Ping command verifies the Sphero is awake and receiving commands.
   *
   * @param {Function} callback triggered when Sphero has been pinged
   * @return {void}
   */
  device.ping = function(callback) {
    return command(commands.ping, null, callback);
  };

  /**
   * The Version command returns a batch of software and hardware information
   * about Sphero.
   *
   * @param {Function} callback triggered with version information
   * @return {void}
   */
  device.version = function(callback) {
    return command(commands.version, null, callback);
  };

  /**
   * The Control UART Tx command enables or disables the CPU's UART transmit
   * line so another client can configure the Bluetooth module.
   *
   * @param {Function} callback function to be triggered after write
   * @return {void}
   */
  device.controlUARTTx = function(callback) {
    return command(commands.controlUARTTx, null, callback);
  };

  /**
   * The Set Device Name command assigns Sphero an internal name. This value is
   * then produced as part of the Get Bluetooth Info command.
   *
   * Names are clipped at 48 characters to support UTF-8 sequences. Any extra
   * characters will be discarded.
   *
   * This field defaults to the Bluetooth advertising name of Sphero.
   *
   * @param {String} name what name to give to the Sphero
   * @param {Function} callback function to be triggered when the name is set
   * @return {void}
   */
  device.setDeviceName = function(name, callback) {
    var data = [];

    for (var i = 0; i < name.length; ++i) {
      data[i] = name.charCodeAt(i);
    }

    return command(commands.setDeviceName, data, callback);
  };

  /**
   * Triggers the callback with a structure containing
   *
   * - Sphero's ASCII name
   * - Sphero's Bluetooth address (ASCII)
   * - Sphero's ID colors
   *
   * @param {Function} callback function to be triggered with Bluetooth info
   * @return {void}
   */
  device.getBluetoothInfo = function(callback) {
    return command(commands.getBtInfo, null, callback);
  };

  /**
   * The Set Auto Reconnect command tells Sphero's BT module whether or not it
   * should automatically reconnect to the previously-connected Apple mobile
   * device.
   *
   * @param {Number} flag whether or not to reconnect (0 - no, 1 - yes)
   * @param {Number} time how many seconds after start to enable auto reconnect
   * @param {Function} callback function to be triggered after write
   * @return {void}
   */
  device.setAutoReconnect = function(flag, time, callback) {
    return command(commands.setAutoReconnect, [flag, time], callback);
  };

  /**
   * The Get Auto Reconnect command returns the Bluetooth auto reconnect values
   * as defined above in the Set Auto Reconnect command.
   *
   * @param {Function} callback function to be triggered with reconnect data
   * @return {void}
   */
  device.getAutoReconnect = function(callback) {
    return command(commands.getAutoReconnect, null, callback);
  };

  /**
   * The Get Power State command returns Sphero's current power state, and some
   * additional parameters:
   *
   * - **RecVer**: record version code (following is for 0x01)
   * - **Power State**: high-level state of the power system
   * - **BattVoltage**: current battery voltage, scaled in 100ths of a volt
   *   (e.g. 0x02EF would be 7.51 volts)
   * - **NumCharges**: Number of battery recharges in the life of this Sphero
   * - **TimeSinceChg**: Seconds awake since last recharge
   *
   * Possible power states:
   *
   * - 0x01 - Battery Charging
   * - 0x02 - Battery OK
   * - 0x03 - Battery Low
   * - 0x04 - Battery Critical
   *
   * @param {Function} callback function to be triggered with power state data
   * @return {void}
   */
  device.getPowerState = function(callback) {
    return command(commands.getPwrState, null, callback);
  };

  /**
   * The Set Power Notification command enables sphero to asynchronously notify
   * the user of power state periodically (or immediately, when a change occurs)
   *
   * Timed notifications are sent every 10 seconds, until they're disabled or
   * Sphero is unpaired.
   *
   * @param {Number} flag whether or not to send notifications (0 - no, 1 - yes)
   * @param {Function} callback function to be triggered when done writing
   * @return {void}
   */
  device.setPowerNotification = function(flag, callback) {
    return command(commands.setPwrNotify, [flag], callback);
  };

  /**
   * The Sleep command puts Sphero to sleep immediately.
   *
   * @param {Number} wakeup the number of seconds for Sphero to re-awaken after.
   * 0x00 tells Sphero to sleep forever, 0xFFFF attemps to put Sphero into deep
   * sleep.
   * @param {Number} macro if non-zero, Sphero will attempt to run this macro ID
   * when it wakes up
   * @param {Number} orbBasic if non-zero, Sphero will attempt to run an
   * orbBasic program from this line number
   * @param {Function} callback function to be triggered when done writing
   * @return {void}
   */
  device.sleep = function(wakeup, macro, orbBasic, callback) {
    wakeup = utils.intToHexArray(wakeup, 2);
    orbBasic = utils.intToHexArray(orbBasic, 2);

    var data = [].concat(wakeup, macro, orbBasic);

    return command(commands.sleep, data, callback);
  };

  /**
   * The Get Voltage Trip Points command returns the trip points Sphero uses to
   * determine Low battery and Critical battery.
   *
   * The values are expressed in 100ths of a volt, so defaults of 7V and 6.5V
   * respectively are returned as 700 and 650.
   *
   * @param {Function} callback function to be triggered with trip point data
   * @return {void}
   */
  device.getVoltageTripPoints = function(callback) {
    return command(commands.getPowerTrips, null, callback);
  };

  /**
   * The Set Voltage Trip Points command assigns the voltage trip points for Low
   * and Critical battery voltages.
   *
   * Values are specified in 100ths of a volt, and there are limitations on
   * adjusting these from their defaults:
   *
   * - vLow must be in the range 675-725
   * - vCrit must be in the range 625-675
   *
   * Shifting these values too low can result in very little warning before
   * Sphero forces itself to sleep, depending on the battery pack. Be careful.
   *
   * @param {Number} vLow new voltage trigger for Low battery
   * @param {Number} vCrit new voltage trigger for Crit battery
   * @param {Function} callback function to be triggered when done writing
   * @return {void}
   */
  device.setVoltageTripPoints = function(vLow, vCrit, callback) {
    vLow = utils.intToHexArray(vLow, 2);
    vCrit = utils.intToHexArray(vCrit, 2);

    var data = [].concat(vLow, vCrit);

    return command(commands.setPowerTrips, data, callback);
  };

  /**
   * The Set Inactivity Timeout command sets the timeout delay before Sphero
   * goes to sleep automatically.
   *
   * By default, the value is 600 seconds (10 minutes), but this command can
   * alter it to any value of 60 seconds or greater.
   *
   * @param {Number} time new delay before sleeping
   * @param {Function} callback function to be triggered when done writing
   * @return {void}
   */
  device.setInactivityTimeout = function(time, callback) {
    var data = utils.intToHexArray(time, 2);
    return command(commands.setInactiveTimer, data, callback);
  };

  /**
   * The Jump To Bootloader command requests a jump into the Bootloader to
   * prepare for a firmware download.
   *
   * All commands after this one must comply with the Bootloader Protocol
   * Specification.
   *
   * @param {Function} callback function to be triggered when done writing
   * @return {void}
   */
  device.jumpToBootloader = function(callback) {
    return command(commands.goToBl, null, callback);
  };

  /**
   * The Perform Level 1 Diagnostics command is a developer-level command to
   * help diagnose aberrant behaviour in Sphero.
   *
   * Most process flags, system counters, and system states are decoded to
   * human-readable ASCII.
   *
   * For more details, see the Sphero API documentation.
   *
   * @param {Function} callback function to be triggered with diagnostic data
   * @return {void}
   */
  device.runL1Diags = function(callback) {
    return command(commands.runL1Diags, null, callback);
  };

  /**
   * The Perform Level 2 Diagnostics command is a developer-level command to
   * help diagnose aberrant behaviour in Sphero.
   *
   * It's much less informative than the Level 1 command, but is in binary
   * format and easier to parse.
   *
   * For more details, see the Sphero API documentation.
   *
   * @param {Function} callback function to be triggered with diagnostic data
   * @return {void}
   */
  device.runL2Diags = function(callback) {
    return command(commands.runL2Diags, null, callback);
  };

  /**
   * The Clear Counters command is a developer-only command to clear the various
   * system counters created by the L2 diagnostics.
   *
   * It is denied when the Sphero is in Normal mode.
   *
   * @param {Function} callback function to be triggered when done writing
   * @return {void}
   */
  device.clearCounters = function(callback) {
    return command(commands.clearCounters, null, callback);
  };

  device._coreTimeCmd = function(cmd, time, callback) {
    var data = utils.intToHexArray(time, 4);
    return command(cmd, data, callback);
  };

  /**
   * The Assign Time command sets a specific value to Sphero's internal 32-bit
   * relative time counter.
   *
   * @param {Number} time the new value to set
   * @param {Function} callback function to be triggered when done writing
   * @return {void}
   */
  device.assignTime = function(time, callback) {
    device._coreTimeCmd(commands.assignTime, time, callback);
  };

  /**
   * The Poll Packet Times command helps users profile the transmission and
   * processing latencies in Sphero.
   *
   * For more details, see the Sphero API documentation.
   *
   * @param {Number} time a timestamp to use for profiling
   * @param {Function} callback function to be triggered when done writing
   * @return {void}
   */
  device.pollPacketTimes = function(time, callback) {
    device._coreTimeCmd(commands.pollTimes, time, callback);
  };
};

},{"../commands/core":5,"../utils":15}],8:[function(require,module,exports){
"use strict";

// "custom" Sphero commands.
//
// These usually remix or pre-process arguments for existing methods.

var colors = require("../colors"),
    utils = require("../utils");

// regular expression to match hex strings
var hexRegex = /^[A-Fa-f0-9]{6}$/m;

/**
 * Converts a hex color number to RGB values
 *
 * @private
 * @param {Number} num color value to convert
 * @return {Object} RGB color values
 */
function hexToRGB(num) {
  return {
    red: (num >> 16 & 0xff),
    green: (num >> 8 & 0xff),
    blue: num & 0xff
  };
}

module.exports = function custom(device) {

  /**
   * The Color command wraps Sphero's built-in setRGB command, allowing for
   * a greater range of possible inputs.
   *
   * @param {Number|String|Object} color what color to change Sphero to
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.color = function(color, callback) {
    switch (typeof color) {
      case "number":
        color = hexToRGB(color);
        break;

      case "string":
        if (colors[color]) {
          color = hexToRGB(colors[color]);
          break;
        }

        if (color[0] === "#") {
          color = color.slice(1);
        }

        if (hexRegex.test(color)) {
          var matches = hexRegex.exec(color);
          color = hexToRGB(parseInt(matches[0], 16));
        } else {
          // passed some weird value, just use white
          console.error("invalid color provided", color);
          color = hexToRGB(0xFFFFFF);
        }

        break;

      case "object":
        // upgrade shorthand properties
        ["red", "green", "blue"].forEach(function(hue) {
          var h = hue[0];

          if (color[h] && typeof color[hue] === "undefined") {
            color[hue] = color[h];
          }
        });

        break;
    }

    return device.setRGBLed(color, callback);
  };

  /**
   * The Random Color command sets Sphero to a randomly-generated color.
   *
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.randomColor = function(callback) {
    return device.setRGBLed(utils.randomColor(), callback);
  };

  /**
   * Passes the color of the sphero RGB LED to the callback (err, data)
   *
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.getColor = function(callback) {
    return device.getRGBLed(callback);
  };

  /**
   * The Detect Collisions command sets up Sphero's collision detection system,
   * and automatically parses asynchronous packets to re-emit collision events
   * to 'collision' event listeners.
   *
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.detectCollisions = function(callback) {
    return device.configureCollisions({
      meth: 0x01,
      xt: 0x40,
      yt: 0x40,
      xs: 0x50,
      ys: 0x50,
      dead: 0x50
    }, callback);
  };

  /**
   * The Start Calibration command sets up Sphero for manual heading
   * calibration.
   *
   * It does this by turning on the tail light (so you can tell where it's
   * facing) and disabling stabilization (so you can adjust the heading).
   *
   * When done, call #finishCalibration to set the new heading, and re-enable
   * stabilization.
   *
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.startCalibration = function(callback) {
    device.setBackLed(127);
    return device.setStabilization(0, callback);
  };

  /**
   * The Finish Calibration command ends Sphero's calibration mode, by setting
   * the new heading as current, turning off the back LED, and re-enabling
   * stabilization.
   *
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.finishCalibration = function(callback) {
    device.setHeading(0);
    device.setBackLed(0);
    return device.setStabilization(1, callback);
  };

  /**
   * Generic data streaming setup
   *
   * It uses sphero's data streaming command. User needs to listen
   * for the `dataStreaming` event or custom event to get the data.
   *
   * @param {Number} mask1 32bit data streaming bitmask (hex)
   * @param {Number} mask2 32bit data streaming bitmask (hex)
   * @param {Number} sps=5 samples per second
   * @param {Boolean} remove=false forces velocity streaming to stop
   * @param {Function} callback callback to be triggered on completion
   * @return {void}
   */
  device._streamData = function(mask1, mask2, sps, remove, callback) {
    sps = sps || 4;
    remove = remove || false;

    var n = Math.round(400 / sps),
        opts;

    mask1 = this._mergeMasks("mask1", mask1, remove);
    mask2 = this._mergeMasks("mask2", mask2, remove);

    // options for streaming data
    opts = {
      n: n,
      m: 1,
      mask1: mask1,
      pcnt: 0,
      mask2: mask2
    };

    device.on("dataStreaming", callback);
    device.setDataStreaming(opts);
  };

  device._mergeMasks = function(id, mask, remove) {
    if (remove) {
      mask = utils.xor32Bitmask(mask);
      mask = device.ds[id] & mask;
    } else {
      mask = device.ds[id] | mask;
    }

    return mask;
  };

  /**
   * Starts streaming of odometer data
   *
   * It uses sphero's data streaming command. User needs to listen
   * for the `dataStreaming` or `odometer` event to get the data.
   *
   * @param {Number} [sps=5] samples per second
   * @param {Boolean} [remove=false] forces velocity streaming to stop
   * @return {void}
   */
  device.streamOdometer = function(sps, remove) {
    var mask1 = 0x00000000,
        mask2 = 0x0C000000;

    var callback = function(data) {
      device.emit("odometer", { x: data.xOdometer, y: data.yOdometer });
    };

    device._streamData(mask1, mask2, sps, remove, callback);
  };

  /**
   * Starts streaming of velocity data
   *
   * It uses sphero's data streaming command. User needs to listen
   * for the `dataStreaming` or `velocity` event to get the velocity values.
   *
   * @param {Number} [sps=5] samples per second
   * @param {Boolean} [remove=false] forces velocity streaming to stop
   * @return {void}
   */
  device.streamVelocity = function(sps, remove) {
    var mask1 = 0x00000000,
        mask2 = 0x01800000;

    var callback = function(data) {
      device.emit("velocity", { x: data.xVelocity, y: data.yVelocity });
    };

    device._streamData(mask1, mask2, sps, remove, callback);
  };

  /**
   * Starts streaming of accelOne data
   *
   * It uses sphero's data streaming command. User needs to listen
   * for the `dataStreaming` or `accelOne` event to get the data.
   *
   * @param {Number} [sps=5] samples per second
   * @param {Boolean} [remove=false] forces velocity streaming to stop
   * @return {void}
   */
  device.streamAccelOne = function(sps, remove) {
    var mask1 = 0x00000000,
        mask2 = 0x02000000;

    var callback = function(data) {
      device.emit("accelOne", data.accelOne);
    };

    device._streamData(mask1, mask2, sps, remove, callback);
  };

  /**
   * Starts streaming of IMU angles data
   *
   * It uses sphero's data streaming command. User needs to listen
   * for the `dataStreaming` or `imuAngles` event to get the data.
   *
   * @param {Number} [sps=5] samples per second
   * @param {Boolean} [remove=false] forces velocity streaming to stop
   * @return {void}
   */
  device.streamIMUAngles = function(sps, remove) {
    var mask1 = 0x00070000,
        mask2 = 0x00000000;

    var callback = function(data) {
      device.emit("imuAngles", {
        pitchAngle: data.pitchAngle,
        rollAngle: data.rollAngle,
        yawAngle: data.yawAngle,
      });
    };

    device._streamData(mask1, mask2, sps, remove, callback);
  };

  /**
   * Starts streaming of accelerometer data
   *
   * It uses sphero's data streaming command. User needs to listen
   * for the `dataStreaming` or `accelerometer` event to get the data.
   *
   * @param {Number} [sps=5] samples per second
   * @param {Boolean} [remove=false] forces velocity streaming to stop
   * @return {void}
   */
  device.streamAccelerometer = function(sps, remove) {
    var mask1 = 0x0000E000,
        mask2 = 0x00000000;

    var callback = function(data) {
      device.emit("accelerometer", {
        x: data.xAccel,
        y: data.yAccel,
        z: data.zAccel,
      });
    };

    device._streamData(mask1, mask2, sps, remove, callback);
  };

  /**
   * Starts streaming of gyroscope data
   *
   * It uses sphero's data streaming command. User needs to listen
   * for the `dataStreaming` or `gyroscope` event to get the data.
   *
   * @param {Number} [sps=5] samples per second
   * @param {Boolean} [remove=false] forces velocity streaming to stop
   * @return {void}
   */
  device.streamGyroscope = function(sps, remove) {
    var mask1 = 0x00001C00,
        mask2 = 0x00000000;

    var callback = function(data) {
      device.emit("gyroscope", { x: data.xGyro, y: data.yGyro, z: data.zGyro });
    };

    device._streamData(mask1, mask2, sps, remove, callback);
  };

  /**
   * Starts streaming of motor back EMF data
   *
   * It uses sphero's data streaming command. User needs to listen
   * for the `dataStreaming` or `motorsBackEmf` event to get the data.
   *
   * @param {Number} [sps=5] samples per second
   * @param {Boolean} [remove=false] forces velocity streaming to stop
   * @return {void}
   */
  device.streamMotorsBackEmf = function(sps, remove) {
    var mask1 = 0x00000060,
        mask2 = 0x00000000;

    var callback = function(data) {
      device.emit("motorsBackEmf", {
        right: data.rMotorBackEMF,
        left: data.lMotorBackEMF
      });
    };

    device._streamData(mask1, mask2, sps, remove, callback);
  };
};

},{"../colors":4,"../utils":15}],9:[function(require,module,exports){
"use strict";

var utils = require("../utils"),
    commands = require("../commands/sphero");

module.exports = function sphero(device) {
  // Sphero Virtual Device Address = 0x02
  var command = device.command.bind(device, 0x02);

  /**
   * The Set Heading command tells Sphero to adjust it's orientation, by
   * commanding a new reference heading (in degrees).
   *
   * If stabilization is enabled, Sphero will respond immediately to this.
   *
   * @param {Number} heading Sphero's new reference heading, in degrees (0-359)
   * @param {Function} callback function to be triggered after writing
   * @return {void}
   */
  device.setHeading = function(heading, callback) {
    heading = utils.intToHexArray(heading, 2);
    command(commands.setHeading, heading, callback);
  };

  /**
   * The Set Stabilization command turns Sphero's internal stabilization on or
   * off, depending on the flag provided.
   *
   * @param {Number} flag stabilization setting flag (0 - off, 1 - on)
   * @param {Function} callback function to be triggered after writing
   * @return {void}
   */
  device.setStabilization = function(flag, callback) {
    flag &= 0x01;
    command(commands.setStabilization, [flag], callback);
  };

  /**
   * The Set Rotation Rate command allows control of the rotation rate Sphero
   * uses to meet new heading commands.
   *
   * A lower value offers better control, but with a larger turning radius.
   *
   * Higher values yield quick turns, but Sphero may lose control.
   *
   * The provided value is in units of 0.784 degrees/sec.
   *
   * @param {Number} rotation new rotation rate (0-255)
   * @param {Function} callback function to be triggered after writing
   * @return {void}
   */
  device.setRotationRate = function(rotation, callback) {
    rotation &= 0xFF;
    command(commands.setRotationRate, [rotation], callback);
  };

  /**
   * The Get Chassis ID command returns the 16-bit chassis ID Sphero was
   * assigned at the factory.
   *
   * @param {Function} callback function to be triggered with a response
   * @return {void}
   */
  device.getChassisId = function(callback) {
    command(commands.getChassisId, null, callback);
  };

  /**
   *
   * The Set Chassis ID command assigns Sphero's chassis ID, a 16-bit value.
   *
   * This command only works if you're at the factory.
   *
   * @param {Number} chassisId new chassis ID
   * @param {Function} callback function to be triggered after writing
   * @return {void}
   */
  device.setChassisId = function(chassisId, callback) {
    chassisId = utils.intToHexArray(chassisId, 2);
    command(commands.getChassisId, chassisId, callback);
  };

  /**
   * The Self Level command controls Sphero's self-level routine.
   *
   * This routine attempts to achieve a horizontal orientation where pitch/roll
   * angles are less than the provided Angle Limit.
   *
   * After both limits are satisfied, option bits control sleep, final
   * angle(heading), and control system on/off.
   *
   * An asynchronous message is returned when the self level routine completes.
   *
   * For more detail on options, see the Sphero API documentation.
   *
   * @param {Object} opts self-level routine options
   * @param {Function} callback function to be triggered after writing
   * @return {void}
   */
  device.selfLevel = function(opts, callback) {
    var data = [
      opts.options,
      opts.angleLimit,
      opts.timeout,
      opts.trueTime
    ];
    command(commands.selfLevel, data, callback);
  };

  /**
   * The Set Data Streaming command configures Sphero's built-in support for
   * asynchronously streaming certain system and sensor data.
   *
   * This command selects the internal sampling frequency, packet size,
   * parameter mask, and (optionally) the total number of packets.
   *
   * These options are provided as an object, with the following properties:
   *
   * - **n** - divisor of the maximum sensor sampling rate
   * - **m** - number of sample frames emitted per packet
   * - **mask1** - bitwise selector of data sources to stream
   * - **pcnt** - packet count 1-255 (or 0, for unlimited streaming)
   * - **mask2** - bitwise selector of more data sources to stream (optional)
   *
   * For more explanation of these options, please see the Sphero API
   * documentation.
   *
   * @param {Object} opts object containing streaming data options
   * @param {Function} callback function to be triggered after writing
   * @return {void}
   */
  device.setDataStreaming = function(opts, callback) {
    var n = utils.intToHexArray(opts.n, 2),
        m = utils.intToHexArray(opts.m, 2),
        mask1 = utils.intToHexArray(opts.mask1, 4),
        pcnt = opts.pcnt &= 0xff,
        mask2 = utils.intToHexArray(opts.mask2, 4);

    device.ds = {
      mask1: opts.mask1,
      mask2: opts.mask2
    };

    var data = [].concat(n, m, mask1, pcnt, mask2);

    command(commands.setDataStreaming, data, callback);
  };

  /**
   * The Configure Collisions command configures Sphero's collision detection
   * with the provided parameters.
   *
   * These include:
   *
   * - **meth** - which detection method to use. Supported methods are 0x01,
   *   0x02, and 0x03 (see the collision detection document for details). 0x00
   *   disables this service.
   * - **xt, yt** - 8-bit settable threshold for the X (left, right) and
   *   y (front, back) axes of Sphero. 0x00 disables the contribution of that
   *   axis.
   * - **xs, ys** - 8-bit settable speed value for X/Y axes. This setting is
   *   ranged by the speed, than added to `xt` and `yt` to generate the final
   *   threshold value.
   * - **dead** - an 8-bit post-collision dead time to prevent re-triggering.
   *   Specified in 10ms increments.
   *
   * @param {Object} opts object containing collision configuration opts
   * @param {Function} cb function to be triggered after writing
   * @return {void}
   */
  device.configureCollisions = function(opts, cb) {
    var data = [
      opts.meth,
      opts.xt,
      opts.xs,
      opts.yt,
      opts.ys,
      opts.dead
    ];
    command(commands.setCollisionDetection, data, cb);
  };

  /**
   * The Configure Locator command configures Sphero's streaming location data
   * service.
   *
   * The following options must be provided:
   *
   * - **flags** - bit 0 determines whether calibrate commands auto-correct the
   *   yaw tare value. When false, positive Y axis coincides with heading 0.
   *   Other bits are reserved.
   * - **x, y** - the current (x/y) coordinates of Sphero on the ground plane in
   *   centimeters
   * - **yawTare** - controls how the x,y-plane is aligned with Sphero's heading
   *   coordinate system. When zero, yaw = 0 corresponds to facing down the
   *   y-axis in the positive direction. Possible values are 0-359 inclusive.
   *
   * @param {Object} opts object containing locator service configuration
   * @param {Function} callback function to be triggered after writing
   * @return {void}
   */
  device.configureLocator = function(opts, callback) {
    var flags = opts.flags & 0xFF,
        x = utils.intToHexArray(opts.x, 2),
        y = utils.intToHexArray(opts.y, 2),
        yawTare = utils.intToHexArray(opts.yawTare, 2);

    var data = [].concat(flags, x, y, yawTare);

    command(commands.locator, data, callback);
  };

  /**
   * The Set Accelerometer Range command tells Sphero what accelerometer range
   * to use.
   *
   * By default, Sphero's solid-state accelerometer is set for a range of ±8Gs.
   * You may wish to change this, perhaps to resolve finer accelerations.
   *
   * This command takes an index for the supported range, as explained below:
   *
   * - `0`: ±2Gs
   * - `1`: ±4Gs
   * - `2`: ±8Gs (default)
   * - `3`: ±16Gs
   *
   * @param {Number} idx what accelerometer range to use
   * @param {Function} callback function to be triggered after writing
   * @return {void}
   */
  device.setAccelRange = function(idx, callback) {
    idx &= idx;
    command(commands.setAccelerometer, [idx], callback);
  };

  /**
   * The Read Locator command gets Sphero's current position (X,Y), component
   * velocities, and speed-over-ground (SOG).
   *
   * The position is a signed value in centimeters, the component velocities are
   * signed cm/sec, and the SOG is unsigned cm/sec.
   *
   * @param {Function} callback function to be triggered with data
   * @return {void}
   */
  device.readLocator = function(callback) {
    command(commands.readLocator, null, callback);
  };

  /**
   * The Set RGB LED command sets the colors of Sphero's RGB LED.
   *
   * An object containaing `red`, `green`, and `blue` values must be provided.
   *
   * If `opts.flag` is set to 1 (default), the color is persisted across power
   * cycles.
   *
   * @param {Object} opts object containing RGB values for Sphero's LED
   * @param {Function} callback function to be triggered after writing
   * @return {void}
   */
  device.setRGBLed = function(opts, callback) {
    var data = [opts.red, opts.green, opts.blue, opts.flag || 0x01];

    for (var i = 0; i < data.length; i++) {
      data[i] &= 0xFF;
    }

    command(commands.setRGBLed, data, callback);
  };

  /**
   * The Set Back LED command allows brightness adjustment of Sphero's tail
   * light.
   *
   * This value does not persist across power cycles.
   *
   * @param {Number} brightness brightness to set to Sphero's tail light
   * @param {Function} callback function to be triggered after writing
   * @return {void}
   */
  device.setBackLed = function(brightness, callback) {
    command(commands.setBackLed, [brightness], callback);
  };

  /**
   * The Get RGB LED command fetches the current "user LED color" value, stored
   * in Sphero's configuration.
   *
   * This value may or may not be what's currently displayed by Sphero's LEDs.
   *
   * @param {Function} callback function to be triggered after writing
   * @return {void}
   */
  device.getRGBLed = function(callback) {
    command(commands.getRGBLed, null, callback);
  };

  /**
   * The Roll command tells Sphero to roll along the provided vector.
   *
   * Both a speed and heading are required, the latter is considered relative to
   * the last calibrated direction.
   *
   * Permissible heading values are 0 to 359 inclusive.
   *
   * @param {Number} speed what speed Sphero should roll at
   * @param {Number} heading what heading Sphero should roll towards (0-359)
   * @param {Number} [state] optional state parameter
   * @param {Function} callback function to be triggered after writing
   * @return {void}
   */
  device.roll = function(speed, heading, state, callback) {
    if (typeof state === "function" || typeof state === "undefined") {
      callback = state;
      state = 0x01;
    }

    speed &= 0xFF;
    heading = utils.intToHexArray(heading, 2);
    state &= 0x03;

    var data = [].concat(speed, heading, state);

    command(commands.roll, data, callback);
  };

  /**
   * The Boost command executes Sphero's boost macro.
   *
   * It takes a 1-byte parameter, 0x01 to start boosting, or 0x00 to stop.
   *
   * @param {Number} boost whether or not to boost (1 - yes, 0 - no)
   * @param {Function} callback function to be triggered after writing
   * @return {void}
   */
  device.boost = function(boost, callback) {
    boost &= 0x01;
    command(commands.boost, [boost], callback);
  };

  /**
   * The Set Raw Motors command allows manual control over one or both of
   * Sphero's motor output values.
   *
   * Each motor (left and right requires a mode and a power value from 0-255.
   *
   * This command will disable stabilization is both mode's aren't "ignore", so
   * you'll need to re-enable it once you're done.
   *
   * Possible modes:
   *
   * - `0x00`: Off (motor is open circuit)
   * - `0x01`: Forward
   * - `0x02`: Reverse
   * - `0x03`: Brake (motor is shorted)
   * - `0x04`: Ignore (motor mode and power is left unchanged
   *
   * @param {Object} opts object with mode/power values (e.g. lmode, lpower)
   * @param {Function} callback function to be triggered after writing
   * @return {void}
   */
  device.setRawMotors = function(opts, callback) {
    var lmode = opts.lmode & 0x07,
        lpower = opts.lpower & 0xFF,
        rmode = opts.rmode & 0x07,
        rpower = opts.rpower & 0xFF;

    var data = [lmode, lpower, rmode, rpower];

    command(commands.setRawMotors, data, callback);
  };

  /**
   * The Set Motion Timeout command gives Sphero an ultimate timeout for the
   * last motion command to keep Sphero from rolling away in the case of
   * a crashed (or paused) application.
   *
   * This defaults to 2000ms (2 seconds) upon wakeup.
   *
   * @param {Number} time timeout length in milliseconds
   * @param {Function} callback function to be triggered when done writing
   * @return {void}
   */
  device.setMotionTimeout = function(time, callback) {
    time = utils.intToHexArray(time, 2);
    command(commands.setMotionTimeout, time, callback);
  };

  /**
   * The Set Permanent Option Flags command assigns Sphero's permanent option
   * flags to the provided values, and writes them immediately to the config
   * block.
   *
   * See below for the bit definitions.
   *
   * @param {Array} flags permanent option flags
   * @param {Function} callback function to be triggered when done writing
   * @return {void}
   */
  device.setPermOptionFlags = function(flags, callback) {
    flags = utils.intToHexArray(flags, 4);
    command(commands.setOptionsFlag, flags, callback);
  };

  /**
   * The Get Permanent Option Flags command returns Sphero's permanent option
   * flags, as a bit field.
   *
   * Here's possible bit fields, and their descriptions:
   *
   * - `0`: Set to prevent Sphero from immediately going to sleep when placed in
   *   the charger and connected over Bluetooth.
   * - `1`: Set to enable Vector Drive, that is, when Sphero is stopped and
   *   a new roll command is issued it achieves the heading before moving along
   *   it.
   * - `2`: Set to disable self-leveling when Sphero is inserted into the
   *   charger.
   * - `3`: Set to force the tail LED always on.
   * - `4`: Set to enable motion timeouts (see DID 02h, CID 34h)
   * - `5`: Set to enable retail Demo Mode (when placed in the charger, ball
   *   runs a slow rainbow macro for 60 minutes and then goes to sleep).
   * - `6`: Set double tap awake sensitivity to Light
   * - `7`: Set double tap awake sensitivity to Heavy
   * - `8`: Enable gyro max async message (NOT SUPPORTED IN VERSION 1.47)
   * - `6-31`: Unassigned
   *
   * @param {Function} callback function triggered with option flags data
   * @return {void}
   */
  device.getPermOptionFlags = function(callback) {
    command(commands.getOptionsFlag, null, callback);
  };

  /**
   * The Set Temporary Option Flags command assigns Sphero's temporary option
   * flags to the provided values. These do not persist across power cycles.
   *
   * See below for the bit definitions.
   *
   * @param {Array} flags permanent option flags
   * @param {Function} callback function to be triggered when done writing
   * @return {void}
   */
  device.setTempOptionFlags = function(flags, callback) {
    flags = utils.intToHexArray(flags, 4);
    command(commands.setTempOptFlags, flags, callback);
  };

  /**
   * The Get Temporary Option Flags command returns Sphero's temporary option
   * flags, as a bit field:
   *
   * - `0`: Enable Stop On Disconnect behavior
   * - `1-31`: Unassigned
   *
   * @param {Function} callback function triggered with option flags data
   * @return {void}
   */
  device.getTempOptionFlags = function(callback) {
    command(commands.getTempOptFlags, null, callback);
  };

  /**
   * The Get Configuration Block command retrieves one of Sphero's configuration
   * blocks.
   *
   * The response is a simple one; an error code of 0x08 is returned when the
   * resources are currently unavailable to send the requested block back. The
   * actual configuration block data returns in an asynchronous message of type
   * 0x04 due to its length (if there is no error).
   *
   * ID = `0x00` requests the factory configuration block
   * ID = `0x01` requests the user configuration block, which is updated with
   * current values first
   *
   * @param {Number} id which configuration block to fetch
   * @param {Function} callback function to be triggered after writing
   * @return {void}
   */
  device.getConfigBlock = function(id, callback) {
    id &= 0xFF;
    command(commands.getConfigBlock, [id], callback);
  };

  device._setSSBBlock = function(cmd, pwd, block, callback) {
    pwd = utils.intToHexArray(pwd, 4);
    var data = [].concat(pwd, block);
    command(cmd, data, callback);
  };

  /**
   * The Set SSB Modifier Block command allows the SSB to be patched with a new
   * modifier block - including the Boost macro.
   *
   * The changes take effect immediately.
   *
   * @param {Number} pwd a 32 bit (4 bytes) hexadecimal value
   * @param {Array} block array of bytes with the data to be written
   * @param {Function} callback a function to be triggered after writing
   * @return {void}
   */
  device.setSSBModBlock = function(pwd, block, callback) {
    device._setSSBBlock(commands.setSSBParams, pwd, block, callback);
  };

  /**
   * The Set Device Mode command assigns the operation mode of Sphero based on
   * the supplied mode value.
   *
   * - **0x00**: Normal mode
   * - **0x01**: User Hack mode. Enables ASCII shell commands, refer to the
   *   associated document for details.
   *
   * @param {Number} mode which mode to set Sphero to
   * @param {Function} callback function to be called after writing
   * @return {void}
   */
  device.setDeviceMode = function(mode, callback) {
    mode &= 0x01;
    command(commands.setDeviceMode, [mode], callback);
  };

  /**
   * The Set Config Block command accepts an exact copy of the configuration
   * block, and loads it into the RAM copy of the configuration block.
   *
   * The RAM copy is then saved to flash.
   *
   * The configuration block can be obtained by using the Get Configuration
   * Block command.
   *
   * @param {Array} block - An array of bytes with the data to be written
   * @param {Function} callback - To be triggered when done
   * @return {void}
   */
  device.setConfigBlock = function(block, callback) {
    command(commands.setConfigBlock, block, callback);
  };

  /**
   * The Get Device Mode command gets the current device mode of Sphero.
   *
   * Possible values:
   *
   * - **0x00**: Normal mode
   * - **0x01**: User Hack mode.
   *
   * @param {Function} callback function to be called with response
   * @return {void}
   */
  device.getDeviceMode = function(callback) {
    command(commands.getDeviceMode, null, callback);
  };

  /**
   * The Get SSB command retrieves Sphero's Soul Block.
   *
   * The response is simple, and then the actual block of soulular data returns
   * in an asynchronous message of type 0x0D, due to it's 0x440 byte length
   *
   * @param {Function} callback function to be called with response
   * @return {void}
   */
  device.getSSB = function(callback) {
    command(commands.getSSB, null, callback);
  };

  /**
   * The Set SSB command sets Sphero's Soul Block.
   *
   * The actual payload length is 0x404 bytes, but if you use the special DLEN
   * encoding of 0xff, Sphero will know what to expect.
   *
   * You need to supply the password in order for it to work.
   *
   * @param {Number} pwd a 32 bit (4 bytes) hexadecimal value
   * @param {Array} block array of bytes with the data to be written
   * @param {Function} callback a function to be triggered after writing
   * @return {void}
   */
  device.setSSB = function(pwd, block, callback) {
    device._setSSBBlock(commands.setSSB, pwd, block, callback);
  };

  /**
   * The Refill Bank command attempts to refill either the Boost bank (0x00) or
   * the Shield bank (0x01) by attempting to deduct the respective refill cost
   * from the current number of cores.
   *
   * If it succeeds, the bank is set to the maximum obtainable for that level,
   * the cores are spent, and a success response is returned with the lower core
   * balance.
   *
   * If there aren't enough cores available to spend, Sphero responds with an
   * EEXEC error (0x08)
   *
   * @param {Number} type what bank to refill (0 - Boost, 1 - Shield)
   * @param {Function} callback function to be called with response
   * @return {void}
   */
  device.refillBank = function(type, callback) {
    type &= 0xFF;
    command(commands.ssbRefill, [type], callback);
  };

  /**
   * The Buy Consumable command attempts to spend cores on consumables.
   *
   * The consumable ID is given (0 - 7), as well as the quantity requested to
   * purchase.
   *
   * If the purchase succeeds, the consumable count is increased, the cores are
   * spent, and a success response is returned with the increased quantity and
   * lower balance.
   *
   * If there aren't enough cores available to spend, or the purchase would
   * exceed the max consumable quantity of 255, Sphero responds with an EEXEC
   * error (0x08)
   *
   * @param {Number} id what consumable to buy
   * @param {Number} qty how many consumables to buy
   * @param {Function} callback function to be called with response
   * @return {void}
   */
  device.buyConsumable = function(id, qty, callback) {
    id &= 0xFF;
    qty &= 0xFF;
    command(commands.ssbBuy, [id, qty], callback);
  };

  /**
   * The Use Consumable command attempts to use a consumable if the quantity
   * remaining is non-zero.
   *
   * On success, the return message echoes the ID of this consumable and how
   * many of them remain.
   *
   * If the associated macro is already running, or the quantity remaining is
   * zero, this returns an EEXEC error (0x08).
   *
   * @param {Number} id what consumable to use
   * @param {Function} callback function to be called with response
   * @return {void}
   */
  device.useConsumable = function(id, callback) {
    id &= 0xFF;
    command(commands.ssbUseConsumeable, [id], callback);
  };

  /**
   * The Grant Cores command adds the supplied number of cores.
   *
   * If the first bit in the flags byte is set, the command immediately commits
   * the SSB to flash. Otherwise, it does not.
   *
   * All other bits are reserved.
   *
   * If the password is not accepted, this command fails without consequence.
   *
   * @param {Number} pw 32-bit password
   * @param {Number} qty 32-bit number of cores to add
   * @param {Number} flags 8-bit flags byte
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.grantCores = function(pw, qty, flags, callback) {
    pw = utils.intToHexArray(pw, 4);
    qty = utils.intToHexArray(qty, 4);
    flags &= 0xFF;

    var data = [].concat(pw, qty, flags);

    command(commands.ssbGrantCores, data, callback);
  };

  device._xpOrLevelUp = function(cmd, pw, gen, cb) {
    pw = utils.intToHexArray(pw, 4);
    gen &= 0xFF;

    command(cmd, [].concat(pw, gen), cb);
  };

  /**
   * The Grant XP command increases XP by adding the supplied number of minutes
   * of drive time, and immediately commits the SSB to flash.
   *
   * If the password is not accepted, this command fails without consequence.
   *
   * @param {Number} pw 32-bit password
   * @param {Number} qty 8-bit number of minutes of drive time to add
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.addXp = function(pw, qty, callback) {
    device._xpOrLevelUp(commands.ssbAddXp, pw, qty, callback);
  };

  /**
   * The Level Up Attribute command attempts to increase the level of the
   * specified attribute by spending attribute points.
   *
   * The IDs are:
   *
   * - **0x00**: speed
   * - **0x01**: boost
   * - **0x02**: brightness
   * - **0x03**: shield
   *
   *
   * If successful, the SSB is committed to flash, and a response packet
   * containing the attribute ID, new level, and remaining attribute points is
   * returned.
   *
   * If there are not enough attribute points, this command returns an EEXEC
   * error (0x08).
   *
   * If the password is not accepted, this command fails without consequence.
   *
   * @param {Number} pw 32-bit password
   * @param {Number} id which attribute to level up
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.levelUpAttr = function(pw, id, callback) {
    device._xpOrLevelUp(commands.ssbLevelUpAttr, pw, id, callback);
  };

  /**
   * The Get Password Seed command returns Sphero's password seed.
   *
   * Protected Sphero commands require a password.
   *
   * Refer to the Sphero API documentation, Appendix D for more information.
   *
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.getPasswordSeed = function(callback) {
    command(commands.getPwSeed, null, callback);
  };

  /**
   * The Enable SSB Async Messages command turns on/off soul block related
   * asynchronous messages.
   *
   * These include shield collision/regrowth messages, boost use/regrowth
   * messages, XP growth, and level-up messages.
   *
   * This feature defaults to off.
   *
   * @param {Number} flag whether or not to enable async messages
   * @param {Function} callback function to be triggered after write
   * @return {void}
   */
  device.enableSSBAsyncMsg = function(flag, callback) {
    flag &= 0x01;
    command(commands.ssbEnableAsync, [flag], callback);
  };

  /**
   * The Run Macro command attempts to execute the specified macro.
   *
   * Macro IDs are split into groups:
   *
   * 0-31 are System Macros. They are compiled into the Main Application, and
   * cannot be deleted. They are always available to run.
   *
   * 32-253 are User Macros. They are downloaded and persistently stored, and
   * can be deleted in total.
   *
   * 255 is the Temporary Macro, a special user macro as it is held in RAM for
   * execution.
   *
   * 254 is also a special user macro, called the Stream Macro that doesn't
   * require this call to begin execution.
   *
   * This command will fail if there is a currently executing macro, or the
   * specified ID code can't be found.
   *
   * @param {Number} id 8-bit Macro ID to run
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.runMacro = function(id, callback) {
    id &= 0xFF;
    command(commands.runMacro, [id], callback);
  };

  /**
   * The Save Temporary Macro stores the attached macro definition into the
   * temporary RAM buffer for later execution.
   *
   * If this command is sent while a Temporary or Stream Macro is executing it
   * will be terminated so that its storage space can be overwritten. As with
   * all macros, the longest definition that can be sent is 254 bytes.
   *
   * @param {Array} macro array of bytes with the data to be written
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.saveTempMacro = function(macro, callback) {
    command(commands.saveTempMacro, macro, callback);
  };

  /** Save macro
   *
   * The Save Macro command stores the attached macro definition into the
   * persistent store for later execution. This command can be sent even if
   * other macros are executing.
   *
   * You will receive a failure response if you attempt to send an ID number in
   * the System Macro range, 255 for the Temp Macro and ID of an existing user
   * macro in the storage block.
   *
   * As with all macros, the longest definition that can be sent is 254 bytes.
   *
   * @param {Array} macro array of bytes with the data to be written
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.saveMacro = function(macro, callback) {
    command(commands.saveMacro, macro, callback);
  };

  /**
   * The Reinit Macro Executive command terminates any running macro, and
   * reinitializes the macro system.
   *
   * The table of any persistent user macros is cleared.
   *
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.reInitMacroExec = function(callback) {
    command(commands.initMacroExecutive, null, callback);
  };

  /**
   * The Abort Macro command aborts any executing macro, and returns both it's
   * ID code and the command number currently in progress.
   *
   * An exception is a System Macro executing with the UNKILLABLE flag set.
   *
   * A returned ID code of 0x00 indicates that no macro was running, an ID code
   * of 0xFFFF as the CmdNum indicates the macro was unkillable.
   *
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.abortMacro = function(callback) {
    command(commands.abortMacro, null, callback);
  };

  /**
   * The Get Macro Status command returns the ID code and command number of the
   * currently executing macro.
   *
   * If no macro is running, the 0x00 is returned for the ID code, and the
   * command number is left over from the previous macro.
   *
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.getMacroStatus = function(callback) {
    command(commands.macroStatus, null, callback);
  };

  /**
   * The Set Macro Parameter command allows system globals that influence
   * certain macro commands to be selectively altered from outside of the macro
   * system itself.
   *
   * The values of Val1 and Val2 depend on the parameter index.
   *
   * Possible indices:
   *
   * - **00h** Assign System Delay 1: Val1 = MSB, Val2 = LSB
   * - **01h** Assign System Delay 2: Val1 = MSB, Val2 = LSB
   * - **02h** Assign System Speed 1: Val1 = speed, Val2 = 0 (ignored)
   * - **03h** Assign System Speed 2: Val1 = speed, Val2 = 0 (ignored)
   * - **04h** Assign System Loops: Val1 = loop count, Val2 = 0 (ignored)
   *
   * For more details, please refer to the Sphero Macro document.
   *
   * @param {Number} index what parameter index to use
   * @param {Number} val1 value 1 to set
   * @param {Number} val2 value 2 to set
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.setMacroParam = function(index, val1, val2, callback) {
    command(
      commands.setMacroParam,
      utils.argsToHexArray(index, val1, val2),
      callback
    );
  };

  /**
   * The Append Macro Chunk project stores the attached macro definition into
   * the temporary RAM buffer for later execution.
   *
   * It's similar to the Save Temporary Macro command, but allows building up
   * longer temporary macros.
   *
   * Any existing Macro ID can be sent through this command, and executed
   * through the Run Macro call using ID 0xFF.
   *
   * If this command is sent while a Temporary or Stream Macro is executing it
   * will be terminated so that its storage space can be overwritten. As with
   * all macros, the longest chunk that can be sent is 254 bytes.
   *
   * You must follow this with a Run Macro command (ID 0xFF) to actually get it
   * to go and it is best to prefix this command with an Abort call to make
   * certain the larger buffer is completely initialized.
   *
   * @param {Array} chunk macro chunk to write
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.appendMacroChunk = function(chunk, callback) {
    command(commands.appendTempMacroChunk, chunk, callback);
  };

  /**
   * The Erase orbBasic Storage command erases any existing program in the
   * specified storage area.
   *
   * Specify 0x00 for the temporary RAM buffer, or 0x01 for the persistent
   * storage area.
   *
   * @param {Number} area which area to erase
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.eraseOrbBasicStorage = function(area, callback) {
    area &= 0xFF;
    command(commands.eraseOBStorage, [area], callback);
  };

  /**
   * The Append orbBasic Fragment command appends a patch of orbBasic code to
   * existing ones in the specified storage area (0x00 for RAM, 0x01 for
   * persistent).
   *
   * Complete lines are not required. A line begins with a decimal line number
   * followed by a space and is terminated with a <LF>.
   *
   * See the orbBasic Interpreter document for complete information.
   *
   * Possible error responses would be ORBOTIX_RSP_CODE_EPARAM if an illegal
   * storage area is specified or ORBOTIX_RSP_CODE_EEXEC if the specified
   * storage area is full.
   *
   * @param {Number} area which area to append the fragment to
   * @param {String} code orbBasic code to append
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.appendOrbBasicFragment = function(area, code, callback) {
    area &= 0xFF;
    var data = [].concat(area, code);
    command(commands.appendOBFragment, data, callback);
  };

  /**
   * The Execute orbBasic Program command attempts to run a program in the
   * specified storage area, beginning at the specified line number.
   *
   * This command will fail if there is already an orbBasic program running.
   *
   * @param {Number} area which area to run from
   * @param {Number} slMSB start line
   * @param {Number} slLSB start line
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.executeOrbBasicProgram = function(area, slMSB, slLSB, callback) {
    command(
      commands.execOBProgram,
      utils.argsToHexArray(area, slMSB, slLSB),
      callback
    );
  };

  /**
   * The Abort orbBasic Program command aborts execution of any currently
   * running orbBasic program.
   *
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.abortOrbBasicProgram = function(callback) {
    command(commands.abortOBProgram, null, callback);
  };

  /**
   * The Submit value To Input command takes the place of the typical user
   * console in orbBasic and allows a user to answer an input request.
   *
   * If there is no pending input request when this API command is sent, the
   * supplied value is ignored without error.
   *
   * Refer to the orbBasic language document for further information.
   *
   * @param {Number} val value to respond with
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.submitValueToInput = function(val, callback) {
    val = utils.intToHexArray(val, 4);
    command(commands.answerInput, val, callback);
  };

  /**
   * The Commit To Flash command copies the current orbBasic RAM program to
   * persistent flash storage.
   *
   * It will fail if a program is currently executing out of flash.
   *
   * @param {Function} callback function to be triggered with response
   * @return {void}
   */
  device.commitToFlash = function(callback) {
    command(commands.commitToFlash, null, callback);
  };

  device._commitToFlashAlias = function(callback) {
    command(commands.commitToFlashAlias, null, callback);
  };
};

},{"../commands/sphero":6,"../utils":15}],10:[function(require,module,exports){
"use strict";

var debug = require("debug")("loader");

function isSerialPort(str) {
  // use regexp to determine whether or not 'str' is a serial port
  return /(\/dev\/|com\d+).*/i.test(str);
}

/**
 * Loads an adaptor based on provided connection string and system state
 *
 * @param {String} conn connection string (serial port or BLE UUID)
 * @return {Object} adaptor instance
 */
module.exports.load = function load(conn) {
  var isSerial = isSerialPort(conn),
      isChrome = typeof chrome !== "undefined",
      Adaptor;

  if (isSerial) {
    debug("Loading serialport adaptor for connection: " + conn);
    Adaptor = require("./adaptors/serialport");
  } else if (isChrome) {
    debug("Loading Chrome BLE adaptor for connection: " + conn);
    // load chrome BLE adaptor
  } else {
    debug("Loading BLE adaptor for connection: " + conn);
    // load BLE adaptor (noble?)
  }

  return new Adaptor(conn);
};

},{"./adaptors/serialport":3,"debug":17}],11:[function(require,module,exports){
(function (Buffer){
"use strict";

var inherits = require("util").inherits,
    EventEmitter = require("events").EventEmitter;

var utils = require("./utils"),
    RES_PARSER = require("./parsers/response.js"),
    ASYNC_PARSER = require("./parsers/async.js");

var MIN_BUFFER_SIZE = 6,
    FIELDS = {
      size: 5,
      sop1: {
        pos: 0,
        hex: 0xFF
      },
      sop2: {
        pos: 1,
        sync: 0xFF,
        async: 0xFE,
      },
      mrspHex: 0x00,
      seqHex: 0x00,
      mrspIdCode: 2,
      seqMsb: 3,
      dlenLsb: 4,
      checksum: 5,
      didHex: 0x00,
      cidHex: 0x01
    };

var Packet = module.exports = function() {
  this.partialBuffer = new Buffer(0);
  this.partialCounter = 0;
};

inherits(Packet, EventEmitter);

Packet.prototype.create = function(opts) {
  opts = opts || {};

  var sop1 = (opts.sop1 === undefined) ? FIELDS.sop1.hex : opts.sop1,
      sop2 = (opts.sop2 === undefined) ? FIELDS.sop2.sync : opts.sop2,
      did = (opts.did === undefined) ? FIELDS.didHex : opts.did,
      cid = (opts.cid === undefined) ? FIELDS.cidHex : opts.cid,
      seq = (opts.seq === undefined) ? FIELDS.seqHex : opts.seq,
      data = (!opts.data) ? [] : opts.data,
      // Add 1 to dlen, since it also counts the checksum byte
      dlen = data.length + 1,
      checksum = 0x00;

  // Create array with packet bytes
  var packet = [
    sop1, sop2, did, cid, seq, dlen
  ].concat(data);

  // Get checksum for final byte in packet
  checksum = utils.checksum(packet.slice(2));

  // Add checksum to packet
  packet.push(checksum);

  return packet;
};

Packet.prototype.parse = function(buffer) {
  if (this.partialBuffer.length > 0) {
    buffer = Buffer.concat(
      [this.partialBuffer, buffer],
      buffer.length + this.partialBuffer.length
    );

    this.partialBuffer = new Buffer(0);
  } else {
    this.partialBuffer = new Buffer(buffer);
  }

  if (this._checkSOPs(buffer)) {
    // Check the packet is at least 6 bytes long
    if (this._checkMinSize(buffer)) {
      // Check the buffer length matches the
      // DLEN value specified in the buffer
      if (this._checkExpectedSize(buffer) > -1) {
        // If the packet looks good parse it
        return this._parse(buffer);
      }
    }

    this.partialBuffer = new Buffer(buffer);
  }

  return null;
};

Packet.prototype._parse = function(buffer) {
  var packet = {};
  packet.sop1 = buffer[FIELDS.sop1.pos];
  packet.sop2 = buffer[FIELDS.sop2.pos];

  var bByte2 = buffer[FIELDS.mrspIdCode],
      bByte3 = buffer[FIELDS.seqMsb],
      bByte4 = buffer[FIELDS.dlenLsb];

  if (FIELDS.sop2.sync === buffer[FIELDS.sop2.pos]) {
    packet.mrsp = bByte2;
    packet.seq = bByte3;
    packet.dlen = bByte4;
  } else {
    packet.idCode = bByte2;
    packet.dlenMsb = bByte3;
    packet.dlenLsb = bByte4;
  }

  packet.dlen = this._extractDlen(buffer);

  // Create new Buffer for data that is dlen -1 (minus checksum) in size
  packet.data = new Buffer(packet.dlen - 1);
  // Copy data from buffer into packet.data
  buffer.copy(packet.data, 0, FIELDS.size, FIELDS.size + packet.dlen - 1);
  packet.checksum = buffer[FIELDS.size + packet.dlen - 1];

  this._dealWithExtraBytes(buffer);

  return this._verifyChecksum(buffer, packet);
};

Packet.prototype._dealWithExtraBytes = function(buffer) {
  // If the packet was parsed successfully, and the buffer and
  // expected size of the buffer are the same,clean up the
  // partialBuffer, otherwise assign extrabytes to partialBuffer
  var expectedSize = this._checkExpectedSize(buffer);
  if (buffer.length > expectedSize) {
    this.partialBuffer = new Buffer(buffer.length - expectedSize);
    buffer.copy(this.partialBuffer, 0, expectedSize);
  } else {
    this.partialBuffer = new Buffer(0);
  }
};

Packet.prototype._verifyChecksum = function(buffer, packet) {
  var bSlice = buffer.slice(
        FIELDS.mrspIdCode,
        FIELDS.checksum + packet.dlen - 1
      ),
      checksum = utils.checksum(bSlice);

  // If we got an incorrect checksum we cleanup the packet,
  // partialBuffer, return null and emit an error event
  if (checksum !== packet.checksum) {
    packet = null;
    this.partialBuffer = new Buffer(0);
    this.emit("error", new Error("Incorrect checksum, packet discarded!"));
  }

  return packet;
};

Packet.prototype.parseAsyncData = function(payload, ds) {
  var parser = ASYNC_PARSER[payload.idCode];

  return this._parseData(parser, payload, ds);
};

Packet.prototype.parseResponseData = function(cmd, payload) {
  if (!cmd) {
    return payload;
  }

  var parserId = cmd.did.toString(16) + ":" + cmd.cid.toString(16),
      parser = RES_PARSER[parserId];

  return this._parseData(parser, payload);
};

Packet.prototype._parseData = function(parser, payload, ds) {
  var data = payload.data,
      pData, fields, field;


  if (parser && (data.length > 0)) {

    ds = this._checkDSMasks(ds, parser);

    if (ds === -1) {
      return payload;
    }

    fields = parser.fields;

    pData = {
      desc: parser.desc,
      idCode: parser.idCode,
      event: parser.event,
      did: parser.did,
      cid: parser.cid,
      packet: payload
    };

    var dsIndex = 0,
        dsFlag = 0,
        i = 0;

    while (i < fields.length) {
      field = fields[i];

      dsFlag = this._checkDSBit(ds, field);

      if (dsFlag === 1) {
        field.from = dsIndex;
        field.to = dsIndex = dsIndex + 2;
      } else if (dsFlag === 0) {
        i = this._incParserIndex(i, fields, data, dsFlag, dsIndex);
        continue;
      }

      pData[field.name] = this._parseField(field, data, pData, dsFlag);

      i = this._incParserIndex(i, fields, data, dsFlag, dsIndex);
    }
  } else {
    pData = payload;
  }

  return pData;
};

Packet.prototype._checkDSMasks = function(ds, parser) {
  if (parser.idCode === 0x03) {
    if (!(ds && ds.mask1 != null && ds.mask2 != null)) {
      return -1;
    }
  } else {
    return null;
  }

  return ds;
};

Packet.prototype._incParserIndex = function(i, fields, data, dsFlag, dsIndex) {
  i++;
  if ((dsFlag >= 0) && (i === fields.length) && (dsIndex < data.length)) {
    i = 0;
  }
  return i;
};

Packet.prototype._checkDSBit = function(ds, field) {
  if (!ds) {
    return -1;
  }

  if (Math.abs(ds[field.maskField] & field.bitmask) > 0) {
    return 1;
  }

  return 0;
};

Packet.prototype._parseField = function(field, data, pData, dsFlag) {
  if (dsFlag === 0) {
    return undefined;
  }

  var pField;

  data = data.slice(field.from, field.to);
  pField = utils.bufferToInt(data);

  switch (field.type) {
    case "number":
      if (field.format === "hex") {
        pField = pField.toString(16);
      }
      break;
    case "string":
      pField = data.toString(field.format).replace(/\0/g, "0");
      break;
    case "raw":
      pField = new Buffer(data);
      break;
    case "predefined":
      if (field.mask != null) {
        pField &= field.mask;
      }
      pField = field.values[pField];
      break;
    case "bitmask":
      pField = this._parseBitmaskField(pField, field, pData);
      break;
    default:
      this.emit("error", new Error("Data could not be parsed!"));
      pField = "Data could not be parsed!";
      break;
  }

  return pField;
};

Packet.prototype._parseBitmaskField = function(val, field, pData) {
  var pField = {};

  if (val > field.range.top) {
    val = utils.twosToInt(val, 2);
  }

  if (pData[field.name]) {
    pField = pData[field.name];
    pField.value.push(val);
  } else {
    pField = {
      sensor: field.sensor,
      range: field.range,
      units: field.units,
      value: [val]
    };
  }

  return pField;
};

Packet.prototype._checkSOPs = function(buffer) {
  return (this._checkSOP1(buffer)) ? this._checkSOP2(buffer) : false;
};

Packet.prototype._checkSOP1 = function(buffer) {
  return (buffer[FIELDS.sop1.pos] === FIELDS.sop1.hex);
};

Packet.prototype._checkSOP2 = function(buffer) {
  var sop2 = buffer[FIELDS.sop2.pos];

  if (sop2 === FIELDS.sop2.sync) {
    return "sync";
  } else if (sop2 === FIELDS.sop2.async) {
    return "async";
  }

  return false;
};

Packet.prototype._checkExpectedSize = function(buffer) {
  // Size = buffer fields size (SOP1, SOP2, MSRP, SEQ and DLEN) + DLEN value
  var expectedSize = FIELDS.size + this._extractDlen(buffer),
      bufferSize = buffer.length;

  return (bufferSize < expectedSize) ? -1 : expectedSize;
};

Packet.prototype._checkMinSize = function(buffer) {
  return (buffer.length >= MIN_BUFFER_SIZE);
};

Packet.prototype._extractDlen = function(buffer) {
  if (buffer[FIELDS.sop2.pos] === FIELDS.sop2.sync) {
    return buffer[FIELDS.dlenLsb];
  }

  // We shift the dlen MSB 8 bits and then do a binary OR
  // between the two values to obtain the dlen value
  return (buffer[FIELDS.seqMsb] << 8) | buffer[FIELDS.dlenLsb];
};

}).call(this,require("buffer").Buffer)
},{"./parsers/async.js":12,"./parsers/response.js":13,"./utils":15,"buffer":63,"events":67,"util":92}],12:[function(require,module,exports){
"use strict";

module.exports = {
  0x01: {
    desc: "Battery Power State",
    idCode: 0x01,
    did: 0x00,
    cid: 0x21,
    event: "battery",
    fields: [
      {
        name: "state",
        type: "predefined",
        values: {
          0x01: "Battery Charging",
          0x02: "Battery OK",
          0x03: "Battery Low",
          0x04: "Battery Critical"
        }
      }
    ]
  },
  0x02: {
    desc: "Level 1 Diagnostic Response",
    idCode: 0x02,
    did: 0x00,
    cid: 0x40,
    event: "level1Diagnostic",
    fields: [
      {
        name: "diagnostic",
        type: "string",
        format: "ascii",
        from: 0,
        to: undefined
      }
    ]
  },
  0x03: {
    desc: "Sensor Data Streaming",
    idCode: 0x03,
    did: 0x02,
    cid: 0x11,
    event: "dataStreaming",
    fields: [
      {
        name: "xAccelRaw",
        type: "bitmask",
        bitmask: 0x80000000,
        maskField: "mask1",
        sensor: "accelerometer axis X, raw",
        range: {
          bottom: -2048,
          top: 2047
        },
        units: "4mg"
      },
      {
        name: "yAccelRaw",
        type: "bitmask",
        bitmask: 0x40000000,
        maskField: "mask1",
        sensor: "accelerometer axis Y, raw",
        range: {
          bottom: -2048,
          top: 2047
        },
        units: "4mG"
      },
      {
        name: "zAccelRaw",
        type: "bitmask",
        bitmask: 0x20000000,
        maskField: "mask1",
        sensor: "accelerometer axis Z, raw",
        range: {
          bottom: -2048,
          top: 2047
        },
        units: "4mG"
      },
      {
        name: "xGyroRaw",
        type: "bitmask",
        bitmask: 0x10000000,
        maskField: "mask1",
        sensor: "gyroscope axis X, raw",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "0.068 degrees"
      },
      {
        name: "yGyroRaw",
        type: "bitmask",
        bitmask: 0x08000000,
        maskField: "mask1",
        sensor: "gyroscope axis Y, raw",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "0.068 degrees"
      },
      {
        name: "zGyroRaw",
        type: "bitmask",
        bitmask: 0x04000000,
        maskField: "mask1",
        sensor: "gyroscope axis Z, raw",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "0.068 degrees"
      },
      {
        name: "rMotorBackEMFRaw",
        type: "bitmask",
        bitmask: 0x00400000,
        maskField: "mask1",
        sensor: "right motor back EMF, raw",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "22.5cm"
      },
      {
        name: "lMotorBackEMFRaw",
        type: "bitmask",
        bitmask: 0x00200000,
        maskField: "mask1",
        sensor: "left motor back EMF, raw",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "22.5cm"
      },
      {
        name: "lMotorPWMRaw",
        type: "bitmask",
        bitmask: 0x00100000,
        maskField: "mask1",
        sensor: "left motor PWM, raw",
        range: {
          bottom: -2048,
          top: 2047
        },
        units: "dutyCycle"
      },
      {
        name: "rMotorPWMRaw",
        type: "bitmask",
        bitmask: 0x00080000,
        maskField: "mask1",
        sensor: "right motor PWM, raw",
        range: {
          bottom: -2048,
          top: 2047
        },
        units: "dutyCycle"
      },
      {
        name: "pitchAngle",
        type: "bitmask",
        bitmask: 0x00040000,
        maskField: "mask1",
        sensor: "IMU pitch angle, filtered",
        range: {
          bottom: -179,
          top: 180
        },
        units: "degrees"
      },
      {
        name: "rollAngle",
        type: "bitmask",
        bitmask: 0x00020000,
        maskField: "mask1",
        sensor: "IMU roll angle, filtered",
        range: {
          bottom: -179,
          top: 180
        },
        units: "degrees"
      },
      {
        name: "yawAngle",
        type: "bitmask",
        bitmask: 0x00010000,
        maskField: "mask1",
        sensor: "IMU yaw angle, filtered",
        range: {
          bottom: -179,
          top: 180
        },
        units: "degrees"
      },
      {
        name: "xAccel",
        type: "bitmask",
        bitmask: 0x00008000,
        maskField: "mask1",
        sensor: "accelerometer axis X, filtered",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "1/4096 G"
      },
      {
        name: "yAccel",
        type: "bitmask",
        bitmask: 0x00004000,
        maskField: "mask1",
        sensor: "accelerometer axis Y, filtered",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "1/4096 G"
      },
      {
        name: "zAccel",
        type: "bitmask",
        bitmask: 0x00002000,
        maskField: "mask1",
        sensor: "accelerometer axis Z, filtered",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "1/4096 G"
      },
      {
        name: "xGyro",
        type: "bitmask",
        bitmask: 0x00001000,
        maskField: "mask1",
        sensor: "gyro axis X, filtered",
        range: {
          bottom: -20000,
          top: 20000
        },
        units: "0.1 dps"
      },
      {
        name: "yGyro",
        type: "bitmask",
        bitmask: 0x00000800,
        maskField: "mask1",
        sensor: "gyro axis Y, filtered",
        range: {
          bottom: -20000,
          top: 20000
        },
        units: "0.1 dps"
      },
      {
        name: "zGyro",
        type: "bitmask",
        bitmask: 0x00000400,
        maskField: "mask1",
        sensor: "gyro axis Z, filtered",
        range: {
          bottom: -20000,
          top: 20000
        },
        units: "0.1 dps"
      },
      {
        name: "rMotorBackEMF",
        type: "bitmask",
        bitmask: 0x00000040,
        maskField: "mask1",
        sensor: "right motor back EMF, filtered",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "22.5 cm"
      },
      {
        name: "lMotorBackEMF",
        type: "bitmask",
        bitmask: 0x00000020,
        maskField: "mask1",
        sensor: "left motor back EMF, filtered",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "22.5 cm"
      },
      {
        name: "quaternionQ0",
        type: "bitmask",
        bitmask: 0x80000000,
        maskField: "mask2",
        sensor: "quaternion Q0",
        range: {
          bottom: -10000,
          top: 10000
        },
        units: "1/10000 Q"
      },
      {
        name: "quaternionQ1",
        type: "bitmask",
        bitmask: 0x40000000,
        maskField: "mask2",
        sensor: "quaternion Q1",
        range: {
          bottom: -10000,
          top: 10000
        },
        units: "1/10000 Q"
      },
      {
        name: "quaternionQ2",
        type: "bitmask",
        bitmask: 0x20000000,
        maskField: "mask2",
        sensor: "quaternion Q2",
        range: {
          bottom: -10000,
          top: 10000
        },
        units: "1/10000 Q"
      },
      {
        name: "quaternionQ3",
        type: "bitmask",
        bitmask: 0x10000000,
        maskField: "mask2",
        sensor: "quaternion Q3",
        range: {
          bottom: -10000,
          top: 10000
        },
        units: "1/10000 Q"
      },
      {
        name: "xOdometer",
        type: "bitmask",
        bitmask: 0x08000000,
        maskField: "mask2",
        sensor: "odomoter X",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "cm"
      },
      {
        name: "yOdometer",
        type: "bitmask",
        bitmask: 0x04000000,
        maskField: "mask2",
        sensor: "odomoter Y",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "cm"
      },
      {
        name: "accelOne",
        type: "bitmask",
        bitmask: 0x02000000,
        maskField: "mask2",
        sensor: "acceleration one",
        range: {
          bottom: 0,
          top: 8000
        },
        units: "1mG"
      },
      {
        name: "xVelocity",
        type: "bitmask",
        bitmask: 0x01000000,
        maskField: "mask2",
        sensor: "velocity X",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "mm/s"
      },
      {
        name: "yVelocity",
        type: "bitmask",
        bitmask: 0x00800000,
        maskField: "mask2",
        sensor: "velocity Y",
        range: {
          bottom: -32768,
          top: 32767
        },
        units: "mm/s"
      }
    ]
  },
  0x04: {
    desc: "Config Block Contents",
    idCode: 0x04,
    did: 0x02,
    cid: 0x40,
    event: "configBlock",
    fields: [
      {
        name: "content",
        type: "raw",
      }
    ]
  },
  0x05: {
    desc: "Pre-sleep Warning",
    idCode: 0x05,
    did: null,
    cid: null,
    event: "preSleepWarning",
    fields: [
      {
        name: "content",
        type: "raw",
      }
    ]
  },
  0x06: {
    desc: "Macro Markers",
    idCode: 0x06,
    did: null,
    cid: null,
    event: "macroMarkers",
    fields: [
      {
        name: "content",
        type: "raw",
      }
    ]
  },
  0x07: {
    desc: "Collision detected",
    idCode: 0x07,
    did: 0x02,
    cid: 0x12,
    event: "collision",
    fields: [
      {
        name: "x",
        type: "number",
        from: 0,
        to: 2
      },
      {
        name: "y",
        type: "number",
        from: 2,
        to: 4
      },
      {
        name: "z",
        type: "number",
        from: 4,
        to: 6
      },
      {
        name: "axis",
        type: "number",
        from: 6,
        to: 7
      },
      {
        name: "xMagnitude",
        type: "number",
        from: 7,
        to: 9
      },
      {
        name: "yMagnitude",
        type: "number",
        from: 9,
        to: 11
      },
      {
        name: "speed",
        type: "number",
        from: 11,
        to: 12
      },
      {
        name: "timestamp",
        type: "number",
        from: 12,
        to: 16
      }
    ]
  },
  0x08: {
    desc: "Orb-basic Print Message",
    idCode: 0x08,
    did: null,
    cid: null,
    event: "obPrint",
    fields: [
      {
        name: "content",
        type: "raw",
      }
    ]
  },
  0x09: {
    desc: "Orb-basic ASCII Error Message",
    idCode: 0x09,
    did: null,
    cid: null,
    event: "obAsciiError",
    fields: [
      {
        name: "content",
        type: "string",
        format: "ascii",
        from: 0,
        to: undefined
      }
    ]
  },
  0x0A: {
    desc: "Orb-basic Binary Error Message",
    idCode: 0x0A,
    did: null,
    cid: null,
    event: "obBinaryError",
    fields: [
      {
        name: "content",
        type: "raw",
      }
    ]
  },
  0x0B: {
    desc: "Self Level",
    idCode: 0x0B,
    did: 0x02,
    cid: 0x09,
    event: "selfLevel",
    fields: [
      {
        name: "result",
        type: "predefined",
        values: {
          0x00: "Unknown",
          0x01: "Timed Out (level was not achived)",
          0x02: "Sensors Error",
          0x03: "Self Level Disabled (see Option flags)",
          0x04: "Aborted (by API call)",
          0x05: "Charger Not Found",
          0x06: "Success"
        }
      }
    ]
  },
  0x0C: {
    desc: "Gyro Axis Limit Exceeded",
    idCode: 0x0C,
    did: null,
    cid: null,
    event: "gyroAxisExceeded",
    fields: [
      {
        name: "x",
        type: "predefined",
        mask: 0x03,
        values: {
          0x00: "none",
          0x01: "positive",
          0x02: "negative"
        }
      },
      {
        name: "y",
        type: "predefined",
        mask: 0x0C,
        values: {
          0x00: "none",
          0x04: "positive",
          0x08: "negative"
        }
      },
      {
        name: "z",
        type: "predefined",
        mask: 0x30,
        values: {
          0x00: "none",
          0x10: "positive",
          0x20: "negative"
        }
      }
    ]
  },
  0x0D: {
    desc: "Sphero's Soul Data",
    idCode: 0x0D,
    did: 0x02,
    cid: 0x43,
    event: "spheroSoulData",
    fields: [
      {
        name: "content",
        type: "raw",
      }
    ]
  },
  0x0E: {
    desc: "Level Up",
    idCode: 0x0E,
    did: null,
    cid: null,
    event: "levelUp",
    fields: [
      {
        name: "robotLevel",
        type: "number",
        from: 0,
        to: 2
      },
      {
        name: "attributePoints",
        type: "number",
        from: 2,
        to: 4
      }
    ]
  },
  0x0F: {
    desc: "Shield Damage",
    idCode: 0x0F,
    did: null,
    cid: null,
    event: "shieldDamage",
    fields: [
      {
        name: "robotLevel",
        type: "number",
        from: 0,
        to: 1
      },
    ]
  },
  0x10: {
    desc: "XP % towards next robot level (0 = 0%, 255 = 100%)",
    idCode: 0x10,
    did: null,
    cid: null,
    event: "xpUpdate",
    fields: [
      {
        name: "cp",
        type: "number",
        from: 0,
        to: 1
      },
    ]
  },
  0x11: {
    desc: "Boost power left (0 = 0%, 255 = 100%)",
    idCode: 0x11,
    did: null,
    cid: null,
    event: "boostUpdate",
    fields: [
      {
        name: "boost",
        type: "number",
        from: 0,
        to: 1
      },
    ]
  }
};

},{}],13:[function(require,module,exports){
"use strict";

module.exports = {
  "0:2": {
    desc: "Get Version",
    did: 0x00,
    cid: 0x02,
    event: "version",
    fields: [
      {
        name: "recv",
        type: "number",
        from: 0,
        to: 1
      },
      {
        name: "mdl",
        type: "number",
        from: 1,
        to: 2
      },
      {
        name: "hw",
        type: "number",
        from: 2,
        to: 3
      },
      {
        name: "msaVer",
        type: "number",
        from: 3,
        to: 4
      },
      {
        name: "msaRev",
        type: "number",
        from: 4,
        to: 5
      },
      {
        name: "bl",
        type: "number",
        format: "hex",
        from: 5,
        to: 6
      },
      {
        name: "bas",
        type: "number",
        format: "hex",
        from: 6,
        to: 7
      },
      {
        name: "macro",
        type: "number",
        format: "hex",
        from: 7,
        to: 8
      },
      {
        name: "apiMaj",
        type: "number",
        from: 8,
        to: 9
      },
      {
        name: "apiMin",
        type: "number",
        from: 9,
        to: 10
      },
    ]
  },
  "0:11": {
    desc: "Get Bluetooth Info",
    did: 0x00,
    cid: 0x11,
    event: "bluetoothInfo",
    fields: [
      {
        name: "name",
        type: "string",
        format: "ascii",
        from: 0,
        to: 16
      },
      {
        name: "btAddress",
        type: "string",
        format: "ascii",
        from: 16,
        to: 28
      },
      {
        name: "separator",
        type: "number",
        from: 28,
        to: 29
      },
      {
        name: "colors",
        type: "number",
        format: "hex",
        from: 29,
        to: 32
      }
    ]
  },
  "0:13": {
    desc: "Get Auto-reconnect Info",
    did: 0x00,
    cid: 0x13,
    event: "autoReconnectInfo",
    fields: [
      {
        name: "flag",
        type: "number",
        from: 0,
        to: 1
      },
      {
        name: "time",
        type: "number",
        from: 1,
        to: 2
      }
    ]
  },
  "0:20": {
    desc: "Get Power State Info",
    did: 0x00,
    cid: 0x20,
    event: "powerStateInfo",
    fields: [
      {
        name: "recVer",
        type: "number",
        from: 0,
        to: 1
      },
      {
        name: "batteryState",
        type: "predefined",
        from: 1,
        to: 2,
        values: {
          0x01: "Battery Charging",
          0x02: "Battery OK",
          0x03: "Battery Low",
          0x04: "Battery Critical"
        }
      },
      {
        name: "batteryVoltage",
        type: "number",
        from: 2,
        to: 4
      },
      {
        name: "chargeCount",
        type: "number",
        from: 4,
        to: 6
      },
      {
        name: "secondsSinceCharge",
        type: "number",
        from: 6,
        to: 8
      }
    ]
  },
  "0:23": {
    desc: "Get Voltage Trip Points",
    did: 0x00,
    cid: 0x23,
    event: "voltageTripPoints",
    fields: [
      {
        name: "vLow",
        type: "number",
        from: 0,
        to: 2
      },
      {
        name: "vCrit",
        type: "number",
        from: 2,
        to: 4
      }
    ]
  },
  "0:41": {
    desc: "Level 2 Diagnostics",
    did: 0x00,
    cid: 0x41,
    event: "level2Diagnostics",
    fields: [
      {
        name: "recVer",
        type: "number",
        from: 0,
        to: 2
      },
      {
        name: "rxGood",
        type: "number",
        from: 3,
        to: 7
      },
      {
        name: "rxBadDID",
        type: "number",
        from: 7,
        to: 11
      },
      {
        name: "rxBadDlen",
        type: "number",
        from: 11,
        to: 15
      },
      {
        name: "rxBadCID",
        type: "number",
        from: 15,
        to: 19
      },
      {
        name: "rxBadCheck",
        type: "number",
        from: 19,
        to: 23
      },
      {
        name: "rxBufferOvr",
        type: "number",
        from: 23,
        to: 27
      },
      {
        name: "txMsg",
        type: "number",
        from: 27,
        to: 31
      },
      {
        name: "txBufferOvr",
        type: "number",
        from: 31,
        to: 35
      },
      {
        name: "lastBootReason",
        type: "number",
        from: 35,
        to: 36
      },
      {
        name: "bootCounters",
        type: "number",
        format: "hex",
        from: 36,
        to: 68
      },
      {
        name: "chargeCount",
        type: "number",
        from: 70,
        to: 72
      },
      {
        name: "secondsSinceCharge",
        type: "number",
        from: 72,
        to: 74
      },
      {
        name: "secondsOn",
        type: "number",
        from: 74,
        to: 78
      },
      {
        name: "distanceRolled",
        type: "number",
        from: 78,
        to: 82
      },
      {
        name: "sensorFailures",
        type: "number",
        from: 82,
        to: 84
      },
      {
        name: "gyroAdjustCount",
        type: "number",
        from: 84,
        to: 88
      }
    ]
  },
  "0:51": {
    desc: "Poll Packet Times",
    did: 0x00,
    cid: 0x51,
    event: "packetTimes",
    fields: [
      {
        name: "t1",
        type: "number",
        from: 0,
        to: 4
      },
      {
        name: "t2",
        type: "number",
        from: 4,
        to: 8
      },
      {
        name: "t3",
        type: "number",
        from: 8,
        to: 12
      }
    ]
  },
  "2:7": {
    desc: "Get Chassis Id",
    did: 0x02,
    cid: 0x07,
    event: "chassisId",
    fields: [
      {
        name: "chassisId",
        type: "number",
      }
    ]
  },
  "2:22": {
    desc: "Get RGB LED",
    did: 0x02,
    cid: 0x07,
    event: "rgbLedColor",
    fields: [
      {
        name: "red",
        type: "number",
        from: 0,
        to: 1
      },
      {
        name: "green",
        type: "number",
        from: 1,
        to: 2
      },
      {
        name: "blue",
        type: "number",
        from: 2,
        to: 3
      }
    ]
  },
  "2:36": {
    desc: "Get Permanent Option Flags",
    did: 0x02,
    cid: 0x36,
    event: "permanentOptionFlags",
    fields: [
      {
        name: "sleepOnCharger",
        type: "predefined",
        mask: 0x01,
        values: {
          0x00: false,
          0x01: true
        }
      },
      {
        name: "vectorDrive",
        type: "predefined",
        mask: 0x02,
        values: {
          0x00: false,
          0x02: true
        }
      },
      {
        name: "selfLevelOnCharger",
        type: "predefined",
        mask: 0x04,
        values: {
          0x00: false,
          0x04: true
        }
      },
      {
        name: "tailLedAlwaysOn",
        type: "predefined",
        mask: 0x08,
        values: {
          0x00: false,
          0x08: true
        }
      },
      {
        name: "motionTimeouts",
        type: "predefined",
        mask: 0x10,
        values: {
          0x00: false,
          0x10: true
        }
      },
      {
        name: "retailDemoOn",
        type: "predefined",
        mask: 0x20,
        values: {
          0x00: false,
          0x20: true
        }
      },
      {
        name: "awakeSensitivityLight",
        type: "predefined",
        mask: 0x40,
        values: {
          0x00: false,
          0x40: true
        }
      },
      {
        name: "awakeSensitivityHeavy",
        type: "predefined",
        mask: 0x80,
        values: {
          0x00: false,
          0x80: true
        }
      },
      {
        name: "gyroMaxAsyncMsg",
        type: "predefined",
        mask: 0x100,
        values: {
          0x00: false,
          0x100: true
        }
      }
    ]
  },
  "2:38": {
    desc: "Get Temporal Option Flags",
    did: 0x02,
    cid: 0x38,
    event: "temporalOptionFlags",
    fields: [
      {
        name: "stopOnDisconnect",
        type: "predefined",
        mask: 0x01,
        values: {
          0x00: false,
          0x01: true
        }
      }
    ]
  },
  "2:44": {
    desc: "Get Device Mode",
    did: 0x02,
    cid: 0x44,
    event: "deviceMode",
    fields: [
      {
        name: "mode",
        type: "predefined",
        values: {
          0x00: "Normal",
          0x01: "User Hack"
        }
      }
    ]
  },
  "2:48": {
    desc: "Refill Bank",
    did: 0x02,
    cid: 0x48,
    event: "refillBank",
    fields: [
      {
        name: "coresRemaining",
        type: "number"
      }
    ]
  },
  "2:49": {
    desc: "Buy Consumable",
    did: 0x02,
    cid: 0x49,
    event: "buyConsumable",
    fields: [
      {
        name: "qtyRemaining",
        type: "number",
        from: 0,
        to: 1
      }, { name: "coresRemaining",
        type: "number",
        from: 1,
        to: 5
      }
    ]
  },
  "2:4A": {
    desc: "Use Consumable",
    did: 0x02,
    cid: 0x4A,
    event: "buyConsumable",
    fields: [
      {
        name: "id",
        type: "number",
        from: 0,
        to: 1
      },
      {
        name: "qtyRemaining",
        type: "number",
        from: 1,
        to: 2
      }
    ]
  },
  "2:4B": {
    desc: "Grant Cores",
    did: 0x02,
    cid: 0x4B,
    event: "grantCores",
    fields: [
      {
        name: "coresRemaining",
        type: "number",
      }
    ]
  },
  "2:4C": {
    desc: "Add XP",
    did: 0x02,
    cid: 0x4C,
    event: "addXp",
    fields: [
      {
        name: "toNextLevel",
        type: "number",
      }
    ]
  },
  "2:4D": {
    desc: "Level up Attr",
    did: 0x02,
    cid: 0x4D,
    event: "addXp",
    fields: [
      {
        name: "attrId",
        type: "number",
        from: 0,
        to: 1
      },
      {
        name: "attrLevel",
        type: "number",
        from: 1,
        to: 2
      },
      {
        name: "attrPtsRemaining",
        type: "number",
        from: 2,
        to: 4
      }
    ]
  },
  "2:4E": {
    desc: "GET PWD SEED",
    did: 0x02,
    cid: 0x4E,
    event: "passwordSeed",
    fields: [
      {
        name: "seed",
        type: "number"
      }
    ]
  },
  "2:55": {
    desc: "Abort Macro",
    did: 0x02,
    cid: 0x55,
    event: "abortMacro",
    fields: [
      {
        name: "id",
        type: "number",
        from: 0,
        to: 1
      },
      {
        name: "cmdNum",
        type: "number",
        from: 1,
        to: 3
      }
    ]
  },
  "2:56": {
    desc: "Get Macro Status",
    did: 0x02,
    cid: 0x55,
    event: "macroStatus",
    fields: [
      {
        name: "idCode",
        type: "number",
        from: 0,
        to: 1
      },
      {
        name: "cmdNum",
        type: "number",
        from: 1,
        to: 3
      }
    ]
  }
};

},{}],14:[function(require,module,exports){
"use strict";

var util = require("util"),
    EventEmitter = require("events").EventEmitter,
    Packet = require("./packet");

var core = require("./devices/core"),
    sphero = require("./devices/sphero"),
    custom = require("./devices/custom"),
    loader = require("./loader");

var SOP2 = {
  answer: 0xFD,
  resetTimeout: 0xFE,
  both: 0xFF,
  none: 0xFC,
  sync: 0xFF,
  async: 0xFE
};

function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Sphero = module.exports = function Sphero(address, opts) {
  // check that we were called with 'new'
  classCallCheck(this, Sphero);

  opts = opts || {};

  this.busy = false;
  this.ready = false;
  this.packet = new Packet();
  this.connection = opts.adaptor || loader.load(address);
  this.callbackQueue = [];
  this.commandQueue = [];
  this.sop2Bitfield = SOP2[opts.sop2] || SOP2.answer;
  this.seqCounter = 0x00;
  this.timeout = opts.timeout || 500;
  this.ds = {};

  // add commands to Sphero via mutator
  core(this);
  sphero(this);
  custom(this);
};

util.inherits(Sphero, EventEmitter);

Sphero.prototype.connect = function(callback) {
  var self = this,
      connection = this.connection,
      packet = this.packet;

  function emit(name) {
    return self.emit.bind(self, name);
  }

  packet.on("error", emit("error"));

  connection.open(function() {
    self.ready = true;

    connection.onRead(function(payload) {
      self.emit("data", payload);

      var parsedPayload = packet.parse(payload),
          parsedData, cmd;

      if (parsedPayload && parsedPayload.sop1) {

        if (parsedPayload.sop2 === SOP2.sync) {
          // synchronous packet
          self.emit("response", parsedPayload);
          cmd = self._responseCmd(parsedPayload.seq);
          parsedData = packet.parseResponseData(cmd, parsedPayload);
          self._execCallback(parsedPayload.seq, parsedData);
        } else if (parsedPayload.sop2 === SOP2.async) {
          // async packet
          parsedData = packet.parseAsyncData(parsedPayload, self.ds);
          self.emit("async", parsedData);
        }

        if (parsedData && parsedData.event) {
          self.emit(parsedData.event, parsedData);
        }
      }
    });

    connection.on("close", emit("close"));
    connection.on("error", emit("error"));

    self.emit("ready");

    if (typeof callback === "function") {
      callback();
    }
  });
};

Sphero.prototype.command = function(vDevice, cmdName, data, callback) {
  var seq = this._incSeq(),
      opts = {
        sop2: this.sop2Bitfield,
        did: vDevice,
        cid: cmdName,
        seq: seq,
        data: data
      };

  var cmdPacket = this.packet.create(opts);

  this._queueCommand(cmdPacket, callback);
  this._execCommand();
};

Sphero.prototype._queueCommand = function(cmdPacket, callback) {
  if (this.commandQueue.length === 256) {
    this.commandQueue.shift();
  }

  this.commandQueue.push({ packet: cmdPacket, cb: callback });
};

Sphero.prototype._execCommand = function() {
  var cmd;
  if (!this.busy && (this.commandQueue.length > 0)) {
    // Get the seq number from the cmd packet/buffer
    // to store the callback response in that position
    cmd = this.commandQueue.shift();
    this.busy = true;
    this._queueCallback(cmd.packet, cmd.cb);
    this.connection.write(cmd.packet);
  }
};

Sphero.prototype._queueCallback = function(cmdPacket, callback) {
  var seq = cmdPacket[4];

  var cb = function(err, packet) {
    clearTimeout(this.callbackQueue[seq].timeoutId);
    this.callbackQueue[seq] = null;
    this.busy = false;

    if (typeof callback === "function") {
      if (!err && !!packet) {
        callback(null, packet);
      } else {
        var error = new Error("Command sync response was lost.");
        callback(error, null);
      }
    }

    this._execCommand();
  };

  var timeoutId = setTimeout(cb.bind(this), this.timeout);

  this.callbackQueue[seq] = {
    callback: cb.bind(this),
    timeoutId: timeoutId,
    did: cmdPacket[2],
    cid: cmdPacket[3]
  };
};

Sphero.prototype._execCallback = function(seq, packet) {
  var queue = this.callbackQueue[seq];

  if (queue) {
    queue.callback(null, packet);
  }
};

Sphero.prototype._responseCmd = function(seq) {
  var queue = this.callbackQueue[seq];

  if (queue) {
    return { did: queue.did, cid: queue.cid };
  }

  return null;
};

Sphero.prototype._incSeq = function() {
  if (this.seqCounter > 255) {
    this.seqCounter = 0x00;
  }

  return this.seqCounter++;
};

},{"./devices/core":7,"./devices/custom":8,"./devices/sphero":9,"./loader":10,"./packet":11,"events":67,"util":92}],15:[function(require,module,exports){
(function (Buffer){
"use strict";

var exports = module.exports;

/**
 * Converts Red, Green, and Blue vlaues to an equivalent hex number
 *
 * @param {Number} red (0-255)
 * @param {Number} green (0-255)
 * @param {Number} blue (0-255)
 * @return {Number} computed number
 */
exports.rgbToHex = function rgbToHex(red, green, blue) {
  return blue | (green << 8) | (red << 16);
};

/**
 * Generates a random rgb color
 *
 * @return {Object} random color R/G/B values
 */
exports.randomColor = function randomColor() {
  function rand() { return Math.floor(Math.random() * 255); }
  return { red: rand(), green: rand(), blue: rand() };
};

/**
 * Calculates an Array-like object's checksum through mod-256ing it's contents
 * then ones-complimenting the result.
 *
 * @param {Array|Buffer} data value to checksum
 * @return {Number} checksum value
 */
exports.checksum = function checksum(data) {
  var isBuffer = Buffer.isBuffer(data),
      value = 0x00;

  for (var i = 0; i < data.length; i++) {
    value += isBuffer ? data.readUInt8(i) : data[i];
  }

  return (value % 256) ^ 0xFF;
};

/**
 * Converts a number to an array of hex values within the provided byte frame.
 *
 * @param {Number} value - number to convert
 * @param {Number} numBytes - byte frame size
 * @return {Array} hex numbers - generated
 */
exports.intToHexArray = function intToHexArray(value, numBytes) {
  var hexArray = new Array(numBytes);

  for (var i = numBytes - 1; i >= 0; i--) {
    hexArray[i] = value & 0xFF;
    value >>= 8;
  }

  return hexArray;
};

/**
 * Converts arguments to array.
 *
 * @return {Array} hex numbers generated
 */
exports.argsToHexArray = function argsToArray() {
  var args = [];

  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i] & 0xFF);
  }

  return args;
};

/**
 * Converts Buffer to integer.
 *
 * @param {Buffer} buffer - Buffer to be converted to integer
 * @return {Array} hex numbers generated
 */
exports.bufferToInt = function bufferToInt(buffer) {
  var value = buffer[0];

  for (var i = 1; i < buffer.length; i++) {
    value <<= 8;
    value |= buffer[i];
  }

  return value;
};

/**
 * Converts Signed Two's Complement Bytes to integer.
 *
 * @param {Integer} value - two byte int value
 * @param {Integer} numBytes - Number of bytes to apply Two's complement
 * @return {Integer} negative value
 */
exports.twosToInt = function twosToInt(value, numBytes) {
  var mask = 0x00;
  numBytes = numBytes || 2;

  for (var i = 0; i < numBytes; i++) {
    mask = (mask << 8) | 0xFF;
  }

  return ~(value ^ mask);
};

/**
 * Applies bit Xor to 32 bit value.
 *
 * @param {Number} value - The 32bit hex value
 * @param {Number} mask - byte mask to apply to each element in the array
 * @return {Array} with xor applied to each element
 */
exports.xor32bit = function xor32bit(value, mask) {
  var bytes = exports.intToHexArray(value, 4);
  mask = mask || 0xFF;

  for (var i = 0; i < bytes.length; i++) {
    bytes[i] ^= mask;
  }

  console.log(bytes);
  return exports.bufferToInt(bytes);
};

}).call(this,require("buffer").Buffer)
},{"buffer":63}],16:[function(require,module,exports){
(function (process,Buffer){
'use strict';

var EE = require('events').EventEmitter;
var util = require('util');

var DATABITS = [7, 8];
var STOPBITS = [1, 2];
var PARITY = ['none', 'even', 'mark', 'odd', 'space'];
var FLOWCONTROLS = ['RTSCTS'];

var _options = {
  baudrate: 9600,
  parity: 'none',
  rtscts: false,
  databits: 8,
  stopbits: 1,
  buffersize: 256
};

function convertOptions(options){
  switch (options.dataBits) {
    case 7:
      options.dataBits = 'seven';
      break;
    case 8:
      options.dataBits = 'eight';
      break;
  }

  switch (options.stopBits) {
    case 1:
      options.stopBits = 'one';
      break;
    case 2:
      options.stopBits = 'two';
      break;
  }

  switch (options.parity) {
    case 'none':
      options.parity = 'no';
      break;
  }

  return options;
}

function SerialPort(path, options, openImmediately, callback) {

  EE.call(this);

  var self = this;

  var args = Array.prototype.slice.call(arguments);
  callback = args.pop();
  if (typeof(callback) !== 'function') {
    callback = null;
  }

  options = (typeof options !== 'function') && options || {};

  openImmediately = (openImmediately === undefined || openImmediately === null) ? true : openImmediately;

  callback = callback || function (err) {
    if (err) {
      self.emit('error', err);
    }
  };

  var err;

  options.baudRate = options.baudRate || options.baudrate || _options.baudrate;

  options.dataBits = options.dataBits || options.databits || _options.databits;
  if (DATABITS.indexOf(options.dataBits) === -1) {
    err = new Error('Invalid "databits": ' + options.dataBits);
    callback(err);
    return;
  }

  options.stopBits = options.stopBits || options.stopbits || _options.stopbits;
  if (STOPBITS.indexOf(options.stopBits) === -1) {
    err = new Error('Invalid "stopbits": ' + options.stopbits);
    callback(err);
    return;
  }

  options.parity = options.parity || _options.parity;
  if (PARITY.indexOf(options.parity) === -1) {
    err = new Error('Invalid "parity": ' + options.parity);
    callback(err);
    return;
  }

  if (!path) {
    err = new Error('Invalid port specified: ' + path);
    callback(err);
    return;
  }

  options.rtscts = _options.rtscts;

  if (options.flowControl || options.flowcontrol) {
    var fc = options.flowControl || options.flowcontrol;

    if (typeof fc === 'boolean') {
      options.rtscts = true;
    } else {
      var clean = fc.every(function (flowControl) {
        var fcup = flowControl.toUpperCase();
        var idx = FLOWCONTROLS.indexOf(fcup);
        if (idx < 0) {
          var err = new Error('Invalid "flowControl": ' + fcup + '. Valid options: ' + FLOWCONTROLS.join(', '));
          callback(err);
          return false;
        } else {

          // "XON", "XOFF", "XANY", "DTRDTS", "RTSCTS"
          switch (idx) {
            case 0: options.rtscts = true; break;
          }
          return true;
        }
      });
      if(!clean){
        return;
      }
    }
  }

  options.bufferSize = options.bufferSize || options.buffersize || _options.buffersize;

  // defaults to chrome.serial if no options.serial passed
  // inlined instead of on _options to allow mocking global chrome.serial for optional options test
  options.serial = options.serial || (typeof chrome !== 'undefined' && chrome.serial);

  if (!options.serial) {
    throw new Error('No access to serial ports. Try loading as a Chrome Application.');
  }

  this.options = convertOptions(options);

  this.options.serial.onReceiveError.addListener(function(info){

    switch (info.error) {

      case 'disconnected':
      case 'device_lost':
      case 'system_error':
        err = new Error('Disconnected');
        // send notification of disconnect
        if (self.options.disconnectedCallback) {
          self.options.disconnectedCallback(err);
        } else {
          self.emit('disconnect', err);
        }
        self.connectionId = -1;
        self.emit('close');
        self.removeAllListeners();
        break;
      case 'timeout':
        break;
    }

  });

  this.path = path;

  if (openImmediately) {
    process.nextTick(function () {
      self.open(callback);
    });
  }
}

util.inherits(SerialPort, EE);

SerialPort.prototype.connectionId = -1;

SerialPort.prototype.open = function (callback) {
  var options = {
    bitrate: parseInt(this.options.baudRate, 10),
    dataBits: this.options.dataBits,
    parityBit: this.options.parity,
    stopBits: this.options.stopBits,
    ctsFlowControl: this.options.rtscts
  };

  this.options.serial.connect(this.path, options, this.proxy('onOpen', callback));
};

SerialPort.prototype.onOpen = function (callback, openInfo) {
  if(chrome.runtime.lastError){
    if(typeof callback === 'function'){
      callback(chrome.runtime.lastError);
    }else{
      this.emit('error', chrome.runtime.lastError);
    }
    return;
  }

  this.connectionId = openInfo.connectionId;

  if (this.connectionId === -1) {
    this.emit('error', new Error('Could not open port.'));
    return;
  }

  this.emit('open', openInfo);

  this._reader = this.proxy('onRead');

  this.options.serial.onReceive.addListener(this._reader);

  if(typeof callback === 'function'){
    callback(chrome.runtime.lastError, openInfo);
  }
};

SerialPort.prototype.onRead = function (readInfo) {
  if (readInfo && this.connectionId === readInfo.connectionId) {

    if (this.options.dataCallback) {
      this.options.dataCallback(toBuffer(readInfo.data));
    } else {
      this.emit('data', toBuffer(readInfo.data));
    }

  }
};

SerialPort.prototype.write = function (buffer, callback) {
  if (this.connectionId < 0) {
    var err = new Error('Serialport not open.');
    if(typeof callback === 'function'){
      callback(err);
    }else{
      this.emit('error', err);
    }
    return;
  }

  if (typeof buffer === 'string') {
    buffer = str2ab(buffer);
  }

  //Make sure its not a browserify faux Buffer.
  if (buffer instanceof ArrayBuffer === false) {
    buffer = buffer2ArrayBuffer(buffer);
  }

  this.options.serial.send(this.connectionId, buffer, function(info) {
    if (typeof callback === 'function') {
      callback(chrome.runtime.lastError, info);
    }
  });
};


SerialPort.prototype.close = function (callback) {
  if (this.connectionId < 0) {
    var err = new Error('Serialport not open.');
    if(typeof callback === 'function'){
      callback(err);
    }else{
      this.emit('error', err);
    }
    return;
  }

  this.options.serial.disconnect(this.connectionId, this.proxy('onClose', callback));
};

SerialPort.prototype.onClose = function (callback, result) {
  this.connectionId = -1;
  this.emit('close');

  this.removeAllListeners();
  if(this._reader){
    this.options.serial.onReceive.removeListener(this._reader);
    this._reader = null;
  }

  if (typeof callback === 'function') {
    callback(chrome.runtime.lastError, result);
  }
};

SerialPort.prototype.flush = function (callback) {
  if (this.connectionId < 0) {
    var err = new Error('Serialport not open.');
    if(typeof callback === 'function'){
      callback(err);
    }else{
      this.emit('error', err);
    }
    return;
  }

  var self = this;

  this.options.serial.flush(this.connectionId, function(result) {
    if (chrome.runtime.lastError) {
      if (typeof callback === 'function') {
        callback(chrome.runtime.lastError, result);
      } else {
        self.emit('error', chrome.runtime.lastError);
      }
      return;
    } else {
      callback(null, result);
    }
  });
};

SerialPort.prototype.drain = function (callback) {
  if (this.connectionId < 0) {
    var err = new Error('Serialport not open.');
    if(typeof callback === 'function'){
      callback(err);
    }else{
      this.emit('error', err);
    }
    return;
  }

  if (typeof callback === 'function') {
    callback();
  }
};


SerialPort.prototype.proxy = function () {
  var self = this;
  var proxyArgs = [];

  //arguments isnt actually an array.
  for (var i = 0; i < arguments.length; i++) {
      proxyArgs[i] = arguments[i];
  }

  var functionName = proxyArgs.splice(0, 1)[0];

  var func = function() {
    var funcArgs = [];
    for (var i = 0; i < arguments.length; i++) {
        funcArgs[i] = arguments[i];
    }
    var allArgs = proxyArgs.concat(funcArgs);

    self[functionName].apply(self, allArgs);
  };

  return func;
};

SerialPort.prototype.set = function (options, callback) {
  this.options.serial.setControlSignals(this.connectionId, options, function(result){
    callback(chrome.runtime.lastError, result);
  });
};

function SerialPortList(callback) {
  if (typeof chrome != 'undefined' && chrome.serial) {
    chrome.serial.getDevices(function(ports) {
      var portObjects = new Array(ports.length);
      for (var i = 0; i < ports.length; i++) {
        portObjects[i] = {
          comName: ports[i].path,
          manufacturer: ports[i].displayName,
          serialNumber: '',
          pnpId: '',
          locationId:'',
          vendorId: '0x' + (ports[i].vendorId||0).toString(16),
          productId: '0x' + (ports[i].productId||0).toString(16)
        };
      }
      callback(chrome.runtime.lastError, portObjects);
    });
  } else {
    callback(new Error('No access to serial ports. Try loading as a Chrome Application.'), null);
  }
}

// Convert string to ArrayBuffer
function str2ab(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// Convert buffer to ArrayBuffer
function buffer2ArrayBuffer(buffer) {
  var buf = new ArrayBuffer(buffer.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0; i < buffer.length; i++) {
    bufView[i] = buffer[i];
  }
  return buf;
}

function toBuffer(ab) {
  var buffer = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
  }
  return buffer;
}

module.exports = {
  SerialPort: SerialPort,
  list: SerialPortList,
  buffer2ArrayBuffer: buffer2ArrayBuffer,
  used: [] //TODO: Populate this somewhere.
};

}).call(this,require('_process'),require("buffer").Buffer)
},{"_process":72,"buffer":63,"events":67,"util":92}],17:[function(require,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

},{"./debug":18}],18:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":19}],19:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = '' + str;
  if (str.length > 10000) return;
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],20:[function(require,module,exports){
(function (process){
/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
/*jshint onevar: false, indent:4 */
/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _toString = Object.prototype.toString;

    var _isArray = Array.isArray || function (obj) {
        return _toString.call(obj) === '[object Array]';
    };

    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
            async.setImmediate = function (fn) {
              // not a direct alias for IE10 compatibility
              setImmediate(fn);
            };
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(done) );
        });
        function done(err) {
          if (err) {
              callback(err);
              callback = function () {};
          }
          else {
              completed += 1;
              if (completed >= arr.length) {
                  callback();
              }
          }
        }
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback();
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        if (!callback) {
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err) {
                    callback(err);
                });
            });
        } else {
            var results = [];
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err, v) {
                    results[x.index] = v;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        var remainingTasks = keys.length
        if (!remainingTasks) {
            return callback();
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            remainingTasks--
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (!remainingTasks) {
                var theCallback = callback;
                // prevent final callback from calling itself if it errors
                callback = function () {};

                theCallback(null, results);
            }
        });

        _each(keys, function (k) {
            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];
            var taskCallback = function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var attempts = [];
        // Use defaults if times not passed
        if (typeof times === 'function') {
            callback = task;
            task = times;
            times = DEFAULT_TIMES;
        }
        // Make sure times is a number
        times = parseInt(times, 10) || DEFAULT_TIMES;
        var wrappedTask = function(wrappedCallback, wrappedResults) {
            var retryAttempt = function(task, finalAttempt) {
                return function(seriesCallback) {
                    task(function(err, result){
                        seriesCallback(!err || finalAttempt, {err: err, result: result});
                    }, wrappedResults);
                };
            };
            while (times) {
                attempts.push(retryAttempt(task, !(times-=1)));
            }
            async.series(attempts, function(done, data){
                data = data[data.length - 1];
                (wrappedCallback || callback)(data.err, data.result);
            });
        }
        // If a callback is passed, run this as a controll flow
        return callback ? wrappedTask() : wrappedTask
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (!_isArray(tasks)) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (_isArray(tasks)) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (_isArray(tasks)) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            var args = Array.prototype.slice.call(arguments, 1);
            if (test.apply(null, args)) {
                async.doWhilst(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            var args = Array.prototype.slice.call(arguments, 1);
            if (!test.apply(null, args)) {
                async.doUntil(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if (!q.started){
            q.started = true;
          }
          if (!_isArray(data)) {
              data = [data];
          }
          if(data.length == 0) {
             // call drain immediately if there are no tasks
             return async.setImmediate(function() {
                 if (q.drain) {
                     q.drain();
                 }
             });
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === q.concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            started: false,
            paused: false,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            kill: function () {
              q.drain = null;
              q.tasks = [];
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (!q.paused && workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(next);
                    worker(task.data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            },
            idle: function() {
                return q.tasks.length + workers === 0;
            },
            pause: function () {
                if (q.paused === true) { return; }
                q.paused = true;
                q.process();
            },
            resume: function () {
                if (q.paused === false) { return; }
                q.paused = false;
                q.process();
            }
        };
        return q;
    };
    
    async.priorityQueue = function (worker, concurrency) {
        
        function _compareTasks(a, b){
          return a.priority - b.priority;
        };
        
        function _binarySearch(sequence, item, compare) {
          var beg = -1,
              end = sequence.length - 1;
          while (beg < end) {
            var mid = beg + ((end - beg + 1) >>> 1);
            if (compare(item, sequence[mid]) >= 0) {
              beg = mid;
            } else {
              end = mid - 1;
            }
          }
          return beg;
        }
        
        function _insert(q, data, priority, callback) {
          if (!q.started){
            q.started = true;
          }
          if (!_isArray(data)) {
              data = [data];
          }
          if(data.length == 0) {
             // call drain immediately if there are no tasks
             return async.setImmediate(function() {
                 if (q.drain) {
                     q.drain();
                 }
             });
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  priority: priority,
                  callback: typeof callback === 'function' ? callback : null
              };
              
              q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

              if (q.saturated && q.tasks.length === q.concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }
        
        // Start with a normal queue
        var q = async.queue(worker, concurrency);
        
        // Override push to accept second parameter representing priority
        q.push = function (data, priority, callback) {
          _insert(q, data, priority, callback);
        };
        
        // Remove unshift function
        delete q.unshift;

        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            drained: true,
            push: function (data, callback) {
                if (!_isArray(data)) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    cargo.drained = false;
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.setImmediate(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain && !cargo.drained) cargo.drain();
                    cargo.drained = true;
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0, tasks.length);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                async.nextTick(function () {
                    callback.apply(null, memo[key]);
                });
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.seq = function (/* functions... */) {
        var fns = arguments;
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    async.compose = function (/* functions... */) {
      return async.seq.apply(null, Array.prototype.reverse.call(arguments));
    };

    var _applyEach = function (eachfn, fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 2) {
            var args = Array.prototype.slice.call(arguments, 2);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
    async.applyEach = doParallel(_applyEach);
    async.applyEachSeries = doSeries(_applyEach);

    async.forever = function (fn, callback) {
        function next(err) {
            if (err) {
                if (callback) {
                    return callback(err);
                }
                throw err;
            }
            fn(next);
        }
        next();
    };

    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // AMD / RequireJS
    else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

}).call(this,require('_process'))
},{"_process":72}],21:[function(require,module,exports){
(function (process,__dirname){
"use strict";

/**
 * Module exports.
 */

module.exports = exports;

/**
 * Module dependencies.
 */

var path = require('path');
var nopt = require('nopt');
var log = require('npmlog');
var EE = require('events').EventEmitter;
var inherits = require('util').inherits;
var commands = [
      'clean',
      'install',
      'reinstall',
      'build',
      'rebuild',
      'package',
      'testpackage',
      'publish',
      'unpublish',
      'info',
      'testbinary',
      'reveal',
      'configure'
    ];
var aliases = {};

// differentiate node-pre-gyp's logs from npm's
log.heading = 'node-pre-gyp';

exports.find = require('./pre-binding').find;

function Run() {
  var self = this;

  this.commands = {};

  commands.forEach(function (command) {
    self.commands[command] = function (argv, callback) {
      log.verbose('command', command, argv);
      return require('./' + command)(self, argv, callback);
    };
  });
}
inherits(Run, EE);
exports.Run = Run;
var proto = Run.prototype;

/**
 * Export the contents of the package.json.
 */

proto.package = require('../package');

/**
 * nopt configuration definitions
 */

proto.configDefs = {
    help: Boolean,     // everywhere
    arch: String,      // 'configure'
    debug: Boolean,    // 'build'
    directory: String, // bin
    proxy: String,     // 'install'
    loglevel: String,  // everywhere
};

/**
 * nopt shorthands
 */

proto.shorthands = {
    release: '--no-debug',
    C: '--directory',
    debug: '--debug',
    j: '--jobs',
    silent: '--loglevel=silent',
    silly: '--loglevel=silly',
    verbose: '--loglevel=verbose',
};

/**
 * expose the command aliases for the bin file to use.
 */

proto.aliases = aliases;

/**
 * Parses the given argv array and sets the 'opts',
 * 'argv' and 'command' properties.
 */

proto.parseArgv = function parseOpts (argv) {
  this.opts = nopt(this.configDefs, this.shorthands, argv);
  this.argv = this.opts.argv.remain.slice();
  var commands = this.todo = [];

  // create a copy of the argv array with aliases mapped
  argv = this.argv.map(function (arg) {
    // is this an alias?
    if (arg in this.aliases) {
      arg = this.aliases[arg];
    }
    return arg;
  }, this);

  // process the mapped args into "command" objects ("name" and "args" props)
  argv.slice().forEach(function (arg) {
    if (arg in this.commands) {
      var args = argv.splice(0, argv.indexOf(arg));
      argv.shift();
      if (commands.length > 0) {
        commands[commands.length - 1].args = args;
      }
      commands.push({ name: arg, args: [] });
    }
  }, this);
  if (commands.length > 0) {
    commands[commands.length - 1].args = argv.splice(0);
  }

  // support for inheriting config env variables from npm
  var npm_config_prefix = 'npm_config_';
  Object.keys(process.env).forEach(function (name) {
    if (name.indexOf(npm_config_prefix) !== 0) return;
    var val = process.env[name];
    if (name === npm_config_prefix + 'loglevel') {
      log.level = val;
    } else {
      // add the user-defined options to the config
      name = name.substring(npm_config_prefix.length);
      // avoid npm argv clobber already present args
      // which avoids problem of 'npm test' calling
      // script that runs unique npm install commands
      if (name === 'argv') {
         if (this.opts.argv &&
             this.opts.argv.remain &&
             this.opts.argv.remain.length) {
            // do nothing
         } else {
            this.opts[name] = val;
         }
      } else {
        this.opts[name] = val;
      }
    }
  }, this);

  if (this.opts.loglevel) {
    log.level = this.opts.loglevel;
  }
  log.resume();
};

/**
 * Returns the usage instructions for node-pre-gyp.
 */

proto.usage = function usage () {
  var str = [
      '',
      '  Usage: node-pre-gyp <command> [options]',
      '',
      '  where <command> is one of:',
      commands.map(function (c) {
        return '    - ' + c + ' - ' + require('./' + c).usage;
      }).join('\n'),
      '',
      'node-pre-gyp@' + this.version + '  ' + path.resolve(__dirname, '..'),
      'node@' + process.versions.node
  ].join('\n');
  return str;
};

/**
 * Version number getter.
 */

Object.defineProperty(proto, 'version', {
    get: function () {
      return this.package.version;
    },
    enumerable: true
});


}).call(this,require('_process'),"/../../node_modules/sphero/node_modules/serialport/node_modules/node-pre-gyp/lib")
},{"../package":57,"./pre-binding":22,"_process":72,"events":67,"nopt":25,"npmlog":27,"path":71,"util":92}],22:[function(require,module,exports){
"use strict";

var versioning = require('../lib/util/versioning.js');
var existsSync = require('fs').existsSync || require('path').existsSync;
var path = require('path');

module.exports = exports;

exports.usage = 'Finds the require path for the node-pre-gyp installed module';

exports.validate = function(package_json) {
    versioning.validate_config(package_json);
};

exports.find = function(package_json_path,opts) {
   if (!existsSync(package_json_path)) {
        throw new Error("package.json does not exist at " + package_json_path);
   }
   var package_json = require(package_json_path);
   versioning.validate_config(package_json);
   opts = opts || {};
   if (!opts.module_root) opts.module_root = path.dirname(package_json_path);
   var meta = versioning.evaluate(package_json,opts);
   return meta.module;
};

},{"../lib/util/versioning.js":24,"fs":60,"path":71}],23:[function(require,module,exports){
module.exports={
  "0.8.0": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.1": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.2": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.3": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.4": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.5": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.6": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.7": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.8": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.9": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.10": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.11": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.12": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.13": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.14": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.15": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.16": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.17": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.18": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.19": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.20": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.21": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.22": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.23": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.24": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.25": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.26": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.27": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.8.28": {
    "node_abi": 1,
    "v8": "3.11"
  },
  "0.10.0": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.1": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.2": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.3": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.4": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.5": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.6": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.7": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.8": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.9": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.10": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.11": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.12": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.13": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.14": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.15": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.16": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.17": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.18": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.19": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.20": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.21": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.22": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.23": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.24": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.25": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.26": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.27": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.28": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.29": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.30": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.31": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.32": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.33": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.34": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.35": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.36": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.37": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.10.38": {
    "node_abi": 11,
    "v8": "3.14"
  },
  "0.11.0": {
    "node_abi": 12,
    "v8": "3.17"
  },
  "0.11.1": {
    "node_abi": 12,
    "v8": "3.18"
  },
  "0.11.2": {
    "node_abi": 12,
    "v8": "3.19"
  },
  "0.11.3": {
    "node_abi": 12,
    "v8": "3.19"
  },
  "0.11.4": {
    "node_abi": 12,
    "v8": "3.20"
  },
  "0.11.5": {
    "node_abi": 12,
    "v8": "3.20"
  },
  "0.11.6": {
    "node_abi": 12,
    "v8": "3.20"
  },
  "0.11.7": {
    "node_abi": 12,
    "v8": "3.20"
  },
  "0.11.8": {
    "node_abi": 13,
    "v8": "3.21"
  },
  "0.11.9": {
    "node_abi": 13,
    "v8": "3.22"
  },
  "0.11.10": {
    "node_abi": 13,
    "v8": "3.22"
  },
  "0.11.11": {
    "node_abi": 14,
    "v8": "3.22"
  },
  "0.11.12": {
    "node_abi": 14,
    "v8": "3.22"
  },
  "0.11.13": {
    "node_abi": 14,
    "v8": "3.25"
  },
  "0.11.14": {
    "node_abi": 14,
    "v8": "3.26"
  },
  "0.11.15": {
    "node_abi": 14,
    "v8": "3.28"
  },
  "0.11.16": {
    "node_abi": 14,
    "v8": "3.28"
  },
  "0.12.0": {
    "node_abi": 14,
    "v8": "3.28"
  },
  "0.12.1": {
    "node_abi": 14,
    "v8": "3.28"
  },
  "0.12.2": {
    "node_abi": 14,
    "v8": "3.28"
  },
  "1.0.0": {
    "node_abi": 42,
    "v8": "3.31"
  },
  "1.0.1": {
    "node_abi": 42,
    "v8": "3.31"
  },
  "1.0.2": {
    "node_abi": 42,
    "v8": "3.31"
  },
  "1.0.3": {
    "node_abi": 42,
    "v8": "4.1"
  },
  "1.0.4": {
    "node_abi": 42,
    "v8": "4.1"
  },
  "1.1.0": {
    "node_abi": 43,
    "v8": "4.1"
  },
  "1.2.0": {
    "node_abi": 43,
    "v8": "4.1"
  },
  "1.3.0": {
    "node_abi": 43,
    "v8": "4.1"
  },
  "1.4.1": {
    "node_abi": 43,
    "v8": "4.1"
  },
  "1.4.2": {
    "node_abi": 43,
    "v8": "4.1"
  },
  "1.4.3": {
    "node_abi": 43,
    "v8": "4.1"
  },
  "1.5.0": {
    "node_abi": 43,
    "v8": "4.1"
  },
  "1.5.1": {
    "node_abi": 43,
    "v8": "4.1"
  },
  "1.6.0": {
    "node_abi": 43,
    "v8": "4.1"
  },
  "1.6.1": {
    "node_abi": 43,
    "v8": "4.1"
  },
  "1.6.2": {
    "node_abi": 43,
    "v8": "4.1"
  },
  "1.6.3": {
    "node_abi": 43,
    "v8": "4.1"
  },
  "1.6.4": {
    "node_abi": 43,
    "v8": "4.1"
  },
  "1.7.1": {
    "node_abi": 43,
    "v8": "4.1"
  },
  "1.8.1": {
    "node_abi": 43,
    "v8": "4.1"
  },
  "2.0.0": {
    "node_abi": 44,
    "v8": "4.2"
  }
}
},{}],24:[function(require,module,exports){
(function (process){
"use strict";

module.exports = exports;

var path = require('path');
var semver = require('semver');
var url = require('url');

var abi_crosswalk;

// This is used for unit testing to provide a fake
// ABI crosswalk that emulates one that is not updated
// for the current version
if (process.env.NODE_PRE_GYP_ABI_CROSSWALK) {
    abi_crosswalk = require(process.env.NODE_PRE_GYP_ABI_CROSSWALK);
} else {
    abi_crosswalk = require('./abi_crosswalk.json');
}

function get_node_webkit_abi(runtime, target_version) {
    if (!runtime) {
        throw new Error("get_node_webkit_abi requires valid runtime arg");
    }
    if (typeof target_version === 'undefined') {
        // erroneous CLI call
        throw new Error("Empty target version is not supported if node-webkit is the target.");
    }
    return runtime + '-v' + target_version;
}
module.exports.get_node_webkit_abi = get_node_webkit_abi;

function get_node_abi(runtime, versions) {
    if (!runtime) {
        throw new Error("get_node_abi requires valid runtime arg");
    }
    if (!versions) {
        throw new Error("get_node_abi requires valid process.versions object");
    }
    var sem_ver = semver.parse(versions.node);
    if (sem_ver.major === 0 && sem_ver.minor % 2) { // odd series
        // https://github.com/mapbox/node-pre-gyp/issues/124
        return runtime+'-v'+versions.node;
    } else {
        // process.versions.modules added in >= v0.10.4 and v0.11.7
        // https://github.com/joyent/node/commit/ccabd4a6fa8a6eb79d29bc3bbe9fe2b6531c2d8e
        return versions.modules ? runtime+'-v' + (+versions.modules) :
            'v8-' + versions.v8.split('.').slice(0,2).join('.');
    }
}
module.exports.get_node_abi = get_node_abi;

function get_runtime_abi(runtime, target_version) {
    if (!runtime) {
        throw new Error("get_runtime_abi requires valid runtime arg");
    }
    if (runtime === 'node-webkit') {
        return get_node_webkit_abi(runtime, target_version || process.versions['node-webkit']);
    } else {
        if (runtime != 'node') {
            throw new Error("Unknown Runtime: '" + runtime + "'");
        }
        if (!target_version) {
            return get_node_abi(runtime,process.versions);
        } else {
            var cross_obj;
            // abi_crosswalk generated with ./scripts/abi_crosswalk.js
            if (abi_crosswalk[target_version]) {
                cross_obj = abi_crosswalk[target_version];
            } else {
                var target_parts = target_version.split('.').map(function(i) { return +i; });
                if (target_parts.length != 3) { // parse failed
                    throw new Error("Unknown target version: " + target_version);
                }
                /*
                    The below code tries to infer the last known ABI compatible version
                    that we have recorded in the abi_crosswalk.json when an exact match
                    is not possible. The reasons for this to exist are complicated:

                       - We support passing --target to be able to allow developers to package binaries for versions of node
                         that are not the same one as they are running. This might also be used in combination with the
                         --target_arch or --target_platform flags to also package binaries for alternative platforms
                       - When --target is passed we can't therefore determine the ABI (process.versions.modules) from the node
                         version that is running in memory
                       - So, therefore node-pre-gyp keeps an "ABI crosswalk" (lib/util/abi_crosswalk.json) to be able to look
                         this info up for all versions
                       - But we cannot easily predict what the future ABI will be for released versions
                       - And node-pre-gyp needs to be a `bundledDependency` in apps that depend on it in order to work correctly
                         by being fully available at install time.
                       - So, the speed of node releases and the bundled nature of node-pre-gyp mean that a new node-pre-gyp release
                         need to happen for every node.js/io.js/node-webkit/nw.js/atom-shell/etc release that might come online if
                         you want the `--target` flag to keep working for the latest version
                       - Which is impractical ^^
                       - Hence the below code guesses about future ABI to make the need to update node-pre-gyp less demanding.

                    In practice then you can have a dependency of your app like `node-sqlite3` that bundles a `node-pre-gyp` that
                    only knows about node v0.10.33 in the `abi_crosswalk.json` but target node v0.10.34 (which is assumed to be
                    ABI compatible with v0.10.33).

                    TODO: use semver module instead of custom version parsing
                */
                var major = target_parts[0];
                var minor = target_parts[1];
                var patch = target_parts[2];
                // io.js: yeah if node.js ever releases 1.x this will break
                // but that is unlikely to happen: https://github.com/iojs/io.js/pull/253#issuecomment-69432616
                if (major === 1) {
                    // look for last release that is the same major version
                    // e.g. we assume io.js 1.x is ABI compatible with >= 1.0.0
                    while (true) {
                        if (minor > 0) --minor;
                        if (patch > 0) --patch;
                        var new_iojs_target = '' + major + '.' + minor + '.' + patch;
                        if (abi_crosswalk[new_iojs_target]) {
                            cross_obj = abi_crosswalk[new_iojs_target];
                            console.log('Warning: node-pre-gyp could not find exact match for ' + target_version);
                            console.log('Warning: but node-pre-gyp successfully choose ' + new_iojs_target + ' as ABI compatible target');
                            break;
                        }
                        if (minor === 0 && patch === 0) {
                            break;
                        }
                    }
                } else if (major === 0) { // node.js
                    if (target_parts[1] % 2 === 0) { // for stable/even node.js series
                        // look for the last release that is the same minor release
                        // e.g. we assume node 0.10.x is ABI compatible with >= 0.10.0
                        while (--patch > 0) {
                            var new_node_target = '' + major + '.' + minor + '.' + patch;
                            if (abi_crosswalk[new_node_target]) {
                                cross_obj = abi_crosswalk[new_node_target];
                                console.log('Warning: node-pre-gyp could not find exact match for ' + target_version);
                                console.log('Warning: but node-pre-gyp successfully choose ' + new_node_target + ' as ABI compatible target');
                                break;
                            }
                        }
                    }
                }
            }
            if (!cross_obj) {
                throw new Error("Unsupported target version: " + target_version);
            }
            // emulate process.versions
            var versions_obj = {
                node: target_version,
                v8: cross_obj.v8+'.0',
                // abi_crosswalk uses 1 for node versions lacking process.versions.modules
                // process.versions.modules added in >= v0.10.4 and v0.11.7
                modules: cross_obj.node_abi > 1 ? cross_obj.node_abi : undefined
            };
            return get_node_abi(runtime, versions_obj);
        }
    }
}
module.exports.get_runtime_abi = get_runtime_abi;

var required_parameters = [
    'module_name',
    'module_path',
    'host'
];

function validate_config(package_json) {
    var msg = package_json.name + ' package.json is not node-pre-gyp ready:\n';
    var missing = [];
    if (!package_json.main) {
        missing.push('main');
    }
    if (!package_json.version) {
        missing.push('version');
    }
    if (!package_json.name) {
        missing.push('name');
    }
    if (!package_json.binary) {
        missing.push('binary');
    }
    var o = package_json.binary;
    required_parameters.forEach(function(p) {
        if (missing.indexOf('binary') > -1) {
            missing.pop('binary');
        }
        if (!o || o[p] === undefined) {
            missing.push('binary.' + p);
        }
    });
    if (missing.length >= 1) {
        throw new Error(msg+"package.json must declare these properties: \n" + missing.join('\n'));
    }
    if (o) {
        // enforce https over http
        var protocol = url.parse(o.host).protocol;
        if (protocol === 'http:') {
            throw new Error("'host' protocol ("+protocol+") is invalid - only 'https:' is accepted");
        }
    }
}

module.exports.validate_config = validate_config;

function eval_template(template,opts) {
    Object.keys(opts).forEach(function(key) {
        var pattern = '{'+key+'}';
        while (template.indexOf(pattern) > -1) {
            template = template.replace(pattern,opts[key]);
        }
    });
    return template;
}

// url.resolve needs single trailing slash
// to behave correctly, otherwise a double slash
// may end up in the url which breaks requests
// and a lacking slash may not lead to proper joining
function fix_slashes(pathname) {
    if (pathname.slice(-1) != '/') {
        return pathname + '/';
    }
    return pathname;
}

// remove double slashes
// note: path.normalize will not work because
// it will convert forward to back slashes
function drop_double_slashes(pathname) {
    return pathname.replace(/\/\//g,'/');
}

var default_package_name = '{module_name}-v{version}-{node_abi}-{platform}-{arch}.tar.gz';
var default_remote_path = '';

module.exports.evaluate = function(package_json,options) {
    options = options || {};
    validate_config(package_json);
    var v = package_json.version;
    var module_version = semver.parse(v);
    var runtime = options.runtime || (process.versions['node-webkit'] ? 'node-webkit' : 'node');
    var opts = {
        name: package_json.name,
        configuration: Boolean(options.debug) ? 'Debug' : 'Release',
        debug: options.debug,
        module_name: package_json.binary.module_name,
        version: module_version.version,
        prerelease: module_version.prerelease.length ? module_version.prerelease.join('.') : '',
        build: module_version.build.length ? module_version.build.join('.') : '',
        major: module_version.major,
        minor: module_version.minor,
        patch: module_version.patch,
        runtime: runtime,
        node_abi: get_runtime_abi(runtime,options.target),
        target: options.target || '',
        platform: options.target_platform || process.platform,
        target_platform: options.target_platform || process.platform,
        arch: options.target_arch || process.arch,
        target_arch: options.target_arch || process.arch,
        module_main: package_json.main,
        toolset : options.toolset || '' // address https://github.com/mapbox/node-pre-gyp/issues/119
    };
    opts.host = fix_slashes(eval_template(package_json.binary.host,opts));
    opts.module_path = eval_template(package_json.binary.module_path,opts);
    // now we resolve the module_path to ensure it is absolute so that binding.gyp variables work predictably
    if (options.module_root) {
        // resolve relative to known module root: works for pre-binding require
        opts.module_path = path.join(options.module_root,opts.module_path);
    } else {
        // resolve relative to current working directory: works for node-pre-gyp commands
        opts.module_path = path.resolve(opts.module_path);
    }
    opts.module = path.join(opts.module_path,opts.module_name + '.node');
    opts.remote_path = package_json.binary.remote_path ? drop_double_slashes(fix_slashes(eval_template(package_json.binary.remote_path,opts))) : default_remote_path;
    var package_name = package_json.binary.package_name ? package_json.binary.package_name : default_package_name;
    opts.package_name = eval_template(package_name,opts);
    opts.staged_tarball = path.join('build/stage',opts.remote_path,opts.package_name);
    opts.hosted_path = url.resolve(opts.host,opts.remote_path);
    opts.hosted_tarball = url.resolve(opts.hosted_path,opts.package_name);
    return opts;
};

}).call(this,require('_process'))
},{"./abi_crosswalk.json":23,"_process":72,"path":71,"semver":56,"url":90}],25:[function(require,module,exports){
(function (process){
// info about each config option.

var debug = process.env.DEBUG_NOPT || process.env.NOPT_DEBUG
  ? function () { console.error.apply(console, arguments) }
  : function () {}

var url = require("url")
  , path = require("path")
  , Stream = require("stream").Stream
  , abbrev = require("abbrev")

module.exports = exports = nopt
exports.clean = clean

exports.typeDefs =
  { String  : { type: String,  validate: validateString  }
  , Boolean : { type: Boolean, validate: validateBoolean }
  , url     : { type: url,     validate: validateUrl     }
  , Number  : { type: Number,  validate: validateNumber  }
  , path    : { type: path,    validate: validatePath    }
  , Stream  : { type: Stream,  validate: validateStream  }
  , Date    : { type: Date,    validate: validateDate    }
  }

function nopt (types, shorthands, args, slice) {
  args = args || process.argv
  types = types || {}
  shorthands = shorthands || {}
  if (typeof slice !== "number") slice = 2

  debug(types, shorthands, args, slice)

  args = args.slice(slice)
  var data = {}
    , key
    , remain = []
    , cooked = args
    , original = args.slice(0)

  parse(args, data, remain, types, shorthands)
  // now data is full
  clean(data, types, exports.typeDefs)
  data.argv = {remain:remain,cooked:cooked,original:original}
  Object.defineProperty(data.argv, 'toString', { value: function () {
    return this.original.map(JSON.stringify).join(" ")
  }, enumerable: false })
  return data
}

function clean (data, types, typeDefs) {
  typeDefs = typeDefs || exports.typeDefs
  var remove = {}
    , typeDefault = [false, true, null, String, Array]

  Object.keys(data).forEach(function (k) {
    if (k === "argv") return
    var val = data[k]
      , isArray = Array.isArray(val)
      , type = types[k]
    if (!isArray) val = [val]
    if (!type) type = typeDefault
    if (type === Array) type = typeDefault.concat(Array)
    if (!Array.isArray(type)) type = [type]

    debug("val=%j", val)
    debug("types=", type)
    val = val.map(function (val) {
      // if it's an unknown value, then parse false/true/null/numbers/dates
      if (typeof val === "string") {
        debug("string %j", val)
        val = val.trim()
        if ((val === "null" && ~type.indexOf(null))
            || (val === "true" &&
               (~type.indexOf(true) || ~type.indexOf(Boolean)))
            || (val === "false" &&
               (~type.indexOf(false) || ~type.indexOf(Boolean)))) {
          val = JSON.parse(val)
          debug("jsonable %j", val)
        } else if (~type.indexOf(Number) && !isNaN(val)) {
          debug("convert to number", val)
          val = +val
        } else if (~type.indexOf(Date) && !isNaN(Date.parse(val))) {
          debug("convert to date", val)
          val = new Date(val)
        }
      }

      if (!types.hasOwnProperty(k)) {
        return val
      }

      // allow `--no-blah` to set 'blah' to null if null is allowed
      if (val === false && ~type.indexOf(null) &&
          !(~type.indexOf(false) || ~type.indexOf(Boolean))) {
        val = null
      }

      var d = {}
      d[k] = val
      debug("prevalidated val", d, val, types[k])
      if (!validate(d, k, val, types[k], typeDefs)) {
        if (exports.invalidHandler) {
          exports.invalidHandler(k, val, types[k], data)
        } else if (exports.invalidHandler !== false) {
          debug("invalid: "+k+"="+val, types[k])
        }
        return remove
      }
      debug("validated val", d, val, types[k])
      return d[k]
    }).filter(function (val) { return val !== remove })

    if (!val.length) delete data[k]
    else if (isArray) {
      debug(isArray, data[k], val)
      data[k] = val
    } else data[k] = val[0]

    debug("k=%s val=%j", k, val, data[k])
  })
}

function validateString (data, k, val) {
  data[k] = String(val)
}

function validatePath (data, k, val) {
  if (val === true) return false
  if (val === null) return true

  val = String(val)
  var homePattern = process.platform === 'win32' ? /^~(\/|\\)/ : /^~\//
  if (val.match(homePattern) && process.env.HOME) {
    val = path.resolve(process.env.HOME, val.substr(2))
  }
  data[k] = path.resolve(String(val))
  return true
}

function validateNumber (data, k, val) {
  debug("validate Number %j %j %j", k, val, isNaN(val))
  if (isNaN(val)) return false
  data[k] = +val
}

function validateDate (data, k, val) {
  debug("validate Date %j %j %j", k, val, Date.parse(val))
  var s = Date.parse(val)
  if (isNaN(s)) return false
  data[k] = new Date(val)
}

function validateBoolean (data, k, val) {
  if (val instanceof Boolean) val = val.valueOf()
  else if (typeof val === "string") {
    if (!isNaN(val)) val = !!(+val)
    else if (val === "null" || val === "false") val = false
    else val = true
  } else val = !!val
  data[k] = val
}

function validateUrl (data, k, val) {
  val = url.parse(String(val))
  if (!val.host) return false
  data[k] = val.href
}

function validateStream (data, k, val) {
  if (!(val instanceof Stream)) return false
  data[k] = val
}

function validate (data, k, val, type, typeDefs) {
  // arrays are lists of types.
  if (Array.isArray(type)) {
    for (var i = 0, l = type.length; i < l; i ++) {
      if (type[i] === Array) continue
      if (validate(data, k, val, type[i], typeDefs)) return true
    }
    delete data[k]
    return false
  }

  // an array of anything?
  if (type === Array) return true

  // NaN is poisonous.  Means that something is not allowed.
  if (type !== type) {
    debug("Poison NaN", k, val, type)
    delete data[k]
    return false
  }

  // explicit list of values
  if (val === type) {
    debug("Explicitly allowed %j", val)
    // if (isArray) (data[k] = data[k] || []).push(val)
    // else data[k] = val
    data[k] = val
    return true
  }

  // now go through the list of typeDefs, validate against each one.
  var ok = false
    , types = Object.keys(typeDefs)
  for (var i = 0, l = types.length; i < l; i ++) {
    debug("test type %j %j %j", k, val, types[i])
    var t = typeDefs[types[i]]
    if (t && type === t.type) {
      var d = {}
      ok = false !== t.validate(d, k, val)
      val = d[k]
      if (ok) {
        // if (isArray) (data[k] = data[k] || []).push(val)
        // else data[k] = val
        data[k] = val
        break
      }
    }
  }
  debug("OK? %j (%j %j %j)", ok, k, val, types[i])

  if (!ok) delete data[k]
  return ok
}

function parse (args, data, remain, types, shorthands) {
  debug("parse", args, data, remain)

  var key = null
    , abbrevs = abbrev(Object.keys(types))
    , shortAbbr = abbrev(Object.keys(shorthands))

  for (var i = 0; i < args.length; i ++) {
    var arg = args[i]
    debug("arg", arg)

    if (arg.match(/^-{2,}$/)) {
      // done with keys.
      // the rest are args.
      remain.push.apply(remain, args.slice(i + 1))
      args[i] = "--"
      break
    }
    var hadEq = false
    if (arg.charAt(0) === "-" && arg.length > 1) {
      if (arg.indexOf("=") !== -1) {
        hadEq = true
        var v = arg.split("=")
        arg = v.shift()
        v = v.join("=")
        args.splice.apply(args, [i, 1].concat([arg, v]))
      }

      // see if it's a shorthand
      // if so, splice and back up to re-parse it.
      var shRes = resolveShort(arg, shorthands, shortAbbr, abbrevs)
      debug("arg=%j shRes=%j", arg, shRes)
      if (shRes) {
        debug(arg, shRes)
        args.splice.apply(args, [i, 1].concat(shRes))
        if (arg !== shRes[0]) {
          i --
          continue
        }
      }
      arg = arg.replace(/^-+/, "")
      var no = null
      while (arg.toLowerCase().indexOf("no-") === 0) {
        no = !no
        arg = arg.substr(3)
      }

      if (abbrevs[arg]) arg = abbrevs[arg]

      var isArray = types[arg] === Array ||
        Array.isArray(types[arg]) && types[arg].indexOf(Array) !== -1

      // allow unknown things to be arrays if specified multiple times.
      if (!types.hasOwnProperty(arg) && data.hasOwnProperty(arg)) {
        if (!Array.isArray(data[arg]))
          data[arg] = [data[arg]]
        isArray = true
      }

      var val
        , la = args[i + 1]

      var isBool = typeof no === 'boolean' ||
        types[arg] === Boolean ||
        Array.isArray(types[arg]) && types[arg].indexOf(Boolean) !== -1 ||
        (typeof types[arg] === 'undefined' && !hadEq) ||
        (la === "false" &&
         (types[arg] === null ||
          Array.isArray(types[arg]) && ~types[arg].indexOf(null)))

      if (isBool) {
        // just set and move along
        val = !no
        // however, also support --bool true or --bool false
        if (la === "true" || la === "false") {
          val = JSON.parse(la)
          la = null
          if (no) val = !val
          i ++
        }

        // also support "foo":[Boolean, "bar"] and "--foo bar"
        if (Array.isArray(types[arg]) && la) {
          if (~types[arg].indexOf(la)) {
            // an explicit type
            val = la
            i ++
          } else if ( la === "null" && ~types[arg].indexOf(null) ) {
            // null allowed
            val = null
            i ++
          } else if ( !la.match(/^-{2,}[^-]/) &&
                      !isNaN(la) &&
                      ~types[arg].indexOf(Number) ) {
            // number
            val = +la
            i ++
          } else if ( !la.match(/^-[^-]/) && ~types[arg].indexOf(String) ) {
            // string
            val = la
            i ++
          }
        }

        if (isArray) (data[arg] = data[arg] || []).push(val)
        else data[arg] = val

        continue
      }

      if (types[arg] === String && la === undefined)
        la = ""

      if (la && la.match(/^-{2,}$/)) {
        la = undefined
        i --
      }

      val = la === undefined ? true : la
      if (isArray) (data[arg] = data[arg] || []).push(val)
      else data[arg] = val

      i ++
      continue
    }
    remain.push(arg)
  }
}

function resolveShort (arg, shorthands, shortAbbr, abbrevs) {
  // handle single-char shorthands glommed together, like
  // npm ls -glp, but only if there is one dash, and only if
  // all of the chars are single-char shorthands, and it's
  // not a match to some other abbrev.
  arg = arg.replace(/^-+/, '')

  // if it's an exact known option, then don't go any further
  if (abbrevs[arg] === arg)
    return null

  // if it's an exact known shortopt, same deal
  if (shorthands[arg]) {
    // make it an array, if it's a list of words
    if (shorthands[arg] && !Array.isArray(shorthands[arg]))
      shorthands[arg] = shorthands[arg].split(/\s+/)

    return shorthands[arg]
  }

  // first check to see if this arg is a set of single-char shorthands
  var singles = shorthands.___singles
  if (!singles) {
    singles = Object.keys(shorthands).filter(function (s) {
      return s.length === 1
    }).reduce(function (l,r) {
      l[r] = true
      return l
    }, {})
    shorthands.___singles = singles
    debug('shorthand singles', singles)
  }

  var chrs = arg.split("").filter(function (c) {
    return singles[c]
  })

  if (chrs.join("") === arg) return chrs.map(function (c) {
    return shorthands[c]
  }).reduce(function (l, r) {
    return l.concat(r)
  }, [])


  // if it's an arg abbrev, and not a literal shorthand, then prefer the arg
  if (abbrevs[arg] && !shorthands[arg])
    return null

  // if it's an abbr for a shorthand, then use that
  if (shortAbbr[arg])
    arg = shortAbbr[arg]

  // make it an array, if it's a list of words
  if (shorthands[arg] && !Array.isArray(shorthands[arg]))
    shorthands[arg] = shorthands[arg].split(/\s+/)

  return shorthands[arg]
}

}).call(this,require('_process'))
},{"_process":72,"abbrev":26,"path":71,"stream":88,"url":90}],26:[function(require,module,exports){

module.exports = exports = abbrev.abbrev = abbrev

abbrev.monkeyPatch = monkeyPatch

function monkeyPatch () {
  Object.defineProperty(Array.prototype, 'abbrev', {
    value: function () { return abbrev(this) },
    enumerable: false, configurable: true, writable: true
  })

  Object.defineProperty(Object.prototype, 'abbrev', {
    value: function () { return abbrev(Object.keys(this)) },
    enumerable: false, configurable: true, writable: true
  })
}

function abbrev (list) {
  if (arguments.length !== 1 || !Array.isArray(list)) {
    list = Array.prototype.slice.call(arguments, 0)
  }
  for (var i = 0, l = list.length, args = [] ; i < l ; i ++) {
    args[i] = typeof list[i] === "string" ? list[i] : String(list[i])
  }

  // sort them lexicographically, so that they're next to their nearest kin
  args = args.sort(lexSort)

  // walk through each, seeing how much it has in common with the next and previous
  var abbrevs = {}
    , prev = ""
  for (var i = 0, l = args.length ; i < l ; i ++) {
    var current = args[i]
      , next = args[i + 1] || ""
      , nextMatches = true
      , prevMatches = true
    if (current === next) continue
    for (var j = 0, cl = current.length ; j < cl ; j ++) {
      var curChar = current.charAt(j)
      nextMatches = nextMatches && curChar === next.charAt(j)
      prevMatches = prevMatches && curChar === prev.charAt(j)
      if (!nextMatches && !prevMatches) {
        j ++
        break
      }
    }
    prev = current
    if (j === cl) {
      abbrevs[current] = current
      continue
    }
    for (var a = current.substr(0, j) ; j <= cl ; j ++) {
      abbrevs[a] = current
      a += current.charAt(j)
    }
  }
  return abbrevs
}

function lexSort (a, b) {
  return a === b ? 0 : a > b ? 1 : -1
}

},{}],27:[function(require,module,exports){
(function (process){
'use strict'
var Progress = require('are-we-there-yet')
var Gauge = require('gauge')
var EE = require('events').EventEmitter
var log = exports = module.exports = new EE
var util = require('util')

var ansi = require('ansi')
log.cursor = ansi(process.stderr)
log.stream = process.stderr

// by default, let ansi decide based on tty-ness.
var colorEnabled = undefined
log.enableColor = function () {
  colorEnabled = true
  this.cursor.enabled = true
}
log.disableColor = function () {
  colorEnabled = false
  this.cursor.enabled = false
}

// default level
log.level = 'info'

log.gauge = new Gauge(log.cursor)
log.tracker = new Progress.TrackerGroup()

// no progress bars unless asked
log.progressEnabled = false

var gaugeTheme = undefined

log.enableUnicode = function () {
  gaugeTheme = gauge.unicode
  log.gauge.setTheme(gaugeTheme)
}

log.disableUnicode = function () {
  gaugeTheme = gauge.ascii
  log.gauge.setTheme(gaugeTheme)
}

var gaugeTemplate = undefined
log.setGaugeTemplate = function (template) {
  gaugeTemplate = template
  log.gauge.setTemplate(gaugeTemplate)
}

log.enableProgress = function () {
  if (this.progressEnabled) return
  this.progressEnabled = true
  if (this._pause) return
  this.tracker.on('change', this.showProgress)
  this.gauge.enable()
  this.showProgress()
}

log.disableProgress = function () {
  if (!this.progressEnabled) return
  this.clearProgress()
  this.progressEnabled = false
  this.tracker.removeListener('change', this.showProgress)
  this.gauge.disable()
}

var trackerConstructors = ['newGroup', 'newItem', 'newStream']

var mixinLog = function (tracker) {
  // mixin the public methods from log into the tracker
  // (except: conflicts and one's we handle specially)
  Object.keys(log).forEach(function (P) {
    if (P[0] === '_') return
    if (trackerConstructors.filter(function (C) { return C === P }).length) return
    if (tracker[P]) return
    if (typeof log[P] !== 'function') return
    var func = log[P]
    tracker[P] = function () {
      return func.apply(log, arguments)
    }
  })
  // if the new tracker is a group, make sure any subtrackers get
  // mixed in too
  if (tracker instanceof Progress.TrackerGroup) {
    trackerConstructors.forEach(function (C) {
      var func = tracker[C]
      tracker[C] = function () { return mixinLog(func.apply(tracker, arguments)) }
    })
  }
  return tracker
}

// Add tracker constructors to the top level log object
trackerConstructors.forEach(function (C) {
  log[C] = function () { return mixinLog(this.tracker[C].apply(this.tracker, arguments)) }
})

log.clearProgress = function () {
  if (!this.progressEnabled) return
  this.gauge.hide()
}

log.showProgress = function (name) {
  if (!this.progressEnabled) return
  this.gauge.show(name, this.tracker.completed())
}.bind(log) // bind for use in tracker's on-change listener

// temporarily stop emitting, but don't drop
log.pause = function () {
  this._paused = true
}

log.resume = function () {
  if (!this._paused) return
  this._paused = false

  var b = this._buffer
  this._buffer = []
  b.forEach(function (m) {
    this.emitLog(m)
  }, this)
  if (this.progressEnabled) this.enableProgress()
}

log._buffer = []

var id = 0
log.record = []
log.maxRecordSize = 10000
log.log = function (lvl, prefix, message) {
  var l = this.levels[lvl]
  if (l === undefined) {
    return this.emit('error', new Error(util.format(
      'Undefined log level: %j', lvl)))
  }

  var a = new Array(arguments.length - 2)
  var stack = null
  for (var i = 2; i < arguments.length; i ++) {
    var arg = a[i-2] = arguments[i]

    // resolve stack traces to a plain string.
    if (typeof arg === 'object' && arg &&
        (arg instanceof Error) && arg.stack) {
      arg.stack = stack = arg.stack + ''
    }
  }
  if (stack) a.unshift(stack + '\n')
  message = util.format.apply(util, a)

  var m = { id: id++,
            level: lvl,
            prefix: String(prefix || ''),
            message: message,
            messageRaw: a }

  this.emit('log', m)
  this.emit('log.' + lvl, m)
  if (m.prefix) this.emit(m.prefix, m)

  this.record.push(m)
  var mrs = this.maxRecordSize
  var n = this.record.length - mrs
  if (n > mrs / 10) {
    var newSize = Math.floor(mrs * 0.9)
    this.record = this.record.slice(-1 * newSize)
  }

  this.emitLog(m)
}.bind(log)

log.emitLog = function (m) {
  if (this._paused) {
    this._buffer.push(m)
    return
  }
  if (this.progressEnabled) this.gauge.pulse(m.prefix)
  var l = this.levels[m.level]
  if (l === undefined) return
  if (l < this.levels[this.level]) return
  if (l > 0 && !isFinite(l)) return

  var style = log.style[m.level]
  var disp = log.disp[m.level] || m.level
  this.clearProgress()
  m.message.split(/\r?\n/).forEach(function (line) {
    if (this.heading) {
      this.write(this.heading, this.headingStyle)
      this.write(' ')
    }
    this.write(disp, log.style[m.level])
    var p = m.prefix || ''
    if (p) this.write(' ')
    this.write(p, this.prefixStyle)
    this.write(' ' + line + '\n')
  }, this)
  this.showProgress()
}

log.write = function (msg, style) {
  if (!this.cursor) return
  if (this.stream !== this.cursor.stream) {
    this.cursor = ansi(this.stream, { enabled: colorEnabled })
    var options = {}
    if (gaugeTheme != null) options.theme = gaugeTheme
    if (gaugeTemplate != null) options.template = gaugeTemplate
    this.gauge = new Gauge(options, this.cursor)
  }

  style = style || {}
  if (style.fg) this.cursor.fg[style.fg]()
  if (style.bg) this.cursor.bg[style.bg]()
  if (style.bold) this.cursor.bold()
  if (style.underline) this.cursor.underline()
  if (style.inverse) this.cursor.inverse()
  if (style.beep) this.cursor.beep()
  this.cursor.write(msg).reset()
}

log.addLevel = function (lvl, n, style, disp) {
  if (!disp) disp = lvl
  this.levels[lvl] = n
  this.style[lvl] = style
  if (!this[lvl]) this[lvl] = function () {
    var a = new Array(arguments.length + 1)
    a[0] = lvl
    for (var i = 0; i < arguments.length; i ++) {
      a[i + 1] = arguments[i]
    }
    return this.log.apply(this, a)
  }.bind(this)
  this.disp[lvl] = disp
}

log.prefixStyle = { fg: 'magenta' }
log.headingStyle = { fg: 'white', bg: 'black' }

log.style = {}
log.levels = {}
log.disp = {}
log.addLevel('silly', -Infinity, { inverse: true }, 'sill')
log.addLevel('verbose', 1000, { fg: 'blue', bg: 'black' }, 'verb')
log.addLevel('info', 2000, { fg: 'green' })
log.addLevel('http', 3000, { fg: 'green', bg: 'black' })
log.addLevel('warn', 4000, { fg: 'black', bg: 'yellow' }, 'WARN')
log.addLevel('error', 5000, { fg: 'red', bg: 'black' }, 'ERR!')
log.addLevel('silent', Infinity)

}).call(this,require('_process'))
},{"_process":72,"ansi":28,"are-we-there-yet":30,"events":67,"gauge":55,"util":92}],28:[function(require,module,exports){

/**
 * References:
 *
 *   - http://en.wikipedia.org/wiki/ANSI_escape_code
 *   - http://www.termsys.demon.co.uk/vtansi.htm
 *
 */

/**
 * Module dependencies.
 */

var emitNewlineEvents = require('./newlines')
  , prefix = '\x1b[' // For all escape codes
  , suffix = 'm'     // Only for color codes

/**
 * The ANSI escape sequences.
 */

var codes = {
    up: 'A'
  , down: 'B'
  , forward: 'C'
  , back: 'D'
  , nextLine: 'E'
  , previousLine: 'F'
  , horizontalAbsolute: 'G'
  , eraseData: 'J'
  , eraseLine: 'K'
  , scrollUp: 'S'
  , scrollDown: 'T'
  , savePosition: 's'
  , restorePosition: 'u'
  , queryPosition: '6n'
  , hide: '?25l'
  , show: '?25h'
}

/**
 * Rendering ANSI codes.
 */

var styles = {
    bold: 1
  , italic: 3
  , underline: 4
  , inverse: 7
}

/**
 * The negating ANSI code for the rendering modes.
 */

var reset = {
    bold: 22
  , italic: 23
  , underline: 24
  , inverse: 27
}

/**
 * The standard, styleable ANSI colors.
 */

var colors = {
    white: 37
  , black: 30
  , blue: 34
  , cyan: 36
  , green: 32
  , magenta: 35
  , red: 31
  , yellow: 33
  , grey: 90
  , brightBlack: 90
  , brightRed: 91
  , brightGreen: 92
  , brightYellow: 93
  , brightBlue: 94
  , brightMagenta: 95
  , brightCyan: 96
  , brightWhite: 97
}


/**
 * Creates a Cursor instance based off the given `writable stream` instance.
 */

function ansi (stream, options) {
  if (stream._ansicursor) {
    return stream._ansicursor
  } else {
    return stream._ansicursor = new Cursor(stream, options)
  }
}
module.exports = exports = ansi

/**
 * The `Cursor` class.
 */

function Cursor (stream, options) {
  if (!(this instanceof Cursor)) {
    return new Cursor(stream, options)
  }
  if (typeof stream != 'object' || typeof stream.write != 'function') {
    throw new Error('a valid Stream instance must be passed in')
  }

  // the stream to use
  this.stream = stream

  // when 'enabled' is false then all the functions are no-ops except for write()
  this.enabled = options && options.enabled
  if (typeof this.enabled === 'undefined') {
    this.enabled = stream.isTTY
  }
  this.enabled = !!this.enabled

  // then `buffering` is true, then `write()` calls are buffered in
  // memory until `flush()` is invoked
  this.buffering = !!(options && options.buffering)
  this._buffer = []

  // controls the foreground and background colors
  this.fg = this.foreground = new Colorer(this, 0)
  this.bg = this.background = new Colorer(this, 10)

  // defaults
  this.Bold = false
  this.Italic = false
  this.Underline = false
  this.Inverse = false

  // keep track of the number of "newlines" that get encountered
  this.newlines = 0
  emitNewlineEvents(stream)
  stream.on('newline', function () {
    this.newlines++
  }.bind(this))
}
exports.Cursor = Cursor

/**
 * Helper function that calls `write()` on the underlying Stream.
 * Returns `this` instead of the write() return value to keep
 * the chaining going.
 */

Cursor.prototype.write = function (data) {
  if (this.buffering) {
    this._buffer.push(arguments)
  } else {
    this.stream.write.apply(this.stream, arguments)
  }
  return this
}

/**
 * Buffer `write()` calls into memory.
 *
 * @api public
 */

Cursor.prototype.buffer = function () {
  this.buffering = true
  return this
}

/**
 * Write out the in-memory buffer.
 *
 * @api public
 */

Cursor.prototype.flush = function () {
  this.buffering = false
  var str = this._buffer.map(function (args) {
    if (args.length != 1) throw new Error('unexpected args length! ' + args.length);
    return args[0];
  }).join('');
  this._buffer.splice(0); // empty
  this.write(str);
  return this
}


/**
 * The `Colorer` class manages both the background and foreground colors.
 */

function Colorer (cursor, base) {
  this.current = null
  this.cursor = cursor
  this.base = base
}
exports.Colorer = Colorer

/**
 * Write an ANSI color code, ensuring that the same code doesn't get rewritten.
 */

Colorer.prototype._setColorCode = function setColorCode (code) {
  var c = String(code)
  if (this.current === c) return
  this.cursor.enabled && this.cursor.write(prefix + c + suffix)
  this.current = c
  return this
}


/**
 * Set up the positional ANSI codes.
 */

Object.keys(codes).forEach(function (name) {
  var code = String(codes[name])
  Cursor.prototype[name] = function () {
    var c = code
    if (arguments.length > 0) {
      c = toArray(arguments).map(Math.round).join(';') + code
    }
    this.enabled && this.write(prefix + c)
    return this
  }
})

/**
 * Set up the functions for the rendering ANSI codes.
 */

Object.keys(styles).forEach(function (style) {
  var name = style[0].toUpperCase() + style.substring(1)
    , c = styles[style]
    , r = reset[style]

  Cursor.prototype[style] = function () {
    if (this[name]) return
    this.enabled && this.write(prefix + c + suffix)
    this[name] = true
    return this
  }

  Cursor.prototype['reset' + name] = function () {
    if (!this[name]) return
    this.enabled && this.write(prefix + r + suffix)
    this[name] = false
    return this
  }
})

/**
 * Setup the functions for the standard colors.
 */

Object.keys(colors).forEach(function (color) {
  var code = colors[color]

  Colorer.prototype[color] = function () {
    this._setColorCode(this.base + code)
    return this.cursor
  }

  Cursor.prototype[color] = function () {
    return this.foreground[color]()
  }
})

/**
 * Makes a beep sound!
 */

Cursor.prototype.beep = function () {
  this.enabled && this.write('\x07')
  return this
}

/**
 * Moves cursor to specific position
 */

Cursor.prototype.goto = function (x, y) {
  x = x | 0
  y = y | 0
  this.enabled && this.write(prefix + y + ';' + x + 'H')
  return this
}

/**
 * Resets the color.
 */

Colorer.prototype.reset = function () {
  this._setColorCode(this.base + 39)
  return this.cursor
}

/**
 * Resets all ANSI formatting on the stream.
 */

Cursor.prototype.reset = function () {
  this.enabled && this.write(prefix + '0' + suffix)
  this.Bold = false
  this.Italic = false
  this.Underline = false
  this.Inverse = false
  this.foreground.current = null
  this.background.current = null
  return this
}

/**
 * Sets the foreground color with the given RGB values.
 * The closest match out of the 216 colors is picked.
 */

Colorer.prototype.rgb = function (r, g, b) {
  var base = this.base + 38
    , code = rgb(r, g, b)
  this._setColorCode(base + ';5;' + code)
  return this.cursor
}

/**
 * Same as `cursor.fg.rgb(r, g, b)`.
 */

Cursor.prototype.rgb = function (r, g, b) {
  return this.foreground.rgb(r, g, b)
}

/**
 * Accepts CSS color codes for use with ANSI escape codes.
 * For example: `#FF000` would be bright red.
 */

Colorer.prototype.hex = function (color) {
  return this.rgb.apply(this, hex(color))
}

/**
 * Same as `cursor.fg.hex(color)`.
 */

Cursor.prototype.hex = function (color) {
  return this.foreground.hex(color)
}


// UTIL FUNCTIONS //

/**
 * Translates a 255 RGB value to a 0-5 ANSI RGV value,
 * then returns the single ANSI color code to use.
 */

function rgb (r, g, b) {
  var red = r / 255 * 5
    , green = g / 255 * 5
    , blue = b / 255 * 5
  return rgb5(red, green, blue)
}

/**
 * Turns rgb 0-5 values into a single ANSI color code to use.
 */

function rgb5 (r, g, b) {
  var red = Math.round(r)
    , green = Math.round(g)
    , blue = Math.round(b)
  return 16 + (red*36) + (green*6) + blue
}

/**
 * Accepts a hex CSS color code string (# is optional) and
 * translates it into an Array of 3 RGB 0-255 values, which
 * can then be used with rgb().
 */

function hex (color) {
  var c = color[0] === '#' ? color.substring(1) : color
    , r = c.substring(0, 2)
    , g = c.substring(2, 4)
    , b = c.substring(4, 6)
  return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)]
}

/**
 * Turns an array-like object into a real array.
 */

function toArray (a) {
  var i = 0
    , l = a.length
    , rtn = []
  for (; i<l; i++) {
    rtn.push(a[i])
  }
  return rtn
}

},{"./newlines":29}],29:[function(require,module,exports){

/**
 * Accepts any node Stream instance and hijacks its "write()" function,
 * so that it can count any newlines that get written to the output.
 *
 * When a '\n' byte is encountered, then a "newline" event will be emitted
 * on the stream, with no arguments. It is up to the listeners to determine
 * any necessary deltas required for their use-case.
 *
 * Ex:
 *
 *   var cursor = ansi(process.stdout)
 *     , ln = 0
 *   process.stdout.on('newline', function () {
 *    ln++
 *   })
 */

/**
 * Module dependencies.
 */

var assert = require('assert')
var NEWLINE = '\n'.charCodeAt(0)

function emitNewlineEvents (stream) {
  if (stream._emittingNewlines) {
    // already emitting newline events
    return
  }

  var write = stream.write

  stream.write = function (data) {
    // first write the data
    var rtn = write.apply(stream, arguments)

    if (stream.listeners('newline').length > 0) {
      var len = data.length
        , i = 0
      // now try to calculate any deltas
      if (typeof data == 'string') {
        for (; i<len; i++) {
          processByte(stream, data.charCodeAt(i))
        }
      } else {
        // buffer
        for (; i<len; i++) {
          processByte(stream, data[i])
        }
      }
    }

    return rtn
  }

  stream._emittingNewlines = true
}
module.exports = emitNewlineEvents


/**
 * Processes an individual byte being written to a stream
 */

function processByte (stream, b) {
  assert.equal(typeof b, 'number')
  if (b === NEWLINE) {
    stream.emit('newline')
  }
}

},{"assert":61}],30:[function(require,module,exports){
"use strict"
var stream = require("readable-stream");
var EventEmitter = require("events").EventEmitter
var util = require("util")
var delegate = require("delegates")

var TrackerGroup = exports.TrackerGroup = function (name) {
  EventEmitter.call(this)
  this.name = name
  this.trackGroup = []
  var self = this
  this.totalWeight = 0
  var noteChange = this.noteChange = function (name) {
    self.emit("change", name || this.name)
  }.bind(this)
  this.trackGroup.forEach(function(unit) {
    unit.on("change", noteChange)
  })
}
util.inherits(TrackerGroup, EventEmitter)

TrackerGroup.prototype.completed = function () {
  if (this.trackGroup.length==0) return 0
  var valPerWeight = 1 / this.totalWeight
  var completed = 0
  this.trackGroup.forEach(function(T) {
    completed += valPerWeight * T.weight *  T.completed()
  })
  return completed
}

TrackerGroup.prototype.addUnit = function (unit, weight, noChange) {
  unit.weight = weight || 1
  this.totalWeight += unit.weight
  this.trackGroup.push(unit)
  unit.on("change", this.noteChange)
  if (! noChange) this.emit("change", this.name)
  return unit
}

TrackerGroup.prototype.newGroup = function (name, weight) {
  return this.addUnit(new TrackerGroup(name), weight)
}

TrackerGroup.prototype.newItem = function (name, todo, weight) {
  return this.addUnit(new Tracker(name, todo), weight)
}

TrackerGroup.prototype.newStream = function (name, todo, weight) {
  return this.addUnit(new TrackerStream(name, todo), weight)
}

TrackerGroup.prototype.finish = function () {
  if (! this.trackGroup.length) { this.addUnit(new Tracker(), 1, true) }
  var self = this
  this.trackGroup.forEach(function(T) {
    T.removeListener("change", self.noteChange)
    T.finish()
  })
  this.emit("change", this.name)
}

var buffer = "                                  "
TrackerGroup.prototype.debug = function (depth) {
  depth = depth || 0
  var indent = depth ? buffer.substr(0,depth) : ""
  var output = indent + (this.name||"top") + ": " + this.completed() + "\n"
  this.trackGroup.forEach(function(T) {
    if (T instanceof TrackerGroup) {
      output += T.debug(depth + 1)
    }
    else {
      output += indent + " " + T.name + ": " + T.completed() + "\n"
    }
  })
  return output
}

var Tracker = exports.Tracker = function (name,todo) {
  EventEmitter.call(this)
  this.name = name
  this.workDone =  0
  this.workTodo = todo || 0
}
util.inherits(Tracker, EventEmitter)

Tracker.prototype.completed = function () {
  return this.workTodo==0 ? 0 : this.workDone / this.workTodo
}

Tracker.prototype.addWork = function (work) {
  this.workTodo += work
  this.emit("change", this.name)
}

Tracker.prototype.completeWork = function (work) {
  this.workDone += work
  if (this.workDone > this.workTodo) this.workDone = this.workTodo
  this.emit("change", this.name)
}

Tracker.prototype.finish = function () {
  this.workTodo = this.workDone = 1
  this.emit("change", this.name)
}


var TrackerStream = exports.TrackerStream = function (name, size, options) {
  stream.Transform.call(this, options)
  this.tracker = new Tracker(name, size)
  this.name = name
  var self = this
  this.tracker.on("change", function (name) { self.emit("change", name) })
}
util.inherits(TrackerStream, stream.Transform)

TrackerStream.prototype._transform = function (data, encoding, cb) {
  this.tracker.completeWork(data.length ? data.length : 1)
  this.push(data)
  cb()
}

TrackerStream.prototype._flush = function (cb) {
  this.tracker.finish()
  cb()
}

delegate(TrackerStream.prototype, "tracker")
  .method("completed")
  .method("addWork")

},{"delegates":31,"events":67,"readable-stream":41,"util":92}],31:[function(require,module,exports){

/**
 * Expose `Delegator`.
 */

module.exports = Delegator;

/**
 * Initialize a delegator.
 *
 * @param {Object} proto
 * @param {String} target
 * @api public
 */

function Delegator(proto, target) {
  if (!(this instanceof Delegator)) return new Delegator(proto, target);
  this.proto = proto;
  this.target = target;
  this.methods = [];
  this.getters = [];
  this.setters = [];
  this.fluents = [];
}

/**
 * Delegate method `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.method = function(name){
  var proto = this.proto;
  var target = this.target;
  this.methods.push(name);

  proto[name] = function(){
    return this[target][name].apply(this[target], arguments);
  };

  return this;
};

/**
 * Delegator accessor `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.access = function(name){
  return this.getter(name).setter(name);
};

/**
 * Delegator getter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.getter = function(name){
  var proto = this.proto;
  var target = this.target;
  this.getters.push(name);

  proto.__defineGetter__(name, function(){
    return this[target][name];
  });

  return this;
};

/**
 * Delegator setter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.setter = function(name){
  var proto = this.proto;
  var target = this.target;
  this.setters.push(name);

  proto.__defineSetter__(name, function(val){
    return this[target][name] = val;
  });

  return this;
};

/**
 * Delegator fluent accessor
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.fluent = function (name) {
  var proto = this.proto;
  var target = this.target;
  this.fluents.push(name);

  proto[name] = function(val){
    if ('undefined' != typeof val) {
      this[target][name] = val;
      return this;
    } else {
      return this[target][name];
    }
  };

  return this;
};

},{}],32:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
/*</replacement>*/


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

forEach(objectKeys(Writable.prototype), function(method) {
  if (!Duplex.prototype[method])
    Duplex.prototype[method] = Writable.prototype[method];
});

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(this.end.bind(this));
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

}).call(this,require('_process'))
},{"./_stream_readable":34,"./_stream_writable":36,"_process":72,"core-util-is":37,"inherits":38}],33:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

},{"./_stream_transform":35,"core-util-is":37,"inherits":38}],34:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/


/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Readable.ReadableState = ReadableState;

var EE = require('events').EventEmitter;

/*<replacement>*/
if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

var Stream = require('stream');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var StringDecoder;


/*<replacement>*/
var debug = require('util');
if (debug && debug.debuglog) {
  debug = debug.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/


util.inherits(Readable, Stream);

function ReadableState(options, stream) {
  var Duplex = require('./_stream_duplex');

  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.readableObjectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  var Duplex = require('./_stream_duplex');

  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (util.isString(chunk) && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (util.isNullOrUndefined(chunk)) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      if (!addToFront)
        state.reading = false;

      // if we want the data now, just emit it.
      if (state.flowing && state.length === 0 && !state.sync) {
        stream.emit('data', chunk);
        stream.read(0);
      } else {
        // update the buffer info.
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront)
          state.buffer.unshift(chunk);
        else
          state.buffer.push(chunk);

        if (state.needReadable)
          emitReadable(stream);
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (isNaN(n) || util.isNull(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  debug('read', n);
  var state = this._readableState;
  var nOrig = n;

  if (!util.isNumber(n) || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended)
      endReadable(this);
    else
      emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0)
      endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  }

  if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read pushed data synchronously, then `reading` will be false,
  // and we need to re-evaluate how much data we can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (util.isNull(ret)) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we tried to read() past the EOF, then emit end on the next tick.
  if (nOrig !== n && state.ended && state.length === 0)
    endReadable(this);

  if (!util.isNull(ret))
    this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!util.isBuffer(chunk) &&
      !util.isString(chunk) &&
      !util.isNullOrUndefined(chunk) &&
      !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync)
      process.nextTick(function() {
        emitReadable_(stream);
      });
    else
      emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    process.nextTick(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain &&
        (!dest._writableState || dest._writableState.needDrain))
      ondrain();
  }

  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    if (false === ret) {
      debug('false write response, pause',
            src._readableState.awaitDrain);
      src._readableState.awaitDrain++;
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
  if (!dest._events || !dest._events.error)
    dest.on('error', onerror);
  else if (isArray(dest._events.error))
    dest._events.error.unshift(onerror);
  else
    dest._events.error = [onerror, dest._events.error];



  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain)
      state.awaitDrain--;
    if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  // If listening to data, and it has not explicitly been paused,
  // then call resume to start the flow of data on the next tick.
  if (ev === 'data' && false !== this._readableState.flowing) {
    this.resume();
  }

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        var self = this;
        process.nextTick(function() {
          debug('readable nexttick read 0');
          self.read(0);
        });
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    if (!state.reading) {
      debug('resume read 0');
      this.read(0);
    }
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(function() {
      resume_(stream, state);
    });
  }
}

function resume_(stream, state) {
  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading)
    stream.read(0);
}

Readable.prototype.pause = function() {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  if (state.flowing) {
    do {
      var chunk = stream.read();
    } while (null !== chunk && state.flowing);
  }
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    debug('wrapped data');
    if (state.decoder)
      chunk = state.decoder.write(chunk);
    if (!chunk || !state.objectMode && !chunk.length)
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

}).call(this,require('_process'))
},{"./_stream_duplex":32,"_process":72,"buffer":63,"core-util-is":37,"events":67,"inherits":38,"isarray":39,"stream":88,"string_decoder/":40,"util":62}],35:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (!util.isNullOrUndefined(data))
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('prefinish', function() {
    if (util.isFunction(this._flush))
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"./_stream_duplex":32,"core-util-is":37,"inherits":38}],36:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;

/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Writable.WritableState = WritableState;


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Stream = require('stream');

util.inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  var Duplex = require('./_stream_duplex');

  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.writableObjectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;
}

function Writable(options) {
  var Duplex = require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  process.nextTick(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!util.isBuffer(chunk) &&
      !util.isString(chunk) &&
      !util.isNullOrUndefined(chunk) &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    process.nextTick(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (util.isFunction(encoding)) {
    cb = encoding;
    encoding = null;
  }

  if (util.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (!util.isFunction(cb))
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function() {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function() {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing &&
        !state.corked &&
        !state.finished &&
        !state.bufferProcessing &&
        state.buffer.length)
      clearBuffer(this, state);
  }
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      util.isString(chunk)) {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (util.isBuffer(chunk))
    encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret)
    state.needDrain = true;

  if (state.writing || state.corked)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, false, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev)
    stream._writev(chunk, state.onwrite);
  else
    stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    process.nextTick(function() {
      state.pendingcb--;
      cb(er);
    });
  else {
    state.pendingcb--;
    cb(er);
  }

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished &&
        !state.corked &&
        !state.bufferProcessing &&
        state.buffer.length) {
      clearBuffer(stream, state);
    }

    if (sync) {
      process.nextTick(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  if (stream._writev && state.buffer.length > 1) {
    // Fast case, write everything using _writev()
    var cbs = [];
    for (var c = 0; c < state.buffer.length; c++)
      cbs.push(state.buffer[c].callback);

    // count the one we are adding, as well.
    // TODO(isaacs) clean this up
    state.pendingcb++;
    doWrite(stream, state, true, state.length, state.buffer, '', function(err) {
      for (var i = 0; i < cbs.length; i++) {
        state.pendingcb--;
        cbs[i](err);
      }
    });

    // Clear buffer
    state.buffer = [];
  } else {
    // Slow case, write chunks one-by-one
    for (var c = 0; c < state.buffer.length; c++) {
      var entry = state.buffer[c];
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);

      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        c++;
        break;
      }
    }

    if (c < state.buffer.length)
      state.buffer = state.buffer.slice(c);
    else
      state.buffer.length = 0;
  }

  state.bufferProcessing = false;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));

};

Writable.prototype._writev = null;

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (util.isFunction(chunk)) {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (util.isFunction(encoding)) {
    cb = encoding;
    encoding = null;
  }

  if (!util.isNullOrUndefined(chunk))
    this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else
      prefinish(stream, state);
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      process.nextTick(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

}).call(this,require('_process'))
},{"./_stream_duplex":32,"_process":72,"buffer":63,"core-util-is":37,"inherits":38,"stream":88}],37:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

function isBuffer(arg) {
  return Buffer.isBuffer(arg);
}
exports.isBuffer = isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}
}).call(this,require("buffer").Buffer)
},{"buffer":63}],38:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],39:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],40:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":63}],41:[function(require,module,exports){
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = require('stream');
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":32,"./lib/_stream_passthrough.js":33,"./lib/_stream_readable.js":34,"./lib/_stream_transform.js":35,"./lib/_stream_writable.js":36,"stream":88}],42:[function(require,module,exports){
(function (process){
"use strict"
var os = require("os")
var child_process = require("child_process")

var hasUnicode = module.exports = function () {
  // Supported Win32 platforms (>XP) support unicode in the console, though
  // font support isn't fantastic.
  if (os.type() == "Windows_NT") { return true }

  var isUTF8 = /[.]UTF-8/
  if (isUTF8.test(process.env.LC_ALL)
   || process.env.LC_CTYPE == 'UTF-8'
   || isUTF8.test(process.env.LANG)) {
    return true
  }

  return false
}

}).call(this,require('_process'))
},{"_process":72,"child_process":60,"os":70}],43:[function(require,module,exports){
(function (global){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseToString = require('lodash._basetostring'),
    createPadding = require('lodash._createpadding');

/** Native method references. */
var ceil = Math.ceil,
    floor = Math.floor;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsFinite = global.isFinite;

/**
 * Pads `string` on the left and right sides if it is shorter than `length`.
 * Padding characters are truncated if they can't be evenly divided by `length`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to pad.
 * @param {number} [length=0] The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the padded string.
 * @example
 *
 * _.pad('abc', 8);
 * // => '  abc   '
 *
 * _.pad('abc', 8, '_-');
 * // => '_-abc_-_'
 *
 * _.pad('abc', 3);
 * // => 'abc'
 */
function pad(string, length, chars) {
  string = baseToString(string);
  length = +length;

  var strLength = string.length;
  if (strLength >= length || !nativeIsFinite(length)) {
    return string;
  }
  var mid = (length - strLength) / 2,
      leftLength = floor(mid),
      rightLength = ceil(mid);

  chars = createPadding('', rightLength, chars);
  return chars.slice(0, leftLength) + string + chars;
}

module.exports = pad;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"lodash._basetostring":44,"lodash._createpadding":45}],44:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Converts `value` to a string if it is not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],45:[function(require,module,exports){
(function (global){
/**
 * lodash 3.6.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var repeat = require('lodash.repeat');

/** Native method references. */
var ceil = Math.ceil;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsFinite = global.isFinite;

/**
 * Creates the padding required for `string` based on the given `length`.
 * The `chars` string is truncated if the number of characters exceeds `length`.
 *
 * @private
 * @param {string} string The string to create padding for.
 * @param {number} [length=0] The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the pad for `string`.
 */
function createPadding(string, length, chars) {
  var strLength = string.length;
  length = +length;

  if (strLength >= length || !nativeIsFinite(length)) {
    return '';
  }
  var padLength = length - strLength;
  chars = chars == null ? ' ' : (chars + '');
  return repeat(chars, ceil(padLength / chars.length)).slice(0, padLength);
}

module.exports = createPadding;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"lodash.repeat":46}],46:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseToString = require('lodash._basetostring');

/** Native method references. */
var floor = Math.floor;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsFinite = global.isFinite;

/**
 * Repeats the given string `n` times.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to repeat.
 * @param {number} [n=0] The number of times to repeat the string.
 * @returns {string} Returns the repeated string.
 * @example
 *
 * _.repeat('*', 3);
 * // => '***'
 *
 * _.repeat('abc', 2);
 * // => 'abcabc'
 *
 * _.repeat('abc', 0);
 * // => ''
 */
function repeat(string, n) {
  var result = '';
  string = baseToString(string);
  n = +n;
  if (n < 1 || !string || !nativeIsFinite(n)) {
    return result;
  }
  // Leverage the exponentiation by squaring algorithm for a faster repeat.
  // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
  do {
    if (n % 2) {
      result += string;
    }
    n = floor(n / 2);
    string += string;
  } while (n);

  return result;
}

module.exports = repeat;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"lodash._basetostring":44}],47:[function(require,module,exports){
/**
 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseToString = require('lodash._basetostring'),
    createPadding = require('lodash._createpadding');

/**
 * Creates a function for `_.padLeft` or `_.padRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify padding from the right.
 * @returns {Function} Returns the new pad function.
 */
function createPadDir(fromRight) {
  return function(string, length, chars) {
    string = baseToString(string);
    return (fromRight ? string : '') + createPadding(string, length, chars) + (fromRight ? '' : string);
  };
}

/**
 * Pads `string` on the left side if it is shorter than `length`. Padding
 * characters are truncated if they exceed `length`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to pad.
 * @param {number} [length=0] The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the padded string.
 * @example
 *
 * _.padLeft('abc', 6);
 * // => '   abc'
 *
 * _.padLeft('abc', 6, '_-');
 * // => '_-_abc'
 *
 * _.padLeft('abc', 3);
 * // => 'abc'
 */
var padLeft = createPadDir();

module.exports = padLeft;

},{"lodash._basetostring":48,"lodash._createpadding":49}],48:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44}],49:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"dup":45,"lodash.repeat":50}],50:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46,"lodash._basetostring":48}],51:[function(require,module,exports){
/**
 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseToString = require('lodash._basetostring'),
    createPadding = require('lodash._createpadding');

/**
 * Creates a function for `_.padLeft` or `_.padRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify padding from the right.
 * @returns {Function} Returns the new pad function.
 */
function createPadDir(fromRight) {
  return function(string, length, chars) {
    string = baseToString(string);
    return (fromRight ? string : '') + createPadding(string, length, chars) + (fromRight ? '' : string);
  };
}

/**
 * Pads `string` on the right side if it is shorter than `length`. Padding
 * characters are truncated if they exceed `length`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to pad.
 * @param {number} [length=0] The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the padded string.
 * @example
 *
 * _.padRight('abc', 6);
 * // => 'abc   '
 *
 * _.padRight('abc', 6, '_-');
 * // => 'abc_-_'
 *
 * _.padRight('abc', 3);
 * // => 'abc'
 */
var padRight = createPadDir(true);

module.exports = padRight;

},{"lodash._basetostring":52,"lodash._createpadding":53}],52:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44}],53:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"dup":45,"lodash.repeat":54}],54:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46,"lodash._basetostring":52}],55:[function(require,module,exports){
(function (process){
"use strict"
var hasUnicode = require("has-unicode")
var ansi = require("ansi")
var align = {
  center: require("lodash.pad"),
  left:   require("lodash.padright"),
  right:  require("lodash.padleft")
}
var defaultStream = process.stderr
function isTTY() {
  return process.stderr.isTTY
}
function getWritableTTYColumns() {
  // One less than the actual as writing to the final column wraps the line
  return process.stderr.columns - 1
}

var ProgressBar = module.exports = function (options, cursor) {
  if (! options) options = {}
  if (! cursor && options.write) {
    cursor = options
    options = {}
  }
  if (! cursor) {
    cursor = ansi(defaultStream)
  }
  this.cursor = cursor
  this.showing = false
  this.theme = options.theme || (hasUnicode() ? ProgressBar.unicode : ProgressBar.ascii)
  this.template = options.template || [
    {type: "name", separated: true, length: 25},
    {type: "spinner", separated: true},
    {type: "startgroup"},
    {type: "completionbar"},
    {type: "endgroup"}
  ]
  this.updatefreq = options.maxUpdateFrequency || 50
  this.lastName = ""
  this.lastCompleted = 0
  this.spun = 0
  this.last = new Date(0)
}
ProgressBar.prototype = {}

ProgressBar.unicode = {
  startgroup: "╢",
  endgroup: "╟",
  complete: "█",
  incomplete: "░",
  spinner: "▀▐▄▌",
  subsection: "→"
}

ProgressBar.ascii = {
  startgroup: "|",
  endgroup: "|",
  complete: "#",
  incomplete: "-",
  spinner: "-\\|/",
  subsection: "->"
}

ProgressBar.prototype.setTheme = function(theme) {
  this.theme = theme
}

ProgressBar.prototype.setTemplate = function(template) {
  this.template = template
}

ProgressBar.prototype.disable = function() {
  this.hide()
  this.disabled = true
}

ProgressBar.prototype.enable = function() {
  this.disabled = false
  this.show()
}

ProgressBar.prototype.hide = function() {
  if (!isTTY()) return
  if (this.disabled) return
  this.cursor.show()
  if (this.showing) this.cursor.up(1)
  this.cursor.horizontalAbsolute(0).eraseLine()
  this.showing = false
}

var repeat = function (str, count) {
  var out = ""
  for (var ii=0; ii<count; ++ii) out += str
  return out
}

ProgressBar.prototype.pulse = function(name) {
  ++ this.spun
  if (! this.showing) return
  if (this.disabled) return

  var baseName = this.lastName
  name = name
       ? ( baseName
         ? baseName + " " + this.theme.subsection + " " + name
         : null )
       : baseName
  this.show(name)
  this.lastName = baseName
}

ProgressBar.prototype.show = function(name, completed) {
  name = this.lastName = name || this.lastName
  completed = this.lastCompleted = completed || this.lastCompleted

  if (!isTTY()) return
  if (this.disabled) return
  if (! this.spun && ! completed) return
  if (this.tryAgain) {
    clearTimeout(this.tryAgain)
    this.tryAgain = null
  }
  var self = this
  if (this.showing && new Date() - this.last < this.updatefreq) {
    this.tryAgain = setTimeout(function () {
      if (self.disabled) return
      if (! self.spun && ! completed) return
      drawBar()
    }, this.updatefreq - (new Date() - this.last))
    return
  }

  return drawBar()

  function drawBar() {
    var values = {
      name: name,
      spinner: self.spun,
      completed: completed
    }

    self.last = new Date()

    var statusline = self.renderTemplate(self.theme, self.template, values)

    if (self.showing) self.cursor.up(1)
    self.cursor
        .hide()
        .horizontalAbsolute(0)
        .write(statusline.substr(0, getWritableTTYColumns()) + "\n")
        .show()

    self.showing = true
  }
}

ProgressBar.prototype.renderTemplate = function (theme, template, values) {
  values.startgroup = theme.startgroup
  values.endgroup = theme.endgroup
  values.spinner = values.spinner
    ? theme.spinner.substr(values.spinner % theme.spinner.length,1)
    : ""

  var output = {prebar: "", postbar: ""}
  var status = "prebar"
  var self = this
  template.forEach(function(T) {
    if (typeof T === "string") {
      output[status] += T
      return
    }
    if (T.type === "completionbar") {
      status = "postbar"
      return
    }
    if (!values.hasOwnProperty(T.type)) throw new Error("Unknown template value '"+T.type+"'")
    var value = self.renderValue(T, values[T.type])
    if (value === "") return
    var sofar = output[status].length
    var lastChar = sofar ? output[status][sofar-1] : null
    if (T.separated && sofar && lastChar !== " ") {
      output[status] += " "
    }
    output[status] += value
    if (T.separated) output[status] += " "
  })

  var bar = ""
  if (status === "postbar") {
    var nonBarLen = output.prebar.length + output.postbar.length

    var barLen = getWritableTTYColumns() - nonBarLen
    var sofar = Math.round(barLen * Math.max(0,Math.min(1,values.completed||0)))
    var rest = barLen - sofar
    bar = repeat(theme.complete, sofar)
        + repeat(theme.incomplete, rest)
  }

  return output.prebar + bar + output.postbar
}
ProgressBar.prototype.renderValue = function (template, value) {
  if (value == null || value === "") return ""
  var maxLength = template.maxLength || template.length
  var minLength = template.minLength || template.length
  var alignWith = align[template.align] || align.left
//  if (maxLength) value = value.substr(-1 * maxLength)
  if (maxLength) value = value.substr(0, maxLength)
  if (minLength) value = alignWith(value, minLength)
  return value
}

}).call(this,require('_process'))
},{"_process":72,"ansi":28,"has-unicode":42,"lodash.pad":43,"lodash.padleft":47,"lodash.padright":51}],56:[function(require,module,exports){
;(function(exports) {

// export the class if we are in a Node-like system.
if (typeof module === 'object' && module.exports === exports)
  exports = module.exports = SemVer;

// The debug function is excluded entirely from the minified version.

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0';

var MAX_LENGTH = 256;
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

// The actual regexps go on exports.re
var re = exports.re = [];
var src = exports.src = [];
var R = 0;

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

var NUMERICIDENTIFIER = R++;
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*';
var NUMERICIDENTIFIERLOOSE = R++;
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+';


// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

var NONNUMERICIDENTIFIER = R++;
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';


// ## Main Version
// Three dot-separated numeric identifiers.

var MAINVERSION = R++;
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')';

var MAINVERSIONLOOSE = R++;
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')';

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

var PRERELEASEIDENTIFIER = R++;
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                            '|' + src[NONNUMERICIDENTIFIER] + ')';

var PRERELEASEIDENTIFIERLOOSE = R++;
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[NONNUMERICIDENTIFIER] + ')';


// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

var PRERELEASE = R++;
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))';

var PRERELEASELOOSE = R++;
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))';

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

var BUILDIDENTIFIER = R++;
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+';

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

var BUILD = R++;
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))';


// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

var FULL = R++;
var FULLPLAIN = 'v?' + src[MAINVERSION] +
                src[PRERELEASE] + '?' +
                src[BUILD] + '?';

src[FULL] = '^' + FULLPLAIN + '$';

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                 src[PRERELEASELOOSE] + '?' +
                 src[BUILD] + '?';

var LOOSE = R++;
src[LOOSE] = '^' + LOOSEPLAIN + '$';

var GTLT = R++;
src[GTLT] = '((?:<|>)?=?)';

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
var XRANGEIDENTIFIERLOOSE = R++;
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
var XRANGEIDENTIFIER = R++;
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*';

var XRANGEPLAIN = R++;
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[PRERELEASE] + ')?' +
                   src[BUILD] + '?' +
                   ')?)?';

var XRANGEPLAINLOOSE = R++;
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[PRERELEASELOOSE] + ')?' +
                        src[BUILD] + '?' +
                        ')?)?';

var XRANGE = R++;
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$';
var XRANGELOOSE = R++;
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$';

// Tilde ranges.
// Meaning is "reasonably at or greater than"
var LONETILDE = R++;
src[LONETILDE] = '(?:~>?)';

var TILDETRIM = R++;
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+';
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g');
var tildeTrimReplace = '$1~';

var TILDE = R++;
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$';
var TILDELOOSE = R++;
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$';

// Caret ranges.
// Meaning is "at least and backwards compatible with"
var LONECARET = R++;
src[LONECARET] = '(?:\\^)';

var CARETTRIM = R++;
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+';
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g');
var caretTrimReplace = '$1^';

var CARET = R++;
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$';
var CARETLOOSE = R++;
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$';

// A simple gt/lt/eq thing, or just "" to indicate "any version"
var COMPARATORLOOSE = R++;
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$';
var COMPARATOR = R++;
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$';


// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
var COMPARATORTRIM = R++;
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')';

// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g');
var comparatorTrimReplace = '$1$2$3';


// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
var HYPHENRANGE = R++;
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[XRANGEPLAIN] + ')' +
                   '\\s*$';

var HYPHENRANGELOOSE = R++;
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s*$';

// Star ranges basically just allow anything at all.
var STAR = R++;
src[STAR] = '(<|>)?=?\\s*\\*';

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  ;
  if (!re[i])
    re[i] = new RegExp(src[i]);
}

exports.parse = parse;
function parse(version, loose) {
  if (version instanceof SemVer)
    return version;

  if (typeof version !== 'string')
    return null;

  if (version.length > MAX_LENGTH)
    return null;

  var r = loose ? re[LOOSE] : re[FULL];
  if (!r.test(version))
    return null;

  try {
    return new SemVer(version, loose);
  } catch (er) {
    return null;
  }
}

exports.valid = valid;
function valid(version, loose) {
  var v = parse(version, loose);
  return v ? v.version : null;
}


exports.clean = clean;
function clean(version, loose) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), loose);
  return s ? s.version : null;
}

exports.SemVer = SemVer;

function SemVer(version, loose) {
  if (version instanceof SemVer) {
    if (version.loose === loose)
      return version;
    else
      version = version.version;
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version);
  }

  if (version.length > MAX_LENGTH)
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')

  if (!(this instanceof SemVer))
    return new SemVer(version, loose);

  ;
  this.loose = loose;
  var m = version.trim().match(loose ? re[LOOSE] : re[FULL]);

  if (!m)
    throw new TypeError('Invalid Version: ' + version);

  this.raw = version;

  // these are actually numbers
  this.major = +m[1];
  this.minor = +m[2];
  this.patch = +m[3];

  if (this.major > MAX_SAFE_INTEGER || this.major < 0)
    throw new TypeError('Invalid major version')

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0)
    throw new TypeError('Invalid minor version')

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0)
    throw new TypeError('Invalid patch version')

  // numberify any prerelease numeric ids
  if (!m[4])
    this.prerelease = [];
  else
    this.prerelease = m[4].split('.').map(function(id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id
        if (num >= 0 && num < MAX_SAFE_INTEGER)
          return num
      }
      return id;
    });

  this.build = m[5] ? m[5].split('.') : [];
  this.format();
}

SemVer.prototype.format = function() {
  this.version = this.major + '.' + this.minor + '.' + this.patch;
  if (this.prerelease.length)
    this.version += '-' + this.prerelease.join('.');
  return this.version;
};

SemVer.prototype.inspect = function() {
  return '<SemVer "' + this + '">';
};

SemVer.prototype.toString = function() {
  return this.version;
};

SemVer.prototype.compare = function(other) {
  ;
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  return this.compareMain(other) || this.comparePre(other);
};

SemVer.prototype.compareMain = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch);
};

SemVer.prototype.comparePre = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length)
    return -1;
  else if (!this.prerelease.length && other.prerelease.length)
    return 1;
  else if (!this.prerelease.length && !other.prerelease.length)
    return 0;

  var i = 0;
  do {
    var a = this.prerelease[i];
    var b = other.prerelease[i];
    ;
    if (a === undefined && b === undefined)
      return 0;
    else if (b === undefined)
      return 1;
    else if (a === undefined)
      return -1;
    else if (a === b)
      continue;
    else
      return compareIdentifiers(a, b);
  } while (++i);
};

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function(release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor = 0;
      this.major++;
      this.inc('pre', identifier);
      break;
    case 'preminor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor++;
      this.inc('pre', identifier);
      break;
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0;
      this.inc('patch', identifier);
      this.inc('pre', identifier);
      break;
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0)
        this.inc('patch', identifier);
      this.inc('pre', identifier);
      break;

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0)
        this.major++;
      this.minor = 0;
      this.patch = 0;
      this.prerelease = [];
      break;
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0)
        this.minor++;
      this.patch = 0;
      this.prerelease = [];
      break;
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0)
        this.patch++;
      this.prerelease = [];
      break;
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0)
        this.prerelease = [0];
      else {
        var i = this.prerelease.length;
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++;
            i = -2;
          }
        }
        if (i === -1) // didn't increment anything
          this.prerelease.push(0);
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1]))
            this.prerelease = [identifier, 0];
        } else
          this.prerelease = [identifier, 0];
      }
      break;

    default:
      throw new Error('invalid increment argument: ' + release);
  }
  this.format();
  return this;
};

exports.inc = inc;
function inc(version, release, loose, identifier) {
  if (typeof(loose) === 'string') {
    identifier = loose;
    loose = undefined;
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version;
  } catch (er) {
    return null;
  }
}

exports.diff = diff;
function diff(version1, version2) {
  if (eq(version1, version2)) {
    return null;
  } else {
    var v1 = parse(version1);
    var v2 = parse(version2);
    if (v1.prerelease.length || v2.prerelease.length) {
      for (var key in v1) {
        if (key === 'major' || key === 'minor' || key === 'patch') {
          if (v1[key] !== v2[key]) {
            return 'pre'+key;
          }
        }
      }
      return 'prerelease';
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return key;
        }
      }
    }
  }
}

exports.compareIdentifiers = compareIdentifiers;

var numeric = /^[0-9]+$/;
function compareIdentifiers(a, b) {
  var anum = numeric.test(a);
  var bnum = numeric.test(b);

  if (anum && bnum) {
    a = +a;
    b = +b;
  }

  return (anum && !bnum) ? -1 :
         (bnum && !anum) ? 1 :
         a < b ? -1 :
         a > b ? 1 :
         0;
}

exports.rcompareIdentifiers = rcompareIdentifiers;
function rcompareIdentifiers(a, b) {
  return compareIdentifiers(b, a);
}

exports.major = major;
function major(a, loose) {
  return new SemVer(a, loose).major;
}

exports.minor = minor;
function minor(a, loose) {
  return new SemVer(a, loose).minor;
}

exports.patch = patch;
function patch(a, loose) {
  return new SemVer(a, loose).patch;
}

exports.compare = compare;
function compare(a, b, loose) {
  return new SemVer(a, loose).compare(b);
}

exports.compareLoose = compareLoose;
function compareLoose(a, b) {
  return compare(a, b, true);
}

exports.rcompare = rcompare;
function rcompare(a, b, loose) {
  return compare(b, a, loose);
}

exports.sort = sort;
function sort(list, loose) {
  return list.sort(function(a, b) {
    return exports.compare(a, b, loose);
  });
}

exports.rsort = rsort;
function rsort(list, loose) {
  return list.sort(function(a, b) {
    return exports.rcompare(a, b, loose);
  });
}

exports.gt = gt;
function gt(a, b, loose) {
  return compare(a, b, loose) > 0;
}

exports.lt = lt;
function lt(a, b, loose) {
  return compare(a, b, loose) < 0;
}

exports.eq = eq;
function eq(a, b, loose) {
  return compare(a, b, loose) === 0;
}

exports.neq = neq;
function neq(a, b, loose) {
  return compare(a, b, loose) !== 0;
}

exports.gte = gte;
function gte(a, b, loose) {
  return compare(a, b, loose) >= 0;
}

exports.lte = lte;
function lte(a, b, loose) {
  return compare(a, b, loose) <= 0;
}

exports.cmp = cmp;
function cmp(a, op, b, loose) {
  var ret;
  switch (op) {
    case '===':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      ret = a === b;
      break;
    case '!==':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      ret = a !== b;
      break;
    case '': case '=': case '==': ret = eq(a, b, loose); break;
    case '!=': ret = neq(a, b, loose); break;
    case '>': ret = gt(a, b, loose); break;
    case '>=': ret = gte(a, b, loose); break;
    case '<': ret = lt(a, b, loose); break;
    case '<=': ret = lte(a, b, loose); break;
    default: throw new TypeError('Invalid operator: ' + op);
  }
  return ret;
}

exports.Comparator = Comparator;
function Comparator(comp, loose) {
  if (comp instanceof Comparator) {
    if (comp.loose === loose)
      return comp;
    else
      comp = comp.value;
  }

  if (!(this instanceof Comparator))
    return new Comparator(comp, loose);

  ;
  this.loose = loose;
  this.parse(comp);

  if (this.semver === ANY)
    this.value = '';
  else
    this.value = this.operator + this.semver.version;

  ;
}

var ANY = {};
Comparator.prototype.parse = function(comp) {
  var r = this.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
  var m = comp.match(r);

  if (!m)
    throw new TypeError('Invalid comparator: ' + comp);

  this.operator = m[1];
  if (this.operator === '=')
    this.operator = '';

  // if it literally is just '>' or '' then allow anything.
  if (!m[2])
    this.semver = ANY;
  else
    this.semver = new SemVer(m[2], this.loose);
};

Comparator.prototype.inspect = function() {
  return '<SemVer Comparator "' + this + '">';
};

Comparator.prototype.toString = function() {
  return this.value;
};

Comparator.prototype.test = function(version) {
  ;

  if (this.semver === ANY)
    return true;

  if (typeof version === 'string')
    version = new SemVer(version, this.loose);

  return cmp(version, this.operator, this.semver, this.loose);
};


exports.Range = Range;
function Range(range, loose) {
  if ((range instanceof Range) && range.loose === loose)
    return range;

  if (!(this instanceof Range))
    return new Range(range, loose);

  this.loose = loose;

  // First, split based on boolean or ||
  this.raw = range;
  this.set = range.split(/\s*\|\|\s*/).map(function(range) {
    return this.parseRange(range.trim());
  }, this).filter(function(c) {
    // throw out any that are not relevant for whatever reason
    return c.length;
  });

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range);
  }

  this.format();
}

Range.prototype.inspect = function() {
  return '<SemVer Range "' + this.range + '">';
};

Range.prototype.format = function() {
  this.range = this.set.map(function(comps) {
    return comps.join(' ').trim();
  }).join('||').trim();
  return this.range;
};

Range.prototype.toString = function() {
  return this.range;
};

Range.prototype.parseRange = function(range) {
  var loose = this.loose;
  range = range.trim();
  ;
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];
  range = range.replace(hr, hyphenReplace);
  ;
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);
  ;

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[TILDETRIM], tildeTrimReplace);

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[CARETTRIM], caretTrimReplace);

  // normalize spaces
  range = range.split(/\s+/).join(' ');

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
  var set = range.split(' ').map(function(comp) {
    return parseComparator(comp, loose);
  }).join(' ').split(/\s+/);
  if (this.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function(comp) {
      return !!comp.match(compRe);
    });
  }
  set = set.map(function(comp) {
    return new Comparator(comp, loose);
  });

  return set;
};

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators;
function toComparators(range, loose) {
  return new Range(range, loose).set.map(function(comp) {
    return comp.map(function(c) {
      return c.value;
    }).join(' ').trim().split(' ');
  });
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator(comp, loose) {
  ;
  comp = replaceCarets(comp, loose);
  ;
  comp = replaceTildes(comp, loose);
  ;
  comp = replaceXRanges(comp, loose);
  ;
  comp = replaceStars(comp, loose);
  ;
  return comp;
}

function isX(id) {
  return !id || id.toLowerCase() === 'x' || id === '*';
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes(comp, loose) {
  return comp.trim().split(/\s+/).map(function(comp) {
    return replaceTilde(comp, loose);
  }).join(' ');
}

function replaceTilde(comp, loose) {
  var r = loose ? re[TILDELOOSE] : re[TILDE];
  return comp.replace(r, function(_, M, m, p, pr) {
    ;
    var ret;

    if (isX(M))
      ret = '';
    else if (isX(m))
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    else if (isX(p))
      // ~1.2 == >=1.2.0- <1.3.0-
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    else if (pr) {
      ;
      if (pr.charAt(0) !== '-')
        pr = '-' + pr;
      ret = '>=' + M + '.' + m + '.' + p + pr +
            ' <' + M + '.' + (+m + 1) + '.0';
    } else
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0';

    ;
    return ret;
  });
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets(comp, loose) {
  return comp.trim().split(/\s+/).map(function(comp) {
    return replaceCaret(comp, loose);
  }).join(' ');
}

function replaceCaret(comp, loose) {
  ;
  var r = loose ? re[CARETLOOSE] : re[CARET];
  return comp.replace(r, function(_, M, m, p, pr) {
    ;
    var ret;

    if (isX(M))
      ret = '';
    else if (isX(m))
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    else if (isX(p)) {
      if (M === '0')
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
      else
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';
    } else if (pr) {
      ;
      if (pr.charAt(0) !== '-')
        pr = '-' + pr;
      if (M === '0') {
        if (m === '0')
          ret = '>=' + M + '.' + m + '.' + p + pr +
                ' <' + M + '.' + m + '.' + (+p + 1);
        else
          ret = '>=' + M + '.' + m + '.' + p + pr +
                ' <' + M + '.' + (+m + 1) + '.0';
      } else
        ret = '>=' + M + '.' + m + '.' + p + pr +
              ' <' + (+M + 1) + '.0.0';
    } else {
      ;
      if (M === '0') {
        if (m === '0')
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1);
        else
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0';
      } else
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0';
    }

    ;
    return ret;
  });
}

function replaceXRanges(comp, loose) {
  ;
  return comp.split(/\s+/).map(function(comp) {
    return replaceXRange(comp, loose);
  }).join(' ');
}

function replaceXRange(comp, loose) {
  comp = comp.trim();
  var r = loose ? re[XRANGELOOSE] : re[XRANGE];
  return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
    ;
    var xM = isX(M);
    var xm = xM || isX(m);
    var xp = xm || isX(p);
    var anyX = xp;

    if (gtlt === '=' && anyX)
      gtlt = '';

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0';
      } else {
        // nothing is forbidden
        ret = '*';
      }
    } else if (gtlt && anyX) {
      // replace X with 0
      if (xm)
        m = 0;
      if (xp)
        p = 0;

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>=';
        if (xm) {
          M = +M + 1;
          m = 0;
          p = 0;
        } else if (xp) {
          m = +m + 1;
          p = 0;
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm)
          M = +M + 1
        else
          m = +m + 1
      }

      ret = gtlt + M + '.' + m + '.' + p;
    } else if (xm) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    }

    ;

    return ret;
  });
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars(comp, loose) {
  ;
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[STAR], '');
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace($0,
                       from, fM, fm, fp, fpr, fb,
                       to, tM, tm, tp, tpr, tb) {

  if (isX(fM))
    from = '';
  else if (isX(fm))
    from = '>=' + fM + '.0.0';
  else if (isX(fp))
    from = '>=' + fM + '.' + fm + '.0';
  else
    from = '>=' + from;

  if (isX(tM))
    to = '';
  else if (isX(tm))
    to = '<' + (+tM + 1) + '.0.0';
  else if (isX(tp))
    to = '<' + tM + '.' + (+tm + 1) + '.0';
  else if (tpr)
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;
  else
    to = '<=' + to;

  return (from + ' ' + to).trim();
}


// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function(version) {
  if (!version)
    return false;

  if (typeof version === 'string')
    version = new SemVer(version, this.loose);

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version))
      return true;
  }
  return false;
};

function testSet(set, version) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version))
      return false;
  }

  if (version.prerelease.length) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (var i = 0; i < set.length; i++) {
      ;
      if (set[i].semver === ANY)
        return true;

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver;
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch)
          return true;
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false;
  }

  return true;
}

exports.satisfies = satisfies;
function satisfies(version, range, loose) {
  try {
    range = new Range(range, loose);
  } catch (er) {
    return false;
  }
  return range.test(version);
}

exports.maxSatisfying = maxSatisfying;
function maxSatisfying(versions, range, loose) {
  return versions.filter(function(version) {
    return satisfies(version, range, loose);
  }).sort(function(a, b) {
    return rcompare(a, b, loose);
  })[0] || null;
}

exports.validRange = validRange;
function validRange(range, loose) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, loose).range || '*';
  } catch (er) {
    return null;
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr;
function ltr(version, range, loose) {
  return outside(version, range, '<', loose);
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr;
function gtr(version, range, loose) {
  return outside(version, range, '>', loose);
}

exports.outside = outside;
function outside(version, range, hilo, loose) {
  version = new SemVer(version, loose);
  range = new Range(range, loose);

  var gtfn, ltefn, ltfn, comp, ecomp;
  switch (hilo) {
    case '>':
      gtfn = gt;
      ltefn = lte;
      ltfn = lt;
      comp = '>';
      ecomp = '>=';
      break;
    case '<':
      gtfn = lt;
      ltefn = gte;
      ltfn = gt;
      comp = '<';
      ecomp = '<=';
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, loose)) {
    return false;
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i];

    var high = null;
    var low = null;

    comparators.forEach(function(comparator) {
      high = high || comparator;
      low = low || comparator;
      if (gtfn(comparator.semver, high.semver, loose)) {
        high = comparator;
      } else if (ltfn(comparator.semver, low.semver, loose)) {
        low = comparator;
      }
    });

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false;
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false;
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false;
    }
  }
  return true;
}

// Use the define() function if we're in AMD land
if (typeof define === 'function' && define.amd)
  define(exports);

})(
  typeof exports === 'object' ? exports :
  typeof define === 'function' && define.amd ? {} :
  semver = {}
);

},{}],57:[function(require,module,exports){
module.exports={
  "name": "node-pre-gyp",
  "description": "Node.js native addon binary install tool",
  "version": "0.6.7",
  "keywords": [
    "native",
    "addon",
    "module",
    "c",
    "c++",
    "bindings",
    "binary"
  ],
  "license": "BSD",
  "author": {
    "name": "Dane Springmeyer",
    "email": "dane@mapbox.com"
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/mapbox/node-pre-gyp.git"
  },
  "bin": {
    "node-pre-gyp": "./bin/node-pre-gyp"
  },
  "main": "./lib/node-pre-gyp.js",
  "dependencies": {
    "nopt": "~3.0.1",
    "npmlog": "~1.2.0",
    "request": "2.x",
    "semver": "~4.3.2",
    "tar": "~2.1.0",
    "tar-pack": "~2.0.0",
    "mkdirp": "~0.5.0",
    "rc": "~1.0.1",
    "rimraf": "~2.3.2"
  },
  "devDependencies": {
    "aws-sdk": "*",
    "mocha": "1.x",
    "retire": "0.3.x",
    "jshint": "^2.5.10"
  },
  "jshintConfig": {
    "node": true,
    "globalstrict": true,
    "undef": true,
    "unused": true,
    "noarg": true,
    "mocha": true
  },
  "engineStrict": true,
  "engines": {
    "node": ">= 0.8.0"
  },
  "scripts": {
    "prepublish": "retire -n && npm ls && jshint test/*js",
    "update-crosswalk": "node scripts/abi_crosswalk.js",
    "test": "jshint lib lib/util scripts bin/node-pre-gyp && mocha -R spec --timeout 500000"
  },
  "gitHead": "05ffe2de841764a439fce7e1dff31fe3d6697f18",
  "bugs": {
    "url": "https://github.com/mapbox/node-pre-gyp/issues"
  },
  "homepage": "https://github.com/mapbox/node-pre-gyp#readme",
  "bundleDependencies": [
    "nopt",
    "npmlog",
    "request",
    "semver",
    "tar",
    "tar-pack",
    "mkdirp",
    "rc",
    "rimraf"
  ],
  "_id": "node-pre-gyp@0.6.7",
  "_shasum": "4c3ee4ac2934b0b27fead6bc76391c0dccf38ea8",
  "_from": "node-pre-gyp@>=0.6.0 <0.7.0",
  "_npmVersion": "2.8.3",
  "_nodeVersion": "1.8.1",
  "_npmUser": {
    "name": "springmeyer",
    "email": "dane@mapbox.com"
  },
  "maintainers": [
    {
      "name": "springmeyer",
      "email": "dane@dbsgeo.com"
    },
    {
      "name": "bergwerkgis",
      "email": "wb@bergwerk-gis.at"
    },
    {
      "name": "mikemorris",
      "email": "michael.patrick.morris@gmail.com"
    },
    {
      "name": "kkaefer",
      "email": "kkaefer@gmail.com"
    },
    {
      "name": "yhahn",
      "email": "young@developmentseed.org"
    }
  ],
  "dist": {
    "shasum": "4c3ee4ac2934b0b27fead6bc76391c0dccf38ea8",
    "tarball": "http://registry.npmjs.org/node-pre-gyp/-/node-pre-gyp-0.6.7.tgz"
  },
  "directories": {},
  "_resolved": "https://registry.npmjs.org/node-pre-gyp/-/node-pre-gyp-0.6.7.tgz",
  "readme": "ERROR: No README data found!"
}

},{}],58:[function(require,module,exports){
(function (Buffer){
/*jslint node: true */
'use strict';

// Copyright 2011 Chris Williams <chris@iterativedesigns.com>

module.exports = {
  raw: function (emitter, buffer) {
    emitter.emit('data', buffer);
  },

  //encoding: ascii utf8 utf16le ucs2 base64 binary hex
  //More: http://nodejs.org/api/buffer.html#buffer_buffer
  readline: function (delimiter, encoding) {
    if (typeof delimiter === 'undefined' || delimiter === null) { delimiter = '\r'; }
    if (typeof encoding  === 'undefined' || encoding  === null) { encoding  = 'utf8'; }
    // Delimiter buffer saved in closure
    var data = '';
    return function (emitter, buffer) {
      // Collect data
      data += buffer.toString(encoding);
      // Split collected data by delimiter
      var parts = data.split(delimiter);
      data = parts.pop();
      parts.forEach(function (part) {
        emitter.emit('data', part);
      });
    };
  },

  // Emit a data event every `length` bytes
  byteLength: function(length) {
    var data = new Buffer(0);
    return function(emitter, buffer){
      data = Buffer.concat([data, buffer]);
      while (data.length >= length) {
        var out = data.slice(0,length);
        data = data.slice(length);
        emitter.emit('data', out);
      }
    };
  },

  //Emit a data event each time a byte sequence (delimiter is an array of byte) is found
  //Sample usage : byteDelimiter([10, 13])
  byteDelimiter: function (delimiter) {
    if( Object.prototype.toString.call( delimiter ) !== '[object Array]' ){
      delimiter = [ delimiter ];
    }
    var buf = [];
    var nextDelimIndex = 0;
    return function (emitter, buffer) {
      for (var i = 0; i < buffer.length; i++) {
        buf[buf.length] = buffer[i];
        if(buf[buf.length-1] === delimiter[nextDelimIndex]) {
          nextDelimIndex++;
        }
        if(nextDelimIndex === delimiter.length) {
          emitter.emit('data', buf);
          buf = [];
          nextDelimIndex = 0;
        }
      }
    };
  }
};

}).call(this,require("buffer").Buffer)
},{"buffer":63}],59:[function(require,module,exports){
(function (process,Buffer,__dirname){
'use strict';

// Copyright 2011 Chris Williams <chris@iterativedesigns.com>

// Require serialport binding from pre-compiled binaries using
// node-pre-gyp, if something fails or package not available fallback
// to regular build from source.

var debug = require('debug')('serialport');
var binary = require('node-pre-gyp');
var path = require('path');
var PACKAGE_JSON = path.join(__dirname, 'package.json');
var binding_path = binary.find(path.resolve(PACKAGE_JSON));
var SerialPortBinding = require(binding_path);

var parsers = require('./parsers');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var fs = require('fs');
var stream = require('stream');
var path = require('path');
var async = require('async');
var exec = require('child_process').exec;

function SerialPortFactory(_spfOptions) {
  _spfOptions = _spfOptions || {};

  var spfOptions = {};

  spfOptions.queryPortsByPath =  (_spfOptions.queryPortsByPath === true ? true : false);

  var factory = this;

  // Removing check for valid BaudRates due to ticket: #140
  // var BAUDRATES = [500000, 230400, 115200, 57600, 38400, 19200, 9600, 4800, 2400, 1800, 1200, 600, 300, 200, 150, 134, 110, 75, 50];

  //  VALIDATION ARRAYS
  var DATABITS = [5, 6, 7, 8];
  var STOPBITS = [1, 1.5, 2];
  var PARITY = ['none', 'even', 'mark', 'odd', 'space'];
  var FLOWCONTROLS = ['XON', 'XOFF', 'XANY', 'RTSCTS'];
  var SETS = ['rts', 'cts', 'dtr', 'dts', 'brk'];


  // Stuff from ReadStream, refactored for our usage:
  var kPoolSize = 40 * 1024;
  var kMinPoolSpace = 128;

  function makeDefaultPlatformOptions(){
    var options = {};

    if (process.platform !== 'win32') {
      options.vmin = 1;
      options.vtime = 0;
    }

    return options;
  }

  // The default options, can be overwritten in the 'SerialPort' constructor
  var _options = {
    baudrate: 9600,
    parity: 'none',
    rtscts: false,
    xon: false,
    xoff: false,
    xany: false,
    hupcl:true,
    rts: true,
    cts: false,
    dtr: true,
    dts: false,
    brk: false,
    databits: 8,
    stopbits: 1,
    buffersize: 256,
    parser: parsers.raw,
    platformOptions: makeDefaultPlatformOptions()
  };

  function SerialPort(path, options, openImmediately, callback) {

    var self = this;

    var args = Array.prototype.slice.call(arguments);
    callback = args.pop();
    if (typeof (callback) !== 'function') {
      callback = null;
    }
    options = (typeof options !== 'function') && options || {};

    var opts = {};

    openImmediately = (openImmediately === undefined || openImmediately === null) ? true : openImmediately;

    stream.Stream.call(this);

    callback = callback || function (err) {
      if (err) {
        if (self._events.error) {
          self.emit('error', err);
        } else {
          factory.emit('error', err);
        }
      }
    };

    var err;


    opts.baudRate = options.baudRate || options.baudrate || _options.baudrate;

    opts.dataBits = options.dataBits || options.databits || _options.databits;
    if (DATABITS.indexOf(opts.dataBits) === -1) {
      err = new Error('Invalid "databits": ' + opts.dataBits);
      callback(err);
      return;
    }

    opts.stopBits = options.stopBits || options.stopbits || _options.stopbits;
    if (STOPBITS.indexOf(opts.stopBits) === -1) {
      err = new Error('Invalid "stopbits": ' + opts.stopbits);
      callback(err);
      return;
    }

    opts.parity = options.parity || _options.parity;
    if (PARITY.indexOf(opts.parity) === -1) {
      err = new Error('Invalid "parity": ' + opts.parity);
      callback(err);
      return;
    }
    if (!path) {
      err = new Error('Invalid port specified: ' + path);
      callback(err);
      return;
    }

    // flush defaults, then update with provided details
    opts.rtscts = _options.rtscts;
    opts.xon = _options.xon;
    opts.xoff = _options.xoff;
    opts.xany = _options.xany;

    if (options.flowControl || options.flowcontrol) {
      var fc = options.flowControl || options.flowcontrol;

      if (typeof fc === 'boolean') {
        opts.rtscts = true;
      } else {
        var clean = fc.every(function (flowControl) {
          var fcup = flowControl.toUpperCase();
          var idx = FLOWCONTROLS.indexOf(fcup);
          if (idx < 0) {
            var err = new Error('Invalid "flowControl": ' + fcup + '. Valid options: ' + FLOWCONTROLS.join(', '));
            callback(err);
            return false;
          } else {

            // "XON", "XOFF", "XANY", "DTRDTS", "RTSCTS"
            switch (idx) {
              case 0: opts.xon = true; break;
              case 1: opts.xoff = true; break;
              case 2: opts.xany = true;  break;
              case 3: opts.rtscts = true; break;
            }
            return true;
          }
        });
        if(!clean){
          return;
        }
      }
    }

    opts.bufferSize = options.bufferSize || options.buffersize || _options.buffersize;
    opts.parser = options.parser || _options.parser;
    opts.platformOptions = options.platformOptions || _options.platformOptions;
    options.hupcl = (typeof options.hupcl === 'boolean') ? options.hupcl : _options.hupcl;
    opts.dataCallback = options.dataCallback || function (data) {
      opts.parser(self, data);
    };

    opts.disconnectedCallback = options.disconnectedCallback || function (err) {
      if (self.closing) {
        return;
      }
      if (!err) {
        err = new Error('Disconnected');
      }
      self.emit('disconnect', err);
    };

    if (process.platform !== 'win32') {
      // All other platforms:
      this.fd = null;
      this.paused = true;
      this.bufferSize = options.bufferSize || 64 * 1024;
      this.readable = true;
      this.reading = false;
    }

    this.options = opts;
    this.path = path;
    if (openImmediately) {
      process.nextTick(function () {
        self.open(callback);
      });
    }
  }

  util.inherits(SerialPort, stream.Stream);


  SerialPort.prototype.open = function (callback) {
    var self = this;
    this.paused = true;
    this.readable = true;
    this.reading = false;
    factory.SerialPortBinding.open(this.path, this.options, function (err, fd) {
      self.fd = fd;
      if (err) {
        if (callback) {
          callback(err);
        } else {
          self.emit('error', err);
        }
        return;
      }
      if (process.platform !== 'win32') {
        self.paused = false;
        self.serialPoller = new factory.SerialPortBinding.SerialportPoller(self.fd, function (err) {
          if (!err) {
            self._read();
          } else {
            self.disconnected(err);
          }
        });
        self.serialPoller.start();
      }

      self.emit('open');
      if (callback) { callback(); }
    });
  };

  //underlying code is written to update all options, but for now
  //only baud is respected as I dont want to duplicate all the option
  //verification code above
  SerialPort.prototype.update = function (options, callback) {
    var self = this;
    if (!this.fd) {
      debug('Update attempted, but serialport not available - FD is not set');
      var err = new Error('Serialport not open.');
      if (callback) {
        callback(err);
      } else {
        // console.log("write-fd");
        self.emit('error', err);
      }
      return;
    }

    this.options.baudRate = options.baudRate || options.baudrate || _options.baudrate;

    factory.SerialPortBinding.update(this.fd, this.options, function (err) {
      if (err) {
        if (callback) {
          callback(err);
        } else {
          self.emit('error', err);
        }
        return;
      }
      self.emit('open');
      if (callback) { callback(); }
    });
  };

  SerialPort.prototype.isOpen = function() {
    return (this.fd ? true : false);
  };

  SerialPort.prototype.write = function (buffer, callback) {
    var self = this;
    if (!this.fd) {
      debug('Write attempted, but serialport not available - FD is not set');
      var err = new Error('Serialport not open.');
      if (callback) {
        callback(err);
      } else {
        // console.log("write-fd");
        self.emit('error', err);
      }
      return;
    }

    if (!Buffer.isBuffer(buffer)) {
      buffer = new Buffer(buffer);
    }
    debug('Write: '+JSON.stringify(buffer));
    factory.SerialPortBinding.write(this.fd, buffer, function (err, results) {
      if (callback) {
        callback(err, results);
      } else {
        if (err) {
          // console.log("write");
          self.emit('error', err);
        }
      }
    });
  };

  if (process.platform !== 'win32') {
    SerialPort.prototype._read = function () {
      var self = this;

      // console.log(">>READ");
      if (!self.readable || self.paused || self.reading) {
        return;
      }

      self.reading = true;

      if (!self.pool || self.pool.length - self.pool.used < kMinPoolSpace) {
        // discard the old pool. Can't add to the free list because
        // users might have refernces to slices on it.
        self.pool = null;

        // alloc new pool
        self.pool = new Buffer(kPoolSize);
        self.pool.used = 0;
      }

      // Grab another reference to the pool in the case that while we're in the
      // thread pool another read() finishes up the pool, and allocates a new
      // one.
      var toRead = Math.min(self.pool.length - self.pool.used, ~~self.bufferSize);
      var start = self.pool.used;

      function afterRead(err, bytesRead, readPool, bytesRequested) {
        self.reading = false;
        if (err) {
          if (err.code && err.code === 'EAGAIN') {
            if (self.fd >= 0) {
              self.serialPoller.start();
            }
          } else if (err.code && (err.code === 'EBADF' || err.code === 'ENXIO' || (err.errno === -1 || err.code === 'UNKNOWN'))) { // handle edge case were mac/unix doesn't clearly know the error.
            self.disconnected(err);
          } else {
            self.fd = null;
            self.emit('error', err);
            self.readable = false;
          }
        } else {
          // Since we will often not read the number of bytes requested,
          // let's mark the ones we didn't need as available again.
          self.pool.used -= bytesRequested - bytesRead;

          if (bytesRead === 0) {
            if (self.fd >= 0) {
              self.serialPoller.start();
            }
          } else {
            var b = self.pool.slice(start, start + bytesRead);

            // do not emit events if the stream is paused
            if (self.paused) {
              self.buffer = Buffer.concat([self.buffer, b]);
              return;
            } else {
              self._emitData(b);
            }

            // do not emit events anymore after we declared the stream unreadable
            if (!self.readable) {
              return;
            }
            self._read();
          }
        }

      }

      fs.read(self.fd, self.pool, self.pool.used, toRead, null, function (err, bytesRead) {
        var readPool = self.pool;
        var bytesRequested = toRead;
        afterRead(err, bytesRead, readPool, bytesRequested);
      });

      self.pool.used += toRead;
    };


    SerialPort.prototype._emitData = function (data) {
      this.options.dataCallback(data);
    };

    SerialPort.prototype.pause = function () {
      var self = this;
      self.paused = true;
    };

    SerialPort.prototype.resume = function () {
      var self = this;
      self.paused = false;

      if (self.buffer) {
        var buffer = self.buffer;
        self.buffer = null;
        self._emitData(buffer);
      }

      // No longer open?
      if (null === self.fd) {
        return;
      }

      self._read();
    };

  } // if !'win32'


  SerialPort.prototype.disconnected = function (err) {
    var self = this;
    var fd = self.fd;

    // send notification of disconnect
    if (self.options.disconnectedCallback) {
      self.options.disconnectedCallback(err);
    } else {
      self.emit('disconnect', err);
    }
    self.paused = true;
    self.closing = true;

    self.emit('close');

    // clean up all other items
    fd = self.fd;

    try {
      factory.SerialPortBinding.close(fd, function (err) {
        if (err) {
          debug('Disconnect completed with error: '+JSON.stringify(err));
        } else {
          debug('Disconnect completed.');
        }
      });
    } catch (e) {
      debug('Disconnect completed with an exception: '+JSON.stringify(e));
    }

    self.removeAllListeners();
    self.closing = false;
    self.fd = 0;

    if (process.platform !== 'win32') {
      self.readable = false;
      self.serialPoller.close();
    }

  };


  SerialPort.prototype.close = function (callback) {
    var self = this;

    var fd = self.fd;

    if (self.closing) {
      return;
    }
    if (!fd) {
      var err = new Error('Serialport not open.');
      if (callback) {
        callback(err);
      } else {
        // console.log("sp not open");
        self.emit('error', err);
      }
      return;
    }

    self.closing = true;

    // Stop polling before closing the port.
    if (process.platform !== 'win32') {
      self.readable = false;
      self.serialPoller.close();
    }

    try {
      factory.SerialPortBinding.close(fd, function (err) {

        if (err) {
          if (callback) {
            callback(err);
          } else {
            // console.log("doclose");
            self.emit('error', err);
          }
          return;
        }

        self.emit('close');
        self.removeAllListeners();
        self.closing = false;
        self.fd = 0;

        if (callback) {
          callback();
        }
      });
    } catch (ex) {
      self.closing = false;
      if (callback) {
        callback(ex);
      } else {
        self.emit('error', ex);
      }
    }
  };

  function listUnix(callback) {
    function udev_parser(udev_output, callback) {
      function udev_output_to_json(output) {
        var result = {};
        var lines = output.split('\n');
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].trim();
          if (line !== '') {
            var line_parts = lines[i].split('=');
            result[line_parts[0].trim()] = line_parts[1].trim();
          }
        }
        return result;
      }
      var as_json = udev_output_to_json(udev_output);
      var pnpId = as_json.DEVLINKS.split(' ')[0];
      pnpId = pnpId.substring(pnpId.lastIndexOf('/') + 1);
      var port = {
        comName: as_json.DEVNAME,
        manufacturer: as_json.ID_VENDOR,
        serialNumber: as_json.ID_SERIAL,
        pnpId: pnpId,
        vendorId: '0x' + as_json.ID_VENDOR_ID,
        productId: '0x' + as_json.ID_MODEL_ID
      };

      callback(null, port);
    }

    var dirName = (spfOptions.queryPortsByPath ? '/dev/serial/by-path' : '/dev/serial/by-id');

    fs.readdir(dirName, function (err, files) {
      if (err) {
        // if this directory is not found this could just be because it's not plugged in
        if (err.errno === 34) {
          return callback(null, []);
        }

        if (callback) {
          callback(err);
        } else {
          factory.emit('error', err);
        }
        return;
      }

      async.map(files, function (file, callback) {
        var fileName = path.join(dirName, file);
        fs.readlink(fileName, function (err, link) {
          if (err) {
            if (callback) {
              callback(err);
            } else {
              factory.emit('error', err);
            }
            return;
          }

          link = path.resolve(dirName, link);
          exec('/sbin/udevadm info --query=property -p $(/sbin/udevadm info -q path -n ' + link + ')', function (err, stdout) {
            if (err) {
              if (callback) {
                callback(err);
              } else {
                factory.emit('error', err);
              }
              return;
            }

            udev_parser(stdout, callback);
          });
        });
      }, callback);
    });
  }

  SerialPort.prototype.flush = function (callback) {
    var self = this;
    var fd = self.fd;

    if (!fd) {
      var err = new Error('Serialport not open.');
      if (callback) {
        callback(err);
      } else {
        self.emit('error', err);
      }
      return;
    }

    factory.SerialPortBinding.flush(fd, function (err, result) {
      if (err) {
        if (callback) {
          callback(err, result);
        } else {
          self.emit('error', err);
        }
      } else {
        if (callback) {
          callback(err, result);
        }
      }
    });
  };

  SerialPort.prototype.set = function (options, callback) {
    var self = this;
    var fd = self.fd;

    options = (typeof option !== 'function') && options || {};

    // flush defaults, then update with provided details

    if(!options.hasOwnProperty('rts')){
      options.rts = _options.rts;
    }
    if(!options.hasOwnProperty('dtr')){
      options.dtr = _options.dtr;
    }
    if(!options.hasOwnProperty('cts')){
      options.cts = _options.cts;
    }
    if(!options.hasOwnProperty('dts')){
      options.dts = _options.dts;
    }
    if(!options.hasOwnProperty('brk')){
      options.brk = _options.brk;
    }

    if (!fd) {
      var err = new Error('Serialport not open.');
      if (callback) {
        callback(err);
      } else {
        self.emit('error', err);
      }
      return;
    }

    factory.SerialPortBinding.set(fd, options, function (err, result) {
      if (err) {
        if (callback) {
          callback(err, result);
        } else {
          self.emit('error', err);
        }
      } else {
        callback(err, result);
      }
    });
  };

  SerialPort.prototype.drain = function (callback) {
    var self = this;
    var fd = this.fd;

    if (!fd) {
      var err = new Error('Serialport not open.');
      if (callback) {
        callback(err);
      } else {
        self.emit('error', err);
      }
      return;
    }

    factory.SerialPortBinding.drain(fd, function (err, result) {
      if (err) {
        if (callback) {
          callback(err, result);
        } else {
          self.emit('error', err);
        }
      } else {
        if (callback) {
          callback(err, result);
        }
      }
    });
  };

  factory.SerialPort = SerialPort;
  factory.parsers = parsers;
  factory.SerialPortBinding = SerialPortBinding;

  if (process.platform === 'win32') {
    factory.list = SerialPortBinding.list;
  } else if (process.platform === 'darwin') {
    factory.list = SerialPortBinding.list;
  } else {
    factory.list = listUnix;
  }

}

util.inherits(SerialPortFactory, EventEmitter);

module.exports = new SerialPortFactory();

}).call(this,require('_process'),require("buffer").Buffer,"/../../node_modules/sphero/node_modules/serialport")
},{"./parsers":58,"_process":72,"async":20,"buffer":63,"child_process":60,"debug":17,"events":67,"fs":60,"node-pre-gyp":21,"path":71,"stream":88,"util":92}],60:[function(require,module,exports){

},{}],61:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && !isFinite(value)) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b)) {
    return a === b;
  }
  var aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  var ka = objectKeys(a),
      kb = objectKeys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":92}],62:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"dup":60}],63:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Note:
 *
 * - Implementation must support adding new properties to `Uint8Array` instances.
 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *    incorrect length in some situations.
 *
 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
 * get the Object implementation, which is slower but will work correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = (function () {
  function Foo () {}
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    arr.constructor = Foo
    return arr.foo() === 42 && // typed array instances can be augmented
        arr.constructor === Foo && // constructor can be set
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
})()

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  this.length = 0
  this.parent = undefined

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined' && object.buffer instanceof ArrayBuffer) {
    return fromTypedArray(that, object)
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = value
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = value
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = value
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-z\-]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []
  var i = 0

  for (; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (leadSurrogate) {
        // 2 leads in a row
        if (codePoint < 0xDC00) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          leadSurrogate = codePoint
          continue
        } else {
          // valid surrogate pair
          codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
          leadSurrogate = null
        }
      } else {
        // no lead yet

        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else {
          // valid lead
          leadSurrogate = codePoint
          continue
        }
      }
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
      leadSurrogate = null
    }

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x200000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

},{"base64-js":64,"ieee754":65,"is-array":66}],64:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],65:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],66:[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],67:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],68:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"dup":38}],69:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],70:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

},{}],71:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":72}],72:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],73:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.3.2 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * http://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.3.2',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],74:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],75:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],76:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":74,"./encode":75}],77:[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":78}],78:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"./_stream_readable":80,"./_stream_writable":82,"_process":72,"core-util-is":83,"dup":32,"inherits":68}],79:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"./_stream_transform":81,"core-util-is":83,"dup":33,"inherits":68}],80:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"./_stream_duplex":78,"_process":72,"buffer":63,"core-util-is":83,"dup":34,"events":67,"inherits":68,"isarray":69,"stream":88,"string_decoder/":89,"util":62}],81:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./_stream_duplex":78,"core-util-is":83,"dup":35,"inherits":68}],82:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"./_stream_duplex":78,"_process":72,"buffer":63,"core-util-is":83,"dup":36,"inherits":68,"stream":88}],83:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"buffer":63,"dup":37}],84:[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":79}],85:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"./lib/_stream_duplex.js":78,"./lib/_stream_passthrough.js":79,"./lib/_stream_readable.js":80,"./lib/_stream_transform.js":81,"./lib/_stream_writable.js":82,"dup":41,"stream":88}],86:[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":81}],87:[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":82}],88:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":67,"inherits":68,"readable-stream/duplex.js":77,"readable-stream/passthrough.js":84,"readable-stream/readable.js":85,"readable-stream/transform.js":86,"readable-stream/writable.js":87}],89:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"buffer":63,"dup":40}],90:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var punycode = require('punycode');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a puny coded representation of "domain".
      // It only converts the part of the domain name that
      // has non ASCII characters. I.e. it dosent matter if
      // you call it with a domain that already is in ASCII.
      var domainArray = this.hostname.split('.');
      var newOut = [];
      for (var i = 0; i < domainArray.length; ++i) {
        var s = domainArray[i];
        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
            'xn--' + punycode.encode(s) : s);
      }
      this.hostname = newOut.join('.');
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  Object.keys(this).forEach(function(k) {
    result[k] = this[k];
  }, this);

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    Object.keys(relative).forEach(function(k) {
      if (k !== 'protocol')
        result[k] = relative[k];
    });

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      Object.keys(relative).forEach(function(k) {
        result[k] = relative[k];
      });
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especialy happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host) && (last === '.' || last === '..') ||
      last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last == '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especialy happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!isNull(result.pathname) || !isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

function isString(arg) {
  return typeof arg === "string";
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isNull(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return  arg == null;
}

},{"punycode":73,"querystring":76}],91:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],92:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":91,"_process":72,"inherits":68}]},{},[1]);
