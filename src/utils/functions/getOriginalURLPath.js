import { matchPath } from 'react-router-dom';

export default function getOriginalURLPath(url) {
  
  const pagePathList = Object.entries(window.app_config.pages).map(([key, value]) => value.path);
  for (let pagePath of pagePathList) {
    let match = matchPath({path: pagePath}, url);
    if (match) {
      return match;
    };
  };
  return null;
};