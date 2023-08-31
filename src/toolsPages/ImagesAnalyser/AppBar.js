import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LabelIcon from '@mui/icons-material/Label';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import DataObjectIcon from '@mui/icons-material/DataObject';
import PanoramaIcon from '@mui/icons-material/Panorama';
import CloudDoneIcon from '@mui/icons-material/CloudDone';

const style = {
  appBar: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
    width: '100%',
    pr: 1,
    pl: 1,
  }),
  grid: {
    height: '100%'
  }
}


export default function AppBar({ height, onClickRight, onClickLeft, onClickLeftDisabled, onClickRightDisabled, showDetections, showJson, onChangeShowDetections, onChangeView, selectedImageData, metadata, handleUpdateEvent, selectedId, selectedDay }) {
  return (
    <Box height={height} sx={style.appBar}>
      <Grid justifyContent="space-between" alignContent="center" container sx={style.grid}>
        <Grid item>
          <IconButton
            size='large'
            disabled={onClickLeftDisabled}
            onClick={onClickLeft}
          >
            <ArrowBackIosIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <Grid container justifyContent="center" alignContent="center">
            <Grid item>
              <IconButton
                size='large'
                onClick={onChangeShowDetections}
              >
                {showDetections ? <LabelIcon /> : <LabelOutlinedIcon />}
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                size='large'
                onClick={onChangeView}
              >
                {showJson ? <PanoramaIcon /> : <DataObjectIcon />}
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                size='large'
                disabled={true}
              >
                <DownloadIcon />
              </IconButton>
            </Grid>
            {/* <Grid item>
              <IconButton
                size='large'
                disabled={metadata?.uploaded}
                onClick={() => {
                  handleUpdateEvent({
                    data: {
                      jsonData: selectedImageData.jsonData[0],
                      jsonFileData: selectedImageData.jsonFileData,
                      folderInfo: {
                        folderId: selectedId,
                        folderDate: selectedDay
                      },
                    }
                  })
                }}
              >
                {
                  metadata?.uploaded ? <CloudDoneIcon color="success" /> : <CloudUploadIcon />
                }
              </IconButton>
            </Grid> */}
          </Grid>
        </Grid>
        <Grid item>
          <IconButton
            size='large'
            disabled={onClickRightDisabled}
            onClick={onClickRight}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  )
}