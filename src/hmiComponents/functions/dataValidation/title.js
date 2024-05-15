// AVALIABLE COLORS:
// ok ('#79a851')
// ng ('#ce0c27')
// unidentified ('#fec43d')
// repaired ('#5c99ce')
// running ('#79a851')
// paused ('#fec43d')
// closed ('#525252')
function title({ obj }) {
  if (!obj) {
    return { text: "" };
  }
  return {
    text: Object.keys(obj).includes("text") ? obj?.text : "",
    backgroundColor: Object.keys(obj).includes("backgroundColor")
      ? obj?.backgroundColor
      : null,
  };
}

export default title;
