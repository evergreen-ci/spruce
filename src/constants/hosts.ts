import { HostStatus } from "types/host";

interface Status {
  title: keyof typeof HostStatus | "Provision Failed";
  value: HostStatus;
  key: HostStatus;
}

export const hostStatuses: Status[] = [
  {
    key: HostStatus.Running,
    title: "Running",
    value: HostStatus.Running,
  },
  {
    key: HostStatus.Terminated,
    title: "Terminated",
    value: HostStatus.Terminated,
  },
  {
    key: HostStatus.Uninitialized,
    title: "Uninitialized",
    value: HostStatus.Uninitialized,
  },

  {
    key: HostStatus.Building,
    title: "Building",
    value: HostStatus.Building,
  },
  {
    key: HostStatus.Starting,
    title: "Starting",
    value: HostStatus.Starting,
  },
  {
    key: HostStatus.Provisioning,
    title: "Provisioning",
    value: HostStatus.Provisioning,
  },
  {
    key: HostStatus.ProvisionFailed,
    title: "Provision Failed",
    value: HostStatus.ProvisionFailed,
  },
  {
    key: HostStatus.Quarantined,
    title: "Quarantined",
    value: HostStatus.Quarantined,
  },
  {
    key: HostStatus.Decommissioned,
    title: "Decommissioned",
    value: HostStatus.Decommissioned,
  },
];
