// React
import React, { useEffect, useState } from "react";

// Design
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Internal

// Third-party
import { useTranslation } from "react-i18next";
import { ResponsiveLine } from '@nivo/line';
import { colors } from 'sdk-fe-eyeflow';

const CustomTooltip = ({ color, value, id }) => (
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
);




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
        "strokeWidth": 0.1
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

const responsiveLegends = [
  {
    anchor: 'bottom',
    direction: 'column',
    justify: false,
    translateY: 180,
    translateX: -50,
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

export default function Line({ chart }) {

  const { t } = useTranslation();
  const [info, setInfo] = useState([]);
  const [keys, setKeys] = useState([]);
  const [queryHasColors, setQueryHasColors] = useState(false);

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
        if (Object.keys(chart?.chartInfo?.colors_results ?? {})?.length > 0 && chart?.chartInfo?.colors_results?.[item._id]) {
          _item.color = chart.chartInfo.colors_results[item._id]
        }
        else {
          _item.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        }
        newInfo.push(_item);
      })

      // setInfo(newInfo);
      setInfo(
        [
          {
            "id": "japan",
            "color": "hsl(269, 70%, 50%)",
            "data": [
              {
                "x": "plane",
                "y": 102
              },
              {
                "x": "helicopter",
                "y": 115
              },
              {
                "x": "boat",
                "y": 243
              },
              {
                "x": "train",
                "y": 182
              },
              {
                "x": "subway",
                "y": 145
              },
              {
                "x": "bus",
                "y": 281
              },
              {
                "x": "car",
                "y": 263
              },
              {
                "x": "moto",
                "y": 269
              },
              {
                "x": "bicycle",
                "y": 224
              },
              {
                "x": "horse",
                "y": 198
              },
              {
                "x": "skateboard",
                "y": 226
              },
              {
                "x": "others",
                "y": 51
              }
            ]
          },
          {
            "id": "france",
            "color": "hsl(57, 70%, 50%)",
            "data": [
              {
                "x": "plane",
                "y": 238
              },
              {
                "x": "helicopter",
                "y": 216
              },
              {
                "x": "boat",
                "y": 212
              },
              {
                "x": "train",
                "y": 161
              },
              {
                "x": "subway",
                "y": 257
              },
              {
                "x": "bus",
                "y": 32
              },
              {
                "x": "car",
                "y": 193
              },
              {
                "x": "moto",
                "y": 168
              },
              {
                "x": "bicycle",
                "y": 34
              },
              {
                "x": "horse",
                "y": 268
              },
              {
                "x": "skateboard",
                "y": 218
              },
              {
                "x": "others",
                "y": 9
              }
            ]
          },
          {
            "id": "us",
            "color": "hsl(77, 70%, 50%)",
            "data": [
              {
                "x": "plane",
                "y": 52
              },
              {
                "x": "helicopter",
                "y": 205
              },
              {
                "x": "boat",
                "y": 213
              },
              {
                "x": "train",
                "y": 103
              },
              {
                "x": "subway",
                "y": 98
              },
              {
                "x": "bus",
                "y": 4
              },
              {
                "x": "car",
                "y": 253
              },
              {
                "x": "moto",
                "y": 255
              },
              {
                "x": "bicycle",
                "y": 134
              },
              {
                "x": "horse",
                "y": 88
              },
              {
                "x": "skateboard",
                "y": 61
              },
              {
                "x": "others",
                "y": 15
              }
            ]
          },
          {
            "id": "germany",
            "color": "hsl(25, 70%, 50%)",
            "data": [
              {
                "x": "plane",
                "y": 296
              },
              {
                "x": "helicopter",
                "y": 221
              },
              {
                "x": "boat",
                "y": 214
              },
              {
                "x": "train",
                "y": 258
              },
              {
                "x": "subway",
                "y": 287
              },
              {
                "x": "bus",
                "y": 147
              },
              {
                "x": "car",
                "y": 5
              },
              {
                "x": "moto",
                "y": 201
              },
              {
                "x": "bicycle",
                "y": 93
              },
              {
                "x": "horse",
                "y": 87
              },
              {
                "x": "skateboard",
                "y": 163
              },
              {
                "x": "others",
                "y": 125
              }
            ]
          },
          {
            "id": "norway",
            "color": "hsl(311, 70%, 50%)",
            "data": [
              {
                "x": "plane",
                "y": 149
              },
              {
                "x": "helicopter",
                "y": 5
              },
              {
                "x": "boat",
                "y": 104
              },
              {
                "x": "train",
                "y": 24
              },
              {
                "x": "subway",
                "y": 138
              },
              {
                "x": "bus",
                "y": 177
              },
              {
                "x": "car",
                "y": 214
              },
              {
                "x": "moto",
                "y": 275
              },
              {
                "x": "bicycle",
                "y": 161
              },
              {
                "x": "horse",
                "y": 170
              },
              {
                "x": "skateboard",
                "y": 135
              },
              {
                "x": "others",
                "y": 36
              }
            ]
          }
        ]
      )
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
            <ResponsiveLine
              data={info}
              // margin={{ top: 100, right: 50, bottom: 250, left: 100 }}
              margin={{ top: 20, right: 50, bottom: 250, left: 30 }}

              theme={responsiveTheme}
              legends={responsiveLegends}
              colors={queryHasColors ? (i) => { return i.data.color } : { scheme: 'nivo' }}
              enableArea={chart?.chartInfo?.enableArea ?? false}
              xScale={{ type: 'point' }}
              yScale={{
                  type: 'linear',
                  // min: 'auto',
                  // max: 'auto',
                  stacked: false,
                  reverse: false
              }}
              yFormat=" >-.2f"
              pointSize={15}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  // legend: t('epochs'),
                  legendOffset: 100,
                  legendPosition: 'middle'
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                // legend: 'count',
                legendOffset: -40,
                legendPosition: 'middle'
              }}
              useMesh={true}
              enableSlices={chart?.chartInfo?.enableSlices ?? "x"}
            //   axisLeft={{
            //     tickSize: 5,
            //     // tickPadding: 5,
            //     tickRotation: 0,
            //     legend: 'count',
            //     // legendOffset: -40,
            //     // legendPosition: 'middle'
            // }}
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