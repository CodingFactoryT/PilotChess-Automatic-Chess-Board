#define SERIAL_BAUD_RATE 115200
#define SERIAL_READ_DELAY_MICROS 100

#define MAX_SPEED 3000.0f   //max 4000.0f, the library can't handle more
#define ACCELERATION 0.2f * MAX_SPEED
#define HOMING_SPEED 0.1f * MAX_SPEED

#define STEPPER_DRIVER_TYPE 1

#define MICRO_STEPPING 2    //set in hardware via jumpers
#define MOTOR_STEPS 200
#define STEPS_PER_REVOLUTION (MICRO_STEPPING * MOTOR_STEPS * 1.0f) 
#define STEPS_PER_MM_X 5.225f * MICRO_STEPPING
#define STEPS_PER_MM_Y 5.05f * MICRO_STEPPING

#define GANTRY_X_OFFSET_TO_A1 15
#define GANTRY_Y_OFFSET_TO_A1 0
#define TILE_SIZE_MM 42

#define GANTRY_MIN_POSITION_X 0
#define GANTRY_MIN_POSITION_Y 0
#define GANTRY_MAX_POSITION_X 330
#define GANTRY_MAX_POSITION_Y 300

#define MAGNET_SERVO_POSITION_UP 0
#define MAGNET_SERVO_POSITION_DOWN 100