// React
import React from 'react';

// Design

// Internal
import Alerts from './components/alerts';
import FromTo from './components/fromTo';
import General from './components/general';
import Users from './components/users';
import Wording from './components/wording';

// Third-party

const TABS = {
  alerts: Alerts,
  from_to: FromTo,
  general: General,
  users: Users,
  wording: Wording,
}
export default function Builder({
  tab
}) {
  const TAB = TABS[tab];

  return (
    <TAB />
  )
}



