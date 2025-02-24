#include "Controller.h"

void Controller::update() {
    if (_communicationController.isRequestPresent()) {
        char* rawRequest = _communicationController.readRequestFromSerial();
        Exchange request = _communicationController.parseRequest(rawRequest);

        _communicationController.respond(request.getType(), request.getData());
        Util::delete2DArray(request.getData(), 4);
        delete[] rawRequest;
    }

    //_gantry.update();
}