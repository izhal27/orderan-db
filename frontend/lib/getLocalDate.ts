export default function localDate(
  d: Date,
  style: "medium" | "full" | "long" | "short" | undefined,
  includeDate: boolean = true,
  includeTime: boolean = false,
) {
  const date = new Date(d);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Makassar",
  };
  if (includeDate) options.dateStyle = style;
  if (includeTime) options.timeStyle = "long";
  const local = new Intl.DateTimeFormat("id-ID", options).format(date);

  return local;
}
