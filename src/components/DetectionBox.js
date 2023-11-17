import { useMemo } from "react"

import Typography from '@mui/material/Typography';

const style = {
  region: {
    position: 'absolute'
  },
  text: {
    position: 'absolute',
    color: 'inherit',
    top: '100%',
    textShadow: "1px 1px 2px black",
  },
  confidenceText: {
    position: 'absolute',
    color: 'inherit',
    top: 'calc(100% + 1rem)',
    textShadow: "1px 1px 2px black",
  }
}

function formatConfidence(confidence, decimals = 3) {

  if (confidence === undefined) {
    return '';
  };
  confidence = parseFloat(confidence);
  if (isNaN(confidence)) {
    return '';
  };

  return confidence.toFixed(decimals);
};

export default function DetectionBox({data, imageWidth, imageHeight, showLabel=true, showConfidence=true}) {
  
  let {label, confidence, regionStyle} = useMemo(() => {
    let top = 0;
    let left = 0;
    let width = 0;
    let height = 0;
    let regionStyle = {...style.region};
    let label = '';
    let confidence = '';
    let color = '';
    console.log({data})

    if (data && imageWidth && imageHeight) {
      label = data.label ?? data.item;
      confidence = formatConfidence(data.confidence);
      color = (data.in_frame ?? true) ? data.color : "#ababab";
      let x_min = data.bbox.x_min/imageWidth;
      let y_min = data.bbox.y_min/imageHeight;
      let x_max = data.bbox.x_max/imageWidth;
      let y_max = data.bbox.y_max/imageHeight;
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
        boxShadow: `inset 0 0 0 2px ${color}, inset 1px 1px 2px 2px black`,
      });
    };
  
    return {label, confidence, regionStyle};
  }, [data, imageWidth, imageHeight])

  return (
    <div style={regionStyle}>
      {showLabel &&
      <Typography sx={style.text}>
        {label}
      </Typography>
      }
      {showConfidence &&
      <Typography sx={style.confidenceText}>
        {confidence}
      </Typography>
      }
    </div>
  )
}