function select({ obj }) {
  const selectedValue = Object.keys(obj).includes("selectedValue")
  ? obj?.selectedValue
  : "";
  if (!obj) {
    return {
      list: [],
      on: {},
      selectedValue,
    };
  }
  const initialList = Object.keys(obj).includes("list") ? obj?.list : [];
  // const list = [];
  const list = initialList.map((el) => {
    return {
      data: el,
      value: Object.keys(el).includes("value") ? el?.value : "",
      text: Object.keys(el).includes("text") ? el?.text : "",
    };
  });
  const on = Object.keys(obj).includes("on") ? obj?.on : {};


  return {
    list,
    on,
    selectedValue,
  };
}

export default select;
