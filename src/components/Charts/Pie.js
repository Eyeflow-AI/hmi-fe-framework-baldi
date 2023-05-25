// React
import React, { useEffect, useState } from "react";

// Design
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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
      fontSize: 21,
      fill: '#ffffff',
      textShadow: "1px 1px 2px #353535"
    }
  },
};

const responsivePieLegends = [
  {
    anchor: 'left',
    direction: 'column',
    justify: false,
    // translateY: 56,
    translateX: -80,
    itemsSpacing: 10,
    itemWidth: 150,
    itemHeight: 18,
    itemTextColor: '#999',
    itemDirection: 'left-to-right',
    itemOpacity: 1,
    symbolSize: 18,
    symbolShape: 'circle',
    // effects: [
    //   {
    //     on: 'hover',
    //     style: {
    //       itemTextColor: '#000'
    //     }
    //   }
    // ]
  }
];

export default function Bar({ chart }) {

  const { t } = useTranslation();
  const [info, setInfo] = useState([]);
  const [keys, setKeys] = useState([]);
  const [queryHasColors, setQueryHasColors] = useState(false);

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
        }
        if (Object.keys(chart?.chartInfo?.colors_results).length > 0 && chart?.chartInfo?.colors_results?.[item]) {
          _item.color = chart.chartInfo.colors_results[item]
        }

        newInfo.push(_item)
      })
      setInfo(newInfo);
      setKeys(newKeys);
      setQueryHasColors(Object.keys(chart?.chartInfo?.colors_results ?? {}).length > 0 ? true : false);
    }
    else if (chart.result.length > 1) {
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
        if (chart?.chartInfo?.colors_results?.length > 0 && chart?.chartInfo?.colors_results?.[item._id]) {
          _item.color = chart.chartInfo.colors_results[item._id]
        }
        newInfo.push(_item);
      })

      setInfo(newInfo);
      setKeys(newKeys);
      setQueryHasColors(Object.keys(chart?.chartInfo?.colors_results ?? {}).length > 0 ? true : false);
    }
    // setData(chart.result)
  }, [chart])

  console.log({ chart, info })

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
            }}
          >
            <ResponsivePie
              data={info}
              arcLinkLabelsStraightLength={0}
              arcLabelsSkipAngle={10}
              arcLinkLabelsSkipAngle={10}
              margin={{ top: 70, right: 40, bottom: 70, left: 100 }}
              theme={responsivePieTheme}
              legends={responsivePieLegends}
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