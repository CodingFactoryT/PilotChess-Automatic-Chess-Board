#include <Arduino.h>
#include "Gantry.h"
#include "../config.h"

//------------- <Forward Declarations> ------------------
enum StepperDirection;
//------------- </Forward Declarations> ------------------

Gantry* gantry;
void setup() {
  Serial.begin(SERIAL_BAUD_RATE);
  Serial.setTimeout(SERIAL_TIMEOUT);
  gantry = new Gantry();
}

void loop() {
  if (Serial.available()) {
    String messageReceived = Serial.readString();
    Serial.println("Text received: " + messageReceived);
  }

  gantry->update();
}
