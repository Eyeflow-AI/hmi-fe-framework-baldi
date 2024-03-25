import React, { useEffect, useState } from "react";

import { LabelBox, FilterBox, LayoutBox } from "./Box";
import { ImageCard } from "./Card";
import { Carousel, CarouselItem, CarouselWithQuery } from "./Carousel";
import { Bar, DivergingBar, Funnel, Line, Pie } from "./Chart";
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

  Tooltip: (props) => <Tooltip {...props} />,
};

export default function LayoutConstructor({ config }) {
  const [toBeShown, setToBeShown] = useState(null);

  useEffect(() => {
    let component = null;
    component = config?.components?.map((item, index) => {
      try {
        return store[item.tag]({ ...item });
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
  }, [config]);
  return toBeShown;
}
