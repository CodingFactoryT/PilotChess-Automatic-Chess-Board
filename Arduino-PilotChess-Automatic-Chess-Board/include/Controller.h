#include "Gantry.h"
#include "TileMatrixController.h"
#include "SerialCommunicationController.h"

class Controller {
private:
    Gantry _gantry;
    SerialCommunicationController _communicationController;
    TileMatrixController _tileMatrixController;
    void clearData();
    char** _data;
public:
    Controller();
    ~Controller();
    void update();
};