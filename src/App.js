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

const Grid = props => {
  let minefield = [];
  let key = 0;
  for (let item of props.minefield) {
    minefield.push(
      <Button key={key++} variant="contained" color="secondary">
        {item}
      </Button>
    );
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
      columns: 9,
      difficulty: 1,
      minefield: [],
      mines: 10,
      minesToBeFound: 10,
      rows: 9,
      time: null
    };
    this.classes = props.classes;
    this.startTime = null;
    this.timerId = 0;
    // This binding is necessary to make `this` work in the callback
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount() {
    this.initialiseMinefield();
  }

  componentWillUnmount() {
    this.cancelTimer();
  }

  cancelTimer() {
    if (this.timerId !== 0) {
      clearInterval(this.timerId);
      this.startTime = null;
      this.timerId = 0;
      this.setState({ time: null });
    }
  }

  handleChangeDifficulty = event => {
    let columns, difficulty, mines, rows;
    this.cancelTimer();
    switch (event.target.value) {
      case 1:
      default:
        // Easy
        difficulty = 1;
        columns = 9;
        rows = 9;
        mines = 10;
        break;
      case 2:
        // Medium
        difficulty = 2;
        columns = 16;
        rows = 16;
        mines = 40;
        break;
      case 3:
        // Hard
        difficulty = 3;
        columns = 16;
        rows = 30;
        mines = 99;
        break;
    }
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
                <MenuItem value={1}>Easy</MenuItem>
                <MenuItem value={2}>Medium</MenuItem>
                <MenuItem value={3}>Hard</MenuItem>
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
          <div className="minefield">
            <Grid minefield={this.state.minefield} />
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
