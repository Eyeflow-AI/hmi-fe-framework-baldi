// imageCard:
// {
//  title: "",
//  status: "", / se não tiver backgroundColor será usado o status
//  adjacentText: "",
//  imageURL: "",
//  imageCaption: "",
//  backgroundColor: "",
//  timestamp: "",
//  tooltip: {
//      show: false,
//      title: ""
// }, / opcional
// data: {},
// on: {
//      click: "() => {}",
//      update: "() => {}"
// }
// }
function imageCard({ obj }) {
  if (!obj) {
    return null;
  }
  return {
    title: obj?.title ?? "",
    adjacentText: obj?.adjacentText ?? "",
    imageURL: obj?.imageURL ?? "",
    showLabels: Object.keys(obj).includes("showLabels")
      ? obj?.showLabels
      : true,
    imageCaption: Object.keys(obj).includes("imageCaption")
      ? obj?.imageCaption
      : "error",
    detections: obj?.detections ?? [],
    status: Object.keys(obj).includes("status") ? obj?.status : "error",
    backgroundColor: Object.keys(obj).includes("backgroundColor")
      ? obj?.backgroundColor
      : "",
    timestamp: obj?.timestamp ?? "",
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
  };
}

export default imageCard;
