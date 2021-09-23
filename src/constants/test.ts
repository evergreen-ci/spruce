import { Variant } from "components/Badge";
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
    title: "All",
    value: TestStatus.All,
    key: TestStatus.All,
  },
  {
    title: "Pass",
    value: TestStatus.Pass,
    key: TestStatus.Pass,
  },
  {
    title: "Fail",
    value: TestStatus.Fail,
    key: TestStatus.Fail,
  },
  {
    title: "Skip",
    value: TestStatus.Skip,
    key: TestStatus.Skip,
  },
  {
    title: "Silent Fail",
    value: TestStatus.SilentFail,
    key: TestStatus.SilentFail,
  },
];
