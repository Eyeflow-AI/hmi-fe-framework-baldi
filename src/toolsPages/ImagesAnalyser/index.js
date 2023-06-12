// React
import React, {useEffect, useState, useMemo, useCallback} from 'react';

// Design
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// Internal
import PageWrapper from '../../components/PageWrapper';
import API from '../../api';
import GetSelectedStation from '../../utils/Hooks/GetSelectedStation';
import Select from '../../components/Select'
import RegionBox from './RegionBox';

// Third-party
import { FixedSizeList } from "react-window";
import AutoSizer from 'react-virtualized-auto-sizer';
import { colors } from 'sdk-fe-eyeflow';

const style = {
  mainBox: {
    // bgcolor: 'background.paper',
    // bgcolor: 'red',
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
  },
  menuBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
    height: '100%',
    gap: 1,
    display: 'flex',
    flexDirection: 'column',
    p: 1,
  }),
  listBox: {
    flexGrow: 1,
    boxShadow: `inset 0 0 4px black`,
    borderRadius: 1
  },
  imageBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
    height: '100%',
    flexGrow: 1
  }),
  imgWrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  imgDrawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    // border: '1px solid yellow'
  }
};

function getImageDataList (filesList) {

  filesList.sort((a, b) => b.name - a.name);
  let lenFilesList = filesList.length;
  let imageData;
  let newFilesList = [];
  for (let i =0; i < lenFilesList; i++) {
    let fileData = filesList[i];
    if (fileData.name.endsWith('.json')) {
      if (imageData) {
        let imageNameWithoutExtension = imageData.name.split('.').slice(0, -1).join('.')
        let jsonNameWithoutExtension = fileData.name.split('.').slice(0, -1).join('.')
        if (imageNameWithoutExtension && imageNameWithoutExtension === jsonNameWithoutExtension) {
          imageData.hasJson = true;
          imageData.jsonFileData = {...fileData};
          newFilesList.push(imageData);
          imageData = null;
        }
      }
    }
    else {
      if (imageData) {
        imageData.hasJson = false;
        newFilesList.push(imageData);
      };
      imageData = {...fileData};
    }
  }

  if (imageData) {
    imageData.hasJson = false;
    newFilesList.push(imageData);
    imageData = null;
  };

  newFilesList.sort((a, b) => b.birthtime - a.birthtime);
  return newFilesList;
};

const getButtonStyle = ({ selected, width, height }) => {
  return {
    display: 'flex',
    borderRadius: '4px',
    justifyContent: 'center',
    height,
    fontSize: 18,
    cursor: 'pointer',
    color: 'white',
    width,
    padding: 1,
    background: selected ? colors.blue : `${colors.blue}60`,
    boxShadow: (theme) => selected ? `inset 0 0 0 2px ${colors.darkGray}, ${theme.shadows[5]}` : theme.shadows[2],
    "&:hover": {
      boxShadow: (theme) => selected ? `inset 0 0 0 2px ${colors.darkGray}, ${theme.shadows[5]}` : theme.shadows[5],
    },
    // transition: (theme) => theme.transitions.create(["width", "boxShadow", "color"], {
    //   easing: theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.standard,
    // }),
  };
};

