export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Time: Date;
  Duration: number;
  StringMap: { [key: string]: any };
};

export type Query = {
  userPatches: UserPatches;
  task?: Maybe<Task>;
  taskAllExecutions: Array<Task>;
  patch: Patch;
  projects: Projects;
  patchTasks: PatchTasks;
  taskTests: TaskTestResult;
  taskFiles: TaskFiles;
  user: User;
  taskLogs: RecentTaskLogs;
  patchBuildVariants: Array<PatchBuildVariant>;
  commitQueue: CommitQueue;
  userSettings?: Maybe<UserSettings>;
  spruceConfig?: Maybe<SpruceConfig>;
  awsRegions?: Maybe<Array<Scalars["String"]>>;
  userConfig?: Maybe<UserConfig>;
  clientConfig?: Maybe<ClientConfig>;
  host?: Maybe<Host>;
  hostEvents: HostEvents;
  hosts: HostsResponse;
  myHosts: Array<Host>;
  myVolumes: Array<Volume>;
  myPublicKeys: Array<PublicKey>;
  distros: Array<Maybe<Distro>>;
  instanceTypes: Array<Scalars["String"]>;
  distroTaskQueue: Array<TaskQueueItem>;
  taskQueueDistros: Array<TaskQueueDistro>;
  buildBaron: BuildBaron;
  bbGetCreatedTickets: Array<JiraTicket>;
};

export type QueryUserPatchesArgs = {
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
  patchName?: Maybe<Scalars["String"]>;
  statuses?: Maybe<Array<Scalars["String"]>>;
  userId?: Maybe<Scalars["String"]>;
  includeCommitQueue?: Maybe<Scalars["Boolean"]>;
};

export type QueryTaskArgs = {
  taskId: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
};

export type QueryTaskAllExecutionsArgs = {
  taskId: Scalars["String"];
};

export type QueryPatchArgs = {
  id: Scalars["String"];
};

export type QueryPatchTasksArgs = {
  patchId: Scalars["String"];
  sortBy?: Maybe<TaskSortCategory>;
  sortDir?: Maybe<SortDirection>;
  page?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  statuses?: Maybe<Array<Scalars["String"]>>;
  baseStatuses?: Maybe<Array<Scalars["String"]>>;
  variant?: Maybe<Scalars["String"]>;
  taskName?: Maybe<Scalars["String"]>;
};

export type QueryTaskTestsArgs = {
  taskId: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
  sortCategory?: Maybe<TestSortCategory>;
  sortDirection?: Maybe<SortDirection>;
  page?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  testName?: Maybe<Scalars["String"]>;
  statuses?: Array<Scalars["String"]>;
};

export type QueryTaskFilesArgs = {
  taskId: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
};

export type QueryUserArgs = {
  userId?: Maybe<Scalars["String"]>;
};

export type QueryTaskLogsArgs = {
  taskId: Scalars["String"];
};

export type QueryPatchBuildVariantsArgs = {
  patchId: Scalars["String"];
};

export type QueryCommitQueueArgs = {
  id: Scalars["String"];
};

export type QueryHostArgs = {
  hostId: Scalars["String"];
};

