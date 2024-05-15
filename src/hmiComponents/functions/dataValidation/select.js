function select({ obj }) {
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
  const selectedValue = Object.keys(obj).includes("selectedValue")
    ? obj?.selectedValue
    : "";

  return {
    list,
    on,
    selectedValue,
  };
}

export default select;
