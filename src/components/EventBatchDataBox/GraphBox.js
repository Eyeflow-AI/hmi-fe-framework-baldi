// React
import React, {useMemo} from 'react';

//Design
import Box from '@mui/material/Box';

//Third party
import { ResponsivePie } from '@nivo/pie'
import { colors } from 'sdk-fe-eyeflow';

//Internal
import LabelBox from '../LabelBox';

const styleSx = {
  mainBoxSx: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'white',
    display: 'flex',
    flexDirection: 'column',
  }),
  infoBox: {
    display: 'flex',
    width: '100%',
    gap: 1,
    padding: 1,
    paddingBottom: 10
  },
  graphBoxSx: {
    display: 'flex',
    height: 200,
    width: '100%',
    justifyContent: "space-evenly"
  },
  pieBoxSx: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center"
  },
};

export default function GraphBox({data, config}) {

  const {dataList, anomaliesPieData, partsPieData} = useMemo(() => {
    let anomaliesPieData = [];
    if (data?.batch_data?.hasOwnProperty("defects_count")) {
      for (let [classId, value] of Object.entries(data.batch_data.defects_count)) {
        anomaliesPieData.push({
          id: classId,
          label: classId, //TODO get class label
          value,
          // color: TODO
        });
      };
    };

    anomaliesPieData.sort((a, b) => b.label - a.label);
    let partsOk = data?.batch_data?.parts_ok ?? 0;
    let partsNg = data?.batch_data?.parts_ng ?? 0;
    let partsProduced = partsOk + partsNg;

    let partsPieData = [
      {
        "id": "ng",
        "label": "NG",
        "value": partsNg,
        "color": colors.eyeflow.red.dark
      },
      {
        "id": "ok",
        "label": "OK",
        "value": partsOk,
        "color": colors.eyeflow.green.light
      },
    ];

    const dataList = [ //TODO get from config
      {field: "produced", label: partsProduced},
      {field: "OK", label: partsOk},
      {field: "NG", label: partsNg},
      {field: "speed", label: "TODO"},
    ];

    return {
      partsProduced: partsOk + partsNg,
      partsOk,
      partsNg,
      packQtt: data?.info?.pack_qtt ?? 0,
      partsPerPack: data?.info?.parts_per_pack ?? 0,
      anomaliesPieData,
      partsPieData,
      dataList,
    }
  }, [data]);


  return (
    <Box width={config?.width ?? 250} height={config?.height ?? '100%'} sx={styleSx.mainBoxSx}>
      <Box id="graph-info-box" sx={styleSx.infoBox}>
        {dataList.map(({field, label}, index) => <LabelBox key={index} title={field} label={label}/>)}
      </Box>
      
      <Box id="graph-graph-box" sx={styleSx.graphBoxSx}>
        <Box sx={styleSx.pieBoxSx}>
          Peças
          <Box width={500} height={300}>
            <ResponsivePie
              colors={{ datum: 'data.color' }}
              data={partsPieData}
              margin={{ top: 40, right: 120, bottom: 40, left: 120 }}
            />
          </Box>
        </Box>
        <Box sx={styleSx.pieBoxSx}>
          Anomalias
          <Box width={500} height={300}>
            <ResponsivePie
              data={anomaliesPieData}
              arcLinkLabelsStraightLength={0}
              margin={{ top: 40, right: 120, bottom: 40, left: 120 }}
            />
          </Box>
        </Box>
      </Box>
      {/* {JSON.stringify(data, null, 1)} */}
    </Box>
  );
};