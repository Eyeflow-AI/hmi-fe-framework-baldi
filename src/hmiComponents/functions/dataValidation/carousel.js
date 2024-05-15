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

function carousel({ obj }) {
  let finalList = [];
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      try {
        let _obj = obj[i];
        finalList.push({
          index: Object.keys(_obj).includes("index") ? _obj?.index : "error",
          label: Object.keys(_obj).includes("label") ? _obj?.label : "error",
          status: Object.keys(_obj).includes("status") ? _obj?.status : "error",
          imageURL: Object.keys(_obj).includes("imageURL")
            ? _obj?.imageURL
            : "",
          imageCaption: Object.keys(_obj).includes("imageCaption")
            ? _obj?.imageCaption
            : "error",
          timestamp: Object.keys(_obj).includes("timestamp")
            ? _obj?.timestamp
            : "error",
          backgroundColor: Object.keys(_obj).includes("backgroundColor")
            ? _obj?.backgroundColor
            : "",
          _id: Object.keys(_obj).includes("_id")
            ? _obj?._id
            : String(Math.random()),
          tooltip: {
            show:
              Object.keys(_obj).includes("tooltip") &&
              Object.keys(_obj.tooltip).includes("show")
                ? _obj.tooltip.show
                : false,
            title:
              Object.keys(_obj).includes("tooltip") &&
              Object.keys(_obj.tooltip).includes("title")
                ? _obj.tooltip.title
                : "",
          },
          data: Object.keys(_obj).includes("data") ? _obj?.data : {},
          on: {
            click:
              Object.keys(_obj).includes("on") &&
              Object.keys(_obj.on).includes("click")
                ? _obj.on.click
                : "",
            update:
              Object.keys(_obj).includes("on") &&
              Object.keys(_obj.on).includes("update")
                ? _obj.on.update
                : "",
          },
        });
      } catch (err) {
        finalList.push({
          index: "error",
          label: "error",
          status: "error",
          imageURL: "",
          imageCaption: "error",
          timestamp: "error",
          backgroundColor: "#7f000000",
          _id: String(Math.random()),
          tooltip: {
            show: false,
            title: "",
          },
          data: {},
          on: {
            click: "",
            update: "",
          },
        });
      }
    }
  }
  finalList = finalList.reverse();
  return finalList;
}

export default carousel;
