#include "Arduino.h"
#include "../pins.h"
#include "./util/Util.h"

const int ROWS = 8;

class TileMatrixController {
private:
    void setMatrixActivated(bool isActivated);
    void read(byte* data);

public:
    TileMatrixController();
    void readHex(char* out);
};