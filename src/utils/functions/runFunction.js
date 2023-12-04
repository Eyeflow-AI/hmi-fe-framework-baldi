const runFunction = (functionString, value) => {
  let result = "";
  try {
    result = eval(functionString)(value);
  } catch (e) {
    console.log({ e });
  } finally {
    return result;
  }
};

export default runFunction;
