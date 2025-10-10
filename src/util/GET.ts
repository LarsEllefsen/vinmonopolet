export async function GET<T>(url: string, queryparams?: URLSearchParams) {
  const urlSearchParams = queryparams?.toString() ?? "";

  const headers = {
    "Content-Type": "Application/json",
  }

  if (process.env.USER_AGENT) {
    headers["User-Agent"] = process.env.USER_AGENT
  }

  const response = await fetch(url + "?" + urlSearchParams, { headers });

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
