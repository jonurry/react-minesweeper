import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';

export default class Timer extends Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.resetTimer();
    this.state = {
      time: null
    };
  }

  componentWillUnmount = () => {
    this.resetTimer();
  };

  getElapsedTime = () => {
    let timeDiff = new Date().getTime() - this.startTime;
    let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  render() {
    return (
      <Typography
        className={this.classes.margin}
        variant="headline"
        color="inherit"
      >
        {this.state.time ? this.state.time : '0:00'}
      </Typography>
    );
  }

  resetTimer = () => {
    if (this.timerId !== 0) {
      clearInterval(this.timerId);
    }
    this.startTime = null;
    this.timerId = 0;
    this.setState({ time: null });
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
