import { useEffect } from "react";

// Internal
import Clock from "./Clock";
import { authSlice } from "../../store/slices/auth";

// Third-party
import { useDispatch } from "react-redux";

export default function CheckVersion({ sleepTime = 10000 }) {
  const { clock } = Clock({ sleepTime });
  const dispatch = useDispatch();

  const checkMetaVersion = () => {
    if (global.updating) return;

    console.log("Checking meta version...");
    const origin = window.location.origin;
    let url = `${origin}/meta.json?time=${new Date()}`;
    // console.log({ url });
    // no cache
    fetch(url, {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((meta) => {
        let timeForReloading = 60000;
        if (meta && meta.version !== global.appVersion && !global.updating) {
          console.log(`Version is outdated, reloading in 1 minute...`);
          setTimeout(() => {
            window.location.reload();
            dispatch(authSlice.actions.logout());
            window.location.reload();
          }, timeForReloading);
          global.updating = true;
        }
      })
      .catch(console.log);
  };

  useEffect(() => {
    checkMetaVersion();
  }, [clock]);
}
