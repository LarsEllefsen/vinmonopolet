import { JSDOM } from "jsdom";

export async function getDocument(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  const DOM = new JSDOM(await response.text());

  return DOM.window.document;
}
