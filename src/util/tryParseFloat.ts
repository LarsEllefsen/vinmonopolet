export function tryParseFloat(stringToParse: string): number | undefined {
  try {
    return parseFloat(stringToParse);
  } catch {
    return undefined;
  }
}
