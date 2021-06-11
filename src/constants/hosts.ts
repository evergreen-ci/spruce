import { ALL_VALUE, TreeDataEntry } from "components/TreeSelect";
import { HostStatus } from "types/host";

export const hostStatuses: TreeDataEntry[] = [
  {
    title: "All",
    value: ALL_VALUE,
    key: ALL_VALUE,
  },
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
    title: "Provision Failed",
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
