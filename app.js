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
