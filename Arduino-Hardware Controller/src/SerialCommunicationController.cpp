#include "SerialCommunicationController.h"

bool SerialCommunicationController::isRequestPresent() {
    return Serial.available();
}

void SerialCommunicationController::readRequestFromSerial(char* buffer) {
    int index = 0;
    char currentChar;
    while ((currentChar = Serial.read()) != '\n' && index < SERIAL_RX_BUFFER_SIZE - 1) {
        buffer[index] = currentChar;
        index++;
        delayMicroseconds(SERIAL_READ_DELAY_MICROS);   //wait for next character to be able to arrive via Serial
    }

    buffer[index] = '\0';
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

    char rawData[SERIAL_RX_BUFFER_SIZE];
    int index = 9;  //starting index of the data characters

    char currentChar;
    while ((currentChar = rawRequest[index]) != '\0') {
        rawData[index - 9] = currentChar;
        index++;
    }
    rawData[index - 9] = '\0';

    char splittedData[DATA_ARRAY_SIZE][SERIAL_RX_BUFFER_SIZE];
    char* data[DATA_ARRAY_SIZE];

    for (int i = 0; i < DATA_ARRAY_SIZE; i++) {
        data[i] = splittedData[i];
    }

    Util::splitCharArray(rawData, ',', DATA_ARRAY_SIZE, data);
    return Exchange(direction, requestDataType, data);
}

void SerialCommunicationController::respond(RequestedDataType dataType, char** data) {
    const char* responseDataType = getResponseDataTypeAsCharPointer(dataType);
    char message[SERIAL_TX_BUFFER_SIZE];

    buildMessage("RES", responseDataType, data, message);
    sendMessage(message);
}

void SerialCommunicationController::buildMessage(const char* responseType, const char* responseDataType, char** data, char* message) {
    message[0] = '\0';  //initialize array with empty string

    sprintf(message, "%s:%s:", responseType, responseDataType);


    for (unsigned int i = 0; i < DATA_ARRAY_SIZE; i++) {
        if (data[i][0] != '\0') {   //if the data is not empty
            strcat(message, data[i]);  //append data to message

            if (i != DATA_ARRAY_SIZE - 1 && data[i + 1][0] != '\0') {  //if there is a next element in the data array
                strcat(message, ",");
            }
        }
    }
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

const char* SerialCommunicationController::getResponseDataTypeAsCharPointer(RequestedDataType dataType) {
    switch (dataType) {
    case RequestedDataType::HOME:
        return "HOME";
    case RequestedDataType::MOVE:
        return "MOVE";
    case RequestedDataType::READ:
        return "READ";
    case RequestedDataType::GRAB:
        return "GRAB";
    case RequestedDataType::RELS:
        return "RELS";
    default:
        return "ERRO";
    }

}

