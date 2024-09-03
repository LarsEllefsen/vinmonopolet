import path from "node:path";
import { JSDOM } from "jsdom";
import { getDataPropsFromDocument } from "../src/util/getDataPropsFromDocument";
import { expect } from "chai";

describe("productDocument", () => {
  it("", async () => {
    const dom = await JSDOM.fromFile(path.resolve(__dirname, "test.html"));
    const dataProps = getDataPropsFromDocument(dom.window.document);

    expect(dataProps).to.not.be.null;
    expect(dataProps?.product.ageLimit).to.equal(18);
    expect(dataProps?.product.code).to.equal("229601");
  });
});
