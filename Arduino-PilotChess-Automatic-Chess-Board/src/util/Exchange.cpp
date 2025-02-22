#include "./util/Exchange.h"

Exchange::Exchange(CommunicationDirection direction, RequestedDataType type, String* data) :
    _direction(direction),
    _type(type) {

    _data = new String[DATA_ARRAY_SIZE];
    for (int i = 0; i < DATA_ARRAY_SIZE; i++) {
        _data[i] = data[i];
    }
}
CommunicationDirection Exchange::getDirection() {
    return _direction;
}
RequestedDataType Exchange::getType() {
    return _type;
}

String* Exchange::getData() {
    return _data;
}