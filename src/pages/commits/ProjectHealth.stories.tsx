import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { Commit, Commits } from "types/commits";
import { TaskStatus } from "types/task";
import { isFailedTaskStatus } from "utils/statuses";
import { CommitsWrapper } from "./CommitsWrapper";

export default {
  component: CommitsWrapper,
  title: "Pages/Commits/Project Health Page",
} satisfies CustomMeta<typeof CommitsWrapper>;

type RenderProps = {
  buildVariantCount: number;
  taskCount: number;
};

export const Default: CustomStoryObj<
  RenderProps & React.ComponentProps<typeof CommitsWrapper>
> = {
  render: (args) => <RenderCommitsWrapper {...args} />,
  args: {
    buildVariantCount: 3,
    taskCount: 2,
    isLoading: false,
    hasTaskFilter: false,
    hasFilters: false,
  },
  argTypes: {
    buildVariantCount: {
      control: {
        type: "range",
        min: 1,
        max: 50,
        step: 1,
      },
    },
    taskCount: {
      control: {
        type: "range",
        min: 1,
        max: 500,
        step: 1,
      },
    },
  },
};

const RenderCommitsWrapper = ({
  buildVariantCount,
  hasFilters,
  hasTaskFilter,
  isLoading,
  taskCount,
}) => {
  const updatedVersions = versions.map((version) =>
    populateVersion(version, buildVariantCount, taskCount, hasTaskFilter),
  );
  return (
    <div style={{ height: "500px" }}>
      <CommitsWrapper
        versions={updatedVersions}
        isLoading={isLoading}
        hasTaskFilter={hasTaskFilter}
        hasFilters={hasFilters}
      />
    </div>
  );
};

/**
 * `generateBuildVariants` generates an array of build variants
 * @param buildVariantCount - number of build variants to generate
 * @param taskCount - number of tasks to generate per build variant
 * @returns an array of build variants
 */
const generateBuildVariants = (buildVariantCount: number, taskCount: number) =>
  new Array(buildVariantCount).fill(undefined).map((_, index) => ({
    displayName: `Build Variant ${index}`,
    variant: `bv_${index.toString().padStart(3, "0")}`,
    tasks: generateTasks(taskCount),
  }));

/**
 * `generateTasks` generates an array of tasks with random statuses
 * @param count number of tasks to generate
 * @returns an array of tasks
 */
const generateTasks = (count: number) =>
  Array(count)
    .fill(undefined)
    .map((_, index) => ({
      displayName: `Task ${index}`,
      id: `task_${index}`,
      status: randomStatus(index),
      execution: 0,
      hasCedarResults: true,
    }));

/**
 * randomStatus returns a random status from the TaskStatus enum in a round robin fashion
 * @param index - the index of the task
 * @returns a random TaskStatus
 */
const randomStatus = (index: number) => {
  const TaskStatusWithoutUmbrella = Object.values(TaskStatus).filter(
    (status) => status.includes("umbrella") === false,
  );
  const taskStatuses = Object.values(TaskStatusWithoutUmbrella);
  return taskStatuses[index % taskStatuses.length];
};

const isRolledUpCommit = (commit: Commit) => commit.rolledUpVersions !== null;

const populateVersion = (
  version: Commit,
  buildVariantCount: number,
  taskCount: number,
  hasTaskFilter: boolean,
) => {
  if (isRolledUpCommit(version)) {
    return version;
  }
  const newVersion = { ...version };
  const buildVariants = generateBuildVariants(buildVariantCount, taskCount);

  // This is used to populate the barcharts on the waterfall page
  // iterate through the buildVariants and aggregate the task statuses for each buildVariant into this format [ { status: "success", count: 1 }, { status: "failed", count: 1 }
  const taskStatusCounts = buildVariants.reduce(
    (acc, buildVariant) => {
      buildVariant.tasks.forEach((task) => {
        const taskStatus = task.status;
        const taskStatusIndex = acc.findIndex(
          (status) => status.status === taskStatus,
        );
        if (taskStatusIndex === -1) {
          acc.push({ status: taskStatus, count: 1 });
        } else {
          acc[taskStatusIndex].count += 1;
        }
      });
      return acc;
    },
    [] as { status: string; count: number }[],
  );
  newVersion.version.taskStatusStats = { eta: null, counts: taskStatusCounts };

  // Calculate the buildVariantStats
  newVersion.version.buildVariantStats = hasTaskFilter
    ? []
    : buildVariants.map((buildVariant) => ({
        displayName: buildVariant.displayName,
        variant: buildVariant.variant,
        statusCounts: groupTasksByStatus(
          buildVariant.tasks.filter((t) => !isFailedTaskStatus(t.status)),
        ),
      }));

  // filter out tasks that are not failed if there is no task filter
  newVersion.version.buildVariants = buildVariants.map((buildVariant) => {
    const newBuildVariant = { ...buildVariant };
    newBuildVariant.tasks = hasTaskFilter
      ? buildVariant.tasks
      : buildVariant.tasks.filter((t) => isFailedTaskStatus(t.status));
    return newBuildVariant;
  });

  // iterate through the buildVariants and aggregate the task statuses for each buildVariant into this format [ { status: "success", count: 1 }, { status: "failed", count: 1 } ]

  return newVersion;
};

/**
 * `groupTasksByStatus` groups tasks by status and returns an array of objects with the status and count
 * @param tasks - an array of tasks
 * @returns an array of objects with the status and count
 */
const groupTasksByStatus = (tasks: { status: string }[]) => {
  const taskStatusCounts = tasks.reduce(
    (acc, task) => {
      const taskStatus = task.status;
      const taskStatusIndex = acc.findIndex(
        (status) => status.status === taskStatus,
      );
      if (taskStatusIndex === -1) {
        acc.push({ status: taskStatus, count: 1 });
      } else {
        acc[taskStatusIndex].count += 1;
      }
      return acc;
    },
    [] as { status: string; count: number }[],
  );
  return taskStatusCounts;
};

const versions: Commits = [
  {
    version: {
      id: "spruce_987bf57eb679c6361322c3961b30a10724a9b001",
      author: "Jonathan Brill",
      createTime: new Date("2021-07-16T15:53:25Z"),
      message: "EVG-14901 add ssh key to EditSpawnHostModal (#805)",
      revision: "987bf57eb679c6361322c3961b30a10724a9b001",
      order: 929,
      projectIdentifier: "spruce",
      taskStatusStats: {
        eta: null,
        counts: [],
      },
      buildVariants: [],
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
      taskStatusStats: {
        eta: null,
        counts: [],
      },
      buildVariants: [],
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
        revision: "a77bd39ccf515b63327dc2355a8444955043c66a",
        ignored: false,
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
      taskStatusStats: {
        eta: null,
        counts: [],
      },
      buildVariants: [],
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
      taskStatusStats: {
        eta: null,
        counts: [],
      },
      buildVariants: [],
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
      taskStatusStats: {
        eta: null,
        counts: [],
      },
      buildVariants: [],
      buildVariantStats: [],
    },
    rolledUpVersions: null,
  },
];
