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

export default function EventMenuList({
  events,
  selectedEventId,
  loadingData,
  onClick,
  dateField,
  itemMenuHeight,
  conveyorIcon,
  examplesList,
  maskMapURL,
}) {
  const { t } = useTranslation();

  const eventsLength = events?.length ?? 0;

  function ItemRenderer({ index, style }) {
    let eventData = events[index];
    let eventIndex = eventData?.index ?? 0;
    let selected = selectedEventId === eventData._id;
    let part_id = eventData.part_id;
    let image = examplesList.find((el) => {
      let partId = el?.annotations?.part_data?.part_id;
      return partId === part_id;
    });
    let url = `${maskMapURL}/${image?.example}`;

    // url = url.replace("192.168.0.201", "192.168.2.40");
    // console.log({ url, examplesList });
    let currentIcon = image ? url : conveyorIcon;
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

    const onEventClick = () => onClick(eventData._id);

    return (
      <div key={`item-${index}`} style={customStyle}>
        <CarouselItem
          index={eventIndex}
          dateField={dateField}
          eventData={eventData}
          selected={selected}
          onClick={onEventClick}
          conveyorIcon={currentIcon}
        />
      </div>
    );
  }

  return (
    <Box id="list-box" sx={styleSx.listBox}>
      {eventsLength === 0 && loadingData ? (
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
          {eventsLength === 0 ? (
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
                  itemCount={eventsLength}
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
