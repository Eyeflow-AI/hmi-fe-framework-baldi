import { useMemo } from "react"

import Typography from '@mui/material/Typography';

const style = {
  region: {
    position: 'absolute',
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
  },
}
export default function DetectionBox({data, forceColor}) {
  
  let {label, confidence, regionStyle} = useMemo(() => {
    let top = 0;
    let left = 0;
    let width = 0;
    let height = 0;
    let regionStyle = {...style.region};
    let label = '';
    let confidence = '';
    let color = '';

    if (data) {
      label = data.item;
      confidence = data.confidence;
      color = forceColor ?? data.color;
      let {x_min, y_min, x_max, y_max} = data.bbox_normalized;
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
  
    return {label, confidence, regionStyle};
  }, [data])

  return (
    <div style={regionStyle}>
      <Typography sx={style.text}>
        {label}
      </Typography>
      <Typography sx={style.confidenceText}>
        {confidence}
      </Typography>
    </div>
  )
}