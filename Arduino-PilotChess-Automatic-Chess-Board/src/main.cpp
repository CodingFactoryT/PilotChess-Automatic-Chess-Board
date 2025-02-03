#include <Arduino.h>
#include "Gantry.h"
#include "../config.h"

//------------- <Forward Declarations> ------------------
enum StepperDirection;
//------------- </Forward Declarations> ------------------

void setup() {
  Serial.begin(SERIAL_BAUD_RATE);
  Serial.setTimeout(SERIAL_TIMEOUT);
  Serial.println("Before main");
  Gantry gantry;
  Serial.println("After main");
}

void loop() {
  if (Serial.available()) {
    String messageReceived = Serial.readString();
    Serial.println("Text received: " + messageReceived);
  }

}
