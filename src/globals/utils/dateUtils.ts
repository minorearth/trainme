const formatDate = (unformatted: string) => {
  let date2 = new Date(unformatted);
  const localUnformatted = date2.toLocaleString();
  // const regex =
  //   /(?<day>\d{2})\/(?<month>\d{2})\/(?<age>\d{2})(?<year>\d{2}), (?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})/;
  // // const found = localUnformatted.match(regex).groups;
  // const { year, month, day, hour, minute, second } = found;
  return localUnformatted;
  // return `${date2.getDay()}.${date2.getMonth()}.${date2.get()} ${date2.getHours()}:${date2.getMinutes()}:${date2.getSeconds()} `;
};
