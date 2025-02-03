#include "Position.h"

Position::Position(double x, double y) {
    setPosition(x, y);
}

double Position::getX() {
    return this->_x;
}

double Position::getY() {
    return this->_y;
}

void Position::setX(double x) {
    _x = x;
}

void Position::setY(double y) {
    _y = y;
}

void Position::setPosition(double x, double y) {
    this->setX(x);
    this->setY(y);
}