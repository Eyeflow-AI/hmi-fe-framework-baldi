import API from "../../../api";

function postData({
  componentsInfo,
  item,
  fnExecutor,
  stationId,
  handleNotificationBar,
  setLoading,
}) {
  let notificationBar = null;
  API.post
    .componentData({
      stationId,
      data: componentsInfo,
      component: item,
    })
    .then((response) => {
      // console.log({
      //   response,
      //   postData: componentsInfo,
      //   item,
      //   // fnExecutor,
      //   stationId,
      // });
      // console.log({ RESPONSE: response });
      let notification = response?.notification ?? null;
      // console.log({ notification });
      // if (response.ok) {
      if (notification) {
        notificationBar = {
          show: true,
          type: notification.type,
          message: notification.message,
        };
        // }
      } else {
        notificationBar = {
          show: true,
          type: "error",
          message: "error",
        };
      }
    })
    .catch((error) => {
      console.error({ error });
      let notification = error?.data?.notification ?? null;
      // console.log({ notification });
      if (notification) {
        notificationBar = {
          show: true,
          type: notification.type,
          message: notification.message,
        };
      } else {
        notificationBar = {
          show: true,
          type: "error",
          message: "error",
        };
      }
    })
    .finally(() => {
      if (notificationBar) {
        handleNotificationBar(notificationBar.message, notificationBar.type);
      }
      if (setLoading) setLoading(false);
    });
}

export default postData;
