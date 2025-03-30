#pragma once
#include "Arduino.h"
#pragma once

class Util {
public:
    static char** splitCharArray(char* input, char delimiter, int size) {
        char** output = new char* [size];

        for (int i = 0; i < size - 1; i++) {
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
            Serial.println("NULL");
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

    static void bytesToHexString(byte* input, int inputSize, char* output, int outputSize) {
        for (int i = 0; i < inputSize; i++) {
            sprintf(output + (i * 2), "%02X", input[i]);
        }

        output[outputSize - 1] = '\0';
    }

    static char* toCharArray(String input, char* output) {
        int size = input.length();

        for (int i = 0; i < size; i++) {
            output[i] = input[i];
        }

        output[size] = '\0';

        return output;
    }
};