import { useMemo } from "react"

import Tooltip from "@mui/material/Tooltip";

import {colors} from "sdk-fe-eyeflow";

const style = {
  region: {
    position: 'absolute',
    color: colors.yellow,
  },
}
export default function DetectionBox({data}) {
  
  let {label, regionStyle} = useMemo(() => {
    let top = 0;
    let left = 0;
    let width = 0;
    let height = 0;
    let regionStyle = {...style.region};
    let label = '';

    if (data) {
      label = data.item;
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
        // border: `3px solid ${colors.yellow}`,
        boxShadow: `0 0 0 2px ${colors.yellow}, 1px 1px 2px 2px black`,
      });
    };
  
    return {label, regionStyle};
  }, [data])

  return (
    <Tooltip title={label}>
      <div style={regionStyle}>
      </div>
    </Tooltip>
  )
}