import { useEffect, useState } from 'react';

// Internal
import Clock from './Clock';
import fetchJson from '../../utils/functions/fetchJson';
import { setNotificationBar } from "../../store/slices/app";
import checkVersion from '../../store/thunks/checkVersion.js';

// Third-party
import { useDispatch } from 'react-redux';
import { useLocation } from "react-router-dom";

export default function CheckVersion({ sleepTime = 3600000 }) {
  const { clock } = Clock({ sleepTime });
  const dispatch = useDispatch();
  const location = useLocation();

  const [JSVersion, setJSVersion] = useState('');

  const fetchAssetManifest = async () => {
    let url = `${window.location.origin}/asset-manifest.json`
    fetchJson(url)
      .then((response) => {
        let manifest = response
        let manifestEntry = manifest.entrypoints
        let index = manifestEntry.findIndex(entry => entry.includes('static/js'));
        setJSVersion(manifestEntry[index].replace('static/js/', '').replace('.js', ''))
      })
  };

  useEffect(() => {
    fetchAssetManifest();

    return () => {
      setJSVersion('');
    };
  }, []);


  useEffect(() => {
    if (location.pathname === '/login') {
      return;
    }
    if (JSVersion) {

      dispatch(checkVersion())
        .then(data => {
          if (data.payload.reload) {
            dispatch(setNotificationBar({
              show: true, message: 'New version available. Reloading...', severity: 'info'
            }))
            setJSVersion('');
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err.message);
          dispatch(setNotificationBar({
            show: true, message: 'New version available. Reloading...', severity: 'info'
          }))
          window.location.reload();
        });
    }
  }, [clock]);

};
