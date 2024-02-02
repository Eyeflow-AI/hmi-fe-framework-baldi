import { useEffect, useMemo, useState } from "react";

// Design
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Third party
import { ResponsivePie } from "@nivo/pie";
import { colors, dateFormat } from "sdk-fe-eyeflow";
import { useTranslation } from "react-i18next";
import { cloneDeep } from "lodash";
import { ResponsiveBar } from "@nivo/bar";

// Internal
import ImageCard from "../../ImageCard";
import GetRunQuery from "../../../utils/Hooks/GetRunQuery";

const ITEM_WIDTH = 400;
const ITEM_HEIGHT = 300;

const styleSx = {
  mainBoxSx: Object.assign({}, window.app_config.style.box, {
    bgcolor: "background.paper",
    display: "flex",
    justifyContent: "space-evenly",
    // paddingRight: 1,
    position: "relative",
  }),
  graphBoxSx: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: `${ITEM_WIDTH - 80}px`,
    justifyContent: "center",
    padding: 1,
    gap: 1,
    alignItems: "center",
    // justifyContent: 'space-evenly',
    // width: '100%',
    // flexGrow: 1,
    // border: '1px solid #000000',
    // position: 'relative',
  },
  pieBoxSx: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: ITEM_HEIGHT,
    width: ITEM_WIDTH,
  },
  imageBoxSx: {
    display: "block",
    margin: "auto",
  },
  cardBoxSx: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // maxHeight: `min(${ITEM_HEIGHT}px, 50%)`,
    // maxWidth: `min(${ITEM_WIDTH}px, 50%)`,
    // width: '100%',
  },
};

const responsivePieTheme = {
  tooltip: {
    container: {
      background: colors.paper.blue.dark,
    },
  },
  labels: {
    text: {
      fontSize: 21,
      fill: "#ffffff",
      textShadow: "1px 1px 2px #353535",
    },
  },
};

const responsivePieLegends = [
  {
    anchor: "left",
    direction: "column",
    justify: false,
    // translateY: 56,
    translateX: -80,
    itemsSpacing: 10,
    itemWidth: 80,
    itemHeight: 18,
    itemTextColor: "#999",
    itemDirection: "left-to-right",
    itemOpacity: 1,
    symbolSize: 18,
    symbolShape: "circle",
    // effects: [
    //   {
    //     on: 'hover',
    //     style: {
    //       itemTextColor: '#000'
    //     }
    //   }
    // ]
  },
];

const responsiveBarLegends = [
  {
    dataFrom: "keys",
    anchor: "bottom",
    direction: "column",
    // justify: false,
    translateX: 20,
    translateY: 50,
    itemsSpacing: 2,
    itemWidth: 150,
    itemTextColor: "#999",
    itemHeight: 18,
    itemDirection: "left-to-right",
    // itemOpacity: 0.85,
    symbolSize: 18,
    symbolShape: "circle",

    // effects: [
    //     {
    //         on: 'hover',
    //         style: {
    //             itemOpacity: 1
    //         }
    //     }
    // ]
  },
];

