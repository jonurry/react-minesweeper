const flags = { none: 0, possible: 1, mine: 2 };

class Model {
  constructor(columns = 8, rows = 9, mines = 10) {
    this.initialiseMinefield(columns, rows, mines);
  }
  initialiseMinefield(columns = 8, rows = 9, mines = 10) {
    this.columns = columns;
    this.rows = rows;
    this.mines = mines;
    this.minefield = new Array(columns * rows).fill({
      value: null,
      flagged: flags.none
    });
  }
}

export default Model;
