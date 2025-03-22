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
        bool succeeded = false;

        switch (request.getType()) {
        case RequestedDataType::HOME:
            _gantry.home();
            succeeded = true;
            break;
        case RequestedDataType::MOVE: {
            char* positionData = request.getData()[0];
            char column = request.getData()[0][0];
            int row = request.getData()[0][1] - '0';
            if (strlen(positionData) > 2) {  //if theres also an additional offset given
                TileOffset offset = (TileOffset)(request.getData()[0][2] - '0');
                succeeded = _gantry.moveToTileSync(column, row, offset);
            }
            else {
                succeeded = _gantry.moveToTileSync(column, row);
            }
            break;
        }
        case RequestedDataType::READ:
            _data[1] = _tileMatrixController.readHexString();
            succeeded = true;
            break;
        case RequestedDataType::GRAB:
            _gantry.grabPiece();
            succeeded = true;
            break;
        case RequestedDataType::RELS:
            _gantry.releasePiece();
            succeeded = true;
            break;
        case RequestedDataType::ERRO:
            succeeded = false;
            break;
        }

        if (succeeded) {
            Util::toCharArray("OK", _data[0]);
        }
        else {
            Util::toCharArray("ERROR", _data[0]);
        }

        _communicationController.respond(request.getType(), _data);
        Util::delete2DArray(request.getData(), 4);
        delete[] rawRequest;
    }

    _gantry.run();
}

void Controller::clearData() {
    for (int i = 0; i < 4; i++) {
        _data[i][0] = '\0';
    }
}