import { MockedProvider } from "@apollo/client/testing";
import { FieldProps } from "@rjsf/core";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  DeactivateStepbackTaskMutation,
  DeactivateStepbackTaskMutationVariables,
} from "gql/generated/types";
import { DEACTIVATE_STEPBACK_TASK } from "gql/mutations";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import { ApolloMock } from "types/gql";
import { DeactivateStepbackTaskField } from ".";

const Field = () => (
  <MockedProvider mocks={[deactivateStepbackTaskMock]}>
    <DeactivateStepbackTaskField
      {...({} as unknown as FieldProps)}
      uiSchema={{
        options: {
          projectId: "evergreen",
        },
      }}
    />
  </MockedProvider>
);

describe("deactivateStepbackTask", () => {
  it("renders the button properly", () => {
    const { Component } = RenderFakeToastContext(<Field />);
    render(<Component />);
    expect(
      screen.getByDataCy("deactivate-stepback-button"),
    ).toBeInTheDocument();
    expect(
      screen.queryByDataCy("deactivate-stepback-modal"),
    ).not.toBeInTheDocument();
  });

  it("clicking on the button opens the modal with the confirm button disabled by default", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(<Field />);
    render(<Component />);
    await user.click(screen.getByDataCy("deactivate-stepback-button"));
    expect(screen.getByDataCy("deactivate-stepback-modal")).toBeInTheDocument();
    expect(screen.getByDataCy("deactivate-variant-name-input")).toHaveValue("");
    expect(screen.getByDataCy("deactivate-task-name-input")).toHaveValue("");
    const confirmButton = screen.getByRole("button", {
      name: "Confirm",
    });
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");
  });

  it("filling out all of the fields should enable the confirm button", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(<Field />);
    render(<Component />);
    await user.click(screen.getByDataCy("deactivate-stepback-button"));
    expect(screen.getByDataCy("deactivate-stepback-modal")).toBeInTheDocument();

    await user.type(
      screen.getByDataCy("deactivate-variant-name-input"),
      "ubuntu1604",
    );
    await user.type(
      screen.getByDataCy("deactivate-task-name-input"),
      "js-test",
    );
    const confirmButton = screen.getByRole("button", {
      name: "Confirm",
    });
    expect(confirmButton).toBeEnabled();
    await user.click(confirmButton);
    expect(dispatchToast.success).toHaveBeenCalledWith(
      "Stepback task was deactivated.",
    );
  });
});

const deactivateStepbackTaskMock: ApolloMock<
  DeactivateStepbackTaskMutation,
  DeactivateStepbackTaskMutationVariables
> = {
  request: {
    query: DEACTIVATE_STEPBACK_TASK,
    variables: {
      projectId: "evergreen",
      buildVariantName: "ubuntu1604",
      taskName: "js-test",
    },
  },
  result: {
    data: {
      deactivateStepbackTask: true,
    },
  },
};
