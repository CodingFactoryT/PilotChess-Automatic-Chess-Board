#pragma once
#include "Arduino.h"
#pragma once

class Util {
public:
    static char** splitCharArray(char* input, char delimiter, int size) {
        char** output = new char* [size];

        for (int i = 0; i < size; i++) {
            output[i] = new char[SERIAL_RX_BUFFER_SIZE];
        }

        int inputIterationIndex = 0;
        int outputSingleArrayIndex = 0;
        int outputArrayIndex = 0;
        char currentChar;
        while ((currentChar = input[inputIterationIndex]) != '\0') {
            if (currentChar == delimiter) {
                output[outputArrayIndex][outputSingleArrayIndex] = '\0';
                outputSingleArrayIndex = 0;
                outputArrayIndex++;
                inputIterationIndex++;
                continue;
            }

            output[outputArrayIndex][outputSingleArrayIndex] = currentChar;
            outputSingleArrayIndex++;
            inputIterationIndex++;
        }

        output[outputArrayIndex][outputSingleArrayIndex] = '\0';

        for (int i = outputArrayIndex + 1; i < size; i++) {
            output[i] = nullptr;
        }

        return output;
    }

    static void delete2DArray(char** arr, int rows) {
        for (int i = 0; i < rows; i++) {
            delete[] arr[i];
        }
        delete[] arr;
    }

    static String bytesToHexString(byte* input, int inputSize) {
        String hexString = "";
        for (int i = 0; i < inputSize; i++) {
            byte currentByte = input[i];

            if (currentByte < 0x10) {    //add leading zero if hex is only one digit long
                hexString += "0";
            }

            hexString += String(currentByte, HEX);
        }

        return hexString;
    }
};