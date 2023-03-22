export enum PodStatus {
  // yellow: pod-starting
  Initializing = "initializing",
  Starting = "starting",

  // green: pod-running
  Running = "running",

  // grey: pod-unreachable
  Decommissioned = "decommissioned",

  // red: pod-terminated
  Terminated = "terminated",
}
