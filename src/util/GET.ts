export async function GET<T>(url: string, queryparams?: URLSearchParams) {
  const urlSearchParams = queryparams?.toString() ?? "";

  const response = await fetch(url + "?" + urlSearchParams, {
    headers: {
      "Content-Type": "Application/json",
    },
  });

  if (!response.ok) {
    const parsedErrorResponse = await response.text();
    throw new Error(
      parsedErrorResponse != ""
        ? parsedErrorResponse
        : `Unable to get ${url}?${urlSearchParams}: http error ${response.status}`
    );
  }

  const responseJson = (await response.json()) as any;
  return responseJson as T;
}
