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
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Duration: { input: number; output: number };
  Map: { input: any; output: any };
  StringMap: { input: { [key: string]: any }; output: { [key: string]: any } };
  Time: { input: Date; output: Date };
};

export type AwsConfig = {
  __typename?: "AWSConfig";
  maxVolumeSizePerUser?: Maybe<Scalars["Int"]["output"]>;
  pod?: Maybe<AwsPodConfig>;
};

export type AwsPodConfig = {
  __typename?: "AWSPodConfig";
  ecs?: Maybe<EcsConfig>;
};

export type AbortInfo = {
  __typename?: "AbortInfo";
  buildVariantDisplayName: Scalars["String"]["output"];
  newVersion: Scalars["String"]["output"];
  prClosed: Scalars["Boolean"]["output"];
  taskDisplayName: Scalars["String"]["output"];
  taskID: Scalars["String"]["output"];
  user: Scalars["String"]["output"];
};

/**
 * Annotation models the metadata that a user can add to a task.
 * It is used as a field within the Task type.
 */
export type Annotation = {
  __typename?: "Annotation";
  createdIssues?: Maybe<Array<Maybe<IssueLink>>>;
  id: Scalars["String"]["output"];
  issues?: Maybe<Array<Maybe<IssueLink>>>;
  metadataLinks?: Maybe<Array<Maybe<MetadataLink>>>;
  note?: Maybe<Note>;
  suspectedIssues?: Maybe<Array<Maybe<IssueLink>>>;
  taskExecution: Scalars["Int"]["output"];
  taskId: Scalars["String"]["output"];
  webhookConfigured: Scalars["Boolean"]["output"];
};

export enum Arch {
  Linux_64Bit = "LINUX_64_BIT",
  LinuxArm_64Bit = "LINUX_ARM_64_BIT",
  LinuxPpc_64Bit = "LINUX_PPC_64_BIT",
  LinuxZseries = "LINUX_ZSERIES",
  Osx_64Bit = "OSX_64_BIT",
  OsxArm_64Bit = "OSX_ARM_64_BIT",
  Windows_64Bit = "WINDOWS_64_BIT",
}

export enum BannerTheme {
  Announcement = "ANNOUNCEMENT",
  Important = "IMPORTANT",
  Information = "INFORMATION",
  Warning = "WARNING",
}

export enum BootstrapMethod {
  LegacySsh = "LEGACY_SSH",
  Ssh = "SSH",
  UserData = "USER_DATA",
}

export type BootstrapSettings = {
  __typename?: "BootstrapSettings";
  clientDir: Scalars["String"]["output"];
  communication: CommunicationMethod;
  env: Array<EnvVar>;
  jasperBinaryDir: Scalars["String"]["output"];
  jasperCredentialsPath: Scalars["String"]["output"];
  method: BootstrapMethod;
  preconditionScripts: Array<PreconditionScript>;
  resourceLimits: ResourceLimits;
  rootDir: Scalars["String"]["output"];
  serviceUser: Scalars["String"]["output"];
  shellPath: Scalars["String"]["output"];
};

export type BootstrapSettingsInput = {
  clientDir: Scalars["String"]["input"];
  communication: CommunicationMethod;
  env: Array<EnvVarInput>;
  jasperBinaryDir: Scalars["String"]["input"];
  jasperCredentialsPath: Scalars["String"]["input"];
  method: BootstrapMethod;
  preconditionScripts: Array<PreconditionScriptInput>;
  resourceLimits: ResourceLimitsInput;
  rootDir: Scalars["String"]["input"];
  serviceUser: Scalars["String"]["input"];
  shellPath: Scalars["String"]["input"];
};

export type Build = {
  __typename?: "Build";
  actualMakespan: Scalars["Duration"]["output"];
  buildVariant: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  predictedMakespan: Scalars["Duration"]["output"];
  status: Scalars["String"]["output"];
};

/**
 * Build Baron is a service that can be integrated into a project (see Confluence Wiki for more details).
 * This type is returned from the buildBaron query, and contains information about Build Baron configurations and suggested
 * tickets from JIRA for a given task on a given execution.
 */
export type BuildBaron = {
  __typename?: "BuildBaron";
  bbTicketCreationDefined: Scalars["Boolean"]["output"];
  buildBaronConfigured: Scalars["Boolean"]["output"];
  searchReturnInfo?: Maybe<SearchReturnInfo>;
};

