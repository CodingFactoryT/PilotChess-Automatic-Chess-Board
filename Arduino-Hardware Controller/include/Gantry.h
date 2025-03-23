#include "AccelStepper.h"
#include "Servo.h"
#include "./util/Position.h"
#include "../pins.h"
#include "../config.h"
#include "./util/StepperDirection.h"
#include "./util/GantryDirection.h"
#include "./util/TileOffset.h"

class Gantry {
private:
    Position _currentPosition;
    int _currentMaxSpeed;
    bool _isDraggingPiece;

    Position _currentOverflow;

    AccelStepper _leftStepper;
    AccelStepper _rightStepper;
    Servo _magnetLiftServo;

    bool _isHomed;

    bool isLimitSwitchXTriggered();
    bool isLimitSwitchYTriggered();

    void setMaxSpeed(float maxSpeed);

public:
    Gantry();
    void run();
    void runWhileTrueSync(bool (Gantry::* terminateFunction)());
    void home();

    void stepUntilTrueSync(GantryDirection direction, bool (Gantry::* fct)());

    /**
    *Only use validateInput=true if you know what you're doing!
    */
    bool moveRelativeSync(Position delta, bool validateInput = true);

    /**
    *Only use validateInput=true if you know what you're doing!
    */
    bool moveRelativeAsync(Position delta, bool validateInput = true);

    bool moveToPositionSync(Position position);
    bool moveToPositionAsync(Position position);

    bool moveToTileSync(char column, int row, TileOffset offset = TileOffset::CENTER);
    bool moveToTileAsync(char column, int row, TileOffset offset = TileOffset::CENTER);

    void initPieceGrabberServo();
    void grabPiece();
    void releasePiece();

    void resetSpeedAndAcceleration();
    void stopInstantly();
    bool validatePosition(Position position);
    void setAcceleration(float maxAcceleration);
    void setPinsInverted(bool directionInvert, bool stepInvert, bool enableInvert);
    void setEnablePin(int enablePin);
    void setSteppersEnabled(bool areEnabled);
    bool isRunning();
    bool isLeftStepperRunning();
    bool isRightStepperRunning();
    Position getCurrentPosition();
};
