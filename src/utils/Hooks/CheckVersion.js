import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import checkForReloadThunk from '../../store/thunks/checkForReload';
import Clock from './Clock';
import fetchJson from '../../utils/functions/fetchJson';

export default function CheckVersion({ sleepTime = 30000 } = {}) {
  const { clock } = Clock({ sleepTime });
  const dispatch = useDispatch();
  
  const [JSVersion, setJSVersion] = useState('');
  const [reload, setReload] = useState(false);

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
      setReload(false);
    };
  }, []);

  useEffect(() => {
    if (JSVersion && !reload) {
      dispatch(checkForReloadThunk({ JSVersion }))
      .then(res => {
        if (res.reload) {
          console.log(res, JSVersion);
          setReload(true);
        }
      })
      .catch(console.log);
    }
  }, [clock, JSVersion]);

  useEffect(() => {
    window.location.reload(true);
  }, [reload]);

};
