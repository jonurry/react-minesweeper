import Model from './model.js';

// Easy:
//   dimensions: 8 columns - 9 rows
//   mines: 10
//   squares: 72

// Medium:
//   dimensions: 8 columns - 36 rows
//               12 columns - 24 rows
//               18 columns - 16 rows
//               24 columns - 12 rows
//   mines: 40
//   squares: 288

// Hard:
//   dimensions: 8 columns - 63 rows
//               12 columns - 42 rows
//               18 columns - 28 rows
//               24 columns - 21 rows
//   mines: 100
//   squares: 504

describe('It should create and initialise the Minefield.', () => {
  test('It should create a new minefield with default dimensions and mines.', () => {
    const spaces = 72;
    const model = new Model();
    expect(model.spaces).toBe(spaces);
    expect(model.mines).toBe(10);
    expect(model.minefield.length).toBe(spaces);
  });
  test('It should create a new minefield with specified dimensions and mines.', () => {
    const spaces = 288;
    const model = new Model(spaces, 50);
    expect(model.spaces).toBe(spaces);
    expect(model.mines).toBe(50);
    expect(model.minefield.length).toBe(spaces);
  });
});

describe('It should populate the minefield.', () => {
  test('The minefield should contain the default number of mines (Difficulty: Easy).', () => {
    const spaces = 72; // this is the default when not specified
    const mines = 10; // this is the default when not specified
    const model = new Model();
    let mineCounter = 0;
    for (let item of model) {
      if (item.value === 1) {
        mineCounter++;
      }
    }
    expect(mineCounter).toBe(mines);
    expect(spaces).toBe(model.spaces);
  });
  test('The minefield should contain the specified number of mines (Difficulty: Medium).', () => {
    const spaces = 288;
    const mines = 40;
    const model = new Model(spaces, mines);
    let mineCounter = 0;
    for (let item of model) {
      if (item.value === 1) {
        mineCounter++;
      }
    }
    expect(mineCounter).toBe(mines);
    expect(spaces).toBe(model.spaces);
  });
  test('The minefield should contain the specified number of mines (Difficulty: Hard).', () => {
    const spaces = 504;
    const mines = 100;
    const model = new Model(spaces, mines);
    let mineCounter = 0;
    for (let item of model) {
      if (item.value === 1) {
        mineCounter++;
      }
    }
    expect(mineCounter).toBe(mines);
    expect(spaces).toBe(model.spaces);
  });
  test('There should not be more mines than spaces.', () => {
    // Should never try to populate more than 50% of available spaces
    // In this test, maximum number of mines = spaces / 2 = 36
    const spaces = 72; // default
    const mines = 100; // try to add more mines than there are spaces in the minefield
    const maxMines = spaces / 2;

    const model = new Model(spaces, mines);
    let mineCounter = 0;
    for (let item of model) {
      if (item.value === 1) {
        mineCounter++;
      }
    }
    expect(mineCounter).not.toBe(mines);
    expect(mineCounter).toBe(maxMines);
  });
  test('The mines should never fill more than 50% of the available space.', () => {
    // Should never try to populate more than 50% of available spaces
    // In this test, maximum number of mines = spaces / 2 = 36
    const spaces = 72; // default
    const mines = 37; // try to add one more mine than the max allowed
    const maxMines = spaces / 2;

    const model = new Model(spaces, mines);
    let mineCounter = 0;
    for (let item of model) {
      if (item.value === 1) {
        mineCounter++;
      }
    }
    expect(mineCounter).not.toBe(mines);
    expect(mineCounter).toBe(maxMines);
  });
  test('It should not allow less than 72 spaces or 10 mines.', () => {
    const spaces = 71; // one less than the minimum
    const mines = 9; // one less than the minimum

    const model = new Model(spaces, mines);
    let mineCounter = 0;
    for (let item of model) {
      if (item.value === 1) {
        mineCounter++;
      }
    }
    expect(mineCounter).not.toBe(mines);
    expect(mineCounter).toBe(10); // this is the minimum number of mines
  });
  test('It should only allow spaces divisible by 72 to allow for good screen layouts.', () => {
    const spaces = 200; // not divisible by 72
    const mines = 35;

    const model = new Model(spaces, mines);
    let mineCounter = 0;
    for (let item of model) {
      if (item.value === 1) {
        mineCounter++;
      }
    }
    expect(mineCounter).toBe(mines);
    expect(model.spaces).toBe(216); // next highest number divisible by 72 compared to starting spaces of 200
  });
  test('It should position the mines randomly', () => {
    const spaces = 504;
    const mines = 100;
    const model1 = new Model(spaces, mines);
    const model2 = new Model(spaces, mines);
    let foundDifference = false;
    for (let i = 0; i < spaces; i++) {
      if (model1.minefield[i].value !== model2.minefield[i].value) {
        foundDifference = true;
        break;
      }
    }
    expect(model1.spaces).toBe(model2.spaces);
    expect(model1.mines).toBe(model2.mines);
    expect(model1.minefield).not.toEqual(model2.minefield);
    expect(foundDifference).toBeTruthy();
  });
});
