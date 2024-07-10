function radioGroup({ obj }) {
//   if (!obj || !Array.isArray(obj)) {
//     return [];
//   }
//   return obj;

  if (!obj) {
    return {
      list: [],
      on: {},
      selectedValue,
      row: true
    };
  }
  const initialList = Object.keys(obj).includes("list") ? obj?.list : [];
  const list = initialList.map((el) => {
    return {
      data: el,
      value: Object.keys(el).includes("value") ? el?.value : "",
      label: Object.keys(el).includes("label") ? el?.label : "",
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

export default radioGroup;
