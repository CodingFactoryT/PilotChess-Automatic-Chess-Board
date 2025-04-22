#include "./util/Exchange.h"
#include "./util/util.h"
#include "../config.h"
#include "../errorcodes.h"

#define DATA_ARRAY_SIZE 5

class SerialCommunicationController {
private:
    RequestedDataType getRequestedDataTypeFromPointer(char dataType[]);
    String getResponseDataTypeAsString(RequestedDataType dataType);
public:
    bool isRequestPresent();
    char* readRequestFromSerial();
    Exchange parseRequest(char* rawRequest);
    void respond(RequestedDataType dataType, String data[]);
    void buildAndSendMessage(String responseType, String responseDataType, String data[]);
};