export type QueryHostEventsArgs = {
  hostId: Scalars["String"];
  hostTag?: Maybe<Scalars["String"]>;
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

export type QueryHostsArgs = {
  hostId?: Maybe<Scalars["String"]>;
  distroId?: Maybe<Scalars["String"]>;
  currentTaskId?: Maybe<Scalars["String"]>;
  statuses?: Maybe<Array<Scalars["String"]>>;
  startedBy?: Maybe<Scalars["String"]>;
  sortBy?: Maybe<HostSortBy>;
  sortDir?: Maybe<SortDirection>;
  page?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
};

export type QueryDistrosArgs = {
  onlySpawnable: Scalars["Boolean"];
};

export type QueryDistroTaskQueueArgs = {
  distroId: Scalars["String"];
};

export type QueryBuildBaronArgs = {
  taskId: Scalars["String"];
  execution: Scalars["Int"];
};

export type QueryBbGetCreatedTicketsArgs = {
  taskId: Scalars["String"];
};

export type Mutation = {
  addFavoriteProject: Project;
  removeFavoriteProject: Project;
  schedulePatch: Patch;
  schedulePatchTasks?: Maybe<Scalars["String"]>;
  unschedulePatchTasks?: Maybe<Scalars["String"]>;
  restartPatch?: Maybe<Scalars["String"]>;
  enqueuePatch: Patch;
  setPatchPriority?: Maybe<Scalars["String"]>;
  scheduleTask: Task;
  unscheduleTask: Task;
  abortTask: Task;
  setTaskPriority: Task;
  restartTask: Task;
  saveSubscription: Scalars["Boolean"];
  removePatchFromCommitQueue?: Maybe<Scalars["String"]>;
  updateUserSettings: Scalars["Boolean"];
  restartJasper: Scalars["Int"];
  updateHostStatus: Scalars["Int"];
  createPublicKey: Array<PublicKey>;
  spawnHost: Host;
  spawnVolume: Scalars["Boolean"];
  updateVolume: Scalars["Boolean"];
  updateSpawnHostStatus: Host;
  removePublicKey: Array<PublicKey>;
  updatePublicKey: Array<PublicKey>;
  attachVolumeToHost: Scalars["Boolean"];
  detachVolumeFromHost: Scalars["Boolean"];
  removeVolume: Scalars["Boolean"];
  editSpawnHost: Host;
  bbCreateTicket: Scalars["Boolean"];
};

export type MutationAddFavoriteProjectArgs = {
  identifier: Scalars["String"];
};

export type MutationRemoveFavoriteProjectArgs = {
  identifier: Scalars["String"];
};

export type MutationSchedulePatchArgs = {
  patchId: Scalars["String"];
  reconfigure: PatchReconfigure;
};

export type MutationSchedulePatchTasksArgs = {
  patchId: Scalars["String"];
};

export type MutationUnschedulePatchTasksArgs = {
  patchId: Scalars["String"];
  abort: Scalars["Boolean"];
};

export type MutationRestartPatchArgs = {
  patchId: Scalars["String"];
  abort: Scalars["Boolean"];
  taskIds: Array<Scalars["String"]>;
};

export type MutationEnqueuePatchArgs = {
  patchId: Scalars["String"];
};

export type MutationSetPatchPriorityArgs = {
  patchId: Scalars["String"];
  priority: Scalars["Int"];
};

export type MutationScheduleTaskArgs = {
  taskId: Scalars["String"];
};

export type MutationUnscheduleTaskArgs = {
  taskId: Scalars["String"];
};

export type MutationAbortTaskArgs = {
  taskId: Scalars["String"];
};

export type MutationSetTaskPriorityArgs = {
  taskId: Scalars["String"];
  priority: Scalars["Int"];
};

export type MutationRestartTaskArgs = {
  taskId: Scalars["String"];
};

export type MutationSaveSubscriptionArgs = {
  subscription: SubscriptionInput;
};

export type MutationRemovePatchFromCommitQueueArgs = {
  commitQueueId: Scalars["String"];
  patchId: Scalars["String"];
};

export type MutationUpdateUserSettingsArgs = {
  userSettings?: Maybe<UserSettingsInput>;
};

export type MutationRestartJasperArgs = {
  hostIds: Array<Scalars["String"]>;
};

export type MutationUpdateHostStatusArgs = {
  hostIds: Array<Scalars["String"]>;
  status: Scalars["String"];
  notes?: Maybe<Scalars["String"]>;
};

export type MutationCreatePublicKeyArgs = {
  publicKeyInput: PublicKeyInput;
};

export type MutationSpawnHostArgs = {
  spawnHostInput?: Maybe<SpawnHostInput>;
};

export type MutationSpawnVolumeArgs = {
  spawnVolumeInput: SpawnVolumeInput;
};

export type MutationUpdateVolumeArgs = {
  updateVolumeInput: UpdateVolumeInput;
};

export type MutationUpdateSpawnHostStatusArgs = {
  hostId: Scalars["String"];
  action: SpawnHostStatusActions;
};

export type MutationRemovePublicKeyArgs = {
  keyName: Scalars["String"];
};

export type MutationUpdatePublicKeyArgs = {
  targetKeyName: Scalars["String"];
  updateInfo: PublicKeyInput;
};

export type MutationAttachVolumeToHostArgs = {
  volumeAndHost: VolumeHost;
};

export type MutationDetachVolumeFromHostArgs = {
  volumeId: Scalars["String"];
};

export type MutationRemoveVolumeArgs = {
  volumeId: Scalars["String"];
};

export type MutationEditSpawnHostArgs = {
  spawnHost?: Maybe<EditSpawnHostInput>;
};

export type MutationBbCreateTicketArgs = {
  taskId: Scalars["String"];
};

export enum SpawnHostStatusActions {
  Start = "START",
  Stop = "STOP",
  Terminate = "TERMINATE",
}

export enum TaskSortCategory {
  Name = "NAME",
  Status = "STATUS",
  BaseStatus = "BASE_STATUS",
  Variant = "VARIANT",
}

export enum TestSortCategory {
  Status = "STATUS",
  Duration = "DURATION",
  TestName = "TEST_NAME",
}

export enum SortDirection {
  Asc = "ASC",
  Desc = "DESC",
}

export enum MetStatus {
  Unmet = "UNMET",
  Met = "MET",
  Pending = "PENDING",
}

export enum RequiredStatus {
  MustFail = "MUST_FAIL",
  MustFinish = "MUST_FINISH",
  MustSucceed = "MUST_SUCCEED",
}

export enum HostSortBy {
  Id = "ID",
  Distro = "DISTRO",
  CurrentTask = "CURRENT_TASK",
  Status = "STATUS",
  Elapsed = "ELAPSED",
  Uptime = "UPTIME",
  IdleTime = "IDLE_TIME",
  Owner = "OWNER",
}

export enum TaskQueueItemType {
  Commit = "COMMIT",
  Patch = "PATCH",
}

export type VolumeHost = {
  volumeId: Scalars["String"];
  hostId: Scalars["String"];
};

export type PatchReconfigure = {
  description: Scalars["String"];
  variantsTasks: Array<VariantTasks>;
};

export type VariantTasks = {
  variant: Scalars["String"];
  tasks: Array<Scalars["String"]>;
  displayTasks: Array<DisplayTask>;
};

export type DisplayTask = {
  Name: Scalars["String"];
  ExecTasks: Array<Scalars["String"]>;
};

export type SubscriptionInput = {
  resource_type?: Maybe<Scalars["String"]>;
  trigger?: Maybe<Scalars["String"]>;
  selectors: Array<SelectorInput>;
  regex_selectors: Array<SelectorInput>;
  subscriber: SubscriberInput;
  owner_type?: Maybe<Scalars["String"]>;
  owner?: Maybe<Scalars["String"]>;
  trigger_data: Scalars["StringMap"];
};

export type UserSettingsInput = {
  timezone?: Maybe<Scalars["String"]>;
  region?: Maybe<Scalars["String"]>;
  githubUser?: Maybe<GithubUserInput>;
  slackUsername?: Maybe<Scalars["String"]>;
  notifications?: Maybe<NotificationsInput>;
  useSpruceOptions?: Maybe<UseSpruceOptionsInput>;
};

export type SelectorInput = {
  type: Scalars["String"];
  data: Scalars["String"];
};

export type SubscriberInput = {
  type: Scalars["String"];
  target: Scalars["String"];
};

export type UseSpruceOptionsInput = {
  hasUsedSpruceBefore?: Maybe<Scalars["Boolean"]>;
  spruceV1?: Maybe<Scalars["Boolean"]>;
};

export type SpawnHostInput = {
  distroId: Scalars["String"];
  region: Scalars["String"];
  savePublicKey: Scalars["Boolean"];
  publicKey: PublicKeyInput;
  userDataScript?: Maybe<Scalars["String"]>;
  expiration?: Maybe<Scalars["Time"]>;
  noExpiration: Scalars["Boolean"];
  setUpScript?: Maybe<Scalars["String"]>;
  isVirtualWorkStation: Scalars["Boolean"];
  homeVolumeSize?: Maybe<Scalars["Int"]>;
  volumeId?: Maybe<Scalars["String"]>;
};

export type EditSpawnHostInput = {
  hostId: Scalars["String"];
  displayName?: Maybe<Scalars["String"]>;
  expiration?: Maybe<Scalars["Time"]>;
  noExpiration?: Maybe<Scalars["Boolean"]>;
  instanceType?: Maybe<Scalars["String"]>;
  addedInstanceTags?: Maybe<Array<InstanceTagInput>>;
  deletedInstanceTags?: Maybe<Array<InstanceTagInput>>;
  volume?: Maybe<Scalars["String"]>;
};

export type SpawnVolumeInput = {
  availabilityZone: Scalars["String"];
  size: Scalars["Int"];
  type: Scalars["String"];
  expiration?: Maybe<Scalars["Time"]>;
  noExpiration?: Maybe<Scalars["Boolean"]>;
  host?: Maybe<Scalars["String"]>;
};

export type UpdateVolumeInput = {
  expiration?: Maybe<Scalars["Time"]>;
  noExpiration?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  volumeId: Scalars["String"];
};

export type TaskQueueItem = {
  id: Scalars["ID"];
  displayName: Scalars["String"];
  project: Scalars["String"];
  buildVariant: Scalars["String"];
  expectedDuration: Scalars["Duration"];
  priority: Scalars["Int"];
  revision: Scalars["String"];
  requester: TaskQueueItemType;
  version: Scalars["String"];
};

export type TaskQueueDistro = {
  id: Scalars["ID"];
  queueCount: Scalars["Int"];
};

export type Host = {
  id: Scalars["ID"];
  hostUrl: Scalars["String"];
  tag: Scalars["String"];
  distroId?: Maybe<Scalars["String"]>;
  status: Scalars["String"];
  runningTask?: Maybe<TaskInfo>;
  totalIdleTime?: Maybe<Scalars["Duration"]>;
  uptime?: Maybe<Scalars["Time"]>;
  elapsed?: Maybe<Scalars["Time"]>;
  startedBy: Scalars["String"];
  provider: Scalars["String"];
  lastCommunicationTime?: Maybe<Scalars["Time"]>;
  noExpiration: Scalars["Boolean"];
  instanceType?: Maybe<Scalars["String"]>;
  homeVolumeID?: Maybe<Scalars["String"]>;
  volumes: Array<Volume>;
  user?: Maybe<Scalars["String"]>;
  distro?: Maybe<DistroInfo>;
  availabilityZone?: Maybe<Scalars["String"]>;
  instanceTags: Array<InstanceTag>;
  expiration?: Maybe<Scalars["Time"]>;
  displayName?: Maybe<Scalars["String"]>;
};

export type InstanceTag = {
  key?: Maybe<Scalars["String"]>;
  value?: Maybe<Scalars["String"]>;
  canBeModified?: Maybe<Scalars["Boolean"]>;
};

export type InstanceTagInput = {
  key: Scalars["String"];
  value: Scalars["String"];
};

export type DistroInfo = {
  id?: Maybe<Scalars["String"]>;
  workDir?: Maybe<Scalars["String"]>;
  isVirtualWorkStation?: Maybe<Scalars["Boolean"]>;
  user?: Maybe<Scalars["String"]>;
};

export type Distro = {
  name?: Maybe<Scalars["String"]>;
  userSpawnAllowed?: Maybe<Scalars["Boolean"]>;
  workDir?: Maybe<Scalars["String"]>;
  user?: Maybe<Scalars["String"]>;
  isVirtualWorkStation: Scalars["Boolean"];
};

export type TaskInfo = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
};

