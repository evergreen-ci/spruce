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

export enum PodEvent {
  StatusChange = "STATUS_CHANGE",
  ContainerTaskFinished = "CONTAINER_TASK_FINISHED",
  ClearedTask = "CLEARED_TASK",
  AssignedTask = "ASSIGNED_TASK",
}
