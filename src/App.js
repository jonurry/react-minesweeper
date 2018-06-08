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

const Minefield = props => {
  let minefield = [];
  let key = 0;
  for (let item of props.minefield) {
    minefield.push(<div key={key++}>{item}</div>);
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
    this.state = {
      difficulty: 'easy',
      minefield: [],
      mines: 10,
      minesToBeFound: 10,
      time: null
    };
    this.classes = props.classes;
    this.startTime = null;
    this.timerId = 0;
    this.columnRef = React.createRef();
  }

  componentDidMount = () => {
    // set the size of the minefield
    let columns, rows;
    ({ columns, rows } = this.getMinefieldDimensions(this.state.difficulty));
    this.setState({ columns, rows });
    this.setColumnsInCSSGrid(columns);
    this.initialiseMinefield();
  };

  componentWillUnmount = () => {
    this.cancelTimer();
  };

  cancelTimer = () => {
    if (this.timerId !== 0) {
      clearInterval(this.timerId);
      this.startTime = null;
      this.timerId = 0;
      this.setState({ time: null });
    }
  };

  getNumberOfColumnsForMinefield = width => {
    // return the optimum number for columns for the screen width
    if (width <= 320) {
      return 6;
    }
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
        break;
      case 'medium':
        return 288 / columns;
        break;
      case 'hard':
        return 504 / columns;
        break;
    }
  };

  getMinefieldDimensions = difficulty => {
    // get the screen width
    const width = window.innerWidth;
    // work out the optimum number for columns for the screen width
    const columns = this.getNumberOfColumnsForMinefield(width);
    // work out the number of rows required for the chosen difficulty
    const rows = this.getNumberOfRowsForMinefield(columns, difficulty);
    return { columns, rows };
  };

  setColumnsInCSSGrid = columns => {
    document.documentElement.style.setProperty('--columns', columns);
  };

  handleChangeDifficulty = event => {
    let columns, difficulty, mines, rows;
    this.cancelTimer();
    switch (event.target.value) {
      default:
      case 'easy':
        difficulty = 'easy';
        mines = 10;
        break;
      case 'medium':
        difficulty = 'medium';
        mines = 40;
        break;
      case 'hard':
        difficulty = 'hard';
        mines = 100;
        break;
    }
    ({ columns, rows } = this.getMinefieldDimensions(difficulty));
    this.setColumnsInCSSGrid(columns);
    this.setState({ columns, difficulty, mines, minesToBeFound: mines, rows });
    this.initialiseMinefield();
  };

  getElapsedTime = () => {
    let timeDiff = new Date().getTime() - this.startTime;
    let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  initialiseMinefield = () => {
    this.setState((state, props) => ({
      minefield: new Array(state.rows * state.columns).fill(0)
    }));
  };

  startGame = () => {
    this.cancelTimer();
    this.startTime = new Date().getTime();
    this.timerId = setInterval(() => {
      this.setState({ time: this.getElapsedTime() });
    }, 1000);
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
                color="secondary"
                aria-label="go"
                onClick={this.startGame}
              >
                Go
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
            ref={this.columnRef}
          >
            <Minefield minefield={this.state.minefield} />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
