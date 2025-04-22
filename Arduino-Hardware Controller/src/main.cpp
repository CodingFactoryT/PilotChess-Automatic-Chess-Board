#include <Arduino.h>
#include "Controller.h"
#include "../config.h"

Controller controller;

void setup() {
  Serial.begin(SERIAL_BAUD_RATE);
  controller._gantry.initPieceGrabberServo(); //not initialized correctly if called in the Gantry constructor
  controller._gantry.releasePiece();
  controller._gantry.home();
}

void loop() {
  controller.update();
}
