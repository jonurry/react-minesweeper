import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Emoji from './emoji.js';
import { GAME_STATUS } from './model.js';

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

test('render won, happy and lost emoji', () => {
  const won = shallow(
    <Emoji gameStatus={GAME_STATUS.won} classes={{ icon: null }} />
  );
  expect(won).toMatchSnapshot();
});
