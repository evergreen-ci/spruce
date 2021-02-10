export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
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
  project: Project;
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
  subnetAvailabilityZones: Array<Scalars["String"]>;
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

export type QueryProjectArgs = {
  projectId: Scalars["String"];
};

export type QueryPatchTasksArgs = {
  patchId: Scalars["String"];
  sortBy?: Maybe<TaskSortCategory>;
  sortDir?: Maybe<SortDirection>;
  sorts?: Maybe<Array<SortOrder>>;
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
  execution?: Maybe<Scalars["Int"]>;
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
  editAnnotationNote: Scalars["Boolean"];
  moveAnnotationIssue: Scalars["Boolean"];
  addAnnotationIssue: Scalars["Boolean"];
  removeAnnotationIssue: Scalars["Boolean"];
  removeItemFromCommitQueue?: Maybe<Scalars["String"]>;
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
  clearMySubscriptions: Scalars["Int"];
};

export type MutationAddFavoriteProjectArgs = {
  identifier: Scalars["String"];
};

export type MutationRemoveFavoriteProjectArgs = {
  identifier: Scalars["String"];
};

export type MutationSchedulePatchArgs = {
  patchId: Scalars["String"];
  configure: PatchConfigure;
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
  commitMessage?: Maybe<Scalars["String"]>;
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

export type MutationEditAnnotationNoteArgs = {
  taskId: Scalars["String"];
  execution: Scalars["Int"];
  originalMessage: Scalars["String"];
  newMessage: Scalars["String"];
};

export type MutationMoveAnnotationIssueArgs = {
  annotationId: Scalars["String"];
  apiIssue: IssueLinkInput;
  isIssue: Scalars["Boolean"];
};

export type MutationAddAnnotationIssueArgs = {
  taskId: Scalars["String"];
  execution: Scalars["Int"];
  apiIssue: IssueLinkInput;
  isIssue: Scalars["Boolean"];
};

export type MutationRemoveAnnotationIssueArgs = {
  taskId: Scalars["String"];
  execution: Scalars["Int"];
  apiIssue: IssueLinkInput;
  isIssue: Scalars["Boolean"];
};

export type MutationRemoveItemFromCommitQueueArgs = {
  commitQueueId: Scalars["String"];
  issue: Scalars["String"];
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
  execution?: Maybe<Scalars["Int"]>;
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
  BaseStatus = "BASE_STATUS",
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

export type PatchConfigure = {
  description: Scalars["String"];
  variantsTasks: Array<VariantTasks>;
  parameters?: Maybe<Array<Maybe<ParameterInput>>>;
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

export type PatchesInput = {
  limit?: Scalars["Int"];
  page?: Scalars["Int"];
  patchName?: Scalars["String"];
  statuses?: Array<Scalars["String"]>;
  includeCommitQueue?: Scalars["Boolean"];
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
  taskId?: Maybe<Scalars["String"]>;
  useProjectSetupScript?: Maybe<Scalars["Boolean"]>;
  useTaskConfig?: Maybe<Scalars["Boolean"]>;
  spawnHostsStartedByTask?: Maybe<Scalars["Boolean"]>;
  taskSync?: Maybe<Scalars["Boolean"]>;
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
  servicePassword?: Maybe<Scalars["String"]>;
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

export type IssueLinkInput = {
  url: Scalars["String"];
  issueKey: Scalars["String"];
};

export type SortOrder = {
  Key: TaskSortCategory;
  Direction: SortDirection;
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
  homeVolume?: Maybe<Volume>;
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
  key: Scalars["String"];
  value: Scalars["String"];
  canBeModified: Scalars["Boolean"];
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
  isWindows?: Maybe<Scalars["Boolean"]>;
  bootstrapMethod?: Maybe<Scalars["String"]>;
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
  baseStatus?: Maybe<Scalars["String"]>;
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
  description: Scalars["String"];
};

export type UserPatches = {
  patches: Array<Patch>;
  filteredPatchCount: Scalars["Int"];
};

export type Patches = {
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
  parameters: Array<Parameter>;
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
  creationTime?: Maybe<Scalars["Time"]>;
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

export type Parameter = {
  key: Scalars["String"];
  value: Scalars["String"];
};

export type ParameterInput = {
  key: Scalars["String"];
  value: Scalars["String"];
};

export type TaskResult = {
  id: Scalars["ID"];
  aborted: Scalars["Boolean"];
  displayName: Scalars["String"];
  version: Scalars["String"];
  status: Scalars["String"];
  baseStatus?: Maybe<Scalars["String"]>;
  baseTask?: Maybe<BaseTaskResult>;
  buildVariant: Scalars["String"];
  blocked: Scalars["Boolean"];
  executionTasksFull?: Maybe<Array<Task>>;
};

export type BaseTaskResult = {
  id: Scalars["ID"];
  status: Scalars["String"];
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
  baseStatus?: Maybe<Scalars["String"]>;
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
  patchID: Scalars["String"];
};

export type BaseTaskMetadata = {
  baseTaskDuration?: Maybe<Scalars["Duration"]>;
  baseTaskLink: Scalars["String"];
};

export type AbortInfo = {
  user?: Maybe<Scalars["String"]>;
  taskID?: Maybe<Scalars["String"]>;
  taskDisplayName?: Maybe<Scalars["String"]>;
  buildVariantDisplayName?: Maybe<Scalars["String"]>;
  newVersion?: Maybe<Scalars["String"]>;
  prClosed?: Maybe<Scalars["Boolean"]>;
};

export type Task = {
  aborted?: Maybe<Scalars["Boolean"]>;
  abortInfo?: Maybe<AbortInfo>;
  activated: Scalars["Boolean"];
  activatedBy?: Maybe<Scalars["String"]>;
  activatedTime?: Maybe<Scalars["Time"]>;
  ami?: Maybe<Scalars["String"]>;
  annotation?: Maybe<Annotation>;
  baseStatus?: Maybe<Scalars["String"]>;
  baseTaskMetadata?: Maybe<BaseTaskMetadata>;
  blocked: Scalars["Boolean"];
  buildId: Scalars["String"];
  buildVariant: Scalars["String"];
  canAbort: Scalars["Boolean"];
  canModifyAnnotation: Scalars["Boolean"];
  canRestart: Scalars["Boolean"];
  canSchedule: Scalars["Boolean"];
  canSetPriority: Scalars["Boolean"];
  canSync: Scalars["Boolean"];
  canUnschedule: Scalars["Boolean"];
  createTime?: Maybe<Scalars["Time"]>;
  details?: Maybe<TaskEndDetail>;
  dispatchTime?: Maybe<Scalars["Time"]>;
  displayName: Scalars["String"];
  displayOnly?: Maybe<Scalars["Boolean"]>;
  distroId: Scalars["String"];
  estimatedStart?: Maybe<Scalars["Duration"]>;
  execution: Scalars["Int"];
  executionTasks?: Maybe<Array<Scalars["String"]>>;
  executionTasksFull?: Maybe<Array<Task>>;
  expectedDuration?: Maybe<Scalars["Duration"]>;
  failedTestCount: Scalars["Int"];
  finishTime?: Maybe<Scalars["Time"]>;
  generatedBy?: Maybe<Scalars["String"]>;
  generatedByName?: Maybe<Scalars["String"]>;
  generateTask?: Maybe<Scalars["Boolean"]>;
  hostId?: Maybe<Scalars["String"]>;
  id: Scalars["String"];
  ingestTime?: Maybe<Scalars["Time"]>;
  isPerfPluginEnabled: Scalars["Boolean"];
  latestExecution: Scalars["Int"];
  logs: TaskLogLinks;
  minQueuePosition: Scalars["Int"];
  patchMetadata: PatchMetadata;
  patchNumber?: Maybe<Scalars["Int"]>;
  priority?: Maybe<Scalars["Int"]>;
  project?: Maybe<Project>;
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
  totalTestCount: Scalars["Int"];
  version: Scalars["String"];
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
  displayName: Scalars["String"];
  id: Scalars["String"];
  identifier: Scalars["String"];
  owner: Scalars["String"];
  patches: Patches;
  repo: Scalars["String"];
  spawnHostScriptPath: Scalars["String"];
};

export type ProjectPatchesArgs = {
  patchesInput: PatchesInput;
};

export type File = {
  name: Scalars["String"];
  link: Scalars["String"];
  visibility: Scalars["String"];
};

export type User = {
  displayName: Scalars["String"];
  userId: Scalars["String"];
  emailAddress: Scalars["String"];
  patches: Patches;
};

export type UserPatchesArgs = {
  patchesInput: PatchesInput;
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
  message?: Maybe<Scalars["String"]>;
  owner?: Maybe<Scalars["String"]>;
  repo?: Maybe<Scalars["String"]>;
  queue?: Maybe<Array<CommitQueueItem>>;
};

export type CommitQueueItem = {
  issue?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
  enqueueTime?: Maybe<Scalars["Time"]>;
  patch?: Maybe<Patch>;
  source?: Maybe<Scalars["String"]>;
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
  providers?: Maybe<CloudProviderConfig>;
  spawnHost: SpawnHostConfig;
};

export type JiraConfig = {
  host?: Maybe<Scalars["String"]>;
};

export type UiConfig = {
  userVoice?: Maybe<Scalars["String"]>;
};

export type CloudProviderConfig = {
  aws?: Maybe<AwsConfig>;
};

export type AwsConfig = {
  maxVolumeSizePerUser?: Maybe<Scalars["Int"]>;
};

export type SpawnHostConfig = {
  unexpirableHostsPerUser: Scalars["Int"];
  unexpirableVolumesPerUser: Scalars["Int"];
  spawnHostsPerUser: Scalars["Int"];
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
  assignedTeam?: Maybe<Scalars["String"]>;
};

export type JiraStatus = {
  id: Scalars["String"];
  name: Scalars["String"];
};

export type Annotation = {
  id: Scalars["String"];
  taskId: Scalars["String"];
  taskExecution: Scalars["Int"];
  note?: Maybe<Note>;
  issues?: Maybe<Array<Maybe<IssueLink>>>;
  suspectedIssues?: Maybe<Array<Maybe<IssueLink>>>;
  userCanModify?: Maybe<Scalars["Boolean"]>;
};

export type Note = {
  message: Scalars["String"];
  source: Source;
};

export type IssueLink = {
  issueKey?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
  source: Source;
  jiraTicket?: Maybe<JiraTicket>;
};

export type Source = {
  author: Scalars["String"];
  time: Scalars["Time"];
  requester: Scalars["String"];
};

export type GetPatchEventDataQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type GetPatchEventDataQuery = { patch: { id: string; status: string } };

export type GetTaskEventDataQueryVariables = Exact<{
  taskId: Scalars["String"];
}>;

export type GetTaskEventDataQuery = {
  task?: Maybe<{
    id: string;
    execution: number;
    status: string;
    failedTestCount: number;
  }>;
};

export type GetAnnotationEventDataQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type GetAnnotationEventDataQuery = {
  task?: Maybe<{
    annotation?: Maybe<{
      id: string;
      taskId: string;
      taskExecution: number;
      note?: Maybe<{
        message: string;
        source: { author: string; time: Date; requester: string };
      }>;
      issues?: Maybe<
        Array<
          Maybe<{
            issueKey?: Maybe<string>;
            url?: Maybe<string>;
            source: { author: string; time: Date; requester: string };
          }>
        >
      >;
      suspectedIssues?: Maybe<
        Array<
          Maybe<{
            issueKey?: Maybe<string>;
            url?: Maybe<string>;
            source: { author: string; time: Date; requester: string };
          }>
        >
      >;
    }>;
  }>;
};

export type CodeChangesTableFileDiffsFragment = {
  fileName: string;
  additions: number;
  deletions: number;
  diffLink: string;
  description: string;
};

export type PatchesPagePatchesFragment = {
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

export type AbortTaskMutationVariables = Exact<{
  taskId: Scalars["String"];
}>;

export type AbortTaskMutation = {
  abortTask: { id: string; execution: number };
};

export type AddAnnotationIssueMutationVariables = Exact<{
  taskId: Scalars["String"];
  execution: Scalars["Int"];
  apiIssue: IssueLinkInput;
  isIssue: Scalars["Boolean"];
}>;

export type AddAnnotationIssueMutation = { addAnnotationIssue: boolean };

export type AttachVolumeToHostMutationVariables = Exact<{
  volumeAndHost: VolumeHost;
}>;

export type AttachVolumeToHostMutation = { attachVolumeToHost: boolean };

export type ClearMySubscriptionsMutationVariables = Exact<{
  [key: string]: never;
}>;

export type ClearMySubscriptionsMutation = { clearMySubscriptions: number };

export type CreatePublicKeyMutationVariables = Exact<{
  publicKeyInput: PublicKeyInput;
}>;

export type CreatePublicKeyMutation = {
  createPublicKey: Array<{ key: string; name: string }>;
};

export type DetachVolumeFromHostMutationVariables = Exact<{
  volumeId: Scalars["String"];
}>;

export type DetachVolumeFromHostMutation = { detachVolumeFromHost: boolean };

export type EditAnnotationNoteMutationVariables = Exact<{
  taskId: Scalars["String"];
  execution: Scalars["Int"];
  originalMessage: Scalars["String"];
  newMessage: Scalars["String"];
}>;

export type EditAnnotationNoteMutation = { editAnnotationNote: boolean };

export type EditSpawnHostMutationVariables = Exact<{
  hostId: Scalars["String"];
  displayName?: Maybe<Scalars["String"]>;
  addedInstanceTags?: Maybe<Array<InstanceTagInput>>;
  deletedInstanceTags?: Maybe<Array<InstanceTagInput>>;
  volumeId?: Maybe<Scalars["String"]>;
  instanceType?: Maybe<Scalars["String"]>;
  expiration?: Maybe<Scalars["Time"]>;
  noExpiration?: Maybe<Scalars["Boolean"]>;
  servicePassword?: Maybe<Scalars["String"]>;
}>;

export type EditSpawnHostMutation = {
  editSpawnHost: {
    id: string;
    displayName?: Maybe<string>;
    status: string;
    instanceType?: Maybe<string>;
    noExpiration: boolean;
    expiration?: Maybe<Date>;
    instanceTags: Array<{ key: string; value: string; canBeModified: boolean }>;
    volumes: Array<{ displayName: string; id: string }>;
  };
};

export type EnqueuePatchMutationVariables = Exact<{
  patchId: Scalars["String"];
}>;

export type EnqueuePatchMutation = { enqueuePatch: { id: string } };

export type BbCreateTicketMutationVariables = Exact<{
  taskId: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type BbCreateTicketMutation = { bbCreateTicket: boolean };

export type MoveAnnotationIssueMutationVariables = Exact<{
  annotationId: Scalars["String"];
  apiIssue: IssueLinkInput;
  isIssue: Scalars["Boolean"];
}>;

export type MoveAnnotationIssueMutation = { moveAnnotationIssue: boolean };

export type RemoveAnnotationIssueMutationVariables = Exact<{
  taskId: Scalars["String"];
  execution: Scalars["Int"];
  apiIssue: IssueLinkInput;
  isIssue: Scalars["Boolean"];
}>;

export type RemoveAnnotationIssueMutation = { removeAnnotationIssue: boolean };

export type RemoveItemFromCommitQueueMutationVariables = Exact<{
  commitQueueId: Scalars["String"];
  issue: Scalars["String"];
}>;

export type RemoveItemFromCommitQueueMutation = {
  removeItemFromCommitQueue?: Maybe<string>;
};

export type RemovePublicKeyMutationVariables = Exact<{
  keyName: Scalars["String"];
}>;

export type RemovePublicKeyMutation = {
  removePublicKey: Array<{ key: string; name: string }>;
};

export type RemoveVolumeMutationVariables = Exact<{
  volumeId: Scalars["String"];
}>;

export type RemoveVolumeMutation = { removeVolume: boolean };

export type RestartJasperMutationVariables = Exact<{
  hostIds: Array<Scalars["String"]>;
}>;

export type RestartJasperMutation = { restartJasper: number };

export type RestartPatchMutationVariables = Exact<{
  patchId: Scalars["String"];
  abort: Scalars["Boolean"];
  taskIds: Array<Scalars["String"]>;
}>;

export type RestartPatchMutation = { restartPatch?: Maybe<string> };

export type RestartTaskMutationVariables = Exact<{
  taskId: Scalars["String"];
}>;

export type RestartTaskMutation = {
  restartTask: {
    id: string;
    execution: number;
    status: string;
    latestExecution: number;
  };
};

export type SaveSubscriptionMutationVariables = Exact<{
  subscription: SubscriptionInput;
}>;

export type SaveSubscriptionMutation = { saveSubscription: boolean };

export type SchedulePatchTasksMutationVariables = Exact<{
  patchId: Scalars["String"];
}>;

export type SchedulePatchTasksMutation = { schedulePatchTasks?: Maybe<string> };

export type SchedulePatchMutationVariables = Exact<{
  patchId: Scalars["String"];
  configure: PatchConfigure;
}>;

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
    parameters: Array<{ key: string; value: string }>;
  };
};

export type ScheduleTaskMutationVariables = Exact<{
  taskId: Scalars["String"];
}>;

export type ScheduleTaskMutation = {
  scheduleTask: { id: string; execution: number };
};

export type SetPatchPriorityMutationVariables = Exact<{
  patchId: Scalars["String"];
  priority: Scalars["Int"];
}>;

export type SetPatchPriorityMutation = { setPatchPriority?: Maybe<string> };

export type SetTaskPriorityMutationVariables = Exact<{
  taskId: Scalars["String"];
  priority: Scalars["Int"];
}>;

export type SetTaskPriorityMutation = {
  setTaskPriority: { id: string; execution: number; priority?: Maybe<number> };
};

export type SpawnHostMutationVariables = Exact<{
  SpawnHostInput?: Maybe<SpawnHostInput>;
}>;

export type SpawnHostMutation = { spawnHost: { id: string; status: string } };

export type SpawnVolumeMutationVariables = Exact<{
  SpawnVolumeInput: SpawnVolumeInput;
}>;

export type SpawnVolumeMutation = { spawnVolume: boolean };

export type UnschedulePatchTasksMutationVariables = Exact<{
  patchId: Scalars["String"];
  abort: Scalars["Boolean"];
}>;

export type UnschedulePatchTasksMutation = {
  unschedulePatchTasks?: Maybe<string>;
};

export type UnscheduleTaskMutationVariables = Exact<{
  taskId: Scalars["String"];
}>;

export type UnscheduleTaskMutation = {
  unscheduleTask: { id: string; execution: number };
};

export type UpdateHostStatusMutationVariables = Exact<{
  hostIds: Array<Scalars["String"]>;
  status: Scalars["String"];
  notes?: Maybe<Scalars["String"]>;
}>;

export type UpdateHostStatusMutation = { updateHostStatus: number };

export type UpdatePublicKeyMutationVariables = Exact<{
  targetKeyName: Scalars["String"];
  updateInfo: PublicKeyInput;
}>;

export type UpdatePublicKeyMutation = {
  updatePublicKey: Array<{ key: string; name: string }>;
};

export type UpdateSpawnHostStatusMutationVariables = Exact<{
  hostId: Scalars["String"];
  action: SpawnHostStatusActions;
}>;

export type UpdateSpawnHostStatusMutation = {
  updateSpawnHostStatus: { id: string; status: string };
};

export type UpdateVolumeMutationVariables = Exact<{
  UpdateVolumeInput: UpdateVolumeInput;
}>;

export type UpdateVolumeMutation = { updateVolume: boolean };

export type UpdateUserSettingsMutationVariables = Exact<{
  userSettings: UserSettingsInput;
}>;

export type UpdateUserSettingsMutation = { updateUserSettings: boolean };

export type AwsRegionsQueryVariables = Exact<{ [key: string]: never }>;

export type AwsRegionsQuery = { awsRegions?: Maybe<Array<string>> };

export type DistroTaskQueueQueryVariables = Exact<{
  distroId: Scalars["String"];
}>;

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

export type BuildBaronQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution: Scalars["Int"];
}>;

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

export type ClientConfigQueryVariables = Exact<{ [key: string]: never }>;

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

export type CodeChangesQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type CodeChangesQuery = {
  patch: {
    id: string;
    moduleCodeChanges: Array<{
      branchName: string;
      htmlLink: string;
      rawLink: string;
      fileDiffs: Array<CodeChangesTableFileDiffsFragment>;
    }>;
  };
};

export type CommitQueueQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type CommitQueueQuery = {
  commitQueue: {
    projectId?: Maybe<string>;
    message?: Maybe<string>;
    owner?: Maybe<string>;
    repo?: Maybe<string>;
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
            fileDiffs: Array<CodeChangesTableFileDiffsFragment>;
          }>;
        }>;
      }>
    >;
  };
};

export type GetCreatedTicketsQueryVariables = Exact<{
  taskId: Scalars["String"];
}>;

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

export type DistrosQueryVariables = Exact<{
  onlySpawnable: Scalars["Boolean"];
}>;

export type DistrosQuery = {
  distros: Array<
    Maybe<{ name?: Maybe<string>; isVirtualWorkStation: boolean }>
  >;
};

export type HostEventsQueryVariables = Exact<{
  id: Scalars["String"];
  tag: Scalars["String"];
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
}>;

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

export type HostQueryVariables = Exact<{
  id: Scalars["String"];
}>;

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
    distro?: Maybe<{ bootstrapMethod?: Maybe<string> }>;
    runningTask?: Maybe<{ id?: Maybe<string>; name?: Maybe<string> }>;
  }>;
};

