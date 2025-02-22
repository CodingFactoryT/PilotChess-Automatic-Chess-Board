#include "RequestedDataType.h"
#include "CommunicationDirection.h"
#include "Arduino.h"

const int dataArraySize = 4;

class Exchange {
private:
    CommunicationDirection _direction;
    RequestedDataType _type;
    String* _data;

public:
    static const int DATA_ARRAY_SIZE = dataArraySize;
    Exchange(CommunicationDirection direction, RequestedDataType type, String* data);
    CommunicationDirection getDirection();
    RequestedDataType getType();
    String* getData();
};