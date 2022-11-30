import { MockedProvider } from "@apollo/client/testing";
import { FieldProps } from "@rjsf/core";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import { DEACTIVATE_STEPBACK_TASK } from "gql/mutations";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
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
      screen.getByDataCy("deactivate-stepback-button")
    ).toBeInTheDocument();
    expect(
      screen.queryByDataCy("deactivate-stepback-modal")
    ).not.toBeInTheDocument();
  });

  it("clicking on the button opens the modal with the confirm button disabled by default", async () => {
    const { Component } = RenderFakeToastContext(<Field />);
    render(<Component />);
    userEvent.click(screen.getByDataCy("deactivate-stepback-button"));
    await waitFor(() => {
      expect(
        screen.getByDataCy("deactivate-stepback-modal")
      ).toBeInTheDocument();
    });
    expect(screen.getByDataCy("deactivate-variant-name-input")).toHaveValue("");
    expect(screen.getByDataCy("deactivate-task-name-input")).toHaveValue("");
    const confirmButton = screen.getByRole("button", {
      name: "Confirm",
    });
    expect(confirmButton).toBeDisabled();
  });

  it("filling out all of the fields should enable the confirm button", async () => {
    const { Component, dispatchToast } = RenderFakeToastContext(<Field />);
    render(<Component />);
    userEvent.click(screen.getByDataCy("deactivate-stepback-button"));
    await waitFor(() => {
      expect(
        screen.getByDataCy("deactivate-stepback-modal")
      ).toBeInTheDocument();
    });

    userEvent.type(
      screen.getByDataCy("deactivate-variant-name-input"),
      "ubuntu1604"
    );
    userEvent.type(screen.getByDataCy("deactivate-task-name-input"), "js-test");
    const confirmButton = screen.getByRole("button", {
      name: "Confirm",
    });
    expect(confirmButton).toBeEnabled();
    userEvent.click(confirmButton);

    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledWith(
        "Stepback task was deactivated."
      );
    });
  });
});

const deactivateStepbackTaskMock = {
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
