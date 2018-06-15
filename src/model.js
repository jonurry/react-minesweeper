export const FLAGS = { none: 0, mine: 1, possible: 2 };

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // The minimum and maximum are inclusive
};

function placeMinesRandomlyInMinefield() {
  const upperBound = this.spaces - 1;
  for (let i = 0; i < this.mines; i++) {
    let position;
    do {
      position = getRandomIntInclusive(0, upperBound);
    } while (this.minefield[position].value === 1);
    this.minefield[position].value = 1;
  }
}

class Model {
  constructor(spaces, mines) {
    this.placeMinesRandomlyInMinefield = placeMinesRandomlyInMinefield.bind(
      this
    );
    this.initialiseMinefield(spaces, mines);
  }
  cycleFlag(position) {
    // if the position is invalid return FLAGS.none
    if (position < 0 || position >= this.spaces) {
      return FLAGS.none;
    }
    // cycle through flags
    // the enumeration is in the order that the flags cycle through
    // so adding one will cycle through the flags in the correct order
    // once upper bound is reached reset to beginning
    let flag = this.minefield[position].flag + 1;
    if (flag > FLAGS.possible) {
      flag = FLAGS.none;
    }
    this.minefield[position].flag = flag;
    // return the new flag at the given position
    return flag;
  }
  getFlag(position) {
    // if the position is invalid return no flag
    if (position < 0 || position >= this.minefield.length) {
      return FLAGS.none;
    }
    // return the flag at the given position
    return this.minefield[position].flag;
  }
  initialiseMinefield(spaces = 72, mines = 10) {
    // number of spaces should be at least 72
    // number of spaces should be exactly divisible by 72
    //   this is so that all rows are full at all screen sizes
    // number of mines should not exceed 50% of the available space

    // round the available space to the nearest factor of 72
    const divisibleBy = 72;
    if (spaces < 72) {
      spaces = 72;
    }
    this.spaces = Math.ceil(spaces / divisibleBy) * divisibleBy;
    const maxMines = this.spaces / 2;

    if (mines > maxMines) {
      this.mines = maxMines;
    } else if (mines < 10) {
      this.mines = 10;
    } else {
      this.mines = mines;
    }
    this.minefield = new Array(this.spaces).fill().map(u => ({
      value: 0,
      flag: FLAGS.none
    }));
    this.placeMinesRandomlyInMinefield();
  }
}

// iterate over Model using a generator
Model.prototype[Symbol.iterator] = function*() {
  for (let item of this.minefield) {
    yield item;
  }
};

export default Model;