export type InstanceTypesQueryVariables = Exact<{ [key: string]: never }>;

export type InstanceTypesQuery = { instanceTypes: Array<string> };

export type MyHostsQueryVariables = Exact<{ [key: string]: never }>;

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
      isWindows?: Maybe<boolean>;
    }>;
    instanceTags: Array<{ key: string; value: string; canBeModified: boolean }>;
    volumes: Array<{ displayName: string; id: string }>;
    homeVolume?: Maybe<{ id: string; displayName: string }>;
  }>;
};

export type MyVolumesQueryVariables = Exact<{ [key: string]: never }>;

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
    creationTime?: Maybe<Date>;
    host?: Maybe<{ displayName?: Maybe<string>; id: string }>;
  }>;
};

export type PatchBuildVariantsQueryVariables = Exact<{
  patchId: Scalars["String"];
}>;

export type PatchBuildVariantsQuery = {
  patchBuildVariants: Array<{
    variant: string;
    displayName: string;
    tasks?: Maybe<
      Array<
        Maybe<{
          id: string;
          name: string;
          status: string;
          baseStatus?: Maybe<string>;
        }>
      >
    >;
  }>;
};

export type GetPatchTaskStatusesQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type GetPatchTaskStatusesQuery = {
  patch: {
    id: string;
    taskStatuses: Array<string>;
    baseTaskStatuses: Array<string>;
  };
};

