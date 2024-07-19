import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

export default function TimeLine({
  name,
  tag,
  componentsInfo,
  metadata,
  setComponentsInfo,
}) {
  const _list = componentsInfo ? componentsInfo?.filter((el) => el?.name === name)[0]?.output?.list : null;
  const expectedParts = componentsInfo ? componentsInfo?.filter((el) => el.name === name)[0].output.expectedParts : null;
  const tooltip = componentsInfo ? componentsInfo?.filter((el) => el.name === name)[0]?.output?.tooltip : null;
  const list = structuredClone(_list).reverse();
  // const total = list.length;
  // const steps = [];

  // // Adicionar 1 no início
  // steps.push(1);

  // // Adicionar incrementos de 10 a partir de 10
  // for (let i = 10; i <= total; i += 10) {
  //   steps.push(i);
  // }

  // // Adicionar o valor final se não for múltiplo de 10 e não estiver incluído
  // if (total % 10 !== 0 && steps[steps.length - 1] !== total) {
  //   steps.push(total);
  // }

  return (

    <Box sx={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      // height: "min-content"
    }}>

      {list?.map((defect, i) => {
        let color = Boolean(defect.color) ? defect.color : defect?.nok ? "red" : "green";
        let pixel = Math.ceil((1 / 100) * 100) * 20;
        const middle = Math.round(list.length / 2)
        const first = list[0].index;
        const last = list[list.length - 1].index;
        return (
          <Box
            key={i}
            sx={{
              display: "flex",
              width: `${pixel}px`,
              height: "20px",
              flexDirection: "column",
            }}
          >
            <span style={{
              backgroundColor: color,
              height: "100%",
              width: "100%",
            }}></span>
            {
              middle === defect.index || first === defect.index || last === defect.index ?
                <Typography sx={{
                  transform: "translateY(70%)",
                  position: "absolute",
                }}>{defect.index}</Typography>
                :
                null
            }
          </Box>
        );
      })}
      {/* <Box
        sx={{
          display: "flex",
          // border: "1px solid yellow",
          width: "100%",
          height: "100%",
          // backgroundColor: "white",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 0,
          paddingRight: 1,
          flexDirection: "row",
        }}
      >
        {steps.reverse().map((value, index) => (
          <Typography key={index}>{value}</Typography>
        ))}
      </Box> */}
    </Box>

  )
}
