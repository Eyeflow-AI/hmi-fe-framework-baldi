import React, { useEffect, useState } from "react";

import { LabelBox, FilterBox, LayoutBox } from "./Box";
import { ImageCard } from "./Card";
import { Carousel, CarouselItem, CarouselWithQuery } from "./Carousel";
import { Bar, DivergingBar, Funnel, Line, Pie } from "./Chart";
import { Select } from "./Select";
import { TextField } from "./Field";
import { Image, Title, Table } from "./General";
import { Tooltip } from "./Wrapper";

import Box from "@mui/material/Box";

const store = {
  LabelBox: (props) => <LabelBox {...props} />,
  FilterBox: (props) => <FilterBox {...props} />,
  LayoutBox: (props) => <LayoutBox {...props} />,

  ImageCard: (props) => <ImageCard {...props} />,

  Carousel: (props) => <Carousel {...props} />,
  CarouselItem: (props) => <CarouselItem {...props} />,
  CarouselWithQuery: (props) => <CarouselWithQuery {...props} />,

  Bar: (props) => <Bar {...props} />,
  DivergingBar: (props) => <DivergingBar {...props} />,
  Funnel: (props) => <Funnel {...props} />,
  Line: (props) => <Line {...props} />,
  Pie: (props) => <Pie {...props} />,

  Select: (props) => <Select {...props} />,

  TextField: (props) => <TextField {...props} />,

  Image: (props) => <Image {...props} />,
  Title: (props) => <Title {...props} />,
  Table: (props) => <Table {...props} />,

  Tooltip: (props) => <Tooltip {...props} />,
};

export default function LayoutConstructor({
  config,
  componentsInfo,
  setComponentsInfo,
}) {
  const [toBeShown, setToBeShown] = useState(null);
  console.log({ layout: setComponentsInfo });

  useEffect(() => {
    let component = null;
    component = config?.components?.map((item, index) => {
      console.log({ map: item, componentsInfo });
      try {
        return store[item.tag]({ ...item, componentsInfo, setComponentsInfo });
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
          >
            Missing component: {item.tag}
          </Box>
        );
      }
    });
    setToBeShown(component);
  }, [config, componentsInfo]);
  return toBeShown;
}
