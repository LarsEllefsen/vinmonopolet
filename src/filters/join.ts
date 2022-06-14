export default function (keys, filter?) {
  return function joinKeysFilter(value, row) {
    const values: any[] = [];
    keys.forEach((key) => {
      if (row[key]) {
        values.push(filter ? filter(row[key]) : row[key]);
      }
    });
    return values;
  };
}
