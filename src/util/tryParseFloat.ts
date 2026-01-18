export function tryParseFloat(stringToParse: string): number | undefined {
  const result = parseFloat(stringToParse);
  if (isNaN(result)) {
    return undefined;
  }
  return result;
}
