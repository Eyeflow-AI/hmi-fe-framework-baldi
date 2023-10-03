// React
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';

// Design
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// Internal
import PageWrapper from '../../components/PageWrapper';
import API from '../../api';
import GetSelectedStation from '../../utils/Hooks/GetSelectedStation';
import GetStationsList from '../../utils/Hooks/GetStationsList';
import Select from '../../components/Select'
import AppBar from './AppBar';
import RegionBox from './RegionBox';

// Third-party
import { FixedSizeList } from "react-window";
import AutoSizer from 'react-virtualized-auto-sizer';
import { colors } from 'sdk-fe-eyeflow';
import { TransformWrapper, TransformComponent } from "@pronestor/react-zoom-pan-pinch";
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import { setNotificationBar } from '../../store/slices/app';


const appBarHeight = 64;

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
  dataBox: {
    height: '100%',
    flexGrow: 1,
    gap: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  jsonBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
    height: '100%',
    width: '100%',
    // gap: 1,
    // display: 'flex',
    // flexDirection: 'column',
    p: 1,
    overflowY: 'auto',
  }),
  imgWrapper: {
    boxShadow: 1,
    position: 'relative',
    // height: 'auto'
    // display: 'block',
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

function getImageDataList(filesList) {

  filesList.sort((a, b) => b.name - a.name);
  let lenFilesList = filesList.length;
  let imageData;
  let newFilesList = [];
  for (let i = 0; i < lenFilesList; i++) {
    let fileData = filesList[i];
    if (fileData.name.endsWith('.json')) {
      if (imageData) {
        let imageNameWithoutExtension = imageData.name.split('.').slice(0, -1).join('.')
        let jsonNameWithoutExtension = fileData.name.split('.').slice(0, -1).join('.')
        if (imageNameWithoutExtension && imageNameWithoutExtension === jsonNameWithoutExtension) {
          imageData.hasJson = true;
          imageData.jsonFileData = { ...fileData };
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
      imageData = { ...fileData };
    }
  }

  if (imageData) {
    imageData.hasJson = false;
    newFilesList.push(imageData);
    imageData = null;
  };

  newFilesList.sort((a, b) => b.birthtime - a.birthtime).map((fileData, index) => {
    fileData.index = index;
    return fileData;
  });
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
  const stationsList = GetStationsList();


  const listRef = useRef();

  const { dirPath, itemHeight, itemWidth, menuWidth } = useMemo(() => {
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
  const [showDetections, setShowDetections] = useState(true);
  const [showJson, setShowJson] = useState(false);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  // const [listToUpload, setListToUpload] = useState([]);
  const [_stationsList, set_stationsList] = useState([]);
  const [selectedStation, setSelectedStation] = useState({});
  const [edgesList, setEdgesList] = useState([]);
  const [selectedEdge, setSelectedEdge] = useState({});
  const [inspections, setInspections] = useState([]);

  useEffect(() => {
    if (stationsList) {
      set_stationsList(stationsList.map((el) => {
        return {
          name: el.label,
          _id: el._id,
          parms: el.parms,
        }
      }));
    }
  }, [stationsList]);






  const onSelectImage = useCallback((imageData) => () => {
    // if (imageData.hasJson) {

    fetch(imageData?.json_url)
      .then((response) => response.json())
      .then((jsonData) => {
        imageData.jsonData = jsonData;
        listRef.current.scrollToItem(imageData.index, 'auto');
        console.log({ imageData })
        setSelectedImageData(imageData);
      })
      .catch((err) => {
        console.error(err);
        listRef.current.scrollToItem(imageData.index, 'auto');
        setSelectedImageData(imageData);
      })
  }, []);

  useEffect(() => {
    // Arrow key event listener
    const handleKeyDown = (event) => {
      if (['ArrowLeft', 'ArrowUp'].includes(event.key)) {
        if (selectedImageData?.index > 0) {
          onSelectImage(imageList[selectedImageData.index - 1])();
        }
      }
      else if (['ArrowRight', 'ArrowDown'].includes(event.key)) {
        if (selectedImageData?.index < imageList.length - 1) {
          onSelectImage(imageList[selectedImageData.index + 1])();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      console.log('remove event listener');
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [imageList, selectedImageData, onSelectImage]);

  useEffect(() => {
    if (selectedImageData) {
      setSelectedImageURL(selectedImageData?.image_url);
    }
    else {
      setSelectedImageURL('');
    }
  }, [selectedImageData]);

  const onSelectDay = (_selectedDay, erase = true) => {

    setSelectedDay(_selectedDay);
    if (erase) {
      setSelectedId('');
      setIdList([]);
      setImageList([]);
      setInspections([]);
      setSelectedImageData(null);
    }

    if (_selectedDay) {
      let station = stationsList.find((item) => item.label === selectedStation);
      let edge = station?.edges?.find((item) => item.name === selectedEdge);

      API.get.filesListMongo({ params: { dirPath, host: edge?.host, port: edge?.filesPort, inspectionDate: _selectedDay } }, setLoadingFilesList)
        .then((data) => {
          let newIdList = [];
          let docs = data?.docs ?? [];
          docs = docs.map((item, index) => {
            return {
              ...item,
              index
            }
          });

          setInspections(docs);
          newIdList = [...new Set(docs.map(item => item.inspection_id))]
          // reverse newIdList order
          newIdList = newIdList.sort((a, b) => b - a);


          setIdList(newIdList);
        })
        .catch((err) => {
          setInspections([]);
          setIdList([]);
          console.error(err);
        })
    };

  }

  const onSelectStation = (_selectedStation) => {
    let station = stationsList.find((item) => item.label === _selectedStation);
    setSelectedStation(_selectedStation);
    setSelectedEdge({});
    setSelectedDay('');
    setSelectedId('');
    setIdList([]);
    setImageList([]);
    setDayList([]);
    setInspections([]);
    setSelectedImageData(null);
    setEdgesList(station?.edges ?? []);
  };

  const onSelectEdge = (_selectedEdge, erase = true) => {
    let station = stationsList.find((item) => item.label === selectedStation);
    let edge = station?.edges?.find((item) => item.name === _selectedEdge);

    setSelectedEdge(_selectedEdge);
    if (erase) {
      setDayList([]);
      setSelectedDay('');
      setSelectedId('');
      setIdList([]);
      setImageList([]);
      setInspections([]);
      setSelectedImageData(null);
    }
    API.get.folderListMongo({ params: { dirPath, host: edge?.host, port: edge?.filesPort } }, setLoadingFilesList)
      .then((data) => {
        let inspectionDates = data?.inspectionDates ?? [];
        setDayList(inspectionDates);
      })
  };

  const onSelectId = (_selectedId, erase = true) => {
    setSelectedId(_selectedId);
    if (erase) {
      setImageList([]);
      setSelectedImageData(null);
    }

    let newImagesList = [];
    newImagesList = inspections.filter((item) => item.inspection_id === _selectedId);
    let station = stationsList.find((item) => item.label === selectedStation);
    let edge = station?.edges?.find((item) => item.name === selectedEdge);
    let host = edge?.host ?? '';
    let filePort = edge?.filesPort ?? '';
    let path = pageOptions?.options?.dirPath;
    newImagesList = newImagesList.map((item, index) => {
      let json_url = `${host}:${filePort}${path}/${item?.inspection_date}/${item?.inspection_id}/${item?.json_file}`;
      let image_url = `${host}:${filePort}${path}/${item?.inspection_date}/${item?.inspection_id}/${item?.image_file}`;
      return {
        ...item,
        json_url,
        image_url,
        index
      }
    });
    // listRef.current = newImagesList;

    setImageList([...newImagesList]);
  };

  useEffect(() => {
    let newImagesList = [];
    newImagesList = inspections.filter((item) => item.inspection_id === selectedId);
    let station = stationsList.find((item) => item.label === selectedStation);
    let edge = station?.edges?.find((item) => item.name === selectedEdge);
    let host = edge?.host ?? '';
    let filePort = edge?.filesPort ?? '';
    let path = pageOptions?.options?.dirPath;
    newImagesList = newImagesList.map((item, index) => {
      let json_url = `${host}:${filePort}${path}/${item?.inspection_date}/${item?.inspection_id}/${item?.json_file}`;
      let image_url = `${host}:${filePort}${path}/${item?.inspection_date}/${item?.inspection_id}/${item?.image_file}`;
      return {
        ...item,
        json_url,
        image_url,
        index
      }
    });
    // listRef.current = newImagesList;

    setImageList([...newImagesList]);
  }, [inspections])


  const handleUpdateEvent = ({ data }) => {
    API.post.toUpload({ ...data })
      .then((res) => {
        setNotificationBar({ show: true, message: 'Uploaded Successfully', type: 'success' });
      }
      )
      .catch(console.log)
      .finally(() => {
        let _selectedDay = selectedDay;
        let _selectedId = selectedId;
        let _selectedEdge = selectedEdge;
        let _selectedImageData = JSON.parse(JSON.stringify(selectedImageData));
        onSelectEdge(_selectedEdge, false);
        onSelectDay(_selectedDay, false);
        onSelectId(_selectedId, false);
        onSelectImage(_selectedImageData);
      })
  };

  function itemRenderer({ index, style }) {
    const imageData = imageList[index];
    const selected = imageData?.index === selectedImageData?.index;
    // let errMessage = imageData.hasJson ? '' : 'json_file_missing';

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
            {imageData?.uploaded &&
              <Grid item>
                <CloudDoneIcon color='success' />
              </Grid>
            }
            <Grid item>
              <Typography>
                {index + 1}
              </Typography>
              <Typography variant='body2'>
                {imageData.image_file}
              </Typography>
              <Typography variant='body2'>
                {`${imageData.frame_time}`} <br />
              </Typography>
              {/* {errMessage && (
                <Typography color='error' variant='body2'>
                  {errMessage}
                </Typography>
              )} */}
            </Grid>
          </Grid>
        </Box>
      </div>
    )
  };

  const onClickLeft = useCallback(() => {
    if (selectedImageData) {
      let index = selectedImageData.index;
      if (index > 0) {
        let imageData = imageList[index - 1];
        onSelectImage(imageData)();
      }
    }
  }, [imageList, onSelectImage, selectedImageData]);
  const onClickLeftDisabled = !selectedImageData || selectedImageData.index <= 0;

  const onClickRight = useCallback(() => {
    if (selectedImageData) {
      let index = selectedImageData.index;
      if (index < imageList.length - 1) {
        let imageData = imageList[index + 1];
        onSelectImage(imageData)();
      }
    }
  }, [imageList, onSelectImage, selectedImageData]);
  const onClickRightDisabled = !selectedImageData || selectedImageData.index >= imageList.length - 1;



  const onChangeView = useCallback(() => { setShowJson(!showJson) }, [showJson]);
  const onChangeShowDetections = useCallback(() => { setShowDetections(!showDetections) }, [showDetections]);

  const onImageLoad = (resetTransform) => (event) => {
    const image = event.target;
    const { naturalWidth, naturalHeight } = image;
    setImageHeight(naturalHeight);
    setImageWidth(naturalWidth);
    resetTransform();
  };


  console.log({ inspections, selectedImageData })

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
              choices={_stationsList}
              // title
              // disabled
              value={selectedStation}
              setValue={onSelectStation}
            />
            <Select
              choices={edgesList}
              // title
              disabled={Object.keys(selectedStation).length === 0 || edgesList.length === 0}
              value={selectedEdge}
              setValue={onSelectEdge}
            />
            <Select
              choices={dayList}
              // title
              disabled={Object.keys(selectedEdge).length === 0 || dayList.length === 0}
              value={selectedDay}
              setValue={onSelectDay}
            />
            <Select
              choices={idList}
              // title
              disabled={!selectedDay || idList.length === 0}
              value={selectedId}
              setValue={onSelectId}
            />
            <Box sx={style.listBox}>
              <AutoSizer>
                {({ height, width }) => (
                  <FixedSizeList
                    ref={listRef}
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

          <Box sx={style.dataBox}>

            {selectedImageData && imageURL && (
              <AppBar
                height={appBarHeight}
                onClickLeft={onClickLeft}
                onClickRight={onClickRight}
                onClickLeftDisabled={onClickLeftDisabled}
                onClickRightDisabled={onClickRightDisabled}
                showDetections={showDetections}
                showJson={showJson}
                onChangeView={onChangeView}
                onChangeShowDetections={onChangeShowDetections}
                selectedImageData={selectedImageData}
                metadata={inspections.find((item) => item._id === selectedImageData._id)}
                handleUpdateEvent={handleUpdateEvent}
                selectedId={selectedId}
                selectedDay={selectedDay}
                imageURL={imageURL}
              />
            )}

            {showJson
              ? (
                <Box sx={style.jsonBox}>
                  <JsonView
                    src={selectedImageData?.jsonData ?? {}}
                    height={'100%'}
                    width={'100%'}
                    theme={'monokai'}
                  />
                </Box>
              )
              : (
                <TransformWrapper
                // wheel={{ step: 0.2 }}
                // limitToBounds={true}
                >
                  {({ resetTransform }) => (
                    <TransformComponent>
                      {selectedImageData && imageURL && (
                        <Box id="img-wrapper" sx={style.imgWrapper}>
                          <img
                            id="img"
                            src={imageURL}
                            alt=""
                            onLoad={onImageLoad(resetTransform)}
                            style={{
                              objectFit: 'contain',
                              maxHeight: height - appBarHeight - 10,
                              width: 'auto',
                              maxWidth: width - menuWidth - 10,
                              display: 'block'
                            }}
                          />
                          {showDetections && selectedImageData &&
                            <div id="img-drawer" style={style.imgDrawer}>
                              {selectedImageData?.jsonData?.map((data, index) => (
                                <RegionBox key={index} data={data} imageWidth={imageWidth} imageHeight={imageHeight} />
                              ))}
                            </div>
                          }
                        </Box>
                      )}
                    </TransformComponent>
                  )}
                </TransformWrapper>
              )
            }
          </Box>
        </Box>
      }
    </PageWrapper>
  )
}


