export async function GET<T>(url: string, queryparams?: URLSearchParams) {
  const urlSearchParams = queryparams ?? "";

  const response = await fetch(url + "?" + urlSearchParams);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  const responseJson = (await response.json()) as unknown;

  return responseJson as T;
}
