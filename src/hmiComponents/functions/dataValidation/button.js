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
    fnExecutor: Object.keys(obj).includes("fnExecutor")
      ? obj.fnExecutor
      : "",
    fnName: Object.keys(obj).includes("fnName") ? obj.fnName : "",
    disabled: Object.keys(obj).includes("disabled") ? obj.disabled : false,
  };
}

export default button;