export default function MetalStampingBox({ data, config }) {
  const { t } = useTranslation();

  const { queryResponse: qrLastHourDataParts } = GetRunQuery({
    data: config?.lastHour?.queryParts,
    stationId: config?.stationId,
    sleepTime: 30000,
    run: config?.lastHour?.show,
  });
  const [lastHourDataPartsData, setLastHourDataPartsData] = useState([]);
  const showLastAnomaly = config?.lastAnomaly?.show

  const { queryResponse: qrLastHourDataAnomalies } = GetRunQuery({
    data: config?.lastHour?.queryAnomalies,
    stationId: config?.stationId,
    sleepTime: 30000,
    run: config?.lastHour?.show,
  });
  const [lastHourDataAnomaliesData, setLastHourDataAnomaliesData] = useState(
    []
  );

  const { queryResponse: qrTwentyFourHoursDataParts } = GetRunQuery({
    data: config?.last24Hours?.queryParts,
    stationId: config?.stationId,
    sleepTime: 30000,
    run: config?.last24Hours?.show,
  });
  const [twentyFourHoursDataPartsData, setTwentyFourHoursDataPartsData] =
    useState([]);

  const { queryResponse: qrTwentyFourHoursDataAnomalies } = GetRunQuery({
    data: config?.last24Hours?.queryAnomalies,
    stationId: config?.stationId,
    sleepTime: 30000,
    run: config?.last24Hours?.show,
  });
  const [
    twentyFourHoursDataAnomaliesData,
    setTwentyFourHoursDataAnomaliesData,
  ] = useState([]);

  let { selectedCamera } = useMemo(() => {
    let selectedCamera = config?.selected_camera ?? null;
    if (!selectedCamera) {
      console.error("No camera selected in config");
    }
    return { selectedCamera };
  }, [config]);

  let {
    imageData,
    anomalyImageData,
    partsPieData,
    anomaliesBarData,
    totalBoxes,
    currentBox,
    totalParts,
  } = useMemo(() => {
    let partsOk = data?.batch_data?.parts_ok ?? 0;
    let partsNg = data?.batch_data?.parts_ng ?? 0;
    let partsPieData = [];
    if (partsOk || partsNg) {
      partsPieData = [
        {
          id: "OK",
          label: "OK",
          value: partsOk,
          color: colors.eyeflow.green.light,
        },
        {
          id: "NG",
          label: "NG",
          value: partsNg,
          color: colors.eyeflow.red.dark,
        },
      ];
    }

    let anomaliesBarData = [];
    if (partsNg) {
      if (data?.batch_data?.hasOwnProperty("defects_count")) {
        for (let [classId, value] of Object.entries(
          data.batch_data.defects_count
        )) {
          if (value > 0) {
            let data = {
              id: classId,
              label: classId, //TODO get class label
              value,
              [classId]: value,
            };
            anomaliesBarData.push(data);
            // anomaliesBarData.push({
            //   // id: classId,
            //   // label: classId, //TODO get class label
            //   // 'ok': value,
            //   value,
            //   // color: TODO
            // });
          }
        }
        anomaliesBarData.sort((a, b) => b.label - a.label);
      }
    }

    let imageData = null;
    let lastInspectionData = data?.batch_data?.last_inspection;
    if (selectedCamera && lastInspectionData) {
      imageData = cloneDeep(
        lastInspectionData?.images?.find(
          (image) => image.camera_name === selectedCamera
        )
      );
      if (!imageData) {
        console.error(`No image data for camera ${selectedCamera}`);
      } else if (!imageData.image_url) {
        imageData = null;
        console.error(`No image url for camera ${selectedCamera}`);
      } else {
        imageData.event_time = dateFormat(lastInspectionData?.event_time);
        // imageData.event_time = lastInspectionData?.event_time;
      }
    }
    let anomalyImageData = cloneDeep(
      data?.batch_data?.last_anomaly?.images?.[0]
    );
    if (data?.batch_data?.last_anomaly?.event_time) {
      anomalyImageData.event_time = dateFormat(
        data.batch_data.last_anomaly.event_time
      );
    }
    // TODO select anomaly image

    let totalBoxes = data?.info?.total_packs ?? 0;
    let currentBox = 0;
    let totalParts = 0;
    if (data?.batch_data) {
      let sumParts = (!isNaN(data?.batch_data?.parts_ok) ? data?.batch_data?.parts_ok : 0) + (!isNaN(data?.batch_data?.parts_ng) ? data?.batch_data?.parts_ng : 0);
      currentBox = Math.ceil(sumParts / data?.info?.parts_per_pack);
      if (!(typeof currentBox === "number" && isFinite(currentBox) && currentBox >= 0)) {
        currentBox = 0;
      }
      
      totalParts = sumParts;
    }

    return {
      imageData,
      anomalyImageData,
      partsPieData,
      anomaliesBarData,
      totalBoxes,
      currentBox,
      totalParts,
    };
  }, [selectedCamera, data]);

  // let twentyFourHoursDataAnomaliesMemo = useMemo(() => {
  //   let twentyFourHoursDataAnomalies = queryResponse?.result ?? [];
  //   if (twentyFourHoursDataAnomalies.length > 0) {
  //     twentyFourHoursDataAnomalies = twentyFourHoursDataAnomalies.map(anomaly => {
  //       anomaly.event_time = dateFormat(anomaly.event_time);
  //       return anomaly;
  //     });
  //   }
  //   return twentyFourHoursDataAnomalies;
  // }, [twentyFourHoursDataAnomalies]);

  useEffect(() => {
    if (qrTwentyFourHoursDataAnomalies) {
      let data = qrTwentyFourHoursDataAnomalies
        .filter((el) => el.count > 0)
        .map((el) => {
          return {
            id: el._id,
            label: el._id,
            value: el.count,
            [el._id]: el.count,
          };
        });
      // data.sort((a, b) => b.label - a.label);
      setTwentyFourHoursDataAnomaliesData(data);
    }
  }, [qrTwentyFourHoursDataAnomalies]);

  useEffect(() => {
    if (qrTwentyFourHoursDataParts) {
      let partsOk = qrTwentyFourHoursDataParts?.[0]?.totalPartsOK ?? 0;
      let partsNg = qrTwentyFourHoursDataParts?.[0]?.totalPartsNG ?? 0;
      let partsPieData = [];
      if (partsOk || partsNg) {
        partsPieData = [
          {
            id: "OK",
            label: "OK",
            value: partsOk,
            color: colors.eyeflow.green.light,
          },
          {
            id: "NG",
            label: "NG",
            value: partsNg,
            color: colors.eyeflow.red.dark,
          },
        ];
      }
      setTwentyFourHoursDataPartsData(partsPieData);
    }
  }, [qrTwentyFourHoursDataParts]);

  useEffect(() => {
    if (qrLastHourDataParts) {
      let partsOk = qrLastHourDataParts?.[0]?.totalPartsOK ?? 0;
      let partsNg = qrLastHourDataParts?.[0]?.totalPartsNG ?? 0;
      let partsPieData = [];
      if (partsOk || partsNg) {
        partsPieData = [
          {
            id: "OK",
            label: "OK",
            value: partsOk,
            color: colors.eyeflow.green.light,
          },
          {
            id: "NG",
            label: "NG",
            value: partsNg,
            color: colors.eyeflow.red.dark,
          },
        ];
      }
      setLastHourDataPartsData(partsPieData);
    }
  }, [qrLastHourDataParts]);

  useEffect(() => {
    if (qrLastHourDataAnomalies) {
      let data = qrLastHourDataAnomalies
        .filter((el) => el.count > 0)
        .map((el) => {
          return {
            id: el._id,
            label: el._id,
            value: el.count,
            [el._id]: el.count,
          };
        });
      // data.sort((a, b) => b.label - a.label);
      setLastHourDataAnomaliesData(data);
    }
  }, [qrLastHourDataAnomalies]);

  return (
    <Box
      width={config?.width ?? "calc(100vw - 412px)"}
      height={config?.height ?? "100%"}
      // height={'941px'}
      sx={styleSx.mainBoxSx}
    >
      <Box id="graph-box" sx={styleSx.graphBoxSx}>
        <Box sx={styleSx.pieBoxSx}>
          <Box
            sx={{
              // position: 'absolute',
              top: 0,
              left: 0,
              // border: '1px solid #000000',
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "calc(100% - 10px)",
              // flexGrow: 1,
              // height: 'calc(100% - 10px)',
              width: "calc(100% - 100px)",
            }}
          >
            <Box
              sx={{
                top: 0,
                left: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "calc(100%)",
                width: "calc(100%)",
                flexDirection: "column",
              }}
            >
              {/* <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "calc(100% - 2rem)",
                  width: "calc(100%)",
                }}
              >
                <ResponsivePie
                  colors={{ datum: "data.color" }}
                  data={partsPieData}
                  margin={{ top: 50, right: 60, bottom: 100, left: 100 }}
                  theme={responsivePieTheme}
                  legends={responsivePieLegends}
                />
              </Box> */}
              {/* <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "2rem",
                  width: "18rem",
                  marginTop: "-50px",
                  border: "1px solid #000000",
                  boxShadow: "0px 0px 10px 0px #000000",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {t("box")}: {currentBox}/{totalBoxes}
                </Typography>
              </Box> */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "8rem",
                  width: "18rem",
                  marginTop: "20px",
                  border: "1px solid #000000",
                  boxShadow: "0px 0px 10px 0px #000000",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {t("box")}:
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {currentBox}/{totalBoxes}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "8rem",
                  width: "18rem",
                  marginTop: "20px",
                  border: "1px solid #000000",
                  boxShadow: "0px 0px 10px 0px #000000",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {t("parts")}:
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {totalParts}
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* {anomaliesBarData && anomaliesBarData.length > 0 && (
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "calc(100%)",
                  width: "calc(50%)",
                }}
              >
                <ResponsiveBar
                  data={anomaliesBarData}
                  arcLinkLabelsStraightLength={0}
                  // arcLabelsSkipAngle={10}
                  // arcLinkLabelsSkipAngle={10}
                  // labelSkipWidth={12}
                  padding={0.3}
                  margin={{ top: 50, right: 20, bottom: 70, left: 100 }}
                  // theme={responsivePieTheme}
                  // legends={responsivePieLegends}
                  indexBy="label"
                  keys={anomaliesBarData.map((d) => d.label)}
                  // legends={responsiveBarLegends}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    // legend: 'count',
                    legendOffset: -40,
                    legendPosition: "middle",
                  }}
                  yScale={{
                    type: "linear",
                    // min: 0,
                    max: "auto",
                    // max: 2,
                    stacked: false,
                    reverse: false,
                  }}
                  theme={Object.assign({}, responsivePieTheme, {
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
                  })}
                />
              </Box>
            )} */}
          </Box>
        </Box>

        {config?.lastHour?.show && lastHourDataPartsData?.length > 0 && (
          <Box sx={styleSx.pieBoxSx}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "15px",
              }}
            >
              <Typography
                textTransform="uppercase"
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                {t("last_hour")}
              </Typography>
            </Box>
            <Box
              sx={{
                // position: 'absolute',
                top: 0,
                left: 0,
                // border: '1px solid #000000',
                display: "flex",
                justifyContent: "center",
                height: "calc(100% - 25px)",
                alignItems: "center",
                width: "calc(100% - 100px)",
              }}
            >
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "calc(100%)",
                  width: "calc(50%)",
                }}
              >
                <ResponsivePie
                  colors={{ datum: "data.color" }}
                  data={lastHourDataPartsData}
                  margin={{ top: 50, right: 20, bottom: 70, left: 100 }}
                  theme={responsivePieTheme}
                  legends={responsivePieLegends}
                />
              </Box>
              {lastHourDataAnomaliesData.length > 0 && (
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "calc(100%)",
                    width: "calc(50%)",
                  }}
                >
                  <ResponsiveBar
                    data={lastHourDataAnomaliesData}
                    arcLinkLabelsStraightLength={0}
                    // arcLabelsSkipAngle={10}
                    // arcLinkLabelsSkipAngle={10}
                    // labelSkipWidth={12}
                    padding={0.2}
                    margin={{ top: 50, right: 20, bottom: 70, left: 100 }}
                    // theme={responsivePieTheme}
                    // legends={responsivePieLegends}
                    indexBy="label"
                    keys={lastHourDataAnomaliesData.map((d) => d.label)}
                    // legends={responsiveBarLegends}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      // legend: 'count',
                      legendOffset: -40,
                      legendPosition: "middle",
                    }}
                    yScale={{
                      type: "linear",
                      // min: 0,
                      max: "auto",
                      // max: 2,
                      stacked: false,
                      reverse: false,
                    }}
                    theme={Object.assign({}, responsivePieTheme, {
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
                    })}
                  />
                </Box>
              )}
            </Box>
          </Box>
        )}

        {config?.last24Hours?.show &&
          twentyFourHoursDataPartsData.length > 0 && (
            <Box sx={styleSx.pieBoxSx}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "15px",
                }}
              >
                <Typography
                  textTransform="uppercase"
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  {t("last_24_hours")}
                </Typography>
              </Box>
              <Box
                sx={{
                  // position: 'absolute',
                  top: 0,
                  left: 0,
                  display: "flex",
                  height: "calc(100% - 25px)",
                  justifyContent: "center",
                  alignItems: "center",
                  // height: '100%',
                  width: "calc(100% - 100px)",
                }}
              >
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "calc(100%)",
                    width: "calc(50%)",
                  }}
                >
                  <ResponsivePie
                    colors={{ datum: "data.color" }}
                    data={twentyFourHoursDataPartsData}
                    margin={{ top: 50, right: 20, bottom: 70, left: 100 }}
                    theme={responsivePieTheme}
                    legends={responsivePieLegends}
                  />
                </Box>
                {twentyFourHoursDataAnomaliesData.length > 0 && (
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "calc(100%)",
                      width: "calc(50%)",
                    }}
                  >
                    <ResponsiveBar
                      data={twentyFourHoursDataAnomaliesData}
                      arcLinkLabelsStraightLength={0}
                      // arcLabelsSkipAngle={10}
                      // arcLinkLabelsSkipAngle={10}
                      // labelSkipWidth={12}
                      padding={0.2}
                      margin={{ top: 50, right: 20, bottom: 70, left: 100 }}
                      // theme={responsivePieTheme}
                      // legends={responsivePieLegends}
                      indexBy="label"
                      keys={twentyFourHoursDataAnomaliesData.map(
                        (d) => d.label
                      )}
                      // legends={responsiveBarLegends}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        // legend: 'count',
                        legendOffset: -40,
                        legendPosition: "middle",
                      }}
                      yScale={{
                        type: "linear",
                        // min: 0,
                        max: "auto",
                        // max: 2,
                        stacked: false,
                        reverse: false,
                      }}
                      theme={Object.assign({}, responsivePieTheme, {
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
                      })}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )}
      </Box>
      <Box
        id="image-box"
        sx={styleSx.imageBoxSx}
        // height={`${height}px`}
      >
        {imageData && (
          <Box sx={styleSx.cardBoxSx}>
            <ImageCard
              imageData={imageData}
              eventTime={imageData.event_time}
              title={t("last_inspection")}
            />
          </Box>
        )}

        {showLastAnomaly && anomaliesBarData &&
          anomaliesBarData.length > 0 &&
          anomalyImageData && (
            <Box sx={styleSx.cardBoxSx}>
              <ImageCard
                imageData={anomalyImageData}
                title={t("last_anomaly")}
                eventTime={anomalyImageData.event_time}
                color="error.main"
              />
            </Box>
          )}

        {/* {imageData && (
        <Box>
          <ImageCard imageData={imageData} title={t("last_anomaly")} color="error.main"/>
        </Box>
        )} */}
      </Box>
    </Box>
  );
}
