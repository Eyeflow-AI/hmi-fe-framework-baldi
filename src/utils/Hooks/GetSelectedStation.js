import { useSelector } from 'react-redux';


import { getStation } from '../../store/slices/app';


export default function GetSelectedStation() {

  const station = useSelector(getStation);

  return station;
};