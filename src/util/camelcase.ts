export default function camelCase(str: string) {
  const string = str.replace(/[-_\s]+(.)?/g, (match, chr) =>
    chr ? chr.toUpperCase() : ""
  );

  return string.substr(0, 1).toLowerCase() + string.substr(1);
}
