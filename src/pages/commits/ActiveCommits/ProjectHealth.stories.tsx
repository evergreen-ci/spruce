import { withKnobs, boolean, number } from "@storybook/addon-knobs";
import { MemoryRouter } from "react-router-dom";
import { CommitVersion, Commit } from "types/commits";
import { TaskStatus } from "types/task";
import { CommitsWrapper } from "../CommitsWrapper";

export default {
  title: "Project Health Page",
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
    withKnobs,
  ],
  component: CommitsWrapper,
};

export const ActualWaterfallPage = () => {
  const buildVariantCount = number("buildVariantCount", 3, {
    min: 1,
  });
  const taskCount = number("taskCount", 1);
  const updatedVersions = versions.map((version) =>
    formatVersion(version, buildVariantCount, taskCount)
  );
  return (
    <CommitsWrapper
      isOpenChartToggle
      onToggleChartViewOptionsAccordion={() => {}}
      versions={updatedVersions}
      isLoading={boolean("isLoading", false)}
      error={null}
      hasTaskFilter={boolean("hasTaskFilter", false)}
      hasFilters={boolean("hasFilters", false)}
    />
  );
};

const buildVariantUpdateLength = (
  buildVariant: CommitVersion["buildVariants"],
  buildVariantCount: number
) => {
  if (buildVariant.length === buildVariantCount) {
    return buildVariant;
  }
  if (buildVariant.length < buildVariantCount) {
    const newBuildVariant = buildVariant.concat(
      buildVariant.slice(buildVariant.length - buildVariantCount)
    );
    return newBuildVariant;
  }
  if (buildVariant.length > buildVariantCount) {
    const newBuildVariant = buildVariant.slice(0, buildVariantCount);
    return newBuildVariant;
  }
};

const taskUpdateLength = (
  tasks: CommitVersion["buildVariants"][0]["tasks"],
  taskCount: number
) => {
  if (tasks.length === taskCount) {
    return tasks;
  }
  if (tasks.length < taskCount) {
    const newTasks = tasks.concat(tasks.slice(tasks.length - taskCount));
    return newTasks;
  }
  if (tasks.length > taskCount) {
    const newTasks = tasks.slice(0, taskCount);
    return newTasks;
  }
};

const isRolledUpCommit = (commit: Commit) => commit.rolledUpVersions !== null;

