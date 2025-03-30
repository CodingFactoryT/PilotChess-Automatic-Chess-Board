#include "SerialCommunicationController.h"

bool SerialCommunicationController::isRequestPresent() {
    return Serial.available();
}

char* SerialCommunicationController::readRequestFromSerial() {
    char* buffer = new char[SERIAL_RX_BUFFER_SIZE + 1]; //allocate on the heap, otherwise buffer is local and its address is resulting in undefined behaviour
    int index = 0;
    char currentChar;
    while ((currentChar = Serial.read()) != '\n' && index < SERIAL_RX_BUFFER_SIZE - 1) {
        if (index > SERIAL_RX_BUFFER_SIZE - 1) {
            break;
        }
        buffer[index] = currentChar;
        index++;
        delayMicroseconds(SERIAL_READ_DELAY_MICROS);   //wait for next character to be able to arrive via Serial
    }

    buffer[index] = '\0';
    return buffer;
}

/**
 * Request is of type XXX:YYYY:______
 * where
 * XXX = exactly 3 letters: REQ or RES
 * YYYY = exactly 4 letters: one of the types specified in RequestedDataType
 * ______ = the request data, which is comma separated
 */
Exchange SerialCommunicationController::parseRequest(char* rawRequest) {
    char requestType[4] = { rawRequest[0], rawRequest[1], rawRequest[2], '\0' }; //first 3 characters
    CommunicationDirection direction = strcmp(requestType, "REQ") == 0 ? CommunicationDirection::REQUEST : CommunicationDirection::RESPONSE;
    char requestDataTypeString[5]{ rawRequest[4], rawRequest[5], rawRequest[6], rawRequest[7], '\0' }; //4 more characters after the first colon
    RequestedDataType requestDataType = getRequestedDataTypeFromPointer(requestDataTypeString);

    char* rawData = new char[SERIAL_RX_BUFFER_SIZE];
    int index = 9;  //starting index of the data characters

    char currentChar;
    while ((currentChar = rawRequest[index]) != '\0') {
        rawData[index - 9] = currentChar;
        index++;
    }
    rawData[index - 9] = '\0';

    char** splittedData = Util::splitCharArray(data, ',', 5);
    delete[] data;
    return Exchange(direction, requestDataType, splittedData);
}

void SerialCommunicationController::respond(RequestedDataType dataType, char** data) {
    Exchange response = Exchange(CommunicationDirection::RESPONSE, dataType, data);
    String responseDataType = getResponseDataTypeAsString(response.getType());
    char* message = buildMessage("RES", responseDataType, response.getData());

    sendMessage(message);

    delete[] message;
}

char* SerialCommunicationController::buildMessage(String responseType, String responseDataType, char** data) {
    char* message = new char[SERIAL_TX_BUFFER_SIZE];
    int messageIndex = 0;
    for (unsigned int i = 0; i < responseType.length(); i++) {
        message[messageIndex++] = responseType[i];
    }

    message[messageIndex++] = ':';

    for (unsigned int i = 0; i < responseDataType.length(); i++) {
        message[messageIndex++] = responseDataType[i];
    }

    message[messageIndex++] = ':';
    for (int i = 0; i < 4; i++) {
        if (data[i][0] == '\0') {
            break;
        }
        for (int j = 0; j < SERIAL_TX_BUFFER_SIZE; j++) {
            if (data[i][j] == '\0') {
                break;
            }

            message[messageIndex++] = data[i][j];
        }

        if (i != 3 && data[i + 1][0] != '\0') {
            message[messageIndex++] = ',';
        }
    }

    message[messageIndex] = '\0';

    return message;
}

void SerialCommunicationController::sendMessage(char* message) {
    Serial.println(message);
}

RequestedDataType SerialCommunicationController::getRequestedDataTypeFromPointer(char dataType[]) {
    if (strcmp(dataType, "HOME") == 0) {
        return RequestedDataType::HOME;
    }

    if (strcmp(dataType, "MOVE") == 0) {
        return RequestedDataType::MOVE;
    }

    if (strcmp(dataType, "READ") == 0) {
        return RequestedDataType::READ;
    }

    if (strcmp(dataType, "GRAB") == 0) {
        return RequestedDataType::GRAB;
    }

    if (strcmp(dataType, "RELS") == 0) {
        return RequestedDataType::RELS;
    }

    return RequestedDataType::ERRO;
}

String SerialCommunicationController::getResponseDataTypeAsString(RequestedDataType dataType) {
    String responseDataType;

    switch (dataType) {
    case RequestedDataType::HOME:
        responseDataType = "HOME";
        break;
    case RequestedDataType::MOVE:
        responseDataType = "MOVE";
        break;
    case RequestedDataType::READ:
        responseDataType = "READ";
        break;
    case RequestedDataType::GRAB:
        responseDataType = "GRAB";
        break;
    case RequestedDataType::RELS:
        responseDataType = "RELS";
        break;
    default:
        responseDataType = "ERRO";
    }

    return responseDataType;
}

