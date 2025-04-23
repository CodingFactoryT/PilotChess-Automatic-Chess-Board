#include "./util/Exchange.h"
#include "./util/util.h"
#include "../config.h"
#include "../errorcodes.h"

#define DATA_ARRAY_SIZE 5

class SerialCommunicationController {
private:
    RequestedDataType getRequestedDataTypeFromPointer(char dataType[]);
    const char* getResponseDataTypeAsCharPointer(RequestedDataType dataType);
public:
    bool isRequestPresent();
    void readRequestFromSerial(char* buffer);
    Exchange parseRequest(char* rawRequest);
    void respond(RequestedDataType dataType, char** data);
    void buildMessage(const char* responseType, const char* responseDataType, char** data, char* message);
    void sendMessage(char* message);
};