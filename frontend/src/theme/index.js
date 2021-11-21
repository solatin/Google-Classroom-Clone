import { createTheme, colors } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      default: '#F4F6F8',
      paper: colors.common.white
    },
    text: {
      primary: '#172b4d',
      secondary: '#6b778c'
    },
    alert: {
      red: '#f44336'
    }
  }
});

export default theme;
