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
import Timer from './timer.js';
import { FlagIcon, MineIcon, HappyIcon, LostIcon, WonIcon } from './icons.js';
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

class App extends Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.model = new Model();
    this.state = {
      difficulty: 'easy',
      minefield: this.model.minefield.slice(),
      mines: 10,
      minesToBeFound: 10,
      time: null
    };
    this.timer = React.createRef();
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
    this.timer.current.resetTimer();
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
              this.timer.current.stopTimer();
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
      this.timer.current.resetTimer();
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
                color="inherit"
                variant="subheading"
              >
                <Badge
                  className={this.classes.padding}
                  badgeContent={this.state.minesToBeFound}
                  color="secondary"
                >
                  Mines
                </Badge>
              </Typography>
              <Timer
                time={this.state.time}
                classes={this.classes}
                ref={this.timer}
              />
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
    this.timer.current.resetTimer();
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
    this.timer.current.resetTimer();
    this.timer.current.startTimer();
    this.model.gameStatus = GAME_STATUS.started;
  };
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