export type PatchTasksQueryVariables = Exact<{
  patchId: Scalars["String"];
  sorts?: Maybe<Array<SortOrder>>;
  page?: Maybe<Scalars["Int"]>;
  statuses?: Maybe<Array<Scalars["String"]>>;
  baseStatuses?: Maybe<Array<Scalars["String"]>>;
  variant?: Maybe<Scalars["String"]>;
  taskName?: Maybe<Scalars["String"]>;
  limit?: Maybe<Scalars["Int"]>;
}>;

export type PatchTasksQuery = {
  patchTasks: {
    count: number;
    tasks: Array<{
      id: string;
      aborted: boolean;
      status: string;
      displayName: string;
      buildVariant: string;
      blocked: boolean;
      executionTasksFull?: Maybe<
        Array<{
          id: string;
          execution: number;
          displayName: string;
          status: string;
          buildVariant: string;
          baseStatus?: Maybe<string>;
        }>
      >;
      baseTask?: Maybe<{ status: string }>;
    }>;
  };
};

export type ProjectsQueryVariables = Exact<{ [key: string]: never }>;

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

export type GetMyPublicKeysQueryVariables = Exact<{ [key: string]: never }>;

export type GetMyPublicKeysQuery = {
  myPublicKeys: Array<{ name: string; key: string }>;
};

