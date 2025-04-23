#pragma once
#include "Arduino.h"
#pragma once

class Util {
public:
    static char** splitCharArray(char* input, char delimiter, int size, char** output) {
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

    static void bytesToHex(const byte* input, int inputSize, char* out) {
        out[0] = '\0';
        for (int i = 0; i < inputSize; i++) {
            byte currentByte = input[i];

            if (currentByte < 0x10) {    //add leading zero if hex is only one digit long
                strcat(out, "0");
            }

            strcat(out, String(currentByte, HEX).c_str());
        }
    }
};