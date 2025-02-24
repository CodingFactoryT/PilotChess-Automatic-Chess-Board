#include "Arduino.h"
#include "../pins.h"
#include "./util/Util.h"

const int ROWS = 8;

class TileMatrixController {
private:
    byte* _data;   //one byte per row, from bottom to top
    char* _dataHexString;
    void setMatrixActivated(bool isActivated);
    byte* read();

public:
    TileMatrixController();
    ~TileMatrixController();
    char* readHexString();
};