#include "Controller.h"

Controller::Controller() {
    _data = new char* [4];
    for (int i = 0; i < 4; i++) {
        _data[i] = new char[SERIAL_TX_BUFFER_SIZE];
        _data[i][0] = '\0';
    }
}

Controller::~Controller() {
    Util::delete2DArray(_data, 4);
}

void Controller::update() {
    if (_communicationController.isRequestPresent()) {
        clearData();
        char* rawRequest = _communicationController.readRequestFromSerial();
        Exchange request = _communicationController.parseRequest(rawRequest);

        switch (request.getType()) {
        case RequestedDataType::HOME:
            _gantry.home();
            Util::toCharArray("OK", _data[0]);
            break;
        case RequestedDataType::MOVE:
            _gantry.moveToTile(request.getData()[0][0], request.getData()[0][1] - '0');
            Util::toCharArray("OK", _data[0]);
            break;
        case RequestedDataType::READ:
            Util::toCharArray("OK", _data[0]);
            _data[1] = _tileMatrixController.readHexString();
            break;
        case RequestedDataType::GRAB:
            _gantry.grabPiece();
            Util::toCharArray("OK", _data[0]);
            break;
        case RequestedDataType::RELS:
            _gantry.releasePiece();
            Util::toCharArray("OK", _data[0]);
            break;
        case RequestedDataType::ERRO:
            Util::toCharArray("ERROR", _data[0]);
            break;
        }

        _communicationController.respond(request.getType(), _data);
        Util::delete2DArray(request.getData(), 4);
        delete[] rawRequest;
    }

    _gantry.update();
}

void Controller::clearData() {
    for (int i = 0; i < 4; i++) {
        _data[i][0] = '\0';
    }
}