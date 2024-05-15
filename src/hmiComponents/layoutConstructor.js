import React, { useEffect, useState } from "react";

import { LabelBox, FilterBox, LayoutBox } from "./store/Box";
import { ImageCard } from "./store/Card";
import {
  Carousel,
  CarouselItem,
  CarouselWithQuery,
  SimplifiedCarousel,
} from "./store/Carousel";
import { Bar, DivergingBar, Funnel, Line, Pie } from "./charts";
import { Select, Autocomplete } from "./store/Select";
import { TextField } from "./store/Field";
import { Image, Title, Table, Button } from "./store/General";
import { Tooltip } from "./store/Wrapper";

import Box from "@mui/material/Box";

const store = {
  LabelBox: (props) => <LabelBox {...props} />,
  FilterBox: (props) => <FilterBox {...props} />,
  LayoutBox: (props) => <LayoutBox {...props} />,

  ImageCard: (props) => <ImageCard {...props} />,

  Carousel: (props) => <Carousel {...props} />,
  CarouselItem: (props) => <CarouselItem {...props} />,
  CarouselWithQuery: (props) => <CarouselWithQuery {...props} />,
  SimplifiedCarousel: (props) => <SimplifiedCarousel {...props} />,

  Bar: (props) => <Bar {...props} />,
  DivergingBar: (props) => <DivergingBar {...props} />,
  Funnel: (props) => <Funnel {...props} />,
  Line: (props) => <Line {...props} />,
  Pie: (props) => <Pie {...props} />,

  Select: (props) => <Select {...props} />,
  Autocomplete: (props) => <Autocomplete {...props} />,

  TextField: (props) => <TextField {...props} />,

  Image: (props) => <Image {...props} />,
  Title: (props) => <Title {...props} />,
  Table: (props) => <Table {...props} />,
  Button: (props) => <Button {...props} />,

  Tooltip: (props) => <Tooltip {...props} />,
};

export default function LayoutConstructor({
  config,
  componentsInfo,
  setComponentsInfo,
  stationId,
}) {
  const [toBeShown, setToBeShown] = useState(null);
  console.log({ layout: setComponentsInfo });

  useEffect(() => {
    let component = null;
    component = config?.components?.map((item, index) => {
      console.log({ map: item, componentsInfo });
      try {
        return store[item.tag]({
          ...item,
          componentsInfo,
          setComponentsInfo,
          stationId,
          key: index,
        });
      } catch (err) {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
              backgroundColor: "error.main",
            }}
            key={index}
          >
            Missing component: {item.tag}
            Error: {err.message}
          </Box>
        );
      }
    });
    setToBeShown(component);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, componentsInfo]);
  return toBeShown;
}
