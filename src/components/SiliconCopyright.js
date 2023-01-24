// React
import React from 'react';

// Design
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const styleSx = {
  copyRight : {
    // margin: theme.spacing(0, 1, 1),
  }
};

export default function Copyright() {

  return (
    <Typography variant="body2" color="textSecondary" align="right" sx={styleSx.copyRight}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.siliconlife.ai/">
        SiliconLife.AI
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}
