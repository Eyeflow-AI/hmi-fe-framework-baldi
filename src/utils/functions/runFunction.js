const runFunction = (functionString, value) => {
  let result = "";
  // console.log(value.replace(".", ""));
  // console.log(value.split(".")?.[1] === "00");
  // console.log({ functionString, value });
  try {
    // eslint-disable-next-line no-eval
    result = eval(functionString)(value);
  } catch (e) {
    console.log({ e });
  } finally {
    return result;
  }
};

export default runFunction;
