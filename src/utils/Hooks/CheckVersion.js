import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import checkForReloadThunk from '../../store/thunks/checkForReload';
import Clock from './Clock';
import fetchJson from '../../utils/functions/fetchJson';
import { useLocation } from "react-router-dom";

export default function CheckVersion({ sleepTime = 60000 }) {
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

  const [hasReloaded, setHasReloaded] = useState(false);

  useEffect(() => {
    if (location.pathname === '/login') {
      return;
    }
    if (JSVersion) {
      dispatch(checkForReloadThunk({ JSVersion }))
        .then(data => {
          if (data.payload.reload && !hasReloaded) {
            setHasReloaded(true);
            setJSVersion('');
            window.location.reload();
          }
        })
        .catch(console.log);
    }
    return () => {
      setHasReloaded(false); 
    };
  }, [clock]);

};
