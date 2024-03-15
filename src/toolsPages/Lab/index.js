// React
import React from "react";

// Design
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import BlockIcon from "@mui/icons-material/Block";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import TextField from "@mui/material/TextField";
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
              width: "100%",
              height: "80px",
              display: "flex",
              // flexDirection: "column",
              justifyContent: "center",
              gap: 2,
              alignItems: "center",
              // border: "1px solid",
            }}
          >
            <TextField
              // disabled
              id="outlined-disabled"
              label="Data"
              defaultValue="2021-09-01"
            />
            <TextField
              // disabled
              id="outlined-disabled"
              label="Hora"
              defaultValue="14:42"
            />
            <TextField
              // disabled
              id="outlined-disabled"
              label="Sequência"
              defaultValue="140"
            />
            <TextField
              // disabled
              id="outlined-disabled"
              label="Datador"
              defaultValue="25"
            />
            <TextField
              // disabled
              id="outlined-disabled"
              label="Descrição"
              defaultValue="Porta traseira."
            />
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "calc(100% - 80px)",
              display: "flex",
              // flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              // border: "1px solid",
            }}
          >
            <Box
              sx={{
                width: "400px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  position: "relative",
                  height: 1 / 4,
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
                    Produtividade (750)
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
                  borderColor={{
                    from: "color",
                    modifiers: [["darker", 0.2]],
                  }}
                  animate={true}
                  tooltip={(i) => {
                    let value = i?.datum?.data?.value;
                    let color = i?.datum?.data?.color;
                    let id = i?.datum?.data?.id;
                    return (
                      <CustomTooltip color={color} value={value} id={id} />
                    );
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
              </Box>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  height: 1 / 4,
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
                    Defeitos (1000)
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
                  borderColor={{
                    from: "color",
                    modifiers: [["darker", 0.2]],
                  }}
                  tooltip={(i) => {
                    let value = i?.datum?.data?.value;
                    let color = i?.datum?.data?.color;
                    let id = i?.datum?.data?.id;
                    return (
                      <CustomTooltip color={color} value={value} id={id} />
                    );
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
              </Box>
              <Box
                sx={{
                  display: "flex",
                  height: 1 / 4,
                  width: "100%",
                  position: "relative",
                  flexDirection: "column",
                  display: "flex",
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
                    Qualidade (1000)
                  </Typography>
                </Box>
                <ResponsivePie
                  data={[
                    {
                      id: "falha b1",
                      label: "falha b1",
                      value: 50,
                      color: "hsl(211, 12%, 48%)",
                    },
                    {
                      id: "falha b",
                      label: "falha b",
                      value: 30,
                      color: "hsl(14, 49%, 40%)",
                    },
                    {
                      id: "falha c",
                      label: "falha c",
                      value: 20,
                      color: "hsl(15, 35%, 10%)",
                    },
                    {
                      id: "falha c1",
                      label: "falha c1",
                      value: 20,
                      color: "hsl(14, 83%, 40%)",
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
                    return (
                      <CustomTooltip color={color} value={value} id={id} />
                    );
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
              </Box>
              <Box
                sx={{
                  display: "flex",
                  height: 1 / 4,
                  width: "100%",
                  position: "relative",
                  flexDirection: "column",
                  display: "flex",
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
            <Box
              sx={{
                width: "calc(100% - 400px)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                // border: "1px solid",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  flexDirection: "column",
                  // grayscale
                  // filter: "grayscale(100%)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexGrow: 1,
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
                <Box
                  sx={{
                    display: "flex",
                    // flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "80px",
                    gap: 1,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<CheckBoxIcon />}
                  >
                    <Typography variant="h4">Corrigido</Typography>
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<BlockIcon />}
                  >
                    <Typography variant="h4">Scrap</Typography>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </PageWrapper>
  );
}

// <Box
// sx={{
//   display: "flex",
//   flexGrow: 1,
//   height: 1 / 2,
//   width: 1 / 3,
//   position: "relative",
//   flexDirection: "column",
// }}
// >
// <Box
//   sx={{
//     width: "100%",
//     height: "100%",
//     display: "flex",
//     justifyContent: "flex-start",
//     alignItems: "center",
//   }}
// >
//   <Typography variant="h3" textAlign="left">
//     Data:
//   </Typography>
//   <Typography variant="h4" textAlign="left">
//     2021-09-01
//   </Typography>
// </Box>
// <Box
//   sx={{
//     width: "100%",
//     height: "100%",
//     display: "flex",
//     justifyContent: "flex-start",
//     alignItems: "center",
//   }}
// >
//   <Typography variant="h3" textAlign="left">
//     Hora:
//   </Typography>
//   <Typography variant="h4" textAlign="left">
//     14:42
//   </Typography>
// </Box>
// <Box
//   sx={{
//     width: "100%",
//     height: "100%",
//     display: "flex",
//     justifyContent: "flex-start",
//     alignItems: "center",
//   }}
// >
//   <Typography variant="h3" textAlign="left">
//     Sequência:
//   </Typography>
//   <Typography variant="h4" textAlign="left">
//     140
//   </Typography>
// </Box>
// <Box
//   sx={{
//     width: "100%",
//     height: "100%",
//     display: "flex",
//     justifyContent: "flex-start",
//     alignItems: "center",
//   }}
// >
//   <Typography variant="h3" textAlign="left">
//     Datador:
//   </Typography>
//   <Typography variant="h4" textAlign="left">
//     25
//   </Typography>
// </Box>
// <Box
//   sx={{
//     width: "100%",
//     height: "100%",
//     display: "flex",
//     justifyContent: "flex-start",
//     alignItems: "center",
//   }}
// >
//   <Typography variant="h3" textAlign="left">
//     Descrição:
//   </Typography>
//   <Typography variant="h4" textAlign="left">
//     Porta traseira.
//   </Typography>
// </Box>
// </Box>
