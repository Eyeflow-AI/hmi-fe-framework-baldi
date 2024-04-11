import API from "../../../api";

function postData({ componentsInfo, item, fnExecutor, stationId }) {
  API.post
    .componentData({
      stationId,
      data: componentsInfo,
      component: item,
    })
    .then((response) => {
      console.log({
        response,
        postData: componentsInfo,
        item,
        fnExecutor,
        stationId,
      });
      // fnExecutor(response.data);
    })
    .catch((error) => {
      console.error({ error });
    });
}

export default postData;
