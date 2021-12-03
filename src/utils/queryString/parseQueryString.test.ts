import { parseQueryString } from "./parseQueryString";

describe("parseQueryString", () => {
  it("parses a single query param with a string", () => {
    expect(parseQueryString("status=passed")).toStrictEqual({
      status: "passed",
    });
  });
  it("parses multiple query params that are strings", () => {
    expect(parseQueryString("status=passed&variant=ubuntu1604")).toStrictEqual({
      status: "passed",
      variant: "ubuntu1604",
    });
  });
  it("parses a query param with an array as a value", () => {
    expect(parseQueryString("statuses=failed,passed,ehh")).toStrictEqual({
      statuses: ["failed", "passed", "ehh"],
    });
  });
  it("parses a query param with multiple arrays as value", () => {
    expect(
      parseQueryString("statuses=failed,passed,ehh&variants=ubuntu1604,GLADOS")
    ).toStrictEqual({
      statuses: ["failed", "passed", "ehh"],
      variants: ["ubuntu1604", "GLADOS"],
    });
  });
  it("parses a query param with a mixed array and a single string as a value", () => {
    expect(
      parseQueryString("status=failed&variants=ubuntu1604,GLADOS")
    ).toStrictEqual({
      status: "failed",
      variants: ["ubuntu1604", "GLADOS"],
    });
  });
});
