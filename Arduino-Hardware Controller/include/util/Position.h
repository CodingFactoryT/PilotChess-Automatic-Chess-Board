
class Position {
private:
    double _x;
    double _y;

public:
    Position(double x, double y);
    double getX();
    double getY();
    void setX(double x);
    void setY(double x);
    void setPosition(double x, double y);
};