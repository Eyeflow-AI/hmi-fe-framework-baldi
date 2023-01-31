import {useState} from 'react';


// import API from '../../api';


const eventsInitialValue = Array.from(Array(20).keys()).map((index) => {
  let event_time = new Date();
  event_time.setHours(event_time.getHours() - index);
  index = 20 - index;
  return {
    index,
    _id: `foo-bar-${index}`,
    label: `foo-bar-${index}`,
    event_time
}});


export default function GetEvents({date, sleepTime=30000}={}) {


  // const [tick, setTick] = useState(0);
  const [events, setEvents] = useState(eventsInitialValue);
  const [loading, setLoading] = useState(null);
  
//   useEffect(() => {
//     const interval = setInterval(() => setTick(oldValue => oldValue + 1), sleepTime);
//     return () => clearInterval(interval);
//     // eslint-disable-next-line
//   }, []);

//   useEffect(() => {
//     API.getInspectionList({
//       params: {
//         simplify: true
//       },
//       setLoading
//     })
//       .then((response) => {
//         let newEvents = response?.inspectionList ?? [];
//         if (JSON.stringify(events) !== JSON.stringify(newEvents)) {
//           setEvents(newEvents);
//         };
//       })
//       .catch(console.log);
//     // eslint-disable-next-line
//   }, [tick, date]);

  return {events, loading, setEvents};
};