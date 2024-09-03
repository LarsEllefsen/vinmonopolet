import { DataProps } from "./types";

export function getDataPropsFromDocument(document: Document) {
  const dataPropsElement = document.querySelector("main[data-react-props]");
  const dataProps = dataPropsElement?.getAttribute("data-react-props");
  if (dataPropsElement === null || !dataProps) return null;

  return JSON.parse(dataProps) as DataProps;
}