export type HostsResponse = {
  filteredHostsCount?: Maybe<Scalars["Int"]>;
  totalHostsCount: Scalars["Int"];
  hosts: Array<Host>;
};

export type PatchTasks = {
  tasks: Array<TaskResult>;
  count: Scalars["Int"];
};

export type PatchBuildVariant = {
  variant: Scalars["String"];
  displayName: Scalars["String"];
  tasks?: Maybe<Array<Maybe<PatchBuildVariantTask>>>;
};

export type PatchBuildVariantTask = {
  id: Scalars["ID"];
  name: Scalars["String"];
  status: Scalars["String"];
};

export type TaskFiles = {
  fileCount: Scalars["Int"];
  groupedFiles: Array<GroupedFiles>;
};

export type GroupedFiles = {
  taskName?: Maybe<Scalars["String"]>;
  files?: Maybe<Array<File>>;
};

export type ModuleCodeChange = {
  branchName: Scalars["String"];
  htmlLink: Scalars["String"];
  rawLink: Scalars["String"];
  fileDiffs: Array<FileDiff>;
};

export type FileDiff = {
  fileName: Scalars["String"];
  additions: Scalars["Int"];
  deletions: Scalars["Int"];
  diffLink: Scalars["String"];
};

export type UserPatches = {
  patches: Array<Patch>;
  filteredPatchCount: Scalars["Int"];
};

export type Patch = {
  createTime?: Maybe<Scalars["Time"]>;
  id: Scalars["ID"];
  description: Scalars["String"];
  projectID: Scalars["String"];
  githash: Scalars["String"];
  patchNumber: Scalars["Int"];
  author: Scalars["String"];
  version: Scalars["String"];
  status: Scalars["String"];
  variants: Array<Scalars["String"]>;
  tasks: Array<Scalars["String"]>;
  variantsTasks: Array<Maybe<VariantTask>>;
  activated: Scalars["Boolean"];
  alias: Scalars["String"];
  duration?: Maybe<PatchDuration>;
  time?: Maybe<PatchTime>;
  taskCount?: Maybe<Scalars["Int"]>;
  baseVersionID?: Maybe<Scalars["String"]>;
  moduleCodeChanges: Array<ModuleCodeChange>;
  project?: Maybe<PatchProject>;
  builds: Array<Build>;
  commitQueuePosition?: Maybe<Scalars["Int"]>;
  taskStatuses: Array<Scalars["String"]>;
  baseTaskStatuses: Array<Scalars["String"]>;
  canEnqueueToCommitQueue: Scalars["Boolean"];
};

export type Build = {
  id: Scalars["String"];
  buildVariant: Scalars["String"];
  status: Scalars["String"];
  predictedMakespan: Scalars["Duration"];
  actualMakespan: Scalars["Duration"];
};

export type Volume = {
  id: Scalars["String"];
  displayName: Scalars["String"];
  createdBy: Scalars["String"];
  type: Scalars["String"];
  availabilityZone: Scalars["String"];
  size: Scalars["Int"];
  expiration?: Maybe<Scalars["Time"]>;
  deviceName?: Maybe<Scalars["String"]>;
  hostID: Scalars["String"];
  noExpiration: Scalars["Boolean"];
  homeVolume: Scalars["Boolean"];
  host?: Maybe<Host>;
  creationTime: Scalars["Time"];
};

export type PatchProject = {
  variants: Array<ProjectBuildVariant>;
  tasks: Array<Scalars["String"]>;
};

export type ProjectBuildVariant = {
  name: Scalars["String"];
  displayName: Scalars["String"];
  tasks: Array<Scalars["String"]>;
};

export type TaskResult = {
  id: Scalars["ID"];
  displayName: Scalars["String"];
  version: Scalars["String"];
  status: Scalars["String"];
  baseStatus: Scalars["String"];
  buildVariant: Scalars["String"];
  blocked: Scalars["Boolean"];
};

export type PatchDuration = {
  makespan?: Maybe<Scalars["String"]>;
  timeTaken?: Maybe<Scalars["String"]>;
  time?: Maybe<PatchTime>;
};

export type PatchTime = {
  started?: Maybe<Scalars["String"]>;
  finished?: Maybe<Scalars["String"]>;
  submittedAt: Scalars["String"];
};

export type VariantTask = {
  name: Scalars["String"];
  tasks: Array<Scalars["String"]>;
};

export type TaskLogLinks = {
  allLogLink?: Maybe<Scalars["String"]>;
  agentLogLink?: Maybe<Scalars["String"]>;
  systemLogLink?: Maybe<Scalars["String"]>;
  taskLogLink?: Maybe<Scalars["String"]>;
  eventLogLink?: Maybe<Scalars["String"]>;
};

