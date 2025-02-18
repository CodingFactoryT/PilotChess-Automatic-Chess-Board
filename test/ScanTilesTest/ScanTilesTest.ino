#define TILE_MATRIX_COL_SELECT_A_PIN 4
#define TILE_MATRIX_COL_SELECT_B_PIN 7
#define TILE_MATRIX_COL_SELECT_C_PIN 12
#define TILE_MATRIX_COL_SELECT_ENABLE_PIN 13
#define TILE_MATRIX_ROW_SELECT_A_PIN A0
#define TILE_MATRIX_ROW_SELECT_B_PIN A1
#define TILE_MATRIX_ROW_SELECT_C_PIN A2
#define TILE_MATRIX_DATA_PIN A3

void setup() {
  Serial.begin(9600);
  pinMode(TILE_MATRIX_COL_SELECT_A_PIN, OUTPUT);
  pinMode(TILE_MATRIX_COL_SELECT_B_PIN, OUTPUT);
  pinMode(TILE_MATRIX_COL_SELECT_C_PIN, OUTPUT);
  pinMode(TILE_MATRIX_COL_SELECT_ENABLE_PIN, OUTPUT);
  pinMode(TILE_MATRIX_ROW_SELECT_A_PIN, OUTPUT);
  pinMode(TILE_MATRIX_ROW_SELECT_B_PIN, OUTPUT);
  pinMode(TILE_MATRIX_ROW_SELECT_C_PIN, OUTPUT);
  pinMode(TILE_MATRIX_DATA_PIN, INPUT_PULLUP);
}
bool scanArrayA[] = {true, false, false, true, false, true, false, true};

void loop() {
  digitalWrite(TILE_MATRIX_COL_SELECT_ENABLE_PIN, LOW); //activate
  delay(10);
  byte readings[8]{0};
  for(int row = 0; row <= 7; row++) {
    boolean isRowSelectAEnabled = row == 0 || row == 1 || row == 2 || row == 4; //results in: 1,1,1,0,1,0,0,0
    boolean isRowSelectBEnabled = row == 1 || row == 2 || row == 5 || row == 6; //results in: 0,1,1,0,0,1,1,0
    boolean isRowSelectCEnabled = row == 0 || row == 2 || row == 6 || row == 7; //results in: 1,0,1,0,0,0,1,1
    digitalWrite(TILE_MATRIX_ROW_SELECT_A_PIN, isRowSelectAEnabled);
    digitalWrite(TILE_MATRIX_ROW_SELECT_B_PIN, isRowSelectBEnabled);
    digitalWrite(TILE_MATRIX_ROW_SELECT_C_PIN, isRowSelectCEnabled);
    for(int col = 0; col <= 7; col++) {
      byte currentRowReading;
      boolean isColSelectAEnabled = col == 0 || col == 2 || col == 4 || col == 7; //results in: 1,0,1,0,1,0,0,1
      boolean isColSelectBEnabled = col == 2 || col == 3 || col == 6 || col == 7; //results in: 0,0,1,1,0,0,1,1
      boolean isColSelectCEnabled = col >= 4;                                     //results in: 0,0,0,0,1,1,1,1
      digitalWrite(TILE_MATRIX_COL_SELECT_A_PIN, isColSelectAEnabled);
      digitalWrite(TILE_MATRIX_COL_SELECT_B_PIN, isColSelectBEnabled);
      digitalWrite(TILE_MATRIX_COL_SELECT_C_PIN, isColSelectCEnabled);
      delayMicroseconds(100); //IMPORTANT, otherwise there are wrong readings

      boolean isTriggered = !digitalRead(TILE_MATRIX_DATA_PIN);  //inverted because it uses a pull-up resistor
      readings[row] |= (isTriggered << (7 - col)); //set the bit at the corresponding byte position
    }
    if(readings[row] < 10) {
      Serial.print("0");
    }
    Serial.print(readings[row], HEX);
  }
  Serial.println();
  digitalWrite(TILE_MATRIX_COL_SELECT_ENABLE_PIN, HIGH);  //deactivate to save power
}
