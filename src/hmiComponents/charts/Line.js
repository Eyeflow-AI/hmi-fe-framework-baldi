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
import runFunction from "../../utils/functions/runFunction";

// Third-party
import { useTranslation } from "react-i18next";
import { ResponsiveLine } from "@nivo/line";
import { colors } from "sdk-fe-eyeflow";

const CustomTooltip = ({ color, value, id, total, value_type, floating_points }) => {
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
      {color && (
        <>
          <div
            style={{ width: "15px", height: "15px", backgroundColor: color }}
          />
          &nbsp;&nbsp;
        </>
      )}
      {id}: {value}
    </Box>
  );
};

// const responsiveLegends = [
//   {
//     anchor: "bottom",
//     direction: "column",
//     justify: false,
//     translateY: 140,
//     translateX: -200,
//     itemsSpacing: 5,
//     itemWidth: 10,
//     itemHeight: 18,
//     itemTextColor: "white",
//     itemDirection: "left-to-right",
//     itemOpacity: 1,
//     symbolSize: 12,
//     symbolShape: "square",
//     // effects: [
//     //   {
//     //     on: 'hover',
//     //     style: {
//     //       itemTextColor: '#000'
//     //     }
//     //   }
//     // ]
//   },
// ];

export default function Line({ chart }) {
  const { t } = useTranslation();
  const [info, setInfo] = useState([]);
  const [queryHasColors, setQueryHasColors] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [colorScheme, setColorScheme] = useState("nivo");
  const [responsiveLegends, setResponsiveLegends] = useState([
    {
      anchor: "bottom",
      direction: "column",
      justify: false,
      translateY: 140,
      translateX: -200,
      itemsSpacing: 5,
      itemWidth: 10,
      itemHeight: 18,
      itemTextColor: "white",
      itemDirection: "left-to-right",
      itemOpacity: 1,
      symbolSize: 12,
      symbolShape: "square",
      // effects: [
      //   {
      //     on: 'hover',
      //     style: {
      //       itemTextColor: '#000'
      //     }
      //   }
      // ]
    },
  ]);
  const [responsiveTheme, setResponsiveTheme] = useState({
    // tooltip: {
    //   container: {
    //     background: colors.paper.blue.dark,
    //   },
    // },
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
          stroke: "#777777",
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
          stroke: "#777777",
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
    else {
      let newInfo = chart?.result ?? [];
      const totals = newInfo.reduce((acc, cur) => {
        cur.data.forEach(({ x, y }) => {
            if (!acc[x]) {
                acc[x] = 0;
            }
            acc[x] += y;
        });
        return acc;
    }, {});
    newInfo = newInfo.map(el => {
        el.id = t(el.id);
        el.data = el.data.map(d => {
            return { ...d, z: totals[d.x] };
        });
        return el;
      });
      setInfo(newInfo);
      setQueryHasColors(
        Object.keys(chart?.chartInfo?.colors_results ?? {}).length > 0
          ? true
          : false
      );
    }
    // setData(chart.result)
    // eslint-disable-next-line
    if (Object.keys(chart?.chartInfo).includes("color_scheme")) {
      let colorScheme =  chart?.chartInfo?.color_scheme || "nivo"
      setColorScheme(colorScheme)
    }
    let _responsiveTheme = responsiveTheme;
    if (Object.keys(chart?.chartInfo).includes("label_font_size")) {
      _responsiveTheme.labels.text.fontSize = chart?.chartInfo?.label_font_size || _responsiveTheme.labels.text.fontSize;
    }
    if (Object.keys(chart?.chartInfo).includes("legend_font_size")) {
      if (chart?.chartInfo?.legend_font_size === 0) {
        setResponsiveLegends([])
      } else {
        _responsiveTheme.legends.text.fontSize = chart?.chartInfo?.legend_font_size;
        responsiveLegends[0].symbolSize = (chart?.chartInfo?.legend_font_size - 5) > 0 ? (chart?.chartInfo?.legend_font_size - 5) : chart?.chartInfo?.legend_font_size;
      }
    }
    setResponsiveTheme(_responsiveTheme);
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
        </Typography>
      </Box>
      {chart?.result?.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            width: `calc(${chart.chartInfo.width}px / ${chart?.result.length})`,
            height: "calc(100% - 50px)",
            flexGrow: 1,
            // rotate: "90deg",
          }}
        >
          <ResponsiveLine
            tooltip={(data) => {
              let value = data?.point?.data?.y;
              let value_type = chart?.chartInfo?.tooltip_value_type ?? "absolute"
              let total = data?.point?.data?.z;
              let floating_points = chart?.chartInfo?.value_floating_points || 2
              let color = data?.color;
              let id = data?.point?.serieId;
              // console.log({ _d: data });
              return <CustomTooltip value={value} id={id} color={color} total={total} value_type={value_type} floating_points={floating_points}/>;
            }}
            data={info}
            margin={{ top: 20, right: 30, bottom: 150, left: 80 }}
            theme={responsiveTheme}
            colors={
              queryHasColors
                ? (i) => {
                  console.log({info})
                    return chart?.chartInfo?.colors_results?.[i?.id];
                  }
                : { scheme: colorScheme }
            }
            enableArea={chart?.chartInfo?.enableArea ?? false}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              stacked: false,
              reverse: false,
            }}
            pointSize={8}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 10,
              tickPadding: 5,
              tickRotation: 90,

              legend: chart?.chartInfo?.x_axis
                ? t(chart?.chartInfo?.x_axis).toUpperCase()
                : "",
              legendOffset: 60,
              legendPosition: "middle"
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: chart?.chartInfo?.y_axis
                ? t(chart?.chartInfo?.y_axis).toUpperCase()
                : t("count").toUpperCase(),
              legendOffset: -40,
              legendPosition: "middle",
            }}
            useMesh={true}
            // enableSlices={chart?.chartInfo?.enableSlices ?? "x"}
            // enableSlices={"y"}
            // tooltip={(value) => {
            //   console.log({ value });
            //   return <CustomTooltip value={value} />;
            // }}
            legends={responsiveLegends}
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
