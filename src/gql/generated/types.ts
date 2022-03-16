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
  Map: any;
};

export type Query = {
  task?: Maybe<Task>;
  taskAllExecutions: Array<Task>;
  patch: Patch;
  version: Version;
  projects: Array<Maybe<GroupedProjects>>;
  viewableProjectRefs: Array<Maybe<GroupedProjects>>;
  githubProjectConflicts: GithubProjectConflicts;
  project: Project;
  patchTasks: PatchTasks;
  taskTests: TaskTestResult;
  taskTestSample?: Maybe<Array<TaskTestResultSample>>;
  taskFiles: TaskFiles;
  user: User;
  taskLogs: TaskLogs;
  /** @deprecated Use version.buildVariants instead */
  patchBuildVariants: Array<GroupedBuildVariant>;
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
  mainlineCommits?: Maybe<MainlineCommits>;
  taskNamesForBuildVariant?: Maybe<Array<Scalars["String"]>>;
  buildVariantsForTaskName?: Maybe<Array<Maybe<BuildVariantTuple>>>;
  projectSettings: ProjectSettings;
  repoSettings: RepoSettings;
  projectEvents: ProjectEvents;
  repoEvents: RepoEvents;
  hasVersion: Scalars["Boolean"];
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

export type QueryVersionArgs = {
  id: Scalars["String"];
};

export type QueryGithubProjectConflictsArgs = {
  projectId: Scalars["String"];
};

export type QueryProjectArgs = {
  projectId: Scalars["String"];
};

export type QueryPatchTasksArgs = {
  patchId: Scalars["String"];
  sorts?: Maybe<Array<SortOrder>>;
  page?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  statuses?: Maybe<Array<Scalars["String"]>>;
  baseStatuses?: Maybe<Array<Scalars["String"]>>;
  variant?: Maybe<Scalars["String"]>;
  taskName?: Maybe<Scalars["String"]>;
  includeEmptyActivation?: Maybe<Scalars["Boolean"]>;
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
  groupId?: Maybe<Scalars["String"]>;
};

export type QueryTaskTestSampleArgs = {
  tasks: Array<Scalars["String"]>;
  filters: Array<TestFilter>;
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

export type QueryMainlineCommitsArgs = {
  options: MainlineCommitsOptions;
  buildVariantOptions?: Maybe<BuildVariantOptions>;
};

export type QueryTaskNamesForBuildVariantArgs = {
  projectId: Scalars["String"];
  buildVariant: Scalars["String"];
};

export type QueryBuildVariantsForTaskNameArgs = {
  projectId: Scalars["String"];
  taskName: Scalars["String"];
};

export type QueryProjectSettingsArgs = {
  identifier: Scalars["String"];
};

export type QueryRepoSettingsArgs = {
  id: Scalars["String"];
};

export type QueryProjectEventsArgs = {
  identifier: Scalars["String"];
  limit?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Time"]>;
};

export type QueryRepoEventsArgs = {
  id: Scalars["String"];
  limit?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["Time"]>;
};

export type QueryHasVersionArgs = {
  id: Scalars["String"];
};

export type Mutation = {
  addFavoriteProject: Project;
  removeFavoriteProject: Project;
  createProject: Project;
  copyProject: Project;
  attachProjectToNewRepo: Project;
  saveProjectSettingsForSection: ProjectSettings;
  saveRepoSettingsForSection: RepoSettings;
  defaultSectionToRepo?: Maybe<Scalars["String"]>;
  attachProjectToRepo: Project;
  detachProjectFromRepo: Project;
  forceRepotrackerRun: Scalars["Boolean"];
  schedulePatch: Patch;
  schedulePatchTasks?: Maybe<Scalars["String"]>;
  unschedulePatchTasks?: Maybe<Scalars["String"]>;
  restartVersions?: Maybe<Array<Version>>;
  /** @deprecated restartPatch deprecated, Use restartVersions instead */
  restartPatch?: Maybe<Scalars["String"]>;
  scheduleUndispatchedBaseTasks?: Maybe<Array<Task>>;
  enqueuePatch: Patch;
  setPatchPriority?: Maybe<Scalars["String"]>;
  /** @deprecated scheduleTask deprecated, Use scheduleTasks instead */
  scheduleTask: Task;
  scheduleTasks: Array<Task>;
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
  reprovisionToNew: Scalars["Int"];
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
  overrideTaskDependencies: Task;
};

export type MutationAddFavoriteProjectArgs = {
  identifier: Scalars["String"];
};

export type MutationRemoveFavoriteProjectArgs = {
  identifier: Scalars["String"];
};

export type MutationCreateProjectArgs = {
  project: CreateProjectInput;
};

export type MutationCopyProjectArgs = {
  project: CopyProjectInput;
};

export type MutationAttachProjectToNewRepoArgs = {
  project: MoveProjectInput;
};

export type MutationSaveProjectSettingsForSectionArgs = {
  projectSettings?: Maybe<ProjectSettingsInput>;
  section: ProjectSettingsSection;
};

export type MutationSaveRepoSettingsForSectionArgs = {
  repoSettings?: Maybe<RepoSettingsInput>;
  section: ProjectSettingsSection;
};

export type MutationDefaultSectionToRepoArgs = {
  projectId: Scalars["String"];
  section: ProjectSettingsSection;
};

export type MutationAttachProjectToRepoArgs = {
  projectId: Scalars["String"];
};

export type MutationDetachProjectFromRepoArgs = {
  projectId: Scalars["String"];
};

export type MutationForceRepotrackerRunArgs = {
  projectId: Scalars["String"];
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

export type MutationRestartVersionsArgs = {
  versionId: Scalars["String"];
  abort: Scalars["Boolean"];
  versionsToRestart: Array<VersionToRestart>;
};

export type MutationRestartPatchArgs = {
  patchId: Scalars["String"];
  abort: Scalars["Boolean"];
  taskIds: Array<Scalars["String"]>;
};

export type MutationScheduleUndispatchedBaseTasksArgs = {
  patchId: Scalars["String"];
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

export type MutationScheduleTasksArgs = {
  taskIds: Array<Scalars["String"]>;
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
  taskId: Scalars["String"];
  execution: Scalars["Int"];
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

export type MutationReprovisionToNewArgs = {
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

export type MutationOverrideTaskDependenciesArgs = {
  taskId: Scalars["String"];
};

export type VersionToRestart = {
  versionId: Scalars["String"];
  taskIds: Array<Scalars["String"]>;
};

export type TestFilter = {
  testName: Scalars["String"];
  testStatus: Scalars["String"];
};

export type TaskTestResultSample = {
  taskId: Scalars["String"];
  execution: Scalars["Int"];
  totalTestCount: Scalars["Int"];
  matchingFailedTestNames: Array<Scalars["String"]>;
};

export type MainlineCommits = {
  nextPageOrderNumber?: Maybe<Scalars["Int"]>;
  prevPageOrderNumber?: Maybe<Scalars["Int"]>;
  versions: Array<MainlineCommitVersion>;
};

export type MainlineCommitVersion = {
  version?: Maybe<Version>;
  rolledUpVersions?: Maybe<Array<Version>>;
};

export type Version = {
  id: Scalars["String"];
  createTime: Scalars["Time"];
  startTime?: Maybe<Scalars["Time"]>;
  finishTime?: Maybe<Scalars["Time"]>;
  message: Scalars["String"];
  revision: Scalars["String"];
  author: Scalars["String"];
  status: Scalars["String"];
  order: Scalars["Int"];
  repo: Scalars["String"];
  project: Scalars["String"];
  projectIdentifier: Scalars["String"];
  branch: Scalars["String"];
  requester: Scalars["String"];
  activated?: Maybe<Scalars["Boolean"]>;
  taskStatusCounts?: Maybe<Array<StatusCount>>;
  buildVariants?: Maybe<Array<Maybe<GroupedBuildVariant>>>;
  buildVariantStats?: Maybe<Array<GroupedTaskStatusCount>>;
  isPatch: Scalars["Boolean"];
  patch?: Maybe<Patch>;
  childVersions?: Maybe<Array<Maybe<Version>>>;
  taskCount?: Maybe<Scalars["Int"]>;
  /** @deprecated baseVersionId is deprecated, use baseVersion.id instead */
  baseVersionID?: Maybe<Scalars["String"]>;
  baseVersion?: Maybe<Version>;
  versionTiming?: Maybe<VersionTiming>;
  parameters: Array<Parameter>;
  taskStatuses: Array<Scalars["String"]>;
  baseTaskStatuses: Array<Scalars["String"]>;
  manifest?: Maybe<Manifest>;
};

export type VersionTaskStatusCountsArgs = {
  options?: Maybe<BuildVariantOptions>;
};

export type VersionBuildVariantsArgs = {
  options?: Maybe<BuildVariantOptions>;
};

export type VersionBuildVariantStatsArgs = {
  options?: Maybe<BuildVariantOptions>;
};

export type Manifest = {
  id: Scalars["String"];
  revision: Scalars["String"];
  project: Scalars["String"];
  branch: Scalars["String"];
  isBase: Scalars["Boolean"];
  moduleOverrides?: Maybe<Scalars["StringMap"]>;
  modules?: Maybe<Scalars["Map"]>;
};

export type VersionTiming = {
  makespan?: Maybe<Scalars["Duration"]>;
  timeTaken?: Maybe<Scalars["Duration"]>;
};

export type StatusCount = {
  status: Scalars["String"];
  count: Scalars["Int"];
};

export type GroupedTaskStatusCount = {
  variant: Scalars["String"];
  displayName: Scalars["String"];
  statusCounts: Array<StatusCount>;
};

export type BuildVariantOptions = {
  variants?: Maybe<Array<Scalars["String"]>>;
  tasks?: Maybe<Array<Scalars["String"]>>;
  statuses?: Maybe<Array<Scalars["String"]>>;
};

export type MainlineCommitsOptions = {
  projectID: Scalars["String"];
  limit?: Maybe<Scalars["Int"]>;
  skipOrderNumber?: Maybe<Scalars["Int"]>;
  shouldCollapse?: Maybe<Scalars["Boolean"]>;
  requesters?: Maybe<Array<Scalars["String"]>>;
};

export type BuildVariantTuple = {
  buildVariant: Scalars["String"];
  displayName: Scalars["String"];
};

export enum ProjectSettingsAccess {
  Edit = "EDIT",
  View = "VIEW",
}

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
  StartTime = "START_TIME",
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
  Started = "STARTED",
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

export enum ProjectSettingsSection {
  General = "GENERAL",
  Access = "ACCESS",
  Variables = "VARIABLES",
  GithubAndCommitQueue = "GITHUB_AND_COMMIT_QUEUE",
  Notifications = "NOTIFICATIONS",
  PatchAliases = "PATCH_ALIASES",
  Workstation = "WORKSTATION",
  Triggers = "TRIGGERS",
  PeriodicBuilds = "PERIODIC_BUILDS",
  Plugins = "PLUGINS",
}

export type VolumeHost = {
  volumeId: Scalars["String"];
  hostId: Scalars["String"];
};

export type PatchConfigure = {
  description: Scalars["String"];
  variantsTasks: Array<VariantTasks>;
  parameters?: Maybe<Array<Maybe<ParameterInput>>>;
  patchTriggerAliases?: Maybe<Array<Scalars["String"]>>;
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
  id?: Maybe<Scalars["String"]>;
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
  includeCommitQueue?: Maybe<Scalars["Boolean"]>;
  onlyCommitQueue?: Maybe<Scalars["Boolean"]>;
};

export type CreateProjectInput = {
  identifier: Scalars["String"];
  owner: Scalars["String"];
  repo: Scalars["String"];
  repoRefId?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
};

export type CopyProjectInput = {
  projectIdToCopy: Scalars["String"];
  newProjectIdentifier: Scalars["String"];
  newProjectId?: Maybe<Scalars["String"]>;
};

export type MoveProjectInput = {
  projectId: Scalars["String"];
  newOwner: Scalars["String"];
  newRepo: Scalars["String"];
};

export type ProjectSettingsInput = {
  githubWebhooksEnabled?: Maybe<Scalars["Boolean"]>;
  projectRef?: Maybe<ProjectInput>;
  vars?: Maybe<ProjectVarsInput>;
  aliases?: Maybe<Array<ProjectAliasInput>>;
  subscriptions?: Maybe<Array<SubscriptionInput>>;
};

export type ProjectInput = {
  id: Scalars["String"];
  identifier?: Maybe<Scalars["String"]>;
  displayName?: Maybe<Scalars["String"]>;
  enabled?: Maybe<Scalars["Boolean"]>;
  private?: Maybe<Scalars["Boolean"]>;
  restricted?: Maybe<Scalars["Boolean"]>;
  owner?: Maybe<Scalars["String"]>;
  repo?: Maybe<Scalars["String"]>;
  branch?: Maybe<Scalars["String"]>;
  remotePath?: Maybe<Scalars["String"]>;
  patchingDisabled?: Maybe<Scalars["Boolean"]>;
  repotrackerDisabled?: Maybe<Scalars["Boolean"]>;
  dispatchingDisabled?: Maybe<Scalars["Boolean"]>;
  prTestingEnabled?: Maybe<Scalars["Boolean"]>;
  githubChecksEnabled?: Maybe<Scalars["Boolean"]>;
  batchTime?: Maybe<Scalars["Int"]>;
  deactivatePrevious?: Maybe<Scalars["Boolean"]>;
  defaultLogger?: Maybe<Scalars["String"]>;
  notifyOnBuildFailure?: Maybe<Scalars["Boolean"]>;
  triggers?: Maybe<Array<TriggerAliasInput>>;
  patchTriggerAliases?: Maybe<Array<PatchTriggerAliasInput>>;
  githubTriggerAliases?: Maybe<Array<Maybe<Scalars["String"]>>>;
  periodicBuilds?: Maybe<Array<PeriodicBuildInput>>;
  cedarTestResultsEnabled?: Maybe<Scalars["Boolean"]>;
  commitQueue?: Maybe<CommitQueueParamsInput>;
  admins?: Maybe<Array<Scalars["String"]>>;
  spawnHostScriptPath?: Maybe<Scalars["String"]>;
  tracksPushEvents?: Maybe<Scalars["Boolean"]>;
  taskSync?: Maybe<TaskSyncOptionsInput>;
  gitTagAuthorizedUsers?: Maybe<Array<Scalars["String"]>>;
  gitTagAuthorizedTeams?: Maybe<Array<Scalars["String"]>>;
  gitTagVersionsEnabled?: Maybe<Scalars["Boolean"]>;
  filesIgnoredFromCache?: Maybe<Array<Scalars["String"]>>;
  disabledStatsCache?: Maybe<Scalars["Boolean"]>;
  workstationConfig?: Maybe<WorkstationConfigInput>;
  perfEnabled?: Maybe<Scalars["Boolean"]>;
  buildBaronSettings?: Maybe<BuildBaronSettingsInput>;
  taskAnnotationSettings?: Maybe<TaskAnnotationSettingsInput>;
};

export type RepoSettingsInput = {
  githubWebhooksEnabled?: Maybe<Scalars["Boolean"]>;
  projectRef?: Maybe<RepoRefInput>;
  vars?: Maybe<ProjectVarsInput>;
  aliases?: Maybe<Array<ProjectAliasInput>>;
  subscriptions?: Maybe<Array<SubscriptionInput>>;
};

export type RepoRefInput = {
  id: Scalars["String"];
  displayName?: Maybe<Scalars["String"]>;
  enabled?: Maybe<Scalars["Boolean"]>;
  private?: Maybe<Scalars["Boolean"]>;
  restricted?: Maybe<Scalars["Boolean"]>;
  owner?: Maybe<Scalars["String"]>;
  repo?: Maybe<Scalars["String"]>;
  branch?: Maybe<Scalars["String"]>;
  remotePath?: Maybe<Scalars["String"]>;
  patchingDisabled?: Maybe<Scalars["Boolean"]>;
  repotrackerDisabled?: Maybe<Scalars["Boolean"]>;
  dispatchingDisabled?: Maybe<Scalars["Boolean"]>;
  prTestingEnabled?: Maybe<Scalars["Boolean"]>;
  githubChecksEnabled?: Maybe<Scalars["Boolean"]>;
  batchTime?: Maybe<Scalars["Int"]>;
  deactivatePrevious?: Maybe<Scalars["Boolean"]>;
  defaultLogger?: Maybe<Scalars["String"]>;
  notifyOnBuildFailure?: Maybe<Scalars["Boolean"]>;
  triggers?: Maybe<Array<TriggerAliasInput>>;
  patchTriggerAliases?: Maybe<Array<PatchTriggerAliasInput>>;
  githubTriggerAliases?: Maybe<Array<Scalars["String"]>>;
  periodicBuilds?: Maybe<Array<PeriodicBuildInput>>;
  cedarTestResultsEnabled?: Maybe<Scalars["Boolean"]>;
  commitQueue?: Maybe<CommitQueueParamsInput>;
  admins?: Maybe<Array<Scalars["String"]>>;
  spawnHostScriptPath?: Maybe<Scalars["String"]>;
  tracksPushEvents?: Maybe<Scalars["Boolean"]>;
  taskSync?: Maybe<TaskSyncOptionsInput>;
  gitTagAuthorizedUsers?: Maybe<Array<Scalars["String"]>>;
  gitTagAuthorizedTeams?: Maybe<Array<Scalars["String"]>>;
  gitTagVersionsEnabled?: Maybe<Scalars["Boolean"]>;
  filesIgnoredFromCache?: Maybe<Array<Scalars["String"]>>;
  disabledStatsCache?: Maybe<Scalars["Boolean"]>;
  workstationConfig?: Maybe<WorkstationConfigInput>;
  perfEnabled?: Maybe<Scalars["Boolean"]>;
  buildBaronSettings?: Maybe<BuildBaronSettingsInput>;
  taskAnnotationSettings?: Maybe<TaskAnnotationSettingsInput>;
};

export type TriggerAliasInput = {
  project?: Maybe<Scalars["String"]>;
  level: Scalars["String"];
  definitionID: Scalars["String"];
  buildVariantRegex: Scalars["String"];
  taskRegex: Scalars["String"];
  status: Scalars["String"];
  dateCutoff: Scalars["Int"];
  configFile: Scalars["String"];
  generateFile: Scalars["String"];
  command: Scalars["String"];
  alias: Scalars["String"];
};

export type PeriodicBuildInput = {
  id: Scalars["String"];
  configFile: Scalars["String"];
  intervalHours: Scalars["Int"];
  alias: Scalars["String"];
  message: Scalars["String"];
  nextRunTime: Scalars["Time"];
};

export type CommitQueueParamsInput = {
  enabled?: Maybe<Scalars["Boolean"]>;
  requireSigned?: Maybe<Scalars["Boolean"]>;
  mergeMethod?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
};

export type TaskSyncOptionsInput = {
  configEnabled?: Maybe<Scalars["Boolean"]>;
  patchEnabled?: Maybe<Scalars["Boolean"]>;
};

export type BuildBaronSettingsInput = {
  ticketCreateProject: Scalars["String"];
  ticketSearchProjects?: Maybe<Array<Scalars["String"]>>;
  bfSuggestionServer?: Maybe<Scalars["String"]>;
  bfSuggestionUsername?: Maybe<Scalars["String"]>;
  bfSuggestionPassword?: Maybe<Scalars["String"]>;
  bfSuggestionTimeoutSecs?: Maybe<Scalars["Int"]>;
  bfSuggestionFeaturesURL?: Maybe<Scalars["String"]>;
};

export type TaskAnnotationSettingsInput = {
  jiraCustomFields?: Maybe<Array<JiraFieldInput>>;
  fileTicketWebhook?: Maybe<WebhookInput>;
};

export type JiraFieldInput = {
  field: Scalars["String"];
  displayText: Scalars["String"];
};

export type WebhookInput = {
  endpoint: Scalars["String"];
  secret: Scalars["String"];
};

export type WorkstationConfigInput = {
  setupCommands?: Maybe<Array<WorkstationSetupCommandInput>>;
  gitClone?: Maybe<Scalars["Boolean"]>;
};

export type WorkstationSetupCommandInput = {
  command: Scalars["String"];
  directory?: Maybe<Scalars["String"]>;
};

export type PatchTriggerAliasInput = {
  alias: Scalars["String"];
  childProjectIdentifier: Scalars["String"];
  taskSpecifiers: Array<TaskSpecifierInput>;
  status?: Maybe<Scalars["String"]>;
  parentAsModule?: Maybe<Scalars["String"]>;
};

export type TaskSpecifierInput = {
  patchAlias: Scalars["String"];
  taskRegex: Scalars["String"];
  variantRegex: Scalars["String"];
};

export type ProjectVarsInput = {
  vars?: Maybe<Scalars["StringMap"]>;
  privateVarsList?: Maybe<Array<Maybe<Scalars["String"]>>>;
  adminOnlyVarsList?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type VariantTaskInput = {
  name: Scalars["String"];
  tasks: Array<Scalars["String"]>;
};

export type ProjectAliasInput = {
  id: Scalars["String"];
  alias: Scalars["String"];
  gitTag: Scalars["String"];
  variant: Scalars["String"];
  task: Scalars["String"];
  remotePath: Scalars["String"];
  variantTags: Array<Scalars["String"]>;
  taskTags: Array<Scalars["String"]>;
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
  publicKey?: Maybe<PublicKeyInput>;
  savePublicKey?: Maybe<Scalars["Boolean"]>;
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
  /** @deprecated queueCount is deprecated, use taskCount instead */
  queueCount: Scalars["Int"];
  taskCount: Scalars["Int"];
  hostCount: Scalars["Int"];
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
  tasks: Array<Task>;
  count: Scalars["Int"];
};

export type GroupedBuildVariant = {
  variant: Scalars["String"];
  displayName: Scalars["String"];
  tasks?: Maybe<Array<Maybe<Task>>>;
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

export type ChildPatchAlias = {
  alias: Scalars["String"];
  patchId: Scalars["String"];
};

export type PatchTriggerAlias = {
  alias: Scalars["String"];
  childProjectId: Scalars["String"];
  childProjectIdentifier: Scalars["String"];
  taskSpecifiers?: Maybe<Array<TaskSpecifier>>;
  status?: Maybe<Scalars["String"]>;
  parentAsModule?: Maybe<Scalars["String"]>;
  variantsTasks: Array<VariantTask>;
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
  projectIdentifier: Scalars["String"];
  githash: Scalars["String"];
  patchNumber: Scalars["Int"];
  author: Scalars["String"];
  authorDisplayName: Scalars["String"];
  /** @deprecated version is deprecated, use versionFull.id instead */
  version: Scalars["String"];
  versionFull?: Maybe<Version>;
  status: Scalars["String"];
  variants: Array<Scalars["String"]>;
  tasks: Array<Scalars["String"]>;
  childPatches?: Maybe<Array<Patch>>;
  childPatchAliases?: Maybe<Array<ChildPatchAlias>>;
  variantsTasks: Array<Maybe<VariantTask>>;
  activated: Scalars["Boolean"];
  alias?: Maybe<Scalars["String"]>;
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
  patchTriggerAliases: Array<PatchTriggerAlias>;
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
  execution: Scalars["Int"];
  aborted: Scalars["Boolean"];
  displayName: Scalars["String"];
  version: Scalars["String"];
  status: Scalars["String"];
  baseStatus?: Maybe<Scalars["String"]>;
  baseTask?: Maybe<BaseTaskResult>;
  buildVariant: Scalars["String"];
  buildVariantDisplayName: Scalars["String"];
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
  timeoutType?: Maybe<Scalars["String"]>;
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
  groupID?: Maybe<Scalars["String"]>;
  status: Scalars["String"];
  baseStatus?: Maybe<Scalars["String"]>;
  testFile: Scalars["String"];
  /** @deprecated displayTestName deprecated, use testFile instead (EVG-15379) */
  displayTestName?: Maybe<Scalars["String"]>;
  logs: TestLog;
  exitCode?: Maybe<Scalars["Int"]>;
  startTime?: Maybe<Scalars["Time"]>;
  duration?: Maybe<Scalars["Float"]>;
  endTime?: Maybe<Scalars["Time"]>;
  taskId?: Maybe<Scalars["String"]>;
  execution?: Maybe<Scalars["Int"]>;
};

export type TestLog = {
  url?: Maybe<Scalars["String"]>;
  urlRaw?: Maybe<Scalars["String"]>;
  urlLobster?: Maybe<Scalars["String"]>;
  lineNum?: Maybe<Scalars["Int"]>;
};

export type Dependency = {
  name: Scalars["String"];
  metStatus: MetStatus;
  requiredStatus: RequiredStatus;
  buildVariant: Scalars["String"];
  taskId: Scalars["String"];
  /** @deprecated uiLink is deprecated and should not be used */
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
  user: Scalars["String"];
  taskID: Scalars["String"];
  taskDisplayName: Scalars["String"];
  buildVariantDisplayName: Scalars["String"];
  newVersion: Scalars["String"];
  prClosed: Scalars["Boolean"];
};

export type Task = {
  aborted: Scalars["Boolean"];
  abortInfo?: Maybe<AbortInfo>;
  activated: Scalars["Boolean"];
  activatedBy?: Maybe<Scalars["String"]>;
  activatedTime?: Maybe<Scalars["Time"]>;
  ami?: Maybe<Scalars["String"]>;
  annotation?: Maybe<Annotation>;
  baseTask?: Maybe<Task>;
  baseStatus?: Maybe<Scalars["String"]>;
  /** @deprecated baseTaskMetadata is deprecated. Use baseTask instead */
  baseTaskMetadata?: Maybe<BaseTaskMetadata>;
  blocked: Scalars["Boolean"];
  buildId: Scalars["String"];
  buildVariant: Scalars["String"];
  buildVariantDisplayName?: Maybe<Scalars["String"]>;
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
  displayTask?: Maybe<Task>;
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
  patch?: Maybe<Patch>;
  /** @deprecated patchMetadata is deprecated. Use versionMetadata instead. */
  patchMetadata: PatchMetadata;
  patchNumber?: Maybe<Scalars["Int"]>;
  priority?: Maybe<Scalars["Int"]>;
  project?: Maybe<Project>;
  projectId: Scalars["String"];
  projectIdentifier?: Maybe<Scalars["String"]>;
  /** @deprecated reliesOn is deprecated. Use dependsOn instead. */
  reliesOn: Array<Dependency>;
  dependsOn?: Maybe<Array<Dependency>>;
  canOverrideDependencies: Scalars["Boolean"];
  requester: Scalars["String"];
  restarts?: Maybe<Scalars["Int"]>;
  revision?: Maybe<Scalars["String"]>;
  scheduledTime?: Maybe<Scalars["Time"]>;
  containerAllocatedTime?: Maybe<Scalars["Time"]>;
  spawnHostLink?: Maybe<Scalars["String"]>;
  startTime?: Maybe<Scalars["Time"]>;
  status: Scalars["String"];
  taskGroup?: Maybe<Scalars["String"]>;
  taskGroupMaxHosts?: Maybe<Scalars["Int"]>;
  timeTaken?: Maybe<Scalars["Duration"]>;
  totalTestCount: Scalars["Int"];
  /** @deprecated version is deprecated. Use versionMetadata instead. */
  version: Scalars["String"];
  versionMetadata: Version;
};

export type BaseTaskInfo = {
  id?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
};

export type GroupedProjects = {
  groupDisplayName: Scalars["String"];
  /** @deprecated name is deprecated. Use groupDisplayName instead. */
  name: Scalars["String"];
  repo?: Maybe<RepoRef>;
  projects: Array<Project>;
};

export type Permissions = {
  userId: Scalars["String"];
  canCreateProject: Scalars["Boolean"];
};

export type GithubProjectConflicts = {
  commitQueueIdentifiers?: Maybe<Array<Scalars["String"]>>;
  prTestingIdentifiers?: Maybe<Array<Scalars["String"]>>;
  commitCheckIdentifiers?: Maybe<Array<Scalars["String"]>>;
};

export type ProjectSettings = {
  gitHubWebhooksEnabled: Scalars["Boolean"];
  projectRef?: Maybe<Project>;
  vars?: Maybe<ProjectVars>;
  aliases?: Maybe<Array<ProjectAlias>>;
  subscriptions?: Maybe<Array<ProjectSubscription>>;
};

export type RepoSettings = {
  gitHubWebhooksEnabled: Scalars["Boolean"];
  projectRef?: Maybe<RepoRef>;
  vars?: Maybe<ProjectVars>;
  aliases?: Maybe<Array<ProjectAlias>>;
  subscriptions?: Maybe<Array<ProjectSubscription>>;
};

export type ProjectEvents = {
  eventLogEntries: Array<ProjectEventLogEntry>;
  count: Scalars["Int"];
};

export type ProjectEventLogEntry = {
  timestamp: Scalars["Time"];
  user: Scalars["String"];
  before?: Maybe<ProjectSettings>;
  after?: Maybe<ProjectSettings>;
};

export type RepoEvents = {
  eventLogEntries: Array<RepoEventLogEntry>;
  count: Scalars["Int"];
};

export type RepoEventLogEntry = {
  timestamp: Scalars["Time"];
  user: Scalars["String"];
  before?: Maybe<RepoSettings>;
  after?: Maybe<RepoSettings>;
};

export type ProjectVars = {
  vars?: Maybe<Scalars["StringMap"]>;
  privateVars?: Maybe<Array<Maybe<Scalars["String"]>>>;
  adminOnlyVars?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type ProjectAlias = {
  id: Scalars["String"];
  alias: Scalars["String"];
  gitTag: Scalars["String"];
  variant: Scalars["String"];
  task: Scalars["String"];
  remotePath: Scalars["String"];
  variantTags: Array<Scalars["String"]>;
  taskTags: Array<Scalars["String"]>;
};

export type ProjectSubscription = {
  id: Scalars["String"];
  resourceType: Scalars["String"];
  trigger: Scalars["String"];
  selectors: Array<Selector>;
  regexSelectors: Array<Selector>;
  subscriber?: Maybe<ProjectSubscriber>;
  ownerType: Scalars["String"];
  triggerData?: Maybe<Scalars["StringMap"]>;
};

export type Selector = {
  type: Scalars["String"];
  data: Scalars["String"];
};

export type ProjectSubscriber = {
  type: Scalars["String"];
  subscriber: Subscriber;
};

export type Subscriber = {
  githubPRSubscriber?: Maybe<GithubPrSubscriber>;
  githubCheckSubscriber?: Maybe<GithubCheckSubscriber>;
  webhookSubscriber?: Maybe<WebhookSubscriber>;
  jiraIssueSubscriber?: Maybe<JiraIssueSubscriber>;
  jiraCommentSubscriber?: Maybe<Scalars["String"]>;
  emailSubscriber?: Maybe<Scalars["String"]>;
  slackSubscriber?: Maybe<Scalars["String"]>;
};

export type GithubPrSubscriber = {
  owner: Scalars["String"];
  repo: Scalars["String"];
  ref: Scalars["String"];
  prNumber?: Maybe<Scalars["Int"]>;
};

export type GithubCheckSubscriber = {
  owner: Scalars["String"];
  repo: Scalars["String"];
  ref: Scalars["String"];
};

export type JiraIssueSubscriber = {
  project: Scalars["String"];
  issueType: Scalars["String"];
};

export type WebhookSubscriber = {
  url: Scalars["String"];
  secret: Scalars["String"];
  headers: Array<Maybe<WebhookHeader>>;
};

export type WebhookHeader = {
  key: Scalars["String"];
  value: Scalars["String"];
};

export type Project = {
  id: Scalars["String"];
  identifier: Scalars["String"];
  displayName: Scalars["String"];
  enabled?: Maybe<Scalars["Boolean"]>;
  private?: Maybe<Scalars["Boolean"]>;
  restricted?: Maybe<Scalars["Boolean"]>;
  owner: Scalars["String"];
  repo: Scalars["String"];
  branch: Scalars["String"];
  remotePath: Scalars["String"];
  patchingDisabled?: Maybe<Scalars["Boolean"]>;
  repotrackerDisabled?: Maybe<Scalars["Boolean"]>;
  dispatchingDisabled?: Maybe<Scalars["Boolean"]>;
  prTestingEnabled?: Maybe<Scalars["Boolean"]>;
  githubChecksEnabled?: Maybe<Scalars["Boolean"]>;
  batchTime: Scalars["Int"];
  deactivatePrevious?: Maybe<Scalars["Boolean"]>;
  defaultLogger: Scalars["String"];
  notifyOnBuildFailure?: Maybe<Scalars["Boolean"]>;
  triggers?: Maybe<Array<TriggerAlias>>;
  patchTriggerAliases?: Maybe<Array<PatchTriggerAlias>>;
  githubTriggerAliases?: Maybe<Array<Scalars["String"]>>;
  periodicBuilds?: Maybe<Array<PeriodicBuild>>;
  cedarTestResultsEnabled?: Maybe<Scalars["Boolean"]>;
  commitQueue: CommitQueueParams;
  admins?: Maybe<Array<Maybe<Scalars["String"]>>>;
  spawnHostScriptPath: Scalars["String"];
  tracksPushEvents?: Maybe<Scalars["Boolean"]>;
  taskSync: TaskSyncOptions;
  gitTagAuthorizedUsers?: Maybe<Array<Scalars["String"]>>;
  gitTagAuthorizedTeams?: Maybe<Array<Scalars["String"]>>;
  gitTagVersionsEnabled?: Maybe<Scalars["Boolean"]>;
  filesIgnoredFromCache?: Maybe<Array<Scalars["String"]>>;
  disabledStatsCache?: Maybe<Scalars["Boolean"]>;
  workstationConfig: WorkstationConfig;
  perfEnabled?: Maybe<Scalars["Boolean"]>;
  buildBaronSettings: BuildBaronSettings;
  taskAnnotationSettings: TaskAnnotationSettings;
  hidden?: Maybe<Scalars["Boolean"]>;
  repoRefId: Scalars["String"];
  isFavorite: Scalars["Boolean"];
  validDefaultLoggers: Array<Scalars["String"]>;
  patches: Patches;
};

export type ProjectPatchesArgs = {
  patchesInput: PatchesInput;
};

export type RepoRef = {
  id: Scalars["String"];
  displayName: Scalars["String"];
  enabled: Scalars["Boolean"];
  private: Scalars["Boolean"];
  restricted: Scalars["Boolean"];
  owner: Scalars["String"];
  repo: Scalars["String"];
  branch: Scalars["String"];
  remotePath: Scalars["String"];
  patchingDisabled: Scalars["Boolean"];
  repotrackerDisabled: Scalars["Boolean"];
  dispatchingDisabled: Scalars["Boolean"];
  prTestingEnabled: Scalars["Boolean"];
  githubChecksEnabled: Scalars["Boolean"];
  batchTime: Scalars["Int"];
  deactivatePrevious: Scalars["Boolean"];
  defaultLogger: Scalars["String"];
  notifyOnBuildFailure: Scalars["Boolean"];
  triggers: Array<TriggerAlias>;
  patchTriggerAliases?: Maybe<Array<PatchTriggerAlias>>;
  githubTriggerAliases?: Maybe<Array<Scalars["String"]>>;
  periodicBuilds?: Maybe<Array<PeriodicBuild>>;
  cedarTestResultsEnabled: Scalars["Boolean"];
  commitQueue: RepoCommitQueueParams;
  admins: Array<Scalars["String"]>;
  spawnHostScriptPath: Scalars["String"];
  tracksPushEvents: Scalars["Boolean"];
  taskSync: RepoTaskSyncOptions;
  gitTagAuthorizedUsers?: Maybe<Array<Scalars["String"]>>;
  gitTagAuthorizedTeams?: Maybe<Array<Scalars["String"]>>;
  gitTagVersionsEnabled: Scalars["Boolean"];
  filesIgnoredFromCache?: Maybe<Array<Scalars["String"]>>;
  disabledStatsCache: Scalars["Boolean"];
  workstationConfig: RepoWorkstationConfig;
  perfEnabled: Scalars["Boolean"];
  buildBaronSettings: BuildBaronSettings;
  taskAnnotationSettings: TaskAnnotationSettings;
  validDefaultLoggers: Array<Scalars["String"]>;
};

export type TriggerAlias = {
  project?: Maybe<Scalars["String"]>;
  level: Scalars["String"];
  definitionID: Scalars["String"];
  buildVariantRegex: Scalars["String"];
  taskRegex: Scalars["String"];
  status: Scalars["String"];
  dateCutoff: Scalars["Int"];
  configFile: Scalars["String"];
  generateFile: Scalars["String"];
  command: Scalars["String"];
  alias: Scalars["String"];
};

export type PeriodicBuild = {
  id: Scalars["String"];
  configFile: Scalars["String"];
  intervalHours: Scalars["Int"];
  alias: Scalars["String"];
  message: Scalars["String"];
  nextRunTime: Scalars["Time"];
};

export type CommitQueueParams = {
  enabled?: Maybe<Scalars["Boolean"]>;
  requireSigned?: Maybe<Scalars["Boolean"]>;
  mergeMethod: Scalars["String"];
  message: Scalars["String"];
};

export type RepoCommitQueueParams = {
  enabled: Scalars["Boolean"];
  requireSigned: Scalars["Boolean"];
  mergeMethod: Scalars["String"];
  message: Scalars["String"];
};

export type TaskSyncOptions = {
  configEnabled?: Maybe<Scalars["Boolean"]>;
  patchEnabled?: Maybe<Scalars["Boolean"]>;
};

export type RepoTaskSyncOptions = {
  configEnabled: Scalars["Boolean"];
  patchEnabled: Scalars["Boolean"];
};

export type WorkstationConfig = {
  setupCommands?: Maybe<Array<WorkstationSetupCommand>>;
  gitClone?: Maybe<Scalars["Boolean"]>;
};

export type BuildBaronSettings = {
  ticketCreateProject: Scalars["String"];
  ticketSearchProjects?: Maybe<Array<Scalars["String"]>>;
  bfSuggestionServer?: Maybe<Scalars["String"]>;
  bfSuggestionUsername?: Maybe<Scalars["String"]>;
  bfSuggestionPassword?: Maybe<Scalars["String"]>;
  bfSuggestionTimeoutSecs?: Maybe<Scalars["Int"]>;
  bfSuggestionFeaturesURL?: Maybe<Scalars["String"]>;
};

export type TaskAnnotationSettings = {
  jiraCustomFields?: Maybe<Array<JiraField>>;
  fileTicketWebhook: Webhook;
};

export type JiraField = {
  field: Scalars["String"];
  displayText: Scalars["String"];
};

export type Webhook = {
  endpoint: Scalars["String"];
  secret: Scalars["String"];
};

export type RepoWorkstationConfig = {
  setupCommands?: Maybe<Array<WorkstationSetupCommand>>;
  gitClone: Scalars["Boolean"];
};

export type WorkstationSetupCommand = {
  command: Scalars["String"];
  directory: Scalars["String"];
};

export type TaskSpecifier = {
  patchAlias: Scalars["String"];
  taskRegex: Scalars["String"];
  variantRegex: Scalars["String"];
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
  permissions: Permissions;
};

export type UserPatchesArgs = {
  patchesInput: PatchesInput;
};

export type TaskLogs = {
  taskId: Scalars["String"];
  execution: Scalars["Int"];
  defaultLogger: Scalars["String"];
  eventLogs: Array<TaskEventLogEntry>;
  taskLogs: Array<LogMessage>;
  systemLogs: Array<LogMessage>;
  agentLogs: Array<LogMessage>;
  allLogs: Array<LogMessage>;
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
  defaultProject: Scalars["String"];
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
  bbTicketCreationDefined: Scalars["Boolean"];
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
  createdIssues?: Maybe<Array<Maybe<IssueLink>>>;
  webhookConfigured: Scalars["Boolean"];
};

export type Note = {
  message: Scalars["String"];
  source: Source;
};

export type IssueLink = {
  issueKey?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
  source?: Maybe<Source>;
  jiraTicket?: Maybe<JiraTicket>;
};

export type Source = {
  author: Scalars["String"];
  time: Scalars["Time"];
  requester: Scalars["String"];
};

export type AnnotationFragment = {
  id: string;
  taskId: string;
  taskExecution: number;
  webhookConfigured: boolean;
  note?: Maybe<{
    message: string;
    source: { author: string; time: Date; requester: string };
  }>;
  issues?: Maybe<
    Array<
      Maybe<{
        issueKey?: Maybe<string>;
        url?: Maybe<string>;
        source?: Maybe<{ author: string; time: Date; requester: string }>;
      }>
    >
  >;
  suspectedIssues?: Maybe<
    Array<
      Maybe<{
        issueKey?: Maybe<string>;
        url?: Maybe<string>;
        source?: Maybe<{ author: string; time: Date; requester: string }>;
      }>
    >
  >;
  createdIssues?: Maybe<
    Array<
      Maybe<{
        issueKey?: Maybe<string>;
        url?: Maybe<string>;
        source?: Maybe<{ author: string; time: Date; requester: string }>;
      }>
    >
  >;
};

export type BaseHostFragment = {
  id: string;
  hostUrl: string;
  status: string;
  startedBy: string;
  user?: Maybe<string>;
  tag: string;
  provider: string;
};

export type BasePatchFragment = {
  id: string;
  description: string;
  author: string;
  status: string;
  activated: boolean;
  alias?: Maybe<string>;
  commitQueuePosition?: Maybe<number>;
  variantsTasks: Array<Maybe<{ name: string; tasks: Array<string> }>>;
  parameters: Array<{ key: string; value: string }>;
};

export type BaseSpawnHostFragment = {
  availabilityZone?: Maybe<string>;
  displayName?: Maybe<string>;
  expiration?: Maybe<Date>;
  homeVolumeID?: Maybe<string>;
  instanceType?: Maybe<string>;
  noExpiration: boolean;
  uptime?: Maybe<Date>;
  distro?: Maybe<{
    isVirtualWorkStation?: Maybe<boolean>;
    id?: Maybe<string>;
    user?: Maybe<string>;
    workDir?: Maybe<string>;
    isWindows?: Maybe<boolean>;
  }>;
  homeVolume?: Maybe<{ displayName: string }>;
  instanceTags: Array<{ key: string; value: string; canBeModified: boolean }>;
  volumes: Array<{ displayName: string; id: string }>;
} & BaseHostFragment;

export type BaseTaskFragment = {
  id: string;
  execution: number;
  buildVariant: string;
  displayName: string;
  revision?: Maybe<string>;
  status: string;
};

export type FileDiffsFragment = {
  fileName: string;
  additions: number;
  deletions: number;
  diffLink: string;
  description: string;
};

export type JiraTicketFragment = {
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
};

export type LogMessageFragment = {
  severity?: Maybe<string>;
  message?: Maybe<string>;
  timestamp?: Maybe<Date>;
};

export type ModuleCodeChangeFragment = {
  rawLink: string;
  branchName: string;
  htmlLink: string;
  fileDiffs: Array<FileDiffsFragment>;
};

export type PatchesPagePatchesFragment = {
  filteredPatchCount: number;
  patches: Array<{
    id: string;
    author: string;
    authorDisplayName: string;
    projectID: string;
    projectIdentifier: string;
    description: string;
    status: string;
    createTime?: Maybe<Date>;
    commitQueuePosition?: Maybe<number>;
    canEnqueueToCommitQueue: boolean;
    childPatches?: Maybe<
      Array<{
        baseVersionID?: Maybe<string>;
        githash: string;
        id: string;
        projectID: string;
        taskCount?: Maybe<number>;
        status: string;
      }>
    >;
    versionFull?: Maybe<{
      id: string;
      taskStatusCounts?: Maybe<Array<{ status: string; count: number }>>;
    }>;
  }>;
};

export type ProjectFragment = {
  identifier: string;
  repo: string;
  owner: string;
  displayName: string;
};

export type ProjectAccessSettingsFragment = {
  private?: Maybe<boolean>;
  restricted?: Maybe<boolean>;
  admins?: Maybe<Array<Maybe<string>>>;
};

export type RepoAccessSettingsFragment = {
  private: boolean;
  restricted: boolean;
  admins: Array<string>;
};

export type AliasFragment = {
  id: string;
  alias: string;
  gitTag: string;
  variant: string;
  task: string;
  remotePath: string;
  variantTags: Array<string>;
  taskTags: Array<string>;
};

export type ProjectGeneralSettingsFragment = {
  enabled?: Maybe<boolean>;
  owner: string;
  repo: string;
  branch: string;
  displayName: string;
  batchTime: number;
  remotePath: string;
  spawnHostScriptPath: string;
  dispatchingDisabled?: Maybe<boolean>;
  deactivatePrevious?: Maybe<boolean>;
  repotrackerDisabled?: Maybe<boolean>;
  defaultLogger: string;
  validDefaultLoggers: Array<string>;
  cedarTestResultsEnabled?: Maybe<boolean>;
  patchingDisabled?: Maybe<boolean>;
  disabledStatsCache?: Maybe<boolean>;
  filesIgnoredFromCache?: Maybe<Array<string>>;
  taskSync: { configEnabled?: Maybe<boolean>; patchEnabled?: Maybe<boolean> };
};

export type RepoGeneralSettingsFragment = {
  enabled: boolean;
  owner: string;
  repo: string;
  branch: string;
  displayName: string;
  batchTime: number;
  remotePath: string;
  spawnHostScriptPath: string;
  dispatchingDisabled: boolean;
  deactivatePrevious: boolean;
  repotrackerDisabled: boolean;
  defaultLogger: string;
  validDefaultLoggers: Array<string>;
  cedarTestResultsEnabled: boolean;
  patchingDisabled: boolean;
  disabledStatsCache: boolean;
  filesIgnoredFromCache?: Maybe<Array<string>>;
  taskSync: { configEnabled: boolean; patchEnabled: boolean };
};

export type ProjectGithubCommitQueueFragment = {
  gitHubWebhooksEnabled: boolean;
  projectRef?: Maybe<{
    prTestingEnabled?: Maybe<boolean>;
    githubChecksEnabled?: Maybe<boolean>;
    githubTriggerAliases?: Maybe<Array<string>>;
    gitTagVersionsEnabled?: Maybe<boolean>;
    gitTagAuthorizedUsers?: Maybe<Array<string>>;
    gitTagAuthorizedTeams?: Maybe<Array<string>>;
    commitQueue: {
      enabled?: Maybe<boolean>;
      requireSigned?: Maybe<boolean>;
      mergeMethod: string;
      message: string;
    };
  }>;
};

export type RepoGithubCommitQueueFragment = {
  gitHubWebhooksEnabled: boolean;
  projectRef?: Maybe<{
    prTestingEnabled: boolean;
    githubChecksEnabled: boolean;
    githubTriggerAliases?: Maybe<Array<string>>;
    gitTagVersionsEnabled: boolean;
    gitTagAuthorizedUsers?: Maybe<Array<string>>;
    gitTagAuthorizedTeams?: Maybe<Array<string>>;
    commitQueue: {
      enabled: boolean;
      requireSigned: boolean;
      mergeMethod: string;
      message: string;
    };
  }>;
};

export type ProjectSettingsFragment = {
  projectRef?: Maybe<
    {
      id: string;
      identifier: string;
      repoRefId: string;
    } & ProjectGeneralSettingsFragment &
      ProjectAccessSettingsFragment &
      ProjectPluginsSettingsFragment &
      ProjectNotificationSettingsFragment &
      ProjectPatchAliasSettingsFragment &
      ProjectVirtualWorkstationSettingsFragment
  >;
  subscriptions?: Maybe<Array<SubscriptionsFragment>>;
  vars?: Maybe<VariablesFragment>;
  aliases?: Maybe<Array<AliasFragment>>;
} & ProjectGithubCommitQueueFragment;

export type RepoSettingsFragment = {
  projectRef?: Maybe<
    { id: string } & RepoGeneralSettingsFragment &
      RepoAccessSettingsFragment &
      RepoPluginsSettingsFragment &
      RepoNotificationSettingsFragment &
      RepoPatchAliasSettingsFragment &
      RepoVirtualWorkstationSettingsFragment
  >;
  vars?: Maybe<VariablesFragment>;
  subscriptions?: Maybe<Array<SubscriptionsFragment>>;
  aliases?: Maybe<Array<AliasFragment>>;
} & RepoGithubCommitQueueFragment;

export type ProjectNotificationSettingsFragment = {
  notifyOnBuildFailure?: Maybe<boolean>;
};

export type RepoNotificationSettingsFragment = {
  notifyOnBuildFailure: boolean;
};

export type SubscriptionsFragment = {
  id: string;
  resourceType: string;
  trigger: string;
  ownerType: string;
  triggerData?: Maybe<{ [key: string]: any }>;
  selectors: Array<{ type: string; data: string }>;
  regexSelectors: Array<{ type: string; data: string }>;
  subscriber?: Maybe<{
    type: string;
    subscriber: {
      jiraCommentSubscriber?: Maybe<string>;
      emailSubscriber?: Maybe<string>;
      slackSubscriber?: Maybe<string>;
      githubPRSubscriber?: Maybe<{
        owner: string;
        repo: string;
        ref: string;
        prNumber?: Maybe<number>;
      }>;
      githubCheckSubscriber?: Maybe<{
        owner: string;
        repo: string;
        ref: string;
      }>;
      webhookSubscriber?: Maybe<{
        url: string;
        secret: string;
        headers: Array<Maybe<{ key: string; value: string }>>;
      }>;
      jiraIssueSubscriber?: Maybe<{ project: string; issueType: string }>;
    };
  }>;
};

export type ProjectPatchAliasSettingsFragment = {
  githubTriggerAliases?: Maybe<Array<string>>;
  patchTriggerAliases?: Maybe<
    Array<{
      alias: string;
      childProjectIdentifier: string;
      status?: Maybe<string>;
      parentAsModule?: Maybe<string>;
      taskSpecifiers?: Maybe<
        Array<{ patchAlias: string; taskRegex: string; variantRegex: string }>
      >;
    }>
  >;
};

export type RepoPatchAliasSettingsFragment = {
  githubTriggerAliases?: Maybe<Array<string>>;
  patchTriggerAliases?: Maybe<
    Array<{
      alias: string;
      childProjectIdentifier: string;
      status?: Maybe<string>;
      parentAsModule?: Maybe<string>;
      taskSpecifiers?: Maybe<
        Array<{ patchAlias: string; taskRegex: string; variantRegex: string }>
      >;
    }>
  >;
};

export type ProjectPluginsSettingsFragment = {
  perfEnabled?: Maybe<boolean>;
  buildBaronSettings: {
    ticketCreateProject: string;
    ticketSearchProjects?: Maybe<Array<string>>;
  };
  taskAnnotationSettings: {
    jiraCustomFields?: Maybe<Array<{ field: string; displayText: string }>>;
    fileTicketWebhook: { endpoint: string; secret: string };
  };
};

export type RepoPluginsSettingsFragment = {
  perfEnabled: boolean;
  buildBaronSettings: {
    ticketCreateProject: string;
    ticketSearchProjects?: Maybe<Array<string>>;
  };
  taskAnnotationSettings: {
    jiraCustomFields?: Maybe<Array<{ field: string; displayText: string }>>;
    fileTicketWebhook: { endpoint: string; secret: string };
  };
};

export type VariablesFragment = {
  vars?: Maybe<{ [key: string]: any }>;
  privateVars?: Maybe<Array<Maybe<string>>>;
  adminOnlyVars?: Maybe<Array<Maybe<string>>>;
};

export type ProjectVirtualWorkstationSettingsFragment = {
  workstationConfig: {
    gitClone?: Maybe<boolean>;
    setupCommands?: Maybe<Array<{ command: string; directory: string }>>;
  };
};

export type RepoVirtualWorkstationSettingsFragment = {
  workstationConfig: {
    gitClone: boolean;
    setupCommands?: Maybe<Array<{ command: string; directory: string }>>;
  };
};

export type AbortTaskMutationVariables = Exact<{
  taskId: Scalars["String"];
}>;

export type AbortTaskMutation = {
  abortTask: { priority?: Maybe<number> } & BaseTaskFragment;
};

export type AddAnnotationIssueMutationVariables = Exact<{
  taskId: Scalars["String"];
  execution: Scalars["Int"];
  apiIssue: IssueLinkInput;
  isIssue: Scalars["Boolean"];
}>;

export type AddAnnotationIssueMutation = { addAnnotationIssue: boolean };

export type AddFavoriteProjectMutationVariables = Exact<{
  identifier: Scalars["String"];
}>;

export type AddFavoriteProjectMutation = {
  addFavoriteProject: {
    id: string;
    identifier: string;
    repo: string;
    owner: string;
    displayName: string;
    isFavorite: boolean;
  };
};

export type AttachProjectToNewRepoMutationVariables = Exact<{
  project: MoveProjectInput;
}>;

export type AttachProjectToNewRepoMutation = {
  attachProjectToNewRepo: { repoRefId: string };
};

export type AttachProjectToRepoMutationVariables = Exact<{
  projectId: Scalars["String"];
}>;

export type AttachProjectToRepoMutation = {
  attachProjectToRepo: { id: string };
};

export type AttachVolumeToHostMutationVariables = Exact<{
  volumeAndHost: VolumeHost;
}>;

export type AttachVolumeToHostMutation = { attachVolumeToHost: boolean };

export type ClearMySubscriptionsMutationVariables = Exact<{
  [key: string]: never;
}>;

export type ClearMySubscriptionsMutation = { clearMySubscriptions: number };

export type CreateProjectMutationVariables = Exact<{
  project: CreateProjectInput;
}>;

export type CreateProjectMutation = { createProject: { identifier: string } };

export type CreatePublicKeyMutationVariables = Exact<{
  publicKeyInput: PublicKeyInput;
}>;

export type CreatePublicKeyMutation = {
  createPublicKey: Array<{ key: string; name: string }>;
};

export type DefaultSectionToRepoMutationVariables = Exact<{
  projectId: Scalars["String"];
  section: ProjectSettingsSection;
}>;

export type DefaultSectionToRepoMutation = {
  defaultSectionToRepo?: Maybe<string>;
};

export type DetachProjectFromRepoMutationVariables = Exact<{
  projectId: Scalars["String"];
}>;

export type DetachProjectFromRepoMutation = {
  detachProjectFromRepo: { id: string };
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
  publicKey?: Maybe<PublicKeyInput>;
  savePublicKey?: Maybe<Scalars["Boolean"]>;
}>;

export type EditSpawnHostMutation = { editSpawnHost: BaseSpawnHostFragment };

export type EnqueuePatchMutationVariables = Exact<{
  patchId: Scalars["String"];
  commitMessage?: Maybe<Scalars["String"]>;
}>;

export type EnqueuePatchMutation = { enqueuePatch: { id: string } };

export type BbCreateTicketMutationVariables = Exact<{
  taskId: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type BbCreateTicketMutation = { bbCreateTicket: boolean };

export type ForceRepotrackerRunMutationVariables = Exact<{
  projectId: Scalars["String"];
}>;

export type ForceRepotrackerRunMutation = { forceRepotrackerRun: boolean };

export type MoveAnnotationIssueMutationVariables = Exact<{
  taskId: Scalars["String"];
  execution: Scalars["Int"];
  apiIssue: IssueLinkInput;
  isIssue: Scalars["Boolean"];
}>;

export type MoveAnnotationIssueMutation = { moveAnnotationIssue: boolean };

export type OverrideTaskDependenciesMutationVariables = Exact<{
  taskId: Scalars["String"];
}>;

export type OverrideTaskDependenciesMutation = {
  overrideTaskDependencies: { id: string; execution: number; status: string };
};

export type RemoveAnnotationIssueMutationVariables = Exact<{
  taskId: Scalars["String"];
  execution: Scalars["Int"];
  apiIssue: IssueLinkInput;
  isIssue: Scalars["Boolean"];
}>;

export type RemoveAnnotationIssueMutation = { removeAnnotationIssue: boolean };

export type RemoveFavoriteProjectMutationVariables = Exact<{
  identifier: Scalars["String"];
}>;

export type RemoveFavoriteProjectMutation = {
  removeFavoriteProject: {
    id: string;
    identifier: string;
    repo: string;
    owner: string;
    displayName: string;
    isFavorite: boolean;
  };
};

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

export type ReprovisionToNewMutationVariables = Exact<{
  hostIds: Array<Scalars["String"]>;
}>;

export type ReprovisionToNewMutation = { reprovisionToNew: number };

export type RestartJasperMutationVariables = Exact<{
  hostIds: Array<Scalars["String"]>;
}>;

export type RestartJasperMutation = { restartJasper: number };

export type RestartTaskMutationVariables = Exact<{
  taskId: Scalars["String"];
}>;

export type RestartTaskMutation = {
  restartTask: {
    latestExecution: number;
    execution: number;
  } & BaseTaskFragment;
};

export type RestartVersionsMutationVariables = Exact<{
  versionId: Scalars["String"];
  abort: Scalars["Boolean"];
  versionsToRestart: Array<VersionToRestart>;
}>;

export type RestartVersionsMutation = {
  restartVersions?: Maybe<
    Array<{
      id: string;
      taskStatuses: Array<string>;
      status: string;
      patch?: Maybe<{
        id: string;
        status: string;
        childPatches?: Maybe<Array<{ id: string; status: string }>>;
      }>;
    }>
  >;
};

export type SaveProjectSettingsForSectionMutationVariables = Exact<{
  projectSettings: ProjectSettingsInput;
  section: ProjectSettingsSection;
}>;

export type SaveProjectSettingsForSectionMutation = {
  saveProjectSettingsForSection: ProjectSettingsFragment;
};

export type SaveRepoSettingsForSectionMutationVariables = Exact<{
  repoSettings: RepoSettingsInput;
  section: ProjectSettingsSection;
}>;

export type SaveRepoSettingsForSectionMutation = {
  saveRepoSettingsForSection: RepoSettingsFragment;
};

export type SaveSubscriptionMutationVariables = Exact<{
  subscription: SubscriptionInput;
}>;

export type SaveSubscriptionMutation = { saveSubscription: boolean };

export type SchedulePatchMutationVariables = Exact<{
  patchId: Scalars["String"];
  configure: PatchConfigure;
}>;

export type SchedulePatchMutation = {
  schedulePatch: {
    version: string;
    tasks: Array<string>;
    variants: Array<string>;
  } & BasePatchFragment;
};

export type ScheduleTasksMutationVariables = Exact<{
  taskIds: Array<Scalars["String"]>;
}>;

export type ScheduleTasksMutation = { scheduleTasks: Array<BaseTaskFragment> };

export type ScheduleUndispatchedBaseTasksMutationVariables = Exact<{
  patchId: Scalars["String"];
}>;

export type ScheduleUndispatchedBaseTasksMutation = {
  scheduleUndispatchedBaseTasks?: Maybe<
    Array<{ id: string; execution: number; status: string }>
  >;
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

export type GetFailedTaskStatusIconTooltipQueryVariables = Exact<{
  taskId: Scalars["String"];
}>;

export type GetFailedTaskStatusIconTooltipQuery = {
  taskTests: {
    filteredTestCount: number;
    testResults: Array<{ id: string; testFile: string }>;
  };
};

export type AgentLogsQueryVariables = Exact<{
  id: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type AgentLogsQuery = {
  taskLogs: {
    execution: number;
    taskId: string;
    agentLogs: Array<LogMessageFragment>;
  };
};

export type AllLogsQueryVariables = Exact<{
  id: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type AllLogsQuery = {
  taskLogs: {
    execution: number;
    taskId: string;
    allLogs: Array<LogMessageFragment>;
  };
};

export type GetAnnotationEventDataQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type GetAnnotationEventDataQuery = {
  task?: Maybe<{
    id: string;
    execution: number;
    annotation?: Maybe<AnnotationFragment>;
  }>;
};

export type GetBaseVersionAndTaskQueryVariables = Exact<{
  taskId: Scalars["String"];
}>;

export type GetBaseVersionAndTaskQuery = {
  task?: Maybe<{
    id: string;
    execution: number;
    displayName: string;
    buildVariant: string;
    versionMetadata: {
      id: string;
      isPatch: boolean;
      baseVersion?: Maybe<{
        id: string;
        order: number;
        projectIdentifier: string;
      }>;
    };
    baseTask?: Maybe<{ id: string; execution: number; status: string }>;
  }>;
};

export type BuildBaronQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution: Scalars["Int"];
}>;

export type BuildBaronQuery = {
  buildBaron: {
    buildBaronConfigured: boolean;
    bbTicketCreationDefined: boolean;
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

export type GetBuildVariantStatsQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type GetBuildVariantStatsQuery = {
  version: {
    id: string;
    buildVariantStats?: Maybe<
      Array<{
        variant: string;
        displayName: string;
        statusCounts: Array<{ count: number; status: string }>;
      }>
    >;
  };
};

export type GetBuildVariantsForTaskNameQueryVariables = Exact<{
  projectId: Scalars["String"];
  taskName: Scalars["String"];
}>;

export type GetBuildVariantsForTaskNameQuery = {
  buildVariantsForTaskName?: Maybe<
    Array<Maybe<{ displayName: string; buildVariant: string }>>
  >;
};

export type BuildVariantsWithChildrenQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type BuildVariantsWithChildrenQuery = {
  version: {
    id: string;
    buildVariants?: Maybe<
      Array<
        Maybe<{
          variant: string;
          displayName: string;
          tasks?: Maybe<
            Array<
              Maybe<{
                id: string;
                execution: number;
                status: string;
                displayName: string;
                baseStatus?: Maybe<string>;
              }>
            >
          >;
        }>
      >
    >;
    childVersions?: Maybe<
      Array<
        Maybe<{
          id: string;
          projectIdentifier: string;
          project: string;
          buildVariants?: Maybe<
            Array<
              Maybe<{
                variant: string;
                displayName: string;
                tasks?: Maybe<
                  Array<
                    Maybe<{
                      id: string;
                      execution: number;
                      status: string;
                      displayName: string;
                      baseStatus?: Maybe<string>;
                    }>
                  >
                >;
              }>
            >
          >;
        }>
      >
    >;
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
  patch: { id: string; moduleCodeChanges: Array<ModuleCodeChangeFragment> };
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
          activated: boolean;
          versionFull?: Maybe<{ id: string }>;
          moduleCodeChanges: Array<ModuleCodeChangeFragment>;
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

export type GetDisplayTaskQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type GetDisplayTaskQuery = {
  task?: Maybe<{
    id: string;
    displayName: string;
    execution: number;
    executionTasks?: Maybe<Array<string>>;
    displayTask?: Maybe<{ id: string; execution: number }>;
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

export type EventLogsQueryVariables = Exact<{
  id: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type EventLogsQuery = {
  taskLogs: {
    execution: number;
    taskId: string;
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

export type GetHasVersionQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type GetHasVersionQuery = { hasVersion: boolean };

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
  host?: Maybe<
    {
      distroId?: Maybe<string>;
      lastCommunicationTime?: Maybe<Date>;
      distro?: Maybe<{ bootstrapMethod?: Maybe<string> }>;
      runningTask?: Maybe<{ id?: Maybe<string>; name?: Maybe<string> }>;
    } & BaseHostFragment
  >;
};

export type InstanceTypesQueryVariables = Exact<{ [key: string]: never }>;

export type InstanceTypesQuery = { instanceTypes: Array<string> };

export type IsPatchConfiguredQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type IsPatchConfiguredQuery = {
  patch: {
    id: string;
    activated: boolean;
    alias?: Maybe<string>;
    projectID: string;
  };
};

export type GetCustomCreatedIssuesQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type GetCustomCreatedIssuesQuery = {
  task?: Maybe<{
    id: string;
    execution: number;
    annotation?: Maybe<{
      createdIssues?: Maybe<
        Array<
          Maybe<{
            issueKey?: Maybe<string>;
            url?: Maybe<string>;
            source?: Maybe<{ author: string; time: Date; requester: string }>;
            jiraTicket?: Maybe<JiraTicketFragment>;
          }>
        >
      >;
    }>;
  }>;
};

export type GetIssuesQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type GetIssuesQuery = {
  task?: Maybe<{
    id: string;
    execution: number;
    annotation?: Maybe<{
      issues?: Maybe<
        Array<
          Maybe<{
            issueKey?: Maybe<string>;
            url?: Maybe<string>;
            source?: Maybe<{ author: string; time: Date; requester: string }>;
            jiraTicket?: Maybe<JiraTicketFragment>;
          }>
        >
      >;
    }>;
  }>;
};

export type GetSuspectedIssuesQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type GetSuspectedIssuesQuery = {
  task?: Maybe<{
    id: string;
    execution: number;
    annotation?: Maybe<{
      suspectedIssues?: Maybe<
        Array<
          Maybe<{
            issueKey?: Maybe<string>;
            url?: Maybe<string>;
            source?: Maybe<{ author: string; time: Date; requester: string }>;
            jiraTicket?: Maybe<JiraTicketFragment>;
          }>
        >
      >;
    }>;
  }>;
};

export type GetLastMainlineCommitQueryVariables = Exact<{
  projectIdentifier: Scalars["String"];
  skipOrderNumber: Scalars["Int"];
  buildVariantOptions: BuildVariantOptions;
}>;

export type GetLastMainlineCommitQuery = {
  mainlineCommits?: Maybe<{
    versions: Array<{
      version?: Maybe<{
        id: string;
        buildVariants?: Maybe<
          Array<
            Maybe<{
              tasks?: Maybe<
                Array<Maybe<{ id: string; execution: number; status: string }>>
              >;
            }>
          >
        >;
      }>;
    }>;
  }>;
};

export type MainlineCommitsForHistoryQueryVariables = Exact<{
  mainlineCommitsOptions: MainlineCommitsOptions;
  buildVariantOptions: BuildVariantOptions;
}>;

export type MainlineCommitsForHistoryQuery = {
  mainlineCommits?: Maybe<{
    nextPageOrderNumber?: Maybe<number>;
    prevPageOrderNumber?: Maybe<number>;
    versions: Array<{
      version?: Maybe<{
        id: string;
        author: string;
        createTime: Date;
        message: string;
        revision: string;
        order: number;
        buildVariants?: Maybe<
          Array<
            Maybe<{
              displayName: string;
              variant: string;
              tasks?: Maybe<
                Array<
                  Maybe<{
                    id: string;
                    execution: number;
                    status: string;
                    displayName: string;
                  }>
                >
              >;
            }>
          >
        >;
      }>;
      rolledUpVersions?: Maybe<
        Array<{
          id: string;
          createTime: Date;
          author: string;
          order: number;
          message: string;
          revision: string;
        }>
      >;
    }>;
  }>;
};

export type MainlineCommitsQueryVariables = Exact<{
  mainlineCommitsOptions: MainlineCommitsOptions;
  buildVariantOptions: BuildVariantOptions;
  buildVariantOptionsForGraph: BuildVariantOptions;
  buildVariantOptionsForTaskIcons: BuildVariantOptions;
  buildVariantOptionsForGroupedTasks: BuildVariantOptions;
}>;

export type MainlineCommitsQuery = {
  mainlineCommits?: Maybe<{
    nextPageOrderNumber?: Maybe<number>;
    prevPageOrderNumber?: Maybe<number>;
    versions: Array<{
      version?: Maybe<{
        projectIdentifier: string;
        id: string;
        author: string;
        createTime: Date;
        message: string;
        revision: string;
        order: number;
        taskStatusCounts?: Maybe<Array<{ status: string; count: number }>>;
        buildVariantStats?: Maybe<
          Array<{
            displayName: string;
            variant: string;
            statusCounts: Array<{ count: number; status: string }>;
          }>
        >;
        buildVariants?: Maybe<
          Array<
            Maybe<{
              displayName: string;
              variant: string;
              tasks?: Maybe<
                Array<
                  Maybe<{
                    id: string;
                    execution: number;
                    status: string;
                    displayName: string;
                    timeTaken?: Maybe<number>;
                  }>
                >
              >;
            }>
          >
        >;
      }>;
      rolledUpVersions?: Maybe<
        Array<{
          id: string;
          createTime: Date;
          author: string;
          order: number;
          message: string;
          revision: string;
        }>
      >;
    }>;
  }>;
};

export type MyHostsQueryVariables = Exact<{ [key: string]: never }>;

export type MyHostsQuery = { myHosts: Array<BaseSpawnHostFragment> };

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

export type GetOtherUserQueryVariables = Exact<{
  userId?: Maybe<Scalars["String"]>;
}>;

export type GetOtherUserQuery = {
  otherUser: { userId: string; displayName: string };
  currentUser: { userId: string };
};

export type ConfigurePatchQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type ConfigurePatchQuery = {
  patch: {
    time?: Maybe<{ submittedAt: string }>;
    project?: Maybe<{
      variants: Array<{
        name: string;
        displayName: string;
        tasks: Array<string>;
      }>;
    }>;
    childPatches?: Maybe<
      Array<{
        id: string;
        projectIdentifier: string;
        variantsTasks: Array<Maybe<{ name: string; tasks: Array<string> }>>;
      }>
    >;
    patchTriggerAliases: Array<{
      alias: string;
      childProjectId: string;
      childProjectIdentifier: string;
      variantsTasks: Array<{ name: string; tasks: Array<string> }>;
    }>;
    childPatchAliases?: Maybe<Array<{ alias: string; patchId: string }>>;
  } & BasePatchFragment;
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
      execution: number;
      aborted: boolean;
      status: string;
      displayName: string;
      buildVariant: string;
      buildVariantDisplayName?: Maybe<string>;
      blocked: boolean;
      projectIdentifier?: Maybe<string>;
      executionTasksFull?: Maybe<
        Array<{
          id: string;
          execution: number;
          displayName: string;
          status: string;
          buildVariant: string;
          baseStatus?: Maybe<string>;
          buildVariantDisplayName?: Maybe<string>;
          projectIdentifier?: Maybe<string>;
          baseTask?: Maybe<{ id: string; execution: number; status: string }>;
        }>
      >;
      baseTask?: Maybe<{ id: string; execution: number; status: string }>;
    }>;
  };
};

export type PatchQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type PatchQuery = {
  patch: {
    projectID: string;
    projectIdentifier: string;
    githash: string;
    patchNumber: number;
    version: string;
    taskCount?: Maybe<number>;
    baseVersionID?: Maybe<string>;
    canEnqueueToCommitQueue: boolean;
    childPatches?: Maybe<
      Array<{
        baseVersionID?: Maybe<string>;
        githash: string;
        id: string;
        projectID: string;
        taskCount?: Maybe<number>;
        status: string;
      }>
    >;
    duration?: Maybe<{ makespan?: Maybe<string>; timeTaken?: Maybe<string> }>;
    time?: Maybe<{
      started?: Maybe<string>;
      submittedAt: string;
      finished?: Maybe<string>;
    }>;
  } & BasePatchFragment;
};

export type ProjectSettingsQueryVariables = Exact<{
  identifier: Scalars["String"];
}>;

export type ProjectSettingsQuery = { projectSettings: ProjectSettingsFragment };

export type GetProjectsQueryVariables = Exact<{ [key: string]: never }>;

export type GetProjectsQuery = {
  projects: Array<
    Maybe<{
      name: string;
      projects: Array<{
        id: string;
        identifier: string;
        repo: string;
        owner: string;
        displayName: string;
        isFavorite: boolean;
      }>;
    }>
  >;
};

export type GetMyPublicKeysQueryVariables = Exact<{ [key: string]: never }>;

export type GetMyPublicKeysQuery = {
  myPublicKeys: Array<{ name: string; key: string }>;
};

export type RepoSettingsQueryVariables = Exact<{
  repoId: Scalars["String"];
}>;

export type RepoSettingsQuery = { repoSettings: RepoSettingsFragment };

export type GetSpruceConfigQueryVariables = Exact<{ [key: string]: never }>;

export type GetSpruceConfigQuery = {
  spruceConfig?: Maybe<{
    bannerTheme?: Maybe<string>;
    banner?: Maybe<string>;
    ui?: Maybe<{ userVoice?: Maybe<string>; defaultProject: string }>;
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

export type SystemLogsQueryVariables = Exact<{
  id: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type SystemLogsQuery = {
  taskLogs: {
    execution: number;
    taskId: string;
    systemLogs: Array<LogMessageFragment>;
  };
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

export type GetTaskForTestsTableQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type GetTaskForTestsTableQuery = {
  task?: Maybe<
    {
      displayName: string;
      projectIdentifier?: Maybe<string>;
      displayTask?: Maybe<{ id: string; execution: number }>;
    } & BaseTaskFragment
  >;
};

export type TaskLogsQueryVariables = Exact<{
  id: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type TaskLogsQuery = {
  taskLogs: {
    execution: number;
    taskId: string;
    taskLogs: Array<LogMessageFragment>;
  };
};

export type GetTaskNamesForBuildVariantQueryVariables = Exact<{
  projectId: Scalars["String"];
  buildVariant: Scalars["String"];
}>;

export type GetTaskNamesForBuildVariantQuery = {
  taskNamesForBuildVariant?: Maybe<Array<string>>;
};

export type GetTaskStatusesQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type GetTaskStatusesQuery = {
  version: {
    id: string;
    taskStatuses: Array<string>;
    baseTaskStatuses: Array<string>;
  };
};

export type GetTaskTestSampleQueryVariables = Exact<{
  tasks: Array<Scalars["String"]>;
  filters: Array<TestFilter>;
}>;

export type GetTaskTestSampleQuery = {
  taskTestSample?: Maybe<
    Array<{
      taskId: string;
      execution: number;
      matchingFailedTestNames: Array<string>;
      totalTestCount: number;
    }>
  >;
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
      testFile: string;
      id: string;
      status: string;
      baseStatus?: Maybe<string>;
      duration?: Maybe<number>;
      logs: {
        url?: Maybe<string>;
        urlRaw?: Maybe<string>;
        urlLobster?: Maybe<string>;
      };
    }>;
  };
};

export type GetTaskQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution?: Maybe<Scalars["Int"]>;
}>;

export type GetTaskQuery = {
  taskFiles: { fileCount: number };
  task?: Maybe<
    {
      aborted: boolean;
      activatedBy?: Maybe<string>;
      ingestTime?: Maybe<Date>;
      estimatedStart?: Maybe<number>;
      finishTime?: Maybe<Date>;
      hostId?: Maybe<string>;
      requester: string;
      projectId: string;
      patchNumber?: Maybe<number>;
      canOverrideDependencies: boolean;
      startTime?: Maybe<Date>;
      timeTaken?: Maybe<number>;
      version: string;
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
      expectedDuration?: Maybe<number>;
      canModifyAnnotation: boolean;
      abortInfo?: Maybe<{
        user: string;
        taskDisplayName: string;
        taskID: string;
        buildVariantDisplayName: string;
        newVersion: string;
        prClosed: boolean;
      }>;
      baseTask?: Maybe<{
        id: string;
        execution: number;
        timeTaken?: Maybe<number>;
      }>;
      executionTasksFull?: Maybe<
        Array<{
          displayName: string;
          id: string;
          execution: number;
          status: string;
          baseStatus?: Maybe<string>;
          buildVariant: string;
          buildVariantDisplayName?: Maybe<string>;
        }>
      >;
      baseTaskMetadata?: Maybe<{ baseTaskDuration?: Maybe<number> }>;
      displayTask?: Maybe<{
        id: string;
        execution: number;
        displayName: string;
      }>;
      versionMetadata: {
        id: string;
        author: string;
        isPatch: boolean;
        revision: string;
        project: string;
      };
      project?: Maybe<{ identifier: string }>;
      dependsOn?: Maybe<
        Array<{
          buildVariant: string;
          metStatus: MetStatus;
          name: string;
          requiredStatus: RequiredStatus;
          taskId: string;
        }>
      >;
      logs: {
        allLogLink?: Maybe<string>;
        agentLogLink?: Maybe<string>;
        systemLogLink?: Maybe<string>;
        taskLogLink?: Maybe<string>;
        eventLogLink?: Maybe<string>;
      };
      details?: Maybe<{
        status: string;
        type: string;
        description?: Maybe<string>;
        timedOut?: Maybe<boolean>;
        timeoutType?: Maybe<string>;
        oomTracker: { detected: boolean; pids?: Maybe<Array<Maybe<number>>> };
      }>;
      annotation?: Maybe<AnnotationFragment>;
    } & BaseTaskFragment
  >;
};

export type GetTestsQueryVariables = Exact<{
  execution?: Maybe<Scalars["Int"]>;
  groupId?: Maybe<Scalars["String"]>;
  taskId: Scalars["String"];
  pageNum?: Maybe<Scalars["Int"]>;
  limitNum?: Maybe<Scalars["Int"]>;
  testName?: Maybe<Scalars["String"]>;
}>;

export type GetTestsQuery = {
  taskTests: {
    filteredTestCount: number;
    testResults: Array<{
      id: string;
      testFile: string;
      logs: { url?: Maybe<string>; urlLobster?: Maybe<string> };
    }>;
  };
};

export type GetUndispatchedTasksQueryVariables = Exact<{
  versionId: Scalars["String"];
}>;

export type GetUndispatchedTasksQuery = {
  patchTasks: {
    tasks: Array<{
      id: string;
      execution: number;
      displayName: string;
      buildVariant: string;
      buildVariantDisplayName?: Maybe<string>;
    }>;
  };
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

export type GetUserPermissionsQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserPermissionsQuery = {
  user: { userId: string; permissions: { canCreateProject: boolean } };
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

export type VersionQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type VersionQuery = {
  version: {
    id: string;
    createTime: Date;
    startTime?: Maybe<Date>;
    finishTime?: Maybe<Date>;
    revision: string;
    author: string;
    status: string;
    order: number;
    repo: string;
    project: string;
    activated?: Maybe<boolean>;
    message: string;
    isPatch: boolean;
    taskCount?: Maybe<number>;
    baseVersionID?: Maybe<string>;
    projectIdentifier: string;
    versionTiming?: Maybe<{
      makespan?: Maybe<number>;
      timeTaken?: Maybe<number>;
    }>;
    parameters: Array<{ key: string; value: string }>;
    manifest?: Maybe<{
      id: string;
      revision: string;
      project: string;
      branch: string;
      isBase: boolean;
      moduleOverrides?: Maybe<{ [key: string]: any }>;
      modules?: Maybe<any>;
    }>;
    patch?: Maybe<{
      id: string;
      patchNumber: number;
      alias?: Maybe<string>;
      commitQueuePosition?: Maybe<number>;
      canEnqueueToCommitQueue: boolean;
      childPatches?: Maybe<
        Array<{
          baseVersionID?: Maybe<string>;
          githash: string;
          id: string;
          projectIdentifier: string;
          taskCount?: Maybe<number>;
          status: string;
        }>
      >;
    }>;
  };
};

export type GetViewableProjectRefsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetViewableProjectRefsQuery = {
  viewableProjectRefs: Array<
    Maybe<{ projects: Array<{ identifier: string }> }>
  >;
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
  task?: Maybe<
    {
      canSync: boolean;
      project?: Maybe<{ spawnHostScriptPath: string }>;
    } & BaseTaskFragment
  >;
};

export type SubnetAvailabilityZonesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type SubnetAvailabilityZonesQuery = {
  subnetAvailabilityZones: Array<string>;
};

export type TaskQueueDistrosQueryVariables = Exact<{ [key: string]: never }>;

export type TaskQueueDistrosQuery = {
  taskQueueDistros: Array<{ id: string; taskCount: number; hostCount: number }>;
};

export type UserPatchesQueryVariables = Exact<{
  userId: Scalars["String"];
  patchesInput: PatchesInput;
}>;

export type UserPatchesQuery = {
  user: { userId: string; patches: PatchesPagePatchesFragment };
};
