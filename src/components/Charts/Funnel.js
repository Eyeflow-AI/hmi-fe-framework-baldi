// React
import React, { useEffect, useState } from "react";

// Design
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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




export default function Funnel({ chart }) {

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
      })
      setInfo(newInfo);
      setKeys(newKeys);
      setQueryHasColors(Object.keys(chart?.chartInfo?.colors_results ?? {})?.length > 0 ? true : false);
    }
    // else if (chart.result.length > 1) {
    //   let newKeys = chart.result.map((item) => item._id);
    //   let data = chart.result;
    //   let newInfo = [];
    //   data.forEach((item) => {
    //     let _item = {
    //       id: item._id,
    //       [item._id]: item.value,
    //       label: item?._id,
    //       value: item?.value ?? '',
    //     }
    //     if (chart?.chartInfo?.colors_results?.length > 0 && chart?.chartInfo?.colors_results?.[item._id]) {
    //       _item.color = chart.chartInfo.colors_results[item._id]
    //     }
    //     else {
    //       _item.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    //     }
    //     newInfo.push(_item);
    //   })

    //   setInfo(newInfo);
    //   setKeys(newKeys);
    //   setQueryHasColors(Object.keys(chart?.chartInfo?.colors_results ?? {}).length > 0 ? true : false);


    //   // set all text tags to 50px
    //   let textTags = document.getElementsByTagName('text');
    //   for (let i = 0; i < textTags.length; i++) {
    //     textTags[i].setAttribute('font-size', '50px');
    //   }
    // }
    // setData(chart.result)
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
            <ResponsiveFunnel
              data={info}
              keys={keys}
              colors={queryHasColors ? (i) => { 
                return i?.color 
              } : { scheme: 'nivo' }}
              tooltip={(i) => {
                let value = i?.part?.data?.value;
                let color = i?.part?.data?.color;
                let id = i?.part?.data?.id;
                console.log({value, color, id})
                return (<CustomTooltip color={color} value={value} id={id} />)
              }}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              valueFormat=">-.4s"
              borderWidth={20}
              labelColor={{
                  from: 'color',
                  modifiers: [
                      [
                      "brighter",
                      100        
                      ]
                  ]
              }}
              theme={{
                labels: {
                  text: {
                    fontSize: 35,
                  }
                },
              }}
              beforeSeparatorLength={100}
              beforeSeparatorOffset={20}
              afterSeparatorLength={100}
              afterSeparatorOffset={20}
              currentPartSizeExtension={10}
              currentBorderWidth={40}
              motionConfig="wobbly"
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