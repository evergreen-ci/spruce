import { getStatusBadgeCopy } from "./getStatusBadgeCopy";

test("it capitalizes single word statuses", () => {
  expect(getStatusBadgeCopy("success")).toBe("Success");
  expect(getStatusBadgeCopy("failed")).toBe("Failed");
});

test("capitalizes statuses with a hyphen and replaces dash with non-breaking hyphen", () => {
  expect(getStatusBadgeCopy("setup-failed")).toBe("Setup-Failed");
  expect(getStatusBadgeCopy("test-timed-out")).toBe("Test-Timed-Out");
});
