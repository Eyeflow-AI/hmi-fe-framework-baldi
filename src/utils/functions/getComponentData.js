import API from "../../api";

function isIsoDate(str) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return d instanceof Date && !isNaN(d) && d.toISOString() === str;
}

function getType(obj) {
  // check if boolean
  if (obj === true || obj === false) {
    return "boolean";
  }

  if (
    (new Date(obj) &&
      isIsoDate(obj) &&
      new Date(obj) instanceof Date &&
      String(new Date(obj)) !== "Invalid Date" &&
      !(obj instanceof Boolean)) ||
    obj instanceof Date
  ) {
    return "date";
  }
  if (obj === null) {
    return "null";
  }
  if (obj === undefined) {
    return "undefined";
  }
  if (Array.isArray(obj)) {
    return "array";
  }

  if (Number.isNaN(obj)) {
    return "NaN";
  }

  if (typeof obj === "number") {
    if (Number.isInteger(obj)) {
      return "integer";
    }
    return "float";
  }
  return typeof obj;
}

function putTypeInObjects(obj) {
  // read the type of the object and return a new object with the type

  let newObj = {};
  for (let key in obj) {
    let type = getType(obj[key]);
    let value = encodeURIComponent(obj[key]);
    if (type === "object") {
      // newObj[key] = putTypeInObjcts(obj[key]);
      // continue;
      value = JSON.stringify(obj[key]);
    }

    newObj[key] = {
      type,
      value,
    };
  }
  return newObj;
}

const getComponentData = ({
  query,
  component,
  stationId,
  setLoading = null,
  setResponse = null,
}) => {
  let dataToSend = putTypeInObjects(query);
  console.log({ dataToSend });
  API.get
    .componentData(
      { query: JSON.stringify(dataToSend), component, stationId },
      setLoading
    )
    .then((response) => {
      let data = response?.result;
      console.log({ response: data });
      if (setResponse) {
        setResponse(data);
      }
      return data;
    })
    .catch((err) => {
      console.log({ err });
      if (setResponse) {
        setResponse({});
      }
      return {};
    });
};

export default getComponentData;
