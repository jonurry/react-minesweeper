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
import { theme, styles, styleToolbarCentre } from './theme.js';
import Timer from './timer.js';
import Emoji from './emoji.js';
import Minefield from './minefield.js';
import Model, { FLAGS, GAME_STATUS } from './model.js';

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
    this.model.columns = columns;
    this.model.rows = rows;
    this.initialiseMinefield(columns * rows, this.state.mines, columns);
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
            this.timer.current.resetTimer();
            this.timer.current.startTimer();
          }
          if (!this.model.isRevealed(id)) {
            this.model.reveal(id);
            let minesToBeFound = this.state.minesToBeFound;
            if (
              this.model.gameStatus === GAME_STATUS.won ||
              this.model.gameStatus === GAME_STATUS.lost
            ) {
              this.timer.current.stopTimer();
              minesToBeFound = 0;
            }
            this.setState({
              minefield: this.model.minefield.slice(),
              minesToBeFound
            });
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
    let difficulty = event.target.value;
    this.resetGame(difficulty);
  };

  initialiseMinefield = (spaces, mines, columns) => {
    this.model.initialiseMinefield(spaces, mines, columns);
    this.setState((state, props) => ({
      minefield: this.model.minefield.slice()
    }));
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <AppBar position="fixed">
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
              gameStatus={this.model.gameStatus}
            />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

  resetGame = difficulty => {
    let columns, mines, rows;
    this.timer.current.resetTimer();
    if (typeof difficulty !== 'string') {
      difficulty = this.state.difficulty;
    }
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
    this.model.columns = columns;
    this.model.rows = rows;
    this.initialiseMinefield(rows * columns, mines, columns);
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
        // eslint-disable-next-line
        ['--columns']: columns,
        // eslint-disable-next-line
        ['--content-width']: contentWidth,
        // eslint-disable-next-line
        ['--gutter']: gutter,
        fontSize: fontSize
      }
    });
  };
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
