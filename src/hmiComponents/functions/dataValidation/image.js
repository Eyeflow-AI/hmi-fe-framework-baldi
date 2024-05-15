// AVALIABLE COLORS:
// ok ('#79a851')
// ng ('#ce0c27')
// unidentified ('#fec43d')
// repaired ('#5c99ce')
// running ('#79a851')
// paused ('#fec43d')
// closed ('#525252')
function image({ obj }) {
  if (!obj) {
    return {
      imageURL: "",
      imageCaption: "",
    };
  }
  return {
    imageURL: obj?.imageURL ?? "",
    imageCaption: Object.keys(obj).includes("imageCaption")
      ? obj?.imageCaption
      : "error",
    detections: obj?.detections ?? [],
    showLabels: Object.keys(obj).includes("showLabels")
      ? obj?.showLabels
      : true,
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
      update:
        Object.keys(obj).includes("on") &&
        Object.keys(obj.on).includes("update")
          ? obj.on.update
          : "",
    },
    backgroundColor: Object.keys(obj).includes("backgroundColor")
      ? obj?.backgroundColor
      : null,
  };
}

export default image;
