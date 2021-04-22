import { getStatusBadgeCopy } from "./getStatusBadgeCopy";

test("It capitalizes single word statuses", () => {
  expect(getStatusBadgeCopy("success")).toEqual("Success");
  expect(getStatusBadgeCopy("failed")).toEqual("Failed");
});

test("Capitalizes statuses with a hyphen and replaces dash with non-breaking hyphen", () => {
  expect(getStatusBadgeCopy("setup-failed")).toEqual("Setup-Failed");
  expect(getStatusBadgeCopy("test-timed-out")).toEqual("Test-Timed-Out");
});
