#include "Gantry.h"

Gantry::Gantry() :
    _currentPosition(NAN, NAN),
    _currentMaxSpeed(MAX_SPEED),
    _isDraggingPiece(false),
    _currentOverflow(Position(0.0, 0.0)),
    _leftStepper(STEPPER_DRIVER_TYPE, LEFT_MOTOR_STEP_PIN, LEFT_MOTOR_DIR_PIN),
    _rightStepper(STEPPER_DRIVER_TYPE, RIGHT_MOTOR_STEP_PIN, RIGHT_MOTOR_DIR_PIN),
    _isHomed(false) {

    pinMode(LIMIT_SWITCH_X_PIN, INPUT_PULLUP);
    pinMode(LIMIT_SWITCH_Y_PIN, INPUT_PULLUP);
    setEnablePin(STEPPER_ENABLE_PIN);
    resetSpeedAndAcceleration();
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

    resetSpeedAndAcceleration();

    double initialMovementX = isLimitSwitchXTriggered() ? HOMING_ALREADY_TRIGGERED_RETRACTION_MM : 0.0;
    double initialMovementY = isLimitSwitchYTriggered() ? HOMING_ALREADY_TRIGGERED_RETRACTION_MM : 0.0;

    moveRelativeSync(Position(initialMovementX, initialMovementY), false);

    stepUntilTrueSync(GantryDirection::X_NEGATIVE, &Gantry::isLimitSwitchXTriggered);
    delay(500);

    if (isLimitSwitchYTriggered()) {
        moveRelativeSync(Position(0, HOMING_ALREADY_TRIGGERED_RETRACTION_MM));
    }

    stepUntilTrueSync(GantryDirection::Y_NEGATIVE, &Gantry::isLimitSwitchYTriggered);

    _currentPosition.setPosition(0, 0);
    _isHomed = true;
    setMaxSpeed(MAX_SPEED);
}

void Gantry::stepUntilTrueSync(GantryDirection direction, bool (Gantry::* fct)()) {
    resetSpeedAndAcceleration();

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

bool Gantry::moveRelativeSync(Position delta, bool validateInput) {
    bool succeeded = moveRelativeAsync(delta, validateInput);
    runWhileTrueSync(&Gantry::isRunning);
    return succeeded;
}

bool Gantry::moveRelativeAsync(Position delta, bool validateInput) {
    Position positionToMoveTo = _currentPosition.add(delta);
    if (validateInput && (!_isHomed || !validatePosition(positionToMoveTo))) {
        return false;
    }

    double scaledX = delta.getX() * STEPS_PER_MM_X;
    double scaledY = delta.getY() * STEPS_PER_MM_Y;

    long leftMotorSteps = scaledY - scaledX;
    long rightMotorSteps = scaledX + scaledY;

    float leftStepperSpeed = _currentMaxSpeed;
    float rightStepperSpeed = _currentMaxSpeed;
    float leftStepperAcceleration = ACCELERATION;
    float rightStepperAcceleration = ACCELERATION;

    long absLeftMotorSteps = abs(leftMotorSteps);
    long absRightMotorSteps = abs(rightMotorSteps);

    if (absLeftMotorSteps > absRightMotorSteps) {
        rightStepperSpeed = (_currentMaxSpeed * absRightMotorSteps) / absLeftMotorSteps;
        rightStepperAcceleration = (ACCELERATION * absRightMotorSteps) / absLeftMotorSteps;
    }
    else {
        leftStepperSpeed = (_currentMaxSpeed * absLeftMotorSteps) / absRightMotorSteps;
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

bool Gantry::moveToPositionSync(Position position) {
    bool succeeded = moveToPositionAsync(position);
    runWhileTrueSync(&Gantry::isRunning);
    return succeeded;
}

bool Gantry::moveToPositionAsync(Position position) {
    Position delta = position.subtract(_currentPosition);
    if (_isDraggingPiece) {  //apply overflow to adjust for magnet dragging behind
        Position overflow = position.calculateOverflow(delta, TILE_MOVING_OVERFLOW);
        position = position.add(overflow);
        _currentOverflow = overflow;
        delta = position.subtract(_currentPosition);
    }

    return moveRelativeAsync(delta);
}

bool Gantry::moveToTileSync(char column, int row, TileOffset offset) {
    bool succeeded = moveToTileAsync(column, row, offset);
    runWhileTrueSync(&Gantry::isRunning);
    if (_isDraggingPiece) {  //apply overflow to adjust for magnet dragging behind
        moveRelativeSync(Position(-_currentOverflow.getX(), -_currentOverflow.getY())); //revert overflow
        _currentOverflow = Position(0.0, 0.0);  //reset overflow as it is reverted now
    }
    return succeeded;
}

bool Gantry::moveToTileAsync(char column, int row, TileOffset offset) {
    int columnIndex = column - 'a';
    int rowIndex = row - 1;

    int x = GANTRY_X_OFFSET_TO_A1 + columnIndex * TILE_SIZE_MM;
    int y = GANTRY_Y_OFFSET_TO_A1 + rowIndex * TILE_SIZE_MM;

    Position newPosition = TileOffsetUtil::applyOffset(Position(x, y), offset);

    return moveToPositionAsync(newPosition);
}

void Gantry::initPieceGrabberServo() {
    _magnetLiftServo.attach(MAGNET_SERVO_PIN);
    releasePiece();
}

void Gantry::grabPiece() {
    _magnetLiftServo.write(MAGNET_SERVO_POSITION_UP);
    _isDraggingPiece = true;
}

void Gantry::releasePiece() {
    _magnetLiftServo.write(MAGNET_SERVO_POSITION_DOWN);
    _isDraggingPiece = false;
}

void Gantry::resetSpeedAndAcceleration() {
    setMaxSpeed(_currentMaxSpeed);
    setAcceleration(ACCELERATION);
}

void Gantry::stopInstantly() {
    _leftStepper.setCurrentPosition(0);
    _rightStepper.setCurrentPosition(0);
    _isHomed = false;   //not homed anymore because movement was suddenly interrupted/stopped
    _currentPosition.setPosition(NAN, NAN);
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
    _currentMaxSpeed = maxSpeed;
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
    return isRightStepperRunning() || isLeftStepperRunning();
}

bool Gantry::isLeftStepperRunning() {
    return _leftStepper.speed() != 0 && _leftStepper.isRunning();
}

bool Gantry::isRightStepperRunning() {
    return _rightStepper.speed() != 0 && _rightStepper.isRunning();
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
