import { commitQueueAlias } from "constants/patch";
import { isPatchUnconfigured } from ".";

describe("isPatchUnconfigured", () => {
  it("returns true if patch is unconfigured and false otherwise", () => {
    expect(
      isPatchUnconfigured({ alias: commitQueueAlias, activated: false })
    ).toBe(false);
    expect(
      isPatchUnconfigured({ alias: commitQueueAlias, activated: true })
    ).toBe(false);
    expect(
      isPatchUnconfigured({ alias: "not-commitQueueAlias", activated: false })
    ).toBe(true);
    expect(
      isPatchUnconfigured({ alias: "not-commitQueueAlias", activated: true })
    ).toBe(false);
  });
});
