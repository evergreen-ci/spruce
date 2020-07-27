enum HostStatus {
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

export interface Status {
  title: keyof typeof HostStatus;
  value: HostStatus;
  key: HostStatus;
}

export const statusesTreeData: Status[] = [
  {
    title: "Running",
    value: HostStatus.Running,
    key: HostStatus.Running,
  },
  {
    title: "Terminated",
    value: HostStatus.Terminated,
    key: HostStatus.Terminated,
  },
  {
    title: "Uninitialized",
    value: HostStatus.Uninitialized,
    key: HostStatus.Uninitialized,
  },

  {
    title: "Building",
    value: HostStatus.Building,
    key: HostStatus.Building,
  },
  {
    title: "Starting",
    value: HostStatus.Starting,
    key: HostStatus.Starting,
  },
  {
    title: "Provisioning",
    value: HostStatus.Provisioning,
    key: HostStatus.Provisioning,
  },
  {
    title: "ProvisionFailed",
    value: HostStatus.ProvisionFailed,
    key: HostStatus.ProvisionFailed,
  },
  {
    title: "Quarantined",
    value: HostStatus.Quarantined,
    key: HostStatus.Quarantined,
  },
  {
    title: "Decommissioned",
    value: HostStatus.Decommissioned,
    key: HostStatus.Decommissioned,
  },
];
