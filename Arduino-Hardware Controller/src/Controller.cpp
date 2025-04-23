#include "Controller.h"

void Controller::update() {
    if (_communicationController.isRequestPresent()) {
        char data[DATA_ARRAY_SIZE][SERIAL_RX_BUFFER_SIZE - 9];    //-9 for RES:TYPE:, 5: 4 for data, 1 for terminating nullptr
        for (int i = 0; i < DATA_ARRAY_SIZE; i++) {
            memset(data[i], 0, SERIAL_RX_BUFFER_SIZE - 9);  // zero out each row
        }

        char rawRequest[SERIAL_RX_BUFFER_SIZE];
        _communicationController.readRequestFromSerial(rawRequest);
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
            _tileMatrixController.readHex(data[1]);
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
            strcpy(data[0], "OK");
        }
        else {
            strcpy(data[0], "ERROR");
        }


        char* responseData[DATA_ARRAY_SIZE];
        for (int i = 0; i < DATA_ARRAY_SIZE; i++) {
            responseData[i] = data[i];
        }

        _communicationController.respond(request.getType(), responseData);
    }

    _gantry.run();
}