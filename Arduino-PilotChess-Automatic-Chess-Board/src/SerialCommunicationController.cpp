#include "SerialCommunicationController.h"

bool SerialCommunicationController::isRequestPresent() {
    return Serial.available();
}

char* SerialCommunicationController::readRequestFromSerial() {
    char* buffer = new char[SERIAL_RX_BUFFER_SIZE]; //allocate on the heap, otherwise buffer is local and its address is resulting in undefined behaviour
    int index = 0;
    char currentChar;
    while ((currentChar = Serial.read()) != '\n') {
        buffer[index] = currentChar;
        index++;
        delayMicroseconds(100);   //wait for next character to be able to arrive via Serial
    }

    buffer[index] = '\0';
    return buffer;
}

void SerialCommunicationController::handleRequest(char* rawRequest) {
    Exchange request = parseRequest(rawRequest);
    Exchange response = calculateResponse(request);

    respond(response);

    Util::delete2DArray(response.getData(), 4);
    delete[] rawRequest;
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

    char* data = new char[SERIAL_RX_BUFFER_SIZE];
    int index = 9;  //starting index of the data characters

    char currentChar;
    while ((currentChar = rawRequest[index]) != '\0') {
        data[index - 9] = currentChar;
        index++;
    }
    data[index - 9] = '\0';

    char** splittedData = Util::splitCharArray(data, ',', 4);
    delete[] data;
    return Exchange(direction, requestDataType, splittedData);
}

Exchange SerialCommunicationController::calculateResponse(Exchange request) {
    return Exchange(CommunicationDirection::RESPONSE, request.getType(), request.getData());    //example response, will be replaced with real data
}

void SerialCommunicationController::respond(Exchange response) {
    String responseDataType = getResponseDataTypeAsString(response.getType());
    char* message = buildMessage("RES", responseDataType, response.getData());

    sendMessage(message);

    delete[] message;
}

char* SerialCommunicationController::buildMessage(String responseType, String responseDataType, char** data) {
    char* message = new char[SERIAL_TX_BUFFER_SIZE] {};
    int messageIndex = 0;
    for (unsigned int i = 0; i < responseType.length(); i++) {
        message[messageIndex++] = responseType[i];
    }

    message[messageIndex++] = ':';

    for (unsigned int i = 0; i < responseDataType.length(); i++) {
        message[messageIndex++] = responseDataType[i];
    }

    message[messageIndex++] = ':';
    //TODO DATA
    message[messageIndex] = '\0';

    return message;
}

void SerialCommunicationController::sendMessage(String message) {
    Serial.println(message);
}

RequestedDataType SerialCommunicationController::getRequestedDataTypeFromPointer(char* dataType) {
    if (strcmp(dataType, "HOME") == 0) {
        return RequestedDataType::HOME;
    }

    if (strcmp(dataType, "MOVE") == 0) {
        return RequestedDataType::MOVE;
    }

    if (strcmp(dataType, "READ") == 0) {
        return RequestedDataType::READ;
    }

    return RequestedDataType::ERR;
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
    case RequestedDataType::ERR:
        responseDataType = "ERRO";
    }

    return responseDataType;
}

