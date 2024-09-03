export function getTextContent(document: Document, query: string) {
  const element = document.querySelector(query);
  if (element === null) {
    throw new Error(`Query '${query}' did not have any matches.`);
  }

  if (element.textContent === null) {
    throw new Error(
      `Query '${query}' found element, but it did not have any text content.`
    );
  }

  return element.textContent;
}
