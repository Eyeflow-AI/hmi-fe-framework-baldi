export default function getQueryDateString(date, {dayTimeDelta=0}={}) {
  let newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + dayTimeDelta, 0, 0, 0);
  return newDate.toISOString();
};