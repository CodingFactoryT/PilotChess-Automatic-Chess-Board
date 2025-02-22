#include "Arduino.h"

class Util {
public:
    static void splitString(String str, char delimiter, String* output) {
        int startIndex = 0; // Start index of the substring
        int endIndex = 0;   // End index of the substring
        int count = 0;         // Number of substrings

        while ((endIndex = str.indexOf(delimiter, startIndex)) != -1) {
            // Extract the substring
            output[count++] = str.substring(startIndex, endIndex);
            startIndex = endIndex + 1; // Move past the delimiter
        }

        // Add the last substring after the final delimiter
        output[count++] = str.substring(startIndex);
    }
};