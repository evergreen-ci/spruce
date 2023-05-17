import {
  getParsleyBuildLogURL,
  getParsleyTestLogURL,
} from "./externalResources";

describe("getParsleyTestLogURL", () => {
  it("generates the correct url", () => {
    expect(getParsleyTestLogURL("myBuildId", "myTestId")).toBe(
      "/resmoke/myBuildId/test/myTestId"
    );
  });
});

describe("getParsleyBuildLogURL", () => {
  it("generates the correct url", () => {
    expect(getParsleyBuildLogURL("myBuildId")).toBe("/resmoke/myBuildId/all");
  });
});
