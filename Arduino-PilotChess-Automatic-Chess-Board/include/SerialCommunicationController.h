#include "./util/Exchange.h"
#include "../errorcodes.h"
#include "./util/util.h"

class SerialCommunicationController {
private:
    RequestedDataType getRequestedDataTypeFromString(String str);
    String getResponseDataTypeAsString(RequestedDataType dataType);
public:
    bool isRequestPresent();
    String readRequestFromSerial();
    void handleRequest(String rawRequest);
    Exchange parseRequest(String rawRequest);
    Exchange calculateResponse(Exchange request);
    void respond(Exchange response);
    String buildMessage(String responseString, String responseDataType, String data[]);
    void sendMessage(String message);
};