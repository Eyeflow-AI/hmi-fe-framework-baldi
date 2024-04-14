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
  handleNotificationBar,
}) {
  if (functions[fnName]) {
    functions[fnName]({
      componentsInfo,
      item,
      fnExecutor,
      stationId,
      handleNotificationBar,
    });
  } else {
    console.error(`Function ${fnName} not found in eventsHandler`);
  }
}

export default eventsHandler;
