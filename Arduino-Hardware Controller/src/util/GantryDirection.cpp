#include "./util/GantryDirection.h"

namespace GantryDirectionUtil {
  void calculateStepperDirections(GantryDirection direction, StepperDirection* leftStepperDirection, StepperDirection* rightStepperDirection) {
    switch (direction)
    {
    case X_POSITIVE:            *leftStepperDirection = StepperDirection::CLOCKWISE;        *rightStepperDirection = StepperDirection::CLOCKWISE;        break;
    case X_NEGATIVE:            *leftStepperDirection = StepperDirection::COUNTERCLOCKWISE; *rightStepperDirection = StepperDirection::COUNTERCLOCKWISE; break;
    case Y_POSITIVE:            *leftStepperDirection = StepperDirection::COUNTERCLOCKWISE; *rightStepperDirection = StepperDirection::CLOCKWISE;        break;
    case Y_NEGATIVE:            *leftStepperDirection = StepperDirection::CLOCKWISE;        *rightStepperDirection = StepperDirection::COUNTERCLOCKWISE; break;
    case XY_POSITIVE:           *leftStepperDirection = StepperDirection::IDLE;             *rightStepperDirection = StepperDirection::CLOCKWISE;        break;
    case XY_NEGATIVE:           *leftStepperDirection = StepperDirection::IDLE;             *rightStepperDirection = StepperDirection::COUNTERCLOCKWISE; break;
    case X_POSITIVE_Y_NEGATIVE: *leftStepperDirection = StepperDirection::CLOCKWISE;        *rightStepperDirection = StepperDirection::IDLE;             break;
    case X_NEGATIVE_Y_POSITIVE: *leftStepperDirection = StepperDirection::COUNTERCLOCKWISE; *rightStepperDirection = StepperDirection::IDLE;             break;
    default:                    *leftStepperDirection = StepperDirection::IDLE;             *rightStepperDirection = StepperDirection::IDLE;             break;
    }
  }
}