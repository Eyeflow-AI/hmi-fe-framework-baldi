import setComponentsInfo from "./setComponentsInfo";
import postData from "./postData";

const functions = {
  setComponentsInfo,
  postData,
};

function eventsHandler({ fnName, fnExecutor, item, componentsInfo }) {
  if (functions[fnName]) {
    functions[fnName]({ componentsInfo, item, fnExecutor });
  } else {
    console.error(`Function ${fnName} not found in eventsHandler`);
  }
}

export default eventsHandler;
