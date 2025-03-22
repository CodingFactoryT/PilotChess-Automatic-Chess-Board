#include "./util/Position.h"
#include "../config.h"

enum TileOffset {
  SOUTH_WEST = 1,
  SOUTH = 2,
  SOUTH_EAST = 3,
  WEST = 4,
  CENTER = 5,
  EAST = 6,
  NORTH_WEST = 7,
  NORTH = 8,
  NORTH_EAST = 9
};

namespace TileOffsetUtil {
  Position applyOffset(Position position, TileOffset offset);
}