export type TaskEndDetail = {
  status: Scalars["String"];
  type: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  timedOut?: Maybe<Scalars["Boolean"]>;
  oomTracker: OomTrackerInfo;
};

export type OomTrackerInfo = {
  detected: Scalars["Boolean"];
  pids?: Maybe<Array<Maybe<Scalars["Int"]>>>;
};

export type TaskTestResult = {
  totalTestCount: Scalars["Int"];
  filteredTestCount: Scalars["Int"];
  testResults: Array<TestResult>;
};

export type TestResult = {
  id: Scalars["String"];
  status: Scalars["String"];
  testFile: Scalars["String"];
  logs: TestLog;
  exitCode?: Maybe<Scalars["Int"]>;
  startTime?: Maybe<Scalars["Time"]>;
  duration?: Maybe<Scalars["Float"]>;
  endTime?: Maybe<Scalars["Time"]>;
};

export type TestLog = {
  htmlDisplayURL?: Maybe<Scalars["String"]>;
  rawDisplayURL?: Maybe<Scalars["String"]>;
};

export type Dependency = {
  name: Scalars["String"];
  metStatus: MetStatus;
  requiredStatus: RequiredStatus;
  buildVariant: Scalars["String"];
  uiLink: Scalars["String"];
};

export type PatchMetadata = {
  author: Scalars["String"];
};

export type BaseTaskMetadata = {
  baseTaskDuration?: Maybe<Scalars["Duration"]>;
  baseTaskLink: Scalars["String"];
};

export type Task = {
  aborted?: Maybe<Scalars["Boolean"]>;
  activated: Scalars["Boolean"];
  activatedBy?: Maybe<Scalars["String"]>;
  activatedTime?: Maybe<Scalars["Time"]>;
  ami?: Maybe<Scalars["String"]>;
  blocked: Scalars["Boolean"];
  baseTaskMetadata?: Maybe<BaseTaskMetadata>;
  buildId: Scalars["String"];
  buildVariant: Scalars["String"];
  canAbort: Scalars["Boolean"];
  canRestart: Scalars["Boolean"];
  canSchedule: Scalars["Boolean"];
  canSetPriority: Scalars["Boolean"];
  canUnschedule: Scalars["Boolean"];
  createTime?: Maybe<Scalars["Time"]>;
  details?: Maybe<TaskEndDetail>;
  dispatchTime?: Maybe<Scalars["Time"]>;
  displayName: Scalars["String"];
  displayOnly?: Maybe<Scalars["Boolean"]>;
  distroId: Scalars["String"];
  estimatedStart?: Maybe<Scalars["Duration"]>;
  execution?: Maybe<Scalars["Int"]>;
  executionTasks?: Maybe<Array<Scalars["String"]>>;
  expectedDuration?: Maybe<Scalars["Duration"]>;
  failedTestCount: Scalars["Int"];
  finishTime?: Maybe<Scalars["Time"]>;
  generatedBy?: Maybe<Scalars["String"]>;
  generatedByName?: Maybe<Scalars["String"]>;
  generateTask?: Maybe<Scalars["Boolean"]>;
  hostId?: Maybe<Scalars["String"]>;
  hostLink?: Maybe<Scalars["String"]>;
  id: Scalars["String"];
  ingestTime?: Maybe<Scalars["Time"]>;
  latestExecution: Scalars["Int"];
  logs: TaskLogLinks;
  patchMetadata: PatchMetadata;
  patchNumber?: Maybe<Scalars["Int"]>;
  priority?: Maybe<Scalars["Int"]>;
  projectId: Scalars["String"];
  reliesOn: Array<Dependency>;
  requester: Scalars["String"];
  restarts?: Maybe<Scalars["Int"]>;
  revision?: Maybe<Scalars["String"]>;
  scheduledTime?: Maybe<Scalars["Time"]>;
  spawnHostLink?: Maybe<Scalars["String"]>;
  startTime?: Maybe<Scalars["Time"]>;
  status: Scalars["String"];
  taskGroup?: Maybe<Scalars["String"]>;
  taskGroupMaxHosts?: Maybe<Scalars["Int"]>;
  timeTaken?: Maybe<Scalars["Duration"]>;
  version: Scalars["String"];
  minQueuePosition: Scalars["Int"];
  isPerfPluginEnabled: Scalars["Boolean"];
};

export type Projects = {
  favorites: Array<Project>;
  otherProjects: Array<GroupedProjects>;
};

export type GroupedProjects = {
  name: Scalars["String"];
  projects: Array<Project>;
};

export type Project = {
  identifier: Scalars["String"];
  displayName: Scalars["String"];
  repo: Scalars["String"];
  owner: Scalars["String"];
};

export type File = {
  name: Scalars["String"];
  link: Scalars["String"];
  visibility: Scalars["String"];
};

export type User = {
  displayName: Scalars["String"];
  userId: Scalars["String"];
};

export type RecentTaskLogs = {
  eventLogs: Array<TaskEventLogEntry>;
  taskLogs: Array<LogMessage>;
  systemLogs: Array<LogMessage>;
  agentLogs: Array<LogMessage>;
};

export type TaskEventLogData = {
  hostId?: Maybe<Scalars["String"]>;
  jiraIssue?: Maybe<Scalars["String"]>;
  jiraLink?: Maybe<Scalars["String"]>;
  priority?: Maybe<Scalars["Int"]>;
  status?: Maybe<Scalars["String"]>;
  timestamp?: Maybe<Scalars["Time"]>;
  userId?: Maybe<Scalars["String"]>;
};

export type TaskEventLogEntry = {
  id: Scalars["String"];
  resourceType: Scalars["String"];
  processedAt: Scalars["Time"];
  timestamp?: Maybe<Scalars["Time"]>;
  eventType?: Maybe<Scalars["String"]>;
  data: TaskEventLogData;
  resourceId: Scalars["String"];
};

export type LogMessage = {
  type?: Maybe<Scalars["String"]>;
  severity?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
  timestamp?: Maybe<Scalars["Time"]>;
  version?: Maybe<Scalars["Int"]>;
};

export type CommitQueue = {
  projectId?: Maybe<Scalars["String"]>;
  queue?: Maybe<Array<CommitQueueItem>>;
};

export type CommitQueueItem = {
  issue?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
  enqueueTime?: Maybe<Scalars["Time"]>;
  patch?: Maybe<Patch>;
  modules?: Maybe<Array<Module>>;
};

export type Module = {
  module?: Maybe<Scalars["String"]>;
  issue?: Maybe<Scalars["String"]>;
};

