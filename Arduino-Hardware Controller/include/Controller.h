#include "Gantry.h"
#include "TileMatrixController.h"
#include "SerialCommunicationController.h"

#define DATA_ARRAY_SIZE 5

class Controller {
public:
    Gantry _gantry;
    SerialCommunicationController _communicationController;
    TileMatrixController _tileMatrixController;
    void update();
};