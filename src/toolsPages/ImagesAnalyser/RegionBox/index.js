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
    let regionStyle = {...style.region};
    let label = '';

    if (data) {
      let confidence = data.confidence;
      label = `${data.region} - ${confidence}`;
      let color = data.color;
      let {x_min, y_min, x_max, y_max} = data.bbox_normalized;
      console.log({data});

      Object.assign(regionStyle, {
        top: `${y_min * 100}%`,
        left: `${x_min * 100}%`,
        width: `${(x_max - x_min) * 100}%`,
        height: `${(y_max - y_min) * 100}%`,
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
    </div>
  )
}