#include "./util/Exchange.h"

Exchange::Exchange(CommunicationDirection direction, RequestedDataType type, char** data) :
    _direction(direction),
    _type(type),
    _data(data) {
}

CommunicationDirection Exchange::getDirection() {
    return _direction;
}
RequestedDataType Exchange::getType() {
    return _type;
}

char** Exchange::getData() {
    return _data;
}