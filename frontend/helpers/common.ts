import moment from "moment-timezone";
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getStartAndEndOfDay = () => {
  const start = moment.tz(timezone).startOf('day').utc();
  const end = moment.tz(timezone).endOf('day').utc();
  return { start, end };
};

export const formatToStartDateToUTC = (date: Date) => {
  return moment.tz(date, timezone).startOf('day').utc().format();
};

export const formatToEndDateToUTC = (date: Date) => {
  return moment.tz(date, timezone).add(2, 'day').startOf('day').utc().format();
};

export const isContain = (value: string, search: string) => {
  const regex = new RegExp(`\\b${search}\\b`, 'i');
  return regex.test(value);
};