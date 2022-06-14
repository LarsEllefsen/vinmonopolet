// const request = require("request-promise-native");
// const objectAssign = require("object-assign");
// const qs = require("query-string");
// const promiseProps = require("promise-props");

import qs from "query-string";
import promiseProps from "promise-props";
import nodeFetch, { Response } from "node-fetch";
import fetchCookie from "fetch-cookie";

import fs from "fs";
import p from "path";

const baseUrl = "https://app.vinmonopolet.no/vmpws/v2/vmp";

interface IRequestOptions {
  query?: string;
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

sendRequest.get = (path, options): Promise<any> =>
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
