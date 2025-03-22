#include "Gantry.h"

Gantry::Gantry() :
    _currentPosition(NAN, NAN),
    _leftStepper(STEPPER_DRIVER_TYPE, LEFT_MOTOR_STEP_PIN, LEFT_MOTOR_DIR_PIN),
    _rightStepper(STEPPER_DRIVER_TYPE, RIGHT_MOTOR_STEP_PIN, RIGHT_MOTOR_DIR_PIN),
    _isHomed(false) {

    pinMode(LIMIT_SWITCH_X_PIN, INPUT_PULLUP);
    pinMode(LIMIT_SWITCH_Y_PIN, INPUT_PULLUP);

    setEnablePin(STEPPER_ENABLE_PIN);

    setMaxSpeed(MAX_SPEED);
    setAcceleration(ACCELERATION);
    setPinsInverted(true, false, true);

    setSteppersEnabled(true);   //TODO improve by not enabling them all the time?
}

void Gantry::run() {
    _leftStepper.run();
    _rightStepper.run();
}

void Gantry::runWhileTrueSync(bool (Gantry::* terminateFunction)()) {
    while ((this->*terminateFunction)()) {
        run();
    }
}

void Gantry::home() {
    setMaxSpeed(HOMING_SPEED);
    setAcceleration(ACCELERATION);

    const int MOVE_BACK_MM = 30;

    if (isLimitSwitchXTriggered() && isLimitSwitchYTriggered()) {
        moveRelativeSync(Position(0, MOVE_BACK_MM), HOMING_SPEED, false);
        moveRelativeSync(Position(MOVE_BACK_MM, 0), HOMING_SPEED, false);
    }
    else if (isLimitSwitchXTriggered()) {
        moveRelativeSync(Position(MOVE_BACK_MM, 0), HOMING_SPEED, false);
    }
    else if (isLimitSwitchYTriggered()) {
        moveRelativeSync(Position(0, MOVE_BACK_MM), HOMING_SPEED, false);
    }

    stepUntilTrueSync(GantryDirection::X_NEGATIVE, &Gantry::isLimitSwitchXTriggered);
    delay(500);

    if (isLimitSwitchYTriggered()) {
        moveRelativeSync(Position(0, MOVE_BACK_MM), HOMING_SPEED, false);
    }

    stepUntilTrueSync(GantryDirection::Y_NEGATIVE, &Gantry::isLimitSwitchYTriggered);

    _currentPosition.setPosition(0, 0);
    _isHomed = true;
    setMaxSpeed(MAX_SPEED);
}

void Gantry::stepUntilTrueSync(GantryDirection direction, bool (Gantry::* fct)()) {
    StepperDirection leftStepperDirection;
    StepperDirection rightStepperDirection;
    GantryDirectionUtil::calculateStepperDirections(direction, &leftStepperDirection, &rightStepperDirection);
    int leftStepperSign = StepperDirectionUtil::getStepByDirection(leftStepperDirection);
    int rightStepperSign = StepperDirectionUtil::getStepByDirection(rightStepperDirection);


    _leftStepper.moveTo(leftStepperSign * 1000000 * STEPS_PER_REVOLUTION);    //move left stepper infinitely in the given direction, including initial acceleration
    _rightStepper.moveTo(rightStepperSign * 1000000 * STEPS_PER_REVOLUTION);   //move right stepper infinitely in the given direction, including initial acceleration

    while (!(this->*fct)()) {
        run();
    }

    stopInstantly();
}


bool Gantry::moveRelativeSync(Position delta, int speed, bool validateInput) {
    bool succeeded = moveRelativeAsync(delta, speed, validateInput);
    runWhileTrueSync(&Gantry::isRunning);

    return succeeded;
}

bool Gantry::moveRelativeAsync(Position delta, int speed, bool validateInput) {
    Position positionToMoveTo = _currentPosition.add(delta);
    if (validateInput && (!_isHomed || !validatePosition(positionToMoveTo))) {
        return false;
    }

    double scaledX = delta.getX() * STEPS_PER_MM_X;
    double scaledY = delta.getY() * STEPS_PER_MM_Y;

    long leftMotorSteps = scaledY - scaledX;
    long rightMotorSteps = scaledX + scaledY;

    float leftStepperSpeed = speed;
    float rightStepperSpeed = speed;
    float leftStepperAcceleration = ACCELERATION;
    float rightStepperAcceleration = ACCELERATION;

    long absLeftMotorSteps = abs(leftMotorSteps);
    long absRightMotorSteps = abs(rightMotorSteps);

    if (absLeftMotorSteps > absRightMotorSteps) {
        rightStepperSpeed = (speed * absRightMotorSteps) / absLeftMotorSteps;
        rightStepperAcceleration = (ACCELERATION * absRightMotorSteps) / absLeftMotorSteps;
    }
    else {
        leftStepperSpeed = (speed * absLeftMotorSteps) / absRightMotorSteps;
        leftStepperAcceleration = (ACCELERATION * absLeftMotorSteps) / absRightMotorSteps;
    }

    _leftStepper.setMaxSpeed(leftStepperSpeed);
    _rightStepper.setMaxSpeed(rightStepperSpeed);
    _leftStepper.setAcceleration(leftStepperAcceleration);
    _rightStepper.setAcceleration(rightStepperAcceleration);

    _leftStepper.move(-leftMotorSteps);
    _rightStepper.move(rightMotorSteps);

    _currentPosition.setPosition(positionToMoveTo);
    return true;
}

