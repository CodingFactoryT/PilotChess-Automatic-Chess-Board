#include "RequestedDataType.h"
#include "CommunicationDirection.h"
#include "Arduino.h"

const int dataArraySize = 4;

class Exchange {
private:
    CommunicationDirection _direction;
    RequestedDataType _type;
    char** _data;

public:
    static const int DATA_ARRAY_SIZE = dataArraySize;
    Exchange(CommunicationDirection direction, RequestedDataType type, char** data);
    CommunicationDirection getDirection();
    RequestedDataType getType();
    char** getData();
};