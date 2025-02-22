#include "SerialCommunicationController.h"

bool SerialCommunicationController::isRequestPresent() {
    return Serial.available();
}

String SerialCommunicationController::readRequestFromSerial() {
    return Serial.readString();
}

void SerialCommunicationController::handleRequest(String rawRequest) {
    Exchange request = parseRequest(rawRequest);
    Exchange response = calculateResponse(request);
    respond(response);
}

/**
 * Request is of type XXX:YYYY:______
 * where
 * XXX = exactly 3 letters: REQ or RES
 * YYYY = exactly 4 letters: one of the types specified in RequestedDataType
 * ______ = the request data, which is comma separated
 */
Exchange SerialCommunicationController::parseRequest(String rawRequest) {
    String requestType = rawRequest.substring(0, 3);
    CommunicationDirection direction = requestType.equals("REQ") ? CommunicationDirection::REQUEST : CommunicationDirection::RESPONSE;

    String requestDataTypeString = rawRequest.substring(4, 8);
    RequestedDataType requestDataType = getRequestedDataTypeFromString(requestDataTypeString);

    String dataString = rawRequest.substring(9, rawRequest.length());
    dataString.replace("\n", "");   //remove \n at the end of the read String
    String data[Exchange::DATA_ARRAY_SIZE];
    Util::splitString(dataString, ',', data);
    return Exchange(direction, requestDataType, data);
}

Exchange SerialCommunicationController::calculateResponse(Exchange request) {
    return Exchange(CommunicationDirection::RESPONSE, request.getType(), request.getData());    //example response, will be replaced with real data
}

void SerialCommunicationController::respond(Exchange response) {
    String responseDataType = getResponseDataTypeAsString(response.getType());
    String message = buildMessage("RES", responseDataType, response.getData());

    sendMessage(message);
}

String SerialCommunicationController::buildMessage(String responseType, String responseDataType, String data[]) {
    String message = responseType + ":" + responseDataType + ":";
    const int dataSize = Exchange::DATA_ARRAY_SIZE;
    for (int i = 0; i < dataSize; i++) {
        message += data[i];
        if (i != dataSize - 1) {
            message += ",";
        }
    }

    return message;
}

void SerialCommunicationController::sendMessage(String message) {
    Serial.println(message);
}

RequestedDataType SerialCommunicationController::getRequestedDataTypeFromString(String str) {
    if (str.equals("HOME")) {
        return RequestedDataType::HOME;
    }

    if (str.equals("MOVE")) {
        return RequestedDataType::MOVE;
    }

    if (str.equals("READ")) {
        return RequestedDataType::READ;
    }

    return RequestedDataType::ERR;
}

String SerialCommunicationController::getResponseDataTypeAsString(RequestedDataType dataType) {
    String responseDataType = "";
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

