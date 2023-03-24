import Box from "@mui/material/Box";


// import AppBar from "./AppBar";


const style = {
  mainBox: {
    height: "100vh",
    width: "100vw",
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
  },
  // image: {
  //   width: "40vw",
  //   height: "auto"
  // }
};

export default function LoadingPage() {

  return (
    <Box sx={style.mainBox}>
      {/* <AppBar /> */}
      {/* <img alt="" src={"/assets/EyeFlowInspection-mask.png"} style={style.image}/> */}
    </Box>
  );
};