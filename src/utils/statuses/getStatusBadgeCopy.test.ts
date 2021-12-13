import { getStatusBadgeCopy } from "./getStatusBadgeCopy";

describe("getStatusBadgeCopy", () => {
  it("capitalizes single word statuses", () => {
    expect(getStatusBadgeCopy("success")).toBe("Success");
    expect(getStatusBadgeCopy("failed")).toBe("Failed");
  });

  it("capitalizes statuses with a hyphen and replaces dash with non-breaking hyphen", () => {
    expect(getStatusBadgeCopy("setup-failed")).toBe("Setup-Failed");
    expect(getStatusBadgeCopy("test-timed-out")).toBe("Test-Timed-Out");
  });
});
