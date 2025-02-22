#include <Arduino.h>
#include "Gantry.h"
#include "../config.h"
#include "SerialCommunicationController.h"

//------------- <Forward Declarations> ------------------
enum StepperDirection;
//------------- </Forward Declarations> ------------------

Gantry* gantry;
SerialCommunicationController* communicationController;

void setup() {
  Serial.begin(SERIAL_BAUD_RATE);
  Serial.setTimeout(SERIAL_TIMEOUT);
  gantry = new Gantry();
  communicationController = new SerialCommunicationController();
}

void loop() {
  if (communicationController->isRequestPresent()) {
    String request = communicationController->readRequestFromSerial();
    communicationController->handleRequest(request);
  }

  //gantry->update();
}
