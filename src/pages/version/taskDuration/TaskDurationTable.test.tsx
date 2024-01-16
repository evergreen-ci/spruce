import { MockedProvider } from "@apollo/client/testing";
import { VersionTaskDurationsQuery } from "gql/generated/types";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  within,
} from "test_utils";
import { TaskDurationTable } from "./TaskDurationTable";

describe("taskDurationTable", () => {
  it("renders all rows", () => {
    render(
      <MockedProvider>
        <TaskDurationTable tasks={tasks} loading={false} numLoadingRows={10} />
      </MockedProvider>,
    );
    expect(screen.queryAllByDataCy("leafygreen-table-row")).toHaveLength(2);
  });

  it("opens nested row on click", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider>
        <TaskDurationTable tasks={tasks} loading={false} numLoadingRows={10} />
      </MockedProvider>,
    );
    expect(
      screen.queryByText("check_codegen_execution_task"),
    ).not.toBeVisible();
    const expandRowButton = within(
      screen.queryAllByDataCy("leafygreen-table-row")[0],
    ).queryByRole("button");
    await user.click(expandRowButton);
    expect(screen.queryByText("check_codegen_execution_task")).toBeVisible();
  });
});

const tasks: VersionTaskDurationsQuery["version"]["tasks"]["data"] = [
  {
    id: "spruce_ubuntu1604_check_codegen_patch_345da020487255d1b9fb87bed4ceb98397a0c5a5_624af28fa4cf4714c7a6c19a_22_04_04_13_28_48",
    execution: 0,
    status: "success",
    displayName: "check_codegen",
    buildVariantDisplayName: "Ubuntu 16.04",
    timeTaken: 6000,
    subRows: [
      {
        id: "spruce_ubuntu1604_check_codegen_patch_345da020487255d1b9fb87bed4ceb98397a0c5a5_624af28fa4cf4714c7a6c19a_22_04_04_13_28_48",
        execution: 0,
        status: "success",
        displayName: "check_codegen_execution_task",
        buildVariantDisplayName: "Ubuntu 16.04",
        timeTaken: 4000,
      },
    ],
    __typename: "Task",
  },
  {
    id: "spruce_ubuntu1604_compile_patch_345da020487255d1b9fb87bed4ceb98397a0c5a5_624af28fa4cf4714c7a6c19a_22_04_04_13_28_48",
    execution: 0,
    status: "success",
    displayName: "compile",
    buildVariantDisplayName: "Ubuntu 16.04",
    subRows: null,
    timeTaken: 10000,
    __typename: "Task",
  },
];
