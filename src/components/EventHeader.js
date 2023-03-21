// React
import React, {useMemo} from 'react';


import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


import { useTranslation } from "react-i18next";
import { dateFormat } from 'sdk-fe-eyeflow';

const styleSx = {
  mainBox: Object.assign(
    {},
    window.app_config.style.box,
    {
      bgcolor: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      paddingLeft: 1,
      overflowX: 'auto',
      overflowY: 'hidden',
      width: "100%",
    }
  ),
  itemBox: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(133, 133, 133, 0.6)',
    borderRadius: 1,
    height: 56,
    paddingTop: 0.2,
    paddingLeft: 0.8,
    paddingRight: 0.8,
    // paddingBottom: 0.1,
  }
};

export default function EventHeader({data, width, config}) {

  const { t } = useTranslation();

  const {fields} = useMemo(() => {
    return {
      fields: config.fields.map(({label, field, type}) => {
        let thisData = "";
        if (Boolean(data?.[field])) {
          if (type === "date") {
            thisData = dateFormat(new Date(data[field]));
          }
          else {
            thisData = data[field];
          };
        };

        return {label, field, data: thisData};
      })
    };
  }, [data, config]);

  return (
    <Box width={config.width} height={config.height} sx={styleSx.mainBox}>
      {Boolean(data) && fields.map(({data, label}, index) => (
        <Box key={index} sx={styleSx.itemBox}>
          <Box>
            <Typography variant="subtitle2">
              {t(label)}
            </Typography>
          </Box>
          <Box>
            <Typography noWrap={true}>
              {data}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};