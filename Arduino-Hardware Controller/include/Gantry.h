#include "AccelStepper.h"
#include "Servo.h"
#include "./util/Position.h"
#include "../pins.h"
#include "../config.h"
#include "./util/StepperDirection.h"
#include "./util/GantryDirection.h"

class Gantry {
private:
    Position _currentPosition;

    AccelStepper _leftStepper;
    AccelStepper _rightStepper;
    Servo _magnetLiftServo;

    bool _isHomed;

    bool isLimitSwitchXTriggered();
    bool isLimitSwitchYTriggered();

public:
    Gantry();
    void run();
    void runWhileTrueSync(bool (Gantry::* terminateFunction)());
    void home();

    void stepUntilTrueSync(GantryDirection direction, bool (Gantry::* fct)());

    bool moveRelativeSync(Position delta, int speed = MAX_SPEED, bool validateInput = true);
    bool moveRelativeAsync(Position delta, int speed = MAX_SPEED, bool validateInput = true);

    bool moveToPositionSync(Position position, int speed = MAX_SPEED, bool validateInput = true);
    bool moveToPositionAsync(Position position, int speed = MAX_SPEED, bool validateInput = true);

    bool moveToTileSync(char column, int row, int speed = MAX_SPEED, bool validateInput = true);
    bool moveToTileAsync(char column, int row, int speed = MAX_SPEED, bool validateInput = true);

    void initPieceGrabberServo();
    void grabPiece();
    void releasePiece();

    void stopInstantly();
    bool validatePosition(Position position);
    void setMaxSpeed(float maxSpeed);
    void setAcceleration(float maxAcceleration);
    void setPinsInverted(bool directionInvert, bool stepInvert, bool enableInvert);
    void setEnablePin(int enablePin);
    void setSteppersEnabled(bool areEnabled);
    bool isRunning();
    Position getCurrentPosition();
};
