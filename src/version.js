const packageJson = require("../package.json");

global.appVersion = packageJson.version;

export default packageJson.version;