export type UserSettings = {
  timezone?: Maybe<Scalars["String"]>;
  region?: Maybe<Scalars["String"]>;
  githubUser?: Maybe<GithubUser>;
  slackUsername?: Maybe<Scalars["String"]>;
  notifications?: Maybe<Notifications>;
  useSpruceOptions?: Maybe<UseSpruceOptions>;
};

export type UseSpruceOptions = {
  hasUsedSpruceBefore?: Maybe<Scalars["Boolean"]>;
  spruceV1?: Maybe<Scalars["Boolean"]>;
};

export type GithubUserInput = {
  lastKnownAs?: Maybe<Scalars["String"]>;
};

export type GithubUser = {
  uid?: Maybe<Scalars["Int"]>;
  lastKnownAs?: Maybe<Scalars["String"]>;
};

export type NotificationsInput = {
  buildBreak?: Maybe<Scalars["String"]>;
  patchFinish?: Maybe<Scalars["String"]>;
  patchFirstFailure?: Maybe<Scalars["String"]>;
  spawnHostExpiration?: Maybe<Scalars["String"]>;
  spawnHostOutcome?: Maybe<Scalars["String"]>;
  commitQueue?: Maybe<Scalars["String"]>;
};

export type Notifications = {
  buildBreak?: Maybe<Scalars["String"]>;
  patchFinish?: Maybe<Scalars["String"]>;
  patchFirstFailure?: Maybe<Scalars["String"]>;
  spawnHostExpiration?: Maybe<Scalars["String"]>;
  spawnHostOutcome?: Maybe<Scalars["String"]>;
  commitQueue?: Maybe<Scalars["String"]>;
};

export type UserConfig = {
  user: Scalars["String"];
  api_key: Scalars["String"];
  api_server_host: Scalars["String"];
  ui_server_host: Scalars["String"];
};

export type PublicKeyInput = {
  name: Scalars["String"];
  key: Scalars["String"];
};

export type PublicKey = {
  name: Scalars["String"];
  key: Scalars["String"];
};

export type ClientConfig = {
  clientBinaries?: Maybe<Array<ClientBinary>>;
  latestRevision?: Maybe<Scalars["String"]>;
};

export type ClientBinary = {
  arch?: Maybe<Scalars["String"]>;
  os?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
  displayName?: Maybe<Scalars["String"]>;
};

export type SpruceConfig = {
  ui?: Maybe<UiConfig>;
  jira?: Maybe<JiraConfig>;
  banner?: Maybe<Scalars["String"]>;
  bannerTheme?: Maybe<Scalars["String"]>;
};

export type JiraConfig = {
  host?: Maybe<Scalars["String"]>;
};

export type UiConfig = {
  userVoice?: Maybe<Scalars["String"]>;
};

export type HostEvents = {
  eventLogEntries: Array<HostEventLogEntry>;
  count: Scalars["Int"];
};

export type HostEventLogEntry = {
  id: Scalars["String"];
  resourceType: Scalars["String"];
  processedAt: Scalars["Time"];
  timestamp?: Maybe<Scalars["Time"]>;
  eventType?: Maybe<Scalars["String"]>;
  data: HostEventLogData;
  resourceId: Scalars["String"];
};

export type HostEventLogData = {
  agentRevision: Scalars["String"];
  agentBuild: Scalars["String"];
  jasperRevision: Scalars["String"];
  oldStatus: Scalars["String"];
  newStatus: Scalars["String"];
  logs: Scalars["String"];
  hostname: Scalars["String"];
  provisioningMethod: Scalars["String"];
  taskId: Scalars["String"];
  taskPid: Scalars["String"];
  taskStatus: Scalars["String"];
  execution: Scalars["String"];
  monitorOp: Scalars["String"];
  user: Scalars["String"];
  successful: Scalars["Boolean"];
  duration: Scalars["Duration"];
};

export type BuildBaron = {
  searchReturnInfo?: Maybe<SearchReturnInfo>;
  buildBaronConfigured: Scalars["Boolean"];
};

export type SearchReturnInfo = {
  issues: Array<JiraTicket>;
  search: Scalars["String"];
  source: Scalars["String"];
  featuresURL: Scalars["String"];
};

export type JiraTicket = {
  key: Scalars["String"];
  fields: TicketFields;
};

export type TicketFields = {
  summary: Scalars["String"];
  assigneeDisplayName?: Maybe<Scalars["String"]>;
  resolutionName?: Maybe<Scalars["String"]>;
  created: Scalars["String"];
  updated: Scalars["String"];
  status: JiraStatus;
};

export type JiraStatus = {
  id: Scalars["String"];
  name: Scalars["String"];
};

export type GetPatchEventDataQueryVariables = {
  id: Scalars["String"];
};

export type GetPatchEventDataQuery = { patch: { status: string } };

export type GetTaskEventDataQueryVariables = {
  taskId: Scalars["String"];
};

export type GetTaskEventDataQuery = {
  task?: Maybe<{ status: string; failedTestCount: number }>;
};

export type AbortTaskMutationVariables = {
  taskId: Scalars["String"];
};

export type AbortTaskMutation = { abortTask: { id: string } };

export type CreatePublicKeyMutationVariables = {
  publicKeyInput: PublicKeyInput;
};

export type CreatePublicKeyMutation = {
  createPublicKey: Array<{ key: string; name: string }>;
};

export type EnqueuePatchMutationVariables = {
  patchId: Scalars["String"];
};

export type EnqueuePatchMutation = { enqueuePatch: { id: string } };

export type BbCreateTicketMutationVariables = {
  taskId: Scalars["String"];
};

export type BbCreateTicketMutation = { bbCreateTicket: boolean };

export type RemovePatchFromCommitQueueMutationVariables = {
  commitQueueId: Scalars["String"];
  patchId: Scalars["String"];
};

export type RemovePatchFromCommitQueueMutation = {
  removePatchFromCommitQueue?: Maybe<string>;
};

export type RemovePublicKeyMutationVariables = {
  keyName: Scalars["String"];
};

export type RemovePublicKeyMutation = {
  removePublicKey: Array<{ key: string; name: string }>;
};

export type RestartJasperMutationVariables = {
  hostIds: Array<Scalars["String"]>;
};

export type RestartJasperMutation = { restartJasper: number };

export type RestartPatchMutationVariables = {
  patchId: Scalars["String"];
  abort: Scalars["Boolean"];
  taskIds: Array<Scalars["String"]>;
};

export type RestartPatchMutation = { restartPatch?: Maybe<string> };

export type RestartTaskMutationVariables = {
  taskId: Scalars["String"];
};

export type RestartTaskMutation = { restartTask: { id: string } };

export type SaveSubscriptionMutationVariables = {
  subscription: SubscriptionInput;
};

export type SaveSubscriptionMutation = { saveSubscription: boolean };

export type SchedulePatchTasksMutationVariables = {
  patchId: Scalars["String"];
};

