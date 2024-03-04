// React
import React, { useEffect, useState } from "react";

// Design
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from "@mui/material/CircularProgress";


// Internal

// Third-party
import { useTranslation } from "react-i18next";
import { ResponsivePie } from '@nivo/pie';
import { colors } from 'sdk-fe-eyeflow';


const responsivePieTheme = {
  tooltip: {
    container: {
      background: colors.paper.blue.dark
    }
  },
  labels: {
    text: {
      fontSize: 15,
      fill: '#ffffff',
      textShadow: "1px 1px 2px #353535"
    }
  },
};

const responsivePieLegends = [
  {
      anchor: 'bottom',
      direction: 'row',
      justify: false,
      translateY: 56,
      itemsSpacing: 5,
      itemWidth: 100,
      itemHeight: 18,
      itemTextColor: 'white',
      itemDirection: 'left-to-right',
      itemOpacity: 1,
      symbolSize: 12,
      symbolShape: 'circle',
    // effects: [
    //     {
    //         on: 'hover',
    //         style: {
    //             itemTextColor: '#000'
    //         }
    //     }
    // ]
  }
];

export default function Bar({ chart }) {

  const { t } = useTranslation();
  const [info, setInfo] = useState([]);
  const [keys, setKeys] = useState([]);
  const [queryHasColors, setQueryHasColors] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);

  useEffect(() => {
    if (!chart?.result?.length) return
    else {
      let newKeys = chart.result.map((item) => item._id);
      let data = chart.result;
      let newInfo = [];
      data.forEach((item) => {
        let _item = {
          id: item._id,
          label: item._id,
          [item._id]: item.value,
          value: item.value,
        }
        if (Object.keys(chart?.chartInfo?.colors_results ?? {}).length > 0 &&
        chart?.chartInfo?.colors_results?.[item._id] !== undefined) {
          _item.color = chart.chartInfo.colors_results[item._id]
        }
        else {
          _item.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        }
        newInfo.push(_item);
      })
      newInfo.sort((a, b) => a.id?.localeCompare(b.id));
      setInfo(newInfo);
      setKeys(newKeys);
      setQueryHasColors(Object.keys(chart?.chartInfo?.colors_results ?? {}).length > 0 ? true : false);
    }
    // setData(chart.result)
  }, [chart])

  // console.log({ chart, info })

  return (
    <Box
      sx={{
        display: 'flex',
        width: `${chart.chartInfo.width}`,
        height: `${chart.chartInfo.height}`,
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '50px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} textAlign={'center'}>
          {t(chart.chartInfo.localeId)}
          {
            chart?.chartInfo?.downloadable &&
            (
              loadingDownload ?
              <CircularProgress /> :
              <Tooltip title={t('download')}>
                <IconButton
                  onClick={() => chart.chartInfo.download(setLoadingDownload)}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            )
          }
        </Typography>
      </Box>
      {
        chart?.result.length > 0 ?
          <Box
            sx={{
              display: 'flex',
              width: `calc(${chart.chartInfo.width}px / ${chart?.result.length})`,
              height: 'calc(100% - 50px)',
              flexGrow: 1,
            }}
          >
            <ResponsivePie
              data={info}
              arcLinkLabelsStraightLength={0}
              arcLabelsSkipAngle={10}
              arcLinkLabelsSkipAngle={10}
              margin={{ top: 100, right: 10, bottom: 100, left: 100 }}
              theme={responsivePieTheme}
              legends={responsivePieLegends}
              colors={info.every(item => item.color) ? info.map((item) => item.color) : { scheme: "nivo" }}
              valueFormat={function (e) {
                return e + '%'
              }}
            />
          </Box>

          :
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h3"
              component="div"
              sx={{ flexGrow: 1 }}
              textAlign={'center'}
            >
              {t('no_data_to_show')}
            </Typography>
          </Box>
      }
    </Box>
  );
}
