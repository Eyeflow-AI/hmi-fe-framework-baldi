import setComponentsInfo from "./setComponentsInfo";
import postData from "./postData";

const functions = {
  setComponentsInfo,
  postData,
};

function eventsHandler({
  fnName,
  fnExecutor,
  item,
  componentsInfo,
  stationId,
}) {
  if (functions[fnName]) {
    functions[fnName]({ componentsInfo, item, fnExecutor, stationId });
  } else {
    console.error(`Function ${fnName} not found in eventsHandler`);
  }
}

export default eventsHandler;
