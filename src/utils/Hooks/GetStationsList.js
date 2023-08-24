import { useSelector } from 'react-redux';


import { getStationList } from '../../store/slices/app';


export default function GetStationsList() {

  const stationsList = useSelector(getStationList);

  return stationsList;
};