#include "AccelStepper.h"
#include "Servo.h"
#include "./util/Position.h"
#include "../pins.h"
#include "../config.h"
#include "./util/StepperDirection.h"

class Gantry {
private:
    Position _currentPosition;

    AccelStepper _leftStepper;
    AccelStepper _rightStepper;
    Servo _magnetLiftServo;

    bool _isHomed;

    bool isLimitSwitchXTriggered();
    bool isLimitSwitchYTriggered();
    void moveUntilTrue(StepperDirection leftStepperDirection, StepperDirection rightStepperDirection, bool (Gantry::* func)());

public:
    Gantry();
    Position getCurrentPosition();
    Position getTargetPosition();
    void setSteppersEnabled(bool areEnabled);
    void home();
    void moveToPosition(double x, double y);
    void moveRelative(double deltaX, double deltaY);
    void moveToTile(char column, int row);
    void update();
    void initPieceGrabberServo();
    void grabPiece();
    void releasePiece();

    static void setLeftStepperDirection(StepperDirection direction);
    static void setRightStepperDirection(StepperDirection direction);
    static void setLeftStepperDirectionByBool(bool isClockwise);
    static void setRightStepperDirectionByBool(bool isClockwise);
};
