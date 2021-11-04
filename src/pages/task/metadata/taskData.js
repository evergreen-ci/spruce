export const taskQuery = {
  taskFiles: { __typename: "TaskFiles", fileCount: 38 },
  task: {
    id: "someTaskId",
    execution: 0,
    isPerfPluginEnabled: false,
    __typename: "Task",
    activatedBy: "",
    aborted: false,
    baseTaskMetadata: {
      __typename: "BaseTaskMetadata",
      baseTaskDuration: 1228078,
      baseTaskId:
        "spruce_ubuntu1604_e2e_test_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41",
    },
    createTime: new Date("2020-08-26T19:20:41Z"),
    estimatedStart: 1000,
    displayName: "e2e_test",
    hostId: "i-0e0e62799806e037d",
    hostLink: "https://evergreen.mongodb.com/host/i-0e0e62799806e037d",
    versionMetadata: {
      __typename: "PatchMetadata",
      author: "mohamed.khelif",
      id:
        "spruce_ubuntu1604_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41",
      isPatch: false,
      revision: "123j9123u9123",
      project: "spruce",
    },
    patchNumber: 417,
    canOverrideDependencies: false,
    dependsOn: [],
    logs: {
      __typename: "TaskLogLinks",
      allLogLink:
        "https://evergreen.mongodb.com/task_log_raw/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55/0?type=ALL",
      agentLogLink:
        "https://evergreen.mongodb.com/task_log_raw/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55/0?type=E",
      systemLogLink:
        "https://evergreen.mongodb.com/task_log_raw/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55/0?type=S",
      taskLogLink:
        "https://evergreen.mongodb.com/task_log_raw/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55/0?type=T",
      eventLogLink:
        "https://evergreen.mongodb.com/event_log/task/spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55",
    },
    status: "pending",
    version: "5f4889313627e0544660c800",
    revision: "e0ece5ad52ad01630bdf29f55b9382a26d6256b3",
    failedTestCount: 0,
    spawnHostLink:
      "https://evergreen.mongodb.com/spawn?distro_id=ubuntu1604-small&task_id=spruce_ubuntu1604_e2e_test_patch_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_5f4889313627e0544660c800_20_08_28_04_33_55",
    priority: 0,
    canRestart: true,
    canAbort: false,
    canSchedule: false,
    canUnschedule: false,
    canSetPriority: false,
    canModifyAnnotation: false,
    ami: "ami-0c83bb0a9f48c15bf",
    distroId: "ubuntu1604-small",
    latestExecution: 0,
    blocked: false,
    totalTestCount: 0,
    buildVariant: "ubuntu1604",
    minQueuePosition: 0,
    projectId: "spruce",
    expectedDuration: 123,
  },
};
