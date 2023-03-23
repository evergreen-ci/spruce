export enum PodStatus {
  // yellow: pod-starting
  Starting = "starting",

  // green: pod-running
  Running = "running",

  // grey: pod-unreachable
  Initializing = "initializing",
  Decommissioned = "decommissioned",

  // red: pod-terminated
  Terminated = "terminated",
}
