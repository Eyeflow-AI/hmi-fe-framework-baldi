function button({ obj }) {
  if (!obj) {
    return {
      text: "",
      on: {},
    };
  }
  return {
    text: Object.keys(obj).includes("text") ? obj.text : "",
    tooltip: {
      show:
        Object.keys(obj).includes("tooltip") &&
        Object.keys(obj.tooltip).includes("show")
          ? obj.tooltip.show
          : false,
      title:
        Object.keys(obj).includes("tooltip") &&
        Object.keys(obj.tooltip).includes("title")
          ? obj.tooltip.title
          : "",
    },
    data: Object.keys(obj).includes("data") ? obj?.data : {},
    on: {
      click:
        Object.keys(obj).includes("on") && Object.keys(obj.on).includes("click")
          ? obj.on.click
          : "",
    },
    stationId: Object.keys(obj).includes("stationId") ? obj.stationId : "",
    buttonComponent: Object.keys(obj).includes("buttonComponent") ? obj.buttonComponent : "",
    buttonComponentFnExecutor: Object.keys(obj).includes("buttonComponentFnExecutor")
      ? obj.buttonComponentFnExecutor
      : "",
    buttonComponentFnName: Object.keys(obj).includes("buttonComponentFnName") ? obj.buttonComponentFnName : "",
  };
}

export default button;
