// React
import React from "react";

import Box from "@mui/material/Box";

import { ResponsivePie } from "@nivo/pie";
import Typography from "@mui/material/Typography";
import { colors } from "sdk-fe-eyeflow";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActions } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
const style = {
  dataBoxSx: Object.assign({}, window.app_config.style.box, {
    bgcolor: "background.paper",
    display: "flex",
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

export default function CarrouselBox({ data, config }) {
  return (
    <Box
      width={config?.width ?? "calc(100vw - 502px)"}
      height={config?.height ?? "100%"}
      sx={style.dataBoxSx}
    >
      {/* {JSON.stringify(data, null, 40)} */}
      <Box
        sx={{
          display: "flex",
          // gap: 0.25,
          width: "100%",
          height: "calc(100% - 500px)",
          // padding: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            width: 1 / 4,
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
            width: 1 / 4,
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
            width: 1 / 4,
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
              Qualidade
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
            flexDirection: "column",
            width: 1 / 4,
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
          <Box
            sx={{
              display: "flex",
              // border: "1px solid white",
              width: "100%",
              height: "60px",
              // backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              gap: 0,
              padding: 0,
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                // border: "1px solid green",
                width: "100%",
                height: "100%",
                // backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                gap: 0,
                padding: 0,
                flexDirection: "row",
              }}
            >
              {Array.from({ length: 100 }).map((_, i) => {
                let color = Math.random() > 0.9 ? "red" : "green";
                let pixel = Math.ceil((1 / 100) * 100) * 20;
                return (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      width: `${pixel}px`,
                      height: "20px",
                      backgroundColor: color,
                    }}
                  />
                );
              })}
            </Box>
            <Box
              sx={{
                display: "flex",
                // border: "1px solid yellow",
                width: "100%",
                height: "100%",
                // backgroundColor: "white",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 0,
                paddingRight: 1,
                flexDirection: "row",
              }}
            >
              <Typography>400</Typography>
              <Typography>300</Typography>
              <Typography>200</Typography>
              <Typography>100</Typography>
              <Typography>0</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          // flexDirection: "column",
          gap: 0.25,
          width: "100%",
          height: "500px",
          padding: 2,
          // border: "1px solid red",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ArrowBackIosIcon />
        </Box>
        {Array.from({ length: 5 }).map((_, i) => {
          let reverseIndex = 5 - i;
          let color = Math.random() > 0.5 ? "red" : "green";
          let image =
            color === "red" ? "/assets/carro_pontos.png" : "/assets/carro.png";
          return (
            <Card
              key={i}
              sx={{
                display: "flex",
                // width: "450px",
                height: "100%",
                flexDirection: "column",
                gap: 0.25,
                padding: 1,
                backgroundColor:
                  Math.random() > 0.5
                    ? colors.eyeflow.red.dark
                    : colors.eyeflow.green.dark,
                // margin: "1 1 10 1",
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={image}
                alt="green iguana"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
              <CardActions>
                <Typography variant="h6" textAlign={"center"}>
                  Seq {reverseIndex}
                </Typography>
              </CardActions>
            </Card>
          );
        })}
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ArrowForwardIosIcon />
        </Box>
      </Box>
    </Box>
  );
}
