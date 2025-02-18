#include "Gantry.h"

Gantry::Gantry() :
    _currentPosition(NAN, NAN),
    _targetPosition(NAN, NAN),
    _leftStepper(STEPPER_DRIVER_TYPE, LEFT_MOTOR_STEP_PIN, LEFT_MOTOR_DIR_PIN),
    _rightStepper(STEPPER_DRIVER_TYPE, RIGHT_MOTOR_STEP_PIN, RIGHT_MOTOR_DIR_PIN),
    _isHomed(false) {

    pinMode(LIMIT_SWITCH_X_PIN, INPUT_PULLUP);
    pinMode(LIMIT_SWITCH_Y_PIN, INPUT_PULLUP);

    _leftStepper.setEnablePin(ENABLE_PIN);
    _rightStepper.setEnablePin(ENABLE_PIN);

    _leftStepper.setMaxSpeed(MAX_SPEED);
    _rightStepper.setMaxSpeed(MAX_SPEED);
    _leftStepper.setPinsInverted(true, false, true);
    _leftStepper.setAcceleration(ACCELERATION);
    _rightStepper.setAcceleration(ACCELERATION);
    _rightStepper.setPinsInverted(true, false, true);

    setSteppersEnabled(true);

    home();
}

Position Gantry::getCurrentPosition() {
    return _currentPosition;
}

Position Gantry::getTargetPosition() {
    return _targetPosition;
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

void Gantry::home() {
    _leftStepper.setMaxSpeed(HOMING_SPEED);    //set speed to homing speed, which is slower than normal speed as it bumps into the limit switches
    _rightStepper.setMaxSpeed(HOMING_SPEED);

    moveUntilTrue(StepperDirection::COUNTERCLOCKWISE, StepperDirection::COUNTERCLOCKWISE, &Gantry::isLimitSwitchXTriggered); //=> gantry moves to the left (along the x-axis is negative direction, where the x limit switch is placed)

    _leftStepper.setMaxSpeed(HOMING_SPEED);    //set speed to homing speed, which is slower than normal speed as it bumps into the limit switches
    _rightStepper.setMaxSpeed(HOMING_SPEED);
    moveUntilTrue(StepperDirection::CLOCKWISE, StepperDirection::COUNTERCLOCKWISE, &Gantry::isLimitSwitchYTriggered); //=> gantry moves to the front (along the y-axis is negative direction, where the y limit switch is placed)

    _leftStepper.setCurrentPosition(0);     //reset steppers position
    _rightStepper.setCurrentPosition(0);

    _leftStepper.setMaxSpeed(MAX_SPEED);   //set speed back to normal
    _rightStepper.setMaxSpeed(MAX_SPEED);

    _isHomed = true;
}

void Gantry::update() {
    _leftStepper.run();
    _rightStepper.run();
}

void Gantry::moveToPosition(double x, double y) {
    _leftStepper.moveTo(STEPS_PER_MM * 100);
    _rightStepper.moveTo(STEPS_PER_MM * 100);
}

bool Gantry::isLimitSwitchXTriggered() {
    return digitalRead(LIMIT_SWITCH_X_PIN);
}

bool Gantry::isLimitSwitchYTriggered() {
    return digitalRead(LIMIT_SWITCH_Y_PIN);
}

void Gantry::moveUntilTrue(StepperDirection leftStepperDirection, StepperDirection rightStepperDirection, bool (Gantry::* func)()) {
    int leftStepperSign = leftStepperDirection == StepperDirection::CLOCKWISE ? 1 : -1;
    int rightStepperSign = rightStepperDirection == StepperDirection::CLOCKWISE ? 1 : -1;

    _leftStepper.moveTo(leftStepperSign * 1000000 * STEPS_PER_REVOLUTION);    //move left stepper infinitely in the given direction, including initial acceleration
    _rightStepper.moveTo(rightStepperSign * 1000000 * STEPS_PER_REVOLUTION);   //move right stepper infinitely in the given direction, including initial acceleration

    while (!(this->*func)()) {
        _leftStepper.run();
        _rightStepper.run();
    }


    // Set target position to current position to clear any pending moveTo
    _leftStepper.moveTo(_leftStepper.currentPosition());
    _rightStepper.moveTo(_rightStepper.currentPosition());

    // Set acceleration to zero temporarily to avoid unwanted movement
    _leftStepper.setAcceleration(0);
    _rightStepper.setAcceleration(0);

    // Set speed to zero to ensure no unintended motion occurs
    _leftStepper.setMaxSpeed(0);
    _rightStepper.setMaxSpeed(0);

    // Delay to let motors settle
    delay(1000);

    // After the delay, reset the acceleration and max speed
    _leftStepper.setAcceleration(ACCELERATION);
    _rightStepper.setAcceleration(ACCELERATION);
    _leftStepper.setMaxSpeed(MAX_SPEED);
    _rightStepper.setMaxSpeed(MAX_SPEED);

    // Ensure the motors are set to the correct target position (which should be the current position)
    _leftStepper.moveTo(_leftStepper.currentPosition());
    _rightStepper.moveTo(_rightStepper.currentPosition());
}