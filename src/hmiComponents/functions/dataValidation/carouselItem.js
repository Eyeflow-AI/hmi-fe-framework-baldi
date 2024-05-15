// carouselItem:
// {
//  index: "",
//  code: "",
//  status: "", / se não tiver backgroundColor será usado o status
//  imageURL: "",
//  imageCaption: "",
//  timestamp: "",
//  backgroundColor: "", / opcional
//  tooltip: {
//      show: false,
//      title: ""
// }, / opcional
//  _id: "",
// data: {},
// on: {
//      click: "() => {}",
//      update: "() => {}"
// }
// }
// AVALIABLE STATUS:
// ok ('#79a851')
// ng ('#ce0c27')
// unidentified ('#fec43d')
// repaired ('#5c99ce')
// running ('#79a851')
// paused ('#fec43d')
// closed ('#525252')
function carouselItem({ obj }) {
  if (!obj) {
    return null;
  }

  let output = {
    index: Object.keys(obj).includes("index") ? obj?.index : "",
    label: Object.keys(obj).includes("label") ? obj?.label : "error",
    status: Object.keys(obj).includes("status") ? obj?.status : "error",
    imageURL: Object.keys(obj).includes("imageURL") ? obj?.imageURL : "",
    imageCaption: Object.keys(obj).includes("imageCaption")
      ? obj?.imageCaption
      : "error",
    timestamp: Object.keys(obj).includes("timestamp")
      ? obj?.timestamp
      : "error",
    backgroundColor: Object.keys(obj).includes("backgroundColor")
      ? obj?.backgroundColor
      : "",
    _id: Object.keys(obj).includes("_id") ? obj?._id : String(Math.random()),
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
  return output;
}

export default carouselItem;
