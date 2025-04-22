#include "RequestedDataType.h"
#include "CommunicationDirection.h"
#include "Arduino.h"
#include "./util/Util.h"

class Exchange {
private:
    CommunicationDirection _direction;
    RequestedDataType _type;
    char** _data;

public:
    Exchange(CommunicationDirection direction, RequestedDataType type, char** data);
    CommunicationDirection getDirection();
    RequestedDataType getType();
    char** getData();
};