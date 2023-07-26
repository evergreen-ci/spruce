import { commitQueueAlias } from "constants/patch";
import { isPatchUnconfigured } from ".";

describe("isPatchUnconfigured", () => {
  it("returns false for an unactivated commit queue patch", () => {
    expect(
      isPatchUnconfigured({ activated: false, alias: commitQueueAlias })
    ).toBe(false);
  });
  it("returns false for an activated commit queue patch", () => {
    expect(
      isPatchUnconfigured({ activated: true, alias: commitQueueAlias })
    ).toBe(false);
  });
  it("returns true for an unactivated non-commit queue patch", () => {
    expect(
      isPatchUnconfigured({ activated: false, alias: "not-commitQueueAlias" })
    ).toBe(true);
  });
  it("returns false for an activated non-commit queue patch", () => {
    expect(
      isPatchUnconfigured({ activated: true, alias: "not-commitQueueAlias" })
    ).toBe(false);
  });
});
