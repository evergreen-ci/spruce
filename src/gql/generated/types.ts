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

export type BaseTaskMetadata = {
  baseTaskDuration?: Maybe<Scalars["Duration"]>;
  baseTaskLink: Scalars["String"];
};

export type Build = {
  id: Scalars["String"];
  buildVariant: Scalars["String"];
  status: Scalars["String"];
  predictedMakespan: Scalars["Duration"];
  actualMakespan: Scalars["Duration"];
};

export type ClientBinary = {
  arch?: Maybe<Scalars["String"]>;
  os?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
  displayName?: Maybe<Scalars["String"]>;
};

export type ClientConfig = {
  clientBinaries?: Maybe<Array<ClientBinary>>;
  latestRevision?: Maybe<Scalars["String"]>;
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

export type Dependency = {
  name: Scalars["String"];
  metStatus: MetStatus;
  requiredStatus: RequiredStatus;
  buildVariant: Scalars["String"];
  uiLink: Scalars["String"];
};

export type DisplayTask = {
  Name: Scalars["String"];
  ExecTasks: Array<Scalars["String"]>;
};

export type DistroInfo = {
  id?: Maybe<Scalars["String"]>;
  workDir?: Maybe<Scalars["String"]>;
  isVirtualWorkStation?: Maybe<Scalars["Boolean"]>;
  user?: Maybe<Scalars["String"]>;
};

export type File = {
  name: Scalars["String"];
  link: Scalars["String"];
  visibility: Scalars["String"];
};

export type FileDiff = {
  fileName: Scalars["String"];
  additions: Scalars["Int"];
  deletions: Scalars["Int"];
  diffLink: Scalars["String"];
};

export type GithubUser = {
  uid?: Maybe<Scalars["Int"]>;
  lastKnownAs?: Maybe<Scalars["String"]>;
};

export type GithubUserInput = {
  lastKnownAs?: Maybe<Scalars["String"]>;
};

export type GroupedFiles = {
  taskName?: Maybe<Scalars["String"]>;
  files?: Maybe<Array<File>>;
};

export type GroupedProjects = {
  name: Scalars["String"];
  projects: Array<Project>;
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
  user?: Maybe<Scalars["String"]>;
  distro?: Maybe<DistroInfo>;
  availabilityZone?: Maybe<Scalars["String"]>;
  instanceTags?: Maybe<Array<Maybe<InstanceTag>>>;
  expiration?: Maybe<Scalars["Time"]>;
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

export type HostEventLogEntry = {
  id: Scalars["String"];
  resourceType: Scalars["String"];
  processedAt: Scalars["Time"];
  timestamp?: Maybe<Scalars["Time"]>;
  eventType?: Maybe<Scalars["String"]>;
  data: HostEventLogData;
  resourceId: Scalars["String"];
};

export type HostEvents = {
  eventLogEntries: Array<HostEventLogEntry>;
};

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

export type HostsResponse = {
  filteredHostsCount?: Maybe<Scalars["Int"]>;
  totalHostsCount: Scalars["Int"];
  hosts: Array<Host>;
};

export type InstanceTag = {
  key?: Maybe<Scalars["String"]>;
  value?: Maybe<Scalars["String"]>;
  canBeModified?: Maybe<Scalars["Boolean"]>;
};

export type LogMessage = {
  type?: Maybe<Scalars["String"]>;
  severity?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
  timestamp?: Maybe<Scalars["Time"]>;
  version?: Maybe<Scalars["Int"]>;
};

export enum MetStatus {
  Unmet = "UNMET",
  Met = "MET",
  Pending = "PENDING",
}

export type Module = {
  module?: Maybe<Scalars["String"]>;
  issue?: Maybe<Scalars["String"]>;
};

export type ModuleCodeChange = {
  branchName: Scalars["String"];
  htmlLink: Scalars["String"];
  rawLink: Scalars["String"];
  fileDiffs: Array<FileDiff>;
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
  removePublicKey: Array<PublicKey>;
  updatePublicKey: Array<PublicKey>;
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

export type MutationRemovePublicKeyArgs = {
  keyName: Scalars["String"];
};

export type MutationUpdatePublicKeyArgs = {
  targetKeyName: Scalars["String"];
  updateInfo: PublicKeyInput;
};

export type Notifications = {
  buildBreak?: Maybe<Scalars["String"]>;
  patchFinish?: Maybe<Scalars["String"]>;
  patchFirstFailure?: Maybe<Scalars["String"]>;
  spawnHostExpiration?: Maybe<Scalars["String"]>;
  spawnHostOutcome?: Maybe<Scalars["String"]>;
  commitQueue?: Maybe<Scalars["String"]>;
};

export type NotificationsInput = {
  buildBreak?: Maybe<Scalars["String"]>;
  patchFinish?: Maybe<Scalars["String"]>;
  patchFirstFailure?: Maybe<Scalars["String"]>;
  spawnHostExpiration?: Maybe<Scalars["String"]>;
  spawnHostOutcome?: Maybe<Scalars["String"]>;
  commitQueue?: Maybe<Scalars["String"]>;
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

export type PatchDuration = {
  makespan?: Maybe<Scalars["String"]>;
  timeTaken?: Maybe<Scalars["String"]>;
  time?: Maybe<PatchTime>;
};

export type PatchMetadata = {
  author: Scalars["String"];
};

export type PatchProject = {
  variants: Array<ProjectBuildVariant>;
  tasks: Array<Scalars["String"]>;
};

export type PatchReconfigure = {
  description: Scalars["String"];
  variantsTasks: Array<VariantTasks>;
};

export type PatchTasks = {
  tasks: Array<TaskResult>;
  count: Scalars["Int"];
};

export type PatchTime = {
  started?: Maybe<Scalars["String"]>;
  finished?: Maybe<Scalars["String"]>;
  submittedAt: Scalars["String"];
};

export type Project = {
  identifier: Scalars["String"];
  displayName: Scalars["String"];
  repo: Scalars["String"];
  owner: Scalars["String"];
};

export type ProjectBuildVariant = {
  name: Scalars["String"];
  displayName: Scalars["String"];
  tasks: Array<Scalars["String"]>;
};

export type Projects = {
  favorites: Array<Project>;
  otherProjects: Array<GroupedProjects>;
};

export type PublicKey = {
  name: Scalars["String"];
  key: Scalars["String"];
};

export type PublicKeyInput = {
  name: Scalars["String"];
  key: Scalars["String"];
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
  awsRegions?: Maybe<Array<Scalars["String"]>>;
  userConfig?: Maybe<UserConfig>;
  clientConfig?: Maybe<ClientConfig>;
  siteBanner: SiteBanner;
  host?: Maybe<Host>;
  hostEvents: HostEvents;
  hosts: HostsResponse;
  myHosts?: Maybe<Array<Host>>;
  myPublicKeys: Array<PublicKey>;
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

export type RecentTaskLogs = {
  eventLogs: Array<TaskEventLogEntry>;
  taskLogs: Array<LogMessage>;
  systemLogs: Array<LogMessage>;
  agentLogs: Array<LogMessage>;
};

export enum RequiredStatus {
  MustFail = "MUST_FAIL",
  MustFinish = "MUST_FINISH",
  MustSucceed = "MUST_SUCCEED",
}

export type SelectorInput = {
  type: Scalars["String"];
  data: Scalars["String"];
};

export type SiteBanner = {
  text: Scalars["String"];
  theme: Scalars["String"];
};

export enum SortDirection {
  Asc = "ASC",
  Desc = "DESC",
}

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
};

export type SubscriberInput = {
  type: Scalars["String"];
  target: Scalars["String"];
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

export type Task = {
  failedTestCount: Scalars["Int"];
  spawnHostLink?: Maybe<Scalars["String"]>;
  patchMetadata: PatchMetadata;
  id: Scalars["String"];
  createTime?: Maybe<Scalars["Time"]>;
  ingestTime?: Maybe<Scalars["Time"]>;
  dispatchTime?: Maybe<Scalars["Time"]>;
  scheduledTime?: Maybe<Scalars["Time"]>;
  startTime?: Maybe<Scalars["Time"]>;
  finishTime?: Maybe<Scalars["Time"]>;
  activatedTime?: Maybe<Scalars["Time"]>;
  version: Scalars["String"];
  projectId: Scalars["String"];
  revision?: Maybe<Scalars["String"]>;
  priority?: Maybe<Scalars["Int"]>;
  taskGroup?: Maybe<Scalars["String"]>;
  taskGroupMaxHosts?: Maybe<Scalars["Int"]>;
  logs: TaskLogLinks;
  activated: Scalars["Boolean"];
  activatedBy?: Maybe<Scalars["String"]>;
  buildId: Scalars["String"];
  distroId: Scalars["String"];
  buildVariant: Scalars["String"];
  reliesOn: Array<Dependency>;
  displayName: Scalars["String"];
  hostId?: Maybe<Scalars["String"]>;
  hostLink?: Maybe<Scalars["String"]>;
  restarts?: Maybe<Scalars["Int"]>;
  execution?: Maybe<Scalars["Int"]>;
  latestExecution: Scalars["Int"];
  patchNumber?: Maybe<Scalars["Int"]>;
  requester: Scalars["String"];
  status: Scalars["String"];
  details?: Maybe<TaskEndDetail>;
  timeTaken?: Maybe<Scalars["Duration"]>;
  expectedDuration?: Maybe<Scalars["Duration"]>;
  displayOnly?: Maybe<Scalars["Boolean"]>;
  executionTasks?: Maybe<Array<Scalars["String"]>>;
  generateTask?: Maybe<Scalars["Boolean"]>;
  generatedBy?: Maybe<Scalars["String"]>;
  aborted?: Maybe<Scalars["Boolean"]>;
  baseTaskMetadata?: Maybe<BaseTaskMetadata>;
  canRestart: Scalars["Boolean"];
  canAbort: Scalars["Boolean"];
  canSchedule: Scalars["Boolean"];
  canUnschedule: Scalars["Boolean"];
  canSetPriority: Scalars["Boolean"];
  estimatedStart?: Maybe<Scalars["Duration"]>;
  ami?: Maybe<Scalars["String"]>;
};

export type TaskEndDetail = {
  status: Scalars["String"];
  type: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  timedOut?: Maybe<Scalars["Boolean"]>;
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

export type TaskFiles = {
  fileCount: Scalars["Int"];
  groupedFiles: Array<GroupedFiles>;
};

export type TaskInfo = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
};

export type TaskLogLinks = {
  allLogLink?: Maybe<Scalars["String"]>;
  agentLogLink?: Maybe<Scalars["String"]>;
  systemLogLink?: Maybe<Scalars["String"]>;
  taskLogLink?: Maybe<Scalars["String"]>;
  eventLogLink?: Maybe<Scalars["String"]>;
};

export type TaskResult = {
  id: Scalars["ID"];
  displayName: Scalars["String"];
  version: Scalars["String"];
  status: Scalars["String"];
  baseStatus: Scalars["String"];
  buildVariant: Scalars["String"];
};

export enum TaskSortCategory {
  Name = "NAME",
  Status = "STATUS",
  BaseStatus = "BASE_STATUS",
  Variant = "VARIANT",
}

export type TaskTestResult = {
  totalTestCount: Scalars["Int"];
  filteredTestCount: Scalars["Int"];
  testResults: Array<TestResult>;
};

export type TestLog = {
  htmlDisplayURL?: Maybe<Scalars["String"]>;
  rawDisplayURL?: Maybe<Scalars["String"]>;
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

export enum TestSortCategory {
  Status = "STATUS",
  Duration = "DURATION",
  TestName = "TEST_NAME",
}

export type User = {
  displayName: Scalars["String"];
  userId: Scalars["String"];
};

export type UserConfig = {
  user: Scalars["String"];
  api_key: Scalars["String"];
  api_server_host: Scalars["String"];
  ui_server_host: Scalars["String"];
};

export type UserPatches = {
  patches: Array<Patch>;
  filteredPatchCount: Scalars["Int"];
};

export type UserSettings = {
  timezone?: Maybe<Scalars["String"]>;
  region?: Maybe<Scalars["String"]>;
  githubUser?: Maybe<GithubUser>;
  slackUsername?: Maybe<Scalars["String"]>;
  notifications?: Maybe<Notifications>;
  useSpruceOptions?: Maybe<UseSpruceOptions>;
};

export type UserSettingsInput = {
  timezone?: Maybe<Scalars["String"]>;
  region?: Maybe<Scalars["String"]>;
  githubUser?: Maybe<GithubUserInput>;
  slackUsername?: Maybe<Scalars["String"]>;
  notifications?: Maybe<NotificationsInput>;
  useSpruceOptions?: Maybe<UseSpruceOptionsInput>;
};

export type UseSpruceOptions = {
  hasUsedSpruceBefore?: Maybe<Scalars["Boolean"]>;
  spruceV1?: Maybe<Scalars["Boolean"]>;
};

export type UseSpruceOptionsInput = {
  hasUsedSpruceBefore?: Maybe<Scalars["Boolean"]>;
  spruceV1?: Maybe<Scalars["Boolean"]>;
};

export type VariantTask = {
  name: Scalars["String"];
  tasks: Array<Scalars["String"]>;
};

export type VariantTasks = {
  variant: Scalars["String"];
  tasks: Array<Scalars["String"]>;
  displayTasks: Array<DisplayTask>;
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

export type EnqueuePatchMutationVariables = {
  patchId: Scalars["String"];
};

export type EnqueuePatchMutation = { enqueuePatch: { id: string } };

export type RemovePatchFromCommitQueueMutationVariables = {
  commitQueueId: Scalars["String"];
  patchId: Scalars["String"];
};

export type RemovePatchFromCommitQueueMutation = {
  removePatchFromCommitQueue?: Maybe<string>;
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

export type UpdateUserSettingsMutationVariables = {
  userSettings: UserSettingsInput;
};

export type UpdateUserSettingsMutation = { updateUserSettings: boolean };

export type AwsRegionsQueryVariables = {};

export type AwsRegionsQuery = { awsRegions?: Maybe<Array<string>> };

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

export type HostEventsQueryVariables = {
  id: Scalars["String"];
  tag: Scalars["String"];
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

export type HostEventsQuery = {
  hostEvents: {
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

export type SiteBannerQueryVariables = {};

export type SiteBannerQuery = { siteBanner: { text: string; theme: string } };

export type GetTaskAllExecutionsQueryVariables = {
  taskId: Scalars["String"];
};

export type GetTaskAllExecutionsQuery = {
  taskAllExecutions: Array<{
    execution?: Maybe<number>;
    status: string;
    createTime?: Maybe<Date>;
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
    createTime?: Maybe<Date>;
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
