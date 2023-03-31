// React
import React, {useMemo} from 'react';

//Design
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

//Third party
import { ResponsivePie } from '@nivo/pie'
import { colors } from 'sdk-fe-eyeflow';
import { useTranslation } from "react-i18next";

//Internal
import LabelBox from '../LabelBox';

const styleSx = {
  mainBoxSx: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
    display: 'flex',
    justifyContent: "space-evenly",
  }),
  infoBox: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: 1,
    padding: 1,
    paddingBottom: 10,
    justifyContent: 'space-evenly'
  },
  graphBoxSx: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
  },
  pieBoxSx: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center"
  },
  footerBox: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center'
  }
};

export default function GraphBox({data, config}) {

  const {t} = useTranslation();

  const {
    // partsOk, partsNg,
    dataList, anomaliesPieData, partsPieData} = useMemo(() => {
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

    // anomaliesPieData.push({id: "foo1", label: "foo1", value: 60});
    // anomaliesPieData.push({id: "foo2", label: "foo2", value: 100});
    // anomaliesPieData.push({id: "foo3", label: "foo3", value: 100});
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

    let partsPerPack = data?.info?.parts_per_pack ?? 0;
    let packQtt = data?.info?.pack_qtt ?? 0;
    let totalQtt = partsPerPack * packQtt;

    const dataList = [ //TODO get from config
      {field: "produced", label: `${partsProduced} (${(partsProduced/totalQtt*100).toFixed(2)}%)`},
      {field: "speed", label: "TODO"},
      {field: "box", label: `${Math.floor(partsProduced/partsPerPack) + 1}/${packQtt}`},
      {field: "OK", label: `${partsOk} (${(partsOk/partsProduced*100).toFixed(2)}%)`},
      {field: "NG", label: `${partsNg} (${(partsNg/partsProduced*100).toFixed(2)}%)`},
    ];

    return {
      partsProduced: partsOk + partsNg,
      partsOk,
      partsNg,
      packQtt,
      partsPerPack,
      anomaliesPieData,
      partsPieData,
      dataList,
    }
  }, [data]);


  return (
    <Box width={config?.width ?? 250} height={config?.height ?? '100%'} sx={styleSx.mainBoxSx}>
      <Box id="header-box" sx={styleSx.infoBox}>
        {dataList.map(({field, label}, index) => <LabelBox minWidth={200} key={index} title={field} label={label}/>)}
      </Box>
      
      <Box id="graph-box" sx={styleSx.graphBoxSx}>
        <Box sx={styleSx.pieBoxSx}>
          <Typography variant="h6" marginBottom={-1}>
            {t("parts")}
          </Typography>
          <Box width={500} height={300}>
            <ResponsivePie
              colors={{ datum: 'data.color' }}
              data={partsPieData}
              margin={{ top: 20, right: 120, bottom: 40, left: 120 }}
              theme={{
                labels: {
                  text: {
                    fontSize: 20,
                    fill: '#ffffff',
                  }
                }
              }}
            />
          </Box>
        </Box>
        <Box sx={styleSx.pieBoxSx}>
          <Typography variant="h6" marginBottom={-1}>
            {t("anomalies")}
          </Typography>
          <Box width={650} height={350}>
            <ResponsivePie
              data={anomaliesPieData}
              arcLinkLabelsStraightLength={0}
              margin={{ top: 20, right: 120, bottom: 40, left: 120 }}
              theme={{
                labels: {
                  text: {
                    fontSize: 20,
                    fill: '#ffffff',
                  }
                }
              }}
            />
          </Box>
        </Box>
      </Box>
      {/* {JSON.stringify(data, null, 1)} */}
    </Box>
  );
};