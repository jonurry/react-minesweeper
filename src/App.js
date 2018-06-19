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
import Model, { FLAGS } from './model.js';

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
              className={props.classes.icon}
              style={{
                fontSize: fontSize
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
    this.startTime = null;
    this.timerId = 0;
    this.state = {
      difficulty: 'easy',
      minefield: this.model.minefield.slice(),
      mines: 10,
      minesToBeFound: 10,
      time: null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  cancelTimer = () => {
    if (this.timerId !== 0) {
      clearInterval(this.timerId);
      this.startTime = null;
      this.timerId = 0;
      this.setState({ time: null });
    }
  };

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
    this.cancelTimer();
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

  getElapsedTime = () => {
    let timeDiff = new Date().getTime() - this.startTime;
    let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  handleClick(id, e) {
    e.preventDefault();
    switch (e.type) {
      case 'click':
        if (!this.model.isRevealed(id)) {
          this.model.reveal(id);
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

  handleChangeDifficulty = event => {
    let columns, mines, rows;
    let difficulty = event.target.value;
    if (difficulty !== this.state.difficulty) {
      this.cancelTimer();
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
            style={this.state.minefieldStyle}
          >
            <Minefield
              classes={this.classes}
              minefield={this.state.minefield}
              minefieldStyle={this.state.minefieldStyle}
              handleClick={this.handleClick}
            />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

  startGame = () => {
    this.cancelTimer();
    this.startTime = new Date().getTime();
    this.timerId = setInterval(() => {
      this.setState({ time: this.getElapsedTime() });
    }, 1000);
  };
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
