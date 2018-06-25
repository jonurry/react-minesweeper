export const FLAGS = { none: 0, mine: 1, possible: 2 };
export const GAME_STATUS = { initialised: 0, started: 1, won: 2, lost: 3 };

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
    } while (this.minefield[position].value === '*');
    this.minefield[position].value = '*';
  }
}

function revealMines() {
  for (let item of this.minefield) {
    if (item.value === '*') {
      item.revealed = true;
    }
  }
}

class Model {
  constructor(spaces, mines, columns) {
    this.placeMinesRandomlyInMinefield = placeMinesRandomlyInMinefield.bind(
      this
    );
    this.revealMines = revealMines.bind(this);
    this.initialiseMinefield(spaces, mines, columns);
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

  getContent(position) {
    // if the position is invalid return 0
    if (position < 0 || position >= this.minefield.length) {
      return 0;
    }
    // return the content at the given position
    return this.minefield[position].value;
  }

  getFlag(position) {
    // if the position is invalid return no flag
    if (position < 0 || position >= this.minefield.length) {
      return FLAGS.none;
    }
    // return the flag at the given position
    return this.minefield[position].flag;
  }

  initialiseMinefield(spaces = 72, mines = 10, columns = 8) {
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
    this.spacesLeftToReveal = this.spaces - this.mines;
    this.minefield = new Array(this.spaces).fill().map((curr, index) => ({
      flag: FLAGS.none,
      id: index,
      revealed: false,
      value: 0
    }));
    this.columns = columns;
    this.gameStatus = GAME_STATUS.initialised;
    this.trippedMineId = -1;
    this.placeMinesRandomlyInMinefield();
    this.populateNumberOfNearestMines();
  }

  isRevealed(position) {
    // if the position is invalid return false
    if (position < 0 || position >= this.minefield.length) {
      return false;
    }
    // return whether the content is revealed or not at the given position
    return this.minefield[position].revealed;
  }

  populateNumberOfNearestMines() {
    // work out the number of nearest mines for each minefield location
    let columns = this.columns;
    const countMine = pos => {
      // if there is a mine at the specified position then return 1
      // otherwise return 0
      if (this.getContent(pos) === '*') {
        return 1;
      } else {
        return 0;
      }
    };
    this.minefield.map((x, i) => {
      if (this.getContent(i) !== '*') {
        let mines = 0;
        // is the current position on the left of the minefield?
        let left = i % columns === 0;
        // is the current position on the right of the minefield?
        let right = (i + 1) % columns === 0;
        let nw = left ? 0 : countMine(i - columns - 1);
        let n = countMine(i - columns);
        let ne = right ? 0 : countMine(i - columns + 1);
        let w = left ? 0 : countMine(i - 1);
        let e = right ? 0 : countMine(i + 1);
        let sw = left ? 0 : countMine(i + columns - 1);
        let s = countMine(i + columns);
        let se = right ? 0 : countMine(i + columns + 1);
        // prettier-ignore
        let neighbours = [
          nw, n, ne,
           w, 0, e,
          sw, s, se
        ];
        mines = neighbours.reduce((acc, curr) => acc + curr);
        x.value = mines;
      }
      return x;
    });
  }

  reveal(position) {
    // if the position is invalid, or the game is over, return 0
    if (
      position < 0 ||
      position >= this.minefield.length ||
      this.gameStatus === GAME_STATUS.won ||
      this.gameStatus === GAME_STATUS.lost
    ) {
      return 0;
    }
    // mark content as revealed
    this.minefield[position].revealed = true;
    this.spacesLeftToReveal--;
    // store the content of the revealed position
    let content = this.minefield[position].value;
    // Start the game if it isn't already started
    if (this.gameStatus === GAME_STATUS.initialised) {
      this.gameStatus = GAME_STATUS.started;
    }
    // if a mine has been revealed then it's game over
    if (content === '*') {
      this.gameStatus = GAME_STATUS.lost;
      this.trippedMineId = position;
      this.revealMines();
    }
    // if all spaces are revealed except for mines then the game is won
    else if (this.spacesLeftToReveal === 0) {
      this.gameStatus = GAME_STATUS.won;
    }
    // return the content at the given position
    return content;
  }
}

// iterate over Model using a generator
Model.prototype[Symbol.iterator] = function*() {
  for (let item of this.minefield) {
    yield item;
  }
};

export default Model;
