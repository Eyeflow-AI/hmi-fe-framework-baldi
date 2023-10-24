import { useMemo } from "react"

import Typography from "@mui/material/Typography";

import DetectionBox from "../../../components/DetectionBox";


const style = {
  region: {
    position: 'absolute',
  },
  text: {
    marginLeft: 1,
    color: 'inherit',
    textShadow: "1px 1px 2px black",
  },
}
export default function RegionBox({data, imageWidth, imageHeight}) {
  
  let {label, regionStyle} = useMemo(() => {
    let regionStyle = {...style.region};
    let label = '';

    if (data && imageWidth && imageHeight) {
      let confidence = data.confidence;
      label = `${data.region} - ${confidence}`;
      let color = data.color;
      let x_min = data.bbox.x_min/imageWidth;
      let y_min = data.bbox.y_min/imageHeight;
      let x_max = data.bbox.x_max/imageWidth;
      let y_max = data.bbox.y_max/imageHeight;

      Object.assign(regionStyle, {
        top: `${y_min * 100}%`,
        left: `${x_min * 100}%`,
        width: `${(x_max - x_min) * 100}%`,
        height: `${(y_max - y_min) * 100}%`,
        color,
        boxShadow: `inset 0 0 0 2px ${color}, inset 1px 1px 2px 2px black`,
      });
    };
  
    return {label, regionStyle};
  }, [data, imageWidth, imageHeight])

  return (
    <>
      <div style={regionStyle}>
        <Typography variant="h6" color="inherit" sx={style.text}>
          {label}
        </Typography>
      </div>
      {data && data.detections && data.detections.map((detection, index) => 
        <DetectionBox key={index} data={detection} imageWidth={imageWidth} imageHeight={imageHeight}/>
      )}
    </>
  )
}