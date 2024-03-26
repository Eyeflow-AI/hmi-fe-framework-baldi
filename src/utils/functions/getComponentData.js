import API from "../../api";

function getType(obj) {
  if (obj instanceof Date) {
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

function putTypeInObjcts(obj) {
  // read the type of the object and return a new object with the type

  let newObj = {};
  for (let key in obj) {
    newObj[key] = {
      type: getType(obj[key]),
      value: encodeURIComponent(obj[key]),
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
  let dataToSend = putTypeInObjcts(query);
  API.get
    .componentData(
      { query: JSON.stringify(dataToSend), component, stationId },
      setLoading
    )
    .then((response) => {
      let data = response?.result;
      if (setResponse) {
        setResponse(data);
      }
    })
    .catch(console.log);
};

export default getComponentData;
