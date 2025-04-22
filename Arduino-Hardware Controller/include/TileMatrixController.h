#include "Arduino.h"
#include "../pins.h"
#include "./util/Util.h"

const int ROWS = 8;

class TileMatrixController {
private:
    String _dataHexString;
    void setMatrixActivated(bool isActivated);
    byte* read();

public:
    TileMatrixController();
    String readHexString();
};