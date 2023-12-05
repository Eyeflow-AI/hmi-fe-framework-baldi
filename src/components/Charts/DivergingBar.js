// React
import React, { useEffect, useState } from "react";

// Design
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";

// Internal

// Third-party
import { useTranslation } from "react-i18next";
import { ResponsiveBar } from "@nivo/bar";
import { colors } from "sdk-fe-eyeflow";

const CustomTooltip = ({ color, value, id }) => (
  <Box
    sx={{
      background: colors.paper.blue.dark,
      width: "100%",
      height: "100%",
      display: "flex",
      // flexDirection: 'column',
      alignItems: "center",
      justifyContent: "center",
      padding: 1,
      textTransform: "uppercase",
    }}
  >
    <div
      style={{ width: "15px", height: "15px", backgroundColor: color }}
    ></div>
    &nbsp;&nbsp;
    {id}: {value}%
  </Box>
);

const responsiveTheme = {
  tooltip: {
    container: {
      background: colors.paper.blue.dark,
    },
  },
  labels: {
    text: {
      // fontSize: 35,
      fill: "#ffffff",
      textShadow: "1px 1px 2px #353535",
    },
  },
  legends: {
    text: {
      fontSize: 20,
      fill: "#ffffff",
    },
  },
  grid: {
    line: {
      stroke: "#dddddd",
      strokeWidth: 0.1,
    },
  },
  axis: {
    domain: {
      line: {
        stroke: "white",
        strokeWidth: 1,
      },
    },
    legend: {
      text: {
        fontSize: 12,
        fill: "white",
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
    ticks: {
      line: {
        stroke: "white",
        strokeWidth: 1,
      },
      text: {
        fontSize: 11,
        fill: "white",
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
  },
};

const responsiveLegends = [
  {
    anchor: "bottom",
    direction: "column",
    justify: false,
    translateY: 100,
    translateX: -200,
    itemsSpacing: 10,
    itemWidth: 10,
    itemHeight: 18,
    itemTextColor: "white",
    itemDirection: "left-to-right",
    itemOpacity: 1,
    symbolSize: 15,
    symbolShape: "square",
    effects: [
      {
        on: "hover",
        style: {
          itemTextColor: "#000",
        },
      },
    ],
  },
];

const months = ["jan", "feb", "mar"];
const items = ["tare_ok", "tare_ng", "no_plate"];
const _colors = [
  `${colors.eyeflow.green.dark}80`,
  `${colors.red}60`,
  `${colors.red}90`,
];

const generateData = months.map((month) => {
  let monthData = {
    month,
  };
  // set a random value negative or positive
  let _item = {};

  items.forEach((item, index) => {
    let isPositive = false;
    if (item === "tare_nok" || item === "no_plate") {
      // monthData[item] = Math.round(Math.random() * -100);
      _item[item] = Math.round(Math.random() * -100);
    } else {
      // monthData[item] = Math.round(Math.random() * 100);
      _item[item] = Math.round(Math.random() * 100);
      isPositive = true;
    }
    _item[`${item}Color`] = _colors[index];
  });

  // leave the values as percentages
  let total = 0;
  Object.keys(_item).forEach((item) => {
    if (!item.includes("Color")) {
      total += Math.abs(_item[item]);
    }
  });
  Object.keys(_item).forEach((item) => {
    if (!item.includes("Color")) {
      _item[item] =
        (Math.abs(_item[item]) / total) * 100 * (_item[item] < 0 ? -1 : 1);
      // round to two decimals
      _item[item] = Math.round(_item[item] * 100) / 100;
    }
  });
  monthData = { ...monthData, ..._item };
  return monthData;
});

export default function DivergingBar({ chart }) {
  const { t } = useTranslation();
  const [info, setInfo] = useState([]);
  const [keys, setKeys] = useState([]);
  const [queryHasColors, setQueryHasColors] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);

  console.log({ _colors });

  useEffect(() => {
    if (!chart?.result?.length) return;
    else if (
      chart.result.length === 1 &&
      Object.keys(chart.result[0]).length > 0
    ) {
      // let newKeys = Object.keys(chart.result[0]);
      let queryHasColors =
        Object.keys(chart?.chartInfo?.colors_results ?? {})?.length > 0
          ? true
          : false;

      let data = chart.result[0];
      console.log({ data });
      let newInfo = [];
      Object.entries(data).forEach(([key, value]) => {
        let _item = {
          period: key,
        };
        Object.entries(value?.fields ?? {}).forEach(([field, fieldValue]) => {
          _item[`${t(field)}`] = fieldValue;
          // chart?.chartInfo?.colors_results?.[i.id];
          if (queryHasColors) {
            _item[`${t(field)}Color`] =
              chart?.chartInfo?.colors_results?.[field];
          }
        });

        newInfo.push(_item);
      });
      setInfo(newInfo);
      // setKeys(newKeys);
      setQueryHasColors(queryHasColors);
      // set keys
      let keys = [];
      Object.keys(chart?.chartInfo?.colors_results ?? {}).forEach((key) => {
        keys.push(`${t(key)}`);
      });
      setKeys(keys);
    } else if (chart.result.length > 1) {
      // let newKeys = chart.result.map((item) => item._id);
      // let data = chart.result;
      // let newInfo = [];
      // data.forEach((item) => {
      //   let _item = {
      //     id: item._id,
      //     [item._id]: item.value,
      //   };
      //   if (
      //     chart?.chartInfo?.colors_results?.length > 0 &&
      //     chart?.chartInfo?.colors_results?.[item._id]
      //   ) {
      //     _item.color = chart.chartInfo.colors_results[item._id];
      //   } else {
      //     _item.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      //   }
      //   newInfo.push(_item);
      // });
      // setInfo(newInfo);
      // setKeys(newKeys);
      // setQueryHasColors(
      //   Object.keys(chart?.chartInfo?.colors_results ?? {}).length > 0
      //     ? true
      //     : false
      // );
    }
  }, [chart]);
  console.log({ generateData, chart, info });

  return (
    <Box
      sx={{
        display: "flex",
        width: `${chart.chartInfo.width}`,
        height: `${chart.chartInfo.height}`,
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "50px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          textAlign={"center"}
        >
          {t(chart.chartInfo.localeId)}
        </Typography>
        {chart?.chartInfo?.downloadable &&
          (loadingDownload ? (
            <CircularProgress />
          ) : (
            <Tooltip title={t("download")}>
              <IconButton
                onClick={() => chart.chartInfo.download(setLoadingDownload)}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          ))}
      </Box>
      {chart?.result.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "calc(100% - 50px)",
            flexGrow: 1,
          }}
        >
          <ResponsiveBar
            data={info}
            keys={keys}
            indexBy="period"
            margin={{ top: 30, right: 50, bottom: 120, left: 50 }}
            colors={
              queryHasColors
                ? (i) => {
                    let color = i?.data?.[`${i.id}Color`];
                    return color;
                  }
                : { scheme: "nivo" }
            }
            // colors={{ scheme: "nivo" }}
            tooltip={(info) => {
              let value = info.data[info.id];
              let color = info.color;
              let id = info.id;
              return <CustomTooltip color={color} value={value} id={id} />;
            }}
            indexScale={{ type: "band", round: true }}
            enableGridX={true}
            theme={responsiveTheme}
            legends={responsiveLegends}
            valueFormat={(v) => `${v}%`}
            maxValue={100}
            minValue={-100}
            yScale={{
              type: "linear",
              minInterval: 1,
              maxInterval: 1,
              reverse: false,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              // legend: 'food',
              legendPosition: "middle",
              // legendOffset: -40,
              // truncateTickAt: 0,
              format: (value) => `${value}%`,
            }}
            axisTop={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              // legend: 'country',
              legendPosition: "middle",
              legendOffset: 32,
              truncateTickAt: 0,
            }}
            axisRight={{
              // more than 0 gain, less than 0 loss
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              // legend: 'food',
              legendPosition: "middle",
              legendOffset: 32,
              // truncateTickAt: 0,
              format: (value) => `${value}%`,
            }}
            // axisBottom={{
            //   tickSize: 5,
            //   tickPadding: 5,
            //   tickRotation: 0,
            //   // legend: 'country',
            //   legendPosition: "middle",
            //   legendOffset: 32,
            //   truncateTickAt: 0,
            // }}
            axisBottom={null}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h3"
            component="div"
            sx={{ flexGrow: 1 }}
            textAlign={"center"}
          >
            {t("no_data_to_show")}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
