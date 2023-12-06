// React
import React, { useEffect, useState, useMemo, useCallback } from "react";

// Design
import { Box, Typography, Card, CardMedia } from "@mui/material";

// Internal
import PageWrapper from "../../components/PageWrapper";
import ImageDialog from "../../components/ImageDialog";
import GetImagesList from "../utils/Hooks/GetImagesList";

// Third-party

const style = {
  mainBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: "background.paper",
    // bgcolor: 'red',
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  }),
};

export default function Monitor({ pageOptions }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [imagePath, setImagePath] = useState("");

  const { imageBaseURL, infoURL } = useMemo(() => {
    return {
      imageBaseURL: pageOptions?.options?.imageURL ?? "",
      infoURL: pageOptions?.options?.infoURL ?? "",
    };
  }, [pageOptions]);

  // const clock = new Date();
  // const imagesList = [
  //   {
  //     camera_name: "camera_name",
  //     frame_time: "frame_time",
  //     // get image from public/assets
  //     full_url: "/assets/cat.webp",
  //   },
  //   {
  //     camera_name: "camera_name",
  //     frame_time: "frame_time",
  //     // get image from public/assets
  //     full_url: "/assets/cat.webp",
  //   },
  //   {
  //     camera_name: "camera_name",
  //     frame_time: "frame_time",
  //     // get image from public/assets
  //     full_url: "/assets/cat.webp",
  //   },
  //   // {
  //   //   camera_name: "camera_name",
  //   //   frame_time: "frame_time",
  //   //   // get image from public/assets
  //   //   full_url: "/assets/cat.webp",
  //   // },
  //   // {
  //   //   camera_name: "camera_name",
  //   //   frame_time: "frame_time",
  //   //   // get image from public/assets
  //   //   full_url: "/assets/cat.webp",
  //   // },
  //   // {
  //   //   camera_name: "camera_name",
  //   //   frame_time: "frame_time",
  //   //   // get image from public/assets
  //   //   full_url: "/assets/cat.webp",
  //   // },
  //   // {
  //   //   camera_name: "camera_name",
  //   //   frame_time: "frame_time",
  //   //   // get image from public/assets
  //   //   full_url: "/assets/cat.webp",
  //   // },
  //   // {
  //   //   camera_name: "camera_name",
  //   //   frame_time: "frame_time",
  //   //   // get image from public/assets
  //   //   full_url: "/assets/cat.webp",
  //   // },
  //   // {
  //   //   camera_name: "camera_name",
  //   //   frame_time: "frame_time",
  //   //   // get image from public/assets
  //   //   full_url: "/assets/cat.webp",
  //   // },
  //   // {
  //   //   camera_name: "camera_name",
  //   //   frame_time: "frame_time",
  //   //   // get image from public/assets
  //   //   full_url: "/assets/cat.webp",
  //   // },
  //   // {
  //   //   camera_name: "camera_name",
  //   //   frame_time: "frame_time",
  //   //   // get image from public/assets
  //   //   full_url: "/assets/cat.webp",
  //   // },
  //   // {
  //   //   camera_name: "camera_name",
  //   //   frame_time: "frame_time",
  //   //   // get image from public/assets
  //   //   full_url: "/assets/cat.webp",
  //   // },
  //   // {
  //   //   camera_name: "camera_name",
  //   //   frame_time: "frame_time",
  //   //   // get image from public/assets
  //   //   full_url: "/assets/cat.webp",
  //   // },
  //   // {
  //   //   camera_name: "camera_name",
  //   //   frame_time: "frame_time",
  //   //   // get image from public/assets
  //   //   full_url: "/assets/cat.webp",
  //   // },
  //   // {
  //   //   camera_name: "camera_name",
  //   //   frame_time: "frame_time",
  //   //   // get image from public/assets
  //   //   full_url: "/assets/cat.webp",
  //   // },
  //   // {
  //   //   camera_name: "camera_name",
  //   //   frame_time: "frame_time",
  //   //   // get image from public/assets
  //   //   full_url: "/assets/cat.webp",
  //   // },
  // ];

  const { clock, imagesList } = GetImagesList({
    url: infoURL,
    imageBaseURL,
    sleepTime: pageOptions?.options?.sleepTime,
  });

  const onOpenDialog = useCallback((item) => {
    return () => {
      setOpenDialog(true);
      setDialogTitle(`${item.camera_name} - ${item.frame_time}`);
      setImagePath(item.full_url);
    };
  }, []);

  useEffect(() => {
    if (!openDialog) {
      setDialogTitle("");
      setImagePath("");
    }
  }, [openDialog]);

  return (
    <PageWrapper>
      {({ width, height }) => (
        <Box width={width} height={height} sx={style.mainBox}>
          <Box
            sx={{
              display: "grid",
              // gridTempla: repeat(auto-fill, minmax(200px, 1fr));
              gridTemplateColumns: `repeat(auto-fill, minmax(${pageOptions?.options?.minMax}, 1fr))`,
              // gap: 16px; /* Adjust the gap as needed *
              gap: "1px",
              width: "calc(100% - 50px)",
              height: "calc(100% - 10px)",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {imagesList.map((item, index) => {
              return (
                // organize the images within the possible space, all the images must get the same size
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    margin: "8px" /* Adjust the margin as needed */,
                    width: "100%",
                  }}
                >
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "calc(100% - 10px)",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={`${
                        item.full_url
                      }?timestamp=${new Date().getTime()}`}
                      alt={item.camera_name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                      onClick={onOpenDialog(item)}
                    />

                    {pageOptions?.options?.showCameraName && (
                      <Typography
                        variant="body1"
                        sx={{
                          width: "100%",
                          height: "100%",
                          textAlign: "center",
                        }}
                      >
                        {item.camera_name}
                      </Typography>
                    )}
                  </Card>
                </Box>
              );
            })}
          </Box>

          <ImageDialog
            open={openDialog}
            setOpen={setOpenDialog}
            imagePath={`${imagePath}?timestamp=${new Date().getTime()}`}
            title={dialogTitle}
          />
        </Box>
      )}
    </PageWrapper>
  );
}
