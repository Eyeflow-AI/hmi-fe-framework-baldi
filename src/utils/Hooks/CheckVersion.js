import { useEffect } from 'react';

// Internal
import Clock from './Clock';
import { authSlice } from '../../store/slices/auth';

// Third-party
import { useDispatch } from 'react-redux';

export default function CheckVersion({ sleepTime = 300000 }) {
  const { clock } = Clock({ sleepTime });
  const dispatch = useDispatch();

  const checkMetaVersion = () => {
    fetch("/meta.json")
      .then((response) => response.json())
      .then((meta) => {
        if (meta.version !== global.appVersion) {
          console.log("Version is outdated, reloading in 30 seconds",{m: meta.version, g: global.appVersion});
          setTimeout(() => {
            window.location.reload();
            dispatch(authSlice.actions.logout());
            window.location.reload();
          }, 30000);
        }
      })
      .catch(console.log);
  }

  useEffect(() => {
    checkMetaVersion();
    }, [clock]);
};
