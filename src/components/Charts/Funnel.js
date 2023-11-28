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
import { ResponsiveFunnel } from '@nivo/funnel';
import { colors } from 'sdk-fe-eyeflow';




const CustomTooltip = ({ color, value, id }) => {
  return (
    <Box sx={{
      background: colors.paper.blue.dark,
      width: '100%',
      height: '100%',
      display: 'flex',
      // flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 1,
      textTransform: 'uppercase',
    }}>
      <div style={{ width: '15px', height: '15px', backgroundColor: color }}></div>
      &nbsp;&nbsp;
      {id}: {value}
    </Box>
  )
};


const responsiveLegends = [
  {
    anchor: 'bottom',
    direction: 'column',
    justify: false,
    translateY: 180,
    translateX: 150,
    itemsSpacing: 10,
    itemWidth: 10,
    itemHeight: 18,
    itemTextColor: 'white',
    itemDirection: 'left-to-right',
    itemOpacity: 1,
    symbolSize: 15,
    symbolShape: 'square',
    effects: [
      {
        on: 'hover',
        style: {
          itemTextColor: '#000'
        }
      }
    ],
  }
];


const responsiveTheme = {
  tooltip: {
    container: {
      background: colors.paper.blue.dark
    }
  },
  labels: {
    text: {
      fontSize: 35,
      fill: '#ffffff',
      textShadow: "1px 1px 2px #353535"
    }
  },
  legends: {
    text: {
      fontSize: 20,
      fill: '#ffffff',
    }
  },
  "grid": {
    "line": {
        "stroke": "#dddddd",
        "strokeWidth": .6
    }
  },
  "axis": {
    "domain": {
        "line": {
            "stroke": "#777777",
            "strokeWidth": 1
        }
    },
    "legend": {
        "text": {
            "fontSize": 12,
            "fill": "white",
            "outlineWidth": 0,
            "outlineColor": "transparent"
        }
    },
    "ticks": {
        "line": {
            "stroke": "#777777",
            "strokeWidth": 1
        },
        "text": {
            "fontSize": 11,
            "fill": "white",
            "outlineWidth": 0,
            "outlineColor": "transparent"
        }
    }
  }
};


export default function Funnel({ chart }) {

  const { t } = useTranslation();
  const [info, setInfo] = useState([]);
  const [keys, setKeys] = useState([]);
  const [queryHasColors, setQueryHasColors] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);

  useEffect(() => {
    if (!chart?.result?.length) return
    else if (chart.result.length === 1 && Object.keys(chart.result[0]).length > 0) {
      let newKeys = Object.keys(chart.result[0]);
      let data = chart.result[0];
      let newInfo = [];
      Object.keys(data).forEach((item) => {
        let _item = {
          id: item,
          [item]: data[item],
          label: item,
          value: data?.[item],
        }

        if (Object.keys(chart?.chartInfo?.colors_results ?? {})?.length > 0 && chart?.chartInfo?.colors_results?.[item]) {
          _item.color = chart.chartInfo.colors_results[item]
        }
        else {
          _item.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        }

        newInfo.push(_item)
      });
      setInfo(newInfo);
      setKeys(newKeys);
      setQueryHasColors(Object.keys(chart?.chartInfo?.colors_results ?? {})?.length > 0 ? true : false);
    }
  }, [chart])


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
              width: '100%',
              height: 'calc(100% - 50px)',
              flexGrow: 1,
              flexDirection: 'column',
            }}
          >
            <ResponsiveFunnel
              data={info}
              // keys={keys}
              colors={queryHasColors ? (i) => { 
                return i?.color 
              } : { scheme: 'nivo' }}
              tooltip={(i) => {
                let value = i?.part?.data?.value;
                let color = i?.part?.data?.color;
                let id = i?.part?.data?.id;
                return (<CustomTooltip color={color} value={value} id={t(id)} />)
              }}
              margin={{ top: 20, right: 20, bottom: 200, left: 20 }}
              // valueFormat=">.2s"
              // width={chart.chartInfo.width}
              borderWidth={30}
              borderOpacity={0.3}
              labelColor={{
                  from: 'color',
                  modifiers: [
                      [
                      "brighter",
                      100        
                      ]
                  ]
              }}
              // theme={{
              //   labels: {
              //     text: {
              //       fontSize: 35,
              //     }
              //   },
              // }}
              theme={responsiveTheme}
              // legends={responsiveLegends}
              // beforeSeparatorLength={100}
              beforeSeparatorOffset={10}
              // afterSeparatorLength={100}
              afterSeparatorOffset={10}
              currentPartSizeExtension={10}
              currentBorderWidth={20}
              motionConfig="wobbly"
              direction={chart?.chartInfo?.direction ?? "vertical"}
            />
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                height: '150px',
                justifyContent: 'flex-start',
                alignItems: 'space-around',
                marginTop: '-150px',
                flexDirection: 'column',
                gap: 0,
                marginLeft: '2rem',
                // border: '1px solid white',
              }}
            >
              {/* create the legend with the information */}
              {
                info.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        width: '100%',
                        height: '30px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // border: '1px solid white',
                      }}
                    >
                      <div style={{ width: '15px', height: '15px', backgroundColor: item?.color }}></div>
                      &nbsp;&nbsp;
                      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} textAlign={'left'}>
                        {t(item?.id)}
                      </Typography>
                    </Box>
                  )
                })
              }

            </Box>
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