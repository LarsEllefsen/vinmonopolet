interface IGETOptions {
  queryParams?: { [key: string]: string };
}

export async function GET<T>(url: string, { queryParams }: IGETOptions) {
  const urlSearchParams = queryParams
    ? `?${new URLSearchParams(queryParams)}`
    : "";

  const response = await fetch(url + urlSearchParams);

  if (!response.ok) {
    console.log(response.status);
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  const responseJson = (await response.json()) as unknown;

  return responseJson as T;
}
