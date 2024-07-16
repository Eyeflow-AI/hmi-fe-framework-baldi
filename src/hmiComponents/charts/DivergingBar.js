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
import splitNumbers from "../../utils/functions/splitNumbers";

// Third-party
import { useTranslation } from "react-i18next";
import { ResponsiveBar } from "@nivo/bar";
import { colors } from "sdk-fe-eyeflow";
import lodash from "lodash";
import * as nivoColors from "@nivo/colors"

const CustomTooltip = ({
  color,
  value,
  id,
  value_type,
  total,
  floating_points,
}) => {
  const [valueSymbol, setValueSymbol] = useState("");
  const [currentValue, setCurrentValue] = useState(0);
  const { t } = useTranslation();
  useEffect(() => {
    if (value_type === "percentage") {
      let _currentValue = (Math.abs(value) / total) * 100;
      _currentValue = _currentValue.toFixed(floating_points);
      _currentValue = String(_currentValue).replace(".", ",");
      setCurrentValue(_currentValue);
      setValueSymbol("%");
    } else if (value_type === "absolute") {
      setCurrentValue(splitNumbers(value));
      setValueSymbol("");
    } else {
      let _currentValue = (Math.abs(value) / total) * 100;
      _currentValue = _currentValue.toFixed(floating_points);
      _currentValue = String(_currentValue).replace(".", ",");
      setCurrentValue(_currentValue);
      setValueSymbol("%");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value_type]);

  return (
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
      {t(id)}: {currentValue}
      {valueSymbol}
    </Box>
  );
};

// const responsiveLegends = [
//   {
//     anchor: "bottom",
//     direction: "column",
//     justify: false,
//     translateY: 100,
//     translateX: -200,
//     itemsSpacing: 10,
//     itemWidth: 10,
//     itemHeight: 18,
//     itemTextColor: "white",
//     itemDirection: "left-to-right",
//     itemOpacity: 1,
//     symbolSize: 15,
//     symbolShape: "square",
//     effects: [
//       {
//         on: "hover",
//         style: {
//           itemTextColor: "#000",
//         },
//       },
//     ],
//   },
// ];

// const months = ["jan", "feb", "mar"];
// const items = ["tare_ok", "tare_ng", "no_plate"];
// const _colors = [
//   `${colors.eyeflow.green.dark}80`,
//   `${colors.red}60`,
//   `${colors.red}90`,
// ];

// const generateData = months.map((month) => {
//   let monthData = {
//     month,
//   };
//   // set a random value negative or positive
//   let _item = {};

//   items.forEach((item, index) => {
//     let isPositive = false;
//     if (item === "tare_nok" || item === "no_plate") {
//       // monthData[item] = Math.round(Math.random() * -100);
//       _item[item] = Math.round(Math.random() * -100);
//     } else {
//       // monthData[item] = Math.round(Math.random() * 100);
//       _item[item] = Math.round(Math.random() * 100);
//       isPositive = true;
//     }
//     _item[`${item}Color`] = _colors[index];
//   });

//   // leave the values as percentages
//   let total = 0;
//   Object.keys(_item).forEach((item) => {
//     if (!item.includes("Color")) {
//       total += Math.abs(_item[item]);
//     }
//   });
//   Object.keys(_item).forEach((item) => {
//     if (!item.includes("Color")) {
//       _item[item] =
//         (Math.abs(_item[item]) / total) * 100 * (_item[item] < 0 ? -1 : 1);
//       // round to two decimals
//       _item[item] = Math.round(_item[item] * 100) / 100;
//     }
//   });
//   monthData = { ...monthData, ..._item };
//   return monthData;
// });

export default function DivergingBar({ chart }) {
  const { t } = useTranslation();
  const [info, setInfo] = useState([]);
  const [keys, setKeys] = useState([]);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [maxValue, setMaxValue] = useState(0);
  const [minValue, setMinValue] = useState(0);
  const [bottomMargin, setBottomMargin] = useState(150);
  const [legend, setLegend] = useState([]);
  // const [colorResults, setColorResults] = useState({});
  const [_chart, _setChart] = useState(null);

  const [responsiveTheme, setResponsiveTheme] = useState({
    tooltip: {
      container: {
        background: colors.paper.blue.dark,
      },
    },
    labels: {
      text: {
        fontSize: 20,
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
          strokeWidth: 0,
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
  });

  // console.log({ DivergingBar: info, chart });
  useEffect(() => {
    if (!_chart?.result?.length) return;
    else if (
      _chart.result.length === 1 &&
      Object.keys(_chart.result[0]).length > 0
    ) {
      // let newKeys = Object.keys(chart.result[0]);
      // let queryHasColors =
      //   Object.keys(_chart?.chartInfo?.colors_results ?? {})?.length > 0
      //     ? true
      //     : false;

      let data = _chart.result[0];
      let newInfo = [];
      let _maxValue = 0;
      let _minValue = 0;
      let _legend = [];
      let value_type = _chart?.chartInfo?.value_type || "percentage";
      let floating_points = _chart?.chartInfo?.value_floating_points || 2;
      let fieldColors = {};
      let colorIndex = 0;
      let colorScheme = nivoColors.colorSchemes[_chart?.chartInfo?.color_scheme || "nivo"]
      let schemeLength = colorScheme.length
      Object.entries(data).forEach(([key, value]) => {
        let dontSave = false;
        let _item = {
          period: key,
          total: 0,
          total_tooltip: 0,
        };
        let fieldNames = [];

        Object.entries(value?.fields ?? {}).forEach(([field, fieldValue]) => {
          fieldNames.push(field);
          _item[`${field}`] = fieldValue;
          _item["total_tooltip"] +=
            value?.tooltip_fields?.[field] ?? fieldValue;
          _item["total"] += Math.abs(fieldValue);
          _item[`${field}_tooltip`] =
            value?.tooltip_fields?.[field] ?? fieldValue;
          if (fieldValue > _maxValue) _maxValue = fieldValue;
          if (fieldValue < _minValue) _minValue = fieldValue;
          if (Object.keys(fieldColors).includes(field)) {
            _item[`${field}Color`] = fieldColors[field];
          } else {
            let color = _chart?.chartInfo?.colors_results?.[field] ||
              `${colorScheme[colorIndex]}`;
            _item[`${field}Color`] = color;
            fieldColors[field] = color;
          }
          colorIndex = (colorIndex + 1) % schemeLength
      });

        if (value_type === "percentage") {
          fieldNames.forEach((field) => {
            let total = _item["total"];
            let percentage_value = (_item[field] / total) * 100;
            percentage_value = percentage_value.toFixed(floating_points);
            _item[field] = percentage_value;
          });
        }

        if (!dontSave) newInfo.push(_item);
      });

      _legend = Object.entries(fieldColors).map(([key, value]) => {
        return { id: key, color: value };
      });

      // setKeys(newKeys);
      // set keys
      let keys = [];
      Object.keys(fieldColors ?? {}).forEach((key) => {
        // keys.push(`${t(key)}`);
        keys.push(`${key}`);
      });
      if (chart?.chartInfo?.value_type === "percentage") {
        setMaxValue(100);
        setMinValue(-100);
      } else if (chart?.chartInfo?.value_type === "absolute") {
        _maxValue *= 1.1;
        _minValue *= 1.1;
        setMaxValue(_maxValue);
        setMinValue(_minValue);
      } else {
        setMaxValue(100);
        setMinValue(-100);
      }
      setLegend(_legend);
      setKeys(keys);
      setInfo(newInfo);
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

    if (Object.keys(chart?.chartInfo).includes("label_font_size")) {
      let _responsiveTheme = responsiveTheme;
      _responsiveTheme.labels.text.fontSize =
        _chart?.chartInfo?.label_font_size ||
        responsiveTheme.labels.text.fontSize;
      setResponsiveTheme(_responsiveTheme);
    }
    if (Object.keys(chart?.chartInfo).includes("legend_font_size") && chart?.chartInfo?.legend_font_size === 0) {
      setBottomMargin(30);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_chart]);
  // console.log({ generateData, chart, info });

  useEffect(() => {
    if (chart !== null && !lodash.isEqual(chart, _chart)) {
      // if (
      //   chart?.chartInfo?.colors_results &&
      //   Object.keys(chart?.chartInfo?.colors_results).length > 0
      // ) {
      //   setColorResults(chart?.chartInfo?.colors_results);
      // }
      _setChart(chart);
    }
    // eslint-disable-next-line
  }, [chart]);

  console.log({ info, legend });

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
          {t(_chart?.chartInfo?.localeId)}
        </Typography>
        {_chart?.chartInfo?.downloadable &&
          (loadingDownload ? (
            <CircularProgress />
          ) : (
            <Tooltip title={t("download")}>
              <IconButton
                onClick={() => _chart.chartInfo.download(setLoadingDownload)}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          ))}
      </Box>
      {_chart?.result.length > 0 && Object.keys(_chart?.result[0]).length > 0 ? (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "calc(100% - 50px)",
            flexGrow: 1,
            flexDirection: "column",
          }}
        >
          <ResponsiveBar
            data={info}
            keys={keys}
            indexBy="period"
            margin={{ top: 30, right: 50, bottom: bottomMargin, left: 50 }}
            colors={(i) => {
                let color = i?.data?.[`${i.id}Color`];
                return color;
            }}
            // colors={{ scheme: "nivo" }}
            tooltip={(info) => {
              let total = info?.data?.total ?? 0;
              let value =
                info?.data?.[`${info.id}_tooltip`] ?? info.data[info.id];
              let color = info.color;
              let id = info.id;
              let floating_points = _chart?.chartInfo?.value_floating_points || 2;
              return (
                <CustomTooltip
                  color={color}
                  value={value}
                  total={total}
                  id={id}
                  floating_points={floating_points}
                  value_type={
                    _chart?.chartInfo?.tooltip_value_type
                      ? _chart?.chartInfo?.tooltip_value_type
                      : _chart?.chartInfo?.value_type === "absolute"
                      ? "percentage"
                      : "absolute"
                  }
                />
              );
            }}
            indexScale={{ type: "band", round: true }}
            enableGridX={true}
            theme={responsiveTheme}
            // legends={responsiveLegends}
            valueFormat={(v) => {
              let valueType = _chart?.chartInfo?.value_type || "percentage";
              if (valueType === "percentage") {
                let _v = Object.keys(_chart?.chartInfo).includes(
                  "value_floating_points"
                )
                  ? v.toFixed(_chart?.chartInfo?.value_floating_points || 2)
                  : v;
                if (Math.abs(_v) >= _chart?.chartInfo?.min_value_to_show || 5) {
                  _v = String(_v).replace(".", ",");
                  return `${_v}%`;
                } else {
                  return "";
                }
              } else if (valueType === "absolute") {
                if (Math.abs(v) >= _chart?.chartInfo?.min_value_to_show || 5) {
                  let _v = splitNumbers(v);
                  return `${_v}`;
                }
                // } else {
                // return "";
                // }
              }
            }}
            // valueFormat={ (v) => {
            //   console.log({v, info, keys,r: chart.result})
            //   let value_type = chart?.chartInfo?.value_type || "percentage";
            //   let floating_points = chart?.chartInfo?.value_floating_points || 2;
            //   if (value_type === "percentage") {
            //     v = `${_currentValue}%`
            //     return v;
            //     } else {
            //       return v;
            //     }
            // }}
            // valueFormat={v=>v}
            maxValue={_chart?.chartInfo?.use_max_value ? maxValue : undefined}
            minValue={_chart?.chartInfo?.use_min_value ? minValue : undefined}
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
              format: (value) => {
                let valueType = _chart?.chartInfo?.value_type ?? "percentage";
                if (valueType === "percentage") {
                  return `${value}%`;
                } else if (valueType === "absolute") {
                  return value;
                }
              },
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
              format: (value) => {
                let valueType = _chart?.chartInfo?.value_type ?? "percentage";
                if (valueType === "percentage") {
                  return `${value}%`;
                } else if (valueType === "absolute") {
                  return value;
                }
              },
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
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "150px",
              justifyContent: "center",
              flexWrap: "wrap",
              alignItems: "space-around",
              marginTop: "-150px",
              flexDirection: "column",
              gap: 0,
              marginLeft: "2rem",
              // border: '1px solid white',
            }}
          >
            {/* create the legend with the information */}
            {legend.map((item, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    width: "auto",
                    height: "30px",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "5px",
                    // border: '1px solid white',
                  }}
                >
                  <div
                    style={{
                      width: (((_chart?.chartInfo?.legend_font_size - 5) > 0) ? _chart?.chartInfo?.legend_font_size - 5 : _chart?.chartInfo?.legend_font_size) ?? 15,
                      height: (((_chart?.chartInfo?.legend_font_size - 5) > 0) ? _chart?.chartInfo?.legend_font_size - 5 : _chart?.chartInfo?.legend_font_size) ?? 15,
                      backgroundColor: item?.color,
                    }}
                  ></div>
                  &nbsp;&nbsp;
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, fontSize: _chart?.chartInfo?.legend_font_size ?? 20 }}
                    textAlign={"left"}
                  >
                    {t(item?.id)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
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
