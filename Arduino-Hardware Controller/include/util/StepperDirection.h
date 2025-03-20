#pragma once

enum StepperDirection {
    CLOCKWISE,
    COUNTERCLOCKWISE,
    IDLE
};

namespace StepperDirectionUtil {
    constexpr bool isClockwise(StepperDirection direction) {
        return direction == StepperDirection::CLOCKWISE;
    }

    constexpr int getStepByDirection(StepperDirection direction) {
        return direction == StepperDirection::CLOCKWISE ? 1 :
            (direction == StepperDirection::COUNTERCLOCKWISE ? -1
                : 0);
    }
};