import { XMLParser } from "fast-xml-parser";

export async function GET<T>(url: string, queryparams?: URLSearchParams) {
  const urlSearchParams = queryparams?.toString() ?? "";

  const response = await fetch(url + "?" + urlSearchParams, {
    headers: {
      "Content-Type": "Application/json",
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  const responseJson = (await response.json()) as any;
  return responseJson as T;
}
