// React
import React from 'react';

// Design

// Internal
import Alerts from './tabs/alerts';
import FromTo from './tabs/fromTo';
import General from './tabs/general';
import Users from './tabs/users';
import Wording from './tabs/wording';
import Stations from './tabs/stations';

// Third-party

const TABS = {
  alerts: Alerts,
  from_to: FromTo,
  general: General,
  users: Users,
  wording: Wording,
  stations: Stations,
}
export default function Builder({
  tab
}) {
  const TAB = TABS[tab];

  return (
    <TAB />
  )
}