export type GetSpruceConfigQueryVariables = Exact<{ [key: string]: never }>;

export type GetSpruceConfigQuery = {
  spruceConfig?: Maybe<{
    bannerTheme?: Maybe<string>;
    banner?: Maybe<string>;
    ui?: Maybe<{ userVoice?: Maybe<string> }>;
    jira?: Maybe<{ host?: Maybe<string> }>;
    providers?: Maybe<{
      aws?: Maybe<{ maxVolumeSizePerUser?: Maybe<number> }>;
    }>;
    spawnHost: {
      spawnHostsPerUser: number;
      unexpirableHostsPerUser: number;
      unexpirableVolumesPerUser: number;
    };
  }>;
};

export type GetTaskAllExecutionsQueryVariables = Exact<{
  taskId: Scalars["String"];
}>;

export type GetTaskAllExecutionsQuery = {
  taskAllExecutions: Array<{
    id: string;
    execution: number;
    status: string;
    ingestTime?: Maybe<Date>;
    activatedTime?: Maybe<Date>;
  }>;
};

export type TaskFilesQueryVariables = Exact<{
  id: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type TaskFilesQuery = {
  taskFiles: {
    fileCount: number;
    groupedFiles: Array<{
      taskName?: Maybe<string>;
      files?: Maybe<Array<{ name: string; link: string }>>;
    }>;
  };
};

export type EventLogsQueryVariables = Exact<{
  id: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

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

export type TaskLogsQueryVariables = Exact<{
  id: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type TaskLogsQuery = {
  taskLogs: {
    taskLogs: Array<{
      severity?: Maybe<string>;
      message?: Maybe<string>;
      timestamp?: Maybe<Date>;
    }>;
  };
};

export type AgentLogsQueryVariables = Exact<{
  id: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type AgentLogsQuery = {
  taskLogs: {
    agentLogs: Array<{
      severity?: Maybe<string>;
      message?: Maybe<string>;
      timestamp?: Maybe<Date>;
    }>;
  };
};

export type SystemLogsQueryVariables = Exact<{
  id: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type SystemLogsQuery = {
  taskLogs: {
    systemLogs: Array<{
      severity?: Maybe<string>;
      message?: Maybe<string>;
      timestamp?: Maybe<Date>;
    }>;
  };
};

export type TaskTestsQueryVariables = Exact<{
  dir?: Maybe<SortDirection>;
  id: Scalars["String"];
  cat?: Maybe<TestSortCategory>;
  pageNum?: Maybe<Scalars["Int"]>;
  limitNum?: Maybe<Scalars["Int"]>;
  statusList: Array<Scalars["String"]>;
  testName: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type TaskTestsQuery = {
  taskTests: {
    filteredTestCount: number;
    totalTestCount: number;
    testResults: Array<{
      id: string;
      status: string;
      baseStatus?: Maybe<string>;
      testFile: string;
      duration?: Maybe<number>;
      logs: { htmlDisplayURL?: Maybe<string>; rawDisplayURL?: Maybe<string> };
    }>;
  };
};

export type GetTaskQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type GetTaskQuery = {
  taskFiles: { fileCount: number };
  task?: Maybe<{
    id: string;
    execution: number;
    aborted?: Maybe<boolean>;
    activatedBy?: Maybe<string>;
    buildVariant: string;
    ingestTime?: Maybe<Date>;
    estimatedStart?: Maybe<number>;
    displayName: string;
    finishTime?: Maybe<Date>;
    hostId?: Maybe<string>;
    projectId: string;
    patchNumber?: Maybe<number>;
    startTime?: Maybe<Date>;
    status: string;
    timeTaken?: Maybe<number>;
    version: string;
    revision?: Maybe<string>;
    totalTestCount: number;
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
    minQueuePosition: number;
    canModifyAnnotation: boolean;
    abortInfo?: Maybe<{
      user?: Maybe<string>;
      taskDisplayName?: Maybe<string>;
      taskID?: Maybe<string>;
      buildVariantDisplayName?: Maybe<string>;
      newVersion?: Maybe<string>;
      prClosed?: Maybe<boolean>;
    }>;
    executionTasksFull?: Maybe<
      Array<{
        displayName: string;
        id: string;
        execution: number;
        status: string;
        baseStatus?: Maybe<string>;
        buildVariant: string;
      }>
    >;
    baseTaskMetadata?: Maybe<{
      baseTaskDuration?: Maybe<number>;
      baseTaskLink: string;
    }>;
    patchMetadata: { author: string; patchID: string };
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
    details?: Maybe<{
      oomTracker: { detected: boolean; pids?: Maybe<Array<Maybe<number>>> };
    }>;
    annotation?: Maybe<{
      id: string;
      taskId: string;
      taskExecution: number;
      note?: Maybe<{
        message: string;
        source: { author: string; time: Date; requester: string };
      }>;
      issues?: Maybe<
        Array<
          Maybe<{
            issueKey?: Maybe<string>;
            url?: Maybe<string>;
            source: { author: string; time: Date; requester: string };
            jiraTicket?: Maybe<{
              key: string;
              fields: {
                summary: string;
                assigneeDisplayName?: Maybe<string>;
                resolutionName?: Maybe<string>;
                created: string;
                updated: string;
                assignedTeam?: Maybe<string>;
                status: { id: string; name: string };
              };
            }>;
          }>
        >
      >;
      suspectedIssues?: Maybe<
        Array<
          Maybe<{
            issueKey?: Maybe<string>;
            url?: Maybe<string>;
            source: { author: string; time: Date; requester: string };
            jiraTicket?: Maybe<{
              key: string;
              fields: {
                summary: string;
                assigneeDisplayName?: Maybe<string>;
                resolutionName?: Maybe<string>;
                created: string;
                updated: string;
                assignedTeam?: Maybe<string>;
                status: { id: string; name: string };
              };
            }>;
          }>
        >
      >;
    }>;
  }>;
};

export type GetUserConfigQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserConfigQuery = {
  userConfig?: Maybe<{
    api_key: string;
    api_server_host: string;
    ui_server_host: string;
    user: string;
  }>;
};

export type GetUserSettingsQueryVariables = Exact<{ [key: string]: never }>;

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

export type GetUserQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserQuery = {
  user: { userId: string; displayName: string; emailAddress: string };
};

export type GetOtherUserQueryVariables = Exact<{
  userId?: Maybe<Scalars["String"]>;
}>;

export type GetOtherUserQuery = {
  otherUser: { userId: string; displayName: string };
  currentUser: { userId: string };
};

export type HostsQueryVariables = Exact<{
  hostId?: Maybe<Scalars["String"]>;
  distroId?: Maybe<Scalars["String"]>;
  currentTaskId?: Maybe<Scalars["String"]>;
  statuses?: Maybe<Array<Scalars["String"]>>;
  startedBy?: Maybe<Scalars["String"]>;
  sortBy?: Maybe<HostSortBy>;
  sortDir?: Maybe<SortDirection>;
  page?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
}>;

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
      distro?: Maybe<{ bootstrapMethod?: Maybe<string> }>;
      runningTask?: Maybe<{ id?: Maybe<string>; name?: Maybe<string> }>;
    }>;
  };
};

export type PatchQueryVariables = Exact<{
  id: Scalars["String"];
}>;

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
    parameters: Array<{ key: string; value: string }>;
    duration?: Maybe<{ makespan?: Maybe<string>; timeTaken?: Maybe<string> }>;
    time?: Maybe<{
      started?: Maybe<string>;
      submittedAt: string;
      finished?: Maybe<string>;
    }>;
    variantsTasks: Array<Maybe<{ name: string; tasks: Array<string> }>>;
  };
};

export type ConfigurePatchQueryVariables = Exact<{
  id: Scalars["String"];
}>;

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
    parameters: Array<{ key: string; value: string }>;
  };
};

