function autocomplete({ obj }) {
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
      label: Object.keys(el).includes("label") ? el?.label : "",
    };
  });
  const on = Object.keys(obj).includes("on") ? obj?.on : {};
  const selectedValue = Object.keys(obj).includes("selectedValue")
    ? obj?.selectedValue
    : "";
  const emptyObj = {
    data: {
      info: {
        components:
          Object.keys(obj).includes("emptyObj") &&
          Object.keys(obj.emptyObj).includes("components")
            ? [...obj?.emptyObj?.components]
            : [],
      },
    },
    value: "",
    label: "",
  };
  return {
    list,
    on,
    selectedValue,
    emptyObj,
  };
}

export default autocomplete;
