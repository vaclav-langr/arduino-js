const five = require('johnny-five');
const fs = require('fs');
const board = new five.Board({port: "COM5"});
let isTrue, buttonPin = 2, thermPin = "A0", ledPin = 13, debug = true;

board.on("ready", function() {
  // Control LED if arduino is working
  const led = new five.Led(ledPin);
  led.blink(500);

  // Button setup
  button = new five.Button({
    pin:buttonPin,
    invert:true
  });
  // Button event indicating if data is valid
  this.digitalRead(buttonPin, function(value) {
    isTrue = 1 - value;
  });

  // Thermometer setup
  const therm = new five.Thermometer({
  	pin: thermPin,
    //controller: "TMP36",
    freq: 500,
  	toCelsius: function(raw) {
      return raw;
    }
  });
  // Thermometer event
  therm.on("data", function(e) {
    if(debug) {
      console.log(`Data: ${this.C}, correct: ${isTrue}, timestamp: ${+ new Date()}`);
    } else {
  	  fs.appendFileSync('data.csv', `${this.C},${isTrue},${+ new Date()}\n`);
    }
  });
});