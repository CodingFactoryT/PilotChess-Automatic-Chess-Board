#include "SerialCommunicationController.h"

bool SerialCommunicationController::isRequestPresent() {
    return Serial.available();
}

char* SerialCommunicationController::readRequestFromSerial() {
    char* buffer = new char[SERIAL_RX_BUFFER_SIZE]; //allocate on the heap, otherwise buffer is local and its address is resulting in undefined behaviour
    int index = 0;
    char currentChar;
    while ((currentChar = Serial.read()) != '\n' && index < SERIAL_RX_BUFFER_SIZE - 1) {
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

    char** splittedData = Util::splitCharArray(rawData, ',', DATA_ARRAY_SIZE);
    delete[] rawData;
    return Exchange(direction, requestDataType, splittedData);
}

void SerialCommunicationController::respond(RequestedDataType dataType, String data[]) {
    String responseDataType = getResponseDataTypeAsString(dataType);
    buildAndSendMessage("RES", responseDataType, data);
}

void SerialCommunicationController::buildAndSendMessage(String responseType, String responseDataType, String data[]) {
    char message[SERIAL_TX_BUFFER_SIZE];

    snprintf(message, sizeof(message), "%s:%s:", responseType.c_str(), responseDataType.c_str());

    for (unsigned int i = 0; i < data->length(); i++) {
        if (data[i].length() > 0) {
            strncat(message, data[i].c_str(), sizeof(message) - strlen(message) - 1);  //append data to message

            if (i != data->length() - 1 && data[i + 1].length() > 0) {
                strncat(message, ",", sizeof(message) - strlen(message) - 1);
            }
        }
    }

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

