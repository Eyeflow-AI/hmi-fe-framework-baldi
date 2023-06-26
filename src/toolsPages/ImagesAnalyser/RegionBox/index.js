import { useMemo } from "react"

import Typography from "@mui/material/Typography";

import DetectionBox from "./DetectionBox";


const style = {
  region: {
    position: 'absolute',
  },
  text: {
    marginLeft: 1,
    color: 'inherit',
    textShadow: "1px 1px 2px black",
  }
}
export default function RegionBox({data}) {
  
  let {label, regionStyle} = useMemo(() => {
    let top = 0;
    let left = 0;
    let width = 0;
    let height = 0;
    let regionStyle = {...style.region};
    let label = '';
    let color = '';

    if (data) {
      let confidence = data.confidence;
      label = `${data.region} - ${confidence}`;
      color = data.color;
      let {x_min, y_min, x_max, y_max} = data.bbox_normalized;
      console.log({data});
      top = `${y_min * 100}%`;
      left = `${x_min * 100}%`;
      width = `${(x_max - x_min) * 100}%`;
      height = `${(y_max - y_min) * 100}%`;
      Object.assign(regionStyle, {
        top,
        left,
        width,
        height,
        color,
        boxShadow: `0 0 0 2px ${color}, 1px 1px 2px 2px black`,
      });
    };
  
    return {label, regionStyle};
  }, [data])

  return (
    <div style={regionStyle}>
      <Typography variant="h6" color="inherit" sx={style.text}>
        {label}
      </Typography>
      {data && data.detections && data.detections.map((detection, index) => 
        <DetectionBox key={index} data={detection} />
      )}
      {/* {data && data.original_detections && data.original_detections.map((detection, index) =>
        <DetectionBox key={index} data={detection} forceColor={"#ff0000"}/>
      )} */}
    </div>
  )
}