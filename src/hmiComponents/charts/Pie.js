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
import { ResponsivePie } from "@nivo/pie";
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
export default function Bar({ chart }) {
  const { t } = useTranslation();
  const [info, setInfo] = useState([]);
  // const [keys, setKeys] = useState([]);
  // const [queryHasColors, setQueryHasColors] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [totalEl, setTotalEl] = useState(0);
  const [colorScheme, setColorScheme] = useState("nivo")
  const [responsivePieLegends, setResponsivePieLegends] = useState([
    {
      anchor: "bottom",
      direction: "row",
      justify: false,
      translateY: 56,
      itemsSpacing: 5,
      itemWidth: 100,
      itemHeight: 18,
      itemTextColor: "white",
      itemDirection: "left-to-right",
      itemOpacity: 1,
      symbolSize: 12,
      symbolShape: "circle",
      // effects: [
      //     {
      //         on: 'hover',
      //         style: {
      //             itemTextColor: '#000'
      //         }
      //     }
      // ]
    },
  ]);
  const [responsiveTheme, setResponsiveTheme] = useState({
    tooltip: {
      container: {
        background: colors.paper.blue.dark,
      },
    },
    labels: {
      text: {
        fontSize: 15,
        fill: "#ffffff",
        textShadow: "1px 1px 2px #353535",
      },
    },
    legends: {
      text: {
        fontSize: 15,
        fill: "#ffffff",
      }
    },
  });

  useEffect(() => {
    if (!chart?.result?.length) return;
    else {
      setTotalEl(chart.result[0].total)
      // let newKeys = chart.result.map((item) => item._id);
      let data = chart.result;
      let newInfo = [];
      data.forEach((item) => {
        let _item = {
          id: item._id,
          label: item._id,
          [item._id]: item.value,
          value: item.value,
          total: item.total
        };
        if (
          Object.keys(chart?.chartInfo?.colors_results ?? {}).length > 0 &&
          chart?.chartInfo?.colors_results?.[item._id] !== undefined
        ) {
          _item.color = chart.chartInfo.colors_results[item._id];
        }
        newInfo.push(_item);
      });
      newInfo.sort((a, b) => a.id?.localeCompare(b.id));
      setInfo(newInfo);
      // setKeys(newKeys);
      // setQueryHasColors(Object.keys(chart?.chartInfo?.colors_results ?? {}).length > 0 ? true : false);
    }

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
        setResponsivePieLegends([])
      } else {
        _responsiveTheme.legends.text.fontSize = chart?.chartInfo?.legend_font_size;
        responsivePieLegends[0].symbolSize = (chart?.chartInfo?.legend_font_size - 5) > 0 ? (chart?.chartInfo?.legend_font_size - 5) : chart?.chartInfo?.legend_font_size;
      }
    }
    setResponsiveTheme(_responsiveTheme);
    // setData(chart.result)
  }, [chart]);

  // console.log({ chart, info })

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
      {chart?.result.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            width: `calc(${chart.chartInfo.width}px / ${chart?.result.length})`,
            height: "calc(100% - 50px)",
            flexGrow: 1,
          }}
        >
          <ResponsivePie
            data={info}
            arcLinkLabelsStraightLength={0}
            arcLabelsSkipAngle={10}
            arcLinkLabelsSkipAngle={10}
            margin={{ top: 100, right: 10, bottom: 100, left: 100 }}
            theme={responsiveTheme}
            legends={responsivePieLegends}
            colors={
              info.every((item) => item.color)
                ? info.map((item) => item.color)
                : { scheme: colorScheme }
            }
            tooltip={(info) => {
              let value = info.datum.data.value;
              let color = info.datum.color;
              let floating_points = chart?.chartInfo?.value_floating_points || 2;
              let graph_value_type = chart?.chartInfo?.value_type ?? "percentage"
              let total = info.datum.data.total;
              let value_type = 
              chart?.chartInfo?.tooltip_value_type ? chart?.chartInfo?.tooltip_value_type : (graph_value_type === "absolute" ? "percentage" : "absolute")
              let id = info.datum.data.id;
              return <CustomTooltip color={color} value={value} id={id} total={total} value_type={value_type} floating_points={floating_points}/>;
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