export type SchedulePatchTasksMutation = { schedulePatchTasks?: Maybe<string> };

export type SchedulePatchMutationVariables = {
  patchId: Scalars["String"];
  reconfigure: PatchReconfigure;
};

export type SchedulePatchMutation = {
  schedulePatch: {
    id: string;
    activated: boolean;
    version: string;
    description: string;
    status: string;
    tasks: Array<string>;
    variants: Array<string>;
    variantsTasks: Array<Maybe<{ name: string; tasks: Array<string> }>>;
  };
};

export type ScheduleTaskMutationVariables = {
  taskId: Scalars["String"];
};

export type ScheduleTaskMutation = { scheduleTask: { id: string } };

export type SetPatchPriorityMutationVariables = {
  patchId: Scalars["String"];
  priority: Scalars["Int"];
};

export type SetPatchPriorityMutation = { setPatchPriority?: Maybe<string> };

export type SetTaskPriorityMutationVariables = {
  taskId: Scalars["String"];
  priority: Scalars["Int"];
};

export type SetTaskPriorityMutation = {
  setTaskPriority: { id: string; priority?: Maybe<number> };
};

export type SpawnHostMutationVariables = {
  SpawnHostInput?: Maybe<SpawnHostInput>;
};

export type SpawnHostMutation = { spawnHost: { id: string; status: string } };

export type UnschedulePatchTasksMutationVariables = {
  patchId: Scalars["String"];
  abort: Scalars["Boolean"];
};

export type UnschedulePatchTasksMutation = {
  unschedulePatchTasks?: Maybe<string>;
};

export type UnscheduleTaskMutationVariables = {
  taskId: Scalars["String"];
};

export type UnscheduleTaskMutation = { unscheduleTask: { id: string } };

export type UpdateHostStatusMutationVariables = {
  hostIds: Array<Scalars["String"]>;
  status: Scalars["String"];
  notes?: Maybe<Scalars["String"]>;
};

export type UpdateHostStatusMutation = { updateHostStatus: number };

export type UpdatePublicKeyMutationVariables = {
  targetKeyName: Scalars["String"];
  updateInfo: PublicKeyInput;
};

export type UpdatePublicKeyMutation = {
  updatePublicKey: Array<{ key: string; name: string }>;
};

export type UpdateSpawnHostStatusMutationVariables = {
  hostId: Scalars["String"];
  action: SpawnHostStatusActions;
};

export type UpdateSpawnHostStatusMutation = {
  updateSpawnHostStatus: { id: string; status: string };
};

export type UpdateUserSettingsMutationVariables = {
  userSettings: UserSettingsInput;
};

export type UpdateUserSettingsMutation = { updateUserSettings: boolean };

export type AwsRegionsQueryVariables = {};

export type AwsRegionsQuery = { awsRegions?: Maybe<Array<string>> };

export type DistroTaskQueueQueryVariables = {
  distroId: Scalars["String"];
};

export type DistroTaskQueueQuery = {
  distroTaskQueue: Array<{
    id: string;
    expectedDuration: number;
    requester: TaskQueueItemType;
    displayName: string;
    project: string;
    buildVariant: string;
    priority: number;
    version: string;
  }>;
};

export type BuildBaronQueryVariables = {
  taskId: Scalars["String"];
  execution: Scalars["Int"];
};

export type BuildBaronQuery = {
  buildBaron: {
    buildBaronConfigured: boolean;
    searchReturnInfo?: Maybe<{
      search: string;
      source: string;
      featuresURL: string;
      issues: Array<{
        key: string;
        fields: {
          summary: string;
          assigneeDisplayName?: Maybe<string>;
          resolutionName?: Maybe<string>;
          created: string;
          updated: string;
          status: { id: string; name: string };
        };
      }>;
    }>;
  };
};

export type ClientConfigQueryVariables = {};

export type ClientConfigQuery = {
  clientConfig?: Maybe<{
    latestRevision?: Maybe<string>;
    clientBinaries?: Maybe<
      Array<{
        os?: Maybe<string>;
        displayName?: Maybe<string>;
        url?: Maybe<string>;
        arch?: Maybe<string>;
      }>
    >;
  }>;
};

export type CodeChangesQueryVariables = {
  id: Scalars["String"];
};

export type CodeChangesQuery = {
  patch: {
    id: string;
    moduleCodeChanges: Array<{
      branchName: string;
      htmlLink: string;
      rawLink: string;
      fileDiffs: Array<{
        fileName: string;
        additions: number;
        deletions: number;
        diffLink: string;
      }>;
    }>;
  };
};

export type CommitQueueQueryVariables = {
  id: Scalars["String"];
};

export type CommitQueueQuery = {
  commitQueue: {
    projectId?: Maybe<string>;
    queue?: Maybe<
      Array<{
        issue?: Maybe<string>;
        enqueueTime?: Maybe<Date>;
        patch?: Maybe<{
          id: string;
          author: string;
          description: string;
          moduleCodeChanges: Array<{
            rawLink: string;
            branchName: string;
            htmlLink: string;
            fileDiffs: Array<{
              fileName: string;
              additions: number;
              deletions: number;
              diffLink: string;
            }>;
          }>;
        }>;
      }>
    >;
  };
};

export type GetCreatedTicketsQueryVariables = {
  taskId: Scalars["String"];
};

export type GetCreatedTicketsQuery = {
  bbGetCreatedTickets: Array<{
    key: string;
    fields: {
      summary: string;
      assigneeDisplayName?: Maybe<string>;
      resolutionName?: Maybe<string>;
      created: string;
      updated: string;
      status: { id: string; name: string };
    };
  }>;
};

export type DistrosQueryVariables = {
  onlySpawnable: Scalars["Boolean"];
};

export type DistrosQuery = {
  distros: Array<
    Maybe<{ name?: Maybe<string>; isVirtualWorkStation: boolean }>
  >;
};

