import VinmonopoletError from "../exceptions/VinmonopoletError";

export async function GET<T>(url: string, queryparams?: URLSearchParams) {
  try {
    const urlSearchParams = queryparams?.toString() ?? "";

    const headers = {
      "Content-Type": "Application/json",
    };

    if (process.env.USER_AGENT) {
      headers["User-Agent"] = process.env.USER_AGENT;
    }

    const response = await fetch(url + "?" + urlSearchParams, { headers });

    if (!response.ok) {
      const parsedErrorResponse = await response.text();
      throw new VinmonopoletError(
        parsedErrorResponse != ""
          ? parsedErrorResponse
          : `Unable to get ${url}?${urlSearchParams}: http error ${response.status}`,
        response.status
      );
    }

    const responseJson = (await response.json()) as any;
    return responseJson as T;
  } catch (error) {
    if (error instanceof VinmonopoletError) throw error;
    if (error instanceof Error)
      throw new VinmonopoletError(
        `Network error fetching ${url}: ${error.message}`
      );
    throw new VinmonopoletError(`Network error fetching ${url}: ${error}`);
  }
}
