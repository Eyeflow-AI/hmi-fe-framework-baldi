// React
import React, {useMemo} from 'react';


import Box from '@mui/material/Box';


import { useTranslation } from "react-i18next";


const styleSx = {
  mainBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'white',
    width: '100%',
  }),
};

export default function EventHeader({data, config}) {

  const { t } = useTranslation();

  const {fields} = useMemo(() => {
    return {
      fields: config.fields.map(({label, field}) => ({label, field, data: data?.[field] ?? ""}))
    };
  }, [data, config]);

  return (
    <Box height={config.height} sx={styleSx.mainBox}>
      {Boolean(data) && fields.map(({data, label}) => (
        <Box>
          {t(label)} {JSON.stringify(data)}
        </Box>
      ))}
    </Box>
  );
};