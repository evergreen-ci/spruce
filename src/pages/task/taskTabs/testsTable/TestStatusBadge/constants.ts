import { Variant } from "@leafygreen-ui/badge";
import { TestStatus } from "types/test";

export const statusToBadgeColor = {
  [TestStatus.Pass]: Variant.Green,
  [TestStatus.Fail]: Variant.Red,
  [TestStatus.SilentFail]: Variant.Blue,
  [TestStatus.Skip]: Variant.Yellow,
  [TestStatus.Timeout]: Variant.Red,
};

export const statusCopy = {
  [TestStatus.Pass]: "Pass",
  [TestStatus.Fail]: "Fail",
  [TestStatus.Skip]: "Skip",
  [TestStatus.SilentFail]: "Silent Fail",
  [TestStatus.Timeout]: "Timeout",
};