export type BuildBaronSettings = {
  __typename?: "BuildBaronSettings";
  bfSuggestionFeaturesURL?: Maybe<Scalars["String"]["output"]>;
  bfSuggestionPassword?: Maybe<Scalars["String"]["output"]>;
  bfSuggestionServer?: Maybe<Scalars["String"]["output"]>;
  bfSuggestionTimeoutSecs?: Maybe<Scalars["Int"]["output"]>;
  bfSuggestionUsername?: Maybe<Scalars["String"]["output"]>;
  ticketCreateIssueType: Scalars["String"]["output"];
  ticketCreateProject: Scalars["String"]["output"];
  ticketSearchProjects?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type BuildBaronSettingsInput = {
  bfSuggestionFeaturesURL?: InputMaybe<Scalars["String"]["input"]>;
  bfSuggestionPassword?: InputMaybe<Scalars["String"]["input"]>;
  bfSuggestionServer?: InputMaybe<Scalars["String"]["input"]>;
  bfSuggestionTimeoutSecs?: InputMaybe<Scalars["Int"]["input"]>;
  bfSuggestionUsername?: InputMaybe<Scalars["String"]["input"]>;
  ticketCreateIssueType?: InputMaybe<Scalars["String"]["input"]>;
  ticketCreateProject: Scalars["String"]["input"];
  ticketSearchProjects?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/**
 * BuildVariantOptions is an input to the mainlineCommits query.
 * It stores values for statuses, tasks, and variants which are used to filter for matching versions.
 */
export type BuildVariantOptions = {
  includeBaseTasks?: InputMaybe<Scalars["Boolean"]["input"]>;
  statuses?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tasks?: InputMaybe<Array<Scalars["String"]["input"]>>;
  variants?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type BuildVariantTuple = {
  __typename?: "BuildVariantTuple";
  buildVariant: Scalars["String"]["output"];
  displayName: Scalars["String"]["output"];
};

export type ChildPatchAlias = {
  __typename?: "ChildPatchAlias";
  alias: Scalars["String"]["output"];
  patchId: Scalars["String"]["output"];
};

export type ClientBinary = {
  __typename?: "ClientBinary";
  arch?: Maybe<Scalars["String"]["output"]>;
  displayName?: Maybe<Scalars["String"]["output"]>;
  os?: Maybe<Scalars["String"]["output"]>;
  url?: Maybe<Scalars["String"]["output"]>;
};

/**
 * ClientConfig stores information about the binaries for the Evergreen Command-Line Client that are available for
 * download on Evergreen.
 */
export type ClientConfig = {
  __typename?: "ClientConfig";
  clientBinaries?: Maybe<Array<ClientBinary>>;
  latestRevision?: Maybe<Scalars["String"]["output"]>;
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
  message?: Maybe<Scalars["String"]["output"]>;
  owner?: Maybe<Scalars["String"]["output"]>;
  projectId?: Maybe<Scalars["String"]["output"]>;
  queue?: Maybe<Array<CommitQueueItem>>;
  repo?: Maybe<Scalars["String"]["output"]>;
};

export type CommitQueueItem = {
  __typename?: "CommitQueueItem";
  enqueueTime?: Maybe<Scalars["Time"]["output"]>;
  issue?: Maybe<Scalars["String"]["output"]>;
  modules?: Maybe<Array<Module>>;
  patch?: Maybe<Patch>;
  source?: Maybe<Scalars["String"]["output"]>;
  version?: Maybe<Scalars["String"]["output"]>;
};

export type CommitQueueParams = {
  __typename?: "CommitQueueParams";
  enabled?: Maybe<Scalars["Boolean"]["output"]>;
  mergeMethod: Scalars["String"]["output"];
  mergeQueue: MergeQueue;
  message: Scalars["String"]["output"];
};

export type CommitQueueParamsInput = {
  enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  mergeMethod?: InputMaybe<Scalars["String"]["input"]>;
  mergeQueue?: InputMaybe<MergeQueue>;
  message?: InputMaybe<Scalars["String"]["input"]>;
};

export enum CommunicationMethod {
  LegacySsh = "LEGACY_SSH",
  Rpc = "RPC",
  Ssh = "SSH",
}

export type ContainerPool = {
  __typename?: "ContainerPool";
  distro: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  maxContainers: Scalars["Int"]["output"];
  port: Scalars["Int"]["output"];
};

export type ContainerPoolsConfig = {
  __typename?: "ContainerPoolsConfig";
  pools: Array<ContainerPool>;
};

export type ContainerResources = {
  __typename?: "ContainerResources";
  cpu: Scalars["Int"]["output"];
  memoryMb: Scalars["Int"]["output"];
  name: Scalars["String"]["output"];
};

export type ContainerResourcesInput = {
  cpu: Scalars["Int"]["input"];
  memoryMb: Scalars["Int"]["input"];
  name: Scalars["String"]["input"];
};

/**
 * CopyDistroInput is the input to the copyDistro mutation.
 * It contains information about a distro to be duplicated.
 */
export type CopyDistroInput = {
  distroIdToCopy: Scalars["String"]["input"];
  newDistroId: Scalars["String"]["input"];
};

/**
 * CopyProjectInput is the input to the copyProject mutation.
 * It contains information about a project to be duplicated.
 */
export type CopyProjectInput = {
  newProjectId?: InputMaybe<Scalars["String"]["input"]>;
  newProjectIdentifier: Scalars["String"]["input"];
  projectIdToCopy: Scalars["String"]["input"];
};

/** CreateDistroInput is the input to the createDistro mutation. */
export type CreateDistroInput = {
  newDistroId: Scalars["String"]["input"];
};

/**
 * CreateProjectInput is the input to the createProject mutation.
 * It contains information about a new project to be created.
 */
export type CreateProjectInput = {
  id?: InputMaybe<Scalars["String"]["input"]>;
  identifier: Scalars["String"]["input"];
  owner: Scalars["String"]["input"];
  repo: Scalars["String"]["input"];
  repoRefId?: InputMaybe<Scalars["String"]["input"]>;
};

/** DeleteDistroInput is the input to the deleteDistro mutation. */
export type DeleteDistroInput = {
  distroId: Scalars["String"]["input"];
};

/** Return type representing whether a distro was deleted. */
export type DeleteDistroPayload = {
  __typename?: "DeleteDistroPayload";
  deletedDistroId: Scalars["String"]["output"];
};

export type Dependency = {
  __typename?: "Dependency";
  buildVariant: Scalars["String"]["output"];
  metStatus: MetStatus;
  name: Scalars["String"]["output"];
  requiredStatus: RequiredStatus;
  taskId: Scalars["String"]["output"];
};

export type DispatcherSettings = {
  __typename?: "DispatcherSettings";
  version: DispatcherVersion;
};

export type DispatcherSettingsInput = {
  version: DispatcherVersion;
};

export enum DispatcherVersion {
  Revised = "REVISED",
  RevisedWithDependencies = "REVISED_WITH_DEPENDENCIES",
}

export type DisplayTask = {
  ExecTasks: Array<Scalars["String"]["input"]>;
  Name: Scalars["String"]["input"];
};

/** Distro models an environment configuration for a host. */
export type Distro = {
  __typename?: "Distro";
  adminOnly: Scalars["Boolean"]["output"];
  aliases: Array<Scalars["String"]["output"]>;
  arch: Arch;
  authorizedKeysFile: Scalars["String"]["output"];
  bootstrapSettings: BootstrapSettings;
  containerPool: Scalars["String"]["output"];
  disableShallowClone: Scalars["Boolean"]["output"];
  disabled: Scalars["Boolean"]["output"];
  dispatcherSettings: DispatcherSettings;
  expansions: Array<Expansion>;
  finderSettings: FinderSettings;
  homeVolumeSettings: HomeVolumeSettings;
  hostAllocatorSettings: HostAllocatorSettings;
  iceCreamSettings: IceCreamSettings;
  isCluster: Scalars["Boolean"]["output"];
  isVirtualWorkStation: Scalars["Boolean"]["output"];
  mountpoints?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  name: Scalars["String"]["output"];
  note: Scalars["String"]["output"];
  plannerSettings: PlannerSettings;
  provider: Provider;
  providerSettingsList: Array<Scalars["Map"]["output"]>;
  setup: Scalars["String"]["output"];
  setupAsSudo: Scalars["Boolean"]["output"];
  sshKey: Scalars["String"]["output"];
  sshOptions: Array<Scalars["String"]["output"]>;
  user: Scalars["String"]["output"];
  userSpawnAllowed: Scalars["Boolean"]["output"];
  validProjects: Array<Maybe<Scalars["String"]["output"]>>;
  workDir: Scalars["String"]["output"];
};

export type DistroEvent = {
  __typename?: "DistroEvent";
  after?: Maybe<Scalars["Map"]["output"]>;
  before?: Maybe<Scalars["Map"]["output"]>;
  data?: Maybe<Scalars["Map"]["output"]>;
  timestamp: Scalars["Time"]["output"];
  user: Scalars["String"]["output"];
};

/** DistroEventsInput is the input to the distroEvents query. */
export type DistroEventsInput = {
  before?: InputMaybe<Scalars["Time"]["input"]>;
  distroId: Scalars["String"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
};

export type DistroEventsPayload = {
  __typename?: "DistroEventsPayload";
  count: Scalars["Int"]["output"];
  eventLogEntries: Array<DistroEvent>;
};

export type DistroInfo = {
  __typename?: "DistroInfo";
  bootstrapMethod?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  isVirtualWorkStation?: Maybe<Scalars["Boolean"]["output"]>;
  isWindows?: Maybe<Scalars["Boolean"]["output"]>;
  user?: Maybe<Scalars["String"]["output"]>;
  workDir?: Maybe<Scalars["String"]["output"]>;
};

export type DistroInput = {
  adminOnly: Scalars["Boolean"]["input"];
  aliases: Array<Scalars["String"]["input"]>;
  arch: Arch;
  authorizedKeysFile: Scalars["String"]["input"];
  bootstrapSettings: BootstrapSettingsInput;
  containerPool: Scalars["String"]["input"];
  disableShallowClone: Scalars["Boolean"]["input"];
  disabled: Scalars["Boolean"]["input"];
  dispatcherSettings: DispatcherSettingsInput;
  expansions: Array<ExpansionInput>;
  finderSettings: FinderSettingsInput;
  homeVolumeSettings: HomeVolumeSettingsInput;
  hostAllocatorSettings: HostAllocatorSettingsInput;
  iceCreamSettings: IceCreamSettingsInput;
  isCluster: Scalars["Boolean"]["input"];
  isVirtualWorkStation: Scalars["Boolean"]["input"];
  mountpoints?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  name: Scalars["String"]["input"];
  note: Scalars["String"]["input"];
  plannerSettings: PlannerSettingsInput;
  provider: Provider;
  providerSettingsList: Array<Scalars["Map"]["input"]>;
  setup: Scalars["String"]["input"];
  setupAsSudo: Scalars["Boolean"]["input"];
  sshKey: Scalars["String"]["input"];
  sshOptions: Array<Scalars["String"]["input"]>;
  user: Scalars["String"]["input"];
  userSpawnAllowed: Scalars["Boolean"]["input"];
  validProjects: Array<Scalars["String"]["input"]>;
  workDir: Scalars["String"]["input"];
};

export enum DistroOnSaveOperation {
  Decommission = "DECOMMISSION",
  None = "NONE",
  Reprovision = "REPROVISION",
  RestartJasper = "RESTART_JASPER",
}

export type DistroPermissions = {
  __typename?: "DistroPermissions";
  admin: Scalars["Boolean"]["output"];
  edit: Scalars["Boolean"]["output"];
  view: Scalars["Boolean"]["output"];
};

export type DistroPermissionsOptions = {
  distroId: Scalars["String"]["input"];
};

export enum DistroSettingsAccess {
  Admin = "ADMIN",
  Create = "CREATE",
  Edit = "EDIT",
  View = "VIEW",
}

export type EcsConfig = {
  __typename?: "ECSConfig";
  maxCPU: Scalars["Int"]["output"];
  maxMemoryMb: Scalars["Int"]["output"];
};

/**
 * EditSpawnHostInput is the input to the editSpawnHost mutation.
 * Its fields determine how a given host will be modified.
 */
export type EditSpawnHostInput = {
  addedInstanceTags?: InputMaybe<Array<InstanceTagInput>>;
  deletedInstanceTags?: InputMaybe<Array<InstanceTagInput>>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  expiration?: InputMaybe<Scalars["Time"]["input"]>;
  hostId: Scalars["String"]["input"];
  instanceType?: InputMaybe<Scalars["String"]["input"]>;
  noExpiration?: InputMaybe<Scalars["Boolean"]["input"]>;
  publicKey?: InputMaybe<PublicKeyInput>;
  savePublicKey?: InputMaybe<Scalars["Boolean"]["input"]>;
  servicePassword?: InputMaybe<Scalars["String"]["input"]>;
  volume?: InputMaybe<Scalars["String"]["input"]>;
};

export type EnvVar = {
  __typename?: "EnvVar";
  key: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type EnvVarInput = {
  key: Scalars["String"]["input"];
  value: Scalars["String"]["input"];
};

export type Expansion = {
  __typename?: "Expansion";
  key: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type ExpansionInput = {
  key: Scalars["String"]["input"];
  value: Scalars["String"]["input"];
};

export type ExternalLink = {
  __typename?: "ExternalLink";
  displayName: Scalars["String"]["output"];
  requesters: Array<Scalars["String"]["output"]>;
  urlTemplate: Scalars["String"]["output"];
};

export type ExternalLinkForMetadata = {
  __typename?: "ExternalLinkForMetadata";
  displayName: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type ExternalLinkInput = {
  displayName: Scalars["String"]["input"];
  requesters: Array<Scalars["String"]["input"]>;
  urlTemplate: Scalars["String"]["input"];
};

export enum FeedbackRule {
  Default = "DEFAULT",
  NoFeedback = "NO_FEEDBACK",
  WaitsOverThresh = "WAITS_OVER_THRESH",
}

export type File = {
  __typename?: "File";
  link: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  urlParsley?: Maybe<Scalars["String"]["output"]>;
  visibility: Scalars["String"]["output"];
};

export type FileDiff = {
  __typename?: "FileDiff";
  additions: Scalars["Int"]["output"];
  deletions: Scalars["Int"]["output"];
  description: Scalars["String"]["output"];
  diffLink: Scalars["String"]["output"];
  fileName: Scalars["String"]["output"];
};

export type FinderSettings = {
  __typename?: "FinderSettings";
  version: FinderVersion;
};

export type FinderSettingsInput = {
  version: FinderVersion;
};

export enum FinderVersion {
  Alternate = "ALTERNATE",
  Legacy = "LEGACY",
  Parallel = "PARALLEL",
  Pipeline = "PIPELINE",
}

export type GeneralSubscription = {
  __typename?: "GeneralSubscription";
  id: Scalars["String"]["output"];
  ownerType: Scalars["String"]["output"];
  regexSelectors: Array<Selector>;
  resourceType: Scalars["String"]["output"];
  selectors: Array<Selector>;
  subscriber?: Maybe<SubscriberWrapper>;
  trigger: Scalars["String"]["output"];
  triggerData?: Maybe<Scalars["StringMap"]["output"]>;
};

export type GitTag = {
  __typename?: "GitTag";
  pusher: Scalars["String"]["output"];
  tag: Scalars["String"]["output"];
};

export type GithubCheckSubscriber = {
  __typename?: "GithubCheckSubscriber";
  owner: Scalars["String"]["output"];
  ref: Scalars["String"]["output"];
  repo: Scalars["String"]["output"];
};

export type GithubPrSubscriber = {
  __typename?: "GithubPRSubscriber";
  owner: Scalars["String"]["output"];
  prNumber?: Maybe<Scalars["Int"]["output"]>;
  ref: Scalars["String"]["output"];
  repo: Scalars["String"]["output"];
};

/**
 * GithubProjectConflicts is the return value for the githubProjectConflicts query.
 * Its contains information about potential conflicts in the commit checks, the commit queue, and PR testing.
 */
export type GithubProjectConflicts = {
  __typename?: "GithubProjectConflicts";
  commitCheckIdentifiers?: Maybe<Array<Scalars["String"]["output"]>>;
  commitQueueIdentifiers?: Maybe<Array<Scalars["String"]["output"]>>;
  prTestingIdentifiers?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type GithubUser = {
  __typename?: "GithubUser";
  lastKnownAs?: Maybe<Scalars["String"]["output"]>;
  uid?: Maybe<Scalars["Int"]["output"]>;
};

export type GithubUserInput = {
  lastKnownAs?: InputMaybe<Scalars["String"]["input"]>;
};

export type GroupedBuildVariant = {
  __typename?: "GroupedBuildVariant";
  displayName: Scalars["String"]["output"];
  tasks?: Maybe<Array<Maybe<Task>>>;
  variant: Scalars["String"]["output"];
};

export type GroupedFiles = {
  __typename?: "GroupedFiles";
  execution: Scalars["Int"]["output"];
  files?: Maybe<Array<File>>;
  taskId: Scalars["String"]["output"];
  taskName?: Maybe<Scalars["String"]["output"]>;
};

/**
 * GroupedProjects is the return value for the projects & viewableProjectRefs queries.
 * It contains an array of projects which are grouped under a groupDisplayName.
 */
export type GroupedProjects = {
  __typename?: "GroupedProjects";
  groupDisplayName: Scalars["String"]["output"];
  projects: Array<Project>;
  repo?: Maybe<RepoRef>;
};

export type GroupedTaskStatusCount = {
  __typename?: "GroupedTaskStatusCount";
  displayName: Scalars["String"]["output"];
  statusCounts: Array<StatusCount>;
  variant: Scalars["String"]["output"];
};

export type HomeVolumeSettings = {
  __typename?: "HomeVolumeSettings";
  formatCommand: Scalars["String"]["output"];
};

export type HomeVolumeSettingsInput = {
  formatCommand: Scalars["String"]["input"];
};

/** Host models a host, which are used for things like running tasks or as virtual workstations. */
export type Host = {
  __typename?: "Host";
  ami?: Maybe<Scalars["String"]["output"]>;
  availabilityZone?: Maybe<Scalars["String"]["output"]>;
  displayName?: Maybe<Scalars["String"]["output"]>;
  distro?: Maybe<DistroInfo>;
  distroId?: Maybe<Scalars["String"]["output"]>;
  elapsed?: Maybe<Scalars["Time"]["output"]>;
  expiration?: Maybe<Scalars["Time"]["output"]>;
  homeVolume?: Maybe<Volume>;
  homeVolumeID?: Maybe<Scalars["String"]["output"]>;
  hostUrl: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  instanceTags: Array<InstanceTag>;
  instanceType?: Maybe<Scalars["String"]["output"]>;
  lastCommunicationTime?: Maybe<Scalars["Time"]["output"]>;
  noExpiration: Scalars["Boolean"]["output"];
  provider: Scalars["String"]["output"];
  runningTask?: Maybe<TaskInfo>;
  startedBy: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  tag: Scalars["String"]["output"];
  totalIdleTime?: Maybe<Scalars["Duration"]["output"]>;
  uptime?: Maybe<Scalars["Time"]["output"]>;
  user?: Maybe<Scalars["String"]["output"]>;
  volumes: Array<Volume>;
};

export type HostAllocatorSettings = {
  __typename?: "HostAllocatorSettings";
  acceptableHostIdleTime: Scalars["Duration"]["output"];
  feedbackRule: FeedbackRule;
  futureHostFraction: Scalars["Float"]["output"];
  hostsOverallocatedRule: OverallocatedRule;
  maximumHosts: Scalars["Int"]["output"];
  minimumHosts: Scalars["Int"]["output"];
  roundingRule: RoundingRule;
  version: HostAllocatorVersion;
};

export type HostAllocatorSettingsInput = {
  acceptableHostIdleTime: Scalars["Int"]["input"];
  feedbackRule: FeedbackRule;
  futureHostFraction: Scalars["Float"]["input"];
  hostsOverallocatedRule: OverallocatedRule;
  maximumHosts: Scalars["Int"]["input"];
  minimumHosts: Scalars["Int"]["input"];
  roundingRule: RoundingRule;
  version: HostAllocatorVersion;
};

export enum HostAllocatorVersion {
  Utilization = "UTILIZATION",
}

export type HostEventLogData = {
  __typename?: "HostEventLogData";
  agentBuild: Scalars["String"]["output"];
  agentRevision: Scalars["String"]["output"];
  duration: Scalars["Duration"]["output"];
  execution: Scalars["String"]["output"];
  hostname: Scalars["String"]["output"];
  jasperRevision: Scalars["String"]["output"];
  logs: Scalars["String"]["output"];
  monitorOp: Scalars["String"]["output"];
  newStatus: Scalars["String"]["output"];
  oldStatus: Scalars["String"]["output"];
  provisioningMethod: Scalars["String"]["output"];
  successful: Scalars["Boolean"]["output"];
  taskId: Scalars["String"]["output"];
  taskPid: Scalars["String"]["output"];
  taskStatus: Scalars["String"]["output"];
  user: Scalars["String"]["output"];
};

export type HostEventLogEntry = {
  __typename?: "HostEventLogEntry";
  data: HostEventLogData;
  eventType?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  processedAt: Scalars["Time"]["output"];
  resourceId: Scalars["String"]["output"];
  resourceType: Scalars["String"]["output"];
  timestamp?: Maybe<Scalars["Time"]["output"]>;
};

/**
 * HostEvents is the return value for the hostEvents query.
 * It contains the event log entries for a given host.
 */
export type HostEvents = {
  __typename?: "HostEvents";
  count: Scalars["Int"]["output"];
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
  filteredHostsCount?: Maybe<Scalars["Int"]["output"]>;
  hosts: Array<Host>;
  totalHostsCount: Scalars["Int"]["output"];
};

export type IceCreamSettings = {
  __typename?: "IceCreamSettings";
  configPath: Scalars["String"]["output"];
  schedulerHost: Scalars["String"]["output"];
};

export type IceCreamSettingsInput = {
  configPath: Scalars["String"]["input"];
  schedulerHost: Scalars["String"]["input"];
};

export type InstanceTag = {
  __typename?: "InstanceTag";
  canBeModified: Scalars["Boolean"]["output"];
  key: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type InstanceTagInput = {
  key: Scalars["String"]["input"];
  value: Scalars["String"]["input"];
};

export type IssueLink = {
  __typename?: "IssueLink";
  confidenceScore?: Maybe<Scalars["Float"]["output"]>;
  issueKey?: Maybe<Scalars["String"]["output"]>;
  jiraTicket?: Maybe<JiraTicket>;
  source?: Maybe<Source>;
  url?: Maybe<Scalars["String"]["output"]>;
};

/** IssueLinkInput is an input parameter to the annotation mutations. */
export type IssueLinkInput = {
  confidenceScore?: InputMaybe<Scalars["Float"]["input"]>;
  issueKey: Scalars["String"]["input"];
  url: Scalars["String"]["input"];
};

export type JiraConfig = {
  __typename?: "JiraConfig";
  email?: Maybe<Scalars["String"]["output"]>;
  host?: Maybe<Scalars["String"]["output"]>;
};

export type JiraField = {
  __typename?: "JiraField";
  displayText: Scalars["String"]["output"];
  field: Scalars["String"]["output"];
};

export type JiraFieldInput = {
  displayText: Scalars["String"]["input"];
  field: Scalars["String"]["input"];
};

export type JiraIssueSubscriber = {
  __typename?: "JiraIssueSubscriber";
  issueType: Scalars["String"]["output"];
  project: Scalars["String"]["output"];
};

export type JiraIssueSubscriberInput = {
  issueType: Scalars["String"]["input"];
  project: Scalars["String"]["input"];
};

export type JiraStatus = {
  __typename?: "JiraStatus";
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

export type JiraTicket = {
  __typename?: "JiraTicket";
  fields: TicketFields;
  key: Scalars["String"]["output"];
};

export type LogMessage = {
  __typename?: "LogMessage";
  message?: Maybe<Scalars["String"]["output"]>;
  severity?: Maybe<Scalars["String"]["output"]>;
  timestamp?: Maybe<Scalars["Time"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  version?: Maybe<Scalars["Int"]["output"]>;
};

export type LogkeeperBuild = {
  __typename?: "LogkeeperBuild";
  buildNum: Scalars["Int"]["output"];
  builder: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  task: Task;
  taskExecution: Scalars["Int"]["output"];
  taskId: Scalars["String"]["output"];
  tests: Array<LogkeeperTest>;
};

export type LogkeeperTest = {
  __typename?: "LogkeeperTest";
  buildId: Scalars["String"]["output"];
  command: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  phase: Scalars["String"]["output"];
  taskExecution: Scalars["Int"]["output"];
  taskId: Scalars["String"]["output"];
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
  nextPageOrderNumber?: Maybe<Scalars["Int"]["output"]>;
  prevPageOrderNumber?: Maybe<Scalars["Int"]["output"]>;
  versions: Array<MainlineCommitVersion>;
};

/**
 * MainlineCommitsOptions is an input to the mainlineCommits query.
 * Its fields determine what mainline commits we fetch for a given projectID.
 */
export type MainlineCommitsOptions = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  projectIdentifier: Scalars["String"]["input"];
  requesters?: InputMaybe<Array<Scalars["String"]["input"]>>;
  revision?: InputMaybe<Scalars["String"]["input"]>;
  shouldCollapse?: InputMaybe<Scalars["Boolean"]["input"]>;
  skipOrderNumber?: InputMaybe<Scalars["Int"]["input"]>;
};

export type Manifest = {
  __typename?: "Manifest";
  branch: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  isBase: Scalars["Boolean"]["output"];
  moduleOverrides?: Maybe<Scalars["StringMap"]["output"]>;
  modules?: Maybe<Scalars["Map"]["output"]>;
  project: Scalars["String"]["output"];
  revision: Scalars["String"]["output"];
};

export enum MergeQueue {
  Evergreen = "EVERGREEN",
  Github = "GITHUB",
}

export enum MetStatus {
  Met = "MET",
  Pending = "PENDING",
  Started = "STARTED",
  Unmet = "UNMET",
}

export type MetadataLink = {
  __typename?: "MetadataLink";
  source?: Maybe<Source>;
  text: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type MetadataLinkInput = {
  text: Scalars["String"]["input"];
  url: Scalars["String"]["input"];
};

export type Module = {
  __typename?: "Module";
  issue?: Maybe<Scalars["String"]["output"]>;
  module?: Maybe<Scalars["String"]["output"]>;
};

export type ModuleCodeChange = {
  __typename?: "ModuleCodeChange";
  branchName: Scalars["String"]["output"];
  fileDiffs: Array<FileDiff>;
  htmlLink: Scalars["String"]["output"];
  rawLink: Scalars["String"]["output"];
};

/**
 * MoveProjectInput is the input to the attachProjectToNewRepo mutation.
 * It contains information used to move a project to a a new owner and repo.
 */
export type MoveProjectInput = {
  newOwner: Scalars["String"]["input"];
  newRepo: Scalars["String"]["input"];
  projectId: Scalars["String"]["input"];
};

export type Mutation = {
  __typename?: "Mutation";
  abortTask: Task;
  addAnnotationIssue: Scalars["Boolean"]["output"];
  addFavoriteProject: Project;
  attachProjectToNewRepo: Project;
  attachProjectToRepo: Project;
  attachVolumeToHost: Scalars["Boolean"]["output"];
  bbCreateTicket: Scalars["Boolean"]["output"];
  clearMySubscriptions: Scalars["Int"]["output"];
  copyDistro: NewDistroPayload;
  copyProject: Project;
  createDistro: NewDistroPayload;
  createProject: Project;
  createPublicKey: Array<PublicKey>;
  deactivateStepbackTask: Scalars["Boolean"]["output"];
  defaultSectionToRepo?: Maybe<Scalars["String"]["output"]>;
  deleteDistro: DeleteDistroPayload;
  deleteProject: Scalars["Boolean"]["output"];
  deleteSubscriptions: Scalars["Int"]["output"];
  detachProjectFromRepo: Project;
  detachVolumeFromHost: Scalars["Boolean"]["output"];
  editAnnotationNote: Scalars["Boolean"]["output"];
  editSpawnHost: Host;
  enqueuePatch: Patch;
  forceRepotrackerRun: Scalars["Boolean"]["output"];
  migrateVolume: Scalars["Boolean"]["output"];
  moveAnnotationIssue: Scalars["Boolean"]["output"];
  overrideTaskDependencies: Task;
  promoteVarsToRepo: Scalars["Boolean"]["output"];
  removeAnnotationIssue: Scalars["Boolean"]["output"];
  removeFavoriteProject: Project;
  removeItemFromCommitQueue?: Maybe<Scalars["String"]["output"]>;
  removePublicKey: Array<PublicKey>;
  removeVolume: Scalars["Boolean"]["output"];
  reprovisionToNew: Scalars["Int"]["output"];
  restartJasper: Scalars["Int"]["output"];
  restartTask: Task;
  restartVersions?: Maybe<Array<Version>>;
  saveDistro: SaveDistroPayload;
  saveProjectSettingsForSection: ProjectSettings;
  saveRepoSettingsForSection: RepoSettings;
  saveSubscription: Scalars["Boolean"]["output"];
  schedulePatch: Patch;
  schedulePatchTasks?: Maybe<Scalars["String"]["output"]>;
  scheduleTasks: Array<Task>;
  scheduleUndispatchedBaseTasks?: Maybe<Array<Task>>;
  setAnnotationMetadataLinks: Scalars["Boolean"]["output"];
  setLastRevision: SetLastRevisionPayload;
  setPatchPriority?: Maybe<Scalars["String"]["output"]>;
  /** setPatchVisibility takes a list of patch ids and a boolean to set the visibility on the my patches queries */
  setPatchVisibility: Array<Patch>;
  setTaskPriority: Task;
  spawnHost: Host;
  spawnVolume: Scalars["Boolean"]["output"];
  unschedulePatchTasks?: Maybe<Scalars["String"]["output"]>;
  unscheduleTask: Task;
  updateHostStatus: Scalars["Int"]["output"];
  updatePublicKey: Array<PublicKey>;
  updateSpawnHostStatus: Host;
  updateUserSettings: Scalars["Boolean"]["output"];
  updateVolume: Scalars["Boolean"]["output"];
};

export type MutationAbortTaskArgs = {
  taskId: Scalars["String"]["input"];
};

export type MutationAddAnnotationIssueArgs = {
  apiIssue: IssueLinkInput;
  execution: Scalars["Int"]["input"];
  isIssue: Scalars["Boolean"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationAddFavoriteProjectArgs = {
  identifier: Scalars["String"]["input"];
};

export type MutationAttachProjectToNewRepoArgs = {
  project: MoveProjectInput;
};

export type MutationAttachProjectToRepoArgs = {
  projectId: Scalars["String"]["input"];
};

export type MutationAttachVolumeToHostArgs = {
  volumeAndHost: VolumeHost;
};

export type MutationBbCreateTicketArgs = {
  execution?: InputMaybe<Scalars["Int"]["input"]>;
  taskId: Scalars["String"]["input"];
};

export type MutationCopyDistroArgs = {
  opts: CopyDistroInput;
};

export type MutationCopyProjectArgs = {
  project: CopyProjectInput;
  requestS3Creds?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type MutationCreateDistroArgs = {
  opts: CreateDistroInput;
};

export type MutationCreateProjectArgs = {
  project: CreateProjectInput;
  requestS3Creds?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type MutationCreatePublicKeyArgs = {
  publicKeyInput: PublicKeyInput;
};

export type MutationDeactivateStepbackTaskArgs = {
  buildVariantName: Scalars["String"]["input"];
  projectId: Scalars["String"]["input"];
  taskName: Scalars["String"]["input"];
};

export type MutationDefaultSectionToRepoArgs = {
  projectId: Scalars["String"]["input"];
  section: ProjectSettingsSection;
};

export type MutationDeleteDistroArgs = {
  opts: DeleteDistroInput;
};

export type MutationDeleteProjectArgs = {
  projectId: Scalars["String"]["input"];
};

export type MutationDeleteSubscriptionsArgs = {
  subscriptionIds: Array<Scalars["String"]["input"]>;
};

export type MutationDetachProjectFromRepoArgs = {
  projectId: Scalars["String"]["input"];
};

export type MutationDetachVolumeFromHostArgs = {
  volumeId: Scalars["String"]["input"];
};

export type MutationEditAnnotationNoteArgs = {
  execution: Scalars["Int"]["input"];
  newMessage: Scalars["String"]["input"];
  originalMessage: Scalars["String"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationEditSpawnHostArgs = {
  spawnHost?: InputMaybe<EditSpawnHostInput>;
};

export type MutationEnqueuePatchArgs = {
  commitMessage?: InputMaybe<Scalars["String"]["input"]>;
  patchId: Scalars["String"]["input"];
};

export type MutationForceRepotrackerRunArgs = {
  projectId: Scalars["String"]["input"];
};

export type MutationMigrateVolumeArgs = {
  spawnHostInput?: InputMaybe<SpawnHostInput>;
  volumeId: Scalars["String"]["input"];
};

export type MutationMoveAnnotationIssueArgs = {
  apiIssue: IssueLinkInput;
  execution: Scalars["Int"]["input"];
  isIssue: Scalars["Boolean"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationOverrideTaskDependenciesArgs = {
  taskId: Scalars["String"]["input"];
};

export type MutationPromoteVarsToRepoArgs = {
  projectId: Scalars["String"]["input"];
  varNames: Array<Scalars["String"]["input"]>;
};

export type MutationRemoveAnnotationIssueArgs = {
  apiIssue: IssueLinkInput;
  execution: Scalars["Int"]["input"];
  isIssue: Scalars["Boolean"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationRemoveFavoriteProjectArgs = {
  identifier: Scalars["String"]["input"];
};

export type MutationRemoveItemFromCommitQueueArgs = {
  commitQueueId: Scalars["String"]["input"];
  issue: Scalars["String"]["input"];
};

export type MutationRemovePublicKeyArgs = {
  keyName: Scalars["String"]["input"];
};

export type MutationRemoveVolumeArgs = {
  volumeId: Scalars["String"]["input"];
};

export type MutationReprovisionToNewArgs = {
  hostIds: Array<Scalars["String"]["input"]>;
};

export type MutationRestartJasperArgs = {
  hostIds: Array<Scalars["String"]["input"]>;
};

export type MutationRestartTaskArgs = {
  failedOnly: Scalars["Boolean"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationRestartVersionsArgs = {
  abort: Scalars["Boolean"]["input"];
  versionId: Scalars["String"]["input"];
  versionsToRestart: Array<VersionToRestart>;
};

export type MutationSaveDistroArgs = {
  opts: SaveDistroInput;
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
  patchId: Scalars["String"]["input"];
};

export type MutationSchedulePatchTasksArgs = {
  patchId: Scalars["String"]["input"];
};

export type MutationScheduleTasksArgs = {
  taskIds: Array<Scalars["String"]["input"]>;
};

export type MutationScheduleUndispatchedBaseTasksArgs = {
  patchId: Scalars["String"]["input"];
};

export type MutationSetAnnotationMetadataLinksArgs = {
  execution: Scalars["Int"]["input"];
  metadataLinks: Array<MetadataLinkInput>;
  taskId: Scalars["String"]["input"];
};

export type MutationSetLastRevisionArgs = {
  opts: SetLastRevisionInput;
};

export type MutationSetPatchPriorityArgs = {
  patchId: Scalars["String"]["input"];
  priority: Scalars["Int"]["input"];
};

export type MutationSetPatchVisibilityArgs = {
  hidden: Scalars["Boolean"]["input"];
  patchIds: Array<Scalars["String"]["input"]>;
};

export type MutationSetTaskPriorityArgs = {
  priority: Scalars["Int"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationSpawnHostArgs = {
  spawnHostInput?: InputMaybe<SpawnHostInput>;
};

export type MutationSpawnVolumeArgs = {
  spawnVolumeInput: SpawnVolumeInput;
};

export type MutationUnschedulePatchTasksArgs = {
  abort: Scalars["Boolean"]["input"];
  patchId: Scalars["String"]["input"];
};

export type MutationUnscheduleTaskArgs = {
  taskId: Scalars["String"]["input"];
};

export type MutationUpdateHostStatusArgs = {
  hostIds: Array<Scalars["String"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  status: Scalars["String"]["input"];
};

export type MutationUpdatePublicKeyArgs = {
  targetKeyName: Scalars["String"]["input"];
  updateInfo: PublicKeyInput;
};

export type MutationUpdateSpawnHostStatusArgs = {
  action: SpawnHostStatusActions;
  hostId: Scalars["String"]["input"];
};

export type MutationUpdateUserSettingsArgs = {
  userSettings?: InputMaybe<UserSettingsInput>;
};

export type MutationUpdateVolumeArgs = {
  updateVolumeInput: UpdateVolumeInput;
};

/** Return type representing whether a distro was created and any validation errors */
export type NewDistroPayload = {
  __typename?: "NewDistroPayload";
  newDistroId: Scalars["String"]["output"];
};

export type Note = {
  __typename?: "Note";
  message: Scalars["String"]["output"];
  source: Source;
};

export type Notifications = {
  __typename?: "Notifications";
  buildBreak?: Maybe<Scalars["String"]["output"]>;
  buildBreakId?: Maybe<Scalars["String"]["output"]>;
  commitQueue?: Maybe<Scalars["String"]["output"]>;
  commitQueueId?: Maybe<Scalars["String"]["output"]>;
  patchFinish?: Maybe<Scalars["String"]["output"]>;
  patchFinishId?: Maybe<Scalars["String"]["output"]>;
  patchFirstFailure?: Maybe<Scalars["String"]["output"]>;
  patchFirstFailureId?: Maybe<Scalars["String"]["output"]>;
  spawnHostExpiration?: Maybe<Scalars["String"]["output"]>;
  spawnHostExpirationId?: Maybe<Scalars["String"]["output"]>;
  spawnHostOutcome?: Maybe<Scalars["String"]["output"]>;
  spawnHostOutcomeId?: Maybe<Scalars["String"]["output"]>;
};

export type NotificationsInput = {
  buildBreak?: InputMaybe<Scalars["String"]["input"]>;
  commitQueue?: InputMaybe<Scalars["String"]["input"]>;
  patchFinish?: InputMaybe<Scalars["String"]["input"]>;
  patchFirstFailure?: InputMaybe<Scalars["String"]["input"]>;
  spawnHostExpiration?: InputMaybe<Scalars["String"]["input"]>;
  spawnHostOutcome?: InputMaybe<Scalars["String"]["input"]>;
};

export type OomTrackerInfo = {
  __typename?: "OomTrackerInfo";
  detected: Scalars["Boolean"]["output"];
  pids?: Maybe<Array<Maybe<Scalars["Int"]["output"]>>>;
};

export enum OverallocatedRule {
  Default = "DEFAULT",
  Ignore = "IGNORE",
  Terminate = "TERMINATE",
}

export type Parameter = {
  __typename?: "Parameter";
  key: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type ParameterInput = {
  key: Scalars["String"]["input"];
  value: Scalars["String"]["input"];
};

export type ParsleyFilter = {
  __typename?: "ParsleyFilter";
  caseSensitive: Scalars["Boolean"]["output"];
  exactMatch: Scalars["Boolean"]["output"];
  expression: Scalars["String"]["output"];
};

export type ParsleyFilterInput = {
  caseSensitive: Scalars["Boolean"]["input"];
  exactMatch: Scalars["Boolean"]["input"];
  expression: Scalars["String"]["input"];
};

/** Patch is a manually initiated version submitted to test local code changes. */
export type Patch = {
  __typename?: "Patch";
  activated: Scalars["Boolean"]["output"];
  alias?: Maybe<Scalars["String"]["output"]>;
  author: Scalars["String"]["output"];
  authorDisplayName: Scalars["String"]["output"];
  baseTaskStatuses: Array<Scalars["String"]["output"]>;
  builds: Array<Build>;
  canEnqueueToCommitQueue: Scalars["Boolean"]["output"];
  childPatchAliases?: Maybe<Array<ChildPatchAlias>>;
  childPatches?: Maybe<Array<Patch>>;
  commitQueuePosition?: Maybe<Scalars["Int"]["output"]>;
  createTime?: Maybe<Scalars["Time"]["output"]>;
  description: Scalars["String"]["output"];
  duration?: Maybe<PatchDuration>;
  githash: Scalars["String"]["output"];
  hidden: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  moduleCodeChanges: Array<ModuleCodeChange>;
  parameters: Array<Parameter>;
  patchNumber: Scalars["Int"]["output"];
  patchTriggerAliases: Array<PatchTriggerAlias>;
  project?: Maybe<PatchProject>;
  projectID: Scalars["String"]["output"];
  projectIdentifier: Scalars["String"]["output"];
  projectMetadata?: Maybe<Project>;
  status: Scalars["String"]["output"];
  taskCount?: Maybe<Scalars["Int"]["output"]>;
  taskStatuses: Array<Scalars["String"]["output"]>;
  tasks: Array<Scalars["String"]["output"]>;
  time?: Maybe<PatchTime>;
  variants: Array<Scalars["String"]["output"]>;
  variantsTasks: Array<Maybe<VariantTask>>;
  versionFull?: Maybe<Version>;
};

/**
 * PatchConfigure is the input to the schedulePatch mutation.
 * It contains information about how a user has configured their patch (e.g. name, tasks to run, etc).
 */
export type PatchConfigure = {
  description: Scalars["String"]["input"];
  parameters?: InputMaybe<Array<InputMaybe<ParameterInput>>>;
  patchTriggerAliases?: InputMaybe<Array<Scalars["String"]["input"]>>;
  variantsTasks: Array<VariantTasks>;
};

export type PatchDuration = {
  __typename?: "PatchDuration";
  makespan?: Maybe<Scalars["String"]["output"]>;
  time?: Maybe<PatchTime>;
  timeTaken?: Maybe<Scalars["String"]["output"]>;
};

export type PatchProject = {
  __typename?: "PatchProject";
  variants: Array<ProjectBuildVariant>;
};

export type PatchTime = {
  __typename?: "PatchTime";
  finished?: Maybe<Scalars["String"]["output"]>;
  started?: Maybe<Scalars["String"]["output"]>;
  submittedAt: Scalars["String"]["output"];
};

export type PatchTriggerAlias = {
  __typename?: "PatchTriggerAlias";
  alias: Scalars["String"]["output"];
  childProjectId: Scalars["String"]["output"];
  childProjectIdentifier: Scalars["String"]["output"];
  parentAsModule?: Maybe<Scalars["String"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  taskSpecifiers?: Maybe<Array<TaskSpecifier>>;
  variantsTasks: Array<VariantTask>;
};

export type PatchTriggerAliasInput = {
  alias: Scalars["String"]["input"];
  childProjectIdentifier: Scalars["String"]["input"];
  parentAsModule?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  taskSpecifiers: Array<TaskSpecifierInput>;
};

/**
 * Patches is the return value of the patches field for the User and Project types.
 * It contains an array Patches for either an individual user or a project.
 */
export type Patches = {
  __typename?: "Patches";
  filteredPatchCount: Scalars["Int"]["output"];
  patches: Array<Patch>;
};

/**
 * PatchesInput is the input value to the patches field for the User and Project types.
 * Based on the information in PatchesInput, we return a list of Patches for either an individual user or a project.
 */
export type PatchesInput = {
  includeCommitQueue?: InputMaybe<Scalars["Boolean"]["input"]>;
  includeHidden?: InputMaybe<Scalars["Boolean"]["input"]>;
  limit?: Scalars["Int"]["input"];
  onlyCommitQueue?: InputMaybe<Scalars["Boolean"]["input"]>;
  page?: Scalars["Int"]["input"];
  patchName?: Scalars["String"]["input"];
  statuses?: Array<Scalars["String"]["input"]>;
};

export type PeriodicBuild = {
  __typename?: "PeriodicBuild";
  alias: Scalars["String"]["output"];
  configFile: Scalars["String"]["output"];
  cron: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  intervalHours: Scalars["Int"]["output"];
  message: Scalars["String"]["output"];
  nextRunTime: Scalars["Time"]["output"];
};

export type PeriodicBuildInput = {
  alias: Scalars["String"]["input"];
  configFile: Scalars["String"]["input"];
  cron?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["String"]["input"];
  intervalHours: Scalars["Int"]["input"];
  message: Scalars["String"]["input"];
  nextRunTime: Scalars["Time"]["input"];
};

export type Permissions = {
  __typename?: "Permissions";
  canCreateDistro: Scalars["Boolean"]["output"];
  canCreateProject: Scalars["Boolean"]["output"];
  canEditAdminSettings: Scalars["Boolean"]["output"];
  distroPermissions: DistroPermissions;
  projectPermissions: ProjectPermissions;
  userId: Scalars["String"]["output"];
};

export type PermissionsDistroPermissionsArgs = {
  options: DistroPermissionsOptions;
};

export type PermissionsProjectPermissionsArgs = {
  options: ProjectPermissionsOptions;
};

export type PlannerSettings = {
  __typename?: "PlannerSettings";
  commitQueueFactor: Scalars["Int"]["output"];
  expectedRuntimeFactor: Scalars["Int"]["output"];
  generateTaskFactor: Scalars["Int"]["output"];
  groupVersions: Scalars["Boolean"]["output"];
  mainlineTimeInQueueFactor: Scalars["Int"]["output"];
  patchFactor: Scalars["Int"]["output"];
  patchTimeInQueueFactor: Scalars["Int"]["output"];
  targetTime: Scalars["Duration"]["output"];
  version: PlannerVersion;
};

export type PlannerSettingsInput = {
  commitQueueFactor: Scalars["Int"]["input"];
  expectedRuntimeFactor: Scalars["Int"]["input"];
  generateTaskFactor: Scalars["Int"]["input"];
  groupVersions: Scalars["Boolean"]["input"];
  mainlineTimeInQueueFactor: Scalars["Int"]["input"];
  patchFactor: Scalars["Int"]["input"];
  patchTimeInQueueFactor: Scalars["Int"]["input"];
  targetTime: Scalars["Int"]["input"];
  version: PlannerVersion;
};

export enum PlannerVersion {
  Legacy = "LEGACY",
  Tunable = "TUNABLE",
}

export type Pod = {
  __typename?: "Pod";
  events: PodEvents;
  id: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  task?: Maybe<Task>;
  taskContainerCreationOpts: TaskContainerCreationOpts;
  type: Scalars["String"]["output"];
};

export type PodEventsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
};

export type PodEventLogData = {
  __typename?: "PodEventLogData";
  newStatus?: Maybe<Scalars["String"]["output"]>;
  oldStatus?: Maybe<Scalars["String"]["output"]>;
  reason?: Maybe<Scalars["String"]["output"]>;
  task?: Maybe<Task>;
  taskExecution?: Maybe<Scalars["Int"]["output"]>;
  taskID?: Maybe<Scalars["String"]["output"]>;
  taskStatus?: Maybe<Scalars["String"]["output"]>;
};

export type PodEventLogEntry = {
  __typename?: "PodEventLogEntry";
  data: PodEventLogData;
  eventType?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  processedAt: Scalars["Time"]["output"];
  resourceId: Scalars["String"]["output"];
  resourceType: Scalars["String"]["output"];
  timestamp?: Maybe<Scalars["Time"]["output"]>;
};

/**
 * PodEvents is the return value for the events query.
 * It contains the event log entries for a pod.
 */
export type PodEvents = {
  __typename?: "PodEvents";
  count: Scalars["Int"]["output"];
  eventLogEntries: Array<PodEventLogEntry>;
};

export type PreconditionScript = {
  __typename?: "PreconditionScript";
  path: Scalars["String"]["output"];
  script: Scalars["String"]["output"];
};

export type PreconditionScriptInput = {
  path: Scalars["String"]["input"];
  script: Scalars["String"]["input"];
};

/** Project models single repository on GitHub. */
export type Project = {
  __typename?: "Project";
  admins?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  banner?: Maybe<ProjectBanner>;
  batchTime: Scalars["Int"]["output"];
  branch: Scalars["String"]["output"];
  buildBaronSettings: BuildBaronSettings;
  commitQueue: CommitQueueParams;
  containerSizeDefinitions?: Maybe<Array<ContainerResources>>;
  deactivatePrevious?: Maybe<Scalars["Boolean"]["output"]>;
  disabledStatsCache?: Maybe<Scalars["Boolean"]["output"]>;
  dispatchingDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  displayName: Scalars["String"]["output"];
  enabled?: Maybe<Scalars["Boolean"]["output"]>;
  externalLinks?: Maybe<Array<ExternalLink>>;
  gitTagAuthorizedTeams?: Maybe<Array<Scalars["String"]["output"]>>;
  gitTagAuthorizedUsers?: Maybe<Array<Scalars["String"]["output"]>>;
  gitTagVersionsEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  githubChecksEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  githubTriggerAliases?: Maybe<Array<Scalars["String"]["output"]>>;
  hidden?: Maybe<Scalars["Boolean"]["output"]>;
  id: Scalars["String"]["output"];
  identifier: Scalars["String"]["output"];
  isFavorite: Scalars["Boolean"]["output"];
  manualPrTestingEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  notifyOnBuildFailure?: Maybe<Scalars["Boolean"]["output"]>;
  owner: Scalars["String"]["output"];
  parsleyFilters?: Maybe<Array<ParsleyFilter>>;
  patchTriggerAliases?: Maybe<Array<PatchTriggerAlias>>;
  patches: Patches;
  patchingDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  perfEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  periodicBuilds?: Maybe<Array<PeriodicBuild>>;
  prTestingEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  private?: Maybe<Scalars["Boolean"]["output"]>;
  projectHealthView: ProjectHealthView;
  remotePath: Scalars["String"]["output"];
  repo: Scalars["String"]["output"];
  repoRefId: Scalars["String"]["output"];
  repotrackerDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  repotrackerError?: Maybe<RepotrackerError>;
  restricted?: Maybe<Scalars["Boolean"]["output"]>;
  spawnHostScriptPath: Scalars["String"]["output"];
  stepbackBisect?: Maybe<Scalars["Boolean"]["output"]>;
  stepbackDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  taskAnnotationSettings: TaskAnnotationSettings;
  taskSync: TaskSyncOptions;
  tracksPushEvents?: Maybe<Scalars["Boolean"]["output"]>;
  triggers?: Maybe<Array<TriggerAlias>>;
  versionControlEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  workstationConfig: WorkstationConfig;
};

/** Project models single repository on GitHub. */
export type ProjectPatchesArgs = {
  patchesInput: PatchesInput;
};

export type ProjectAlias = {
  __typename?: "ProjectAlias";
  alias: Scalars["String"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  gitTag: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  parameters: Array<Parameter>;
  remotePath: Scalars["String"]["output"];
  task: Scalars["String"]["output"];
  taskTags: Array<Scalars["String"]["output"]>;
  variant: Scalars["String"]["output"];
  variantTags: Array<Scalars["String"]["output"]>;
};

export type ProjectAliasInput = {
  alias: Scalars["String"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  gitTag: Scalars["String"]["input"];
  id: Scalars["String"]["input"];
  parameters?: InputMaybe<Array<ParameterInput>>;
  remotePath: Scalars["String"]["input"];
  task: Scalars["String"]["input"];
  taskTags: Array<Scalars["String"]["input"]>;
  variant: Scalars["String"]["input"];
  variantTags: Array<Scalars["String"]["input"]>;
};

export type ProjectBanner = {
  __typename?: "ProjectBanner";
  text: Scalars["String"]["output"];
  theme: BannerTheme;
};

export type ProjectBannerInput = {
  text: Scalars["String"]["input"];
  theme: BannerTheme;
};

export type ProjectBuildVariant = {
  __typename?: "ProjectBuildVariant";
  displayName: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  tasks: Array<Scalars["String"]["output"]>;
};

export type ProjectEventLogEntry = {
  __typename?: "ProjectEventLogEntry";
  after?: Maybe<ProjectEventSettings>;
  before?: Maybe<ProjectEventSettings>;
  timestamp: Scalars["Time"]["output"];
  user: Scalars["String"]["output"];
};

export type ProjectEventSettings = {
  __typename?: "ProjectEventSettings";
  aliases?: Maybe<Array<ProjectAlias>>;
  githubWebhooksEnabled: Scalars["Boolean"]["output"];
  projectRef?: Maybe<Project>;
  subscriptions?: Maybe<Array<GeneralSubscription>>;
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
  count: Scalars["Int"]["output"];
  eventLogEntries: Array<ProjectEventLogEntry>;
};

export enum ProjectHealthView {
  All = "ALL",
  Failed = "FAILED",
}

export type ProjectInput = {
  admins?: InputMaybe<Array<Scalars["String"]["input"]>>;
  banner?: InputMaybe<ProjectBannerInput>;
  batchTime?: InputMaybe<Scalars["Int"]["input"]>;
  branch?: InputMaybe<Scalars["String"]["input"]>;
  buildBaronSettings?: InputMaybe<BuildBaronSettingsInput>;
  commitQueue?: InputMaybe<CommitQueueParamsInput>;
  containerSizeDefinitions?: InputMaybe<Array<ContainerResourcesInput>>;
  deactivatePrevious?: InputMaybe<Scalars["Boolean"]["input"]>;
  disabledStatsCache?: InputMaybe<Scalars["Boolean"]["input"]>;
  dispatchingDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  externalLinks?: InputMaybe<Array<ExternalLinkInput>>;
  gitTagAuthorizedTeams?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gitTagAuthorizedUsers?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gitTagVersionsEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  githubChecksEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  githubTriggerAliases?: InputMaybe<
    Array<InputMaybe<Scalars["String"]["input"]>>
  >;
  id: Scalars["String"]["input"];
  identifier?: InputMaybe<Scalars["String"]["input"]>;
  manualPrTestingEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  notifyOnBuildFailure?: InputMaybe<Scalars["Boolean"]["input"]>;
  owner?: InputMaybe<Scalars["String"]["input"]>;
  parsleyFilters?: InputMaybe<Array<ParsleyFilterInput>>;
  patchTriggerAliases?: InputMaybe<Array<PatchTriggerAliasInput>>;
  patchingDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  perfEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  periodicBuilds?: InputMaybe<Array<PeriodicBuildInput>>;
  prTestingEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  private?: InputMaybe<Scalars["Boolean"]["input"]>;
  projectHealthView?: InputMaybe<ProjectHealthView>;
  remotePath?: InputMaybe<Scalars["String"]["input"]>;
  repo?: InputMaybe<Scalars["String"]["input"]>;
  repotrackerDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  restricted?: InputMaybe<Scalars["Boolean"]["input"]>;
  spawnHostScriptPath?: InputMaybe<Scalars["String"]["input"]>;
  stepbackBisect?: InputMaybe<Scalars["Boolean"]["input"]>;
  stepbackDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  taskAnnotationSettings?: InputMaybe<TaskAnnotationSettingsInput>;
  taskSync?: InputMaybe<TaskSyncOptionsInput>;
  tracksPushEvents?: InputMaybe<Scalars["Boolean"]["input"]>;
  triggers?: InputMaybe<Array<TriggerAliasInput>>;
  versionControlEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  workstationConfig?: InputMaybe<WorkstationConfigInput>;
};

export type ProjectPermissions = {
  __typename?: "ProjectPermissions";
  edit: Scalars["Boolean"]["output"];
  view: Scalars["Boolean"]["output"];
};

export type ProjectPermissionsOptions = {
  projectIdentifier: Scalars["String"]["input"];
};

/** ProjectSettings models the settings for a given Project. */
export type ProjectSettings = {
  __typename?: "ProjectSettings";
  aliases?: Maybe<Array<ProjectAlias>>;
  githubWebhooksEnabled: Scalars["Boolean"]["output"];
  projectRef?: Maybe<Project>;
  subscriptions?: Maybe<Array<GeneralSubscription>>;
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
  githubWebhooksEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  ViewsAndFilters = "VIEWS_AND_FILTERS",
  Workstation = "WORKSTATION",
}

export type ProjectVars = {
  __typename?: "ProjectVars";
  adminOnlyVars: Array<Scalars["String"]["output"]>;
  privateVars: Array<Scalars["String"]["output"]>;
  vars?: Maybe<Scalars["StringMap"]["output"]>;
};

export type ProjectVarsInput = {
  adminOnlyVarsList?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  privateVarsList?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  vars?: InputMaybe<Scalars["StringMap"]["input"]>;
};

export enum Provider {
  Docker = "DOCKER",
  Ec2Fleet = "EC2_FLEET",
  Ec2OnDemand = "EC2_ON_DEMAND",
  Static = "STATIC",
}

/** PublicKey models a public key. Users can save/modify/delete their public keys. */
export type PublicKey = {
  __typename?: "PublicKey";
  key: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

/** PublicKeyInput is an input to the createPublicKey and updatePublicKey mutations. */
export type PublicKeyInput = {
  key: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
};

export type Query = {
  __typename?: "Query";
  awsRegions?: Maybe<Array<Scalars["String"]["output"]>>;
  bbGetCreatedTickets: Array<JiraTicket>;
  buildBaron: BuildBaron;
  buildVariantsForTaskName?: Maybe<Array<Maybe<BuildVariantTuple>>>;
  clientConfig?: Maybe<ClientConfig>;
  commitQueue: CommitQueue;
  distro?: Maybe<Distro>;
  distroEvents: DistroEventsPayload;
  distroTaskQueue: Array<TaskQueueItem>;
  distros: Array<Maybe<Distro>>;
  githubProjectConflicts: GithubProjectConflicts;
  hasVersion: Scalars["Boolean"]["output"];
  host?: Maybe<Host>;
  hostEvents: HostEvents;
  hosts: HostsResponse;
  instanceTypes: Array<Scalars["String"]["output"]>;
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
  subnetAvailabilityZones: Array<Scalars["String"]["output"]>;
  task?: Maybe<Task>;
  taskAllExecutions: Array<Task>;
  taskNamesForBuildVariant?: Maybe<Array<Scalars["String"]["output"]>>;
  taskQueueDistros: Array<TaskQueueDistro>;
  taskTestSample?: Maybe<Array<TaskTestResultSample>>;
  user: User;
  userConfig?: Maybe<UserConfig>;
  userSettings?: Maybe<UserSettings>;
  version: Version;
  viewableProjectRefs: Array<Maybe<GroupedProjects>>;
};

export type QueryBbGetCreatedTicketsArgs = {
  taskId: Scalars["String"]["input"];
};

export type QueryBuildBaronArgs = {
  execution: Scalars["Int"]["input"];
  taskId: Scalars["String"]["input"];
};

export type QueryBuildVariantsForTaskNameArgs = {
  projectIdentifier: Scalars["String"]["input"];
  taskName: Scalars["String"]["input"];
};

export type QueryCommitQueueArgs = {
  projectIdentifier: Scalars["String"]["input"];
};

export type QueryDistroArgs = {
  distroId: Scalars["String"]["input"];
};

export type QueryDistroEventsArgs = {
  opts: DistroEventsInput;
};

export type QueryDistroTaskQueueArgs = {
  distroId: Scalars["String"]["input"];
};

export type QueryDistrosArgs = {
  onlySpawnable: Scalars["Boolean"]["input"];
};

export type QueryGithubProjectConflictsArgs = {
  projectId: Scalars["String"]["input"];
};

export type QueryHasVersionArgs = {
  id: Scalars["String"]["input"];
};

export type QueryHostArgs = {
  hostId: Scalars["String"]["input"];
};

export type QueryHostEventsArgs = {
  hostId: Scalars["String"]["input"];
  hostTag?: InputMaybe<Scalars["String"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryHostsArgs = {
  currentTaskId?: InputMaybe<Scalars["String"]["input"]>;
  distroId?: InputMaybe<Scalars["String"]["input"]>;
  hostId?: InputMaybe<Scalars["String"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<HostSortBy>;
  sortDir?: InputMaybe<SortDirection>;
  startedBy?: InputMaybe<Scalars["String"]["input"]>;
  statuses?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type QueryLogkeeperBuildMetadataArgs = {
  buildId: Scalars["String"]["input"];
};

export type QueryMainlineCommitsArgs = {
  buildVariantOptions?: InputMaybe<BuildVariantOptions>;
  options: MainlineCommitsOptions;
};

export type QueryPatchArgs = {
  id: Scalars["String"]["input"];
};

export type QueryPodArgs = {
  podId: Scalars["String"]["input"];
};

export type QueryProjectArgs = {
  projectIdentifier: Scalars["String"]["input"];
};

export type QueryProjectEventsArgs = {
  before?: InputMaybe<Scalars["Time"]["input"]>;
  identifier: Scalars["String"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryProjectSettingsArgs = {
  identifier: Scalars["String"]["input"];
};

export type QueryRepoEventsArgs = {
  before?: InputMaybe<Scalars["Time"]["input"]>;
  id: Scalars["String"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryRepoSettingsArgs = {
  id: Scalars["String"]["input"];
};

export type QueryTaskArgs = {
  execution?: InputMaybe<Scalars["Int"]["input"]>;
  taskId: Scalars["String"]["input"];
};

export type QueryTaskAllExecutionsArgs = {
  taskId: Scalars["String"]["input"];
};

export type QueryTaskNamesForBuildVariantArgs = {
  buildVariant: Scalars["String"]["input"];
  projectIdentifier: Scalars["String"]["input"];
};

export type QueryTaskTestSampleArgs = {
  filters: Array<TestFilter>;
  tasks: Array<Scalars["String"]["input"]>;
};

export type QueryUserArgs = {
  userId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryVersionArgs = {
  id: Scalars["String"]["input"];
};

export type RepoCommitQueueParams = {
  __typename?: "RepoCommitQueueParams";
  enabled: Scalars["Boolean"]["output"];
  mergeMethod: Scalars["String"]["output"];
  mergeQueue: MergeQueue;
  message: Scalars["String"]["output"];
};

/**
 * RepoRef is technically a special kind of Project.
 * Repo types have booleans defaulted, which is why it is necessary to redeclare the types despite them matching nearly
 * exactly.
 */
export type RepoRef = {
  __typename?: "RepoRef";
  admins: Array<Scalars["String"]["output"]>;
  batchTime: Scalars["Int"]["output"];
  buildBaronSettings: BuildBaronSettings;
  commitQueue: RepoCommitQueueParams;
  containerSizeDefinitions?: Maybe<Array<ContainerResources>>;
  deactivatePrevious: Scalars["Boolean"]["output"];
  disabledStatsCache: Scalars["Boolean"]["output"];
  dispatchingDisabled: Scalars["Boolean"]["output"];
  displayName: Scalars["String"]["output"];
  enabled: Scalars["Boolean"]["output"];
  externalLinks?: Maybe<Array<ExternalLink>>;
  gitTagAuthorizedTeams?: Maybe<Array<Scalars["String"]["output"]>>;
  gitTagAuthorizedUsers?: Maybe<Array<Scalars["String"]["output"]>>;
  gitTagVersionsEnabled: Scalars["Boolean"]["output"];
  githubChecksEnabled: Scalars["Boolean"]["output"];
  githubTriggerAliases?: Maybe<Array<Scalars["String"]["output"]>>;
  id: Scalars["String"]["output"];
  manualPrTestingEnabled: Scalars["Boolean"]["output"];
  notifyOnBuildFailure: Scalars["Boolean"]["output"];
  owner: Scalars["String"]["output"];
  parsleyFilters?: Maybe<Array<ParsleyFilter>>;
  patchTriggerAliases?: Maybe<Array<PatchTriggerAlias>>;
  patchingDisabled: Scalars["Boolean"]["output"];
  perfEnabled: Scalars["Boolean"]["output"];
  periodicBuilds?: Maybe<Array<PeriodicBuild>>;
  prTestingEnabled: Scalars["Boolean"]["output"];
  private: Scalars["Boolean"]["output"];
  remotePath: Scalars["String"]["output"];
  repo: Scalars["String"]["output"];
  repotrackerDisabled: Scalars["Boolean"]["output"];
  restricted: Scalars["Boolean"]["output"];
  spawnHostScriptPath: Scalars["String"]["output"];
  stepbackBisect?: Maybe<Scalars["Boolean"]["output"]>;
  stepbackDisabled: Scalars["Boolean"]["output"];
  taskAnnotationSettings: TaskAnnotationSettings;
  taskSync: RepoTaskSyncOptions;
  tracksPushEvents: Scalars["Boolean"]["output"];
  triggers: Array<TriggerAlias>;
  versionControlEnabled: Scalars["Boolean"]["output"];
  workstationConfig: RepoWorkstationConfig;
};

export type RepoRefInput = {
  admins?: InputMaybe<Array<Scalars["String"]["input"]>>;
  batchTime?: InputMaybe<Scalars["Int"]["input"]>;
  buildBaronSettings?: InputMaybe<BuildBaronSettingsInput>;
  commitQueue?: InputMaybe<CommitQueueParamsInput>;
  containerSizeDefinitions?: InputMaybe<Array<ContainerResourcesInput>>;
  deactivatePrevious?: InputMaybe<Scalars["Boolean"]["input"]>;
  disabledStatsCache?: InputMaybe<Scalars["Boolean"]["input"]>;
  dispatchingDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  externalLinks?: InputMaybe<Array<ExternalLinkInput>>;
  gitTagAuthorizedTeams?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gitTagAuthorizedUsers?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gitTagVersionsEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  githubChecksEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  githubTriggerAliases?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id: Scalars["String"]["input"];
  manualPrTestingEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  notifyOnBuildFailure?: InputMaybe<Scalars["Boolean"]["input"]>;
  owner?: InputMaybe<Scalars["String"]["input"]>;
  parsleyFilters?: InputMaybe<Array<ParsleyFilterInput>>;
  patchTriggerAliases?: InputMaybe<Array<PatchTriggerAliasInput>>;
  patchingDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  perfEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  periodicBuilds?: InputMaybe<Array<PeriodicBuildInput>>;
  prTestingEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  private?: InputMaybe<Scalars["Boolean"]["input"]>;
  remotePath?: InputMaybe<Scalars["String"]["input"]>;
  repo?: InputMaybe<Scalars["String"]["input"]>;
  repotrackerDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  restricted?: InputMaybe<Scalars["Boolean"]["input"]>;
  spawnHostScriptPath?: InputMaybe<Scalars["String"]["input"]>;
  stepbackBisect?: InputMaybe<Scalars["Boolean"]["input"]>;
  stepbackDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  taskAnnotationSettings?: InputMaybe<TaskAnnotationSettingsInput>;
  taskSync?: InputMaybe<TaskSyncOptionsInput>;
  tracksPushEvents?: InputMaybe<Scalars["Boolean"]["input"]>;
  triggers?: InputMaybe<Array<TriggerAliasInput>>;
  versionControlEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  workstationConfig?: InputMaybe<WorkstationConfigInput>;
};

/** RepoSettings models the settings for a given RepoRef. */
export type RepoSettings = {
  __typename?: "RepoSettings";
  aliases?: Maybe<Array<ProjectAlias>>;
  githubWebhooksEnabled: Scalars["Boolean"]["output"];
  projectRef?: Maybe<RepoRef>;
  subscriptions?: Maybe<Array<GeneralSubscription>>;
  vars?: Maybe<ProjectVars>;
};

/**
 * RepoSettingsInput is the input to the saveRepoSettingsForSection mutation.
 * It contains information about repo settings (e.g. Build Baron configurations, subscriptions, etc) and is used to
 * update the settings for a given project.
 */
export type RepoSettingsInput = {
  aliases?: InputMaybe<Array<ProjectAliasInput>>;
  githubWebhooksEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  projectRef?: InputMaybe<RepoRefInput>;
  subscriptions?: InputMaybe<Array<SubscriptionInput>>;
  vars?: InputMaybe<ProjectVarsInput>;
};

export type RepoTaskSyncOptions = {
  __typename?: "RepoTaskSyncOptions";
  configEnabled: Scalars["Boolean"]["output"];
  patchEnabled: Scalars["Boolean"]["output"];
};

export type RepoWorkstationConfig = {
  __typename?: "RepoWorkstationConfig";
  gitClone: Scalars["Boolean"]["output"];
  setupCommands?: Maybe<Array<WorkstationSetupCommand>>;
};

export type RepotrackerError = {
  __typename?: "RepotrackerError";
  exists: Scalars["Boolean"]["output"];
  invalidRevision: Scalars["String"]["output"];
  mergeBaseRevision: Scalars["String"]["output"];
};

export enum RequiredStatus {
  MustFail = "MUST_FAIL",
  MustFinish = "MUST_FINISH",
  MustSucceed = "MUST_SUCCEED",
}

export type ResourceLimits = {
  __typename?: "ResourceLimits";
  lockedMemoryKb: Scalars["Int"]["output"];
  numFiles: Scalars["Int"]["output"];
  numProcesses: Scalars["Int"]["output"];
  numTasks: Scalars["Int"]["output"];
  virtualMemoryKb: Scalars["Int"]["output"];
};

export type ResourceLimitsInput = {
  lockedMemoryKb: Scalars["Int"]["input"];
  numFiles: Scalars["Int"]["input"];
  numProcesses: Scalars["Int"]["input"];
  numTasks: Scalars["Int"]["input"];
  virtualMemoryKb: Scalars["Int"]["input"];
};

export enum RoundingRule {
  Default = "DEFAULT",
  Down = "DOWN",
  Up = "UP",
}

export type SshKey = {
  __typename?: "SSHKey";
  location: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

/** SaveDistroInput is the input to the saveDistro mutation. */
export type SaveDistroInput = {
  distro: DistroInput;
  onSave: DistroOnSaveOperation;
};

/** Return type representing the updated distro and the number of hosts that were updated. */
export type SaveDistroPayload = {
  __typename?: "SaveDistroPayload";
  distro: Distro;
  hostCount: Scalars["Int"]["output"];
};

export type SearchReturnInfo = {
  __typename?: "SearchReturnInfo";
  featuresURL: Scalars["String"]["output"];
  issues: Array<JiraTicket>;
  search: Scalars["String"]["output"];
  source: Scalars["String"]["output"];
};

export type Selector = {
  __typename?: "Selector";
  data: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type SelectorInput = {
  data: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

/**
 * SetLastRevisionInput is the input to the setLastRevision mutation.
 * It contains information used to fix the repotracker error of a project.
 */
export type SetLastRevisionInput = {
  projectIdentifier: Scalars["String"]["input"];
  revision: Scalars["String"]["input"];
};

export type SetLastRevisionPayload = {
  __typename?: "SetLastRevisionPayload";
  mergeBaseRevision: Scalars["String"]["output"];
};

export type SlackConfig = {
  __typename?: "SlackConfig";
  name?: Maybe<Scalars["String"]["output"]>;
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
  author: Scalars["String"]["output"];
  requester: Scalars["String"]["output"];
  time: Scalars["Time"]["output"];
};

export type SpawnHostConfig = {
  __typename?: "SpawnHostConfig";
  spawnHostsPerUser: Scalars["Int"]["output"];
  unexpirableHostsPerUser: Scalars["Int"]["output"];
  unexpirableVolumesPerUser: Scalars["Int"]["output"];
};

/**
 * SpawnHostInput is the input to the spawnHost mutation.
 * Its fields determine the properties of the host that will be spawned.
 */
export type SpawnHostInput = {
  distroId: Scalars["String"]["input"];
  expiration?: InputMaybe<Scalars["Time"]["input"]>;
  homeVolumeSize?: InputMaybe<Scalars["Int"]["input"]>;
  isVirtualWorkStation: Scalars["Boolean"]["input"];
  noExpiration: Scalars["Boolean"]["input"];
  publicKey: PublicKeyInput;
  region: Scalars["String"]["input"];
  savePublicKey: Scalars["Boolean"]["input"];
  setUpScript?: InputMaybe<Scalars["String"]["input"]>;
  spawnHostsStartedByTask?: InputMaybe<Scalars["Boolean"]["input"]>;
  taskId?: InputMaybe<Scalars["String"]["input"]>;
  taskSync?: InputMaybe<Scalars["Boolean"]["input"]>;
  useProjectSetupScript?: InputMaybe<Scalars["Boolean"]["input"]>;
  useTaskConfig?: InputMaybe<Scalars["Boolean"]["input"]>;
  userDataScript?: InputMaybe<Scalars["String"]["input"]>;
  volumeId?: InputMaybe<Scalars["String"]["input"]>;
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
  availabilityZone: Scalars["String"]["input"];
  expiration?: InputMaybe<Scalars["Time"]["input"]>;
  host?: InputMaybe<Scalars["String"]["input"]>;
  noExpiration?: InputMaybe<Scalars["Boolean"]["input"]>;
  size: Scalars["Int"]["input"];
  type: Scalars["String"]["input"];
};

/**
 * SpruceConfig defines settings that apply to all users of Evergreen.
 * For example, if the banner field is populated, then a sitewide banner will be shown to all users.
 */
export type SpruceConfig = {
  __typename?: "SpruceConfig";
  banner?: Maybe<Scalars["String"]["output"]>;
  bannerTheme?: Maybe<Scalars["String"]["output"]>;
  containerPools?: Maybe<ContainerPoolsConfig>;
  githubOrgs: Array<Scalars["String"]["output"]>;
  jira?: Maybe<JiraConfig>;
  keys: Array<SshKey>;
  providers?: Maybe<CloudProviderConfig>;
  secretFields: Array<Scalars["String"]["output"]>;
  slack?: Maybe<SlackConfig>;
  spawnHost: SpawnHostConfig;
  ui?: Maybe<UiConfig>;
};

export type StatusCount = {
  __typename?: "StatusCount";
  count: Scalars["Int"]["output"];
  status: Scalars["String"]["output"];
};

export type StepbackInfo = {
  __typename?: "StepbackInfo";
  lastFailingStepbackTaskId?: Maybe<Scalars["String"]["output"]>;
  lastPassingStepbackTaskId?: Maybe<Scalars["String"]["output"]>;
  nextStepbackTaskId?: Maybe<Scalars["String"]["output"]>;
  previousStepbackTaskId?: Maybe<Scalars["String"]["output"]>;
};

export type Subscriber = {
  __typename?: "Subscriber";
  emailSubscriber?: Maybe<Scalars["String"]["output"]>;
  githubCheckSubscriber?: Maybe<GithubCheckSubscriber>;
  githubPRSubscriber?: Maybe<GithubPrSubscriber>;
  jiraCommentSubscriber?: Maybe<Scalars["String"]["output"]>;
  jiraIssueSubscriber?: Maybe<JiraIssueSubscriber>;
  slackSubscriber?: Maybe<Scalars["String"]["output"]>;
  webhookSubscriber?: Maybe<WebhookSubscriber>;
};

export type SubscriberInput = {
  jiraIssueSubscriber?: InputMaybe<JiraIssueSubscriberInput>;
  target: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
  webhookSubscriber?: InputMaybe<WebhookSubscriberInput>;
};

export type SubscriberWrapper = {
  __typename?: "SubscriberWrapper";
  subscriber: Subscriber;
  type: Scalars["String"]["output"];
};

/**
 * SubscriptionInput is the input to the saveSubscription mutation.
 * It stores information about a user's subscription to a version or task. For example, a user
 * can have a subscription to send them a Slack message when a version finishes.
 */
export type SubscriptionInput = {
  id?: InputMaybe<Scalars["String"]["input"]>;
  owner?: InputMaybe<Scalars["String"]["input"]>;
  owner_type?: InputMaybe<Scalars["String"]["input"]>;
  regex_selectors: Array<SelectorInput>;
  resource_type?: InputMaybe<Scalars["String"]["input"]>;
  selectors: Array<SelectorInput>;
  subscriber: SubscriberInput;
  trigger?: InputMaybe<Scalars["String"]["input"]>;
  trigger_data: Scalars["StringMap"]["input"];
};

/** Task models a task, the simplest unit of execution for Evergreen. */
export type Task = {
  __typename?: "Task";
  abortInfo?: Maybe<AbortInfo>;
  aborted: Scalars["Boolean"]["output"];
  activated: Scalars["Boolean"]["output"];
  activatedBy?: Maybe<Scalars["String"]["output"]>;
  activatedTime?: Maybe<Scalars["Time"]["output"]>;
  ami?: Maybe<Scalars["String"]["output"]>;
  annotation?: Maybe<Annotation>;
  baseStatus?: Maybe<Scalars["String"]["output"]>;
  baseTask?: Maybe<Task>;
  blocked: Scalars["Boolean"]["output"];
  buildId: Scalars["String"]["output"];
  buildVariant: Scalars["String"]["output"];
  buildVariantDisplayName?: Maybe<Scalars["String"]["output"]>;
  canAbort: Scalars["Boolean"]["output"];
  canDisable: Scalars["Boolean"]["output"];
  canModifyAnnotation: Scalars["Boolean"]["output"];
  canOverrideDependencies: Scalars["Boolean"]["output"];
  canRestart: Scalars["Boolean"]["output"];
  canSchedule: Scalars["Boolean"]["output"];
  canSetPriority: Scalars["Boolean"]["output"];
  canSync: Scalars["Boolean"]["output"];
  canUnschedule: Scalars["Boolean"]["output"];
  containerAllocatedTime?: Maybe<Scalars["Time"]["output"]>;
  createTime?: Maybe<Scalars["Time"]["output"]>;
  dependsOn?: Maybe<Array<Dependency>>;
  details?: Maybe<TaskEndDetail>;
  dispatchTime?: Maybe<Scalars["Time"]["output"]>;
  displayName: Scalars["String"]["output"];
  displayOnly?: Maybe<Scalars["Boolean"]["output"]>;
  displayTask?: Maybe<Task>;
  distroId: Scalars["String"]["output"];
  estimatedStart?: Maybe<Scalars["Duration"]["output"]>;
  execution: Scalars["Int"]["output"];
  executionTasks?: Maybe<Array<Scalars["String"]["output"]>>;
  executionTasksFull?: Maybe<Array<Task>>;
  expectedDuration?: Maybe<Scalars["Duration"]["output"]>;
  failedTestCount: Scalars["Int"]["output"];
  files: TaskFiles;
  finishTime?: Maybe<Scalars["Time"]["output"]>;
  generateTask?: Maybe<Scalars["Boolean"]["output"]>;
  generatedBy?: Maybe<Scalars["String"]["output"]>;
  generatedByName?: Maybe<Scalars["String"]["output"]>;
  hasCedarResults: Scalars["Boolean"]["output"];
  hostId?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  ingestTime?: Maybe<Scalars["Time"]["output"]>;
  isPerfPluginEnabled: Scalars["Boolean"]["output"];
  latestExecution: Scalars["Int"]["output"];
  logs: TaskLogLinks;
  minQueuePosition: Scalars["Int"]["output"];
  order: Scalars["Int"]["output"];
  patch?: Maybe<Patch>;
  patchNumber?: Maybe<Scalars["Int"]["output"]>;
  pod?: Maybe<Pod>;
  priority?: Maybe<Scalars["Int"]["output"]>;
  project?: Maybe<Project>;
  projectId: Scalars["String"]["output"];
  projectIdentifier?: Maybe<Scalars["String"]["output"]>;
  requester: Scalars["String"]["output"];
  resetWhenFinished: Scalars["Boolean"]["output"];
  revision?: Maybe<Scalars["String"]["output"]>;
  scheduledTime?: Maybe<Scalars["Time"]["output"]>;
  spawnHostLink?: Maybe<Scalars["String"]["output"]>;
  startTime?: Maybe<Scalars["Time"]["output"]>;
  status: Scalars["String"]["output"];
  stepbackInfo?: Maybe<StepbackInfo>;
  /** @deprecated Use files instead */
  taskFiles: TaskFiles;
  taskGroup?: Maybe<Scalars["String"]["output"]>;
  taskGroupMaxHosts?: Maybe<Scalars["Int"]["output"]>;
  /** taskLogs returns the tail 100 lines of the task's logs. */
  taskLogs: TaskLogs;
  tests: TaskTestResult;
  timeTaken?: Maybe<Scalars["Duration"]["output"]>;
  totalTestCount: Scalars["Int"]["output"];
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
  arch: Scalars["String"]["output"];
  cpu: Scalars["Int"]["output"];
  image: Scalars["String"]["output"];
  memoryMB: Scalars["Int"]["output"];
  os: Scalars["String"]["output"];
  workingDir: Scalars["String"]["output"];
};

export type TaskEndDetail = {
  __typename?: "TaskEndDetail";
  description?: Maybe<Scalars["String"]["output"]>;
  diskDevices: Array<Scalars["String"]["output"]>;
  oomTracker: OomTrackerInfo;
  status: Scalars["String"]["output"];
  timedOut?: Maybe<Scalars["Boolean"]["output"]>;
  timeoutType?: Maybe<Scalars["String"]["output"]>;
  traceID?: Maybe<Scalars["String"]["output"]>;
  type: Scalars["String"]["output"];
};

export type TaskEventLogData = {
  __typename?: "TaskEventLogData";
  blockedOn?: Maybe<Scalars["String"]["output"]>;
  hostId?: Maybe<Scalars["String"]["output"]>;
  jiraIssue?: Maybe<Scalars["String"]["output"]>;
  jiraLink?: Maybe<Scalars["String"]["output"]>;
  podId?: Maybe<Scalars["String"]["output"]>;
  priority?: Maybe<Scalars["Int"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  timestamp?: Maybe<Scalars["Time"]["output"]>;
  userId?: Maybe<Scalars["String"]["output"]>;
};

export type TaskEventLogEntry = {
  __typename?: "TaskEventLogEntry";
  data: TaskEventLogData;
  eventType?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  processedAt: Scalars["Time"]["output"];
  resourceId: Scalars["String"]["output"];
  resourceType: Scalars["String"]["output"];
  timestamp?: Maybe<Scalars["Time"]["output"]>;
};

/**
 * TaskFiles is the return value for the taskFiles query.
 * Some tasks generate files which are represented by this type.
 */
export type TaskFiles = {
  __typename?: "TaskFiles";
  fileCount: Scalars["Int"]["output"];
  groupedFiles: Array<GroupedFiles>;
};

/** TaskFilterOptions defines the parameters that are used when fetching tasks from a Version. */
export type TaskFilterOptions = {
  baseStatuses?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** @deprecated Use includeNeverActivatedTasks instead */
  includeEmptyActivation?: InputMaybe<Scalars["Boolean"]["input"]>;
  includeNeverActivatedTasks?: InputMaybe<Scalars["Boolean"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  sorts?: InputMaybe<Array<SortOrder>>;
  statuses?: InputMaybe<Array<Scalars["String"]["input"]>>;
  taskName?: InputMaybe<Scalars["String"]["input"]>;
  variant?: InputMaybe<Scalars["String"]["input"]>;
};

export type TaskInfo = {
  __typename?: "TaskInfo";
  id?: Maybe<Scalars["ID"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
};

export type TaskLogLinks = {
  __typename?: "TaskLogLinks";
  agentLogLink?: Maybe<Scalars["String"]["output"]>;
  allLogLink?: Maybe<Scalars["String"]["output"]>;
  eventLogLink?: Maybe<Scalars["String"]["output"]>;
  systemLogLink?: Maybe<Scalars["String"]["output"]>;
  taskLogLink?: Maybe<Scalars["String"]["output"]>;
};

/**
 * TaskLogs is the return value for the task.taskLogs query.
 * It contains the logs for a given task on a given execution.
 */
export type TaskLogs = {
  __typename?: "TaskLogs";
  agentLogs: Array<LogMessage>;
  allLogs: Array<LogMessage>;
  eventLogs: Array<TaskEventLogEntry>;
  execution: Scalars["Int"]["output"];
  systemLogs: Array<LogMessage>;
  taskId: Scalars["String"]["output"];
  taskLogs: Array<LogMessage>;
};

/**
 * TaskQueueDistro[] is the return value for the taskQueueDistros query.
 * It contains information about how many tasks and hosts are running on on a particular distro.
 */
export type TaskQueueDistro = {
  __typename?: "TaskQueueDistro";
  hostCount: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  taskCount: Scalars["Int"]["output"];
};

/**
 * TaskQueueItem[] is the return value for the distroTaskQueue query.
 * It contains information about any particular item on the task queue, such as the name of the task, the build variant of the task,
 * and how long it's expected to take to finish running.
 */
export type TaskQueueItem = {
  __typename?: "TaskQueueItem";
  activatedBy: Scalars["String"]["output"];
  buildVariant: Scalars["String"]["output"];
  displayName: Scalars["String"]["output"];
  expectedDuration: Scalars["Duration"]["output"];
  id: Scalars["ID"]["output"];
  priority: Scalars["Int"]["output"];
  project: Scalars["String"]["output"];
  requester: TaskQueueItemType;
  revision: Scalars["String"]["output"];
  version: Scalars["String"]["output"];
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
  patchAlias: Scalars["String"]["output"];
  taskRegex: Scalars["String"]["output"];
  variantRegex: Scalars["String"]["output"];
};

export type TaskSpecifierInput = {
  patchAlias: Scalars["String"]["input"];
  taskRegex: Scalars["String"]["input"];
  variantRegex: Scalars["String"]["input"];
};

export type TaskStats = {
  __typename?: "TaskStats";
  counts?: Maybe<Array<StatusCount>>;
  eta?: Maybe<Scalars["Time"]["output"]>;
};

export type TaskSyncOptions = {
  __typename?: "TaskSyncOptions";
  configEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  patchEnabled?: Maybe<Scalars["Boolean"]["output"]>;
};

export type TaskSyncOptionsInput = {
  configEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  patchEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**
 * TaskTestResult is the return value for the task.Tests resolver.
 * It contains the test results for a task. For example, if there is a task to run all unit tests, then the test results
 * could be the result of each individual unit test.
 */
export type TaskTestResult = {
  __typename?: "TaskTestResult";
  filteredTestCount: Scalars["Int"]["output"];
  testResults: Array<TestResult>;
  totalTestCount: Scalars["Int"]["output"];
};

/**
 * TaskTestResultSample is the return value for the taskTestSample query.
 * It is used to represent failing test results on the task history pages.
 */
export type TaskTestResultSample = {
  __typename?: "TaskTestResultSample";
  execution: Scalars["Int"]["output"];
  matchingFailedTestNames: Array<Scalars["String"]["output"]>;
  taskId: Scalars["String"]["output"];
  totalTestCount: Scalars["Int"]["output"];
};

/**
 * TestFilter is an input value for the taskTestSample query.
 * It's used to filter for tests with testName and status testStatus.
 */
export type TestFilter = {
  testName: Scalars["String"]["input"];
  testStatus: Scalars["String"]["input"];
};

/**
 * TestFilterOptions is an input for the task.Tests query.
 * It's used to filter, sort, and paginate test results of a task.
 */
export type TestFilterOptions = {
  excludeDisplayNames?: InputMaybe<Scalars["Boolean"]["input"]>;
  groupID?: InputMaybe<Scalars["String"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<TestSortOptions>>;
  statuses?: InputMaybe<Array<Scalars["String"]["input"]>>;
  testName?: InputMaybe<Scalars["String"]["input"]>;
};

export type TestLog = {
  __typename?: "TestLog";
  lineNum?: Maybe<Scalars["Int"]["output"]>;
  renderingType?: Maybe<Scalars["String"]["output"]>;
  url?: Maybe<Scalars["String"]["output"]>;
  urlParsley?: Maybe<Scalars["String"]["output"]>;
  urlRaw?: Maybe<Scalars["String"]["output"]>;
  version?: Maybe<Scalars["Int"]["output"]>;
};

export type TestResult = {
  __typename?: "TestResult";
  baseStatus?: Maybe<Scalars["String"]["output"]>;
  duration?: Maybe<Scalars["Float"]["output"]>;
  endTime?: Maybe<Scalars["Time"]["output"]>;
  execution?: Maybe<Scalars["Int"]["output"]>;
  exitCode?: Maybe<Scalars["Int"]["output"]>;
  groupID?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  logs: TestLog;
  startTime?: Maybe<Scalars["Time"]["output"]>;
  status: Scalars["String"]["output"];
  taskId?: Maybe<Scalars["String"]["output"]>;
  testFile: Scalars["String"]["output"];
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
  assignedTeam?: Maybe<Scalars["String"]["output"]>;
  assigneeDisplayName?: Maybe<Scalars["String"]["output"]>;
  created: Scalars["String"]["output"];
  resolutionName?: Maybe<Scalars["String"]["output"]>;
  status: JiraStatus;
  summary: Scalars["String"]["output"];
  updated: Scalars["String"]["output"];
};

export type TriggerAlias = {
  __typename?: "TriggerAlias";
  alias: Scalars["String"]["output"];
  buildVariantRegex: Scalars["String"]["output"];
  configFile: Scalars["String"]["output"];
  dateCutoff?: Maybe<Scalars["Int"]["output"]>;
  level: Scalars["String"]["output"];
  project: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  taskRegex: Scalars["String"]["output"];
  unscheduleDownstreamVersions?: Maybe<Scalars["Boolean"]["output"]>;
};

export type TriggerAliasInput = {
  alias: Scalars["String"]["input"];
  buildVariantRegex: Scalars["String"]["input"];
  configFile: Scalars["String"]["input"];
  dateCutoff?: InputMaybe<Scalars["Int"]["input"]>;
  level: Scalars["String"]["input"];
  project: Scalars["String"]["input"];
  status: Scalars["String"]["input"];
  taskRegex: Scalars["String"]["input"];
  unscheduleDownstreamVersions?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type UiConfig = {
  __typename?: "UIConfig";
  defaultProject: Scalars["String"]["output"];
  userVoice?: Maybe<Scalars["String"]["output"]>;
};

/**
 * UpdateVolumeInput is the input to the updateVolume mutation.
 * Its fields determine how a given volume will be modified.
 */
export type UpdateVolumeInput = {
  expiration?: InputMaybe<Scalars["Time"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  noExpiration?: InputMaybe<Scalars["Boolean"]["input"]>;
  volumeId: Scalars["String"]["input"];
};

export type UpstreamProject = {
  __typename?: "UpstreamProject";
  owner: Scalars["String"]["output"];
  project: Scalars["String"]["output"];
  repo: Scalars["String"]["output"];
  resourceID: Scalars["String"]["output"];
  revision: Scalars["String"]["output"];
  task?: Maybe<Task>;
  triggerID: Scalars["String"]["output"];
  triggerType: Scalars["String"]["output"];
  version?: Maybe<Version>;
};

export type UseSpruceOptions = {
  __typename?: "UseSpruceOptions";
  hasUsedMainlineCommitsBefore?: Maybe<Scalars["Boolean"]["output"]>;
  hasUsedSpruceBefore?: Maybe<Scalars["Boolean"]["output"]>;
  spruceV1?: Maybe<Scalars["Boolean"]["output"]>;
};

export type UseSpruceOptionsInput = {
  hasUsedMainlineCommitsBefore?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasUsedSpruceBefore?: InputMaybe<Scalars["Boolean"]["input"]>;
  spruceV1?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**
 * User is returned by the user query.
 * It contains information about a user's id, name, email, and permissions.
 */
export type User = {
  __typename?: "User";
  displayName: Scalars["String"]["output"];
  emailAddress: Scalars["String"]["output"];
  patches: Patches;
  permissions: Permissions;
  subscriptions?: Maybe<Array<GeneralSubscription>>;
  userId: Scalars["String"]["output"];
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
  api_key: Scalars["String"]["output"];
  api_server_host: Scalars["String"]["output"];
  ui_server_host: Scalars["String"]["output"];
  user: Scalars["String"]["output"];
};

/**
 * UserSettings is returned by the userSettings query.
 * It contains information about a user's settings, such as their GitHub username or timezone.
 */
export type UserSettings = {
  __typename?: "UserSettings";
  dateFormat?: Maybe<Scalars["String"]["output"]>;
  githubUser?: Maybe<GithubUser>;
  notifications?: Maybe<Notifications>;
  region?: Maybe<Scalars["String"]["output"]>;
  slackMemberId?: Maybe<Scalars["String"]["output"]>;
  slackUsername?: Maybe<Scalars["String"]["output"]>;
  timeFormat?: Maybe<Scalars["String"]["output"]>;
  timezone?: Maybe<Scalars["String"]["output"]>;
  useSpruceOptions?: Maybe<UseSpruceOptions>;
};

/**
 * UserSettingsInput is the input to the updateUserSettings mutation.
 * It is used to update user information such as GitHub or Slack username.
 */
export type UserSettingsInput = {
  dateFormat?: InputMaybe<Scalars["String"]["input"]>;
  githubUser?: InputMaybe<GithubUserInput>;
  notifications?: InputMaybe<NotificationsInput>;
  region?: InputMaybe<Scalars["String"]["input"]>;
  slackMemberId?: InputMaybe<Scalars["String"]["input"]>;
  slackUsername?: InputMaybe<Scalars["String"]["input"]>;
  timeFormat?: InputMaybe<Scalars["String"]["input"]>;
  timezone?: InputMaybe<Scalars["String"]["input"]>;
  useSpruceOptions?: InputMaybe<UseSpruceOptionsInput>;
};

export type VariantTask = {
  __typename?: "VariantTask";
  name: Scalars["String"]["output"];
  tasks: Array<Scalars["String"]["output"]>;
};

export type VariantTasks = {
  displayTasks: Array<DisplayTask>;
  tasks: Array<Scalars["String"]["input"]>;
  variant: Scalars["String"]["input"];
};

/** Version models a commit within a project. */
export type Version = {
  __typename?: "Version";
  activated?: Maybe<Scalars["Boolean"]["output"]>;
  author: Scalars["String"]["output"];
  authorEmail: Scalars["String"]["output"];
  baseTaskStatuses: Array<Scalars["String"]["output"]>;
  baseVersion?: Maybe<Version>;
  branch: Scalars["String"]["output"];
  buildVariantStats?: Maybe<Array<GroupedTaskStatusCount>>;
  buildVariants?: Maybe<Array<Maybe<GroupedBuildVariant>>>;
  childVersions?: Maybe<Array<Maybe<Version>>>;
  createTime: Scalars["Time"]["output"];
  errors: Array<Scalars["String"]["output"]>;
  externalLinksForMetadata: Array<ExternalLinkForMetadata>;
  finishTime?: Maybe<Scalars["Time"]["output"]>;
  gitTags?: Maybe<Array<GitTag>>;
  id: Scalars["String"]["output"];
  ignored: Scalars["Boolean"]["output"];
  isPatch: Scalars["Boolean"]["output"];
  manifest?: Maybe<Manifest>;
  message: Scalars["String"]["output"];
  order: Scalars["Int"]["output"];
  parameters: Array<Parameter>;
  patch?: Maybe<Patch>;
  previousVersion?: Maybe<Version>;
  project: Scalars["String"]["output"];
  projectIdentifier: Scalars["String"]["output"];
  projectMetadata?: Maybe<Project>;
  repo: Scalars["String"]["output"];
  requester: Scalars["String"]["output"];
  revision: Scalars["String"]["output"];
  startTime?: Maybe<Scalars["Time"]["output"]>;
  status: Scalars["String"]["output"];
  taskCount?: Maybe<Scalars["Int"]["output"]>;
  taskStatusStats?: Maybe<TaskStats>;
  taskStatuses: Array<Scalars["String"]["output"]>;
  tasks: VersionTasks;
  upstreamProject?: Maybe<UpstreamProject>;
  versionTiming?: Maybe<VersionTiming>;
  warnings: Array<Scalars["String"]["output"]>;
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
  count: Scalars["Int"]["output"];
  data: Array<Task>;
};

export type VersionTiming = {
  __typename?: "VersionTiming";
  makespan?: Maybe<Scalars["Duration"]["output"]>;
  timeTaken?: Maybe<Scalars["Duration"]["output"]>;
};

/**
 * VersionToRestart is the input to the restartVersions mutation.
 * It contains an array of taskIds to restart for a given versionId.
 */
export type VersionToRestart = {
  taskIds: Array<Scalars["String"]["input"]>;
  versionId: Scalars["String"]["input"];
};

export type Volume = {
  __typename?: "Volume";
  availabilityZone: Scalars["String"]["output"];
  createdBy: Scalars["String"]["output"];
  creationTime?: Maybe<Scalars["Time"]["output"]>;
  deviceName?: Maybe<Scalars["String"]["output"]>;
  displayName: Scalars["String"]["output"];
  expiration?: Maybe<Scalars["Time"]["output"]>;
  homeVolume: Scalars["Boolean"]["output"];
  host?: Maybe<Host>;
  hostID: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  migrating: Scalars["Boolean"]["output"];
  noExpiration: Scalars["Boolean"]["output"];
  size: Scalars["Int"]["output"];
  type: Scalars["String"]["output"];
};

/**
 * VolumeHost is the input to the attachVolumeToHost mutation.
 * Its fields are used to attach the volume with volumeId to the host with hostId.
 */
export type VolumeHost = {
  hostId: Scalars["String"]["input"];
  volumeId: Scalars["String"]["input"];
};

export type Webhook = {
  __typename?: "Webhook";
  endpoint: Scalars["String"]["output"];
  secret: Scalars["String"]["output"];
};

export type WebhookHeader = {
  __typename?: "WebhookHeader";
  key: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type WebhookHeaderInput = {
  key: Scalars["String"]["input"];
  value: Scalars["String"]["input"];
};

export type WebhookInput = {
  endpoint: Scalars["String"]["input"];
  secret: Scalars["String"]["input"];
};

export type WebhookSubscriber = {
  __typename?: "WebhookSubscriber";
  headers: Array<Maybe<WebhookHeader>>;
  minDelayMs: Scalars["Int"]["output"];
  retries: Scalars["Int"]["output"];
  secret: Scalars["String"]["output"];
  timeoutMs: Scalars["Int"]["output"];
  url: Scalars["String"]["output"];
};

export type WebhookSubscriberInput = {
  headers: Array<InputMaybe<WebhookHeaderInput>>;
  minDelayMs?: InputMaybe<Scalars["Int"]["input"]>;
  retries?: InputMaybe<Scalars["Int"]["input"]>;
  secret: Scalars["String"]["input"];
  timeoutMs?: InputMaybe<Scalars["Int"]["input"]>;
  url: Scalars["String"]["input"];
};

export type WorkstationConfig = {
  __typename?: "WorkstationConfig";
  gitClone?: Maybe<Scalars["Boolean"]["output"]>;
  setupCommands?: Maybe<Array<WorkstationSetupCommand>>;
};

export type WorkstationConfigInput = {
  gitClone?: InputMaybe<Scalars["Boolean"]["input"]>;
  setupCommands?: InputMaybe<Array<WorkstationSetupCommandInput>>;
};

export type WorkstationSetupCommand = {
  __typename?: "WorkstationSetupCommand";
  command: Scalars["String"]["output"];
  directory: Scalars["String"]["output"];
};

export type WorkstationSetupCommandInput = {
  command: Scalars["String"]["input"];
  directory?: InputMaybe<Scalars["String"]["input"]>;
};

export type AnnotationFragment = {
  __typename?: "Annotation";
  id: string;
  taskExecution: number;
  taskId: string;
  webhookConfigured: boolean;
  createdIssues?: Array<{
    __typename?: "IssueLink";
    issueKey?: string | null;
    url?: string | null;
    source?: {
      __typename?: "Source";
      author: string;
      requester: string;
      time: Date;
    } | null;
  } | null> | null;
  issues?: Array<{
    __typename?: "IssueLink";
    issueKey?: string | null;
    url?: string | null;
    source?: {
      __typename?: "Source";
      author: string;
      requester: string;
      time: Date;
    } | null;
  } | null> | null;
  metadataLinks?: Array<{
    __typename?: "MetadataLink";
    text: string;
    url: string;
  } | null> | null;
  note?: {
    __typename?: "Note";
    message: string;
    source: {
      __typename?: "Source";
      author: string;
      requester: string;
      time: Date;
    };
  } | null;
  suspectedIssues?: Array<{
    __typename?: "IssueLink";
    issueKey?: string | null;
    url?: string | null;
    source?: {
      __typename?: "Source";
      author: string;
      requester: string;
      time: Date;
    } | null;
  } | null> | null;
};

export type IssueLinkFragment = {
  __typename?: "IssueLink";
  confidenceScore?: number | null;
  issueKey?: string | null;
  url?: string | null;
  jiraTicket?: {
    __typename?: "JiraTicket";
    key: string;
    fields: {
      __typename?: "TicketFields";
      assignedTeam?: string | null;
      assigneeDisplayName?: string | null;
      created: string;
      resolutionName?: string | null;
      summary: string;
      updated: string;
      status: { __typename?: "JiraStatus"; id: string; name: string };
    };
  } | null;
  source?: {
    __typename?: "Source";
    author: string;
    requester: string;
    time: Date;
  } | null;
};

export type JiraTicketFragment = {
  __typename?: "JiraTicket";
  key: string;
  fields: {
    __typename?: "TicketFields";
    assignedTeam?: string | null;
    assigneeDisplayName?: string | null;
    created: string;
    resolutionName?: string | null;
    summary: string;
    updated: string;
    status: { __typename?: "JiraStatus"; id: string; name: string };
  };
};

export type BaseHostFragment = {
  __typename?: "Host";
  hostUrl: string;
  id: string;
  provider: string;
  startedBy: string;
  status: string;
  tag: string;
  uptime?: Date | null;
  user?: string | null;
};

export type BasePatchFragment = {
  __typename?: "Patch";
  activated: boolean;
  alias?: string | null;
  author: string;
  commitQueuePosition?: number | null;
  description: string;
  id: string;
  status: string;
  parameters: Array<{ __typename?: "Parameter"; key: string; value: string }>;
  variantsTasks: Array<{
    __typename?: "VariantTask";
    name: string;
    tasks: Array<string>;
  } | null>;
};

export type BaseSpawnHostFragment = {
  __typename?: "Host";
  availabilityZone?: string | null;
  displayName?: string | null;
  expiration?: Date | null;
  homeVolumeID?: string | null;
  instanceType?: string | null;
  noExpiration: boolean;
  hostUrl: string;
  id: string;
  provider: string;
  startedBy: string;
  status: string;
  tag: string;
  uptime?: Date | null;
  user?: string | null;
  distro?: {
    __typename?: "DistroInfo";
    id?: string | null;
    isVirtualWorkStation?: boolean | null;
    isWindows?: boolean | null;
    user?: string | null;
    workDir?: string | null;
  } | null;
  homeVolume?: {
    __typename?: "Volume";
    displayName: string;
    id: string;
  } | null;
  instanceTags: Array<{
    __typename?: "InstanceTag";
    canBeModified: boolean;
    key: string;
    value: string;
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
  buildVariant: string;
  buildVariantDisplayName?: string | null;
  displayName: string;
  execution: number;
  id: string;
  revision?: string | null;
  status: string;
};

export type FileDiffsFragment = {
  __typename?: "FileDiff";
  additions: number;
  deletions: number;
  description: string;
  diffLink: string;
  fileName: string;
};

export type LogMessageFragment = {
  __typename?: "LogMessage";
  message?: string | null;
  severity?: string | null;
  timestamp?: Date | null;
};

export type ModuleCodeChangeFragment = {
  __typename?: "ModuleCodeChange";
  branchName: string;
  htmlLink: string;
  rawLink: string;
  fileDiffs: Array<{
    __typename?: "FileDiff";
    additions: number;
    deletions: number;
    description: string;
    diffLink: string;
    fileName: string;
  }>;
};

export type PatchesPagePatchesFragment = {
  __typename?: "Patches";
  filteredPatchCount: number;
  patches: Array<{
    __typename?: "Patch";
    activated: boolean;
    alias?: string | null;
    author: string;
    authorDisplayName: string;
    canEnqueueToCommitQueue: boolean;
    commitQueuePosition?: number | null;
    createTime?: Date | null;
    description: string;
    hidden: boolean;
    id: string;
    projectIdentifier: string;
    status: string;
    projectMetadata?: {
      __typename?: "Project";
      owner: string;
      repo: string;
    } | null;
    versionFull?: {
      __typename?: "Version";
      id: string;
      status: string;
      taskStatusStats?: {
        __typename?: "TaskStats";
        counts?: Array<{
          __typename?: "StatusCount";
          count: number;
          status: string;
        }> | null;
      } | null;
    } | null;
  }>;
};

export type ProjectAccessSettingsFragment = {
  __typename?: "Project";
  admins?: Array<string | null> | null;
  restricted?: boolean | null;
};

export type RepoAccessSettingsFragment = {
  __typename?: "RepoRef";
  admins: Array<string>;
  restricted: boolean;
};

export type AliasFragment = {
  __typename?: "ProjectAlias";
  alias: string;
  description?: string | null;
  gitTag: string;
  id: string;
  remotePath: string;
  task: string;
  taskTags: Array<string>;
  variant: string;
  variantTags: Array<string>;
  parameters: Array<{ __typename?: "Parameter"; key: string; value: string }>;
};

export type ProjectContainerSettingsFragment = {
  __typename?: "Project";
  containerSizeDefinitions?: Array<{
    __typename?: "ContainerResources";
    cpu: number;
    memoryMb: number;
    name: string;
  }> | null;
};

export type RepoContainerSettingsFragment = {
  __typename?: "RepoRef";
  containerSizeDefinitions?: Array<{
    __typename?: "ContainerResources";
    cpu: number;
    memoryMb: number;
    name: string;
  }> | null;
};

export type ProjectGeneralSettingsFragment = {
  __typename?: "Project";
  batchTime: number;
  branch: string;
  deactivatePrevious?: boolean | null;
  disabledStatsCache?: boolean | null;
  dispatchingDisabled?: boolean | null;
  displayName: string;
  enabled?: boolean | null;
  owner: string;
  patchingDisabled?: boolean | null;
  remotePath: string;
  repo: string;
  repotrackerDisabled?: boolean | null;
  spawnHostScriptPath: string;
  stepbackBisect?: boolean | null;
  stepbackDisabled?: boolean | null;
  versionControlEnabled?: boolean | null;
  taskSync: {
    __typename?: "TaskSyncOptions";
    configEnabled?: boolean | null;
    patchEnabled?: boolean | null;
  };
};

export type RepoGeneralSettingsFragment = {
  __typename?: "RepoRef";
  batchTime: number;
  deactivatePrevious: boolean;
  disabledStatsCache: boolean;
  dispatchingDisabled: boolean;
  displayName: string;
  owner: string;
  patchingDisabled: boolean;
  remotePath: string;
  repo: string;
  repotrackerDisabled: boolean;
  spawnHostScriptPath: string;
  stepbackBisect?: boolean | null;
  stepbackDisabled: boolean;
  versionControlEnabled: boolean;
  taskSync: {
    __typename?: "RepoTaskSyncOptions";
    configEnabled: boolean;
    patchEnabled: boolean;
  };
};

export type ProjectGithubSettingsFragment = {
  __typename?: "Project";
  githubChecksEnabled?: boolean | null;
  githubTriggerAliases?: Array<string> | null;
  gitTagAuthorizedTeams?: Array<string> | null;
  gitTagAuthorizedUsers?: Array<string> | null;
  gitTagVersionsEnabled?: boolean | null;
  manualPrTestingEnabled?: boolean | null;
  prTestingEnabled?: boolean | null;
  commitQueue: {
    __typename?: "CommitQueueParams";
    enabled?: boolean | null;
    mergeMethod: string;
    mergeQueue: MergeQueue;
    message: string;
  };
};

export type RepoGithubSettingsFragment = {
  __typename?: "RepoRef";
  githubChecksEnabled: boolean;
  githubTriggerAliases?: Array<string> | null;
  gitTagAuthorizedTeams?: Array<string> | null;
  gitTagAuthorizedUsers?: Array<string> | null;
  gitTagVersionsEnabled: boolean;
  manualPrTestingEnabled: boolean;
  prTestingEnabled: boolean;
  commitQueue: {
    __typename?: "RepoCommitQueueParams";
    enabled: boolean;
    mergeMethod: string;
    mergeQueue: MergeQueue;
    message: string;
  };
};

export type ProjectGithubCommitQueueFragment = {
  __typename?: "ProjectSettings";
  githubWebhooksEnabled: boolean;
  projectRef?: {
    __typename?: "Project";
    githubChecksEnabled?: boolean | null;
    githubTriggerAliases?: Array<string> | null;
    gitTagAuthorizedTeams?: Array<string> | null;
    gitTagAuthorizedUsers?: Array<string> | null;
    gitTagVersionsEnabled?: boolean | null;
    manualPrTestingEnabled?: boolean | null;
    prTestingEnabled?: boolean | null;
    commitQueue: {
      __typename?: "CommitQueueParams";
      enabled?: boolean | null;
      mergeMethod: string;
      mergeQueue: MergeQueue;
      message: string;
    };
  } | null;
};

export type RepoGithubCommitQueueFragment = {
  __typename?: "RepoSettings";
  githubWebhooksEnabled: boolean;
  projectRef?: {
    __typename?: "RepoRef";
    githubChecksEnabled: boolean;
    githubTriggerAliases?: Array<string> | null;
    gitTagAuthorizedTeams?: Array<string> | null;
    gitTagAuthorizedUsers?: Array<string> | null;
    gitTagVersionsEnabled: boolean;
    manualPrTestingEnabled: boolean;
    prTestingEnabled: boolean;
    commitQueue: {
      __typename?: "RepoCommitQueueParams";
      enabled: boolean;
      mergeMethod: string;
      mergeQueue: MergeQueue;
      message: string;
    };
  } | null;
};

export type ProjectEventGithubCommitQueueFragment = {
  __typename?: "ProjectEventSettings";
  githubWebhooksEnabled: boolean;
  projectRef?: {
    __typename?: "Project";
    githubChecksEnabled?: boolean | null;
    githubTriggerAliases?: Array<string> | null;
    gitTagAuthorizedTeams?: Array<string> | null;
    gitTagAuthorizedUsers?: Array<string> | null;
    gitTagVersionsEnabled?: boolean | null;
    manualPrTestingEnabled?: boolean | null;
    prTestingEnabled?: boolean | null;
    commitQueue: {
      __typename?: "CommitQueueParams";
      enabled?: boolean | null;
      mergeMethod: string;
      mergeQueue: MergeQueue;
      message: string;
    };
  } | null;
};

export type ProjectSettingsFieldsFragment = {
  __typename?: "ProjectSettings";
  githubWebhooksEnabled: boolean;
  aliases?: Array<{
    __typename?: "ProjectAlias";
    alias: string;
    description?: string | null;
    gitTag: string;
    id: string;
    remotePath: string;
    task: string;
    taskTags: Array<string>;
    variant: string;
    variantTags: Array<string>;
    parameters: Array<{ __typename?: "Parameter"; key: string; value: string }>;
  }> | null;
  projectRef?: {
    __typename?: "Project";
    id: string;
    identifier: string;
    repoRefId: string;
    admins?: Array<string | null> | null;
    restricted?: boolean | null;
    batchTime: number;
    branch: string;
    deactivatePrevious?: boolean | null;
    disabledStatsCache?: boolean | null;
    dispatchingDisabled?: boolean | null;
    displayName: string;
    enabled?: boolean | null;
    owner: string;
    patchingDisabled?: boolean | null;
    remotePath: string;
    repo: string;
    repotrackerDisabled?: boolean | null;
    spawnHostScriptPath: string;
    stepbackBisect?: boolean | null;
    stepbackDisabled?: boolean | null;
    versionControlEnabled?: boolean | null;
    notifyOnBuildFailure?: boolean | null;
    githubTriggerAliases?: Array<string> | null;
    perfEnabled?: boolean | null;
    projectHealthView: ProjectHealthView;
    githubChecksEnabled?: boolean | null;
    gitTagAuthorizedTeams?: Array<string> | null;
    gitTagAuthorizedUsers?: Array<string> | null;
    gitTagVersionsEnabled?: boolean | null;
    manualPrTestingEnabled?: boolean | null;
    prTestingEnabled?: boolean | null;
    containerSizeDefinitions?: Array<{
      __typename?: "ContainerResources";
      cpu: number;
      memoryMb: number;
      name: string;
    }> | null;
    taskSync: {
      __typename?: "TaskSyncOptions";
      configEnabled?: boolean | null;
      patchEnabled?: boolean | null;
    };
    banner?: {
      __typename?: "ProjectBanner";
      text: string;
      theme: BannerTheme;
    } | null;
    patchTriggerAliases?: Array<{
      __typename?: "PatchTriggerAlias";
      alias: string;
      childProjectIdentifier: string;
      parentAsModule?: string | null;
      status?: string | null;
      taskSpecifiers?: Array<{
        __typename?: "TaskSpecifier";
        patchAlias: string;
        taskRegex: string;
        variantRegex: string;
      }> | null;
    }> | null;
    periodicBuilds?: Array<{
      __typename?: "PeriodicBuild";
      alias: string;
      configFile: string;
      cron: string;
      id: string;
      intervalHours: number;
      message: string;
      nextRunTime: Date;
    }> | null;
    buildBaronSettings: {
      __typename?: "BuildBaronSettings";
      ticketCreateIssueType: string;
      ticketCreateProject: string;
      ticketSearchProjects?: Array<string> | null;
    };
    externalLinks?: Array<{
      __typename?: "ExternalLink";
      displayName: string;
      requesters: Array<string>;
      urlTemplate: string;
    }> | null;
    taskAnnotationSettings: {
      __typename?: "TaskAnnotationSettings";
      fileTicketWebhook: {
        __typename?: "Webhook";
        endpoint: string;
        secret: string;
      };
      jiraCustomFields?: Array<{
        __typename?: "JiraField";
        displayText: string;
        field: string;
      }> | null;
    };
    triggers?: Array<{
      __typename?: "TriggerAlias";
      alias: string;
      buildVariantRegex: string;
      configFile: string;
      dateCutoff?: number | null;
      level: string;
      project: string;
      status: string;
      taskRegex: string;
      unscheduleDownstreamVersions?: boolean | null;
    }> | null;
    parsleyFilters?: Array<{
      __typename?: "ParsleyFilter";
      caseSensitive: boolean;
      exactMatch: boolean;
      expression: string;
    }> | null;
    workstationConfig: {
      __typename?: "WorkstationConfig";
      gitClone?: boolean | null;
      setupCommands?: Array<{
        __typename?: "WorkstationSetupCommand";
        command: string;
        directory: string;
      }> | null;
    };
    commitQueue: {
      __typename?: "CommitQueueParams";
      enabled?: boolean | null;
      mergeMethod: string;
      mergeQueue: MergeQueue;
      message: string;
    };
  } | null;
  subscriptions?: Array<{
    __typename?: "GeneralSubscription";
    id: string;
    ownerType: string;
    resourceType: string;
    trigger: string;
    triggerData?: { [key: string]: any } | null;
    regexSelectors: Array<{
      __typename?: "Selector";
      data: string;
      type: string;
    }>;
    selectors: Array<{ __typename?: "Selector"; data: string; type: string }>;
    subscriber?: {
      __typename?: "SubscriberWrapper";
      type: string;
      subscriber: {
        __typename?: "Subscriber";
        emailSubscriber?: string | null;
        jiraCommentSubscriber?: string | null;
        slackSubscriber?: string | null;
        githubCheckSubscriber?: {
          __typename?: "GithubCheckSubscriber";
          owner: string;
          ref: string;
          repo: string;
        } | null;
        githubPRSubscriber?: {
          __typename?: "GithubPRSubscriber";
          owner: string;
          prNumber?: number | null;
          ref: string;
          repo: string;
        } | null;
        jiraIssueSubscriber?: {
          __typename?: "JiraIssueSubscriber";
          issueType: string;
          project: string;
        } | null;
        webhookSubscriber?: {
          __typename?: "WebhookSubscriber";
          minDelayMs: number;
          retries: number;
          secret: string;
          timeoutMs: number;
          url: string;
          headers: Array<{
            __typename?: "WebhookHeader";
            key: string;
            value: string;
          } | null>;
        } | null;
      };
    } | null;
  }> | null;
  vars?: {
    __typename?: "ProjectVars";
    adminOnlyVars: Array<string>;
    privateVars: Array<string>;
    vars?: { [key: string]: any } | null;
  } | null;
};

export type RepoSettingsFieldsFragment = {
  __typename?: "RepoSettings";
  githubWebhooksEnabled: boolean;
  aliases?: Array<{
    __typename?: "ProjectAlias";
    alias: string;
    description?: string | null;
    gitTag: string;
    id: string;
    remotePath: string;
    task: string;
    taskTags: Array<string>;
    variant: string;
    variantTags: Array<string>;
    parameters: Array<{ __typename?: "Parameter"; key: string; value: string }>;
  }> | null;
  projectRef?: {
    __typename?: "RepoRef";
    displayName: string;
    id: string;
    admins: Array<string>;
    restricted: boolean;
    batchTime: number;
    deactivatePrevious: boolean;
    disabledStatsCache: boolean;
    dispatchingDisabled: boolean;
    owner: string;
    patchingDisabled: boolean;
    remotePath: string;
    repo: string;
    repotrackerDisabled: boolean;
    spawnHostScriptPath: string;
    stepbackBisect?: boolean | null;
    stepbackDisabled: boolean;
    versionControlEnabled: boolean;
    notifyOnBuildFailure: boolean;
    githubTriggerAliases?: Array<string> | null;
    perfEnabled: boolean;
    githubChecksEnabled: boolean;
    gitTagAuthorizedTeams?: Array<string> | null;
    gitTagAuthorizedUsers?: Array<string> | null;
    gitTagVersionsEnabled: boolean;
    manualPrTestingEnabled: boolean;
    prTestingEnabled: boolean;
    containerSizeDefinitions?: Array<{
      __typename?: "ContainerResources";
      cpu: number;
      memoryMb: number;
      name: string;
    }> | null;
    taskSync: {
      __typename?: "RepoTaskSyncOptions";
      configEnabled: boolean;
      patchEnabled: boolean;
    };
    patchTriggerAliases?: Array<{
      __typename?: "PatchTriggerAlias";
      alias: string;
      childProjectIdentifier: string;
      parentAsModule?: string | null;
      status?: string | null;
      taskSpecifiers?: Array<{
        __typename?: "TaskSpecifier";
        patchAlias: string;
        taskRegex: string;
        variantRegex: string;
      }> | null;
    }> | null;
    periodicBuilds?: Array<{
      __typename?: "PeriodicBuild";
      alias: string;
      configFile: string;
      cron: string;
      id: string;
      intervalHours: number;
      message: string;
      nextRunTime: Date;
    }> | null;
    buildBaronSettings: {
      __typename?: "BuildBaronSettings";
      ticketCreateIssueType: string;
      ticketCreateProject: string;
      ticketSearchProjects?: Array<string> | null;
    };
    externalLinks?: Array<{
      __typename?: "ExternalLink";
      displayName: string;
      requesters: Array<string>;
      urlTemplate: string;
    }> | null;
    taskAnnotationSettings: {
      __typename?: "TaskAnnotationSettings";
      fileTicketWebhook: {
        __typename?: "Webhook";
        endpoint: string;
        secret: string;
      };
      jiraCustomFields?: Array<{
        __typename?: "JiraField";
        displayText: string;
        field: string;
      }> | null;
    };
    triggers: Array<{
      __typename?: "TriggerAlias";
      alias: string;
      buildVariantRegex: string;
      configFile: string;
      dateCutoff?: number | null;
      level: string;
      project: string;
      status: string;
      taskRegex: string;
      unscheduleDownstreamVersions?: boolean | null;
    }>;
    parsleyFilters?: Array<{
      __typename?: "ParsleyFilter";
      caseSensitive: boolean;
      exactMatch: boolean;
      expression: string;
    }> | null;
    workstationConfig: {
      __typename?: "RepoWorkstationConfig";
      gitClone: boolean;
      setupCommands?: Array<{
        __typename?: "WorkstationSetupCommand";
        command: string;
        directory: string;
      }> | null;
    };
    commitQueue: {
      __typename?: "RepoCommitQueueParams";
      enabled: boolean;
      mergeMethod: string;
      mergeQueue: MergeQueue;
      message: string;
    };
  } | null;
  subscriptions?: Array<{
    __typename?: "GeneralSubscription";
    id: string;
    ownerType: string;
    resourceType: string;
    trigger: string;
    triggerData?: { [key: string]: any } | null;
    regexSelectors: Array<{
      __typename?: "Selector";
      data: string;
      type: string;
    }>;
    selectors: Array<{ __typename?: "Selector"; data: string; type: string }>;
    subscriber?: {
      __typename?: "SubscriberWrapper";
      type: string;
      subscriber: {
        __typename?: "Subscriber";
        emailSubscriber?: string | null;
        jiraCommentSubscriber?: string | null;
        slackSubscriber?: string | null;
        githubCheckSubscriber?: {
          __typename?: "GithubCheckSubscriber";
          owner: string;
          ref: string;
          repo: string;
        } | null;
        githubPRSubscriber?: {
          __typename?: "GithubPRSubscriber";
          owner: string;
          prNumber?: number | null;
          ref: string;
          repo: string;
        } | null;
        jiraIssueSubscriber?: {
          __typename?: "JiraIssueSubscriber";
          issueType: string;
          project: string;
        } | null;
        webhookSubscriber?: {
          __typename?: "WebhookSubscriber";
          minDelayMs: number;
          retries: number;
          secret: string;
          timeoutMs: number;
          url: string;
          headers: Array<{
            __typename?: "WebhookHeader";
            key: string;
            value: string;
          } | null>;
        } | null;
      };
    } | null;
  }> | null;
  vars?: {
    __typename?: "ProjectVars";
    adminOnlyVars: Array<string>;
    privateVars: Array<string>;
    vars?: { [key: string]: any } | null;
  } | null;
};

export type ProjectNotificationSettingsFragment = {
  __typename?: "Project";
  notifyOnBuildFailure?: boolean | null;
  banner?: {
    __typename?: "ProjectBanner";
    text: string;
    theme: BannerTheme;
  } | null;
};

export type RepoNotificationSettingsFragment = {
  __typename?: "RepoRef";
  notifyOnBuildFailure: boolean;
};

export type SubscriptionsFragment = {
  __typename?: "GeneralSubscription";
  id: string;
  ownerType: string;
  resourceType: string;
  trigger: string;
  triggerData?: { [key: string]: any } | null;
  regexSelectors: Array<{
    __typename?: "Selector";
    data: string;
    type: string;
  }>;
  selectors: Array<{ __typename?: "Selector"; data: string; type: string }>;
  subscriber?: {
    __typename?: "SubscriberWrapper";
    type: string;
    subscriber: {
      __typename?: "Subscriber";
      emailSubscriber?: string | null;
      jiraCommentSubscriber?: string | null;
      slackSubscriber?: string | null;
      githubCheckSubscriber?: {
        __typename?: "GithubCheckSubscriber";
        owner: string;
        ref: string;
        repo: string;
      } | null;
      githubPRSubscriber?: {
        __typename?: "GithubPRSubscriber";
        owner: string;
        prNumber?: number | null;
        ref: string;
        repo: string;
      } | null;
      jiraIssueSubscriber?: {
        __typename?: "JiraIssueSubscriber";
        issueType: string;
        project: string;
      } | null;
      webhookSubscriber?: {
        __typename?: "WebhookSubscriber";
        minDelayMs: number;
        retries: number;
        secret: string;
        timeoutMs: number;
        url: string;
        headers: Array<{
          __typename?: "WebhookHeader";
          key: string;
          value: string;
        } | null>;
      } | null;
    };
  } | null;
};

export type ProjectPatchAliasSettingsFragment = {
  __typename?: "Project";
  githubTriggerAliases?: Array<string> | null;
  patchTriggerAliases?: Array<{
    __typename?: "PatchTriggerAlias";
    alias: string;
    childProjectIdentifier: string;
    parentAsModule?: string | null;
    status?: string | null;
    taskSpecifiers?: Array<{
      __typename?: "TaskSpecifier";
      patchAlias: string;
      taskRegex: string;
      variantRegex: string;
    }> | null;
  }> | null;
};

export type RepoPatchAliasSettingsFragment = {
  __typename?: "RepoRef";
  githubTriggerAliases?: Array<string> | null;
  patchTriggerAliases?: Array<{
    __typename?: "PatchTriggerAlias";
    alias: string;
    childProjectIdentifier: string;
    parentAsModule?: string | null;
    status?: string | null;
    taskSpecifiers?: Array<{
      __typename?: "TaskSpecifier";
      patchAlias: string;
      taskRegex: string;
      variantRegex: string;
    }> | null;
  }> | null;
};

export type ProjectPeriodicBuildsSettingsFragment = {
  __typename?: "Project";
  periodicBuilds?: Array<{
    __typename?: "PeriodicBuild";
    alias: string;
    configFile: string;
    cron: string;
    id: string;
    intervalHours: number;
    message: string;
    nextRunTime: Date;
  }> | null;
};

export type RepoPeriodicBuildsSettingsFragment = {
  __typename?: "RepoRef";
  periodicBuilds?: Array<{
    __typename?: "PeriodicBuild";
    alias: string;
    configFile: string;
    cron: string;
    id: string;
    intervalHours: number;
    message: string;
    nextRunTime: Date;
  }> | null;
};

export type ProjectPluginsSettingsFragment = {
  __typename?: "Project";
  perfEnabled?: boolean | null;
  buildBaronSettings: {
    __typename?: "BuildBaronSettings";
    ticketCreateIssueType: string;
    ticketCreateProject: string;
    ticketSearchProjects?: Array<string> | null;
  };
  externalLinks?: Array<{
    __typename?: "ExternalLink";
    displayName: string;
    requesters: Array<string>;
    urlTemplate: string;
  }> | null;
  taskAnnotationSettings: {
    __typename?: "TaskAnnotationSettings";
    fileTicketWebhook: {
      __typename?: "Webhook";
      endpoint: string;
      secret: string;
    };
    jiraCustomFields?: Array<{
      __typename?: "JiraField";
      displayText: string;
      field: string;
    }> | null;
  };
};

export type RepoPluginsSettingsFragment = {
  __typename?: "RepoRef";
  perfEnabled: boolean;
  buildBaronSettings: {
    __typename?: "BuildBaronSettings";
    ticketCreateIssueType: string;
    ticketCreateProject: string;
    ticketSearchProjects?: Array<string> | null;
  };
  externalLinks?: Array<{
    __typename?: "ExternalLink";
    displayName: string;
    requesters: Array<string>;
    urlTemplate: string;
  }> | null;
  taskAnnotationSettings: {
    __typename?: "TaskAnnotationSettings";
    fileTicketWebhook: {
      __typename?: "Webhook";
      endpoint: string;
      secret: string;
    };
    jiraCustomFields?: Array<{
      __typename?: "JiraField";
      displayText: string;
      field: string;
    }> | null;
  };
};

export type ProjectEventSettingsFragment = {
  __typename?: "ProjectEventSettings";
  githubWebhooksEnabled: boolean;
  aliases?: Array<{
    __typename?: "ProjectAlias";
    alias: string;
    description?: string | null;
    gitTag: string;
    id: string;
    remotePath: string;
    task: string;
    taskTags: Array<string>;
    variant: string;
    variantTags: Array<string>;
    parameters: Array<{ __typename?: "Parameter"; key: string; value: string }>;
  }> | null;
  projectRef?: {
    __typename?: "Project";
    hidden?: boolean | null;
    identifier: string;
    repoRefId: string;
    tracksPushEvents?: boolean | null;
    versionControlEnabled?: boolean | null;
    admins?: Array<string | null> | null;
    restricted?: boolean | null;
    batchTime: number;
    branch: string;
    deactivatePrevious?: boolean | null;
    disabledStatsCache?: boolean | null;
    dispatchingDisabled?: boolean | null;
    displayName: string;
    enabled?: boolean | null;
    owner: string;
    patchingDisabled?: boolean | null;
    remotePath: string;
    repo: string;
    repotrackerDisabled?: boolean | null;
    spawnHostScriptPath: string;
    stepbackBisect?: boolean | null;
    stepbackDisabled?: boolean | null;
    notifyOnBuildFailure?: boolean | null;
    githubTriggerAliases?: Array<string> | null;
    perfEnabled?: boolean | null;
    projectHealthView: ProjectHealthView;
    githubChecksEnabled?: boolean | null;
    gitTagAuthorizedTeams?: Array<string> | null;
    gitTagAuthorizedUsers?: Array<string> | null;
    gitTagVersionsEnabled?: boolean | null;
    manualPrTestingEnabled?: boolean | null;
    prTestingEnabled?: boolean | null;
    taskSync: {
      __typename?: "TaskSyncOptions";
      configEnabled?: boolean | null;
      patchEnabled?: boolean | null;
    };
    banner?: {
      __typename?: "ProjectBanner";
      text: string;
      theme: BannerTheme;
    } | null;
    patchTriggerAliases?: Array<{
      __typename?: "PatchTriggerAlias";
      alias: string;
      childProjectIdentifier: string;
      parentAsModule?: string | null;
      status?: string | null;
      taskSpecifiers?: Array<{
        __typename?: "TaskSpecifier";
        patchAlias: string;
        taskRegex: string;
        variantRegex: string;
      }> | null;
    }> | null;
    periodicBuilds?: Array<{
      __typename?: "PeriodicBuild";
      alias: string;
      configFile: string;
      cron: string;
      id: string;
      intervalHours: number;
      message: string;
      nextRunTime: Date;
    }> | null;
    buildBaronSettings: {
      __typename?: "BuildBaronSettings";
      ticketCreateIssueType: string;
      ticketCreateProject: string;
      ticketSearchProjects?: Array<string> | null;
    };
    externalLinks?: Array<{
      __typename?: "ExternalLink";
      displayName: string;
      requesters: Array<string>;
      urlTemplate: string;
    }> | null;
    taskAnnotationSettings: {
      __typename?: "TaskAnnotationSettings";
      fileTicketWebhook: {
        __typename?: "Webhook";
        endpoint: string;
        secret: string;
      };
      jiraCustomFields?: Array<{
        __typename?: "JiraField";
        displayText: string;
        field: string;
      }> | null;
    };
    triggers?: Array<{
      __typename?: "TriggerAlias";
      alias: string;
      buildVariantRegex: string;
      configFile: string;
      dateCutoff?: number | null;
      level: string;
      project: string;
      status: string;
      taskRegex: string;
      unscheduleDownstreamVersions?: boolean | null;
    }> | null;
    parsleyFilters?: Array<{
      __typename?: "ParsleyFilter";
      caseSensitive: boolean;
      exactMatch: boolean;
      expression: string;
    }> | null;
    workstationConfig: {
      __typename?: "WorkstationConfig";
      gitClone?: boolean | null;
      setupCommands?: Array<{
        __typename?: "WorkstationSetupCommand";
        command: string;
        directory: string;
      }> | null;
    };
    commitQueue: {
      __typename?: "CommitQueueParams";
      enabled?: boolean | null;
      mergeMethod: string;
      mergeQueue: MergeQueue;
      message: string;
    };
  } | null;
  subscriptions?: Array<{
    __typename?: "GeneralSubscription";
    id: string;
    ownerType: string;
    resourceType: string;
    trigger: string;
    triggerData?: { [key: string]: any } | null;
    regexSelectors: Array<{
      __typename?: "Selector";
      data: string;
      type: string;
    }>;
    selectors: Array<{ __typename?: "Selector"; data: string; type: string }>;
    subscriber?: {
      __typename?: "SubscriberWrapper";
      type: string;
      subscriber: {
        __typename?: "Subscriber";
        emailSubscriber?: string | null;
        jiraCommentSubscriber?: string | null;
        slackSubscriber?: string | null;
        githubCheckSubscriber?: {
          __typename?: "GithubCheckSubscriber";
          owner: string;
          ref: string;
          repo: string;
        } | null;
        githubPRSubscriber?: {
          __typename?: "GithubPRSubscriber";
          owner: string;
          prNumber?: number | null;
          ref: string;
          repo: string;
        } | null;
        jiraIssueSubscriber?: {
          __typename?: "JiraIssueSubscriber";
          issueType: string;
          project: string;
        } | null;
        webhookSubscriber?: {
          __typename?: "WebhookSubscriber";
          minDelayMs: number;
          retries: number;
          secret: string;
          timeoutMs: number;
          url: string;
          headers: Array<{
            __typename?: "WebhookHeader";
            key: string;
            value: string;
          } | null>;
        } | null;
      };
    } | null;
  }> | null;
  vars?: {
    __typename?: "ProjectVars";
    adminOnlyVars: Array<string>;
    privateVars: Array<string>;
    vars?: { [key: string]: any } | null;
  } | null;
};

export type ProjectTriggersSettingsFragment = {
  __typename?: "Project";
  triggers?: Array<{
    __typename?: "TriggerAlias";
    alias: string;
    buildVariantRegex: string;
    configFile: string;
    dateCutoff?: number | null;
    level: string;
    project: string;
    status: string;
    taskRegex: string;
    unscheduleDownstreamVersions?: boolean | null;
  }> | null;
};

export type RepoTriggersSettingsFragment = {
  __typename?: "RepoRef";
  triggers: Array<{
    __typename?: "TriggerAlias";
    alias: string;
    buildVariantRegex: string;
    configFile: string;
    dateCutoff?: number | null;
    level: string;
    project: string;
    status: string;
    taskRegex: string;
    unscheduleDownstreamVersions?: boolean | null;
  }>;
};

export type VariablesFragment = {
  __typename?: "ProjectVars";
  adminOnlyVars: Array<string>;
  privateVars: Array<string>;
  vars?: { [key: string]: any } | null;
};

export type ProjectViewsAndFiltersSettingsFragment = {
  __typename?: "Project";
  projectHealthView: ProjectHealthView;
  parsleyFilters?: Array<{
    __typename?: "ParsleyFilter";
    caseSensitive: boolean;
    exactMatch: boolean;
    expression: string;
  }> | null;
};

export type RepoViewsAndFiltersSettingsFragment = {
  __typename?: "RepoRef";
  parsleyFilters?: Array<{
    __typename?: "ParsleyFilter";
    caseSensitive: boolean;
    exactMatch: boolean;
    expression: string;
  }> | null;
};

export type ProjectVirtualWorkstationSettingsFragment = {
  __typename?: "Project";
  workstationConfig: {
    __typename?: "WorkstationConfig";
    gitClone?: boolean | null;
    setupCommands?: Array<{
      __typename?: "WorkstationSetupCommand";
      command: string;
      directory: string;
    }> | null;
  };
};

export type RepoVirtualWorkstationSettingsFragment = {
  __typename?: "RepoRef";
  workstationConfig: {
    __typename?: "RepoWorkstationConfig";
    gitClone: boolean;
    setupCommands?: Array<{
      __typename?: "WorkstationSetupCommand";
      command: string;
      directory: string;
    }> | null;
  };
};

export type UpstreamProjectFragment = {
  __typename?: "Version";
  upstreamProject?: {
    __typename?: "UpstreamProject";
    owner: string;
    project: string;
    repo: string;
    revision: string;
    triggerID: string;
    triggerType: string;
    task?: { __typename?: "Task"; execution: number; id: string } | null;
    version?: { __typename?: "Version"; id: string } | null;
  } | null;
};

export type AbortTaskMutationVariables = Exact<{
  taskId: Scalars["String"]["input"];
}>;

export type AbortTaskMutation = {
  __typename?: "Mutation";
  abortTask: {
    __typename?: "Task";
    priority?: number | null;
    buildVariant: string;
    buildVariantDisplayName?: string | null;
    displayName: string;
    execution: number;
    id: string;
    revision?: string | null;
    status: string;
  };
};

export type AddAnnotationIssueMutationVariables = Exact<{
  taskId: Scalars["String"]["input"];
  execution: Scalars["Int"]["input"];
  apiIssue: IssueLinkInput;
  isIssue: Scalars["Boolean"]["input"];
}>;

export type AddAnnotationIssueMutation = {
  __typename?: "Mutation";
  addAnnotationIssue: boolean;
};

export type AddFavoriteProjectMutationVariables = Exact<{
  identifier: Scalars["String"]["input"];
}>;

export type AddFavoriteProjectMutation = {
  __typename?: "Mutation";
  addFavoriteProject: {
    __typename?: "Project";
    displayName: string;
    id: string;
    identifier: string;
    isFavorite: boolean;
    owner: string;
    repo: string;
  };
};

export type AttachProjectToNewRepoMutationVariables = Exact<{
  project: MoveProjectInput;
}>;

export type AttachProjectToNewRepoMutation = {
  __typename?: "Mutation";
  attachProjectToNewRepo: {
    __typename?: "Project";
    id: string;
    repoRefId: string;
  };
};

export type AttachProjectToRepoMutationVariables = Exact<{
  projectId: Scalars["String"]["input"];
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

export type CopyDistroMutationVariables = Exact<{
  opts: CopyDistroInput;
}>;

export type CopyDistroMutation = {
  __typename?: "Mutation";
  copyDistro: { __typename?: "NewDistroPayload"; newDistroId: string };
};

export type CopyProjectMutationVariables = Exact<{
  project: CopyProjectInput;
  requestS3Creds: Scalars["Boolean"]["input"];
}>;

export type CopyProjectMutation = {
  __typename?: "Mutation";
  copyProject: { __typename?: "Project"; id: string; identifier: string };
};

export type CreateDistroMutationVariables = Exact<{
  opts: CreateDistroInput;
}>;

export type CreateDistroMutation = {
  __typename?: "Mutation";
  createDistro: { __typename?: "NewDistroPayload"; newDistroId: string };
};

export type CreateProjectMutationVariables = Exact<{
  project: CreateProjectInput;
  requestS3Creds: Scalars["Boolean"]["input"];
}>;

export type CreateProjectMutation = {
  __typename?: "Mutation";
  createProject: { __typename?: "Project"; id: string; identifier: string };
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
  projectId: Scalars["String"]["input"];
  buildVariantName: Scalars["String"]["input"];
  taskName: Scalars["String"]["input"];
}>;

export type DeactivateStepbackTaskMutation = {
  __typename?: "Mutation";
  deactivateStepbackTask: boolean;
};

export type DefaultSectionToRepoMutationVariables = Exact<{
  projectId: Scalars["String"]["input"];
  section: ProjectSettingsSection;
}>;

export type DefaultSectionToRepoMutation = {
  __typename?: "Mutation";
  defaultSectionToRepo?: string | null;
};

export type DeleteDistroMutationVariables = Exact<{
  distroId: Scalars["String"]["input"];
}>;

export type DeleteDistroMutation = {
  __typename?: "Mutation";
  deleteDistro: { __typename?: "DeleteDistroPayload"; deletedDistroId: string };
};

export type DeleteProjectMutationVariables = Exact<{
  projectId: Scalars["String"]["input"];
}>;

export type DeleteProjectMutation = {
  __typename?: "Mutation";
  deleteProject: boolean;
};

export type DeleteSubscriptionsMutationVariables = Exact<{
  subscriptionIds: Array<Scalars["String"]["input"]>;
}>;

export type DeleteSubscriptionsMutation = {
  __typename?: "Mutation";
  deleteSubscriptions: number;
};

export type DetachProjectFromRepoMutationVariables = Exact<{
  projectId: Scalars["String"]["input"];
}>;

export type DetachProjectFromRepoMutation = {
  __typename?: "Mutation";
  detachProjectFromRepo: { __typename?: "Project"; id: string };
};

export type DetachVolumeFromHostMutationVariables = Exact<{
  volumeId: Scalars["String"]["input"];
}>;

export type DetachVolumeFromHostMutation = {
  __typename?: "Mutation";
  detachVolumeFromHost: boolean;
};

export type EditAnnotationNoteMutationVariables = Exact<{
  taskId: Scalars["String"]["input"];
  execution: Scalars["Int"]["input"];
  originalMessage: Scalars["String"]["input"];
  newMessage: Scalars["String"]["input"];
}>;

export type EditAnnotationNoteMutation = {
  __typename?: "Mutation";
  editAnnotationNote: boolean;
};

export type EditSpawnHostMutationVariables = Exact<{
  hostId: Scalars["String"]["input"];
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  addedInstanceTags?: InputMaybe<Array<InstanceTagInput>>;
  deletedInstanceTags?: InputMaybe<Array<InstanceTagInput>>;
  volumeId?: InputMaybe<Scalars["String"]["input"]>;
  instanceType?: InputMaybe<Scalars["String"]["input"]>;
  expiration?: InputMaybe<Scalars["Time"]["input"]>;
  noExpiration?: InputMaybe<Scalars["Boolean"]["input"]>;
  servicePassword?: InputMaybe<Scalars["String"]["input"]>;
  publicKey?: InputMaybe<PublicKeyInput>;
  savePublicKey?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type EditSpawnHostMutation = {
  __typename?: "Mutation";
  editSpawnHost: {
    __typename?: "Host";
    availabilityZone?: string | null;
    displayName?: string | null;
    expiration?: Date | null;
    homeVolumeID?: string | null;
    instanceType?: string | null;
    noExpiration: boolean;
    hostUrl: string;
    id: string;
    provider: string;
    startedBy: string;
    status: string;
    tag: string;
    uptime?: Date | null;
    user?: string | null;
    distro?: {
      __typename?: "DistroInfo";
      id?: string | null;
      isVirtualWorkStation?: boolean | null;
      isWindows?: boolean | null;
      user?: string | null;
      workDir?: string | null;
    } | null;
    homeVolume?: {
      __typename?: "Volume";
      displayName: string;
      id: string;
    } | null;
    instanceTags: Array<{
      __typename?: "InstanceTag";
      canBeModified: boolean;
      key: string;
      value: string;
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
  patchId: Scalars["String"]["input"];
  commitMessage?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type EnqueuePatchMutation = {
  __typename?: "Mutation";
  enqueuePatch: { __typename?: "Patch"; id: string };
};

export type BuildBaronCreateTicketMutationVariables = Exact<{
  taskId: Scalars["String"]["input"];
  execution?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type BuildBaronCreateTicketMutation = {
  __typename?: "Mutation";
  bbCreateTicket: boolean;
};

export type ForceRepotrackerRunMutationVariables = Exact<{
  projectId: Scalars["String"]["input"];
}>;

export type ForceRepotrackerRunMutation = {
  __typename?: "Mutation";
  forceRepotrackerRun: boolean;
};

export type MigrateVolumeMutationVariables = Exact<{
  volumeId: Scalars["String"]["input"];
  spawnHostInput: SpawnHostInput;
}>;

export type MigrateVolumeMutation = {
  __typename?: "Mutation";
  migrateVolume: boolean;
};

export type MoveAnnotationIssueMutationVariables = Exact<{
  taskId: Scalars["String"]["input"];
  execution: Scalars["Int"]["input"];
  apiIssue: IssueLinkInput;
  isIssue: Scalars["Boolean"]["input"];
}>;

export type MoveAnnotationIssueMutation = {
  __typename?: "Mutation";
  moveAnnotationIssue: boolean;
};

export type OverrideTaskDependenciesMutationVariables = Exact<{
  taskId: Scalars["String"]["input"];
}>;

export type OverrideTaskDependenciesMutation = {
  __typename?: "Mutation";
  overrideTaskDependencies: {
    __typename?: "Task";
    execution: number;
    id: string;
    status: string;
  };
};

export type PromoteVarsToRepoMutationVariables = Exact<{
  projectId: Scalars["String"]["input"];
  varNames: Array<Scalars["String"]["input"]>;
}>;

export type PromoteVarsToRepoMutation = {
  __typename?: "Mutation";
  promoteVarsToRepo: boolean;
};

export type RemoveAnnotationIssueMutationVariables = Exact<{
  taskId: Scalars["String"]["input"];
  execution: Scalars["Int"]["input"];
  apiIssue: IssueLinkInput;
  isIssue: Scalars["Boolean"]["input"];
}>;

export type RemoveAnnotationIssueMutation = {
  __typename?: "Mutation";
  removeAnnotationIssue: boolean;
};

export type RemoveFavoriteProjectMutationVariables = Exact<{
  identifier: Scalars["String"]["input"];
}>;

export type RemoveFavoriteProjectMutation = {
  __typename?: "Mutation";
  removeFavoriteProject: {
    __typename?: "Project";
    displayName: string;
    id: string;
    identifier: string;
    isFavorite: boolean;
    owner: string;
    repo: string;
  };
};

export type RemoveItemFromCommitQueueMutationVariables = Exact<{
  commitQueueId: Scalars["String"]["input"];
  issue: Scalars["String"]["input"];
}>;

export type RemoveItemFromCommitQueueMutation = {
  __typename?: "Mutation";
  removeItemFromCommitQueue?: string | null;
};

export type RemovePublicKeyMutationVariables = Exact<{
  keyName: Scalars["String"]["input"];
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
  volumeId: Scalars["String"]["input"];
}>;

export type RemoveVolumeMutation = {
  __typename?: "Mutation";
  removeVolume: boolean;
};

export type ReprovisionToNewMutationVariables = Exact<{
  hostIds: Array<Scalars["String"]["input"]>;
}>;

export type ReprovisionToNewMutation = {
  __typename?: "Mutation";
  reprovisionToNew: number;
};

export type RestartJasperMutationVariables = Exact<{
  hostIds: Array<Scalars["String"]["input"]>;
}>;

export type RestartJasperMutation = {
  __typename?: "Mutation";
  restartJasper: number;
};

export type RestartTaskMutationVariables = Exact<{
  taskId: Scalars["String"]["input"];
  failedOnly: Scalars["Boolean"]["input"];
}>;

export type RestartTaskMutation = {
  __typename?: "Mutation";
  restartTask: {
    __typename?: "Task";
    execution: number;
    latestExecution: number;
    priority?: number | null;
    buildVariant: string;
    buildVariantDisplayName?: string | null;
    displayName: string;
    id: string;
    revision?: string | null;
    status: string;
  };
};

export type RestartVersionsMutationVariables = Exact<{
  versionId: Scalars["String"]["input"];
  abort: Scalars["Boolean"]["input"];
  versionsToRestart: Array<VersionToRestart>;
}>;

export type RestartVersionsMutation = {
  __typename?: "Mutation";
  restartVersions?: Array<{
    __typename?: "Version";
    id: string;
    status: string;
    taskStatuses: Array<string>;
    patch?: {
      __typename?: "Patch";
      id: string;
      status: string;
      childPatches?: Array<{
        __typename?: "Patch";
        id: string;
        status: string;
      }> | null;
    } | null;
  }> | null;
};

export type SaveDistroMutationVariables = Exact<{
  distro: DistroInput;
  onSave: DistroOnSaveOperation;
}>;

export type SaveDistroMutation = {
  __typename?: "Mutation";
  saveDistro: {
    __typename?: "SaveDistroPayload";
    hostCount: number;
    distro: { __typename?: "Distro"; name: string };
  };
};

export type SaveProjectSettingsForSectionMutationVariables = Exact<{
  projectSettings: ProjectSettingsInput;
  section: ProjectSettingsSection;
}>;

export type SaveProjectSettingsForSectionMutation = {
  __typename?: "Mutation";
  saveProjectSettingsForSection: {
    __typename?: "ProjectSettings";
    projectRef?: {
      __typename?: "Project";
      id: string;
      identifier: string;
    } | null;
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
    projectRef?: { __typename?: "RepoRef"; id: string } | null;
  };
};

export type SaveSubscriptionForUserMutationVariables = Exact<{
  subscription: SubscriptionInput;
}>;

export type SaveSubscriptionForUserMutation = {
  __typename?: "Mutation";
  saveSubscription: boolean;
};

export type SchedulePatchMutationVariables = Exact<{
  patchId: Scalars["String"]["input"];
  configure: PatchConfigure;
}>;

export type SchedulePatchMutation = {
  __typename?: "Mutation";
  schedulePatch: {
    __typename?: "Patch";
    tasks: Array<string>;
    variants: Array<string>;
    activated: boolean;
    alias?: string | null;
    author: string;
    commitQueuePosition?: number | null;
    description: string;
    id: string;
    status: string;
    versionFull?: { __typename?: "Version"; id: string } | null;
    parameters: Array<{ __typename?: "Parameter"; key: string; value: string }>;
    variantsTasks: Array<{
      __typename?: "VariantTask";
      name: string;
      tasks: Array<string>;
    } | null>;
  };
};

export type ScheduleTasksMutationVariables = Exact<{
  taskIds: Array<Scalars["String"]["input"]>;
}>;

export type ScheduleTasksMutation = {
  __typename?: "Mutation";
  scheduleTasks: Array<{
    __typename?: "Task";
    buildVariant: string;
    buildVariantDisplayName?: string | null;
    displayName: string;
    execution: number;
    id: string;
    revision?: string | null;
    status: string;
  }>;
};

export type ScheduleUndispatchedBaseTasksMutationVariables = Exact<{
  patchId: Scalars["String"]["input"];
}>;

export type ScheduleUndispatchedBaseTasksMutation = {
  __typename?: "Mutation";
  scheduleUndispatchedBaseTasks?: Array<{
    __typename?: "Task";
    execution: number;
    id: string;
    status: string;
  }> | null;
};

export type SetLastRevisionMutationVariables = Exact<{
  projectIdentifier: Scalars["String"]["input"];
  revision: Scalars["String"]["input"];
}>;

export type SetLastRevisionMutation = {
  __typename?: "Mutation";
  setLastRevision: {
    __typename?: "SetLastRevisionPayload";
    mergeBaseRevision: string;
  };
};

export type SetPatchPriorityMutationVariables = Exact<{
  patchId: Scalars["String"]["input"];
  priority: Scalars["Int"]["input"];
}>;

export type SetPatchPriorityMutation = {
  __typename?: "Mutation";
  setPatchPriority?: string | null;
};

export type SetPatchVisibilityMutationVariables = Exact<{
  patchIds: Array<Scalars["String"]["input"]>;
  hidden: Scalars["Boolean"]["input"];
}>;

export type SetPatchVisibilityMutation = {
  __typename?: "Mutation";
  setPatchVisibility: Array<{
    __typename?: "Patch";
    hidden: boolean;
    id: string;
  }>;
};

export type SetTaskPriorityMutationVariables = Exact<{
  taskId: Scalars["String"]["input"];
  priority: Scalars["Int"]["input"];
}>;

export type SetTaskPriorityMutation = {
  __typename?: "Mutation";
  setTaskPriority: {
    __typename?: "Task";
    execution: number;
    id: string;
    priority?: number | null;
  };
};

export type SpawnHostMutationVariables = Exact<{
  spawnHostInput?: InputMaybe<SpawnHostInput>;
}>;

export type SpawnHostMutation = {
  __typename?: "Mutation";
  spawnHost: { __typename?: "Host"; id: string; status: string };
};

export type SpawnVolumeMutationVariables = Exact<{
  spawnVolumeInput: SpawnVolumeInput;
}>;

export type SpawnVolumeMutation = {
  __typename?: "Mutation";
  spawnVolume: boolean;
};

export type UnschedulePatchTasksMutationVariables = Exact<{
  patchId: Scalars["String"]["input"];
  abort: Scalars["Boolean"]["input"];
}>;

export type UnschedulePatchTasksMutation = {
  __typename?: "Mutation";
  unschedulePatchTasks?: string | null;
};

export type UnscheduleTaskMutationVariables = Exact<{
  taskId: Scalars["String"]["input"];
}>;

export type UnscheduleTaskMutation = {
  __typename?: "Mutation";
  unscheduleTask: { __typename?: "Task"; execution: number; id: string };
};

export type UpdateHostStatusMutationVariables = Exact<{
  hostIds: Array<Scalars["String"]["input"]>;
  status: Scalars["String"]["input"];
  notes?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type UpdateHostStatusMutation = {
  __typename?: "Mutation";
  updateHostStatus: number;
};

export type UpdatePatchDescriptionMutationVariables = Exact<{
  patchId: Scalars["String"]["input"];
  description: Scalars["String"]["input"];
}>;

export type UpdatePatchDescriptionMutation = {
  __typename?: "Mutation";
  schedulePatch: {
    __typename?: "Patch";
    activated: boolean;
    alias?: string | null;
    author: string;
    commitQueuePosition?: number | null;
    description: string;
    id: string;
    status: string;
    parameters: Array<{ __typename?: "Parameter"; key: string; value: string }>;
    variantsTasks: Array<{
      __typename?: "VariantTask";
      name: string;
      tasks: Array<string>;
    } | null>;
  };
};

export type UpdatePublicKeyMutationVariables = Exact<{
  targetKeyName: Scalars["String"]["input"];
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
  hostId: Scalars["String"]["input"];
  action: SpawnHostStatusActions;
}>;

export type UpdateSpawnHostStatusMutation = {
  __typename?: "Mutation";
  updateSpawnHostStatus: { __typename?: "Host"; id: string; status: string };
};

export type UpdateVolumeMutationVariables = Exact<{
  updateVolumeInput: UpdateVolumeInput;
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

export type AgentLogsQueryVariables = Exact<{
  id: Scalars["String"]["input"];
  execution?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type AgentLogsQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    execution: number;
    id: string;
    taskLogs: {
      __typename?: "TaskLogs";
      agentLogs: Array<{
        __typename?: "LogMessage";
        message?: string | null;
        severity?: string | null;
        timestamp?: Date | null;
      }>;
    };
  } | null;
};

export type AllLogsQueryVariables = Exact<{
  id: Scalars["String"]["input"];
  execution?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type AllLogsQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    execution: number;
    id: string;
    taskLogs: {
      __typename?: "TaskLogs";
      allLogs: Array<{
        __typename?: "LogMessage";
        message?: string | null;
        severity?: string | null;
        timestamp?: Date | null;
      }>;
    };
  } | null;
};

export type AnnotationEventDataQueryVariables = Exact<{
  taskId: Scalars["String"]["input"];
  execution?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type AnnotationEventDataQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    execution: number;
    id: string;
    annotation?: {
      __typename?: "Annotation";
      id: string;
      taskExecution: number;
      taskId: string;
      webhookConfigured: boolean;
      createdIssues?: Array<{
        __typename?: "IssueLink";
        issueKey?: string | null;
        url?: string | null;
        source?: {
          __typename?: "Source";
          author: string;
          requester: string;
          time: Date;
        } | null;
      } | null> | null;
      issues?: Array<{
        __typename?: "IssueLink";
        issueKey?: string | null;
        url?: string | null;
        source?: {
          __typename?: "Source";
          author: string;
          requester: string;
          time: Date;
        } | null;
      } | null> | null;
      metadataLinks?: Array<{
        __typename?: "MetadataLink";
        text: string;
        url: string;
      } | null> | null;
      note?: {
        __typename?: "Note";
        message: string;
        source: {
          __typename?: "Source";
          author: string;
          requester: string;
          time: Date;
        };
      } | null;
      suspectedIssues?: Array<{
        __typename?: "IssueLink";
        issueKey?: string | null;
        url?: string | null;
        source?: {
          __typename?: "Source";
          author: string;
          requester: string;
          time: Date;
        } | null;
      } | null> | null;
    } | null;
  } | null;
};

export type AwsRegionsQueryVariables = Exact<{ [key: string]: never }>;

export type AwsRegionsQuery = {
  __typename?: "Query";
  awsRegions?: Array<string> | null;
};

export type BaseVersionAndTaskQueryVariables = Exact<{
  taskId: Scalars["String"]["input"];
}>;

export type BaseVersionAndTaskQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    buildVariant: string;
    displayName: string;
    execution: number;
    id: string;
    projectIdentifier?: string | null;
    status: string;
    baseTask?: {
      __typename?: "Task";
      execution: number;
      id: string;
      status: string;
    } | null;
    versionMetadata: {
      __typename?: "Version";
      id: string;
      isPatch: boolean;
      baseVersion?: {
        __typename?: "Version";
        id: string;
        order: number;
      } | null;
    };
  } | null;
};

export type BuildBaronConfiguredQueryVariables = Exact<{
  taskId: Scalars["String"]["input"];
  execution: Scalars["Int"]["input"];
}>;

export type BuildBaronConfiguredQuery = {
  __typename?: "Query";
  buildBaron: { __typename?: "BuildBaron"; buildBaronConfigured: boolean };
};

export type BuildBaronQueryVariables = Exact<{
  taskId: Scalars["String"]["input"];
  execution: Scalars["Int"]["input"];
}>;

export type BuildBaronQuery = {
  __typename?: "Query";
  buildBaron: {
    __typename?: "BuildBaron";
    bbTicketCreationDefined: boolean;
    buildBaronConfigured: boolean;
    searchReturnInfo?: {
      __typename?: "SearchReturnInfo";
      featuresURL: string;
      search: string;
      source: string;
      issues: Array<{
        __typename?: "JiraTicket";
        key: string;
        fields: {
          __typename?: "TicketFields";
          assigneeDisplayName?: string | null;
          created: string;
          resolutionName?: string | null;
          summary: string;
          updated: string;
          status: { __typename?: "JiraStatus"; id: string; name: string };
        };
      }>;
    } | null;
  };
};

export type BuildVariantStatsQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type BuildVariantStatsQuery = {
  __typename?: "Query";
  version: {
    __typename?: "Version";
    id: string;
    buildVariantStats?: Array<{
      __typename?: "GroupedTaskStatusCount";
      displayName: string;
      variant: string;
      statusCounts: Array<{
        __typename?: "StatusCount";
        count: number;
        status: string;
      }>;
    }> | null;
  };
};

export type BuildVariantsForTaskNameQueryVariables = Exact<{
  projectIdentifier: Scalars["String"]["input"];
  taskName: Scalars["String"]["input"];
}>;

export type BuildVariantsForTaskNameQuery = {
  __typename?: "Query";
  buildVariantsForTaskName?: Array<{
    __typename?: "BuildVariantTuple";
    buildVariant: string;
    displayName: string;
  } | null> | null;
};

export type BuildVariantsWithChildrenQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type BuildVariantsWithChildrenQuery = {
  __typename?: "Query";
  version: {
    __typename?: "Version";
    id: string;
    buildVariants?: Array<{
      __typename?: "GroupedBuildVariant";
      displayName: string;
      variant: string;
      tasks?: Array<{
        __typename?: "Task";
        baseStatus?: string | null;
        displayName: string;
        execution: number;
        id: string;
        status: string;
      } | null> | null;
    } | null> | null;
    childVersions?: Array<{
      __typename?: "Version";
      id: string;
      project: string;
      projectIdentifier: string;
      buildVariants?: Array<{
        __typename?: "GroupedBuildVariant";
        displayName: string;
        variant: string;
        tasks?: Array<{
          __typename?: "Task";
          baseStatus?: string | null;
          displayName: string;
          execution: number;
          id: string;
          status: string;
        } | null> | null;
      } | null> | null;
    } | null> | null;
  };
};

export type ClientConfigQueryVariables = Exact<{ [key: string]: never }>;

export type ClientConfigQuery = {
  __typename?: "Query";
  clientConfig?: {
    __typename?: "ClientConfig";
    latestRevision?: string | null;
    clientBinaries?: Array<{
      __typename?: "ClientBinary";
      arch?: string | null;
      displayName?: string | null;
      os?: string | null;
      url?: string | null;
    }> | null;
  } | null;
};

export type CodeChangesQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type CodeChangesQuery = {
  __typename?: "Query";
  patch: {
    __typename?: "Patch";
    id: string;
    moduleCodeChanges: Array<{
      __typename?: "ModuleCodeChange";
      branchName: string;
      htmlLink: string;
      rawLink: string;
      fileDiffs: Array<{
        __typename?: "FileDiff";
        additions: number;
        deletions: number;
        description: string;
        diffLink: string;
        fileName: string;
      }>;
    }>;
  };
};

export type CommitQueueQueryVariables = Exact<{
  projectIdentifier: Scalars["String"]["input"];
}>;

export type CommitQueueQuery = {
  __typename?: "Query";
  commitQueue: {
    __typename?: "CommitQueue";
    message?: string | null;
    owner?: string | null;
    projectId?: string | null;
    repo?: string | null;
    queue?: Array<{
      __typename?: "CommitQueueItem";
      enqueueTime?: Date | null;
      issue?: string | null;
      patch?: {
        __typename?: "Patch";
        activated: boolean;
        author: string;
        description: string;
        id: string;
        moduleCodeChanges: Array<{
          __typename?: "ModuleCodeChange";
          branchName: string;
          htmlLink: string;
          rawLink: string;
          fileDiffs: Array<{
            __typename?: "FileDiff";
            additions: number;
            deletions: number;
            description: string;
            diffLink: string;
            fileName: string;
          }>;
        }>;
        versionFull?: { __typename?: "Version"; id: string } | null;
      } | null;
    }> | null;
  };
};

export type CreatedTicketsQueryVariables = Exact<{
  taskId: Scalars["String"]["input"];
}>;

export type CreatedTicketsQuery = {
  __typename?: "Query";
  bbGetCreatedTickets: Array<{
    __typename?: "JiraTicket";
    key: string;
    fields: {
      __typename?: "TicketFields";
      assigneeDisplayName?: string | null;
      created: string;
      resolutionName?: string | null;
      summary: string;
      updated: string;
      status: { __typename?: "JiraStatus"; id: string; name: string };
    };
  }>;
};

export type DisplayTaskQueryVariables = Exact<{
  taskId: Scalars["String"]["input"];
  execution?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type DisplayTaskQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    displayName: string;
    execution: number;
    executionTasks?: Array<string> | null;
    id: string;
    displayTask?: { __typename?: "Task"; execution: number; id: string } | null;
  } | null;
};

export type DistroEventsQueryVariables = Exact<{
  distroId: Scalars["String"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  before?: InputMaybe<Scalars["Time"]["input"]>;
}>;

export type DistroEventsQuery = {
  __typename?: "Query";
  distroEvents: {
    __typename?: "DistroEventsPayload";
    count: number;
    eventLogEntries: Array<{
      __typename?: "DistroEvent";
      after?: any | null;
      before?: any | null;
      data?: any | null;
      timestamp: Date;
      user: string;
    }>;
  };
};

export type DistroTaskQueueQueryVariables = Exact<{
  distroId: Scalars["String"]["input"];
}>;

export type DistroTaskQueueQuery = {
  __typename?: "Query";
  distroTaskQueue: Array<{
    __typename?: "TaskQueueItem";
    activatedBy: string;
    buildVariant: string;
    displayName: string;
    expectedDuration: number;
    id: string;
    priority: number;
    project: string;
    requester: TaskQueueItemType;
    version: string;
  }>;
};

export type DistroQueryVariables = Exact<{
  distroId: Scalars["String"]["input"];
}>;

export type DistroQuery = {
  __typename?: "Query";
  distro?: {
    __typename?: "Distro";
    adminOnly: boolean;
    aliases: Array<string>;
    arch: Arch;
    authorizedKeysFile: string;
    containerPool: string;
    disabled: boolean;
    disableShallowClone: boolean;
    isCluster: boolean;
    isVirtualWorkStation: boolean;
    mountpoints?: Array<string | null> | null;
    name: string;
    note: string;
    provider: Provider;
    providerSettingsList: Array<any>;
    setup: string;
    setupAsSudo: boolean;
    sshKey: string;
    sshOptions: Array<string>;
    user: string;
    userSpawnAllowed: boolean;
    validProjects: Array<string | null>;
    workDir: string;
    bootstrapSettings: {
      __typename?: "BootstrapSettings";
      clientDir: string;
      communication: CommunicationMethod;
      jasperBinaryDir: string;
      jasperCredentialsPath: string;
      method: BootstrapMethod;
      rootDir: string;
      serviceUser: string;
      shellPath: string;
      env: Array<{ __typename?: "EnvVar"; key: string; value: string }>;
      preconditionScripts: Array<{
        __typename?: "PreconditionScript";
        path: string;
        script: string;
      }>;
      resourceLimits: {
        __typename?: "ResourceLimits";
        lockedMemoryKb: number;
        numFiles: number;
        numProcesses: number;
        numTasks: number;
        virtualMemoryKb: number;
      };
    };
    dispatcherSettings: {
      __typename?: "DispatcherSettings";
      version: DispatcherVersion;
    };
    expansions: Array<{ __typename?: "Expansion"; key: string; value: string }>;
    finderSettings: { __typename?: "FinderSettings"; version: FinderVersion };
    homeVolumeSettings: {
      __typename?: "HomeVolumeSettings";
      formatCommand: string;
    };
    hostAllocatorSettings: {
      __typename?: "HostAllocatorSettings";
      acceptableHostIdleTime: number;
      feedbackRule: FeedbackRule;
      futureHostFraction: number;
      hostsOverallocatedRule: OverallocatedRule;
      maximumHosts: number;
      minimumHosts: number;
      roundingRule: RoundingRule;
      version: HostAllocatorVersion;
    };
    iceCreamSettings: {
      __typename?: "IceCreamSettings";
      configPath: string;
      schedulerHost: string;
    };
    plannerSettings: {
      __typename?: "PlannerSettings";
      commitQueueFactor: number;
      expectedRuntimeFactor: number;
      generateTaskFactor: number;
      groupVersions: boolean;
      mainlineTimeInQueueFactor: number;
      patchFactor: number;
      patchTimeInQueueFactor: number;
      targetTime: number;
      version: PlannerVersion;
    };
  } | null;
};

export type DistrosQueryVariables = Exact<{
  onlySpawnable: Scalars["Boolean"]["input"];
}>;

export type DistrosQuery = {
  __typename?: "Query";
  distros: Array<{
    __typename?: "Distro";
    adminOnly: boolean;
    isVirtualWorkStation: boolean;
    name: string;
  } | null>;
};

export type FailedTaskStatusIconTooltipQueryVariables = Exact<{
  taskId: Scalars["String"]["input"];
}>;

export type FailedTaskStatusIconTooltipQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    execution: number;
    id: string;
    tests: {
      __typename?: "TaskTestResult";
      filteredTestCount: number;
      testResults: Array<{
        __typename?: "TestResult";
        id: string;
        testFile: string;
      }>;
    };
  } | null;
};

export type GithubOrgsQueryVariables = Exact<{ [key: string]: never }>;

export type GithubOrgsQuery = {
  __typename?: "Query";
  spruceConfig?: {
    __typename?: "SpruceConfig";
    githubOrgs: Array<string>;
  } | null;
};

export type GithubProjectConflictsQueryVariables = Exact<{
  projectId: Scalars["String"]["input"];
}>;

export type GithubProjectConflictsQuery = {
  __typename?: "Query";
  githubProjectConflicts: {
    __typename?: "GithubProjectConflicts";
    commitCheckIdentifiers?: Array<string> | null;
    commitQueueIdentifiers?: Array<string> | null;
    prTestingIdentifiers?: Array<string> | null;
  };
};

export type HasVersionQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type HasVersionQuery = { __typename?: "Query"; hasVersion: boolean };

export type HostEventsQueryVariables = Exact<{
  id: Scalars["String"]["input"];
  tag: Scalars["String"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type HostEventsQuery = {
  __typename?: "Query";
  hostEvents: {
    __typename?: "HostEvents";
    count: number;
    eventLogEntries: Array<{
      __typename?: "HostEventLogEntry";
      eventType?: string | null;
      id: string;
      processedAt: Date;
      resourceId: string;
      resourceType: string;
      timestamp?: Date | null;
      data: {
        __typename?: "HostEventLogData";
        agentBuild: string;
        agentRevision: string;
        duration: number;
        execution: string;
        hostname: string;
        jasperRevision: string;
        logs: string;
        monitorOp: string;
        newStatus: string;
        oldStatus: string;
        provisioningMethod: string;
        successful: boolean;
        taskId: string;
        taskPid: string;
        taskStatus: string;
        user: string;
      };
    }>;
  };
};

export type HostQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type HostQuery = {
  __typename?: "Query";
  host?: {
    __typename?: "Host";
    ami?: string | null;
    distroId?: string | null;
    lastCommunicationTime?: Date | null;
    hostUrl: string;
    id: string;
    provider: string;
    startedBy: string;
    status: string;
    tag: string;
    uptime?: Date | null;
    user?: string | null;
    distro?: {
      __typename?: "DistroInfo";
      bootstrapMethod?: string | null;
      id?: string | null;
    } | null;
    runningTask?: {
      __typename?: "TaskInfo";
      id?: string | null;
      name?: string | null;
    } | null;
  } | null;
};

export type HostsQueryVariables = Exact<{
  hostId?: InputMaybe<Scalars["String"]["input"]>;
  distroId?: InputMaybe<Scalars["String"]["input"]>;
  currentTaskId?: InputMaybe<Scalars["String"]["input"]>;
  statuses?: InputMaybe<Array<Scalars["String"]["input"]>>;
  startedBy?: InputMaybe<Scalars["String"]["input"]>;
  sortBy?: InputMaybe<HostSortBy>;
  sortDir?: InputMaybe<SortDirection>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type HostsQuery = {
  __typename?: "Query";
  hosts: {
    __typename?: "HostsResponse";
    filteredHostsCount?: number | null;
    totalHostsCount: number;
    hosts: Array<{
      __typename?: "Host";
      distroId?: string | null;
      elapsed?: Date | null;
      hostUrl: string;
      id: string;
      noExpiration: boolean;
      provider: string;
      startedBy: string;
      status: string;
      tag: string;
      totalIdleTime?: number | null;
      uptime?: Date | null;
      distro?: {
        __typename?: "DistroInfo";
        bootstrapMethod?: string | null;
        id?: string | null;
      } | null;
      runningTask?: {
        __typename?: "TaskInfo";
        id?: string | null;
        name?: string | null;
      } | null;
    }>;
  };
};

export type InstanceTypesQueryVariables = Exact<{ [key: string]: never }>;

export type InstanceTypesQuery = {
  __typename?: "Query";
  instanceTypes: Array<string>;
};

export type IsPatchConfiguredQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type IsPatchConfiguredQuery = {
  __typename?: "Query";
  patch: {
    __typename?: "Patch";
    activated: boolean;
    alias?: string | null;
    id: string;
    projectID: string;
  };
};

export type CustomCreatedIssuesQueryVariables = Exact<{
  taskId: Scalars["String"]["input"];
  execution?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type CustomCreatedIssuesQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    execution: number;
    id: string;
    annotation?: {
      __typename?: "Annotation";
      id: string;
      createdIssues?: Array<{
        __typename?: "IssueLink";
        confidenceScore?: number | null;
        issueKey?: string | null;
        url?: string | null;
        jiraTicket?: {
          __typename?: "JiraTicket";
          key: string;
          fields: {
            __typename?: "TicketFields";
            assignedTeam?: string | null;
            assigneeDisplayName?: string | null;
            created: string;
            resolutionName?: string | null;
            summary: string;
            updated: string;
            status: { __typename?: "JiraStatus"; id: string; name: string };
          };
        } | null;
        source?: {
          __typename?: "Source";
          author: string;
          requester: string;
          time: Date;
        } | null;
      } | null> | null;
    } | null;
  } | null;
};

export type IssuesQueryVariables = Exact<{
  taskId: Scalars["String"]["input"];
  execution?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type IssuesQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    execution: number;
    id: string;
    annotation?: {
      __typename?: "Annotation";
      id: string;
      issues?: Array<{
        __typename?: "IssueLink";
        confidenceScore?: number | null;
        issueKey?: string | null;
        url?: string | null;
        jiraTicket?: {
          __typename?: "JiraTicket";
          key: string;
          fields: {
            __typename?: "TicketFields";
            assignedTeam?: string | null;
            assigneeDisplayName?: string | null;
            created: string;
            resolutionName?: string | null;
            summary: string;
            updated: string;
            status: { __typename?: "JiraStatus"; id: string; name: string };
          };
        } | null;
        source?: {
          __typename?: "Source";
          author: string;
          requester: string;
          time: Date;
        } | null;
      } | null> | null;
    } | null;
  } | null;
};

export type SuspectedIssuesQueryVariables = Exact<{
  taskId: Scalars["String"]["input"];
  execution?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type SuspectedIssuesQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    execution: number;
    id: string;
    annotation?: {
      __typename?: "Annotation";
      id: string;
      suspectedIssues?: Array<{
        __typename?: "IssueLink";
        confidenceScore?: number | null;
        issueKey?: string | null;
        url?: string | null;
        jiraTicket?: {
          __typename?: "JiraTicket";
          key: string;
          fields: {
            __typename?: "TicketFields";
            assignedTeam?: string | null;
            assigneeDisplayName?: string | null;
            created: string;
            resolutionName?: string | null;
            summary: string;
            updated: string;
            status: { __typename?: "JiraStatus"; id: string; name: string };
          };
        } | null;
        source?: {
          __typename?: "Source";
          author: string;
          requester: string;
          time: Date;
        } | null;
      } | null> | null;
    } | null;
  } | null;
};

export type LastMainlineCommitQueryVariables = Exact<{
  projectIdentifier: Scalars["String"]["input"];
  skipOrderNumber: Scalars["Int"]["input"];
  buildVariantOptions: BuildVariantOptions;
}>;

export type LastMainlineCommitQuery = {
  __typename?: "Query";
  mainlineCommits?: {
    __typename?: "MainlineCommits";
    versions: Array<{
      __typename?: "MainlineCommitVersion";
      version?: {
        __typename?: "Version";
        id: string;
        buildVariants?: Array<{
          __typename?: "GroupedBuildVariant";
          tasks?: Array<{
            __typename?: "Task";
            execution: number;
            id: string;
            order: number;
            status: string;
          } | null> | null;
        } | null> | null;
      } | null;
    }>;
  } | null;
};

export type LogkeeperBuildMetadataQueryVariables = Exact<{
  buildId: Scalars["String"]["input"];
}>;

export type LogkeeperBuildMetadataQuery = {
  __typename?: "Query";
  logkeeperBuildMetadata: {
    __typename?: "LogkeeperBuild";
    builder: string;
    buildNum: number;
    id: string;
    taskExecution: number;
    taskId: string;
    tests: Array<{ __typename?: "LogkeeperTest"; id: string; name: string }>;
  };
};

export type MainlineCommitsForHistoryQueryVariables = Exact<{
  mainlineCommitsOptions: MainlineCommitsOptions;
  buildVariantOptions: BuildVariantOptions;
}>;

export type MainlineCommitsForHistoryQuery = {
  __typename?: "Query";
  mainlineCommits?: {
    __typename?: "MainlineCommits";
    nextPageOrderNumber?: number | null;
    prevPageOrderNumber?: number | null;
    versions: Array<{
      __typename?: "MainlineCommitVersion";
      rolledUpVersions?: Array<{
        __typename?: "Version";
        author: string;
        createTime: Date;
        id: string;
        message: string;
        order: number;
        revision: string;
        gitTags?: Array<{
          __typename?: "GitTag";
          pusher: string;
          tag: string;
        }> | null;
        upstreamProject?: {
          __typename?: "UpstreamProject";
          owner: string;
          project: string;
          repo: string;
          revision: string;
          triggerID: string;
          triggerType: string;
          task?: { __typename?: "Task"; execution: number; id: string } | null;
          version?: { __typename?: "Version"; id: string } | null;
        } | null;
      }> | null;
      version?: {
        __typename?: "Version";
        author: string;
        createTime: Date;
        id: string;
        message: string;
        order: number;
        revision: string;
        buildVariants?: Array<{
          __typename?: "GroupedBuildVariant";
          displayName: string;
          variant: string;
          tasks?: Array<{
            __typename?: "Task";
            displayName: string;
            execution: number;
            id: string;
            status: string;
          } | null> | null;
        } | null> | null;
        gitTags?: Array<{
          __typename?: "GitTag";
          pusher: string;
          tag: string;
        }> | null;
        upstreamProject?: {
          __typename?: "UpstreamProject";
          owner: string;
          project: string;
          repo: string;
          revision: string;
          triggerID: string;
          triggerType: string;
          task?: { __typename?: "Task"; execution: number; id: string } | null;
          version?: { __typename?: "Version"; id: string } | null;
        } | null;
      } | null;
    }>;
  } | null;
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
  mainlineCommits?: {
    __typename?: "MainlineCommits";
    nextPageOrderNumber?: number | null;
    prevPageOrderNumber?: number | null;
    versions: Array<{
      __typename?: "MainlineCommitVersion";
      rolledUpVersions?: Array<{
        __typename?: "Version";
        author: string;
        createTime: Date;
        id: string;
        ignored: boolean;
        message: string;
        order: number;
        revision: string;
        upstreamProject?: {
          __typename?: "UpstreamProject";
          owner: string;
          project: string;
          repo: string;
          revision: string;
          triggerID: string;
          triggerType: string;
          task?: { __typename?: "Task"; execution: number; id: string } | null;
          version?: { __typename?: "Version"; id: string } | null;
        } | null;
      }> | null;
      version?: {
        __typename?: "Version";
        author: string;
        createTime: Date;
        id: string;
        message: string;
        order: number;
        projectIdentifier: string;
        revision: string;
        buildVariants?: Array<{
          __typename?: "GroupedBuildVariant";
          displayName: string;
          variant: string;
          tasks?: Array<{
            __typename?: "Task";
            displayName: string;
            execution: number;
            hasCedarResults: boolean;
            id: string;
            status: string;
            timeTaken?: number | null;
          } | null> | null;
        } | null> | null;
        buildVariantStats?: Array<{
          __typename?: "GroupedTaskStatusCount";
          displayName: string;
          variant: string;
          statusCounts: Array<{
            __typename?: "StatusCount";
            count: number;
            status: string;
          }>;
        }> | null;
        gitTags?: Array<{
          __typename?: "GitTag";
          pusher: string;
          tag: string;
        }> | null;
        taskStatusStats?: {
          __typename?: "TaskStats";
          eta?: Date | null;
          counts?: Array<{
            __typename?: "StatusCount";
            count: number;
            status: string;
          }> | null;
        } | null;
        upstreamProject?: {
          __typename?: "UpstreamProject";
          owner: string;
          project: string;
          repo: string;
          revision: string;
          triggerID: string;
          triggerType: string;
          task?: { __typename?: "Task"; execution: number; id: string } | null;
          version?: { __typename?: "Version"; id: string } | null;
        } | null;
      } | null;
    }>;
  } | null;
};

export type MyHostsQueryVariables = Exact<{ [key: string]: never }>;

export type MyHostsQuery = {
  __typename?: "Query";
  myHosts: Array<{
    __typename?: "Host";
    availabilityZone?: string | null;
    displayName?: string | null;
    expiration?: Date | null;
    homeVolumeID?: string | null;
    instanceType?: string | null;
    noExpiration: boolean;
    hostUrl: string;
    id: string;
    provider: string;
    startedBy: string;
    status: string;
    tag: string;
    uptime?: Date | null;
    user?: string | null;
    distro?: {
      __typename?: "DistroInfo";
      id?: string | null;
      isVirtualWorkStation?: boolean | null;
      isWindows?: boolean | null;
      user?: string | null;
      workDir?: string | null;
    } | null;
    homeVolume?: {
      __typename?: "Volume";
      displayName: string;
      id: string;
    } | null;
    instanceTags: Array<{
      __typename?: "InstanceTag";
      canBeModified: boolean;
      key: string;
      value: string;
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
    availabilityZone: string;
    createdBy: string;
    creationTime?: Date | null;
    deviceName?: string | null;
    displayName: string;
    expiration?: Date | null;
    homeVolume: boolean;
    hostID: string;
    id: string;
    migrating: boolean;
    noExpiration: boolean;
    size: number;
    type: string;
    host?: {
      __typename?: "Host";
      displayName?: string | null;
      id: string;
      noExpiration: boolean;
    } | null;
  }>;
};

export type OtherUserQueryVariables = Exact<{
  userId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type OtherUserQuery = {
  __typename?: "Query";
  currentUser: { __typename?: "User"; userId: string };
  otherUser: { __typename?: "User"; displayName: string; userId: string };
};

export type ConfigurePatchQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type ConfigurePatchQuery = {
  __typename?: "Query";
  patch: {
    __typename?: "Patch";
    projectIdentifier: string;
    activated: boolean;
    alias?: string | null;
    author: string;
    commitQueuePosition?: number | null;
    description: string;
    id: string;
    status: string;
    childPatchAliases?: Array<{
      __typename?: "ChildPatchAlias";
      alias: string;
      patchId: string;
    }> | null;
    childPatches?: Array<{
      __typename?: "Patch";
      id: string;
      projectIdentifier: string;
      variantsTasks: Array<{
        __typename?: "VariantTask";
        name: string;
        tasks: Array<string>;
      } | null>;
    }> | null;
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
    project?: {
      __typename?: "PatchProject";
      variants: Array<{
        __typename?: "ProjectBuildVariant";
        displayName: string;
        name: string;
        tasks: Array<string>;
      }>;
    } | null;
    time?: { __typename?: "PatchTime"; submittedAt: string } | null;
    parameters: Array<{ __typename?: "Parameter"; key: string; value: string }>;
    variantsTasks: Array<{
      __typename?: "VariantTask";
      name: string;
      tasks: Array<string>;
    } | null>;
  };
};

export type PatchTaskStatusesQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type PatchTaskStatusesQuery = {
  __typename?: "Query";
  patch: {
    __typename?: "Patch";
    baseTaskStatuses: Array<string>;
    id: string;
    taskStatuses: Array<string>;
  };
};

export type PatchQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type PatchQuery = {
  __typename?: "Query";
  patch: {
    __typename?: "Patch";
    githash: string;
    patchNumber: number;
    projectID: string;
    projectIdentifier: string;
    activated: boolean;
    alias?: string | null;
    author: string;
    commitQueuePosition?: number | null;
    description: string;
    id: string;
    status: string;
    versionFull?: { __typename?: "Version"; id: string } | null;
    parameters: Array<{ __typename?: "Parameter"; key: string; value: string }>;
    variantsTasks: Array<{
      __typename?: "VariantTask";
      name: string;
      tasks: Array<string>;
    } | null>;
  };
};

export type PodEventsQueryVariables = Exact<{
  id: Scalars["String"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type PodEventsQuery = {
  __typename?: "Query";
  pod: {
    __typename?: "Pod";
    id: string;
    events: {
      __typename?: "PodEvents";
      count: number;
      eventLogEntries: Array<{
        __typename?: "PodEventLogEntry";
        eventType?: string | null;
        id: string;
        processedAt: Date;
        resourceId: string;
        resourceType: string;
        timestamp?: Date | null;
        data: {
          __typename?: "PodEventLogData";
          newStatus?: string | null;
          oldStatus?: string | null;
          reason?: string | null;
          taskExecution?: number | null;
          taskID?: string | null;
          taskStatus?: string | null;
          task?: {
            __typename?: "Task";
            displayName: string;
            execution: number;
            id: string;
          } | null;
        };
      }>;
    };
  };
};

export type PodQueryVariables = Exact<{
  podId: Scalars["String"]["input"];
}>;

export type PodQuery = {
  __typename?: "Query";
  pod: {
    __typename?: "Pod";
    id: string;
    status: string;
    type: string;
    task?: {
      __typename?: "Task";
      displayName: string;
      execution: number;
      id: string;
    } | null;
    taskContainerCreationOpts: {
      __typename?: "TaskContainerCreationOpts";
      arch: string;
      cpu: number;
      image: string;
      memoryMB: number;
      os: string;
      workingDir: string;
    };
  };
};

export type ProjectBannerQueryVariables = Exact<{
  identifier: Scalars["String"]["input"];
}>;

export type ProjectBannerQuery = {
  __typename?: "Query";
  project: {
    __typename?: "Project";
    id: string;
    banner?: {
      __typename?: "ProjectBanner";
      text: string;
      theme: BannerTheme;
    } | null;
  };
};

export type ProjectEventLogsQueryVariables = Exact<{
  identifier: Scalars["String"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  before?: InputMaybe<Scalars["Time"]["input"]>;
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
      after?: {
        __typename?: "ProjectEventSettings";
        githubWebhooksEnabled: boolean;
        aliases?: Array<{
          __typename?: "ProjectAlias";
          alias: string;
          description?: string | null;
          gitTag: string;
          id: string;
          remotePath: string;
          task: string;
          taskTags: Array<string>;
          variant: string;
          variantTags: Array<string>;
          parameters: Array<{
            __typename?: "Parameter";
            key: string;
            value: string;
          }>;
        }> | null;
        projectRef?: {
          __typename?: "Project";
          hidden?: boolean | null;
          identifier: string;
          repoRefId: string;
          tracksPushEvents?: boolean | null;
          versionControlEnabled?: boolean | null;
          admins?: Array<string | null> | null;
          restricted?: boolean | null;
          batchTime: number;
          branch: string;
          deactivatePrevious?: boolean | null;
          disabledStatsCache?: boolean | null;
          dispatchingDisabled?: boolean | null;
          displayName: string;
          enabled?: boolean | null;
          owner: string;
          patchingDisabled?: boolean | null;
          remotePath: string;
          repo: string;
          repotrackerDisabled?: boolean | null;
          spawnHostScriptPath: string;
          stepbackBisect?: boolean | null;
          stepbackDisabled?: boolean | null;
          notifyOnBuildFailure?: boolean | null;
          githubTriggerAliases?: Array<string> | null;
          perfEnabled?: boolean | null;
          projectHealthView: ProjectHealthView;
          githubChecksEnabled?: boolean | null;
          gitTagAuthorizedTeams?: Array<string> | null;
          gitTagAuthorizedUsers?: Array<string> | null;
          gitTagVersionsEnabled?: boolean | null;
          manualPrTestingEnabled?: boolean | null;
          prTestingEnabled?: boolean | null;
          taskSync: {
            __typename?: "TaskSyncOptions";
            configEnabled?: boolean | null;
            patchEnabled?: boolean | null;
          };
          banner?: {
            __typename?: "ProjectBanner";
            text: string;
            theme: BannerTheme;
          } | null;
          patchTriggerAliases?: Array<{
            __typename?: "PatchTriggerAlias";
            alias: string;
            childProjectIdentifier: string;
            parentAsModule?: string | null;
            status?: string | null;
            taskSpecifiers?: Array<{
              __typename?: "TaskSpecifier";
              patchAlias: string;
              taskRegex: string;
              variantRegex: string;
            }> | null;
          }> | null;
          periodicBuilds?: Array<{
            __typename?: "PeriodicBuild";
            alias: string;
            configFile: string;
            cron: string;
            id: string;
            intervalHours: number;
            message: string;
            nextRunTime: Date;
          }> | null;
          buildBaronSettings: {
            __typename?: "BuildBaronSettings";
            ticketCreateIssueType: string;
            ticketCreateProject: string;
            ticketSearchProjects?: Array<string> | null;
          };
          externalLinks?: Array<{
            __typename?: "ExternalLink";
            displayName: string;
            requesters: Array<string>;
            urlTemplate: string;
          }> | null;
          taskAnnotationSettings: {
            __typename?: "TaskAnnotationSettings";
            fileTicketWebhook: {
              __typename?: "Webhook";
              endpoint: string;
              secret: string;
            };
            jiraCustomFields?: Array<{
              __typename?: "JiraField";
              displayText: string;
              field: string;
            }> | null;
          };
          triggers?: Array<{
            __typename?: "TriggerAlias";
            alias: string;
            buildVariantRegex: string;
            configFile: string;
            dateCutoff?: number | null;
            level: string;
            project: string;
            status: string;
            taskRegex: string;
            unscheduleDownstreamVersions?: boolean | null;
          }> | null;
          parsleyFilters?: Array<{
            __typename?: "ParsleyFilter";
            caseSensitive: boolean;
            exactMatch: boolean;
            expression: string;
          }> | null;
          workstationConfig: {
            __typename?: "WorkstationConfig";
            gitClone?: boolean | null;
            setupCommands?: Array<{
              __typename?: "WorkstationSetupCommand";
              command: string;
              directory: string;
            }> | null;
          };
          commitQueue: {
            __typename?: "CommitQueueParams";
            enabled?: boolean | null;
            mergeMethod: string;
            mergeQueue: MergeQueue;
            message: string;
          };
        } | null;
        subscriptions?: Array<{
          __typename?: "GeneralSubscription";
          id: string;
          ownerType: string;
          resourceType: string;
          trigger: string;
          triggerData?: { [key: string]: any } | null;
          regexSelectors: Array<{
            __typename?: "Selector";
            data: string;
            type: string;
          }>;
          selectors: Array<{
            __typename?: "Selector";
            data: string;
            type: string;
          }>;
          subscriber?: {
            __typename?: "SubscriberWrapper";
            type: string;
            subscriber: {
              __typename?: "Subscriber";
              emailSubscriber?: string | null;
              jiraCommentSubscriber?: string | null;
              slackSubscriber?: string | null;
              githubCheckSubscriber?: {
                __typename?: "GithubCheckSubscriber";
                owner: string;
                ref: string;
                repo: string;
              } | null;
              githubPRSubscriber?: {
                __typename?: "GithubPRSubscriber";
                owner: string;
                prNumber?: number | null;
                ref: string;
                repo: string;
              } | null;
              jiraIssueSubscriber?: {
                __typename?: "JiraIssueSubscriber";
                issueType: string;
                project: string;
              } | null;
              webhookSubscriber?: {
                __typename?: "WebhookSubscriber";
                minDelayMs: number;
                retries: number;
                secret: string;
                timeoutMs: number;
                url: string;
                headers: Array<{
                  __typename?: "WebhookHeader";
                  key: string;
                  value: string;
                } | null>;
              } | null;
            };
          } | null;
        }> | null;
        vars?: {
          __typename?: "ProjectVars";
          adminOnlyVars: Array<string>;
          privateVars: Array<string>;
          vars?: { [key: string]: any } | null;
        } | null;
      } | null;
      before?: {
        __typename?: "ProjectEventSettings";
        githubWebhooksEnabled: boolean;
        aliases?: Array<{
          __typename?: "ProjectAlias";
          alias: string;
          description?: string | null;
          gitTag: string;
          id: string;
          remotePath: string;
          task: string;
          taskTags: Array<string>;
          variant: string;
          variantTags: Array<string>;
          parameters: Array<{
            __typename?: "Parameter";
            key: string;
            value: string;
          }>;
        }> | null;
        projectRef?: {
          __typename?: "Project";
          hidden?: boolean | null;
          identifier: string;
          repoRefId: string;
          tracksPushEvents?: boolean | null;
          versionControlEnabled?: boolean | null;
          admins?: Array<string | null> | null;
          restricted?: boolean | null;
          batchTime: number;
          branch: string;
          deactivatePrevious?: boolean | null;
          disabledStatsCache?: boolean | null;
          dispatchingDisabled?: boolean | null;
          displayName: string;
          enabled?: boolean | null;
          owner: string;
          patchingDisabled?: boolean | null;
          remotePath: string;
          repo: string;
          repotrackerDisabled?: boolean | null;
          spawnHostScriptPath: string;
          stepbackBisect?: boolean | null;
          stepbackDisabled?: boolean | null;
          notifyOnBuildFailure?: boolean | null;
          githubTriggerAliases?: Array<string> | null;
          perfEnabled?: boolean | null;
          projectHealthView: ProjectHealthView;
          githubChecksEnabled?: boolean | null;
          gitTagAuthorizedTeams?: Array<string> | null;
          gitTagAuthorizedUsers?: Array<string> | null;
          gitTagVersionsEnabled?: boolean | null;
          manualPrTestingEnabled?: boolean | null;
          prTestingEnabled?: boolean | null;
          taskSync: {
            __typename?: "TaskSyncOptions";
            configEnabled?: boolean | null;
            patchEnabled?: boolean | null;
          };
          banner?: {
            __typename?: "ProjectBanner";
            text: string;
            theme: BannerTheme;
          } | null;
          patchTriggerAliases?: Array<{
            __typename?: "PatchTriggerAlias";
            alias: string;
            childProjectIdentifier: string;
            parentAsModule?: string | null;
            status?: string | null;
            taskSpecifiers?: Array<{
              __typename?: "TaskSpecifier";
              patchAlias: string;
              taskRegex: string;
              variantRegex: string;
            }> | null;
          }> | null;
          periodicBuilds?: Array<{
            __typename?: "PeriodicBuild";
            alias: string;
            configFile: string;
            cron: string;
            id: string;
            intervalHours: number;
            message: string;
            nextRunTime: Date;
          }> | null;
          buildBaronSettings: {
            __typename?: "BuildBaronSettings";
            ticketCreateIssueType: string;
            ticketCreateProject: string;
            ticketSearchProjects?: Array<string> | null;
          };
          externalLinks?: Array<{
            __typename?: "ExternalLink";
            displayName: string;
            requesters: Array<string>;
            urlTemplate: string;
          }> | null;
          taskAnnotationSettings: {
            __typename?: "TaskAnnotationSettings";
            fileTicketWebhook: {
              __typename?: "Webhook";
              endpoint: string;
              secret: string;
            };
            jiraCustomFields?: Array<{
              __typename?: "JiraField";
              displayText: string;
              field: string;
            }> | null;
          };
          triggers?: Array<{
            __typename?: "TriggerAlias";
            alias: string;
            buildVariantRegex: string;
            configFile: string;
            dateCutoff?: number | null;
            level: string;
            project: string;
            status: string;
            taskRegex: string;
            unscheduleDownstreamVersions?: boolean | null;
          }> | null;
          parsleyFilters?: Array<{
            __typename?: "ParsleyFilter";
            caseSensitive: boolean;
            exactMatch: boolean;
            expression: string;
          }> | null;
          workstationConfig: {
            __typename?: "WorkstationConfig";
            gitClone?: boolean | null;
            setupCommands?: Array<{
              __typename?: "WorkstationSetupCommand";
              command: string;
              directory: string;
            }> | null;
          };
          commitQueue: {
            __typename?: "CommitQueueParams";
            enabled?: boolean | null;
            mergeMethod: string;
            mergeQueue: MergeQueue;
            message: string;
          };
        } | null;
        subscriptions?: Array<{
          __typename?: "GeneralSubscription";
          id: string;
          ownerType: string;
          resourceType: string;
          trigger: string;
          triggerData?: { [key: string]: any } | null;
          regexSelectors: Array<{
            __typename?: "Selector";
            data: string;
            type: string;
          }>;
          selectors: Array<{
            __typename?: "Selector";
            data: string;
            type: string;
          }>;
          subscriber?: {
            __typename?: "SubscriberWrapper";
            type: string;
            subscriber: {
              __typename?: "Subscriber";
              emailSubscriber?: string | null;
              jiraCommentSubscriber?: string | null;
              slackSubscriber?: string | null;
              githubCheckSubscriber?: {
                __typename?: "GithubCheckSubscriber";
                owner: string;
                ref: string;
                repo: string;
              } | null;
              githubPRSubscriber?: {
                __typename?: "GithubPRSubscriber";
                owner: string;
                prNumber?: number | null;
                ref: string;
                repo: string;
              } | null;
              jiraIssueSubscriber?: {
                __typename?: "JiraIssueSubscriber";
                issueType: string;
                project: string;
              } | null;
              webhookSubscriber?: {
                __typename?: "WebhookSubscriber";
                minDelayMs: number;
                retries: number;
                secret: string;
                timeoutMs: number;
                url: string;
                headers: Array<{
                  __typename?: "WebhookHeader";
                  key: string;
                  value: string;
                } | null>;
              } | null;
            };
          } | null;
        }> | null;
        vars?: {
          __typename?: "ProjectVars";
          adminOnlyVars: Array<string>;
          privateVars: Array<string>;
          vars?: { [key: string]: any } | null;
        } | null;
      } | null;
    }>;
  };
};

export type ProjectHealthViewQueryVariables = Exact<{
  identifier: Scalars["String"]["input"];
}>;

export type ProjectHealthViewQuery = {
  __typename?: "Query";
  project: {
    __typename?: "Project";
    id: string;
    projectHealthView: ProjectHealthView;
  };
};

export type ProjectPatchesQueryVariables = Exact<{
  projectIdentifier: Scalars["String"]["input"];
  patchesInput: PatchesInput;
}>;

export type ProjectPatchesQuery = {
  __typename?: "Query";
  project: {
    __typename?: "Project";
    displayName: string;
    id: string;
    patches: {
      __typename?: "Patches";
      filteredPatchCount: number;
      patches: Array<{
        __typename?: "Patch";
        activated: boolean;
        alias?: string | null;
        author: string;
        authorDisplayName: string;
        canEnqueueToCommitQueue: boolean;
        commitQueuePosition?: number | null;
        createTime?: Date | null;
        description: string;
        hidden: boolean;
        id: string;
        projectIdentifier: string;
        status: string;
        projectMetadata?: {
          __typename?: "Project";
          owner: string;
          repo: string;
        } | null;
        versionFull?: {
          __typename?: "Version";
          id: string;
          status: string;
          taskStatusStats?: {
            __typename?: "TaskStats";
            counts?: Array<{
              __typename?: "StatusCount";
              count: number;
              status: string;
            }> | null;
          } | null;
        } | null;
      }>;
    };
  };
};

export type ProjectSettingsQueryVariables = Exact<{
  identifier: Scalars["String"]["input"];
}>;

export type ProjectSettingsQuery = {
  __typename?: "Query";
  projectSettings: {
    __typename?: "ProjectSettings";
    githubWebhooksEnabled: boolean;
    aliases?: Array<{
      __typename?: "ProjectAlias";
      alias: string;
      description?: string | null;
      gitTag: string;
      id: string;
      remotePath: string;
      task: string;
      taskTags: Array<string>;
      variant: string;
      variantTags: Array<string>;
      parameters: Array<{
        __typename?: "Parameter";
        key: string;
        value: string;
      }>;
    }> | null;
    projectRef?: {
      __typename?: "Project";
      id: string;
      identifier: string;
      repoRefId: string;
      admins?: Array<string | null> | null;
      restricted?: boolean | null;
      batchTime: number;
      branch: string;
      deactivatePrevious?: boolean | null;
      disabledStatsCache?: boolean | null;
      dispatchingDisabled?: boolean | null;
      displayName: string;
      enabled?: boolean | null;
      owner: string;
      patchingDisabled?: boolean | null;
      remotePath: string;
      repo: string;
      repotrackerDisabled?: boolean | null;
      spawnHostScriptPath: string;
      stepbackBisect?: boolean | null;
      stepbackDisabled?: boolean | null;
      versionControlEnabled?: boolean | null;
      notifyOnBuildFailure?: boolean | null;
      githubTriggerAliases?: Array<string> | null;
      perfEnabled?: boolean | null;
      projectHealthView: ProjectHealthView;
      githubChecksEnabled?: boolean | null;
      gitTagAuthorizedTeams?: Array<string> | null;
      gitTagAuthorizedUsers?: Array<string> | null;
      gitTagVersionsEnabled?: boolean | null;
      manualPrTestingEnabled?: boolean | null;
      prTestingEnabled?: boolean | null;
      containerSizeDefinitions?: Array<{
        __typename?: "ContainerResources";
        cpu: number;
        memoryMb: number;
        name: string;
      }> | null;
      taskSync: {
        __typename?: "TaskSyncOptions";
        configEnabled?: boolean | null;
        patchEnabled?: boolean | null;
      };
      banner?: {
        __typename?: "ProjectBanner";
        text: string;
        theme: BannerTheme;
      } | null;
      patchTriggerAliases?: Array<{
        __typename?: "PatchTriggerAlias";
        alias: string;
        childProjectIdentifier: string;
        parentAsModule?: string | null;
        status?: string | null;
        taskSpecifiers?: Array<{
          __typename?: "TaskSpecifier";
          patchAlias: string;
          taskRegex: string;
          variantRegex: string;
        }> | null;
      }> | null;
      periodicBuilds?: Array<{
        __typename?: "PeriodicBuild";
        alias: string;
        configFile: string;
        cron: string;
        id: string;
        intervalHours: number;
        message: string;
        nextRunTime: Date;
      }> | null;
      buildBaronSettings: {
        __typename?: "BuildBaronSettings";
        ticketCreateIssueType: string;
        ticketCreateProject: string;
        ticketSearchProjects?: Array<string> | null;
      };
      externalLinks?: Array<{
        __typename?: "ExternalLink";
        displayName: string;
        requesters: Array<string>;
        urlTemplate: string;
      }> | null;
      taskAnnotationSettings: {
        __typename?: "TaskAnnotationSettings";
        fileTicketWebhook: {
          __typename?: "Webhook";
          endpoint: string;
          secret: string;
        };
        jiraCustomFields?: Array<{
          __typename?: "JiraField";
          displayText: string;
          field: string;
        }> | null;
      };
      triggers?: Array<{
        __typename?: "TriggerAlias";
        alias: string;
        buildVariantRegex: string;
        configFile: string;
        dateCutoff?: number | null;
        level: string;
        project: string;
        status: string;
        taskRegex: string;
        unscheduleDownstreamVersions?: boolean | null;
      }> | null;
      parsleyFilters?: Array<{
        __typename?: "ParsleyFilter";
        caseSensitive: boolean;
        exactMatch: boolean;
        expression: string;
      }> | null;
      workstationConfig: {
        __typename?: "WorkstationConfig";
        gitClone?: boolean | null;
        setupCommands?: Array<{
          __typename?: "WorkstationSetupCommand";
          command: string;
          directory: string;
        }> | null;
      };
      commitQueue: {
        __typename?: "CommitQueueParams";
        enabled?: boolean | null;
        mergeMethod: string;
        mergeQueue: MergeQueue;
        message: string;
      };
    } | null;
    subscriptions?: Array<{
      __typename?: "GeneralSubscription";
      id: string;
      ownerType: string;
      resourceType: string;
      trigger: string;
      triggerData?: { [key: string]: any } | null;
      regexSelectors: Array<{
        __typename?: "Selector";
        data: string;
        type: string;
      }>;
      selectors: Array<{ __typename?: "Selector"; data: string; type: string }>;
      subscriber?: {
        __typename?: "SubscriberWrapper";
        type: string;
        subscriber: {
          __typename?: "Subscriber";
          emailSubscriber?: string | null;
          jiraCommentSubscriber?: string | null;
          slackSubscriber?: string | null;
          githubCheckSubscriber?: {
            __typename?: "GithubCheckSubscriber";
            owner: string;
            ref: string;
            repo: string;
          } | null;
          githubPRSubscriber?: {
            __typename?: "GithubPRSubscriber";
            owner: string;
            prNumber?: number | null;
            ref: string;
            repo: string;
          } | null;
          jiraIssueSubscriber?: {
            __typename?: "JiraIssueSubscriber";
            issueType: string;
            project: string;
          } | null;
          webhookSubscriber?: {
            __typename?: "WebhookSubscriber";
            minDelayMs: number;
            retries: number;
            secret: string;
            timeoutMs: number;
            url: string;
            headers: Array<{
              __typename?: "WebhookHeader";
              key: string;
              value: string;
            } | null>;
          } | null;
        };
      } | null;
    }> | null;
    vars?: {
      __typename?: "ProjectVars";
      adminOnlyVars: Array<string>;
      privateVars: Array<string>;
      vars?: { [key: string]: any } | null;
    } | null;
  };
};

export type ProjectsQueryVariables = Exact<{ [key: string]: never }>;

export type ProjectsQuery = {
  __typename?: "Query";
  projects: Array<{
    __typename?: "GroupedProjects";
    groupDisplayName: string;
    projects: Array<{
      __typename?: "Project";
      displayName: string;
      id: string;
      identifier: string;
      isFavorite: boolean;
      owner: string;
      repo: string;
    }>;
  } | null>;
};

export type MyPublicKeysQueryVariables = Exact<{ [key: string]: never }>;

export type MyPublicKeysQuery = {
  __typename?: "Query";
  myPublicKeys: Array<{ __typename?: "PublicKey"; key: string; name: string }>;
};

export type RepoEventLogsQueryVariables = Exact<{
  id: Scalars["String"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  before?: InputMaybe<Scalars["Time"]["input"]>;
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
      after?: {
        __typename?: "ProjectEventSettings";
        githubWebhooksEnabled: boolean;
        aliases?: Array<{
          __typename?: "ProjectAlias";
          alias: string;
          description?: string | null;
          gitTag: string;
          id: string;
          remotePath: string;
          task: string;
          taskTags: Array<string>;
          variant: string;
          variantTags: Array<string>;
          parameters: Array<{
            __typename?: "Parameter";
            key: string;
            value: string;
          }>;
        }> | null;
        projectRef?: {
          __typename?: "Project";
          hidden?: boolean | null;
          identifier: string;
          repoRefId: string;
          tracksPushEvents?: boolean | null;
          versionControlEnabled?: boolean | null;
          admins?: Array<string | null> | null;
          restricted?: boolean | null;
          batchTime: number;
          branch: string;
          deactivatePrevious?: boolean | null;
          disabledStatsCache?: boolean | null;
          dispatchingDisabled?: boolean | null;
          displayName: string;
          enabled?: boolean | null;
          owner: string;
          patchingDisabled?: boolean | null;
          remotePath: string;
          repo: string;
          repotrackerDisabled?: boolean | null;
          spawnHostScriptPath: string;
          stepbackBisect?: boolean | null;
          stepbackDisabled?: boolean | null;
          notifyOnBuildFailure?: boolean | null;
          githubTriggerAliases?: Array<string> | null;
          perfEnabled?: boolean | null;
          projectHealthView: ProjectHealthView;
          githubChecksEnabled?: boolean | null;
          gitTagAuthorizedTeams?: Array<string> | null;
          gitTagAuthorizedUsers?: Array<string> | null;
          gitTagVersionsEnabled?: boolean | null;
          manualPrTestingEnabled?: boolean | null;
          prTestingEnabled?: boolean | null;
          taskSync: {
            __typename?: "TaskSyncOptions";
            configEnabled?: boolean | null;
            patchEnabled?: boolean | null;
          };
          banner?: {
            __typename?: "ProjectBanner";
            text: string;
            theme: BannerTheme;
          } | null;
          patchTriggerAliases?: Array<{
            __typename?: "PatchTriggerAlias";
            alias: string;
            childProjectIdentifier: string;
            parentAsModule?: string | null;
            status?: string | null;
            taskSpecifiers?: Array<{
              __typename?: "TaskSpecifier";
              patchAlias: string;
              taskRegex: string;
              variantRegex: string;
            }> | null;
          }> | null;
          periodicBuilds?: Array<{
            __typename?: "PeriodicBuild";
            alias: string;
            configFile: string;
            cron: string;
            id: string;
            intervalHours: number;
            message: string;
            nextRunTime: Date;
          }> | null;
          buildBaronSettings: {
            __typename?: "BuildBaronSettings";
            ticketCreateIssueType: string;
            ticketCreateProject: string;
            ticketSearchProjects?: Array<string> | null;
          };
          externalLinks?: Array<{
            __typename?: "ExternalLink";
            displayName: string;
            requesters: Array<string>;
            urlTemplate: string;
          }> | null;
          taskAnnotationSettings: {
            __typename?: "TaskAnnotationSettings";
            fileTicketWebhook: {
              __typename?: "Webhook";
              endpoint: string;
              secret: string;
            };
            jiraCustomFields?: Array<{
              __typename?: "JiraField";
              displayText: string;
              field: string;
            }> | null;
          };
          triggers?: Array<{
            __typename?: "TriggerAlias";
            alias: string;
            buildVariantRegex: string;
            configFile: string;
            dateCutoff?: number | null;
            level: string;
            project: string;
            status: string;
            taskRegex: string;
            unscheduleDownstreamVersions?: boolean | null;
          }> | null;
          parsleyFilters?: Array<{
            __typename?: "ParsleyFilter";
            caseSensitive: boolean;
            exactMatch: boolean;
            expression: string;
          }> | null;
          workstationConfig: {
            __typename?: "WorkstationConfig";
            gitClone?: boolean | null;
            setupCommands?: Array<{
              __typename?: "WorkstationSetupCommand";
              command: string;
              directory: string;
            }> | null;
          };
          commitQueue: {
            __typename?: "CommitQueueParams";
            enabled?: boolean | null;
            mergeMethod: string;
            mergeQueue: MergeQueue;
            message: string;
          };
        } | null;
        subscriptions?: Array<{
          __typename?: "GeneralSubscription";
          id: string;
          ownerType: string;
          resourceType: string;
          trigger: string;
          triggerData?: { [key: string]: any } | null;
          regexSelectors: Array<{
            __typename?: "Selector";
            data: string;
            type: string;
          }>;
          selectors: Array<{
            __typename?: "Selector";
            data: string;
            type: string;
          }>;
          subscriber?: {
            __typename?: "SubscriberWrapper";
            type: string;
            subscriber: {
              __typename?: "Subscriber";
              emailSubscriber?: string | null;
              jiraCommentSubscriber?: string | null;
              slackSubscriber?: string | null;
              githubCheckSubscriber?: {
                __typename?: "GithubCheckSubscriber";
                owner: string;
                ref: string;
                repo: string;
              } | null;
              githubPRSubscriber?: {
                __typename?: "GithubPRSubscriber";
                owner: string;
                prNumber?: number | null;
                ref: string;
                repo: string;
              } | null;
              jiraIssueSubscriber?: {
                __typename?: "JiraIssueSubscriber";
                issueType: string;
                project: string;
              } | null;
              webhookSubscriber?: {
                __typename?: "WebhookSubscriber";
                minDelayMs: number;
                retries: number;
                secret: string;
                timeoutMs: number;
                url: string;
                headers: Array<{
                  __typename?: "WebhookHeader";
                  key: string;
                  value: string;
                } | null>;
              } | null;
            };
          } | null;
        }> | null;
        vars?: {
          __typename?: "ProjectVars";
          adminOnlyVars: Array<string>;
          privateVars: Array<string>;
          vars?: { [key: string]: any } | null;
        } | null;
      } | null;
      before?: {
        __typename?: "ProjectEventSettings";
        githubWebhooksEnabled: boolean;
        aliases?: Array<{
          __typename?: "ProjectAlias";
          alias: string;
          description?: string | null;
          gitTag: string;
          id: string;
          remotePath: string;
          task: string;
          taskTags: Array<string>;
          variant: string;
          variantTags: Array<string>;
          parameters: Array<{
            __typename?: "Parameter";
            key: string;
            value: string;
          }>;
        }> | null;
        projectRef?: {
          __typename?: "Project";
          hidden?: boolean | null;
          identifier: string;
          repoRefId: string;
          tracksPushEvents?: boolean | null;
          versionControlEnabled?: boolean | null;
          admins?: Array<string | null> | null;
          restricted?: boolean | null;
          batchTime: number;
          branch: string;
          deactivatePrevious?: boolean | null;
          disabledStatsCache?: boolean | null;
          dispatchingDisabled?: boolean | null;
          displayName: string;
          enabled?: boolean | null;
          owner: string;
          patchingDisabled?: boolean | null;
          remotePath: string;
          repo: string;
          repotrackerDisabled?: boolean | null;
          spawnHostScriptPath: string;
          stepbackBisect?: boolean | null;
          stepbackDisabled?: boolean | null;
          notifyOnBuildFailure?: boolean | null;
          githubTriggerAliases?: Array<string> | null;
          perfEnabled?: boolean | null;
          projectHealthView: ProjectHealthView;
          githubChecksEnabled?: boolean | null;
          gitTagAuthorizedTeams?: Array<string> | null;
          gitTagAuthorizedUsers?: Array<string> | null;
          gitTagVersionsEnabled?: boolean | null;
          manualPrTestingEnabled?: boolean | null;
          prTestingEnabled?: boolean | null;
          taskSync: {
            __typename?: "TaskSyncOptions";
            configEnabled?: boolean | null;
            patchEnabled?: boolean | null;
          };
          banner?: {
            __typename?: "ProjectBanner";
            text: string;
            theme: BannerTheme;
          } | null;
          patchTriggerAliases?: Array<{
            __typename?: "PatchTriggerAlias";
            alias: string;
            childProjectIdentifier: string;
            parentAsModule?: string | null;
            status?: string | null;
            taskSpecifiers?: Array<{
              __typename?: "TaskSpecifier";
              patchAlias: string;
              taskRegex: string;
              variantRegex: string;
            }> | null;
          }> | null;
          periodicBuilds?: Array<{
            __typename?: "PeriodicBuild";
            alias: string;
            configFile: string;
            cron: string;
            id: string;
            intervalHours: number;
            message: string;
            nextRunTime: Date;
          }> | null;
          buildBaronSettings: {
            __typename?: "BuildBaronSettings";
            ticketCreateIssueType: string;
            ticketCreateProject: string;
            ticketSearchProjects?: Array<string> | null;
          };
          externalLinks?: Array<{
            __typename?: "ExternalLink";
            displayName: string;
            requesters: Array<string>;
            urlTemplate: string;
          }> | null;
          taskAnnotationSettings: {
            __typename?: "TaskAnnotationSettings";
            fileTicketWebhook: {
              __typename?: "Webhook";
              endpoint: string;
              secret: string;
            };
            jiraCustomFields?: Array<{
              __typename?: "JiraField";
              displayText: string;
              field: string;
            }> | null;
          };
          triggers?: Array<{
            __typename?: "TriggerAlias";
            alias: string;
            buildVariantRegex: string;
            configFile: string;
            dateCutoff?: number | null;
            level: string;
            project: string;
            status: string;
            taskRegex: string;
            unscheduleDownstreamVersions?: boolean | null;
          }> | null;
          parsleyFilters?: Array<{
            __typename?: "ParsleyFilter";
            caseSensitive: boolean;
            exactMatch: boolean;
            expression: string;
          }> | null;
          workstationConfig: {
            __typename?: "WorkstationConfig";
            gitClone?: boolean | null;
            setupCommands?: Array<{
              __typename?: "WorkstationSetupCommand";
              command: string;
              directory: string;
            }> | null;
          };
          commitQueue: {
            __typename?: "CommitQueueParams";
            enabled?: boolean | null;
            mergeMethod: string;
            mergeQueue: MergeQueue;
            message: string;
          };
        } | null;
        subscriptions?: Array<{
          __typename?: "GeneralSubscription";
          id: string;
          ownerType: string;
          resourceType: string;
          trigger: string;
          triggerData?: { [key: string]: any } | null;
          regexSelectors: Array<{
            __typename?: "Selector";
            data: string;
            type: string;
          }>;
          selectors: Array<{
            __typename?: "Selector";
            data: string;
            type: string;
          }>;
          subscriber?: {
            __typename?: "SubscriberWrapper";
            type: string;
            subscriber: {
              __typename?: "Subscriber";
              emailSubscriber?: string | null;
              jiraCommentSubscriber?: string | null;
              slackSubscriber?: string | null;
              githubCheckSubscriber?: {
                __typename?: "GithubCheckSubscriber";
                owner: string;
                ref: string;
                repo: string;
              } | null;
              githubPRSubscriber?: {
                __typename?: "GithubPRSubscriber";
                owner: string;
                prNumber?: number | null;
                ref: string;
                repo: string;
              } | null;
              jiraIssueSubscriber?: {
                __typename?: "JiraIssueSubscriber";
                issueType: string;
                project: string;
              } | null;
              webhookSubscriber?: {
                __typename?: "WebhookSubscriber";
                minDelayMs: number;
                retries: number;
                secret: string;
                timeoutMs: number;
                url: string;
                headers: Array<{
                  __typename?: "WebhookHeader";
                  key: string;
                  value: string;
                } | null>;
              } | null;
            };
          } | null;
        }> | null;
        vars?: {
          __typename?: "ProjectVars";
          adminOnlyVars: Array<string>;
          privateVars: Array<string>;
          vars?: { [key: string]: any } | null;
        } | null;
      } | null;
    }>;
  };
};

export type RepoSettingsQueryVariables = Exact<{
  repoId: Scalars["String"]["input"];
}>;

export type RepoSettingsQuery = {
  __typename?: "Query";
  repoSettings: {
    __typename?: "RepoSettings";
    githubWebhooksEnabled: boolean;
    aliases?: Array<{
      __typename?: "ProjectAlias";
      alias: string;
      description?: string | null;
      gitTag: string;
      id: string;
      remotePath: string;
      task: string;
      taskTags: Array<string>;
      variant: string;
      variantTags: Array<string>;
      parameters: Array<{
        __typename?: "Parameter";
        key: string;
        value: string;
      }>;
    }> | null;
    projectRef?: {
      __typename?: "RepoRef";
      displayName: string;
      id: string;
      admins: Array<string>;
      restricted: boolean;
      batchTime: number;
      deactivatePrevious: boolean;
      disabledStatsCache: boolean;
      dispatchingDisabled: boolean;
      owner: string;
      patchingDisabled: boolean;
      remotePath: string;
      repo: string;
      repotrackerDisabled: boolean;
      spawnHostScriptPath: string;
      stepbackBisect?: boolean | null;
      stepbackDisabled: boolean;
      versionControlEnabled: boolean;
      notifyOnBuildFailure: boolean;
      githubTriggerAliases?: Array<string> | null;
      perfEnabled: boolean;
      githubChecksEnabled: boolean;
      gitTagAuthorizedTeams?: Array<string> | null;
      gitTagAuthorizedUsers?: Array<string> | null;
      gitTagVersionsEnabled: boolean;
      manualPrTestingEnabled: boolean;
      prTestingEnabled: boolean;
      containerSizeDefinitions?: Array<{
        __typename?: "ContainerResources";
        cpu: number;
        memoryMb: number;
        name: string;
      }> | null;
      taskSync: {
        __typename?: "RepoTaskSyncOptions";
        configEnabled: boolean;
        patchEnabled: boolean;
      };
      patchTriggerAliases?: Array<{
        __typename?: "PatchTriggerAlias";
        alias: string;
        childProjectIdentifier: string;
        parentAsModule?: string | null;
        status?: string | null;
        taskSpecifiers?: Array<{
          __typename?: "TaskSpecifier";
          patchAlias: string;
          taskRegex: string;
          variantRegex: string;
        }> | null;
      }> | null;
      periodicBuilds?: Array<{
        __typename?: "PeriodicBuild";
        alias: string;
        configFile: string;
        cron: string;
        id: string;
        intervalHours: number;
        message: string;
        nextRunTime: Date;
      }> | null;
      buildBaronSettings: {
        __typename?: "BuildBaronSettings";
        ticketCreateIssueType: string;
        ticketCreateProject: string;
        ticketSearchProjects?: Array<string> | null;
      };
      externalLinks?: Array<{
        __typename?: "ExternalLink";
        displayName: string;
        requesters: Array<string>;
        urlTemplate: string;
      }> | null;
      taskAnnotationSettings: {
        __typename?: "TaskAnnotationSettings";
        fileTicketWebhook: {
          __typename?: "Webhook";
          endpoint: string;
          secret: string;
        };
        jiraCustomFields?: Array<{
          __typename?: "JiraField";
          displayText: string;
          field: string;
        }> | null;
      };
      triggers: Array<{
        __typename?: "TriggerAlias";
        alias: string;
        buildVariantRegex: string;
        configFile: string;
        dateCutoff?: number | null;
        level: string;
        project: string;
        status: string;
        taskRegex: string;
        unscheduleDownstreamVersions?: boolean | null;
      }>;
      parsleyFilters?: Array<{
        __typename?: "ParsleyFilter";
        caseSensitive: boolean;
        exactMatch: boolean;
        expression: string;
      }> | null;
      workstationConfig: {
        __typename?: "RepoWorkstationConfig";
        gitClone: boolean;
        setupCommands?: Array<{
          __typename?: "WorkstationSetupCommand";
          command: string;
          directory: string;
        }> | null;
      };
      commitQueue: {
        __typename?: "RepoCommitQueueParams";
        enabled: boolean;
        mergeMethod: string;
        mergeQueue: MergeQueue;
        message: string;
      };
    } | null;
    subscriptions?: Array<{
      __typename?: "GeneralSubscription";
      id: string;
      ownerType: string;
      resourceType: string;
      trigger: string;
      triggerData?: { [key: string]: any } | null;
      regexSelectors: Array<{
        __typename?: "Selector";
        data: string;
        type: string;
      }>;
      selectors: Array<{ __typename?: "Selector"; data: string; type: string }>;
      subscriber?: {
        __typename?: "SubscriberWrapper";
        type: string;
        subscriber: {
          __typename?: "Subscriber";
          emailSubscriber?: string | null;
          jiraCommentSubscriber?: string | null;
          slackSubscriber?: string | null;
          githubCheckSubscriber?: {
            __typename?: "GithubCheckSubscriber";
            owner: string;
            ref: string;
            repo: string;
          } | null;
          githubPRSubscriber?: {
            __typename?: "GithubPRSubscriber";
            owner: string;
            prNumber?: number | null;
            ref: string;
            repo: string;
          } | null;
          jiraIssueSubscriber?: {
            __typename?: "JiraIssueSubscriber";
            issueType: string;
            project: string;
          } | null;
          webhookSubscriber?: {
            __typename?: "WebhookSubscriber";
            minDelayMs: number;
            retries: number;
            secret: string;
            timeoutMs: number;
            url: string;
            headers: Array<{
              __typename?: "WebhookHeader";
              key: string;
              value: string;
            } | null>;
          } | null;
        };
      } | null;
    }> | null;
    vars?: {
      __typename?: "ProjectVars";
      adminOnlyVars: Array<string>;
      privateVars: Array<string>;
      vars?: { [key: string]: any } | null;
    } | null;
  };
};

export type RepotrackerErrorQueryVariables = Exact<{
  projectIdentifier: Scalars["String"]["input"];
}>;

export type RepotrackerErrorQuery = {
  __typename?: "Query";
  project: {
    __typename?: "Project";
    branch: string;
    id: string;
    repotrackerError?: {
      __typename?: "RepotrackerError";
      exists: boolean;
      invalidRevision: string;
    } | null;
  };
};

export type SpawnExpirationInfoQueryVariables = Exact<{ [key: string]: never }>;

export type SpawnExpirationInfoQuery = {
  __typename?: "Query";
  myHosts: Array<{ __typename?: "Host"; id: string; noExpiration: boolean }>;
  myVolumes: Array<{
    __typename?: "Volume";
    id: string;
    noExpiration: boolean;
  }>;
};

export type SpawnTaskQueryVariables = Exact<{
  taskId: Scalars["String"]["input"];
}>;

export type SpawnTaskQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    canSync: boolean;
    buildVariant: string;
    buildVariantDisplayName?: string | null;
    displayName: string;
    execution: number;
    id: string;
    revision?: string | null;
    status: string;
    project?: {
      __typename?: "Project";
      id: string;
      spawnHostScriptPath: string;
    } | null;
  } | null;
};

export type SpruceConfigQueryVariables = Exact<{ [key: string]: never }>;

export type SpruceConfigQuery = {
  __typename?: "Query";
  spruceConfig?: {
    __typename?: "SpruceConfig";
    banner?: string | null;
    bannerTheme?: string | null;
    containerPools?: {
      __typename?: "ContainerPoolsConfig";
      pools: Array<{
        __typename?: "ContainerPool";
        distro: string;
        id: string;
        maxContainers: number;
        port: number;
      }>;
    } | null;
    jira?: {
      __typename?: "JiraConfig";
      email?: string | null;
      host?: string | null;
    } | null;
    keys: Array<{ __typename?: "SSHKey"; location: string; name: string }>;
    providers?: {
      __typename?: "CloudProviderConfig";
      aws?: {
        __typename?: "AWSConfig";
        maxVolumeSizePerUser?: number | null;
        pod?: {
          __typename?: "AWSPodConfig";
          ecs?: {
            __typename?: "ECSConfig";
            maxCPU: number;
            maxMemoryMb: number;
          } | null;
        } | null;
      } | null;
    } | null;
    slack?: { __typename?: "SlackConfig"; name?: string | null } | null;
    spawnHost: {
      __typename?: "SpawnHostConfig";
      spawnHostsPerUser: number;
      unexpirableHostsPerUser: number;
      unexpirableVolumesPerUser: number;
    };
    ui?: { __typename?: "UIConfig"; defaultProject: string } | null;
  } | null;
};

export type SubnetAvailabilityZonesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type SubnetAvailabilityZonesQuery = {
  __typename?: "Query";
  subnetAvailabilityZones: Array<string>;
};

export type SystemLogsQueryVariables = Exact<{
  id: Scalars["String"]["input"];
  execution?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type SystemLogsQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    execution: number;
    id: string;
    taskLogs: {
      __typename?: "TaskLogs";
      systemLogs: Array<{
        __typename?: "LogMessage";
        message?: string | null;
        severity?: string | null;
        timestamp?: Date | null;
      }>;
    };
  } | null;
};

export type TaskAllExecutionsQueryVariables = Exact<{
  taskId: Scalars["String"]["input"];
}>;

export type TaskAllExecutionsQuery = {
  __typename?: "Query";
  taskAllExecutions: Array<{
    __typename?: "Task";
    activatedTime?: Date | null;
    execution: number;
    id: string;
    ingestTime?: Date | null;
    status: string;
  }>;
};

export type TaskEventLogsQueryVariables = Exact<{
  id: Scalars["String"]["input"];
  execution?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type TaskEventLogsQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    execution: number;
    id: string;
    taskLogs: {
      __typename?: "TaskLogs";
      eventLogs: Array<{
        __typename?: "TaskEventLogEntry";
        eventType?: string | null;
        id: string;
        timestamp?: Date | null;
        data: {
          __typename?: "TaskEventLogData";
          hostId?: string | null;
          jiraIssue?: string | null;
          jiraLink?: string | null;
          podId?: string | null;
          priority?: number | null;
          status?: string | null;
          timestamp?: Date | null;
          userId?: string | null;
        };
      }>;
    };
  } | null;
};

export type TaskFilesQueryVariables = Exact<{
  taskId: Scalars["String"]["input"];
  execution?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type TaskFilesQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    execution: number;
    id: string;
    files: {
      __typename?: "TaskFiles";
      fileCount: number;
      groupedFiles: Array<{
        __typename?: "GroupedFiles";
        taskName?: string | null;
        files?: Array<{
          __typename?: "File";
          link: string;
          name: string;
          urlParsley?: string | null;
        }> | null;
      }>;
    };
  } | null;
};

export type TaskLogsQueryVariables = Exact<{
  id: Scalars["String"]["input"];
  execution?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type TaskLogsQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    execution: number;
    id: string;
    taskLogs: {
      __typename?: "TaskLogs";
      taskLogs: Array<{
        __typename?: "LogMessage";
        message?: string | null;
        severity?: string | null;
        timestamp?: Date | null;
      }>;
    };
  } | null;
};

export type TaskNamesForBuildVariantQueryVariables = Exact<{
  projectIdentifier: Scalars["String"]["input"];
  buildVariant: Scalars["String"]["input"];
}>;

export type TaskNamesForBuildVariantQuery = {
  __typename?: "Query";
  taskNamesForBuildVariant?: Array<string> | null;
};

export type TaskQueueDistrosQueryVariables = Exact<{ [key: string]: never }>;

export type TaskQueueDistrosQuery = {
  __typename?: "Query";
  taskQueueDistros: Array<{
    __typename?: "TaskQueueDistro";
    hostCount: number;
    id: string;
    taskCount: number;
  }>;
};

export type TaskStatusesQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type TaskStatusesQuery = {
  __typename?: "Query";
  version: {
    __typename?: "Version";
    baseTaskStatuses: Array<string>;
    id: string;
    taskStatuses: Array<string>;
  };
};

export type TaskTestSampleQueryVariables = Exact<{
  tasks: Array<Scalars["String"]["input"]>;
  filters: Array<TestFilter>;
}>;

export type TaskTestSampleQuery = {
  __typename?: "Query";
  taskTestSample?: Array<{
    __typename?: "TaskTestResultSample";
    execution: number;
    matchingFailedTestNames: Array<string>;
    taskId: string;
    totalTestCount: number;
  }> | null;
};

export type TaskTestsQueryVariables = Exact<{
  id: Scalars["String"]["input"];
  execution?: InputMaybe<Scalars["Int"]["input"]>;
  pageNum?: InputMaybe<Scalars["Int"]["input"]>;
  limitNum?: InputMaybe<Scalars["Int"]["input"]>;
  statusList: Array<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<TestSortOptions>>;
  testName: Scalars["String"]["input"];
}>;

export type TaskTestsQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    execution: number;
    id: string;
    tests: {
      __typename?: "TaskTestResult";
      filteredTestCount: number;
      totalTestCount: number;
      testResults: Array<{
        __typename?: "TestResult";
        baseStatus?: string | null;
        duration?: number | null;
        id: string;
        status: string;
        testFile: string;
        logs: {
          __typename?: "TestLog";
          url?: string | null;
          urlParsley?: string | null;
          urlRaw?: string | null;
        };
      }>;
    };
  } | null;
};

export type TaskQueryVariables = Exact<{
  taskId: Scalars["String"]["input"];
  execution?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type TaskQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    aborted: boolean;
    activatedBy?: string | null;
    activatedTime?: Date | null;
    ami?: string | null;
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
    estimatedStart?: number | null;
    expectedDuration?: number | null;
    failedTestCount: number;
    finishTime?: Date | null;
    generatedBy?: string | null;
    generatedByName?: string | null;
    hostId?: string | null;
    ingestTime?: Date | null;
    isPerfPluginEnabled: boolean;
    latestExecution: number;
    minQueuePosition: number;
    order: number;
    patchNumber?: number | null;
    priority?: number | null;
    requester: string;
    resetWhenFinished: boolean;
    spawnHostLink?: string | null;
    startTime?: Date | null;
    timeTaken?: number | null;
    totalTestCount: number;
    buildVariant: string;
    buildVariantDisplayName?: string | null;
    displayName: string;
    execution: number;
    id: string;
    revision?: string | null;
    status: string;
    abortInfo?: {
      __typename?: "AbortInfo";
      buildVariantDisplayName: string;
      newVersion: string;
      prClosed: boolean;
      taskDisplayName: string;
      taskID: string;
      user: string;
    } | null;
    annotation?: {
      __typename?: "Annotation";
      id: string;
      taskExecution: number;
      taskId: string;
      webhookConfigured: boolean;
      createdIssues?: Array<{
        __typename?: "IssueLink";
        issueKey?: string | null;
        url?: string | null;
        source?: {
          __typename?: "Source";
          author: string;
          requester: string;
          time: Date;
        } | null;
      } | null> | null;
      issues?: Array<{
        __typename?: "IssueLink";
        issueKey?: string | null;
        url?: string | null;
        source?: {
          __typename?: "Source";
          author: string;
          requester: string;
          time: Date;
        } | null;
      } | null> | null;
      metadataLinks?: Array<{
        __typename?: "MetadataLink";
        text: string;
        url: string;
      } | null> | null;
      note?: {
        __typename?: "Note";
        message: string;
        source: {
          __typename?: "Source";
          author: string;
          requester: string;
          time: Date;
        };
      } | null;
      suspectedIssues?: Array<{
        __typename?: "IssueLink";
        issueKey?: string | null;
        url?: string | null;
        source?: {
          __typename?: "Source";
          author: string;
          requester: string;
          time: Date;
        } | null;
      } | null> | null;
    } | null;
    baseTask?: {
      __typename?: "Task";
      execution: number;
      id: string;
      timeTaken?: number | null;
      versionMetadata: { __typename?: "Version"; id: string; revision: string };
    } | null;
    dependsOn?: Array<{
      __typename?: "Dependency";
      buildVariant: string;
      metStatus: MetStatus;
      name: string;
      requiredStatus: RequiredStatus;
      taskId: string;
    }> | null;
    details?: {
      __typename?: "TaskEndDetail";
      description?: string | null;
      diskDevices: Array<string>;
      status: string;
      timedOut?: boolean | null;
      timeoutType?: string | null;
      traceID?: string | null;
      type: string;
      oomTracker: {
        __typename?: "OomTrackerInfo";
        detected: boolean;
        pids?: Array<number | null> | null;
      };
    } | null;
    displayTask?: {
      __typename?: "Task";
      displayName: string;
      execution: number;
      id: string;
    } | null;
    executionTasksFull?: Array<{
      __typename?: "Task";
      baseStatus?: string | null;
      buildVariant: string;
      buildVariantDisplayName?: string | null;
      displayName: string;
      execution: number;
      id: string;
      status: string;
    }> | null;
    files: { __typename?: "TaskFiles"; fileCount: number };
    logs: {
      __typename?: "TaskLogLinks";
      agentLogLink?: string | null;
      allLogLink?: string | null;
      eventLogLink?: string | null;
      systemLogLink?: string | null;
      taskLogLink?: string | null;
    };
    pod?: { __typename?: "Pod"; id: string } | null;
    project?: { __typename?: "Project"; id: string; identifier: string } | null;
    stepbackInfo?: {
      __typename?: "StepbackInfo";
      lastFailingStepbackTaskId?: string | null;
      lastPassingStepbackTaskId?: string | null;
      nextStepbackTaskId?: string | null;
      previousStepbackTaskId?: string | null;
    } | null;
    versionMetadata: {
      __typename?: "Version";
      author: string;
      id: string;
      isPatch: boolean;
      message: string;
      order: number;
      project: string;
      projectIdentifier: string;
      revision: string;
    };
  } | null;
};

export type UndispatchedTasksQueryVariables = Exact<{
  versionId: Scalars["String"]["input"];
}>;

export type UndispatchedTasksQuery = {
  __typename?: "Query";
  version: {
    __typename?: "Version";
    id: string;
    tasks: {
      __typename?: "VersionTasks";
      data: Array<{
        __typename?: "Task";
        buildVariant: string;
        buildVariantDisplayName?: string | null;
        displayName: string;
        execution: number;
        id: string;
      }>;
    };
  };
};

export type UserConfigQueryVariables = Exact<{ [key: string]: never }>;

export type UserConfigQuery = {
  __typename?: "Query";
  userConfig?: {
    __typename?: "UserConfig";
    api_key: string;
    api_server_host: string;
    ui_server_host: string;
    user: string;
  } | null;
};

export type UserDistroSettingsPermissionsQueryVariables = Exact<{
  distroId: Scalars["String"]["input"];
}>;

export type UserDistroSettingsPermissionsQuery = {
  __typename?: "Query";
  user: {
    __typename?: "User";
    userId: string;
    permissions: {
      __typename?: "Permissions";
      canCreateDistro: boolean;
      distroPermissions: {
        __typename?: "DistroPermissions";
        admin: boolean;
        edit: boolean;
      };
    };
  };
};

export type UserPatchesQueryVariables = Exact<{
  userId: Scalars["String"]["input"];
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
        activated: boolean;
        alias?: string | null;
        author: string;
        authorDisplayName: string;
        canEnqueueToCommitQueue: boolean;
        commitQueuePosition?: number | null;
        createTime?: Date | null;
        description: string;
        hidden: boolean;
        id: string;
        projectIdentifier: string;
        status: string;
        projectMetadata?: {
          __typename?: "Project";
          owner: string;
          repo: string;
        } | null;
        versionFull?: {
          __typename?: "Version";
          id: string;
          status: string;
          taskStatusStats?: {
            __typename?: "TaskStats";
            counts?: Array<{
              __typename?: "StatusCount";
              count: number;
              status: string;
            }> | null;
          } | null;
        } | null;
      }>;
    };
  };
};

export type UserProjectSettingsPermissionsQueryVariables = Exact<{
  projectIdentifier: Scalars["String"]["input"];
}>;

export type UserProjectSettingsPermissionsQuery = {
  __typename?: "Query";
  user: {
    __typename?: "User";
    userId: string;
    permissions: {
      __typename?: "Permissions";
      canCreateProject: boolean;
      projectPermissions: { __typename?: "ProjectPermissions"; edit: boolean };
    };
  };
};

export type UserSettingsQueryVariables = Exact<{ [key: string]: never }>;

export type UserSettingsQuery = {
  __typename?: "Query";
  userSettings?: {
    __typename?: "UserSettings";
    dateFormat?: string | null;
    region?: string | null;
    slackMemberId?: string | null;
    slackUsername?: string | null;
    timezone?: string | null;
    githubUser?: {
      __typename?: "GithubUser";
      lastKnownAs?: string | null;
    } | null;
    notifications?: {
      __typename?: "Notifications";
      buildBreak?: string | null;
      commitQueue?: string | null;
      patchFinish?: string | null;
      patchFirstFailure?: string | null;
      spawnHostExpiration?: string | null;
      spawnHostOutcome?: string | null;
    } | null;
    useSpruceOptions?: {
      __typename?: "UseSpruceOptions";
      hasUsedMainlineCommitsBefore?: boolean | null;
      hasUsedSpruceBefore?: boolean | null;
      spruceV1?: boolean | null;
    } | null;
  } | null;
};

export type UserSubscriptionsQueryVariables = Exact<{ [key: string]: never }>;

export type UserSubscriptionsQuery = {
  __typename?: "Query";
  user: {
    __typename?: "User";
    userId: string;
    subscriptions?: Array<{
      __typename?: "GeneralSubscription";
      id: string;
      ownerType: string;
      resourceType: string;
      trigger: string;
      triggerData?: { [key: string]: any } | null;
      regexSelectors: Array<{
        __typename?: "Selector";
        data: string;
        type: string;
      }>;
      selectors: Array<{ __typename?: "Selector"; data: string; type: string }>;
      subscriber?: {
        __typename?: "SubscriberWrapper";
        type: string;
        subscriber: {
          __typename?: "Subscriber";
          emailSubscriber?: string | null;
          jiraCommentSubscriber?: string | null;
          slackSubscriber?: string | null;
        };
      } | null;
    }> | null;
  };
  userSettings?: {
    __typename?: "UserSettings";
    notifications?: {
      __typename?: "Notifications";
      buildBreakId?: string | null;
      commitQueueId?: string | null;
      patchFinishId?: string | null;
      patchFirstFailureId?: string | null;
      spawnHostExpirationId?: string | null;
      spawnHostOutcomeId?: string | null;
    } | null;
  } | null;
};

export type UserQueryVariables = Exact<{ [key: string]: never }>;

export type UserQuery = {
  __typename?: "Query";
  user: {
    __typename?: "User";
    displayName: string;
    emailAddress: string;
    userId: string;
    permissions: { __typename?: "Permissions"; canEditAdminSettings: boolean };
  };
};

export type VersionTaskDurationsQueryVariables = Exact<{
  versionId: Scalars["String"]["input"];
  taskFilterOptions: TaskFilterOptions;
}>;

export type VersionTaskDurationsQuery = {
  __typename?: "Query";
  version: {
    __typename?: "Version";
    id: string;
    tasks: {
      __typename?: "VersionTasks";
      count: number;
      data: Array<{
        __typename?: "Task";
        buildVariantDisplayName?: string | null;
        displayName: string;
        execution: number;
        id: string;
        startTime?: Date | null;
        status: string;
        timeTaken?: number | null;
        subRows?: Array<{
          __typename?: "Task";
          buildVariantDisplayName?: string | null;
          displayName: string;
          execution: number;
          id: string;
          startTime?: Date | null;
          status: string;
          timeTaken?: number | null;
        }> | null;
      }>;
    };
  };
};

export type VersionTasksQueryVariables = Exact<{
  versionId: Scalars["String"]["input"];
  taskFilterOptions: TaskFilterOptions;
}>;

export type VersionTasksQuery = {
  __typename?: "Query";
  version: {
    __typename?: "Version";
    id: string;
    isPatch: boolean;
    tasks: {
      __typename?: "VersionTasks";
      count: number;
      data: Array<{
        __typename?: "Task";
        aborted: boolean;
        blocked: boolean;
        buildVariant: string;
        buildVariantDisplayName?: string | null;
        displayName: string;
        execution: number;
        id: string;
        projectIdentifier?: string | null;
        status: string;
        baseTask?: {
          __typename?: "Task";
          execution: number;
          id: string;
          status: string;
        } | null;
        dependsOn?: Array<{ __typename?: "Dependency"; name: string }> | null;
        executionTasksFull?: Array<{
          __typename?: "Task";
          buildVariant: string;
          buildVariantDisplayName?: string | null;
          displayName: string;
          execution: number;
          id: string;
          projectIdentifier?: string | null;
          status: string;
          baseTask?: {
            __typename?: "Task";
            execution: number;
            id: string;
            status: string;
          } | null;
        }> | null;
      }>;
    };
  };
};

export type VersionQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type VersionQuery = {
  __typename?: "Query";
  version: {
    __typename?: "Version";
    activated?: boolean | null;
    author: string;
    authorEmail: string;
    createTime: Date;
    errors: Array<string>;
    finishTime?: Date | null;
    id: string;
    ignored: boolean;
    isPatch: boolean;
    message: string;
    order: number;
    project: string;
    projectIdentifier: string;
    repo: string;
    revision: string;
    startTime?: Date | null;
    status: string;
    taskCount?: number | null;
    warnings: Array<string>;
    baseVersion?: { __typename?: "Version"; id: string } | null;
    externalLinksForMetadata: Array<{
      __typename?: "ExternalLinkForMetadata";
      displayName: string;
      url: string;
    }>;
    gitTags?: Array<{
      __typename?: "GitTag";
      pusher: string;
      tag: string;
    }> | null;
    manifest?: {
      __typename?: "Manifest";
      branch: string;
      id: string;
      isBase: boolean;
      moduleOverrides?: { [key: string]: any } | null;
      modules?: any | null;
      project: string;
      revision: string;
    } | null;
    parameters: Array<{ __typename?: "Parameter"; key: string; value: string }>;
    patch?: {
      __typename?: "Patch";
      alias?: string | null;
      canEnqueueToCommitQueue: boolean;
      commitQueuePosition?: number | null;
      id: string;
      patchNumber: number;
      childPatches?: Array<{
        __typename?: "Patch";
        githash: string;
        id: string;
        projectIdentifier: string;
        status: string;
        taskCount?: number | null;
        parameters: Array<{
          __typename?: "Parameter";
          key: string;
          value: string;
        }>;
        versionFull?: {
          __typename?: "Version";
          id: string;
          status: string;
          baseVersion?: { __typename?: "Version"; id: string } | null;
        } | null;
      }> | null;
    } | null;
    previousVersion?: {
      __typename?: "Version";
      id: string;
      revision: string;
    } | null;
    projectMetadata?: {
      __typename?: "Project";
      id: string;
      owner: string;
      repo: string;
    } | null;
    versionTiming?: {
      __typename?: "VersionTiming";
      makespan?: number | null;
      timeTaken?: number | null;
    } | null;
    upstreamProject?: {
      __typename?: "UpstreamProject";
      owner: string;
      project: string;
      repo: string;
      revision: string;
      triggerID: string;
      triggerType: string;
      task?: { __typename?: "Task"; execution: number; id: string } | null;
      version?: { __typename?: "Version"; id: string } | null;
    } | null;
  };
};

export type ViewableProjectRefsQueryVariables = Exact<{ [key: string]: never }>;

export type ViewableProjectRefsQuery = {
  __typename?: "Query";
  viewableProjectRefs: Array<{
    __typename?: "GroupedProjects";
    groupDisplayName: string;
    projects: Array<{
      __typename?: "Project";
      displayName: string;
      enabled?: boolean | null;
      id: string;
      identifier: string;
      isFavorite: boolean;
      owner: string;
      repo: string;
    }>;
    repo?: { __typename?: "RepoRef"; id: string } | null;
  } | null>;
};
