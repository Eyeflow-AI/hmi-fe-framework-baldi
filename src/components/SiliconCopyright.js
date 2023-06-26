// React
import React from 'react';

// Design
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

// Internal
import packageJson from '../../package.json';


// Third-party
import { useTranslation } from "react-i18next";


const styleSx = {
  copyRight: {
    // margin: theme.spacing(0, 1, 1),
  }
};

export default function Copyright() {
  const { t } = useTranslation();


  return (
    <>
      <Typography variant="body2" color="textSecondary" align="right" sx={styleSx.copyRight}>
        {'Copyright © '}
        <Link color="inherit" href="https://www.siliconlife.ai/">
          SiliconLife.AI
        </Link>{' '}
        {new Date().getFullYear()}
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center" sx={styleSx.copyRight}>
        {t('version')} {packageJson.version}
      </Typography>
    </>
  );
}
