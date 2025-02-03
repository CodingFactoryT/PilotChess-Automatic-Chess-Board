
enum StepperDirection {
    CLOCKWISE,
    COUNTERCLOCKWISE
};

namespace StepperDirectionUtil {
    constexpr bool isClockwise(StepperDirection direction) {
        return direction == StepperDirection::CLOCKWISE;
    }
};