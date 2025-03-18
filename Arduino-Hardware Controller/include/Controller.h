#include "Gantry.h"
#include "TileMatrixController.h"
#include "SerialCommunicationController.h"

class Controller {
private:
    void clearData();
    char** _data;
public:
    Gantry _gantry;
    SerialCommunicationController _communicationController;
    TileMatrixController _tileMatrixController;
    Controller();
    ~Controller();
    void update();
};