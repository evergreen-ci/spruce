export enum HostStatus {
  // green: host-running
  HostRunning = "running",

  // yellow: host-starting
  HostStarting = "starting",
  HostProvisioning = "provisioning",

  // red: host-terminated
  HostTerminated = "terminated",

  // grey: host-unreachable
  HostDecommissioned = "decommissioned",
  HostQuarantined = "quarantined",
  HostProvisionFailed = "provision failed",

  // sometimes shows not found error on old UI
  HostUninitialized = "initializing",
  HostBuilding = "building",

  // doesn't show up on the host page
  HostStatusSuccess = "success",
  HostStopping = "stopping",
  HostStopped = "stopped",
  HostStatusFailed = "failed",
  HostExternalUserName = "external",
}
