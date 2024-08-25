export default function localDate() {
  const date = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const local = new Intl.DateTimeFormat(
    'id-ID',
    {
      dateStyle: 'full',
      timeZone: 'Asia/Makassar',
    }).format(date)

  return local;
}