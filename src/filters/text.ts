export default function textFilter(val) {
  return String(val).trim().replace(/\\'/g, "'");
}
