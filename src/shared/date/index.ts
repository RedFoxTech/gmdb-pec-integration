import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(Intl.DateTimeFormat().resolvedOptions().timeZone);

export default dayjs;
