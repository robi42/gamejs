var display = require('gamejs/display');
var gamejs = require('gamejs');
/**
 * @fileoverview Methods for polling mouse, keyboard and ntwork;
 *
 * Call get() in your main loop to get a list of events that happend since you last called.
 *
 *
 * A pattern for using this might look like so: your main game function (tick in this example)
 * is being called by [gamejs.time.fpsCallback()](../time/#fpsCallback) 25 times per second.
 * Inside tick we call [gamejs.event.get()](#get) for a list of events that happened since the last
 * tick and we loop over each event and act on the event properties.
 *
 *     function tick() {
 *        gamejs.event.get().forEach(function(event) {
 *           if (event.type === gamejs.event.MOUSE_UP) {
 *              gamejs.log(event.pos);
 *           }
 *        });
 *     };
 *     gamejs.time.fpsCallback(tick, this, 25);
 *
 *
 */
// key constants
exports.K_UP = 38;
exports.K_DOWN = 40;
exports.K_RIGHT = 39;
exports.K_LEFT = 37;

exports.K_SPACE = 32;
exports.K_TAB = 9;
exports.K_ENTER = 13;
exports.K_CTRL = 17;
exports.K_ALT = 18;

exports.K_0 = 48;
exports.K_1 = 49;
exports.K_2 = 50;
exports.K_3 = 51;
exports.K_4 = 52;
exports.K_5 = 53;
exports.K_6 = 54;
exports.K_7 = 55;
exports.K_8 = 56;
exports.K_9 = 57;
exports.K_a = 65;
exports.K_b = 66;
exports.K_c = 67;
exports.K_d = 68;
exports.K_e = 69;
exports.K_f = 70;
exports.K_g = 71;
exports.K_h = 72;
exports.K_i = 73;
exports.K_j = 74;
exports.K_k = 75;
exports.K_l = 76;
exports.K_m = 77;
exports.K_n = 78;
exports.K_o = 79;
exports.K_p = 80;
exports.K_q = 81;
exports.K_r = 82;
exports.K_s = 83;
exports.K_t = 84;
exports.K_u = 85;
exports.K_v = 86;
exports.K_w = 87;
exports.K_x = 88;
exports.K_y = 89;
exports.K_z = 90;

exports.K_0 = 48;
exports.K_1 = 49;
exports.K_2 = 50;
exports.K_3 = 51;
exports.K_4 = 52;
exports.K_5 = 53;
exports.K_6 = 54;
exports.K_7 = 55;
exports.K_8 = 56;
exports.K_9 = 57;


exports.K_KP1 = 97;
exports.K_KP2 = 98;
exports.K_KP3 = 99;
exports.K_KP4 = 100;
exports.K_KP5 = 101;
exports.K_KP6 = 102;
exports.K_KP7 = 103;
exports.K_KP8 = 104;
exports.K_KP9 = 105;

// event type constants
exports.QUIT = 0;
exports.KEY_DOWN = 1;
exports.KEY_UP = 2;
exports.MOUSE_MOTION = 3;
exports.MOUSE_UP = 4
exports.MOUSE_DOWN = 5;

var QUEUE = [];

/**
 * Get all events from the event queue
 * @returns {Array}
 */
exports.get = function() {
   return QUEUE.splice(0);
};

/**
 * Get the newest event of the event queue
 * @returns {gamejs.event.Event}
 */
exports.poll = function() {
   return QUEUE.pop();
};

/**
 * Post an event to the event queue.
 * @param {gamejs.event.Event} userEvent the event to post to the queue
 */
exports.post = function(userEvent) {
   QUEUE.push(userEvent);
   return;
};

/**
 * Holds all information about an event.
 * @class
 */

exports.Event = function() {
/**
 *
 */
    /**
     * @property {Number} key the keyCode of the key
     * @property {Number[]} rel .
     * @property {Number} button
     * @property {Number[]}
     */
    /**
     * The type of the event. e.g., gamejs.event.QUIT, KEYDOWN, MOUSEUP.
     */
    this.type = null;
    /**
     * key the keyCode of the key
     */
    this.key = null;
    /**
     * relative movement for a mousemove event
     */
    this.rel = null;
    /**
     * the number of the mousebutton pressed
     */
    this.button = null;
    /**
     * pos the position of the event for mouse events
     */
    this.pos = null;
};

/**
 * @ignore
 */
exports.init = function() {
   // catching events:
   // mousedown, mouseup,
   // keydown, keyup
   // mousemove
   // quit

   document.onmousedown = function(ev) {
      var canvasOffset = display._getCanvasOffset();
      QUEUE.push({
         'type': gamejs.event.MOUSE_DOWN,
         'pos': [ev.clientX - canvasOffset[0], ev.clientY - canvasOffset[1]],
         'button': ev.button,
      });
   };

   document.onmouseup = function(ev) {
      var canvasOffset = display._getCanvasOffset();
      QUEUE.push({
         'type':gamejs.event.MOUSE_UP,
         'pos': [ev.clientX - canvasOffset[0], ev.clientY - canvasOffset[1]],
         'button': ev.button,
      });
   };

   document.onkeydown = function(ev) {
      var canvasOffset = display._getCanvasOffset();
      QUEUE.push({
         'type': gamejs.event.KEY_DOWN,
         'key': ev.keyCode,
         'shiftKey': ev.shiftKey,
         'ctrlKey': ev.ctrlKey,
         'metaKey': ev.metaKey
      });
      return;
   };
   document.onkeyup = function(ev) {
      QUEUE.push({
         'type': gamejs.event.KEY_UP,
         'key': ev.keyCode,
         'shiftKey': ev.shiftKey,
         'ctrlKey': ev.ctrlKey,
         'metaKey': ev.metaKey
      });
   };
   var lastPos = [];
   document.onmousemove = function(ev) {
      var canvasOffset = display._getCanvasOffset();
      var currentPos = [ev.clientX - canvasOffset[0], ev.clientY - canvasOffset[1]];
      var relativePos = [];
      if (lastPos.length) {
         relativePos = [
            lastPos[0] - currentPos[0],
            lastPos[1] - currentPos[1]
         ];
      }
      QUEUE.push({
         'type': gamejs.event.MOUSE_MOTION,
         'pos': currentPos,
         'rel': relativePos,
         'buttons': null, // FIXME, fixable?
         'timestamp': ev.timeStamp,
      });
      lastPos = currentPos;
      return;
   };
   document.onbeforeunload = function(ev) {
      QUEUE.push({
         'type': gamejs.event.QUIT,
      });
      return;
   };
};
