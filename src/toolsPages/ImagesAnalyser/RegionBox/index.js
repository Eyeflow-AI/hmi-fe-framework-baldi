import { useMemo } from "react"

import Typography from "@mui/material/Typography";

import {colors} from "sdk-fe-eyeflow";

import DetectionBox from "./DetectionBox";


const style = {
  region: {
    position: 'absolute',
    color: colors.blue,
  },
  text: {
    marginLeft: 1,
    textShadow: "2px 0 #fff, -2px 0 #fff, 0 2px #fff, 0 -2px #fff, 1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff",
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

    if (data) {
      label = data.region;
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
        border: `3px solid ${colors.blue}`,
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
    </div>
  )
}