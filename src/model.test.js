import Model from './model.js';

describe('It should create and initialise the Minefield.', () => {
  test('It should create a new minefield with default dimensions and mines.', () => {
    const model = new Model();
    expect(model.columns).toBe(8);
    expect(model.rows).toBe(9);
    expect(model.mines).toBe(10);
    expect(model.minefield.length).toBe(72);
  });
  test('', () => {
    let t = 0;
  });
});
