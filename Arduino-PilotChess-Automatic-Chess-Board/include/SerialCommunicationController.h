#include "./util/Exchange.h"
#include "./util/util.h"
#include "../config.h"
#include "../errorcodes.h"

class SerialCommunicationController {
private:
    RequestedDataType getRequestedDataTypeFromPointer(char dataType[]);
    String getResponseDataTypeAsString(RequestedDataType dataType);
public:
    bool isRequestPresent();
    char* readRequestFromSerial();
    Exchange parseRequest(char* rawRequest);
    void respond(RequestedDataType dataType, char** data);
    char* buildMessage(String responseType, String responseDataType, char** data);
    void sendMessage(char* message);
};