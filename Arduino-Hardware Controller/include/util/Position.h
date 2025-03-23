#pragma once
#include "Arduino.h"
#include "../config.h"

class Position {
private:
    double _x;
    double _y;

public:
    Position(double x, double y);
    Position add(Position position);
    Position subtract(Position position);
    Position calculateOverflow(Position delta, double overflow);
    double getX();
    double getY();
    void setX(double x);
    void setY(double x);
    void setPosition(double x, double y);
    void setPosition(Position position);
    bool equals(Position position);
};