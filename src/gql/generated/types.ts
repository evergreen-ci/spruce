export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Duration: number;
  Map: any;
  StringMap: { [key: string]: any };
  Time: Date;
};

export type AwsConfig = {
  __typename?: "AWSConfig";
  maxVolumeSizePerUser?: Maybe<Scalars["Int"]>;
};

export type AbortInfo = {
  __typename?: "AbortInfo";
  buildVariantDisplayName: Scalars["String"];
  newVersion: Scalars["String"];
  prClosed: Scalars["Boolean"];
  taskDisplayName: Scalars["String"];
  taskID: Scalars["String"];
  user: Scalars["String"];
};

/**
 * Annotation models the metadata that a user can add to a task.
 * It is used as a field within the Task type.
 */
export type Annotation = {
  __typename?: "Annotation";
  createdIssues?: Maybe<Array<Maybe<IssueLink>>>;
  id: Scalars["String"];
  issues?: Maybe<Array<Maybe<IssueLink>>>;
  note?: Maybe<Note>;
  suspectedIssues?: Maybe<Array<Maybe<IssueLink>>>;
  taskExecution: Scalars["Int"];
  taskId: Scalars["String"];
  webhookConfigured: Scalars["Boolean"];
};

export type Build = {
  __typename?: "Build";
  actualMakespan: Scalars["Duration"];
  buildVariant: Scalars["String"];
  id: Scalars["String"];
  predictedMakespan: Scalars["Duration"];
  status: Scalars["String"];
};

/**
 * Build Baron is a service that can be integrated into a project (see Confluence Wiki for more details).
 * This type is returned from the buildBaron query, and contains information about Build Baron configurations and suggested
 * tickets from JIRA for a given task on a given execution.
 */
export type BuildBaron = {
  __typename?: "BuildBaron";
  bbTicketCreationDefined: Scalars["Boolean"];
  buildBaronConfigured: Scalars["Boolean"];
  searchReturnInfo?: Maybe<SearchReturnInfo>;
};

export type BuildBaronSettings = {
  __typename?: "BuildBaronSettings";
  bfSuggestionFeaturesURL?: Maybe<Scalars["String"]>;
  bfSuggestionPassword?: Maybe<Scalars["String"]>;
  bfSuggestionServer?: Maybe<Scalars["String"]>;
  bfSuggestionTimeoutSecs?: Maybe<Scalars["Int"]>;
  bfSuggestionUsername?: Maybe<Scalars["String"]>;
  ticketCreateProject: Scalars["String"];
  ticketSearchProjects?: Maybe<Array<Scalars["String"]>>;
};

export type BuildBaronSettingsInput = {
  bfSuggestionFeaturesURL?: InputMaybe<Scalars["String"]>;
  bfSuggestionPassword?: InputMaybe<Scalars["String"]>;
  bfSuggestionServer?: InputMaybe<Scalars["String"]>;
  bfSuggestionTimeoutSecs?: InputMaybe<Scalars["Int"]>;
  bfSuggestionUsername?: InputMaybe<Scalars["String"]>;
  ticketCreateProject: Scalars["String"];
  ticketSearchProjects?: InputMaybe<Array<Scalars["String"]>>;
};

/**
 * BuildVariantOptions is an input to the mainlineCommits query.
 * It stores values for statuses, tasks, and variants which are used to filter for matching versions.
 */
export type BuildVariantOptions = {
  includeBaseTasks?: InputMaybe<Scalars["Boolean"]>;
  statuses?: InputMaybe<Array<Scalars["String"]>>;
  tasks?: InputMaybe<Array<Scalars["String"]>>;
  variants?: InputMaybe<Array<Scalars["String"]>>;
};

export type BuildVariantTuple = {
  __typename?: "BuildVariantTuple";
  buildVariant: Scalars["String"];
  displayName: Scalars["String"];
};

export type ChildPatchAlias = {
  __typename?: "ChildPatchAlias";
  alias: Scalars["String"];
  patchId: Scalars["String"];
};

export type ClientBinary = {
  __typename?: "ClientBinary";
  arch?: Maybe<Scalars["String"]>;
  displayName?: Maybe<Scalars["String"]>;
  os?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
};

/**
 * ClientConfig stores information about the binaries for the Evergreen Command-Line Client that are available for
 * download on Evergreen.
 */
export type ClientConfig = {
  __typename?: "ClientConfig";
  clientBinaries?: Maybe<Array<ClientBinary>>;
  latestRevision?: Maybe<Scalars["String"]>;
};

export type CloudProviderConfig = {
  __typename?: "CloudProviderConfig";
  aws?: Maybe<AwsConfig>;
};

/**
 * CommitQueue is returned by the commitQueue query.
 * It contains information about the patches on the commit queue (e.g. author, code changes) for a given project.
 */
export type CommitQueue = {
  __typename?: "CommitQueue";
  message?: Maybe<Scalars["String"]>;
  owner?: Maybe<Scalars["String"]>;
  projectId?: Maybe<Scalars["String"]>;
  queue?: Maybe<Array<CommitQueueItem>>;
  repo?: Maybe<Scalars["String"]>;
};