export type HostEventsQueryVariables = {
  id: Scalars["String"];
  tag: Scalars["String"];
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

export type HostEventsQuery = {
  hostEvents: {
    count: number;
    eventLogEntries: Array<{
      id: string;
      resourceType: string;
      processedAt: Date;
      timestamp?: Maybe<Date>;
      eventType?: Maybe<string>;
      resourceId: string;
      data: {
        agentRevision: string;
        agentBuild: string;
        oldStatus: string;
        newStatus: string;
        logs: string;
        hostname: string;
        provisioningMethod: string;
        taskId: string;
        taskPid: string;
        taskStatus: string;
        execution: string;
        monitorOp: string;
        user: string;
        successful: boolean;
        duration: number;
      };
    }>;
  };
};

export type HostQueryVariables = {
  id: Scalars["String"];
};

export type HostQuery = {
  host?: Maybe<{
    id: string;
    hostUrl: string;
    distroId?: Maybe<string>;
    tag: string;
    provider: string;
    startedBy: string;
    user?: Maybe<string>;
    status: string;
    lastCommunicationTime?: Maybe<Date>;
    runningTask?: Maybe<{ id?: Maybe<string>; name?: Maybe<string> }>;
  }>;
};

export type InstanceTypesQueryVariables = {};

export type InstanceTypesQuery = { instanceTypes: Array<string> };

export type MyHostsQueryVariables = {};

export type MyHostsQuery = {
  myHosts: Array<{
    expiration?: Maybe<Date>;
    hostUrl: string;
    homeVolumeID?: Maybe<string>;
    id: string;
    instanceType?: Maybe<string>;
    noExpiration: boolean;
    provider: string;
    status: string;
    startedBy: string;
    tag: string;
    user?: Maybe<string>;
    uptime?: Maybe<Date>;
    displayName?: Maybe<string>;
    availabilityZone?: Maybe<string>;
    distro?: Maybe<{
      isVirtualWorkStation?: Maybe<boolean>;
      id?: Maybe<string>;
      user?: Maybe<string>;
      workDir?: Maybe<string>;
    }>;
    instanceTags: Array<{
      key?: Maybe<string>;
      value?: Maybe<string>;
      canBeModified?: Maybe<boolean>;
    }>;
  }>;
};

export type MyVolumesQueryVariables = {};

export type MyVolumesQuery = {
  myVolumes: Array<{
    id: string;
    displayName: string;
    createdBy: string;
    type: string;
    availabilityZone: string;
    size: number;
    expiration?: Maybe<Date>;
    deviceName?: Maybe<string>;
    hostID: string;
    noExpiration: boolean;
    homeVolume: boolean;
  }>;
};

export type PatchBuildVariantsQueryVariables = {
  patchId: Scalars["String"];
};

export type PatchBuildVariantsQuery = {
  patchBuildVariants: Array<{
    variant: string;
    displayName: string;
    tasks?: Maybe<Array<Maybe<{ id: string; name: string; status: string }>>>;
  }>;
};

export type GetPatchTaskStatusesQueryVariables = {
  id: Scalars["String"];
};

export type GetPatchTaskStatusesQuery = {
  patch: {
    id: string;
    taskStatuses: Array<string>;
    baseTaskStatuses: Array<string>;
  };
};

export type PatchTasksQueryVariables = {
  patchId: Scalars["String"];
  sortBy?: Maybe<TaskSortCategory>;
  sortDir?: Maybe<SortDirection>;
  page?: Maybe<Scalars["Int"]>;
  statuses?: Maybe<Array<Scalars["String"]>>;
  baseStatuses?: Maybe<Array<Scalars["String"]>>;
  variant?: Maybe<Scalars["String"]>;
  taskName?: Maybe<Scalars["String"]>;
  limit?: Maybe<Scalars["Int"]>;
};

export type PatchTasksQuery = {
  patchTasks: {
    count: number;
    tasks: Array<{
      id: string;
      status: string;
      baseStatus: string;
      displayName: string;
      buildVariant: string;
      blocked: boolean;
    }>;
  };
};

export type ProjectsQueryVariables = {};

export type ProjectsQuery = {
  projects: {
    favorites: Array<{
      identifier: string;
      repo: string;
      owner: string;
      displayName: string;
    }>;
    otherProjects: Array<{
      name: string;
      projects: Array<{
        identifier: string;
        repo: string;
        owner: string;
        displayName: string;
      }>;
    }>;
  };
};

export type GetMyPublicKeysQueryVariables = {};

export type GetMyPublicKeysQuery = {
  myPublicKeys: Array<{ name: string; key: string }>;
};

export type GetSpruceConfigQueryVariables = {};

export type GetSpruceConfigQuery = {
  spruceConfig?: Maybe<{
    bannerTheme?: Maybe<string>;
    banner?: Maybe<string>;
    ui?: Maybe<{ userVoice?: Maybe<string> }>;
    jira?: Maybe<{ host?: Maybe<string> }>;
  }>;
};

export type GetTaskAllExecutionsQueryVariables = {
  taskId: Scalars["String"];
};

export type GetTaskAllExecutionsQuery = {
  taskAllExecutions: Array<{
    execution?: Maybe<number>;
    status: string;
    ingestTime?: Maybe<Date>;
    activatedTime?: Maybe<Date>;
  }>;
};

export type TaskFilesQueryVariables = {
  id: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
};

export type TaskFilesQuery = {
  taskFiles: {
    groupedFiles: Array<{
      taskName?: Maybe<string>;
      files?: Maybe<Array<{ name: string; link: string }>>;
    }>;
  };
};

export type EventLogsQueryVariables = {
  id: Scalars["String"];
};

export type EventLogsQuery = {
  taskLogs: {
    eventLogs: Array<{
      timestamp?: Maybe<Date>;
      eventType?: Maybe<string>;
      data: {
        hostId?: Maybe<string>;
        jiraIssue?: Maybe<string>;
        jiraLink?: Maybe<string>;
        priority?: Maybe<number>;
        status?: Maybe<string>;
        timestamp?: Maybe<Date>;
        userId?: Maybe<string>;
      };
    }>;
  };
};

export type TaskLogsQueryVariables = {
  id: Scalars["String"];
};

export type TaskLogsQuery = {
  taskLogs: {
    taskLogs: Array<{
      severity?: Maybe<string>;
      message?: Maybe<string>;
      timestamp?: Maybe<Date>;
    }>;
  };
};

export type AgentLogsQueryVariables = {
  id: Scalars["String"];
};

export type AgentLogsQuery = {
  taskLogs: {
    agentLogs: Array<{
      severity?: Maybe<string>;
      message?: Maybe<string>;
      timestamp?: Maybe<Date>;
    }>;
  };
};

export type SystemLogsQueryVariables = {
  id: Scalars["String"];
};

export type SystemLogsQuery = {
  taskLogs: {
    systemLogs: Array<{
      severity?: Maybe<string>;
      message?: Maybe<string>;
      timestamp?: Maybe<Date>;
    }>;
  };
};

export type TaskTestsQueryVariables = {
  dir?: Maybe<SortDirection>;
  id: Scalars["String"];
  cat?: Maybe<TestSortCategory>;
  pageNum?: Maybe<Scalars["Int"]>;
  limitNum?: Maybe<Scalars["Int"]>;
  statusList: Array<Scalars["String"]>;
  testName: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
};

export type TaskTestsQuery = {
  taskTests: {
    filteredTestCount: number;
    totalTestCount: number;
    testResults: Array<{
      id: string;
      status: string;
      testFile: string;
      duration?: Maybe<number>;
      logs: { htmlDisplayURL?: Maybe<string>; rawDisplayURL?: Maybe<string> };
    }>;
  };
};

export type GetTaskQueryVariables = {
  taskId: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
};

export type GetTaskQuery = {
  taskFiles: { fileCount: number };
  task?: Maybe<{
    activatedBy?: Maybe<string>;
    ingestTime?: Maybe<Date>;
    estimatedStart?: Maybe<number>;
    displayName: string;
    finishTime?: Maybe<Date>;
    hostId?: Maybe<string>;
    hostLink?: Maybe<string>;
    patchNumber?: Maybe<number>;
    startTime?: Maybe<Date>;
    status: string;
    timeTaken?: Maybe<number>;
    version: string;
    revision?: Maybe<string>;
    failedTestCount: number;
    spawnHostLink?: Maybe<string>;
    priority?: Maybe<number>;
    canRestart: boolean;
    canAbort: boolean;
    canSchedule: boolean;
    canUnschedule: boolean;
    canSetPriority: boolean;
    ami?: Maybe<string>;
    distroId: string;
    latestExecution: number;
    blocked: boolean;
    generatedBy?: Maybe<string>;
    generatedByName?: Maybe<string>;
    isPerfPluginEnabled: boolean;
    baseTaskMetadata?: Maybe<{
      baseTaskDuration?: Maybe<number>;
      baseTaskLink: string;
    }>;
    patchMetadata: { author: string };
    reliesOn: Array<{
      buildVariant: string;
      metStatus: MetStatus;
      name: string;
      requiredStatus: RequiredStatus;
      uiLink: string;
    }>;
    logs: {
      allLogLink?: Maybe<string>;
      agentLogLink?: Maybe<string>;
      systemLogLink?: Maybe<string>;
      taskLogLink?: Maybe<string>;
      eventLogLink?: Maybe<string>;
    };
  }>;
};

export type GetTaskLatestExecutionQueryVariables = {
  taskId: Scalars["String"];
};

export type GetTaskLatestExecutionQuery = {
  task?: Maybe<{ latestExecution: number }>;
};

export type GetUserConfigQueryVariables = {};

export type GetUserConfigQuery = {
  userConfig?: Maybe<{
    api_key: string;
    api_server_host: string;
    ui_server_host: string;
    user: string;
  }>;
};

export type GetUserSettingsQueryVariables = {};

export type GetUserSettingsQuery = {
  userSettings?: Maybe<{
    timezone?: Maybe<string>;
    region?: Maybe<string>;
    slackUsername?: Maybe<string>;
    notifications?: Maybe<{
      buildBreak?: Maybe<string>;
      commitQueue?: Maybe<string>;
      patchFinish?: Maybe<string>;
      patchFirstFailure?: Maybe<string>;
      spawnHostExpiration?: Maybe<string>;
      spawnHostOutcome?: Maybe<string>;
    }>;
    githubUser?: Maybe<{ lastKnownAs?: Maybe<string> }>;
    useSpruceOptions?: Maybe<{
      hasUsedSpruceBefore?: Maybe<boolean>;
      spruceV1?: Maybe<boolean>;
    }>;
  }>;
};

export type GetUserQueryVariables = {};

export type GetUserQuery = { user: { userId: string; displayName: string } };

export type GetOtherUserQueryVariables = {
  userId?: Maybe<Scalars["String"]>;
};

export type GetOtherUserQuery = {
  otherUser: { userId: string; displayName: string };
  currentUser: { userId: string };
};

export type HostsQueryVariables = {
  hostId?: Maybe<Scalars["String"]>;
  distroId?: Maybe<Scalars["String"]>;
  currentTaskId?: Maybe<Scalars["String"]>;
  statuses?: Maybe<Array<Scalars["String"]>>;
  startedBy?: Maybe<Scalars["String"]>;
  sortBy?: Maybe<HostSortBy>;
  sortDir?: Maybe<SortDirection>;
  page?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
};

export type HostsQuery = {
  hosts: {
    filteredHostsCount?: Maybe<number>;
    totalHostsCount: number;
    hosts: Array<{
      id: string;
      distroId?: Maybe<string>;
      status: string;
      startedBy: string;
      hostUrl: string;
      tag: string;
      totalIdleTime?: Maybe<number>;
      uptime?: Maybe<Date>;
      elapsed?: Maybe<Date>;
      provider: string;
      noExpiration: boolean;
      runningTask?: Maybe<{ id?: Maybe<string>; name?: Maybe<string> }>;
    }>;
  };
};

export type UserPatchesQueryVariables = {
  page?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  statuses?: Maybe<Array<Scalars["String"]>>;
  patchName?: Maybe<Scalars["String"]>;
  includeCommitQueue?: Maybe<Scalars["Boolean"]>;
  userId?: Maybe<Scalars["String"]>;
};

export type UserPatchesQuery = {
  userPatches: {
    filteredPatchCount: number;
    patches: Array<{
      id: string;
      projectID: string;
      description: string;
      status: string;
      createTime?: Maybe<Date>;
      commitQueuePosition?: Maybe<number>;
      canEnqueueToCommitQueue: boolean;
      builds: Array<{ id: string; buildVariant: string; status: string }>;
    }>;
  };
};

export type PatchQueryVariables = {
  id: Scalars["String"];
};

export type PatchQuery = {
  patch: {
    id: string;
    description: string;
    projectID: string;
    githash: string;
    patchNumber: number;
    author: string;
    version: string;
    status: string;
    activated: boolean;
    alias: string;
    taskCount?: Maybe<number>;
    commitQueuePosition?: Maybe<number>;
    baseVersionID?: Maybe<string>;
    canEnqueueToCommitQueue: boolean;
    duration?: Maybe<{ makespan?: Maybe<string>; timeTaken?: Maybe<string> }>;
    time?: Maybe<{
      started?: Maybe<string>;
      submittedAt: string;
      finished?: Maybe<string>;
    }>;
    variantsTasks: Array<Maybe<{ name: string; tasks: Array<string> }>>;
  };
};

export type ConfigurePatchQueryVariables = {
  id: Scalars["String"];
};

export type ConfigurePatchQuery = {
  patch: {
    id: string;
    description: string;
    author: string;
    alias: string;
    status: string;
    activated: boolean;
    commitQueuePosition?: Maybe<number>;
    time?: Maybe<{ submittedAt: string }>;
    project?: Maybe<{
      tasks: Array<string>;
      variants: Array<{
        name: string;
        displayName: string;
        tasks: Array<string>;
      }>;
    }>;
    variantsTasks: Array<Maybe<{ name: string; tasks: Array<string> }>>;
  };
};

export type TaskQueueDistrosQueryVariables = {};

export type TaskQueueDistrosQuery = {
  taskQueueDistros: Array<{ id: string; queueCount: number }>;
};

export type TaskQueuePositionQueryVariables = {
  taskId: Scalars["String"];
};

export type TaskQueuePositionQuery = {
  task?: Maybe<{ minQueuePosition: number }>;
};