bool Gantry::moveToPositionSync(Position position, int speed, bool validateInput) {
    bool succeeded = moveToPositionAsync(position, speed, validateInput);
    runWhileTrueSync(&Gantry::isRunning);

    return succeeded;
}

bool Gantry::moveToPositionAsync(Position position, int speed, bool validateInput) {
    Position delta = position.subtract(_currentPosition);
    return moveRelativeAsync(delta, speed, validateInput);
}

bool Gantry::moveToTileSync(char column, int row, TileOffset offset, int speed, bool validateInput) {
    bool succeeded = moveToTileAsync(column, row, offset, speed, validateInput);
    runWhileTrueSync(&Gantry::isRunning);

    return succeeded;
}

bool Gantry::moveToTileAsync(char column, int row, TileOffset offset, int speed, bool validateInput) {
    int columnIndex = column - 'a';
    int rowIndex = row - 1;

    int x = GANTRY_X_OFFSET_TO_A1 + columnIndex * TILE_SIZE_MM;
    int y = GANTRY_Y_OFFSET_TO_A1 + rowIndex * TILE_SIZE_MM;

    Position newPosition = TileOffsetUtil::applyOffset(Position(x, y), offset);

    return moveToPositionAsync(newPosition, speed, validateInput);
}

void Gantry::initPieceGrabberServo() {
    _magnetLiftServo.attach(MAGNET_SERVO_PIN);
    releasePiece();
}

void Gantry::grabPiece() {
    _magnetLiftServo.write(MAGNET_SERVO_POSITION_UP);
}

void Gantry::releasePiece() {
    _magnetLiftServo.write(MAGNET_SERVO_POSITION_DOWN);
}

void Gantry::stopInstantly() {
    _leftStepper.setCurrentPosition(0);
    _rightStepper.setCurrentPosition(0);
}

bool Gantry::validatePosition(Position position) {
    return
        !isnan(position.getX()) &&
        !isnan(position.getY()) &&
        position.getX() >= GANTRY_MIN_POSITION_X &&
        position.getX() <= GANTRY_MAX_POSITION_X &&
        position.getY() >= GANTRY_MIN_POSITION_Y &&
        position.getY() <= GANTRY_MAX_POSITION_Y;
}

void Gantry::setMaxSpeed(float maxSpeed) {
    _leftStepper.setMaxSpeed(maxSpeed);
    _rightStepper.setMaxSpeed(maxSpeed);
}

void Gantry::setAcceleration(float acceleration) {
    _leftStepper.setAcceleration(acceleration);
    _rightStepper.setAcceleration(acceleration);
}

void Gantry::setPinsInverted(bool directionInvert, bool stepInvert, bool enableInvert) {
    _leftStepper.setPinsInverted(directionInvert, stepInvert, enableInvert);
    _rightStepper.setPinsInverted(directionInvert, stepInvert, enableInvert);
}

void Gantry::setEnablePin(int enablePin) {
    _leftStepper.setEnablePin(enablePin);
    _rightStepper.setEnablePin(enablePin);
}

void Gantry::setSteppersEnabled(bool areEnabled) {
    if (areEnabled) {
        _leftStepper.enableOutputs();
        _leftStepper.enableOutputs();
    }
    else {
        _leftStepper.disableOutputs();
        _rightStepper.disableOutputs();
    }
}

bool Gantry::isRunning() {
    return _leftStepper.isRunning() || _rightStepper.isRunning();
}

Position Gantry::getCurrentPosition() {
    return _currentPosition;
}

bool Gantry::isLimitSwitchXTriggered() {
    return digitalRead(LIMIT_SWITCH_X_PIN);
}

bool Gantry::isLimitSwitchYTriggered() {
    return digitalRead(LIMIT_SWITCH_Y_PIN);
}