export type CommitQueueItem = {
  __typename?: "CommitQueueItem";
  enqueueTime?: Maybe<Scalars["Time"]>;
  issue?: Maybe<Scalars["String"]>;
  modules?: Maybe<Array<Module>>;
  patch?: Maybe<Patch>;
  source?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type CommitQueueParams = {
  __typename?: "CommitQueueParams";
  enabled?: Maybe<Scalars["Boolean"]>;
  mergeMethod: Scalars["String"];
  message: Scalars["String"];
  requireSigned?: Maybe<Scalars["Boolean"]>;
  requiredApprovalCount?: Maybe<Scalars["Int"]>;
};

export type CommitQueueParamsInput = {
  enabled?: InputMaybe<Scalars["Boolean"]>;
  mergeMethod?: InputMaybe<Scalars["String"]>;
  message?: InputMaybe<Scalars["String"]>;
  requireSigned?: InputMaybe<Scalars["Boolean"]>;
  requiredApprovalCount?: InputMaybe<Scalars["Int"]>;
};

export type ContainerResources = {
  __typename?: "ContainerResources";
  cpu: Scalars["Int"];
  memoryMb: Scalars["Int"];
  name: Scalars["String"];
};

export type ContainerResourcesInput = {
  cpu: Scalars["Int"];
  memoryMb: Scalars["Int"];
  name: Scalars["String"];
};

/**
 * CopyProjectInput is the input to the copyProject mutation.
 * It contains information about a project to be duplicated.
 */
export type CopyProjectInput = {
  newProjectId?: InputMaybe<Scalars["String"]>;
  newProjectIdentifier: Scalars["String"];
  projectIdToCopy: Scalars["String"];
};

/**
 * CreateProjectInput is the input to the createProject mutation.
 * It contains information about a new project to be created.
 */
export type CreateProjectInput = {
  id?: InputMaybe<Scalars["String"]>;
  identifier: Scalars["String"];
  owner: Scalars["String"];
  repo: Scalars["String"];
  repoRefId?: InputMaybe<Scalars["String"]>;
};

export type Dependency = {
  __typename?: "Dependency";
  buildVariant: Scalars["String"];
  metStatus: MetStatus;
  name: Scalars["String"];
  requiredStatus: RequiredStatus;
  taskId: Scalars["String"];
};

export type DisplayTask = {
  ExecTasks: Array<Scalars["String"]>;
  Name: Scalars["String"];
};

/**
 * Distro[] is the return value for the distros query.
 * It models an environment configuration for a host.
 */
export type Distro = {
  __typename?: "Distro";
  isVirtualWorkStation: Scalars["Boolean"];
  name?: Maybe<Scalars["String"]>;
  user?: Maybe<Scalars["String"]>;
  userSpawnAllowed?: Maybe<Scalars["Boolean"]>;
  workDir?: Maybe<Scalars["String"]>;
};

export type DistroInfo = {
  __typename?: "DistroInfo";
  bootstrapMethod?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
  isVirtualWorkStation?: Maybe<Scalars["Boolean"]>;
  isWindows?: Maybe<Scalars["Boolean"]>;
  user?: Maybe<Scalars["String"]>;
  workDir?: Maybe<Scalars["String"]>;
};

/**
 * EditSpawnHostInput is the input to the editSpawnHost mutation.
 * Its fields determine how a given host will be modified.
 */
export type EditSpawnHostInput = {
  addedInstanceTags?: InputMaybe<Array<InstanceTagInput>>;
  deletedInstanceTags?: InputMaybe<Array<InstanceTagInput>>;
  displayName?: InputMaybe<Scalars["String"]>;
  expiration?: InputMaybe<Scalars["Time"]>;
  hostId: Scalars["String"];
  instanceType?: InputMaybe<Scalars["String"]>;
  noExpiration?: InputMaybe<Scalars["Boolean"]>;
  publicKey?: InputMaybe<PublicKeyInput>;
  savePublicKey?: InputMaybe<Scalars["Boolean"]>;
  servicePassword?: InputMaybe<Scalars["String"]>;
  volume?: InputMaybe<Scalars["String"]>;
};

export type File = {
  __typename?: "File";
  link: Scalars["String"];
  name: Scalars["String"];
  visibility: Scalars["String"];
};

export type FileDiff = {
  __typename?: "FileDiff";
  additions: Scalars["Int"];
  deletions: Scalars["Int"];
  description: Scalars["String"];
  diffLink: Scalars["String"];
  fileName: Scalars["String"];
};

export type GithubCheckSubscriber = {
  __typename?: "GithubCheckSubscriber";
  owner: Scalars["String"];
  ref: Scalars["String"];
  repo: Scalars["String"];
};

export type GithubPrSubscriber = {
  __typename?: "GithubPRSubscriber";
  owner: Scalars["String"];
  prNumber?: Maybe<Scalars["Int"]>;
  ref: Scalars["String"];
  repo: Scalars["String"];
};

/**
 * GithubProjectConflicts is the return value for the githubProjectConflicts query.
 * Its contains information about potential conflicts in the commit checks, the commit queue, and PR testing.
 */
export type GithubProjectConflicts = {
  __typename?: "GithubProjectConflicts";
  commitCheckIdentifiers?: Maybe<Array<Scalars["String"]>>;
  commitQueueIdentifiers?: Maybe<Array<Scalars["String"]>>;
  prTestingIdentifiers?: Maybe<Array<Scalars["String"]>>;
};

export type GithubUser = {
  __typename?: "GithubUser";
  lastKnownAs?: Maybe<Scalars["String"]>;
  uid?: Maybe<Scalars["Int"]>;
};

export type GithubUserInput = {
  lastKnownAs?: InputMaybe<Scalars["String"]>;
};

export type GroupedBuildVariant = {
  __typename?: "GroupedBuildVariant";
  displayName: Scalars["String"];
  tasks?: Maybe<Array<Maybe<Task>>>;
  variant: Scalars["String"];
};

export type GroupedFiles = {
  __typename?: "GroupedFiles";
  files?: Maybe<Array<File>>;
  taskName?: Maybe<Scalars["String"]>;
};

/**
 * GroupedProjects is the return value for the projects & viewableProjectRefs queries.
 * It contains an array of projects which are grouped under a groupDisplayName.
 */
export type GroupedProjects = {
  __typename?: "GroupedProjects";
  groupDisplayName: Scalars["String"];
  projects: Array<Project>;
  repo?: Maybe<RepoRef>;
};

export type GroupedTaskStatusCount = {
  __typename?: "GroupedTaskStatusCount";
  displayName: Scalars["String"];
  statusCounts: Array<StatusCount>;
  variant: Scalars["String"];
};

/** Host models a host, which are used for things like running tasks or as virtual workstations. */
export type Host = {
  __typename?: "Host";
  ami?: Maybe<Scalars["String"]>;
  availabilityZone?: Maybe<Scalars["String"]>;
  displayName?: Maybe<Scalars["String"]>;
  distro?: Maybe<DistroInfo>;
  distroId?: Maybe<Scalars["String"]>;
  elapsed?: Maybe<Scalars["Time"]>;
  expiration?: Maybe<Scalars["Time"]>;
  homeVolume?: Maybe<Volume>;
  homeVolumeID?: Maybe<Scalars["String"]>;
  hostUrl: Scalars["String"];
  id: Scalars["ID"];
  instanceTags: Array<InstanceTag>;
  instanceType?: Maybe<Scalars["String"]>;
  lastCommunicationTime?: Maybe<Scalars["Time"]>;
  noExpiration: Scalars["Boolean"];
  provider: Scalars["String"];
  runningTask?: Maybe<TaskInfo>;
  startedBy: Scalars["String"];
  status: Scalars["String"];
  tag: Scalars["String"];
  totalIdleTime?: Maybe<Scalars["Duration"]>;
  uptime?: Maybe<Scalars["Time"]>;
  user?: Maybe<Scalars["String"]>;
  volumes: Array<Volume>;
};

export type HostEventLogData = {
  __typename?: "HostEventLogData";
  agentBuild: Scalars["String"];
  agentRevision: Scalars["String"];
  duration: Scalars["Duration"];
  execution: Scalars["String"];
  hostname: Scalars["String"];
  jasperRevision: Scalars["String"];
  logs: Scalars["String"];
  monitorOp: Scalars["String"];
  newStatus: Scalars["String"];
  oldStatus: Scalars["String"];
  provisioningMethod: Scalars["String"];
  successful: Scalars["Boolean"];
  taskId: Scalars["String"];
  taskPid: Scalars["String"];
  taskStatus: Scalars["String"];
  user: Scalars["String"];
};

export type HostEventLogEntry = {
  __typename?: "HostEventLogEntry";
  data: HostEventLogData;
  eventType?: Maybe<Scalars["String"]>;
  id: Scalars["String"];
  processedAt: Scalars["Time"];
  resourceId: Scalars["String"];
  resourceType: Scalars["String"];
  timestamp?: Maybe<Scalars["Time"]>;
};

/**
 * HostEvents is the return value for the hostEvents query.
 * It contains the event log entries for a given host.
 */
export type HostEvents = {
  __typename?: "HostEvents";
  count: Scalars["Int"];
  eventLogEntries: Array<HostEventLogEntry>;
};

export enum HostSortBy {
  CurrentTask = "CURRENT_TASK",
  Distro = "DISTRO",
  Elapsed = "ELAPSED",
  Id = "ID",
  IdleTime = "IDLE_TIME",
  Owner = "OWNER",
  Status = "STATUS",
  Uptime = "UPTIME",
}

/**
 * HostsResponse is the return value for the hosts query.
 * It contains an array of Hosts matching the filter conditions, as well as some count information.
 */
export type HostsResponse = {
  __typename?: "HostsResponse";
  filteredHostsCount?: Maybe<Scalars["Int"]>;
  hosts: Array<Host>;
  totalHostsCount: Scalars["Int"];
};

export type InstanceTag = {
  __typename?: "InstanceTag";
  canBeModified: Scalars["Boolean"];
  key: Scalars["String"];
  value: Scalars["String"];
};

export type InstanceTagInput = {
  key: Scalars["String"];
  value: Scalars["String"];
};

export type IssueLink = {
  __typename?: "IssueLink";
  confidenceScore?: Maybe<Scalars["Float"]>;
  issueKey?: Maybe<Scalars["String"]>;
  jiraTicket?: Maybe<JiraTicket>;
  source?: Maybe<Source>;
  url?: Maybe<Scalars["String"]>;
};

/** IssueLinkInput is an input parameter to the annotation mutations. */
export type IssueLinkInput = {
  confidenceScore?: InputMaybe<Scalars["Float"]>;
  issueKey: Scalars["String"];
  url: Scalars["String"];
};

export type JiraConfig = {
  __typename?: "JiraConfig";
  host?: Maybe<Scalars["String"]>;
};

export type JiraField = {
  __typename?: "JiraField";
  displayText: Scalars["String"];
  field: Scalars["String"];
};

export type JiraFieldInput = {
  displayText: Scalars["String"];
  field: Scalars["String"];
};

export type JiraIssueSubscriber = {
  __typename?: "JiraIssueSubscriber";
  issueType: Scalars["String"];
  project: Scalars["String"];
};

export type JiraIssueSubscriberInput = {
  issueType: Scalars["String"];
  project: Scalars["String"];
};

export type JiraStatus = {
  __typename?: "JiraStatus";
  id: Scalars["String"];
  name: Scalars["String"];
};

export type JiraTicket = {
  __typename?: "JiraTicket";
  fields: TicketFields;
  key: Scalars["String"];
};

export type LogMessage = {
  __typename?: "LogMessage";
  message?: Maybe<Scalars["String"]>;
  severity?: Maybe<Scalars["String"]>;
  timestamp?: Maybe<Scalars["Time"]>;
  type?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["Int"]>;
};

export type LogkeeperBuild = {
  __typename?: "LogkeeperBuild";
  buildNum: Scalars["Int"];
  builder: Scalars["String"];
  id: Scalars["String"];
  taskExecution: Scalars["Int"];
  taskId: Scalars["String"];
  tests: Array<LogkeeperTest>;
};

export type LogkeeperTest = {
  __typename?: "LogkeeperTest";
  buildId: Scalars["String"];
  command: Scalars["String"];
  id: Scalars["String"];
  name: Scalars["String"];
  phase: Scalars["String"];
  taskExecution: Scalars["Int"];
  taskId: Scalars["String"];
};

export type MainlineCommitVersion = {
  __typename?: "MainlineCommitVersion";
  rolledUpVersions?: Maybe<Array<Version>>;
  version?: Maybe<Version>;
};

/**
 * MainlineCommits is returned by the mainline commits query.
 * It contains information about versions (both unactivated and activated) which is surfaced on the Project Health page.
 */
export type MainlineCommits = {
  __typename?: "MainlineCommits";
  nextPageOrderNumber?: Maybe<Scalars["Int"]>;
  prevPageOrderNumber?: Maybe<Scalars["Int"]>;
  versions: Array<MainlineCommitVersion>;
};

/**
 * MainlineCommitsOptions is an input to the mainlineCommits query.
 * Its fields determine what mainline commits we fetch for a given projectID.
 */
export type MainlineCommitsOptions = {
  limit?: InputMaybe<Scalars["Int"]>;
  projectIdentifier: Scalars["String"];
  requesters?: InputMaybe<Array<Scalars["String"]>>;
  shouldCollapse?: InputMaybe<Scalars["Boolean"]>;
  skipOrderNumber?: InputMaybe<Scalars["Int"]>;
};

export type Manifest = {
  __typename?: "Manifest";
  branch: Scalars["String"];
  id: Scalars["String"];
  isBase: Scalars["Boolean"];
  moduleOverrides?: Maybe<Scalars["StringMap"]>;
  modules?: Maybe<Scalars["Map"]>;
  project: Scalars["String"];
  revision: Scalars["String"];
};

export enum MetStatus {
  Met = "MET",
  Pending = "PENDING",
  Started = "STARTED",
  Unmet = "UNMET",
}

export type Module = {
  __typename?: "Module";
  issue?: Maybe<Scalars["String"]>;
  module?: Maybe<Scalars["String"]>;
};

export type ModuleCodeChange = {
  __typename?: "ModuleCodeChange";
  branchName: Scalars["String"];
  fileDiffs: Array<FileDiff>;
  htmlLink: Scalars["String"];
  rawLink: Scalars["String"];
};

/**
 * MoveProjectInput is the input to the attachProjectToNewRepo mutation.
 * It contains information used to move a project to a a new owner and repo.
 */
export type MoveProjectInput = {
  newOwner: Scalars["String"];
  newRepo: Scalars["String"];
  projectId: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  abortTask: Task;
  addAnnotationIssue: Scalars["Boolean"];
  addFavoriteProject: Project;
  attachProjectToNewRepo: Project;
  attachProjectToRepo: Project;
  attachVolumeToHost: Scalars["Boolean"];
  bbCreateTicket: Scalars["Boolean"];
  clearMySubscriptions: Scalars["Int"];
  copyProject: Project;
  createProject: Project;
  createPublicKey: Array<PublicKey>;
  deactivateStepbackTask: Scalars["Boolean"];
  defaultSectionToRepo?: Maybe<Scalars["String"]>;
  detachProjectFromRepo: Project;
  detachVolumeFromHost: Scalars["Boolean"];
  editAnnotationNote: Scalars["Boolean"];
  editSpawnHost: Host;
  enqueuePatch: Patch;
  forceRepotrackerRun: Scalars["Boolean"];
  migrateVolume: Scalars["Boolean"];
  moveAnnotationIssue: Scalars["Boolean"];
  overrideTaskDependencies: Task;
  promoteVarsToRepo: Scalars["Boolean"];
  removeAnnotationIssue: Scalars["Boolean"];
  removeFavoriteProject: Project;
  removeItemFromCommitQueue?: Maybe<Scalars["String"]>;
  removePublicKey: Array<PublicKey>;
  removeVolume: Scalars["Boolean"];
  reprovisionToNew: Scalars["Int"];
  restartJasper: Scalars["Int"];
  restartTask: Task;
  restartVersions?: Maybe<Array<Version>>;
  saveProjectSettingsForSection: ProjectSettings;
  saveRepoSettingsForSection: RepoSettings;
  saveSubscription: Scalars["Boolean"];
  schedulePatch: Patch;
  schedulePatchTasks?: Maybe<Scalars["String"]>;
  scheduleTasks: Array<Task>;
  scheduleUndispatchedBaseTasks?: Maybe<Array<Task>>;
  setPatchPriority?: Maybe<Scalars["String"]>;
  setTaskPriority: Task;
  spawnHost: Host;
  spawnVolume: Scalars["Boolean"];
  unschedulePatchTasks?: Maybe<Scalars["String"]>;
  unscheduleTask: Task;
  updateHostStatus: Scalars["Int"];
  updatePublicKey: Array<PublicKey>;
  updateSpawnHostStatus: Host;
  updateUserSettings: Scalars["Boolean"];
  updateVolume: Scalars["Boolean"];
};

export type MutationAbortTaskArgs = {
  taskId: Scalars["String"];
};

export type MutationAddAnnotationIssueArgs = {
  apiIssue: IssueLinkInput;
  execution: Scalars["Int"];
  isIssue: Scalars["Boolean"];
  taskId: Scalars["String"];
};

export type MutationAddFavoriteProjectArgs = {
  identifier: Scalars["String"];
};

export type MutationAttachProjectToNewRepoArgs = {
  project: MoveProjectInput;
};

export type MutationAttachProjectToRepoArgs = {
  projectId: Scalars["String"];
};

export type MutationAttachVolumeToHostArgs = {
  volumeAndHost: VolumeHost;
};

export type MutationBbCreateTicketArgs = {
  execution?: InputMaybe<Scalars["Int"]>;
  taskId: Scalars["String"];
};

export type MutationCopyProjectArgs = {
  project: CopyProjectInput;
  requestS3Creds?: InputMaybe<Scalars["Boolean"]>;
};

export type MutationCreateProjectArgs = {
  project: CreateProjectInput;
  requestS3Creds?: InputMaybe<Scalars["Boolean"]>;
};

export type MutationCreatePublicKeyArgs = {
  publicKeyInput: PublicKeyInput;
};

export type MutationDeactivateStepbackTaskArgs = {
  buildVariantName: Scalars["String"];
  projectId: Scalars["String"];
  taskName: Scalars["String"];
};

export type MutationDefaultSectionToRepoArgs = {
  projectId: Scalars["String"];
  section: ProjectSettingsSection;
};

export type MutationDetachProjectFromRepoArgs = {
  projectId: Scalars["String"];
};

export type MutationDetachVolumeFromHostArgs = {
  volumeId: Scalars["String"];
};

export type MutationEditAnnotationNoteArgs = {
  execution: Scalars["Int"];
  newMessage: Scalars["String"];
  originalMessage: Scalars["String"];
  taskId: Scalars["String"];
};

export type MutationEditSpawnHostArgs = {
  spawnHost?: InputMaybe<EditSpawnHostInput>;
};

export type MutationEnqueuePatchArgs = {
  commitMessage?: InputMaybe<Scalars["String"]>;
  patchId: Scalars["String"];
};

export type MutationForceRepotrackerRunArgs = {
  projectId: Scalars["String"];
};

export type MutationMigrateVolumeArgs = {
  spawnHostInput?: InputMaybe<SpawnHostInput>;
  volumeId: Scalars["String"];
};

export type MutationMoveAnnotationIssueArgs = {
  apiIssue: IssueLinkInput;
  execution: Scalars["Int"];
  isIssue: Scalars["Boolean"];
  taskId: Scalars["String"];
};

export type MutationOverrideTaskDependenciesArgs = {
  taskId: Scalars["String"];
};

export type MutationPromoteVarsToRepoArgs = {
  projectId: Scalars["String"];
  varNames: Array<Scalars["String"]>;
};

export type MutationRemoveAnnotationIssueArgs = {
  apiIssue: IssueLinkInput;
  execution: Scalars["Int"];
  isIssue: Scalars["Boolean"];
  taskId: Scalars["String"];
};

export type MutationRemoveFavoriteProjectArgs = {
  identifier: Scalars["String"];
};

export type MutationRemoveItemFromCommitQueueArgs = {
  commitQueueId: Scalars["String"];
  issue: Scalars["String"];
};

export type MutationRemovePublicKeyArgs = {
  keyName: Scalars["String"];
};

export type MutationRemoveVolumeArgs = {
  volumeId: Scalars["String"];
};

export type MutationReprovisionToNewArgs = {
  hostIds: Array<Scalars["String"]>;
};

export type MutationRestartJasperArgs = {
  hostIds: Array<Scalars["String"]>;
};

export type MutationRestartTaskArgs = {
  failedOnly: Scalars["Boolean"];
  taskId: Scalars["String"];
};

export type MutationRestartVersionsArgs = {
  abort: Scalars["Boolean"];
  versionId: Scalars["String"];
  versionsToRestart: Array<VersionToRestart>;
};

export type MutationSaveProjectSettingsForSectionArgs = {
  projectSettings?: InputMaybe<ProjectSettingsInput>;
  section: ProjectSettingsSection;
};

export type MutationSaveRepoSettingsForSectionArgs = {
  repoSettings?: InputMaybe<RepoSettingsInput>;
  section: ProjectSettingsSection;
};

export type MutationSaveSubscriptionArgs = {
  subscription: SubscriptionInput;
};

export type MutationSchedulePatchArgs = {
  configure: PatchConfigure;
  patchId: Scalars["String"];
};

export type MutationSchedulePatchTasksArgs = {
  patchId: Scalars["String"];
};

export type MutationScheduleTasksArgs = {
  taskIds: Array<Scalars["String"]>;
};

export type MutationScheduleUndispatchedBaseTasksArgs = {
  patchId: Scalars["String"];
};

export type MutationSetPatchPriorityArgs = {
  patchId: Scalars["String"];
  priority: Scalars["Int"];
};

export type MutationSetTaskPriorityArgs = {
  priority: Scalars["Int"];
  taskId: Scalars["String"];
};

export type MutationSpawnHostArgs = {
  spawnHostInput?: InputMaybe<SpawnHostInput>;
};

export type MutationSpawnVolumeArgs = {
  spawnVolumeInput: SpawnVolumeInput;
};

export type MutationUnschedulePatchTasksArgs = {
  abort: Scalars["Boolean"];
  patchId: Scalars["String"];
};

export type MutationUnscheduleTaskArgs = {
  taskId: Scalars["String"];
};

export type MutationUpdateHostStatusArgs = {
  hostIds: Array<Scalars["String"]>;
  notes?: InputMaybe<Scalars["String"]>;
  status: Scalars["String"];
};

export type MutationUpdatePublicKeyArgs = {
  targetKeyName: Scalars["String"];
  updateInfo: PublicKeyInput;
};

export type MutationUpdateSpawnHostStatusArgs = {
  action: SpawnHostStatusActions;
  hostId: Scalars["String"];
};

export type MutationUpdateUserSettingsArgs = {
  userSettings?: InputMaybe<UserSettingsInput>;
};

export type MutationUpdateVolumeArgs = {
  updateVolumeInput: UpdateVolumeInput;
};

export type Note = {
  __typename?: "Note";
  message: Scalars["String"];
  source: Source;
};

export type Notifications = {
  __typename?: "Notifications";
  buildBreak?: Maybe<Scalars["String"]>;
  commitQueue?: Maybe<Scalars["String"]>;
  patchFinish?: Maybe<Scalars["String"]>;
  patchFirstFailure?: Maybe<Scalars["String"]>;
  spawnHostExpiration?: Maybe<Scalars["String"]>;
  spawnHostOutcome?: Maybe<Scalars["String"]>;
};

export type NotificationsInput = {
  buildBreak?: InputMaybe<Scalars["String"]>;
  commitQueue?: InputMaybe<Scalars["String"]>;
  patchFinish?: InputMaybe<Scalars["String"]>;
  patchFirstFailure?: InputMaybe<Scalars["String"]>;
  spawnHostExpiration?: InputMaybe<Scalars["String"]>;
  spawnHostOutcome?: InputMaybe<Scalars["String"]>;
};

export type OomTrackerInfo = {
  __typename?: "OomTrackerInfo";
  detected: Scalars["Boolean"];
  pids?: Maybe<Array<Maybe<Scalars["Int"]>>>;
};

export type Parameter = {
  __typename?: "Parameter";
  key: Scalars["String"];
  value: Scalars["String"];
};

export type ParameterInput = {
  key: Scalars["String"];
  value: Scalars["String"];
};

/** Patch is a manually initiated version submitted to test local code changes. */
export type Patch = {
  __typename?: "Patch";
  activated: Scalars["Boolean"];
  alias?: Maybe<Scalars["String"]>;
  author: Scalars["String"];
  authorDisplayName: Scalars["String"];
  baseTaskStatuses: Array<Scalars["String"]>;
  builds: Array<Build>;
  canEnqueueToCommitQueue: Scalars["Boolean"];
  childPatchAliases?: Maybe<Array<ChildPatchAlias>>;
  childPatches?: Maybe<Array<Patch>>;
  commitQueuePosition?: Maybe<Scalars["Int"]>;
  createTime?: Maybe<Scalars["Time"]>;
  description: Scalars["String"];
  duration?: Maybe<PatchDuration>;
  githash: Scalars["String"];
  id: Scalars["ID"];
  moduleCodeChanges: Array<ModuleCodeChange>;
  parameters: Array<Parameter>;
  patchNumber: Scalars["Int"];
  patchTriggerAliases: Array<PatchTriggerAlias>;
  project?: Maybe<PatchProject>;
  projectID: Scalars["String"];
  projectIdentifier: Scalars["String"];
  projectMetadata?: Maybe<Project>;
  status: Scalars["String"];
  taskCount?: Maybe<Scalars["Int"]>;
  taskStatuses: Array<Scalars["String"]>;
  tasks: Array<Scalars["String"]>;
  time?: Maybe<PatchTime>;
  variants: Array<Scalars["String"]>;
  variantsTasks: Array<Maybe<VariantTask>>;
  versionFull?: Maybe<Version>;
};

/**
 * PatchConfigure is the input to the schedulePatch mutation.
 * It contains information about how a user has configured their patch (e.g. name, tasks to run, etc).
 */
export type PatchConfigure = {
  description: Scalars["String"];
  parameters?: InputMaybe<Array<InputMaybe<ParameterInput>>>;
  patchTriggerAliases?: InputMaybe<Array<Scalars["String"]>>;
  variantsTasks: Array<VariantTasks>;
};

export type PatchDuration = {
  __typename?: "PatchDuration";
  makespan?: Maybe<Scalars["String"]>;
  time?: Maybe<PatchTime>;
  timeTaken?: Maybe<Scalars["String"]>;
};

export type PatchProject = {
  __typename?: "PatchProject";
  variants: Array<ProjectBuildVariant>;
};

export type PatchTime = {
  __typename?: "PatchTime";
  finished?: Maybe<Scalars["String"]>;
  started?: Maybe<Scalars["String"]>;
  submittedAt: Scalars["String"];
};

export type PatchTriggerAlias = {
  __typename?: "PatchTriggerAlias";
  alias: Scalars["String"];
  childProjectId: Scalars["String"];
  childProjectIdentifier: Scalars["String"];
  parentAsModule?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  taskSpecifiers?: Maybe<Array<TaskSpecifier>>;
  variantsTasks: Array<VariantTask>;
};

export type PatchTriggerAliasInput = {
  alias: Scalars["String"];
  childProjectIdentifier: Scalars["String"];
  parentAsModule?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<Scalars["String"]>;
  taskSpecifiers: Array<TaskSpecifierInput>;
};

/**
 * Patches is the return value of the patches field for the User and Project types.
 * It contains an array Patches for either an individual user or a project.
 */
export type Patches = {
  __typename?: "Patches";
  filteredPatchCount: Scalars["Int"];
  patches: Array<Patch>;
};

/**
 * PatchesInput is the input value to the patches field for the User and Project types.
 * Based on the information in PatchesInput, we return a list of Patches for either an individual user or a project.
 */
export type PatchesInput = {
  includeCommitQueue?: InputMaybe<Scalars["Boolean"]>;
  limit?: Scalars["Int"];
  onlyCommitQueue?: InputMaybe<Scalars["Boolean"]>;
  page?: Scalars["Int"];
  patchName?: Scalars["String"];
  statuses?: Array<Scalars["String"]>;
};

export type PeriodicBuild = {
  __typename?: "PeriodicBuild";
  alias: Scalars["String"];
  configFile: Scalars["String"];
  id: Scalars["String"];
  intervalHours: Scalars["Int"];
  message: Scalars["String"];
  nextRunTime: Scalars["Time"];
};

export type PeriodicBuildInput = {
  alias: Scalars["String"];
  configFile: Scalars["String"];
  id: Scalars["String"];
  intervalHours: Scalars["Int"];
  message: Scalars["String"];
  nextRunTime: Scalars["Time"];
};

export type Permissions = {
  __typename?: "Permissions";
  canCreateProject: Scalars["Boolean"];
  userId: Scalars["String"];
};

export type Pod = {
  __typename?: "Pod";
  id: Scalars["String"];
  status: Scalars["String"];
  task?: Maybe<Task>;
  taskContainerCreationOpts: TaskContainerCreationOpts;
  type: Scalars["String"];
};

/** Project models single repository on GitHub. */
export type Project = {
  __typename?: "Project";
  admins?: Maybe<Array<Maybe<Scalars["String"]>>>;
  batchTime: Scalars["Int"];
  branch: Scalars["String"];
  buildBaronSettings: BuildBaronSettings;
  commitQueue: CommitQueueParams;
  containerSizeDefinitions?: Maybe<Array<ContainerResources>>;
  deactivatePrevious?: Maybe<Scalars["Boolean"]>;
  disabledStatsCache?: Maybe<Scalars["Boolean"]>;
  dispatchingDisabled?: Maybe<Scalars["Boolean"]>;
  displayName: Scalars["String"];
  enabled?: Maybe<Scalars["Boolean"]>;
  gitTagAuthorizedTeams?: Maybe<Array<Scalars["String"]>>;
  gitTagAuthorizedUsers?: Maybe<Array<Scalars["String"]>>;
  gitTagVersionsEnabled?: Maybe<Scalars["Boolean"]>;
  githubChecksEnabled?: Maybe<Scalars["Boolean"]>;
  githubTriggerAliases?: Maybe<Array<Scalars["String"]>>;
  hidden?: Maybe<Scalars["Boolean"]>;
  id: Scalars["String"];
  identifier: Scalars["String"];
  isFavorite: Scalars["Boolean"];
  manualPrTestingEnabled?: Maybe<Scalars["Boolean"]>;
  notifyOnBuildFailure?: Maybe<Scalars["Boolean"]>;
  owner: Scalars["String"];
  patchTriggerAliases?: Maybe<Array<PatchTriggerAlias>>;
  patches: Patches;
  patchingDisabled?: Maybe<Scalars["Boolean"]>;
  perfEnabled?: Maybe<Scalars["Boolean"]>;
  periodicBuilds?: Maybe<Array<PeriodicBuild>>;
  prTestingEnabled?: Maybe<Scalars["Boolean"]>;
  private?: Maybe<Scalars["Boolean"]>;
  remotePath: Scalars["String"];
  repo: Scalars["String"];
  repoRefId: Scalars["String"];
  repotrackerDisabled?: Maybe<Scalars["Boolean"]>;
  restricted?: Maybe<Scalars["Boolean"]>;
  spawnHostScriptPath: Scalars["String"];
  stepbackDisabled?: Maybe<Scalars["Boolean"]>;
  taskAnnotationSettings: TaskAnnotationSettings;
  taskSync: TaskSyncOptions;
  tracksPushEvents?: Maybe<Scalars["Boolean"]>;
  triggers?: Maybe<Array<TriggerAlias>>;
  versionControlEnabled?: Maybe<Scalars["Boolean"]>;
  workstationConfig: WorkstationConfig;
};

/** Project models single repository on GitHub. */
export type ProjectPatchesArgs = {
  patchesInput: PatchesInput;
};

export type ProjectAlias = {
  __typename?: "ProjectAlias";
  alias: Scalars["String"];
  gitTag: Scalars["String"];
  id: Scalars["String"];
  remotePath: Scalars["String"];
  task: Scalars["String"];
  taskTags: Array<Scalars["String"]>;
  variant: Scalars["String"];
  variantTags: Array<Scalars["String"]>;
};

export type ProjectAliasInput = {
  alias: Scalars["String"];
  gitTag: Scalars["String"];
  id: Scalars["String"];
  remotePath: Scalars["String"];
  task: Scalars["String"];
  taskTags: Array<Scalars["String"]>;
  variant: Scalars["String"];
  variantTags: Array<Scalars["String"]>;
};

export type ProjectBuildVariant = {
  __typename?: "ProjectBuildVariant";
  displayName: Scalars["String"];
  name: Scalars["String"];
  tasks: Array<Scalars["String"]>;
};

export type ProjectEventLogEntry = {
  __typename?: "ProjectEventLogEntry";
  after?: Maybe<ProjectEventSettings>;
  before?: Maybe<ProjectEventSettings>;
  timestamp: Scalars["Time"];
  user: Scalars["String"];
};

export type ProjectEventSettings = {
  __typename?: "ProjectEventSettings";
  aliases?: Maybe<Array<ProjectAlias>>;
  githubWebhooksEnabled: Scalars["Boolean"];
  projectRef?: Maybe<Project>;
  subscriptions?: Maybe<Array<ProjectSubscription>>;
  vars?: Maybe<ProjectVars>;
};

/**
 * ProjectEvents contains project event log entries that concern the history of changes related to project
 * settings.
 * Although RepoSettings uses RepoRef in practice to have stronger types, this can't be enforced
 * or event logs because new fields could always be introduced that don't exist in the old event logs.
 */
export type ProjectEvents = {
  __typename?: "ProjectEvents";
  count: Scalars["Int"];
  eventLogEntries: Array<ProjectEventLogEntry>;
};

export type ProjectInput = {
  admins?: InputMaybe<Array<Scalars["String"]>>;
  batchTime?: InputMaybe<Scalars["Int"]>;
  branch?: InputMaybe<Scalars["String"]>;
  buildBaronSettings?: InputMaybe<BuildBaronSettingsInput>;
  commitQueue?: InputMaybe<CommitQueueParamsInput>;
  containerSizeDefinitions?: InputMaybe<Array<ContainerResourcesInput>>;
  deactivatePrevious?: InputMaybe<Scalars["Boolean"]>;
  disabledStatsCache?: InputMaybe<Scalars["Boolean"]>;
  dispatchingDisabled?: InputMaybe<Scalars["Boolean"]>;
  displayName?: InputMaybe<Scalars["String"]>;
  enabled?: InputMaybe<Scalars["Boolean"]>;
  gitTagAuthorizedTeams?: InputMaybe<Array<Scalars["String"]>>;
  gitTagAuthorizedUsers?: InputMaybe<Array<Scalars["String"]>>;
  gitTagVersionsEnabled?: InputMaybe<Scalars["Boolean"]>;
  githubChecksEnabled?: InputMaybe<Scalars["Boolean"]>;
  githubTriggerAliases?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  id: Scalars["String"];
  identifier?: InputMaybe<Scalars["String"]>;
  manualPrTestingEnabled?: InputMaybe<Scalars["Boolean"]>;
  notifyOnBuildFailure?: InputMaybe<Scalars["Boolean"]>;
  owner?: InputMaybe<Scalars["String"]>;
  patchTriggerAliases?: InputMaybe<Array<PatchTriggerAliasInput>>;
  patchingDisabled?: InputMaybe<Scalars["Boolean"]>;
  perfEnabled?: InputMaybe<Scalars["Boolean"]>;
  periodicBuilds?: InputMaybe<Array<PeriodicBuildInput>>;
  prTestingEnabled?: InputMaybe<Scalars["Boolean"]>;
  private?: InputMaybe<Scalars["Boolean"]>;
  remotePath?: InputMaybe<Scalars["String"]>;
  repo?: InputMaybe<Scalars["String"]>;
  repotrackerDisabled?: InputMaybe<Scalars["Boolean"]>;
  restricted?: InputMaybe<Scalars["Boolean"]>;
  spawnHostScriptPath?: InputMaybe<Scalars["String"]>;
  stepbackDisabled?: InputMaybe<Scalars["Boolean"]>;
  taskAnnotationSettings?: InputMaybe<TaskAnnotationSettingsInput>;
  taskSync?: InputMaybe<TaskSyncOptionsInput>;
  tracksPushEvents?: InputMaybe<Scalars["Boolean"]>;
  triggers?: InputMaybe<Array<TriggerAliasInput>>;
  versionControlEnabled?: InputMaybe<Scalars["Boolean"]>;
  workstationConfig?: InputMaybe<WorkstationConfigInput>;
};

/** ProjectSettings models the settings for a given Project. */
export type ProjectSettings = {
  __typename?: "ProjectSettings";
  aliases?: Maybe<Array<ProjectAlias>>;
  githubWebhooksEnabled: Scalars["Boolean"];
  projectRef?: Maybe<Project>;
  subscriptions?: Maybe<Array<ProjectSubscription>>;
  vars?: Maybe<ProjectVars>;
};

export enum ProjectSettingsAccess {
  Edit = "EDIT",
  View = "VIEW",
}

/**
 * ProjectSettingsInput is the input to the saveProjectSettingsForSection mutation.
 * It contains information about project settings (e.g. Build Baron configurations, subscriptions, etc) and is used to
 * update the settings for a given project.
 */
export type ProjectSettingsInput = {
  aliases?: InputMaybe<Array<ProjectAliasInput>>;
  githubWebhooksEnabled?: InputMaybe<Scalars["Boolean"]>;
  projectRef?: InputMaybe<ProjectInput>;
  subscriptions?: InputMaybe<Array<SubscriptionInput>>;
  vars?: InputMaybe<ProjectVarsInput>;
};

export enum ProjectSettingsSection {
  Access = "ACCESS",
  Containers = "CONTAINERS",
  General = "GENERAL",
  GithubAndCommitQueue = "GITHUB_AND_COMMIT_QUEUE",
  Notifications = "NOTIFICATIONS",
  PatchAliases = "PATCH_ALIASES",
  PeriodicBuilds = "PERIODIC_BUILDS",
  Plugins = "PLUGINS",
  Triggers = "TRIGGERS",
  Variables = "VARIABLES",
  Workstation = "WORKSTATION",
}

/**
 * ProjectSubscriber defines the subscriptions for a given Project. For example, a project could have Slack notifications
 * enabled that trigger whenever any version finishes.
 */
export type ProjectSubscriber = {
  __typename?: "ProjectSubscriber";
  subscriber: Subscriber;
  type: Scalars["String"];
};

export type ProjectSubscription = {
  __typename?: "ProjectSubscription";
  id: Scalars["String"];
  ownerType: Scalars["String"];
  regexSelectors: Array<Selector>;
  resourceType: Scalars["String"];
  selectors: Array<Selector>;
  subscriber?: Maybe<ProjectSubscriber>;
  trigger: Scalars["String"];
  triggerData?: Maybe<Scalars["StringMap"]>;
};

export type ProjectVars = {
  __typename?: "ProjectVars";
  adminOnlyVars: Array<Scalars["String"]>;
  privateVars: Array<Scalars["String"]>;
  vars?: Maybe<Scalars["StringMap"]>;
};

export type ProjectVarsInput = {
  adminOnlyVarsList?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  privateVarsList?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  vars?: InputMaybe<Scalars["StringMap"]>;
};

/** PublicKey models a public key. Users can save/modify/delete their public keys. */
export type PublicKey = {
  __typename?: "PublicKey";
  key: Scalars["String"];
  name: Scalars["String"];
};

/** PublicKeyInput is an input to the createPublicKey and updatePublicKey mutations. */
export type PublicKeyInput = {
  key: Scalars["String"];
  name: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  awsRegions?: Maybe<Array<Scalars["String"]>>;
  bbGetCreatedTickets: Array<JiraTicket>;
  buildBaron: BuildBaron;
  buildVariantsForTaskName?: Maybe<Array<Maybe<BuildVariantTuple>>>;
  clientConfig?: Maybe<ClientConfig>;
  commitQueue: CommitQueue;
  distroTaskQueue: Array<TaskQueueItem>;
  distros: Array<Maybe<Distro>>;
  githubProjectConflicts: GithubProjectConflicts;
  hasVersion: Scalars["Boolean"];
  host?: Maybe<Host>;
  hostEvents: HostEvents;
  hosts: HostsResponse;
  instanceTypes: Array<Scalars["String"]>;
  logkeeperBuildMetadata: LogkeeperBuild;
  mainlineCommits?: Maybe<MainlineCommits>;
  myHosts: Array<Host>;
  myPublicKeys: Array<PublicKey>;
  myVolumes: Array<Volume>;
  patch: Patch;
  pod: Pod;
  project: Project;
  projectEvents: ProjectEvents;
  projectSettings: ProjectSettings;
  projects: Array<Maybe<GroupedProjects>>;
  repoEvents: ProjectEvents;
  repoSettings: RepoSettings;
  spruceConfig?: Maybe<SpruceConfig>;
  subnetAvailabilityZones: Array<Scalars["String"]>;
  task?: Maybe<Task>;
  taskAllExecutions: Array<Task>;
  /** @deprecated Use task.taskLogs instead */
  taskLogs: TaskLogs;
  taskNamesForBuildVariant?: Maybe<Array<Scalars["String"]>>;
  taskQueueDistros: Array<TaskQueueDistro>;
  taskTestSample?: Maybe<Array<TaskTestResultSample>>;
  taskTests: TaskTestResult;
  user: User;
  userConfig?: Maybe<UserConfig>;
  userSettings?: Maybe<UserSettings>;
  version: Version;
  viewableProjectRefs: Array<Maybe<GroupedProjects>>;
};

export type QueryBbGetCreatedTicketsArgs = {
  taskId: Scalars["String"];
};

export type QueryBuildBaronArgs = {
  execution: Scalars["Int"];
  taskId: Scalars["String"];
};

export type QueryBuildVariantsForTaskNameArgs = {
  projectIdentifier: Scalars["String"];
  taskName: Scalars["String"];
};

export type QueryCommitQueueArgs = {
  projectIdentifier: Scalars["String"];
};

export type QueryDistroTaskQueueArgs = {
  distroId: Scalars["String"];
};

export type QueryDistrosArgs = {
  onlySpawnable: Scalars["Boolean"];
};

export type QueryGithubProjectConflictsArgs = {
  projectId: Scalars["String"];
};

export type QueryHasVersionArgs = {
  id: Scalars["String"];
};

export type QueryHostArgs = {
  hostId: Scalars["String"];
};

export type QueryHostEventsArgs = {
  hostId: Scalars["String"];
  hostTag?: InputMaybe<Scalars["String"]>;
  limit?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
};

export type QueryHostsArgs = {
  currentTaskId?: InputMaybe<Scalars["String"]>;
  distroId?: InputMaybe<Scalars["String"]>;
  hostId?: InputMaybe<Scalars["String"]>;
  limit?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
  sortBy?: InputMaybe<HostSortBy>;
  sortDir?: InputMaybe<SortDirection>;
  startedBy?: InputMaybe<Scalars["String"]>;
  statuses?: InputMaybe<Array<Scalars["String"]>>;
};

export type QueryLogkeeperBuildMetadataArgs = {
  buildId: Scalars["String"];
};

export type QueryMainlineCommitsArgs = {
  buildVariantOptions?: InputMaybe<BuildVariantOptions>;
  options: MainlineCommitsOptions;
};

export type QueryPatchArgs = {
  id: Scalars["String"];
};

export type QueryPodArgs = {
  podId: Scalars["String"];
};

export type QueryProjectArgs = {
  projectIdentifier: Scalars["String"];
};

export type QueryProjectEventsArgs = {
  before?: InputMaybe<Scalars["Time"]>;
  identifier: Scalars["String"];
  limit?: InputMaybe<Scalars["Int"]>;
};

export type QueryProjectSettingsArgs = {
  identifier: Scalars["String"];
};

export type QueryRepoEventsArgs = {
  before?: InputMaybe<Scalars["Time"]>;
  id: Scalars["String"];
  limit?: InputMaybe<Scalars["Int"]>;
};

export type QueryRepoSettingsArgs = {
  id: Scalars["String"];
};

export type QueryTaskArgs = {
  execution?: InputMaybe<Scalars["Int"]>;
  taskId: Scalars["String"];
};

export type QueryTaskAllExecutionsArgs = {
  taskId: Scalars["String"];
};

export type QueryTaskLogsArgs = {
  execution?: InputMaybe<Scalars["Int"]>;
  taskId: Scalars["String"];
};

export type QueryTaskNamesForBuildVariantArgs = {
  buildVariant: Scalars["String"];
  projectIdentifier: Scalars["String"];
};

export type QueryTaskTestSampleArgs = {
  filters: Array<TestFilter>;
  tasks: Array<Scalars["String"]>;
};

export type QueryTaskTestsArgs = {
  execution?: InputMaybe<Scalars["Int"]>;
  groupId?: InputMaybe<Scalars["String"]>;
  limit?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
  sortCategory?: InputMaybe<TestSortCategory>;
  sortDirection?: InputMaybe<SortDirection>;
  statuses?: Array<Scalars["String"]>;
  taskId: Scalars["String"];
  testName?: InputMaybe<Scalars["String"]>;
};

export type QueryUserArgs = {
  userId?: InputMaybe<Scalars["String"]>;
};

export type QueryVersionArgs = {
  id: Scalars["String"];
};

export type RepoCommitQueueParams = {
  __typename?: "RepoCommitQueueParams";
  enabled: Scalars["Boolean"];
  mergeMethod: Scalars["String"];
  message: Scalars["String"];
  requireSigned: Scalars["Boolean"];
  requiredApprovalCount: Scalars["Int"];
};

/**
 * RepoRef is technically a special kind of Project.
 * Repo types have booleans defaulted, which is why it is necessary to redeclare the types despite them matching nearly
 * exactly.
 */
export type RepoRef = {
  __typename?: "RepoRef";
  admins: Array<Scalars["String"]>;
  batchTime: Scalars["Int"];
  branch: Scalars["String"];
  buildBaronSettings: BuildBaronSettings;
  commitQueue: RepoCommitQueueParams;
  containerSizeDefinitions?: Maybe<Array<ContainerResources>>;
  deactivatePrevious: Scalars["Boolean"];
  disabledStatsCache: Scalars["Boolean"];
  dispatchingDisabled: Scalars["Boolean"];
  displayName: Scalars["String"];
  enabled: Scalars["Boolean"];
  gitTagAuthorizedTeams?: Maybe<Array<Scalars["String"]>>;
  gitTagAuthorizedUsers?: Maybe<Array<Scalars["String"]>>;
  gitTagVersionsEnabled: Scalars["Boolean"];
  githubChecksEnabled: Scalars["Boolean"];
  githubTriggerAliases?: Maybe<Array<Scalars["String"]>>;
  id: Scalars["String"];
  manualPrTestingEnabled: Scalars["Boolean"];
  notifyOnBuildFailure: Scalars["Boolean"];
  owner: Scalars["String"];
  patchTriggerAliases?: Maybe<Array<PatchTriggerAlias>>;
  patchingDisabled: Scalars["Boolean"];
  perfEnabled: Scalars["Boolean"];
  periodicBuilds?: Maybe<Array<PeriodicBuild>>;
  prTestingEnabled: Scalars["Boolean"];
  private: Scalars["Boolean"];
  remotePath: Scalars["String"];
  repo: Scalars["String"];
  repotrackerDisabled: Scalars["Boolean"];
  restricted: Scalars["Boolean"];
  spawnHostScriptPath: Scalars["String"];
  stepbackDisabled: Scalars["Boolean"];
  taskAnnotationSettings: TaskAnnotationSettings;
  taskSync: RepoTaskSyncOptions;
  tracksPushEvents: Scalars["Boolean"];
  triggers: Array<TriggerAlias>;
  versionControlEnabled: Scalars["Boolean"];
  workstationConfig: RepoWorkstationConfig;
};

export type RepoRefInput = {
  admins?: InputMaybe<Array<Scalars["String"]>>;
  batchTime?: InputMaybe<Scalars["Int"]>;
  branch?: InputMaybe<Scalars["String"]>;
  buildBaronSettings?: InputMaybe<BuildBaronSettingsInput>;
  commitQueue?: InputMaybe<CommitQueueParamsInput>;
  containerSizeDefinitions?: InputMaybe<Array<ContainerResourcesInput>>;
  deactivatePrevious?: InputMaybe<Scalars["Boolean"]>;
  disabledStatsCache?: InputMaybe<Scalars["Boolean"]>;
  dispatchingDisabled?: InputMaybe<Scalars["Boolean"]>;
  displayName?: InputMaybe<Scalars["String"]>;
  enabled?: InputMaybe<Scalars["Boolean"]>;
  gitTagAuthorizedTeams?: InputMaybe<Array<Scalars["String"]>>;
  gitTagAuthorizedUsers?: InputMaybe<Array<Scalars["String"]>>;
  gitTagVersionsEnabled?: InputMaybe<Scalars["Boolean"]>;
  githubChecksEnabled?: InputMaybe<Scalars["Boolean"]>;
  githubTriggerAliases?: InputMaybe<Array<Scalars["String"]>>;
  id: Scalars["String"];
  manualPrTestingEnabled?: InputMaybe<Scalars["Boolean"]>;
  notifyOnBuildFailure?: InputMaybe<Scalars["Boolean"]>;
  owner?: InputMaybe<Scalars["String"]>;
  patchTriggerAliases?: InputMaybe<Array<PatchTriggerAliasInput>>;
  patchingDisabled?: InputMaybe<Scalars["Boolean"]>;
  perfEnabled?: InputMaybe<Scalars["Boolean"]>;
  periodicBuilds?: InputMaybe<Array<PeriodicBuildInput>>;
  prTestingEnabled?: InputMaybe<Scalars["Boolean"]>;
  private?: InputMaybe<Scalars["Boolean"]>;
  remotePath?: InputMaybe<Scalars["String"]>;
  repo?: InputMaybe<Scalars["String"]>;
  repotrackerDisabled?: InputMaybe<Scalars["Boolean"]>;
  restricted?: InputMaybe<Scalars["Boolean"]>;
  spawnHostScriptPath?: InputMaybe<Scalars["String"]>;
  stepbackDisabled?: InputMaybe<Scalars["Boolean"]>;
  taskAnnotationSettings?: InputMaybe<TaskAnnotationSettingsInput>;
  taskSync?: InputMaybe<TaskSyncOptionsInput>;
  tracksPushEvents?: InputMaybe<Scalars["Boolean"]>;
  triggers?: InputMaybe<Array<TriggerAliasInput>>;
  versionControlEnabled?: InputMaybe<Scalars["Boolean"]>;
  workstationConfig?: InputMaybe<WorkstationConfigInput>;
};

/** RepoSettings models the settings for a given RepoRef. */
export type RepoSettings = {
  __typename?: "RepoSettings";
  aliases?: Maybe<Array<ProjectAlias>>;
  githubWebhooksEnabled: Scalars["Boolean"];
  projectRef?: Maybe<RepoRef>;
  subscriptions?: Maybe<Array<ProjectSubscription>>;
  vars?: Maybe<ProjectVars>;
};

/**
 * RepoSettingsInput is the input to the saveRepoSettingsForSection mutation.
 * It contains information about repo settings (e.g. Build Baron configurations, subscriptions, etc) and is used to
 * update the settings for a given project.
 */
export type RepoSettingsInput = {
  aliases?: InputMaybe<Array<ProjectAliasInput>>;
  githubWebhooksEnabled?: InputMaybe<Scalars["Boolean"]>;
  projectRef?: InputMaybe<RepoRefInput>;
  subscriptions?: InputMaybe<Array<SubscriptionInput>>;
  vars?: InputMaybe<ProjectVarsInput>;
};

export type RepoTaskSyncOptions = {
  __typename?: "RepoTaskSyncOptions";
  configEnabled: Scalars["Boolean"];
  patchEnabled: Scalars["Boolean"];
};

export type RepoWorkstationConfig = {
  __typename?: "RepoWorkstationConfig";
  gitClone: Scalars["Boolean"];
  setupCommands?: Maybe<Array<WorkstationSetupCommand>>;
};

export enum RequiredStatus {
  MustFail = "MUST_FAIL",
  MustFinish = "MUST_FINISH",
  MustSucceed = "MUST_SUCCEED",
}

export type SearchReturnInfo = {
  __typename?: "SearchReturnInfo";
  featuresURL: Scalars["String"];
  issues: Array<JiraTicket>;
  search: Scalars["String"];
  source: Scalars["String"];
};

export type Selector = {
  __typename?: "Selector";
  data: Scalars["String"];
  type: Scalars["String"];
};

export type SelectorInput = {
  data: Scalars["String"];
  type: Scalars["String"];
};

export type SlackConfig = {
  __typename?: "SlackConfig";
  name?: Maybe<Scalars["String"]>;
};

export enum SortDirection {
  Asc = "ASC",
  Desc = "DESC",
}

/** SortOrder[] is an input value for version.tasks. It is used to define whether to sort by ASC/DEC for a given sort key. */
export type SortOrder = {
  Direction: SortDirection;
  Key: TaskSortCategory;
};

export type Source = {
  __typename?: "Source";
  author: Scalars["String"];
  requester: Scalars["String"];
  time: Scalars["Time"];
};

export type SpawnHostConfig = {
  __typename?: "SpawnHostConfig";
  spawnHostsPerUser: Scalars["Int"];
  unexpirableHostsPerUser: Scalars["Int"];
  unexpirableVolumesPerUser: Scalars["Int"];
};

/**
 * SpawnHostInput is the input to the spawnHost mutation.
 * Its fields determine the properties of the host that will be spawned.
 */
export type SpawnHostInput = {
  distroId: Scalars["String"];
  expiration?: InputMaybe<Scalars["Time"]>;
  homeVolumeSize?: InputMaybe<Scalars["Int"]>;
  isVirtualWorkStation: Scalars["Boolean"];
  noExpiration: Scalars["Boolean"];
  publicKey: PublicKeyInput;
  region: Scalars["String"];
  savePublicKey: Scalars["Boolean"];
  setUpScript?: InputMaybe<Scalars["String"]>;
  spawnHostsStartedByTask?: InputMaybe<Scalars["Boolean"]>;
  taskId?: InputMaybe<Scalars["String"]>;
  taskSync?: InputMaybe<Scalars["Boolean"]>;
  useProjectSetupScript?: InputMaybe<Scalars["Boolean"]>;
  useTaskConfig?: InputMaybe<Scalars["Boolean"]>;
  userDataScript?: InputMaybe<Scalars["String"]>;
  volumeId?: InputMaybe<Scalars["String"]>;
};

export enum SpawnHostStatusActions {
  Start = "START",
  Stop = "STOP",
  Terminate = "TERMINATE",
}

/**
 * SpawnVolumeInput is the input to the spawnVolume mutation.
 * Its fields determine the properties of the volume that will be spawned.
 */
export type SpawnVolumeInput = {
  availabilityZone: Scalars["String"];
  expiration?: InputMaybe<Scalars["Time"]>;
  host?: InputMaybe<Scalars["String"]>;
  noExpiration?: InputMaybe<Scalars["Boolean"]>;
  size: Scalars["Int"];
  type: Scalars["String"];
};

/**
 * SpruceConfig defines settings that apply to all users of Evergreen.
 * For example, if the banner field is populated, then a sitewide banner will be shown to all users.
 */
export type SpruceConfig = {
  __typename?: "SpruceConfig";
  banner?: Maybe<Scalars["String"]>;
  bannerTheme?: Maybe<Scalars["String"]>;
  githubOrgs: Array<Scalars["String"]>;
  jira?: Maybe<JiraConfig>;
  providers?: Maybe<CloudProviderConfig>;
  slack?: Maybe<SlackConfig>;
  spawnHost: SpawnHostConfig;
  ui?: Maybe<UiConfig>;
};

export type StatusCount = {
  __typename?: "StatusCount";
  count: Scalars["Int"];
  status: Scalars["String"];
};

export type Subscriber = {
  __typename?: "Subscriber";
  emailSubscriber?: Maybe<Scalars["String"]>;
  githubCheckSubscriber?: Maybe<GithubCheckSubscriber>;
  githubPRSubscriber?: Maybe<GithubPrSubscriber>;
  jiraCommentSubscriber?: Maybe<Scalars["String"]>;
  jiraIssueSubscriber?: Maybe<JiraIssueSubscriber>;
  slackSubscriber?: Maybe<Scalars["String"]>;
  webhookSubscriber?: Maybe<WebhookSubscriber>;
};

export type SubscriberInput = {
  jiraIssueSubscriber?: InputMaybe<JiraIssueSubscriberInput>;
  target: Scalars["String"];
  type: Scalars["String"];
  webhookSubscriber?: InputMaybe<WebhookSubscriberInput>;
};

/**
 * SubscriptionInput is the input to the saveSubscription mutation.
 * It stores information about a user's subscription to a version or task. For example, a user
 * can have a subscription to send them a Slack message when a version finishes.
 */
export type SubscriptionInput = {
  id?: InputMaybe<Scalars["String"]>;
  owner?: InputMaybe<Scalars["String"]>;
  owner_type?: InputMaybe<Scalars["String"]>;
  regex_selectors: Array<SelectorInput>;
  resource_type?: InputMaybe<Scalars["String"]>;
  selectors: Array<SelectorInput>;
  subscriber: SubscriberInput;
  trigger?: InputMaybe<Scalars["String"]>;
  trigger_data: Scalars["StringMap"];
};

/** Task models a task, the simplest unit of execution for Evergreen. */
export type Task = {
  __typename?: "Task";
  abortInfo?: Maybe<AbortInfo>;
  aborted: Scalars["Boolean"];
  activated: Scalars["Boolean"];
  activatedBy?: Maybe<Scalars["String"]>;
  activatedTime?: Maybe<Scalars["Time"]>;
  ami?: Maybe<Scalars["String"]>;
  annotation?: Maybe<Annotation>;
  baseStatus?: Maybe<Scalars["String"]>;
  baseTask?: Maybe<Task>;
  blocked: Scalars["Boolean"];
  buildId: Scalars["String"];
  buildVariant: Scalars["String"];
  buildVariantDisplayName?: Maybe<Scalars["String"]>;
  canAbort: Scalars["Boolean"];
  canDisable: Scalars["Boolean"];
  canModifyAnnotation: Scalars["Boolean"];
  canOverrideDependencies: Scalars["Boolean"];
  canRestart: Scalars["Boolean"];
  canSchedule: Scalars["Boolean"];
  canSetPriority: Scalars["Boolean"];
  canSync: Scalars["Boolean"];
  canUnschedule: Scalars["Boolean"];
  containerAllocatedTime?: Maybe<Scalars["Time"]>;
  createTime?: Maybe<Scalars["Time"]>;
  dependsOn?: Maybe<Array<Dependency>>;
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
  generateTask?: Maybe<Scalars["Boolean"]>;
  generatedBy?: Maybe<Scalars["String"]>;
  generatedByName?: Maybe<Scalars["String"]>;
  hostId?: Maybe<Scalars["String"]>;
  id: Scalars["String"];
  ingestTime?: Maybe<Scalars["Time"]>;
  isPerfPluginEnabled: Scalars["Boolean"];
  latestExecution: Scalars["Int"];
  logs: TaskLogLinks;
  minQueuePosition: Scalars["Int"];
  order: Scalars["Int"];
  patch?: Maybe<Patch>;
  patchNumber?: Maybe<Scalars["Int"]>;
  pod?: Maybe<Pod>;
  priority?: Maybe<Scalars["Int"]>;
  project?: Maybe<Project>;
  projectId: Scalars["String"];
  projectIdentifier?: Maybe<Scalars["String"]>;
  requester: Scalars["String"];
  resetWhenFinished: Scalars["Boolean"];
  revision?: Maybe<Scalars["String"]>;
  scheduledTime?: Maybe<Scalars["Time"]>;
  spawnHostLink?: Maybe<Scalars["String"]>;
  startTime?: Maybe<Scalars["Time"]>;
  status: Scalars["String"];
  taskFiles: TaskFiles;
  taskGroup?: Maybe<Scalars["String"]>;
  taskGroupMaxHosts?: Maybe<Scalars["Int"]>;
  /** taskLogs returns the tail 100 lines of the task's logs. */
  taskLogs: TaskLogs;
  tests: TaskTestResult;
  timeTaken?: Maybe<Scalars["Duration"]>;
  totalTestCount: Scalars["Int"];
  versionMetadata: Version;
};

/** Task models a task, the simplest unit of execution for Evergreen. */
export type TaskTestsArgs = {
  opts?: InputMaybe<TestFilterOptions>;
};

export type TaskAnnotationSettings = {
  __typename?: "TaskAnnotationSettings";
  fileTicketWebhook: Webhook;
  jiraCustomFields?: Maybe<Array<JiraField>>;
};

export type TaskAnnotationSettingsInput = {
  fileTicketWebhook?: InputMaybe<WebhookInput>;
  jiraCustomFields?: InputMaybe<Array<JiraFieldInput>>;
};

export type TaskContainerCreationOpts = {
  __typename?: "TaskContainerCreationOpts";
  arch: Scalars["String"];
  cpu: Scalars["Int"];
  image: Scalars["String"];
  memoryMB: Scalars["Int"];
  os: Scalars["String"];
  workingDir: Scalars["String"];
};

export type TaskEndDetail = {
  __typename?: "TaskEndDetail";
  description?: Maybe<Scalars["String"]>;
  oomTracker: OomTrackerInfo;
  status: Scalars["String"];
  timedOut?: Maybe<Scalars["Boolean"]>;
  timeoutType?: Maybe<Scalars["String"]>;
  type: Scalars["String"];
};

export type TaskEventLogData = {
  __typename?: "TaskEventLogData";
  hostId?: Maybe<Scalars["String"]>;
  jiraIssue?: Maybe<Scalars["String"]>;
  jiraLink?: Maybe<Scalars["String"]>;
  priority?: Maybe<Scalars["Int"]>;
  status?: Maybe<Scalars["String"]>;
  timestamp?: Maybe<Scalars["Time"]>;
  userId?: Maybe<Scalars["String"]>;
};

export type TaskEventLogEntry = {
  __typename?: "TaskEventLogEntry";
  data: TaskEventLogData;
  eventType?: Maybe<Scalars["String"]>;
  id: Scalars["String"];
  processedAt: Scalars["Time"];
  resourceId: Scalars["String"];
  resourceType: Scalars["String"];
  timestamp?: Maybe<Scalars["Time"]>;
};

/**
 * TaskFiles is the return value for the taskFiles query.
 * Some tasks generate files which are represented by this type.
 */
export type TaskFiles = {
  __typename?: "TaskFiles";
  fileCount: Scalars["Int"];
  groupedFiles: Array<GroupedFiles>;
};

/** TaskFilterOptions defines the parameters that are used when fetching tasks from a Version. */
export type TaskFilterOptions = {
  baseStatuses?: InputMaybe<Array<Scalars["String"]>>;
  /** @deprecated Use includeNeverActivatedTasks instead */
  includeEmptyActivation?: InputMaybe<Scalars["Boolean"]>;
  includeNeverActivatedTasks?: InputMaybe<Scalars["Boolean"]>;
  limit?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
  sorts?: InputMaybe<Array<SortOrder>>;
  statuses?: InputMaybe<Array<Scalars["String"]>>;
  taskName?: InputMaybe<Scalars["String"]>;
  variant?: InputMaybe<Scalars["String"]>;
};

export type TaskInfo = {
  __typename?: "TaskInfo";
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
};

export type TaskLogLinks = {
  __typename?: "TaskLogLinks";
  agentLogLink?: Maybe<Scalars["String"]>;
  allLogLink?: Maybe<Scalars["String"]>;
  eventLogLink?: Maybe<Scalars["String"]>;
  systemLogLink?: Maybe<Scalars["String"]>;
  taskLogLink?: Maybe<Scalars["String"]>;
};

/**
 * TaskLogs is the return value for the task.taskLogs query.
 * It contains the logs for a given task on a given execution.
 */
export type TaskLogs = {
  __typename?: "TaskLogs";
  agentLogs: Array<LogMessage>;
  allLogs: Array<LogMessage>;
  defaultLogger: Scalars["String"];
  eventLogs: Array<TaskEventLogEntry>;
  execution: Scalars["Int"];
  systemLogs: Array<LogMessage>;
  taskId: Scalars["String"];
  taskLogs: Array<LogMessage>;
};

/**
 * TaskQueueDistro[] is the return value for the taskQueueDistros query.
 * It contains information about how many tasks and hosts are running on on a particular distro.
 */
export type TaskQueueDistro = {
  __typename?: "TaskQueueDistro";
  hostCount: Scalars["Int"];
  id: Scalars["ID"];
  taskCount: Scalars["Int"];
};

/**
 * TaskQueueItem[] is the return value for the distroTaskQueue query.
 * It contains information about any particular item on the task queue, such as the name of the task, the build variant of the task,
 * and how long it's expected to take to finish running.
 */
export type TaskQueueItem = {
  __typename?: "TaskQueueItem";
  buildVariant: Scalars["String"];
  displayName: Scalars["String"];
  expectedDuration: Scalars["Duration"];
  id: Scalars["ID"];
  priority: Scalars["Int"];
  project: Scalars["String"];
  requester: TaskQueueItemType;
  revision: Scalars["String"];
  version: Scalars["String"];
};

export enum TaskQueueItemType {
  Commit = "COMMIT",
  Patch = "PATCH",
}

export enum TaskSortCategory {
  BaseStatus = "BASE_STATUS",
  Duration = "DURATION",
  Name = "NAME",
  Status = "STATUS",
  Variant = "VARIANT",
}

export type TaskSpecifier = {
  __typename?: "TaskSpecifier";
  patchAlias: Scalars["String"];
  taskRegex: Scalars["String"];
  variantRegex: Scalars["String"];
};

export type TaskSpecifierInput = {
  patchAlias: Scalars["String"];
  taskRegex: Scalars["String"];
  variantRegex: Scalars["String"];
};

export type TaskStats = {
  __typename?: "TaskStats";
  counts?: Maybe<Array<StatusCount>>;
  eta?: Maybe<Scalars["Time"]>;
};

export type TaskSyncOptions = {
  __typename?: "TaskSyncOptions";
  configEnabled?: Maybe<Scalars["Boolean"]>;
  patchEnabled?: Maybe<Scalars["Boolean"]>;
};

export type TaskSyncOptionsInput = {
  configEnabled?: InputMaybe<Scalars["Boolean"]>;
  patchEnabled?: InputMaybe<Scalars["Boolean"]>;
};

/**
 * TaskTestResult is the return value for the taskTests query.
 * It contains the test results for a task. For example, if there is a task to run all unit tests, then the test results
 * could be the result of each individual unit test.
 */
export type TaskTestResult = {
  __typename?: "TaskTestResult";
  filteredTestCount: Scalars["Int"];
  testResults: Array<TestResult>;
  totalTestCount: Scalars["Int"];
};

/**
 * TaskTestResultSample is the return value for the taskTestSample query.
 * It is used to represent failing test results on the task history pages.
 */
export type TaskTestResultSample = {
  __typename?: "TaskTestResultSample";
  execution: Scalars["Int"];
  matchingFailedTestNames: Array<Scalars["String"]>;
  taskId: Scalars["String"];
  totalTestCount: Scalars["Int"];
};

/**
 * TestFilter is an input value for the taskTestSample query.
 * It's used to filter for tests with testName and status testStatus.
 */
export type TestFilter = {
  testName: Scalars["String"];
  testStatus: Scalars["String"];
};

/**
 * TestFilterOptions is an input for the task.Tests query.
 * It's used to filter, sort, and paginate test results of a task.
 */
export type TestFilterOptions = {
  groupID?: Scalars["String"];
  limit?: Scalars["Int"];
  page?: Scalars["Int"];
  sort?: InputMaybe<Array<TestSortOptions>>;
  statuses?: InputMaybe<Array<Scalars["String"]>>;
  testName?: Scalars["String"];
};

export type TestLog = {
  __typename?: "TestLog";
  lineNum?: Maybe<Scalars["Int"]>;
  url?: Maybe<Scalars["String"]>;
  /** @deprecated Use urlParsley instead */
  urlLobster?: Maybe<Scalars["String"]>;
  urlParsley?: Maybe<Scalars["String"]>;
  urlRaw?: Maybe<Scalars["String"]>;
};

export type TestResult = {
  __typename?: "TestResult";
  baseStatus?: Maybe<Scalars["String"]>;
  duration?: Maybe<Scalars["Float"]>;
  endTime?: Maybe<Scalars["Time"]>;
  execution?: Maybe<Scalars["Int"]>;
  exitCode?: Maybe<Scalars["Int"]>;
  groupID?: Maybe<Scalars["String"]>;
  id: Scalars["String"];
  logs: TestLog;
  startTime?: Maybe<Scalars["Time"]>;
  status: Scalars["String"];
  taskId?: Maybe<Scalars["String"]>;
  testFile: Scalars["String"];
};

export enum TestSortCategory {
  BaseStatus = "BASE_STATUS",
  Duration = "DURATION",
  StartTime = "START_TIME",
  Status = "STATUS",
  TestName = "TEST_NAME",
}

/**
 * TestSortOptions is an input for the task.Tests query.
 * It's used to define sort criteria for test results of a task.
 */
export type TestSortOptions = {
  direction: SortDirection;
  sortBy: TestSortCategory;
};

export type TicketFields = {
  __typename?: "TicketFields";
  assignedTeam?: Maybe<Scalars["String"]>;
  assigneeDisplayName?: Maybe<Scalars["String"]>;
  created: Scalars["String"];
  resolutionName?: Maybe<Scalars["String"]>;
  status: JiraStatus;
  summary: Scalars["String"];
  updated: Scalars["String"];
};

export type TriggerAlias = {
  __typename?: "TriggerAlias";
  alias: Scalars["String"];
  buildVariantRegex: Scalars["String"];
  configFile: Scalars["String"];
  dateCutoff?: Maybe<Scalars["Int"]>;
  level: Scalars["String"];
  project: Scalars["String"];
  status: Scalars["String"];
  taskRegex: Scalars["String"];
};

export type TriggerAliasInput = {
  alias: Scalars["String"];
  buildVariantRegex: Scalars["String"];
  configFile: Scalars["String"];
  dateCutoff?: InputMaybe<Scalars["Int"]>;
  level: Scalars["String"];
  project: Scalars["String"];
  status: Scalars["String"];
  taskRegex: Scalars["String"];
};

export type UiConfig = {
  __typename?: "UIConfig";
  defaultProject: Scalars["String"];
  userVoice?: Maybe<Scalars["String"]>;
};

/**
 * UpdateVolumeInput is the input to the updateVolume mutation.
 * Its fields determine how a given volume will be modified.
 */
export type UpdateVolumeInput = {
  expiration?: InputMaybe<Scalars["Time"]>;
  name?: InputMaybe<Scalars["String"]>;
  noExpiration?: InputMaybe<Scalars["Boolean"]>;
  volumeId: Scalars["String"];
};

export type UpstreamProject = {
  __typename?: "UpstreamProject";
  owner: Scalars["String"];
  project: Scalars["String"];
  repo: Scalars["String"];
  resourceID: Scalars["String"];
  revision: Scalars["String"];
  task?: Maybe<Task>;
  triggerID: Scalars["String"];
  triggerType: Scalars["String"];
  version?: Maybe<Version>;
};

export type UseSpruceOptions = {
  __typename?: "UseSpruceOptions";
  hasUsedMainlineCommitsBefore?: Maybe<Scalars["Boolean"]>;
  hasUsedSpruceBefore?: Maybe<Scalars["Boolean"]>;
  spruceV1?: Maybe<Scalars["Boolean"]>;
};

export type UseSpruceOptionsInput = {
  hasUsedMainlineCommitsBefore?: InputMaybe<Scalars["Boolean"]>;
  hasUsedSpruceBefore?: InputMaybe<Scalars["Boolean"]>;
  spruceV1?: InputMaybe<Scalars["Boolean"]>;
};

/**
 * User is returned by the user query.
 * It contains information about a user's id, name, email, and permissions.
 */
export type User = {
  __typename?: "User";
  displayName: Scalars["String"];
  emailAddress: Scalars["String"];
  patches: Patches;
  permissions: Permissions;
  userId: Scalars["String"];
};

/**
 * User is returned by the user query.
 * It contains information about a user's id, name, email, and permissions.
 */
export type UserPatchesArgs = {
  patchesInput: PatchesInput;
};

/**
 * UserConfig is returned by the userConfig query.
 * It contains configuration information such as the user's api key for the Evergreen CLI and a user's
 * preferred UI (legacy vs Spruce).
 */
export type UserConfig = {
  __typename?: "UserConfig";
  api_key: Scalars["String"];
  api_server_host: Scalars["String"];
  ui_server_host: Scalars["String"];
  user: Scalars["String"];
};

/**
 * UserSettings is returned by the userSettings query.
 * It contains information about a user's settings, such as their GitHub username or timezone.
 */
export type UserSettings = {
  __typename?: "UserSettings";
  dateFormat?: Maybe<Scalars["String"]>;
  githubUser?: Maybe<GithubUser>;
  notifications?: Maybe<Notifications>;
  region?: Maybe<Scalars["String"]>;
  slackMemberId?: Maybe<Scalars["String"]>;
  slackUsername?: Maybe<Scalars["String"]>;
  timezone?: Maybe<Scalars["String"]>;
  useSpruceOptions?: Maybe<UseSpruceOptions>;
};

/**
 * UserSettingsInput is the input to the updateUserSettings mutation.
 * It is used to update user information such as GitHub or Slack username.
 */
export type UserSettingsInput = {
  dateFormat?: InputMaybe<Scalars["String"]>;
  githubUser?: InputMaybe<GithubUserInput>;
  notifications?: InputMaybe<NotificationsInput>;
  region?: InputMaybe<Scalars["String"]>;
  slackMemberId?: InputMaybe<Scalars["String"]>;
  slackUsername?: InputMaybe<Scalars["String"]>;
  timezone?: InputMaybe<Scalars["String"]>;
  useSpruceOptions?: InputMaybe<UseSpruceOptionsInput>;
};

export type VariantTask = {
  __typename?: "VariantTask";
  name: Scalars["String"];
  tasks: Array<Scalars["String"]>;
};

export type VariantTasks = {
  displayTasks: Array<DisplayTask>;
  tasks: Array<Scalars["String"]>;
  variant: Scalars["String"];
};

/** Version models a commit within a project. */
export type Version = {
  __typename?: "Version";
  activated?: Maybe<Scalars["Boolean"]>;
  author: Scalars["String"];
  baseTaskStatuses: Array<Scalars["String"]>;
  baseVersion?: Maybe<Version>;
  branch: Scalars["String"];
  buildVariantStats?: Maybe<Array<GroupedTaskStatusCount>>;
  buildVariants?: Maybe<Array<Maybe<GroupedBuildVariant>>>;
  childVersions?: Maybe<Array<Maybe<Version>>>;
  createTime: Scalars["Time"];
  errors: Array<Scalars["String"]>;
  finishTime?: Maybe<Scalars["Time"]>;
  id: Scalars["String"];
  isPatch: Scalars["Boolean"];
  manifest?: Maybe<Manifest>;
  message: Scalars["String"];
  order: Scalars["Int"];
  parameters: Array<Parameter>;
  patch?: Maybe<Patch>;
  previousVersion?: Maybe<Version>;
  project: Scalars["String"];
  projectIdentifier: Scalars["String"];
  projectMetadata?: Maybe<Project>;
  repo: Scalars["String"];
  requester: Scalars["String"];
  revision: Scalars["String"];
  startTime?: Maybe<Scalars["Time"]>;
  status: Scalars["String"];
  taskCount?: Maybe<Scalars["Int"]>;
  taskStatusStats?: Maybe<TaskStats>;
  taskStatuses: Array<Scalars["String"]>;
  tasks: VersionTasks;
  upstreamProject?: Maybe<UpstreamProject>;
  versionTiming?: Maybe<VersionTiming>;
  warnings: Array<Scalars["String"]>;
};

/** Version models a commit within a project. */
export type VersionBuildVariantStatsArgs = {
  options: BuildVariantOptions;
};

/** Version models a commit within a project. */
export type VersionBuildVariantsArgs = {
  options: BuildVariantOptions;
};

/** Version models a commit within a project. */
export type VersionTaskStatusStatsArgs = {
  options: BuildVariantOptions;
};

/** Version models a commit within a project. */
export type VersionTasksArgs = {
  options: TaskFilterOptions;
};

export type VersionTasks = {
  __typename?: "VersionTasks";
  count: Scalars["Int"];
  data: Array<Task>;
};

export type VersionTiming = {
  __typename?: "VersionTiming";
  makespan?: Maybe<Scalars["Duration"]>;
  timeTaken?: Maybe<Scalars["Duration"]>;
};

/**
 * VersionToRestart is the input to the restartVersions mutation.
 * It contains an array of taskIds to restart for a given versionId.
 */
export type VersionToRestart = {
  taskIds: Array<Scalars["String"]>;
  versionId: Scalars["String"];
};

export type Volume = {
  __typename?: "Volume";
  availabilityZone: Scalars["String"];
  createdBy: Scalars["String"];
  creationTime?: Maybe<Scalars["Time"]>;
  deviceName?: Maybe<Scalars["String"]>;
  displayName: Scalars["String"];
  expiration?: Maybe<Scalars["Time"]>;
  homeVolume: Scalars["Boolean"];
  host?: Maybe<Host>;
  hostID: Scalars["String"];
  id: Scalars["String"];
  migrating: Scalars["Boolean"];
  noExpiration: Scalars["Boolean"];
  size: Scalars["Int"];
  type: Scalars["String"];
};

/**
 * VolumeHost is the input to the attachVolumeToHost mutation.
 * Its fields are used to attach the volume with volumeId to the host with hostId.
 */
export type VolumeHost = {
  hostId: Scalars["String"];
  volumeId: Scalars["String"];
};

export type Webhook = {
  __typename?: "Webhook";
  endpoint: Scalars["String"];
  secret: Scalars["String"];
};

export type WebhookHeader = {
  __typename?: "WebhookHeader";
  key: Scalars["String"];
  value: Scalars["String"];
};

export type WebhookHeaderInput = {
  key: Scalars["String"];
  value: Scalars["String"];
};

export type WebhookInput = {
  endpoint: Scalars["String"];
  secret: Scalars["String"];
};

export type WebhookSubscriber = {
  __typename?: "WebhookSubscriber";
  headers: Array<Maybe<WebhookHeader>>;
  secret: Scalars["String"];
  url: Scalars["String"];
};

export type WebhookSubscriberInput = {
  headers: Array<InputMaybe<WebhookHeaderInput>>;
  secret: Scalars["String"];
  url: Scalars["String"];
};

export type WorkstationConfig = {
  __typename?: "WorkstationConfig";
  gitClone?: Maybe<Scalars["Boolean"]>;
  setupCommands?: Maybe<Array<WorkstationSetupCommand>>;
};

export type WorkstationConfigInput = {
  gitClone?: InputMaybe<Scalars["Boolean"]>;
  setupCommands?: InputMaybe<Array<WorkstationSetupCommandInput>>;
};

export type WorkstationSetupCommand = {
  __typename?: "WorkstationSetupCommand";
  command: Scalars["String"];
  directory: Scalars["String"];
};

export type WorkstationSetupCommandInput = {
  command: Scalars["String"];
  directory?: InputMaybe<Scalars["String"]>;
};

export type AnnotationFragment = {
  __typename?: "Annotation";
  id: string;
  taskId: string;
  taskExecution: number;
  webhookConfigured: boolean;
  note?: Maybe<{
    __typename?: "Note";
    message: string;
    source: {
      __typename?: "Source";
      author: string;
      time: Date;
      requester: string;
    };
  }>;
  issues?: Maybe<
    Array<
      Maybe<{
        __typename?: "IssueLink";
        issueKey?: Maybe<string>;
        url?: Maybe<string>;
        source?: Maybe<{
          __typename?: "Source";
          author: string;
          time: Date;
          requester: string;
        }>;
      }>
    >
  >;
  suspectedIssues?: Maybe<
    Array<
      Maybe<{
        __typename?: "IssueLink";
        issueKey?: Maybe<string>;
        url?: Maybe<string>;
        source?: Maybe<{
          __typename?: "Source";
          author: string;
          time: Date;
          requester: string;
        }>;
      }>
    >
  >;
  createdIssues?: Maybe<
    Array<
      Maybe<{
        __typename?: "IssueLink";
        issueKey?: Maybe<string>;
        url?: Maybe<string>;
        source?: Maybe<{
          __typename?: "Source";
          author: string;
          time: Date;
          requester: string;
        }>;
      }>
    >
  >;
};

export type IssueLinkFragment = {
  __typename?: "IssueLink";
  issueKey?: Maybe<string>;
  url?: Maybe<string>;
  confidenceScore?: Maybe<number>;
  source?: Maybe<{
    __typename?: "Source";
    author: string;
    time: Date;
    requester: string;
  }>;
  jiraTicket?: Maybe<{
    __typename?: "JiraTicket";
    key: string;
    fields: {
      __typename?: "TicketFields";
      summary: string;
      assigneeDisplayName?: Maybe<string>;
      resolutionName?: Maybe<string>;
      created: string;
      updated: string;
      assignedTeam?: Maybe<string>;
      status: { __typename?: "JiraStatus"; id: string; name: string };
    };
  }>;
};

export type JiraTicketFragment = {
  __typename?: "JiraTicket";
  key: string;
  fields: {
    __typename?: "TicketFields";
    summary: string;
    assigneeDisplayName?: Maybe<string>;
    resolutionName?: Maybe<string>;
    created: string;
    updated: string;
    assignedTeam?: Maybe<string>;
    status: { __typename?: "JiraStatus"; id: string; name: string };
  };
};

export type BaseHostFragment = {
  __typename?: "Host";
  id: string;
  hostUrl: string;
  status: string;
  startedBy: string;
  user?: Maybe<string>;
  tag: string;
  provider: string;
  uptime?: Maybe<Date>;
};

export type BasePatchFragment = {
  __typename?: "Patch";
  id: string;
  description: string;
  author: string;
  status: string;
  activated: boolean;
  alias?: Maybe<string>;
  commitQueuePosition?: Maybe<number>;
  variantsTasks: Array<
    Maybe<{ __typename?: "VariantTask"; name: string; tasks: Array<string> }>
  >;
  parameters: Array<{ __typename?: "Parameter"; key: string; value: string }>;
};

export type BaseSpawnHostFragment = {
  __typename?: "Host";
  availabilityZone?: Maybe<string>;
  displayName?: Maybe<string>;
  expiration?: Maybe<Date>;
  homeVolumeID?: Maybe<string>;
  instanceType?: Maybe<string>;
  noExpiration: boolean;
  id: string;
  hostUrl: string;
  status: string;
  startedBy: string;
  user?: Maybe<string>;
  tag: string;
  provider: string;
  uptime?: Maybe<Date>;
  distro?: Maybe<{
    __typename?: "DistroInfo";
    isVirtualWorkStation?: Maybe<boolean>;
    id?: Maybe<string>;
    user?: Maybe<string>;
    workDir?: Maybe<string>;
    isWindows?: Maybe<boolean>;
  }>;
  homeVolume?: Maybe<{ __typename?: "Volume"; displayName: string }>;
  instanceTags: Array<{
    __typename?: "InstanceTag";
    key: string;
    value: string;
    canBeModified: boolean;
  }>;
  volumes: Array<{
    __typename?: "Volume";
    displayName: string;
    id: string;
    migrating: boolean;
  }>;
};

export type BaseTaskFragment = {
  __typename?: "Task";
  id: string;
  execution: number;
  buildVariant: string;
  displayName: string;
  revision?: Maybe<string>;
  status: string;
};

export type FileDiffsFragment = {
  __typename?: "FileDiff";
  fileName: string;
  additions: number;
  deletions: number;
  diffLink: string;
  description: string;
};

export type LogMessageFragment = {
  __typename?: "LogMessage";
  severity?: Maybe<string>;
  message?: Maybe<string>;
  timestamp?: Maybe<Date>;
};

export type ModuleCodeChangeFragment = {
  __typename?: "ModuleCodeChange";
  rawLink: string;
  branchName: string;
  htmlLink: string;
  fileDiffs: Array<{
    __typename?: "FileDiff";
    fileName: string;
    additions: number;
    deletions: number;
    diffLink: string;
    description: string;
  }>;
};

export type PatchesPagePatchesFragment = {
  __typename?: "Patches";
  filteredPatchCount: number;
  patches: Array<{
    __typename?: "Patch";
    id: string;
    author: string;
    authorDisplayName: string;
    projectIdentifier: string;
    description: string;
    status: string;
    createTime?: Maybe<Date>;
    commitQueuePosition?: Maybe<number>;
    canEnqueueToCommitQueue: boolean;
    projectMetadata?: Maybe<{
      __typename?: "Project";
      owner: string;
      repo: string;
    }>;
    versionFull?: Maybe<{
      __typename?: "Version";
      id: string;
      status: string;
      taskStatusStats?: Maybe<{
        __typename?: "TaskStats";
        counts?: Maybe<
          Array<{ __typename?: "StatusCount"; status: string; count: number }>
        >;
      }>;
    }>;
  }>;
};

export type ProjectFragment = {
  __typename?: "Project";
  identifier: string;
  repo: string;
  owner: string;
  displayName: string;
};

export type ProjectAccessSettingsFragment = {
  __typename?: "Project";
  private?: Maybe<boolean>;
  restricted?: Maybe<boolean>;
  admins?: Maybe<Array<Maybe<string>>>;
};

export type RepoAccessSettingsFragment = {
  __typename?: "RepoRef";
  private: boolean;
  restricted: boolean;
  admins: Array<string>;
};

export type AliasFragment = {
  __typename?: "ProjectAlias";
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
  __typename?: "Project";
  enabled?: Maybe<boolean>;
  owner: string;
  repo: string;
  branch: string;
  displayName: string;
  batchTime: number;
  remotePath: string;
  spawnHostScriptPath: string;
  dispatchingDisabled?: Maybe<boolean>;
  versionControlEnabled?: Maybe<boolean>;
  deactivatePrevious?: Maybe<boolean>;
  repotrackerDisabled?: Maybe<boolean>;
  stepbackDisabled?: Maybe<boolean>;
  patchingDisabled?: Maybe<boolean>;
  disabledStatsCache?: Maybe<boolean>;
  taskSync: {
    __typename?: "TaskSyncOptions";
    configEnabled?: Maybe<boolean>;
    patchEnabled?: Maybe<boolean>;
  };
};

export type RepoGeneralSettingsFragment = {
  __typename?: "RepoRef";
  owner: string;
  repo: string;
  branch: string;
  displayName: string;
  batchTime: number;
  remotePath: string;
  spawnHostScriptPath: string;
  dispatchingDisabled: boolean;
  versionControlEnabled: boolean;
  deactivatePrevious: boolean;
  repotrackerDisabled: boolean;
  stepbackDisabled: boolean;
  patchingDisabled: boolean;
  disabledStatsCache: boolean;
  taskSync: {
    __typename?: "RepoTaskSyncOptions";
    configEnabled: boolean;
    patchEnabled: boolean;
  };
};

export type ProjectGithubSettingsFragment = {
  __typename?: "Project";
  prTestingEnabled?: Maybe<boolean>;
  manualPrTestingEnabled?: Maybe<boolean>;
  githubChecksEnabled?: Maybe<boolean>;
  githubTriggerAliases?: Maybe<Array<string>>;
  gitTagVersionsEnabled?: Maybe<boolean>;
  gitTagAuthorizedUsers?: Maybe<Array<string>>;
  gitTagAuthorizedTeams?: Maybe<Array<string>>;
  commitQueue: {
    __typename?: "CommitQueueParams";
    enabled?: Maybe<boolean>;
    requireSigned?: Maybe<boolean>;
    requiredApprovalCount?: Maybe<number>;
    mergeMethod: string;
    message: string;
  };
};

export type RepoGithubSettingsFragment = {
  __typename?: "RepoRef";
  prTestingEnabled: boolean;
  manualPrTestingEnabled: boolean;
  githubChecksEnabled: boolean;
  githubTriggerAliases?: Maybe<Array<string>>;
  gitTagVersionsEnabled: boolean;
  gitTagAuthorizedUsers?: Maybe<Array<string>>;
  gitTagAuthorizedTeams?: Maybe<Array<string>>;
  commitQueue: {
    __typename?: "RepoCommitQueueParams";
    enabled: boolean;
    requireSigned: boolean;
    requiredApprovalCount: number;
    mergeMethod: string;
    message: string;
  };
};

export type ProjectGithubCommitQueueFragment = {
  __typename?: "ProjectSettings";
  githubWebhooksEnabled: boolean;
  projectRef?: Maybe<{
    __typename?: "Project";
    prTestingEnabled?: Maybe<boolean>;
    manualPrTestingEnabled?: Maybe<boolean>;
    githubChecksEnabled?: Maybe<boolean>;
    githubTriggerAliases?: Maybe<Array<string>>;
    gitTagVersionsEnabled?: Maybe<boolean>;
    gitTagAuthorizedUsers?: Maybe<Array<string>>;
    gitTagAuthorizedTeams?: Maybe<Array<string>>;
    commitQueue: {
      __typename?: "CommitQueueParams";
      enabled?: Maybe<boolean>;
      requireSigned?: Maybe<boolean>;
      requiredApprovalCount?: Maybe<number>;
      mergeMethod: string;
      message: string;
    };
  }>;
};

export type RepoGithubCommitQueueFragment = {
  __typename?: "RepoSettings";
  githubWebhooksEnabled: boolean;
  projectRef?: Maybe<{
    __typename?: "RepoRef";
    prTestingEnabled: boolean;
    manualPrTestingEnabled: boolean;
    githubChecksEnabled: boolean;
    githubTriggerAliases?: Maybe<Array<string>>;
    gitTagVersionsEnabled: boolean;
    gitTagAuthorizedUsers?: Maybe<Array<string>>;
    gitTagAuthorizedTeams?: Maybe<Array<string>>;
    commitQueue: {
      __typename?: "RepoCommitQueueParams";
      enabled: boolean;
      requireSigned: boolean;
      requiredApprovalCount: number;
      mergeMethod: string;
      message: string;
    };
  }>;
};

export type ProjectEventGithubCommitQueueFragment = {
  __typename?: "ProjectEventSettings";
  githubWebhooksEnabled: boolean;
  projectRef?: Maybe<{
    __typename?: "Project";
    prTestingEnabled?: Maybe<boolean>;
    manualPrTestingEnabled?: Maybe<boolean>;
    githubChecksEnabled?: Maybe<boolean>;
    githubTriggerAliases?: Maybe<Array<string>>;
    gitTagVersionsEnabled?: Maybe<boolean>;
    gitTagAuthorizedUsers?: Maybe<Array<string>>;
    gitTagAuthorizedTeams?: Maybe<Array<string>>;
    commitQueue: {
      __typename?: "CommitQueueParams";
      enabled?: Maybe<boolean>;
      requireSigned?: Maybe<boolean>;
      requiredApprovalCount?: Maybe<number>;
      mergeMethod: string;
      message: string;
    };
  }>;
};

export type ProjectSettingsFragment = {
  __typename?: "ProjectSettings";
  githubWebhooksEnabled: boolean;
  projectRef?: Maybe<{
    __typename?: "Project";
    id: string;
    identifier: string;
    repoRefId: string;
    enabled?: Maybe<boolean>;
    owner: string;
    repo: string;
    branch: string;
    displayName: string;
    batchTime: number;
    remotePath: string;
    spawnHostScriptPath: string;
    dispatchingDisabled?: Maybe<boolean>;
    versionControlEnabled?: Maybe<boolean>;
    deactivatePrevious?: Maybe<boolean>;
    repotrackerDisabled?: Maybe<boolean>;
    stepbackDisabled?: Maybe<boolean>;
    patchingDisabled?: Maybe<boolean>;
    disabledStatsCache?: Maybe<boolean>;
    private?: Maybe<boolean>;
    restricted?: Maybe<boolean>;
    admins?: Maybe<Array<Maybe<string>>>;
    perfEnabled?: Maybe<boolean>;
    notifyOnBuildFailure?: Maybe<boolean>;
    githubTriggerAliases?: Maybe<Array<string>>;
    prTestingEnabled?: Maybe<boolean>;
    manualPrTestingEnabled?: Maybe<boolean>;
    githubChecksEnabled?: Maybe<boolean>;
    gitTagVersionsEnabled?: Maybe<boolean>;
    gitTagAuthorizedUsers?: Maybe<Array<string>>;
    gitTagAuthorizedTeams?: Maybe<Array<string>>;
    taskSync: {
      __typename?: "TaskSyncOptions";
      configEnabled?: Maybe<boolean>;
      patchEnabled?: Maybe<boolean>;
    };
    buildBaronSettings: {
      __typename?: "BuildBaronSettings";
      ticketCreateProject: string;
      ticketSearchProjects?: Maybe<Array<string>>;
    };
    taskAnnotationSettings: {
      __typename?: "TaskAnnotationSettings";
      jiraCustomFields?: Maybe<
        Array<{ __typename?: "JiraField"; field: string; displayText: string }>
      >;
      fileTicketWebhook: {
        __typename?: "Webhook";
        endpoint: string;
        secret: string;
      };
    };
    patchTriggerAliases?: Maybe<
      Array<{
        __typename?: "PatchTriggerAlias";
        alias: string;
        childProjectIdentifier: string;
        status?: Maybe<string>;
        parentAsModule?: Maybe<string>;
        taskSpecifiers?: Maybe<
          Array<{
            __typename?: "TaskSpecifier";
            patchAlias: string;
            taskRegex: string;
            variantRegex: string;
          }>
        >;
      }>
    >;
    workstationConfig: {
      __typename?: "WorkstationConfig";
      gitClone?: Maybe<boolean>;
      setupCommands?: Maybe<
        Array<{
          __typename?: "WorkstationSetupCommand";
          command: string;
          directory: string;
        }>
      >;
    };
    triggers?: Maybe<
      Array<{
        __typename?: "TriggerAlias";
        project: string;
        level: string;
        buildVariantRegex: string;
        taskRegex: string;
        status: string;
        dateCutoff?: Maybe<number>;
        configFile: string;
        alias: string;
      }>
    >;
    periodicBuilds?: Maybe<
      Array<{
        __typename?: "PeriodicBuild";
        id: string;
        configFile: string;
        intervalHours: number;
        alias: string;
        message: string;
        nextRunTime: Date;
      }>
    >;
    commitQueue: {
      __typename?: "CommitQueueParams";
      enabled?: Maybe<boolean>;
      requireSigned?: Maybe<boolean>;
      requiredApprovalCount?: Maybe<number>;
      mergeMethod: string;
      message: string;
    };
  }>;
  subscriptions?: Maybe<
    Array<{
      __typename?: "ProjectSubscription";
      id: string;
      resourceType: string;
      trigger: string;
      ownerType: string;
      triggerData?: Maybe<{ [key: string]: any }>;
      selectors: Array<{ __typename?: "Selector"; type: string; data: string }>;
      regexSelectors: Array<{
        __typename?: "Selector";
        type: string;
        data: string;
      }>;
      subscriber?: Maybe<{
        __typename?: "ProjectSubscriber";
        type: string;
        subscriber: {
          __typename?: "Subscriber";
          jiraCommentSubscriber?: Maybe<string>;
          emailSubscriber?: Maybe<string>;
          slackSubscriber?: Maybe<string>;
          githubPRSubscriber?: Maybe<{
            __typename?: "GithubPRSubscriber";
            owner: string;
            repo: string;
            ref: string;
            prNumber?: Maybe<number>;
          }>;
          githubCheckSubscriber?: Maybe<{
            __typename?: "GithubCheckSubscriber";
            owner: string;
            repo: string;
            ref: string;
          }>;
          webhookSubscriber?: Maybe<{
            __typename?: "WebhookSubscriber";
            url: string;
            secret: string;
            headers: Array<
              Maybe<{
                __typename?: "WebhookHeader";
                key: string;
                value: string;
              }>
            >;
          }>;
          jiraIssueSubscriber?: Maybe<{
            __typename?: "JiraIssueSubscriber";
            project: string;
            issueType: string;
          }>;
        };
      }>;
    }>
  >;
  vars?: Maybe<{
    __typename?: "ProjectVars";
    vars?: Maybe<{ [key: string]: any }>;
    privateVars: Array<string>;
    adminOnlyVars: Array<string>;
  }>;
  aliases?: Maybe<
    Array<{
      __typename?: "ProjectAlias";
      id: string;
      alias: string;
      gitTag: string;
      variant: string;
      task: string;
      remotePath: string;
      variantTags: Array<string>;
      taskTags: Array<string>;
    }>
  >;
};

export type RepoSettingsFragment = {
  __typename?: "RepoSettings";
  githubWebhooksEnabled: boolean;
  projectRef?: Maybe<{
    __typename?: "RepoRef";
    id: string;
    displayName: string;
    owner: string;
    repo: string;
    branch: string;
    batchTime: number;
    remotePath: string;
    spawnHostScriptPath: string;
    dispatchingDisabled: boolean;
    versionControlEnabled: boolean;
    deactivatePrevious: boolean;
    repotrackerDisabled: boolean;
    stepbackDisabled: boolean;
    patchingDisabled: boolean;
    disabledStatsCache: boolean;
    private: boolean;
    restricted: boolean;
    admins: Array<string>;
    perfEnabled: boolean;
    notifyOnBuildFailure: boolean;
    githubTriggerAliases?: Maybe<Array<string>>;
    prTestingEnabled: boolean;
    manualPrTestingEnabled: boolean;
    githubChecksEnabled: boolean;
    gitTagVersionsEnabled: boolean;
    gitTagAuthorizedUsers?: Maybe<Array<string>>;
    gitTagAuthorizedTeams?: Maybe<Array<string>>;
    taskSync: {
      __typename?: "RepoTaskSyncOptions";
      configEnabled: boolean;
      patchEnabled: boolean;
    };
    buildBaronSettings: {
      __typename?: "BuildBaronSettings";
      ticketCreateProject: string;
      ticketSearchProjects?: Maybe<Array<string>>;
    };
    taskAnnotationSettings: {
      __typename?: "TaskAnnotationSettings";
      jiraCustomFields?: Maybe<
        Array<{ __typename?: "JiraField"; field: string; displayText: string }>
      >;
      fileTicketWebhook: {
        __typename?: "Webhook";
        endpoint: string;
        secret: string;
      };
    };
    patchTriggerAliases?: Maybe<
      Array<{
        __typename?: "PatchTriggerAlias";
        alias: string;
        childProjectIdentifier: string;
        status?: Maybe<string>;
        parentAsModule?: Maybe<string>;
        taskSpecifiers?: Maybe<
          Array<{
            __typename?: "TaskSpecifier";
            patchAlias: string;
            taskRegex: string;
            variantRegex: string;
          }>
        >;
      }>
    >;
    workstationConfig: {
      __typename?: "RepoWorkstationConfig";
      gitClone: boolean;
      setupCommands?: Maybe<
        Array<{
          __typename?: "WorkstationSetupCommand";
          command: string;
          directory: string;
        }>
      >;
    };
    triggers: Array<{
      __typename?: "TriggerAlias";
      project: string;
      level: string;
      buildVariantRegex: string;
      taskRegex: string;
      status: string;
      dateCutoff?: Maybe<number>;
      configFile: string;
      alias: string;
    }>;
    periodicBuilds?: Maybe<
      Array<{
        __typename?: "PeriodicBuild";
        id: string;
        configFile: string;
        intervalHours: number;
        alias: string;
        message: string;
        nextRunTime: Date;
      }>
    >;
    commitQueue: {
      __typename?: "RepoCommitQueueParams";
      enabled: boolean;
      requireSigned: boolean;
      requiredApprovalCount: number;
      mergeMethod: string;
      message: string;
    };
  }>;
  vars?: Maybe<{
    __typename?: "ProjectVars";
    vars?: Maybe<{ [key: string]: any }>;
    privateVars: Array<string>;
    adminOnlyVars: Array<string>;
  }>;
  subscriptions?: Maybe<
    Array<{
      __typename?: "ProjectSubscription";
      id: string;
      resourceType: string;
      trigger: string;
      ownerType: string;
      triggerData?: Maybe<{ [key: string]: any }>;
      selectors: Array<{ __typename?: "Selector"; type: string; data: string }>;
      regexSelectors: Array<{
        __typename?: "Selector";
        type: string;
        data: string;
      }>;
      subscriber?: Maybe<{
        __typename?: "ProjectSubscriber";
        type: string;
        subscriber: {
          __typename?: "Subscriber";
          jiraCommentSubscriber?: Maybe<string>;
          emailSubscriber?: Maybe<string>;
          slackSubscriber?: Maybe<string>;
          githubPRSubscriber?: Maybe<{
            __typename?: "GithubPRSubscriber";
            owner: string;
            repo: string;
            ref: string;
            prNumber?: Maybe<number>;
          }>;
          githubCheckSubscriber?: Maybe<{
            __typename?: "GithubCheckSubscriber";
            owner: string;
            repo: string;
            ref: string;
          }>;
          webhookSubscriber?: Maybe<{
            __typename?: "WebhookSubscriber";
            url: string;
            secret: string;
            headers: Array<
              Maybe<{
                __typename?: "WebhookHeader";
                key: string;
                value: string;
              }>
            >;
          }>;
          jiraIssueSubscriber?: Maybe<{
            __typename?: "JiraIssueSubscriber";
            project: string;
            issueType: string;
          }>;
        };
      }>;
    }>
  >;
  aliases?: Maybe<
    Array<{
      __typename?: "ProjectAlias";
      id: string;
      alias: string;
      gitTag: string;
      variant: string;
      task: string;
      remotePath: string;
      variantTags: Array<string>;
      taskTags: Array<string>;
    }>
  >;
};

export type ProjectNotificationSettingsFragment = {
  __typename?: "Project";
  notifyOnBuildFailure?: Maybe<boolean>;
};

export type RepoNotificationSettingsFragment = {
  __typename?: "RepoRef";
  notifyOnBuildFailure: boolean;
};

export type SubscriptionsFragment = {
  __typename?: "ProjectSubscription";
  id: string;
  resourceType: string;
  trigger: string;
  ownerType: string;
  triggerData?: Maybe<{ [key: string]: any }>;
  selectors: Array<{ __typename?: "Selector"; type: string; data: string }>;
  regexSelectors: Array<{
    __typename?: "Selector";
    type: string;
    data: string;
  }>;
  subscriber?: Maybe<{
    __typename?: "ProjectSubscriber";
    type: string;
    subscriber: {
      __typename?: "Subscriber";
      jiraCommentSubscriber?: Maybe<string>;
      emailSubscriber?: Maybe<string>;
      slackSubscriber?: Maybe<string>;
      githubPRSubscriber?: Maybe<{
        __typename?: "GithubPRSubscriber";
        owner: string;
        repo: string;
        ref: string;
        prNumber?: Maybe<number>;
      }>;
      githubCheckSubscriber?: Maybe<{
        __typename?: "GithubCheckSubscriber";
        owner: string;
        repo: string;
        ref: string;
      }>;
      webhookSubscriber?: Maybe<{
        __typename?: "WebhookSubscriber";
        url: string;
        secret: string;
        headers: Array<
          Maybe<{ __typename?: "WebhookHeader"; key: string; value: string }>
        >;
      }>;
      jiraIssueSubscriber?: Maybe<{
        __typename?: "JiraIssueSubscriber";
        project: string;
        issueType: string;
      }>;
    };
  }>;
};

export type ProjectPatchAliasSettingsFragment = {
  __typename?: "Project";
  githubTriggerAliases?: Maybe<Array<string>>;
  patchTriggerAliases?: Maybe<
    Array<{
      __typename?: "PatchTriggerAlias";
      alias: string;
      childProjectIdentifier: string;
      status?: Maybe<string>;
      parentAsModule?: Maybe<string>;
      taskSpecifiers?: Maybe<
        Array<{
          __typename?: "TaskSpecifier";
          patchAlias: string;
          taskRegex: string;
          variantRegex: string;
        }>
      >;
    }>
  >;
};

export type RepoPatchAliasSettingsFragment = {
  __typename?: "RepoRef";
  githubTriggerAliases?: Maybe<Array<string>>;
  patchTriggerAliases?: Maybe<
    Array<{
      __typename?: "PatchTriggerAlias";
      alias: string;
      childProjectIdentifier: string;
      status?: Maybe<string>;
      parentAsModule?: Maybe<string>;
      taskSpecifiers?: Maybe<
        Array<{
          __typename?: "TaskSpecifier";
          patchAlias: string;
          taskRegex: string;
          variantRegex: string;
        }>
      >;
    }>
  >;
};

export type ProjectPeriodicBuildsSettingsFragment = {
  __typename?: "Project";
  periodicBuilds?: Maybe<
    Array<{
      __typename?: "PeriodicBuild";
      id: string;
      configFile: string;
      intervalHours: number;
      alias: string;
      message: string;
      nextRunTime: Date;
    }>
  >;
};

export type RepoPeriodicBuildsSettingsFragment = {
  __typename?: "RepoRef";
  periodicBuilds?: Maybe<
    Array<{
      __typename?: "PeriodicBuild";
      id: string;
      configFile: string;
      intervalHours: number;
      alias: string;
      message: string;
      nextRunTime: Date;
    }>
  >;
};

export type ProjectPluginsSettingsFragment = {
  __typename?: "Project";
  perfEnabled?: Maybe<boolean>;
  buildBaronSettings: {
    __typename?: "BuildBaronSettings";
    ticketCreateProject: string;
    ticketSearchProjects?: Maybe<Array<string>>;
  };
  taskAnnotationSettings: {
    __typename?: "TaskAnnotationSettings";
    jiraCustomFields?: Maybe<
      Array<{ __typename?: "JiraField"; field: string; displayText: string }>
    >;
    fileTicketWebhook: {
      __typename?: "Webhook";
      endpoint: string;
      secret: string;
    };
  };
};

export type RepoPluginsSettingsFragment = {
  __typename?: "RepoRef";
  perfEnabled: boolean;
  buildBaronSettings: {
    __typename?: "BuildBaronSettings";
    ticketCreateProject: string;
    ticketSearchProjects?: Maybe<Array<string>>;
  };
  taskAnnotationSettings: {
    __typename?: "TaskAnnotationSettings";
    jiraCustomFields?: Maybe<
      Array<{ __typename?: "JiraField"; field: string; displayText: string }>
    >;
    fileTicketWebhook: {
      __typename?: "Webhook";
      endpoint: string;
      secret: string;
    };
  };
};

export type ProjectEventSettingsFragment = {
  __typename?: "ProjectEventSettings";
  githubWebhooksEnabled: boolean;
  projectRef?: Maybe<{
    __typename?: "Project";
    identifier: string;
    repoRefId: string;
    versionControlEnabled?: Maybe<boolean>;
    tracksPushEvents?: Maybe<boolean>;
    hidden?: Maybe<boolean>;
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
    stepbackDisabled?: Maybe<boolean>;
    patchingDisabled?: Maybe<boolean>;
    disabledStatsCache?: Maybe<boolean>;
    private?: Maybe<boolean>;
    restricted?: Maybe<boolean>;
    admins?: Maybe<Array<Maybe<string>>>;
    perfEnabled?: Maybe<boolean>;
    notifyOnBuildFailure?: Maybe<boolean>;
    githubTriggerAliases?: Maybe<Array<string>>;
    prTestingEnabled?: Maybe<boolean>;
    manualPrTestingEnabled?: Maybe<boolean>;
    githubChecksEnabled?: Maybe<boolean>;
    gitTagVersionsEnabled?: Maybe<boolean>;
    gitTagAuthorizedUsers?: Maybe<Array<string>>;
    gitTagAuthorizedTeams?: Maybe<Array<string>>;
    taskSync: {
      __typename?: "TaskSyncOptions";
      configEnabled?: Maybe<boolean>;
      patchEnabled?: Maybe<boolean>;
    };
    buildBaronSettings: {
      __typename?: "BuildBaronSettings";
      ticketCreateProject: string;
      ticketSearchProjects?: Maybe<Array<string>>;
    };
    taskAnnotationSettings: {
      __typename?: "TaskAnnotationSettings";
      jiraCustomFields?: Maybe<
        Array<{ __typename?: "JiraField"; field: string; displayText: string }>
      >;
      fileTicketWebhook: {
        __typename?: "Webhook";
        endpoint: string;
        secret: string;
      };
    };
    patchTriggerAliases?: Maybe<
      Array<{
        __typename?: "PatchTriggerAlias";
        alias: string;
        childProjectIdentifier: string;
        status?: Maybe<string>;
        parentAsModule?: Maybe<string>;
        taskSpecifiers?: Maybe<
          Array<{
            __typename?: "TaskSpecifier";
            patchAlias: string;
            taskRegex: string;
            variantRegex: string;
          }>
        >;
      }>
    >;
    workstationConfig: {
      __typename?: "WorkstationConfig";
      gitClone?: Maybe<boolean>;
      setupCommands?: Maybe<
        Array<{
          __typename?: "WorkstationSetupCommand";
          command: string;
          directory: string;
        }>
      >;
    };
    triggers?: Maybe<
      Array<{
        __typename?: "TriggerAlias";
        project: string;
        level: string;
        buildVariantRegex: string;
        taskRegex: string;
        status: string;
        dateCutoff?: Maybe<number>;
        configFile: string;
        alias: string;
      }>
    >;
    periodicBuilds?: Maybe<
      Array<{
        __typename?: "PeriodicBuild";
        id: string;
        configFile: string;
        intervalHours: number;
        alias: string;
        message: string;
        nextRunTime: Date;
      }>
    >;
    commitQueue: {
      __typename?: "CommitQueueParams";
      enabled?: Maybe<boolean>;
      requireSigned?: Maybe<boolean>;
      requiredApprovalCount?: Maybe<number>;
      mergeMethod: string;
      message: string;
    };
  }>;
  subscriptions?: Maybe<
    Array<{
      __typename?: "ProjectSubscription";
      id: string;
      resourceType: string;
      trigger: string;
      ownerType: string;
      triggerData?: Maybe<{ [key: string]: any }>;
      selectors: Array<{ __typename?: "Selector"; type: string; data: string }>;
      regexSelectors: Array<{
        __typename?: "Selector";
        type: string;
        data: string;
      }>;
      subscriber?: Maybe<{
        __typename?: "ProjectSubscriber";
        type: string;
        subscriber: {
          __typename?: "Subscriber";
          jiraCommentSubscriber?: Maybe<string>;
          emailSubscriber?: Maybe<string>;
          slackSubscriber?: Maybe<string>;
          githubPRSubscriber?: Maybe<{
            __typename?: "GithubPRSubscriber";
            owner: string;
            repo: string;
            ref: string;
            prNumber?: Maybe<number>;
          }>;
          githubCheckSubscriber?: Maybe<{
            __typename?: "GithubCheckSubscriber";
            owner: string;
            repo: string;
            ref: string;
          }>;
          webhookSubscriber?: Maybe<{
            __typename?: "WebhookSubscriber";
            url: string;
            secret: string;
            headers: Array<
              Maybe<{
                __typename?: "WebhookHeader";
                key: string;
                value: string;
              }>
            >;
          }>;
          jiraIssueSubscriber?: Maybe<{
            __typename?: "JiraIssueSubscriber";
            project: string;
            issueType: string;
          }>;
        };
      }>;
    }>
  >;
  vars?: Maybe<{
    __typename?: "ProjectVars";
    vars?: Maybe<{ [key: string]: any }>;
    privateVars: Array<string>;
    adminOnlyVars: Array<string>;
  }>;
  aliases?: Maybe<
    Array<{
      __typename?: "ProjectAlias";
      id: string;
      alias: string;
      gitTag: string;
      variant: string;
      task: string;
      remotePath: string;
      variantTags: Array<string>;
      taskTags: Array<string>;
    }>
  >;
};

export type ProjectTriggersSettingsFragment = {
  __typename?: "Project";
  triggers?: Maybe<
    Array<{
      __typename?: "TriggerAlias";
      project: string;
      level: string;
      buildVariantRegex: string;
      taskRegex: string;
      status: string;
      dateCutoff?: Maybe<number>;
      configFile: string;
      alias: string;
    }>
  >;
};

export type RepoTriggersSettingsFragment = {
  __typename?: "RepoRef";
  triggers: Array<{
    __typename?: "TriggerAlias";
    project: string;
    level: string;
    buildVariantRegex: string;
    taskRegex: string;
    status: string;
    dateCutoff?: Maybe<number>;
    configFile: string;
    alias: string;
  }>;
};

export type VariablesFragment = {
  __typename?: "ProjectVars";
  vars?: Maybe<{ [key: string]: any }>;
  privateVars: Array<string>;
  adminOnlyVars: Array<string>;
};

export type ProjectVirtualWorkstationSettingsFragment = {
  __typename?: "Project";
  workstationConfig: {
    __typename?: "WorkstationConfig";
    gitClone?: Maybe<boolean>;
    setupCommands?: Maybe<
      Array<{
        __typename?: "WorkstationSetupCommand";
        command: string;
        directory: string;
      }>
    >;
  };
};

export type RepoVirtualWorkstationSettingsFragment = {
  __typename?: "RepoRef";
  workstationConfig: {
    __typename?: "RepoWorkstationConfig";
    gitClone: boolean;
    setupCommands?: Maybe<
      Array<{
        __typename?: "WorkstationSetupCommand";
        command: string;
        directory: string;
      }>
    >;
  };
};

export type UpstreamProjectFragment = {
  __typename?: "Version";
  upstreamProject?: Maybe<{
    __typename?: "UpstreamProject";
    triggerID: string;
    triggerType: string;
    repo: string;
    project: string;
    task?: Maybe<{ __typename?: "Task"; id: string; execution: number }>;
    version?: Maybe<{ __typename?: "Version"; id: string }>;
  }>;
};

export type AbortTaskMutationVariables = Exact<{
  taskId: Scalars["String"];
}>;

export type AbortTaskMutation = {
  __typename?: "Mutation";
  abortTask: {
    __typename?: "Task";
    priority?: Maybe<number>;
    id: string;
    execution: number;
    buildVariant: string;
    displayName: string;
    revision?: Maybe<string>;
    status: string;
  };
};

export type AddAnnotationIssueMutationVariables = Exact<{
  taskId: Scalars["String"];
  execution: Scalars["Int"];
  apiIssue: IssueLinkInput;
  isIssue: Scalars["Boolean"];
}>;

export type AddAnnotationIssueMutation = {
  __typename?: "Mutation";
  addAnnotationIssue: boolean;
};

export type AddFavoriteProjectMutationVariables = Exact<{
  identifier: Scalars["String"];
}>;

export type AddFavoriteProjectMutation = {
  __typename?: "Mutation";
  addFavoriteProject: {
    __typename?: "Project";
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
  __typename?: "Mutation";
  attachProjectToNewRepo: { __typename?: "Project"; repoRefId: string };
};

export type AttachProjectToRepoMutationVariables = Exact<{
  projectId: Scalars["String"];
}>;

export type AttachProjectToRepoMutation = {
  __typename?: "Mutation";
  attachProjectToRepo: { __typename?: "Project"; id: string };
};

export type AttachVolumeToHostMutationVariables = Exact<{
  volumeAndHost: VolumeHost;
}>;

export type AttachVolumeToHostMutation = {
  __typename?: "Mutation";
  attachVolumeToHost: boolean;
};

export type ClearMySubscriptionsMutationVariables = Exact<{
  [key: string]: never;
}>;

export type ClearMySubscriptionsMutation = {
  __typename?: "Mutation";
  clearMySubscriptions: number;
};

export type CopyProjectMutationVariables = Exact<{
  project: CopyProjectInput;
  requestS3Creds: Scalars["Boolean"];
}>;

export type CopyProjectMutation = {
  __typename?: "Mutation";
  copyProject: { __typename?: "Project"; identifier: string };
};

export type CreateProjectMutationVariables = Exact<{
  project: CreateProjectInput;
  requestS3Creds: Scalars["Boolean"];
}>;

export type CreateProjectMutation = {
  __typename?: "Mutation";
  createProject: { __typename?: "Project"; identifier: string };
};

export type CreatePublicKeyMutationVariables = Exact<{
  publicKeyInput: PublicKeyInput;
}>;

export type CreatePublicKeyMutation = {
  __typename?: "Mutation";
  createPublicKey: Array<{
    __typename?: "PublicKey";
    key: string;
    name: string;
  }>;
};

export type DeactivateStepbackTaskMutationVariables = Exact<{
  projectId: Scalars["String"];
  buildVariantName: Scalars["String"];
  taskName: Scalars["String"];
}>;

export type DeactivateStepbackTaskMutation = {
  __typename?: "Mutation";
  deactivateStepbackTask: boolean;
};

export type DefaultSectionToRepoMutationVariables = Exact<{
  projectId: Scalars["String"];
  section: ProjectSettingsSection;
}>;

export type DefaultSectionToRepoMutation = {
  __typename?: "Mutation";
  defaultSectionToRepo?: Maybe<string>;
};

export type DetachProjectFromRepoMutationVariables = Exact<{
  projectId: Scalars["String"];
}>;

export type DetachProjectFromRepoMutation = {
  __typename?: "Mutation";
  detachProjectFromRepo: { __typename?: "Project"; id: string };
};

export type DetachVolumeFromHostMutationVariables = Exact<{
  volumeId: Scalars["String"];
}>;

export type DetachVolumeFromHostMutation = {
  __typename?: "Mutation";
  detachVolumeFromHost: boolean;
};

export type EditAnnotationNoteMutationVariables = Exact<{
  taskId: Scalars["String"];
  execution: Scalars["Int"];
  originalMessage: Scalars["String"];
  newMessage: Scalars["String"];
}>;

export type EditAnnotationNoteMutation = {
  __typename?: "Mutation";
  editAnnotationNote: boolean;
};

export type EditSpawnHostMutationVariables = Exact<{
  hostId: Scalars["String"];
  displayName?: InputMaybe<Scalars["String"]>;
  addedInstanceTags?: InputMaybe<Array<InstanceTagInput>>;
  deletedInstanceTags?: InputMaybe<Array<InstanceTagInput>>;
  volumeId?: InputMaybe<Scalars["String"]>;
  instanceType?: InputMaybe<Scalars["String"]>;
  expiration?: InputMaybe<Scalars["Time"]>;
  noExpiration?: InputMaybe<Scalars["Boolean"]>;
  servicePassword?: InputMaybe<Scalars["String"]>;
  publicKey?: InputMaybe<PublicKeyInput>;
  savePublicKey?: InputMaybe<Scalars["Boolean"]>;
}>;

export type EditSpawnHostMutation = {
  __typename?: "Mutation";
  editSpawnHost: {
    __typename?: "Host";
    availabilityZone?: Maybe<string>;
    displayName?: Maybe<string>;
    expiration?: Maybe<Date>;
    homeVolumeID?: Maybe<string>;
    instanceType?: Maybe<string>;
    noExpiration: boolean;
    id: string;
    hostUrl: string;
    status: string;
    startedBy: string;
    user?: Maybe<string>;
    tag: string;
    provider: string;
    uptime?: Maybe<Date>;
    distro?: Maybe<{
      __typename?: "DistroInfo";
      isVirtualWorkStation?: Maybe<boolean>;
      id?: Maybe<string>;
      user?: Maybe<string>;
      workDir?: Maybe<string>;
      isWindows?: Maybe<boolean>;
    }>;
    homeVolume?: Maybe<{ __typename?: "Volume"; displayName: string }>;
    instanceTags: Array<{
      __typename?: "InstanceTag";
      key: string;
      value: string;
      canBeModified: boolean;
    }>;
    volumes: Array<{
      __typename?: "Volume";
      displayName: string;
      id: string;
      migrating: boolean;
    }>;
  };
};

export type EnqueuePatchMutationVariables = Exact<{
  patchId: Scalars["String"];
  commitMessage?: InputMaybe<Scalars["String"]>;
}>;

export type EnqueuePatchMutation = {
  __typename?: "Mutation";
  enqueuePatch: { __typename?: "Patch"; id: string };
};

export type BbCreateTicketMutationVariables = Exact<{
  taskId: Scalars["String"];
  execution?: InputMaybe<Scalars["Int"]>;
}>;

export type BbCreateTicketMutation = {
  __typename?: "Mutation";
  bbCreateTicket: boolean;
};

export type ForceRepotrackerRunMutationVariables = Exact<{
  projectId: Scalars["String"];
}>;

export type ForceRepotrackerRunMutation = {
  __typename?: "Mutation";
  forceRepotrackerRun: boolean;
};

export type MigrateVolumeMutationVariables = Exact<{
  volumeId: Scalars["String"];
  spawnHostInput: SpawnHostInput;
}>;

export type MigrateVolumeMutation = {
  __typename?: "Mutation";
  migrateVolume: boolean;
};

export type MoveAnnotationIssueMutationVariables = Exact<{
  taskId: Scalars["String"];
  execution: Scalars["Int"];
  apiIssue: IssueLinkInput;
  isIssue: Scalars["Boolean"];
}>;

export type MoveAnnotationIssueMutation = {
  __typename?: "Mutation";
  moveAnnotationIssue: boolean;
};

export type OverrideTaskDependenciesMutationVariables = Exact<{
  taskId: Scalars["String"];
}>;

export type OverrideTaskDependenciesMutation = {
  __typename?: "Mutation";
  overrideTaskDependencies: {
    __typename?: "Task";
    id: string;
    execution: number;
    status: string;
  };
};

export type PromoteVarsToRepoMutationVariables = Exact<{
  projectId: Scalars["String"];
  varNames: Array<Scalars["String"]>;
}>;

export type PromoteVarsToRepoMutation = {
  __typename?: "Mutation";
  promoteVarsToRepo: boolean;
};

export type RemoveAnnotationIssueMutationVariables = Exact<{
  taskId: Scalars["String"];
  execution: Scalars["Int"];
  apiIssue: IssueLinkInput;
  isIssue: Scalars["Boolean"];
}>;

export type RemoveAnnotationIssueMutation = {
  __typename?: "Mutation";
  removeAnnotationIssue: boolean;
};

export type RemoveFavoriteProjectMutationVariables = Exact<{
  identifier: Scalars["String"];
}>;

export type RemoveFavoriteProjectMutation = {
  __typename?: "Mutation";
  removeFavoriteProject: {
    __typename?: "Project";
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
  __typename?: "Mutation";
  removeItemFromCommitQueue?: Maybe<string>;
};

export type RemovePublicKeyMutationVariables = Exact<{
  keyName: Scalars["String"];
}>;

export type RemovePublicKeyMutation = {
  __typename?: "Mutation";
  removePublicKey: Array<{
    __typename?: "PublicKey";
    key: string;
    name: string;
  }>;
};

export type RemoveVolumeMutationVariables = Exact<{
  volumeId: Scalars["String"];
}>;

export type RemoveVolumeMutation = {
  __typename?: "Mutation";
  removeVolume: boolean;
};

export type ReprovisionToNewMutationVariables = Exact<{
  hostIds: Array<Scalars["String"]>;
}>;

export type ReprovisionToNewMutation = {
  __typename?: "Mutation";
  reprovisionToNew: number;
};

export type RestartJasperMutationVariables = Exact<{
  hostIds: Array<Scalars["String"]>;
}>;

export type RestartJasperMutation = {
  __typename?: "Mutation";
  restartJasper: number;
};

export type RestartTaskMutationVariables = Exact<{
  taskId: Scalars["String"];
  failedOnly: Scalars["Boolean"];
}>;

export type RestartTaskMutation = {
  __typename?: "Mutation";
  restartTask: {
    __typename?: "Task";
    latestExecution: number;
    execution: number;
    id: string;
    buildVariant: string;
    displayName: string;
    revision?: Maybe<string>;
    status: string;
  };
};

export type RestartVersionsMutationVariables = Exact<{
  versionId: Scalars["String"];
  abort: Scalars["Boolean"];
  versionsToRestart: Array<VersionToRestart>;
}>;

export type RestartVersionsMutation = {
  __typename?: "Mutation";
  restartVersions?: Maybe<
    Array<{
      __typename?: "Version";
      id: string;
      taskStatuses: Array<string>;
      status: string;
      patch?: Maybe<{
        __typename?: "Patch";
        id: string;
        status: string;
        childPatches?: Maybe<
          Array<{ __typename?: "Patch"; id: string; status: string }>
        >;
      }>;
    }>
  >;
};

export type SaveProjectSettingsForSectionMutationVariables = Exact<{
  projectSettings: ProjectSettingsInput;
  section: ProjectSettingsSection;
}>;

export type SaveProjectSettingsForSectionMutation = {
  __typename?: "Mutation";
  saveProjectSettingsForSection: {
    __typename?: "ProjectSettings";
    projectRef?: Maybe<{
      __typename?: "Project";
      id: string;
      identifier: string;
    }>;
  };
};

export type SaveRepoSettingsForSectionMutationVariables = Exact<{
  repoSettings: RepoSettingsInput;
  section: ProjectSettingsSection;
}>;

export type SaveRepoSettingsForSectionMutation = {
  __typename?: "Mutation";
  saveRepoSettingsForSection: {
    __typename?: "RepoSettings";
    projectRef?: Maybe<{ __typename?: "RepoRef"; id: string }>;
  };
};

export type SaveSubscriptionMutationVariables = Exact<{
  subscription: SubscriptionInput;
}>;

export type SaveSubscriptionMutation = {
  __typename?: "Mutation";
  saveSubscription: boolean;
};

export type SchedulePatchMutationVariables = Exact<{
  patchId: Scalars["String"];
  configure: PatchConfigure;
}>;

export type SchedulePatchMutation = {
  __typename?: "Mutation";
  schedulePatch: {
    __typename?: "Patch";
    tasks: Array<string>;
    variants: Array<string>;
    id: string;
    description: string;
    author: string;
    status: string;
    activated: boolean;
    alias?: Maybe<string>;
    commitQueuePosition?: Maybe<number>;
    versionFull?: Maybe<{ __typename?: "Version"; id: string }>;
    variantsTasks: Array<
      Maybe<{ __typename?: "VariantTask"; name: string; tasks: Array<string> }>
    >;
    parameters: Array<{ __typename?: "Parameter"; key: string; value: string }>;
  };
};

export type ScheduleTasksMutationVariables = Exact<{
  taskIds: Array<Scalars["String"]>;
}>;

export type ScheduleTasksMutation = {
  __typename?: "Mutation";
  scheduleTasks: Array<{
    __typename?: "Task";
    id: string;
    execution: number;
    buildVariant: string;
    displayName: string;
    revision?: Maybe<string>;
    status: string;
  }>;
};

export type ScheduleUndispatchedBaseTasksMutationVariables = Exact<{
  patchId: Scalars["String"];
}>;

export type ScheduleUndispatchedBaseTasksMutation = {
  __typename?: "Mutation";
  scheduleUndispatchedBaseTasks?: Maybe<
    Array<{
      __typename?: "Task";
      id: string;
      execution: number;
      status: string;
    }>
  >;
};

export type SetPatchPriorityMutationVariables = Exact<{
  patchId: Scalars["String"];
  priority: Scalars["Int"];
}>;

export type SetPatchPriorityMutation = {
  __typename?: "Mutation";
  setPatchPriority?: Maybe<string>;
};

export type SetTaskPriorityMutationVariables = Exact<{
  taskId: Scalars["String"];
  priority: Scalars["Int"];
}>;

export type SetTaskPriorityMutation = {
  __typename?: "Mutation";
  setTaskPriority: {
    __typename?: "Task";
    id: string;
    execution: number;
    priority?: Maybe<number>;
  };
};

export type SpawnHostMutationVariables = Exact<{
  SpawnHostInput?: InputMaybe<SpawnHostInput>;
}>;

export type SpawnHostMutation = {
  __typename?: "Mutation";
  spawnHost: { __typename?: "Host"; id: string; status: string };
};

export type SpawnVolumeMutationVariables = Exact<{
  SpawnVolumeInput: SpawnVolumeInput;
}>;

export type SpawnVolumeMutation = {
  __typename?: "Mutation";
  spawnVolume: boolean;
};

export type UnschedulePatchTasksMutationVariables = Exact<{
  patchId: Scalars["String"];
  abort: Scalars["Boolean"];
}>;

export type UnschedulePatchTasksMutation = {
  __typename?: "Mutation";
  unschedulePatchTasks?: Maybe<string>;
};

export type UnscheduleTaskMutationVariables = Exact<{
  taskId: Scalars["String"];
}>;

export type UnscheduleTaskMutation = {
  __typename?: "Mutation";
  unscheduleTask: { __typename?: "Task"; id: string; execution: number };
};

export type UpdateHostStatusMutationVariables = Exact<{
  hostIds: Array<Scalars["String"]>;
  status: Scalars["String"];
  notes?: InputMaybe<Scalars["String"]>;
}>;

export type UpdateHostStatusMutation = {
  __typename?: "Mutation";
  updateHostStatus: number;
};

export type UpdatePublicKeyMutationVariables = Exact<{
  targetKeyName: Scalars["String"];
  updateInfo: PublicKeyInput;
}>;

export type UpdatePublicKeyMutation = {
  __typename?: "Mutation";
  updatePublicKey: Array<{
    __typename?: "PublicKey";
    key: string;
    name: string;
  }>;
};

export type UpdateSpawnHostStatusMutationVariables = Exact<{
  hostId: Scalars["String"];
  action: SpawnHostStatusActions;
}>;

export type UpdateSpawnHostStatusMutation = {
  __typename?: "Mutation";
  updateSpawnHostStatus: { __typename?: "Host"; id: string; status: string };
};

export type UpdateVolumeMutationVariables = Exact<{
  UpdateVolumeInput: UpdateVolumeInput;
}>;

export type UpdateVolumeMutation = {
  __typename?: "Mutation";
  updateVolume: boolean;
};

export type UpdateUserSettingsMutationVariables = Exact<{
  userSettings: UserSettingsInput;
}>;

export type UpdateUserSettingsMutation = {
  __typename?: "Mutation";
  updateUserSettings: boolean;
};

export type AwsRegionsQueryVariables = Exact<{ [key: string]: never }>;

export type AwsRegionsQuery = {
  __typename?: "Query";
  awsRegions?: Maybe<Array<string>>;
};

export type DistroTaskQueueQueryVariables = Exact<{
  distroId: Scalars["String"];
}>;

export type DistroTaskQueueQuery = {
  __typename?: "Query";
  distroTaskQueue: Array<{
    __typename?: "TaskQueueItem";
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
  __typename?: "Query";
  taskTests: {
    __typename?: "TaskTestResult";
    filteredTestCount: number;
    testResults: Array<{
      __typename?: "TestResult";
      id: string;
      testFile: string;
    }>;
  };
};

export type AgentLogsQueryVariables = Exact<{
  id: Scalars["String"];
  execution?: InputMaybe<Scalars["Int"]>;
}>;

export type AgentLogsQuery = {
  __typename?: "Query";
  task?: Maybe<{
    __typename?: "Task";
    id: string;
    execution: number;
    taskLogs: {
      __typename?: "TaskLogs";
      agentLogs: Array<{
        __typename?: "LogMessage";
        severity?: Maybe<string>;
        message?: Maybe<string>;
        timestamp?: Maybe<Date>;
      }>;
    };
  }>;
};

export type AllLogsQueryVariables = Exact<{
  id: Scalars["String"];
  execution?: InputMaybe<Scalars["Int"]>;
}>;

export type AllLogsQuery = {
  __typename?: "Query";
  task?: Maybe<{
    __typename?: "Task";
    id: string;
    execution: number;
    taskLogs: {
      __typename?: "TaskLogs";
      allLogs: Array<{
        __typename?: "LogMessage";
        severity?: Maybe<string>;
        message?: Maybe<string>;
        timestamp?: Maybe<Date>;
      }>;
    };
  }>;
};

export type GetAnnotationEventDataQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution?: InputMaybe<Scalars["Int"]>;
}>;

export type GetAnnotationEventDataQuery = {
  __typename?: "Query";
  task?: Maybe<{
    __typename?: "Task";
    id: string;
    execution: number;
    annotation?: Maybe<{
      __typename?: "Annotation";
      id: string;
      taskId: string;
      taskExecution: number;
      webhookConfigured: boolean;
      note?: Maybe<{
        __typename?: "Note";
        message: string;
        source: {
          __typename?: "Source";
          author: string;
          time: Date;
          requester: string;
        };
      }>;
      issues?: Maybe<
        Array<
          Maybe<{
            __typename?: "IssueLink";
            issueKey?: Maybe<string>;
            url?: Maybe<string>;
            source?: Maybe<{
              __typename?: "Source";
              author: string;
              time: Date;
              requester: string;
            }>;
          }>
        >
      >;
      suspectedIssues?: Maybe<
        Array<
          Maybe<{
            __typename?: "IssueLink";
            issueKey?: Maybe<string>;
            url?: Maybe<string>;
            source?: Maybe<{
              __typename?: "Source";
              author: string;
              time: Date;
              requester: string;
            }>;
          }>
        >
      >;
      createdIssues?: Maybe<
        Array<
          Maybe<{
            __typename?: "IssueLink";
            issueKey?: Maybe<string>;
            url?: Maybe<string>;
            source?: Maybe<{
              __typename?: "Source";
              author: string;
              time: Date;
              requester: string;
            }>;
          }>
        >
      >;
    }>;
  }>;
};

export type GetBaseVersionAndTaskQueryVariables = Exact<{
  taskId: Scalars["String"];
}>;

export type GetBaseVersionAndTaskQuery = {
  __typename?: "Query";
  task?: Maybe<{
    __typename?: "Task";
    id: string;
    execution: number;
    displayName: string;
    buildVariant: string;
    versionMetadata: {
      __typename?: "Version";
      id: string;
      isPatch: boolean;
      baseVersion?: Maybe<{
        __typename?: "Version";
        id: string;
        order: number;
        projectIdentifier: string;
      }>;
    };
    baseTask?: Maybe<{
      __typename?: "Task";
      id: string;
      execution: number;
      status: string;
    }>;
  }>;
};

export type GetBuildBaronConfiguredQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution: Scalars["Int"];
}>;

export type GetBuildBaronConfiguredQuery = {
  __typename?: "Query";
  buildBaron: { __typename?: "BuildBaron"; buildBaronConfigured: boolean };
};

export type BuildBaronQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution: Scalars["Int"];
}>;

export type BuildBaronQuery = {
  __typename?: "Query";
  buildBaron: {
    __typename?: "BuildBaron";
    buildBaronConfigured: boolean;
    bbTicketCreationDefined: boolean;
    searchReturnInfo?: Maybe<{
      __typename?: "SearchReturnInfo";
      search: string;
      source: string;
      featuresURL: string;
      issues: Array<{
        __typename?: "JiraTicket";
        key: string;
        fields: {
          __typename?: "TicketFields";
          summary: string;
          assigneeDisplayName?: Maybe<string>;
          resolutionName?: Maybe<string>;
          created: string;
          updated: string;
          status: { __typename?: "JiraStatus"; id: string; name: string };
        };
      }>;
    }>;
  };
};

export type GetBuildVariantStatsQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type GetBuildVariantStatsQuery = {
  __typename?: "Query";
  version: {
    __typename?: "Version";
    id: string;
    buildVariantStats?: Maybe<
      Array<{
        __typename?: "GroupedTaskStatusCount";
        variant: string;
        displayName: string;
        statusCounts: Array<{
          __typename?: "StatusCount";
          count: number;
          status: string;
        }>;
      }>
    >;
  };
};

export type GetBuildVariantsForTaskNameQueryVariables = Exact<{
  projectIdentifier: Scalars["String"];
  taskName: Scalars["String"];
}>;

export type GetBuildVariantsForTaskNameQuery = {
  __typename?: "Query";
  buildVariantsForTaskName?: Maybe<
    Array<
      Maybe<{
        __typename?: "BuildVariantTuple";
        displayName: string;
        buildVariant: string;
      }>
    >
  >;
};

export type BuildVariantsWithChildrenQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type BuildVariantsWithChildrenQuery = {
  __typename?: "Query";
  version: {
    __typename?: "Version";
    id: string;
    buildVariants?: Maybe<
      Array<
        Maybe<{
          __typename?: "GroupedBuildVariant";
          variant: string;
          displayName: string;
          tasks?: Maybe<
            Array<
              Maybe<{
                __typename?: "Task";
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
          __typename?: "Version";
          id: string;
          projectIdentifier: string;
          project: string;
          buildVariants?: Maybe<
            Array<
              Maybe<{
                __typename?: "GroupedBuildVariant";
                variant: string;
                displayName: string;
                tasks?: Maybe<
                  Array<
                    Maybe<{
                      __typename?: "Task";
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
  __typename?: "Query";
  clientConfig?: Maybe<{
    __typename?: "ClientConfig";
    latestRevision?: Maybe<string>;
    clientBinaries?: Maybe<
      Array<{
        __typename?: "ClientBinary";
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
  __typename?: "Query";
  patch: {
    __typename?: "Patch";
    id: string;
    moduleCodeChanges: Array<{
      __typename?: "ModuleCodeChange";
      rawLink: string;
      branchName: string;
      htmlLink: string;
      fileDiffs: Array<{
        __typename?: "FileDiff";
        fileName: string;
        additions: number;
        deletions: number;
        diffLink: string;
        description: string;
      }>;
    }>;
  };
};

export type CommitQueueQueryVariables = Exact<{
  projectIdentifier: Scalars["String"];
}>;

export type CommitQueueQuery = {
  __typename?: "Query";
  commitQueue: {
    __typename?: "CommitQueue";
    projectId?: Maybe<string>;
    message?: Maybe<string>;
    owner?: Maybe<string>;
    repo?: Maybe<string>;
    queue?: Maybe<
      Array<{
        __typename?: "CommitQueueItem";
        issue?: Maybe<string>;
        enqueueTime?: Maybe<Date>;
        patch?: Maybe<{
          __typename?: "Patch";
          id: string;
          author: string;
          description: string;
          activated: boolean;
          versionFull?: Maybe<{ __typename?: "Version"; id: string }>;
          moduleCodeChanges: Array<{
            __typename?: "ModuleCodeChange";
            rawLink: string;
            branchName: string;
            htmlLink: string;
            fileDiffs: Array<{
              __typename?: "FileDiff";
              fileName: string;
              additions: number;
              deletions: number;
              diffLink: string;
              description: string;
            }>;
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
  __typename?: "Query";
  bbGetCreatedTickets: Array<{
    __typename?: "JiraTicket";
    key: string;
    fields: {
      __typename?: "TicketFields";
      summary: string;
      assigneeDisplayName?: Maybe<string>;
      resolutionName?: Maybe<string>;
      created: string;
      updated: string;
      status: { __typename?: "JiraStatus"; id: string; name: string };
    };
  }>;
};

export type GetDisplayTaskQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution?: InputMaybe<Scalars["Int"]>;
}>;

export type GetDisplayTaskQuery = {
  __typename?: "Query";
  task?: Maybe<{
    __typename?: "Task";
    id: string;
    displayName: string;
    execution: number;
    executionTasks?: Maybe<Array<string>>;
    displayTask?: Maybe<{ __typename?: "Task"; id: string; execution: number }>;
  }>;
};

export type DistrosQueryVariables = Exact<{
  onlySpawnable: Scalars["Boolean"];
}>;

export type DistrosQuery = {
  __typename?: "Query";
  distros: Array<
    Maybe<{
      __typename?: "Distro";
      name?: Maybe<string>;
      isVirtualWorkStation: boolean;
    }>
  >;
};

export type GetGithubOrgsQueryVariables = Exact<{ [key: string]: never }>;

export type GetGithubOrgsQuery = {
  __typename?: "Query";
  spruceConfig?: Maybe<{
    __typename?: "SpruceConfig";
    githubOrgs: Array<string>;
  }>;
};

export type GithubProjectConflictsQueryVariables = Exact<{
  projectId: Scalars["String"];
}>;

export type GithubProjectConflictsQuery = {
  __typename?: "Query";
  githubProjectConflicts: {
    __typename?: "GithubProjectConflicts";
    commitQueueIdentifiers?: Maybe<Array<string>>;
    prTestingIdentifiers?: Maybe<Array<string>>;
    commitCheckIdentifiers?: Maybe<Array<string>>;
  };
};

export type GetHasVersionQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type GetHasVersionQuery = { __typename?: "Query"; hasVersion: boolean };

export type HostEventsQueryVariables = Exact<{
  id: Scalars["String"];
  tag: Scalars["String"];
  limit?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
}>;

export type HostEventsQuery = {
  __typename?: "Query";
  hostEvents: {
    __typename?: "HostEvents";
    count: number;
    eventLogEntries: Array<{
      __typename?: "HostEventLogEntry";
      id: string;
      resourceType: string;
      processedAt: Date;
      timestamp?: Maybe<Date>;
      eventType?: Maybe<string>;
      resourceId: string;
      data: {
        __typename?: "HostEventLogData";
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
  __typename?: "Query";
  host?: Maybe<{
    __typename?: "Host";
    distroId?: Maybe<string>;
    ami?: Maybe<string>;
    lastCommunicationTime?: Maybe<Date>;
    id: string;
    hostUrl: string;
    status: string;
    startedBy: string;
    user?: Maybe<string>;
    tag: string;
    provider: string;
    uptime?: Maybe<Date>;
    distro?: Maybe<{
      __typename?: "DistroInfo";
      bootstrapMethod?: Maybe<string>;
    }>;
    runningTask?: Maybe<{
      __typename?: "TaskInfo";
      id?: Maybe<string>;
      name?: Maybe<string>;
    }>;
  }>;
};

export type InstanceTypesQueryVariables = Exact<{ [key: string]: never }>;

export type InstanceTypesQuery = {
  __typename?: "Query";
  instanceTypes: Array<string>;
};

export type IsPatchConfiguredQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type IsPatchConfiguredQuery = {
  __typename?: "Query";
  patch: {
    __typename?: "Patch";
    id: string;
    activated: boolean;
    alias?: Maybe<string>;
    projectID: string;
  };
};

export type GetCustomCreatedIssuesQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution?: InputMaybe<Scalars["Int"]>;
}>;

export type GetCustomCreatedIssuesQuery = {
  __typename?: "Query";
  task?: Maybe<{
    __typename?: "Task";
    id: string;
    execution: number;
    annotation?: Maybe<{
      __typename?: "Annotation";
      createdIssues?: Maybe<
        Array<
          Maybe<{
            __typename?: "IssueLink";
            issueKey?: Maybe<string>;
            url?: Maybe<string>;
            confidenceScore?: Maybe<number>;
            source?: Maybe<{
              __typename?: "Source";
              author: string;
              time: Date;
              requester: string;
            }>;
            jiraTicket?: Maybe<{
              __typename?: "JiraTicket";
              key: string;
              fields: {
                __typename?: "TicketFields";
                summary: string;
                assigneeDisplayName?: Maybe<string>;
                resolutionName?: Maybe<string>;
                created: string;
                updated: string;
                assignedTeam?: Maybe<string>;
                status: { __typename?: "JiraStatus"; id: string; name: string };
              };
            }>;
          }>
        >
      >;
    }>;
  }>;
};

export type GetIssuesQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution?: InputMaybe<Scalars["Int"]>;
}>;

export type GetIssuesQuery = {
  __typename?: "Query";
  task?: Maybe<{
    __typename?: "Task";
    id: string;
    execution: number;
    annotation?: Maybe<{
      __typename?: "Annotation";
      issues?: Maybe<
        Array<
          Maybe<{
            __typename?: "IssueLink";
            issueKey?: Maybe<string>;
            url?: Maybe<string>;
            confidenceScore?: Maybe<number>;
            source?: Maybe<{
              __typename?: "Source";
              author: string;
              time: Date;
              requester: string;
            }>;
            jiraTicket?: Maybe<{
              __typename?: "JiraTicket";
              key: string;
              fields: {
                __typename?: "TicketFields";
                summary: string;
                assigneeDisplayName?: Maybe<string>;
                resolutionName?: Maybe<string>;
                created: string;
                updated: string;
                assignedTeam?: Maybe<string>;
                status: { __typename?: "JiraStatus"; id: string; name: string };
              };
            }>;
          }>
        >
      >;
    }>;
  }>;
};

export type GetSuspectedIssuesQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution?: InputMaybe<Scalars["Int"]>;
}>;

export type GetSuspectedIssuesQuery = {
  __typename?: "Query";
  task?: Maybe<{
    __typename?: "Task";
    id: string;
    execution: number;
    annotation?: Maybe<{
      __typename?: "Annotation";
      suspectedIssues?: Maybe<
        Array<
          Maybe<{
            __typename?: "IssueLink";
            issueKey?: Maybe<string>;
            url?: Maybe<string>;
            confidenceScore?: Maybe<number>;
            source?: Maybe<{
              __typename?: "Source";
              author: string;
              time: Date;
              requester: string;
            }>;
            jiraTicket?: Maybe<{
              __typename?: "JiraTicket";
              key: string;
              fields: {
                __typename?: "TicketFields";
                summary: string;
                assigneeDisplayName?: Maybe<string>;
                resolutionName?: Maybe<string>;
                created: string;
                updated: string;
                assignedTeam?: Maybe<string>;
                status: { __typename?: "JiraStatus"; id: string; name: string };
              };
            }>;
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
  __typename?: "Query";
  mainlineCommits?: Maybe<{
    __typename?: "MainlineCommits";
    versions: Array<{
      __typename?: "MainlineCommitVersion";
      version?: Maybe<{
        __typename?: "Version";
        id: string;
        buildVariants?: Maybe<
          Array<
            Maybe<{
              __typename?: "GroupedBuildVariant";
              tasks?: Maybe<
                Array<
                  Maybe<{
                    __typename?: "Task";
                    id: string;
                    execution: number;
                    status: string;
                  }>
                >
              >;
            }>
          >
        >;
      }>;
    }>;
  }>;
};

export type LogkeeperBuildMetadataQueryVariables = Exact<{
  buildId: Scalars["String"];
}>;

export type LogkeeperBuildMetadataQuery = {
  __typename?: "Query";
  logkeeperBuildMetadata: {
    __typename?: "LogkeeperBuild";
    builder: string;
    buildNum: number;
    taskId: string;
    taskExecution: number;
    tests: Array<{ __typename?: "LogkeeperTest"; id: string; name: string }>;
  };
};

export type MainlineCommitsForHistoryQueryVariables = Exact<{
  mainlineCommitsOptions: MainlineCommitsOptions;
  buildVariantOptions: BuildVariantOptions;
}>;

export type MainlineCommitsForHistoryQuery = {
  __typename?: "Query";
  mainlineCommits?: Maybe<{
    __typename?: "MainlineCommits";
    nextPageOrderNumber?: Maybe<number>;
    prevPageOrderNumber?: Maybe<number>;
    versions: Array<{
      __typename?: "MainlineCommitVersion";
      version?: Maybe<{
        __typename?: "Version";
        id: string;
        author: string;
        createTime: Date;
        message: string;
        revision: string;
        order: number;
        buildVariants?: Maybe<
          Array<
            Maybe<{
              __typename?: "GroupedBuildVariant";
              displayName: string;
              variant: string;
              tasks?: Maybe<
                Array<
                  Maybe<{
                    __typename?: "Task";
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
        upstreamProject?: Maybe<{
          __typename?: "UpstreamProject";
          triggerID: string;
          triggerType: string;
          repo: string;
          project: string;
          task?: Maybe<{ __typename?: "Task"; id: string; execution: number }>;
          version?: Maybe<{ __typename?: "Version"; id: string }>;
        }>;
      }>;
      rolledUpVersions?: Maybe<
        Array<{
          __typename?: "Version";
          id: string;
          createTime: Date;
          author: string;
          order: number;
          message: string;
          revision: string;
          upstreamProject?: Maybe<{
            __typename?: "UpstreamProject";
            triggerID: string;
            triggerType: string;
            repo: string;
            project: string;
            task?: Maybe<{
              __typename?: "Task";
              id: string;
              execution: number;
            }>;
            version?: Maybe<{ __typename?: "Version"; id: string }>;
          }>;
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
  __typename?: "Query";
  mainlineCommits?: Maybe<{
    __typename?: "MainlineCommits";
    nextPageOrderNumber?: Maybe<number>;
    prevPageOrderNumber?: Maybe<number>;
    versions: Array<{
      __typename?: "MainlineCommitVersion";
      version?: Maybe<{
        __typename?: "Version";
        projectIdentifier: string;
        id: string;
        author: string;
        createTime: Date;
        message: string;
        revision: string;
        order: number;
        taskStatusStats?: Maybe<{
          __typename?: "TaskStats";
          eta?: Maybe<Date>;
          counts?: Maybe<
            Array<{ __typename?: "StatusCount"; status: string; count: number }>
          >;
        }>;
        buildVariantStats?: Maybe<
          Array<{
            __typename?: "GroupedTaskStatusCount";
            displayName: string;
            variant: string;
            statusCounts: Array<{
              __typename?: "StatusCount";
              count: number;
              status: string;
            }>;
          }>
        >;
        buildVariants?: Maybe<
          Array<
            Maybe<{
              __typename?: "GroupedBuildVariant";
              displayName: string;
              variant: string;
              tasks?: Maybe<
                Array<
                  Maybe<{
                    __typename?: "Task";
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
        upstreamProject?: Maybe<{
          __typename?: "UpstreamProject";
          triggerID: string;
          triggerType: string;
          repo: string;
          project: string;
          task?: Maybe<{ __typename?: "Task"; id: string; execution: number }>;
          version?: Maybe<{ __typename?: "Version"; id: string }>;
        }>;
      }>;
      rolledUpVersions?: Maybe<
        Array<{
          __typename?: "Version";
          id: string;
          createTime: Date;
          author: string;
          order: number;
          message: string;
          revision: string;
          upstreamProject?: Maybe<{
            __typename?: "UpstreamProject";
            triggerID: string;
            triggerType: string;
            repo: string;
            project: string;
            task?: Maybe<{
              __typename?: "Task";
              id: string;
              execution: number;
            }>;
            version?: Maybe<{ __typename?: "Version"; id: string }>;
          }>;
        }>
      >;
    }>;
  }>;
};

export type MyHostsQueryVariables = Exact<{ [key: string]: never }>;

export type MyHostsQuery = {
  __typename?: "Query";
  myHosts: Array<{
    __typename?: "Host";
    availabilityZone?: Maybe<string>;
    displayName?: Maybe<string>;
    expiration?: Maybe<Date>;
    homeVolumeID?: Maybe<string>;
    instanceType?: Maybe<string>;
    noExpiration: boolean;
    id: string;
    hostUrl: string;
    status: string;
    startedBy: string;
    user?: Maybe<string>;
    tag: string;
    provider: string;
    uptime?: Maybe<Date>;
    distro?: Maybe<{
      __typename?: "DistroInfo";
      isVirtualWorkStation?: Maybe<boolean>;
      id?: Maybe<string>;
      user?: Maybe<string>;
      workDir?: Maybe<string>;
      isWindows?: Maybe<boolean>;
    }>;
    homeVolume?: Maybe<{ __typename?: "Volume"; displayName: string }>;
    instanceTags: Array<{
      __typename?: "InstanceTag";
      key: string;
      value: string;
      canBeModified: boolean;
    }>;
    volumes: Array<{
      __typename?: "Volume";
      displayName: string;
      id: string;
      migrating: boolean;
    }>;
  }>;
};

export type MyVolumesQueryVariables = Exact<{ [key: string]: never }>;

export type MyVolumesQuery = {
  __typename?: "Query";
  myVolumes: Array<{
    __typename?: "Volume";
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
    migrating: boolean;
    host?: Maybe<{
      __typename?: "Host";
      displayName?: Maybe<string>;
      id: string;
      noExpiration: boolean;
    }>;
  }>;
};

export type GetOtherUserQueryVariables = Exact<{
  userId?: InputMaybe<Scalars["String"]>;
}>;

export type GetOtherUserQuery = {
  __typename?: "Query";
  otherUser: { __typename?: "User"; userId: string; displayName: string };
  currentUser: { __typename?: "User"; userId: string };
};

export type ConfigurePatchQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type ConfigurePatchQuery = {
  __typename?: "Query";
  patch: {
    __typename?: "Patch";
    id: string;
    description: string;
    author: string;
    status: string;
    activated: boolean;
    alias?: Maybe<string>;
    commitQueuePosition?: Maybe<number>;
    time?: Maybe<{ __typename?: "PatchTime"; submittedAt: string }>;
    project?: Maybe<{
      __typename?: "PatchProject";
      variants: Array<{
        __typename?: "ProjectBuildVariant";
        name: string;
        displayName: string;
        tasks: Array<string>;
      }>;
    }>;
    childPatches?: Maybe<
      Array<{
        __typename?: "Patch";
        id: string;
        projectIdentifier: string;
        variantsTasks: Array<
          Maybe<{
            __typename?: "VariantTask";
            name: string;
            tasks: Array<string>;
          }>
        >;
      }>
    >;
    patchTriggerAliases: Array<{
      __typename?: "PatchTriggerAlias";
      alias: string;
      childProjectId: string;
      childProjectIdentifier: string;
      variantsTasks: Array<{
        __typename?: "VariantTask";
        name: string;
        tasks: Array<string>;
      }>;
    }>;
    childPatchAliases?: Maybe<
      Array<{ __typename?: "ChildPatchAlias"; alias: string; patchId: string }>
    >;
    variantsTasks: Array<
      Maybe<{ __typename?: "VariantTask"; name: string; tasks: Array<string> }>
    >;
    parameters: Array<{ __typename?: "Parameter"; key: string; value: string }>;
  };
};

export type GetPatchTaskStatusesQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type GetPatchTaskStatusesQuery = {
  __typename?: "Query";
  patch: {
    __typename?: "Patch";
    id: string;
    taskStatuses: Array<string>;
    baseTaskStatuses: Array<string>;
  };
};

export type PatchQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type PatchQuery = {
  __typename?: "Query";
  patch: {
    __typename?: "Patch";
    projectID: string;
    projectIdentifier: string;
    githash: string;
    patchNumber: number;
    id: string;
    description: string;
    author: string;
    status: string;
    activated: boolean;
    alias?: Maybe<string>;
    commitQueuePosition?: Maybe<number>;
    versionFull?: Maybe<{ __typename?: "Version"; id: string }>;
    variantsTasks: Array<
      Maybe<{ __typename?: "VariantTask"; name: string; tasks: Array<string> }>
    >;
    parameters: Array<{ __typename?: "Parameter"; key: string; value: string }>;
  };
};

export type ProjectEventLogsQueryVariables = Exact<{
  identifier: Scalars["String"];
  limit?: InputMaybe<Scalars["Int"]>;
  before?: InputMaybe<Scalars["Time"]>;
}>;

export type ProjectEventLogsQuery = {
  __typename?: "Query";
  projectEvents: {
    __typename?: "ProjectEvents";
    count: number;
    eventLogEntries: Array<{
      __typename?: "ProjectEventLogEntry";
      timestamp: Date;
      user: string;
      before?: Maybe<{
        __typename?: "ProjectEventSettings";
        githubWebhooksEnabled: boolean;
        projectRef?: Maybe<{
          __typename?: "Project";
          identifier: string;
          repoRefId: string;
          versionControlEnabled?: Maybe<boolean>;
          tracksPushEvents?: Maybe<boolean>;
          hidden?: Maybe<boolean>;
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
          stepbackDisabled?: Maybe<boolean>;
          patchingDisabled?: Maybe<boolean>;
          disabledStatsCache?: Maybe<boolean>;
          private?: Maybe<boolean>;
          restricted?: Maybe<boolean>;
          admins?: Maybe<Array<Maybe<string>>>;
          perfEnabled?: Maybe<boolean>;
          notifyOnBuildFailure?: Maybe<boolean>;
          githubTriggerAliases?: Maybe<Array<string>>;
          prTestingEnabled?: Maybe<boolean>;
          manualPrTestingEnabled?: Maybe<boolean>;
          githubChecksEnabled?: Maybe<boolean>;
          gitTagVersionsEnabled?: Maybe<boolean>;
          gitTagAuthorizedUsers?: Maybe<Array<string>>;
          gitTagAuthorizedTeams?: Maybe<Array<string>>;
          taskSync: {
            __typename?: "TaskSyncOptions";
            configEnabled?: Maybe<boolean>;
            patchEnabled?: Maybe<boolean>;
          };
          buildBaronSettings: {
            __typename?: "BuildBaronSettings";
            ticketCreateProject: string;
            ticketSearchProjects?: Maybe<Array<string>>;
          };
          taskAnnotationSettings: {
            __typename?: "TaskAnnotationSettings";
            jiraCustomFields?: Maybe<
              Array<{
                __typename?: "JiraField";
                field: string;
                displayText: string;
              }>
            >;
            fileTicketWebhook: {
              __typename?: "Webhook";
              endpoint: string;
              secret: string;
            };
          };
          patchTriggerAliases?: Maybe<
            Array<{
              __typename?: "PatchTriggerAlias";
              alias: string;
              childProjectIdentifier: string;
              status?: Maybe<string>;
              parentAsModule?: Maybe<string>;
              taskSpecifiers?: Maybe<
                Array<{
                  __typename?: "TaskSpecifier";
                  patchAlias: string;
                  taskRegex: string;
                  variantRegex: string;
                }>
              >;
            }>
          >;
          workstationConfig: {
            __typename?: "WorkstationConfig";
            gitClone?: Maybe<boolean>;
            setupCommands?: Maybe<
              Array<{
                __typename?: "WorkstationSetupCommand";
                command: string;
                directory: string;
              }>
            >;
          };
          triggers?: Maybe<
            Array<{
              __typename?: "TriggerAlias";
              project: string;
              level: string;
              buildVariantRegex: string;
              taskRegex: string;
              status: string;
              dateCutoff?: Maybe<number>;
              configFile: string;
              alias: string;
            }>
          >;
          periodicBuilds?: Maybe<
            Array<{
              __typename?: "PeriodicBuild";
              id: string;
              configFile: string;
              intervalHours: number;
              alias: string;
              message: string;
              nextRunTime: Date;
            }>
          >;
          commitQueue: {
            __typename?: "CommitQueueParams";
            enabled?: Maybe<boolean>;
            requireSigned?: Maybe<boolean>;
            requiredApprovalCount?: Maybe<number>;
            mergeMethod: string;
            message: string;
          };
        }>;
        subscriptions?: Maybe<
          Array<{
            __typename?: "ProjectSubscription";
            id: string;
            resourceType: string;
            trigger: string;
            ownerType: string;
            triggerData?: Maybe<{ [key: string]: any }>;
            selectors: Array<{
              __typename?: "Selector";
              type: string;
              data: string;
            }>;
            regexSelectors: Array<{
              __typename?: "Selector";
              type: string;
              data: string;
            }>;
            subscriber?: Maybe<{
              __typename?: "ProjectSubscriber";
              type: string;
              subscriber: {
                __typename?: "Subscriber";
                jiraCommentSubscriber?: Maybe<string>;
                emailSubscriber?: Maybe<string>;
                slackSubscriber?: Maybe<string>;
                githubPRSubscriber?: Maybe<{
                  __typename?: "GithubPRSubscriber";
                  owner: string;
                  repo: string;
                  ref: string;
                  prNumber?: Maybe<number>;
                }>;
                githubCheckSubscriber?: Maybe<{
                  __typename?: "GithubCheckSubscriber";
                  owner: string;
                  repo: string;
                  ref: string;
                }>;
                webhookSubscriber?: Maybe<{
                  __typename?: "WebhookSubscriber";
                  url: string;
                  secret: string;
                  headers: Array<
                    Maybe<{
                      __typename?: "WebhookHeader";
                      key: string;
                      value: string;
                    }>
                  >;
                }>;
                jiraIssueSubscriber?: Maybe<{
                  __typename?: "JiraIssueSubscriber";
                  project: string;
                  issueType: string;
                }>;
              };
            }>;
          }>
        >;
        vars?: Maybe<{
          __typename?: "ProjectVars";
          vars?: Maybe<{ [key: string]: any }>;
          privateVars: Array<string>;
          adminOnlyVars: Array<string>;
        }>;
        aliases?: Maybe<
          Array<{
            __typename?: "ProjectAlias";
            id: string;
            alias: string;
            gitTag: string;
            variant: string;
            task: string;
            remotePath: string;
            variantTags: Array<string>;
            taskTags: Array<string>;
          }>
        >;
      }>;
      after?: Maybe<{
        __typename?: "ProjectEventSettings";
        githubWebhooksEnabled: boolean;
        projectRef?: Maybe<{
          __typename?: "Project";
          identifier: string;
          repoRefId: string;
          versionControlEnabled?: Maybe<boolean>;
          tracksPushEvents?: Maybe<boolean>;
          hidden?: Maybe<boolean>;
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
          stepbackDisabled?: Maybe<boolean>;
          patchingDisabled?: Maybe<boolean>;
          disabledStatsCache?: Maybe<boolean>;
          private?: Maybe<boolean>;
          restricted?: Maybe<boolean>;
          admins?: Maybe<Array<Maybe<string>>>;
          perfEnabled?: Maybe<boolean>;
          notifyOnBuildFailure?: Maybe<boolean>;
          githubTriggerAliases?: Maybe<Array<string>>;
          prTestingEnabled?: Maybe<boolean>;
          manualPrTestingEnabled?: Maybe<boolean>;
          githubChecksEnabled?: Maybe<boolean>;
          gitTagVersionsEnabled?: Maybe<boolean>;
          gitTagAuthorizedUsers?: Maybe<Array<string>>;
          gitTagAuthorizedTeams?: Maybe<Array<string>>;
          taskSync: {
            __typename?: "TaskSyncOptions";
            configEnabled?: Maybe<boolean>;
            patchEnabled?: Maybe<boolean>;
          };
          buildBaronSettings: {
            __typename?: "BuildBaronSettings";
            ticketCreateProject: string;
            ticketSearchProjects?: Maybe<Array<string>>;
          };
          taskAnnotationSettings: {
            __typename?: "TaskAnnotationSettings";
            jiraCustomFields?: Maybe<
              Array<{
                __typename?: "JiraField";
                field: string;
                displayText: string;
              }>
            >;
            fileTicketWebhook: {
              __typename?: "Webhook";
              endpoint: string;
              secret: string;
            };
          };
          patchTriggerAliases?: Maybe<
            Array<{
              __typename?: "PatchTriggerAlias";
              alias: string;
              childProjectIdentifier: string;
              status?: Maybe<string>;
              parentAsModule?: Maybe<string>;
              taskSpecifiers?: Maybe<
                Array<{
                  __typename?: "TaskSpecifier";
                  patchAlias: string;
                  taskRegex: string;
                  variantRegex: string;
                }>
              >;
            }>
          >;
          workstationConfig: {
            __typename?: "WorkstationConfig";
            gitClone?: Maybe<boolean>;
            setupCommands?: Maybe<
              Array<{
                __typename?: "WorkstationSetupCommand";
                command: string;
                directory: string;
              }>
            >;
          };
          triggers?: Maybe<
            Array<{
              __typename?: "TriggerAlias";
              project: string;
              level: string;
              buildVariantRegex: string;
              taskRegex: string;
              status: string;
              dateCutoff?: Maybe<number>;
              configFile: string;
              alias: string;
            }>
          >;
          periodicBuilds?: Maybe<
            Array<{
              __typename?: "PeriodicBuild";
              id: string;
              configFile: string;
              intervalHours: number;
              alias: string;
              message: string;
              nextRunTime: Date;
            }>
          >;
          commitQueue: {
            __typename?: "CommitQueueParams";
            enabled?: Maybe<boolean>;
            requireSigned?: Maybe<boolean>;
            requiredApprovalCount?: Maybe<number>;
            mergeMethod: string;
            message: string;
          };
        }>;
        subscriptions?: Maybe<
          Array<{
            __typename?: "ProjectSubscription";
            id: string;
            resourceType: string;
            trigger: string;
            ownerType: string;
            triggerData?: Maybe<{ [key: string]: any }>;
            selectors: Array<{
              __typename?: "Selector";
              type: string;
              data: string;
            }>;
            regexSelectors: Array<{
              __typename?: "Selector";
              type: string;
              data: string;
            }>;
            subscriber?: Maybe<{
              __typename?: "ProjectSubscriber";
              type: string;
              subscriber: {
                __typename?: "Subscriber";
                jiraCommentSubscriber?: Maybe<string>;
                emailSubscriber?: Maybe<string>;
                slackSubscriber?: Maybe<string>;
                githubPRSubscriber?: Maybe<{
                  __typename?: "GithubPRSubscriber";
                  owner: string;
                  repo: string;
                  ref: string;
                  prNumber?: Maybe<number>;
                }>;
                githubCheckSubscriber?: Maybe<{
                  __typename?: "GithubCheckSubscriber";
                  owner: string;
                  repo: string;
                  ref: string;
                }>;
                webhookSubscriber?: Maybe<{
                  __typename?: "WebhookSubscriber";
                  url: string;
                  secret: string;
                  headers: Array<
                    Maybe<{
                      __typename?: "WebhookHeader";
                      key: string;
                      value: string;
                    }>
                  >;
                }>;
                jiraIssueSubscriber?: Maybe<{
                  __typename?: "JiraIssueSubscriber";
                  project: string;
                  issueType: string;
                }>;
              };
            }>;
          }>
        >;
        vars?: Maybe<{
          __typename?: "ProjectVars";
          vars?: Maybe<{ [key: string]: any }>;
          privateVars: Array<string>;
          adminOnlyVars: Array<string>;
        }>;
        aliases?: Maybe<
          Array<{
            __typename?: "ProjectAlias";
            id: string;
            alias: string;
            gitTag: string;
            variant: string;
            task: string;
            remotePath: string;
            variantTags: Array<string>;
            taskTags: Array<string>;
          }>
        >;
      }>;
    }>;
  };
};

export type ProjectSettingsQueryVariables = Exact<{
  identifier: Scalars["String"];
}>;

export type ProjectSettingsQuery = {
  __typename?: "Query";
  projectSettings: {
    __typename?: "ProjectSettings";
    githubWebhooksEnabled: boolean;
    projectRef?: Maybe<{
      __typename?: "Project";
      id: string;
      identifier: string;
      repoRefId: string;
      enabled?: Maybe<boolean>;
      owner: string;
      repo: string;
      branch: string;
      displayName: string;
      batchTime: number;
      remotePath: string;
      spawnHostScriptPath: string;
      dispatchingDisabled?: Maybe<boolean>;
      versionControlEnabled?: Maybe<boolean>;
      deactivatePrevious?: Maybe<boolean>;
      repotrackerDisabled?: Maybe<boolean>;
      stepbackDisabled?: Maybe<boolean>;
      patchingDisabled?: Maybe<boolean>;
      disabledStatsCache?: Maybe<boolean>;
      private?: Maybe<boolean>;
      restricted?: Maybe<boolean>;
      admins?: Maybe<Array<Maybe<string>>>;
      perfEnabled?: Maybe<boolean>;
      notifyOnBuildFailure?: Maybe<boolean>;
      githubTriggerAliases?: Maybe<Array<string>>;
      prTestingEnabled?: Maybe<boolean>;
      manualPrTestingEnabled?: Maybe<boolean>;
      githubChecksEnabled?: Maybe<boolean>;
      gitTagVersionsEnabled?: Maybe<boolean>;
      gitTagAuthorizedUsers?: Maybe<Array<string>>;
      gitTagAuthorizedTeams?: Maybe<Array<string>>;
      taskSync: {
        __typename?: "TaskSyncOptions";
        configEnabled?: Maybe<boolean>;
        patchEnabled?: Maybe<boolean>;
      };
      buildBaronSettings: {
        __typename?: "BuildBaronSettings";
        ticketCreateProject: string;
        ticketSearchProjects?: Maybe<Array<string>>;
      };
      taskAnnotationSettings: {
        __typename?: "TaskAnnotationSettings";
        jiraCustomFields?: Maybe<
          Array<{
            __typename?: "JiraField";
            field: string;
            displayText: string;
          }>
        >;
        fileTicketWebhook: {
          __typename?: "Webhook";
          endpoint: string;
          secret: string;
        };
      };
      patchTriggerAliases?: Maybe<
        Array<{
          __typename?: "PatchTriggerAlias";
          alias: string;
          childProjectIdentifier: string;
          status?: Maybe<string>;
          parentAsModule?: Maybe<string>;
          taskSpecifiers?: Maybe<
            Array<{
              __typename?: "TaskSpecifier";
              patchAlias: string;
              taskRegex: string;
              variantRegex: string;
            }>
          >;
        }>
      >;
      workstationConfig: {
        __typename?: "WorkstationConfig";
        gitClone?: Maybe<boolean>;
        setupCommands?: Maybe<
          Array<{
            __typename?: "WorkstationSetupCommand";
            command: string;
            directory: string;
          }>
        >;
      };
      triggers?: Maybe<
        Array<{
          __typename?: "TriggerAlias";
          project: string;
          level: string;
          buildVariantRegex: string;
          taskRegex: string;
          status: string;
          dateCutoff?: Maybe<number>;
          configFile: string;
          alias: string;
        }>
      >;
      periodicBuilds?: Maybe<
        Array<{
          __typename?: "PeriodicBuild";
          id: string;
          configFile: string;
          intervalHours: number;
          alias: string;
          message: string;
          nextRunTime: Date;
        }>
      >;
      commitQueue: {
        __typename?: "CommitQueueParams";
        enabled?: Maybe<boolean>;
        requireSigned?: Maybe<boolean>;
        requiredApprovalCount?: Maybe<number>;
        mergeMethod: string;
        message: string;
      };
    }>;
    subscriptions?: Maybe<
      Array<{
        __typename?: "ProjectSubscription";
        id: string;
        resourceType: string;
        trigger: string;
        ownerType: string;
        triggerData?: Maybe<{ [key: string]: any }>;
        selectors: Array<{
          __typename?: "Selector";
          type: string;
          data: string;
        }>;
        regexSelectors: Array<{
          __typename?: "Selector";
          type: string;
          data: string;
        }>;
        subscriber?: Maybe<{
          __typename?: "ProjectSubscriber";
          type: string;
          subscriber: {
            __typename?: "Subscriber";
            jiraCommentSubscriber?: Maybe<string>;
            emailSubscriber?: Maybe<string>;
            slackSubscriber?: Maybe<string>;
            githubPRSubscriber?: Maybe<{
              __typename?: "GithubPRSubscriber";
              owner: string;
              repo: string;
              ref: string;
              prNumber?: Maybe<number>;
            }>;
            githubCheckSubscriber?: Maybe<{
              __typename?: "GithubCheckSubscriber";
              owner: string;
              repo: string;
              ref: string;
            }>;
            webhookSubscriber?: Maybe<{
              __typename?: "WebhookSubscriber";
              url: string;
              secret: string;
              headers: Array<
                Maybe<{
                  __typename?: "WebhookHeader";
                  key: string;
                  value: string;
                }>
              >;
            }>;
            jiraIssueSubscriber?: Maybe<{
              __typename?: "JiraIssueSubscriber";
              project: string;
              issueType: string;
            }>;
          };
        }>;
      }>
    >;
    vars?: Maybe<{
      __typename?: "ProjectVars";
      vars?: Maybe<{ [key: string]: any }>;
      privateVars: Array<string>;
      adminOnlyVars: Array<string>;
    }>;
    aliases?: Maybe<
      Array<{
        __typename?: "ProjectAlias";
        id: string;
        alias: string;
        gitTag: string;
        variant: string;
        task: string;
        remotePath: string;
        variantTags: Array<string>;
        taskTags: Array<string>;
      }>
    >;
  };
};

export type GetProjectsQueryVariables = Exact<{ [key: string]: never }>;

export type GetProjectsQuery = {
  __typename?: "Query";
  projects: Array<
    Maybe<{
      __typename?: "GroupedProjects";
      groupDisplayName: string;
      projects: Array<{
        __typename?: "Project";
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
  __typename?: "Query";
  myPublicKeys: Array<{ __typename?: "PublicKey"; name: string; key: string }>;
};

export type RepoEventLogsQueryVariables = Exact<{
  id: Scalars["String"];
  limit?: InputMaybe<Scalars["Int"]>;
  before?: InputMaybe<Scalars["Time"]>;
}>;

export type RepoEventLogsQuery = {
  __typename?: "Query";
  repoEvents: {
    __typename?: "ProjectEvents";
    count: number;
    eventLogEntries: Array<{
      __typename?: "ProjectEventLogEntry";
      timestamp: Date;
      user: string;
      before?: Maybe<{
        __typename?: "ProjectEventSettings";
        githubWebhooksEnabled: boolean;
        projectRef?: Maybe<{
          __typename?: "Project";
          identifier: string;
          repoRefId: string;
          versionControlEnabled?: Maybe<boolean>;
          tracksPushEvents?: Maybe<boolean>;
          hidden?: Maybe<boolean>;
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
          stepbackDisabled?: Maybe<boolean>;
          patchingDisabled?: Maybe<boolean>;
          disabledStatsCache?: Maybe<boolean>;
          private?: Maybe<boolean>;
          restricted?: Maybe<boolean>;
          admins?: Maybe<Array<Maybe<string>>>;
          perfEnabled?: Maybe<boolean>;
          notifyOnBuildFailure?: Maybe<boolean>;
          githubTriggerAliases?: Maybe<Array<string>>;
          prTestingEnabled?: Maybe<boolean>;
          manualPrTestingEnabled?: Maybe<boolean>;
          githubChecksEnabled?: Maybe<boolean>;
          gitTagVersionsEnabled?: Maybe<boolean>;
          gitTagAuthorizedUsers?: Maybe<Array<string>>;
          gitTagAuthorizedTeams?: Maybe<Array<string>>;
          taskSync: {
            __typename?: "TaskSyncOptions";
            configEnabled?: Maybe<boolean>;
            patchEnabled?: Maybe<boolean>;
          };
          buildBaronSettings: {
            __typename?: "BuildBaronSettings";
            ticketCreateProject: string;
            ticketSearchProjects?: Maybe<Array<string>>;
          };
          taskAnnotationSettings: {
            __typename?: "TaskAnnotationSettings";
            jiraCustomFields?: Maybe<
              Array<{
                __typename?: "JiraField";
                field: string;
                displayText: string;
              }>
            >;
            fileTicketWebhook: {
              __typename?: "Webhook";
              endpoint: string;
              secret: string;
            };
          };
          patchTriggerAliases?: Maybe<
            Array<{
              __typename?: "PatchTriggerAlias";
              alias: string;
              childProjectIdentifier: string;
              status?: Maybe<string>;
              parentAsModule?: Maybe<string>;
              taskSpecifiers?: Maybe<
                Array<{
                  __typename?: "TaskSpecifier";
                  patchAlias: string;
                  taskRegex: string;
                  variantRegex: string;
                }>
              >;
            }>
          >;
          workstationConfig: {
            __typename?: "WorkstationConfig";
            gitClone?: Maybe<boolean>;
            setupCommands?: Maybe<
              Array<{
                __typename?: "WorkstationSetupCommand";
                command: string;
                directory: string;
              }>
            >;
          };
          triggers?: Maybe<
            Array<{
              __typename?: "TriggerAlias";
              project: string;
              level: string;
              buildVariantRegex: string;
              taskRegex: string;
              status: string;
              dateCutoff?: Maybe<number>;
              configFile: string;
              alias: string;
            }>
          >;
          periodicBuilds?: Maybe<
            Array<{
              __typename?: "PeriodicBuild";
              id: string;
              configFile: string;
              intervalHours: number;
              alias: string;
              message: string;
              nextRunTime: Date;
            }>
          >;
          commitQueue: {
            __typename?: "CommitQueueParams";
            enabled?: Maybe<boolean>;
            requireSigned?: Maybe<boolean>;
            requiredApprovalCount?: Maybe<number>;
            mergeMethod: string;
            message: string;
          };
        }>;
        subscriptions?: Maybe<
          Array<{
            __typename?: "ProjectSubscription";
            id: string;
            resourceType: string;
            trigger: string;
            ownerType: string;
            triggerData?: Maybe<{ [key: string]: any }>;
            selectors: Array<{
              __typename?: "Selector";
              type: string;
              data: string;
            }>;
            regexSelectors: Array<{
              __typename?: "Selector";
              type: string;
              data: string;
            }>;
            subscriber?: Maybe<{
              __typename?: "ProjectSubscriber";
              type: string;
              subscriber: {
                __typename?: "Subscriber";
                jiraCommentSubscriber?: Maybe<string>;
                emailSubscriber?: Maybe<string>;
                slackSubscriber?: Maybe<string>;
                githubPRSubscriber?: Maybe<{
                  __typename?: "GithubPRSubscriber";
                  owner: string;
                  repo: string;
                  ref: string;
                  prNumber?: Maybe<number>;
                }>;
                githubCheckSubscriber?: Maybe<{
                  __typename?: "GithubCheckSubscriber";
                  owner: string;
                  repo: string;
                  ref: string;
                }>;
                webhookSubscriber?: Maybe<{
                  __typename?: "WebhookSubscriber";
                  url: string;
                  secret: string;
                  headers: Array<
                    Maybe<{
                      __typename?: "WebhookHeader";
                      key: string;
                      value: string;
                    }>
                  >;
                }>;
                jiraIssueSubscriber?: Maybe<{
                  __typename?: "JiraIssueSubscriber";
                  project: string;
                  issueType: string;
                }>;
              };
            }>;
          }>
        >;
        vars?: Maybe<{
          __typename?: "ProjectVars";
          vars?: Maybe<{ [key: string]: any }>;
          privateVars: Array<string>;
          adminOnlyVars: Array<string>;
        }>;
        aliases?: Maybe<
          Array<{
            __typename?: "ProjectAlias";
            id: string;
            alias: string;
            gitTag: string;
            variant: string;
            task: string;
            remotePath: string;
            variantTags: Array<string>;
            taskTags: Array<string>;
          }>
        >;
      }>;
      after?: Maybe<{
        __typename?: "ProjectEventSettings";
        githubWebhooksEnabled: boolean;
        projectRef?: Maybe<{
          __typename?: "Project";
          identifier: string;
          repoRefId: string;
          versionControlEnabled?: Maybe<boolean>;
          tracksPushEvents?: Maybe<boolean>;
          hidden?: Maybe<boolean>;
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
          stepbackDisabled?: Maybe<boolean>;
          patchingDisabled?: Maybe<boolean>;
          disabledStatsCache?: Maybe<boolean>;
          private?: Maybe<boolean>;
          restricted?: Maybe<boolean>;
          admins?: Maybe<Array<Maybe<string>>>;
          perfEnabled?: Maybe<boolean>;
          notifyOnBuildFailure?: Maybe<boolean>;
          githubTriggerAliases?: Maybe<Array<string>>;
          prTestingEnabled?: Maybe<boolean>;
          manualPrTestingEnabled?: Maybe<boolean>;
          githubChecksEnabled?: Maybe<boolean>;
          gitTagVersionsEnabled?: Maybe<boolean>;
          gitTagAuthorizedUsers?: Maybe<Array<string>>;
          gitTagAuthorizedTeams?: Maybe<Array<string>>;
          taskSync: {
            __typename?: "TaskSyncOptions";
            configEnabled?: Maybe<boolean>;
            patchEnabled?: Maybe<boolean>;
          };
          buildBaronSettings: {
            __typename?: "BuildBaronSettings";
            ticketCreateProject: string;
            ticketSearchProjects?: Maybe<Array<string>>;
          };
          taskAnnotationSettings: {
            __typename?: "TaskAnnotationSettings";
            jiraCustomFields?: Maybe<
              Array<{
                __typename?: "JiraField";
                field: string;
                displayText: string;
              }>
            >;
            fileTicketWebhook: {
              __typename?: "Webhook";
              endpoint: string;
              secret: string;
            };
          };
          patchTriggerAliases?: Maybe<
            Array<{
              __typename?: "PatchTriggerAlias";
              alias: string;
              childProjectIdentifier: string;
              status?: Maybe<string>;
              parentAsModule?: Maybe<string>;
              taskSpecifiers?: Maybe<
                Array<{
                  __typename?: "TaskSpecifier";
                  patchAlias: string;
                  taskRegex: string;
                  variantRegex: string;
                }>
              >;
            }>
          >;
          workstationConfig: {
            __typename?: "WorkstationConfig";
            gitClone?: Maybe<boolean>;
            setupCommands?: Maybe<
              Array<{
                __typename?: "WorkstationSetupCommand";
                command: string;
                directory: string;
              }>
            >;
          };
          triggers?: Maybe<
            Array<{
              __typename?: "TriggerAlias";
              project: string;
              level: string;
              buildVariantRegex: string;
              taskRegex: string;
              status: string;
              dateCutoff?: Maybe<number>;
              configFile: string;
              alias: string;
            }>
          >;
          periodicBuilds?: Maybe<
            Array<{
              __typename?: "PeriodicBuild";
              id: string;
              configFile: string;
              intervalHours: number;
              alias: string;
              message: string;
              nextRunTime: Date;
            }>
          >;
          commitQueue: {
            __typename?: "CommitQueueParams";
            enabled?: Maybe<boolean>;
            requireSigned?: Maybe<boolean>;
            requiredApprovalCount?: Maybe<number>;
            mergeMethod: string;
            message: string;
          };
        }>;
        subscriptions?: Maybe<
          Array<{
            __typename?: "ProjectSubscription";
            id: string;
            resourceType: string;
            trigger: string;
            ownerType: string;
            triggerData?: Maybe<{ [key: string]: any }>;
            selectors: Array<{
              __typename?: "Selector";
              type: string;
              data: string;
            }>;
            regexSelectors: Array<{
              __typename?: "Selector";
              type: string;
              data: string;
            }>;
            subscriber?: Maybe<{
              __typename?: "ProjectSubscriber";
              type: string;
              subscriber: {
                __typename?: "Subscriber";
                jiraCommentSubscriber?: Maybe<string>;
                emailSubscriber?: Maybe<string>;
                slackSubscriber?: Maybe<string>;
                githubPRSubscriber?: Maybe<{
                  __typename?: "GithubPRSubscriber";
                  owner: string;
                  repo: string;
                  ref: string;
                  prNumber?: Maybe<number>;
                }>;
                githubCheckSubscriber?: Maybe<{
                  __typename?: "GithubCheckSubscriber";
                  owner: string;
                  repo: string;
                  ref: string;
                }>;
                webhookSubscriber?: Maybe<{
                  __typename?: "WebhookSubscriber";
                  url: string;
                  secret: string;
                  headers: Array<
                    Maybe<{
                      __typename?: "WebhookHeader";
                      key: string;
                      value: string;
                    }>
                  >;
                }>;
                jiraIssueSubscriber?: Maybe<{
                  __typename?: "JiraIssueSubscriber";
                  project: string;
                  issueType: string;
                }>;
              };
            }>;
          }>
        >;
        vars?: Maybe<{
          __typename?: "ProjectVars";
          vars?: Maybe<{ [key: string]: any }>;
          privateVars: Array<string>;
          adminOnlyVars: Array<string>;
        }>;
        aliases?: Maybe<
          Array<{
            __typename?: "ProjectAlias";
            id: string;
            alias: string;
            gitTag: string;
            variant: string;
            task: string;
            remotePath: string;
            variantTags: Array<string>;
            taskTags: Array<string>;
          }>
        >;
      }>;
    }>;
  };
};

export type RepoSettingsQueryVariables = Exact<{
  repoId: Scalars["String"];
}>;

export type RepoSettingsQuery = {
  __typename?: "Query";
  repoSettings: {
    __typename?: "RepoSettings";
    githubWebhooksEnabled: boolean;
    projectRef?: Maybe<{
      __typename?: "RepoRef";
      id: string;
      displayName: string;
      owner: string;
      repo: string;
      branch: string;
      batchTime: number;
      remotePath: string;
      spawnHostScriptPath: string;
      dispatchingDisabled: boolean;
      versionControlEnabled: boolean;
      deactivatePrevious: boolean;
      repotrackerDisabled: boolean;
      stepbackDisabled: boolean;
      patchingDisabled: boolean;
      disabledStatsCache: boolean;
      private: boolean;
      restricted: boolean;
      admins: Array<string>;
      perfEnabled: boolean;
      notifyOnBuildFailure: boolean;
      githubTriggerAliases?: Maybe<Array<string>>;
      prTestingEnabled: boolean;
      manualPrTestingEnabled: boolean;
      githubChecksEnabled: boolean;
      gitTagVersionsEnabled: boolean;
      gitTagAuthorizedUsers?: Maybe<Array<string>>;
      gitTagAuthorizedTeams?: Maybe<Array<string>>;
      taskSync: {
        __typename?: "RepoTaskSyncOptions";
        configEnabled: boolean;
        patchEnabled: boolean;
      };
      buildBaronSettings: {
        __typename?: "BuildBaronSettings";
        ticketCreateProject: string;
        ticketSearchProjects?: Maybe<Array<string>>;
      };
      taskAnnotationSettings: {
        __typename?: "TaskAnnotationSettings";
        jiraCustomFields?: Maybe<
          Array<{
            __typename?: "JiraField";
            field: string;
            displayText: string;
          }>
        >;
        fileTicketWebhook: {
          __typename?: "Webhook";
          endpoint: string;
          secret: string;
        };
      };
      patchTriggerAliases?: Maybe<
        Array<{
          __typename?: "PatchTriggerAlias";
          alias: string;
          childProjectIdentifier: string;
          status?: Maybe<string>;
          parentAsModule?: Maybe<string>;
          taskSpecifiers?: Maybe<
            Array<{
              __typename?: "TaskSpecifier";
              patchAlias: string;
              taskRegex: string;
              variantRegex: string;
            }>
          >;
        }>
      >;
      workstationConfig: {
        __typename?: "RepoWorkstationConfig";
        gitClone: boolean;
        setupCommands?: Maybe<
          Array<{
            __typename?: "WorkstationSetupCommand";
            command: string;
            directory: string;
          }>
        >;
      };
      triggers: Array<{
        __typename?: "TriggerAlias";
        project: string;
        level: string;
        buildVariantRegex: string;
        taskRegex: string;
        status: string;
        dateCutoff?: Maybe<number>;
        configFile: string;
        alias: string;
      }>;
      periodicBuilds?: Maybe<
        Array<{
          __typename?: "PeriodicBuild";
          id: string;
          configFile: string;
          intervalHours: number;
          alias: string;
          message: string;
          nextRunTime: Date;
        }>
      >;
      commitQueue: {
        __typename?: "RepoCommitQueueParams";
        enabled: boolean;
        requireSigned: boolean;
        requiredApprovalCount: number;
        mergeMethod: string;
        message: string;
      };
    }>;
    vars?: Maybe<{
      __typename?: "ProjectVars";
      vars?: Maybe<{ [key: string]: any }>;
      privateVars: Array<string>;
      adminOnlyVars: Array<string>;
    }>;
    subscriptions?: Maybe<
      Array<{
        __typename?: "ProjectSubscription";
        id: string;
        resourceType: string;
        trigger: string;
        ownerType: string;
        triggerData?: Maybe<{ [key: string]: any }>;
        selectors: Array<{
          __typename?: "Selector";
          type: string;
          data: string;
        }>;
        regexSelectors: Array<{
          __typename?: "Selector";
          type: string;
          data: string;
        }>;
        subscriber?: Maybe<{
          __typename?: "ProjectSubscriber";
          type: string;
          subscriber: {
            __typename?: "Subscriber";
            jiraCommentSubscriber?: Maybe<string>;
            emailSubscriber?: Maybe<string>;
            slackSubscriber?: Maybe<string>;
            githubPRSubscriber?: Maybe<{
              __typename?: "GithubPRSubscriber";
              owner: string;
              repo: string;
              ref: string;
              prNumber?: Maybe<number>;
            }>;
            githubCheckSubscriber?: Maybe<{
              __typename?: "GithubCheckSubscriber";
              owner: string;
              repo: string;
              ref: string;
            }>;
            webhookSubscriber?: Maybe<{
              __typename?: "WebhookSubscriber";
              url: string;
              secret: string;
              headers: Array<
                Maybe<{
                  __typename?: "WebhookHeader";
                  key: string;
                  value: string;
                }>
              >;
            }>;
            jiraIssueSubscriber?: Maybe<{
              __typename?: "JiraIssueSubscriber";
              project: string;
              issueType: string;
            }>;
          };
        }>;
      }>
    >;
    aliases?: Maybe<
      Array<{
        __typename?: "ProjectAlias";
        id: string;
        alias: string;
        gitTag: string;
        variant: string;
        task: string;
        remotePath: string;
        variantTags: Array<string>;
        taskTags: Array<string>;
      }>
    >;
  };
};

export type GetSpruceConfigQueryVariables = Exact<{ [key: string]: never }>;

export type GetSpruceConfigQuery = {
  __typename?: "Query";
  spruceConfig?: Maybe<{
    __typename?: "SpruceConfig";
    bannerTheme?: Maybe<string>;
    banner?: Maybe<string>;
    ui?: Maybe<{
      __typename?: "UIConfig";
      userVoice?: Maybe<string>;
      defaultProject: string;
    }>;
    jira?: Maybe<{ __typename?: "JiraConfig"; host?: Maybe<string> }>;
    providers?: Maybe<{
      __typename?: "CloudProviderConfig";
      aws?: Maybe<{
        __typename?: "AWSConfig";
        maxVolumeSizePerUser?: Maybe<number>;
      }>;
    }>;
    spawnHost: {
      __typename?: "SpawnHostConfig";
      spawnHostsPerUser: number;
      unexpirableHostsPerUser: number;
      unexpirableVolumesPerUser: number;
    };
    slack?: Maybe<{ __typename?: "SlackConfig"; name?: Maybe<string> }>;
  }>;
};

export type SystemLogsQueryVariables = Exact<{
  id: Scalars["String"];
  execution?: InputMaybe<Scalars["Int"]>;
}>;

export type SystemLogsQuery = {
  __typename?: "Query";
  task?: Maybe<{
    __typename?: "Task";
    id: string;
    execution: number;
    taskLogs: {
      __typename?: "TaskLogs";
      systemLogs: Array<{
        __typename?: "LogMessage";
        severity?: Maybe<string>;
        message?: Maybe<string>;
        timestamp?: Maybe<Date>;
      }>;
    };
  }>;
};

export type GetTaskAllExecutionsQueryVariables = Exact<{
  taskId: Scalars["String"];
}>;

export type GetTaskAllExecutionsQuery = {
  __typename?: "Query";
  taskAllExecutions: Array<{
    __typename?: "Task";
    id: string;
    execution: number;
    status: string;
    ingestTime?: Maybe<Date>;
    activatedTime?: Maybe<Date>;
  }>;
};

export type TaskEventLogsQueryVariables = Exact<{
  id: Scalars["String"];
  execution?: InputMaybe<Scalars["Int"]>;
}>;

export type TaskEventLogsQuery = {
  __typename?: "Query";
  task?: Maybe<{
    __typename?: "Task";
    execution: number;
    id: string;
    taskLogs: {
      __typename?: "TaskLogs";
      eventLogs: Array<{
        __typename?: "TaskEventLogEntry";
        timestamp?: Maybe<Date>;
        eventType?: Maybe<string>;
        data: {
          __typename?: "TaskEventLogData";
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
  }>;
};

export type TaskFilesQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution?: InputMaybe<Scalars["Int"]>;
}>;

export type TaskFilesQuery = {
  __typename?: "Query";
  task?: Maybe<{
    __typename?: "Task";
    id: string;
    execution: number;
    taskFiles: {
      __typename?: "TaskFiles";
      fileCount: number;
      groupedFiles: Array<{
        __typename?: "GroupedFiles";
        taskName?: Maybe<string>;
        files?: Maybe<
          Array<{ __typename?: "File"; name: string; link: string }>
        >;
      }>;
    };
  }>;
};

export type TaskLogsQueryVariables = Exact<{
  id: Scalars["String"];
  execution?: InputMaybe<Scalars["Int"]>;
}>;

export type TaskLogsQuery = {
  __typename?: "Query";
  task?: Maybe<{
    __typename?: "Task";
    id: string;
    execution: number;
    taskLogs: {
      __typename?: "TaskLogs";
      taskLogs: Array<{
        __typename?: "LogMessage";
        severity?: Maybe<string>;
        message?: Maybe<string>;
        timestamp?: Maybe<Date>;
      }>;
    };
  }>;
};

export type GetTaskNamesForBuildVariantQueryVariables = Exact<{
  projectIdentifier: Scalars["String"];
  buildVariant: Scalars["String"];
}>;

export type GetTaskNamesForBuildVariantQuery = {
  __typename?: "Query";
  taskNamesForBuildVariant?: Maybe<Array<string>>;
};

export type GetTaskStatusesQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type GetTaskStatusesQuery = {
  __typename?: "Query";
  version: {
    __typename?: "Version";
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
  __typename?: "Query";
  taskTestSample?: Maybe<
    Array<{
      __typename?: "TaskTestResultSample";
      taskId: string;
      execution: number;
      matchingFailedTestNames: Array<string>;
      totalTestCount: number;
    }>
  >;
};

export type TaskTestsQueryVariables = Exact<{
  dir?: InputMaybe<SortDirection>;
  id: Scalars["String"];
  cat?: InputMaybe<TestSortCategory>;
  pageNum?: InputMaybe<Scalars["Int"]>;
  limitNum?: InputMaybe<Scalars["Int"]>;
  statusList: Array<Scalars["String"]>;
  testName: Scalars["String"];
  execution?: InputMaybe<Scalars["Int"]>;
}>;

export type TaskTestsQuery = {
  __typename?: "Query";
  taskTests: {
    __typename?: "TaskTestResult";
    filteredTestCount: number;
    totalTestCount: number;
    testResults: Array<{
      __typename?: "TestResult";
      testFile: string;
      id: string;
      status: string;
      baseStatus?: Maybe<string>;
      duration?: Maybe<number>;
      logs: {
        __typename?: "TestLog";
        url?: Maybe<string>;
        urlRaw?: Maybe<string>;
        urlParsley?: Maybe<string>;
        urlLobster?: Maybe<string>;
      };
    }>;
  };
};

export type GetTaskQueryVariables = Exact<{
  taskId: Scalars["String"];
  execution?: InputMaybe<Scalars["Int"]>;
}>;

export type GetTaskQuery = {
  __typename?: "Query";
  task?: Maybe<{
    __typename?: "Task";
    aborted: boolean;
    activatedBy?: Maybe<string>;
    activatedTime?: Maybe<Date>;
    ami?: Maybe<string>;
    blocked: boolean;
    canAbort: boolean;
    canDisable: boolean;
    canModifyAnnotation: boolean;
    canOverrideDependencies: boolean;
    canRestart: boolean;
    canSchedule: boolean;
    canSetPriority: boolean;
    canUnschedule: boolean;
    distroId: string;
    estimatedStart?: Maybe<number>;
    expectedDuration?: Maybe<number>;
    failedTestCount: number;
    finishTime?: Maybe<Date>;
    generatedBy?: Maybe<string>;
    generatedByName?: Maybe<string>;
    hostId?: Maybe<string>;
    ingestTime?: Maybe<Date>;
    isPerfPluginEnabled: boolean;
    latestExecution: number;
    minQueuePosition: number;
    order: number;
    patchNumber?: Maybe<number>;
    priority?: Maybe<number>;
    resetWhenFinished: boolean;
    requester: string;
    spawnHostLink?: Maybe<string>;
    startTime?: Maybe<Date>;
    timeTaken?: Maybe<number>;
    totalTestCount: number;
    id: string;
    execution: number;
    buildVariant: string;
    displayName: string;
    revision?: Maybe<string>;
    status: string;
    abortInfo?: Maybe<{
      __typename?: "AbortInfo";
      buildVariantDisplayName: string;
      newVersion: string;
      prClosed: boolean;
      taskDisplayName: string;
      taskID: string;
      user: string;
    }>;
    annotation?: Maybe<{
      __typename?: "Annotation";
      id: string;
      taskId: string;
      taskExecution: number;
      webhookConfigured: boolean;
      note?: Maybe<{
        __typename?: "Note";
        message: string;
        source: {
          __typename?: "Source";
          author: string;
          time: Date;
          requester: string;
        };
      }>;
      issues?: Maybe<
        Array<
          Maybe<{
            __typename?: "IssueLink";
            issueKey?: Maybe<string>;
            url?: Maybe<string>;
            source?: Maybe<{
              __typename?: "Source";
              author: string;
              time: Date;
              requester: string;
            }>;
          }>
        >
      >;
      suspectedIssues?: Maybe<
        Array<
          Maybe<{
            __typename?: "IssueLink";
            issueKey?: Maybe<string>;
            url?: Maybe<string>;
            source?: Maybe<{
              __typename?: "Source";
              author: string;
              time: Date;
              requester: string;
            }>;
          }>
        >
      >;
      createdIssues?: Maybe<
        Array<
          Maybe<{
            __typename?: "IssueLink";
            issueKey?: Maybe<string>;
            url?: Maybe<string>;
            source?: Maybe<{
              __typename?: "Source";
              author: string;
              time: Date;
              requester: string;
            }>;
          }>
        >
      >;
    }>;
    baseTask?: Maybe<{
      __typename?: "Task";
      id: string;
      execution: number;
      timeTaken?: Maybe<number>;
    }>;
    dependsOn?: Maybe<
      Array<{
        __typename?: "Dependency";
        buildVariant: string;
        metStatus: MetStatus;
        name: string;
        requiredStatus: RequiredStatus;
        taskId: string;
      }>
    >;
    details?: Maybe<{
      __typename?: "TaskEndDetail";
      description?: Maybe<string>;
      status: string;
      timedOut?: Maybe<boolean>;
      timeoutType?: Maybe<string>;
      type: string;
      oomTracker: {
        __typename?: "OomTrackerInfo";
        detected: boolean;
        pids?: Maybe<Array<Maybe<number>>>;
      };
    }>;
    displayTask?: Maybe<{
      __typename?: "Task";
      id: string;
      displayName: string;
      execution: number;
    }>;
    executionTasksFull?: Maybe<
      Array<{
        __typename?: "Task";
        id: string;
        baseStatus?: Maybe<string>;
        buildVariant: string;
        buildVariantDisplayName?: Maybe<string>;
        displayName: string;
        execution: number;
        status: string;
      }>
    >;
    logs: {
      __typename?: "TaskLogLinks";
      allLogLink?: Maybe<string>;
      agentLogLink?: Maybe<string>;
      eventLogLink?: Maybe<string>;
      systemLogLink?: Maybe<string>;
      taskLogLink?: Maybe<string>;
    };
    project?: Maybe<{ __typename?: "Project"; identifier: string }>;
    taskFiles: { __typename?: "TaskFiles"; fileCount: number };
    versionMetadata: {
      __typename?: "Version";
      id: string;
      author: string;
      isPatch: boolean;
      project: string;
      projectIdentifier: string;
      message: string;
      order: number;
      revision: string;
    };
  }>;
};

export type GetTestsQueryVariables = Exact<{
  execution?: InputMaybe<Scalars["Int"]>;
  groupId?: InputMaybe<Scalars["String"]>;
  taskId: Scalars["String"];
  pageNum?: InputMaybe<Scalars["Int"]>;
  limitNum?: InputMaybe<Scalars["Int"]>;
  testName?: InputMaybe<Scalars["String"]>;
}>;

export type GetTestsQuery = {
  __typename?: "Query";
  taskTests: {
    __typename?: "TaskTestResult";
    filteredTestCount: number;
    testResults: Array<{
      __typename?: "TestResult";
      id: string;
      testFile: string;
      logs: {
        __typename?: "TestLog";
        url?: Maybe<string>;
        urlParsley?: Maybe<string>;
      };
    }>;
  };
};

export type GetUndispatchedTasksQueryVariables = Exact<{
  versionId: Scalars["String"];
}>;

export type GetUndispatchedTasksQuery = {
  __typename?: "Query";
  version: {
    __typename?: "Version";
    tasks: {
      __typename?: "VersionTasks";
      data: Array<{
        __typename?: "Task";
        id: string;
        buildVariant: string;
        buildVariantDisplayName?: Maybe<string>;
        displayName: string;
        execution: number;
      }>;
    };
  };
};

export type GetUserConfigQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserConfigQuery = {
  __typename?: "Query";
  userConfig?: Maybe<{
    __typename?: "UserConfig";
    api_key: string;
    api_server_host: string;
    ui_server_host: string;
    user: string;
  }>;
};

export type GetUserPermissionsQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserPermissionsQuery = {
  __typename?: "Query";
  user: {
    __typename?: "User";
    userId: string;
    permissions: { __typename?: "Permissions"; canCreateProject: boolean };
  };
};

export type GetUserSettingsQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserSettingsQuery = {
  __typename?: "Query";
  userSettings?: Maybe<{
    __typename?: "UserSettings";
    timezone?: Maybe<string>;
    region?: Maybe<string>;
    slackUsername?: Maybe<string>;
    slackMemberId?: Maybe<string>;
    dateFormat?: Maybe<string>;
    notifications?: Maybe<{
      __typename?: "Notifications";
      buildBreak?: Maybe<string>;
      commitQueue?: Maybe<string>;
      patchFinish?: Maybe<string>;
      patchFirstFailure?: Maybe<string>;
      spawnHostExpiration?: Maybe<string>;
      spawnHostOutcome?: Maybe<string>;
    }>;
    githubUser?: Maybe<{
      __typename?: "GithubUser";
      lastKnownAs?: Maybe<string>;
    }>;
    useSpruceOptions?: Maybe<{
      __typename?: "UseSpruceOptions";
      hasUsedSpruceBefore?: Maybe<boolean>;
      spruceV1?: Maybe<boolean>;
      hasUsedMainlineCommitsBefore?: Maybe<boolean>;
    }>;
  }>;
};

export type GetUserQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserQuery = {
  __typename?: "Query";
  user: {
    __typename?: "User";
    userId: string;
    displayName: string;
    emailAddress: string;
  };
};

export type VersionTaskDurationsQueryVariables = Exact<{
  versionId: Scalars["String"];
  taskFilterOptions: TaskFilterOptions;
}>;

export type VersionTaskDurationsQuery = {
  __typename?: "Query";
  version: {
    __typename?: "Version";
    tasks: {
      __typename?: "VersionTasks";
      count: number;
      data: Array<{
        __typename?: "Task";
        id: string;
        buildVariantDisplayName?: Maybe<string>;
        displayName: string;
        execution: number;
        startTime?: Maybe<Date>;
        status: string;
        timeTaken?: Maybe<number>;
        executionTasksFull?: Maybe<
          Array<{
            __typename?: "Task";
            id: string;
            buildVariantDisplayName?: Maybe<string>;
            displayName: string;
            execution: number;
            startTime?: Maybe<Date>;
            status: string;
            timeTaken?: Maybe<number>;
          }>
        >;
      }>;
    };
  };
};

export type VersionTasksQueryVariables = Exact<{
  versionId: Scalars["String"];
  taskFilterOptions: TaskFilterOptions;
}>;

export type VersionTasksQuery = {
  __typename?: "Query";
  version: {
    __typename?: "Version";
    id: string;
    tasks: {
      __typename?: "VersionTasks";
      count: number;
      data: Array<{
        __typename?: "Task";
        id: string;
        aborted: boolean;
        buildVariant: string;
        buildVariantDisplayName?: Maybe<string>;
        blocked: boolean;
        displayName: string;
        execution: number;
        projectIdentifier?: Maybe<string>;
        status: string;
        baseTask?: Maybe<{
          __typename?: "Task";
          id: string;
          execution: number;
          status: string;
        }>;
        executionTasksFull?: Maybe<
          Array<{
            __typename?: "Task";
            id: string;
            buildVariant: string;
            buildVariantDisplayName?: Maybe<string>;
            displayName: string;
            execution: number;
            projectIdentifier?: Maybe<string>;
            status: string;
            baseTask?: Maybe<{
              __typename?: "Task";
              id: string;
              execution: number;
              status: string;
            }>;
          }>
        >;
      }>;
    };
  };
};

export type VersionQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type VersionQuery = {
  __typename?: "Query";
  version: {
    __typename?: "Version";
    id: string;
    activated?: Maybe<boolean>;
    author: string;
    createTime: Date;
    errors: Array<string>;
    finishTime?: Maybe<Date>;
    isPatch: boolean;
    message: string;
    order: number;
    project: string;
    projectIdentifier: string;
    repo: string;
    revision: string;
    startTime?: Maybe<Date>;
    status: string;
    taskCount?: Maybe<number>;
    warnings: Array<string>;
    baseVersion?: Maybe<{ __typename?: "Version"; id: string }>;
    manifest?: Maybe<{
      __typename?: "Manifest";
      id: string;
      branch: string;
      isBase: boolean;
      modules?: Maybe<any>;
      moduleOverrides?: Maybe<{ [key: string]: any }>;
      project: string;
      revision: string;
    }>;
    parameters: Array<{ __typename?: "Parameter"; key: string; value: string }>;
    patch?: Maybe<{
      __typename?: "Patch";
      id: string;
      alias?: Maybe<string>;
      canEnqueueToCommitQueue: boolean;
      commitQueuePosition?: Maybe<number>;
      patchNumber: number;
      childPatches?: Maybe<
        Array<{
          __typename?: "Patch";
          id: string;
          githash: string;
          projectIdentifier: string;
          status: string;
          taskCount?: Maybe<number>;
          versionFull?: Maybe<{
            __typename?: "Version";
            id: string;
            status: string;
            baseVersion?: Maybe<{ __typename?: "Version"; id: string }>;
          }>;
        }>
      >;
    }>;
    previousVersion?: Maybe<{
      __typename?: "Version";
      id: string;
      revision: string;
    }>;
    projectMetadata?: Maybe<{
      __typename?: "Project";
      owner: string;
      repo: string;
    }>;
    versionTiming?: Maybe<{
      __typename?: "VersionTiming";
      makespan?: Maybe<number>;
      timeTaken?: Maybe<number>;
    }>;
    upstreamProject?: Maybe<{
      __typename?: "UpstreamProject";
      triggerID: string;
      triggerType: string;
      repo: string;
      project: string;
      task?: Maybe<{ __typename?: "Task"; id: string; execution: number }>;
      version?: Maybe<{ __typename?: "Version"; id: string }>;
    }>;
  };
};

export type GetViewableProjectRefsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetViewableProjectRefsQuery = {
  __typename?: "Query";
  viewableProjectRefs: Array<
    Maybe<{
      __typename?: "GroupedProjects";
      groupDisplayName: string;
      repo?: Maybe<{ __typename?: "RepoRef"; id: string }>;
      projects: Array<{
        __typename?: "Project";
        id: string;
        identifier: string;
        repo: string;
        owner: string;
        displayName: string;
        isFavorite: boolean;
        enabled?: Maybe<boolean>;
      }>;
    }>
  >;
};

export type HostsQueryVariables = Exact<{
  hostId?: InputMaybe<Scalars["String"]>;
  distroId?: InputMaybe<Scalars["String"]>;
  currentTaskId?: InputMaybe<Scalars["String"]>;
  statuses?: InputMaybe<Array<Scalars["String"]>>;
  startedBy?: InputMaybe<Scalars["String"]>;
  sortBy?: InputMaybe<HostSortBy>;
  sortDir?: InputMaybe<SortDirection>;
  page?: InputMaybe<Scalars["Int"]>;
  limit?: InputMaybe<Scalars["Int"]>;
}>;

export type HostsQuery = {
  __typename?: "Query";
  hosts: {
    __typename?: "HostsResponse";
    filteredHostsCount?: Maybe<number>;
    totalHostsCount: number;
    hosts: Array<{
      __typename?: "Host";
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
      distro?: Maybe<{
        __typename?: "DistroInfo";
        bootstrapMethod?: Maybe<string>;
      }>;
      runningTask?: Maybe<{
        __typename?: "TaskInfo";
        id?: Maybe<string>;
        name?: Maybe<string>;
      }>;
    }>;
  };
};

export type ProjectPatchesQueryVariables = Exact<{
  projectIdentifier: Scalars["String"];
  patchesInput: PatchesInput;
}>;

export type ProjectPatchesQuery = {
  __typename?: "Query";
  project: {
    __typename?: "Project";
    id: string;
    displayName: string;
    patches: {
      __typename?: "Patches";
      filteredPatchCount: number;
      patches: Array<{
        __typename?: "Patch";
        id: string;
        author: string;
        authorDisplayName: string;
        projectIdentifier: string;
        description: string;
        status: string;
        createTime?: Maybe<Date>;
        commitQueuePosition?: Maybe<number>;
        canEnqueueToCommitQueue: boolean;
        projectMetadata?: Maybe<{
          __typename?: "Project";
          owner: string;
          repo: string;
        }>;
        versionFull?: Maybe<{
          __typename?: "Version";
          id: string;
          status: string;
          taskStatusStats?: Maybe<{
            __typename?: "TaskStats";
            counts?: Maybe<
              Array<{
                __typename?: "StatusCount";
                status: string;
                count: number;
              }>
            >;
          }>;
        }>;
      }>;
    };
  };
};

export type SpawnExpirationInfoQueryVariables = Exact<{ [key: string]: never }>;

export type SpawnExpirationInfoQuery = {
  __typename?: "Query";
  myHosts: Array<{ __typename?: "Host"; noExpiration: boolean; id: string }>;
  myVolumes: Array<{
    __typename?: "Volume";
    noExpiration: boolean;
    id: string;
  }>;
};

export type GetSpawnTaskQueryVariables = Exact<{
  taskId: Scalars["String"];
}>;

export type GetSpawnTaskQuery = {
  __typename?: "Query";
  task?: Maybe<{
    __typename?: "Task";
    canSync: boolean;
    id: string;
    execution: number;
    buildVariant: string;
    displayName: string;
    revision?: Maybe<string>;
    status: string;
    project?: Maybe<{ __typename?: "Project"; spawnHostScriptPath: string }>;
  }>;
};

export type SubnetAvailabilityZonesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type SubnetAvailabilityZonesQuery = {
  __typename?: "Query";
  subnetAvailabilityZones: Array<string>;
};

export type TaskQueueDistrosQueryVariables = Exact<{ [key: string]: never }>;

export type TaskQueueDistrosQuery = {
  __typename?: "Query";
  taskQueueDistros: Array<{
    __typename?: "TaskQueueDistro";
    id: string;
    taskCount: number;
    hostCount: number;
  }>;
};

export type UserPatchesQueryVariables = Exact<{
  userId: Scalars["String"];
  patchesInput: PatchesInput;
}>;

export type UserPatchesQuery = {
  __typename?: "Query";
  user: {
    __typename?: "User";
    userId: string;
    patches: {
      __typename?: "Patches";
      filteredPatchCount: number;
      patches: Array<{
        __typename?: "Patch";
        id: string;
        author: string;
        authorDisplayName: string;
        projectIdentifier: string;
        description: string;
        status: string;
        createTime?: Maybe<Date>;
        commitQueuePosition?: Maybe<number>;
        canEnqueueToCommitQueue: boolean;
        projectMetadata?: Maybe<{
          __typename?: "Project";
          owner: string;
          repo: string;
        }>;
        versionFull?: Maybe<{
          __typename?: "Version";
          id: string;
          status: string;
          taskStatusStats?: Maybe<{
            __typename?: "TaskStats";
            counts?: Maybe<
              Array<{
                __typename?: "StatusCount";
                status: string;
                count: number;
              }>
            >;
          }>;
        }>;
      }>;
    };
  };
};
