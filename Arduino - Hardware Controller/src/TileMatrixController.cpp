#include "TileMatrixController.h"

TileMatrixController::TileMatrixController() {
    _data = new byte[ROWS];
    _dataHexString = new char[ROWS * 2 + 1]; //+1 for null terminator

    pinMode(TILE_MATRIX_COL_SELECT_A_PIN, OUTPUT);
    pinMode(TILE_MATRIX_COL_SELECT_B_PIN, OUTPUT);
    pinMode(TILE_MATRIX_COL_SELECT_C_PIN, OUTPUT);
    pinMode(TILE_MATRIX_COL_SELECT_ENABLE_PIN, OUTPUT);
    pinMode(TILE_MATRIX_ROW_SELECT_A_PIN, OUTPUT);
    pinMode(TILE_MATRIX_ROW_SELECT_B_PIN, OUTPUT);
    pinMode(TILE_MATRIX_ROW_SELECT_C_PIN, OUTPUT);
    pinMode(TILE_MATRIX_DATA_PIN, INPUT_PULLUP);
}

TileMatrixController::~TileMatrixController() {
    delete[] _dataHexString;
    delete[] _data;
}

byte* TileMatrixController::read() {
    memset(_data, 0, ROWS); //reset _data to all zeros

    setMatrixActivated(true);

    for(int row = 0; row <= 7; row++) {
        boolean isRowSelectAEnabled = row == 0 || row == 1 || row == 2 || row == 4; //results in: 1,1,1,0,1,0,0,0
        boolean isRowSelectBEnabled = row == 1 || row == 2 || row == 5 || row == 6; //results in: 0,1,1,0,0,1,1,0
        boolean isRowSelectCEnabled = row == 0 || row == 2 || row == 6 || row == 7; //results in: 1,0,1,0,0,0,1,1
        digitalWrite(TILE_MATRIX_ROW_SELECT_A_PIN, isRowSelectAEnabled);
        digitalWrite(TILE_MATRIX_ROW_SELECT_B_PIN, isRowSelectBEnabled);
        digitalWrite(TILE_MATRIX_ROW_SELECT_C_PIN, isRowSelectCEnabled);
        for(int col = 0; col <= 7; col++) {
          boolean isColSelectAEnabled = col == 0 || col == 2 || col == 4 || col == 7; //results in: 1,0,1,0,1,0,0,1
          boolean isColSelectBEnabled = col == 2 || col == 3 || col == 6 || col == 7; //results in: 0,0,1,1,0,0,1,1
          boolean isColSelectCEnabled = col >= 4;                                     //results in: 0,0,0,0,1,1,1,1
          digitalWrite(TILE_MATRIX_COL_SELECT_A_PIN, isColSelectAEnabled);
          digitalWrite(TILE_MATRIX_COL_SELECT_B_PIN, isColSelectBEnabled);
          digitalWrite(TILE_MATRIX_COL_SELECT_C_PIN, isColSelectCEnabled);
          delayMicroseconds(100); //IMPORTANT, otherwise there are wrong readings
    
          boolean isTriggered = !digitalRead(TILE_MATRIX_DATA_PIN);  //inverted because it uses a pull-up resistor
          _data[row] |= (isTriggered << (7 - col)); //set the bit at the corresponding byte position
        }
    }

    setMatrixActivated(false);

    return _data;
}

char* TileMatrixController::readHexString() {
    Util::bytesToHexString(read(), ROWS, _dataHexString, ROWS * 2 + 1);
    return _dataHexString;
}

void TileMatrixController::setMatrixActivated(bool isActivated) {
    digitalWrite(TILE_MATRIX_COL_SELECT_ENABLE_PIN, !isActivated);  //active LOW
}
    