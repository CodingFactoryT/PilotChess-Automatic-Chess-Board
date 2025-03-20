#include "./util/Position.h"

Position::Position(double x, double y) {
    setPosition(x, y);
}

Position Position::add(Position position) {
    double posX = getX() + position.getX();
    double posY = getY() + position.getY();

    return Position(posX, posY);
}

Position Position::subtract(Position position) {
    double posX = getX() - position.getX();
    double posY = getY() - position.getY();

    return Position(posX, posY);
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
    setX(x);
    setY(y);
}

void Position::setPosition(Position position) {
    setX(position.getX());
    setY(position.getY());
}