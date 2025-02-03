#include "AccelStepper.h"
#include "Position.h"
#include "../pins.h"
#include "../config.h"
#include "StepperDirection.h"

class Gantry {
private:
    Position _currentPosition;
    Position _targetPosition;

    AccelStepper _leftStepper;
    AccelStepper _rightStepper;

    bool isLimitSwitchXTriggered();
    bool isLimitSwitchYTriggered();
    void moveUntilTrue(StepperDirection leftStepperDirection, StepperDirection rightStepperDirection, bool (Gantry::* func)());

public:
    Gantry();
    Position getCurrentPosition();
    Position getTargetPosition();
    void setSteppersEnabled(bool areEnabled);
    void home();

    static void setLeftStepperDirection(StepperDirection direction);
    static void setRightStepperDirection(StepperDirection direction);
    static void setLeftStepperDirectionByBool(bool isClockwise);
    static void setRightStepperDirectionByBool(bool isClockwise);
};
