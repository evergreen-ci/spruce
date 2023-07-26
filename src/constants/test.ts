import { Variant } from "@leafygreen-ui/badge";
import { TestStatus } from "types/test";

export const statusToBadgeColor = {
  [TestStatus.Pass]: Variant.Green,
  [TestStatus.Fail]: Variant.Red,
  [TestStatus.SilentFail]: Variant.Blue,
  [TestStatus.Skip]: Variant.Yellow,
};

export const statusCopy = {
  [TestStatus.Pass]: "Pass",
  [TestStatus.Fail]: "Fail",
  [TestStatus.Skip]: "Skip",
  [TestStatus.SilentFail]: "Silent Fail",
};

export const testStatusesFilterTreeData = [
  {
    key: TestStatus.All,
    title: "All",
    value: TestStatus.All,
  },
  {
    key: TestStatus.Pass,
    title: "Pass",
    value: TestStatus.Pass,
  },
  {
    key: TestStatus.Fail,
    title: "Fail",
    value: TestStatus.Fail,
  },
  {
    key: TestStatus.Skip,
    title: "Skip",
    value: TestStatus.Skip,
  },
  {
    key: TestStatus.SilentFail,
    title: "Silent Fail",
    value: TestStatus.SilentFail,
  },
];
