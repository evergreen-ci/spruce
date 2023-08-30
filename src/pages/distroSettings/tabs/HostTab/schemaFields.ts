export const version = {
  type: "string" as "string",
  title: "Host Allocator Version",
};
export const roundingRule = {
  type: "string" as "string",
  title: "Host Allocator Rounding Rule",
};
export const feedbackRule = {
  type: "string" as "string",
  title: "Host Allocator Feedback Rule",
};
export const hostsOverallocatedRule = {
  type: "string" as "string",
  title: "Host Overallocation Rule",
};
export const minimumHosts = {
  type: "number" as "number",
  title: "Minimum Number of Hosts Allowed",
};
export const maximumHosts = {
  type: "number" as "number",
  title: "Maxiumum Number of Hosts Allowed",
};
export const acceptableHostIdleTime = {
  type: "number" as "number",
  title: "Acceptable Host Idle Time (s)",
};
export const futureHostFraction = {
  type: "number" as "number",
  title: "Future Host Fraction",
};
