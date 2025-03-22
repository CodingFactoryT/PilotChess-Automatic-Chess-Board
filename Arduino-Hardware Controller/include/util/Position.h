#pragma once
class Position {
private:
    double _x;
    double _y;

public:
    Position(double x, double y);
    Position add(Position position);
    Position subtract(Position position);
    double getX();
    double getY();
    void setX(double x);
    void setY(double x);
    void setPosition(double x, double y);
    void setPosition(Position position);
};