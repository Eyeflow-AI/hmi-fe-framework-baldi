import React, { useEffect, useState } from "react";

import Carousel from "./Carousel";
import eventsHandler from "../../../utils/functions/eventsHandler";
import validateData from "../../functions/dataValidation/simplifiedCarousel";

const styleSx = {
  mainBoxSx: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    // border: "5px solid red",
    position: "relative",
  },
  // imageBoxSx: {
  //   position: "block",
  //   position: "absolute",
  //   width: "100%",
  //   height: "calc(100% - 40px)",
  //   marginTop: "40px",
  //   display: "inline-block",
  //   // border: "1px solid green",
  // },
  headerBoxSx: {
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 1,
    paddingRight: 1,
    borderRadius: "4px 4px 0 0",
  },
  textDate: {
    fontSize: "0.8rem",
    // color: 'text.secondary',
  },
  circularProgressSx: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: "-20px",
    marginLeft: "-20px",
  },
  imageStyle: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    display: "block",
  },
};

const loadingImageStyle = Object.assign({}, styleSx.imageStyle, {
  filter: "blur(2px)",
  opacity: "0.7",
});

export default function SimplifiedCarousel({
  name,
  tag,
  componentsInfo,
  metadata,
  stationId,
  setComponentsInfo,
}) {
  // console.log({ SimplifiedCarousel: name, tag, componentsInfo });

  // const [_name, _setName] = useState("");
  const [data, setData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (
      componentsInfo &&
      typeof componentsInfo === "object" &&
      Object.keys(componentsInfo).length > 0
    ) {
      // const component = {
      //   output: validateData({
      //     obj:
      //       componentsInfo?.find(
      //         (item) => item.tag === tag && item.name === name
      //       )?.output ?? [],
      //   }),
      // };
      const component = componentsInfo?.find(
        (item) => item.tag === tag && item.name === name
      );
      console.log({ Simplified: component });
      setData(component);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentsInfo]);

  // console.log({ onImageLoading });

  // useEffect(() => {
  //   if (onImageLoading) {
  //     setLoading(false);
  //     setOnImageLoading(false);
  //   }
  // }, [onImageLoading]);

  // useEffect(() => {
  //   if (name) {
  //     _setName(name);
  //   }
  // }, [name]);
  const handleClick = (item) => {
    // console.log({ item, setComponentsInfo, componentsInfo });
    setSelectedItem(item);
    let _componentsInfo = [...componentsInfo];
    // let index = _componentsInfo.findIndex(
    //   (item) => item.tag === tag && item.name === name
    // );
    // _componentsInfo[index].output.selectedValue = item.value;
    eventsHandler({
      componentsInfo: _componentsInfo,
      item,
      fnExecutor: setComponentsInfo,
      fnName: item?.on?.click,
      stationId,
    });
  };

  useEffect(() => {
    if (Array.isArray(data?.output) && data?.output.length > 0) {
      handleClick(data?.output[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Carousel
      // name={name}
      // tag={tag}
      // componentsInfo={componentsInfo}
      // metadata={metadata}
      // setComponentsInfo={setComponentsInfo}
      data={data}
      onClick={(item) => handleClick(item)}
      selectedItem={selectedItem}
    />
  );
}