const formatVersion = (
  version: Commit,
  buildVariantCount: number,
  taskCount: number
) => {
  if (isRolledUpCommit(version)) {
    return version;
  }
  const newVersion = { ...version };
  newVersion.version.buildVariants = buildVariantUpdateLength(
    version.version.buildVariants,
    buildVariantCount
  );
  newVersion.version.buildVariants = newVersion.version.buildVariants.map(
    (buildVariant) => {
      const newBuildVariant = { ...buildVariant };
      newBuildVariant.tasks = taskUpdateLength(buildVariant.tasks, taskCount);
      return newBuildVariant;
    }
  );
  return newVersion;
};
const versions = [
  {
    version: {
      id: "spruce_987bf57eb679c6361322c3961b30a10724a9b001",
      author: "Jonathan Brill",
      createTime: new Date("2021-07-16T15:53:25Z"),
      message: "EVG-14901 add ssh key to EditSpawnHostModal (#805)",
      revision: "987bf57eb679c6361322c3961b30a10724a9b001",
      order: 929,
      projectIdentifier: "spruce",
      taskStatusCounts: [
        { status: "system-timed-out", count: 4 },
        { status: "system-unresponsive", count: 3 },
        { status: "setup-failed", count: 5 },
        { status: "unscheduled", count: 2 },
      ],
      buildVariants: [
        {
          displayName: "01. Code Health [code_health]",
          variant: "code_health",
          tasks: [
            {
              status: TaskStatus.Pending,
              id: "code_health",
              execution: 0,
              displayName: "Code Health",
            },
          ],
        },
        {
          displayName: "02. Packaging (RPM - RHEL7) [package_rpm]",
          variant: "package_rpm",
          tasks: [
            {
              status: TaskStatus.WillRun,
              id: "code_health",
              execution: 0,
              displayName: "Code Health",
            },
          ],
        },
        {
          displayName: "03b. JavaScript Tests [js]",
          variant: "js",
          tasks: [
            {
              status: TaskStatus.WillRun,
              id: "js",
              execution: 0,
              displayName: "JavaScript Test",
            },
          ],
        },
      ],
      buildVariantStats: [],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "spruce_v2.11.1_60eda8722a60ed09bb78a2ff",
      author: "Mohamed Khelif",
      createTime: new Date("2021-07-13T14:51:30Z"),
      message: "Triggered From Git Tag 'v2.11.1': v2.11.1",
      revision: "a77bd39ccf515b63327dc2355a8444955043c66a",
      order: 928,
      projectIdentifier: "spruce",
      taskStatusCounts: [
        { status: "system-failed", count: 6 },
        { status: "pending", count: 2 },
        { status: "known-issue", count: 4 },
        { status: "unscheduled", count: 12 },
        { status: "task-timed-out", count: 2 },
      ],
      buildVariants: [
        {
          displayName: "01. Code Health [code_health]",
          variant: "code_health",
          tasks: [
            {
              status: TaskStatus.Pending,
              id: "code_health",
              execution: 0,
              displayName: "Code Health",
            },
          ],
        },
        {
          displayName: "02. Packaging (RPM - RHEL7) [package_rpm]",
          variant: "package_rpm",
          tasks: [
            {
              status: TaskStatus.Pending,
              id: "code_health",
              execution: 0,
              displayName: "Code Health",
            },
          ],
        },
        {
          displayName: "03a. Unit Tests Java [unit_java]",
          variant: "unit_java",
          tasks: [
            {
              status: TaskStatus.Failed,
              id: "unit_java",
              execution: 0,
              displayName: "Unit Tests",
            },
          ],
        },
      ],
      buildVariantStats: [],
    },
    rolledUpVersions: null,
  },
  {
    version: null,
    rolledUpVersions: [
      {
        id: "spruce_a77bd39ccf515b63327dc2355a8444955043c66a",
        createTime: new Date("2021-07-13T14:51:30Z"),
        author: "Mohamed Khelif",
        order: 927,
        message: "v2.11.1",
        projectIdentifier: "spruce",
        revision: "a77bd39ccf515b63327dc2355a8444955043c66a",
      },
    ],
  },
  {
    version: {
      id: "spruce_9c1d1ebc85829d69dde7684fbcce86dd21e5a9ad",
      author: "Mohamed Khelif",
      createTime: new Date("2021-07-13T14:51:30Z"),
      message:
        "EVG-14799 Correctly visit configure page when no tab indicated (#810)",
      revision: "9c1d1ebc85829d69dde7684fbcce86dd21e5a9ad",
      order: 926,
      projectIdentifier: "spruce",
      taskStatusCounts: [
        { status: "setup-failed", count: 4 },
        { status: "inactive", count: 3 },
        { status: "pending", count: 5 },
        { status: "unstarted", count: 2 },
      ],
      buildVariants: [
        {
          displayName: "01. Code Health [code_health]",
          variant: "code_health",
          tasks: [
            {
              status: TaskStatus.WillRun,
              id: "code_health",
              execution: 0,
              displayName: "Code Health",
            },
          ],
        },
        {
          displayName: "02. Packaging (RPM - RHEL7) [package_rpm]",
          variant: "package_rpm",
          tasks: [
            {
              status: TaskStatus.Pending,
              id: "code_health",
              execution: 0,
              displayName: "Code Health",
            },
          ],
        },
      ],
      buildVariantStats: [],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "spruce_f7f7f1a3abdb9897dfc02b7a1de9821651b0916e",
      author: "Sophie Stadler",
      createTime: new Date("2021-07-13T14:51:30Z"),
      message: "Remove navigation announcement toast (#808)",
      revision: "f7f7f1a3abdb9897dfc02b7a1de9821651b0916e",
      projectIdentifier: "spruce",
      order: 925,
      taskStatusCounts: [
        { status: "blocked", count: 4 },
        { status: "aborted", count: 3 },
        { status: "undispatched", count: 5 },
        { status: "test-timed-out", count: 2 },
      ],
      buildVariants: [
        {
          displayName: "01. Code Health [code_health]",
          variant: "code_health",
          tasks: [
            {
              status: TaskStatus.WillRun,
              id: "code_health",
              execution: 0,
              displayName: "Code Health",
            },
          ],
        },
        {
          displayName: "02. Packaging (RPM - RHEL7) [package_rpm]",
          variant: "package_rpm",
          tasks: [
            {
              status: TaskStatus.Succeeded,
              id: "code_health",
              execution: 0,
              displayName: "Code Health",
            },
          ],
        },
      ],
      buildVariantStats: [],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "spruce_v2.11.0_60ec461532f4172d48288274",
      author: "Chaya Malik",
      createTime: new Date("2021-07-13T14:51:30Z"),
      message: "Triggered From Git Tag 'v2.11.0': v2.11.0",
      revision: "211b3a06e2948a5afa5dbd61c2322037c300629b",
      projectIdentifier: "spruce",
      order: 924,
      taskStatusCounts: [
        { status: "success", count: 6 },
        { status: "failed", count: 2 },
        { status: "dispatched", count: 4 },
        { status: "started", count: 5 },
        { status: "will-run", count: 2 },
      ],
      buildVariants: [
        {
          displayName: "01. Code Health [code_health]",
          variant: "code_health",
          tasks: [
            {
              status: TaskStatus.Failed,
              id: "code_health",
              execution: 0,
              displayName: "Code Health",
            },
          ],
        },
        {
          displayName: "02. Packaging (RPM - RHEL7) [package_rpm]",
          variant: "package_rpm",
          tasks: [
            {
              status: TaskStatus.Failed,
              id: "code_health",
              execution: 0,
              displayName: "Code Health",
            },
          ],
        },
        {
          displayName: "03a. Unit Tests Java [unit_java]",
          variant: "unit_java",
          tasks: [
            {
              status: TaskStatus.Failed,
              id: "unit_java",
              execution: 0,
              displayName: "Unit Tests",
            },
          ],
        },
      ],
      buildVariantStats: [],
    },
    rolledUpVersions: null,
  },
];
