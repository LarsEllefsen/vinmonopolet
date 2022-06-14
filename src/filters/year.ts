export default (year: string) => {
  return year && year !== "0000" ? Number(year) : null;
};
