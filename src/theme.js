import { createTheme } from '@mui/material/styles';
import { colors } from 'sdk-fe-eyeflow';

const theme = createTheme({
  palette: {
    // mode: 'dark',
    primary: {
      main: colors.eyeflow.blue.dark,
    },
    secondary: {
      main: colors.eyeflow.yellow.dark,
      // color: 'white'
    },
    background: {
      default: colors.eyeflow.blue.medium,
    }
  },
});

export default theme;
