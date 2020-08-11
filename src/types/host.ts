export enum HostStatus {
  // green: host-running
  Running = "running",

  // yellow: host-starting
  Starting = "starting",
  Provisioning = "provisioning",

  // red: host-terminated
  Terminated = "terminated",

  // grey: host-unreachable
  Decommissioned = "decommissioned",
  Quarantined = "quarantined",
  ProvisionFailed = "provision failed",

  // sometimes shows not found error on old UI
  Uninitialized = "initializing",
  Building = "building",

  // doesn't show up on the hosts page
  Success = "success",
  Stopping = "stopping",
  Stopped = "stopped",
  Failed = "failed",
  ExternalUserName = "external",
}

export enum UpdateHostStatus {
  Start = "start",
  Stop = "stop",
  Terminate = "terminate",
}
