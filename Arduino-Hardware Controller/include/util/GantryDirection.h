#pragma once
#include "StepperDirection.h"

enum GantryDirection {
    X_POSITIVE,     //Left Clockwise, Right Clockwise
    X_NEGATIVE,     //Left Counterclockwise, Right Counterclockwise
    Y_POSITIVE,     //Left Counterclockwise, Right Clockwise
    Y_NEGATIVE,     //Left Clockwise, Right Counterclockwise
    XY_POSITIVE,    //Left Idle, Right Clockwise
    XY_NEGATIVE,    //Left Idle, Right Counterclockwise
    X_POSITIVE_Y_NEGATIVE,  //Left Clockwise, Right Idle
    X_NEGATIVE_Y_POSITIVE   //Left Counterclockwise, Right Idle
};

namespace GantryDirectionUtil {
    void calculateStepperDirections(GantryDirection direction, StepperDirection* leftStepperDirection, StepperDirection* rightStepperDirection);
}