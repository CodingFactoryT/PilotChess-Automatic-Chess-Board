#include <Arduino.h>
#include "Controller.h"
#include "../config.h"

Controller controller;

void setup() {
  Serial.begin(SERIAL_BAUD_RATE);
}

void loop() {
  controller.update();
}
