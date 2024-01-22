export default function getQueryDateString(
  date,
  dayTimeDelta = 0,
  dateType = "start"
) {
  let newDate = new Date();
  if (dateType === "start") {
    newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + dayTimeDelta,
      0,
      0,
      0
    );
  } else if (dateType === "end") {
    newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + dayTimeDelta,
      23,
      59,
      59
    );
  } else if ((dateType = "between")) {
    newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + dayTimeDelta,
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );
  }
  // console.log({ dateType })
  // console.log({date, dayTimeDelta, dateType, newDate: newDate.toISOString()})
  return newDate.toISOString();
}
