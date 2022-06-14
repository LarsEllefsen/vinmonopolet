export default function trimFilter(val) {
  return String(val).trim().replace(/\.$/, "");
}
