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

const CustomTooltip = ({ color, value, id, value_type, total, floating_points }) => {
  if (value_type === "percentage") {
  let count = (value / total) * 100;
  count = parseFloat(count).toFixed(floating_points)
  count = isNaN(count) ? 0 : count;
  value = `${count}%`.replace(".", ",");
  } 
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
    {id}: {value}
  </Box>
)};

const responsiveLegends = [
  {
    anchor: "bottom",
    direction: "column",
    justify: false,
    translateY: 180,
    translateX: -50,
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

export default function Bar({ chart }) {
  const { t } = useTranslation();
  const [info, setInfo] = useState([]);
  const [keys, setKeys] = useState([]);
  const [totalEl, setTotalEl] = useState(0);
  const [queryHasColors, setQueryHasColors] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [responsiveTheme, setResponsiveTheme] = useState({
    tooltip: {
      container: {
        background: colors.paper.blue.dark,
      },
    },
    labels: {
      text: {
        fontSize: 35,
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
  });

  useEffect(() => {
    if (!chart?.result?.length) return;
    else if (
      chart.result.length === 1 &&
      Object.keys(chart.result[0]).length > 0
    ) {
      let newKeys = Object.keys(chart.result[0]);
      let data = chart.result[0];
      let newInfo = [];
      Object.keys(data).forEach((item) => {
        if (item === "total") {
          setTotalEl(data[item])
          return
        }
        let _item = {
          id: item,
          [item]: data[item],
        };
        if (
          Object.keys(chart?.chartInfo?.colors_results ?? {})?.length > 0 &&
          chart?.chartInfo?.colors_results?.[item]
        ) {
          _item.color = chart.chartInfo.colors_results[item];
        } else {
          _item.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        }

        newInfo.push(_item);
      });
      setInfo(newInfo);
      setKeys(newKeys);
      setQueryHasColors(
        Object.keys(chart?.chartInfo?.colors_results ?? {})?.length > 0
          ? true
          : false
      );
    } else if (chart.result.length > 1) {
      let newKeys = chart.result.map((item) => item._id);
      let data = chart.result;
      let newInfo = [];
      data.forEach((item) => {
        let _item = {
          id: item._id,
          [item._id]: item.value,
        };
        if (
          Object.keys(chart?.chartInfo?.colors_results ?? {}).length > 0 &&
          chart?.chartInfo?.colors_results?.[item._id] !== undefined
        ) {
          _item.color = chart.chartInfo.colors_results[item._id];
        } else {
          _item.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        }
        newInfo.push(_item);
      });

      setInfo(newInfo);
      setKeys(newKeys);
      setQueryHasColors(
        Object.keys(chart?.chartInfo?.colors_results ?? {}).length > 0
      );
    }

    if (Object.keys(chart?.chartInfo).includes("label_font_size")) {
      let _responsiveTheme = responsiveTheme;
      _responsiveTheme.labels.text.fontSize = chart?.chartInfo?.label_font_size || _responsiveTheme.labels.text.fontSize;
      setResponsiveTheme(_responsiveTheme);
    }
  }, [chart]);

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
            margin={{ top: 10, right: 0, bottom: 30, left: 50 }}
            colors={
              queryHasColors
                ? (i) => {
                    return i.data.color;
                  }
                : { scheme: "nivo" }
            }
            tooltip={(info) => {
              let value = info.data[info.id];
              let color = info.color;
              let floating_points = chart?.chartInfo?.value_floating_points || 2;
              let graph_value_type = chart?.chartInfo?.value_type || "percentage"
              let total = totalEl
              let value_type = 
              chart?.chartInfo?.tooltip_value_type ? chart?.chartInfo?.tooltip_value_type : (graph_value_type === "absolute" ? "percentage" : "absolute")
              let id = info.id;
              return <CustomTooltip color={color} value={value} id={id} total={total} value_type={value_type} floating_points={floating_points}/>;
            }}
            theme={responsiveTheme}
            legends={responsiveLegends}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              // legend: 'food',
              legendPosition: "middle",
              legendOffset: -40,
              // truncateTickAt: 0
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              // legend: 'country',
              legendPosition: "middle",
              legendOffset: 32,
              truncateTickAt: 0,
            }}
            valueFormat={function (e) {
              let value_type = chart?.chartInfo?.value_type || "percentage"
              if (value_type === "absolute"){
                return e
              } else {
                let floating_points = chart?.chartInfo?.value_floating_points || 2
                let count = (e / totalEl) * 100;
                count = parseFloat(count).toFixed(floating_points)
                count = isNaN(count) ? 0 : count;
                e = `${count}%`.replace(".", ",");
                return e
                } 
            }}
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
