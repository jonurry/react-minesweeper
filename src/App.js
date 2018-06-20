import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import Model, { FLAGS, GAME_STATUS } from './model.js';

// define theme colours
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#9be7ff',
      main: '#64b5f6',
      dark: '#2286c3',
      contrastText: '#263238'
    },
    secondary: {
      light: '#ffe97d',
      main: '#ffb74d',
      dark: '#c88719',
      contrastText: '#263238'
    },
    state: {
      bad: '#e57373',
      good: '#81c784'
    }
  }
});

// override theme styling
const styles = theme => ({
  margin: {
    margin: theme.spacing.unit * 2
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`
  }
});

const styleToolbarCentre = {
  margin: 'auto'
};

function FlagIcon(props) {
  return (
    <SvgIcon {...props}>
      <g id="Bounding_Boxes">
        <g id="ui_x5F_spec_x5F_header_copy_3" display="none" />
        <path fill="none" d="M0,0h24v24H0V0z" />
      </g>
      <g id="Duotone">
        <g id="ui_x5F_spec_x5F_header_copy_2" display="none" />
        <g>
          <polygon
            opacity="0.3"
            points="12.36,6 7,6 7,12 14.24,12 14.64,14 18,14 18,8 12.76,8 		"
          />
          <path d="M14.4,6L14,4H5v17h2v-7h5.6l0.4,2h7V6H14.4z M18,14h-3.36l-0.4-2H7V6h5.36l0.4,2H18V14z" />
        </g>
      </g>
    </SvgIcon>
  );
}

function MineIcon(props) {
  return (
    <SvgIcon {...props}>
      <g id="Bounding_Boxes">
        <g id="ui_x5F_spec_x5F_header_copy_3" />
        <path fill="none" d="M0,0h24v24H0V0z" />
      </g>
      <g id="Duotone">
        <g id="ui_x5F_spec_x5F_header_copy_2" />
        <g>
          <path
            fillOpacity="0.3"
            d="M18,9.52V6h-3.52L12,3.52L9.52,6H6v3.52L3.52,12L6,14.48V18h3.52L12,20.48L14.48,18H18v-3.52L20.48,12
            L18,9.52z M12,18c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S15.31,18,12,18z"
          />
          <path
            d="M20,8.69V4h-4.69L12,0.69L8.69,4H4v4.69L0.69,12L4,15.31V20h4.69L12,23.31L15.31,20H20v-4.69L23.31,12L20,8.69z M18,14.48
            V18h-3.52L12,20.48L9.52,18H6v-3.52L3.52,12L6,9.52V6h3.52L12,3.52L14.48,6H18v3.52L20.48,12L18,14.48z"
          />
          <path
            d="M12,6c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6S15.31,6,12,6z M12,16c-2.21,0-4-1.79-4-4s1.79-4,4-4c2.21,0,4,1.79,4,4
            S14.21,16,12,16z"
          />
          <circle cx="12" cy="12" r="2.5" />
        </g>
      </g>
    </SvgIcon>
  );
}

function HappyIcon(props) {
  return (
    <SvgIcon {...props}>
      <g id="Bounding_Boxes">
        <g id="ui_x5F_spec_x5F_header_copy_2" />
        <path fill="none" d="M0,0h24v24H0V0z" />
      </g>
      <g id="Duotone">
        <g id="ui_x5F_spec_x5F_header_copy_3" />
        <g>
          <path
            opacity="0.3"
            d="M12,4c-4.42,0-8,3.58-8,8c0,4.42,3.58,8,8,8s8-3.58,8-8C20,7.58,16.42,4,12,4z M15.5,8
			C16.33,8,17,8.67,17,9.5S16.33,11,15.5,11S14,10.33,14,9.5S14.67,8,15.5,8z M8.5,8C9.33,8,10,8.67,10,9.5S9.33,11,8.5,11
			S7,10.33,7,9.5S7.67,8,8.5,8z M12,17.5c-2.33,0-4.32-1.45-5.12-3.5h1.67c0.7,1.19,1.97,2,3.45,2s2.76-0.81,3.45-2h1.67
			C16.32,16.05,14.33,17.5,12,17.5z"
          />
          <circle cx="15.5" cy="9.5" r="1.5" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="M12,16c-1.48,0-2.75-0.81-3.45-2H6.88c0.8,2.05,2.79,3.5,5.12,3.5s4.32-1.45,5.12-3.5h-1.67C14.76,15.19,13.48,16,12,16z" />
          <path
            d="M11.99,2C6.47,2,2,6.48,2,12c0,5.52,4.47,10,9.99,10C17.52,22,22,17.52,22,12C22,6.48,17.52,2,11.99,2z M12,20
			c-4.42,0-8-3.58-8-8c0-4.42,3.58-8,8-8s8,3.58,8,8C20,16.42,16.42,20,12,20z"
          />
        </g>
      </g>
    </SvgIcon>
  );
}

function LostIcon(props) {
  return (
    <SvgIcon {...props}>
      <g id="Bounding_Boxes">
        <g id="ui_x5F_spec_x5F_header_copy_2" />
        <path fill="none" d="M0,0h24v24H0V0z" />
      </g>
      <g id="Duotone">
        <g id="ui_x5F_spec_x5F_header_copy" />
        <g>
          <path
            opacity="0.3"
            d="M12,4c-4.42,0-8,3.58-8,8c0,4.42,3.58,8,8,8s8-3.58,8-8C20,7.58,16.42,4,12,4z M6.76,8.82l1.06-1.06
			l1.06,1.06l1.06-1.06L11,8.82L9.94,9.88L11,10.94L9.94,12l-1.06-1.06L7.82,12l-1.06-1.06l1.06-1.06L6.76,8.82z M6.89,17
			c0.8-2.04,2.78-3.5,5.11-3.5s4.31,1.46,5.11,3.5H6.89z M17.24,10.94L16.18,12l-1.06-1.06L14.06,12L13,10.94l1.06-1.06L13,8.82
			l1.06-1.06l1.06,1.06l1.06-1.06l1.06,1.06l-1.06,1.06L17.24,10.94z"
          />
          <path d="M12,13.5c-2.33,0-4.31,1.46-5.11,3.5h10.22C16.31,14.96,14.33,13.5,12,13.5z" />
          <polygon
            points="7.82,12 8.88,10.94 9.94,12 11,10.94 9.94,9.88 11,8.82 9.94,7.76 8.88,8.82 7.82,7.76 6.76,8.82 7.82,9.88 
			6.76,10.94 		"
          />
          <path
            d="M11.99,2C6.47,2,2,6.47,2,12c0,5.53,4.47,10,9.99,10S22,17.53,22,12C22,6.47,17.52,2,11.99,2z M12,20c-4.42,0-8-3.58-8-8
			c0-4.42,3.58-8,8-8s8,3.58,8,8C20,16.42,16.42,20,12,20z"
          />
          <polygon
            points="16.18,7.76 15.12,8.82 14.06,7.76 13,8.82 14.06,9.88 13,10.94 14.06,12 15.12,10.94 16.18,12 17.24,10.94 
			16.18,9.88 17.24,8.82 		"
          />
        </g>
      </g>
    </SvgIcon>
  );
}

function WonIcon(props) {
  return (
    <SvgIcon {...props}>
      <g id="Bounding_Boxes">
        <g id="ui_x5F_spec_x5F_header_copy_2" />
        <path fill="none" d="M0,0h24v24H0V0z" />
      </g>
      <g id="Duotone">
        <g id="ui_x5F_spec_x5F_header_copy" />
        <g>
          <path
            opacity="0.3"
            d="M12,4c-4.42,0-8,3.58-8,8c0,4.42,3.58,8,8,8s8-3.58,8-8C20,7.58,16.42,4,12,4z M8.88,7.82L11,9.94L9.94,11
          L8.88,9.94L7.82,11L6.76,9.94L8.88,7.82z M12,17.5c-2.33,0-4.31-1.46-5.11-3.5h10.22C16.31,16.04,14.33,17.5,12,17.5z M16.18,11
          l-1.06-1.06L14.06,11L13,9.94l2.12-2.12l2.12,2.12L16.18,11z"
          />
          <polygon points="8.88,9.94 9.94,11 11,9.94 8.88,7.82 6.76,9.94 7.82,11 		" />
          <polygon points="13,9.94 14.06,11 15.12,9.94 16.18,11 17.24,9.94 15.12,7.82 		" />
          <path
            d="M11.99,2C6.47,2,2,6.47,2,12c0,5.53,4.47,10,9.99,10S22,17.53,22,12C22,6.47,17.52,2,11.99,2z M12,20c-4.42,0-8-3.58-8-8
          c0-4.42,3.58-8,8-8s8,3.58,8,8C20,16.42,16.42,20,12,20z"
          />
          <path d="M12,17.5c2.33,0,4.31-1.46,5.11-3.5H6.89C7.69,16.04,9.67,17.5,12,17.5z" />
        </g>
      </g>
    </SvgIcon>
  );
}

const Emoji = props => {
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
};

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
                  props.trippedMineId === item.id
                    ? theme.palette.state.bad
                    : theme.palette.secondary.main
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
          className={`card ${item.revealed ? 'reveal' : ''}`}
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

const Timer = props => {
  return (
    <Typography
      className={props.classes.margin}
      variant="headline"
      color="inherit"
    >
      {props.time ? props.time : '0:00'}
    </Typography>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.model = new Model();
    this.resetTimer();
    this.state = {
      difficulty: 'easy',
      minefield: this.model.minefield.slice(),
      mines: 10,
      minesToBeFound: 10,
      time: null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount = () => {
    // set the size of the minefield
    let columns, rows;
    ({ columns, rows } = this.getMinefieldDimensions(this.state.difficulty));
    this.setState({ columns, rows });
    this.setColumnsInCSSGrid(columns);
    this.initialiseMinefield(columns * rows, this.state.mines);
    this.model.columns = columns;
    this.model.rows = rows;
  };

  componentWillUnmount = () => {
    this.resetTimer();
  };

  getMinefieldDimensions = difficulty => {
    // get the screen width
    const width = window.innerWidth;
    let columns = 8; // default to 8 columns in easy mode
    // work out the optimum number for columns for the screen width
    if (difficulty !== 'easy') {
      columns = this.getNumberOfColumnsForMinefield(width);
    }
    // work out the number of rows required for the chosen difficulty
    const rows = this.getNumberOfRowsForMinefield(columns, difficulty);
    return { columns, rows };
  };

  getNumberOfColumnsForMinefield = width => {
    // return the optimum number for columns for the screen width
    if (width <= 480) {
      return 8;
    }
    if (width <= 768) {
      return 12;
    }
    if (width <= 1024) {
      return 18;
    }
    return 24;
  };

  getNumberOfRowsForMinefield = (columns, difficulty) => {
    // there are 3 difficulty levels
    // each has a given number of total grid squares
    // from that, the number of rows can be derived
    switch (difficulty) {
      default:
      case 'easy':
        return 72 / columns;
      case 'medium':
        return 288 / columns;
      case 'hard':
        return 504 / columns;
    }
  };

  getElapsedTime = () => {
    let timeDiff = new Date().getTime() - this.startTime;
    let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  handleClick(id, e) {
    e.preventDefault();
    // if the game is initialised or started then process click
    if (
      this.model.gameStatus === GAME_STATUS.initialised ||
      this.model.gameStatus === GAME_STATUS.started
    ) {
      switch (e.type) {
        case 'click':
          if (this.model.gameStatus === GAME_STATUS.initialised) {
            this.startGame();
          }
          if (!this.model.isRevealed(id)) {
            const content = this.model.reveal(id);
            if (content === '*') {
              // clicked on a mine - game over
              this.stopTimer();
            }
            this.setState({ minefield: this.model.minefield.slice() });
          }
          break;
        case 'contextmenu':
          let minesToBeFound = this.state.minesToBeFound;
          const flag = this.model.cycleFlag(id);
          if (flag === FLAGS.mine) {
            minesToBeFound--;
          }
          if (flag === FLAGS.possible) {
            minesToBeFound++;
          }
          this.setState({
            minefield: this.model.minefield.slice(),
            minesToBeFound
          });
          break;
        default:
          break;
      }
    }
  }

  handleChangeDifficulty = event => {
    let columns, mines, rows;
    let difficulty = event.target.value;
    if (difficulty !== this.state.difficulty) {
      this.resetTimer();
      switch (difficulty) {
        default:
        case 'easy':
          mines = 10;
          break;
        case 'medium':
          mines = 40;
          break;
        case 'hard':
          mines = 100;
          break;
      }
      ({ columns, rows } = this.getMinefieldDimensions(difficulty));
      this.setColumnsInCSSGrid(columns);
      this.setState({
        columns,
        difficulty,
        mines: mines,
        minesToBeFound: mines,
        rows
      });
      this.initialiseMinefield(rows * columns, mines);
      this.model.columns = columns;
      this.model.rows = rows;
    }
  };

  initialiseMinefield = (spaces, mines) => {
    this.model.initialiseMinefield(spaces, mines);
    this.setState((state, props) => ({
      minefield: this.model.minefield.slice()
    }));
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <AppBar position="static">
            <Toolbar disableGutters={true} style={styleToolbarCentre}>
              <Select
                className={this.classes.margin}
                color=""
                value={this.state.difficulty}
                onChange={this.handleChangeDifficulty}
                inputProps={{
                  name: 'difficulty',
                  id: 'select-difficulty'
                }}
              >
                <MenuItem value={'easy'}>Easy</MenuItem>
                <MenuItem value={'medium'}>Medium</MenuItem>
                <MenuItem value={'hard'}>Hard</MenuItem>
              </Select>
              <Button
                variant="fab"
                color="default"
                aria-label="reset"
                onClick={this.resetGame}
              >
                <Emoji
                  classes={this.classes}
                  gameStatus={this.model.gameStatus}
                />
              </Button>
              <Typography
                className={this.classes.margin}
                variant="subheading"
                color="inherit"
              >
                <Badge
                  className={this.classes.padding}
                  badgeContent={this.state.minesToBeFound}
                  color="secondary"
                >
                  Mines
                </Badge>
              </Typography>
              <Timer time={this.state.time} classes={this.classes} />
            </Toolbar>
          </AppBar>
          <div
            className={`minefield ${this.state.difficulty}`}
            style={this.state.minefieldStyle}
          >
            <Minefield
              classes={this.classes}
              minefield={this.state.minefield}
              minefieldStyle={this.state.minefieldStyle}
              handleClick={this.handleClick}
              trippedMineId={this.model.trippedMineId}
            />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

  resetGame = () => {
    let columns, rows;
    this.resetTimer();
    ({ columns, rows } = this.getMinefieldDimensions(this.state.difficulty));
    if (columns !== this.state.columns || rows !== this.state.rows) {
      this.setColumnsInCSSGrid(columns);
      this.setState({
        columns,
        rows
      });
      this.model.columns = columns;
      this.model.rows = rows;
    }
    this.initialiseMinefield(rows * columns, this.state.mines);
  };

  resetTimer = () => {
    if (this.timerId !== 0) {
      clearInterval(this.timerId);
    }
    this.startTime = null;
    this.timerId = 0;
    this.setState({ time: null });
  };

  setColumnsInCSSGrid = columns => {
    // available screen height - toolbar height
    const height = window.innerHeight - 64;
    // available screen width
    const width = window.innerWidth;
    const fontRatio = height > width ? 0.5 : 0.6;
    const fontSize = `calc(var(--content-width) / var(--columns) * ${fontRatio})`;
    let contentWidth;
    let gutter;
    if (columns === 8) {
      // easy mode with 8 columns so limit width so that whole minefield is visible on screen
      contentWidth = height > width ? 'calc(96vmin)' : 'calc(80vmin - 64px)';
      // font size proportional to row height
      gutter = '1vh';
    } else {
      contentWidth = '96vw';
      gutter = '1vw';
    }
    this.setState({
      minefieldStyle: {
        ['--columns']: columns,
        ['--content-width']: contentWidth,
        ['--gutter']: gutter,
        fontSize: fontSize
      }
    });
  };

  startGame = () => {
    this.resetTimer();
    this.startTimer();
    this.model.gameStatus = GAME_STATUS.started;
  };

  startTimer = () => {
    this.startTime = new Date().getTime();
    this.timerId = setInterval(() => {
      this.setState({ time: this.getElapsedTime() });
    }, 1000);
  };

  stopTimer = () => {
    if (this.timerId !== 0) {
      clearInterval(this.timerId);
    }
  };

}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
