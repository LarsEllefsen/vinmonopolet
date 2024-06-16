import qs from "query-string";
import nodeFetch, { Response } from "node-fetch";
import fetchCookie from "fetch-cookie";

const baseUrl = "https://app.vinmonopolet.no/vmpws/v2/vmp";

export interface IRequestOptions {
  query?: { [prop: string]: string | number };
  baseUrl?: string;
  request?: any;
}

function sendRequest(
  path: string,
  options: IRequestOptions = {}
): Promise<Response> {
  const fetch = fetchCookie(nodeFetch);

  const query = options.query ? `?${qs.stringify(options.query)}` : "";
  const reqOpts = options.request || {};
  const base = options.baseUrl || baseUrl;
  const url = `${base}${path}${query}`;
  return fetch(url, reqOpts);
}

sendRequest.get = <T>(path: string, options: IRequestOptions): Promise<T> =>
  sendRequest(path, options)
    .then((data) => {
      const { status, statusText } = data;

      if (status >= 400) {
        throw new Error(getErrorMessage(status, statusText));
      }

      return data.json();
    })
    .then((json) => {
      return json;
    });

sendRequest.head = (path, options) =>
  sendRequest(
    path,
    Object.assign({}, options, {
      method: "HEAD",
    })
  );

sendRequest.raw = (url: string): Promise<Response> => {
  const fetch = fetchCookie(nodeFetch);
  return fetch(url);
};

function getErrorMessage(status, statusText) {
  const baseErr = `HTTP ${status} ${statusText}`.trim();
  // const errMsg = [baseErr].concat(errors.map(stringifyError)).join("\n\n");
  return baseErr;
}

function stringifyError(err) {
  const type = err.type ? `${err.type}: ` : "";
  return `${type}${err.message}`;
}

export default sendRequest;
