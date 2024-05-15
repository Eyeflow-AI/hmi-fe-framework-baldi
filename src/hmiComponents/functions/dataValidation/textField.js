function textField({ obj }) {
  if (!obj) {
    return { text: "" };
  }
  return {
    text: Object.keys(obj).includes("text") ? obj?.text : "",
    disabled: obj?.disabled ?? true,
    on: {
      change:
        Object.keys(obj).includes("on") &&
        Object.keys(obj.on).includes("change")
          ? obj.on.change
          : "",
    },
  };
}

export default textField;
