import React from 'react';
import { GAME_STATUS } from './model.js';
import { HappyIcon, LostIcon, WonIcon } from './icons.js';
import { theme } from './theme.js';

export default function Emoji(props) {
  switch (props.gameStatus) {
    case GAME_STATUS.won:
      return (
        <WonIcon
          className={props.classes.icon}
          style={{
            color: theme.palette.state.good,
            fontSize: '48px'
          }}
        />
      );
    case GAME_STATUS.lost:
      return (
        <LostIcon
          className={props.classes.icon}
          style={{
            color: theme.palette.state.bad,
            fontSize: '48px'
          }}
        />
      );
    case GAME_STATUS.initialised:
    case GAME_STATUS.started:
    default:
      return (
        <HappyIcon
          className={props.classes.icon}
          style={{
            color: theme.palette.primary.dark,
            fontSize: '48px'
          }}
        />
      );
  }
}
