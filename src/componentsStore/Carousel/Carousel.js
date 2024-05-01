// React
import React, { Fragment } from "react";

//Design
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

//Internal
import CarouselItem from "./CarouselItem";

//Third-party
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useTranslation } from "react-i18next";

const styleSx = {
  listBox: {
    height: "100%",
    boxShadow: "inset 0 2px 4px #00000040",
    margin: 1,
    alignItems: "center",
    borderRadius: window.app_config.style.box.borderRadius,
    bgcolor: "background.paperLighter",
  },
};

export default function Carousel({
  data,
  selectedItem,
  loadingData,
  onClick,
  dateField,
  itemMenuHeight = 200,
  conveyorIcon,
  setComponentsInfo,
}) {
  const { t } = useTranslation();
  console.log({ Carousel: selectedItem });

  const dataLength = data?.output?.length ?? 0;

  function ItemRenderer({ index, style }) {
    let item = data?.output?.[index];
    let selected = selectedItem?._id === item?._id;
    const customStyle = Object.assign(
      {
        display: "flex",
        justifyContent: "center",
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 2,
        paddingBottom: 2,
      },
      style
    );

    let onItemClick = () => {};

    if (onClick) {
      onItemClick = () => onClick(item);
    } else {
      onItemClick = () => {}; // a fazer
    }

    return (
      <div key={`item-${index}`} style={customStyle}>
        <CarouselItem
          data={item}
          selected={selected}
          onClick={onItemClick}
          conveyorIcon={conveyorIcon}
        />
      </div>
    );
  }

  return (
    <Box id="list-box" sx={styleSx.listBox}>
      {loadingData ? (
        <Box
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          {`${t("loading")}...`}
          <CircularProgress />
        </Box>
      ) : (
        <Fragment>
          {dataLength === 0 ? (
            <Box
              height="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {t("no_data")}
            </Box>
          ) : (
            <AutoSizer>
              {({ height, width }) => (
                <List
                  height={height}
                  width={width}
                  itemSize={itemMenuHeight}
                  itemCount={dataLength}
                >
                  {ItemRenderer}
                </List>
              )}
            </AutoSizer>
          )}
        </Fragment>
      )}
    </Box>
  );
}
