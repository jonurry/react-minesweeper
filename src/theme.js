import { createMuiTheme } from '@material-ui/core/styles';

// define theme colours
export const theme = createMuiTheme({
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
export const styles = theme => ({
  margin: {
    margin: theme.spacing.unit * 2
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`
  }
});

export const styleToolbarCentre = {
  margin: 'auto'
};
