export enum HostStatus {
  Running = "running",
  Terminated = "terminated",
  Uninitialized = "initializing",
  Building = "building",
  Starting = "starting",
  Provisioning = "provisioning",
  ProvisionFailed = "provision failed",
  Quarantined = "quarantined",
  Decommissioned = "decommissioned",
}
