import { commitQueueAlias } from "constants/patch";
import { isPatchUnconfigured } from ".";

describe("isPatchUnconfigured", () => {
  it("returns false for an unactivated commit queue patch", () => {
    expect(
      isPatchUnconfigured({ alias: commitQueueAlias, activated: false }),
    ).toBe(false);
  });
  it("returns false for an activated commit queue patch", () => {
    expect(
      isPatchUnconfigured({ alias: commitQueueAlias, activated: true }),
    ).toBe(false);
  });
  it("returns true for an unactivated non-commit queue patch", () => {
    expect(
      isPatchUnconfigured({ alias: "not-commitQueueAlias", activated: false }),
    ).toBe(true);
  });
  it("returns false for an activated non-commit queue patch", () => {
    expect(
      isPatchUnconfigured({ alias: "not-commitQueueAlias", activated: true }),
    ).toBe(false);
  });
});
