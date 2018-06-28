import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import App from './App';

it('renders without crashing (ReactDOM)', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing (ReactRenderer)', () => {
  const component = renderer.create(<App />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders easy difficulty layout', () => {
  const component = renderer.create(<App difficulty="easy" />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders medium difficulty layout', () => {
  const component = renderer.create(<App difficulty="medium" />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders hard difficulty layout', () => {
  const component = renderer.create(<App difficulty="hard" />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
