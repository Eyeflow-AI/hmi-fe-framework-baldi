// React
import React from "react";

// Design
import { Box, Typography } from "@mui/material";

// Internal
import PageWrapper from "../../components/PageWrapper";

// Third-party
import { ResponsivePie } from "@nivo/pie";
import { colors } from "sdk-fe-eyeflow";

const style = {
  mainBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: "background.paper",
    // bgcolor: 'red',
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  }),
};

const CustomTooltip = ({ color, value, id }) => {
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
  );
};

export default function Lab({ pageOptions }) {
  return (
    <PageWrapper>
      {({ width, height }) => (
        <Box width={width} height={height} sx={style.mainBox}>
          <Box
            sx={{
              display: "flex",
              // gap: 0.25,
              width: "100%",
              height: "calc(100% - 550px)",
              // padding: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                width: 1 / 3,
                position: "relative",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" textAlign={"center"}>
                  Produtividade
                </Typography>
              </Box>
              <ResponsivePie
                data={[
                  {
                    id: "ng",
                    label: "ng",
                    value: 33.33,
                    color: "hsl(0, 100%, 50%)",
                  },
                  {
                    id: "ok",
                    label: "ok",
                    value: 66.66,
                    color: "hsl(118, 100%, 50%)",
                  },
                ]}
                margin={{ top: 50, right: 0, bottom: 100, left: 0 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={(item) => {
                  return item.data.color;
                }}
                valueFormat={function (e) {
                  return e + "%";
                }}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                animate={true}
                tooltip={(i) => {
                  let value = i?.datum?.data?.value;
                  let color = i?.datum?.data?.color;
                  let id = i?.datum?.data?.id;
                  return <CustomTooltip color={color} value={value} id={id} />;
                }}
                theme={{
                  labels: {
                    text: {
                      fontSize: 15,
                      fill: "#ffffff",
                      textShadow: "1px 1px 2px #353535",
                    },
                  },
                }}
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    translateY: 56,
                    translateX: 30,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#999",
                    symbolSize: 18,
                    symbolShape: "circle",
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemTextColor: "#000",
                        },
                      },
                    ],
                  },
                ]}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Typography variant="h3">750</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                width: 1 / 3,
                position: "relative",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" textAlign={"center"}>
                  Defeitos
                </Typography>
              </Box>
              <ResponsivePie
                data={[
                  {
                    id: "pico",
                    label: "pico",
                    value: 50,
                    color: "hsl(50, 100%, 50%)",
                  },
                  {
                    id: "amassado",
                    label: "amassado",
                    value: 30,
                    color: "hsl(318, 70%, 50%)",
                  },
                  {
                    id: "material",
                    label: "material",
                    value: 20,
                    color: "hsl(190, 100%, 50%)",
                  },
                ]}
                margin={{ top: 50, right: 0, bottom: 100, left: 0 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={(item) => item.data.color}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                tooltip={(i) => {
                  let value = i?.datum?.data?.value;
                  let color = i?.datum?.data?.color;
                  let id = i?.datum?.data?.id;
                  return <CustomTooltip color={color} value={value} id={id} />;
                }}
                motionDamping={15}
                valueFormat={function (e) {
                  return e + "%";
                }}
                theme={{
                  labels: {
                    text: {
                      fontSize: 15,
                      fill: "#ffffff",
                      textShadow: "1px 1px 2px #353535",
                    },
                  },
                }}
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    translateY: 56,
                    translateX: 30,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#999",
                    symbolSize: 18,
                    symbolShape: "circle",
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemTextColor: "#000",
                        },
                      },
                    ],
                  },
                ]}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Typography variant="h3">1000</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                width: 1 / 3,
                position: "relative",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography variant="h3" textAlign="left">
                  Data:
                </Typography>
                <Typography variant="h4" textAlign="left">
                  2021-09-01
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography variant="h3" textAlign="left">
                  Hora:
                </Typography>
                <Typography variant="h4" textAlign="left">
                  14:42
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography variant="h3" textAlign="left">
                  Sequência:
                </Typography>
                <Typography variant="h4" textAlign="left">
                  140
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography variant="h3" textAlign="left">
                  Datador:
                </Typography>
                <Typography variant="h4" textAlign="left">
                  25
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography variant="h3" textAlign="left">
                  Descrição:
                </Typography>
                <Typography variant="h4" textAlign="left">
                  Porta traseira.
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              // flexDirection: "column",
              gap: 0.25,
              width: "100%",
              height: "550px",
              padding: 2,
              // border: "1px solid red",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                height: "100%",
                // grayscale
                // filter: "grayscale(100%)",
              }}
            >
              <img
                src="/assets/carro_pontos.png"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  // filter: "grayscale(0%)",
                }}
              />
            </Box>
          </Box>
        </Box>
      )}
    </PageWrapper>
  );
}
