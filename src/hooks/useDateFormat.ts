import { getDateCopy, DateCopyOptions } from "utils/string";
import { useUserSettings } from "./useUserSettings";
import { useUserTimeZone } from "./useUserTimeZone";

export const useDateFormat = () => {
  const timezone = useUserTimeZone();
  const { userSettings } = useUserSettings();
  const { dateFormat, timeFormat } = userSettings || {};

  return (date: string | number | Date, options: DateCopyOptions = {}) =>
    getDateCopy(date, {
      tz: timezone,
      dateFormat,
      timeFormat,
      ...options,
    });
};
