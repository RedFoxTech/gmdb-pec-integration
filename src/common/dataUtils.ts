const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const localeData = require("dayjs/plugin/localeData");
require("dayjs/locale/pt-br");

dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale("pt-br");
dayjs.tz.setDefault(Intl.DateTimeFormat().resolvedOptions().timeZone);

export default dayjs;
