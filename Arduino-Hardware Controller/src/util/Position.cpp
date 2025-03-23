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

Position Position::calculateOverflow(Position delta, double overflow) {
    double overflowX = 0.0;
    double overflowY = 0.0;

    double x = getX();
    double y = getY();

    if (delta.getX() != 0.0) {
        if (delta.getX() > 0 && x + overflow <= GANTRY_MAX_POSITION_X) overflowX = overflow;
        else if (delta.getX() < 0 && x - overflow >= GANTRY_MIN_POSITION_X) overflowX = -overflow;
    }

    if (delta.getY() != 0.0) {
        if (delta.getY() > 0 && y + overflow <= GANTRY_MAX_POSITION_Y) overflowY = overflow;
        else if (delta.getY() < 0 && y - overflow >= GANTRY_MIN_POSITION_Y) overflowY = -overflow;
    }

    return Position(overflowX, overflowY);
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

bool Position::equals(Position position) {
    return getX() == position.getX() && getY() == position.getY();
}