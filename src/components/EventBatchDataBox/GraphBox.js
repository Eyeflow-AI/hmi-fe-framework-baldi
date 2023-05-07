// React
import React, { useMemo } from 'react';

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
    height: '100%',
    // width: '100%',
    // flexGrow: 1,
  },
  pieBoxSx: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "center",
    height: '50%',
  },
  footerBox: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center'
  },
};

const responsivePieTheme = {
  tooltip: {
    container: {
      background: colors.paper.blue.dark
    }
  },
  labels: {
    text: {
      fontSize: 21,
      fill: '#ffffff',
      textShadow: "1px 1px 2px #353535"
    }
  },
};

const responsivePieLegends = [
  {
    anchor: 'left',
    direction: 'column',
    justify: false,
    // translateY: 56,
    translateX: -80,
    itemsSpacing: 10,
    itemWidth: 150,
    itemHeight: 18,
    itemTextColor: '#999',
    itemDirection: 'left-to-right',
    itemOpacity: 1,
    symbolSize: 18,
    symbolShape: 'circle',
    // effects: [
    //   {
    //     on: 'hover',
    //     style: {
    //       itemTextColor: '#000'
    //     }
    //   }
    // ]
  }
];

export default function GraphBox({ data, config }) {

  const { t } = useTranslation();

  const {
    // partsOk, partsNg,
    dataList, anomaliesPieData, partsPieData } = useMemo(() => {
      let status = data?.status;
      let partsOk = data?.batch_data?.parts_ok ?? 0;
      let partsNg = data?.batch_data?.parts_ng ?? 0;
      let conveyorSpeed = data?.batch_data?.conveyor_speed ?? 0;
      let partsProduced = partsOk + partsNg;
      let partsPieData = [];
      let anomaliesPieData = [];

      if (partsOk || partsNg) {
        partsPieData = [
          {
            "id": "OK",
            "label": "OK",
            "value": partsOk,
            "color": colors.eyeflow.green.light
          },
          {
            "id": "NG",
            "label": "NG",
            "value": partsNg,
            "color": colors.eyeflow.red.dark
          },
        ];

        if (partsNg) {
          if (data?.batch_data?.hasOwnProperty("defects_count")) {
            for (let [classId, value] of Object.entries(data.batch_data.defects_count)) {
              if (value > 0) {
                anomaliesPieData.push({
                  id: classId,
                  label: classId, //TODO get class label
                  value,
                  // color: TODO
                });
              }
            };
            anomaliesPieData.sort((a, b) => b.label - a.label);
          };
        }
      };

      // anomaliesPieData.push({id: "foo1", label: "foo1", value: 60});
      // anomaliesPieData.push({id: "foo2", label: "foo2", value: 100});
      // anomaliesPieData.push({id: "foo3", label: "foo3", value: 100});

      let partsPerPack = data?.info?.parts_per_pack ?? 0;
      let totalPacks = data?.info?.total_packs ?? 0;
      let packNum = data?.batch_data?.pack_num ?? Math.floor(partsProduced / partsPerPack) + 1;
      let totalQtt = partsPerPack * totalPacks;

      let dataList = [ //TODO get from config
        { field: "produced", label: `${partsProduced} (${(partsProduced / totalQtt * 100).toFixed(2)}%)` },
      ];

      if (status === "running") {
        dataList.push({ field: "speed", label: conveyorSpeed });
      };

      dataList = dataList.concat([
        { field: "box", label: `${packNum}/${totalPacks}` },
        { field: "OK", label: `${partsOk} (${((partsProduced && Number.isInteger(partsProduced)) ? partsOk / partsProduced * 100 : 0.0).toFixed(2)}%)` },
        { field: "NG", label: `${partsNg} (${((partsProduced && Number.isInteger(partsProduced)) ? partsNg / partsProduced * 100 : 0.0).toFixed(2)}%)` },
      ]);

      return {
        partsProduced: partsOk + partsNg,
        partsOk,
        partsNg,
        totalPacks,
        partsPerPack,
        anomaliesPieData,
        partsPieData,
        dataList,
      }
    }, [data]);


  return (
    <Box width={config?.width ?? 250} height={config?.height ?? '100%'} sx={styleSx.mainBoxSx}>
      <Box id="header-box" sx={styleSx.infoBox}>
        {dataList.map(({ field, label }, index) => <LabelBox minWidth={200} key={index} title={field} label={label} />)}
      </Box>

      <Box id="graph-box" sx={styleSx.graphBoxSx}>
        <Box marginBottom={-2} sx={styleSx.pieBoxSx}>
          <Typography variant="h5" marginBottom={-3} marginLeft={6}>
            {partsPieData.length > 0 ? t("parts") : ""}
          </Typography>
          <Box width={800} height={400}>
            <ResponsivePie
              colors={{ datum: 'data.color' }}
              data={partsPieData}
              margin={{ top: 70, right: 40, bottom: 70, left: 100 }}
              theme={responsivePieTheme}
            />
          </Box>
        </Box>

        <Box sx={styleSx.pieBoxSx}>
          <Typography variant="h5" marginBottom={-3} marginLeft={6}>
            {anomaliesPieData.length > 0 ? t("anomalies") : ""}
          </Typography>
          <Box width={800} height={400}>
            <ResponsivePie
              data={anomaliesPieData}
              arcLinkLabelsStraightLength={0}
              arcLabelsSkipAngle={10}
              arcLinkLabelsSkipAngle={10}
              margin={{ top: 70, right: 40, bottom: 70, left: 100 }}
              theme={responsivePieTheme}
              legends={responsivePieLegends}
            />
          </Box>
        </Box>
      </Box>
      {/* {JSON.stringify(data, null, 1)} */}
    </Box>
  );
};