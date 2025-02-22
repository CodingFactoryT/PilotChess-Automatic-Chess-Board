#define SERIAL_BAUD_RATE 115200
#define SERIAL_TIMEOUT 100

#define MAX_SPEED 4000.0f   //max 4000.0f, the library can't handle more
#define ACCELERATION 0.3f * MAX_SPEED
#define HOMING_SPEED 0.1f * MAX_SPEED

#define STEPPER_DRIVER_TYPE 1

#define MICRO_STEPPING 2    //set in hardware via jumpers
#define MOTOR_STEPS 200
#define STEPS_PER_REVOLUTION (MICRO_STEPPING * MOTOR_STEPS * 1.0f) 
#define STEPS_PER_MM 4.85f * MICRO_STEPPING

#define GANTRY_MIN_POSITION_X 0
#define GANTRY_MIN_POSITION_Y 0
#define GANTRY_MAX_POSITION_X 330
#define GANTRY_MAX_POSITION_Y 290