export type ProjectPatchesQueryVariables = Exact<{
  projectId: Scalars["String"];
  patchesInput: PatchesInput;
}>;

export type ProjectPatchesQuery = {
  project: {
    id: string;
    displayName: string;
    patches: PatchesPagePatchesFragment;
  };
};

export type SpawnExpirationInfoQueryVariables = Exact<{ [key: string]: never }>;

export type SpawnExpirationInfoQuery = {
  myHosts: Array<{ noExpiration: boolean; id: string }>;
  myVolumes: Array<{ noExpiration: boolean; id: string }>;
};

export type GetSpawnTaskQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type GetSpawnTaskQuery = {
  task?: Maybe<{
    id: string;
    execution: number;
    displayName: string;
    buildVariant: string;
    revision?: Maybe<string>;
    canSync: boolean;
    project?: Maybe<{ spawnHostScriptPath: string }>;
  }>;
};

export type SubnetAvailabilityZonesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type SubnetAvailabilityZonesQuery = {
  subnetAvailabilityZones: Array<string>;
};

export type TaskQueueDistrosQueryVariables = Exact<{ [key: string]: never }>;

export type TaskQueueDistrosQuery = {
  taskQueueDistros: Array<{ id: string; queueCount: number }>;
};

export type UserPatchesQueryVariables = Exact<{
  userId: Scalars["String"];
  patchesInput: PatchesInput;
}>;

export type UserPatchesQuery = {
  user: { userId: string; patches: PatchesPagePatchesFragment };
};