export default function ImageAnalyser({ pageOptions }) {

  const { _id: stationId } = GetSelectedStation();

  const {dirPath, itemHeight, itemWidth, menuWidth} = useMemo(() => {
    return {
      dirPath: pageOptions?.options?.dirPath,
      itemHeight: 150,
      itemWidth: 290,
      menuWidth: 310,
    };
  }, [pageOptions]);

  // eslint-disable-next-line no-unused-vars
  const [loadingFilesList, setLoadingFilesList] = useState(false);
  const [dayList, setDayList] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [idList, setIdList] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [imageList, setImageList] = useState([]);
  const [selectedImageData, setSelectedImageData] = useState(null);
  const [imageURL, setSelectedImageURL] = useState('');

  useEffect(() => {
    if (!dirPath) {
      console.error('Missing option dirPath in pageOptions.options');
    };
    if (stationId && dirPath) {
      let params = {
        dirPath,
        depth: 0,
        fileURL: false,
      };

      API.get.filesList({params, stationId}, setLoadingFilesList)
        .then((data) => {
          let newDirList = [];
          for (let pathData of (data?.files ?? [])) {
            if (pathData.isDir) {
              newDirList.push(pathData.name);
            };
          };
          setDayList(newDirList);
        })
        .catch(console.error)
    }
  }, [dirPath, stationId]);

  useEffect(() => {
    if (selectedImageData) {
      console.log({selectedImageData});
      setSelectedImageURL(selectedImageData.fileURL);
    }
    else {
      setSelectedImageURL('');
    }
  }, [selectedImageData]);

  const onSelectDay = useCallback((selectedDay) => {
    setSelectedDay(selectedDay);
    setSelectedId('');
    setIdList([]);
    setImageList([]);
    setSelectedImageData(null);

    if (selectedDay) {
      let params = {
        dirPath: `${dirPath}/${selectedDay}`,
        depth: 0,
        fileURL: true,
      };

      API.get.filesList({params, stationId}, setLoadingFilesList)
        .then((data) => {
          let newIdList = [];
          for (let pathData of (data?.files ?? [])) {
            if (pathData.isDir) {
              newIdList.push(pathData.name);
            };
          };
          setIdList(newIdList);
        })
        .catch((err) => {
          setIdList([]);
          console.error(err);
        })
    };
  }, [dirPath, stationId]);

  const onSelectId = useCallback((selectedId) => {
    setSelectedId(selectedId);
    setImageList([]);
    setSelectedImageData(null);

    if (selectedId) {
      let params = {
        dirPath: `${dirPath}/${selectedDay}/${selectedId}`,
        depth: 0,
        fileURL: true,
      };

      API.get.filesList({params, stationId}, setLoadingFilesList)
        .then((data) => setImageList(getImageDataList(data?.files ?? [])))
        .catch((err) => {
          setImageList([]);
          console.error(err);
        })
    };
  }, [dirPath, selectedDay, stationId]);

  const onSelectImage = (imageData) => () => {
    if (imageData.hasJson) {
      let jsonFileURL = imageData.jsonFileData.fileURL;
      fetch(jsonFileURL)
        .then((response) => response.json())
        .then((jsonData) => {
          imageData.jsonData = jsonData;
          setSelectedImageData(imageData);
        })
        .catch((err) => {
          console.error(err);
          setSelectedImageData(imageData);
        })
    }
    else {
      setSelectedImageData(imageData);
    }
  };

  function itemRenderer({ index, style }) {
    const imageData = imageList[index];
    const selected = imageData?.name === selectedImageData?.name;
    let errMessage = imageData.hasJson ? '' : 'json_file_missing';

    const customStyle = Object.assign(
      { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      style
    );

    const buttonStyle = getButtonStyle({
      selected,
      width: itemWidth,
      height: itemHeight - 20,
    });

    return (
      <div key={`item-${index}`} style={customStyle}>
        <Box
          sx={buttonStyle}
          onClick={onSelectImage(imageData)}
        >
          <Grid
            container
            alignItems='center'
            direction='column'
            justifyContent='center'
          >
            <Grid item>
              <Typography>
                {index + 1}
              </Typography>
              <Typography variant='body2'>
                {imageData.name}
              </Typography>
              <Typography variant='body2'>
                {`${imageData.birthtime}`} <br />
              </Typography>
              {errMessage && (
              <Typography color='error' variant='body2'>
                {errMessage}
              </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </div>
    )
  };

  return (
    <PageWrapper>
      {({ width, height }) =>
        <Box
          width={width}
          height={height}
          sx={style.mainBox}
        >
          <Box width={menuWidth} sx={style.menuBox}>
            <Select
              choices={dayList}
              // title
              // disabled
              value={selectedDay}
              setValue={onSelectDay}
            />
            <Select
              choices={idList}
              // title
              disabled={!selectedDay}
              value={selectedId}
              setValue={onSelectId}
            />
            <Box sx={style.listBox}>
              <AutoSizer>
                {({ height, width }) => (
                  <FixedSizeList
                    height={height}
                    width={width}
                    itemSize={itemHeight}
                    itemCount={imageList.length}
                  >
                    {itemRenderer}
                  </FixedSizeList>
                )}
              </AutoSizer>
            </Box>
          </Box>
          <Box sx={style.imageBox}>
            {selectedImageData && imageURL && (
              <div id="img-wrapper" style={style.imgWrapper}>
                <img
                  id="img"
                  src={imageURL}
                  alt=""
                  style={{
                    objectFit: 'contain',
                    maxHeight: height,
                    width: 'auto',
                    maxWidth: width - menuWidth - 10,
                  }}
                />
                {selectedImageData.hasJson &&
                <div id="img-drawer" style={style.imgDrawer}>
                  {selectedImageData.jsonData.map((data, index) => (
                    <RegionBox key={index} data={data}/>
                  ))}
                </div>
                }
              </div>
            )}
          </Box>
        </Box>
      }
    </PageWrapper>
  )
}


