export default function updatePath (strPath, station) {

  if (station) {
    return strPath.replace(":stationSlugLabel", station?.slugLabel ?? "stationSlugLabel");
  }
  else {
    return station;
  };
};