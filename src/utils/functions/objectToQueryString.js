function objectToQueryString(obj, sendType = false) {
  const keys = Object.keys(obj);
  const keyValuePairs = keys.map((key) => {
    if (sendType) {
      return (
        encodeURIComponent(key) +
        "=" +
        JSON.stringify({
          value: encodeURIComponent(obj[key]),
          type: typeof obj[key],
        })
      );
    } else {
      return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    }
  });
  return keyValuePairs.join("&");
}

export default objectToQueryString;
