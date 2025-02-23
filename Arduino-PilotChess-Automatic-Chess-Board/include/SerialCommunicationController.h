#include "./util/Exchange.h"
#include "../errorcodes.h"
#include "./util/util.h"

class SerialCommunicationController {
private:
    RequestedDataType getRequestedDataTypeFromPointer(char* dataType);
    String getResponseDataTypeAsString(RequestedDataType dataType);
public:
    bool isRequestPresent();
    char* readRequestFromSerial();
    void handleRequest(char* rawRequest);
    Exchange parseRequest(char* rawRequest);
    Exchange calculateResponse(Exchange request);
    void respond(Exchange response);
    char* buildMessage(String responseType, String responseDataType, char** data);
    void sendMessage(String message);
};