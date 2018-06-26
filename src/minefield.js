import React from 'react';
import { FlagIcon, MineIcon } from './icons.js';
import { theme } from './theme.js';
import { FLAGS, GAME_STATUS } from './model.js';

const Minefield = props => {
  let minefield = [];
  let key = 0;
  let fontSize =
    typeof props.minefieldStyle === 'undefined'
      ? '100%'
      : props.minefieldStyle.fontSize;
  for (let item of props.minefield) {
    let content = '';
    if (item.revealed) {
      switch (item.value) {
        case 0:
          content = '';
          break;
        case '*':
          content = (
            <MineIcon
              className={`${props.classes.icon} ${
                props.trippedMineId === item.id ? 'pulse' : ''
              }`}
              style={{
                fontSize: fontSize,
                color:
                  props.gameStatus === GAME_STATUS.won
                    ? theme.palette.state.good
                    : theme.palette.state.bad
              }}
            />
          );
          break;

        default:
          content = item.value;
          break;
      }
    }
    let flag;
    switch (item.flag) {
      case FLAGS.mine:
        flag = (
          <FlagIcon
            className={props.classes.icon}
            style={{
              fontSize: fontSize
            }}
          />
        );
        break;
      case FLAGS.possible:
        flag = '?';
        break;
      case FLAGS.none:
      default:
        flag = '';
        break;
    }
    minefield.push(
      <div className="scene" key={key}>
        <div
          className={`card ${item.revealed ? 'reveal' : ''} delay-${
            item.delay
          }`}
          onClick={props.handleClick.bind(this, key)}
          onContextMenu={props.handleClick.bind(this, key)}
        >
          <div className="card-face front">{flag}</div>
          <div className="card-face back">{content}</div>
        </div>
      </div>
    );
    key++;
  }
  return minefield;
};

export default Minefield;
