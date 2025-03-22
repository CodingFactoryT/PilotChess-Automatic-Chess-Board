#include "./util/TileOffset.h"

namespace TileOffsetUtil {
  Position applyOffset(Position position, TileOffset offset) {
    double x = position.getX();
    double y = position.getY();

    const double half = TILE_SIZE_MM / 2;

    switch (offset)
    {
    case SOUTH_WEST:  x -= half; y -= half; break;
    case SOUTH:                  y -= half; break;
    case SOUTH_EAST:  x += half; y -= half; break;
    case WEST:        x -= half;            break;
    case EAST:        x += half;            break;
    case NORTH_WEST:  x -= half; y += half; break;
    case NORTH:                  y += half; break;
    case NORTH_EAST:  x += half; y += half; break;
    default: break;
    }

    return Position(x, y);
  }
}