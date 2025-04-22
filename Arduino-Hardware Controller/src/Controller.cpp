#include "Controller.h"

void Controller::update() {
    if (_communicationController.isRequestPresent()) {
        String data[4];
        char* rawRequest = _communicationController.readRequestFromSerial();
        Exchange request = _communicationController.parseRequest(rawRequest);
        bool succeeded = false;
        char** requestData = request.getData();

        switch (request.getType()) {
        case RequestedDataType::HOME:
            _gantry.home();
            succeeded = true;
            break;
        case RequestedDataType::MOVE: {
            char* positionData = requestData[0];
            char column = requestData[0][0];
            int row = requestData[0][1] - '0';
            if (strlen(positionData) > 2) {  //if theres also an additional offset given
                TileOffset offset = (TileOffset)(requestData[0][2] - '0');
                succeeded = _gantry.moveToTileSync(column, row, offset);
            }
            else {
                succeeded = _gantry.moveToTileSync(column, row);
            }
            break;
        }
        case RequestedDataType::READ:
            data[1] = _tileMatrixController.readHexString();
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
            data[0] = "OK";
        }
        else {
            data[0] = "ERROR";
        }

        _communicationController.respond(request.getType(), data);
        Util::delete2DArray(requestData, DATA_ARRAY_SIZE);
        delete[] rawRequest;
    }

    _gantry.run();
}