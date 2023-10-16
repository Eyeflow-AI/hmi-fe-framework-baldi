import {useMemo} from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { ResponsivePie } from '@nivo/pie'
import { colors, dateFormat} from 'sdk-fe-eyeflow';
import { useTranslation } from "react-i18next";
import { cloneDeep } from 'lodash';

import ImageCard from '../../ImageCard';

const GRAPH_BOX_WIDTH = 500;

const styleSx = {
  mainBoxSx: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
    display: 'flex',
    justifyContent: "space-evenly",
    paddingRight: 1,
  }),
  graphBoxSx: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: `${GRAPH_BOX_WIDTH}px`,
    justifyContent: 'space-evenly'
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
  imageBoxSx: {
    display: 'flex',
    width: `calc(100% - ${GRAPH_BOX_WIDTH}px)`,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "center",
    height: '100%',
    gap: 3,
  },
  cardBoxSx: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "center",
    height: '50%',
    // width: '100%',
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


export default function MetalStampingBox ({data, config}) {

  const { t } = useTranslation();

  let {selectedCamera} = useMemo(() => {
    let selectedCamera = config?.selected_camera ?? null;
    if (!selectedCamera) {
      console.error("No camera selected in config");
    }
    return {selectedCamera};
  }, [config]);

  let {
    imageData,
    anomalyImageData,
    partsPieData,
    anomaliesPieData,
  } = useMemo(() => {
    let partsOk = data?.batch_data?.parts_ok ?? 0;
    let partsNg = data?.batch_data?.parts_ng ?? 0;
    let partsPieData = [];
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
    };

    let anomaliesPieData = [];
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

    let imageData = null;
    let lastInspectionData = data?.batch_data?.last_inspection;
    if (selectedCamera && lastInspectionData) {
      imageData = cloneDeep(lastInspectionData?.images?.find(image => image.camera_name === selectedCamera));
      if (!imageData) {
        console.error(`No image data for camera ${selectedCamera}`);
      }
      else if (!imageData.image_url) {
        imageData = null;
        console.error(`No image url for camera ${selectedCamera}`);
      }
      else {
        imageData.event_time = dateFormat(lastInspectionData?.event_time);
        // imageData.event_time = lastInspectionData?.event_time;
      }
    }
    let anomalyImageData = cloneDeep(data?.batch_data?.last_anomaly?.images?.[0]);
    if (data?.batch_data?.last_anomaly?.event_time) {
      anomalyImageData.event_time = dateFormat(data.batch_data.last_anomaly.event_time);
    }
    // TODO select anomaly image

    return {
      imageData,
      anomalyImageData,
      partsPieData,
      anomaliesPieData,
    };
  }, [selectedCamera, data]);

  return (
    <Box width={config?.width ?? "calc(100vw - 412px)"} height={config?.height ?? '100%'} sx={styleSx.mainBoxSx}>
      <Box id="graph-box" sx={styleSx.graphBoxSx}>

        <Box marginBottom={-2} sx={styleSx.pieBoxSx}>
          <Typography variant="h5" marginBottom={-3} marginLeft={6}>
            {partsPieData && partsPieData.length > 0 ? t("parts") : ""}
          </Typography>
          <Box width={GRAPH_BOX_WIDTH} height={400}>
            <ResponsivePie
              colors={{ datum: 'data.color' }}
              data={partsPieData}
              margin={{ top: 70, right: 40, bottom: 70, left: 100 }}
              theme={responsivePieTheme}
              legends={responsivePieLegends}
            />
          </Box>
        </Box>

        {anomaliesPieData && anomaliesPieData.length > 0 && (
        <Box sx={styleSx.pieBoxSx}>
          <Typography variant="h5" marginBottom={-3} marginLeft={6}>
            {t("anomalies")}
          </Typography>
          <Box width={GRAPH_BOX_WIDTH} height={400}>
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
        )}

      </Box>
      <Box id="image-box" sx={styleSx.imageBoxSx}>
        {imageData && (
        <Box sx={styleSx.cardBoxSx}>
          <ImageCard imageData={imageData} eventTime={imageData.event_time} title={t("last_inspection")}/>
        </Box>
        )}
        
        {anomalyImageData && (
        <Box sx={styleSx.cardBoxSx}>
          <ImageCard imageData={anomalyImageData} title={t("last_anomaly")} eventTime={anomalyImageData.event_time} color="error.main"/>
        </Box>
        )}

        {/* {imageData && (
        <Box>
          <ImageCard imageData={imageData} title={t("last_anomaly")} color="error.main"/>
        </Box>
        )} */}
      </Box>
    </Box>
  );
}